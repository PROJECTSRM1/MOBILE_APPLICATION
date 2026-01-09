// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import Splash from "./src/screens/Splash";
// import Onboarding from "./src/screens/Onboarding";
// // import WelcomeOne from "./src/screens/WelcomeOne";
// // import Login from "./src/screens/Login";
// // import Signup from "./src/screens/Signup";
// import Landing from "./src/screens/Landing";
// // import Landing from "./src/screens/Landing";
// // import CustomerDashboard from "./src/screens/CustomerDashboard";
// // import UserDashboard from "./src/screens/UserDashboard";
// import Settings from "./src/screens/Settings";
// import EducationHome from "./src/screens/EducationHome";
// import Collegeslisting from "./src/screens/Collegelisting";
// // import FreelancerScreen from "./src/screens/Landing";
// import ServiceRequestsScreen from "./src/screens/ServiceRequestsScreen";
// // import FreelancerDashboard from "./src/screens/FreelancerDashboard";
// // import FDOverview from "./src/screens/FDOverview";

// import PaymentScreen from "./src/screens/Paymentscreen";
// import BookCleaningScreen from "./src/screens/BookCleaningScreen";
// import NotificationsScreen from "./src/screens/NotificationsScreen";
// import AuthScreen from "./src/screens/AuthScreen";
// import CleaningServicesScreen from "./src/screens/CleaningServicesScreen";
// import EmployeeAllocation from "./src/screens/EmployeeAllocation";
// import Cleaning from "./src/screens/Cleaning";
// import CleaningCategorySelectScreen from "./src/screens/CleaningCategory";
// import CleaningCategory from "./src/screens/CleaningCategory";
// import InternshipDetailsScreen from "./src/screens/Intership";
// export type RootStackParamList = {
//   Splash: undefined;
//   Onboarding: undefined;
//   Landing: undefined;
//   WelcomeOne: undefined;
//   // Login: undefined;
//     Login: { role?: "customer" | "user"; prefilledEmail?: string;prefilledPassword?: string;
//  } | undefined;
//   Signup: undefined;
//   Transport: undefined;
//   CustomerDashboard: undefined;
//   UserDashboard: undefined;
//   Settings: undefined;
//   Rentals: undefined;
//   Construction: undefined;
//   FreelancerDashboard: undefined;
//   FDOverview: undefined;
//   Freelancer: undefined;
//   ServiceRequests: undefined;
//   PaymentScreen: undefined;
//   BookCleaning: undefined;
// AuthScreen: undefined;
// Notifications: undefined;
// EmployeeAllocation: undefined;
// CleaningServiceScreen: undefined;
// EducationHome: undefined;
// CleaningCategory: undefined;
// Collegeslisting: undefined;
// Cleaning: undefined;
// Internship: undefined;  
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function App(): React.ReactElement {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Splash" component={Splash} />
//         <Stack.Screen name="Onboarding" component={Onboarding} />
//         {/* <Stack.Screen name="Landing" component={Landing} /> */}
//         {/* <Stack.Screen name="WelcomeOne" component={WelcomeOne} /> */}
//         {/* <Stack.Screen name="Login" component={Login} /> */}
//         {/* <Stack.Screen name="Signup" component={Signup} /> */}
//         <Stack.Screen name="Landing" component={Landing} />
//         {/* <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} /> */}
//         {/* <Stack.Screen name="UserDashboard" component={UserDashboard} /> */}
//         {/* <Stack.Screen name="Transport" component={Transport} /> */}
//         {/* <Stack.Screen name="Construction" component={Construction} /> */}
//         {/* <Stack.Screen name="Cleaning" component={Cleaning} /> */}
//         {/* <Stack.Screen name="Packers" component={Packers} /> */}
//         <Stack.Screen name="Settings" component={Settings} />
//         {/* <Stack.Screen name="Rentals" component={Rentals} /> */}
//         {/* <Stack.Screen name="Freelancer" component={FreelancerScreen} /> */}
//         <Stack.Screen name="ServiceRequests" component={ServiceRequestsScreen} />
//         {/* <Stack.Screen name="FreelancerDashboard" component={FreelancerDashboard} /> */}
//         {/* <Stack.Screen name="FDOverview" component={FDOverview} /> */}
//         <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
//         <Stack.Screen name="BookCleaning" component={BookCleaningScreen} />
// <Stack.Screen
//   name="Notifications"
//   component={NotificationsScreen}
// />
// <Stack.Screen name="AuthScreen" component={AuthScreen} />
// <Stack.Screen name="EmployeeAllocation" component={EmployeeAllocation} />
// <Stack.Screen name="CleaningServiceScreen" component={CleaningServicesScreen} />
// <Stack.Screen name="EducationHome" component={EducationHome} />
// <Stack.Screen name="Collegeslisting" component={Collegeslisting} />
// <Stack.Screen name="Cleaning" component={Cleaning} />
// <Stack.Screen name="CleaningCategory" component={CleaningCategory} />
// <Stack.Screen name="Internship" component={InternshipDetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./src/screens/Splash";
import Onboarding from "./src/screens/Onboarding";
// import WelcomeOne from "./src/screens/WelcomeOne";
// import Login from "./src/screens/Login";
// import Signup from "./src/screens/Signup";
import Landing from "./src/screens/Landing";
// import Landing from "./src/screens/Landing";
// import CustomerDashboard from "./src/screens/CustomerDashboard";
// import UserDashboard from "./src/screens/UserDashboard";
// import Settings from "./src/screens/Settings";

// import FreelancerScreen from "./src/screens/Landing";
// import ServiceRequestsScreen from "./src/screens/ServiceRequestsScreen";
// import FreelancerDashboard from "./src/screens/FreelancerDashboard";
// import FDOverview from "./src/screens/FDOverview";
// import ProfileInformation from "./src/screens/ProfileInformation";
import PaymentScreen from "./src/screens/Paymentscreen";
import BookCleaningScreen from "./src/screens/BookCleaningScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import AuthScreen from "./src/screens/AuthScreen";
import CleaningServicesScreen from "./src/screens/CleaningServicesScreen";
import EmployeeAllocation from "./src/screens/EmployeeAllocation";
import EducationHome from "./src/screens/EducationHome";
import Collegelisting from "./src/screens/Collegelisting";
import Cleaning from "./src/screens/Cleaning";
import InternshipDetailsScreen from "./src/screens/Intership";
import CleaningCategorySelectScreen from "./src/screens/CleaningCategory";
import CompaniesListingScreen from "./src/screens/CompaniesListingScreen";
import JobDetailsScreen from "./src/screens/JobDetailsScreen";
import ProductScreen from "./src/screens/ProductScreen";
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Landing: undefined;
  Internship:undefined;
  WelcomeOne: undefined;
  CollegeListing:undefined;
  Cleaning:undefined;
  CleaningCategory:undefined;
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
  PaymentScreen: undefined;
  BookCleaning: undefined;
  EducationHome:undefined;
  // ProfileInformation: undefined;
AuthScreen: undefined;
ProductScreen: undefined;
Notifications: undefined;
EmployeeAllocation: undefined;
JobDetails: undefined;
CleaningServiceScreen: undefined;
CompaniesListingScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Internship" component={InternshipDetailsScreen}/>
        {/* <Stack.Screen name="Landing" component={Landing} /> */}
        {/* <Stack.Screen name="WelcomeOne" component={WelcomeOne} /> */}
        {/* <Stack.Screen name="Login" component={Login} /> */}
        {/* <Stack.Screen name="Signup" component={Signup} /> */}
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Cleaning" component={Cleaning}/>
        <Stack.Screen name="CleaningCategory" component={CleaningCategorySelectScreen}/>
        {/* <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} /> */}
        {/* <Stack.Screen name="UserDashboard" component={UserDashboard} /> */}
        {/* <Stack.Screen name="Transport" component={Transport} /> */}
        {/* <Stack.Screen name="Construction" component={Construction} /> */}
        {/* <Stack.Screen name="Cleaning" component={Cleaning} /> */}
        {/* <Stack.Screen name="Packers" component={Packers} /> */}
        {/* <Stack.Screen name="Settings" component={Settings} /> */}
        {/* <Stack.Screen name="Rentals" component={Rentals} /> */}
        {/* <Stack.Screen name="Freelancer" component={FreelancerScreen} /> */}
        {/* <Stack.Screen name="ServiceRequests" component={ServiceRequestsScreen} /> */}
        {/* <Stack.Screen name="FreelancerDashboard" component={FreelancerDashboard} /> */}
        {/* <Stack.Screen name="FDOverview" component={FDOverview} /> */}
        <Stack.Screen name="ProductScreen" component={ProductScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="BookCleaning" component={BookCleaningScreen} />
        
<Stack.Screen
  name="Notifications"
  component={NotificationsScreen}
/>
<Stack.Screen name="CollegeListing"component={Collegelisting}/>
<Stack.Screen name="EducationHome" component={EducationHome}/>
<Stack.Screen name="AuthScreen" component={AuthScreen} />
{/* <Stack.Screen name="ProfileInformation" component={ProfileInformation} /> */}
<Stack.Screen name="EmployeeAllocation" component={EmployeeAllocation} />
<Stack.Screen name="CompaniesListingScreen" component={CompaniesListingScreen} />
<Stack.Screen name="CleaningServiceScreen" component={CleaningServicesScreen} />
<Stack.Screen name="JobDetails" component={JobDetailsScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}