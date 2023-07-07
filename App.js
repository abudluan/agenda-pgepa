import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import Home from './components/Home';
import AddContact from './components/AddContact/AddContact';
import EditContact from './components/EditContact/EditContact';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#008000" barStyle="light-content" />
      <Stack.Navigator >
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="AddContact" component={AddContact} options={{
          headerShown: true,
          title: 'Cadastro de contato',
          headerStyle: {
            backgroundColor: '#008000',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
        }} />
        <Stack.Screen name="EditContact" component={EditContact} options={{
          headerShown: true,
          title: 'Editar contato',
          headerStyle: {
            backgroundColor: '#008000',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;