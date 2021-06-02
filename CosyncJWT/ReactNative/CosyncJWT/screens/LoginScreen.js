 
//
//  LoginScreen.js
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

import React, {useEffect, useState, useRef } from 'react'; 
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'; 
import Loader from '../components/Loader'; 
import Configure from '../config/Config';  
import CosyncJWTReactNative from 'cosync-jwt-react-native'; 
import * as Realm from '../managers/RealmManager';  

const LoginScreen = props => {
  
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [loading, setLoading] = useState(false);
  let [isCompleteLogin, setCompleteLogin] = useState(false);
  let [loginCode, setLoginCode] = useState('');
  let [twoFactorText, setTwoFactorText] = useState('Enter SMS verification code');

  let [errortext, setErrortext] = useState('');
  const ref_input_pwd = useRef(); 

 
  
  let cosync = new CosyncJWTReactNative(Configure.CosyncApp);

  useEffect(() => {
    cosync.app.getApplication().then(result => {  
      global.appData = result;
      if(result.twoFactorVerification == 'google') setTwoFactorText('Enter Auth token verification code');
    }).catch(err => {
      
      alert(`Invalid Data: ${err.message}`)
    })
   
  }, []);


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
 
    setLoading(true);  

    if(isCompleteLogin){

      if (!loginCode) {
        alert('Please fill login code');
        return;
      } 

      completeLogin();
      return;
    }

    

    cosync.login.login(userEmail, userPassword).then(result => { 

      console.log('CosyncJWT login result  ', result);
      
      global.userData = result;  
      

      if(result.code){ 
        
        setErrortext(result.message);
        return;
      }
      else if(result['login-token']){  
        
        setCompleteLogin(true); 
        return;
      } 
 

      cosync.profile.getUser().then(data => {  
        global.userData.data = data;  

        cosync.realmManager.login(global.userData.jwt, Configure.Realm.appId).then(res => {
          props.navigation.navigate('DrawerNavigationRoutes');

          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          setErrortext(`MongoDB Realm Error: ${err.message}`);
        })

      }); 
      
    }).catch(err => {
      setLoading(false);
      setErrortext(err.message);
    }) 
  };



  const completeLogin = () => {

    setLoading(true);  
    
    cosync.login.loginComplete(global.userData['login-token'], loginCode).then(result => {
      console.log('completeLogin', result);

      if(result.code){
        setLoading(false);
        setErrortext(result.message);
        return;
      }
      else if(result.jwt){
        setCompleteLogin(true);
        global.userData = result;  
        
        cosync.profile.getUser().then(data => {
          global.userData.data = data; 

          cosync.realmManager.login(result.jwt, Configure.Realm.appId).then(res => {
            setLoading(false);
            props.navigation.navigate('DrawerNavigationRoutes');
          })
          .catch(err => {
            setLoading(false);
            setErrortext(`MongoDB Realm Error: ${err.message}`);
          })
        });
      }
      else{
        setErrortext('Invalid Data');
      }

      
    }).catch(err => {
      setErrortext('Invalid Data');
      setLoading(false);
      console.log('completeLogin err', err);
    })
  }
 
  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      
      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{ marginTop: 100 }}>
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
                onChangeText={UserEmail => setUserEmail(UserEmail)} 
                placeholder="Enter Email"
                autoCapitalize="none" 
                autoCorrect={false}
                keyboardType="email-address" 
                returnKeyType="next" 
                onSubmitEditing={() => ref_input_pwd.current.focus()}
                blurOnSubmit={false}
                
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)} 
                placeholder="Enter Password" 
                keyboardType="default" 
                returnKeyType="go"
                onSubmitEditing={() => Keyboard.dismiss, handleSubmitPress}
                blurOnSubmit={false}
                textContentType={'none'}
                autoComplete= {'off'}
                secureTextEntry={true}
                ref={ref_input_pwd}
              />
            </View>

            {
              isCompleteLogin ? <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={value => setLoginCode(value)} 
                placeholder={twoFactorText}
                keyboardType="numeric" 
                returnKeyType="go"
                onSubmitEditing={() => Keyboard.dismiss, handleSubmitPress}
                blurOnSubmit={false}
                textContentType={'none'}
                autoComplete= {'off'}  
              />
            </View> : null
            }

            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => props.navigation.navigate('RegisterScreen')}>
              <Text style={styles.buttonTextStyle}>Register New Account</Text>
            </TouchableOpacity>

           
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => props.navigation.navigate('SignupScreen')}>
              <Text style={styles.buttonTextStyle}> Signup New Account</Text>
            </TouchableOpacity>

 

            <Text
              style={styles.registerTextStyle}
              onPress={() => props.navigation.navigate('ForgotPasswordScreen')}>
              Forgot Password
            </Text>


          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

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