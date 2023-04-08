/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React from 'react';   
import {  AuthProvider } from './context/AuthContext';
import AppNav from './components/AppNav';
 

export default function App() {  
  return (
    <AuthProvider>
       <AppNav/> 
    </AuthProvider>
   
  );
}