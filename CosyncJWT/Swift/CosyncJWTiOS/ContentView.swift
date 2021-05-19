//
//  ContentView.swift
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

import SwiftUI
import CosyncJWTSwift

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    init() {
        CosyncJWTRest.shared.configure(appToken: Constants.APP_TOKEN,
                                       cosyncRestAddress: Constants.COSYNC_REST_ADDRESS)

    }

    var body: some View {

        Group {
            if self.appState.target == .loggedOut {
                LoggedOutView()
            } else if self.appState.target == .loggedIn {
                LoggedInView()
            } else if self.appState.target == .loginComplete {
                LoginCompleteView()
            } else {
                PasswordView()
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AppState())
    }
}
