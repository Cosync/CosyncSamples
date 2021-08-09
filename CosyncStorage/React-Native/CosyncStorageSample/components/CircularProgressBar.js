//
//  CirculaProgressbar.js
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


  import React, { useEffect } from 'react';
  import { View, StyleSheet, Animated, Easing } from 'react-native';
  import PropTypes from 'prop-types';

  const CircularProgressBar = (props) => {
  const {
    activeColor,
    passiveColor,
    baseColor,
    radius,
    percent,
    width,
    duration,
    children,
  } = props;

  const initialValueHalfCircle = percent >= 50 ? 0 : 180;
  const initialValueInnerCircle = 0;
  const firstCircleAnimatedValue = new Animated.Value(initialValueHalfCircle);
  const secondCircleAnimatedValue = new Animated.Value(initialValueHalfCircle);
  const thirdCircleAnimatedValue = new Animated.Value(initialValueInnerCircle);
  const timePerDegree = duration / 360;
  const firstCircleColor = activeColor;
  const secondCircleColor = percent >= 50 ? activeColor : passiveColor;

  const secondAnimation = () => {
    firstCircleAnimatedValue.setValue(initialValueHalfCircle);
    secondCircleAnimatedValue.setValue(initialValueHalfCircle);
    thirdCircleAnimatedValue.setValue(initialValueHalfCircle);
    Animated.parallel([
      Animated.timing(firstCircleAnimatedValue, {
        toValue: 180,
        duration: 180 * timePerDegree,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(secondCircleAnimatedValue, {
        toValue: 180 + (percent - 50) * 3.6,
        duration: (180 + (percent - 50) * 3.6) * timePerDegree,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(thirdCircleAnimatedValue, {
        toValue: (percent - 50) * 3.6,
        delay: 180 * timePerDegree,
        duration: timePerDegree * ((percent - 50) * 3.6),
        useNativeDriver: false,
        easing: Easing.linear,
      }),
    ]).start();
  };

  const firstAnimation = () => {
    Animated.timing(secondCircleAnimatedValue, {
      toValue: 180 + percent * 3.6,
      duration: percent * 3.6 * timePerDegree,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  useEffect(() => {
    if (percent < 50) {
      firstAnimation();
    } else {
      secondAnimation();
    }
  });

  const renderHalf = (color, transforms = [], otherStyles = {}) => (
    <Animated.View
      style={[
        styles.half,
        { backgroundColor: color, borderColor: color },
        { width: radius, height: radius * 2, borderRadius: radius },
        {
          transform: [
            { translateX: radius / 2 },
            ...transforms,
            { translateX: -radius / 2 },
          ],
        },
        otherStyles,
      ]}
    />
  );

  const rotate1 = firstCircleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1deg'],
  });

  const rotate2 = secondCircleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1deg'],
  });

  const rotate3 = thirdCircleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1deg'],
  });

  const elevation3 = thirdCircleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  const innerCircleStyle = {
    backgroundColor: baseColor,
    width: 2 * radius - width,
    height: 2 * radius - width,
    borderRadius: radius,
    elevation: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={styles.container} key={percent}>
      <View
        style={[
          styles.outerCircle,
          {
            height: radius * 2,
            width: radius * 2,
            borderRadius: radius,
            backgroundColor: passiveColor,
            overflow: 'hidden',
          },
        ]}
      >
        {renderHalf(firstCircleColor, [{ rotate: rotate1 }])}
        {renderHalf(secondCircleColor, [{ rotate: rotate2 }])}
        {renderHalf(passiveColor, [{ rotate: rotate3 }], {
          elevation: elevation3, zIndex: elevation3,
        })}
        {<View style={innerCircleStyle}>
          {children}
        </View>}
      </View>
    </View>
  );
};

CircularProgressBar.propTypes = {
  activeColor: PropTypes.string.isRequired,
  passiveColor: PropTypes.string.isRequired,
  baseColor: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  children: PropTypes.element,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  half: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default CircularProgressBar;
