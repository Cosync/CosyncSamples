
import React, { useContext } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; 
import HomeScreen from '../screens/HomeScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();


export default function AppNav() {
  
    const { currentUser } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {currentUser ? 
                <AppStack/> : 
                <AuthStack/>
            }
        </NavigationContainer>

    )
}


const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
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
  