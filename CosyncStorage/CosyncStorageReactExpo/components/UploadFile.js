//
//  UploadFile.js
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

//Import React and Hook we needed
import React, {useState} from 'react';

//Import all required component
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Request from './Request';   

const UploadFile = props => {

    const { item, ...attributes } = props;
    
    const [progress, setProgress] = useState(0);  

    const [totalFileZise, setTotalFileZise] = useState(item.zise);  

    if(item.upload == true && item.uploaded == false && item.writeUrl){  

        item.uploaded = true;

        Request(item.writeUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': item.type
            },
            body: { uri: item.uri },
        }, (progressEvent) => { 
            const progress = progressEvent.loaded / progressEvent.total; 
            //console.log(` uploadImage  ${item.sizeType}..progress ...`, Math.ceil(progress * 100 )); 
            let size = (parseInt(progressEvent.total) / 1024) / 1024;
            size = Math.ceil(size);
            setTotalFileZise(size);
            let num = Math.ceil(progress * 100);
            setProgress(num);
           
        }).then((res) => { 
            
            props.itemUploaded(item.id);

        }, (err) => console.log(err)) 

    }
     
  


    return ( 
        <View style={styles.container}> 
           
            <View style={styles.progressCircle}> 

                <ActivityIndicator size='large' 
                    animating={progress > 0 && progress < 100}
                    hidesWhenStopped = {true}/>

                <Text style={{ fontSize: 18 }}>{item.sizeType} </Text>
                {totalFileZise > 0 ? <Text>{totalFileZise } MB </Text> : null}
                <Text>{`${progress}%`}</Text>

                
            </View>

        </View>

    
        );
};
export default UploadFile;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        width: 100,
        height: 100,
        margin: 10
    },
 
    
    progressCircle: {
       
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center',
        
    }
});