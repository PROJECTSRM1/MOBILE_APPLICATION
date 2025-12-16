// src/screens/Freelancer.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

// Navigation Type (ServiceRequests accepts optional category param)
type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  ServiceRequests: { category?: string } | undefined;
  Splash: undefined;
  Onboarding: undefined;
  Freelancer: undefined;
};

type FreelancerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Freelancer"
>;

export default function Freelancer() {
  const navigation = useNavigation<FreelancerNavigationProp>();

  // CATEGORY DATA
  const categoryData = [
    { icon: "🏠", title: "Cleaning & Home Services", key: "cleaning" },
    { icon: "🚚", title: "Transport", key: "transport" },
    { icon: "🏢", title: "Buy / Sell", key: "buysell" }, 
    { icon: "🧱", title: "Raw Materials", key: "raw" },
    { icon: "📚", title: "Education", key: "education" },
    { icon: "🛍️", title: "Swachify Products", key: "products" },
  ];

  // STATIC REQUESTS PER CATEGORY (Option B) - used only to preview on Freelancer screen
  const requestsByCategory: Record<string, any[]> = {
    cleaning: [
      {
        badge: "Cleaning",
        badgeColor: "#fff4e5",
        title: "3BHK Deep Cleaning",
        desc: "Full house deep cleaning required.",
        location: "Gachibowli",
        time: "12 min ago",
        price: "₹1,800",
        imageSource: require("../assets/c1.jpg"),
      },
      {
        badge: "Urgent",
        badgeColor: "#ffe3e3",
        title: "Bathroom Cleaning",
        desc: "2 bathrooms require deep cleaning.",
        location: "Madhapur",
        time: "32 min ago",
        price: "₹700",
        imageSource: require("../assets/apartments.png"),
      },
    ],
    transport: [
      {
        badge: "Urgent",
        badgeColor: "#ffe3e3",
        title: "Truck Needed",
        desc: "Shift 1BHK furniture.",
        location: "Miyapur",
        time: "1 hr ago",
        price: "₹1,500",
        imageSource: require("../assets/Truck Rentals.jpg"),
      },
    ],
    buysell: [
      {
        badge: "Buy/Sell",
        badgeColor: "#e8ffe5",
        title: "Need Sofa Buyer",
        desc: "Good condition 5-seater sofa.",
        location: "Kukatpally",
        time: "20 min ago",
        price: "₹5,500",
        imageSource: require("../assets/c1.jpg"),
      },
    ],
    raw: [
      {
        badge: "Materials",
        badgeColor: "#e5f0ff",
        title: "Cement Bags Delivery",
        desc: "50 bags required.",
        location: "Ameerpet",
        time: "45 min ago",
        price: "₹9,000",
        imageSource: require("../assets/Truck Rentals.jpg"),
      },
    ],
    education: [
      {
        badge: "Education",
        badgeColor: "#e5e5ff",
        title: "Home Tutor Required",
        desc: "Maths tutor for class 10.",
        location: "Banjara Hills",
        time: "1 hr ago",
        price: "₹600/hr",
        imageSource: require("../assets/apartments.png"),
      },
    ],
    products: [
      {
        badge: "Swachify",
        badgeColor: "#f0e5ff",
        title: "Bulk Cleaning Products",
        desc: "Need 10L phenyl.",
        location: "Begumpet",
        time: "10 min ago",
        price: "₹1,200",
        imageSource: require("../assets/c1.jpg"),
      },
    ],
  };

  // UI state: selected category and local search for preview list on this screen
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    categoryData[0].key
  );
  const [searchText, setSearchText] = React.useState("");

  const previewList = (requestsByCategory[selectedCategory] || []).filter(
    (r) =>
      searchText.trim() === "" ||
      r.title.toLowerCase().includes(searchText.toLowerCase()) ||
      r.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <LinearGradient
      colors={["#2f80ed", "#9b51e0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <Text style={styles.headerTitle}>Swachify Freelancer</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.headerButtonText}>Login / Register</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Find the Right Tasks</Text>
          <Text style={styles.heroTitle}>That Match Your Skills</Text>
          <Text style={styles.heroSubtitle}>
            Verified jobs. Nearby opportunities. Instant earning.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={() => navigation.navigate("ServiceRequests")}
            >
              <Text style={styles.whiteButtonText}>▶ View Live Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.whiteButtonText}>Become a Freelancer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Active Tasks</Text>
              <Text style={styles.statValue}>2,456+</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Freelancers</Text>
              <Text style={styles.statValue}>10,000+</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Avg Rating</Text>
              <Text style={styles.statValue}>4.8</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Verified Jobs</Text>
              <Text style={styles.statValue}>100%</Text>
            </View>
          </View>
        </View>

        {/* Browse Categories */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContainer}
          >
            {categoryData.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={styles.categoryItem}
                  onPress={() => setSelectedCategory(cat.key)}
                >
                  <View
                    style={[
                      styles.categoryIconContainer,
                      active && { backgroundColor: "#000" },
                    ]}
                  >
                    <Text style={styles.categoryIconNew}>{cat.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.categoryTitleNew,
                      active && { color: "#000", fontWeight: "bold" },
                    ]}
                  >
                    {cat.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Search within preview list on this screen */}
        {/* <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${categoryData.find(c => c.key === selectedCategory)?.title} requests...`}
              placeholderTextColor="#777"
              value={searchText}
              onChangeText={setSearchText}
            />
            <Text style={styles.searchIconText}>🔍</Text>
          </View>
        </View> */}

        {/* Live Requests Preview for selected category */}
        <View style={styles.liveRequestsSection}>
          <View style={styles.liveRequestsHeader}>
            <View>
              <Text style={styles.liveRequestsTitle}>
                {categoryData.find((c) => c.key === selectedCategory)?.title} Requests
              </Text>
              <Text style={styles.liveRequestsSubtitle}>
                Accept a task and start earning instantly
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("ServiceRequests", { category: selectedCategory })}
            >
              <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.requestListContainer}>
            {previewList.map((req, i) => (
              <View style={styles.requestCard} key={i}>
                <Image source={req.imageSource} style={styles.imagePlaceholder} />

                <View style={styles.requestDetailsContainer}>
                  <View style={styles.requestHeaderRow}>
                    <Text style={styles.requestTitleNew}>{req.title}</Text>
                    <Text style={[styles.badgeNew, { backgroundColor: req.badgeColor }]}>{req.badge}</Text>
                  </View>

                  <Text style={styles.requestDescNew}>{req.desc}</Text>
                  <View style={styles.separator} />

                  <View style={styles.requestInfoRow}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.premiumBadge}>Premium ⭐</Text>
                      <Text style={styles.requestPriceNew}>{req.price}</Text>
                    </View>

                    <View style={styles.locationTimeGroup}>
                      <Text style={styles.requestInfoNew}>📍 {req.location}</Text>
                      <Text style={styles.requestInfoNew}>⏱ {req.time}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.requestButtonNew}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.requestButtonTextNew}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer - unchanged content from your original file */}
        <View style={styles.footerContainer}>
          <View style={styles.footerContent}>
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>About Us</Text>
              <Text style={styles.footerText}>
                Your trusted partner for all home and property-related services. Quality, reliability, and customer satisfaction guaranteed.
              </Text>
            </View>

            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Services</Text>
              <Text style={styles.footerLink}>Cleaning Service</Text>
              <Text style={styles.footerLink}>Packers & Movers</Text>
              <Text style={styles.footerLink}>Home Services</Text>
              <Text style={styles.footerLink}>Rentals</Text>
              <Text style={styles.footerLink}>Commercial Plots</Text>
              <Text style={styles.footerLink}>Construction Materials</Text>
            </View>

            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Quick Links</Text>
              <Text style={styles.footerLink}>Home</Text>
              <Text style={styles.footerLink}>About</Text>
              <Text style={styles.footerLink}>Contact</Text>
              <Text style={styles.footerLink}>Careers</Text>
            </View>

            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Contact Info</Text>
              <Text style={styles.footerText}>📞 +1 (555) 123-4567</Text>
              <Text style={styles.footerText}>📧 info@homeservices.com</Text>
              <Text style={styles.footerText}>📍 123 Service Street, City, State</Text>
            </View>
          </View>

          <View style={styles.copyrightRow}>
            <Text style={styles.copyrightText}>© 2025 Home Services. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickyHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  headerButton: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  scrollContent: { paddingTop: 20, paddingBottom: 0 },

  hero: { paddingHorizontal: 20, marginTop: 80, alignItems: "center" },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#e6e6e6",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  heroButtons: { flexDirection: "row", marginTop: 20, gap: 10 },

  whiteButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  whiteButtonText: { color: "#000", fontWeight: "600" },

  statsSection: { paddingHorizontal: 20, marginTop: 30 },
  statRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  statTitle: { color: "#fff", fontSize: 14 },
  statValue: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 5 },

  categorySection: { marginTop: 30, backgroundColor: "#f9f9f9", paddingVertical: 15 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10, paddingLeft: 20, color: "#000" },
  categoryScrollContainer: { paddingHorizontal: 15 },
  categoryItem: { width: 90, alignItems: "center", marginRight: 15 },
  categoryIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#6c6966ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryIconNew: { fontSize: 28 },
  categoryTitleNew: { fontWeight: "600", fontSize: 12, textAlign: "center", color: "#000" },

  // Search bar reused from your ServiceRequests styles
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#000" },
  searchIconText: { fontSize: 18, paddingHorizontal: 8 },

  liveRequestsSection: { marginTop: 0, paddingBottom: 0, backgroundColor: "#f9f9f9ff" },
  liveRequestsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20 },
  liveRequestsTitle: { fontSize: 20, fontWeight: "700" },
  liveRequestsSubtitle: { fontSize: 13, color: "#555", marginTop: 2 },
  viewAllButton: { backgroundColor: "#070707ff", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
  viewAllButtonText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  requestListContainer: { paddingHorizontal: 20, marginTop: 15, paddingBottom: 20 },
  requestCard: { width: "100%", backgroundColor: "#ffffffff", borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, overflow: "hidden" },
  imagePlaceholder: { width: "100%", height: 150, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  requestDetailsContainer: { padding: 15 },
  requestHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  requestTitleNew: { fontSize: 18, fontWeight: "700", color: "#111", flexShrink: 1, marginRight: 10 },
  badgeNew: { fontSize: 12, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, color: "#000" },
  requestDescNew: { fontSize: 13, color: "#555", marginBottom: 10 },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  requestInfoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  priceContainer: { flexDirection: "column" },
  premiumBadge: { fontSize: 12, fontWeight: "bold", color: "#800080", backgroundColor: "#f0e6ff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, marginBottom: 5, alignSelf: "flex-start" },
  requestPriceNew: { fontSize: 22, fontWeight: "800", color: "#2f80ed" },
  locationTimeGroup: { flexDirection: "column", alignItems: "flex-end" },
  requestInfoNew: { fontSize: 12, color: "#777", marginBottom: 2 },
  requestButtonNew: { backgroundColor: "#111", paddingVertical: 10, borderRadius: 10 },
  requestButtonTextNew: { color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" },

  footerContainer: { backgroundColor: "#000000", paddingTop: 30, paddingHorizontal: 20 },
  footerContent: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 30 },
  footerColumn: { width: "45%", marginBottom: 25, minWidth: 140 },
  footerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  footerText: { color: "#aaa", fontSize: 12, marginBottom: 5 },
  footerLink: { color: "#aaa", fontSize: 12, marginBottom: 5 },
  copyrightRow: { borderTopWidth: 1, borderTopColor: "#333", paddingVertical: 15, alignItems: "center" },
  copyrightText: { color: "#888", fontSize: 11 },
});

// --- END ---