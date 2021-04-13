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
import {  View,  StyleSheet,
    TextInput,
    Pressable,
    Text, } from 'react-native';
 
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "react-native-vector-icons/FontAwesome";

const FormCreator = props => {

    const { fieldDef, ...attributes } = props; 

    let [formField, setFormField] = useState([]);  

    console.log('FormCreator  ', fieldDef);

    let form =  <View style={styles.sectionChildStyle} key={Math.random().toString(36).substr(2, 9)}>
                  <TextInput key={ Math.random().toString(36).substr(2, 9) }
                    style={styles.inputChildStyle} 
                    placeholder={fieldDef.display}
                    autoCapitalize="none" 
                    returnKeyType="next"  
                    blurOnSubmit={false} 
                  />
                </View>;
  
          if(fieldDef.fieldType == "enum"){  
  
            let options = [];
            fieldDef.enumValues.map(value => (
                options.push( { label: value, value: value})
              )) 
            
  
            form = <View style={styles.sectionChildStyle} key={Math.random().toString(36).substr(2, 9)}>  
  
                    <RNPickerSelect style={pickerSelectStyles} 
                      placeholder={{ label: "Select your "+ fieldDef.display, value: null }}
                      onValueChange={(value) => console.log(value)}
                      items={options}
                    />
  
                </View>;
  
           
  
          }
          setFormField(prevItems => {
            return [...prevItems, form];
          });

        

      return (
        <View style={styles.modalBackground} key={ Math.random().toString(36).substr(2, 9) }>

          <Pressable key={ Math.random().toString(36).substr(2, 9) } style={[styles.button, styles.buttonClose]} >
            <Text style={styles.textStyle} key={ Math.random().toString(36).substr(2, 9) }>Hide Modal</Text>
        </Pressable>
        </View>
      );
    
  };

export default FormCreator;
  


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {  
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#2196f3',  
        borderRadius: 30,
        color: '#2196f3',
        paddingRight: 30, // to ensure the text is never behind the icon

    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
    lineStyle:{
        borderWidth: 0.5,
        borderColor: '#4638ab',
        margin: 10 
    },
    sectionChildStyle: {
        flexDirection: 'row',
        height: 40, 
        marginBottom: 20,
        marginLeft: 45,
        marginRight: 45 
    }, 
    sectionStyle: {
        flexDirection: 'row',
        height: 40, 
        marginBottom: 20,
        marginLeft: 35,
        marginRight: 35 
    },
});