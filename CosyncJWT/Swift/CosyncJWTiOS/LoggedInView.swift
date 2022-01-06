//
//  LoggedInView.swift
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


struct LoggedInView: View {
    @EnvironmentObject var appState: AppState
    @State var phone = CosyncJWTRest.shared.phone ?? ""
    @State var phoneVerified = CosyncJWTRest.shared.phoneVerified ?? false
    @State var twoFactorPhoneVerification = CosyncJWTRest.shared.twoFactorPhoneVerification ?? false
    @State var phoneCode = ""
    @State var changePhoneNumber = false
    @State var verifyCode = false
    @State private var message: AlertMessage? = nil
    
    func errorSetPhone(err: Error?){
        if let cosyncJWTError = err as? CosyncJWTError {
            self.message = AlertMessage(title: "Set Phone", message: cosyncJWTError.message, target: .none, state: self.appState)
        }
    }
    
    func errorVerifyPhone(err: Error?){
        if let cosyncJWTError = err as? CosyncJWTError {
            self.message = AlertMessage(title: "Verify Phone", message: cosyncJWTError.message, target: .none, state: self.appState)
        }
    }
    
    var body: some View {
        NavigationView {
            
                
            VStack(spacing: 20) {
                Divider()
                Text(UserManager.shared.handle)
                Text(UserManager.shared.firstName)
                Text(UserManager.shared.lastName)
                
                // show phone number stuff if app supports 2-factor phone verification
                if let  twofactorVerification = CosyncJWTRest.shared.twoFactorVerification,
                        twofactorVerification == "phone" {
                    
                    Divider()
                    
                    HStack() {
                        if phoneVerified && changePhoneNumber==false {
                            Text(phone)
                            Spacer()
                        } else {
                            TextField("phone E.164 format", text: $phone)
                        }
                        
                        Button(action: {
                            Task {
                                if phoneVerified && changePhoneNumber==false {
                                    changePhoneNumber = true
                                    phone = ""
                                } else {
                                    do {
                                        try await CosyncJWTRest.shared.setPhone(phone)
                                    } catch {
                                        errorSetPhone(err: error)
                                    }

                                }
                            }


                        }) {
                            if phoneVerified && changePhoneNumber==false {
                                Text("Change Phone")
                            } else {
                                Text("Set Phone")
                            }
                        }.accentColor(.blue)
                    }
                    
                    if self.verifyCode {
                        Divider()
                        
                        HStack() {
                            TextField("code", text: $phoneCode)
                            Button(action: {
                                Task {
                                    do {
                                        try await CosyncJWTRest.shared.verifyPhone(phoneCode)
                                        changePhoneNumber = false
                                        verifyCode = false
                                        phoneVerified = true
                                    } catch {
                                        errorVerifyPhone(err: error)
                                    }
                                }
                            }) {
                                Text("Verify Code")
                            }.accentColor(.blue)
                        }
                    }
                }
                
                if phoneVerified {
                    Toggle("Enable 2-Factor verification", isOn: $twoFactorPhoneVerification)
                    .onChange(of: twoFactorPhoneVerification) { value in
                        Task {
                            do {
                                try await CosyncJWTRest.shared.setTwoFactorPhoneVerification(value)
                            } catch {
                                errorSetPhone(err: error)
                            }

                        }

                    }
                }

                Divider()
                
                NavigationLink(destination: InviteView()) {
                    Text("Invite Email")
                    Image(systemName: "person.crop.circle.badge.plus")
                }
                .padding()
                .foregroundColor(Color.white)
                .background(Color.blue)
                .cornerRadius(8)
                .font(.title)
                
                
                Spacer()
            }
            .padding()
            .alert(item: $message) { message in
                Alert(message)
            }
            

            // Use .inline for the smaller nav bar
            .navigationBarTitle(Text("Logged In"), displayMode: .inline)
            .navigationBarItems(
                // Button on the leading side
                leading:
                Button(action: {
                    CosyncJWTRest.shared.logout()
                    RealmManager.shared.logout(onCompletion: { (err) in
                    })

                    self.appState.target = .loggedOut
                }) {
                    Text("Logout")
                }.accentColor(.blue),
                
                trailing:
                NavigationLink(destination: ChangePasswordView()) {
                    Text("Password")
                }
            )
            .edgesIgnoringSafeArea(.bottom)
        }
    }
}


struct ChangePasswordView: View {
    @State private var password = ""
    @State private var newPassword = ""
    @EnvironmentObject var appState: AppState
    @State private var message: AlertMessage? = nil
    @Environment(\.presentationMode) var presentationMode
    
    func showChangePasswordInvalidParameters(){
        self.message = AlertMessage(title: "Change Password Failed", message: "You have entered an invalid password", target: .none, state: self.appState)
    }

    func showChangePasswordSuccess(){
        self.message = AlertMessage(title: "Change Password Success", message: "Your password has been changed", target: .none, state: self.appState)
    }
    
    var body: some View {
        VStack(spacing: 20) {
            Divider()
            Group {
                SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .autocapitalization(UITextAutocapitalizationType.none)

                SecureField("New Password", text: $newPassword)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .autocapitalization(UITextAutocapitalizationType.none)
            }
            .padding(.horizontal)
            Divider()
            
            Button(action: {
                
                Task {
                    if  self.password.count > 0 &&
                        self.newPassword.count > 0  {
                        
                        do {
                            try await CosyncJWTRest.shared.changePassword(self.newPassword, password: self.password)
                            self.showChangePasswordSuccess()
                            self.presentationMode.wrappedValue.dismiss()
                            
                        } catch {
                            self.showChangePasswordInvalidParameters()
                        }
                        
                    } else {
                        self.showChangePasswordInvalidParameters()
                    }
                }
                
            }) {
                Text("Change Password")
                    .padding(.horizontal)
                Image(systemName: "lock.rotation")
            }
            .padding()
            .foregroundColor(Color.white)
            .background(Color.blue)
            .cornerRadius(8)
            
            Spacer()
        }
        .navigationBarTitle("Change Password")
        .alert(item: $message) { message in
            Alert(message)
        }
    }
}

struct InviteView: View {
    @State private var email = ""
    @EnvironmentObject var appState: AppState
    @State private var message: AlertMessage? = nil
    @Environment(\.presentationMode) var presentationMode
    
    func showInviteInvalidParameters(){
        self.message = AlertMessage(title: "Invite Failed", message: "You have entered an invalid email", target: .none, state: self.appState)
    }

    func showInviteSuccess(){
        self.message = AlertMessage(title: "Invite Success", message: "An invite code was sent to the email", target: .none, state: self.appState)
    }
    
    var body: some View {
        VStack(spacing: 20) {
            Divider()
            Group {
                TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .keyboardType(.emailAddress)
                .autocapitalization(UITextAutocapitalizationType.none)

                
            }
            .padding(.horizontal)
            Divider()
            
            Button(action: {
                
                Task {
                    if  self.email.count > 0   {
                        
                        do {
                            try await CosyncJWTRest.shared.invite(self.email, metaData: nil,
                                                                  senderUserId: RealmManager.shared.app.currentUser?.id)
                            self.showInviteSuccess()
                            self.presentationMode.wrappedValue.dismiss()
                        } catch {
                            self.showInviteInvalidParameters()
                        }
                        
                    } else {
                        self.showInviteInvalidParameters()
                    }
                    
                }
                

                
            }) {
                Text("Send Invite")
                    .padding(.horizontal)
                Image(systemName: "envelope")
            }
            .padding()
            .foregroundColor(Color.white)
            .background(Color.blue)
            .cornerRadius(8)
            
            Spacer()
        }
        .navigationBarTitle("Change Password")
        .alert(item: $message) { message in
            Alert(message)
        }
    }
}



struct LoggedInView_Previews: PreviewProvider {
    static var previews: some View {
        LoggedInView()
    }
}
