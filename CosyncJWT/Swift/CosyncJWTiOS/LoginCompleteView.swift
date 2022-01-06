//
//  LoginCompleteView.swift
//  CosyncJWTiOS
//
//  Created by Richard Krueger on 5/19/21.
//  Copyright © 2021 cosync. All rights reserved.
//

import SwiftUI
import CosyncJWTSwift


struct LoginCompleteView: View {
    @EnvironmentObject var appState: AppState
    @State private var code = ""
    @State private var message: AlertMessage? = nil
    @State var isLoggingIn = false


    func invalidCode(){
        self.message = AlertMessage(title: "Login Complete", message: "Code is empty", target: .none, state: self.appState)
    }
    
    func showErrorLoginComplete(err: Error?){
        if let cosyncJWTError = err as? CosyncJWTError {
            self.message = AlertMessage(title: "VLogin Complete", message: cosyncJWTError.message, target: .none, state: self.appState)
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                
                Divider()
                
                TextField("Code", text: $code)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.numberPad)
                    .autocapitalization(UITextAutocapitalizationType.none)
                    .padding()
                
                Divider()
                
                if isLoggingIn {
                    ProgressView()
                }
                
                Button(action: {
                    Task {
                        if code.isEmpty {
                            invalidCode()
                        } else {
                            isLoggingIn = true
                            do {
                                try await UserManager.shared.loginComplete(code: code)
                                isLoggingIn = false
                                self.appState.target = .loggedIn
                            } catch {
                                isLoggingIn = false
                                self.showErrorLoginComplete(err: error)
                            }
                        }
                    }
                }) {
                    
                    Text("Validate")
                    
                }.accentColor(.blue)
                
                Spacer()
            }
            .padding()
            .alert(item: $message) { message in
                Alert(message)
            }
            
            // Use .inline for the smaller nav bar
            .navigationBarTitle(Text("Complete Login"), displayMode: .inline)
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

struct LoginCompleteView_Previews: PreviewProvider {
    static var previews: some View {
        LoginCompleteView()
    }
}
