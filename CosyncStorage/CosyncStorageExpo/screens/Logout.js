import React, {useEffect, useContext} from 'react'; 
import {
   
    Text
    
  } from 'react-native';
import { AuthContext } from '../context/AuthContext';


export default function Logout() {

    const {  logout } = useContext(AuthContext); 

    useEffect(() => { 
     
        let isMounted = true;
        if (isMounted) {
    
            logout();
        }
    
        return () => {
            isMounted = false; 
        } 
      }, [])
    

      
  return (
    <></>
  )
}
