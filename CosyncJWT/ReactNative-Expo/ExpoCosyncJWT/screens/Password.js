//
//  Password.js
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

import React, {useEffect, useState, useRef } from 'react'; 
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'; 
import Loader from '../components/Loader'; 
import Configure from '../config/Config';  
import CosyncJWTReactNative from 'cosync-jwt-react-native'; 
import {globalStyle} from '../styles/globalStyle'

const Password = props => { 

  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState(''); 
  let [infotext, setInfotext] = useState('');
 
  let [userPassword, setUserPassword] = useState('');
  let [newUserPassword, setNewUserPassword] = useState('');

  const ref_input_pwd = useRef(); 
 
  useEffect(() => {
    
    if(!global.cosync) global.cosync = new CosyncJWTReactNative(Configure.CosyncApp).getInstance();

  }, []);

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


    let validate = global.cosync.password.validatePassword(newUserPassword);
    if(!validate){
      let message = `
          Error: Invalid Password Rules:\nMinimum password length : ${global.cosyncAppData.passwordMinLength}
          Minimun upper case : ${global.cosyncAppData.passwordMinUpper}
          Minimum lower case : ${global.cosyncAppData.passwordMinLower}
          Minimum digit charactor : ${global.cosyncAppData.passwordMinDigit}
          Minimum special charactor: ${global.cosyncAppData.passwordMinSpecial}
        `;
        setErrortext(message);
       
    }
    else{ 
      setLoading(true);  
      
      global.cosync.password.changePassword(userPassword, newUserPassword).then(result => {

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
    <View style={globalStyle.mainBody}>
      <Loader loading={loading} />
      
      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{ marginTop: 100 }}>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Text style={globalStyle.infoTextStyle}> Change your password </Text>
            </View>
            <View style={globalStyle.sectionStyle}>
              <TextInput
                  style={globalStyle.inputStyle}
                  onChangeText={value => setUserPassword(value)} 
                  placeholder="Enter current password"
                  blurOnSubmit={false}
                  secureTextEntry={true} 
                  textContentType={'none'}
                  autoComplete= {'off'} 
                  onSubmitEditing={() => ref_input_pwd.current.focus()}
                /> 
            </View>

            <View style={globalStyle.sectionStyle}>
                <TextInput
                  style={globalStyle.inputStyle}
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
              <Text style={globalStyle.infoTextStyle}> {infotext} </Text>
            ) : null} 

            {errortext != '' ? (
              <Text style={globalStyle.errorTextStyle}> {errortext} </Text>
            ) : null}


            <TouchableOpacity
                style={globalStyle.buttonStyle}
                activeOpacity={0.5}
                onPress={handleResetPassword}>
                <Text style={globalStyle.buttonTextStyle}>SUBMIT</Text>
            </TouchableOpacity> 

          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default Password;
 