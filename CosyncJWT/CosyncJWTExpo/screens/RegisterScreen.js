//
//  RegisterScreen.js
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
//  Copyright © 2022 cosync. All rights reserved.
//

import React, { useState, useRef, useEffect, useContext } from 'react'; 
import {  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView, } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import Loader from '../components/Loader'; 
import { Dropdown } from 'react-native-element-dropdown';

const RegisterScreen = props => {
  
  let [errorcodetext, setErrorCodetext] = useState('');
  let [errortext, setErrortext] = useState('');
  let [infotext, setInfoText] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState(''); 
  let [signupCode, setSignupCode] = useState(''); 
  let [loading, setLoading] = useState(false);  
  let [userLocale, setUserLocale] = useState('EN');
  const ref_input_lastname = useRef();
  const ref_input_email = useRef();
  const ref_input_pwd = useRef(); 
  const ref_input_code = useRef(); 


  const { cosyncJWT, getApplication, register, appData, appLocales } = useContext(AuthContext)

  useEffect(() => {
    getApplication();
   
  }, []);

  const validateEmail = (text) => {
  
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
  }

  const validateForm = () => {
    if (!firstName) {
      alert('Please Fill First Name');
      return false;
    }

    if (!lastName) {
      alert('Please Fill Last Name');
      return false;
    }


    if (!userEmail) {
      alert('Please Fill Email');
      return false;
    }
    if (!validateEmail(userEmail)) {
      alert('Please Fill a valid email');
      return false;
    }

    if (!userPassword) {
      alert('Please Fill Password');
      return false;
    }

    if (!signupCode) {
      alert('Please Fill Invitation Code');
      return false;
    }
      
    if (userPassword.length < 5) {
      alert('Password must be at least 5 charactor.');
      return false;
    } 

    return true;
  }
 
  const handleSubmitPress = async () => {

    setErrortext('');
    setInfoText('');

    if(!validateForm()) return;
   
    
 
    let validate = cosyncJWT.password.validatePassword(userPassword);
    if(!validate){
      let message = `
          Error: Invalid Password Rules:\nMinimum password length : ${appData.passwordMinLength}
          Minimun upper case : ${appData.passwordMinUpper}
          Minimum lower case : ${appData.passwordMinLower}
          Minimum digit charactor : ${appData.passwordMinDigit}
          Minimum special charactor: ${appData.passwordMinSpecial}
        `;
        setErrortext(message);
        return;
    }

    setLoading(true);

    try {
      let metaData = {
        user_data : {
          name: {
              first: firstName,
              last: lastName
          }
        },
        email: userEmail
      };
      let result = await register(userEmail, userPassword, signupCode, metaData, userLocale);
      if(result.message) {
        setErrortext(`Error: ${result.message}`);
      }

    } catch (error) {
      
      console.log(error);
      setErrortext(`Error: ${error.message}`);
    }
    finally{
      setLoading(false); 
    }
    
  
    
  }; 
 

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
                onChangeText={value => setFirstName(value)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter First Name"
                autoCapitalize="none" 
                autoCorrect={false}
                keyboardType="default" 
                returnKeyType="next" 
                onSubmitEditing={() => ref_input_lastname.current.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={value => setLastName(value)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter Last Name"
                autoCapitalize="none" 
                autoCorrect={false}
                keyboardType="default" 
                returnKeyType="next" 
                onSubmitEditing={() => ref_input_email.current.focus()}
                blurOnSubmit={false}
                ref={ref_input_lastname}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={value => setUserEmail(value)} 
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
                placeholder="Enter Password"
                keyboardType="default" 
                returnKeyType="next" 
                blurOnSubmit={false}
                secureTextEntry={true}
                ref={ref_input_pwd}
                textContentType={'none'}
                autoComplete= {'off'}
                onSubmitEditing={() => ref_input_code.current.focus()}
              />
            </View> 

            <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={value => setSignupCode(value)} 
                  placeholder="Enter Invitation Code"
                  keyboardType="numeric" 
                  returnKeyType="go" 
                  blurOnSubmit={false} 
                  textContentType={'none'}
                  autoComplete= {'off'}
                  ref={ref_input_code}
                  onSubmitEditing={() => Keyboard.dismiss, handleSubmitPress}
                /> 

              </View> 

      {appLocales && appLocales.length > 1 ? 
       <View style={styles.viewSection}>
        <Text style={styles.textItem}>Set Localization</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}  
          data={appLocales} 
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Set Localization" 
          value={userLocale}
          onChange={item => {
            setUserLocale(item.value);
          }}
           
        />
       </View>
      : null
     
      }
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
export default RegisterScreen;

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
  dropdown: {
    margin: 16,
    height: 50,
    width: 150,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  } 
});