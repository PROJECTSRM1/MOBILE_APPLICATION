import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions, 
} from "react-native";
// Using 'any' for StackScreenProps for brevity, but you should ideally define RootStackParamList
import { StackScreenProps } from '@react-navigation/stack'; 

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
// (Screen width - 2*Padding - Margin) / 2 cards
const CARD_WIDTH = (width - 20 * 2 - CARD_MARGIN) / 2; 

// Define the styles type (for TypeScript)
type Style = typeof styles extends { [key: string]: any } ? typeof styles : never;

// --- SHARED NAVBAR COMPONENT (Copied for isolation) ---
const NavBar = ({ navigation }: { navigation: any }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "Home",
    "Cleaning and Home Services",
    "Transport",
    "Buy/Sales/Rentals",
    "Raw Materials",
    "Freelancer",
    "Settings",
  ];
  // Handler for menu navigation
  const handleMenuItemPress = (item: string) => {
  setIsMenuOpen(false);

  switch (item) {
    case "Home":
      navigation.navigate("HomeScreen");
      break;
    case "Cleaning and Home Services":
      navigation.navigate("Cleaning");
      break;
    case "Transport":
      navigation.navigate("Packers");
      break;
    case "Settings":
      navigation.navigate("SettingsScreen");
      break;
       case "Raw Materials":
      navigation.navigate("ConstructionMaterial");
      break;
    // add other items if needed
    default:
      console.warn("No navigation defined for", item);
  }
};


  return (
    <View style={(styles as Style).navBarContainer}>
      <View style={(styles as Style).topBar}>
        <Text style={(styles as Style).logoText}>SWACHIFY INDIA</Text>
        <TouchableOpacity 
          onPress={() => setIsMenuOpen(!isMenuOpen)} 
          style={(styles as Style).hamburgerButton}
        >
          <Text style={(styles as Style).hamburgerIcon}>{isMenuOpen ? "✕" : "☰"}</Text>
        </TouchableOpacity>
      </View>
      {isMenuOpen && (
        <View style={(styles as Style).dropdownMenu}>
          {navItems.map((item, index) => (
            <TouchableOpacity 
                key={index} 
                style={(styles as Style).menuItem} 
                onPress={() => handleMenuItemPress(item)}
            >
              <Text style={(styles as Style).menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


// --- CLEANING DETAILS SCREEN COMPONENT ---
export default function Cleaning({ navigation }: StackScreenProps<any>) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* NAV BAR */}
      <NavBar navigation={navigation} /> 

      {/* CLEANING HERO SECTION (Based on image_1a43be.jpg) */}
      <ImageBackground
        // NOTE: You must have a local image named 'hero.jpg' in ../assets/
        source={require("../assets/cleanhead.jpg")} 
        style={(styles as Style).cleaningHero}
        
      >
        {/* Blue Overlay matching the image */}
        <View style={(styles as Style).cleaningOverlay} />

        <View style={(styles as Style).cleaningContent}>
            <Text style={(styles as Style).cleaningSubtitle}>
                Professional Cleaning Service
            </Text>
            <Text style={(styles as Style).cleaningTitle}>
                Sparkling Clean Homes & Offices
            </Text>

            <Text style={(styles as Style).cleaningDesc}>
                Experience the difference with our professional cleaning services. We bring cleanliness, hygiene, and peace of mind to your space.
            </Text>
            
            {/* BUTTONS */}
            <View style={(styles as Style).buttonRow}>
                <TouchableOpacity style={(styles as Style).bookNowBtn}>
                    <Text style={(styles as Style).bookNowBtnText}>Book Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={(styles as Style).getQuoteBtn}>
                    <Text style={(styles as Style).getQuoteBtnText}>Get Quote</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ImageBackground>

      {/* ============================================================== */}
      {/* NEW SECTION: OUR CLEANING SERVICES GRID (Based on your image) */}
      {/* ============================================================== */}
      <View style={(styles as Style).cleaningServicesSection}>
        <Text style={(styles as Style).mainSectionTitle}>Our Cleaning Services</Text>
        <Text style={(styles as Style).mainSectionSubtitle}>
          Comprehensive solutions for all your home and property needs
        </Text>

        <View style={(styles as Style).serviceGrid}>
            {/* NOTE: You must use actual image paths (e.g., ../assets/residential_cleaning.jpg) 
              for these placeholders to work correctly in your project. The paths c1.jpg to c8.jpg are placeholders.
            */}

          {/* Service Card 1: Residential Cleaning */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c1.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Residential Cleaning</Text>
              <Text style={(styles as Style).serviceCardDesc}>Homes, apartments, and condos</Text>
            </View>
          </View>

          {/* Service Card 2: Office Cleaning */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c2.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Office Cleaning</Text>
              <Text style={(styles as Style).serviceCardDesc}>Commercial spaces and offices</Text>
            </View>
          </View>

          {/* Service Card 3: Move In/Out Cleaning */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c3.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Move In/Out Cleaning</Text>
              <Text style={(styles as Style).serviceCardDesc}>Deep cleaning for relocations</Text>
            </View>
          </View>

          {/* Service Card 4: Regular Maintenance */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c4.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Regular Maintenance</Text>
              <Text style={(styles as Style).serviceCardDesc}>Weekly, bi-weekly, or monthly</Text>
            </View>
          </View>

          {/* Service Card 5: Kitchen & Bathroom */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c5.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Kitchen & Bathroom</Text>
              <Text style={(styles as Style).serviceCardDesc}>Sanitization & deep scrubbing</Text>
            </View>
          </View>

          {/* Service Card 6: Sofa & Upholstery */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c6.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Sofa & Upholstery</Text>
              <Text style={(styles as Style).serviceCardDesc}>Shampoo and stain removal</Text>
            </View>
          </View>

          {/* Service Card 7: Carpet Cleaning */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c7.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Carpet Cleaning</Text>
              <Text style={(styles as Style).serviceCardDesc}>Foam wash & extraction</Text>
            </View>
          </View>

          {/* Service Card 8: Post-Construction */}
          <View style={(styles as Style).serviceCard}>
            <Image 
                source={require("../assets/c8.jpg")} // Placeholder Image
                style={(styles as Style).serviceCardImage}
            />
            <View style={(styles as Style).serviceCardContent}>
              <Text style={(styles as Style).serviceCardTitle}>Post-Construction</Text>
              <Text style={(styles as Style).serviceCardDesc}>Debris removal & polish</Text>
            </View>
          </View>

        </View>
      </View>
<View style={(styles as Style).whatsIncludedSection}>
          <Text style={(styles as Style).includedTitle}>What's Included</Text>
          <Text style={(styles as Style).includedSubtitle}>
              Our comprehensive cleaning service covers every corner of your space
          </Text>

          <View style={(styles as Style).includedGrid}>
              
              {/* Row 1 */}
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Deep cleaning of all rooms</Text>
              </View>
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Kitchen and bathroom sanitization</Text>
              </View>
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Window and glass cleaning</Text>
              </View>
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Floor mopping and vacuuming</Text>
              </View>
              
              {/* Row 2 */}
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Dusting and surface cleaning</Text>
              </View>
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Eco-friendly cleaning products</Text>
              </View>
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Trained and verified staff</Text>
              </View>
              <View style={(styles as Style).includedCard}>
                  <Text style={(styles as Style).checkIcon}>✓</Text>
                  <Text style={(styles as Style).includedText}>Flexible scheduling</Text>
              </View>
          </View>
          <View style={(styles as Style).pricingSection}>
          <Text style={(styles as Style).pricingTitle}>Pricing Packages</Text>
          <Text style={(styles as Style).pricingSubtitle}>
              Choose the package that best fits your needs
          </Text>

          <View style={(styles as Style).pricingGrid}>
              
              {/* 1. Basic Clean Card */}
              <View style={[styles.priceCard, styles.basicCard]}>
                  <Text style={styles.packageName}>Basic Clean</Text>
                  <Text style={styles.priceValue}>$79</Text>
                  <Text style={styles.pricePer}>/ service</Text>
                  <Text style={styles.duration}>2-3 hours</Text>
                  <View style={styles.featuresList}>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>General cleaning</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Dusting and vacuuming</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Kitchen cleaning</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Bathroom cleaning</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Up to 1000 sq ft</Text></View>
                  </View>
                  <TouchableOpacity style={[styles.selectBtn, styles.basicBtn]}>
                      <Text style={styles.selectBtnText}>Select Package</Text>
                  </TouchableOpacity>
              </View>
              
              {/* 2. Deep Clean Card (Most Popular) */}
              <View style={[styles.priceCard, styles.deepCard]}>
                  <Text style={styles.mostPopularTag}>Most Popular</Text>
                  <Text style={styles.packageName}>Deep Clean</Text>
                  <Text style={styles.priceValue}>$149</Text>
                  <Text style={styles.pricePer}>/ service</Text>
                  <Text style={styles.duration}>4-5 hours</Text>
                  <View style={styles.featuresList}>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Everything in Basic</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Inside appliances</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Baseboards and walls</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Window cleaning</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Up to 2000 sq ft</Text></View>
                  </View>
                  <TouchableOpacity style={[styles.selectBtn, styles.deepBtn]}>
                      <Text style={styles.selectBtnText}>Select Package</Text>
                  </TouchableOpacity>
              </View>
              
              {/* 3. Premium Clean Card */}
              <View style={[styles.priceCard, styles.premiumCard]}>
                  <Text style={styles.packageName}>Premium Clean</Text>
                  <Text style={styles.priceValue}>$249</Text>
                  <Text style={styles.pricePer}>/ service</Text>
                  <Text style={styles.duration}>Full day</Text>
                  <View style={styles.featuresList}>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Everything in Deep</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Inside cabinets</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Oven deep clean</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Refrigerator cleaning</Text></View>
                      <View style={styles.featureItem}><Text style={styles.featureCheck}>✓</Text><Text style={styles.featureText}>Unlimited square footage</Text></View>
                  </View>
                  <TouchableOpacity style={[styles.selectBtn, styles.premiumBtn]}>
                      <Text style={styles.selectBtnText}>Select Package</Text>
                  </TouchableOpacity>
              </View>
          </View>
          
      </View>
      </View>
      <View style={styles.bookingContainer}>
  <Text style={styles.bookingTitle}>Book Your Cleaning Service</Text>
  <Text style={styles.bookingSubtitle}>
    Fill out the form below and we'll get back to you within 24 hours
  </Text>

  {/* Full Name + Email */}
  <View style={styles.row}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Full Name *</Text>
      <TextInput style={styles.input} placeholder="John Doe" />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        placeholder="john@example.com"
        keyboardType="email-address"
      />
    </View>
  </View>

  {/* Phone + Service Type */}
  <View style={styles.row}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Service Type *</Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={{ color: "#555" }}>Select Cleaning Service</Text>
      </TouchableOpacity>
    </View>
  </View>

  {/* Address */}
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Service Address *</Text>
    <TextInput
      style={styles.input}
      placeholder="123 Main St, City, State, ZIP"
    />
  </View>

  {/* Date + Time */}
  <View style={styles.row}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Preferred Date *</Text>
      <TouchableOpacity style={styles.input}>
        <Text style={{ color: "#555" }}>Select date</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Preferred Time *</Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={{ color: "#555" }}>Select time slot</Text>
      </TouchableOpacity>
    </View>
  </View>

  {/* Additional Details */}
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Additional Details</Text>
    <TextInput
      style={styles.textArea}
      placeholder="Tell us more about your requirements..."
      multiline
    />
  </View>

  {/* Submit Button */}
  <TouchableOpacity style={styles.submitButton}>
    <Text style={styles.submitText}>Submit Booking Request</Text>
  </TouchableOpacity>
</View>
{/* WHY CHOOSE OUR SERVICE SECTION */}
<View style={styles.whyContainer}>
  <Text style={styles.whyTitle}>Why Choose Our Cleaning Service</Text>

  <View style={styles.whyRow}>
    {/* 1 — Insured & Bonded */}
    <View style={styles.whyItem}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>🛡️</Text>
      </View>
      <Text style={styles.whyHeading}>Insured & Bonded</Text>
      <Text style={styles.whyDesc}>
        All our staff are fully insured and background-checked for your peace of mind
      </Text>
    </View>

    {/* 2 — Satisfaction Guarantee */}
    <View style={styles.whyItem}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>✨</Text>
      </View>
      <Text style={styles.whyHeading}>Satisfaction Guarantee</Text>
      <Text style={styles.whyDesc}>
        Not happy with the results? We'll re-clean for free within 24 hours
      </Text>
    </View>

    {/* 3 — Transparent Pricing */}
    <View style={styles.whyItem}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>💲</Text>
      </View>
      <Text style={styles.whyHeading}>Transparent Pricing</Text>
      <Text style={styles.whyDesc}>
        No hidden fees or surprise charges. What you see is what you pay
      </Text>
    </View>
  </View>
</View>

      {/* FOOTER SECTION */}
      <View style={[(styles as Style).whyGrid, (styles as Style).footerContainer]}>
          <View style={(styles as Style).footerContent}>
              {/* About Us */}
              <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>About Us</Text>
                  <Text style={(styles as Style).footerText}>
                      Your trusted partner for all home and property-related services. Quality, reliability, and customer satisfaction guaranteed.
                  </Text>
              </View>

              {/* Services */}
              <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>Services</Text>
                  <Text style={(styles as Style).footerText}>• Cleaning Service</Text>
                  <Text style={(styles as Style).footerText}>• Packers & Movers</Text>
                  <Text style={(styles as Style).footerText}>• Home Services</Text>
                  <Text style={(styles as Style).footerText}>• Rentals</Text>
                  <Text style={(styles as Style).footerText}>• Commercial Plots</Text>
                  <Text style={(styles as Style).footerText}>• Construction Materials</Text>
              </View>

              {/* Quick Links */}
              <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>Quick Links</Text>
                  <Text style={(styles as Style).footerText}>• Home</Text>
                  <Text style={(styles as Style).footerText}>• About</Text>
                  <Text style={(styles as Style).footerText}>• Contact</Text>
                  <Text style={(styles as Style).footerText}>• Careers</Text>
              </View>

              {/* Contact Info */}
              <View style={(styles as Style).footerColumn}>
                  <Text style={(styles as Style).footerTitle}>Contact Info</Text>
                  <Text style={(styles as Style).footerText}>📞 +1 (555) 123-4567</Text>
                  <Text style={(styles as Style).footerText}>📧 info@homeservices.com</Text>
                  <Text style={(styles as Style).footerText}>📍 123 Service Street, City, State</Text>
              </View>
          </View>

          <View style={(styles as Style).footerBottom}>
              <Text style={(styles as Style).footerBottomText}>
                  © 2025 Home Services. All rights reserved.
              </Text>
          </View>
      </View>

    </ScrollView>
  );
}

// ===================================
// STYLESHEET for Cleaning.tsx
// ===================================
const styles = StyleSheet.create({
  // --- NAVBAR STYLES (Re-defined for isolation) ---
  navBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    marginTop: 20,
  },
  hamburgerButton: {
    padding: 5,
    marginTop: 20,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownMenu: {
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // --- CLEANING HERO STYLES (Existing) ---
  cleaningHero: {
    height: 450,
    justifyContent: "center",
    paddingHorizontal: 25, 
    paddingTop: 100, 
  },
  cleaningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1248a0e0", 
  },
  cleaningContent: {
    zIndex: 1, 
  },
  cleaningSubtitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: '500',
    marginBottom: 5,
  },
  cleaningTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
    lineHeight: 48, 
  },
  cleaningDesc: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 20,
    lineHeight: 22,
    maxWidth: '90%', 
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bookNowBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginRight: 15,
  },
  bookNowBtnText: {
    color: "#1E90FF", 
    fontSize: 16,
    fontWeight: "700",
  },
  getQuoteBtn: {
    backgroundColor: "transparent", 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 2, 
    borderColor: '#fff',
  },
  getQuoteBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // --- STYLES FOR "Our Cleaning Services" SECTION ---
  cleaningServicesSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff', 
  },
  mainSectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  mainSectionSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    maxWidth: '80%',
    alignSelf: 'center',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -CARD_MARGIN / 2, 
  },
  serviceCard: {
    width: CARD_WIDTH,
    marginBottom: CARD_MARGIN * 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: CARD_MARGIN / 2, 
    overflow: 'hidden',
  },
  serviceCardImage: {
    width: '100%',
    height: CARD_WIDTH * 0.7, 
    resizeMode: 'cover',
  },
  serviceCardContent: {
    padding: 10,
  },
  serviceCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  serviceCardDesc: {
    fontSize: 13,
    color: '#777',
  },
whatsIncludedSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // Light gray background
  },
  includedTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  includedSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    maxWidth: '80%',
    alignSelf: 'center',
  },
  includedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  includedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Two cards per row
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  checkIcon: {
    fontSize: 18,
    color: '#32CD32', // Green checkmark
    marginRight: 10,
    fontWeight: 'bold',
  },
  includedText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flexShrink: 1, // Allows text to wrap
  },
  pricingSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  pricingTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  pricingSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  pricingGrid: {
    flexDirection: 'column', // Stacked vertically for mobile, adjust for tablet/desktop
    alignItems: 'center',
  },
  priceCard: {
    width: '100%',
    maxWidth: 300, // Max width for a single card
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  basicCard: {
    borderColor: '#ccc',
  },
  deepCard: {
    borderColor: '#0d66beff', // Blue border for "Most Popular"
    borderWidth: 3,
  },
  premiumCard: {
    borderColor: '#ccc',
  },
  mostPopularTag: {
    position: 'absolute',
    top: -15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#0d66beff',
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    borderRadius: 20,
    overflow: 'hidden',
  },
  packageName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1E90FF',
    lineHeight: 50,
  },
  pricePer: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  duration: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
    textAlign: 'center',
  },
  featuresList: {
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureCheck: {
    fontSize: 16,
    color: '#20B2AA', // A nice teal color for the checkmark
    marginRight: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    color: '#555',
    flexShrink: 1,
    lineHeight: 20,
  },
  selectBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  basicBtn: {
    backgroundColor: '#20B2AA', // Teal color
  },
  deepBtn: {
    backgroundColor: '#D22B2B', // Red color
  },
  premiumBtn: {
    backgroundColor: '#20B2AA', // Teal color
  },
  selectBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bookingContainer: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 16,
  marginTop: 30,
  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 6,
},

bookingTitle: {
  fontSize: 24,
  fontWeight: "700",
  textAlign: "center",
  color: "#111",
},

bookingSubtitle: {
  textAlign: "center",
  color: "#666",
  marginTop: 5,
  marginBottom: 20,
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
},

inputGroup: {
  width: "48%",
  marginBottom: 15,
},

label: {
  fontSize: 14,
  color: "#333",
  marginBottom: 6,
},

input: {
  backgroundColor: "#F3F3F7",
  padding: 12,
  borderRadius: 10,
},

dropdown: {
  backgroundColor: "#F3F3F7",
  padding: 12,
  borderRadius: 10,
},

textArea: {
  backgroundColor: "#F3F3F7",
  padding: 12,
  borderRadius: 10,
  height: 100,
  textAlignVertical: "top",
},

submitButton: {
  backgroundColor: "#020218",
  padding: 16,
  borderRadius: 12,
  marginTop: 10,
},

submitText: {
  color: "#fff",
  textAlign: "center",
  fontSize: 16,
  fontWeight: "600",
},
whyContainer: {
  backgroundColor: "#89c5e7ff",
  paddingVertical: 40,
  paddingHorizontal: 20,
  marginTop: 20,
  borderRadius: 12,
},

whyTitle: {
  textAlign: "center",
  fontSize: 22,
  fontWeight: "700",
  color: "#002244",
  marginBottom: 30,
},

whyRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  flexWrap: "wrap",
},

whyItem: {
  width: "30%",
  alignItems: "center",
},

iconCircle: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: "#2F80ED",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},

iconText: {
  fontSize: 36,
  color: "#fff",
},

whyHeading: {
  fontSize: 16,
  fontWeight: "700",
  color: "#002244",
  textAlign: "center",
  marginBottom: 8,
},

whyDesc: {
  fontSize: 13,
  color: "#555",
  textAlign: "center",
  lineHeight: 18,
},

  // --- FOOTER STYLES (Retained) ---
  footerContainer: {
    backgroundColor: "#333",
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    shadowColor: 'transparent',
    elevation: 0,
  },
  footerContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerColumn: {
    width: "48%", 
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  footerText: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 5,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "#444",
    paddingVertical: 10,
    alignItems: "center",
  },
  footerBottomText: {
    color: "#ccc",
    fontSize: 12,
  },
});