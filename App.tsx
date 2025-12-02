import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Splash from "./src/screens/splashscreen";
import Onboarding from "./src/screens/onboardingscreen";
import Auth from "./src/screens/Auth";
import Signup from "./src/screens/signup";
import Signup2 from "./src/screens/SignupPage2";
import Login from "./src/screens/login";
import UserScreen from "./src/screens/UserScreen";
import CustomerScreen from "./src/screens/CustomerScreen";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Login: { prefillEmail?: string } | undefined;
  Signup: undefined;
  Signup2: undefined;
  UserScreen: undefined;
  CustomerScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [savedEmail, setSavedEmail] = useState<string | undefined>();
  const [savedPassword, setSavedPassword] = useState<string | undefined>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash">
          {props => <Splash {...props} onFinish={() => props.navigation.replace("Onboarding")} />}
        </Stack.Screen>

        <Stack.Screen name="Onboarding">
          {props => <Onboarding {...props} onDone={() => props.navigation.replace("Auth")} />}
        </Stack.Screen>

        <Stack.Screen name="Auth">
          {props => (
            <Auth
              {...props}
              onGoToLogin={() => props.navigation.navigate("Login")}
              onGoToCustomerSignup={() => props.navigation.navigate("Signup")}
              onGoToUserSignup={() => props.navigation.navigate("Signup2")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Signup">
  {props => (
    <Signup
      {...props}
      onSignupDone={(email, password) => {   // <-- pass password now
        setSavedEmail(email);
        setSavedPassword(password);
        props.navigation.replace("Login", { prefillEmail: email });
      }}
      onGoToLogin={() => props.navigation.navigate("Login")}
      onBack={() => props.navigation.goBack()}
    />
  )}
</Stack.Screen>

        <Stack.Screen name="Signup2">
          {props => (
            <Signup2
              {...props}
              onSignupDone={(email, password) => {
                setSavedEmail(email);
                setSavedPassword(password);
                props.navigation.replace("Login", { prefillEmail: email });
              }}
              onGoToLogin={() => props.navigation.navigate("Login")}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

       <Stack.Screen name="Login">
  {props => (
    <Login
      {...props}
      prefillEmail={props.route.params?.prefillEmail}
      savedEmail={savedEmail}
      savedPassword={savedPassword}
      onLoginDone={(role) =>
        role === "user"
          ? props.navigation.replace("UserScreen")
          : props.navigation.replace("CustomerScreen")
      }
      onGoToSignup={() => props.navigation.navigate("Signup")}
      onBack={() => props.navigation.goBack()}
    />
  )}
</Stack.Screen>

        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="CustomerScreen" component={CustomerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
