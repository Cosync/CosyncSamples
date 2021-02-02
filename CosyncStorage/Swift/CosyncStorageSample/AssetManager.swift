//
//  AssetManager.swift
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

import Foundation
import PhotosUI

class AssetManager {
    
    static let shared = AssetManager()
    
    var sessionId: String? {
        return UIDevice.current.identifierForVendor?.uuidString
    }

    func createAssetUploads(_ assetIdList: [String], path: String) {
        
        if (assetIdList.count > 0) {
            if let currentUserId = RealmManager.shared.currentUserId,
               let sessionId = self.sessionId {
                
                let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: assetIdList, options: nil)
                
                fetchResult.enumerateObjects { object, index, stop in
                    let phAsset = object as PHAsset
                    let resources = PHAssetResource.assetResources(for: phAsset)
                    let xRes = phAsset.pixelWidth
                    let yRes = phAsset.pixelHeight
                    
                    if let fileName = resources.first?.originalFilename {
                        
                        let options = PHContentEditingInputRequestOptions()
                        options.isNetworkAccessAllowed = true
                        phAsset.requestContentEditingInput(with: options) { (contentEditingInput, info) in
                            
                            if let uniformTypeIdentifier = contentEditingInput?.uniformTypeIdentifier {
                                
                                var contentType : String?
                                if  uniformTypeIdentifier == "public.jpeg" ||
                                    uniformTypeIdentifier == "public.jpeg-2000" ||
                                    uniformTypeIdentifier == "public.heic"{
                                    contentType = "image/jpeg"
                                }
                                else if uniformTypeIdentifier == "public.png" {
                                    contentType = "image/png"
                                }
                                else if uniformTypeIdentifier == "com.apple.quicktime-movie" {
                                    contentType = "video/quicktime"
                                }
                                
                                let duration = Int(phAsset.duration)
                                


                                
                                if let contentType = contentType {
                                    
                                    let imageManager = PHImageManager.default()
                                    
                                    let options = PHImageRequestOptions()
                                    options.resizeMode = PHImageRequestOptionsResizeMode.exact
                                    options.isSynchronous = true;
                                    
                                    imageManager.requestImage(for: phAsset,
                                                              targetSize: CGSize(width: xRes, height: yRes),
                                                              contentMode: .aspectFit,
                                                              options: options,
                                                              resultHandler: { image, _ in
                                        
                                        if  let image = image {
                                            
                                            var size = 0
                                            if contentType == "image/jpeg" {
                                                let data = image.jpegData(compressionQuality: 1.0)
                                                size = Int(data?.count ?? 0)
                                            }
                                            else if contentType == "image/png" {
                                                let data = image.pngData()
                                                size = Int(data?.count ?? 0)
                                            }
                                            else if contentType.hasPrefix("video") {
                                                if let unsignedInt64 = resources.first?.value(forKey: "fileSize") as? CLong {
                                                    let sizeOnDisk = Int64(bitPattern: UInt64(unsignedInt64))
                                                    size = Int(sizeOnDisk)
                                                }
                                            }
                                            
                                            let color = image.averageColor()
                                            
                                            let cosyncAssetUpload = CosyncAssetUpload(partition: "user_id=\(currentUserId)",
                                                                                      uid: currentUserId,
                                                                                      sessionId: sessionId,
                                                                                      extra: phAsset.localIdentifier,
                                                                                      assetPartition: "public",
                                                                                      filePath: path + "/" + fileName,
                                                                                      contentType: contentType,
                                                                                      size: size,
                                                                                      duration: duration,
                                                                                      color: color,
                                                                                      xRes: xRes,
                                                                                      yRes: yRes)
                                            if let userRealm = RealmManager.shared.userRealm {
                                                try! userRealm.write {
                                                    userRealm.add(cosyncAssetUpload)
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

