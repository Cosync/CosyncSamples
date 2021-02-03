//
//  RealmManager.swift
//  CosyncJWTiOS
//
//  Created by Richard Krueger on 8/10/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import Foundation
import RealmSwift

class RealmManager {
    
    static let shared = RealmManager()
            
    var app : App! = nil

    private init() {
        self.app = App(id: Constants.REALM_APP_ID)
    }
    
    deinit {
    }
    
    func login(_ jwt: String, onCompletion completion: @escaping (Error?) -> Void) {

        app.login(credentials: Credentials.jwt(token: jwt)) { result in
            
            switch result {
            case .success( _):
                completion(nil)
            case .failure( _):
                completion(RESTError.internalServerError)
            }
            
        }
        
    }
    
    func logout(onCompletion completion: @escaping (Error?) -> Void) {
        
        if let user = app.currentUser {
            user.logOut(completion: { (error) in
                
                guard error == nil else {
                    completion(RESTError.internalServerError)
                    return
                }
                
                completion(nil)
            })
        }
    
    }
    
}
