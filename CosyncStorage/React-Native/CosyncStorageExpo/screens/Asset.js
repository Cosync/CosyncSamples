//
//  AssetScreen.js
//  CosyncStorageExpo
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

// Import Image Picker 
import Configure from '../config/Config'; 
import * as RealmLib from '../managers/RealmManager';  
import Loader from '../components/Loader';  
import ProgressiveAsset from '../components/ProgressiveAsset';   

const Asset = props => {
  
  const [loading, setLoading] = useState(false);  
  const [assetList, setAssetList] = useState([]); 

  //global.currentScreenIndex = 'AssetScreen';


  useEffect(() => {
    openRealm();

    props.navigation.addListener('didBlur', (e) =>{
      setAssetList(prevItems => { 
        return [];
      }); 
      if(global.sound) global.sound.stop();
    })

    const naviSub = props.navigation.addListener('willFocus', openRealm); 
    return () => { 
      naviSub.remove();
    };

  }, []);
 

    async function openRealm(){
        setLoading(true); 
        
        global.appId = Configure.Realm.appId; 
  
        // if(!global.user || !global.user.id){ 
  
        //   let userEmail = await AsyncStorage.getItem('user_email');
        //   let userPassword = await AsyncStorage.getItem('user_password'); 
            
        //   if(!userEmail || !userPassword){
        //       props.navigation.navigate('Auth'); 
        //       return;
        //   }

        //   let user = await RealmLib.login(userEmail, userPassword);
        //   AsyncStorage.setItem('user_id', user.id);  
          
        // }  

        await RealmLib.openRealmPartition(Configure.Realm.publicPartition);   
        await RealmLib.openRealmPartition(`user_id=${global.user.id}`); 
       
        loadAllAssets(); 

        setLoading(false); 
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
        let item = element; 
        item.id = element._id.toString();
        setAssetList(prevItems => { 
          return [item, ...prevItems];
        });
      }); 

      const assetsPrivate = global.realmPartition[`user_id=${global.user.id}`].objects(Configure.Realm.cosyncAsset).filtered(`status == 'active'`);  
      let sortedResult = assetsPrivate.sorted("createdAt", false);
      assetsPrivate.removeListener(assetsEventListener); 
      assetsPrivate.addListener(assetsEventListener); 

      sortedResult.forEach(element => {
        let item = element;
        item.id = element._id.toString();  
         
        setAssetList(prevItems => { 
          return [item, ...prevItems];
        });  
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
       
    }
       
      return (
        <SafeAreaView style={styles.container}>
          <Loader loading={loading} />  

          {assetList.length ?

          <FlatList 
            numColumns = {1}
            data={assetList}
            refreshing = {loading}
             
            style={styles.containerFlatList}  
            renderItem={({item}) => (
              <ProgressiveAsset item = {item}/>
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

    export default Asset;
      
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
        }
        
         
      });
