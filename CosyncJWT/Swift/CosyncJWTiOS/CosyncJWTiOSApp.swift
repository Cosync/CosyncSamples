//
//  CosyncJWTiOSApp.swift
//  CosyncJWTiOS
//
//  Created by Richard Krueger on 12/27/21.
//

import SwiftUI

@main
struct CosyncJWTiOSApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(AppState())
        }
    }
}
