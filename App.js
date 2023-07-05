import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import Home from './components/Home';
import Login from './components/Login/Login';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#008000" barStyle="light-content" />
      <Stack.Navigator >
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#008000',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#fff'
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;