import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions, 
  ScrollView, // Added to allow scrolling if content overflows
} from "react-native";
import { StackScreenProps } from '@react-navigation/stack'; 
import { useNavigation } from '@react-navigation/native';

// --- Dimensions and Constants ---
const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 20 * 2 - CARD_MARGIN) / 2; // Not used in this screen, but kept from original context

// NOTE: Replace 'require' path with the actual path to your truck image
const BACKGROUND_IMAGE = require("../assets/c1.jpg"); // Placeholder: Update path

// Define the styles type (for TypeScript)
type Style = typeof styles extends { [key: string]: any } ? typeof styles : never;

// --- SHARED NAVBAR COMPONENT ---
// NOTE: I've added a prop for navigation to allow the menu to work.
const NavBar = ({ navigation }: { navigation: any }) => {
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
  
  // Handler for menu navigation
  const handleMenuItemPress = (item: string) => {
      setIsMenuOpen(false); 
      // Example navigation logic:
      if (item === "Home") {
          navigation.navigate("Home");
      } else if (item === "Cleaning") {
          navigation.navigate("Cleaning");
      } else if (item === "Packers & Movers") {
          // It's usually bad practice to navigate to the current screen, 
          // but you may want to refresh or close a drawer here.
          // navigation.navigate("PackersAndMovers"); 
      }
      // Add logic for other items as needed
  }

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

// --- PACKERS AND MOVERS SCREEN COMPONENT ---
// Assuming you are using a type for navigation props (e.g., RootStackParamList)
// Replace 'any' with the correct type if defined in your project.
type PackersAndMoversProps = StackScreenProps<any, 'PackersAndMovers'>;

const PackersAndMoversScreen: React.FC<PackersAndMoversProps> = ({ navigation }) => {
  // If not using StackScreenProps, you can use useNavigation() hook:
  // const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 1. Navbar and Hamburger Menu */}
      <NavBar navigation={navigation} />

      {/* 2. Scrollable Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- Image Section with Overlay (The main header image) --- */}
        <ImageBackground
          source={BACKGROUND_IMAGE}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          {/* --- Text Overlay / Content Box --- */}
          <View style={styles.overlayBox}>
            <Text style={styles.overlayTitle}>Stress-Free Relocation Services</Text>
            <Text style={styles.overlaySubtitle}>
              From packing to delivery, we make your move effortless.
            </Text>
            <TouchableOpacity style={styles.redButton}>
              <Text style={styles.redButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* --- Additional Content Area (Can be used for forms, details, etc.) --- */}
        <View style={styles.bodyContent}>
          <Text style={styles.sectionTitle}>Our Services Include:</Text>
          <Text style={styles.serviceText}>📦 Professional Packing & Unpacking</Text>
          <Text style={styles.serviceText}>🚚 Local & Long-Distance Moving</Text>
          <Text style={styles.serviceText}>🛡️ Transit Insurance</Text>
          <Text style={styles.serviceText}> warehousing & Storage</Text>
        </View>
        
      </ScrollView>
    </View>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // --- NAVBAR STYLES ---
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


  // --- SCREEN CONTENT STYLES ---
  imageBackground: {
    width: '100%',
    height: height * 0.35, // Adjust the height to take up 35% of the screen
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  overlayBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // Semi-transparent black
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: width * 0.85, 
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  overlaySubtitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  redButton: {
    backgroundColor: '#e74c3c', // Red color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bodyContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  serviceText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  }
});

export default PackersAndMoversScreen;