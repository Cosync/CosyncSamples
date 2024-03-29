 
//
//  PasswordScreen.js
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
//     http://www.fapache.org/licenses/LICENSE-2.0
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

import React, {useEffect, useState, useRef, useContext } from 'react'; 
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native'; 
import Loader from '../components/Loader'; 
 
import { AuthContext } from '../context/AuthContext';

const PasswordScreen = props => { 

  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState(''); 
  let [infotext, setInfotext] = useState('');
 
  let [userPassword, setUserPassword] = useState('');
  let [newUserPassword, setNewUserPassword] = useState('');

  const { logout, getApplication, cosyncJWT, appData } = useContext(AuthContext);

  const ref_input_pwd = useRef(); 
 
  useEffect(() => {
    getApplication() 
  }, []);

  const logoutUser = () => {
    Alert.alert(
      'Logout',
      'Are you sure? You want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: () => {  
            logout()
          },
        },
      ],
      { cancelable: false }
    );
  }

  const handleResetPassword = () => {
    
    setErrortext('');
    setInfotext('');

    if (!userPassword) {
      alert('Please fill current password');
      return;
    }
    if (!newUserPassword) {
      alert('Please fill new password');
      return;
    } 


    let validate = cosyncJWT.password.validatePassword(newUserPassword);
    if(!validate){
      let message = `
          Error: Invalid Password Rules:\nMinimum password length : ${appData.passwordMinLength}
          Minimun upper case : ${appData.passwordMinUpper}
          Minimum lower case : ${appData.passwordMinLower}
          Minimum digit charactor : ${appData.passwordMinDigit}
          Minimum special charactor: ${appData.passwordMinSpecial}
        `;
        setErrortext(message);
       
    }
    else{ 
      setLoading(true);  
      
      cosyncJWT.password.changePassword(userPassword, newUserPassword).then(result => {

        setUserPassword(' ');
        setNewUserPassword(' ');

        setLoading(false);
        console.log('CosyncJWT PasswordScreen result  ', result);
        if(result == true) setInfotext('Your password has been set.');
        if(result.message) setErrortext(result.message);

        

      }).catch(err => {
        setLoading(false);
        console.log('CosyncJWT PasswordScreen err  ', err);
        setErrortext(err.message);
      }) 
    }
  };


 

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      
      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{ marginTop: 100 }}>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.registerTextStyle}> Change your password </Text>
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                  style={styles.inputStyle}
                  onChangeText={value => setUserPassword(value)} 
                  placeholder="Enter current password"
                  blurOnSubmit={false}
                  secureTextEntry={true} 
                  textContentType={'none'}
                  autoComplete= {'off'} 
                  onSubmitEditing={() => ref_input_pwd.current.focus()}
                /> 
            </View>

            <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={value => setNewUserPassword(value)} 
                  placeholder="Enter new password"
                  blurOnSubmit={false}
                  secureTextEntry={true} 
                  textContentType={'none'}
                  autoComplete= {'off'}
                  ref={ref_input_pwd}
                  onSubmitEditing={() => handleResetPassword}
                /> 
            </View> 

            {infotext != '' ? (
              <Text style={styles.registerTextStyle}> {infotext} </Text>
            ) : null} 

            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}


            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleResetPassword}>
                <Text style={styles.buttonTextStyle}>SUBMIT</Text>
            </TouchableOpacity> 


            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={logoutUser}>
                <Text style={styles.buttonTextStyle}>LOG OUT</Text>
            </TouchableOpacity> 

          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default PasswordScreen;

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