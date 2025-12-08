import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./src/screens/Splash";
import Onboarding from "./src/screens/Onboarding";
import WelcomeOne from "./src/screens/WelcomeOne";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import Landing from "./src/screens/Landing";
import CustomerDashboard from "./src/screens/CustomerDashboard";
import UserDashboard from "./src/screens/UserDashboard";
import Settings from "./src/screens/Settings";
import Transport from "./src/screens/Transport";
import Construction from "./src/screens/Construction";
import Rentals from "./src/screens/Rentals";
import Freelancer from "./src/screens/Freelancer";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Landing: undefined;
  WelcomeOne: undefined;
  // Login: undefined;
    Login: { role?: "customer" | "user"; prefilledEmail?: string;prefilledPassword?: string;
 } | undefined;
  Signup: undefined;
  Transport: undefined;
  CustomerDashboard: undefined;
  UserDashboard: undefined;
  Settings: undefined;
  Rentals: undefined;
  Construction: undefined;
  Freelancer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="WelcomeOne" component={WelcomeOne} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="Transport" component={Transport} />
        <Stack.Screen name="Construction" component={Construction} />
        {/* <Stack.Screen name="Cleaning" component={Cleaning} /> */}
        {/* <Stack.Screen name="Packers" component={Packers} /> */}
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Rentals" component={Rentals} />
        <Stack.Screen name="Freelancer" component={Freelancer} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
