 
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
  TextInput,
  View, 
  Text,
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'; 
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from "react-native-picker-select";
 
import Loader from '../components/Loader'; 
import Configure from '../config/Config'; 
import * as RealmLib from '../managers/RealmManager';  

const ProfileScreen = props => {
  let [formFeilds, setFormField] = useState([]); 
  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState('');
   

  global.appId = Configure.Realm.appId; 
  AsyncStorage.setItem('appId', global.appId);  

  useEffect(() => { 
     
    setFormField(prevItems => { 
      return [];
    }); 
    openRealm();

    async function openRealm(){ 
      await RealmLib.openRealm();   
      let results = await global.realm.objects("UserSchema"); 
      
      results.forEach(element => { 

        element.userProfile.forEach(field => { 

            if(field.fieldType == 'object' || field.fieldType == 'array' ){

              let form =  <View style={styles.SectionStyle} key={field._id.toString()}>
                            <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                               {field.display}:
                            </Text>
                          </View>;

              setFormField(prevItems => { 
                return [...prevItems, form];
              });

              if( field.fieldType == 'array'){

                if(field.arrayFieldType == 'object') getFieldDefChildren(field); 
                else{
                  let form = <View style={styles.SectionStyle} key={field._id.toString()}>
                  <TextInput key={ Math.random().toString(36).substr(2, 9) }
                    style={styles.inputStyle} 
                    placeholder={field.display}
                    autoCapitalize="none" 
                    returnKeyType="next"  
                    blurOnSubmit={false} 
                  />
                </View>;

                if(field.fieldType == "enum"){  

                  let options = [];
                  field.enumValues.map(value => (
                    options.push( { label: value, value: value})
                  )) 
                  form = <View style={styles.SectionStyle} key={field._id.toString()}> 

                          <Text>{field.display}: </Text>
                                      
                          <RNPickerSelect
                            placeholder={{ label: "Select your "+ field.display, value: null }}
                            onValueChange={(value) => console.log(value)}
                            items={options}
                        />

                      </View>;
                }

                setFormField(prevItems => { 
                  return [...prevItems, form];
                });
              }
            }
            else getFieldDefChildren(field); 

            }
            else{

              let form = <View style={styles.SectionStyle} key={field._id.toString()}>
                          <TextInput key={ Math.random().toString(36).substr(2, 9) }
                            style={styles.inputStyle} 
                            placeholder={field.display}
                            autoCapitalize="none" 
                            returnKeyType="next"  
                            blurOnSubmit={false} 
                          />
                        </View>;

              if(field.fieldType == "enum"){  

                let options = [];
                field.enumValues.map(value => (
                  options.push( { label: value, value: value})
                ))
                

                form = <View style={styles.SectionStyle} key={field._id.toString()}> 

                        <Text>{field.display}: </Text>
                                    
                        <RNPickerSelect
                          placeholder={{ label: "Select your "+ field.display, value: null }}
                          onValueChange={(value) => console.log(value)}
                          items={options}
                      />

                    </View>;
              }

              setFormField(prevItems => { 
                return [...prevItems, form];
              });

            };

            
        });

      });


    }
  }, [])

 
  async function getFieldDefChildren(fieldDef){


    fieldDef.properties.forEach(child => {

    
      if(child.fieldType == 'object' || child.fieldType == 'array' ){
        let form;
        let line = <View  key={ Math.random().toString(36).substr(2, 9) }
          style={styles.lineStyle}
        />;

        setFormField(prevItems => { 
          return [...prevItems, line];
        });

        
        if(child.fieldType == 'array' && child.arrayFieldType != 'object'){
        

          form =  <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) } >
                    <TouchableOpacity onPress={() => handleAddMoreField(child)}  activeOpacity={0.5}>
                      <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) } >
                        {child.display}: (+Add)
                      </Text>
                    </TouchableOpacity>
                  </View>;

          setFormField(prevItems => { 
            return [...prevItems, form];
          }); 

          form =  <View style={styles.SectionChildStyle} key={child._id.toString()}>
                <TextInput key={ Math.random().toString(36).substr(2, 9) }
                  style={styles.inputChildStyle} 
                  placeholder={child.display}
                  autoCapitalize="none" 
                  returnKeyType="next"  
                  blurOnSubmit={false} 
                />
              </View>;

          if(child.fieldType == "enum"){

            let options = [];
            child.enumValues.map(value => (
              options.push( { label: value, value: value})
            ))

            form = <View style={styles.SectionChildStyle} key={child._id.toString()}>  

                    <RNPickerSelect style={pickerSelectStyles} 
                      placeholder={{ label: "Select your "+ child.display, value: null }}
                      onValueChange={(value) => console.log(value)}
                      items={options}
                    />

                </View>;

          } 

          setFormField(prevItems => {
            return [...prevItems, form];
          });

        } 
        else{
          form =  <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) } >
                      <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                      {child.display}:
                      </Text>
                    </View>;

          setFormField(prevItems => { 
            return [...prevItems, form];
          });
          getFieldDefChildren(child); 

        }
      } 
      else {
        let form =  <View style={styles.SectionChildStyle} key={child._id.toString()}>
                <TextInput key={ Math.random().toString(36).substr(2, 9) }
                  style={styles.inputChildStyle} 
                  placeholder={child.display}
                  autoCapitalize="none" 
                  returnKeyType="next"  
                  blurOnSubmit={false} 
                />
              </View>;

        if(child.fieldType == "enum"){  

          let options = [];
            child.enumValues.map(value => (
              options.push( { label: value, value: value})
            )) 
          

          form = <View style={styles.SectionChildStyle} key={child._id.toString()}>  

                  <RNPickerSelect style={pickerSelectStyles} 
                    placeholder={{ label: "Select your "+ child.display, value: null }}
                    onValueChange={(value) => console.log(value)}
                    items={options}
                  />

              </View>; 

        } 

        setFormField(prevItems => {
          return [...prevItems, form];
        });
        
      }
    });

    return;

  }


  const handleAddMoreField = (field) => { 
    
    let  form =  <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>
                  <TextInput key={ Math.random().toString(36).substr(2, 9) }
                    style={styles.inputChildStyle} 
                    placeholder={field.display}
                    autoCapitalize="none" 
                    returnKeyType="next"  
                    blurOnSubmit={false} 
                  />
                </View>;
                
     setFormField(prevItems => {
      return [...prevItems, form];
    });

   

  }


  const validateEmail = (text) => {
   
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
  }


  
  
  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!validateEmail(userEmail)) {
      alert('Please fill a valid email');
      return;
    }

    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    
    AsyncStorage.setItem('user_email', userEmail);  
    AsyncStorage.setItem('user_password', userPassword); 

    setLoading(true);  

    RealmLib.login(userEmail, userPassword).then(user => {
     
      AsyncStorage.setItem('user_id', user.id);
      //props.navigation.navigate('AssetScreen'); 
      props.navigation.navigate('DrawerNavigationRoutes'); 
      
    }).catch(err => {
      setLoading(false);
      setErrortext(err.message);
    }) 
     
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      
      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{ marginTop: 100 }}>
          <KeyboardAvoidingView enabled>
           
          <Text style={styles.headerTextStyle}>
            Update your profile
          </Text>
                     
        {
         formFeilds
        }
        
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>Submit</Text>
            </TouchableOpacity>

            

          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default ProfileScreen;

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
   
});