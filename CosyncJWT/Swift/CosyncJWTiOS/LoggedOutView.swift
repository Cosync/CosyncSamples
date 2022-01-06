//
//  LoggedOutView.swift
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


struct LoggedOutView: View {
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
    @State private var message: AlertMessage? = nil
    @State var isLoggingIn = false
    
    func showLoginInvalidParameters(){
        self.message = AlertMessage(title: "Login Failed", message: "You have entered an invalid handle or password.", target: .none, state: self.appState)
    }

    func showLoginError(message: String){
        self.message = AlertMessage(title: "Login Failed", message: message, target: .none, state: self.appState)
    }

    
    var body: some View {
        VStack(spacing: 20) {
            
            Text("CosyncJWT iOS")
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
            
            if isLoggingIn {
                ProgressView()
            }
            
            Button(action: {
                Task {
                    if self.email.count > 0 && self.password.count > 0 {
                        isLoggingIn = true
                        
                        do {
                            try await UserManager.shared.login(email: self.email, password: self.password)
                            if let _ = CosyncJWTRest.shared.loginToken {
                                self.appState.target = .loginComplete
                            } else {
                                self.appState.target = .loggedIn
                            }
                        } catch {
                            self.showLoginInvalidParameters()
                        }
                                                
                    } else {
                        self.showLoginInvalidParameters()
                    }
                }
            }) {
                Text("Login")
                    .padding(.horizontal)
                Image(systemName: "arrow.right.square")
            }
            .padding()
            .foregroundColor(Color.white)
            .background(Color.green)
            .cornerRadius(8)
            
            Button(action: {
                self.appState.target = .password
            }) {
                Text("forgot password")
                .font(.body)
            }
            .padding()
            

        }
        .font(.title)
        .alert(item: $message) { message in
            Alert(message)
        }
    }
}


enum SignupUI: Int {
    case signup
    case verifyCode
}

struct SignupTab: View {
    @State private var email = ""
    @State private var password = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var inviteCode = ""
    @State private var code = ""
    @EnvironmentObject var appState: AppState
    @State private var message: AlertMessage? = nil
    @State var signupUI: SignupUI = .signup
    @State var isLoggingIn = false
    
    func showSignupInvalidParameters(){
        self.message = AlertMessage(title: "Signup Failed", message: "You have entered an invalid handle or password.", target: .none, state: self.appState)
    }

    func showSignupError(message: String){
        self.message = AlertMessage(title: "Signup Failed", message: message, target: .none, state: self.appState)
    }

    func showSignupInvalidCode(){
        self.message = AlertMessage(title: "Signup Failed", message: "You have entered an invalid 6 digit code", target: .none, state: self.appState)
    }
    
    
    var body: some View {
        VStack(spacing: 20) {
            
            Text("CosyncJWT iOS")
                .font(.largeTitle)
            
            Divider()
            
            Group {
                if self.signupUI == .signup {
                    TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.emailAddress)
                    .autocapitalization(UITextAutocapitalizationType.none)
                
                    SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .autocapitalization(UITextAutocapitalizationType.none)
                    
                    TextField("First Name", text: $firstName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.emailAddress)
                    .autocapitalization(UITextAutocapitalizationType.none)

                    TextField("Last Name", text: $lastName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.emailAddress)
                    .autocapitalization(UITextAutocapitalizationType.none)

                    TextField("Invite Code", text: $inviteCode)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.numberPad)
                    .autocapitalization(UITextAutocapitalizationType.none)

                }
                
                else {
                    Text("A six digit code was sent to your email, please enter it below to verify your identity")
                    
                    TextField("Code", text: $code)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.numberPad)
                    .autocapitalization(UITextAutocapitalizationType.none)
                    
                }
                
            }
            .padding(.horizontal)
            
            Divider()
            
            if isLoggingIn {
                ProgressView()
            }
            
            if self.signupUI == .signup {
                Button(action: {
                    Task {
                        if  self.email.count > 0 &&
                            self.password.count > 0 &&
                            self.firstName.count > 0 &&
                            self.lastName.count > 0 &&
                            (self.inviteCode.count == 0 ||
                                (self.inviteCode.count > 0 && self.inviteCode.isNumeric)) {
                            
                            let metaData = "{\"user_data\": {\"name\": {\"first\": \"\(self.firstName)\", \"last\": \"\(self.lastName)\"}}}"
                            
                            if self.inviteCode.count == 0 {
                                isLoggingIn = true
                                
                                do {
                                    try await CosyncJWTRest.shared.signup(self.email, password: self.password, metaData: metaData)
                                    isLoggingIn = false
                                    self.signupUI = .verifyCode
                                    
                                } catch let error as CosyncJWTError {
                                    isLoggingIn = false
                                    self.showSignupError(message: error.message)
                                } catch {
                                    isLoggingIn = false
                                    self.showSignupInvalidParameters()
                                }
                                
                            } else {
                                isLoggingIn = true
                                
                                do {
                                    try await CosyncJWTRest.shared.register(self.email, password: self.password, metaData: metaData, code: self.inviteCode)
                                    
                                    try await UserManager.shared.login(email: self.email, password: self.password)
                                    isLoggingIn = false
                                    self.appState.target = .loggedIn
                                    
                                } catch let error as CosyncJWTError {
                                    isLoggingIn = false
                                    self.showSignupError(message: error.message)
                                } catch {
                                    isLoggingIn = false
                                    self.showSignupInvalidParameters()
                                }

                            }
                        } else {
                            self.showSignupInvalidParameters()
                        }
                    }
 
                }) {
                    Text("Signup")
                        .padding(.horizontal)
                    Image(systemName: "person.badge.plus")
                }
                .padding()
                .foregroundColor(Color.white)
                .background(Color.blue)
                .cornerRadius(8)
            } else {
                Button(action: {
                    
                    Task {
                        if self.code.isNumeric && self.code.count == 6 {
                            isLoggingIn = true
                            do {
                                try await CosyncJWTRest.shared.completeSignup(self.email, code: self.code)
                                
                                try await UserManager.shared.login(email: self.email, password: self.password)
                                
                                isLoggingIn = false
                                self.signupUI = .signup
                                self.appState.target = .loggedIn
                                
                            } catch let error as CosyncJWTError {
                                isLoggingIn = false
                                self.showSignupError(message: error.message)
                            } catch {
                                isLoggingIn = false
                                self.showSignupInvalidParameters()
                            }
                            
                        } else {
                            self.showSignupInvalidCode()
                        }
                    }
                    
                    
                    
                }) {
                    Text("Verify Code")
                        .padding(.horizontal)
                    Image(systemName: "envelope")
                }
                .padding()
                .foregroundColor(Color.white)
                .background(Color.blue)
                .cornerRadius(8)
            }

        }.font(.title)
        .alert(item: $message) { message in
            Alert(message)
        }

    }
}


struct LoggedOutView_Previews: PreviewProvider {
    static var previews: some View {
        LoggedOutView()
    }
}
