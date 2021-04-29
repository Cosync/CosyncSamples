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
import React from 'react'; 
import uuid from 'react-native-uuid';
//Import all required component
import {  View,  StyleSheet,  TextInput } from 'react-native';
import Ionicons from "react-native-vector-icons/FontAwesome";

const InputText = props => {

    const { item, index, ...attributes } = props;

    return(
        <View style={styles.sectionStyle}  key = {uuid.v4() }>

            <TextInput key = { uuid.v4() }
                style={styles.inputStyle} 
                placeholder={item.display}
                autoCapitalize="none" 
                returnKeyType="next"  
                blurOnSubmit={false} 
            />
            {index > 0 ? 
                <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(item)} style={styles.deletedStyle}/> 
            : null}
        </View>
         
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
    sectionStyle: {
        flexDirection: 'row',
        height: 40, 
        marginBottom: 20,
        marginLeft: 35,
        marginRight: 35 
    },
    deletedStyle : {
        marginTop: 8,
        marginLeft: 3,
    }
});


export default InputText;