//
//  Loader.js
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

//Import React and Hook we needed
import React , {useState} from 'react';
import Dialog from "react-native-dialog";
//Import all required component
import { StyleSheet, View } from 'react-native';  

const AssetMenu = props => {
  const { visible, ...attributes } = props; 
  const [hour, setHour] = useState('24');
  return (
    
    <View style={styles.container} >
      <Dialog.Container visible={visible}>
        <Dialog.Title>Asset Menu</Dialog.Title>
        <Dialog.Description>
          Manage your asset with those buttons:
        </Dialog.Description> 
        <Dialog.Button label="Refresh" onPress={() =>  props.handleInput('refresh')} />
        <Dialog.Button label="Remove" onPress={() =>  props.handleInput('remove')}  />
        <Dialog.Button label="Close" onPress={() =>  props.handleInput(false)}  />
      </Dialog.Container>
    </View>
  );
};
export default AssetMenu;

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});