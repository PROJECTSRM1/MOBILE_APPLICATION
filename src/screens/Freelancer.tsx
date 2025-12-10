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
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
// FIX: The type NativeStackNavigationProp should be imported from the correct stack navigator library.
// Assuming you are using a native stack navigator and the correct package name.
// NOTE: If you are using 'react-native-screens/native-stack', the import might be different.
// For now, we assume it comes from a sub-package of react-navigation for better type safety.
// If you're using `@react-navigation/stack`, you would use StackNavigationProp.
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 

const { width } = Dimensions.get("window");

// 1. DEFINE THE ROOT PARAM LIST - This is essential for type checking all navigation calls.
type RootStackParamList = {
  // Add all screens you navigate to here:
  Signup: undefined; // No parameters expected
  Login: undefined; // No parameters expected
  ServiceRequests: undefined; // No parameters expected
  Splash: undefined;
  Onboarding: undefined;
  Freelancer: undefined;
};

// 2. DEFINE THE NAVIGATION PROP TYPE for this component
// This tells TypeScript what kind of navigation prop this component receives.
type FreelancerNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Freelancer'>; 

export default function Freelancer() {
  // 3. INITIALIZE THE useNavigation HOOK with the correct type
  const navigation = useNavigation<FreelancerNavigationProp>(); 

  // CATEGORY DATA - KEPT ORIGINAL EMOJI/TITLE/JOBS CONTENT
  const categoryData = [
    { icon: "🏠", title: "Cleaning", jobs: 10 },
    { icon: "🚚", title: "Transport", jobs: 15 },
    { icon: "🏢", title: "Buy / Sell", jobs: 23 },
    { icon: "🧱", title: "Raw Materials", jobs: 14 },
    { icon: "📚", title: "Education", jobs: 17 },
    { icon: "🛍️", title: "Swachify Products", jobs: 27 },
  ];

  // LIVE REQUESTS DATA
  const liveRequestsData = [
    {
      badge: "Urgent",
      badgeColor: "#ffe3e3",
      title: "House Shifting - Packing",
      desc: "Need help packing and loading luggage for a 2BHK.",
      location: "Gachibowli, Hyderabad",
      time: "10 min ago",
      price: "₹1200",
      // IMPORTANT: Ensure the paths for require() calls are correct in your project structure
      imageSource: require("../assets/c1.jpg"), 
    },
    {
      badge: "Cleaning",
      badgeColor: "#fff4e5",
      title: "Deep Cleaning - Apartment",
      desc: "Deep cleaning required for 3BHK apartment.",
      location: "Banjara Hills, Hyderabad",
      time: "35 min ago",
      price: "₹1200",
      imageSource: require("../assets/apartments.png"), 
    },
    {
      badge: "Urgent",
      badgeColor: "#ffe3e3",
      title: "Truck Needed",
      desc: "Transport furniture from Ameerpet to Kukatpally",
      location: "Miyapur",
      time: "1 hour ago",
      price: "₹1500",
      imageSource: require("../assets/Truck Rentals.jpg"),
    },
  ];

  const Footer = () => (
    <View style={styles.footerContainer}>
      <View style={styles.footerContent}>
        {/* About Us */}
        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>About Us</Text>
          <Text style={styles.footerText}>
            Your trusted partner for all home and property-related services. Quality, reliability, and customer satisfaction guaranteed.
          </Text>
        </View>

        {/* Services */}
        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>Services</Text>
          <Text style={styles.footerLink}>Cleaning Service</Text>
          <Text style={styles.footerLink}>Packers & Movers</Text>
          <Text style={styles.footerLink}>Home Services</Text>
          <Text style={styles.footerLink}>Rentals</Text>
          <Text style={styles.footerLink}>Commercial Plots</Text>
          <Text style={styles.footerLink}>Construction Materials</Text>
        </View>

        {/* Quick Links */}
        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>Quick Links</Text>
          <Text style={styles.footerLink}>Home</Text>
          <Text style={styles.footerLink}>About</Text>
          <Text style={styles.footerLink}>Contact</Text>
          <Text style={styles.footerLink}>Careers</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>Contact Info</Text>
          <Text style={styles.footerText}>📞 +1 (555) 123-4567</Text>
          <Text style={styles.footerText}>📧 info@homeservices.com</Text>
          <Text style={styles.footerText}>📍 123 Service Street, City, State</Text>
          {/* Social Icons Placeholder */}
          {/* <View style={styles.socialIconsRow}> */}
            {/* Using text placeholders for social icons */}
            {/* <Text style={styles.socialIcon}>F</Text>
            <Text style={styles.socialIcon}>T</Text>
            <Text style={styles.socialIcon}>I</Text>
            <Text style={styles.socialIcon}>L</Text>
          </View> */}
        </View>
      </View>

      {/* Copyright Row */}
      <View style={styles.copyrightRow}>
        <Text style={styles.copyrightText}>
          © 2025 Home Services. All rights reserved.
        </Text>
      </View>
    </View>
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
          // FIX: Updated to navigate to "Login"
          onPress={() => navigation.navigate("Login")} 
        >
          <Text style={styles.headerButtonText}>Login / Register</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Find the Right Tasks</Text>
          <Text style={styles.heroTitle}>That Match Your Skills</Text>
          <Text style={styles.heroSubtitle}>
            Verified jobs. Nearby opportunities. Instant earning.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity 
                style={styles.whiteButton}
                // FIX: Updated to navigate to "ServiceRequests"
                onPress={() => navigation.navigate("ServiceRequests")} 
            >
              <Text style={styles.whiteButtonText}>▶ View Live Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.whiteButton}
              // FIX: Updated to navigate to "Signup"
              onPress={() => navigation.navigate("Login")} 
            >
              <Text style={styles.whiteButtonText}>Become a Freelancer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
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
        {/* Adjusted style to use the primary background for better contrast against the gradient */}
        <View style={styles.categorySection}> 
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContainer} 
          >
            {categoryData.map((cat, i) => (
              <TouchableOpacity key={i} style={styles.categoryItem}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIconNew}>{cat.icon}</Text>
                </View>
                <Text style={styles.categoryTitleNew}>{cat.title}</Text>
                <Text style={styles.categoryJobsNew}>{cat.jobs} jobs</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Live Service Requests */}
        <View style={styles.liveRequestsSection}>
          <View style={styles.liveRequestsHeader}>
            <View>
              <Text style={styles.liveRequestsTitle}>
                Live Service Requests Near You
              </Text>
              <Text style={styles.liveRequestsSubtitle}>
                Accept a task and start earning instantly
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              // FIX: Updated to navigate to "ServiceRequests"
              onPress={() => navigation.navigate("ServiceRequests")} 
            >
              <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.requestListContainer}>
            {liveRequestsData.map((req, i) => (
              <View style={styles.requestCard} key={i}>
                {/* Image Section */}
                <Image
                  source={req.imageSource} 
                  style={styles.imagePlaceholder}
                />

                <View style={styles.requestDetailsContainer}>
                  {/* Title and Badge Row */}
                  <View style={styles.requestHeaderRow}>
                      <Text style={styles.requestTitleNew}>
                        {req.title}
                      </Text>
                      <Text style={[styles.badgeNew, {backgroundColor: req.badgeColor}]}>{req.badge}</Text>
                  </View>
                  
                  <Text style={styles.requestDescNew}>{req.desc}</Text>

                  <View style={styles.separator} />

                  {/* Price, Premium, Location/Time Row */}
                  <View style={styles.requestInfoRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.premiumBadge}>Premium ⭐</Text>
                        <Text style={styles.requestPriceNew}>{req.price}</Text>
                    </View>
                    
                    <View style={styles.locationTimeGroup}>
                      <Text style={styles.requestInfoNew}>
                        📍 {req.location}
                      </Text>
                      <Text style={styles.requestInfoNew}>⏱ {req.time}</Text>
                    </View>
                  </View>


                  <TouchableOpacity
                    style={styles.requestButtonNew}
                    // FIX: Updated to navigate to "Login"
                    onPress={() => navigation.navigate("Login")} 
                  >
                    <Text style={styles.requestButtonTextNew}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* --- FOOTER COMPONENT --- */}
        <Footer />
        
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
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  statTitle: { color: "#fff", fontSize: 14 },
  statValue: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 5 },

  // CATEGORY SECTION: Adding a contrasting background for visual separation
  categorySection: { 
    marginTop: 30, 
    backgroundColor: '#f9f9f9', // White background
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 20,
    color: '#000', // Changed to black to stand out on white background
  },
  categoryScrollContainer: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    width: 90,
    alignItems: 'center',
    marginRight: 15,
  },
  categoryIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#56616eff', // Primary color background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryIconNew: {
    fontSize: 28,
  },
  categoryTitleNew: {
    fontWeight: "600",
    fontSize: 12,
    textAlign: 'center',
    color: '#000', // Changed to black to stand out on white background
  },
  categoryJobsNew: {
    fontSize: 10,
    color: '#555', // Grey color for jobs count
  },

  liveRequestsSection: { marginTop: 0, paddingBottom: 0, backgroundColor: '#f9f9f9' }, 
  liveRequestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  liveRequestsTitle: { fontSize: 20, fontWeight: "700" },
  liveRequestsSubtitle: { fontSize: 13, color: "#555", marginTop: 2 },
  viewAllButton: {
    backgroundColor: "#070707ff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  viewAllButtonText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  requestListContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    paddingBottom: 20, 
  },

  requestCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },

  imagePlaceholder: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  requestDetailsContainer: {
    padding: 15,
  },

  requestHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  requestTitleNew: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    flexShrink: 1,
    marginRight: 10,
  },
  
  badgeNew: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: "#000",
  },
  
  requestDescNew: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },

  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  
  requestInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  
  priceContainer: {
    flexDirection: 'column',
  },

  premiumBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#800080",
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },

  requestPriceNew: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2f80ed",
  },
  
  locationTimeGroup: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  requestInfoNew: {
    fontSize: 12,
    color: "#777",
    marginBottom: 2,
  },
  
  requestButtonNew: {
    backgroundColor: "#111",
    paddingVertical: 10,
    borderRadius: 10,
  },

  requestButtonTextNew: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  footerContainer: {
    backgroundColor: '#000000', 
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  footerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  footerColumn: {
    width: '45%', 
    marginBottom: 25,
    minWidth: 140, 
  },
  footerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerText: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  footerLink: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  socialIconsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    backgroundColor: '#aaa', 
    color: '#000',
    fontSize: 12,
    borderRadius: 3,
    marginRight: 8,
    fontWeight: 'bold',
  },
  copyrightRow: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 15,
    alignItems: 'center',
  },
  copyrightText: {
    color: '#888',
    fontSize: 11,
  },
});