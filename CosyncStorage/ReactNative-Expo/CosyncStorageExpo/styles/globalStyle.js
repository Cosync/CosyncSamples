//
//  globalStyle.js
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


import { StyleSheet } from 'react-native';

export const globalStyle = StyleSheet.create({
    container:{
        padding:24
    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    buttonStyle: {
        backgroundColor: '#4638ab',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: 'white',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: '#4638ab',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#4638ab',
    },
    viewSection: {  
        marginTop: 20, 
        marginBottom: 20,
        alignItems: "center",
    },
    sectionStyle: {
       // flexDirection: 'row',
        height: 40, 
        margin: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },

    infoTextStyle: {
        color: '#4638ab',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
   
    
})