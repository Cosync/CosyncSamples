//
//  AssetView.swift
//  CosyncStorage
//
//  Created by Tola Voeung on 10/3/22.
//

import SwiftUI
import PhotosUI
import AVKit
import CosyncStorageSwift
import AssetPicker

struct UploadView: View {
    @State private var selectedImage:UIImage?
    @State private var selectedVideoUrl:URL?
    @State private var showImagePicker = false
    @State private var pickerResult: [String] = []
    @StateObject private var cosyncHelper = CosyncStorageSwift.shared
    
    @State private var selectedType = "image"
    @State private var expiredHours = "0"
    
    var body: some View {
        VStack{
            
            Button(action: {
                self.showImagePicker.toggle()
            }) {
                Text("Pick")
                    .padding(.horizontal)
                Image(systemName: "tray.and.arrow.down.fill")
            }
            .padding()
            HStack{
                Text("Expired Hour").padding()
                TextField("Expired Hour",text:$expiredHours)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.default)
                   
            }
            
            
            if selectedType == "video" && selectedVideoUrl != nil {
                let player = AVPlayer(url: selectedVideoUrl!)
                VideoPlayer(player: player)
                .padding()
            }
            
            if selectedType == "image" && self.selectedImage != nil {
                Image(uiImage: self.selectedImage!)
                .resizable().scaledToFit()
            }
           
            
            if cosyncHelper.uploadStart {
                ProgressView("uploading " + cosyncHelper.uploadTask, value: cosyncHelper.uploadAmount, total: 100)
                    .shadow(color: Color(red: 0, green: 0, blue: 0.6), radius: 4.0, x: 1.0, y: 2.0)
            }
            
            List{
                ForEach(cosyncHelper.uploadedAssetList, id: \.self){ url in
                    
                    AsyncImage(url: URL(string: url)) { image in
                        image.resizable()
                    } placeholder: {
                        Color.gray
                    }
                    .frame(width: 128, height: 128)
                    .clipShape(RoundedRectangle(cornerRadius: 25))
                    
                }
            }
            
            if cosyncHelper.uploadStart == false {
                Button(action: {
                     
                    CosyncStorageSwift.shared.reset()
                    CosyncStorageSwift.shared.createAssetUpload(assetIdList: pickerResult, expiredHours: Double(expiredHours)! ,path: "asset")
                }) {
                    Text("upload")
                        .padding(.horizontal)
                    Image(systemName: "location.fill")
                }
                .padding()
            }
            
        }.sheet(isPresented: $showImagePicker) {

            AssetPicker(pickerResult: $pickerResult,
                        selectedImage: $selectedImage,
                        selectedVideoUrl: $selectedVideoUrl,
                        selectedType: $selectedType,
                        isPresented: $showImagePicker)
            }
        .onAppear{
            CosyncStorageSwift.shared.reset()
        }
        
       
    }
        
     
}


struct UploadView_Previews: PreviewProvider {
    static var previews: some View {
        UploadView()
    }
}
