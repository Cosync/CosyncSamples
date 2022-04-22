//
//  Store.js
//  CosyncJWT
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



import React, { createContext, useState } from "react"; 
 
export const AuthContext = createContext({
    userId: "",
    isAuthenticated: false,
    authenticate: (auth) => {},
    logout:() => {}
})

function AuthContextProvider({children}){

    const [userId, setUserId] = useState()
    

    function authenticate(id){
       setUserId(id) 
    }

    function logout(){
        setUserId(null) 

    }

    const value = {
        userId: userId,
        isAuthenticated: !!userId,
        authenticate: authenticate,
        logout: logout
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;