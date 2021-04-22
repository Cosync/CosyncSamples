//
//  AssetScreen.js
//  CosyncStorageSample
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
// Import React
import React, {useState, useEffect, useRef} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
   
} from 'react-native';

 
import ProgressiveAsset from '../components/ProgressiveAsset';   
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Configure from '../config/Config'; 
import * as RealmLib from '../managers/RealmManager'; 
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/Loader';  
import UploadFile from '../components/UploadFile'; 
import { ObjectId } from 'bson';  
import Video from 'react-native-video'; 

const AssetScreenOffline = props => {
  
  const [loading, setLoading] = useState(false);  
  const [assetList, setAssetList] = useState([]); 
  let [expirationHours, setExpiredHour] = useState('24');
  const [uploadList, setUploadList] = useState([]);  
  const [uploading, setUploading] = useState(false); 

  useEffect(() => { 

    openRealm();

    props.navigation.addListener('didBlur', (e) =>{
      setAssetList(prevItems => { 
        return [];
      }); 
      if(global.sound) global.sound.stop();
       
    })
 

    async function openRealm(){
        setLoading(true);  
        global.appId = Configure.Realm.appId; 
  
        if(!global.user || !global.user.id){ 
  
          let userEmail = await AsyncStorage.getItem('user_email');
          let userPassword = await AsyncStorage.getItem('user_password'); 
            
          if(!userEmail || !userPassword){
              props.navigation.navigate('Auth'); 
              return;
          }

          let user = await RealmLib.login(userEmail, userPassword);
          AsyncStorage.setItem('user_id', user.id);  
          
        }  

        await RealmLib.openRealmPartition(Configure.Realm.publicPartition);   
        await RealmLib.openRealmPartition(global.privatePartition);  

        loadAllAssets(); 

        getCosyncUploadAsset();

        setLoading(false); 
    }


    const naviSub = props.navigation.addListener('willFocus', openRealm); 
    return () => { 
      naviSub.remove();
    };
  
  }, []);


    async function getCosyncUploadAsset(){
      
      const cosyncAssetUpload = await global.realmPartition[global.privatePartition].objects(Configure.Realm.cosyncAssetUpload);  
     
      cosyncAssetUpload.removeListener(assetsUploadEventListener); 
      cosyncAssetUpload.addListener(assetsUploadEventListener); 
      console.log('getCosyncUploadAsset cosyncAssetUpload ', cosyncAssetUpload.length);

      // global.realmPartition[`user_id=${global.user.id}`].write(() => {   
      //   global.realmPartition[`user_id=${global.user.id}`].delete(cosyncAssetUpload); 
      // });

      // cosyncAssetUpload.forEach(element => { 
      //   global.realmPartition[`user_id=${global.user.id}`].delete(element);
      //   if(element.status == 'initialized'){ 
      //     let item = element; 
      //     item.id = element._id.toString(); 
      //     setUploadList(prevItems => { 
      //       return [...prevItems, item];
      //     });
      //   }
      // }); 

    }

    function assetsUploadEventListener(assets, changes){

      // changes.insertions.forEach((index) => {
      //   let item = assets[index]; 
      //   //console.log('assetsUploadEventListener insertions = ', item.status);

      //   if(item.status == 'initialized'){

      //     item.id = item._id.toString(); 

      //     // setUploadList(prevItems => { 
      //     //   return [item, ...prevItems];
      //     // }); 

      //     // let newList = assetList.map(el => (
      //     //   el.id === item.id ?  {...el, upload: true} : el 
      //     // ));

      //     // if(newList.length){
      //     //   setAssetList(prevItems => { 
      //     //     return [newList];
      //     //   }); 
      //     // }

      //   }
      // });

      changes.modifications.forEach((index) => {
        let modifiedItem = assets[index];  
        
        console.log('assetsUploadEventListener modifications _id = ', modifiedItem._id);
        console.log('assetsUploadEventListener modifications = ', modifiedItem.status);
        if(modifiedItem.status == 'initialized'){

          modifiedItem.id = modifiedItem._id.toString(); 

          setAssetList(currentList => { 
            return currentList.filter(el => {  
              if(el.id == modifiedItem.id){ 
                console.log('modifiedItem.id ', modifiedItem.id);

                for (const key in modifiedItem) { 
                  el[key] = modifiedItem[key]; 
                } 
                el.status = 'uploading';
                el.upload = true;

                return el;
              }
              else return el;
            })
          });  
          

        }
      });

    }


    function loadAllAssets(){

      setAssetList(prevItems => { 
        return [];
      }); 

      const assetsPublic = global.realmPartition[Configure.Realm.publicPartition].objects(Configure.Realm.cosyncAsset).filtered(`uid = '${global.user.id}' && status == 'active'`);  
      
      
      let sortedAssetsPublic = assetsPublic.sorted("createdAt", false);
      assetsPublic.removeListener(assetsEventListener); 
      assetsPublic.addListener(assetsEventListener); 
      sortedAssetsPublic.forEach(element => { 
          let item = {};
          for (const key in element) {
            item[key] = element[key];
          } 
          item.id = item._id.toString();
          setAssetList(prevItems => { 
            return [item, ...prevItems];
          });
        
        
      }); 

      const assetsPrivate = global.realmPartition[global.privatePartition].objects(Configure.Realm.cosyncAsset);  
      let sortedResult = assetsPrivate.sorted("createdAt", false);
      assetsPrivate.removeListener(assetsEventListener); 
      assetsPrivate.addListener(assetsEventListener); 

      sortedResult.forEach(element => {
        if(element.status == "active"){ 
          let item = {};
          for (const key in element) {
            item[key] = element[key];
          } 
          item.id = item._id.toString();
          
          setAssetList(prevItems => { 
            return [item, ...prevItems];
          });  
        }
      });  
    }

    function assetsEventListener(assets, changes) { 
      // Update UI in response to inserted objects
      changes.insertions.forEach((index) => {
        let item = assets[index]; 
        
        if(item.status == 'active'){ 
          item.id = item._id.toString(); 
          setAssetList(prevItems => { 
            return [item, ...prevItems];
          }); 
        }
      });


      // changes.modifications.forEach((index) => {
      //   let item = assets[index]; 
      //   item.id = item._id.toString(); 

      //   if(item.status == 'active'){   
      //     let newList = assetList.map(el => (
      //       el.id === item.id ?  {...el, item} : el
      //     ));

      //     setAssetList(prevItems => { 
      //       return [newList];
      //     }); 
      //   }
      // });
       
    }


 


const chooseFile = () => { 

  if(uploading) return;

  let options = {
    title: 'Choose Image or Video', 
    mediaType: 'mixed',
    noData: true,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  ImagePicker.showImagePicker(options, (response) => { 
    if (response.didCancel) console.log('User cancelled image picker');
    else if (response.error)  alert(response.error)
    else {

      response.type = response.type ? response.type : 'video/quicktime';  
      global.assetSource = response;  
      uploadRequest(response);
    }
  });
};


const itemUploaded = (item) => {

  console.log('itemUploaded ', item.id)
  
  let newList = assetList.map(el => (
    el.id == item._id.toString() ? {...el, status: 'active'} : el
  ));

  // tell flat list item to upload
  setAssetList(prevItems => {
    return newList;
  });

  setUploading(false);


  global.realmPartition[global.privatePartition].write(() => { 
    global.realmPartition[global.privatePartition].create(Configure.Realm.cosyncAssetUpload, { _id: item._id, status: "uploaded" }, "modified"); 
  });

  // setAssetList(currentList => { 
  //   return currentList.filter(el => {  
  //     if(el.id == item._id.toString()){  
  //       el.status = 'active';
  //       el.uploaded = true;
  //       //el.url = item.url; 
  //       return el;
  //     }
  //     else return el;
  //   })
  // });  
   
};


    
const uploadRequest = (source) => { 

  let imageName = source.uri.split('/').pop(); 
  let filePath = source.type.indexOf("image") > -1 ? `images/${imageName}` : `videos/${imageName}`;

  let assetObject = {
    _id: new ObjectId(),
    _partition:  global.privatePartition,
    filePath: filePath, 
    uid: global.user.id,
    contentType: source.type,
    status: 'pending',  
    url: source.uri,
    extra : source.uri,
    size: source.fileSize,
    expirationHours: parseFloat(expirationHours),
    sessionId: global.user.deviceId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  global.realmPartition[global.privatePartition].write(() => {

    global.realmPartition[global.privatePartition].create(Configure.Realm.cosyncAssetUpload, assetObject );
    assetObject.status =  'local';
    global.realmPartition[global.privatePartition].create(Configure.Realm.cosyncAsset, assetObject);

    assetObject.id = assetObject._id.toString();  
    console.log('uploadRequest assetObject.id ', assetObject.id);
    setUploading(true);

    setAssetList(prevItems => { 
      return [assetObject, ...prevItems];
    });
    
  }); 

   
  
 
  
  
}

      return (
        <SafeAreaView style={styles.container}>
          <Loader loading={loading} />  
           
          <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.buttonStyle} 
                  onPress={chooseFile}> 
              <Text style={styles.textButtonStyle}>
                Upload
              </Text>
          </TouchableOpacity> 

          {assetList.length ?

          <FlatList 
            numColumns = {1}
            data={assetList}
            //refreshing = {loading} 
            keyExtractor={(item, index) => index.toString()}
            style={styles.containerFlatList}  
            renderItem={({item}) => (
              <ProgressiveAsset item = {item}  itemUploaded={itemUploaded} />
            )}  
          /> 
          : 
          <View style={styles.container}> 
            <Text style={styles.titleText}>
              No Asset
            </Text>
            
          </View> 
        }
           
        </SafeAreaView>
      );
  };

    export default AssetScreenOffline;
      
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 10,
          backgroundColor: '#fff',
          alignItems: 'center',
          
        },
        titleText: {
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          paddingVertical: 20,
        },
        
         
        containerFlatList : {
          flex: 1, 
          flexDirection: 'column',
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
        
         
      });
