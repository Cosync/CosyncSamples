//
//  ProgressiveAsset.js
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
import React, {useContext, useState} from 'react';

//Import all required component
import { StyleSheet, View, Text, Image, ActivityIndicator,TouchableOpacity } from 'react-native'; 
import VideoPlayer from './VideoPlayer'; 
import Sound from 'react-native-sound';
import { AuthContext } from '../context/AuthContext';

const ProgressiveAsset = props => {
    const {  realmUser } = useContext(AuthContext); 
    const { item, ...attributes } = props; 
    let [loading, setLoading] = useState(false);
    let [error, setLoadingError] = useState(false); 
    let [asset, setAssetObject] = useState(item); 

    Sound.setCategory('Playback');
    
   

    const refreshAsset = () => {
        
        setLoading(true);
        setLoadingError(false); 

        let id = asset._id.toString();
        
        realmUser.functions.CosyncRefreshAsset(id).then(newAsset => { 

            //if(!newAsset || !newAsset._id) setLoadingError(true);  
            setLoading(false);
            if(newAsset && newAsset.contentType) setAssetObject(newAsset);
        });

    }

    const handleErrorLoadImage = (e) => { 
         
        setLoading(false);
        setLoadingError(true); 
    }


    const stopSound = () => {
        if(!global.sound) return;
        
        global.sound.stop(() => {
            console.log('Stop');
        });
    }

    const playSound = (item) => { 
        setLoading(true);

        if(global.sound) global.sound.stop();

        global.sound = new Sound(item.url, null, (error) => {
            setLoading(false);
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
            // loaded successfully
            //console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
           
            // Play the sound with an onEnd callback
            global.sound.play((success) => {
              if (success) {
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
              global.sound.release();
            });
          });
 
    }

    return ( 
        <View style={styles.container}> 
        
            {asset.contentType.indexOf("image") >= 0 ? 
       
                <Image 
                    onLoadStart={(e) => setLoading(true)}
                    onLoadEnd={(e) => setLoading(false)} 
                    onError={handleErrorLoadImage}
                    source={{ uri: asset.urlMedium || 'undefined'}} 
                    style={[styles.imageThumbStyle]}
                />  
            : null } 

            {asset.contentType.indexOf("video") >= 0 ? 
            <View style={styles.videoStyle}>   
                <VideoPlayer 
                    item = {asset}  
                    onLoadStart={(e) => setLoading(true)}
                    onLoadEnd={(e) => { setLoading(false)} }
                    onLoadError={handleErrorLoadImage}
                />  
            </View > 
            : null } 

            {asset.contentType.indexOf("sound") >= 0 ? 
                <View style={styles.soundStyle}> 
                    <TouchableOpacity onPress={() => playSound(asset)}  style={styles.buttonStyle}>
                        <Text style={styles.soundBtnTextStyle}>Play Sound</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => stopSound()}  style={styles.buttonStyle}>
                        <Text style={styles.soundBtnTextStyle}>Stop Sound</Text>
                    </TouchableOpacity>
                </View> 
            : null }   

            {
                error ?  <View style={styles.errorTextStyle}>  
                <Text
                    style={styles.textStyle}
                    onPress={refreshAsset}>
                    Invalid URL
                </Text> 
                </View> : null
            }

            {
                loading ?
            
                <View style={styles.loading}>
                    <ActivityIndicator size='large' 
                    animating={loading}
                    hidesWhenStopped = {true}
                    />
                </View>
                :  null
            }
      </View>

       
    );

};
export default ProgressiveAsset;


const styles = StyleSheet.create({
    container: { 
        backgroundColor: '#e1e4e8',
        alignItems: 'center', 
        margin: 10,
        width: 360,
        height: 360,
        justifyContent: 'center',
    }, 
    soundStyle : {  
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 360,
        height: 360,
        justifyContent: 'center',
        
    },
    videoStyle : {  
        marginTop  : 25,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 360,
        height: 360,
        alignItems: 'center', 
    },
    imageThumbStyle: {   
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 360,
        height: 360,
        alignItems: 'center', 
    },
    
    activityIndicator: {
        alignItems: 'center', 
        height: 80,
        marginTop: -130
        
    },
     
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    errorTextStyle : { 
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {  
        color: '#4638ab', 
        fontSize: 14,
    }, 

    buttonStyle: {
        backgroundColor: '#4638ab',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        
    },
    soundBtnTextStyle: {
        color: 'white',
        paddingVertical: 10,
        fontSize: 16,
    },
     
     
})