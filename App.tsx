import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import EmployeeAllocation from './src/screens/EmployeeAllocation';


function App() {
  const isDarkMode = useColorScheme() === 'dark';


  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}


function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();


  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <EmployeeAllocation/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default App;