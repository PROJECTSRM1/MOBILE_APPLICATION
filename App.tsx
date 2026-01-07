import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookCleaningScreen from "./src/screens/BookCleaningScreen";
import Paymentscreen from "./src/screens/Paymentscreen"; // Added import

export type RootStackParamList = {
  BookCleaning: undefined;
  PaymentSummary: undefined; // Match the name used in your navigation.navigate() call
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BookCleaning"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="BookCleaning"
          component={BookCleaningScreen}
        />
        {/* Added the Payment Summary screen to the stack */}
        <Stack.Screen
          name="PaymentSummary"
          component={Paymentscreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}