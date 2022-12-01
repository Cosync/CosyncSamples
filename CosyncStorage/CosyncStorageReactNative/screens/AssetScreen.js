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
//  Copyright © 2022 cosync. All rights reserved.
//
// Import React
import React, {useState, useEffect, useContext} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList
   
} from 'react-native'; 
import Configure from '../config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';  
import ProgressiveAsset from '../components/ProgressiveAsset';   
import { AuthContext } from '../context/AuthContext';

const AssetScreen = props => {
  
  const [loading, setLoading] = useState(false);  
  const [assetList, setAssetList] = useState([]); 

 
  const { realm, realmUser, setRealmUser, login } = useContext(AuthContext); 

  useEffect(() => { 
     
    let isMounted = true;
    if (isMounted) { 
     
      checkRealm();
    }

    
      setAssetList(prevItems => { 
        return [];
      }); 

      console.log("loadAllAssets ... realm user id ", realmUser.id);
      
      const assets = realm.objects(Configure.Realm.cosyncAsset).filtered(`userId = '${realmUser.id}'`);  
      let sortedResult = assets.sorted("createdAt", false);
     
      assets.addListener(assetsEventListener); 

      console.log("loadAllAssets ... sortedResult ", sortedResult.length);

      sortedResult.forEach(element => {
        let item = element;
        item.id = element._id.toString();  
        
        setAssetList(prevItems => { 
          return [item, ...prevItems];
        });  
      }); 

     


    return () => {
      assets.removeListener(assetsEventListener); 
      isMounted = false; 
    } 
  }, [])



  // useEffect(() => {
  //   checkRealm();

  //   props.navigation.addListener('didBlur', (e) =>{
  //     setAssetList(prevItems => { 
  //       return [];
  //     }); 
  //     if(global.sound) global.sound.stop();
  //   })

  //   const naviSub = props.navigation.addListener('willFocus', checkRealm); 
  //   return () => { 
  //     naviSub.remove();
  //   };

  // }, []);
 




    async function checkRealm(){ 
          
      setLoading(true);

      try { 
        if(!realmUser || !realmUser.id){ 

          let userEmail = await AsyncStorage.getItem('user_email');
          let userPassword = await AsyncStorage.getItem('user_password');  
            
          if(!userEmail || !userPassword) setRealmUser();
          else if (!realmUser){
            let user = await login(userEmail, userPassword);
            AsyncStorage.setItem('user_id', user.id);  
          } 
        }   

        //loadAllAssets(); 
        
      } catch (error) {
        console.error(error);
      }
      finally{
        setLoading(false);
      }

    }

    
 
    function loadAllAssets(){
      try { 
        setAssetList(prevItems => { 
          return [];
        }); 
        console.log("loadAllAssets ... realm user id ", realmUser.id);
        
        const assets = realm.objects(Configure.Realm.cosyncAsset).filtered(`userId = '${realmUser.id}' && status == 'active'`);  
        let sortedResult = assets.sorted("createdAt", false);
        assets.removeListener(assetsEventListener); 
        assets.addListener(assetsEventListener); 

        console.log("loadAllAssets ... sortedResult ", sortedResult.length);

        sortedResult.forEach(element => {
          let item = element;
          item.id = element._id.toString();  
          
          setAssetList(prevItems => { 
            return [item, ...prevItems];
          });  
        }); 

      } catch (error) {
        console.log("loadAllAssets ... error ", error);
      }


    }

    function assetsEventListener(assets, changes) { 


      console.log("assetsEventListener ... assets ", assets.length);


      try { 

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
 


      } catch (error) {
        onsole.log("changes.modifications error", error);
      }

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
        }
        
         
      });
