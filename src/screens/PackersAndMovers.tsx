// src/screens/PackersAndMovers.tsx
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Image,
  Platform,
  FlatList,
  Animated,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// --- Update these asset paths after you add images to src/assets ---
const HERO = require("../../assets/packers_hero.jpg");
const LOGO = require("../../assets/swachlogo.png");
const CARD1 = require("../../assets/pack1.jpg");
const CARD2 = require("../../assets/pack2.jpg");
const CARD3 = require("../../assets/pack3.jpg");
const CARD4 = require("../../assets/pack4.jpeg");
const CARD5 = require("../../assets/pack5.jpg");
const CARD6 = require("../../assets/pack6.jpg");
const CARD7 = require("../../assets/pack7.jpg");


const SERVICES = [
  { id: "packing", img: CARD1, title: "Packing Services", copy: "Professional packing with premium quality materials." },
  { id: "loading", img: CARD2, title: "Loading & Transport", copy: "Safe loading & transport at competitive rates." },
  { id: "local", img: CARD3, title: "Local & Long Distance", copy: "Reliable relocation across any distance." },
  { id: "insurance", img: CARD4, title: "Insurance Coverage", copy: "Optional insurance for peace of mind." },
];

const TYPES = [
  { id: "res", img: CARD5, title: "Residential Moving", price: "Starting at ₹2999", copy: "1-2 bedroom homes, packing & moving, furniture assembly." },
  { id: "office", img: CARD6, title: "Office Relocation", price: "Custom Quote", copy: "Minimal disruption, pro handling, secure transport." },
  { id: "vehicle", img: CARD7, title: "Vehicle Transport", price: "Starting at ₹4999", copy: "Door to door vehicle transport, insured." },
];

export default function PackersAndMovers(): React.ReactElement {
  const nav = useNavigation<any>();

  // menu animation state
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  // panel width (left side)
  const panelWidth = Math.round(SCREEN_W * 0.78);

  const openMenu = () => {
    setIsOpen(true);
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  };

  const closeMenu = () => {
    Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setIsOpen(false));
  };

  // slide from -panelWidth -> 0 (left)
  const panelTranslateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] });

  const MENU_ITEMS = [
    { id: "home", label: "Home", route: "Landing" },
    { id: "cleaning", label: "Cleaning", route: "Cleaning" },
    { id: "packers", label: "Packers & Movers", route: "Packers" }, // adjust name to match navigator
    { id: "homeServices", label: "Home Services", route: "Landing" },
    { id: "rentals", label: "Rentals", route: "Landing" },
    { id: "buySale", label: "Buy&Sale Properties", route: "Landing" },
    { id: "materials", label: "Construction Materials", route: "Landing" },
    { id: "freelancer", label: "Freelancer", route: "Landing" },
  ];

  const onPressMenu = (route?: string) => {
    closeMenu();
    if (route) {
      setTimeout(() => nav.navigate(route), 260);
    }
  };

  // simple form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={openMenu} style={styles.hamburgerBtn} activeOpacity={0.8}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>

            <View style={styles.brandWrap}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.brand}>SWACHIFY INDIA</Text>
            </View>

            <TouchableOpacity style={styles.headerBtn} onPress={() => nav.navigate("Signup")} activeOpacity={0.85}>
              <Text style={styles.headerBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Slide panel + overlay */}
        {isOpen && (
          <>
            <Animated.View style={[styles.overlay, { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }) }]} />
            <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

            <Animated.View style={[styles.panelWrap, { width: panelWidth, transform: [{ translateX: panelTranslateX }] }]}>
              <View style={[styles.panelInner, { width: panelWidth }]}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Menu</Text>
                  <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.menuItems}>
                  {MENU_ITEMS.map((m) => (
                    <TouchableOpacity key={m.id} style={styles.menuItem} onPress={() => onPressMenu(m.route)} activeOpacity={0.75}>
                      <Text style={styles.menuItemText}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.menuSignup} onPress={() => onPressMenu("Signup")}>
                    <Text style={styles.menuSignupText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.panelFooter}>
                  <Text style={styles.smallMuted}>© {new Date().getFullYear()} Swachify</Text>
                </View>
              </View>
            </Animated.View>
          </>
        )}

        {/* Hero */}
        <ImageBackground source={HERO} style={styles.hero}>
          <View style={styles.overlayHero} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>Stress-Free Relocation Services</Text>
            <Text style={styles.heroSubtitle}>From packing to delivery — we make your move effortless.</Text>
            <TouchableOpacity style={styles.heroCTA} onPress={() => nav.navigate("Signup")}>
              <Text style={styles.heroCTAText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Our Services */}
        <View style={[styles.centerColumn, { width: Math.min(960, SCREEN_W - 64) }]}>
          <Text style={styles.sectionHeading}>Our Services</Text>

          <View style={styles.servicesRow}>
            {SERVICES.map((s) => (
              <View key={s.id} style={styles.serviceCardSmall}>
                <Image source={s.img} style={styles.serviceThumb} />
                <Text style={styles.serviceCardTitle}>{s.title}</Text>
                <Text style={styles.serviceCardCopy}>{s.copy}</Text>
              </View>
            ))}
          </View>

          {/* Types of Moving Services */}
          <Text style={[styles.sectionHeading, { marginTop: 22 }]}>Types of Moving Services</Text>
          <View style={styles.typesRow}>
            {TYPES.map((t) => (
              <View key={t.id} style={styles.typeCard}>
                <Image source={t.img} style={styles.typeImg} />
                <Text style={styles.typeTitle}>{t.title}</Text>
                <Text style={styles.typePrice}>{t.price}</Text>
                <Text style={styles.typeCopy}>{t.copy}</Text>
                <TouchableOpacity style={styles.getQuoteBtn} onPress={() => nav.navigate("Signup")}>
                  <Text style={styles.getQuoteText}>Get Quote</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Request a Moving Quote Form */}
          <Text style={[styles.sectionHeading, { marginTop: 28 }]}>Request a Moving Quote</Text>
          <View style={styles.formCard}>
            <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
            <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
            <TouchableOpacity style={styles.submitBtn} onPress={() => ("Booking request submitted (demo)")}>
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>

          {/* Why Choose Us */}
          <Text style={[styles.sectionHeading, { marginTop: 28 }]}>Why Choose Us</Text>
          <View style={styles.whyRow}>
            <View style={styles.whyCard}>
              <Text style={styles.whyIcon}>👷</Text>
              <Text style={styles.whyTitle}>Expert Team</Text>
              <Text style={styles.whyCopy}>Trained professionals with years of experience.</Text>
            </View>

            <View style={styles.whyCard}>
              <Text style={styles.whyIcon}>⏱️</Text>
              <Text style={styles.whyTitle}>On-time Delivery</Text>
              <Text style={styles.whyCopy}>We value your time and deliver reliably.</Text>
            </View>

            <View style={styles.whyCard}>
              <Text style={styles.whyIcon}>🛡️</Text>
              <Text style={styles.whyTitle}>Full Insurance</Text>
              <Text style={styles.whyCopy}>Insurance options available for safe transit.</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Footer />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* Footer component */
function Footer(): React.ReactElement {
  return (
    <View style={footerStyles.footerWrap}>
      <View style={footerStyles.inner}>
        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>About Us</Text>
          <Text style={footerStyles.colText}>
            Your trusted partner for relocation and moving services. Quality, reliability and convenience.
          </Text>
        </View>

        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>Services</Text>
          <View style={footerStyles.list}>
            <Text style={footerStyles.listItem}>• Packing & Moving</Text>
            <Text style={footerStyles.listItem}>• Local & Long Haul</Text>
            <Text style={footerStyles.listItem}>• Vehicle Transport</Text>
            <Text style={footerStyles.listItem}>• Insurance</Text>
          </View>
        </View>

        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>Quick Links</Text>
          <View style={footerStyles.list}>
            <Text style={footerStyles.listItem}>• Home</Text>
            <Text style={footerStyles.listItem}>• Cleaning</Text>
            <Text style={footerStyles.listItem}>• Contact</Text>
            <Text style={footerStyles.listItem}>• Careers</Text>
          </View>
        </View>

        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>Contact Info</Text>
          <Text style={footerStyles.colText}>📞 +91 98765 43210</Text>
          <Text style={footerStyles.colText}>✉️ info@swachify.co</Text>
          <Text style={footerStyles.colText}>📍 Hyderabad, India</Text>
        </View>
      </View>

      <View style={footerStyles.divider} />
      <View style={footerStyles.copyWrap}>
        <Text style={footerStyles.copy}>© {new Date().getFullYear()} Swachify. All rights reserved.</Text>
      </View>
    </View>
  );
}

/* ------------ styles ------------ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { alignItems: "center", backgroundColor: "#fff" },

  /* header */
  headerContainer: { width: "100%", backgroundColor: "#fff", zIndex: 50 },
  headerInner: {
    height: 84,
    paddingTop: Platform.OS === "android" ? 18 : 22,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hamburgerBtn: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  hamburgerIcon: { fontSize: 22, color: "#111" },
  brandWrap: { flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  logo: { width: 36, height: 36, marginRight: 8 },
  brand: { fontSize: 16, fontWeight: "700", color: "#111" },
  headerBtn: { backgroundColor: "#d93025", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  headerBtnText: { color: "#fff", fontWeight: "700" },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#000", zIndex: 55 },

  /* left-anchored panel */
  panelWrap: { position: "absolute", top: 0, bottom: 0, left: 0, zIndex: 60, alignItems: "flex-start" },
  panelInner: {
    width: Math.round(SCREEN_W * 0.78),
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 40 : 54,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  panelTitle: { fontSize: 18, fontWeight: "800" },
  closeBtn: { padding: 6, borderRadius: 8 },
  closeText: { fontSize: 18 },
  menuItems: { marginTop: 8 },
  menuItem: { paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  menuItemText: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  menuSignup: { marginTop: 18, backgroundColor: "#d93025", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  menuSignupText: { color: "#fff", fontWeight: "800" },
  panelFooter: { marginTop: 18, alignItems: "center" },
  smallMuted: { color: "#77818a", fontSize: 12 },

  /* hero */
  hero: { width: "100%", height: Math.round(SCREEN_H * 0.47), justifyContent: "center", alignItems: "center" },
  overlayHero: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,12,20,0.35)" },
  heroContent: { paddingHorizontal: 28, alignItems: "center" },
  heroTag: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 8 },
  heroSubtitle: { color: "rgba(255,255,255,0.95)", fontSize: 14, textAlign: "center", marginBottom: 14, maxWidth: 900 },
  heroCTA: { backgroundColor: "#d93025", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  heroCTAText: { color: "#fff", fontWeight: "800" },

  /* center column */
  centerColumn: { alignSelf: "center", paddingHorizontal: 12, marginTop: 22, marginBottom: 22 },

  sectionHeading: { fontSize: 18, fontWeight: "800", color: "#222", alignSelf: "center", marginBottom: 12 },

  /* services row */
  servicesRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", flexWrap: "nowrap", alignSelf: "center", paddingHorizontal: 24 },
  serviceCardSmall: { width: 108, backgroundColor: "#fff", borderRadius: 10, padding: 8, alignItems: "center", marginHorizontal: 8, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  serviceThumb: { width: 88, height: 72, borderRadius: 6, marginBottom: 8 },
  serviceCardTitle: { fontSize: 12, fontWeight: "800", textAlign: "center", marginBottom: 6 },
  serviceCardCopy: { fontSize: 11, color: "#6b7280", textAlign: "center" },

  /* types */
  typesRow: { width: "100%", flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 6 },
  typeCard: { width: 200, backgroundColor: "#fff", borderRadius: 10, padding: 12, alignItems: "center", marginHorizontal: 8, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  typeImg: { width: 180, height: 100, borderRadius: 8, marginBottom: 10 },
  typeTitle: { fontWeight: "800", marginBottom: 6 },
  typePrice: { color: "#6b7280", fontSize: 12, marginBottom: 6 },
  typeCopy: { fontSize: 12, color: "#6b7280", textAlign: "center", marginBottom: 8 },
  getQuoteBtn: { backgroundColor: "#d93025", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  getQuoteText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  /* form */
  formCard: { width: "100%", backgroundColor: "#fff", borderRadius: 10, padding: 12, marginTop: 8, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  input: { height: 44, borderWidth: 1, borderColor: "#ececec", borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  submitBtn: { backgroundColor: "#d93025", height: 44, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  submitBtnText: { color: "#fff", fontWeight: "800" },

  /* why */
  whyRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, width: "100%" },
  whyCard: { flex: 1, backgroundColor: "#f5fbff", borderRadius: 10, padding: 14, marginHorizontal: 6, alignItems: "center" },
  whyIcon: { fontSize: 26, marginBottom: 8 },
  whyTitle: { fontWeight: "800", marginBottom: 6 },
  whyCopy: { textAlign: "center", color: "#6b7280", fontSize: 12 },

  /* small helpers */
  btnRow: { flexDirection: "row", alignItems: "center", gap: 12 },
});

/* footer styles */
const footerStyles = StyleSheet.create({
  footerWrap: {
    width: "100%",
    backgroundColor: "#071026",
    paddingTop: 28,
    paddingBottom: 18,
    paddingHorizontal: 20,
    marginTop: 28,
  },
  inner: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  col: { width: "48%", maxWidth: 320, marginBottom: 18 },
  colTitle: { color: "#fff", fontSize: 16, fontWeight: "800", marginBottom: 8 },
  colText: { color: "#cfdbe6", fontSize: 13, lineHeight: 20 },
  list: { marginTop: 6 },
  listItem: { color: "#cfdbe6", fontSize: 13, marginBottom: 6 },
  icon: { color: "#cfdbe6", fontSize: 18, marginRight: 8 },
  divider: { height: 1, backgroundColor: "#274358", marginTop: 12, marginBottom: 12, opacity: 0.45 },
  copyWrap: { alignItems: "center", paddingTop: 8 },
  copy: { color: "#cfdbe6", fontSize: 13 },
});
