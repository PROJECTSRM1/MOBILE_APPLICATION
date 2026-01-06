// import React, { useState } from "react";
import React, { useState, useEffect } from "react";

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
const COMMISSION_PERCENT = 20;

const getCommission = (price: number) =>
  Math.round((price * COMMISSION_PERCENT) / 100);

const getFreelancerAmount = (price: number) =>
  Math.round((price * (100 - COMMISSION_PERCENT)) / 100);
// 2. DEFINE TYPE FOR NAVIGATION PARAMETERS
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

const CommissionBreakdown = ({ price }: { price: number }) => {
  const commission = getCommission(price);
  const earning = getFreelancerAmount(price);

  return (
    <View style={styles.breakdownBox}>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Service price</Text>
        <Text style={styles.rowValue}>₹{price}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Platform fee (20%)</Text>
        <Text style={[styles.rowValue, { color: "#D32F2F" }]}>
          - ₹{commission}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={[styles.rowLabel, { fontWeight: "700" }]}>
          You will receive
        </Text>
        <Text
          style={[
            styles.rowValue,
            { color: "#2E7D32", fontWeight: "800" },
          ]}
        >
          ₹{earning}
        </Text>
      </View>
    </View>
  );
};


const Row = ({ label, value, red, green, bold }: any) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, bold && { fontWeight: "700" }]}>
      {label}
    </Text>
    <Text
      style={[
        styles.rowValue,
        red && { color: "#D32F2F" },
        green && { color: "#2E7D32" },
        bold && { fontWeight: "800" },
      ]}
    >
      {value}
    </Text>
  </View>
);
export default function AvailableRequestsScreen() {
  const [showRequestDropdown, setShowRequestDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("All Requests");
  const [selectedSort, setSelectedSort] = useState("Highest Price");
  
  const navigation = useNavigation<AvailableRequestsScreenNavigationProp>();
  
  // POPUP STATES
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [acceptedTicketId, setAcceptedTicketId] = useState<string | null>(null);
  const slideAnim = useState(new Animated.Value(-100))[0];

  // === MOCK DATA ===
//   const [availableRequests, setAvailableRequests] = useState<Request[]>([
//     {
//       id: "TKT001",
//       category: "Cleaning - Deep Cleaning",
//       price: "₹3,000",
//       customer: "Rajesh Kumar",
//       description: "3BHK apartment deep cleaning required",
//       location: "MG Road, Bangalore",
//       date: "2025-11-28 at 10:00 AM",
//       estimate: "₹3,000",
//     },
//     {
//       id: "TKT004",
//       category: "Home Services - Plumbing",
//       price: "₹500",
//       customer: "Priya Sharma",
//       description: "Bathroom tap leaking issue",
//       location: "Koramangala, Bangalore",
//       date: "2025-11-29 at 2:00 PM",
//       estimate: "₹500",
//     },
//     {
//       id: "TKT005",
//       category: "Home Services - Electrical",
//       price: "₹1,200",
//       customer: "Amit Singh",
//       description: "Install new ceiling fan in living room",
//       location: "Whitefield, Bangalore",
//       date: "2025-11-29 at 4:00 PM",
//       estimate: "₹1,200",
//     },
//     {
//         id: "TKT006",
//         category: "Home Services - Repairs",
//         price: "₹12,000",
//         customer: "Sarkaar Singh",
//         description: "Install new AC in living room",
//         location: "Whitefield, Bangalore",
//         date: "2025-11-29 at 4:00 PM",
//         estimate: "₹12,000",
//       },
//       {
//         id: "TKT007",
//         category: "Cleaning - Basic House Cleaning",
//         price: "₹1,500",
//         customer: "Neha Verma",
//         description:
//           "Full house cleaning including dusting, mopping and sanitizing",
//         location: "Indiranagar, Bangalore",
//         date: "2025-12-01 at 9:30 AM",
//         estimate: "₹1,500",
//       },
//       {
//         id: "TKT008",
//         category: "Home Services - Carpenter",
//         price: "₹800",
//         customer: "Rohit Malhotra",
//         description: "Wooden door alignment and drawer repair work",
//         location: "HSR Layout, Bangalore",
//         date: "2025-12-01 at 11:00 AM",
//         estimate: "₹800",
//       },
//       {
//         id: "TKT009",
//         category: "Home Services - Plumbing",
//         price: "₹600",
//         customer: "Ayesha Khan",
//         description: "Kitchen sink drainage blocked; requires cleaning",
//         location: "BTM Layout, Bangalore",
//         date: "2025-12-02 at 10:00 AM",
//         estimate: "₹600",
//       },
//       {
//         id: "TKT010",
//         category: "Home Services - Electrical",
//         price: "₹900",
//         customer: "Manish Reddy",
//         description: "Geyser not heating, requires inspection and repair",
//         location: "Jayanagar, Bangalore",
//         date: "2025-12-02 at 3:00 PM",
//         estimate: "₹900",
//       },
//       {
//         id: "TKT012",
//         category: "Home Services - Electrical Wiring",
//         price: "₹2,200",
//         customer: "Gaurav Sinha",
//         description: "Electrical wiring replacement required in bedroom.",
//         location: "Banashankari, Bangalore",
//         date: "2025-12-03 at 4:30 PM",
//         estimate: "₹2,200",
//       },
//       {
//         id: "TKT013",
//         category: "Cleaning - Bathroom Deep Cleaning",
//         price: "₹1,200",
//         customer: "Vishal R",
//         description:
//           "2 bathrooms deep cleaning including descaling and sanitizing.",
//         location: "RT Nagar, Bangalore",
//         date: "2025-12-04 at 10:00 AM",
//         estimate: "₹1,200",
//       },
//       {
//         id: "TKT023",
//         category: "Cleaning - Sofa Shampooing",
//         price: "₹1,800",
//         customer: "Shruti Desai",
//         description: "6-seater sofa deep shampoo and vacuum cleaning.",
//         location: "Malleshwaram, Bangalore",
//         date: "2025-12-03 at 12:00 PM",
//         estimate: "₹1,800",
//       },
//   ]);

const [availableRequests, setAvailableRequests] = useState<Request[]>([]);
const [loading, setLoading] = useState(true);

const fetchRequests = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      "https://swachify-india-be-1-mcrb.onrender.com/api/home-service",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    // const paidRequests = data
    //   .filter((item: any) => item.payment_done === true)
    //   .map((item: any) => ({
    //     id: `TKT${item.id}`,
    //     category: "Home Service",
    //     price: item.service_price ? `₹${item.service_price}` : "₹ --",
    //     customer: item.full_name,
    //     description: item.problem_description,
    //     location: item.address,
    //     date: item.preferred_date,
    //     estimate: "Paid",
    //   }));
    const paidRequests = data
  .filter((item: any) => item.payment_done === true)
  .map((item: any) => {
    const originalPrice = Number(item.service_price || 0);
    const freelancerPrice = getFreelancerAmount(originalPrice);

    return {
      id: `TKT${item.id}`,
      category: "Home Service",
      price: `₹${freelancerPrice}`,     //  SHOW 80%
      originalPrice,                    //  STORE 100%
      customer: item.full_name,
      description: item.problem_description,
      location: item.address,
      date: item.preferred_date,
      estimate: "Paid",
    };
  });

    setAvailableRequests(paidRequests);
  } catch (error) {
    console.error("API Error:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchRequests();
}, []);



const [openBreakdownId, setOpenBreakdownId] = useState<string | null>(null);
  const handleAcceptRequest = (ticketId: string) => {
    const acceptedJob = availableRequests.find(req => req.id === ticketId);
    
    if (acceptedJob) {
      // 1. Update Global Data for Dashboard
      GlobalAppData.pendingCount += 1;
      GlobalAppData.pendingList.push(acceptedJob);
      
      // 2. REMOVE FROM LOCAL LIST (Disables/Hides the card)
      setAvailableRequests(prev => prev.filter(req => req.id !== ticketId));

      // 3. TRIGGER POPUP
      setAcceptedTicketId(ticketId);
      setShowAcceptPopup(true);

      // 4. ANIMATION
      Animated.timing(slideAnim, {
        toValue: 20, 
        duration: 300,
        useNativeDriver: true,
      }).start();

      // 5. AUTO-HIDE POPUP
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowAcceptPopup(false);
          setAcceptedTicketId(null);
        });
      }, 3000);
    }
  };

  const getFilteredRequests = (): Request[] => {
    if (selectedRequest === "All Requests") return availableRequests;
    return availableRequests.filter((req: Request) =>
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

  const ProfileDropdown = () => (
    <View style={styles.profileDropdown}>
      <View style={styles.profileDropdownItem}>
        <Text style={styles.profileDropdownUserText}>User</Text>
      </View>
      <View style={styles.dropdownDivider} />
<TouchableOpacity
  style={styles.profileDropdownItem}
  onPress={() => {
    setShowProfileDropdown(false);
    navigation.navigate("Login");
  }}
>
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
    {/* WALLET BUTTON */}
    <TouchableOpacity
      style={styles.walletBtn}
      onPress={() => navigation.navigate("Wallet")}
    >
      <Text style={styles.walletText}>💰 Wallet</Text>
    </TouchableOpacity>

    {/* DASHBOARD BUTTON */}
    <TouchableOpacity
      style={styles.dashboardBtn}
      onPress={() => navigation.navigate("FDOverview")}
    >
      <Text style={styles.dashboardText}>Dashboard</Text>
    </TouchableOpacity>

    {/* PROFILE */}
    <TouchableOpacity
      style={styles.profile}
      onPress={toggleProfileDropdown}
    >
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
                  {/* <Text style={styles.cardTitle}>{req.category}</Text> */}
                  {/* <Text style={styles.cardPrice}>{req.price}</Text> */}
                  {/* <Text style={styles.cardCategory}>Home Service</Text>
  <Text style={styles.cardPrice}>{req.price}</Text> */}
{/* HEADER */}
<View style={styles.cardHeader}>
  <Text style={styles.cardCategory}>{req.category}</Text>
  <Text style={styles.cardPrice}>{req.price}</Text>
</View>

{/* EARNINGS ROW */}
<View style={styles.earningRow}>
  <Text style={styles.earningText}>
    Earnings: <Text style={styles.earningAmount}>{req.price}</Text>
  </Text>

  <TouchableOpacity
    onPress={() =>
      setOpenBreakdownId(openBreakdownId === req.id ? null : req.id)
    }
  >
    <Text style={styles.breakdownLink}>
      {openBreakdownId === req.id ? "Hide breakdown" : "View breakdown"}
    </Text>
  </TouchableOpacity>
</View>

{/* BREAKDOWN (ONLY WHEN OPEN) */}
{/* {openBreakdownId === req.id && (req as any).originalPrice && (
  <CommissionBreakdown price={(req as any).originalPrice} />
)} */}
{openBreakdownId === req.id && (req as any).originalPrice && (
  <View style={styles.breakdownWrapper}>
    <CommissionBreakdown price={(req as any).originalPrice} />
  </View>
)}

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
            <Text style={styles.emptyText}>No available requests found.</Text>
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
  },
  filterActiveText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  filterChip: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDD",
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
  },
  greenStrip: {
    width: 8,
    backgroundColor: PRIMARY_GREEN,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardContent: { flex: 1, padding: 18 }, 
  cardTop: { marginBottom: 1 },
  cardTitle: { fontSize: 18, fontWeight: "800", color: "#222", flex: 1, marginRight: 10, marginBottom: 4 },
  // cardPrice: { fontSize: 22, fontWeight: "900", color: "#1A4A9A", textAlign: "right" },
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
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999' },
//   cardTop: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 6,
// },

cardHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
},

cardCategory: {
  fontSize: 15,
  fontWeight: "700",
  color: "#333",
},

cardPrice: {
  fontSize: 22,
  fontWeight: "900",
  color: "#1A4A9A",
},

earningRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
},

earningText: {
  fontSize: 13,
  color: "#555",
  fontWeight: "600",
},

earningAmount: {
  color: "#2E7D32",
  fontWeight: "800",
},

breakdownLink: {
  fontSize: 12,
  fontWeight: "700",
  color: "#1565C0",
},

breakdownBox: {
  backgroundColor: "#F9FAFB",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#E6EEF5",
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 4,
},

rowLabel: {
  fontSize: 12,
  color: "#555",
},

rowValue: {
  fontSize: 12,
  fontWeight: "600",
  color: "#222",
},

divider: {
  height: 1,
  backgroundColor: "#EEE",
  marginVertical: 8,
},

// cardCategory: {
//   fontSize: 14,
//   fontWeight: "700",
//   color: "#444",
// },

// cardPrice: {
//   fontSize: 24,
//   fontWeight: "900",
//   color: "#1A4A9A",
// },

// cardHeader: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 4,
// },

// cardCategory: {
//   fontSize: 15,
//   fontWeight: "700",
//   color: "#333",
// },

// cardPrice: {
//   fontSize: 22,
//   fontWeight: "900",
//   color: "#1A4A9A",
// },

// earningRow: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 10,
// },

// earningText: {
//   fontSize: 13,
//   color: "#555",
//   fontWeight: "600",
// },

// earningAmount: {
//   color: "#2E7D32",
//   fontWeight: "800",
// },

// breakdownLink: {
//   fontSize: 12,
//   fontWeight: "700",
//   color: "#1565C0",
// },

//   commissionBox: {
//   marginTop: 10,
//   padding: 10,
//   backgroundColor: "#F8FAFC",
//   borderRadius: 10,
//   borderWidth: 1,
//   borderColor: "#E2E8F0",
// },

// row: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   marginVertical: 2,
// },

// label: {
//   fontSize: 12,
//   color: "#475569",
// },

// value: {
//   fontSize: 12,
//   fontWeight: "600",
//   color: "#0F172A",
// },

// deduct: {
//   color: "#DC2626",
// },

// divider: {
//   height: 1,
//   backgroundColor: "#E2E8F0",
//   marginVertical: 6,
// },

// earningLabel: {
//   fontSize: 13,
//   fontWeight: "700",
//   color: "#16A34A",
// },

// earningValue: {
//   fontSize: 14,
//   fontWeight: "800",
//   color: "#16A34A",
// },


earningWrapper: {
  marginTop: 10,
},

earningHeader: {
  backgroundColor: "#F1F8F4",
  borderRadius: 12,
  padding: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

earnLabel: {
  fontSize: 11,
  color: "#388E3C",
  fontWeight: "600",
},

earnAmount: {
  fontSize: 22,
  fontWeight: "900",
  color: "#1B5E20",
},

breakdownToggle: {
  fontSize: 11,
  fontWeight: "700",
  color: "#1565C0",
},

breakdownWrapper: {
  marginTop: 8,
  width: "100%",
},


// breakdownBox: {
//   marginTop: 8,
//   backgroundColor: "#FFFFFF",
//   borderRadius: 12,
//   padding: 12,
//   borderWidth: 1,
//   borderColor: "#E6EEF5",
// },

// row: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   marginVertical: 4,
// },

// rowLabel: {
//   fontSize: 12,
//   color: "#555",
// },

// rowValue: {
//   fontSize: 12,
//   fontWeight: "600",
//   color: "#222",
// },

// divider: {
//   height: 1,
//   backgroundColor: "#EEE",
//   marginVertical: 8,
// },
 walletBtn: {
  backgroundColor: "#F4B400",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
  marginRight: 8,
},
walletText: {
  fontSize: 12,
  fontWeight: "800",
  color: "#000",
},

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
  },
  checkIcon: { fontSize: 22, marginRight: 12 },
  popupText: { fontSize: 14, fontWeight: "600", color: "#333", flex: 1, lineHeight: 20 },
  
  
});