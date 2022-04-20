//
//  Profile.js
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

import React, { useEffect, useState } from 'react'; 
import {
  Switch,
  View,
  Text,
  TextInput,
  TouchableOpacity
 
} from 'react-native'; 
 
import Clipboard from '@react-native-clipboard/clipboard';
import Loader from '../components/Loader'; 
import Configure from '../config/Config';  
import CosyncJWTReactNative from 'cosync-jwt-react-native'; 
import {globalStyle} from '../styles/globalStyle'

const Profile = props => { 
  let [loading, setLoading] = useState(false);
  let [userEmail, setUserEmail] = useState('');
  let [userPhone, setUserPhone] = useState(''); 
  let [currentUserPhone, setCurrentUserPhone] = useState(''); 
  let [userPhoneCode, setUserPhoneCode] = useState(''); 
  let [isVerifyPhone, setVerifyPhone] = useState(false);
  let [phoneVerified, setPhoneVerified] = useState(false);
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
   

  let [isGoogleTwoFactor, setGoogleTwoFactor] = useState(false); 
  let [isPhoneTwoFactor, setPhoneTwoFactor] = useState(false); 
  let [googleSecretKey, setGoogleSecretKey] = useState(''); 

  
 
  useEffect(() => {

    if(!global.cosync) global.cosync = new CosyncJWTReactNative(Configure.CosyncApp).getInstance();
    if(!global.userData) {
      //props.navigation.navigate('Login')
    }



    global.cosync.app.getApplication().then(result => {  
      global.appData = result;

      global.cosync.profile.getUser().then(data => { 
        global.userData.data = data;
        console.log("global.userData.data ", global.userData.data);
        let twoFactor = global.userData.data ? global.userData.data.twoFactorGoogleVerification : false;
        setGoogleTwoFactor(twoFactor);

        let phone2Facor = global.userData.data ? global.userData.data.twoFactorPhoneVerification : false;
        setPhoneTwoFactor(phone2Facor);

        let isPhoneVerified = global.userData.data ? global.userData.data.phoneVerified : false;
        setPhoneVerified(isPhoneVerified);

        if(global.userData && global.userData.data && global.userData.data.phone) setCurrentUserPhone(global.userData.data.phone);

        if(data.metaData && data.metaData.user_data) {
          setFirstName(data.metaData.user_data.name.first);
          setLastName(data.metaData.user_data.name.last);
        }

      })
      
    });
  }, []);


  const validateEmail = (text) => {
  
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
  }

  const handleUpdateProfile = () => {

    if (!firstName) {
      alert('Please fill first name');
      return;
    } 

    if (!lastName) {
      alert('Please fill last name');
      return;
    } 


    let metadata = {
      user_data : {
        name: {
            first: firstName,
            last: lastName
        }
      } 
    };

    global.cosync.profile.setUserMetadata(userEmail, metadata).then(result => { 
      if(result == true){
        alert('Success');
      } 
      else{ 
        alert(`Error: ${result.message}`);
      }
    }).catch(err => {
      alert(`Error: ${err.message}`);
    })
  }

  const handleInvite = () => { 
 

    if(!global.appData.invitationEnabled){
      setErrortext(`This app doesn't allow invitation.`); 
      return;
    }

    if(!userEmail || !validateEmail(userEmail)){
      alert(`Please enter valid email.`); 
      return;
    }

    let metadata = {};

    // if(global.appData.metaDataInvite.length){
    //   global.appData.metaDataInvite.forEach(field => {
    //     _.set(metadata, field.path, `test value ${field.fieldName}`); // add your value here
    //   });
    // }
    
    global.cosync.profile.invite(userEmail, metadata).then(result => { 

      if(result == true){
        alert('Success');
      } 
      else{ 
        alert(`Error: ${result.message}`);
      }
    }).catch(err => {
       
       
      alert(`Error: ${err.message}`);
    })
    
  };

  const updatePhoneTwoFactor = () => {  
    
    setPhoneTwoFactor(previousState => !previousState); 
    let isTwoFactor = !isPhoneTwoFactor;
    setGoogleSecretKey(''); 

    global.cosync.profile.setTwoFactorGoogleVerification(isTwoFactor).then(result => {  

      if(result == true){ 
        global.userData.data.twoFactorPhoneVerification = isTwoFactor; 
        if(isTwoFactor) alert('Turn on Phone Two Factor');
        else alert('Turn off Phone Two Factor');
      } 
      else{ 
        setPhoneTwoFactor(previousState => !previousState);
        alert(`Error: ${result.message}`);
      }
    }).catch(err => {
      
      setPhoneTwoFactor(previousState => !previousState);
      alert(`Error: ${err.message}`);
    })
  }

  const handleAddPhone = () => {  

    if(isVerifyPhone){  
      if(!userPhoneCode){
        alert(`Please enter code number.`); 
        return;
      }


      global.cosync.profile.verifyPhone(userPhoneCode).then(result => { 

        if(result == true){
          
          setVerifyPhone(false);
          global.userData.data.phoneVerified = true;

          global.userData.data.phone = userPhone;

          setCurrentUserPhone(global.userData.data.phone);

          setPhoneVerified(true);
          alert('Phone number is verified.')
        } 
        else{ 
          alert(`Error: ${result.message}`);
        }
      }).catch(err => {
        setLoading(false); 
        
        alert(`Error: ${err.message}`);
      })
      

      return;
    }


    if(!userPhone){
      alert(`Please enter phone number.`); 
      return;
    }
    
 
    
    global.cosync.profile.setPhone(userPhone).then(result => { 

      if(result == true){
        setVerifyPhone(true);
        alert('Please enter phone verification')
      } 
      else{ 
        alert(`Error: ${result.message}`);
      }
    }).catch(err => {
      setLoading(false); 
      
      alert(`Error: ${err.message}`);
    })
    
  }; 


  const copyGoogleSecret = ()=> Clipboard.setString(googleSecretKey)


  const handleAddGoogleTwoFactor = () => {  
 
    setGoogleTwoFactor(previousState => !previousState);
    //setGoogleTwoFactor(!isGoogleTwoFactor);

    console.log('handleAddGoogleTwoFactor isGoogleTwoFactor ', isGoogleTwoFactor);

    let isTwoFactor = !isGoogleTwoFactor;
    setGoogleSecretKey(''); 

    global.cosync.profile.setTwoFactorGoogleVerification(isTwoFactor).then(result => { 

      if(result == true || result.googleSecretKey){

        global.userData.data.twoFactorGoogleVerification = isTwoFactor;

        if(isTwoFactor){
          console.log('handleAddGoogleTwoFactor googleSecretKey ', result.googleSecretKey);
          
          if(result.googleSecretKey){
            alert('Please check your email for Google Two Factor');
            setGoogleSecretKey(result.googleSecretKey); 
          } 
          else alert('Turn off Google Two Factor');
         
        } 
      } 
      else{ 
        setGoogleTwoFactor(previousState => !previousState);
        alert(`Error: ${result.message}`);
      }
    }).catch(err => {
      setLoading(false); 
      setGoogleTwoFactor(previousState => !previousState);
      alert(`Error: ${err.message}`);
    })
    
  }; 


  return (
    <View style={globalStyle.mainBody}>
      
      <Loader loading={loading} />  

        <View style={globalStyle.sectionStyle}>
        <Text style={globalStyle.buttonTextStyle}>{userEmail}</Text>
      </View>

      <View style={globalStyle.sectionStyle}>
      
            <TextInput
              style={globalStyle.inputStyle}
              onChangeText={value => setFirstName(value)} 
              placeholder="First Name"
              autoCapitalize="none" 
              autoCorrect={false} 
              returnKeyType="next"  
              value={firstName}
              blurOnSubmit={false}
              
            />
      </View>

      <View style={globalStyle.sectionStyle}>
    
            <TextInput
              style={globalStyle.inputStyle}
              onChangeText={value => setLastName(value)} 
              placeholder="Last Name"
              autoCapitalize="none" 
              autoCorrect={false} 
              returnKeyType="next"  
              value={lastName}
              blurOnSubmit={false}
              
            />
      </View>


      <TouchableOpacity
        style={globalStyle.buttonStyle}
        activeOpacity={0.5}
        onPress={handleUpdateProfile}>
        <Text style={globalStyle.buttonTextStyle}>Update Profile</Text>
      </TouchableOpacity>


        <Text style={globalStyle.infoTextStyle}> Invite Someone </Text>

        <View style={globalStyle.sectionStyle}>
      
              <TextInput
                style={globalStyle.inputStyle}
                onChangeText={value => setUserEmail(value)} 
                placeholder="Enter Email to invite"
                autoCapitalize="none" 
                autoCorrect={false}
                keyboardType="email-address" 
                returnKeyType="next" 
                onSubmitEditing={() => handleInvite}
                blurOnSubmit={false}
                
              />
        </View>

        <TouchableOpacity
          style={globalStyle.buttonStyle}
          activeOpacity={0.5}
          onPress={handleInvite}>
          <Text style={globalStyle.buttonTextStyle}>Invite</Text>
        </TouchableOpacity>

        
      

      {global.appData.twoFactorVerification == 'phone' ? 
        <View style={globalStyle.viewSection}>
          <Text style={globalStyle.infoTextStyle}> Add Phone </Text>

          
            <View style={globalStyle.sectionStyle}>
            
                  <TextInput
                    style={globalStyle.inputStyle}
                    onChangeText={value => setUserPhone(value)} 
                    placeholder="Enter your phone number"
                    autoCapitalize="none" 
                    autoCorrect={false} 
                    returnKeyType="next" 
                    onSubmitEditing={() => handleAddPhone}
                    blurOnSubmit={false}
                    
                  />
            </View> 

          {currentUserPhone != "" ? 
          <Text style={globalStyle.infoTextStyle}> Current Phone Number: {currentUserPhone}</Text>

          : null}

          {isVerifyPhone ?
          <View style={globalStyle.sectionStyle}>
        
            <TextInput
              style={globalStyle.inputStyle}
              onChangeText={value => setUserPhoneCode(value)} 
              placeholder="Enter verify code"
              autoCapitalize="none" 
              autoCorrect={false} 
              returnKeyType="next" 
              onSubmitEditing={() => handleAddPhone}
              blurOnSubmit={false}
              
            />
            </View>  : null}
        
            <TouchableOpacity
                style={globalStyle.buttonStyle}
                activeOpacity={0.5}
                onPress={handleAddPhone}>
                <Text style={globalStyle.buttonTextStyle}>Submit</Text>
            </TouchableOpacity>

            {global.userData.data.phoneVerified ? 
              <View style={globalStyle.viewSection}>
                <Text style={globalStyle.infoTextStyle}> Turn on Phone Two Factor </Text>  

                <Switch
                  
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isGoogleTwoFactor ? "#4638ab" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={updatePhoneTwoFactor}
                  value={isPhoneTwoFactor}
                />  

              </View>
            : null}
        </View>

      : null}   

      {global.appData.twoFactorVerification == 'google' ? 
            <View style={globalStyle.viewSection}>
              <Text style={globalStyle.infoTextStyle}> Add Google Two Factor </Text>  

              <Switch
                
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isGoogleTwoFactor ? "#4638ab" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleAddGoogleTwoFactor}
                value={isGoogleTwoFactor}
              /> 

              {googleSecretKey != "" ?  <TouchableOpacity onPress={copyGoogleSecret}>
                <Text>Click here to copy Google Secret Key</Text>
              </TouchableOpacity> : null}

            </View>

      : null}
    </View>
  );
};
export default Profile;
 