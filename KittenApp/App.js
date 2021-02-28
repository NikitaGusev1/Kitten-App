import 'react-native-gesture-handler';
import React from 'react';
import {KittenListView} from './android/app/src/main/components/views/KittenListView';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {KittenInfoView} from './android/app/src/main/components/views/KittenInfoView';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="KittenList">
        <Stack.Screen name="KittenList" component={KittenListView} />
        <Stack.Screen name="KittenInfo" component={KittenInfoView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
