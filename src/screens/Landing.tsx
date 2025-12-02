// src/screens/Landing.tsx
import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// update these paths if your files live elsewhere
const HERO = require('../../assets/hero.jpg');
const LOGO = require('../../assets/swachlogo.png');

const SERVICES = [
  { id: 'clean', icon: '🏠', title: 'Cleaning Service', copy: 'Deep cleaning, regular maintenance and specialized services.' },
  { id: 'packers', icon: '🚚', title: 'Packers & Movers', copy: 'Local & long-distance moves with packing solutions.' },
  { id: 'home', icon: '🔧', title: 'Home Services', copy: 'Plumbing, electrical, carpentry and home maintenance.' },
  { id: 'rental', icon: '🏘️', title: 'Home & Apartments Rental', copy: 'Apartments, houses and furnished options.' },
  { id: 'commercial', icon: '🏢', title: 'Commercial Plots', copy: 'Premium commercial plots and investment opportunities.' },
  { id: 'construction', icon: '🧱', title: 'Construction Raw Materials', copy: 'Cement, bricks and building materials at competitive prices.' },
];

const WHY = [
  { id: 'pro', icon: '🔧', title: 'Skilled Professionals', copy: 'Verified, trained technicians who deliver quality workmanship every time.' },
  { id: 'local', icon: '🏡', title: 'Trusted & Local', copy: 'Local teams who know your area and are committed to timely service.' },
  { id: 'price', icon: '💸', title: 'Transparent Pricing', copy: 'Clear quotes with no hidden fees — affordable packages for every need.' },
  { id: 'ins', icon: '🛡️', title: 'Licensed & Insured', copy: 'Professional services backed by proper licensing and insurance.' },
  { id: 'guar', icon: '⭐', title: 'Satisfaction Guarantee', copy: "We stand behind our work — if you're not happy, we'll make it right." },
  { id: 'sup', icon: '📞', title: '24/7 Support', copy: 'Emergency response and customer support available round the clock.' },
];

const MENU_ITEMS = [
  { id: 'home', label: 'Home', route: 'Landing' },
  { id: 'cleaning', label: 'Cleaning', route: 'Cleaning' },
  { id: 'packers', label: 'Packers & Movers', route: 'Landing' },
  { id: 'homeServices', label: 'Home Services', route: 'Landing' },
  { id: 'rentals', label: 'Rentals', route: 'Landing' },
  { id: 'buySale', label: 'Buy&Sale Properties', route: 'Landing' },
  { id: 'materials', label: 'Construction Materials', route: 'Landing' },
  { id: 'freelancer', label: 'Freelancer', route: 'Landing' },
];

export default function Landing(): React.ReactElement {
  const nav = useNavigation<any>();

  // header menu state + animation
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

// PANEL WIDTH (78% of screen)
const panelWidth = Math.round(SCREEN_W * 0.78);

// OPEN MENU (slide in from the LEFT)
const openMenu = () => {
  setIsOpen(true);
  anim.setValue(0);
  Animated.timing(anim, {
    toValue: 1,
    duration: 280,
    useNativeDriver: true,
  }).start();
};

// CLOSE MENU (slide out to the LEFT)
const closeMenu = () => {
  Animated.timing(anim, {
    toValue: 0,
    duration: 220,
    useNativeDriver: true,
  }).start(() => setIsOpen(false));
};

// LEFT-SIDE SLIDE ANIMATION: off-screen left (-panelWidth) -> 0
const panelTranslateX = anim.interpolate({
  inputRange: [0, 1],
  outputRange: [-panelWidth, 0],
});

  // content width & grid item width
  const contentWidth = Math.min(960, SCREEN_W - 64);
  const ITEM_HORIZONTAL_MARGIN = 10;
  const NUM_COLUMNS = 2;
  const itemWidth = Math.floor((contentWidth - ITEM_HORIZONTAL_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS);

  const onPressMenu = (route?: string) => {
    closeMenu();
    if (route) {
      // small delay so menu closing animation is visible
      setTimeout(() => nav.navigate(route), 260);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header (inline) - KEEP LAYOUT EXACTLY AS BEFORE */}
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={openMenu} style={styles.hamburgerBtn}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>

            <View style={styles.brandWrap}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.brand}>SWACHIFY INDIA</Text>
            </View>

            <TouchableOpacity style={styles.headerBtn} onPress={() => nav.navigate('Signup')}>
              <Text style={styles.headerBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Slide panel + overlay (render only when isOpen true) */}
        {isOpen && (
          <>
            <Animated.View
              style={[
                styles.overlay,
                { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }) },
              ]}
            />
            <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

            {/* RIGHT-anchored panel */}
            <Animated.View
  style={[
    styles.panelWrapLeft,
    { width: panelWidth, transform: [{ translateX: panelTranslateX }] },
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

                  <TouchableOpacity style={styles.menuSignup} onPress={() => onPressMenu('Signup')}>
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
            <Text style={styles.heroTitle}>Transform Your Home & Property{'\n'}Services</Text>
            <Text style={styles.heroSubtitle}>Your trusted solution for cleaning, moving, rentals, construction, and more.</Text>

            <TouchableOpacity style={styles.getStartedBtn} onPress={() => nav.navigate('Signup')}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Content column */}
        <View style={[styles.centerColumn, { width: contentWidth }]}>
          {/* Services grid */}
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitleSmall}>Our Services</Text>
            <Text style={styles.sectionSubSmall}>Comprehensive solutions for all your home and property needs</Text>

            <FlatList
              data={SERVICES}
              keyExtractor={(item) => item.id}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.serviceCardGrid, { width: itemWidth }]}
                  activeOpacity={0.9}
                  onPress={() => nav.navigate('Signup')}
                >
                  <Text style={styles.serviceIcon}>{item.icon}</Text>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <Text style={styles.serviceCopy} numberOfLines={4}>{item.copy}</Text>
                  <Text style={styles.serviceLink}>Learn More →</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* WHY */}
          <View style={styles.whySection}>
            <Text style={styles.whyTitle}>Why Choose Our Service</Text>
            <Text style={styles.whySub}>We focus on quality, trust and speed — built to make your life easier.</Text>

            <View style={styles.whyGrid}>
              {WHY.map((w) => (
                <View key={w.id} style={styles.whyCard}>
                  <View style={styles.whyIconWrap}><Text style={styles.whyIcon}>{w.icon}</Text></View>
                  <View style={styles.whyTextWrap}>
                    <Text style={styles.whyCardTitle}>{w.title}</Text>
                    <Text style={styles.whyCardCopy}>{w.copy}</Text>
                  </View>
                </View>
              ))}
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

/* Footer component reused here */
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
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
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
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { alignItems: 'center', backgroundColor: '#fff' },

  headerContainer: { width: '100%', backgroundColor: '#fff', zIndex: 50 },
  headerInner: {
    height: 64,
    paddingTop: Platform.OS === 'android' ? 18 : 22,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hamburgerBtn: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  hamburgerIcon: { fontSize: 22, color: '#111' },
  brandWrap: { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  logo: { width: 36, height: 36, marginRight: 8 },
  brand: { fontSize: 16, fontWeight: '700', color: '#111' },
  headerBtn: { backgroundColor: '#d93025', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  headerBtnText: { color: '#fff', fontWeight: '700' },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000', zIndex: 55 },

  /* right-anchored panel wrapper */
panelWrapLeft: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,       // anchors the panel to the LEFT
  zIndex: 60,
  alignItems: 'flex-start',
},
  panelInner: {
    width: Math.round(SCREEN_W * 0.78),
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 54,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  panelTitle: { fontSize: 18, fontWeight: '800' },
  closeBtn: { padding: 6, borderRadius: 8 },
  closeText: { fontSize: 18 },
  menuItems: { marginTop: 8 },
  menuItem: { paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  menuItemText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  menuSignup: { marginTop: 18, backgroundColor: '#d93025', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  menuSignupText: { color: '#fff', fontWeight: '800' },
  panelFooter: { marginTop: 18, alignItems: 'center' },
  smallMuted: { color: '#77818a', fontSize: 12 },

  hero: { width: '100%', height: Math.round(SCREEN_H * 0.55), justifyContent: 'center', alignItems: 'center' },
  overlayHero: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,12,20,0.45)' },
  heroContent: { paddingHorizontal: 28, alignItems: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: '900', textAlign: 'center', lineHeight: 48 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginTop: 16, marginBottom: 18, maxWidth: 900 },
  getStartedBtn: { backgroundColor: '#d93025', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  getStartedText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  centerColumn: { alignSelf: 'center', paddingHorizontal: 12, marginTop: 28, marginBottom: 28 },

  servicesSection: { width: '100%', alignItems: 'center', marginBottom: 26 },
  sectionTitleSmall: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 6 },
  sectionSubSmall: { fontSize: 12, color: '#7f8b8b', marginBottom: 18, textAlign: 'center' },

  serviceCardGrid: {
    minHeight: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 4,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  serviceIcon: { fontSize: 26, marginBottom: 8 },
  serviceTitle: { fontSize: 14, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  serviceCopy: { fontSize: 12, color: '#6d7b81', textAlign: 'center' },
  serviceLink: { marginTop: 10, color: '#2b78f7', fontWeight: '700', fontSize: 12 },

  whySection: { width: '100%', marginTop: 18, alignItems: 'center' },
  whyTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 6 },
  whySub: { color: '#7f8b8a', fontSize: 13, marginBottom: 18, textAlign: 'center' },

  whyGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  whyCard: {
    width: SCREEN_W > 900 ? '48%' : '100%',
    maxWidth: 440,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  whyIconWrap: { width: 46, height: 46, borderRadius: 8, backgroundColor: '#f6fbff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  whyIcon: { fontSize: 20 },
  whyTextWrap: { flex: 1 },
  whyCardTitle: { fontWeight: '800', fontSize: 14, marginBottom: 6 },
  whyCardCopy: { color: '#6d7b81', fontSize: 13, lineHeight: 18 },
});

const footerStyles = StyleSheet.create({
  footerWrap: {
    width: '100%',
    backgroundColor: '#071026',
    paddingTop: 32,
    paddingBottom: 18,
    paddingHorizontal: 20,
    marginTop: 28,
  },
  inner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  col: { width: '48%', maxWidth: 320, marginBottom: 18 },
  colTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  colText: { color: '#cfdbe6', fontSize: 13, lineHeight: 20 },
  list: { marginTop: 6 },
  listItem: { color: '#cfdbe6', fontSize: 13, marginBottom: 6 },
  icon: { color: '#cfdbe6', fontSize: 18, marginRight: 8 },
  divider: { height: 1, backgroundColor: '#274358', marginTop: 12, marginBottom: 12, opacity: 0.45 },
  copyWrap: { alignItems: 'center', paddingTop: 8 },
  copy: { color: '#cfdbe6', fontSize: 13 },
});
