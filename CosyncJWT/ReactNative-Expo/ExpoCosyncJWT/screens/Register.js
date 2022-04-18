//
//  Register.js
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

import React, { useState, useRef, useEffect } from 'react'; 
import {  
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
import Loader from '../components/Loader'; 
import {globalStyle} from '../styles/globalStyle'

const Register = props => {
  
  let [errorcodetext, setErrorCodetext] = useState('');
  let [errortext, setErrortext] = useState('');
  let [infotext, setInfoText] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState(''); 
  let [signupCode, setSignupCode] = useState(''); 
  let [loading, setLoading] = useState(false);  
  
  const ref_input_lastname = useRef();
  const ref_input_email = useRef();
  const ref_input_pwd = useRef(); 
  const ref_input_code = useRef(); 

  global.realm = null;
  global.realmPrivate = null; 

  useEffect(() => {
    if(!global.cosync) global.cosync = new CosyncJWTReactNative(Configure.CosyncApp).getInstance();

    global.cosync.app.getApplication().then(result => { 
      global.appData = result;
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
 
  const handleSubmitPress = () => {

    setErrortext('');
    setInfoText('');

    if(!validateForm()){
      return;
    }

   
    
    let metaData = {
      name: {
          first: firstName,
          last: lastName
      },
      email: userEmail
  };
 
  let validate = global.cosync.password.validatePassword(userPassword);
  if(!validate){
    let message = `
        Error: Invalid Password Rules:\nMinimum password length : ${global.cosyncAppData.passwordMinLength}
        Minimun upper case : ${global.cosyncAppData.passwordMinUpper}
        Minimum lower case : ${global.cosyncAppData.passwordMinLower}
        Minimum digit charactor : ${global.cosyncAppData.passwordMinDigit}
        Minimum special charactor: ${global.cosyncAppData.passwordMinSpecial}
      `;
      setErrortext(message);
      return;
  }

  setLoading(true);   
  
  global.cosync.register.register(userEmail, userPassword, signupCode, metaData).then(result => {

      setLoading(false);   
      
      

      if(result.jwt){ 
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
      else{
        
        setErrortext(`Error: ${result.message}`);
      }
    }).catch(err => {
      setLoading(false); 
      console.log(err);
      setErrortext(`Error: ${err.message}`);
    })
    
  }; 
 

  return (
    <View style={globalStyle.mainBody}>  
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

            

            <View style={globalStyle.sectionStyle}>
              <TextInput
                style={globalStyle.inputStyle}
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

            <View style={globalStyle.sectionStyle}>
              <TextInput
                style={globalStyle.inputStyle}
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

            <View style={globalStyle.sectionStyle}>
              <TextInput
                style={globalStyle.inputStyle}
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

            <View style={globalStyle.sectionStyle}>
              <TextInput
                style={globalStyle.inputStyle}
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

            <View style={globalStyle.sectionStyle}>
                <TextInput
                  style={globalStyle.inputStyle}
                  onChangeText={value => setSignupCode(value)} 
                  placeholder="Enter Invitation Code"
                  keyboardType="numeric" 
                  returnKeyType="go" 
                  blurOnSubmit={false} 
                  textContentType={'none'}
                  autoComplete= {'off'}
                  ref={ref_input_code}
                  onSubmitEditing={() => {Keyboard.dismiss, handleSubmitPress}}
                /> 

              </View> 

            {errortext != '' ? (
              <Text style={globalStyle.errorTextStyle}> {errortext} </Text>
            ) : null}

            <TouchableOpacity
              style={globalStyle.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={globalStyle.buttonTextStyle}>REGISTER</Text>
            </TouchableOpacity>

            {infotext != '' ? (
              <Text style={globalStyle.infoTextStyle}> {infotext} </Text>
            ) : null} 

        </KeyboardAvoidingView>
      </ScrollView>
    </View>

  );
};
export default Register;
 