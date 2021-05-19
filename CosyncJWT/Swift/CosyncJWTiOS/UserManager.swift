//
//  UserManager.swift
//  CosyncJWTiOS
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
//  Created by Richard Krueger on 8/12/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import Foundation
import CosyncJWTSwift

class UserManager {
    
    static let shared = UserManager()
            
    // user meta data
    var firstName : String = ""
    var lastName : String = ""
    var handle : String = ""

    private init() {
    }
    
    deinit {
    }
    
    func loginGetUserData(completion: @escaping (Error?) -> Void) {
        
        CosyncJWTRest.shared.getUser(onCompletion: { (error) in
            if error == nil {
                if let metaData = CosyncJWTRest.shared.metaData {
                    if let userData = metaData["user_data"] as? [String:Any] {
                        if let name = userData["name"] as? [String:Any] {
                            if let firstName = name["first"] as? String {
                                self.firstName = firstName
                            }
                            if let lastName = name["last"] as? String {
                                self.lastName = lastName
                            }
                        }
                    }
                }
                if let handle = CosyncJWTRest.shared.handle {
                    self.handle = handle
                }
                completion(nil)
            } else {
                completion(error)
            }
        })
    }
    
    func login(email: String, password: String, onCompletion completion: @escaping (Error?) -> Void) {
        
        CosyncJWTRest.shared.login(email, password: password, onCompletion: { (error) in
                
            DispatchQueue.main.async {
                
                if error == nil {
                    
                    if let _ = CosyncJWTRest.shared.loginToken {
                        completion(nil)
                    } else {
                        RealmManager.shared.login(CosyncJWTRest.shared.jwt!, onCompletion: { (error) in
                             
                            if error == nil {
                                DispatchQueue.main.async {
                                    UserManager.shared.loginGetUserData(completion: { (error) in
                                        completion(error)
                                    })
                                }
                            } else {
                                completion(error)
                            }
                        })
                    }
                } else {
                    completion(error)
                }
            }
        })
    }
    
    func loginComplete(code: String, onCompletion completion: @escaping (Error?) -> Void) {
        
        CosyncJWTRest.shared.loginComplete(code, onCompletion: { (error) in
                
            DispatchQueue.main.async {
                
                if error == nil {
                    UserManager.shared.loginGetUserData(completion: { (error) in
                        completion(error)
                    })
                } else {
                    completion(error)
                }
            }
        })
    }
    
    func logout(onCompletion completion: @escaping (Error?) -> Void) {
        
        self.firstName = ""
        self.lastName = ""
        self.handle = ""
        CosyncJWTRest.shared.logout()
        RealmManager.shared.logout(onCompletion: { (error) in
            completion(error)
        })
    }
    
}
