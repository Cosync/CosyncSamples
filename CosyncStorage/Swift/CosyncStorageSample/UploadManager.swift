//
//  UploadManager.swift
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
import RealmSwift
import PhotosUI

enum UploadPhase {
    case uploadImageUrl
    case uploadImageUrlSmall
    case uploadImageUrlMedium
    case uploadImageUrlLarge
    case uploadVideoUrl
    case uploadVideoUrlPreview
    case uploadVideoUrlSmall
    case uploadVideoUrlMedium
    case uploadVideoUrlLarge
}

class UploadManager: NSObject, URLSessionTaskDelegate {
    
    static let shared = UploadManager()
    var userRealm: Realm?
    
    private var uploadProgressStart: ((String) -> Void)?
    private var uploadProgress: ((String, Float, Float) -> Void)?
    private var uploadProgressEnd: ((String) -> Void)?
    private let uploadProgressQueue: OperationQueue = {
        var queue = OperationQueue()
        queue.name = "uploadQueue"
        queue.qualityOfService = .background
        queue.maxConcurrentOperationCount = 1
        return queue
    }()

    private var notificationToken: NotificationToken! = nil
    private let opQueue = OperationQueue()
    private var uploadPhase: UploadPhase = .uploadImageUrl
    private var uploadThread: Thread?
    
    func setUploadProgress(uploadProgressStart: @escaping (String) -> Void,
                           uploadProgress: @escaping (String, Float, Float) -> Void,
                           uploadProgressEnd: @escaping (String) -> Void) -> Void {
        
        self.uploadProgressQueue.addOperation {
            self.uploadProgressStart = uploadProgressStart
            self.uploadProgress = uploadProgress
            self.uploadProgressEnd = uploadProgressEnd
            
        }
    }
    
    func clearUploadProgress() -> Void {
        self.uploadProgressQueue.addOperation {
            self.uploadProgressStart = nil
            self.uploadProgress = nil
            self.uploadProgressEnd = nil
        }
    }
    
    @objc func uploadThreadEntryPoint(uid: String) {
        autoreleasepool {
            Thread.current.name = "CosyncUploadThread_\(uid)"
            let runLoop = RunLoop.current
            runLoop.add(NSMachPort(), forMode: RunLoop.Mode.default)
            runLoop.run()
        }
    }
    
    @objc func uploadThreadExit() {
        Thread.exit()
    }
    
    @objc func setupBackground() -> Void {
        if  let user = RealmManager.shared.app.currentUser,
            let uid = RealmManager.shared.currentUserId,
            let sessionId = AssetManager.shared.sessionId {
            
            self.userRealm = try! Realm(configuration: user.configuration(partitionValue: "user_id=\(uid)"))
            
            if let realm = self.userRealm {
                let results = realm.objects(CosyncAssetUpload.self)
                    .filter("uid == '\(uid)' && sessionId=='\(sessionId)' && status=='initialized'")
                
                self.notificationToken = results.observe { [self] (changes: RealmCollectionChange) in
            
                    switch changes {
                    case .initial:
                        for assetUpload in results {
                            self.uploadAsset(assetUpload: assetUpload)
                        }
                        
                    case .update( let results, _, _, _):
                        for assetUpload in results {
                            self.uploadAsset(assetUpload: assetUpload)
                        }
                        
                    case .error(let error):
                        // An error occurred while opening the Realm file on the background worker thread
                        fatalError("\(error)")
                    }
                }
            }
        }
    }
    
    func setup() -> Void {
        
        if let uid = RealmManager.shared.currentUserId {
            if self.uploadThread==nil {
                self.uploadThread = Thread(target: self, selector: #selector(uploadThreadEntryPoint(uid:)), object: uid)
                self.uploadThread!.start()
            }
            
            if let uploadThread = self.uploadThread {
                perform(#selector(setupBackground), on: uploadThread, with: nil, waitUntilDone: false, modes: [RunLoop.Mode.common.rawValue])
            }
        }
    }
    
    func cleanup() -> Void {
        self.notificationToken.invalidate()
        self.notificationToken = nil
        self.userRealm = nil
        if let uploadThread = self.uploadThread {
            perform(#selector(uploadThreadExit), on: uploadThread, with: nil, waitUntilDone: false, modes: [RunLoop.Mode.common.rawValue])
            self.uploadThread = nil
        }
    }
    
    func uploadAsset(assetUpload: CosyncAssetUpload) -> Void {
        if assetUpload.status == "initialized" {
            
            let assetId = assetUpload.extra
            
            if let contentType = assetUpload.contentType, assetId.count > 0  {
                
                let identifiers = [assetId]
                let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: identifiers, options: nil)
                if let phAsset = fetchResult.firstObject {
                    
                    let resources = PHAssetResource.assetResources(for: phAsset)
                    if let fileName = resources.first?.originalFilename {
                        
                        let imageManager = PHImageManager.default()
                        
                        let options = PHImageRequestOptions()
                        options.resizeMode = PHImageRequestOptionsResizeMode.exact
                        options.isSynchronous = true;
                        
                        imageManager.requestImage(for: phAsset, targetSize: CGSize(width: phAsset.pixelWidth, height: phAsset.pixelHeight), contentMode: .aspectFit, options: options, resultHandler: { image, _ in
                            
                            if  let image = image {
  
                                if contentType.hasPrefix("video") {
                                    if  let writeUrl = assetUpload.writeUrl,
                                        let writeUrlVideoPreview = assetUpload.writeUrlVideoPreview,
                                        let writeUrlSmall = assetUpload.writeUrlSmall,
                                        let writeUrlMedium = assetUpload.writeUrlMedium,
                                        let writeUrlLarge = assetUpload.writeUrlLarge {
                                        
                                        let semaphore = DispatchSemaphore(value: 0)
                                        var videoUrl: URL?
                                        imageManager.requestAVAsset(forVideo: phAsset,
                                                                    options: nil) { (asset, audioMix, info) in
                                            if let asset = asset as? AVURLAsset {
                                                videoUrl = asset.url
                                            }
                                            semaphore.signal()
                                        }
                                        _ = semaphore.wait(timeout: .distantFuture)
                                        
                                        if let videoUrl = videoUrl {
                                                
                                            // Start Upload Progress
                                            self.uploadProgressStartFunc(fileName: fileName)
                                            
                                            self.uploadPhase = .uploadVideoUrl
                                            
                                            if self.uploadVideoToURL(videoUrl: videoUrl, fileName: fileName, writeUrl: writeUrl, contentType: contentType) {
                                                
                                                self.uploadPhase = .uploadVideoUrlPreview
                                                
                                                if self.uploadImageToURL(image: image, fileName: fileName, writeUrl: writeUrlVideoPreview, contentType: "image/jpeg") {
                                                    
                                                    if let imageSmall = image.imageCut(cutSize: 300) {
                                                        
                                                        self.uploadPhase = .uploadVideoUrlSmall
                                                        if self.uploadImageToURL(image: imageSmall, fileName: fileName, writeUrl: writeUrlSmall, contentType: "image/jpeg") {
                                                            
                                                            if let imageMedium = image.imageCut(cutSize: 600) {
                                                                
                                                                self.uploadPhase = .uploadVideoUrlMedium
                                                                if self.uploadImageToURL(image: imageMedium, fileName: fileName, writeUrl: writeUrlMedium, contentType: "image/jpeg") {
                                                                
                                                                    if let imageLarge = image.imageCut(cutSize: 900) {
                                                                        
                                                                        self.uploadPhase = .uploadVideoUrlLarge
                                                                        if self.uploadImageToURL(image: imageLarge, fileName: fileName, writeUrl: writeUrlLarge, contentType: "image/jpeg") {
                                                                        
                                                                            self.uploadSuccess(assetUpload)
                                                                            
                                                                        } else {
                                                                            self.uploadError(assetUpload)
                                                                        }
                                                                    } else {
                                                                        self.uploadError(assetUpload)
                                                                    }
                                                                } else {
                                                                    self.uploadError(assetUpload)
                                                                }
                                                            } else {
                                                                self.uploadError(assetUpload)
                                                            }
                                                        } else {
                                                            self.uploadError(assetUpload)
                                                        }
                                                    } else {
                                                        self.uploadError(assetUpload)
                                                    }
                                                } else {
                                                    self.uploadError(assetUpload)
                                                }
                                            } else {
                                                self.uploadError(assetUpload)
                                            }

                                            // End upload Progress
                                            self.uploadProgressEndFunc(fileName: fileName)
                                             
                                        }
                                        
                                    } else {
                                        self.uploadError(assetUpload)
                                    }
                                }
                                else {
                                    if  let writeUrl = assetUpload.writeUrl,
                                        let writeUrlSmall = assetUpload.writeUrlSmall,
                                        let writeUrlMedium = assetUpload.writeUrlMedium,
                                        let writeUrlLarge = assetUpload.writeUrlLarge {
                                        
                                        // Start Upload Progress
                                        self.uploadProgressStartFunc(fileName: fileName)
                                        self.uploadPhase = .uploadImageUrl
                                        
                                        if self.uploadImageToURL(image: image, fileName: fileName, writeUrl: writeUrl, contentType: contentType) {
                                            
                                            if let imageSmall = image.imageCut(cutSize: 300) {
                                                
                                                self.uploadPhase = .uploadImageUrlSmall
                                                if self.uploadImageToURL(image: imageSmall, fileName: fileName, writeUrl: writeUrlSmall, contentType: contentType) {
                                                    
                                                    if let imageMedium = image.imageCut(cutSize: 600) {
                                                        
                                                        self.uploadPhase = .uploadImageUrlMedium
                                                        if self.uploadImageToURL(image: imageMedium, fileName: fileName, writeUrl: writeUrlMedium, contentType: contentType) {
                                                        
                                                            if let imageLarge = image.imageCut(cutSize: 900) {
                                                                
                                                                self.uploadPhase = .uploadImageUrlLarge
                                                                if self.uploadImageToURL(image: imageLarge, fileName: fileName, writeUrl: writeUrlLarge, contentType: contentType) {
                                                                
                                                                    self.uploadSuccess(assetUpload)
                                                                    
                                                                } else {
                                                                    self.uploadError(assetUpload)
                                                                }
                                                            } else {
                                                                self.uploadError(assetUpload)
                                                            }
                                                        } else {
                                                            self.uploadError(assetUpload)
                                                        }
                                                    } else {
                                                        self.uploadError(assetUpload)
                                                    }
                                                } else {
                                                    self.uploadError(assetUpload)
                                                }
                                            } else {
                                                self.uploadError(assetUpload)
                                            }
                                        } else {
                                            self.uploadError(assetUpload)
                                        }
                                        
                                        // End upload Progress
                                        self.uploadProgressEndFunc(fileName: fileName)
                                        
                                    } else {
                                        self.uploadError(assetUpload)
                                    }
                                }
                                
                            } else {
                                self.uploadError(assetUpload)
                            }
                        })
                    } else {
                        self.uploadError(assetUpload)
                    }
                } else {
                    self.uploadError(assetUpload)
                }
            } else
            {
                uploadError(assetUpload)
            }

        }
    }
    
    func uploadError(_ assetUpload: CosyncAssetUpload) -> Void {
        if let userRealm = self.userRealm {
            try! userRealm.write {
                assetUpload.status = "uploadError"
            }
        }

    }
    
    func uploadSuccess(_ assetUpload: CosyncAssetUpload) -> Void {
        if let userRealm = self.userRealm {
            try! userRealm.write {
                assetUpload.status = "uploaded"
            }
        }

    }
    
    func uploadImageToURL(image: UIImage, fileName: String, writeUrl: String, contentType: String) -> Bool {
        
        var fullImageData: Data?
        if contentType == "image/jpeg" {
            fullImageData = image.jpegData(compressionQuality: 1.0)
        }
        else if contentType == "image/png" {
            fullImageData = image.pngData()
        }
        
        if let fullImageData = fullImageData {
            
            let config = URLSessionConfiguration.default
            let session = URLSession(configuration: config, delegate: self, delegateQueue: self.opQueue)

            var urlRequest = URLRequest(url: URL(string: writeUrl)!)
            urlRequest.httpMethod = "PUT"
            urlRequest.setValue(contentType, forHTTPHeaderField: "Content-type")
            
            let semaphore = DispatchSemaphore(value: 0)
            
            var taskData : Data?
            var taskResponse : URLResponse?
            var taskError : Error?
            
            let task = session.uploadTask(with: urlRequest, from: fullImageData) { data, response, error in
                
                taskData = data
                taskResponse = response
                taskError = error
                
                semaphore.signal()
            }
            task.taskDescription = fileName
            task.resume()
            
            _ = semaphore.wait(timeout: .distantFuture)
            
            if let error = taskError {
                print("\(error.localizedDescription)")
                return false
            }
            
            guard let response = taskResponse as? HTTPURLResponse else {
                print("no response")
                return false
            }
            
            if response.statusCode != 200 {
                print("response status code: \(response.statusCode)")
                return false
            }
            
            guard let responseData = taskData else {
                print("no response data")
                return false
            }
            
            if let responseString = String(data: responseData, encoding: .utf8) {
                print("response: \(responseString)")
            }
            
            return true
            
        }
        else {
            return false
        }
    }
    
    func uploadVideoToURL(videoUrl: URL, fileName: String, writeUrl: String, contentType: String) -> Bool {
        
        let fullVideoData: Data = try! Data(contentsOf: videoUrl)

        let config = URLSessionConfiguration.default
        let session = URLSession(configuration: config, delegate: self, delegateQueue: self.opQueue)

        var urlRequest = URLRequest(url: URL(string: writeUrl)!)
        urlRequest.httpMethod = "PUT"
        urlRequest.setValue(contentType, forHTTPHeaderField: "Content-type")
        
        let semaphore = DispatchSemaphore(value: 0)
        
        var taskData : Data?
        var taskResponse : URLResponse?
        var taskError : Error?
        
        let task = session.uploadTask(with: urlRequest, from: fullVideoData) { data, response, error in
            
            taskData = data
            taskResponse = response
            taskError = error
            
            semaphore.signal()
        }
        task.taskDescription = fileName
        task.resume()
        
        _ = semaphore.wait(timeout: .distantFuture)
        
        if let error = taskError {
            print("\(error.localizedDescription)")
            return false
        }
        
        guard let response = taskResponse as? HTTPURLResponse else {
            print("no response")
            return false
        }
        
        if response.statusCode != 200 {
            print("response status code: \(response.statusCode)")
            return false
        }
        
        guard let responseData = taskData else {
            print("no response data")
            return false
        }
        
        if let responseString = String(data: responseData, encoding: .utf8) {
            print("response: \(responseString)")
        }
        
        return true
            

    }
    
    func urlSession(_ session: URLSession, task: URLSessionTask, didSendBodyData bytesSent: Int64, totalBytesSent: Int64, totalBytesExpectedToSend: Int64) {
        
        let progress = Float(totalBytesSent) / Float(totalBytesExpectedToSend)
        let fileName = task.taskDescription
            
        var value: Float = 0.0
        switch self.uploadPhase {
        // Image upload
        case .uploadImageUrl:
            value = progress * 0.50
        case .uploadImageUrlSmall:
            value = 0.50 + progress * 0.10
        case .uploadImageUrlMedium:
            value = 0.60 + progress * 0.15
        case .uploadImageUrlLarge:
            value = 0.75 + progress * 0.25
            
        // Video upload
        case .uploadVideoUrl:
            value = progress * 0.80
        case .uploadVideoUrlPreview:
            value = 0.80 + progress * 0.05
        case .uploadVideoUrlSmall:
            value = 0.85 + progress * 0.05
        case .uploadVideoUrlMedium:
            value = 0.90 + progress * 0.05
        case .uploadVideoUrlLarge:
            value = 0.95 + progress * 0.05
        }
        self.uploadProgressFunc(fileName: fileName ?? "file", value: value, total: 100.0)
    }
    
    func uploadProgressStartFunc(fileName: String) -> Void {
        self.uploadProgressQueue.addOperation {
            if let uploadProgressStart = self.uploadProgressStart {
                DispatchQueue.main.async {
                    uploadProgressStart(fileName)
                }
            }
        }
    }
    
    func uploadProgressFunc(fileName: String, value: Float, total: Float) -> Void {
        self.uploadProgressQueue.addOperation {
            if let uploadProgress = self.uploadProgress {
                DispatchQueue.main.async {
                    uploadProgress(fileName, value, total)
                }
            }
        }
    }
    
    func uploadProgressEndFunc(fileName: String) -> Void {
        self.uploadProgressQueue.addOperation {
            if let uploadProgressEnd = self.uploadProgressEnd {
                DispatchQueue.main.async {
                    uploadProgressEnd(fileName)
                }
            }
        }
    }
}
