import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

/* ================= SCREENS ================= */
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
import InternshipList, { Internship } from "./src/screens/InternshipList";
import Freelancer from "./src/screens/Freelancer";
import TransportComingSoon from "./src/screens/TransportComingSoon";
import RawMaterial from "./src/screens/RawMaterial";
import HomeSub from "./src/screens/HomeSub";
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
import BuyerPage from "./src/screens/BuyerPage";
import JustrideMultiStop from "./src/screens/JustRideMultiStop";
import JustrideApp from "./src/screens/JustrideApp";
import DoctorListScreen from "./src/screens/Healthcare";
import ConsultationRequestScreen from "./src/screens/Healthform";
import TelemedicineConsultation from "./src/screens/TelemedicineConsultation";
import FacilitiesScreen from "./src/screens/FacilitiesScreen";
import Wishlist from "./src/screens/Wishlist";
import AmbulanceBookingScreen from "./src/screens/Ambulance";
import SwachifyPartnerScreen from "./src/screens/swachify_partner_screen";
import ParcelView from "./src/screens/ParcelView";
import MetroView from "./src/screens/MetroView";
import ScootyView from "./src/screens/ScootyView";
import EnrollmentDetailsScreen from "./src/screens/EnrollmentDetailsScreen";
import buysellPartnerDashboard from "./src/screens/buysellPartnerDashboard";
import InquiryDetails from "./src/screens/InquiryDetails";
import PartnerAuth from "./src/screens/PartnerAuth";
import EducationPartnerDashboard from "./src/screens/EducationPartnerDashboard";
import DriverDashboard from "./src/screens/DriverDashboard";
import EducationDashboardReport from './src/screens/EducationDashboardReport';
import Dashboard from "./src/screens/HealthcarePartnerDashboard";
import BookingsScreen from "./src/screens/HospitalBookings";
import DoctorsListScreen from "./src/screens/DoctorsList";
import HospitalDoctorsScreen from "./src/screens/HospitalDoctorsScreen";
import DoctorProfile from "./src/screens/Doctorprofile";
import InstitutionRegistrationStep1 from "./src/screens/InstitutionRegistrationStep1";
import InstitutionRegistrationStep2 from "./src/screens/InstitutionRegistrationStep2";
import PartnerPortalStandalone from "./src/screens/Partnerportalstandalone";
import ManagementOverview from "./src/screens/ManagementOverview";



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
  swachifyPartnerScreen: undefined;
  ProductRegistration: undefined;
  InternshipList: undefined;
  RawMaterial: undefined;
  HomeSub: undefined;
  CommercialSub: undefined;
  VehicleSub: undefined;
  EmployeeHomeScreen: undefined;
  Cart: undefined;
  CandidateProfile: undefined;
  Training: undefined;
  TrainingDetails: undefined;
  ApplicationSuccess: undefined;
  ReviewApplication: { internship: Internship };
  ProductDetail: undefined;
  BuyerPage: undefined;
  ServiceDetails: undefined;
  PaymentSuccessDetails: undefined;
  JustRideMultiStop: undefined;
  JustrideApp: undefined;
  Health: undefined;
  Form: undefined;
  Telecom: undefined;
  Facility: undefined;
  Wishlist: undefined;
  Ambulance: undefined;
  PartnerAuth: undefined;
  InquiryDetails: undefined;
  buysellPartnerDashboard: undefined;
  EducationPartnerDashboard: undefined;
  HealthcarePartnerDashboard: undefined;
  bookings: undefined;
  Doctor: undefined;
  DriverDashboard: undefined;
  Offline:undefined
  DoctorProfile:undefined
  InstitutionRegistrationStep1: undefined;
  InstitutionRegistrationStep2: undefined;
  PartnerPortalStandalone: undefined;
  ManagementOverview: undefined;
};

/* ================= NAV ================= */
const Stack = createNativeStackNavigator();

/* ================= NAV WRAPPER ================= */
function AppNavigator() {
  const { navigationTheme } = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
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
        <Stack.Screen name="CommercialSub" component={CommercialSub} />
        <Stack.Screen name="VehicleSub" component={VehicleSub} />
        <Stack.Screen name="EmployeeHomeScreen" component={EmployeeHomeScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Training" component={TrainingScreen} />
        <Stack.Screen name="TrainingDetails" component={TrainingDetailsScreen} />
        <Stack.Screen name="ApplicationSuccess" component={ApplicationSuccessScreen} />
        <Stack.Screen name="ReviewApplication" component={ReviewApplication} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="BuyerPage" component={BuyerPage} />
        <Stack.Screen name="JustRideMultiStop" component={JustrideMultiStop} />
        <Stack.Screen name="JustrideApp" component={JustrideApp} />
        <Stack.Screen name="Health" component={DoctorListScreen} />
        <Stack.Screen name="Form" component={ConsultationRequestScreen} />
        <Stack.Screen name="Telecom" component={TelemedicineConsultation} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="ParcelView" component={ParcelView} />
        <Stack.Screen name="MetroView" component={MetroView} />
        <Stack.Screen name="ScootyView" component={ScootyView} />
        <Stack.Screen name="enrollmentDetails" component={EnrollmentDetailsScreen} />
        <Stack.Screen name="Ambulance" component={AmbulanceBookingScreen} />
        <Stack.Screen name="SwachifyPartnerScreen" component={SwachifyPartnerScreen} />
        <Stack.Screen name="InquiryDetails" component={InquiryDetails} />
        <Stack.Screen name="buysellPartnerDashboard" component={buysellPartnerDashboard} />
        <Stack.Screen name="Facility" component={FacilitiesScreen} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="EducationPartnerDashboard" component={EducationPartnerDashboard} />
        <Stack.Screen name="bookings" component={BookingsScreen} />
        <Stack.Screen name="HealthcarePartnerDashboard" component={Dashboard} />
         <Stack.Screen name="Doctor" component={DoctorsListScreen} />
         <Stack.Screen name="Offline" component={HospitalDoctorsScreen} />
         <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
        <Stack.Screen 
          name="EducationDashboardReport" 
          component={EducationDashboardReport} 
        />
        <Stack.Screen
          name="PartnerAuth"
          component={PartnerAuth}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="InstitutionRegistrationStep1" component={InstitutionRegistrationStep1} />
        <Stack.Screen name="InstitutionRegistrationStep2" component={InstitutionRegistrationStep2} />
        <Stack.Screen 
          name="PartnerPortalStandalone" 
          component={PartnerPortalStandalone}
          options={{ headerShown: false }}
        />

        <Stack.Screen
  name="ManagementOverview"
  component={ManagementOverview}
  options={{ headerShown: false }}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ================= ROOT ================= */
export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}