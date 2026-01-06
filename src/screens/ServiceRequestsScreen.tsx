import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
type Urgency = "high" | "medium" | "low";

type Request = {
  id: string;
  tag: string;
  distance: string;
  title: string;
  description: string;
  location: string;
  time: string;
  price: string;
  rating: number;
  category: string;
  urgency: Urgency;
};

// SAMPLE DATA (same as web)
const REQUESTS: Request[] = [
  {
    id: "r1",
    tag: "Urgent",
    distance: "2.5 km",
    title: "House Shifting - Packing",
    description: "Need help packing and loading luggage for 2BHK.",
    location: "Gachibowli, Hyderabad",
    time: "10 min ago",
    price: "₹1200",
    rating: 4.8,
    category: "Moving",
    urgency: "high",
  },
  {
    id: "r2",
    tag: "Cleaning",
    distance: "3.8 km",
    title: "Deep Cleaning - Apartment",
    description: "Deep cleaning required for 3BHK apartment.",
    location: "Banjara Hills, Hyderabad",
    time: "35 min ago",
    price: "₹1200",
    rating: 4.9,
    category: "Cleaning",
    urgency: "medium",
  },
  {
    id: "r3",
    tag: "Urgent",
    distance: "1.2 km",
    title: "Plumbing Repair",
    description: "Fix leaking kitchen tap.",
    location: "Madhapur, Hyderabad",
    time: "1 hour ago",
    price: "₹800",
    rating: 4.7,
    category: "Repair",
    urgency: "low",
  },
];

const CATEGORIES = [
  "All",
  "Moving",
  "Cleaning",
  "Repair",
  "Installation",
  "Home Services",
  "Electrical",
  "Gardening",
];

const URGENCY: ("All" | Urgency)[] = ["All", "high", "medium", "low"];

const ServiceRequestsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedUrgency, setSelectedUrgency] = useState<"All" | Urgency>("All");
  const [showFilters, setShowFilters] = useState(false);

  // ⭐ FILTER LOGIC
  const filteredRequests = useMemo(() => {
    return REQUESTS.filter((req) => {
      if (selectedCategory !== "All" && req.category !== selectedCategory)
        return false;

      if (selectedUrgency !== "All" && req.urgency !== selectedUrgency)
        return false;

      if (search.trim() !== "") {
        const q = search.toLowerCase();
        const blob =
          `${req.title} ${req.description} ${req.location}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }

      return true;
    });
  }, [search, selectedCategory, selectedUrgency]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backRow}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.headerTitle}>Service Requests</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {/* SEARCH + FILTER BOX */}
        <View style={styles.searchCard}>
          <View style={styles.searchRow}>

            {/* 🔍 SEARCH INPUT WITH ICON */}
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for services, locations..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />

              <TouchableOpacity
                onPress={() => console.log("Search")}
                style={styles.searchIconWrapper}
              >
                <Text style={styles.searchIcon}>🔍</Text>
              </TouchableOpacity>
            </View>

            {/* FILTER BUTTON */}
            <TouchableOpacity
              style={[
                styles.filterButton,
                showFilters && styles.filterButtonActive,
              ]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Text style={styles.filterButtonText}>Filters</Text>
            </TouchableOpacity>
          </View>

          {/* FILTERING SECTION */}
          {showFilters && (
            <>
              {/* CATEGORY FILTER */}
              <Text style={styles.sectionTitle}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row" }}
              >
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.chip,
                        active && (cat === "All"
                          ? styles.chipAllActive
                          : styles.chipActive),
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* URGENCY FILTER */}
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                Urgency
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row" }}
              >
                {URGENCY.map((u) => {
                  const active = selectedUrgency === u;
                  return (
                    <TouchableOpacity
                      key={u}
                      style={[
                        styles.chip,
                        active && (u === "All"
                          ? styles.chipAllActive
                          : styles.chipActive),
                      ]}
                      onPress={() => setSelectedUrgency(u)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {u}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>

        {/* FOUND COUNT */}
        <Text style={styles.foundText}>
          Found{" "}
          <Text style={styles.foundCount}>{filteredRequests.length}</Text>{" "}
          service requests
        </Text>

        {/* LIST OF CARDS */}
        {filteredRequests.map((req) => (
          <View key={req.id} style={styles.card}>

            {/* TAG + DISTANCE */}
            <View style={styles.cardTopRow}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{req.tag}</Text>
              </View>
              <View style={styles.distancePill}>
                <Text style={styles.distanceText}>{req.distance}</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{req.title}</Text>
            <Text style={styles.cardDesc}>{req.description}</Text>

            {/* Meta */}
            <Text style={styles.metaText}>📍 {req.location}</Text>
            <Text style={styles.metaText}>⏱ {req.time}</Text>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.ratingValue}>{req.rating.toFixed(1)}</Text>
            </View>

            {/* FOOTER */}
            <View style={styles.cardFooter}>
              <Text style={styles.priceLabel}>$ {req.price}</Text>

              <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.acceptBtn}>
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.detailsBtn}>
                  <Text style={styles.detailsText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ServiceRequestsScreen;

/* -----------------------------------------------------------
                      STYLES
----------------------------------------------------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F3F4F6",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 20,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  /* SEARCH BOX */
  searchCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* NEW SEARCH INPUT WITH ICON */
  searchWrapper: {
    flex: 1,
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    paddingRight: 40,
  },
  searchIconWrapper: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  searchIcon: {
    fontSize: 18,
  },

  /* FILTER BUTTON */
  filterButton: {
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#10B981",
  },
  filterButtonActive: {
    backgroundColor: "#059669",
  },
  filterButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },

  /* CHIPS */
  sectionTitle: {
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
    color: "#111",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#059669",
  },
  chipAllActive: {
    backgroundColor: "#EF4444",
  },
  chipText: {
    color: "#111",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF",
  },

  /* FOUND COUNT */
  foundText: {
    fontSize: 13,
    marginBottom: 10,
    color: "#6B7280",
  },
  foundCount: {
    fontWeight: "700",
    color: "#111827",
  },

  /* CARD */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tagPill: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  tagText: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "700",
  },
  distancePill: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  distanceText: {
    color: "#111",
    fontSize: 11,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 4,
  },
  cardDesc: {
    color: "#6B7280",
    marginBottom: 10,
  },
  metaText: {
    color: "#6B7280",
    fontSize: 12,
  },

  ratingRow: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
  },
  stars: {
    marginRight: 8,
  },
  ratingValue: {
    fontWeight: "700",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceLabel: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2563EB",
  },
  footerButtons: {
    flexDirection: "row",
  },
  acceptBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginRight: 8,
  },
  acceptText: {
    color: "#FFF",
    fontWeight: "700",
  },
  detailsBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  detailsText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
