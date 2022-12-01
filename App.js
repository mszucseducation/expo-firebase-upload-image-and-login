import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator }  from '@react-navigation/stack';

import Photos from './screens/Photos';
import React from 'react';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PhotoPage">
        <Stack.Screen name="Photos Page" component={Photos}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

