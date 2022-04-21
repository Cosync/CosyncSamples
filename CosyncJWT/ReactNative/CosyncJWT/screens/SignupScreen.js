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
//  Copyright © 2020 cosync. All rights reserved.
//

import React, { useState, useRef, useEffect } from 'react'; 
import {  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView, } from 'react-native';
import Configure from '../config/Config';  
import CosyncJWTReactNative from 'cosync-jwt-react-native';  
import _ from 'lodash';
import Loader from '../components/Loader'; 
  

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
  
  const ref_input_lastname = useRef();
  const ref_input_email = useRef();
  const ref_input_pwd = useRef(); 

  global.realm = null;
  global.realmPrivate = null; 

  useEffect(() => {
    if(!global.cosync) global.cosync = new CosyncJWTReactNative(Configure.CosyncApp).getInstance();

    global.cosync.app.getApplication().then(result => {  
      global.appData = result;

      console.log('global.appData ', global.appData);

    });
   
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

  const handleSubmitVerifyCodePress = () => {
    setLoading(true);   

    
  
    global.cosync.signup.completeSignup(userEmail, signupCode).then(result => {

      setLoading(false); 
      
      if(result && result.jwt){
        
        global.userData = result;  
        setInfoText('Successfully Register.');  
        global.cosync.realmManager.login(result.jwt, Configure.Realm.appId).then(res => {
          setLoading(false);
          props.navigation.navigate('DrawerNavigationRoutes'); 
        })
        .catch(err => {
          setLoading(false);
          setErrortext(`MongoDB Realm Error: ${err.message}`);
        });
      }
      else{
        
        setErrorCodetext(`Error: ${result.message}`);
      }
    }).catch(err => { 

      setLoading(false); 
      setErrorCodetext(`Error: ${err.message}`);
    })
  }
 
  
  const handleSubmitPress = () => {

    setErrortext('');
    setInfoText('');

    if(!validateForm()){
      return;
    }

    setLoading(true);   
    
    let metaData = {
      user_data : {
        name: {
            first: firstName,
            last: lastName
        }
      },
      email: userEmail
    };
    
    let validate = global.cosync.password.validatePassword(userPassword);
    if(validate){ 
      global.cosync.signup.signup(userEmail, userPassword, metaData).then(result => { 

        setLoading(false); 
        
        if(result == 'true' || result === true){ 
         

          if(global.appData.signupFlow == 'none'){ 
            setInfoText('Successfully Register.');  
          }
          else{
            setInfoText(`Please check your email for account verification ${global.appData.signupFlow}`); 
            if(global.appData.signupFlow == 'code') setVerifyCode(true);
          }
          
        }
        else if(result && result.jwt && global.appData.signupFlow == 'none'){ 

          setLoading(true); 
          setInfoText('Successfully Register. Logging in to Realm now...');
      
          global.userData = result;  
          
          global.cosync.realmManager.login(result.jwt, Configure.Realm.appId).then(res => {
            setLoading(false);
            props.navigation.navigate('DrawerNavigationRoutes'); 
          })
          .catch(err => {
            setLoading(false);
            setErrortext(`MongoDB Realm Error: ${err.message}`);
          });
          

        }
        else if(result.message){
          setErrortext(`Error: ${result.message}`);
        }
        else  setErrortext(`Error: Something went wrong.`);
         
      }).catch(err => {
        setLoading(false); 
        console.log(err);
        setErrortext(`Error: ${err.message}`);
      })

    }
    else {
      setLoading(false);  
      let message = `
        Error: Invalid Password Rules:\nMinimum password length : ${global.cosyncAppData.passwordMinLength}
        Minimun upper case : ${global.cosyncAppData.passwordMinUpper}
        Minimum lower case : ${global.cosyncAppData.passwordMinLower}
        Minimum digit charactor : ${global.cosyncAppData.passwordMinDigit}
        Minimum special charactor: ${global.cosyncAppData.passwordMinSpecial}
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

            {verifyCode ?<View> 
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={value => setSignupCode(value)} 
                  placeholder="Enter Signupb Code"
                  keyboardType="numeric" 
                  returnKeyType="go" 
                  blurOnSubmit={false} 
                  textContentType={'none'}
                  autoComplete= {'off'}
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

            </View>: null}

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
});