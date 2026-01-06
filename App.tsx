
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
import FreelancerScreen from "./src/screens/FreelancerScreen";
import ServiceRequestsScreen from "./src/screens/ServiceRequestsScreen";
import FreelancerDashboard from "./src/screens/FreelancerDashboard";
import FDOverview from "./src/screens/FDOverview";
import WalletScreen from "./src/screens/WalletScreen";
import CustomerLoginScreen from "./src/screens/CustomerLoginScreen";
import CustomerRegisterScreen from "./src/screens/CustomerRegisterScreen";
import CustomerHome from "./src/screens/CustomerHome";
import CleaningServiceScreen from "./src/screens/CleaningServiceScreen";
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
FreelancerDashboard: undefined;
FDOverview: undefined;
Freelancer: undefined;
ServiceRequests: undefined;
Wallet: undefined;
CustomerLogin: undefined;
CustomerRegister: undefined;
CustomerHome: undefined;
Cleaning: undefined;
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
<Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
<Stack.Screen name="Cleaning" component={CleaningServiceScreen} />
<Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
<Stack.Screen name="CustomerHome" component={CustomerHome} />
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
<Stack.Screen name="Freelancer" component={FreelancerScreen} />
<Stack.Screen name="ServiceRequests" component={ServiceRequestsScreen} />
<Stack.Screen name="FreelancerDashboard" component={FreelancerDashboard} />
<Stack.Screen name="FDOverview" component={FDOverview} />
<Stack.Screen name="Wallet" component={WalletScreen} />



</Stack.Navigator>
</NavigationContainer>
);
}


