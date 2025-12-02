import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Screens
import SplashScreen from "./android/app/src/screens/screen1/SplashScreen";
import Onboarding from "./android/app/src/screens/screen2/Onboarding";
import LoginScreen from "./android/app/src/screens/screen3/LoginScreen";
import SignupChoice from "./android/app/src/screens/screen4/SignupChoice";
import CustomerSignup from "./android/app/src/screens/screen4/CustomerSignup";
import UserSignup from "./android/app/src/screens/screen4/UserSignup";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Define your navigation stack types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignupChoice: undefined;
  CustomerSignup: undefined;
  UserSignup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {showSplash ? (
            <Stack.Screen name="Splash">
              {(props) => (
                <SplashScreen
                  {...props}
                  onFinish={() => {
                    setShowSplash(false);
                    setShowOnboarding(true);
                  }}
                />
              )}
            </Stack.Screen>
          ) : showOnboarding ? (
            <Stack.Screen name="Onboarding">
              {(props) => (
                <Onboarding
                  {...props}
                  onDone={() => {
                    setShowOnboarding(false);
                  }}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignupChoice" component={SignupChoice} />
              <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
              <Stack.Screen name="UserSignup" component={UserSignup} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
