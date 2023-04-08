import { StatusBar } from 'expo-status-bar';
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
 