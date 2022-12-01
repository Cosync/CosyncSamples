
import React, { useContext } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';  
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();


export default function AppNav() {
  
    const { realmUser } = useContext(AuthContext);

    return (
      <NavigationContainer>
          {realmUser ? 
              <AppStack/> : 
              <AuthStack/>
          }
      </NavigationContainer>

    )
}


const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />  
      </Stack.Navigator>
    );
  };
  
  
  const AppStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/> 
      </Stack.Navigator>
    );
  };
  