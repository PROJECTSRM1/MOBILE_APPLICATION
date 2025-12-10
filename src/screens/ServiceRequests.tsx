// src/screens/ServiceRequests.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
// The external library is REMOVED to satisfy the "no installing libraries" constraint.
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

// --- START: TypeScript Interface Definition ---
interface ServiceRequest {
  id: number;
  title: string;
  desc: string;
  price: string;
  distance: string;
  rating: string;
  location: string;
  time: string;
}

// Define props for the RequestCard component
interface RequestCardProps {
    request: ServiceRequest;
}
// --- END: TypeScript Interface Definition ---


// --- START: Mock Data (Based on image_f9ebc7.png) ---
const serviceRequestsData: ServiceRequest[] = [ // Added type annotation here
  {
    id: 1,
    title: "House Shifting - Packing",
    desc: "Need help packing and loading luggage for a 2BHK.",
    price: "1200",
    distance: "2.5 km",
    rating: "4.8",
    location: "Gachibowli, Hyderabad",
    time: "10 min ago",
  },
  {
    id: 2,
    title: "Deep Cleaning - Apartment",
    desc: "Deep cleaning required for 3BHK apartment.",
    price: "1200",
    distance: "3.8 km",
    rating: "4.9",
    location: "Banjara Hills, Hyderabad",
    time: "35 min ago",
  },
  {
    id: 3,
    title: "Plumbing Repair",
    desc: "Fix leaking kitchen tap.",
    price: "800",
    distance: "1.2 km",
    rating: "4.7",
    location: "Madhapur, Hyderabad",
    time: "1 hour ago",
  },
];
// --- END: Mock Data ---

// --- START: Component Definitions ---

// Reusable Request Card Component
// FIX: Applied RequestCardProps type to resolve ts(7031) error
const RequestCard = ({ request }: RequestCardProps) => { 
  return (
    <View style={styles.card}>
      {/* Badge Row (Urgent & Distance) */}
      <View style={styles.cardHeader}>
        <Text style={styles.badgeUrgent}>Urgent</Text>
        <Text style={styles.badgeDistance}>{request.distance}</Text>
      </View>

      {/* Title and Description */}
      <Text style={styles.cardTitle}>{request.title}</Text>
      <Text style={styles.cardDescription}>{request.desc}</Text>

      {/* Location and Time */}
      <Text style={styles.cardInfo}>📍 {request.location}</Text>
      <Text style={styles.cardInfo}>⏱ {request.time}</Text>

      {/* Rating - Replaced <Icon> with Text/Emoji */}
      <View style={styles.ratingContainer}>
        <Text style={styles.starIcon}>⭐</Text>
        <Text style={styles.ratingText}>{request.rating}</Text>
      </View>

      {/* Action Row (Price & Buttons) */}
      <View style={styles.actionRow}>
        <Text style={styles.priceText}>
          <Text style={styles.currencySymbol}>$</Text>
          {request.price}
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function ServiceRequests() {
  // Use a navigation hook if needed later for 'Back' button or 'Details'
  // const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
            // onPress={() => navigation.goBack()}
        >
          {/* Replaced <Icon> with Text/Emoji */}
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Requests</Text>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services, locations..."
            placeholderTextColor="#777"
          />
          {/* Replaced <Icon> with Text/Emoji */}
          <Text style={styles.searchIconText}>🔍</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          {/* Replaced <Icon> with Text/Emoji */}
          <Text style={styles.filterIcon}>⚙️</Text>
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>
      
      {/* Results Count */}
      <Text style={styles.resultsCount}>
        Found {serviceRequestsData.length} service requests
      </Text>

      {/* Requests Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.requestsGrid}>
          {serviceRequestsData.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// --- START: Stylesheets ---

const styles = StyleSheet.create({
  // ... (Styles remain the same)
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50, // Standard padding for status bar/notch
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#000",
  },
  // NEW STYLES FOR TEXT ICONS
  backIcon: {
      fontSize: 24,
      color: "#000",
      lineHeight: 24, // Helps center the character
  },
  
  // Search Bar Styles
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    height: '100%',
  },
  searchIconText: { // New style for the magnifying glass emoji
      fontSize: 18,
      paddingHorizontal: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28A745', // Green color
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterIcon: { // New style for the settings/filter emoji
      fontSize: 14,
      marginRight: 4,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },

  resultsCount: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  // Requests Grid and Card Styles
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  requestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "100%", // Changed from calculated width to full width
backgroundColor: "#fff",
borderRadius: 10,
padding: 15,
marginBottom: 15, // Adjusted spacing for better vertical flow
shadowColor: "#000",
shadowOpacity: 0.05,
shadowRadius: 5,
shadowOffset: { width: 0, height: 3 },
elevation: 2,
borderWidth: 1,
borderColor: '#eee',
  },
  
  // Card elements
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badgeUrgent: {
    backgroundColor: "#FFDADA", // Light red
    color: "#CC0000",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  badgeDistance: {
    backgroundColor: "#E0F7E0", // Light green
    color: "#28A745",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  cardDescription: {
    fontSize: 11,
    color: "#777",
    marginBottom: 8,
  },
  cardInfo: {
    fontSize: 11,
    color: "#555",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  starIcon: { // New style for the star emoji
      fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  
  // Action Row
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 5,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginRight: 2,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#CC0000", // Red color
    borderRadius: 8,
    paddingVertical: 8,
    marginRight: 5,
  },
  acceptButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: "#28A745", // Green color
    borderRadius: 8,
    paddingVertical: 8,
    marginLeft: 5,
  },
  detailsButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },
});