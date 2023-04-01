//
//  AppState.swift
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
//  Created by Richard Krueger on 8/6/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import Foundation

// View table used for routing. Updated when a new view is added
enum TargetUI: Int {
    case none
    case loggedOut
    case loginComplete
    case loginUserName
    case loggedIn
    case password
}

// Alert message container
struct AlertMessage: Identifiable {
    let id = UUID()
    let title: String
    let message: String
    let target: TargetUI
    let state: AppState
}

// Global state observable used to trigger routing
class AppState: ObservableObject {
    @Published var target: TargetUI = .loggedOut
    @Published var anonymousLoginEnabled: Bool = false
    var context: Any = ""
}
