import React from 'react';
import { StatusBar } from 'react-native';
import ProfileInformation from './src/screens/ProfileInformation';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />
      <ProfileInformation />
    </>
  );
};

export default App;
