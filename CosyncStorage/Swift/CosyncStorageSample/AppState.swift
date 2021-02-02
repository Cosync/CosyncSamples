//
//  AppState.swift
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

import SwiftUI

// View table used for routing. Updated when a new view is added
enum TargetUI: Int {
    case login
    case user
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
    @Published var target: TargetUI = .login
    var context: Any = ""
}

extension Alert {
    
    init(_ message: AlertMessage) {
        self.init(
            title: Text(message.title),
            message: Text(message.message),
            dismissButton: .default(Text("OK"), action: {
                if (message.target != .login) {
                    message.state.target = message.target
                }
                return;
            })
        )
    }
}
