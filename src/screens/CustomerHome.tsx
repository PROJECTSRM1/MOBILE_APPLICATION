import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { View as RNView } from "react-native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SHEET_RATIO = 0.6; // ~60% height

type Style = typeof styles extends { [key: string]: any } ? typeof styles : never;

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

  const handleMenuItemPress = (item: string) => {
    setIsMenuOpen(false);
    switch (item) {
      case "Home":
        navigation.navigate("CustomerHome");
        break;
      case "Cleaning and Home Services":
        // NOTE: This navigates to a placeholder 'Cleaning' screen, 
        // which might open a detail page or the sheet again depending on your full navigation flow.
        navigation.navigate("Cleaning"); 
        break;
      case "Transport":
        navigation.navigate("Packers");
        break;
      case "Settings":
        navigation.navigate("SettingsScreen");
        break;
      case "Raw Materials":
        navigation.navigate("ConstructionMaterial");
        break;
      default:
        console.warn("No navigation defined for", item);
    }
  };

  return (
    <View style={(styles as Style).navBarContainer}>
      <View style={(styles as Style).topBar}>
        <Text style={(styles as Style).logoText}>SWACHIFY INDIA</Text>

        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={(styles as Style).hamburgerButton}>
          <Text style={(styles as Style).hamburgerIcon}>{isMenuOpen ? "✕" : "☰"}</Text>
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <View style={(styles as Style).dropdownMenu}>
          {navItems.map((item, index) => (
            <TouchableOpacity key={index} style={(styles as Style).menuItem} onPress={() => handleMenuItemPress(item)}>
              <Text style={(styles as Style).menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function Home({ navigation }: StackScreenProps<any>) {
  const scrollViewRef = useRef<ScrollView>(null);
  const servicesRef = useRef<RNView>(null);

  const SHEET_HEIGHT = Math.round(WINDOW_HEIGHT * SHEET_RATIO);

  // Two bottom sheets: cleaning + transport
  const cleaningTranslate = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const transportTranslate = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const [showCleaningSheet, setShowCleaningSheet] = useState(false);
  const [showTransportSheet, setShowTransportSheet] = useState(false);

  // Buy/Sales/Rentals bottom sheet
  const rentalTranslate = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [showRentalSheet, setShowRentalSheet] = useState(false);

  // 🛠️ FIX: Raw Material bottom sheet state and animation value
  const rawMaterialTranslate = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [showRawMaterialSheet, setShowRawMaterialSheet] = useState(false);
  // -----------------------------------------------------------

  // Data for cleaning sheet (Image-1)
  // NOTE: Ensure your asset paths are correct: require("../assets/s1.jpg"), etc.
  const cleaningServices = [
    { name: "Cleaning Services", img: require("../assets/s1.jpg") },
    { name: "Electrical Services", img: require("../assets/s2.jpg") },
    { name: "Plumbing Service", img: require("../assets/s3.jpg") },
    { name: "Appliances Repair", img: require("../assets/s4.jpg") },
    { name: "Carpentry & Furniture", img: require("../assets/s5.jpg") },
    { name: "Painting & Renovation", img: require("../assets/s6.jpg") },
    { name: "HVAC & Cooling", img: require("../assets/s7.jpg") },
    { name: "Gardening & Outdoor Care", img: require("../assets/s8.jpg") },
    { name: "Handyman / General Repair", img: require("../assets/s9.jpg") },
    { name: "Home Security Services", img: require("../assets/s10.webp") },
  ];

  // Data for transport sheet (the 4 categories from your pasted image)
  const transportServices = [
    { name: "Passenger Transport", img: require("../assets/h1.jpg") },
    { name: "Logistic & Cargo", img: require("../assets/h2.jpg") },
    { name: "Rental Services", img: require("../assets/h3.jpg") },
    { name: "Specialized Transport", img: require("../assets/h4.jpg") },
  ];
  const rentalServices = [
    { name: "Buy & Sale Products", img: require("../assets/B1.png") },
    { name: "Old Retail Sales", img: require("../assets/B2.png") },
    { name: "Online Ordering", img: require("../assets/B3.png") },
    { name: "Wholesale / Distribution", img: require("../assets/B4.png") },

    { name: "House Rental", img: require("../assets/B5.jpg") },
    { name: "Commercial Rental", img: require("../assets/B6.jpg") },
  ];
  const rawMaterialServices = [
    { name: "Material Supply", img: require("../assets/re1.jpg") }, // **NOTE**: Replace with correct local path
    { name: "Machinery Rental", img: require("../assets/re2.jpg") }, // **NOTE**: Replace with correct local path
    { name: "Transportation", img: require("../assets/re3.jpg") }, // **NOTE**: Replace with correct local path
    { name: "Bulk Procurement", img: require("../assets/re4.jpg") }, // **NOTE**: Replace with correct local path
  ];

  const handleScrollToServices = () => {
    if (servicesRef.current && scrollViewRef.current) {
      (servicesRef.current as any).measureLayout(
        (scrollViewRef.current as any).getInnerViewNode(),
        (x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y, animated: true });
        },
        () => {
          scrollViewRef.current?.scrollTo({ y: 400, animated: true });
        }
      );
    }
  };

  // Open / close animations for cleaning sheet
  const openCleaningSheet = () => {
    setShowCleaningSheet(true);
    cleaningTranslate.setValue(SHEET_HEIGHT);
    Animated.timing(cleaningTranslate, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };
  const closeCleaningSheet = () => {
    Animated.timing(cleaningTranslate, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setShowCleaningSheet(false));
  };

  // Open / close animations for transport sheet
  const openTransportSheet = () => {
    setShowTransportSheet(true);
    transportTranslate.setValue(SHEET_HEIGHT);
    Animated.timing(transportTranslate, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };
  const closeTransportSheet = () => {
    Animated.timing(transportTranslate, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setShowTransportSheet(false));
  };

  // Buy/Sales/Rentals bottom sheet
  const openRentalSheet = () => {
    setShowRentalSheet(true);
    rentalTranslate.setValue(SHEET_HEIGHT);
    Animated.timing(rentalTranslate, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const closeRentalSheet = () => {
    Animated.timing(rentalTranslate, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setShowRentalSheet(false));
  };

  // Raw Materials bottom sheet
  const openRawMaterialSheet = () => {
    setShowRawMaterialSheet(true);
    rawMaterialTranslate.setValue(SHEET_HEIGHT);
    Animated.timing(rawMaterialTranslate, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const closeRawMaterialSheet = () => {
    Animated.timing(rawMaterialTranslate, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setShowRawMaterialSheet(false));
  };

  // === NEW FUNCTION: Handle navigation from inside cleaning sheet ===
  const handleCleaningServicePress = (serviceName: string) => {
    closeCleaningSheet(); // Always close the sheet first
    
    if (serviceName === "Cleaning Services") {
      // THIS IS THE TARGET BUTTON: navigate to the detailed cleaning screen
      navigation.navigate("Cleaning");
    } else {
      console.log(`Navigating to detail screen for: ${serviceName}`);
      // For other services (Plumbing, Electrical, etc.) navigate to a different detail page
      // navigation.navigate('ServiceDetail', { serviceName: serviceName });
    }
  };
  // =================================================================

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 120 }}>
        <NavBar navigation={navigation} />

        {/* HERO */}
        <ImageBackground source={require("../assets/hero.jpg")} style={(styles as Style).hero}>
          <View style={(styles as Style).overlay} />
          <Text style={(styles as Style).heroTitle}>Transform Your Home & Property Services</Text>
          <Text style={(styles as Style).heroSubtitle}>Your trusted solution for cleaning, moving, rentals, construction, and more.</Text>
          <TouchableOpacity style={(styles as Style).startBtn} onPress={handleScrollToServices}>
            <Text style={(styles as Style).startBtnText}>Get Started</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* SERVICES */}
        <View ref={servicesRef} style={styles.servicesSection}>
          <Text style={styles.servicesHeader}>Our Services</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15, paddingRight: 35 }}>
            {/* Cleaning — open cleaning sheet */}
            <TouchableOpacity style={styles.serviceCardHorizontal} onPress={openCleaningSheet}>
              <ImageBackground source={require("../assets/c1.jpg")} style={styles.serviceImgHorizontal} imageStyle={{ borderRadius: 12 }} />
              <Text style={styles.serviceTitle}>Cleaning & Home Services</Text>
            </TouchableOpacity>

            {/* Transport — open transport sheet */}
            <TouchableOpacity style={styles.serviceCardHorizontal} onPress={openTransportSheet}>
              <ImageBackground source={require("../assets/c1.jpg")} style={styles.serviceImgHorizontal} imageStyle={{ borderRadius: 12 }} />
              <Text style={styles.serviceTitle}>Transport</Text>
            </TouchableOpacity>

            {/* Other cards keep same navigation */}
            <TouchableOpacity
              style={styles.serviceCardHorizontal}
              onPress={openRentalSheet}>

              <ImageBackground source={require("../assets/rental.jpg")} style={styles.serviceImgHorizontal} imageStyle={{ borderRadius: 12 }} />
              <Text style={styles.serviceTitle}>Buy/Sales/Rentals</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCardHorizontal} onPress={openRawMaterialSheet}>
              <ImageBackground source={require("../assets/cma.jpg")} style={styles.serviceImgHorizontal} imageStyle={{ borderRadius: 12 }} />
              <Text style={styles.serviceTitle}>Raw Materials</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCardHorizontal} onPress={() => navigation.navigate("Education")}>
              <ImageBackground source={require("../assets/c2.jpg")} style={styles.serviceImgHorizontal} imageStyle={{ borderRadius: 12 }} />
              <Text style={styles.serviceTitle}>Education</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCardHorizontal} onPress={() => navigation.navigate("SwachifyProducts")}>
              <ImageBackground source={require("../assets/c2.jpg")} style={styles.serviceImgHorizontal} imageStyle={{ borderRadius: 12 }} />
              <Text style={styles.serviceTitle}>Swachify Products</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCardHorizontal} onPress={() => navigation.navigate("Freelancer")}>
              <ImageBackground source={require("../assets/c4.jpg")} style={styles.serviceImgHorizontal} imageStyle={{ borderRadius: 12 }} />
              <Text style={styles.serviceTitle}>Freelancer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* WHY CHOOSE US */}
        <View style={(styles as Style).whySection}>
          <Text style={(styles as Style).whyTitle}>Why Choose Our Service</Text>
          <Text style={(styles as Style).whySubtitle}>We focus on quality, trust and speed — built to make your life easier.</Text>

          <View style={(styles as Style).whyGrid}>
            <View style={(styles as Style).whyCard}>
              <Text style={[(styles as Style).whyIcon, { color: "#FF8C00" }]}>🛠️</Text>
              <Text style={(styles as Style).whyHeading}>Skilled Professionals</Text>
              <Text style={(styles as Style).whyText}>Verified, trained technicians who deliver quality workmanship every time.</Text>
            </View>

            <View style={(styles as Style).whyCard}>
              <Text style={[(styles as Style).whyIcon, { color: "#1E90FF" }]}>🏡</Text>
              <Text style={(styles as Style).whyHeading}>Trusted & Local</Text>
              <Text style={(styles as Style).whyText}>Local teams who know your area and provide timely service.</Text>
            </View>

            <View style={(styles as Style).whyCard}>
              <Text style={[(styles as Style).whyIcon, { color: "#32CD32" }]}>🚚</Text>
              <Text style={(styles as Style).whyHeading}>Transparent Pricing</Text>
              <Text style={(styles as Style).whyText}>Clear quotes, no hidden fees — affordable for every need.</Text>
            </View>

            <View style={(styles as Style).whyCard}>
              <Text style={[(styles as Style).whyIcon, { color: "#FFB300" }]}>📜</Text>
              <Text style={(styles as Style).whyHeading}>Licensed & Insured</Text>
              <Text style={(styles as Style).whyText}>Professional services backed by proper licensing and insurance.</Text>
            </View>

            <View style={(styles as Style).whyCard}>
              <Text style={[(styles as Style).whyIcon, { color: "#A020F0" }]}>📦</Text>
              <Text style={(styles as Style).whyHeading}>Satisfaction Guarantee</Text>
              <Text style={(styles as Style).whyText}>If you're not happy, we'll make it right.</Text>
            </View>

            <View style={(styles as Style).whyCard}>
              <Text style={[(styles as Style).whyIcon, { color: "#FF0000" }]}>⏰</Text>
              <Text style={(styles as Style).whyHeading}>24/7 Support</Text>
              <Text style={(styles as Style).whyText}>Emergency response and customer support anytime.</Text>
            </View>

            {/* FOOTER */}
            <View style={(styles as Style).footerContainer}>
              <View style={(styles as Style).footerContent}>
                <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>About Us</Text>
                  <Text style={(styles as Style).footerText}>Your trusted partner for all home and property-related services. Quality, reliability, and customer satisfaction guaranteed.</Text>
                </View>

                <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>Services</Text>
                  <Text style={(styles as Style).footerText}>• Cleaning Service</Text>
                  <Text style={(styles as Style).footerText}>• Packers & Movers</Text>
                  <Text style={(styles as Style).footerText}>• Home Services</Text>
                  <Text style={(styles as Style).footerText}>• Rentals</Text>
                  <Text style={(styles as Style).footerText}>• Commercial Plots</Text>
                  <Text style={(styles as Style).footerText}>• Construction Materials</Text>
                </View>

                <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>Quick Links</Text>
                  <Text style={(styles as Style).footerText}>• Home</Text>
                  <Text style={(styles as Style).footerText}>• About</Text>
                  <Text style={(styles as Style).footerText}>• Contact</Text>
                  <Text style={(styles as Style).footerText}>• Careers</Text>
                </View>

                <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>Contact Info</Text>
                  <Text style={(styles as Style).footerText}>📞 +1 (555) 123-4567</Text>
                  <Text style={(styles as Style).footerText}>📧 info@homeservices.com</Text>
                  <Text style={(styles as Style).footerText}>📍 123 Service Street, City, State</Text>
                </View>
              </View>

              <View style={(styles as Style).footerBottom}>
                <Text style={(styles as Style).footerBottomText}>© 2025 Home Services. All rights reserved.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Cleaning bottom sheet */}
      {showCleaningSheet && (
        <View style={popupStyles.overlayContainer}>
          <Pressable style={popupStyles.backdrop} onPress={closeCleaningSheet} />
          <Animated.View style={[popupStyles.sheetContainer, { transform: [{ translateY: cleaningTranslate }] }]}>
            <View style={popupStyles.sheetHeaderRow}>
              <Text style={popupStyles.sheetSmallTitle}>Cleaning & Home Services</Text>
              <TouchableOpacity onPress={closeCleaningSheet} style={popupStyles.closeIconBtn}>
                <Text style={popupStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={popupStyles.sheetTitle}>Select a category</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              <View style={popupStyles.grid}>
                {cleaningServices.map((item, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={popupStyles.card}
                    // 👇 MODIFIED onPress TO HANDLE NAVIGATION TO CLEANING SERVICE SCREEN
                    onPress={() => handleCleaningServicePress(item.name)} 
                  >
                    <Image source={item.img} style={popupStyles.cardImg} />
                    <Text style={popupStyles.cardText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      )}

      {/* Rentals bottom sheet */}
      {showRentalSheet && (
        <View style={popupStyles.overlayContainer}>
          <Pressable style={popupStyles.backdrop} onPress={closeRentalSheet} />

          <Animated.View
            style={[
              popupStyles.sheetContainer,
              { transform: [{ translateY: rentalTranslate }] },
            ]}>

            <View style={popupStyles.sheetHeaderRow}>
              <Text style={popupStyles.sheetSmallTitle}>Buy / Sales / Rentals</Text>
              <TouchableOpacity onPress={closeRentalSheet} style={popupStyles.closeIconBtn}>
                <Text style={popupStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={popupStyles.sheetTitle}>Choose a Service</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              <View style={popupStyles.grid}>
                {rentalServices.map((item, idx) => (
                  <TouchableOpacity key={idx} style={popupStyles.card}>
                    <Image source={item.img} style={popupStyles.cardImg} />
                    <Text style={popupStyles.cardText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

          </Animated.View>
        </View>
      )}

      {/* Transport bottom sheet */}
      {showTransportSheet && (
        <View style={popupStyles.overlayContainer}>
          <Pressable style={popupStyles.backdrop} onPress={closeTransportSheet} />
          <Animated.View style={[popupStyles.sheetContainer, { transform: [{ translateY: transportTranslate }] }]}>
            <View style={popupStyles.sheetHeaderRow}>
              <Text style={popupStyles.sheetSmallTitle}>Packers & Movers</Text>
              <TouchableOpacity onPress={closeTransportSheet} style={popupStyles.closeIconBtn}>
                <Text style={popupStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={popupStyles.sheetTitle}>Select a category</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              <View style={popupStyles.grid}>
                {transportServices.map((item, idx) => (
                  <TouchableOpacity key={idx} style={popupStyles.card}>
                    <Image source={item.img} style={popupStyles.cardImg} />
                    <Text style={popupStyles.cardText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      )}

      {/* 🛠️ Raw Materials bottom sheet */}
      {showRawMaterialSheet && (
        <View style={popupStyles.overlayContainer}>
          <Pressable style={popupStyles.backdrop} onPress={closeRawMaterialSheet} />

          <Animated.View
            style={[
              popupStyles.sheetContainer,
              { transform: [{ translateY: rawMaterialTranslate }] },
            ]}>

            <View style={popupStyles.sheetHeaderRow}>
              <Text style={popupStyles.sheetSmallTitle}>Raw Materials</Text>
              <TouchableOpacity onPress={closeRawMaterialSheet} style={popupStyles.closeIconBtn}>
                <Text style={popupStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={popupStyles.sheetTitle}>Choose a Service</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              <View style={popupStyles.grid}>
                {rawMaterialServices.map((item, idx) => (
                  <TouchableOpacity key={idx} style={popupStyles.card}>
                    <Image source={item.img} style={popupStyles.cardImg} />
                    <Text style={popupStyles.cardText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

          </Animated.View>
        </View>
      )}

    </View>
  );
}

/* ========== Existing styles (same as your file) ========== */
const styles = StyleSheet.create({
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
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  hero: {
    height: 350,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 100,
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  servicesSection: {
    paddingVertical: 20,
  },
  serviceCardHorizontal: {
    width: 90,
    height: 115,
    marginRight: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "#b19964ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  serviceImgHorizontal: {
    width: 80,
    height: 70,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
    alignSelf: "center",
  },
  learnMore: {
    color: "#007bff",
    fontWeight: "600",
    fontSize: 9,
    marginTop: 2,
    textAlign: "center",
  },
  servicesHeader: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: "#111",
  },
  serviceTitle: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
    color: "#333",
    textAlign: "center",
    lineHeight: 14,
  },
  whySection: {
    padding: 20,
    marginTop: 10,
    backgroundColor: "#f4f4f4",
  },
  whyTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    color: "#1a1a1a",
  },
  whySubtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginBottom: 25,
  },
  whyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  whyCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  whyIcon: {
    fontSize: 30,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 3,
    borderBottomColor: "#FFD700",
    alignSelf: "flex-start",
    width: "auto",
  },
  whyHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  whyText: {
    fontSize: 13,
    color: "#777",
  },
  footerContainer: {
    backgroundColor: "#333",
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    width: "100%",
    marginLeft: 0,
    marginRight: 0,
    flexDirection: "column",
    justifyContent: "flex-start",
    shadowColor: "transparent",
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

/* ========== Popup styles (shared by both sheets) ========== */
const popupStyles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: Math.round(WINDOW_HEIGHT * SHEET_RATIO),
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 12,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sheetSmallTitle: {
    color: "#999",
    fontSize: 14,
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
  closeIcon: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#111",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImg: {
    width: 90,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "cover",
  },
  cardText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});