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
import {  View,  StyleSheet,  KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/FontAwesome";
import InputText from "./InputText";
import EnumList from "./EnumList"; 

const ObjectField = props => {

    const { fieldDef, index, ...attributes } = props;  
    
    let form = [];
    
    const handleAddMoreField = (field) => {
      props.goToChildField(field);
    }
     
    fieldDef.properties.map((field, i) => {
      
      if(field.fieldType != 'enum' && field.fieldType != 'object' && field.fieldType != 'array'){
        form.push( < InputText item = {field}/> );
      } 
      else if(field.fieldType == 'enum') {
        form.push( < EnumList item = {field}/>);
      }
      else if (field.arrayFieldType == 'enum' && field.fieldType == 'array'){

        form.push( <TouchableOpacity onPress={() => handleAddMoreField(child)}  activeOpacity={0.5}>
                    <Text style={styles.titleText} key={ uuid.v4() } >
                      {field.display}: <Ionicons  name={"plus-circle"} color='#4638ab'  size={15} key={ uuid.v4() }/> 
                    </Text>
                  </TouchableOpacity>);
        form.push( < EnumList item = {field} index = {index} deletedItem={props.deletedItem} />);
      } 
      else if (field.arrayFieldType != 'enum' && field.arrayFieldType != 'object' && field.fieldType == 'array'){
        form.push( <TouchableOpacity onPress={() => handleAddMoreField(field)}  activeOpacity={0.5}>
                    <Text style={styles.titleText} key={ uuid.v4() } >
                      {field.display}: <Ionicons  name={"plus-circle"} color='#4638ab'  size={15} key={ uuid.v4() }/> 
                    </Text>
                  </TouchableOpacity>);
        form.push(< InputText item = {field} index = {index} deletedItem={props.deletedItem} />);
      } 
      else if(field.fieldType == 'object' || field.arrayFieldType == 'object'){
         
        form.push( < ObjectField fieldDef = {field}  deletedItem={props.deletedItem} />);
      } 

    }) 

    return (
      <View style={styles.mainBody} key = {uuid.v4() } >  
        <KeyboardAvoidingView enabled key = {uuid.v4() }> 
        
          <Text style={styles.titleText} key = {uuid.v4() } >
            {fieldDef.display}: {index}  {index > 0  ? <Ionicons key={ uuid.v4() } name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(fieldDef)}/> : null}
          </Text>

          <View style = {styles.container}  key = {uuid.v4() } >
            {form}
          </View>
        </KeyboardAvoidingView>
      </View>

    )
 
}


const styles = StyleSheet.create({
   
    mainBody: {
      flex: 1, 
      padding: 10,
    },
    container: { 
       
      paddingTop: 10,
    },
    titleText: {
      textAlign: 'left',
      padding: 10,
      fontSize: 14,
      fontWeight: 'bold', 
      marginLeft: 10,
      
    },
    sectionChildStyle: {
      flexDirection: 'row', 
      marginLeft: 45,
      marginRight: 45 
    },
});


export default ObjectField;