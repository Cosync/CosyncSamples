//
//  SignUp.js
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
import {  
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView, } from 'react-native';
import * as RealmLib from '../managers/RealmManager';  
import _ from 'lodash';
import Loader from '../components/Loader'; 
import {AuthContext} from '../store/auth-context'
import {globalStyle} from '../styles/globalStyle'

const Signup = props => {
  
   
  let [errortext, setErrortext] = useState('');
  let [infotext, setInfoText] = useState('');
  
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState(''); 
  
  let [loading, setLoading] = useState(false); 
   
  
  const ref_input_email = useRef();
  const ref_input_pwd = useRef(); 

  global.realm = null;
  global.realmPrivate = null; 

  const authCtx = useContext(AuthContext);

  useEffect(() => {
   
   
  }, []);

  const validateEmail = (text) => {
  
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
  }

  const validateForm = () => {
    

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
          

          authCtx.authenticate(user.id)

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

            <View style={globalStyle.sectionStyle}>
              <TextInput
                style={globalStyle.inputStyle}
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
              <Text style={globalStyle.buttonTextStyle}>CREATE</Text>
            </TouchableOpacity>

            {infotext != '' ? (
              <Text style={globalStyle.infoTextStyle}> {infotext} </Text>
            ) : null}

            

        </KeyboardAvoidingView>
      </ScrollView>
    </View>

  );
};
export default Signup;
 