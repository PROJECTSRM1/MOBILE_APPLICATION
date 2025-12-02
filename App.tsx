import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./src/screens/Splash";
import Onboarding from "./src/screens/Onboarding";
import WelcomeOne from "./src/screens/WelcomeOne";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import Landing from "./src/screens/Landing";
// import Cleaning from "./src/screens/Cleaning";
// import Packers from "./src/screens/PackersAndMovers";
import CustomerDashboard from "./src/screens/CustomerDashboard";
import UserDashboard from "./src/screens/UserDashboard";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Landing: undefined;
  WelcomeOne: undefined;
  Login: undefined;
  Signup: undefined;
  Cleaning: undefined;
  Packers: undefined;
  CustomerDashboard: undefined;
  UserDashboard: undefined;
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
        {/* <Stack.Screen name="Cleaning" component={Cleaning} /> */}
        {/* <Stack.Screen name="Packers" component={Packers} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
