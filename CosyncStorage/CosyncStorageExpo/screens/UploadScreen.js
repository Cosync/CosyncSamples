//
//  UploadScreen.js
//  CosyncStorageReactNative
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
// Import React
import React, {useState, useEffect, useRef, useContext} from 'react'; 
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import Image Picker
import {launchImageLibrary} from 'react-native-image-picker';  
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';  
import UploadFile from '../components/UploadFile'; 
import { ObjectId } from 'bson';  
import Video from 'react-native-video'; 
import Configure from '../config/Config';

const UploadScreen = props => { 
  
  let videoPlayer = useRef(null);  
  const [assetSource, setAssetSource] = useState({type: 'image'}); 
  const [loading, setLoading] = useState(false);  
  const [uploading, setUploading] = useState(false);  
  let cosyncAssetUpload;
  const [assetUpload, setCosyncAssetUpload] = useState({}); 
  const [uploadList, setUploadList] = useState([]); 
  let [expirationHours, setExpiredHour] = useState('24');

  const { realm, realmUser, setRealmUser, login } = useContext(AuthContext); 

  useEffect(() => { 
     
    let isMounted = true;
    if (isMounted) {

      setUploadList([]); 
      setAssetSource({type: 'image'});
      checkRealm();
    }

    return () => {
        isMounted = false; 
    } 
  }, [])



  async function checkRealm(){ 
         
    setLoading(true);

    try { 
      if(!realmUser || !realmUser.id){ 

        let userEmail = await AsyncStorage.getItem('user_email');
        let userPassword = await AsyncStorage.getItem('user_password');  
          
        if(!userEmail || !userPassword) setRealmUser();
        else {
          let user = await login(userEmail, userPassword);
          AsyncStorage.setItem('user_id', user.id);  
        } 
      }   
      
    } catch (error) {
      
    }
    finally{
      setLoading(false);
    }

  }


    const uploadRequest = (source) => { 
      let realmUpload;
      try {
        
     
        realm.write(() => {  
          
          let imageName = source.uri.split('/').pop(); 
          let filePath = source.type.indexOf("image") > -1 ? `images/${imageName}` : `videos/${imageName}`;
          realmUpload = realm.create(Configure.Realm.cosyncAssetUpload, 
            { 
              _id: new ObjectId(), 
              filePath: filePath, 
              userId: realmUser.id, 
              contentType: source.type,
              title: 'image',
              status: 'pending',  
              expirationHours: parseFloat(expirationHours),
              sessionId: realmUser.deviceId,
              createdAt: new Date().toISOString()
            }); 

        }); 

        try {
          realmUpload.addListener(eventObjectListener);
        } catch (error) {
          console.error(
            `An exception was thrown within the change listener: ${error}`
          );
        }

        

      } catch (error) {
        console.log("uploadRequest ", error);
      }
    }

    const chooseFile = () => {

      if(uploading){
        alert('Please wait your asset is being upload.')
        return;
      }

      let options = {
        title: 'Choose Image or Video', 
        mediaType: 'mixed',
        noData: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      launchImageLibrary(options, (response) => {
        console.log(response);

        if (response.didCancel) console.log('User cancelled image picker');
        else if (response.error)  alert(response.error)
        else if(response && response.assets){
          let asset = response.assets[0];
          asset.type = asset.type ? asset.type : 'video/quicktime';   
          setCosyncAssetUpload(null);
          cosyncAssetUpload = null; 
          setUploadList([]);  
          
           
          setLoading(true);
          global.assetSource = asset;
          setAssetSource(asset);  
          uploadRequest(asset);
           
        }
        else {
          setLoading(false);
          alert('Invalid file')
        }

      });
    };


    function eventObjectListener(obj, changes) {  
      try { 
        changes.changedProperties.forEach((prop) => { 

          if(!cosyncAssetUpload && 
            obj.sessionId == realmUser.deviceId && 
            obj.status == "initialized" && 
            obj.writeUrl &&
            obj.writeUrlSmall && 
            obj.writeUrlLarge && 
            obj.writeUrlMedium){   

              setCosyncAssetUpload(obj);
              cosyncAssetUpload = obj;
              setLoading(false);  
              createUploadImages(); 

          }
          else if (obj.status == "error"){
            setLoading(false);
            
            alert('Sorry! your upload is failing. Please try again.');
          
          }
        });
      } catch (error) {
        console.log("eventObjectListener", error);
      }
    } 

    const createUploadImages = () => { 
      
      setUploadList([]);  // reset flat list item

      let item = {}; 

       
      item.origURL = global.assetSource.origURL;
      item.uri = global.assetSource.uri;
      item.id = 'origin';
      item.sizeType = global.assetSource.type.indexOf('image') > -1 ? 'origin' : 'video'; 
      item.upload = false;
      item.uploaded = false;
      item.contentType = global.assetSource.type;
      item.writeUrl = cosyncAssetUpload.writeUrl;
      item.path = global.assetSource.uri;
      item.size = (parseInt(global.assetSource.fileSize) / 1024) / 1024;
      item.size = item.size.toFixed(2);

     
      setUploadList(prevItems => {
        return [item];
      });

      if(global.assetSource.type.indexOf('image') > -1){ 
        resizeImage(item, 'small', 300, 300);
        resizeImage(item, 'medium',600, 600);
        resizeImage(item, 'large', 900, 900);
      } 

    }


    const updateUploadRecord = () => {
      realm.write(() => { 
        realm.create(Configure.Realm.cosyncAssetUpload, { _id: assetUpload._id, status: "uploaded" }, "modified");
      });
    }

    const uploadAllImages = () => {

      if(!assetUpload || !assetUpload.status) {
        alert('Please choose an image!')
        return;
      }

      setUploading(true); 

      let newList = uploadList.map(el => (
        el.upload == false ? {...el, upload: true} : el
      ));

      // tell flat list item to upload
      setUploadList(prevItems => {
        return newList;
      });   
    }
 

    const resizeImage = async (source, sizeType, maxWidth, maxHeight) => {
      
        ImageResizer.createResizedImage(source.uri, maxWidth, maxHeight, 'JPEG', 100)
        .then(response => { 

            let item = response;
            item.id = `${maxWidth}-${maxHeight}`;
            item.sizeType = sizeType;
            item.type = source.type;
            item.upload = false;
            item.uploaded = false; 
            item.size = (parseInt(item.size) / 1024) / 1024; 
            item.size = item.size.toFixed(2);

            if(sizeType == 'small') item.writeUrl = cosyncAssetUpload.writeUrlSmall;
            if(sizeType == 'medium') item.writeUrl = cosyncAssetUpload.writeUrlMedium;
            if(sizeType == 'large') item.writeUrl = cosyncAssetUpload.writeUrlLarge;

            setUploadList(prevItems => {
                return [...prevItems, item];
            }); 

            
        })
        .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.error(err)
        });
    }


    const itemUploaded = (id) => {

      let newList = uploadList.map(el => (
        el.id === id ?  {...el, uploaded: true} : el
      ));

      if(id == 'origin' || id == 'video'){
        
        alert('Asset is uploaded.');
        
        setUploading(false);

        updateUploadRecord();  
        setCosyncAssetUpload(null);
      } 

      setUploadList(prevItems => {
        return newList;
      }); 
    };

    const onChanged = (text) =>{ 

      let numbers = '.0123456789';
      let newText = '';
      for (var i=0; i < text.length; i++) {
          if(numbers.indexOf(text[i]) > -1 ) {
              newText = newText + text[i];
          } 
      }
      
      setExpiredHour(newText);
    }

 
      return (
        <SafeAreaView style={{flex: 1}}>
          <Loader loading={loading == true}/> 

          <View style={styles.container}> 
              <TouchableOpacity activeOpacity={0.5}
                  style={styles.imageButtonStyle}
                  onPress={chooseFile}>
                  <View  style={styles.uploadBoxStyle}>  
                    { assetSource.type.indexOf('image') > -1 ?   
 
                      <Image
                        source={assetSource} 
                        style={styles.uploadBoxStyle}
                      /> 
                      :
                      <Video 
                        controls = {true} 
                        paused = {true}
                        ref={p => { videoPlayer = p; }} 
                        source={assetSource} 
                        volume={10}
                        style={styles.uploadBoxStyle}
                      /> 
                      
                    }

                  </View>

                  <View style={styles.textClickStyle}>
                      <Text style={styles.textUploadStyle}>Choose Image/Video</Text>  
                        
                  </View>

              </TouchableOpacity>

              <View style={styles.expiredHour} >
                <Text>Asset Expired Hours:</Text>
                <TextInput 
                  style={styles.inputStyle} 
                  keyboardType = 'numeric'
                  blurOnSubmit={false}
                  textContentType={'none'}
                  autoComplete= {'off'}
                  value = {expirationHours}
                  onChangeText={expirationHours => onChanged(expirationHours)}
                />
              </View>

              <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.buttonStyle}
                  disabled = {uploading}
                  onPress={uploadAllImages}>
                 
                  <Text style={styles.textButtonStyle}>
                  Upload
                  </Text>
              </TouchableOpacity> 
         

          <FlatList 
                numColumns = {2}
                data={uploadList}
                style={styles.containerFlatList} 
                renderItem={({item}) => (
                  <UploadFile 
                    item = {item} 
                    itemUploaded={itemUploaded} 
                  />
                )} 
              /> 
        </View>
        </SafeAreaView>
      );
  };

  export default UploadScreen;
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      alignItems: 'center' 
      
    },
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 20,
    }, 
    uploadBoxStyle: {
      width: 320,
      height: 320 
    },
    textClickStyle :{
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      justifyContent: 'center', 
      alignItems: 'center', 
    }, 
    textUploadStyle: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
      backgroundColor: '#4638ab'
    },
    
    containerFlatList : {
      width: 300,
      flex: 1, 
      flexDirection: 'column',
    },
    buttonTextStyle: {
      color: 'white',
      paddingVertical: 10,
      fontSize: 16,
    },
    imageButtonStyle:{
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#DDDDDD',
      padding: 10
    },

    buttonStyle: { 
      backgroundColor: '#4638ab',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#7DE24E',
      height: 40,
      width:120,
      alignItems: 'center',
      borderRadius: 30,
      
    },
    textButtonStyle: {
      color: 'white',
      paddingVertical: 10,
      fontSize: 16,
    },
    inputStyle: { 
      height: 40,
      width: 100,  
      margin: 10, 
      color: '#4638ab',
      paddingLeft: 15,
      paddingRight: 15,
      borderWidth: 1,
      borderRadius: 30,
      borderColor: '#4638ab',
    },
    expiredHour : { 
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 10
    }
  });
