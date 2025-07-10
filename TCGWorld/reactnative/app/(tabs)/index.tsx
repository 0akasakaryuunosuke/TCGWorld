import { SafeAreaView } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Discover from './discover';
import Index_all from './index_all';
import Index_follow from './index_follow';
const Tab = createMaterialTopTabNavigator();
export default function HomeScreen() {


  return (

   <SafeAreaView className='flex-1 bg-myWhite mt-5'>
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarIndicatorStyle:{
          backgroundColor:'#98D98E',
        }
      }}
    >
      <Tab.Screen name="发现" component={Discover} />
      <Tab.Screen name="探索" component={Index_all} />
      <Tab.Screen name="关注" component={Index_follow} />
    </Tab.Navigator>
   </SafeAreaView>

  );
}

