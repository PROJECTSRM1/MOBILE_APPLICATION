import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// Component for the Navigation Bar
const NavBar = () => {
  // 1. Use state to manage the visibility of the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "Home",
    "Cleaning",
    "Packers & Movers",
    "Home Services",
    "Rentals",
    "Buy&Safe Properties",
    "Construction Materials",
    "Freelancer",
  ];

  return (
    <View style={styles.navBarContainer}>
      {/* Top Bar with Logo/Title and Hamburger Icon */}
      <View style={styles.topBar}>
        <Text style={styles.logoText}>SWACHIFY INDIA</Text>
        
        {/* 2. Hamburger Menu Button */}
        <TouchableOpacity 
          onPress={() => setIsMenuOpen(!isMenuOpen)} 
          style={styles.hamburgerButton}
        >
          {/* Use Unicode characters for the icon */}
          <Text style={styles.hamburgerIcon}>{isMenuOpen ? "✕" : "☰"}</Text>
        </TouchableOpacity>
      </View>
      
      {/* 3. Dropdown Menu (Conditionally Rendered) */}
      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          {navItems.map((item, index) => (
            // Close menu when an item is pressed
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function Home() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* NAV BAR: Placed at the very top to float over the content */}
      <NavBar /> 

      {/* HERO SECTION */}
      <ImageBackground
        source={require("../assets/hero.jpg")}
        style={styles.hero}
      >
        <View style={styles.overlay} />

        <Text style={styles.heroTitle}>
          Transform Your Home & Property Services
        </Text>

        <Text style={styles.heroSubtitle}>
          Your trusted solution for cleaning, moving, rentals, construction, and more.
        </Text>

        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startBtnText}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>

      {/* SERVICES SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>

        <View style={styles.serviceGrid}>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🏠</Text>
            <Text style={styles.serviceTitle}>Cleaning Service</Text>
            <Text style={styles.serviceDesc}>
              Professional cleaning solutions for your home and office.
            </Text>
            <Text style={styles.learnMore}>Learn More →</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🚚</Text>
            <Text style={styles.serviceTitle}>Packers & Movers</Text>
            <Text style={styles.serviceDesc}>
              Safe and reliable relocation services.
            </Text>
            <Text style={styles.learnMore}>Learn More →</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🛠️</Text>
            <Text style={styles.serviceTitle}>Home Services</Text>
            <Text style={styles.serviceDesc}>
              Plumbing, electrical, carpentry, and maintenance.
            </Text>
            <Text style={styles.learnMore}>Learn More →</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🏢</Text>
            <Text style={styles.serviceTitle}>Home & Apartments Rental</Text>
            <Text style={styles.serviceDesc}>
              Find perfect homes from top rental listings.
            </Text>
            <Text style={styles.learnMore}>Learn More →</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🏬</Text>
            <Text style={styles.serviceTitle}>Commercial Plots</Text>
            <Text style={styles.serviceDesc}>
              Premium plots in prime locations.
            </Text>
            <Text style={styles.learnMore}>Learn More →</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🧱</Text>
            <Text style={styles.serviceTitle}>Construction Materials</Text>
            <Text style={styles.serviceDesc}>
              Cement, bricks, and building materials at best prices.
            </Text>
            <Text style={styles.learnMore}>Learn More →</Text>
          </View>
        </View>
      </View>

      {/* ========================= */}
      {/* WHY CHOOSE OUR SERVICE */}
      {/* ========================= */}

      <View style={styles.whySection}>
        <Text style={styles.whyTitle}>Why Choose Our Service</Text>
        <Text style={styles.whySubtitle}>
          We focus on quality, trust and speed — built to make your life easier.
        </Text>

        <View style={styles.whyGrid}>
          <View style={styles.whyCard}>
            <Text style={[styles.whyIcon, { color: "#FF8C00" }]}>🛠️</Text>
            <Text style={styles.whyHeading}>Skilled Professionals</Text>
            <Text style={styles.whyText}>
              Verified, trained technicians who deliver quality workmanship every time.
            </Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={[styles.whyIcon, { color: "#1E90FF" }]}>🏡</Text>
            <Text style={styles.whyHeading}>Trusted & Local</Text>
            <Text style={styles.whyText}>
              Local teams who know your area and provide timely service.
            </Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={[styles.whyIcon, { color: "#32CD32" }]}>🚚</Text>
            <Text style={styles.whyHeading}>Transparent Pricing</Text>
            <Text style={styles.whyText}>
              Clear quotes, no hidden fees — affordable for every need.
            </Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={[styles.whyIcon, { color: "#FFB300" }]}>📜</Text>
            <Text style={styles.whyHeading}>Licensed & Insured</Text>
            <Text style={styles.whyText}>
              Professional services backed by proper licensing and insurance.
            </Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={[styles.whyIcon, { color: "#A020F0" }]}>📦</Text>
            <Text style={styles.whyHeading}>Satisfaction Guarantee</Text>
            <Text style={styles.whyText}>
              If you're not happy, we'll make it right.
            </Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={[styles.whyIcon, { color: "#FF0000" }]}>⏰</Text>
            <Text style={styles.whyHeading}>24/7 Support</Text>
            <Text style={styles.whyText}>
              Emergency response and customer support anytime.
            </Text>
          </View>
          {/* FOOTER SECTION */}
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
                <Text style={styles.footerText}>• Cleaning Service</Text>
                <Text style={styles.footerText}>• Packers & Movers</Text>
                <Text style={styles.footerText}>• Home Services</Text>
                <Text style={styles.footerText}>• Rentals</Text>
                <Text style={styles.footerText}>• Commercial Plots</Text>
                <Text style={styles.footerText}>• Construction Materials</Text>
              </View>

              {/* Quick Links */}
              <View style={styles.footerColumn}>
                <Text style={styles.footerTitle}>Quick Links</Text>
                <Text style={styles.footerText}>• Home</Text>
                <Text style={styles.footerText}>• About</Text>
                <Text style={styles.footerText}>• Contact</Text>
                <Text style={styles.footerText}>• Careers</Text>
              </View>

              {/* Contact Info */}
              <View style={styles.footerColumn}>
                <Text style={styles.footerTitle}>Contact Info</Text>
                <Text style={styles.footerText}>📞 +1 (555) 123-4567</Text>
                <Text style={styles.footerText}>📧 info@homeservices.com</Text>
                <Text style={styles.footerText}>📍 123 Service Street, City, State</Text>
              </View>
            </View>

            <View style={styles.footerBottom}>
              <Text style={styles.footerBottomText}>
                © 2025 Home Services. All rights reserved.
              </Text>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // --- NEW/UPDATED NAVBAR STYLES FOR HAMBURGER ---
  navBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
     // Ensure it's above other content
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent black for premium feel
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15, // Good vertical spacing for the top bar
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  hamburgerButton: {
    padding: 5,
  },
  hamburgerIcon: {
    fontSize: 28, // Larger icon size
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownMenu: {
    backgroundColor: "rgba(0, 0, 0, 0.95)", // Almost opaque black for menu
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)', // Subtle separator
  },
  menuItem: {
    paddingVertical: 15, // Good spacing for touch targets
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
  // --- EXISTING STYLES (Adjusted hero padding to account for navbar) ---
  hero: {
    height: 450,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 100, // Adjusted padding to move content below the floating navbar
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
    paddingVertical: 12,
    paddingHorizontal: 25,
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

  /* SERVICE CARDS */
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  serviceCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  serviceIcon: {
    fontSize: 35,
    textAlign: "center",
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  serviceDesc: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginBottom: 10,
  },
  learnMore: {
    color: "#007bff",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 5,
  },

  /* WHY CHOOSE US */
  whySection: {
    padding: 20,
    marginTop: 10,
  },

  whyTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },

  whySubtitle: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginBottom: 20,
  },

  whyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  whyCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },

  whyIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  whyHeading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  whyText: {
    fontSize: 13,
    color: "#555",
  },
  footerContainer: {
    backgroundColor: "#02142b", // dark blue
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  footerContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerColumn: {
    width: "48%",
    marginBottom: 15,
  },
  footerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
  },
  footerText: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 5,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
    alignItems: "center",
  },
  footerBottomText: {
    color: "#ccc",
    fontSize: 12,
  },
});