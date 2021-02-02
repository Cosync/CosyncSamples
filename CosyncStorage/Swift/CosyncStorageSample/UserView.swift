//
//  UserView.swift
//  CosyncStorageSample
//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//
//  For questions about this license, you may write to mailto:info@cosync.io
//
//  Created by Richard Krueger on 12/20/20.
//  Copyright (C) 2020 Cosync. All rights reserved.
//

import SwiftUI
import PhotosUI
import AVKit


struct PhotoPicker: UIViewControllerRepresentable {
    let configuration: PHPickerConfiguration
    @Binding var pickerResult: [UIImage]
    @Binding var isPresented: Bool
    func makeUIViewController(context: Context) -> PHPickerViewController {
        let controller = PHPickerViewController(configuration: configuration)
        controller.delegate = context.coordinator
        return controller
    }
    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) { }
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    /// PHPickerViewControllerDelegate => Coordinator
    class Coordinator: PHPickerViewControllerDelegate {
        
        private let parent: PhotoPicker
        
        init(_ parent: PhotoPicker) {
            self.parent = parent
        }
        
        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            
            var assetIdList = [String]()
            for asset in results {
                if let assetId = asset.assetIdentifier {
                    assetIdList.append(assetId)
                }
            }
            AssetManager.shared.createAssetUploads(assetIdList, path: "picker")
                
            // dissmiss the picker
            parent.isPresented = false
        }
    }
}

struct UserView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var assetState: AssetState

    @State private var isPresented: Bool = false
    @State var pickerResult: [UIImage] = []
    var config: PHPickerConfiguration  {
       var config = PHPickerConfiguration(photoLibrary: PHPhotoLibrary.shared())
        config.filter = .any(of: [.images, .videos])
        config.selectionLimit = 0 //0 => any, set 1-2-3 for hard limit
        return config
    }
    @State var uploadValue = 0.0
    @State var showProgress = false
    @State var uploadFileName = ""
    
    var body: some View {
        
        NavigationView {
            
            GeometryReader { geometry in
                ScrollView {
                    
                    LazyVStack {

                        if self.showProgress {
                            ProgressView(uploadFileName, value: uploadValue, total: 100)
                        }

                        if let assets = self.assetState.assets {
                            ForEach(assets, id: \._id) { asset in
                                
                                if asset.contentType.hasPrefix("video") {
                                    if let url = asset.url {
                                        let width : CGFloat = geometry.size.width
                                        let height : CGFloat = width * CGFloat(asset.yRes) / CGFloat(asset.xRes) - 24
                                        
                                        VideoPlayer(player: AVPlayer(url:  URL(string: url)!))
                                        .id(asset._id)
                                        .padding()
                                        .frame(width: width, height: height, alignment: .center)

                                    }
                                    else {
                                        Image.init(uiImage: UIImage(systemName: "bookmark")!)
                                            .padding()
                                    }

                                }
                                else {
                                    if let urlSmall = asset.urlSmall {
                                        NetworkImage(imageURL: URL(string: urlSmall)!,
                                                placeholderImage: UIImage(systemName: "bookmark")!)
                                            .padding()
                                            .id(asset._id)
                                    } else {
                                        Image.init(uiImage: UIImage(systemName: "bookmark")!)
                                            .padding()
                                    }
                                }

                                
                            }
                        }
                    }
                }
            }
            // Use .inline for the smaller nav bar
            .navigationBarTitle(Text("User Assets"), displayMode: .inline)
            .navigationBarItems(
                // Button on the leading side
                leading:
                Button(action: {
                    RealmManager.shared.logout( onCompletion: { (error) in
                            DispatchQueue.main.sync {
                                self.appState.target = .login
                                self.assetState.cleanup()
                            }
                        }
                    )
                }) {
                    Text("Logout")
                }.accentColor(.blue),
                
                trailing:
                Button(action: {
                    isPresented.toggle()
                }) {
                    Image(systemName: "icloud.and.arrow.up")
                }
                .sheet(isPresented: $isPresented) {
                                    PhotoPicker(configuration: self.config,
                                                pickerResult: $pickerResult,
                                                isPresented: $isPresented)
                                    }
                .accentColor(.blue)
            )
            .edgesIgnoringSafeArea(.bottom)
        }
        .onAppear {
            UploadManager.shared.setUploadProgress(uploadProgressStart: self.uploadProgressStart, uploadProgress: self.uploadProgress, uploadProgressEnd: self.uploadProgressEnd)
        }
        .onDisappear {
            UploadManager.shared.clearUploadProgress()
        }
        
    }
    
    func uploadProgressStart(fileName: String) -> Void {
        self.uploadFileName = fileName
        self.showProgress = true
    }
    
    func uploadProgress(fileName: String, value: Float, total: Float) -> Void {
        self.uploadValue = Double(value) * 100.0
    }
    
    func uploadProgressEnd(fileName: String) -> Void {
        self.showProgress = false
    }
}

struct UserView_Previews: PreviewProvider {
    static var previews: some View {
        UserView()
    }
}
