import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import Home from './components/Home';
import EditCard from './components/EditCard/EditCard';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#008000" barStyle="light-content" />
      <Stack.Navigator >
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="EditCard" component={EditCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;