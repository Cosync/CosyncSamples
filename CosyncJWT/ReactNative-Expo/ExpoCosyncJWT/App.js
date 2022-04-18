//
//  App.js
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



import { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './route/AppStack';
import AuthStack from './route/AuthStack' 
import AuthContextProvider, {AuthContext}  from './store/auth-context';


function Navigation(){
  
  const authCtx = useContext(AuthContext)
   
  return(
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack /> } 
      {authCtx.isAuthenticated && <AppStack /> } 
    </NavigationContainer>
  )

}

export default function App() {
 
  return (
    <>
      <StatusBar style='light' />

      <AuthContextProvider>
       <Navigation />
      </AuthContextProvider>
  </>
  );
}
   