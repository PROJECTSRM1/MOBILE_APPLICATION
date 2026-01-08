import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CompaniesListingScreen from "../CompaniesListingScreen";
import JobDetailsScreen from "../JobDetailsScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Companies"
          component={CompaniesListingScreen}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
