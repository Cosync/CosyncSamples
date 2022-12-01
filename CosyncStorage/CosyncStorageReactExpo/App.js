import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {  AuthProvider } from './context/AuthContext';
import AppNav from './components/AppNav';
export default function App() {
  return ( 
    <>
      <StatusBar style='light' />

      <AuthProvider>
        <AppNav/> 
      </AuthProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
