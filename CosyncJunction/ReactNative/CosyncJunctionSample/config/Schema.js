 //
//  Schema.js
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
//  Created by Tola Voeung.
//  Copyright © 2020 cosync. All rights reserved.
//
 
exports.FieldValue = {
    "name":"FieldValue",
	"primaryKey":"_id",
	"properties": {
		"_id":{ "type": "string", "indexed": true }, 
		"_partition":{ "type": "string", "indexed": true }, 
		"name":{ "type": "string", "indexed": true, "default":"" }, 
		"value":{ "type": "string", "indexed": true, "default":"" }, 
		"children" : "FieldValue[]", 
		"createdAt": { "type": "date", "optional": true, "indexed": true },
		"updatedAt": { "type": "date", "optional": true },
	}
}


exports.FieldDef = {
    "name":"FieldDef",
    "primaryKey":"_id",
    "properties":{
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition":{ "type": "string", "indexed": true },
        "required":{ "type": "bool", "indexed": true, "default": false },   
        "fieldName":{ "type": "string", "indexed": true },
        "display":{ "type": "string", "indexed": true },
        "defaultValue":{ "type": "string", "indexed": true, "optional": true  },
        "fieldType":{ "type": "string" }, 
        "enumValues":{ "type": "string[]", "default": [] },
        "regex":{ "type": "string", "optional": true },
        "properties":{ "type": "FieldDef[]", "default": [] },
        "arrayFieldType":{ "type": "string", "optional": true },
        "createdAt":{ "type": "date" , "optional": true, "indexed": true  },
        "updatedAt":{ "type": "date" , "optional": true }
    }
};

 

exports.UserSchema = {
    "name":"UserSchema", 
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition":{ "type": "string", "indexed": true }, 
        "userProfile": "FieldDef[]",
        "createdAt": { "type": "date" , "optional": true, "indexed": true },
        "updatedAt": { "type": "date" , "optional": true } 
    }
}; 