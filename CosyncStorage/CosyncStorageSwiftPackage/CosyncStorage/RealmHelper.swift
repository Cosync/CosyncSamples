//
//  RealmHelper.swift

import Foundation
import RealmSwift
import CosyncStorageSwift

class RealmHelper {
    
    static let shared = RealmHelper()
   
    var app : App! = nil
    var realm: Realm?
     
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
            var config = self.user!.flexibleSyncConfiguration()
            
            config.objectTypes = [
                                  CosyncAsset.self,
                                  CosyncAssetUpload.self
            ]
            
            realm = try await Realm(configuration: config, downloadBeforeOpen: .always)
            let subscriptions = realm!.subscriptions
            let foundCosyncUpload = subscriptions.first(named: "cosyncAssetUpload")
            let foundCosyncAsset = subscriptions.first(named: "cosyncAsset")
            
            try await subscriptions.update({
                if (foundCosyncUpload == nil) {
                    subscriptions.append(
                        QuerySubscription<CosyncAssetUpload>(name: "cosyncAssetUpload"){
                            $0.userId == self.currentUserId!
                        }
                    )
                }
                
                if (foundCosyncAsset == nil) {
                    subscriptions.append(
                        QuerySubscription<CosyncAsset>(name: "cosyncAsset")
                    )
                }
            })
            
            CosyncStorageSwift.shared.configure(app: self.app, realm: self.realm!)
        }
        catch{
            
        }
    }
    
}
