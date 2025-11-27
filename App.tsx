// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import your screens
import Splash from "./src/screens/splashscreen";
import Onboarding from "./src/screens/onboardingscreen";

import Auth from "./src/screens/Auth";
import Signup from "./src/screens/signup";
import Login from "./src/screens/login";
import Home from "./src/screens/home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // No headers in any screen
        }}
      >
        {/* Splash Screen */}
        <Stack.Screen name="Splash">
          {(props) => (
            <Splash
              {...props}
              onFinish={() => props.navigation.replace("Onboarding")}
            />
          )}
        </Stack.Screen>

        {/* Onboarding Screen */}
        <Stack.Screen name="Onboarding">
          {(props) => (
            <Onboarding
              {...props}
              onDone={() => props.navigation.replace("Auth")}
            />
          )}
        </Stack.Screen>

        {/* Auth Screen */}
        <Stack.Screen name="Auth">
          {(props) => (
            <Auth
              {...props}
              onGoToLogin={() => props.navigation.navigate("Login")}
              onGoToSignup={() => props.navigation.navigate("Signup")}
            />
          )}
        </Stack.Screen>

        {/* Signup Screen */}
        <Stack.Screen name="Signup">
          {(props) => (
            <Signup
              {...props}
              onSignupDone={() => props.navigation.replace("Home")}
              onGoToLogin={() => props.navigation.navigate("Login")}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* Login Screen */}
        <Stack.Screen name="Login">
          {(props) => (
            <Login
              {...props}
              onLoginDone={() => props.navigation.replace("Home")}
              onGoToSignup={() => props.navigation.navigate("Signup")}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* Home Screen */}
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
