
import React, {createContext, useState, useEffect} from "react"

import CosyncJWTReactNative from 'cosync-jwt-react-native';  
import uuid from 'react-native-uuid';


export const AuthContext = createContext();
  

export function AuthProvider({ children }) {

    const [appData, setAppData] = useState() 
    const [currentUser, setCurrentUser] = useState() 
     
  


    function login() {

        console.log('AuthContext login currentUser 1 ', currentUser);

        setCurrentUser(true);

        console.log('AuthContext login currentUser 2 ', currentUser);
    }


    function logout() {
        setCurrentUser(false);
    }


    const value = { 
        login, 
        logout, 
        currentUser,
        appData
      }

      
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}