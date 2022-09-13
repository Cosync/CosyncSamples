//
//  RealmManager.js
//  CosyncStorageExpo
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
//  Created by Tola Voeung.
//  Copyright © 2020 cosync. All rights reserved.
//
import 'react-native-get-random-values'
import Realm from "realm"; 
import Schema from '../config/Schema';
import Configure from '../config/Config' 

export const signup = (userEmail, userPassword) => {
  return new Promise((resolve, reject) => { 

    const appConfig = {
      id:  Configure.Realm.appId,
      timeout: 10000,
    };

    const app = new Realm.App(appConfig);
    if(app.currentUser) app.currentUser.logOut();
    
    let userDetail = RegisterUserDetails(userEmail, userPassword); 
    
    app.emailPasswordAuth.registerUser(userDetail).then(result => { 
      resolve(true)
    }).catch(err => {
      resolve(err)
    }) 
  })
}



export const login = (userEmail, userPassword) => {
  return new Promise((resolve, reject) => { 

    const appConfig = {
      id:  Configure.Realm.appId,
      timeout: 10000,
    };

    const app = new Realm.App(appConfig); 
    const credentials = Realm.Credentials.emailPassword(userEmail, userPassword);
    
    closeAllRealm();

    app.logIn(credentials).then(user => { 
      global.user = user;  

      openRealm().then( result => {
        resolve(user);
      }).catch(err => {
        reject(err);
      }) 
      
    }).catch(err => {
      reject(err);
    }) 
  })
}

const closeAllRealm = () => {
  
  try { 
    if(global.realm){
      global.realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeAll();
      });

      global.realm.close();  
      
    } 
  } catch (error) {
        
  } 

}


export const openRealm = () => {

  return new Promise((resolve, reject) => {

    if(global.realm){
      resolve(global)
      return;
    }

    
      
    try { 

      Realm.open({
        schema: [Schema.CosyncAsset, Schema.CosyncAssetUpload],
        sync: {
          user: global.user,
          flexible: true,
        },
      }).then(realm => {
        global.realm = realm;

        realm.subscriptions.update((mutableSubs) => {
          
          mutableSubs.add(realm.objects(Configure.Realm.cosyncAssetUpload).filtered(`userId == '${global.user.id}'`), {
            name: "cosyncAssetUploadSubscription",
            throwOnUpdate: true,
          });

          mutableSubs.add(realm.objects(Configure.Realm.cosyncAsset), {
            name: "cosyncAssetSubscription",
            throwOnUpdate: true,
          });
        });
        
        resolve(realm);

      }).catch(err => {
        console.log(err)

        reject(err);
      })
      
    } catch (error) { 
      reject(error);
    }
    
  })
}

 

 


