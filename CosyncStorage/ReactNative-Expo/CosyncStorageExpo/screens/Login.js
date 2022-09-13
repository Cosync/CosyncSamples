//
//  Login.js
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


import React, {useEffect, useState, useCallback, useRef, useContext } from 'react'; 
import { 
TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native'; 
import Loader from '../components/Loader'; 
import * as RealmLib from '../managers/RealmManager';   
import {globalStyle} from '../styles/globalStyle'
import {AuthContext} from '../store/auth-context'

const Login = ({ navigation }) => {
   
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [loading, setLoading] = useState(false); 

  let [errortext, setErrortext] = useState('');
  const ref_input_pwd = useRef(); 
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setUserEmail("tola@cosync.io");
    setUserPassword("qwerty");

    console.log("useEffect ", userEmail);

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

    RealmLib.login(userEmail, userPassword).then(user => {
     
       
      authCtx.authenticate(user.id)
      
    }).catch(err => {
      setLoading(false);
      setErrortext(err.message);
    }) 

    
 
  };


 
 
  return (
    <View style={globalStyle.mainBody}>
      <Loader loading={loading} />
      
      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{ marginTop: 20 }}>
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
            <View style={globalStyle.sectionStyle}>
              <TextInput
                style={globalStyle.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)} 
                placeholder="Enter Password" 
                keyboardType="default" 
                returnKeyType="go"
                onSubmitEditing={() =>{ Keyboard.dismiss, handleSubmitPress}}
                blurOnSubmit={false}
                textContentType={'none'}
                autoComplete= {'off'}
                secureTextEntry={true}
                ref={ref_input_pwd}
              />

             
            </View>
             

            

            {errortext != '' ? (
              <Text style={globalStyle.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={globalStyle.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={globalStyle.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
 
           
            <TouchableOpacity
              style={globalStyle.buttonStyle}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('SignUp')}>
              <Text style={globalStyle.buttonTextStyle}> Signup New Account</Text>
            </TouchableOpacity> 

          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;
 