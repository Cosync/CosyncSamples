//
//  AppStack.js
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


 
import React, { useContext } from 'react'; 
import { AuthContext } from '../store/auth-context';
import { Alert, Button } from 'react-native'; 
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useDrawerProgress,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import Upload from '../screens/Upload';
import Asset from '../screens/Asset';


const Drawer = createDrawerNavigator(); 


 
const AppStack = () => {

    const authCtx = useContext(AuthContext);

    const screenOptions = {
        headerStyle:{
            backgroundColor: '#4638ab'
        },
        headerTintColor:'white',
        headerTitleStyle:{
            fontWeight:'bold'
        }
    };


            
        
    function CustomDrawerContent(props) {
        const progress = useDrawerProgress();

        const translateX = Animated.interpolateNode(progress, {
            inputRange: [0, 1],
            outputRange: [-100, 0],
        });

        return (
            <DrawerContentScrollView {...props}>
            <Animated.View style={{ transform: [{ translateX }] }}>
                <DrawerItemList {...props} />
                <DrawerItem label="Logout" onPress={logout} />
            </Animated.View>
            </DrawerContentScrollView>
        );
    }

    function logout(){
        Alert.alert(
            'Logout',
            'Are you sure? You want to logout?',
            [
            {
                text: 'Cancel',
                 
            },
            {
                text: 'Confirm',
                onPress: () => {  
                    authCtx.logout() 
                },
            },
            ],
            { cancelable: false }
        );

    }
    
        

    return ( 

        <Drawer.Navigator
            screenOptions = {screenOptions} 
            useLegacyImplementation
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            > 
            <Drawer.Screen name="Upload" component={Upload} />
            <Drawer.Screen name="Asset" component={Asset}/> 
            
        </Drawer.Navigator>
    )
}
export default AppStack
 