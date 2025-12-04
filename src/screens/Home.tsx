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
    "Cleaning and Home Services",
    "Transport",
    "Buy/Sales/Rentals",
    "Raw Materials",
    "Freelancer",
    "Settings",
  ];

  // Example handler for a menu item
  const handleMenuItemPress = (item: string) => {
  setIsMenuOpen(false);

  switch (item) {
    case "Home":
      navigation.navigate("HomeScreen");
      break;
    case "Cleaning and Home Services":
      navigation.navigate("Cleaning");
      break;
    case "Transport":
      navigation.navigate("Packers");
      break;
    case "Settings":
      navigation.navigate("SettingsScreen");
      break;
    // add other items if needed
    default:
      console.warn("No navigation defined for", item);
  }
};

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

           
<View ref={servicesRef} style={styles.servicesSection}>

  <Text style={styles.servicesHeader}>Our Services</Text>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    // Added paddingLeft to make the first card visible
    contentContainerStyle={{ paddingHorizontal: 15, paddingRight: 35 }}
  >
    {/* 1. Home Cleaning - NO "Learn More" */}
    <TouchableOpacity 
      style={styles.serviceCardHorizontal} 
      onPress={handleNavigateToCleaning}
    >
      <ImageBackground
        source={require("../assets/c1.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }} 
      />
      <Text style={styles.serviceTitle}>Cleaning & Home Services</Text>
      {/* Removed "Learn More" here */}
    </TouchableOpacity>

    {/* 2. Packers & Movers - NO "Learn More" */}
    <TouchableOpacity 
      style={styles.serviceCardHorizontal}
      onPress={() => navigation.navigate("PackersAndMovers")} 
    >
      <ImageBackground
        source={require("../assets/pm.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }}
      />
      <Text style={styles.serviceTitle}>Transport</Text>
      {/* Removed "Learn More" here */}
    </TouchableOpacity>

    {/* 3. Home Services - NO "Learn More" */}
    {/* <TouchableOpacity 
      style={styles.serviceCardHorizontal}
      onPress={() => navigation.navigate("HomeServices")}
    >
      <ImageBackground
        source={require("../assets/hs.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }}
      />
      <Text style={styles.serviceTitle}>Home Services</Text>
    
    </TouchableOpacity> */}

    {/* 4. Home & Apartment Rentals - NO "Learn More" */}
    <TouchableOpacity 
      style={styles.serviceCardHorizontal}
      onPress={() => navigation.navigate("Rentals")}
    >
      <ImageBackground
        source={require("../assets/rental.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }}
      />
      <Text style={styles.serviceTitle}>Buy/Sales/Rentals</Text>
      {/* Removed "Learn More" here */}
    </TouchableOpacity>

    {/* 5. Commercial Plots - NO "Learn More" */}
    <TouchableOpacity 
      style={styles.serviceCardHorizontal}
      onPress={() => navigation.navigate("RawMaterials")}
    >
      <ImageBackground
        source={require("../assets/cma.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }}
      />
      <Text style={styles.serviceTitle}>Raw Materials</Text>
      {/* Removed "Learn More" here */}
    </TouchableOpacity>

    {/* 6. Construction Materials - NO "Learn More" */}
    <TouchableOpacity 
      style={styles.serviceCardHorizontal}
      onPress={() => navigation.navigate("Education")}
    >
      <ImageBackground
        source={require("../assets/c2.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }}
      />
      <Text style={styles.serviceTitle}>Education</Text>
      {/* Removed "Learn More" here */}
    </TouchableOpacity>

       <TouchableOpacity 
      style={styles.serviceCardHorizontal}
      onPress={() => navigation.navigate("SwachifyProducts")}
    >
      <ImageBackground
        source={require("../assets/hs.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }}
      />
      <Text style={styles.serviceTitle}>Swachify Products</Text>
      {/* Removed "Learn More" here */}
    </TouchableOpacity>
       <TouchableOpacity 
      style={styles.serviceCardHorizontal}
      onPress={() => navigation.navigate("Freelancer")}
    >
      <ImageBackground
        source={require("../assets/c4.jpg")}
        style={styles.serviceImgHorizontal}
        imageStyle={{ borderRadius: 12 }}
      />
      <Text style={styles.serviceTitle}>Freelancer</Text>
      {/* Removed "Learn More" here */}
    </TouchableOpacity>


  </ScrollView>
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
    height: 350,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
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

  /* SERVICE CARDS - UPDATED FOR COMPACT, ROUNDED STYLE */
 /* SERVICE CARDS - FINAL STYLES FOR COMPACT, BORDERED LOOK */
  servicesSection: {
    paddingVertical: 20, 
  },

  serviceCardHorizontal: {
   
    width: 90, 
    height: 115, // Adjusted slightly to fit the text better
    marginRight: 15,
    backgroundColor: "#ffffff", 
    borderRadius: 10, // High border radius for the outer card
    padding: 5, // Minimal padding inside the card
    borderWidth: 1, 
    borderColor: '#b19964ff',
    // Soft outer shadow/glow (simulating the faint light border)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 2, // Subtle shadow
    shadowRadius: 10, 
    elevation: 3, 
    
    marginBottom: 10,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'flex-start', // Start content from the top
  },

  serviceImgHorizontal: {
    // Fixed size for the image area, making it a prominent rounded square
    width: 80, 
    height: 70, 
    borderRadius: 10, // High border radius for the image itself
    marginBottom: 5,
    backgroundColor: '#f0f0f0', 
    overflow: 'hidden', // CRITICAL: Ensures the image respects the border-radius
    alignSelf: 'center', 
  },
  
  learnMore: { 
    // This element isn't clearly visible in the small image, but keep the link style minimal
    color: "#007bff", 
    fontWeight: "600", 
    fontSize: 9, // Smallest text size
    marginTop: 2, 
    textAlign: 'center',
  },
  servicesHeader: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20, 
    color: "#111",
  },
  serviceTitle: {
    fontSize: 11, // Small title text
    fontWeight: "600", 
    marginBottom: 2, 
    color: "#333", 
    textAlign: 'center', 
    lineHeight: 14, // Helps control line spacing for multi-line titles
  },
  /* WHY CHOOSE US */
 whySection: {
    padding: 20,
    marginTop: 10,
    backgroundColor: '#f4f4f4', // Slight background to define the section
  },
  whyTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    color: "#1a1a1a", // Darker text
  },
  whySubtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginBottom: 25, // Increased margin
  },
  whyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  whyCard: {
    width: "48%",
    backgroundColor: "#fff", // White background for the card
    padding: 15,
    borderRadius: 15, // More pronounced rounding
    borderWidth: 1,
    borderColor: '#eee', // Subtle light gray border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, // Very subtle shadow from bottom
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15, // Reduced space to make the grid tighter
  },
  whyIcon: {
    fontSize: 30, // Slightly larger icon
    marginBottom: 10,
    // PREMIUM ICON EFFECT: Use the color to define a line/indicator above the icon
    paddingBottom: 5,
    borderBottomWidth: 3, 
    borderBottomColor: '#FFD700', // Gold/Premium accent color (this will be overridden by inline style, but sets a base)
    alignSelf: 'flex-start', // Ensure the border is only under the icon text
    width: 'auto',
  },
  whyHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  whyText: {
    fontSize: 13,
    color: "#777", // Lighter body text
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