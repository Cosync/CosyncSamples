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

//Import all required component
import {  View,  StyleSheet} from 'react-native';
  
import InputText from "./InputText";
import EnumList from "./EnumList";
import ObjectField from './ObjectField';
import uuid from 'react-native-uuid';

const FormCreator = props => {

    const { fieldDef, index, ...attributes } = props;  
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
      <View key = {uuid.v4() }>
         {form} 
      </View>
    );
    
};

export default FormCreator;
   
 