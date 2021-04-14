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
import InputText from "./InputText";
import EnumList from "./EnumList";
import ObjectField from './ObjectField';

const FormCreator = props => {

    const { fieldDef, index, ...attributes } = props; 
    //const [childFormField, setChildFormField] = useState([]); 
    console.log('FormCreator indexindexindexindexindex ', index );

    const [childForm, setChildFormField] = useState(null);

    let form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 11) }>
        <TextInput key={ Math.random().toString(36).substr(2, 9) }
          style={styles.inputStyle} 
          placeholder={fieldDef.display}
          autoCapitalize="none" 
          returnKeyType="next"  
          blurOnSubmit={false} 
        />
      {index > 0  ? <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(fieldDef)}/> : null }
    </View>;

    if(fieldDef.fieldType == "enum"){

      let options = [];
      fieldDef.enumValues.map(value => (
        options.push( { label: value, value: value})
      )) 


      form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

            <RNPickerSelect style={pickerSelectStyles} 
              placeholder={{ label: "Select your "+ fieldDef.display, value: null }}
              onValueChange={(value) => console.log(value)}
              items={options}
              Icon={() => {
                return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
              }}
            />
              {index > 0  ? <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(field)}/> : null}
        </View>; 

      // setChildFormField(prevItems => {
      //   return [...prevItems, form];
      // });
    }
    else if(fieldDef.fieldType == "object"){  

      form =  <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
          <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
            {fieldDef.display}:
          </Text>
          {index > 0  ? <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(field)}/> : null}
        </View>;


      // setChildFormField(prevItems => { 
      //   return [...prevItems, form];

      // }); 

    }
    else if(fieldDef.fieldType == "array"){  

      form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 11) }>
        <TextInput key={ Math.random().toString(36).substr(2, 9) }
          style={styles.inputStyle} 
          placeholder={fieldDef.display}
          autoCapitalize="none" 
          returnKeyType="next"  
          blurOnSubmit={false} 
        /> 
      </View>;

      if(fieldDef.arrayFieldType == "enum"){

        let options = [];
        fieldDef.enumValues.map(value => (
          options.push( { label: value, value: value})
        )) 
        

        form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

                <RNPickerSelect style={pickerSelectStyles} 
                  placeholder={{ label: "Select your "+ fieldDef.display, value: null }}
                  onValueChange={(value) => console.log(value)}
                  items={options}
                  Icon={() => {
                    return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
                  }}
                /> 
                  {index > 0  ? <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(fieldDef)}/> : null}
            </View>; 

        // setChildFormField(prevItems => {
        //   return [...prevItems, form];
        // });

        
      }
      else if(fieldDef.arrayFieldType == "object"){  


        form = <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
                <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                  {fieldDef.display} {index + 1}: 
                </Text>
                {index > 0  ?  <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(fieldDef) }/> : null}
              </View>;

        // setChildFormField(prevItems => { 
        //   return [...prevItems, form]; 
        // }); 
        

        // let line = <View  key={ Math.random().toString(36).substr(2, 9) }style={styles.lineStyle} />;
        // setChildFormField(prevItems => { 
        //   return [...prevItems, line];
        // });

      }
      else{
        // setChildFormField(prevItems => {
        //   return [...prevItems, form];
        // });
      }

    }
    else{
      // setChildFormField(prevItems => {
      //   return [...prevItems, form];
      // });
    }
    
   

    return (
      <View style={styles.SectionStyle} key={ fieldDef.id }>
        {fieldDef.fieldType != 'enum' && fieldDef.fieldType != 'object' && fieldDef.fieldType != 'array' ?  (< InputText item = {fieldDef}/> ) : null }
        {fieldDef.fieldType == 'enum' ?  (< EnumList item = {fieldDef}/>) : null }

        {/* {fieldDef.arrayFieldType != 'enum' && fieldDef.arrayFieldType != 'object' && fieldDef.arrayFieldType != 'array' ?  (< InputText item = {fieldDef}/> ) : null }
        {fieldDef.arrayFieldType == 'enum' ?  (< EnumList item = {fieldDef}/>) : null } */}

        {fieldDef.fieldType == 'object' || fieldDef.fieldType == 'array'?  (< ObjectField item = {fieldDef}/>) : null }
        
        {index > 0  ? <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(fieldDef)}/> : null}
         
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
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  headerSectionStyle: {
    flexDirection: 'row', 
    marginBottom: 20,
    marginLeft: 20,
    
  },


  SectionChildStyle: {
    flexDirection: 'row',
    height: 40, 
    marginBottom: 20,
    marginLeft: 45,
    marginRight: 45 
  },

  SectionStyle: {
    flexDirection: 'row',
    height: 40, 
    marginBottom: 20,
    marginLeft: 35,
    marginRight: 35 
  },

  lineStyle:{
    borderWidth: 0.5,
    borderColor: '#4638ab',
    margin: 10 
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
  inputChildStyle: {
    flex: 1,
    color: '#2196f3',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#2196f3',
  },
  breadCrumbTextStyle: {
    color: '#4638ab',
    
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 20,
  },
  headerTextStyle: {
    color: '#4638ab',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 20,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});