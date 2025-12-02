// src/screens/Cleaning.tsx
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
  Animated,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// assets (ensure these exist)
const LOGO = require("../../assets/swachlogo.png");
const CLEAN_BG = require("../../assets/cleanhead.jpg");

const MENU_ITEMS = [
  { id: "home", label: "Home", route: "Landing" },
  { id: "cleaning", label: "Cleaning", route: "Cleaning" },
  { id: "packers", label: "Packers & Movers", route: "Landing" },
  { id: "homeServices", label: "Home Services", route: "Landing" },
  { id: "rentals", label: "Rentals", route: "Landing" },
  { id: "buySale", label: "Buy&Sale Properties", route: "Landing" },
  { id: "materials", label: "Construction Materials", route: "Landing" },
  { id: "freelancer", label: "Freelancer", route: "Landing" },
];

const CLEAN_SERVICES = [
  { id: "res", title: "Residential Cleaning", copy: "Homes, apartments, and condos" },
  { id: "office", title: "Office Cleaning", copy: "Commercial spaces and offices" },
  { id: "move", title: "Move In/Out Cleaning", copy: "Deep cleaning for relocations" },
  { id: "maint", title: "Regular Maintenance", copy: "Weekly, bi-weekly, or monthly" },
  { id: "kitchen", title: "Kitchen & Bathroom", copy: "Sanitization & deep scrubbing" },
  { id: "sofa", title: "Sofa & Upholstery", copy: "Shampoo and stain removal" },
  { id: "carpet", title: "Carpet Cleaning", copy: "Foam wash & extraction" },
  { id: "post", title: "Post-Construction", copy: "Debris removal & polish" },
];

const INCLUDED = [
  { id: "i1", title: "Deep cleaning of all rooms" },
  { id: "i2", title: "Kitchen and bathroom sanitization" },
  { id: "i3", title: "Window and glass cleaning" },
  { id: "i4", title: "Floor mopping and vacuuming" },
  { id: "i5", title: "Dusting and surface cleaning" },
  { id: "i6", title: "Eco-friendly cleaning products" },
  { id: "i7", title: "Trained and verified staff" },
  { id: "i8", title: "Flexible scheduling" },
];

const PRICING = [
  { id: "basic", title: "Basic Clean", price: "₹2,499", note: "2–3 hours", bullets: ["General cleaning", "Dusting & vacuuming", "Kitchen cleaning"] },
  { id: "deep", title: "Deep Clean", price: "₹4,499", note: "4–6 hours", bullets: ["Everything in Basic", "Inside appliances", "Window cleaning"], popular: true },
  { id: "premium", title: "Premium Clean", price: "₹7,999", note: "Full day", bullets: ["Everything in Deep", "Oven deep clean", "Refrigerator cleaning"] },
];

export default function Cleaning(): React.ReactElement {
  const nav = useNavigation<any>();

  // menu state + animation (copied behavior from Landing)
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  // panel width (78% of screen)
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

  // translate from -panelWidth -> 0 (left anchored)
  const panelTranslateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] });

  const onPressMenu = (route?: string) => {
    closeMenu();
    if (route) {
      setTimeout(() => {
        if (route === "Cleaning") return; // already here
        nav.navigate(route);
      }, 260);
    }
  };

  // Booking form state (simple local)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // responsive columns
  const SERVICES_COLS = SCREEN_W > 900 ? 4 : 2;
  const INCLUDED_COLS = SCREEN_W > 900 ? 4 : 2;
  const H_GUTTER = 20;
  const ITEM_MARGIN = 14;
  const serviceItemWidth = Math.floor(
    (SCREEN_W - H_GUTTER * 2 - ITEM_MARGIN * (SERVICES_COLS - 1)) / SERVICES_COLS
  );
  const includedItemWidth = Math.floor(
    (SCREEN_W - H_GUTTER * 2 - ITEM_MARGIN * (INCLUDED_COLS - 1)) / INCLUDED_COLS
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header (same as Landing) */}
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

        {/* Left slide panel + overlay (render only when isOpen) */}
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
              style={[
                styles.leftPanelWrap,
                { transform: [{ translateX: panelTranslateX }], width: panelWidth },
              ]}
            >
              <View style={[styles.panelInner, { width: panelWidth }]}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Menu</Text>
                  <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.menuItems}>
                  {MENU_ITEMS.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={styles.menuItem}
                      onPress={() => onPressMenu(m.route)}
                      activeOpacity={0.75}
                    >
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

        {/* HERO */}
        <ImageBackground source={CLEAN_BG} style={styles.hero} imageStyle={{ resizeMode: "cover" }}>
          <View style={styles.overlayHero} />
          <View style={styles.heroContent}>
            <Text style={styles.tag}>✧ Professional Cleaning Service</Text>

            <Text style={styles.heroTitle}>Sparkling Clean Homes {"\n"}& Offices</Text>

            <Text style={styles.heroSubtitle}>
              Experience the difference with our professional cleaning services. We bring cleanliness,
              hygiene, and peace of mind to your space.
            </Text>

            <View style={styles.heroBtnsRow}>
              <TouchableOpacity style={styles.heroBtnPrimary} onPress={() => nav.navigate("Signup")}>
                <Text style={styles.heroBtnPrimaryText}>Book Now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.heroBtnSecondary} onPress={() => nav.navigate("Signup")}>
                <Text style={styles.heroBtnSecondaryText}>Get Quote</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* OUR CLEANING SERVICES */}
        <View style={[styles.servicesSectionContainer, { paddingHorizontal: H_GUTTER }]}>
          <Text style={styles.servicesHeading}>Our Cleaning Services</Text>
          <Text style={styles.servicesSub}>Comprehensive solutions for all your home and property needs</Text>

          <FlatList
            data={CLEAN_SERVICES}
            keyExtractor={(item) => item.id}
            numColumns={SERVICES_COLS}
            columnWrapperStyle={SERVICES_COLS > 1 ? { justifyContent: "space-between", marginBottom: ITEM_MARGIN } : undefined}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.serviceCard, { width: serviceItemWidth }]}
                onPress={() => nav.navigate("Signup")}
              >
                <View style={styles.serviceImagePlaceholder}>
                  <Text style={styles.serviceImageIcon}>🧽</Text>
                </View>

                <View style={styles.serviceCardBody}>
                  <Text style={styles.serviceCardTitle}>{item.title}</Text>
                  <Text style={styles.serviceCardCopy}>{item.copy}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* PRICING PACKAGES */}
        <View style={[styles.pricingWrap, { paddingHorizontal: H_GUTTER }]}>
          <Text style={styles.pricingHeading}>Pricing Packages</Text>
          <Text style={styles.pricingSub}>Choose the package that best fits your needs</Text>

          <View style={styles.pricingRow}>
            {PRICING.map((p) => (
              <View key={p.id} style={[styles.pricingCard, p.popular ? styles.pricingCardPopular : null]}>
                {p.popular && <View style={styles.popularBadge}><Text style={styles.popularBadgeText}>Most Popular</Text></View>}
                <Text style={styles.pricingTitle}>{p.title}</Text>
                <Text style={styles.pricingPrice}>{p.price}</Text>
                <Text style={styles.pricingNote}>{p.note}</Text>
                <View style={{ marginTop: 8 }}>
                  {p.bullets.map((b, idx) => (
                    <View key={idx} style={styles.pricingBulletRow}>
                      <Text style={styles.pricingBullet}>✓</Text>
                      <Text style={styles.pricingBulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={[styles.selectPkgBtn, p.popular ? styles.selectPkgBtnPopular : null]}>
                  <Text style={[styles.selectPkgBtnText, p.popular ? { color: "#fff" } : {}]}>Select Package</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* BOOK YOUR CLEANING SERVICE (simple form) */}
        <View style={[styles.bookingWrap, { paddingHorizontal: H_GUTTER }]}>
          <Text style={styles.pricingHeading}>Book Your Cleaning Service</Text>
          <Text style={styles.pricingSub}>Fill out the form below and we'll get back to you within 24 hours</Text>

          <View style={styles.bookingForm}>
            <View style={styles.row2}>
              <TextInput placeholder="Full name" value={fullName} onChangeText={setFullName} style={styles.input} />
              <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
            </View>

            <View style={styles.row2}>
              <TextInput placeholder="Phone number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
              <TextInput placeholder="Service type" value={serviceType} onChangeText={setServiceType} style={styles.input} />
            </View>

            <TextInput placeholder="Service address" value={address} onChangeText={setAddress} style={[styles.input, { marginBottom: 10 }]} />

            <View style={styles.row2}>
              <TextInput placeholder="Preferred date" value={date} onChangeText={setDate} style={styles.input} />
              <TextInput placeholder="Preferred time" value={time} onChangeText={setTime} style={styles.input} />
            </View>

            <TextInput
              placeholder="Additional details"
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn} onPress={() => { /* handle submit */ }}>
              <Text style={styles.submitBtnText}>Submit Booking Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WHAT'S INCLUDED */}
        <View style={[styles.includedSection, { paddingHorizontal: H_GUTTER }]}>
          <Text style={styles.includedHeading}>What's Included</Text>
          <Text style={styles.includedSub}>Our comprehensive cleaning service covers every corner of your space</Text>

          <FlatList
            data={INCLUDED}
            keyExtractor={(i) => i.id}
            numColumns={INCLUDED_COLS}
            columnWrapperStyle={INCLUDED_COLS > 1 ? { justifyContent: "space-between", marginBottom: ITEM_MARGIN } : undefined}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[styles.includedCard, { width: includedItemWidth }]}>
                <View style={styles.includedLeft}>
                  <View style={styles.checkWrap}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                </View>
                <View style={styles.includedRight}>
                  <Text style={styles.includedTitle}>{item.title}</Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* WHY CHOOSE OUR CLEANING SERVICE */}
        <View style={[styles.whyWrap, { paddingHorizontal: H_GUTTER }]}>
          <Text style={styles.pricingHeading}>Why Choose Our Cleaning Service</Text>
          <Text style={styles.pricingSub}>We focus on quality, trust and speed — built to make your life easier.</Text>

          <View style={styles.whyRow}>
            <View style={styles.whyCard}>
              <Text style={styles.whyIcon}>🛡️</Text>
              <Text style={styles.whyCardTitle}>Insured & Bonded</Text>
              <Text style={styles.whyCardCopy}>All our staff are fully insured and background checked.</Text>
            </View>

            <View style={styles.whyCard}>
              <Text style={styles.whyIcon}>⭐</Text>
              <Text style={styles.whyCardTitle}>Satisfaction Guarantee</Text>
              <Text style={styles.whyCardCopy}>Not happy with the results? We'll re-clean for free within 24 hours.</Text>
            </View>

            <View style={styles.whyCard}>
              <Text style={styles.whyIcon}>💸</Text>
              <Text style={styles.whyCardTitle}>Transparent Pricing</Text>
              <Text style={styles.whyCardCopy}>No hidden fees or surprise charges. What you see is what you pay.</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 18 }} />

        {/* Footer */}
        <Footer />

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* Footer component (same as Landing) */
function Footer(): React.ReactElement {
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
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Text style={footerStyles.icon}>🌐</Text>
            <Text style={footerStyles.icon}>🔗</Text>
            <Text style={footerStyles.icon}>📸</Text>
          </View>
        </View>
      </View>

      <View style={footerStyles.divider} />
      <View style={footerStyles.copyWrap}>
        <Text style={footerStyles.copy}>© {new Date().getFullYear()} Home Services. All rights reserved.</Text>
      </View>
    </View>
  );
}

/* ---------------- styles ---------------- */
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

  /* left-anchored panel wrapper */
  leftPanelWrap: { position: "absolute", top: 0, bottom: 0, left: 0, zIndex: 60, alignItems: "flex-start" },
  panelInner: {
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
  hero: { width: "100%", height: Math.round(SCREEN_H * 0.55), justifyContent: "center", alignItems: "center" },
  overlayHero: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,12,20,0.45)" },
  heroContent: { paddingHorizontal: 28, alignItems: "flex-start", maxWidth: 1100 },
  tag: { color: "#e0eaff", fontSize: 14, marginBottom: 10 },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "900", lineHeight: 34 },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 15, marginTop: 12, marginBottom: 18, maxWidth: 900 },
  heroBtnsRow: { flexDirection: "row", alignItems: "center" },
  heroBtnPrimary: { backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 26, marginRight: 12 },
  heroBtnPrimaryText: { color: "#071026", fontWeight: "800" },
  heroBtnSecondary: { backgroundColor: "#2b78f7", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 26 },
  heroBtnSecondaryText: { color: "#fff", fontWeight: "800" },

  /* services */
  servicesSectionContainer: { width: "100%", paddingTop: 26, paddingBottom: 6, alignItems: "center" },
  servicesHeading: { fontSize: 22, fontWeight: "800", marginBottom: 6, color: "#071026" },
  servicesSub: { color: "#9aa6ae", marginBottom: 12 },

  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  serviceImagePlaceholder: {
    height: 100,
    backgroundColor: "#f3f6f7",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceImageIcon: { fontSize: 32 },
  serviceCardBody: { padding: 12 },
  serviceCardTitle: { fontWeight: "800", marginBottom: 6, color: "#071026" },
  serviceCardCopy: { color: "#9aa6ae", fontSize: 13 },

  /* pricing */
  pricingWrap: { width: "100%", paddingTop: 22, paddingBottom: 8, alignItems: "center" },
  pricingHeading: { fontSize: 20, fontWeight: "800", color: "#071026", marginBottom: 6 },
  pricingSub: { color: "#9aa6ae", marginBottom: 12 },
  pricingRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingHorizontal: 12 },
  pricingCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  pricingCardPopular: { borderWidth: 2, borderColor: "#2b78f7", transform: [{ translateY: -6 }] },
  popularBadge: { position: "absolute", top: 8, left: 8, backgroundColor: "#2b78f7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  popularBadgeText: { color: "#fff", fontWeight: "700", fontSize: 10 },
  pricingTitle: { fontWeight: "800", marginTop: 24 },
  pricingPrice: { fontSize: 20, fontWeight: "900", marginTop: 6 },
  pricingNote: { color: "#6b7280", marginBottom: 8 },
  pricingBulletRow: { flexDirection: "row", alignItems: "center", marginBottom: 4, alignSelf: "flex-start" },
  pricingBullet: { marginRight: 8, color: "#0f9d58" },
  pricingBulletText: { color: "#6b7280" },
  selectPkgBtn: { marginTop: 10, backgroundColor: "#e9f7ee", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  selectPkgBtnPopular: { backgroundColor: "#d93025" },
  selectPkgBtnText: { color: "#071026", fontWeight: "800" },

  /* booking form */
  bookingWrap: { width: "100%", paddingTop: 22, paddingBottom: 6, alignItems: "center" },
  bookingForm: {
    width: "100%",
    maxWidth: 920,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  row2: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f3f5f6",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  submitBtn: { backgroundColor: "#071026", paddingVertical: 12, borderRadius: 8, marginTop: 6, alignItems: "center" },
  submitBtnText: { color: "#fff", fontWeight: "800" },

  /* included */
  includedSection: { width: "100%", paddingTop: 28, paddingBottom: 8, alignItems: "center" },
  includedHeading: { fontSize: 20, fontWeight: "800", color: "#071026", marginBottom: 6 },
  includedSub: { color: "#9aa6ae", marginBottom: 16, textAlign: "center", maxWidth: 820 },

  includedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  includedLeft: { width: 44, alignItems: "center", justifyContent: "center" },
  checkWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#e9f7ee",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { color: "#0f9d58", fontWeight: "800" },
  includedRight: { flex: 1, paddingLeft: 10 },
  includedTitle: { fontWeight: "700", color: "#071026", fontSize: 14 },

  /* why choose */
  whyWrap: { width: "100%", paddingTop: 28, paddingBottom: 12, alignItems: "center" },
  whyRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  whyCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: "#f1f8ff",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  whyIcon: { fontSize: 28, marginBottom: 8 },
  whyCardTitle: { fontWeight: "800", marginBottom: 6, color: "#071026" },
  whyCardCopy: { color: "#6b7280", textAlign: "center" },
});

/* footer styles (copied from landing) */
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
 