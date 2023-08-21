
//
//  AuthContext.js
//  CosyncJWTExpo
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



import React, {createContext, useState, useEffect} from "react"
import Configure from '../config/Config';  
import CosyncJWTReactNative from 'cosync-jwt-react-native';  
import * as Crypto from 'expo-crypto';

export const AuthContext = createContext();
  

export function AuthProvider({ children }) {

    const [userTokenData, setUserTokenData] = useState() 
    const [loginToken, setLoginToken] = useState() 
    const [userData, setUserData] = useState() 
    const [appData, setAppData] = useState()  
    const [realmUser, setRealmUser] = useState() 
    const [appLocales, setAppLocales] = useState([]); 
    const cosyncJWT = new CosyncJWTReactNative(Configure.CosyncApp).getInstance();

    useEffect(() => {
        getApplication();
    }, []);

    async function getApplication() {
        cosyncJWT.app.getApplication().then(result => {  
            setAppData(result) 

            setAppLocales(prevItems => { 
                return [];
            }); 

            console.log('AuthContext getApplication ', result);

            if(result.locales) {
                result.locales.map( item => {
                    let locale = {label: item, value: item};
                    setAppLocales(prevItems => { 
                        return [locale , ...prevItems];
                    });
                })
            } 


        }).catch(err => {
          
          alert(`Invalid Data: ${err.message}`)
        })
    }

    async function loginAnonymous(){
        
        try {

            let id = Crypto.randomUUID();
            let result = await cosyncJWT.login.loginAnonymous(`ANON_${id}`); 

            if(result.jwt) loginJWT(result);

            return Promise.resolve(result);

        } catch (error) {
            return Promise.reject(error);
        }
       
    }

    

    async function login(userEmail, userPassword) { 
        try {
        
            let result = await cosyncJWT.login.login(userEmail, userPassword)
            if(result.jwt){
                loginJWT(result);
            }
            else if (result['login-token']){
                setLoginToken(result['login-token']);
            }

            return Promise.resolve(result);

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async function loginComplete(loginCode){
        try {
            let result = await cosyncJWT.login.loginComplete(loginToken, loginCode);
            if(result.jwt){
                loginJWT(result);
            }

            return Promise.resolve(result);

        } catch (error) {
            return Promise.reject(error);
        }
    }

    
    async function signup(userEmail, userPassword, metaData){
        try {
            let result = await cosyncJWT.signup.signup(userEmail, userPassword, metaData); 
            if(result && result.jwt && appData.signupFlow == 'none'){ 
                loginJWT(result)
            }

            return Promise.resolve(result);

        } catch (error) {

            return Promise.reject(error);
        }
        
    }

    async function signupComplete(userEmail, signupCode){
        try {
            let result = await cosyncJWT.signup.completeSignup(userEmail, signupCode);
            if(result && result.jwt && appData.signupFlow == 'none'){ 
                loginJWT(result)
            }

            return Promise.resolve(result);

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async function loginJWT(tokenData){

        let user = await cosyncJWT.realmManager.login(tokenData.jwt, Configure.Realm.appId); 
        setRealmUser(user)
        console.log("get realm user ", user.id); 
        let data = await cosyncJWT.profile.getUser();
        setUserData(data);
        console.log("get user data ", data); 

        setUserTokenData(tokenData);
        console.log("get user jwt ", tokenData);
        
    }

    async function register(userEmail, userPassword, inviteCode, metaData){
        try {
            let result = await cosyncJWT.register.register(userEmail, userPassword, inviteCode, metaData);
            if(result && result.jwt){ 
                loginJWT(result)
            }

            return Promise.resolve(result);

        } catch (error) {
            return Promise.reject(error);
        }
    }


    function logout() {
        setUserData();
        setUserTokenData();
        cosyncJWT.realmManager.logout();
    }


    const value = { 
        cosyncJWT,
        login, 
        logout, 
        register,
        signup,
        signupComplete,
        loginAnonymous,
        loginComplete,
        getApplication,
        loginToken,
        userData,
        userTokenData,
        appData,
        appLocales,
        realmUser
      }

      
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}