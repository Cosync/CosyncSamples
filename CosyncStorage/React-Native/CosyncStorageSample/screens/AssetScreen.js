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
  FlatList  
} from 'react-native';

 
import ProgressiveAsset from '../components/ProgressiveAsset';   
import ImagePicker from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';
import Configure from '../config/Config'; 
import * as RealmLib from '../managers/RealmManager'; 
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/Loader';   
import InputModal from '../components/InputModal'; 
import { ObjectId } from 'bson';  



const AssetScreen = props => {
  
  const isMountedRef = useRef(null);
  const [loading, setLoading] = useState(false); 
  const [showExpiredTime, setShowExpiredTime] = useState(false);  
  const [assetList, setAssetList] = useState([]);   
  let assetFlatList = useRef(null);  
  let expirationHours = 24;
  useEffect(() => { 

    isMountedRef.current = true;
    openRealm();

    props.navigation.setParams({ upload: showExpiredTimeModal });

    props.navigation.addListener('didBlur', (e) =>{
      setAssetList(prevItems => { 
        return [];
      }); 
      if(global.sound) global.sound.stop();
       
    })
 
    global.sessionId = DeviceInfo.getUniqueId();

    console.log(' global.sessionId ',  global.sessionId);

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
      global.realmPartition[global.privatePartition].removeAllListeners();
      naviSub.remove();
      isMountedRef.current = false;
    };
  
  }, []);


    async function getCosyncUploadAsset(){
      
      const cosyncAssetUpload = await global.realmPartition[global.privatePartition].objects(Configure.Realm.cosyncAssetUpload).filtered(`sessionId == "${global.sessionId}" `);  
     
      cosyncAssetUpload.removeListener(assetsUploadEventListener); 
      cosyncAssetUpload.addListener(assetsUploadEventListener); 
       
      // global.realmPartition[`user_id=${global.user.id}`].write(() => {   
      //   global.realmPartition[`user_id=${global.user.id}`].delete(cosyncAssetUpload); 
      // });

      // cosyncAssetUpload.forEach(element => { 
      //   global.realmPartition[`user_id=${global.user.id}`].delete(element);
      //   if(element.status == 'initialized'){ 
      //     let item = element; 
      //     item.key = element._id.toString(); 
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

      //     item.key = item._id.toString(); 

      //     // setUploadList(prevItems => { 
      //     //   return [item, ...prevItems];
      //     // }); 

      //     // let newList = assetList.map(el => (
      //     //   el.key === item.key ?  {...el, upload: true} : el 
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
        
        // console.log('assetsUploadEventListener modifications _id = ', modifiedItem._id);
        // console.log('assetsUploadEventListener modifications = ', modifiedItem.status);
        if(modifiedItem.status == 'initialized'){

          modifiedItem.key = modifiedItem._id.toString(); 

          setAssetList(currentList => { 
            return currentList.filter((el) => {  
            
              if(el.key == modifiedItem.key && el.status == 'local'){ 
                //console.log('modifiedItem.key ', modifiedItem.key);

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

      const assetsPublic = global.realmPartition[Configure.Realm.publicPartition].objects(Configure.Realm.cosyncAsset); 
      
      
      let sortedAssetsPublic = assetsPublic.sorted("createdAt", false);
      assetsPublic.removeListener(assetsEventListener); 
      assetsPublic.addListener(assetsEventListener); 
      sortedAssetsPublic.forEach(element => { 
        if(element.status == 'active' || (element.status == 'local' && element.sessionId == global.sessionId) ) { 
       
          let item = {};
          for (const key in element) {
            item[key] = element[key];
          } 
          item.key = item._id.toString();
          console.log("sortedAssetsPublic item.key  = ", item.key );
          setAssetList(prevItems => { 
            return [...prevItems, item];
          });
        }
        
      }); 

      const assetsPrivate = global.realmPartition[global.privatePartition].objects(Configure.Realm.cosyncAsset);  

      // global.realmPartition[`user_id=${global.user.id}`].write(() => {   
      //   global.realmPartition[`user_id=${global.user.id}`].delete(assetsPrivate); 
      // });


      let sortedResult = assetsPrivate.sorted("createdAt", false);
      assetsPrivate.removeListener(assetsEventListener); 
      assetsPrivate.addListener(assetsEventListener); 

      sortedResult.forEach(element => {
        
        if(element.status == 'active' || (element.status == 'local' && element.sessionId == global.sessionId) ) { 
          let item = {};
          for (const key in element) {
            item[key] = element[key];
          } 
          item.key = item._id.toString();
          //console.log("assetsPrivate item.key  = ", item.key );
          setAssetList(prevItems => { 
            return [item, ...prevItems];
          });  
        }
      });  

      // setTimeout(function(){
      //   assetFlatList.current.scrollToEnd({animating: true});
      // }, 1000);
      

    }

    function assetsEventListener(assets, changes) { 
      // Update UI in response to inserted objects
      changes.insertions.forEach((index) => {
        let item = assets[index]; 
        
        if(item.status == 'active'){ 
          item.key = item._id.toString(); 
          setAssetList(prevItems => { 
            return [item, ...prevItems];
          }); 
        }
      });


      // changes.modifications.forEach((index) => {
      //   let item = assets[index]; 
      //   item.key = item._id.toString(); 

      //   if(item.status == 'active'){   
      //     let newList = assetList.map(el => (
      //       el.key === item.key ?  {...el, item} : el
      //     ));

      //     setAssetList(prevItems => { 
      //       return [newList];
      //     }); 
      //   }
      // });
       
    }


const showExpiredTimeModal = () => {
  setShowExpiredTime(true);
}



const handleModalInput = (result) => {
  
  let hour = parseFloat(result);

  if(isNaN(hour)){
    
  }
  else{
    expirationHours = hour;
    setShowExpiredTime(false);  
    setTimeout(function(){
      chooseFile();
    }, 500)
    
  } 

   

}


const chooseFile = () => {  

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
 
const showMoreMenu = (item) => {
  console.log('showMoreMenu ', item.key)
}



const removedAsset = (item) => {
   

  // tell flat list item to upload
  setAssetList(currentList => {
    return currentList.filter(el => el.key != item.key);
  });
}

const itemUploaded = (item) => {

  console.log('itemUploaded ', item.key)
  
  let newList = assetList.map(el => (
    el.key == item.key ? {...el, status: 'active'} : el
  ));

  // tell flat list item to upload
  setAssetList(prevItems => {
    return newList;
  });
 

  global.realmPartition[global.privatePartition].write(() => { 
    global.realmPartition[global.privatePartition].create(Configure.Realm.cosyncAssetUpload, { _id: item._id, status: "uploaded" }, "modified"); 
  });

  // setAssetList(currentList => { 
  //   return currentList.filter(el => {  
  //     if(el.key == item._id.toString()){  
  //       el.status = 'active'; 
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
    expirationHours: expirationHours,
    sessionId: global.sessionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
    
  expirationHours = 24;

  global.realmPartition[global.privatePartition].write(() => {

    global.realmPartition[global.privatePartition].create(Configure.Realm.cosyncAssetUpload, assetObject );
    assetObject.status =  'local';
    global.realmPartition[global.privatePartition].create(Configure.Realm.cosyncAsset, assetObject);

    assetObject.key = assetObject._id.toString();   

    setAssetList(prevItems => { 
      return [assetObject, ...prevItems];
    }); 

    // setTimeout(function(){
    //   assetFlatList.current.scrollToEnd({animating: true});
    // }, 1000);

  });  

}


      return (
        <SafeAreaView style={styles.container}>
          <Loader loading={loading} />  
          <InputModal visible={showExpiredTime} handleInput={handleModalInput} />  
          {assetList.length ?

            <FlatList 
              
              ref= {assetFlatList}
              numColumns = {1}
              data={assetList} 
              // keyExtractor={(item, index) => index.toString()}
              style={styles.containerFlatList}  
              renderItem={({item}) => (
                <ProgressiveAsset item = {item}  itemUploaded={itemUploaded} removeAsset = {removedAsset} showMoreMenu = {showMoreMenu}/>
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

    export default AssetScreen;
      
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
