import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const requestsData = [
  {
    id: "TKT004",
    title: "Home Services - Plumbing",
    customer: "Priya Sharma",
    description: "Bathroom tap leaking issue",
    price: 500,
    location: "Koramangala, Bangalore",
    time: "2025-11-29 2:00 PM",
  },
  {
    id: "TKT006",
    title: "Home Services - Repairs",
    customer: "Sarkaar Singh",
    description: "Install new AC in living room.",
    price: 12000,
    location: "Whitefield, Bangalore",
    time: "2025-11-29 4:00 PM",
  },
  {
    id: "TKT007",
    title: "Cleaning - Basic House Cleaning",
    customer: "Neha Verma",
    description:
      "Full house cleaning including dusting, mopping, and sanitizing.",
    price: 1500,
    location: "Indiranagar, Bangalore",
    time: "2025-12-01 9:30 AM",
  },
  {
    id: "TKT008",
    title: "Home Services - Carpenter",
    customer: "Rohit Malhotra",
    description: "Wooden door alignment & drawer repair work",
    price: 800,
    location: "HSR Layout, Bangalore",
    time: "2025-12-01 11:00 AM",
  },
  {
    id: "TKT009",
    title: "Home Services - Plumbing",
    customer: "Ayesha Khan",
    description: "Kitchen sink drainage blocked; requires cleaning.",
    price: 600,
    location: "BTM Layout, Bangalore",
    time: "2025-12-02 10:00 AM",
  },
  {
    id: "TKT010",
    title: "Home Services - Electrical",
    customer: "Manish Reddy",
    description: "Geyser not heating; requires inspection and repair.",
    price: 900,
    location: "Jayanagar, Bangalore",
    time: "2025-12-02 3:00 PM",
  },
  {
    id: "TKT011",
    title: "Cleaning - Shampooing",
    customer: "Shruti Desai",
    description: "6-seater sofa deep shampoo and vacuum cleaning.",
    price: 1800,
    location: "Malleshwaram, Bangalore",
    time: "2025-12-03 12:00 PM",
  },
  {
    id: "TKT012",
    title: "Home Services - Electrical Wiring",
    customer: "Gaurav Sinha",
    description: "Electrical wiring replacement required in bedroom.",
    price: 2200,
    location: "Banashankari, Bangalore",
    time: "2025-12-03 4:30 PM",
  },
  {
    id: "TKT013",
    title: "Cleaning - Bathroom Deep Cleaning",
    customer: "Shruti Desai",
    description:
      "2 bathrooms deep cleaning including descaling and sanitizing.",
    price: 1200,
    location: "RT Nagar, Bangalore",
    time: "2025-12-04 12:00 PM",
  },
  {
    id: "TKT014",
    title: "Home Services - AC Gas Refill",
    customer: "Karthik Menon",
    description: "1.5-ton AC gas refill and cooling performance check.",
    price: 1800,
    location: "Hebbal, Bangalore",
    time: "2025-12-04 1:00 PM",
  },
  {
    id: "TKT015",
    title: "Plumbing - Tap Replacement",
    customer: "Anita Bose",
    description: "Kitchen tap broken; requires full replacement.",
    price: 450,
    location: "Yelahanka, Bangalore",
    time: "2025-12-04 3:30 PM",
  },
  {
    id: "TKT016",
    title: "Electrical - Switchboard Replacement",
    customer: "Harish Gowda",
    description: "Replace damaged switchboard and fix loose wiring.",
    price: 700,
    location: "Basavanagudi, Bangalore",
    time: "2025-12-05 11:00 AM",
  },
];

const FreelancerDashboard = () => {
  const navigation = useNavigation() as any;

  const [menuOpen, setMenuOpen] = useState(false);

  // Keep available requests in state
  const [requests, setRequests] = useState(requestsData);

  // Store pending approval list
  const [approvalPending, setApprovalPending] = useState<any[]>([]);

  // ---------------- FILTER ----------------
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Requests");

  const filterOptions = [
    "All Requests",
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Home Services",
  ];

  // ---------------- SORT ----------------
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Newest First");

  const sortOptions = ["Newest First", "Highest Price"];

  // FILTER LOGIC
  let filtered = requests.filter((req) => {
    if (selectedFilter === "All Requests") return true;
    return req.title.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  // SORT LOGIC
  if (selectedSort === "Newest First") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  } else if (selectedSort === "Highest Price") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  // ACCEPT REQUEST LOGIC
  const handleAcceptRequest = (req: any) => {
    const updatedPending = [...approvalPending, req];
    setApprovalPending(updatedPending);

    const updatedRequests = requests.filter((item) => item.id !== req.id);
    setRequests(updatedRequests);

    navigation.navigate("FreelancerDashboardOverview", {
      approvalPending: updatedPending,
    });
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>SWACHIFY INDIA</Text>
          <Text style={styles.subLogo}>Freelancer Portal</Text>
        </View>

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() =>
            navigation.navigate("FDOverview", {
              approvalPending: approvalPending,
            })
          }
        >
          <Text style={styles.dashboardText}>View My Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <View style={styles.profileCircle}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.profileIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Optional menu (if you want to show it when menuOpen is true) */}
      {menuOpen && (
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.pageHeading}>Available Requests</Text>
      <Text style={styles.pageSubHeading}>
        Start your flow by accepting a request
      </Text>

      {/* FILTER + SORT ROW */}
      <View style={styles.dropdownRow}>
        {/* FILTER */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setFilterOpen(!filterOpen)}
          >
            <Text style={styles.dropdownText}>{selectedFilter}</Text>
          </TouchableOpacity>

          {filterOpen && (
            <View style={styles.dropdownBox}>
              {filterOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedFilter(opt);
                    setFilterOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* SORT */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setSortOpen(!sortOpen)}
          >
            <Text style={styles.dropdownText}>{selectedSort}</Text>
          </TouchableOpacity>

          {sortOpen && (
            <View style={styles.dropdownBox}>
              {sortOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSort(opt);
                    setSortOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* REQUEST CARDS */}
      {filtered.map((req) => (
        <View key={req.id} style={styles.card}>
          <View style={styles.cardRowTop}>
            <Text style={styles.cardTitle}>{req.title}</Text>
            <Text style={styles.cardPrice}>₹{req.price}</Text>
          </View>

          <Text style={styles.cardTicket}>Ticket ID: {req.id}</Text>
          <Text style={styles.cardCustomer}>Customer: {req.customer}</Text>
          <Text style={styles.cardDescription}>{req.description}</Text>
          <Text style={styles.cardMeta}>📍 {req.location}</Text>
          <Text style={styles.cardMeta}>⏱ {req.time}</Text>

          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleAcceptRequest(req)}
          >
            <Text style={styles.acceptText}>Accept Request</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default FreelancerDashboard;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingTop: 20,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerLeft: {
    flexDirection: "column",
  },

  logo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2563EB",
  },

  subLogo: {
    fontSize: 12,
    color: "#6B7280",
  },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 80,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  profileIcon: {
    width: 32,
    height: 32,
  },

  menuBox: {
    position: "absolute",
    right: 10,
    top: 70,
    width: 120,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 8,
  },

  menuItem: {
    padding: 12,
  },

  menuText: {
    fontWeight: "700",
    color: "#EF4444",
  },

  dashboardButton: {
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  dashboardText: { color: "#FFF", fontWeight: "600" },

  pageHeading: { fontSize: 20, fontWeight: "700", color: "#111827" },

  pageSubHeading: { fontSize: 13, color: "#6B7280", marginBottom: 20 },

  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  dropdownButton: {
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 8,
    width: 150,
  },

  dropdownText: { fontSize: 14, fontWeight: "600" },

  dropdownBox: {
    position: "absolute",
    top: 48,
    width: 150,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 6,
    zIndex: 9999,
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },

  dropdownItemText: { fontSize: 14 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#22C55E",
    elevation: 2,
  },

  cardRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },

  cardPrice: { fontSize: 18, fontWeight: "700", color: "#22C55E" },

  cardTicket: { fontSize: 12, color: "#6B7280", marginBottom: 6 },

  cardCustomer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },

  cardDescription: { fontSize: 13, color: "#4B5563", marginBottom: 10 },

  cardMeta: { fontSize: 12, color: "#6B7280", marginBottom: 4 },

  acceptBtn: {
    marginTop: 12,
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  acceptText: { color: "#FFF", fontWeight: "700" },
});
