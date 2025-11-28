import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
// Using 'any' for StackScreenProps for brevity, but you should ideally define RootStackParamList
import { StackScreenProps } from '@react-navigation/stack'; 
import { View as RNView } from 'react-native'; 

// --- TYPE DEFINITION for the styles object (To satisfy TypeScript) ---
type Style = typeof styles extends { [key: string]: any } ? typeof styles : never;

// Component for the Navigation Bar
const NavBar = ({ navigation }: { navigation: any }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "Home",
    "Cleaning",
    "Packers & Movers",
    "Home Services",
    "Rentals",
    "Buy&Safe Properties",
    "Construction Materials",
    "Freelancer",
  ];
  
  // Example handler for a menu item
  const handleMenuItemPress = (item: string) => {
      setIsMenuOpen(false); 
      if (item === "Home") {
          navigation.navigate("Home");
      } else if (item === "Cleaning") {
          // This ensures the menu item navigates to the Cleaning screen
          navigation.navigate("Cleaning");
      }
      // Add logic for other items as needed
  }

  return (
    <View style={(styles as Style).navBarContainer}>
      {/* Top Bar with Logo/Title and Hamburger Icon */}
      <View style={(styles as Style).topBar}>
        <Text style={(styles as Style).logoText}>SWACHIFY INDIA</Text>
        
        {/* Hamburger Menu Button */}
        <TouchableOpacity 
          onPress={() => setIsMenuOpen(!isMenuOpen)} 
          style={(styles as Style).hamburgerButton}
        >
          <Text style={(styles as Style).hamburgerIcon}>{isMenuOpen ? "✕" : "☰"}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Dropdown Menu (Conditionally Rendered) */}
      {isMenuOpen && (
        <View style={(styles as Style).dropdownMenu}>
          {navItems.map((item, index) => (
            <TouchableOpacity 
                key={index} 
                style={(styles as Style).menuItem} 
                onPress={() => handleMenuItemPress(item)}
            >
              <Text style={(styles as Style).menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Home component
export default function Home({ navigation }: StackScreenProps<any>) { 
    
    const scrollViewRef = useRef<ScrollView>(null);
    const servicesRef = useRef<RNView>(null); 

    // Function to handle smooth scroll to the Services section
    const handleScrollToServices = () => {
        if (servicesRef.current && scrollViewRef.current) {
            servicesRef.current.measureLayout(
                scrollViewRef.current.getInnerViewNode(),
                (x: number, y: number, width: number, height: number) => {
                    scrollViewRef.current?.scrollTo({ y: y, animated: true });
                },
                () => {
                    console.error("Scroll measurement failed");
                }
            );
        }
    };
    
    // Function to handle navigation to the Cleaning screen ("Learn More")
    const handleNavigateToCleaning = () => {
        navigation.navigate("Cleaning"); // Navigates to the Cleaning screen
    };

    return (
        <ScrollView 
            ref={scrollViewRef}
            style={{ flex: 1, backgroundColor: "#fff" }}
        >
            <NavBar navigation={navigation} /> 

            {/* HERO SECTION */}
            <ImageBackground
                // NOTE: You must have a local image named 'hero.jpg' in ../assets/
                source={require("../assets/hero.jpg")} 
                style={(styles as Style).hero}
            >
                <View style={(styles as Style).overlay} />

                <Text style={(styles as Style).heroTitle}>
                    Transform Your Home & Property Services
                </Text>

                <Text style={(styles as Style).heroSubtitle}>
                    Your trusted solution for cleaning, moving, rentals, construction, and more.
                </Text>

                {/* ATTACH SCROLL HANDLER to "Get Started" */}
                <TouchableOpacity style={(styles as Style).startBtn} onPress={handleScrollToServices}>
                    <Text style={(styles as Style).startBtnText}>Get Started</Text>
                </TouchableOpacity>
            </ImageBackground>

            {/* SERVICES SECTION - ATTACH SERVICES REF */}
            <View style={(styles as Style).section} ref={servicesRef}>
                <Text style={(styles as Style).sectionTitle}>Our Services</Text>

                <View style={(styles as Style).serviceGrid}>
                    {/* CLEANING SERVICE CARD */}
                    <View style={(styles as Style).serviceCard}>
                        <Text style={(styles as Style).serviceIcon}>🏠</Text>
                        <Text style={(styles as Style).serviceTitle}>Cleaning Service</Text>
                        <Text style={(styles as Style).serviceDesc}>
                            Professional cleaning solutions for your home and office.
                        </Text>
                        {/* ATTACH NAVIGATION HANDLER to "Learn More" */}
                        <TouchableOpacity onPress={handleNavigateToCleaning}>
                           <Text style={(styles as Style).learnMore}>Learn More →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* PACKERS & MOVERS */}
                    <View style={(styles as Style).serviceCard}>
                        <Text style={(styles as Style).serviceIcon}>🚚</Text>
                        <Text style={(styles as Style).serviceTitle}>Packers & Movers</Text>
                        <Text style={(styles as Style).serviceDesc}>
                            Safe and reliable relocation services.
                        </Text>
                        <TouchableOpacity onPress={() => console.log("Navigate to Packers")}>
                           <Text style={(styles as Style).learnMore}>Learn More →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* HOME SERVICES */}
                    <View style={(styles as Style).serviceCard}>
                        <Text style={(styles as Style).serviceIcon}>🛠️</Text>
                        <Text style={(styles as Style).serviceTitle}>Home Services</Text>
                        <Text style={(styles as Style).serviceDesc}>
                            Plumbing, electrical, carpentry, and maintenance.
                        </Text>
                        <TouchableOpacity onPress={() => console.log("Navigate to Home Services")}>
                           <Text style={(styles as Style).learnMore}>Learn More →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* RENTALS */}
                    <View style={(styles as Style).serviceCard}>
                        <Text style={(styles as Style).serviceIcon}>🏢</Text>
                        <Text style={(styles as Style).serviceTitle}>Home & Apartments Rental</Text>
                        <Text style={(styles as Style).serviceDesc}>
                            Find perfect homes from top rental listings.
                        </Text>
                        <TouchableOpacity onPress={() => console.log("Navigate to Rentals")}>
                           <Text style={(styles as Style).learnMore}>Learn More →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* COMMERCIAL PLOTS */}
                    <View style={(styles as Style).serviceCard}>
                        <Text style={(styles as Style).serviceIcon}>🏬</Text>
                        <Text style={(styles as Style).serviceTitle}>Commercial Plots</Text>
                        <Text style={(styles as Style).serviceDesc}>
                            Premium plots in prime locations.
                        </Text>
                        <TouchableOpacity onPress={() => console.log("Navigate to Commercial Plots")}>
                           <Text style={(styles as Style).learnMore}>Learn More →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* CONSTRUCTION MATERIALS */}
                    <View style={(styles as Style).serviceCard}>
                        <Text style={(styles as Style).serviceIcon}>🧱</Text>
                        <Text style={(styles as Style).serviceTitle}>Construction Materials</Text>
                        <Text style={(styles as Style).serviceDesc}>
                            Cement, bricks, and building materials at best prices.
                        </Text>
                        <TouchableOpacity onPress={() => console.log("Navigate to Materials")}>
                           <Text style={(styles as Style).learnMore}>Learn More →</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* WHY CHOOSE OUR SERVICE */}
            <View style={(styles as Style).whySection}>
                <Text style={(styles as Style).whyTitle}>Why Choose Our Service</Text>
                <Text style={(styles as Style).whySubtitle}>
                    We focus on quality, trust and speed — built to make your life easier.
                </Text>

                <View style={(styles as Style).whyGrid}>
                    <View style={(styles as Style).whyCard}>
                        <Text style={[(styles as Style).whyIcon, { color: "#FF8C00" }]}>🛠️</Text>
                        <Text style={(styles as Style).whyHeading}>Skilled Professionals</Text>
                        <Text style={(styles as Style).whyText}>
                            Verified, trained technicians who deliver quality workmanship every time.
                        </Text>
                    </View>

                    <View style={(styles as Style).whyCard}>
                        <Text style={[(styles as Style).whyIcon, { color: "#1E90FF" }]}>🏡</Text>
                        <Text style={(styles as Style).whyHeading}>Trusted & Local</Text>
                        <Text style={(styles as Style).whyText}>
                            Local teams who know your area and provide timely service.
                        </Text>
                    </View>

                    <View style={(styles as Style).whyCard}>
                        <Text style={[(styles as Style).whyIcon, { color: "#32CD32" }]}>🚚</Text>
                        <Text style={(styles as Style).whyHeading}>Transparent Pricing</Text>
                        <Text style={(styles as Style).whyText}>
                            Clear quotes, no hidden fees — affordable for every need.
                        </Text>
                    </View>

                    <View style={(styles as Style).whyCard}>
                        <Text style={[(styles as Style).whyIcon, { color: "#FFB300" }]}>📜</Text>
                        <Text style={(styles as Style).whyHeading}>Licensed & Insured</Text>
                        <Text style={(styles as Style).whyText}>
                            Professional services backed by proper licensing and insurance.
                        </Text>
                    </View>

                    <View style={(styles as Style).whyCard}>
                        <Text style={[(styles as Style).whyIcon, { color: "#A020F0" }]}>📦</Text>
                        <Text style={(styles as Style).whyHeading}>Satisfaction Guarantee</Text>
                        <Text style={(styles as Style).whyText}>
                            If you're not happy, we'll make it right.
                        </Text>
                    </View>

                    <View style={(styles as Style).whyCard}>
                        <Text style={[(styles as Style).whyIcon, { color: "#FF0000" }]}>⏰</Text>
                        <Text style={(styles as Style).whyHeading}>24/7 Support</Text>
                        <Text style={(styles as Style).whyText}>
                            Emergency response and customer support anytime.
                        </Text>
                    </View>
                    
                    {/* FOOTER SECTION */}
                    <View style={(styles as Style).footerContainer}>
                        <View style={(styles as Style).footerContent}>
                            {/* About Us */}
                            <View style={(styles as Style).footerColumn}>
                                <Text style={(styles as Style).footerTitle}>About Us</Text>
                                <Text style={(styles as Style).footerText}>
                                    Your trusted partner for all home and property-related services. Quality, reliability, and customer satisfaction guaranteed.
                                </Text>
                            </View>

                            {/* Services */}
                            <View style={(styles as Style).footerColumn}>
                                <Text style={(styles as Style).footerTitle}>Services</Text>
                                <Text style={(styles as Style).footerText}>• Cleaning Service</Text>
                                <Text style={(styles as Style).footerText}>• Packers & Movers</Text>
                                <Text style={(styles as Style).footerText}>• Home Services</Text>
                                <Text style={(styles as Style).footerText}>• Rentals</Text>
                                <Text style={(styles as Style).footerText}>• Commercial Plots</Text>
                                <Text style={(styles as Style).footerText}>• Construction Materials</Text>
                            </View>

                            {/* Quick Links */}
                            <View style={(styles as Style).footerColumn}>
                                <Text style={(styles as Style).footerTitle}>Quick Links</Text>
                                <Text style={(styles as Style).footerText}>• Home</Text>
                                <Text style={(styles as Style).footerText}>• About</Text>
                                <Text style={(styles as Style).footerText}>• Contact</Text>
                                <Text style={(styles as Style).footerText}>• Careers</Text>
                            </View>

                            {/* Contact Info */}
                            <View style={(styles as Style).footerColumn}>
                                <Text style={(styles as Style).footerTitle}>Contact Info</Text>
                                <Text style={(styles as Style).footerText}>📞 +1 (555) 123-4567</Text>
                                <Text style={(styles as Style).footerText}>📧 info@homeservices.com</Text>
                                <Text style={(styles as Style).footerText}>📍 123 Service Street, City, State</Text>
                            </View>
                        </View>

                        <View style={(styles as Style).footerBottom}>
                            <Text style={(styles as Style).footerBottomText}>
                                © 2025 Home Services. All rights reserved.
                            </Text>
                        </View>
                    </View>

                </View>
            </View>
        </ScrollView>
    );
}

// ===================================
// STYLESHEET
// ===================================

const styles = StyleSheet.create({
  // --- NAVBAR STYLES ---
  navBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15, 
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    marginTop: 20,
  },
  hamburgerButton: {
    padding: 5,
    marginTop: 20,
  },
  hamburgerIcon: {
    fontSize: 28, 
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownMenu: {
    backgroundColor: "rgba(0, 0, 0, 0.95)", 
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItem: {
    paddingVertical: 15, 
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
  // --- HERO STYLES ---
  hero: {
    height: 450,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 100, // Accounts for the floating navbar
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: "#FF0000",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  
  // --- SERVICES SECTION STYLES ---
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  /* SERVICE CARDS */
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  serviceCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  serviceIcon: {
    fontSize: 35,
    textAlign: "center",
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  serviceDesc: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginBottom: 10,
  },
  learnMore: {
    color: "#007bff",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 5,
  },

  /* WHY CHOOSE US */
  whySection: {
    padding: 20,
    marginTop: 10,
  },
  whyTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  whySubtitle: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginBottom: 20,
  },
  whyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  whyCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  whyIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  whyHeading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  whyText: {
    fontSize: 13,
    color: "#555",
  },
  
  // --- FOOTER STYLES ---
  footerContainer: {
    backgroundColor: "#333",
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    shadowColor: 'transparent',
    elevation: 0,
  },
  footerContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerColumn: {
    width: "48%", 
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  footerText: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 5,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "#444",
    paddingVertical: 10,
    alignItems: "center",
  },
  footerBottomText: {
    color: "#ccc",
    fontSize: 12,
  },
});