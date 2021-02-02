//
//  Models.swift
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


class CosyncAsset: Object {
    
    @objc dynamic var _id: ObjectId = ObjectId.generate()
    @objc dynamic var _partition: String = ""
    @objc dynamic var uid: String = ""
    @objc dynamic var path: String = ""
    @objc dynamic var expirationHours: Double = 0
    @objc dynamic var expiration: Date? = nil
    @objc dynamic var contentType: String = ""
    @objc dynamic var caption: String = ""
    let size = RealmOptional<Int>()
    let duration = RealmOptional<Int>()
    @objc dynamic var color: String = ""
    @objc dynamic var xRes: Int = 0
    @objc dynamic var yRes: Int = 0
    @objc dynamic var containerId: String? = nil
    @objc dynamic var status: String = ""
    @objc dynamic var url: String? = nil
    @objc dynamic var urlSmall: String? = nil
    @objc dynamic var urlMedium: String? = nil
    @objc dynamic var urlLarge: String? = nil
    @objc dynamic var urlVideoPreview: String? = nil
    @objc dynamic var createdAt: Date? = nil
    @objc dynamic var updatedAt: Date? = nil
    
    override static func primaryKey() -> String? {
        return "_id"
    }
    override static func indexedProperties() -> [String] {
        return ["_partition", "uid", "expiration", "contentType", "size", "containerId", "status", "createdAt"]
    }
    
}


class CosyncAssetUpload: Object {
    
    @objc dynamic var _id: ObjectId = ObjectId.generate()
    @objc dynamic var _partition: String = ""
    @objc dynamic var uid: String = ""
    @objc dynamic var sessionId: String = ""
    @objc dynamic var extra: String = ""
    @objc dynamic var assetPartition: String = ""
    @objc dynamic var filePath: String = ""
    @objc dynamic var path: String = ""
    @objc dynamic var expirationHours: Double = 0
    @objc dynamic var contentType: String? = nil
    let size = RealmOptional<Int>()
    let duration = RealmOptional<Int>()
    @objc dynamic var color: String = ""
    @objc dynamic var xRes: Int = 0
    @objc dynamic var yRes: Int = 0
    @objc dynamic var containerId: String? = nil
    @objc dynamic var caption: String = ""
    @objc dynamic var writeUrl: String? = nil
    @objc dynamic var writeUrlSmall: String? = nil
    @objc dynamic var writeUrlMedium: String? = nil
    @objc dynamic var writeUrlLarge: String? = nil
    @objc dynamic var writeUrlVideoPreview: String? = nil
    @objc dynamic var status: String = "pending"
    @objc dynamic var createdAt: Date? = nil
    @objc dynamic var updatedAt: Date? = nil
    
    override static func primaryKey() -> String? {
        return "_id"
    }
    override static func indexedProperties() -> [String] {
        return ["_partition", "uid", "sessionId", "assetPartition", "size", "containerId", "status"]
    }
    
    convenience init(partition: String,
                     uid: String,
                     sessionId: String,
                     extra: String,
                     assetPartition: String,
                     filePath: String,
                     contentType: String,
                     size: Int,
                     duration: Int,
                     color: String,
                     xRes: Int,
                     yRes: Int) {
        self.init()
        self._partition = partition
        self.uid = uid
        self.sessionId = sessionId
        self.extra = extra
        self.assetPartition = assetPartition
        self.filePath = filePath
        self.contentType = contentType
        self.size.value = size
        self.duration.value = duration
        self.color = color
        self.xRes = xRes
        self.yRes = yRes
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}



