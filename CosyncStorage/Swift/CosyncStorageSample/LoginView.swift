//
//  LoginView.swift
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

struct LoginView: View {
    var body: some View {

        TabView {

            LoginTab().tabItem {
                Image(systemName: "arrow.right.square")
                Text("Login")
            }
            SignupTab().tabItem {
                Image(systemName: "person.badge.plus")
                Text("Signup")
            }
        }
    }
}

struct LoginTab: View {
    @State private var email = ""
    @State private var password = ""
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var assetState: AssetState
    @State private var message: AlertMessage? = nil
    
    func showLoginInvalidParameters(){
        self.message = AlertMessage(title: "Login Failed", message: "You have entered an invalid handle or password.", target: .login, state: self.appState)
    }
    
    var body: some View {
        VStack(spacing: 20) {
            
            Text("Cosync Storage Sample")
                .font(.largeTitle)
            
            Divider()
            
            Group {
                TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .keyboardType(.emailAddress)
                .autocapitalization(UITextAutocapitalizationType.none)
            
                SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .autocapitalization(UITextAutocapitalizationType.none)
            }
            .padding(.horizontal)
            
            Divider()
            
            Button(action: {
                RealmManager.shared.login(self.email, password: self.password, onCompletion: { (error) in
                        DispatchQueue.main.async {
                            if error != nil {
                                self.showLoginInvalidParameters()
                            } else {
                                NSLog("Login success")
                                self.assetState.setup()
                                self.appState.target = .user
                            }
                        }
                    }
                )
            }) {
                Text("Login")
                    .padding(.horizontal)
                Image(systemName: "arrow.right.square")
            }
            .padding()
            .foregroundColor(Color.white)
            .background(Color.green)
            .cornerRadius(8)

        }.font(.title)
        .alert(item: $message) { message in
            Alert(message)
        }
    }
}

struct SignupTab: View {
    @State private var email = ""
    @State private var password = ""
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var assetState: AssetState
    @State private var message: AlertMessage? = nil
    
    func showSignupInvalidParameters(){
        self.message = AlertMessage(title: "Signup Failed", message: "You have entered an invalid handle or password.", target: .login, state: self.appState)
    }
    
    
    var body: some View {
        VStack(spacing: 20) {
            
            Text("Cosync Storage Sample")
                .font(.largeTitle)
            
            Divider()
            
            Group {
                TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .keyboardType(.emailAddress)
                .autocapitalization(UITextAutocapitalizationType.none)
            
                SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .autocapitalization(UITextAutocapitalizationType.none)
                
            }
            .padding(.horizontal)
            
            Divider()
            
            Button(action: {
                RealmManager.shared.signup(self.email, password: self.password, onCompletion: { (error) in
                        DispatchQueue.main.async {
                            if error != nil {
                                self.showSignupInvalidParameters()
                            } else {
                                NSLog("Signup success")
                                self.assetState.setup()
                                self.appState.target = .user
                            }

                        }
                    }
                )
            }) {
                Text("Signup")
                    .padding(.horizontal)
                Image(systemName: "person.badge.plus")
            }
            .padding()
            .foregroundColor(Color.white)
            .background(Color.blue)
            .cornerRadius(8)

        }.font(.title)
        .alert(item: $message) { message in
            Alert(message)
        }
    }
}



struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
