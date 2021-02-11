//
//  RegisterScreen.js
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

import React, { useState, useRef } from 'react';
import AsyncStorage from '@react-native-community/async-storage'; 
import {  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView, } from 'react-native';

import * as RealmLib from '../managers/RealmManager'; 
import Loader from '../components/Loader'; 
 
import Configure from '../config/Config'; 

const Register = props => {
  
  let [errortext, setErrortext] = useState('');
  let [infotext, setInfoText] = useState('');
  let [userDisplayName, setUserDisplayName] = useState('');
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState(''); 
  let [loading, setLoading] = useState(false); 
  const ref_input_email = useRef();
  const ref_input_pwd = useRef(); 

  global.realm = null;
  global.realmPrivate = null;
   

  const validateEmail = (text) => {
  
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
  }

  const validateForm = () => {
    if (!userDisplayName) {
      alert('Please fill Display Name');
      return false;
    }

    if (!userEmail) {
      alert('Please fill Email');
      return false;
    }
    if (!validateEmail(userEmail)) {
      alert('Please fill a valid email');
      return false;
    }

    if (!userPassword) {
      alert('Please fill Password');
      return false;
    }
      
    if (userPassword.length < 6) {
      alert('Password and Confirmed Password must be at least 6 charactor.');
      return false;
    } 

    return true;
  }

  
  const handleSubmitPress = () => {

    setErrortext('');
    setInfoText('');

    if(!validateForm()){
      return;
    }

    setLoading(true);   
    
  
    RealmLib.signup(userEmail, userPassword).then(result => {

      if(result === true){ 
        
        RealmLib.login(userEmail, userPassword).then(user => {
          AsyncStorage.setItem('user_id', user.id);  

          createProfile(userDisplayName, userEmail).then(res => {
            
          });

        }).catch(err => {
          setLoading(false);   
          setErrortext(`Error: ${err.message}`);
        })
      }
      else{
        setLoading(false);   
        setErrortext(`Error: ${result.message}`);
      }
    }); 
    
  };


  const createProfile = (name, email) => {

    return new Promise((resolve, reject) => { 
      setInfoText('Creating your profile...');

      RealmLib.openRealm().then(realm => {
        props.navigation.navigate('DrawerNavigationRoutes');
      }).catch(err => {
        setErrortext(`Error: ${err.message}`);
        setLoading(false);
      })
    })
  }

   

 

  return (
    <View style={styles.mainBody}>  
      <Loader loading={loading} />
      <ScrollView keyboardShouldPersistTaps="handled"> 
      <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/cosynclogo.png')}
                style={{ 
                  height: 200,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={value => setUserDisplayName(value)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter Display Name"
                autoCapitalize="none" 
                autoCorrect={false}
                keyboardType="default" 
                returnKeyType="next" 
                onSubmitEditing={() => ref_input_email.current.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={value => setUserEmail(value)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter Email"
                autoCapitalize="none" 
                autoCorrect={false}
                keyboardType="email-address" 
                returnKeyType="next" 
                onSubmitEditing={() => ref_input_pwd.current.focus()}
                blurOnSubmit={false}
                ref={ref_input_email}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={value => setUserPassword(value)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter Password"
                keyboardType="default" 
                returnKeyType="go" 
                blurOnSubmit={false}
                secureTextEntry={true}
                ref={ref_input_pwd}
                textContentType={'none'}
                autoComplete= {'off'}
                onSubmitEditing={() => Keyboard.dismiss, handleSubmitPress}
              />
            </View>
 

            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>REGISTER</Text>
            </TouchableOpacity>

            {infotext != '' ? (
              <Text style={styles.registerTextStyle}> {infotext} </Text>
            ) : null}

        </KeyboardAvoidingView>
      </ScrollView>
    </View>

  );
};
export default Register;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
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
  registerTextStyle: {
    color: '#4638ab',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});