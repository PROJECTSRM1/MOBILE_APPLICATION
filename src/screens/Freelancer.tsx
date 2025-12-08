// src/screens/Freelancer.tsx
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* assets - place files in assets/ or update paths */
const LOGO = require("../../assets/swachlogo.png");

/* Menu items reused from other screens */
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

export default function Freelancer() {
  const nav = useNavigation<any>();

  /* left menu animation (same pattern used across screens) */
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const panelWidth = Math.round(SCREEN_W * 0.78);

  const openMenu = () => {
    setIsOpen(true);
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  };
  const closeMenu = () => {
    Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() =>
      setIsOpen(false)
    );
  };
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] });

  const goTo = (route: string) => {
    closeMenu();
    setTimeout(() => nav.navigate(route), 260);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header (same) */}
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={openMenu} style={styles.hamburgerBtn}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>

            <View style={styles.brandWrap}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.brand}>SWACHIFY INDIA</Text>
            </View>

            <TouchableOpacity style={styles.headerBtn} onPress={() => nav.navigate("Signup")}>
              <Text style={styles.headerBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Slide panel */}
        {isOpen && (
          <>
            <Animated.View
              style={[
                styles.overlay,
                { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }) },
              ]}
            />
            <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

            <Animated.View style={[styles.panelWrapLeft, { width: panelWidth, transform: [{ translateX }] }]}>
              <View style={[styles.panelInner, { width: panelWidth }]}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Menu</Text>
                  <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.menuItems}>
                  {MENU_ITEMS.map((m) => (
                    <TouchableOpacity key={m.id} style={styles.menuItem} onPress={() => goTo(m.route)}>
                      <Text style={styles.menuItemText}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.menuSignup} onPress={() => goTo("Signup")}>
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

        {/* HERO */}
        {/* <ImageBackground source={HERO} style={styles.hero} imageStyle={{ resizeMode: "cover" }}> */}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find the Right Tasks{'\n'}That Match Your Skills</Text>
            <Text style={styles.heroSubtitle}>Verified jobs. Nearby opportunities. Instant earning.</Text>

            <View style={{ flexDirection: "row", marginTop: 18 }}>
              <TouchableOpacity style={styles.ctaBtnOutline}>
                <Text style={styles.ctaOutlineText}>→ View Live Requests</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctaBtn}>
                <Text style={styles.ctaText}>Become a Freelancer</Text>
              </TouchableOpacity>
            </View>

            {/* STATS CARDS */}
            <View style={styles.statsWrap}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Active Tasks</Text>
                <Text style={styles.statValue}>↗ 2,456+</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Freelancers</Text>
                <Text style={styles.statValue}>👥 10,000+</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Avg Rating</Text>
                <Text style={styles.statValue}>☆ 4.8</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Verified Jobs</Text>
                <Text style={styles.statValue}>🛡️ 100%</Text>
              </View>
            </View>
          </View>
        {/* </ImageBackground> */}

        {/* footer reused */}
        <Footer />
        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* simple Footer (reuse pattern) */
function Footer() {
  return (
    <View style={footerStyles.footerWrap}>
      <View style={footerStyles.inner}>
        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>About Us</Text>
          <Text style={footerStyles.colText}>
            Your trusted partner for all home and property-related services.
          </Text>
        </View>

        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>Contact Info</Text>
          <Text style={footerStyles.colText}>📞 +1 (555) 123-4567</Text>
          <Text style={footerStyles.colText}>✉️ info@homeservices.com</Text>
        </View>
      </View>

      <View style={footerStyles.divider} />
      <View style={footerStyles.copyWrap}>
        <Text style={footerStyles.copy}>© {new Date().getFullYear()} Swachify India. All rights reserved.</Text>
      </View>
    </View>
  );
}

/* ---------------------- styles ---------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { alignItems: "center", backgroundColor: "#fff" },

  headerContainer: { width: "100%", backgroundColor: "#fff", zIndex: 50 },
  headerInner: {
    height: 64,
    paddingTop: Platform.OS === "android" ? 18 : 22,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hamburgerBtn: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  hamburgerIcon: { fontSize: 22, color: "#fff" },
  brandWrap: { flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  logo: { width: 36, height: 36, marginRight: 8 },
  brand: { fontSize: 16, fontWeight: "700", color: "#fff" },
  headerBtn: { backgroundColor: "#ffffff22", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  headerBtnText: { color: "#fff", fontWeight: "700" },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#000", zIndex: 55 },

  panelWrapLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 60,
    alignItems: "flex-start",
  },
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

  hero: { width: "100%", height: Math.round(SCREEN_H * 0.78), justifyContent: "center", alignItems: "center" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(23,43,99,0.25)" },
  heroContent: { paddingHorizontal: 28, alignItems: "center", marginTop: 12 },
  heroTitle: { color: "#fff", fontSize: 48, fontWeight: "900", textAlign: "center" },
  heroSubtitle: { color: "rgba(255,255,255,0.95)", fontSize: 16, textAlign: "center", marginTop: 8 },

  ctaBtn: { backgroundColor: "#fff", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 28, marginLeft: 12 },
  ctaText: { color: "#2b2b2b", fontWeight: "800" },
  ctaBtnOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#fff", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 28 },
  ctaOutlineText: { color: "#fff", fontWeight: "700" },

  statsWrap: { width: Math.min(960, SCREEN_W - 80), flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 32 },
  statCard: { width: "48%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 26, marginBottom: 18, alignItems: "center" },
  statLabel: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 10 },
  statValue: { color: "#fff", fontSize: 22, fontWeight: "900" },
});

/* footer styles (reused) */
const footerStyles = StyleSheet.create({
  footerWrap: {
    width: "100%",
    backgroundColor: "#071026",
    paddingTop: 32,
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
  divider: { height: 1, backgroundColor: "#274358", marginTop: 12, marginBottom: 12, opacity: 0.45 },
  copyWrap: { alignItems: "center", paddingTop: 8 },
  copy: { color: "#cfdbe6", fontSize: 13 },
});
