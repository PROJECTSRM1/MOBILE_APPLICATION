// src/screens/Rentals.tsx
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_W } = Dimensions.get("window");

/* ----- Import Hero & Cards Images (use your real images) ----- */
const LOGO = require("../../assets/swachlogo.png");
const HERO = require("../../assets/rentals_hero.jpg"); // purple hero image
const LIST1 = require("../../assets/rent1.jpg");
const LIST2 = require("../../assets/rent2.jpg");
const LIST3 = require("../../assets/rent3.jpg");
const LIST4 = require("../../assets/rent4.jpg");

/* ----- MENU ----- */
const MENU_ITEMS = [
  { id: "home", label: "Home", route: "Landing" },
  { id: 'Transport', label: 'Transport', route: 'Transport' },
  { id: 'Construction', label: 'Raw Materials', route: 'Construction' },
  {id: 'Cleaning', label: 'Cleaning & Home Service', route: 'Cleaning' },
  { id: 'rentals', label: 'Buy/Sale/Rentals', route: 'Rentals' },
  { id: 'freelancer', label: 'Freelancer', route: 'Freelancer' },
  {id: 'Education', label: 'Education Services', route: 'Education' },
  {id: 'Products', label: 'Swachify Products', route: 'Products' },
];

/* ----- Browse Property Types ----- */
const PROPERTY_TYPES = [
  { id: 1, label: "4,500+ Plots", subtitle: "Properties" },
  { id: 2, label: "1,280+ Homes", subtitle: "Residences" },
  { id: 3, label: "690+ Flats", subtitle: "Apartments" },
  { id: 4, label: "350+ Shops", subtitle: "Commercial" },
];

/* ----- Featured Listings ----- */
const LISTINGS = [
  { id: 1, img: LIST1, title: "Building • 1900 sq.ft", price: "₹34,99,000", location: "Hyderabad" },
  { id: 2, img: LIST2, title: "Flat • 2200 sq.ft", price: "₹56,99,000", location: "Gachibowli" },
  { id: 3, img: LIST3, title: "Land • 300 sq.yards", price: "₹10,99,000", location: "Shadnagar" },
  { id: 4, img: LIST4, title: "Corner Plot • 150 sq.yards", price: "₹13,99,000", location: "Kompally" },
];

/* ----- How It Works Steps ----- */
const STEPS = [
  { id: 1, title: "Search & Filter", text: "View thousands of verified listings" },
  { id: 2, title: "Schedule Viewing", text: "Choose a date for property visit" },
  { id: 3, title: "Submit Application", text: "Send application to property owner" },
  { id: 4, title: "Move In", text: "Sign agreement and move in easily" },
];

export default function Rentals() {
  const nav = useNavigation<any>();

  /* ----- MENU ANIMATION ----- */
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const panelWidth = Math.round(SCREEN_W * 0.78);

  const openMenu = () => {
    setIsOpen(true);
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  };

  const closeMenu = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-panelWidth, 0],
  });

  const goTo = (route: string) => {
    closeMenu();
    setTimeout(() => nav.navigate(route), 260);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ backgroundColor: "#fff", alignItems: "center" }}>

        {/* ----- HEADER (same as Landing) ----- */}
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={openMenu} style={styles.hamburgerBtn}>
              <Text style={styles.hamburger}>☰</Text>
            </TouchableOpacity>

            <View style={styles.brandWrap}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.brand}>SWACHIFY INDIA</Text>
            </View>

            <TouchableOpacity onPress={() => nav.navigate("Signup")} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ----- LEFT SLIDE MENU ----- */}
        {isOpen && (
          <>
            <Animated.View
              style={[
                styles.overlay,
                { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }) },
              ]}
            />
            <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
            <Animated.View
              style={[styles.panel, { width: panelWidth, transform: [{ translateX }] }]}
            >
              <View style={styles.panelInner}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Menu</Text>
                  <TouchableOpacity onPress={closeMenu}>
                    <Text style={styles.close}>✕</Text>
                  </TouchableOpacity>
                </View>

                {MENU_ITEMS.map((m) => (
                  <TouchableOpacity key={m.id} onPress={() => goTo(m.route)} style={styles.menuItem}>
                    <Text style={styles.menuText}>{m.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </>
        )}

        {/* ----- HERO SECTION ----- */}
        <ImageBackground source={HERO} style={styles.hero}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find Your Perfect Property</Text>
            <View style={styles.searchWrap}>
              <TextInput placeholder="Search location…" style={styles.searchInput} />
              <TouchableOpacity style={styles.searchBtn}>
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* ----- CENTER COLUMN ----- */}
        <View style={styles.centerColumn}>

          {/* ----- BROWSE BY PROPERTY TYPE ----- */}
          <Text style={styles.sectionTitle}>Browse by Property Type</Text>

          <View style={styles.typeWrap}>
            {PROPERTY_TYPES.map((t) => (
              <View key={t.id} style={styles.typeCard}>
                <Text style={styles.typeLabel}>{t.label}</Text>
                <Text style={styles.typeSub}>{t.subtitle}</Text>
              </View>
            ))}
          </View>

          {/* ----- FEATURED QUICK LISTINGS ----- */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Featured Quick Listings</Text>

          <View style={styles.listingsRow}>
            {LISTINGS.map((l) => (
              <View key={l.id} style={styles.listCard}>
                <Image source={l.img} style={styles.listImg} />
                <View style={{ padding: 10 }}>
                  <Text style={styles.listTitle}>{l.title}</Text>
                  <Text style={styles.listPrice}>{l.price}</Text>
                  <Text style={styles.listLoc}>{l.location}</Text>
                  <TouchableOpacity style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* ----- HOW IT WORKS ----- */}
          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>How It Works</Text>

          <View style={styles.stepsRow}>
            {STEPS.map((s) => (
              <View key={s.id} style={styles.stepCard}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            ))}
          </View>

          {/* ----- CONSULTATION FORM ----- */}
          <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Schedule a Consultation</Text>

          <View style={styles.formCard}>
            <TextInput placeholder="Full Name" style={styles.input} />
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Phone Number" style={styles.input} />
            <TextInput placeholder="Service Type" style={styles.input} />
            <TextInput placeholder="Preferred City" style={styles.input} />
            <TextInput placeholder="Preferred Date" style={styles.input} />
            <TextInput
              placeholder="Additional Details"
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitText}>Submit Booking Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ----- FOOTER ----- */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ----- Footer Reuse ----- */
function Footer() {
  return (
    <View style={{ backgroundColor: "#071026", width: "100%", padding: 20, marginTop: 28 }}>
      <Text style={{ color: "#fff", textAlign: "center" }}>
        © {new Date().getFullYear()} Swachify India. All rights reserved.
      </Text>
    </View>
  );
}

/* ----- STYLES ----- */
const styles = StyleSheet.create({
  headerContainer: { width: "100%", backgroundColor: "#fff" },
  headerInner: {
    height: 64,
    paddingTop: Platform.OS === "android" ? 18 : 22,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hamburgerBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  hamburger: { fontSize: 22 },
  brandWrap: { flexDirection: "row", alignItems: "center" },
  logo: { width: 38, height: 38, marginRight: 6 },
  brand: { fontSize: 16, fontWeight: "800" },
  headerBtn: { backgroundColor: "#d93025", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  headerBtnText: { color: "#fff", fontWeight: "800" },

  /* Left Menu */
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#000", zIndex: 55 },
  panel: { position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: "#fff", zIndex: 60 },
  panelInner: { padding: 20, marginTop: 60 },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  panelTitle: { fontSize: 18, fontWeight: "800" },
  close: { fontSize: 22 },
  menuItem: { paddingVertical: 12, borderBottomWidth: 0.4, borderColor: "#ddd" },
  menuText: { fontSize: 16, fontWeight: "700" },

  /* Hero */
  hero: { width: "100%", height: 250, justifyContent: "center" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(80,0,140,0.45)" },
  heroContent: { alignItems: "center", paddingHorizontal: 20 },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "900", marginBottom: 12 },
  searchWrap: { flexDirection: "row", width: "90%", backgroundColor: "#fff", borderRadius: 10, padding: 6 },
  searchInput: { flex: 1, paddingHorizontal: 12 },
  searchBtn: { backgroundColor: "#6600cc", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  searchBtnText: { color: "#fff", fontWeight: "800" },

  /* Center content */
  centerColumn: { width: Math.min(960, SCREEN_W - 40), marginTop: 20 },

  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "center", marginBottom: 12 },

  /* Property Types */
  typeWrap: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  typeCard: { width: "23%", backgroundColor: "#fff", borderRadius: 10, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#eee" },
  typeLabel: { fontWeight: "800", fontSize: 14 },
  typeSub: { color: "#7c7c7c", fontSize: 12 },

  /* Listings */
  listingsRow: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" },
  listCard: { width: "48%", backgroundColor: "#fff", borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: "#eee" },
  listImg: { width: "100%", height: 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  listTitle: { fontWeight: "800", fontSize: 14 },
  listPrice: { marginTop: 4, fontSize: 12, color: "#333" },
  listLoc: { fontSize: 11, color: "#777", marginBottom: 4 },
  viewBtn: { backgroundColor: "#6600cc", padding: 8, borderRadius: 8, marginTop: 10 },
  viewBtnText: { color: "#fff", fontWeight: "800", textAlign: "center", fontSize: 12 },

  /* How It Works */
  stepsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  stepCard: { width: "23%", backgroundColor: "#f5e9ff", padding: 16, borderRadius: 10 },
  stepTitle: { fontWeight: "800", fontSize: 14, marginBottom: 6 },
  stepText: { color: "#555", fontSize: 12 },

  /* Form */
  formCard: { backgroundColor: "#fff", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#eee", marginTop: 10 },
  input: { backgroundColor: "#f8f8f8", marginBottom: 12, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  submitBtn: { backgroundColor: "#6600cc", padding: 12, borderRadius: 10 },
  submitText: { color: "#fff", textAlign: "center", fontWeight: "800" },
});
