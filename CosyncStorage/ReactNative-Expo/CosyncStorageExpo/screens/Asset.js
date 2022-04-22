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
import Loader from '../components/Loader';  
import ProgressiveAsset from '../components/ProgressiveAsset';   

const Asset = props => {
  
  const [loading, setLoading] = useState(false);  
  const [assetList, setAssetList] = useState([]); 


  useEffect(() => {

    loadAllAssets(); 

    props.navigation.addListener('didBlur', (e) =>{
      setAssetList(prevItems => { 
        return [];
      }); 
      if(global.sound) global.sound.stop();
    })

     

  }, []);
 

   
  async function loadAllAssets(){

    console.log('loadAllAssets .... ');
    setLoading(true);
    setAssetList(prevItems => { 
      return [];
    }); 

    const assetsPublic = await global.realm.objects(Configure.Realm.cosyncAsset).filtered(`uid = '${global.user.id}'`);  
    console.log('loadAllAssets .... assetsPublic ', assetsPublic.length);

    let sortedAssetsPublic = assetsPublic.sorted("createdAt", false);

     
    console.log('loadAllAssets .... sortedAssetsPublic ', sortedAssetsPublic.length);

    assetsPublic.removeListener(assetsEventListener);
    assetsPublic.addListener(assetsEventListener);

    sortedAssetsPublic.forEach(element => { 
      if(element.status == "active"){
        let item = element; 
        item.id = element._id.toString();
        setAssetList(prevItems => { 
          return [item, ...prevItems];
        });
      }
    }); 

    const assetsPrivate = global.realmPrivate.objects(Configure.Realm.cosyncAsset);
    console.log('loadAllAssets .... assetsPrivate ', assetsPrivate.length);

    let sortedResult = assetsPrivate.sorted("createdAt", false);
    assetsPrivate.removeListener(assetsEventListener);
    assetsPrivate.addListener(assetsEventListener);

    sortedResult.forEach(element => {
      if(element.status == "active"){
        let item = element;
        item.id = element._id.toString();  
          
        setAssetList(prevItems => { 
          return [item, ...prevItems];
        });  
      }
    }); 

    setLoading(false);


  }

    function assetsEventListener(assets, changes) { 
      // Update UI in response to inserted objects
      changes.insertions.forEach((index) => {
        let item = assets[index]; 
        
        console.log("insertions ", item.status);

        if(item.status == 'active'){ 
          item.id = item._id.toString(); 
          setAssetList(prevItems => { 
            return [item, ...prevItems];
          }); 
        }
      });

      changes.modifications.forEach((index) => {
        let item = assets[index]; 
        console.log("modifications ", item.status);
        if(item.status != 'active'){ 
          item.id = item._id.toString(); 
          assetList = assetList.filter(asset => asset._id != item._id);
          setAssetList(assetList); 
        }
        else if(item.status == 'active'){ 
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
