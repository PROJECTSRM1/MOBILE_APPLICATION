/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import NotificationsScreen from './android/app/src/screens/NotificationsScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#101622' }}>
      <StatusBar barStyle="light-content" />
      <NotificationsScreen />
    </SafeAreaView>
  );
};

export default App;


