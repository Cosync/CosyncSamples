 
//
//  ProfileScreen.js
//  CosyncJunctionSample
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

import React, { useState, useRef , useEffect} from 'react'; 
import {
  StyleSheet,
  SafeAreaView,
  View
  
} from 'react-native'; 
import InputText from "../components/InputText";
import EnumList from "../components/EnumList";
import ObjectField from '../components/ObjectField';
import uuid from 'react-native-uuid';


const FormScreen = (props) => {

  
  // {"navigation": {
  //   "actions": 
  //   {"closeDrawer": [Function closeDrawer], "dismiss": [Function dismiss], "goBack": [Function goBack], "navigate": [Function navigate], "openDrawer": [Function openDrawer], "pop": [Function pop], "popToTop": [Function popToTop], "push": [Function push], "replace": [Function replace], "reset": [Function reset], "setParams": [Function setParams], "toggleDrawer": [Function toggleDrawer]
  //   },
  //    "addListener": [Function addListener],
  //     "closeDrawer": [Function anonymous], 
  //     "dangerouslyGetParent": [Function anonymous], 
  //     "dismiss": [Function anonymous], 
  //     "dispatch": [Function anonymous], 
  //     "emit": [Function emit], 
  //     "getChildNavigation": [Function getChildNavigation], 
  //     "getParam": [Function anonymous], 
  //     "getScreenProps": [Function anonymous], 
  //     "goBack": [Function anonymous], 
  //     "isFirstRouteInParent": [Function isFirstRouteInParent], 
  //     "isFocused": [Function isFocused], 
  //     "navigate": [Function anonymous], 
  //     "openDrawer": [Function anonymous], 
  //     "pop": [Function anonymous], 
  //     "popToTop": [Function anonymous], 
  //     "push": [Function anonymous], 
  //     "replace": [Function anonymous], 
  //     "reset": [Function anonymous], 
  //     "router": undefined, 
  //     "setParams": [Function anonymous], 
  //     "state": {"key": "id-1620030249235-18", "routeName": "First"}, 
  //     "toggleDrawer": [Function anonymous]
  //   }, 
  //   "screenProps": undefined
  // }


  useEffect(() => {

  }, [])  


    console.log('FormScreen ', global.field );

    const index = 0;
    const fieldDef = global.field ;
    let form = [];
    
    const deleteFormItem = (f) => {
      props.deletedItem(f);
    }

    const goToChildField = (f) => {
      props.goToChildField(f);
    }
      
    if(fieldDef.fieldType != 'enum' && fieldDef.fieldType != 'object' && fieldDef.fieldType != 'array') form.push( < InputText item = {fieldDef} index = {index} deletedItem={deleteFormItem}/>  );
    else if(fieldDef.fieldType == 'enum') form.push( < EnumList item = {fieldDef} index = {index} deletedItem={deleteFormItem}/> );
    else if (fieldDef.arrayFieldType == 'enum' && fieldDef.fieldType == 'array') form.push( < EnumList item = {fieldDef} index = {index} deletedItem={deleteFormItem} /> );
    else if (fieldDef.arrayFieldType != 'enum' && fieldDef.arrayFieldType != 'object' && fieldDef.fieldType == 'array') form.push( < InputText item = {fieldDef} index = {index} deletedItem={deleteFormItem}/> );
    else if(fieldDef.fieldType == 'object' || fieldDef.arrayFieldType == 'object') form.push( < ObjectField fieldDef = {fieldDef} index = {index} deletedItem={deleteFormItem} goToChildField={goToChildField}/> );

    return (
       <SafeAreaView style={styles.container}>
         {form} 
      </SafeAreaView>
    );

  

   
   
};

export default FormScreen;
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 20
    
  },
  
});