//
//  RealmManager.swift
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
//  Created by Richard Krueger on 8/10/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import Foundation
import RealmSwift
import CosyncJWTSwift


class RealmManager {
    
    static let shared = RealmManager()
            
    var app : App! = nil

    private init() {
        self.app = App(id: Constants.REALM_APP_ID)
    }
    
    deinit {
    }
        
    func login(_ jwt: String) async throws -> Void {

        let _ = try await app.login(credentials: Credentials.jwt(token: jwt))
        
    }
    
    func logout(onCompletion completion: @escaping (Error?) -> Void) {
        
        if let user = app.currentUser {
            user.logOut(completion: { (error) in
                
                guard error == nil else {
                    completion(CosyncJWTError.internalServerError)
                    return
                }
                
                completion(nil)
            })
        }
    
    }
    
}
