import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UploadScreen from './UploadScreen';
import AssetScreen from './AssetScreen';
import Logout from './Logout';

const Tab = createBottomTabNavigator();

const HomeScreen = props => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Asset" component={AssetScreen} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
}

export default HomeScreen;