
//
//  AuthContext.js
//  CosyncStorageReactNative
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
//  Copyright © 2022 cosync. All rights reserved.
//

import React, {createContext, useState, useEffect} from "react";
import { Realm } from '@realm/react';
import Schema from '../config/Schema';
import Configure from '../config/Config';

export const AuthContext = createContext();
  

export function AuthProvider({ children }) { 

    const [realmUser, setRealmUser] = useState();
    const [realmApp, setRealmApp] = useState();
    const [realm, setRealm] = useState();
    let user, realmObj;

    useEffect(() => {

        let isMounted = true;
        if (isMounted) initRealm();

        return () => {
            isMounted = false; 
        }
    }, []);

    
    function initRealm(){ 
        const appConfig = {
            id:  Configure.Realm.appId,
            timeout: 10000,
        }; 
        const app = new Realm.App(appConfig);  
        setRealmApp(app); 

        console.log("init Realm Application....");
         
    }

    function openRealm(){

        return new Promise((resolve, reject) => { 
            console.log("openRealm function ", realm);

            // if(realm){
            //     console.log("realm is already exists ", realm); 
            //     return Promise.resolve(realm);
            // } 
        
            try {
        
                console.log("opening realm.....");

                Realm.open({
                    schema: [Schema.CosyncAsset, Schema.CosyncAssetUpload],
                    sync: {
                        user: user,
                        flexible: true,
                    },
                }).then(realmResult => {
                    realmObj = realmResult;
                    setRealm(realmResult);

                    console.log("Realm is opened.");
                    realmResult.subscriptions.update((mutableSubs) => {
                    
                        mutableSubs.add(realmResult.objects(Configure.Realm.cosyncAssetUpload).filtered(`userId == '${user.id}'`), {
                            name: "cosyncAssetUploadSubscription",
                            throwOnUpdate: true,
                        });
                
                        console.log("Realm add cosyncAssetUploadSubscription.");

                        mutableSubs.add(realmResult.objects(Configure.Realm.cosyncAsset), {
                            name: "cosyncAssetSubscription",
                            throwOnUpdate: true,
                        });

                        console.log("Realm add cosyncAssetSubscription.");
                    });
                
                    resolve(realmResult);
        
                }).catch(err => {
                
                    console.error(err)
                    reject(err)
                })
                
            } catch (error) { 
                console.error(error)
                reject(error);
            }
            
        
        })
       
    }

    

    async function login(email, password) {  
        return new Promise((resolve, reject) => { 
            try {

                console.log("login realm ");

                //closeRealm(); 

                const credentials = Realm.Credentials.emailPassword(email, password);
                realmApp.logIn(credentials).then(u => {
                    user = u;

                    openRealm().then(r => {
                        setRealmUser(user);
                        console.log("logging in realm user...", user.id);
                        resolve(user)
                    });
                     
                }).catch(err => {
                    console.log("logging in err...", err);
                    reject(err)
                })
            
                
               

            } catch (error) {

                console.log("logging in error...", error);

                reject(error); 
            }
        
        })
       
    }

    
    
    async function register(email, password){
        return new Promise((resolve, reject) => { 
       
            if(realmApp.currentUser) realmApp.currentUser.logOut(); 
            realmApp.emailPasswordAuth.registerUser({ email, password }).then(result => { 
                resolve(result)
            }).catch(err => {
                reject(err)
            }) 
        })
        
    }

    async function closeRealm() { 
        try {
            
        
            if(realm){
                
                await realm.subscriptions.update((mutableSubs) => {
                    mutableSubs.removeAll();
                });
            
                realm.close();  
                setRealm();

                console.log("closeRealm is done ");
                return true;
            } 
            
            
        } catch (error) {
            console.log("closeRealm...error ", error);
        }
    }
      
      

    async function logout() {
        try {
            realmUser.logOut();
            setRealmUser();
            

        } catch (error) {
            console.log("logout...error ", error);
        }
        
       
        
    }


    const value = { 
        register,
        login,
        logout,
        openRealm,
        setRealmUser,
        realmUser,
        realm,
        realmApp
      }

      
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}