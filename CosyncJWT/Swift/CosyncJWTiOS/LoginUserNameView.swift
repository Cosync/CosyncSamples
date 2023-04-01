//
//  LoginUserNameView.swift
//  CosyncJWTiOS
//
//  Created by Richard Krueger on 3/31/23.
//

import SwiftUI
import CosyncJWTSwift


struct LoginUserNameView: View {
    @EnvironmentObject var appState: AppState
    @State private var userName = ""
    @State private var message: AlertMessage? = nil
    @State var isSettingUserName = false


    func userNameIsEmpty(){
        self.message = AlertMessage(title: "Set User Name", message: "user name is empty", target: .none, state: self.appState)
    }
    
    func showErrorLoginUserName(err: Error?){
        if let cosyncJWTError = err as? CosyncJWTError {
            self.message = AlertMessage(title: "Set User Name", message: cosyncJWTError.message, target: .none, state: self.appState)
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                
                Divider()
                
                TextField("User Name", text: $userName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.numberPad)
                    .autocapitalization(UITextAutocapitalizationType.none)
                    .padding()
                
                Divider()
                
                if isSettingUserName {
                    ProgressView()
                }
                
                Button(action: {
                    Task {
                        if userName.isEmpty {
                            userNameIsEmpty()
                        } else {
                            isSettingUserName = true
                            do {
                                try await UserManager.shared.setUserName(userName: userName)
                                isSettingUserName = false
                                self.appState.target = .loggedIn
                            } catch {
                                isSettingUserName = false
                                self.showErrorLoginUserName(err: error)
                            }
                        }
                    }
                }) {
                    
                    Text("Set UserName")
                    
                }.accentColor(.blue)
                
                Spacer()
            }
            .padding()
            .alert(item: $message) { message in
                Alert(message)
            }
            
            // Use .inline for the smaller nav bar
            .navigationBarTitle(Text("Set User Name"), displayMode: .inline)
            .navigationBarItems(
                // Button on the leading side
                leading:
                Button(action: {
                    self.appState.target = .loggedOut
                }) {
                    Text("Back")
                }.accentColor(.blue)
                
            )
            .edgesIgnoringSafeArea(.bottom)
        }
    }
}

struct LoginUserNameView_Previews: PreviewProvider {
    static var previews: some View {
        LoginUserNameView()
    }
}
