

// import React, { useState } from 'react';
// import Splash from './src/screens/Splash';
// import Onboarding from './src/screens/Onboarding';

// export default function App() {
//   const [showSplash, setShowSplash] = useState(true);
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   const onSplashFinish = () => {
//     setShowSplash(false);
//     setShowOnboarding(true);
//   };

//   const onOnboardingDone = () => {
//     setShowOnboarding(false);
//   };

//   if (showSplash) return <Splash onFinish={onSplashFinish} />;
//   if (showOnboarding) return <Onboarding onDone={onOnboardingDone} />;

//   return null;
// }


// App.tsx (replace content safely)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// your screens
import Splash from './src/screens/Splash';
import Onboarding from './src/screens/Onboarding';
import WelcomeOne from './src/screens/WelcomeOne';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

// --------- IMPORTANT ---------
// These names MUST match the screen names you use in navigation.navigate()
// ---------------------------------
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  WelcomeOne: undefined;
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="WelcomeOne" component={WelcomeOne} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
