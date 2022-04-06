//
//  ContentView.swift
//  CosyncStorage
//
//  Created by Tola Voeung on 24/3/22.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack{
            AssetView()
        }.onAppear(perform: {
            Task{
                try await RealmHelper.shared.login()
                print("logged in")
               
            }
        })
       
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
