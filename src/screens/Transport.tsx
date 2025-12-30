import React, { useRef, useState } from "react";
import {
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
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Assets 
const LOGO = require("../../assets/swachlogo.png");
const TRANSPORT_IMG = require("../../assets/transport.jpg");

// example small cards (update to your actual assets)
const T1 = require("../../assets/pack1.jpg");
const T2 = require("../../assets/pack2.jpg");
const T3 = require("../../assets/pack3.jpg");
const T4 = require("../../assets/pack4.jpeg");
const PM1 = require("../../assets/pack5.jpg");
const PM2 = require("../../assets/pack6.jpg");
const PM3 = require("../../assets/pack7.jpg");

// Data (from your second file)
const serviceData = [
  { title: "Packing Services", image: T1 },
  { title: "Loading Transport", image: T2 },
  { title: "Local And Long-Distance", image: T3 },
  { title: "Insurance Coverage", image: T4 },
];

const transportCategories = [
  { key: "passenger", title: "Passenger Transport", desc: "Reliable taxi, cab, shuttle, and transfer services", image: T1 },
  { key: "logistics", title: "Logistics & Cargo", desc: "Complete goods delivery and cargo forwarding solutions", image: T2 },
  { key: "rental", title: "Rental Services", desc: "Car, truck, and van rentals for all your needs", image: T3 },
  { key: "specialized", title: "Specialized Transport", desc: "Temperature-controlled and hazardous material handling", image: T4 },
];

const passengerTransportDetails = [
  { id: "taxi", title: "Local Taxi", description: "Short trips within city", price: "₹500", image: PM1 },
  { id: "carpooling", title: "Carpooling", description: "Shared ride options", price: "₹300", image: PM2 },
  { id: "shuttle", title: "Shuttle Service", description: "Group & airport shuttles", price: "₹1200", image: PM3 },
];

const rentalServicesDetails = [
  { id: "car_rental", title: "Car Rentals", description: "Self-drive or chauffeur", price: "₹2500/day", image: T1 },
  { id: "truck_rental", title: "Van/Truck Rentals", description: "Small to medium truck options", price: "₹4500/day", image: T2 },
];

const logisticsAndCargoDetails = [
  { id: "goods_delivery", title: "Goods Delivery", description: "Local goods pickup & delivery", price: "₹1500", image: T1 },
  { id: "intercity_transport", title: "Intercity Transport", description: "Long-distance load transport", price: "₹9000", image: T2 },
  { id: "cargo_forwarding", title: "Cargo Forwarding", description: "Freight forwarding support", price: "₹15000", image: T3 },
];

const specializedTransportDetails = [
  { id: "temp_truck", title: "Temperature Controlled Truck", description: "Refrigerated transport", price: "₹12,000", image: T4 },
  { id: "hazardous_handling", title: "Hazardous Handling", description: "Certified hazardous goods handling", price: "₹20,000", image: T1 },
];

// -----------------------
// Layout constants
// -----------------------
const CARD_MARGIN = 10;
const CONTAINER_PADDING = 20;
const CARD_SIZE = (SCREEN_W - CONTAINER_PADDING * 2 - CARD_MARGIN * 3) / 4;
const DETAIL_CARD_WIDTH = (SCREEN_W - CONTAINER_PADDING * 2 - CARD_MARGIN * 2 * 3) / 3;

// -----------------------
// Menu items (kept from original)
// -----------------------
const MENU_ITEMS = [
  { id: "home", label: "Home", route: "Landing" },
  { id: "Transport", label: "Transport", route: "Transport" },
  { id: "Construction", label: "Raw Materials", route: "Construction" },
  { id: "Cleaning", label: "Cleaning & Home Service", route: "Cleaning" },
  { id: "rentals", label: "Buy/Sale/Rentals", route: "Rentals" },
  { id: "freelancer", label: "Freelancer", route: "Freelancer" },
  { id: "Education", label: "Education Services", route: "Education" },
  { id: "Products", label: "Swachify Products", route: "Products" },
];

// -----------------------
// Footer (kept same)
// -----------------------
function Footer(): React.ReactElement {
  return (
    <View style={footerStyles.footerWrap}>
      <View style={footerStyles.inner}>
        <View style={footerStyles.col}>
          <Text style={footerStyles.colTitle}>About Us</Text>
          <Text style={footerStyles.colText}>
            Your trusted partner for relocation and transport services. Quality, reliability and convenience.
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

// -----------------------
// ServiceCardSection
// -----------------------
const ServiceCardSection: React.FC = () => {
  return (
    <View style={serviceStyles.container}>
      <Text style={serviceStyles.headerTitle}>Our Services</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={serviceStyles.cardGrid}>
        {serviceData.map((item, index) => (
          <TouchableOpacity key={index} style={serviceStyles.cardWrapper} activeOpacity={0.85}>
            <View style={serviceStyles.imageContainer}>
              <Image source={item.image} style={serviceStyles.cardImage} />
            </View>
            <Text style={serviceStyles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// -----------------------
// Detail components
// -----------------------
const PassengerTransportDetails: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <View style={detailStyles.container}>
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={detailStyles.header}>
        <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
          <Text style={detailStyles.backButtonText}>{"< Back"}</Text>
        </TouchableOpacity>
        <Text style={detailStyles.headerTitle}>Passenger Transport</Text>
      </View>

      <View style={detailStyles.cardGrid}>
        {passengerTransportDetails.map((item) => (
          <View key={item.id} style={detailStyles.card}>
            <Image source={item.image} style={detailStyles.cardImage} />
            <View style={detailStyles.cardContent}>
              <Text style={detailStyles.cardTitle}>{item.title}</Text>
              <Text style={detailStyles.cardDescription}>{item.description}</Text>
              <Text style={detailStyles.cardPrice}>{item.price}</Text>
              <TouchableOpacity style={detailStyles.bookButton}>
                <Text style={detailStyles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

const LogisticsAndCargoDetails: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <View style={detailStyles.container}>
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={detailStyles.header}>
        <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
          <Text style={detailStyles.backButtonText}>{"< Back"}</Text>
        </TouchableOpacity>
        <Text style={detailStyles.headerTitle}>Logistics & Cargo</Text>
      </View>

      <View style={detailStyles.cardGrid}>
        {logisticsAndCargoDetails.map((item) => (
          <View key={item.id} style={detailStyles.card}>
            <Image source={item.image} style={detailStyles.cardImage} />
            <View style={detailStyles.cardContent}>
              <Text style={detailStyles.cardTitle}>{item.title}</Text>
              <Text style={detailStyles.cardDescription}>{item.description}</Text>
              <Text style={detailStyles.cardPrice}>{item.price}</Text>
              <TouchableOpacity style={detailStyles.bookButton}>
                <Text style={detailStyles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

const RentalServicesDetails: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <View style={detailStyles.container}>
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={detailStyles.header}>
        <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
          <Text style={detailStyles.backButtonText}>{"< Back"}</Text>
        </TouchableOpacity>
        <Text style={detailStyles.headerTitle}>Rental Services</Text>
      </View>

      <View style={detailStyles.cardGrid}>
        {rentalServicesDetails.map((item) => (
          <View key={item.id} style={detailStyles.card}>
            <Image source={item.image} style={detailStyles.cardImage} />
            <View style={detailStyles.cardContent}>
              <Text style={detailStyles.cardTitle}>{item.title}</Text>
              <Text style={detailStyles.cardDescription}>{item.description}</Text>
              <Text style={detailStyles.cardPrice}>{item.price}</Text>
              <TouchableOpacity style={detailStyles.bookButton}>
                <Text style={detailStyles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView> 
  </View>
);

const SpecializedTransportDetails: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const cardWidth = SCREEN_W / 2;
  return (
    <View style={detailStyles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={detailStyles.header}>
          <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
            <Text style={detailStyles.backButtonText}>{"< Back"}</Text>
          </TouchableOpacity>
          <Text style={detailStyles.headerTitle}>Specialized Transport</Text>
        </View>

        <View style={[detailStyles.cardGrid, { justifyContent: "flex-start", paddingHorizontal: 0 }]}>
          {specializedTransportDetails.map((item) => (
            <View
              key={item.id}
              style={[detailStyles.card, { width: cardWidth, marginLeft: 0, marginRight: 0, borderRadius: 0 }]}
            >
              <Image source={item.image} style={detailStyles.cardImage} />
              <View style={detailStyles.cardContent}>
                <Text style={detailStyles.cardTitle}>{item.title}</Text>
                <Text style={detailStyles.cardDescription}>{item.description}</Text>
                <Text style={detailStyles.cardPrice}>{item.price}</Text>
                <TouchableOpacity style={detailStyles.bookButton}>
                  <Text style={detailStyles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Main Transport screen
export default function Transport(): React.ReactElement {
  const nav = useNavigation<any>();

  // header/menu animation
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const panelWidth = Math.round(SCREEN_W * 0.78);

  const openMenu = () => {
    setIsOpen(true);
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  };

  const closeMenu = () => {
    Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setIsOpen(false));
  };

  const panelTranslateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] });

  // modal + detail state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleViewDetails = (categoryKey: string) => setSelectedCategory(categoryKey);
  const closeModal = () => { setIsPopupVisible(false); setSelectedCategory(null); };
  const handleBackToCategories = () => setSelectedCategory(null);

  const renderDetailView = () => {
    switch (selectedCategory) {
      case "passenger": return <PassengerTransportDetails onBack={handleBackToCategories} />;
      case "logistics": return <LogisticsAndCargoDetails onBack={handleBackToCategories} />;
      case "rental": return <RentalServicesDetails onBack={handleBackToCategories} />;
      case "specialized": return <SpecializedTransportDetails onBack={handleBackToCategories} />;
      default:
        return (
          <View style={popupStyles.sheetContainer}>
            <View style={popupStyles.sheetHeader}>
              <Text style={popupStyles.sheetTitle}>Moving Services</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={popupStyles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {transportCategories.map((cat) => (
              <View key={cat.key} style={popupStyles.rowCard}>
                <Image source={cat.image} style={popupStyles.rowImage} />
                <View style={popupStyles.rowTextWrap}>
                  <Text style={popupStyles.rowTitle}>{cat.title}</Text>
                  <Text style={popupStyles.rowSubtitle}>{cat.desc}</Text>
                </View>
                <TouchableOpacity style={popupStyles.rowButton} onPress={() => handleViewDetails(cat.key)}>
                  <Text style={popupStyles.rowButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
    }
  };

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
                    <TouchableOpacity key={m.id} style={styles.menuItem} onPress={() => { closeMenu(); setTimeout(() => nav.navigate(m.route), 260); }} activeOpacity={0.75}>
                      <Text style={styles.menuItemText}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.menuSignup} onPress={() => { closeMenu(); setTimeout(() => nav.navigate("Signup"), 260); }}>
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
        <ImageBackground source={TRANSPORT_IMG} style={styles.hero}>
          <View style={styles.overlayHero} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>Stress-Free Relocation Services</Text>
            <Text style={styles.heroSubtitle}>From packing to delivery — we make your move effortless.</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.heroCTA, { marginRight: 8 }]} onPress={() => nav.navigate("Signup")}>
                <Text style={styles.heroCTAText}>Book Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.heroSecondary]} onPress={() => setIsPopupVisible(true)}>
                <Text style={styles.heroSecondaryText}>Explore Services</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Services */}
        <ServiceCardSection />

        {/* Footer */}
        <Footer />

        <View style={{ height: 40 }} />

        {/* Modal */}
        <Modal visible={isPopupVisible} animationType="slide" transparent onRequestClose={closeModal}>
          <View style={popupStyles.modalOverlay}>{renderDetailView()}</View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// -----------------------
// styles (kept from previous files, adjusted)
// -----------------------
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
  hero: { width: "100%", height: Math.round(SCREEN_H * 0.44), justifyContent: "center", alignItems: "center" },
  overlayHero: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,12,20,0.35)" },
  heroContent: { paddingHorizontal: 28, alignItems: "center" },
  heroTag: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 8 },
  heroSubtitle: { color: "rgba(255,255,255,0.95)", fontSize: 14, textAlign: "center", marginBottom: 14, maxWidth: 900 },
  heroCTA: { backgroundColor: "#d93025", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  heroCTAText: { color: "#fff", fontWeight: "800" },

  heroSecondary: { backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  heroSecondaryText: { color: "#fff", fontWeight: "700" },

  /* small helpers */
  btnRow: { flexDirection: "row", alignItems: "center", gap: 12 },
});

const detailStyles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 18, borderTopLeftRadius: 18, borderTopRightRadius: 18, maxHeight: SCREEN_H * 0.72 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { paddingRight: 15, paddingVertical: 5 },
  backButtonText: { fontSize: 16, color: "#000", fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#222" },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: CONTAINER_PADDING / 2 },
  card: {
    width: DETAIL_CARD_WIDTH,
    marginBottom: CARD_MARGIN * 2,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 100, resizeMode: "cover" },
  cardContent: { padding: 8, alignItems: "center" },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 4 },
  cardDescription: { fontSize: 10, color: "#666", textAlign: "center", marginBottom: 6, minHeight: 25 },
  cardPrice: { fontSize: 16, fontWeight: "800", color: "#000", marginBottom: 8 },
  bookButton: { backgroundColor: "#000", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, width: "90%", alignItems: "center" },
  bookButtonText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});

const serviceStyles = StyleSheet.create({
  container: { paddingVertical: 25, backgroundColor: "#fff" },
  headerTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 25, color: "#333" },
  cardGrid: { flexDirection: "row", paddingHorizontal: CONTAINER_PADDING, alignItems: "flex-start" },
  cardWrapper: { width: CARD_SIZE, marginRight: CARD_MARGIN, alignItems: "center" },
  imageContainer: { width: CARD_SIZE, height: CARD_SIZE, borderRadius: 12, backgroundColor: "#fff", marginBottom: 8, borderWidth: 1, borderColor: "#E0E0E0", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, overflow: "hidden" },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  cardTitle: { fontSize: 12, fontWeight: "600", textAlign: "center", color: "#333", maxHeight: 30 },
});

const popupStyles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheetContainer: { backgroundColor: "#fff", padding: 18, borderTopLeftRadius: 18, borderTopRightRadius: 18, maxHeight: "72%", elevation: 20 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sheetTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  closeBtn: { fontSize: 22, color: "#333", padding: 6 },

  rowCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFF", paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12, marginBottom: 12 },
  rowImage: { width: 56, height: 56, borderRadius: 10, marginRight: 12 },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  rowSubtitle: { fontSize: 12, color: "#666", marginTop: 4 },
  rowButton: { backgroundColor: "#000", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  rowButtonText: { color: "#fff", fontWeight: "700" },
});

const footerStyles = StyleSheet.create({
  footerWrap: { width: "100%", backgroundColor: "#071026", paddingTop: 28, paddingBottom: 18, paddingHorizontal: 20, marginTop: 28 },
  inner: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  col: { width: "48%", maxWidth: 320, marginBottom: 18 },
  colTitle: { color: "#fff", fontSize: 16, fontWeight: "800", marginBottom: 8 },
  colText: { color: "#cfdbe6", fontSize: 13, lineHeight: 20 },
  list: { marginTop: 6 },
  listItem: { color: "#cfdbe6", fontSize: 13, marginBottom: 6 },
  divider: { height: 1, backgroundColor: "#274358", marginTop: 12, marginBottom: 12, opacity: 0.45 },
  copyWrap: { alignItems: "center", paddingTop: 8 },
  copy: { color: "#cfdbe6", fontSize: 13 },
});
