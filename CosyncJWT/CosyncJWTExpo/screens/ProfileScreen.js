 
//
//  ProfileScreen.js
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

import React, { useEffect, useState, useContext } from 'react'; 
import {
  StyleSheet, 
  Switch,
  View,
  Text,
  TextInput,
  TouchableOpacity
 
} from 'react-native'; 
 
//import Clipboard from '@react-native-clipboard/clipboard';
import Loader from '../components/Loader'; 
import { Dropdown } from 'react-native-element-dropdown';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = props => { 
  let [loading, setLoading] = useState(false);
  let [userEmail, setUserEmail] = useState('');
  let [userPhone, setUserPhone] = useState(''); 
  let [currentUserPhone, setCurrentUserPhone] = useState(''); 
  let [userPhoneCode, setUserPhoneCode] = useState(''); 
  let [isVerifyPhone, setVerifyPhone] = useState(false);
  let [phoneVerified, setPhoneVerified] = useState(false);
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [userLocale, setLocale] = useState('EN');
  let [isGoogleTwoFactor, setGoogleTwoFactor] = useState(false); 
  let [isPhoneTwoFactor, setPhoneTwoFactor] = useState(false); 
  let [googleSecretKey, setGoogleSecretKey] = useState(''); 

  const { userData, getApplication, cosyncJWT, appData, appLocales } = useContext(AuthContext);
 
  useEffect(() => { 
    getApplication();

    console.log("Prifile userData. ", userData);
    let twoFactor = userData ? userData.twoFactorGoogleVerification : false;
    setGoogleTwoFactor(twoFactor);

    let phone2Facor = userData ? userData.twoFactorPhoneVerification : false;
    setPhoneTwoFactor(phone2Facor);

    let isPhoneVerified = userData ? userData.phoneVerified : false;
    setPhoneVerified(isPhoneVerified);
    if(userData && userData.locale) setLocale(userData.locale)
    if(userData && userData.phone) setCurrentUserPhone(userData.phone);
    if(userData && userData.handle) setUserEmail(userData.handle);
    if(userData && userData.metaData && userData.metaData.user_data) {
      setFirstName(userData.metaData.user_data.name.first);
      setLastName(userData.metaData.user_data.name.last);
    }
     
  }, []);


  const validateEmail = (text) => {
  
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
  }

  const setUserLocale = (locale) => {

    console.log('setUserLocale locale ', locale);

    if (locale == userLocale) {
      return;
    }
    cosyncJWT.profile.setLocale(locale).then(result => { 
      console.log('setUserLocale result ', result);
      if(result == true){
        setLocale(locale);
      } 
      else{ 
        alert(`Fails: ${result.message}`);
      }
    }).catch(err => {
      alert(`Error: ${err.message}`);
    })
  }


  const handleInvite = () => { 

    if(!appData.invitationEnabled){
      setErrortext(`This app doesn't allow invitation.`); 
      return;
    }

    if(!userEmail || !validateEmail(userEmail)){
      alert(`Please enter valid email.`); 
      return;
    }

    let metadata = {};

    if(appData.metaDataInvite.length){
      appData.metaDataInvite.forEach(field => {
        _.set(metadata, field.path, `test value ${field.fieldName}`); // add your value here
      });
    }
    
    cosyncJWT.profile.invite(userEmail, metadata).then(result => { 

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

    cosyncJWT.profile.setTwoFactorGoogleVerification(isTwoFactor).then(result => {  

      if(result == true){ 
        userData.twoFactorPhoneVerification = isTwoFactor; 
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


      cosyncJWT.profile.verifyPhone(userPhoneCode).then(result => { 

        if(result == true){
          
          setVerifyPhone(false);
          userData.phoneVerified = true;

          userData.phone = userPhone;

          setCurrentUserPhone(userData.phone);

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
    
 
    
    cosyncJWT.profile.setPhone(userPhone).then(result => { 

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


  //const copyGoogleSecret = ()=> Clipboard.setString(googleSecretKey)


  const handleAddGoogleTwoFactor = () => {  
 
    setGoogleTwoFactor(previousState => !previousState);
    //setGoogleTwoFactor(!isGoogleTwoFactor);

    console.log('handleAddGoogleTwoFactor isGoogleTwoFactor ', isGoogleTwoFactor);

    let isTwoFactor = !isGoogleTwoFactor;
    setGoogleSecretKey(''); 

    cosyncJWT.profile.setTwoFactorGoogleVerification(isTwoFactor).then(result => { 

      if(result == true || result.googleSecretKey){

        userData.twoFactorGoogleVerification = isTwoFactor;

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

    cosyncJWT.profile.setUserMetadata(metadata).then(result => { 
      if(result == true){
        alert('Success');
      } 
      else{ 
        alert(`Fails: ${result.message}`);
      }
    }).catch(err => {
      alert(`Error: ${err.message}`);
    })
  }



  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />  


      <Text style={styles.registerTextStyle}>{userEmail}</Text>
      

      <View style={styles.SectionStyle}>
      
            <TextInput
              style={styles.inputStyle}
              onChangeText={value => setFirstName(value)} 
              placeholder="First Name"
              autoCapitalize="none" 
              autoCorrect={false} 
              returnKeyType="next"  
              value={firstName}
              blurOnSubmit={false}
              
            />
      </View>

      <View style={styles.SectionStyle}>
    
            <TextInput
              style={styles.inputStyle}
              onChangeText={value => setLastName(value)} 
              placeholder="Last Name"
              autoCapitalize="none" 
              autoCorrect={false} 
              returnKeyType="next"  
              value={lastName}
              blurOnSubmit={false}
              
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
      
      <View style={styles.viewSection}>

        <View style={styles.SectionStyle}>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleUpdateProfile}>
            <Text style={styles.buttonTextStyle}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.viewSection}>
        <Text style={styles.registerTextStyle}> Invite Someone </Text>
        <View style={styles.SectionStyle}>
      
              <TextInput
                style={styles.inputStyle}
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
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleInvite}>
              <Text style={styles.buttonTextStyle}>Invite</Text>
        </TouchableOpacity>

      </View>

      {appData && appData.twoFactorVerification == 'phone' ? 
        <View style={styles.viewSection}>
          <Text style={styles.registerTextStyle}> Add Phone </Text>

          
            <View style={styles.SectionStyle}>
            
                  <TextInput
                    style={styles.inputStyle}
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
          <Text style={styles.registerTextStyle}> Current Phone Number: {currentUserPhone}</Text>

          : null}

          {isVerifyPhone ?
          <View style={styles.SectionStyle}>
        
            <TextInput
              style={styles.inputStyle}
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
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleAddPhone}>
                <Text style={styles.buttonTextStyle}>Submit</Text>
            </TouchableOpacity>

            {userData.phoneVerified ? 
              <View style={styles.viewSection}>
                <Text style={styles.registerTextStyle}> Turn on Phone Two Factor </Text>  

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

      {appData && appData.twoFactorVerification == 'google' ? 
            <View style={styles.viewSection}>
              <Text style={styles.registerTextStyle}> Add Google Two Factor </Text>  

              <Switch
                
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isGoogleTwoFactor ? "#4638ab" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleAddGoogleTwoFactor}
                value={isGoogleTwoFactor}
              /> 

              {googleSecretKey != "" ?  <TouchableOpacity >
                <Text>Click here to copy Google Secret Key</Text>
              </TouchableOpacity> : null}

            </View>

      : null}
    </View>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  
  viewSection: {  
    marginTop: 20, 
    marginBottom: 20,
    alignItems: "center",
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
    width: 120,
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