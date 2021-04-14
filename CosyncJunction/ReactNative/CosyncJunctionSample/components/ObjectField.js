//
//  FormCreator.js
//  CosyncStorageSample
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

//Import React and Hook we needed
import React, { useState} from 'react'; 

//Import all required component
import {  View,  StyleSheet,  TextInput } from 'react-native';
  

const ObjectField = props => {

    const { item, index, ...attributes } = props; 

    return(
        
        <TextInput key={ Math.random().toString(36).substr(2, 9) }
            style={styles.inputStyle} 
            placeholder={item.display}
            autoCapitalize="none" 
            returnKeyType="next"  
            blurOnSubmit={false} 
        />
            
         
    )
}


const styles = StyleSheet.create({
    inputStyle: {
        flex: 1,
        color: '#4638ab',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#4638ab',
      },
});


export default ObjectField;