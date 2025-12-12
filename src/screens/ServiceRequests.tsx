// src/screens/ServiceRequests.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  ImageSourcePropType,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// --- Types ---
interface ServiceRequest {
  id: number;
  title: string;
  desc: string;
  price: string;
  distance: string;
  rating: string;
  location: string;
  time: string;
  category: string;
  urgency: string;
  imageSource: ImageSourcePropType; // Add image for each request
}

interface RequestCardProps {
  request: ServiceRequest;
  navigation: any;
}

// --- Mock Data with inline images ---
const serviceRequestsData: ServiceRequest[] = [
  {
    id: 1,
    title: "House Shifting - Packing",
    desc: "Need help packing and loading luggage for a 2BHK.",
    price: "1200",
    distance: "2.5 km",
    rating: "4.8",
    location: "Gachibowli, Hyderabad",
    time: "10 min ago",
    category: "Moving",
    urgency: "High",
    imageSource: require("../assets/c3.jpg"), // <-- image inline
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
    category: "Cleaning",
    urgency: "Medium",
    imageSource: require("../assets/apartments.png"), // <-- image inline
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
    category: "Repair",
    urgency: "Low",
    imageSource: require("../assets/s3.jpg"), // <-- image inline
  },
];

// --- Request Card ---
const RequestCard = ({ request, navigation }: RequestCardProps) => {
  return (
    <View style={styles.cardNew}>
      {/* Left Content */}
      <View style={styles.cardContentLeft}>
        <View style={styles.cardHeader}>
          <Text style={styles.badgeUrgent}>{request.urgency}</Text>
          <Text style={styles.badgeDistance}>{request.distance}</Text>
        </View>

        <Text style={styles.cardTitleNew}>{request.title}</Text>
        <Text style={styles.cardDescriptionNew}>{request.desc}</Text>

        <Text style={styles.cardInfoNew}>📍 {request.location}</Text>
        <Text style={styles.cardInfoNew}>⏱ {request.time}</Text>

        <View style={styles.ratingContainerNew}>
          <Text style={styles.starIconNew}>★</Text>
          <Text style={styles.ratingTextNew}>{request.rating}</Text>
        </View>
      </View>

      {/* Right Image/Action */}
      <View style={styles.cardActionRight}>
        <Image
          source={request.imageSource}
          style={styles.serviceImageNew}
          resizeMode="cover"
        />

        <View style={styles.priceActionGroup}>
          <Text style={styles.priceTextNew}>
            <Text style={styles.currencySymbolNew}>$ ₹</Text>
            {request.price}
          </Text>

          <TouchableOpacity style={styles.acceptButtonNew}>
            <Text style={styles.acceptButtonTextNew}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButtonNew}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.detailsButtonTextNew}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- Main Screen ---
export default function ServiceRequests() {
  const navigation = useNavigation();
  const [showSmallFilter, setShowSmallFilter] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedUrgency, setSelectedUrgency] = useState("All");

  const filteredRequests = serviceRequestsData.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" || item.category === selectedCategory;
    const urgencyMatch =
      selectedUrgency === "All" || item.urgency === selectedUrgency;
    return categoryMatch && urgencyMatch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Requests</Text>
      </View>

      {/* Search + Filters */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services, locations..."
            placeholderTextColor="#777"
          />
          <Text style={styles.searchIconText}>🔍</Text>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowSmallFilter(!showSmallFilter)}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Small Filter Box */}
      {showSmallFilter && (
        <View style={styles.smallFilterBox}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipContainer}>
            {[
              "All",
              "Moving",
              "Cleaning",
              "Repair",
              "Installation",
              "Home Services",
              "Electrical",
              "Gardening",
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.chip,
                  selectedCategory === item && { backgroundColor: "#28A745" },
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategory === item && { color: "#fff" },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Urgency</Text>
          <View style={styles.chipContainer}>
            {["All", "High", "Medium", "Low"].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.chip,
                  selectedUrgency === item && { backgroundColor: "#28A745" },
                ]}
                onPress={() => setSelectedUrgency(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedUrgency === item && { color: "#fff" },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.resultsCount}>
        Found {filteredRequests.length} service requests
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.requestsGrid}>
          {filteredRequests.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataIcon}>📭</Text>
              <Text style={styles.noDataTitle}>No requests found</Text>
              <Text style={styles.noDataSubtitle}>
                Try different filters or search
              </Text>
            </View>
          ) : (
            filteredRequests.map((req) => (
              <RequestCard key={req.id} request={req} navigation={navigation} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// --- Styles (Use your previous cardNew styles) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15 },
  backIcon: { fontSize: 24, color: "#000" },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 15 },
  searchBarContainer: { flexDirection: "row", paddingHorizontal: 20, marginBottom: 10, alignItems: "center" },
  searchBar: { flex: 1, flexDirection: "row", backgroundColor: "#f0f0f0", borderRadius: 12, paddingHorizontal: 12, height: 45, marginRight: 10, alignItems: "center" },
  searchInput: { flex: 1, fontSize: 14 },
  searchIconText: { fontSize: 18 },
  filterButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#28A745", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  filterIcon: { fontSize: 14 },
  filterButtonText: { color: "#fff", marginLeft: 5, fontWeight: "600" },
  smallFilterBox: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 12, padding: 15, borderWidth: 1, borderColor: "#e0e0e0", elevation: 3, marginBottom: 15 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 8, marginTop: 8 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 5 },
  chip: { backgroundColor: "#e7f9f5", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, marginRight: 10, marginBottom: 8 },
  chipText: { fontSize: 13, color: "#007f5f", fontWeight: "600" },
  resultsCount: { fontSize: 14, color: "#555", paddingHorizontal: 20, marginBottom: 10 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  requestsGrid: { flexDirection: "column" },

  // Card
  cardNew: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "#fff", borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#eee", elevation: 2, width: "100%" },
  cardContentLeft: { flex: 2, paddingRight: 10 },
  cardActionRight: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', minWidth: 90 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  badgeUrgent: { backgroundColor: "#FFDADA", color: "#CC0000", paddingHorizontal: 6, paddingVertical: 3, fontSize: 10, borderRadius: 5, fontWeight: "bold" },
  badgeDistance: { backgroundColor: "#E0F7E0", color: "#28A745", paddingHorizontal: 6, paddingVertical: 3, fontSize: 10, borderRadius: 5, fontWeight: "bold" },
  cardTitleNew: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  cardDescriptionNew: { fontSize: 12, color: "#777", marginBottom: 5 },
  cardInfoNew: { fontSize: 11, color: "#555", marginBottom: 2 },
  ratingContainerNew: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  starIconNew: { fontSize: 14, color: '#FFC107' },
  ratingTextNew: { marginLeft: 5, fontWeight: "600", fontSize: 13 },
  serviceImageNew: { width: '100%', height: 80, borderRadius: 8, marginBottom: 10 },
  priceActionGroup: { width: '100%', alignItems: 'center', marginTop: 0 },
  priceTextNew: { fontSize: 16, fontWeight: "800", color: '#000', marginBottom: 5 },
  currencySymbolNew: { fontSize: 12, fontWeight: 'normal' },
  acceptButtonNew: { width: '100%', backgroundColor: "#35C24D", paddingVertical: 6, borderRadius: 6, marginBottom: 5 },
  acceptButtonTextNew: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 14 },
  detailsButtonNew: { width: '100%', backgroundColor: "#eee", paddingVertical: 6, borderRadius: 6 },
  detailsButtonTextNew: { color: "#555", textAlign: "center", fontWeight: "600", fontSize: 14 },

  noDataContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 50 },
  noDataIcon: { fontSize: 50, marginBottom: 10, opacity: 0.5 },
  noDataTitle: { fontSize: 16, fontWeight: "600", color: "#444", marginBottom: 4 },
  noDataSubtitle: { fontSize: 13, color: "#888" },
});
