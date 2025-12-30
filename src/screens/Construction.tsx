// src/screens/Construction.tsx
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
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* ----- Images (place your actual images in assets and update names if needed) ----- */
const LOGO = require("../../assets/swachlogo.png");
const HERO = require("../../assets/construction_hero.jpg");

/* Category images (use your real files) */
const IMG_CEMENT = require("../../assets/Raw1.jpg");
const IMG_STEEL = require("../../assets/Raw2.jpg");
const IMG_BRICKS = require("../../assets/Raw3.jpg");
const IMG_SAND = require("../../assets/Raw4.jpg");
const IMG_ROOF = require("../../assets/Raw5.jpg");
const IMG_PLUMB = require("../../assets/Raw6.jpeg");

/* Featured product images */
const F1 = require("../../assets/Raw7.jpg");
const F2 = require("../../assets/Raw8.jpg");
const F3 = require("../../assets/Raw9.jpeg");
const F4 = require("../../assets/Raw10.jpg");

/* Same menu items as Landing */
const MENU_ITEMS = [
  { id: "home", label: "Home & Cleaning", route: "Landing" },
  { id: "Transport", label: "Transport", route: "Transport" },
  { id: "Construction", label: "Construction Raw Materials", route: "Construction" },
  { id: "rentals", label: "Rentals", route: "Landing" },
  { id: "buySale", label: "Buy&Sale Properties", route: "Landing" },
  { id: "freelancer", label: "Freelancer", route: "Landing" },
];

/* Product categories data (cards with mini bullet lists) */
const CATEGORIES = [
  {
    id: "cement",
    img: IMG_CEMENT,
    title: "Cement & Concrete",
    bullets: ["Portland Cement", "Ready-mix Concrete", "Mortar", "Grout"],
  },
  {
    id: "steel",
    img: IMG_STEEL,
    title: "Steel & Metals",
    bullets: ["TMT Bars", "Steel Sheets", "Wire Mesh", "Angles & Channels"],
  },
  {
    id: "bricks",
    img: IMG_BRICKS,
    title: "Bricks & Blocks",
    bullets: ["Fly Ash Bricks", "AAC Blocks", "Concrete Blocks"],
  },
  {
    id: "sand",
    img: IMG_SAND,
    title: "Sand & Aggregates",
    bullets: ["River Sand", "M Sand", "Coarse Aggregate", "Stone Chips"],
  },
  {
    id: "roof",
    img: IMG_ROOF,
    title: "Roofing Materials",
    bullets: ["Roof Tiles", "Metal Sheets", "Waterproofing", "Insulation"],
  },
  {
    id: "plumb",
    img: IMG_PLUMB,
    title: "Plumbing & Electrical",
    bullets: ["PVC Pipes", "Copper Wires", "Switches", "Fittings"],
  },
];

/* Services icons/text */
const SERVICES = [
  { id: "free", title: "Free Delivery", text: "On orders above ₹5,000 within 50 km" },
  { id: "same", title: "Same-Day Dispatch", text: "Orders placed before 2 PM ship the same day" },
  { id: "quality", title: "Quality Assured", text: "All materials tested and certified" },
  { id: "calc", title: "Quantity Calculator", text: "Free estimation assistance for your project" },
];

/* Featured products */
const FEATURED = [
  { id: "f1", img: F1, title: "Premium Portland Cement", price: "₹470 / 50kg", points: ["High Strength", "Quick Setting", "Weather Resistant"] },
  { id: "f2", img: F2, title: "TMT Steel (Fe 500)", price: "₹56 / kg", points: ["High Tensile", "Corrosion Resistant", "ISI Certified"] },
  { id: "f3", img: F3, title: "AAC Blocks", price: "₹42 / block", points: ["Lightweight", "Thermal Insulation", "Fire Resistant"] },
  { id: "f4", img: F4, title: "M-Sand (Manufactured Sand)", price: "₹2,600 / ton", points: ["Consistent Quality", "Less Impurities"] },
];

export default function Construction() {
  const nav = useNavigation<any>();

  /* ---------------- menu animation (same as Landing) ---------------- */
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
        {/* Header */}
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
            <Animated.View style={[styles.overlay, { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }) }]} />
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

        {/* Hero */}
        <ImageBackground source={HERO} style={styles.hero}>
          <View style={styles.overlayHero} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Quality Building Materials at Best Prices</Text>
            <Text style={styles.heroSubtitle}>Browse our comprehensive range of construction materials.</Text>

            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <TouchableOpacity style={styles.browseBtn}><Text style={styles.browseBtnText}>Browse Catalog</Text></TouchableOpacity>
              <TouchableOpacity style={styles.quoteBtn}><Text style={styles.quoteBtnText}>Get Bulk Quote</Text></TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Narrow center column like website */}
        <View style={styles.centerColumn}>
          {/* Product Categories grid (cards) */}
          <Text style={styles.sectionTitle}>Product Categories</Text>

          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((c) => (
              <View key={c.id} style={styles.catCard}>
                <Image source={c.img} style={styles.catImg} />
                <View style={styles.catBody}>
                  <Text style={styles.catTitle}>{c.title}</Text>
                  <View style={styles.catBullets}>
                    {c.bullets.map((b, i) => (
                      <Text key={i} style={styles.catBullet}>• {b}</Text>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.catBtn}><Text style={styles.catBtnText}>Browse</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Our Services boxes */}
          <View style={{ height: 28 }} />
          <View style={styles.servicesRow}>
            {SERVICES.map((s) => (
              <View key={s.id} style={styles.serviceBox}>
                <Text style={styles.serviceTitle}>{s.title}</Text>
                <Text style={styles.serviceText}>{s.text}</Text>
              </View>
            ))}
          </View>

          {/* Featured Products */}
          <View style={{ height: 28 }} />
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Featured Products</Text>

          <View style={styles.featuredRow}>
            {FEATURED.map((p) => (
              <View key={p.id} style={styles.featureCard}>
                <Image source={p.img} style={styles.featureImg} />
                <View style={{ padding: 10 }}>
                  <Text style={styles.featureTitle}>{p.title}</Text>
                  <Text style={styles.featurePrice}>{p.price}</Text>
                  <View style={{ marginTop: 8 }}>
                    {p.points.map((pt, i) => <Text key={i} style={styles.featurePoint}>• {pt}</Text>)}
                  </View>
                  <TouchableOpacity style={styles.requestBtn}><Text style={styles.requestBtnText}>Request Quote</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer (simple reuse) */}
        <Footer />
        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* Footer component */
function Footer() {
  return (
    <View style={footerStyles.footerWrap}>
      <View style={footerStyles.inner}>
        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>About Us</Text>
          <Text style={footerStyles.colText}>
            Your trusted partner for all home and property-related services. Quality,
            reliability, and customer satisfaction guaranteed.
          </Text>
        </View>

        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>Services</Text>
          <View style={footerStyles.list}>
            <Text style={footerStyles.listItem}>• Cleaning Service</Text>
            <Text style={footerStyles.listItem}>• Packers & Movers</Text>
            <Text style={footerStyles.listItem}>• Home Services</Text>
            <Text style={footerStyles.listItem}>• Rentals</Text>
            <Text style={footerStyles.listItem}>• Commercial Plots</Text>
            <Text style={footerStyles.listItem}>• Construction Materials</Text>
          </View>
        </View>

        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>Quick Links</Text>
          <View style={footerStyles.list}>
            <Text style={footerStyles.listItem}>• Home</Text>
            <Text style={footerStyles.listItem}>• About</Text>
            <Text style={footerStyles.listItem}>• Contact</Text>
            <Text style={footerStyles.listItem}>• Careers</Text>
          </View>
        </View>

        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>Contact Info</Text>
          <Text style={footerStyles.colText}>📞 +1 (555) 123-4567</Text>
          <Text style={footerStyles.colText}>✉️ info@homeservices.com</Text>
          <Text style={footerStyles.colText}>📍 123 Service Street, City, State</Text>
        </View>
      </View>

      <View style={footerStyles.divider} />
      <View style={footerStyles.copyWrap}>
        <Text style={footerStyles.copy}>© {new Date().getFullYear()} Home Services. All rights reserved.</Text>
      </View>
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */
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
  hamburgerIcon: { fontSize: 22, color: "#111" },
  brandWrap: { flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  logo: { width: 36, height: 36, marginRight: 8 },
  brand: { fontSize: 16, fontWeight: "700", color: "#111" },
  headerBtn: { backgroundColor: "#d93025", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
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

  hero: { width: "100%", height: Math.round(SCREEN_H * 0.28), justifyContent: "center", alignItems: "center" },
  overlayHero: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,12,20,0.45)" },
  heroContent: { paddingHorizontal: 28, alignItems: "center" },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "900", textAlign: "center" },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 14, textAlign: "center", marginTop: 8 },
  browseBtn: { backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginRight: 12 },
  browseBtnText: { fontWeight: "800" },
  quoteBtn: { backgroundColor: "#ffd400", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  quoteBtnText: { fontWeight: "800" },

  centerColumn: { width: Math.min(960, SCREEN_W - 80), alignSelf: "center", paddingHorizontal: 12, marginTop: 18, marginBottom: 28, alignItems: "center" },

  sectionTitle: { fontSize: 12, fontWeight: "700", color: "#222", marginBottom: 12, textAlign: "center" },

  /* categories grid: small card style like website */
  categoriesGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  catCard: {
    width: "30%", // makes 3-per-row in wide screens; adjust as you like
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#efefef",
    alignSelf: "center",
    elevation: 2,
  },
  catImg: { width: "100%", height: 80, resizeMode: "cover" },
  catBody: { padding: 10 },
  catTitle: { fontSize: 12, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  catBullets: { alignItems: "flex-start", marginBottom: 10 },
  catBullet: { fontSize: 10, color: "#6b6b6b", lineHeight: 16 },
  catBtn: { backgroundColor: "#ffd400", paddingVertical: 8, borderRadius: 6, marginTop: 6, alignItems: "center" },
  catBtnText: { fontWeight: "800", fontSize: 12 },

  /* services row */
  servicesRow: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  serviceBox: { width: "23%", backgroundColor: "#fff", padding: 12, borderRadius: 6, borderWidth: 1, borderColor: "#eee", alignItems: "center", elevation: 1 },
  serviceTitle: { fontSize: 12, fontWeight: "800", marginBottom: 6, textAlign: "center" },
  serviceText: { fontSize: 10, color: "#6b6b6b", textAlign: "center" },

  /* featured products */
  featuredRow: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  featureCard: { width: "23%", backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#f0f0f0", elevation: 2 },
  featureImg: { width: "100%", height: 110, resizeMode: "cover" },
  featureTitle: { fontSize: 12, fontWeight: "800" },
  featurePrice: { fontSize: 11, color: "#4a4a4a", marginTop: 4 },
  featurePoint: { fontSize: 10, color: "#6b6b6b" },
  requestBtn: { marginTop: 10, backgroundColor: "#ffdede", paddingVertical: 8, borderRadius: 6, alignItems: "center" },
  requestBtnText: { fontWeight: "700", fontSize: 12 },
});

/* footer styles */
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
  list: { marginTop: 6 },
  listItem: { color: "#cfdbe6", fontSize: 13, marginBottom: 6 },
  icon: { color: "#cfdbe6", fontSize: 18, marginRight: 8 },
  divider: { height: 1, backgroundColor: "#274358", marginTop: 12, marginBottom: 12, opacity: 0.45 },
  copyWrap: { alignItems: "center", paddingTop: 8 },
  copy: { color: "#cfdbe6", fontSize: 13 },
});
