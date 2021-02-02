//
//  AssetState.swift
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


// Global state observable used to trigger routing
class AssetState: ObservableObject {
    @Published var expirationHours = 24.0
    @Published var assets: Results<CosyncAsset>?

    private var assetNotificationToken: NotificationToken! = nil

    func setup() -> Void {
        if  let publicRealm = RealmManager.shared.publicRealm {
            
            let assetResults = publicRealm.objects(CosyncAsset.self)
                .filter("status == 'active' && expirationHours == 0")
                .sorted(byKeyPath: "createdAt", ascending: false)
            
            self.assetNotificationToken = assetResults.observe { (changes: RealmCollectionChange) in
        
                switch changes {
                case .initial:
                    self.assets = assetResults
                    
                case .update(let results, _, _, _):
                    self.assets = results
                    
                case .error(let error):
                    // An error occurred while opening the Realm file on the background worker thread
                    fatalError("\(error)")
                }
            }


        }

    }

    func cleanup() -> Void {
        self.assets = nil
        self.assetNotificationToken.invalidate()
        self.assetNotificationToken = nil
    }
}
