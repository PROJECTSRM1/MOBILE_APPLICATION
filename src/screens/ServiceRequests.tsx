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
}

interface RequestCardProps {
  request: ServiceRequest;
  navigation: any;
}

// --- Mock Data ---
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
  },
];

// --- Request Card ---
const RequestCard = ({ request, navigation }: RequestCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.badgeUrgent}>{request.urgency}</Text>
        <Text style={styles.badgeDistance}>{request.distance}</Text>
      </View>

      <Text style={styles.cardTitle}>{request.title}</Text>
      <Text style={styles.cardDescription}>{request.desc}</Text>

      <Text style={styles.cardInfo}>📍 {request.location}</Text>
      <Text style={styles.cardInfo}>⏱ {request.time}</Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.starIcon}>⭐</Text>
        <Text style={styles.ratingText}>{request.rating}</Text>
      </View>

      <View style={styles.actionRow}>
        <Text style={styles.priceText}>
          <Text style={styles.currencySymbol}>$</Text>
          {request.price}
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
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

  // filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedUrgency, setSelectedUrgency] = useState("All");

  // FILTERING LOGIC
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
        <TouchableOpacity 
          // onPress={() => navigation.navigate("Freelancer")} 
          onPress={() => navigation.goBack()}
 // FIXED
        >
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

      {/* SMALL POPUP FILTER */}
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
                  selectedCategory === item && {
                    backgroundColor: "#28A745",
                  },
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
                  selectedUrgency === item && {
                    backgroundColor: "#28A745",
                  },
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

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backIcon: { fontSize: 24, color: "#000" },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 15 },

  searchBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginRight: 10,
    alignItems: "center",
  },
  searchInput: { flex: 1, fontSize: 14 },
  searchIconText: { fontSize: 18 },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterIcon: { fontSize: 14 },
  filterButtonText: { color: "#fff", marginLeft: 5, fontWeight: "600" },

  smallFilterBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 3,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },

  chip: {
    backgroundColor: "#e7f9f5",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },

  chipText: { fontSize: 13, color: "#007f5f", fontWeight: "600" },

  resultsCount: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  requestsGrid: { flexDirection: "column" },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  badgeUrgent: {
    backgroundColor: "#FFDADA",
    color: "#CC0000",
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: 10,
    borderRadius: 5,
    fontWeight: "bold",
  },

  badgeDistance: {
    backgroundColor: "#E0F7E0",
    color: "#28A745",
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: 10,
    borderRadius: 5,
    fontWeight: "bold",
  },

  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardDescription: { fontSize: 11, color: "#777", marginVertical: 5 },
  cardInfo: { fontSize: 11, marginBottom: 4 },

  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  starIcon: { fontSize: 14 },
  ratingText: { marginLeft: 5, fontWeight: "600" },

  actionRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 10,
  },

  priceText: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
  currencySymbol: { fontSize: 14 },

  buttonGroup: { flexDirection: "row" },

  acceptButton: {
    flex: 1,
    backgroundColor: "#CC0000",
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  acceptButtonText: { color: "#fff", textAlign: "center", fontWeight: "700" },

  detailsButton: {
    flex: 1,
    backgroundColor: "#28A745",
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  detailsButtonText: { color: "#fff", textAlign: "center", fontWeight: "700" },

  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  noDataIcon: {
    fontSize: 50,
    marginBottom: 10,
    opacity: 0.5,
  },

  noDataTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },

  noDataSubtitle: {
    fontSize: 13,
    color: "#888",
  },
});
