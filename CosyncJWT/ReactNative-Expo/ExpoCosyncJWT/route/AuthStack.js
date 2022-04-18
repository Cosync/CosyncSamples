//
//  AuthStack.js
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


import { createStackNavigator } from '@react-navigation/stack';
import Register from '../screens/Register';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import React from 'react';
import Signup from '../screens/SignUp';

const Stack = createStackNavigator();

const AuthStack = () => {

    const screenOptions = {
        headerStyle:{
            backgroundColor: '#4638ab'
        },
        headerTintColor:'white',
        headerTitleStyle:{
            fontWeight:'bold'
        }
    };

    return (
        <Stack.Navigator screenOptions = {screenOptions}>
            
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="SignUp" component={Signup} />
            <Stack.Screen name = "ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
    )
}
export default AuthStack