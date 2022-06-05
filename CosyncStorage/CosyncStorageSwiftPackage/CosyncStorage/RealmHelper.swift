//
//  RealmHelper.swift

import Foundation
import RealmSwift
import CosyncStorageSwift

class RealmHelper {
    
    static let shared = RealmHelper()
   
    var app : App! = nil
    var userRealm: Realm?
    var publicRealm: Realm?
     
    var user: User? {
        return self.app.currentUser
    } 
    
    var currentUserId: String? {
        if  let user = self.app.currentUser {
            let uid = user.id
            return uid
        }
        return nil
    }
    
    private init() {
        self.app = App(id: Constants.REALM_APP_ID)
        self.app.syncManager.errorHandler = { error, session in
            // handle error
            print("syncManager errorHandler: \(error)")
        }
        
    }
    
    
    
    func login() async throws -> Void {

        do {
            
         
            let user = try await app.login(credentials: Credentials.emailPassword(email: Constants.LOGIN_EMAIL, password: Constants.LOGIN_PASSWORD))
            print("Successfully login realms  uid \(user.id)")
            try await initRealms()
        }
        catch{
            
        }
        
    }
    
    func logout(onCompletion completion: @escaping (Error?) -> Void) {
        
        if let user = app.currentUser {
            user.logOut(completion: { (error) in
                
                guard error == nil else {
                    
                    return
                }
                
                completion(nil)
            })
        }
    
    }
    
    func initRealms() async throws -> Void {
        
        do {
            
             
            if  let user = self.app.currentUser,
                let uid = self.currentUserId {
                self.userRealm = try await Realm(configuration: user.configuration(partitionValue: "user_id=\(uid)"), downloadBeforeOpen: .once)
                self.publicRealm = try await Realm(configuration: user.configuration(partitionValue: "public"), downloadBeforeOpen: .once)
                 
                CosyncStorageSwift.shared.configure(app: self.app!, privateRealm: self.userRealm!, publicRealm: self.publicRealm!)
                
                print("Successfully opened realms after downloading: uid \(uid)")
             }
        }
        catch{
            
        }
    }
    
}
