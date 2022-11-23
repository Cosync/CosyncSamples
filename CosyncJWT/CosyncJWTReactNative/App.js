/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import * as React from 'react';
 import { NavigationContainer } from '@react-navigation/native';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import RegisterScreen from './screens/RegisterScreen';
 import SignupScreen from './screens/SignupScreen';
 import LoginScreen from './screens/LoginScreen';
 import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
 import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
let authData = false
export default function App() {
  return (
    <NavigationContainer>
      {authData ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
  

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Signin" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};


const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home Screen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
