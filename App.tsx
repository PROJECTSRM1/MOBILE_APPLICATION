// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

// Screens
import Splash from "./src/screens/splashscreen";
import Onboarding from "./src/screens/onboardingscreen";
import Auth from "./src/screens/Auth";
import Signup from "./src/screens/signup";      // Customer Signup Page
import Signup2 from "./src/screens/SignupPage2"; // User Signup Page
import Login from "./src/screens/login";
import Home from "./src/screens/home";
import UserScreen from "./src/screens/UserScreen";
import CustomerScreen from "./src/screens/CustomerScreen";

// Define type for all routes
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Login: { prefillEmail?: string } | undefined;
  Signup: undefined;
  Signup2: undefined;
  Home: undefined;
  UserScreen: undefined;
  CustomerScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >

        {/* Splash */}
        <Stack.Screen name="Splash">
          {(props: NativeStackScreenProps<RootStackParamList, "Splash">) => (
            <Splash {...props} onFinish={() => props.navigation.replace("Onboarding")} />
          )}
        </Stack.Screen>

        {/* Onboarding */}
        <Stack.Screen name="Onboarding">
          {(props: NativeStackScreenProps<RootStackParamList, "Onboarding">) => (
            <Onboarding {...props} onDone={() => props.navigation.replace("Auth")} />
          )}
        </Stack.Screen>

        {/* Auth Screen */}
        <Stack.Screen name="Auth">
          {(props: NativeStackScreenProps<RootStackParamList, "Auth">) => (
            <Auth
              {...props}
              onGoToLogin={() => props.navigation.navigate("Login")}
              onGoToCustomerSignup={() => props.navigation.navigate("Signup")}
              onGoToUserSignup={() => props.navigation.navigate("Signup2")}
            />
          )}
        </Stack.Screen>

        {/* Login */}
        <Stack.Screen name="Login">
          {(props: NativeStackScreenProps<RootStackParamList, "Login">) => (
            <Login
              {...props}
              prefillEmail={props.route.params?.prefillEmail}
              onLoginDone={(role: "user" | "customer") =>
                role === "user"
                  ? props.navigation.replace("UserScreen")
                  : props.navigation.replace("CustomerScreen")
              }
              onGoToSignup={() => props.navigation.navigate("Signup")}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* Customer Signup */}
        <Stack.Screen name="Signup">
          {(props: NativeStackScreenProps<RootStackParamList, "Signup">) => (
            <Signup
              {...props}
              onSignupDone={(email: string) =>
                props.navigation.replace("Login", { prefillEmail: email })
              }
              onGoToLogin={() => props.navigation.navigate("Login")}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* User Signup */}
        <Stack.Screen name="Signup2">
          {(props: NativeStackScreenProps<RootStackParamList, "Signup2">) => (
            <Signup2
              {...props}
              onSignupDone={(email: string) =>
                props.navigation.replace("Login", { prefillEmail: email })
              }
              onGoToLogin={() => props.navigation.navigate("Login")}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* Home */}
        <Stack.Screen name="Home" component={Home} />

        {/* New Screens */}
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="CustomerScreen" component={CustomerScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
