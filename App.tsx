// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Splash from "./src/screens/splashscreen";           // ✔ corrected path name
import Onboarding from "./src/screens/onboardingscreen";   // ✔ corrected path name

import Freelancer from "./src/screens/Freelancer";
import Signup from "./src/screens/Signup";
// import Login from "./src/screens/Login";
import ServiceRequests from "./src/screens/ServiceRequests";
import Login from "./src/screens/login";
import FreelancerPremiumFlow from "./src/screens/FreelancerPremiumScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
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
              onDone={() => props.navigation.replace("Freelancer")}
            />
          )}
        </Stack.Screen>

        {/* Freelancer Screen */}
        <Stack.Screen name="Freelancer" component={Freelancer} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Signup Screen */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="FreelancerPremiumFlow" component={FreelancerPremiumFlow} />
        <Stack.Screen name="Signup" component={Signup} />
<Stack.Screen name="ServiceRequests" component={ServiceRequests} />
        {/* Login Screen */}
        {/* <Stack.Screen name="Login" component={Login} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
