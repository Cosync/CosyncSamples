//
//  VideoPlayer.js
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

import React, { useRef} from 'react'; 
import { StyleSheet, View} from 'react-native'; 
import Video from 'react-native-video';  

const VideoPlayer = props => {

    const { item, ...attributes } = props;

    let videoPlayer = useRef(null);  
 

    const onLoadEnd = (data) => { 
        
        props.onLoadEnd(true);
        
    };

    const onLoadStart = (data) => {
        props.onLoadStart(true);
    }
    
    const onVideoError = (err) => {
        props.onLoadError(err);
    }

    return (
        <View style={styles.container}>
           
            <Video 
                onLoad={onLoadEnd}
                onLoadStart={onLoadStart}  
                onError={onVideoError}    
                controls = {true} 
                paused = {true}
                ref={p => { videoPlayer = p; }} 
                source={{
                uri:
                    item.url,
                }} 
                volume={10}
                style={styles.videoStyle}
            /> 

        </View>
        
      );

}
export default VideoPlayer;



const styles = StyleSheet.create({
    container: {  
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    }, 
    videoStyle: {  
        marginTop: -50,
        width: 380,
        height: 380,
        alignItems: 'center', 
    },
    activityIndicator: {
        alignItems: 'center', 
        height: 80,
        marginTop: -130
        
    }
  });