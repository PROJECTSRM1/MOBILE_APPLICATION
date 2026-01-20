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
import Studentlisting from "./src/screens/Studentlisting";
import InternshipList from "./src/screens/InternshipList";
import type { Internship } from "./src/screens/InternshipList";
import Freelancer from "./src/screens/Freelancer";
import TransportComingSoon from "./src/screens/TransportComingSoon";
import RawMaterial from "./src/screens/RawMaterial";
import HomeSub from "./src/screens/HomeSub";
import HomeSubCat from "./src/screens/HomeSubCat";
import CommercialSub from "./src/screens/CommercialSub";
import VehicleSub from "./src/screens/VehicleSub";



import EmployeeHomeScreen from "./src/screens/EmployeeHomeScreen";
import CartScreen from "./src/screens/CartScreen";
import CandidateProfile from "./src/screens/CandidateProfile";
import ReviewApplication from "./src/screens/ReviewApplication";
import TrainingScreen from "./src/screens/TrainingScreen";
import TrainingDetailsScreen from "./src/screens/trainingDetailsScreen";
import ApplicationSuccessScreen from "./src/screens/ApplicationSuccessScreen";
import ServiceDetailsScreen from "./src/screens/ServiceDetailsScreen";
import PaymentSuccessDetailsScreen from "./src/screens/PaymentSuccessDetailsScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import RegisterProductModal from "./src/screens/RegisterProductModal";
import BuyerPage from "./src/screens/BuyerPage";
import JustrideMultiStop from "./src/screens/JustRideMultiStop";
import JustrideApp from "./src/screens/JustrideApp";


export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Landing: { isLoggedIn?: boolean } | undefined;
  Internship: { internship: Internship };
  WelcomeOne: undefined;
  StudentListing: undefined;
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
  InternshipList: undefined;
  RawMaterial: undefined;
  HomeSub: undefined;
  HomeSubCat: undefined;
  CommercialSub: undefined;
  VehicleSub: undefined;
  EmployeeHomeScreen: undefined;
  Cart: undefined;
  CandidateProfile: undefined;
  Training: undefined;
  TrainingDetails: undefined;
  ApplicationSuccess: undefined;
  // ReviewApplication: undefined;
   ReviewApplication: { internship: Internship };
  ProductDetail: undefined;
  BuyerPage: undefined;
  ServiceDetails: undefined;
  PaymentSuccessDetails: undefined;
  JustRideMultiStop: undefined;
  JustrideApp: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Internship" component={InternshipDetailsScreen} />
        <Stack.Screen name="InternshipList" component={InternshipList} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
        <Stack.Screen name="PaymentSuccessDetails" component={PaymentSuccessDetailsScreen} />
        <Stack.Screen name="Cleaning" component={Cleaning} />
        <Stack.Screen name="CleaningCategory" component={CleaningCategorySelectScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="BookCleaning" component={BookCleaningScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="StudentListing" component={Studentlisting} />
        <Stack.Screen name="CandidateProfile" component={CandidateProfile} />
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
         <Stack.Screen name="RawMaterial" component={RawMaterial} />
         <Stack.Screen name="HomeSub" component={HomeSub} />
         <Stack.Screen name="HomeSubCat" component={HomeSubCat} />
<Stack.Screen name="CommercialSub" component={CommercialSub} />
<Stack.Screen name="VehicleSub" component={VehicleSub} />

         <Stack.Screen name="EmployeeHomeScreen" component={EmployeeHomeScreen} />
         <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Training" component={TrainingScreen} />
        <Stack.Screen name="ApplicationSuccess" component={ApplicationSuccessScreen} />
        <Stack.Screen name="TrainingDetails" component={TrainingDetailsScreen} />
        <Stack.Screen name="ReviewApplication" component={ReviewApplication} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="BuyerPage" component={BuyerPage} />
        <Stack.Screen name="JustRideMultiStop" component={JustrideMultiStop} />
        <Stack.Screen name= "JustrideApp" component={JustrideApp} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}