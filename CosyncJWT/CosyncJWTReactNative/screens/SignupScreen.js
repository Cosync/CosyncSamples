//
//  SignupScreen.js
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
 
import _ from 'lodash';
import Loader from '../components/Loader'; 
import { AuthContext } from '../context/AuthContext';
import { Dropdown } from 'react-native-element-dropdown';

const SignupScreen = props => {
  
  let [errorcodetext, setErrorCodetext] = useState('');
  let [errortext, setErrortext] = useState('');
  let [infotext, setInfoText] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState(''); 
  let [signupCode, setSignupCode] = useState(''); 
  let [loading, setLoading] = useState(false); 
  let [verifyCode, setVerifyCode] = useState(false);  
  let [userLocale, setUserLocale] = useState('EN');
  const { cosyncJWT, getApplication, appData, signup, signupComplete, appLocales } = useContext(AuthContext);

  const ref_input_lastname = useRef();
  const ref_input_email = useRef();
  const ref_input_pwd = useRef(); 


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

    return true;
  }

  const handleSubmitVerifyCodePress = async () => {
    setErrorCodetext('');
    setLoading(true);   

    try {
      let result = await signupComplete(userEmail, signupCode); 
      if (result && result.message) {
        setErrorCodetext(`Error: ${result.message}`);
      }
    } catch (error) { 
      setErrorCodetext(`Error: ${error.message}`);
    }
    finally{
      setLoading(false); 
    }
    

  }
 
  
  const handleSubmitPress = async () => {

    setErrortext('');
    setInfoText('');

    if(!validateForm()) return;
    
    let metaData = {
      user_data : {
        name: {
            first: firstName,
            last: lastName
        }
      },
      email: userEmail
    };
    
    let validate = cosyncJWT.password.validatePassword(userPassword);

    if(validate){

      try {

        setLoading(true);
        console.log(userLocale);
        let result = await signup(userEmail, userPassword, metaData, userLocale); 
         
        if(!result){
          setErrortext(`Error: Something went wrong.`);
        }
        else if(result === true){
          setInfoText(`Please check your email for account verification ${appData.signupFlow}.`); 
          if(appData.signupFlow == 'code') setVerifyCode(true); 
        }
        else if(result.jwt && appData.signupFlow == 'none'){  
          setInfoText('Successfully Signup.');
        }
        else if(result.message){
          setErrortext(`Error: ${result.message}`);
        }
        

      } catch (error) {
        setErrortext(`Error: ${error.message}`);
        
        console.error(error);
      } 
      finally{
        setLoading(false); 
      }

    }
    else {
      setLoading(false);  
      let message = `
        Error: Invalid Password Rules:\nMinimum password length : ${appData.passwordMinLength}
        Minimun upper case : ${appData.passwordMinUpper}
        Minimum lower case : ${appData.passwordMinLower}
        Minimum digit charactor : ${appData.passwordMinDigit}
        Minimum special charactor: ${appData.passwordMinSpecial}
      `;
      setErrortext(message);
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

            
            {infotext != '' ? (
              <Text style={styles.registerTextStyle}> {infotext} </Text>
            ) : null}

            
         

            {verifyCode ?<View> 
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  value=''
                  onChangeText={value => setSignupCode(value)} 
                  placeholder="Enter 6 digits Code"
                  keyboardType="numeric" 
                  returnKeyType="go" 
                  blurOnSubmit={false} 
                
                  onSubmitEditing={() => Keyboard.dismiss, handleSubmitVerifyCodePress}
                /> 

              </View> 

              {errorcodetext != '' ? (
              <Text style={styles.errorTextStyle}> {errorcodetext} </Text>
            ) : null}

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitVerifyCodePress}>
                <Text style={styles.buttonTextStyle}>SUBMIT</Text>
              </TouchableOpacity>

            </View> : 
            <View>
              <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={value => setFirstName(value)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter First Name" 
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
              <Text style={styles.buttonTextStyle}>SIGN UP</Text>
            </TouchableOpacity>

            </View>}

        </KeyboardAvoidingView>
      </ScrollView>
    </View>

  );
};
export default SignupScreen;

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
  viewSection: {  
    marginTop: 20, 
    marginBottom: 20,
    alignItems: "center",
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