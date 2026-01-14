import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./src/screens/Splash";
import Onboarding from "./src/screens/Onboarding";
import Landing from "./src/screens/Landing";
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
import ProfileInformation from "./src/screens/ProfileInformation";
import Marketplace from "./src/screens/Marketplace";
import SellItem from "./src/screens/SellItem";
import ProductScreen from "./src/screens/ProductScreen";
import SwachifyMarketScreen from "./src/screens/SwachifyMarketScreen";
import ProductRegistration from "./src/screens/ProductRegistration";
import TransportComingSoon from "./src/screens/TransportComingSoon";
import Freelancer from "./src/screens/Freelancer";


export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Landing: { isLoggedIn?: boolean } | undefined;
  Internship: undefined;
  WelcomeOne: undefined;
  CollegeListing: undefined;
  Cleaning: undefined;
  CleaningCategory: undefined;
  Login: { role?: "customer" | "user"; prefilledEmail?: string; prefilledPassword?: string } | undefined;
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
  EducationHome: undefined;
  ProfileInformation: undefined;
  AuthScreen: undefined;
  Notifications: undefined;
  EmployeeAllocation: undefined;
  JobDetails: undefined;
  CleaningServiceScreen: undefined;
  CompaniesListingScreen: undefined;
  Marketplace: undefined;
  SellItem: undefined;
  ProductScreen: undefined;
  SwachifyMarketScreen: undefined;
  ProductRegistration: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Internship" component={InternshipDetailsScreen} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Cleaning" component={Cleaning} />
        <Stack.Screen name="CleaningCategory" component={CleaningCategorySelectScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="BookCleaning" component={BookCleaningScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="CollegeListing" component={Collegelisting} />
        <Stack.Screen name="EducationHome" component={EducationHome} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="ProfileInformation" component={ProfileInformation} />
        <Stack.Screen name="EmployeeAllocation" component={EmployeeAllocation} />
        <Stack.Screen name="CompaniesListingScreen" component={CompaniesListingScreen} />
        <Stack.Screen name="CleaningServiceScreen" component={CleaningServicesScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="Marketplace" component={Marketplace} />
        <Stack.Screen name="SellItem" component={SellItem} />
        <Stack.Screen name="ProductScreen" component={ProductScreen} />
        <Stack.Screen name="SwachifyMarketScreen" component={SwachifyMarketScreen} />
        <Stack.Screen name="ProductRegistration" component={ProductRegistration} />
        <Stack.Screen name="Transport" component={TransportComingSoon} />
         <Stack.Screen name="Freelancer" component={Freelancer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}