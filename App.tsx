import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProductScreen from "./android/app/src/screens/ProductScreen";

export type RootStackParamList = {
  ProductScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
