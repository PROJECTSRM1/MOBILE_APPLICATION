import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from './android/app/src/screens/AuthScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#101622"
      />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Auth"   // ✅ FIXED
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
