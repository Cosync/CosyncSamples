import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PasswordScreen from './PasswordScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = props => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={PasswordScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;