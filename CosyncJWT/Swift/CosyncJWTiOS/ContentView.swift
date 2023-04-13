//
//  ContentView.swift
//  CosyncJWTiOS
//
//  Created by Richard Krueger on 12/27/21.
//

import SwiftUI
import CosyncJWTSwift


struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    init() {
        CosyncJWTRest.shared.configure(appToken: Constants.APP_TOKEN,
                                       cosyncRestAddress: Constants.COSYNC_REST_ADDRESS,
                                       rawPublicKey: Constants.RAW_PUBLIC_KEY)

    }

    var body: some View {

        Group {
            if self.appState.target == .loggedOut {
                LoggedOutView()
            } else if self.appState.target == .loggedIn {
                LoggedInView()
            } else if self.appState.target == .loginComplete {
                LoginCompleteView()
            } else if self.appState.target == .loginUserName {
                LoginUserNameView()
            } else {
                PasswordView()
            }
        }
        .task {
            try! await CosyncJWTRest.shared.getApplication()
            if let anonymousLoginEnabled = CosyncJWTRest.shared.anonymousLoginEnabled {
                appState.anonymousLoginEnabled = anonymousLoginEnabled
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
