import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Animated, Dimensions } from "react-native";

// =======================================================
// 1. DEFINE TYPESCRIPT INTERFACE/TYPE FOR REQUEST
// =======================================================
interface Request {
  id: string;
  category: string;
  price: string;
  customer: string;
  description: string;
  location: string;
  date: string;
  estimate: string;
}

// =======================================================
// 2. DEFINE TYPE FOR NAVIGATION PARAMETERS
// =======================================================
type RootStackParamList = {
    Dashboard: undefined; 
    [key: string]: object | undefined; 
};

type AvailableRequestsScreenNavigationProp = NavigationProp<RootStackParamList>;

// Global shared state
export const GlobalAppData: {
  pendingCount: number;
  pendingList: Request[]; 
} = {
  pendingCount: 0,
  pendingList: [],
};

export default function AvailableRequestsScreen() {
  const [showRequestDropdown, setShowRequestDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("Home Services");
  const [selectedSort, setSelectedSort] = useState("Highest Price");
  
  const navigation = useNavigation<AvailableRequestsScreenNavigationProp>();
  
  // POPUP STATES
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [acceptedTicketId, setAcceptedTicketId] = useState<string | null>(null);
  const slideAnim = useState(new Animated.Value(-100))[0];

  // === MOCK DATA ===
  const requests: Request[] = [
    {
      id: "TKT001",
      category: "Cleaning - Deep Cleaning",
      price: "₹3,000",
      customer: "Rajesh Kumar",
      description: "3BHK apartment deep cleaning required",
      location: "MG Road, Bangalore",
      date: "2025-11-28 at 10:00 AM",
      estimate: "₹3,000",
    },
    {
      id: "TKT004",
      category: "Home Services - Plumbing",
      price: "₹500",
      customer: "Priya Sharma",
      description: "Bathroom tap leaking issue",
      location: "Koramangala, Bangalore",
      date: "2025-11-29 at 2:00 PM",
      estimate: "₹500",
    },
    {
      id: "TKT005",
      category: "Home Services - Electrical",
      price: "₹1,200",
      customer: "Amit Singh",
      description: "Install new ceiling fan in living room",
      location: "Whitefield, Bangalore",
      date: "2025-11-29 at 4:00 PM",
      estimate: "₹1,200",
    },
    {
        id: "TKT006",
        category: "Home Services - Repairs",
        price: "₹12,000",
        customer: "Sarkaar Singh",
        description: "Install new AC in living room",
        location: "Whitefield, Bangalore",
        date: "2025-11-29 at 4:00 PM",
        estimate: "₹12,000",
      },
      {
        id: "TKT007",
        category: "Cleaning - Basic House Cleaning",
        price: "₹1,500",
        customer: "Neha Verma",
        description:
          "Full house cleaning including dusting, mopping and sanitizing",
        location: "Indiranagar, Bangalore",
        date: "2025-12-01 at 9:30 AM",
        estimate: "₹1,500",
      },
      {
        id: "TKT008",
        category: "Home Services - Carpenter",
        price: "₹800",
        customer: "Rohit Malhotra",
        description: "Wooden door alignment and drawer repair work",
        location: "HSR Layout, Bangalore",
        date: "2025-12-01 at 11:00 AM",
        estimate: "₹800",
      },
      {
        id: "TKT009",
        category: "Home Services - Plumbing",
        price: "₹600",
        customer: "Ayesha Khan",
        description: "Kitchen sink drainage blocked; requires cleaning",
        location: "BTM Layout, Bangalore",
        date: "2025-12-02 at 10:00 AM",
        estimate: "₹600",
      },
      {
        id: "TKT010",
        category: "Home Services - Electrical",
        price: "₹900",
        customer: "Manish Reddy",
        description: "Geyser not heating, requires inspection and repair",
        location: "Jayanagar, Bangalore",
        date: "2025-12-02 at 3:00 PM",
        estimate: "₹900",
      },
      {
        id: "TKT012",
        category: "Home Services - Electrical Wiring",
        price: "₹2,200",
        customer: "Gaurav Sinha",
        description: "Electrical wiring replacement required in bedroom.",
        location: "Banashankari, Bangalore",
        date: "2025-12-03 at 4:30 PM",
        estimate: "₹2,200",
      },
      {
        id: "TKT013",
        category: "Cleaning - Bathroom Deep Cleaning",
        price: "₹1,200",
        customer: "Vishal R",
        description:
          "2 bathrooms deep cleaning including descaling and sanitizing.",
        location: "RT Nagar, Bangalore",
        date: "2025-12-04 at 10:00 AM",
        estimate: "₹1,200",
      },
      {
        id: "TKT014",
        category: "Home Services - AC Gas Refill",
        price: "₹1,800",
        customer: "Karthik Menon",
        description: "1.5-ton AC gas refill and cooling performance check.",
        location: "Hebbal, Bangalore",
        date: "2025-12-04 at 1:00 PM",
        estimate: "₹1,800",
      },
      {
        id: "TKT015",
        category: "Home Services - Plumbing - Tap Replacement",
        price: "₹450",
        customer: "Anita Bose",
        description: "Kitchen tap broken; requires full replacement.",
        location: "Yelahanka, Bangalore",
        date: "2025-12-04 at 3:30 PM",
        estimate: "₹450",
      },
      {
        id: "TKT016",
        category: "Home Services - Electrical - Switchboard Replacement",
        price: "₹700",
        customer: "Harish Gowda",
        description: "Replace damaged switchboard and fix loose wiring.",
        location: "Basavanagudi, Bangalore",
        date: "2025-12-05 at 11:00 AM",
        estimate: "₹700",
      },
      {
        id: "TKT017",
        category: "Cleaning - Kitchen Deep Cleaning",
        price: "₹2,000",
        customer: "Meenakshi Prasad",
        description: "Full kitchen deep cleaning including chimney and tiles.",
        location: "Jeevan Bima Nagar, Bangalore",
        date: "2025-12-05 at 2:00 PM",
        estimate: "₹2,000",
      },
      {
        id: "TKT018",
        category: "Home Services - Door Lock Repair",
        price: "₹650",
        customer: "Divya Rao",
        description: "Main door lock jammed, requires adjustment or replacement.",
        location: "Ulsoor, Bangalore",
        date: "2025-12-06 at 9:00 AM",
        estimate: "₹650",
      },
      {
        id: "TKT019",
        category: "Home Services - Plumbing - Water Motor Issue",
        price: "₹900",
        customer: "Arun Shankar",
        description: "Water motor not pulling water; needs inspection.",
        location: "Banerghatta Road, Bangalore",
        date: "2025-12-06 at 12:00 PM",
        estimate: "₹900",
      },
      {
        id: "TKT020",
        category: "Home Services - Electrical - Tube Light Fitting",
        price: "₹350",
        customer: "Sameer Shaikh",
        description: "Install new LED tube light in living room.",
        location: "Richmond Town, Bangalore",
        date: "2025-12-06 at 4:00 PM",
        estimate: "₹350",
      },
      {
        id: "TKT021",
        category: "Cleaning - Balcony Cleaning",
        price: "₹900",
        customer: "Lokesh N",
        description: "Balcony cleaning with moss removal and pressure wash.",
        location: "Kengeri, Bangalore",
        date: "2025-12-07 at 10:30 AM",
        estimate: "₹900",
      },
      {
        id: "TKT022",
        category: "Home Services - Curtain Rod Installation",
        price: "₹500",
        customer: "Preeti Shetty",
        description: "Install 2 curtain rods including drilling and fitting.",
        location: "HSR Layout, Bangalore",
        date: "2025-12-07 at 1:30 PM",
        estimate: "₹500",
      },
      {
        id: "TKT023",
        category: "Cleaning - Sofa Shampooing",
        price: "₹1,800",
        customer: "Shruti Desai",
        description: "6-seater sofa deep shampoo and vacuum cleaning.",
        location: "Malleshwaram, Bangalore",
        date: "2025-12-03 at 12:00 PM",
        estimate: "₹1,800",
      },
  ];

  const handleAcceptRequest = (ticketId: string) => {
    const acceptedJob = requests.find(req => req.id === ticketId);
    
    if (acceptedJob) {
      // 1. Update Global Data
      GlobalAppData.pendingCount += 1;
      GlobalAppData.pendingList.push(acceptedJob);
      
      // 2. TRIGGER POPUP VISIBILITY (The Fix)
      setAcceptedTicketId(ticketId);
      setShowAcceptPopup(true);
    }

    // 3. START ANIMATION
    Animated.timing(slideAnim, {
      toValue: 20, // Slide down into view
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 4. AUTO-HIDE POPUP
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100, // Slide back up
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowAcceptPopup(false);
        setAcceptedTicketId(null);
      });
    }, 3000);
  };

  const getFilteredRequests = (): Request[] => {
    if (selectedRequest === "All Requests") return requests;
    return requests.filter((req: Request) =>
      req.category.toLowerCase().includes(selectedRequest.toLowerCase())
    );
  };

  const getSortedRequests = (filteredRequests: Request[]): Request[] => {
    if (selectedSort === "Newest First") {
      return [...filteredRequests].sort((a, b) => b.date.localeCompare(a.date));
    } else if (selectedSort === "Highest Price") {
      return [...filteredRequests].sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, "") || "0");
        const priceB = parseInt(b.price.replace(/[^0-9]/g, "") || "0");
        return priceB - priceA;
      });
    }
    return filteredRequests;
  };

  const filteredAndSortedRequests = getSortedRequests(getFilteredRequests());

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowRequestDropdown(false);
    setShowSortDropdown(false);
  };

  const handleLogout = () => {
    console.log("User logged out");
    setShowProfileDropdown(false);
  };

  const ProfileDropdown = () => (
    <View style={styles.profileDropdown}>
      <View style={styles.profileDropdownItem}>
        <Text style={styles.profileDropdownUserText}>User</Text>
      </View>
      <View style={styles.dropdownDivider} />
      <TouchableOpacity style={styles.profileDropdownItem} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>⟲ </Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SWACHIFY INDIA</Text>
          <Text style={styles.portal}>Freelancer Portal</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.dashboardBtn}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.dashboardText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profile} onPress={toggleProfileDropdown}>
            <Text style={styles.profileText}>👤</Text> 
          </TouchableOpacity>
        </View>
      </View>

      {showProfileDropdown && <ProfileDropdown />}

      {/* TITLE */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Available Requests</Text>
        <Text style={styles.subtitle}>Start your flow by accepting a request</Text>
      </View>

      {/* FILTERS */}
      <View style={styles.filters}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={selectedRequest === "All Requests" ? styles.filterChip : styles.filterChipActive}
            onPress={() => {
              setShowRequestDropdown(!showRequestDropdown);
              setShowSortDropdown(false);
              setShowProfileDropdown(false);
            }}
          >
            <Text style={selectedRequest === "All Requests" ? styles.filterText : styles.filterActiveText}>
              {selectedRequest} ▼
            </Text>
          </TouchableOpacity>

          {showRequestDropdown && (
            <View style={styles.dropdown}>
              {["All Requests", "Cleaning", "Home Services", "Plumbing", "Electrical"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedRequest(item);
                    setShowRequestDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ position: "relative", marginLeft: 10 }}>
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowRequestDropdown(false);
              setShowProfileDropdown(false);
            }}
          >
            <Text style={styles.filterText}>{selectedSort} ▼</Text>
          </TouchableOpacity>

          {showSortDropdown && (
            <View style={styles.dropdown}>
              {["Newest First", "Highest Price"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSort(item);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* REQUEST LIST */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredAndSortedRequests.length > 0 ? (
          filteredAndSortedRequests.map((req: Request) => (
            <View key={req.id} style={styles.card}>
              <View style={styles.greenStrip} />
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{req.category}</Text>
                  <Text style={styles.cardPrice}>{req.price}</Text>
                </View>

                <View style={styles.metadataRow}>
                    <Text style={styles.ticket}>TKT ID: {req.id}</Text>
                    <Text style={styles.customer}>
                        Client: <Text style={styles.bold}>{req.customer}</Text>
                    </Text>
                </View>

                <Text style={styles.description}>{req.description}</Text>
                
                <View style={styles.metaContainer}>
                    <Text style={styles.meta}>📍 {req.location}</Text>
                    <Text style={styles.meta}>🕒 {req.date}</Text>
                    <Text style={styles.metaEstimate}>💰 Estimated: {req.estimate}</Text>
                </View>
                
                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAcceptRequest(req.id)}>
                  <Text style={styles.acceptText}>→ Accept Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No requests available for the selected filters.</Text>
          </View>
        )}
      </ScrollView>

      {/* SUCCESS POPUP */}
      {showAcceptPopup && acceptedTicketId && (
        <Animated.View
          style={[
            popupStyles.popupContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={popupStyles.popupCard}>
            <Text style={popupStyles.checkIcon}>✅</Text>
            <Text style={popupStyles.popupText}>
              Request <Text style={{ fontWeight: "800" }}>{acceptedTicketId}</Text> accepted successfully.{"\n"}
              Waiting for admin approval.
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const PRIMARY_BLUE = "#1565C0"; 
const PRIMARY_GREEN = "#00A86B"; 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5F9" }, 
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  brand: { fontSize: 19, fontWeight: "900", color: PRIMARY_BLUE },
  portal: { fontSize: 12, color: "#777", fontWeight: "400" }, 
  headerActions: { flexDirection: "row", alignItems: "center" },
  dashboardBtn: {
    backgroundColor: "#333", 
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  dashboardText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  profile: {
    width: 35,
    height: 32,
    borderRadius: 8, 
    backgroundColor: '#3e3a3aff',
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  profileDropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 8,
    zIndex: 20, 
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  profileDropdownItem: { padding: 12, flexDirection: 'row', alignItems: 'center' },
  profileDropdownUserText: { fontSize: 15, fontWeight: '700', color: '#333' },
  dropdownDivider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 10 },
  logoutText: { fontSize: 15, color: '#D9534F', fontWeight: '600', marginLeft: 4 },
  logoutIcon: { color: '#D9534F', fontSize: 18, transform: [{ rotate: '90deg' }] },
  titleSection: { paddingHorizontal: 20, paddingTop: 25 },
  title: { fontSize: 28, fontWeight: "800", color: "#222" }, 
  subtitle: { marginTop: 4, fontSize: 14, color: "#666" },
  filters: { flexDirection: "row", paddingHorizontal: 20, marginTop: 18, zIndex: 10, marginBottom: 10 },
  filterChipActive: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    elevation: 6,
  },
  filterActiveText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  filterChip: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    elevation: 2,
  },
  filterText: { fontSize: 13, color: "#444", fontWeight: "600" },
  dropdown: {
    position: "absolute",
    top: 44,
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: 180,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    zIndex: 15,
  },
  dropdownItem: { padding: 12 },
  dropdownText: { fontSize: 14, color: "#333" },
  list: { padding: 20, paddingTop: 15 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 18,
    marginBottom: 18,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  greenStrip: {
    width: 8,
    backgroundColor: PRIMARY_GREEN,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardContent: { flex: 1, padding: 18 }, 
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { fontSize: 18, fontWeight: "800", color: "#222", flex: 1, marginRight: 10, marginBottom: 4 },
  cardPrice: { fontSize: 22, fontWeight: "900", color: "#1A4A9A", textAlign: "right", lineHeight: 25 },
  metadataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ticket: { fontSize: 12, color: "#999", fontWeight: '500' }, 
  customer: { color: "#444", fontSize: 13 },
  bold: { fontWeight: "700", color: "#333" },
  description: { marginTop: 8, color: "#555", fontStyle: "italic", fontSize: 14, marginBottom: 12 },
  metaContainer: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  meta: { marginTop: 4, color: "#666", fontSize: 13, fontWeight: '500' },
  metaEstimate: { marginTop: 4, color: PRIMARY_BLUE, fontSize: 14, fontWeight: '700' }, 
  acceptBtn: { marginTop: 20, backgroundColor: PRIMARY_GREEN, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  acceptText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 50 },
  emptyText: { fontSize: 16, color: "#777", textAlign: "center" },
});

const { width } = Dimensions.get("window");

const popupStyles = StyleSheet.create({
  popupContainer: {
    position: "absolute",
    top: 50, 
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
  popupCard: {
    width: width - 32, 
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  checkIcon: { fontSize: 22, marginRight: 12 },
  popupText: { fontSize: 14, fontWeight: "600", color: "#333", flex: 1, lineHeight: 20 },
});