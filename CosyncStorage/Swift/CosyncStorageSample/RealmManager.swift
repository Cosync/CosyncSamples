//
//  RealmManager.swift
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

class RealmManager {
    
    static let shared = RealmManager()
            
    var app : App! = nil
    var userRealm: Realm?
    var publicRealm: Realm?

    var currentUserId: String? {
        if  let user = self.app.currentUser {
            let uid = user.id
            return uid
        }
        return nil
    }

    private init() {
        self.app = App(id: Constants.REALM_APP_ID)
    }
    
    deinit {
    }
    
    func login(_ email: String, password: String, onCompletion completion: @escaping (Error?) -> Void) {

        app.login(credentials: Credentials.emailPassword(email: email, password: password)) { result in
            
            switch result {
            case .success( _):
                DispatchQueue.main.async {
                    self.initRealms(onCompletion: { (err) in
                        if err==nil {
                            UploadManager.shared.setup()
                        }
                        completion(err)
                    })
                }
            case .failure(let error):
                completion(error)
            }
            
        }
        
    }
    
    func logout(onCompletion completion: @escaping (Error?) -> Void) {
        
        if let user = app.currentUser {
            user.logOut(completion: { (error) in
                completion(error)
            })
            self.userRealm = nil
            self.publicRealm = nil
            UploadManager.shared.cleanup()
        }
    }
    
    func signup(_ email: String, password: String, onCompletion completion: @escaping (Error?) -> Void) {
        
        app.emailPasswordAuth.registerUser(email: email, password: password, completion:
            {(error) in
            // Completion handlers are not necessarily called on the UI thread.
            // This call to DispatchQueue.main.sync ensures that any changes to the UI,
            // namely disabling the loading indicator and navigating to the next page,
            // are handled on the UI thread:
            DispatchQueue.main.async {
                
                guard error == nil else {

                    NSLog("Signup failed: \(error!.localizedDescription)")
                    completion(error)
                    return
                }
                
                self.login(email, password: password, onCompletion: { err in
                                        
                    completion(err)
                })
                
                
            }
        })
        

    }

    func initRealms(onCompletion completion: @escaping (Error?) -> Void) {
        if  let user = self.app.currentUser,
            let uid = self.currentUserId {
            
            
            self.userRealm = try! Realm(configuration: user.configuration(partitionValue: "user_id=\(uid)"))
            self.publicRealm = try! Realm(configuration: user.configuration(partitionValue: "public"))
            completion(nil)
         }
    }
    
}

