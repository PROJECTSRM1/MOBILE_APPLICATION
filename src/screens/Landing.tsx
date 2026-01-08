
// // src/screens/FreelancerScreen.tsx
// import React , {useState} from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   StatusBar,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import { useNavigation } from "@react-navigation/native";

// const CATEGORIES = [
//   { id: "1", name: "Cleaning & Home Services", jobs: 10, icon: "🏠" },
//   { id: "2", name: "Transport", jobs: 15, icon: "🚚" },
//   { id: "3", name: "Buy/Sale/Rentals", jobs: 23, icon: "🏢" },
//   { id: "4", name: "Raw Materials", jobs: 14, icon: "📦" },
//   { id: "5", name: "Education", jobs: 17, icon: "📚" },
//   { id: "6", name: "Swachify Products", jobs: 27, icon: "🛡" },
// ];

// // const [showLoginMenu, setShowLoginMenu] = useState(false);


// const REQUESTS = [
//   {
//     id: "r1",
//     tag: "Urgent",
//     title: "House Shifting - Packing",
//     description: "Need help packing and loading luggage for a 2BHK.",
//     location: "Gachibowli, Hyderabad",
//     time: "10 min ago",
//     price: "₹1200",
//   },
//   {
//     id: "r2",
//     tag: "Cleaning",
//     title: "Deep Cleaning - Apartment",
//     description: "Deep cleaning required for 3BHK apartment.",
//     location: "Banjara Hills, Hyderabad",
//     time: "35 min ago",
//     price: "₹1200",
//   },
//   {
//     id: "r3",
//     tag: "Urgent",
//     title: "Truck Needed",
//     description: "Transport furniture from Ameerpet to Kukatpally.",
//     location: "Miyapur",
//     time: "1 hour ago",
//     price: "₹1500",
//   },
// ];

// const FreelancerScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
// const [showLoginMenu, setShowLoginMenu] = useState(false);

//   return (
//     <>
//       <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

//       {/* HEADER LIKE WEBSITE */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle} numberOfLines={1}>
//           Swachify Freelancer
//         </Text>

//         <View style={styles.headerButtons}>
//           <TouchableOpacity
//             style={styles.headerBtn}
//             activeOpacity={0.8}
//             onPress={() => navigation.replace("Onboarding")}
//           >
//             <Text style={styles.headerBtnText}>Back</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.headerBtn, styles.headerBtnPrimary]}
//             activeOpacity={0.8}
//             // onPress={() => navigation.replace("Login")}
//             onPress={() => setShowLoginMenu(prev => !prev)}

//           >
//             <Text style={[styles.headerBtnText, styles.headerBtnPrimaryText]}>
//               Login / Register
//             </Text>

//           </TouchableOpacity>

// {/* {showLoginMenu && (
//     <View style={styles.loginDropdown}>
//       <TouchableOpacity
//         style={styles.loginOption}
//         onPress={() => {
//           setShowLoginMenu(false);
//           navigation.navigate("Login"); // CUSTOMER LOGIN
//         }}
//       >
//         <Text style={styles.loginOptionText}>Customer Login</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.loginOption}
//         onPress={() => {
//           setShowLoginMenu(false);
//           navigation.navigate("Login"); // FREELANCER LOGIN
//         }}
//       >
//         <Text style={styles.loginOptionText}>Freelancer Login</Text>
//       </TouchableOpacity>
//     </View>
//   )} */}
//         </View>
//       </View>
//       {showLoginMenu && (
//     <View style={styles.loginDropdown}>
//       <TouchableOpacity
//         style={styles.loginOption}
//         onPress={() => {
//           setShowLoginMenu(false);
//           navigation.navigate("CustomerDashboard"); // CUSTOMER LOGIN
//         }}
//       >
//         <Text style={styles.loginOptionText}>Customer Login</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.loginOption}
//         onPress={() => {
//           setShowLoginMenu(false);
//           navigation.navigate("Login"); // FREELANCER LOGIN
//         }}
//       >
//         <Text style={styles.loginOptionText}>Freelancer Login</Text>
//       </TouchableOpacity>
//     </View>
//   )}

//       <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
//         {/* HERO SECTION – MATCHES WEB DESIGN */}
//         <LinearGradient
//           colors={["#3B82F6", "#8B5CF6"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.heroContainer}
//         >
//           <View style={styles.heroContent}>
//             <Text style={styles.heroTitle}>
//               Find the Right Tasks{"\n"}That Match Your Skills
//             </Text>

//             <Text style={styles.heroSubtitle}>
//               Verified jobs. Nearby opportunities. Instant earning.
//             </Text>

//             <View style={styles.heroButtonsRow}>
//               <TouchableOpacity
//                 style={styles.heroBtnWhite}
//                 activeOpacity={0.9}
//                 onPress={() => navigation.navigate("ServiceRequests")}
//               >
//                 <Text style={styles.heroBtnWhiteText}>View Live Requests</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.heroBtnWhite, styles.heroBtnWhiteRight]}
//                 activeOpacity={0.9}
//                 onPress={() => navigation.navigate("Login")}
//               >
//                 <Text style={styles.heroBtnWhiteText}>Become a Freelancer</Text>
//               </TouchableOpacity>
//             </View>

//             {/* 4 STAT CARDS (2x2) */}
//             <View style={styles.statsGrid}>
//               <View style={styles.statCard}>
//                 <Text style={styles.statLabel}>Active Tasks</Text>
//                 <Text style={styles.statValue}>2,456+</Text>
//               </View>

//               <View style={styles.statCard}>
//                 <Text style={styles.statLabel}>Freelancers</Text>
//                 <Text style={styles.statValue}>10,000+</Text>
//               </View>

//               <View style={styles.statCard}>
//                 <Text style={styles.statLabel}>Avg Rating</Text>
//                 <Text style={styles.statValue}>4.8 ⭐</Text>
//               </View>

//               <View style={styles.statCard}>
//                 <Text style={styles.statLabel}>Verified Jobs</Text>
//                 <Text style={styles.statValue}>100%</Text>
//               </View>
//             </View>
//           </View>
//         </LinearGradient>

//         {/* EVERYTHING YOU ALREADY HAD BELOW – BROWSE + LIVE REQUESTS */}
//         <View style={styles.bottomSection}>
//           {/* Browse Categories */}
//           <Text style={styles.sectionTitle}>Browse Categories</Text>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoriesRow}
//           >
//             {CATEGORIES.map((cat) => (
//               <View key={cat.id} style={styles.categoryCard}>
//                 <Text style={styles.categoryIcon}>{cat.icon}</Text>
//                 <Text style={styles.categoryName}>{cat.name}</Text>
//                 <Text style={styles.categoryJobs}>{cat.jobs} jobs</Text>
//               </View>
//             ))}
//           </ScrollView>

//           {/* Live Requests header */}
//           <View style={styles.requestsHeaderRow}>
//             <View>
//               <Text style={styles.sectionTitleSmall}>
//                 Live Service Requests Near You
//               </Text>
//               <Text style={styles.sectionSubtitle}>
//                 Accept a task and start earning instantly
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={styles.viewAllBtn}
//               onPress={() => navigation.navigate("ServiceRequests")}
//             >
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Request cards */}
//           {REQUESTS.map((req) => (
//             <View key={req.id} style={styles.requestCard}>
//               <View style={styles.requestHeaderRow}>
//                 <View style={styles.tagPill}>
//                   <Text style={styles.tagText}>{req.tag}</Text>
//                 </View>
//               </View>

//               <Text style={styles.requestTitle}>{req.title}</Text>
//               <Text style={styles.requestDesc}>{req.description}</Text>

//               <View style={styles.requestMeta}>
//                 <Text style={styles.metaText}>📍 {req.location}</Text>
//                 <Text style={styles.metaText}>⏱ {req.time}</Text>
//               </View>

//               <View style={styles.requestFooter}>
//                 <Text style={styles.priceText}>{req.price}</Text>
//                 <TouchableOpacity style={styles.acceptBtn}
//                 onPress={() => navigation.navigate("Login")}
//                 >
//                   <Text style={styles.acceptText}>Accept</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/*  NEW FOOTER (does not touch existing design) */}
//         <View style={styles.footer}>
//           <View style={styles.footerRow}>
//             {/* About Us */}
//             <View style={[styles.footerCol, styles.footerColWide]}>
//               <Text style={styles.footerHeading}>About Us</Text>
//               <Text style={styles.footerText}>
//                 Your trusted partner for all home and property-related services.
//                 Quality, reliability, and customer satisfaction guaranteed.
//               </Text>
//             </View>

//             {/* Services */}
//             <View style={styles.footerCol}>
//               <Text style={styles.footerHeading}>Services</Text>
//               <Text style={styles.footerLink}>Cleaning Service</Text>
//               <Text style={styles.footerLink}>Packers &amp; Movers</Text>
//               <Text style={styles.footerLink}>Home Services</Text>
//               <Text style={styles.footerLink}>Rentals</Text>
//               <Text style={styles.footerLink}>Commercial Plots</Text>
//               <Text style={styles.footerLink}>Construction Materials</Text>
//             </View>

//             {/* Quick Links */}
//             <View style={styles.footerCol}>
//               <Text style={styles.footerHeading}>Quick Links</Text>
//               <Text style={styles.footerLink}>Home</Text>
//               <Text style={styles.footerLink}>About</Text>
//               <Text style={styles.footerLink}>Contact</Text>
//               <Text style={styles.footerLink}>Careers</Text>
//             </View>

//             {/* Contact Info */}
//             <View style={[styles.footerCol, styles.footerColWide]}>
//               <Text style={styles.footerHeading}>Contact Info</Text>

//               <View style={styles.footerContactRow}>
//                 <Text style={styles.footerContactIcon}>📞</Text>
//                 <Text style={styles.footerContactText}>+1 (555) 123-4567</Text>
//               </View>

//               <View style={styles.footerContactRow}>
//                 <Text style={styles.footerContactIcon}>✉️</Text>
//                 <Text style={styles.footerContactText}>
//                   info@homeservices.com
//                 </Text>
//               </View>

//               <View style={styles.footerContactRow}>
//                 <Text style={styles.footerContactIcon}>📍</Text>
//                 <Text style={styles.footerContactText}>
//                   123 Service Street, City, State
//                 </Text>
//               </View>

//               <View style={styles.footerSocialRow}>
//                 <Text style={styles.footerSocialIcon}>𝕗</Text>
//                 <Text style={styles.footerSocialIcon}>𝕏</Text>
//                 <Text style={styles.footerSocialIcon}>📸</Text>
//                 <Text style={styles.footerSocialIcon}>in</Text>
//               </View>
//             </View>
//           </View>

//           <Text style={styles.footerCopy}>
//             © 2025 Home Services. All rights reserved.
//           </Text>
//         </View>
//       </ScrollView>
//     </>
//   );
// };

// export default FreelancerScreen;

// const styles = StyleSheet.create({
//   // HEADER
//   header: {
//     backgroundColor: "#F9FAFB",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#E5E7EB",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   headerButtons: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   headerBtn: {
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: "#111827",
//     backgroundColor: "transparent",
//     marginLeft: 8,
//     minWidth: 70,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerBtnText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   headerBtnPrimary: {
//     backgroundColor: "#111827",
//     borderColor: "#111827",
//   },
//   headerBtnPrimaryText: {
//     color: "#FFFFFF",
//   },

//   // HERO
//   heroContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 40,
//   },
//   heroContent: {
//     alignItems: "center",
//   },
//   heroTitle: {
//     fontSize: 30,
//     lineHeight: 36,
//     fontWeight: "800",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   heroSubtitle: {
//     fontSize: 14,
//     color: "#E5E7EB",
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   heroButtonsRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 32,
//   },
//   heroBtnWhite: {
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 999,
//     elevation: 2,
//   },
//   heroBtnWhiteRight: {
//     marginLeft: 10,
//   },
//   heroBtnWhiteText: {
//     color: "#111827",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   statsGrid: {
//     width: "100%",
//     marginTop: 10,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   statCard: {
//     width: "48%",
//     backgroundColor: "rgba(255,255,255,0.18)",
//     borderRadius: 24,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     marginBottom: 14,
//   },
//   statLabel: {
//     fontSize: 13,
//     color: "#E5E7EB",
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },

//   // BOTTOM SECTION (BROWSE + REQUESTS)
//   bottomSection: {
//     backgroundColor: "#F3F4F6",
//     paddingHorizontal: 16,
//     paddingTop: 24,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 12,
//     color: "#111827",
//   },
//   sectionTitleSmall: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   sectionSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 2,
//   },

//   categoriesRow: {
//     paddingVertical: 4,
//   },
//   categoryCard: {
//     width: 180,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     marginRight: 10,
//     elevation: 2,
//   },
//   categoryIcon: {
//     fontSize: 22,
//     marginBottom: 10,
//   },
//   categoryName: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   categoryJobs: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 4,
//   },

//   requestsHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 24,
//     marginBottom: 10,
//   },
//   viewAllBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//     backgroundColor: "#111827",
//   },
//   viewAllText: {
//     fontSize: 12,
//     color: "#FFFFFF",
//     fontWeight: "600",
//   },

//   requestCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 12,
//     elevation: 2,
//   },
//   requestHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   tagPill: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//     backgroundColor: "#FEE2E2",
//     alignSelf: "flex-start",
//   },
//   tagText: {
//     fontSize: 11,
//     color: "#B91C1C",
//     fontWeight: "600",
//   },
//   requestTitle: {
//     marginTop: 8,
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   requestDesc: {
//     marginTop: 4,
//     fontSize: 13,
//     color: "#4B5563",
//   },
//   requestMeta: {
//     marginTop: 10,
//   },
//   metaText: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   requestFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 12,
//   },
//   priceText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#2563EB",
//   },
//   acceptBtn: {
//     backgroundColor: "#111827",
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   acceptText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   loginDropdown: {
//   position: "absolute",
//   top: 44,
//   right: 0,
//   width: 180,
//   backgroundColor: "#FFFFFF",
//   borderRadius: 12,
//   elevation: 6,
//   shadowColor: "#000",
//   shadowOpacity: 0.12,
//   shadowRadius: 10,
//   shadowOffset: { width: 0, height: 4 },
//   zIndex: 999,
// },

// loginOption: {
//   paddingVertical: 12,
//   paddingHorizontal: 14,
//   borderBottomWidth: StyleSheet.hairlineWidth,
//   borderBottomColor: "#E5E7EB",
// },

// loginOptionText: {
//   fontSize: 14,
//   fontWeight: "600",
//   color: "#111827",
// },

//   // FOOTER
//   footer: {
//     backgroundColor: "#020617",
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 16,
//   },
//   footerRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   footerCol: {
//     width: "48%",
//     marginBottom: 16,
//   },
//   footerColWide: {
//     // allows text blocks to wrap nicely
//   },
//   footerHeading: {
//     color: "#F9FAFB",
//     fontWeight: "700",
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   footerText: {
//     color: "#D1D5DB",
//     fontSize: 12,
//     lineHeight: 18,
//   },
//   footerLink: {
//     color: "#E5E7EB",
//     fontSize: 13,
//     marginBottom: 4,
//   },
//   footerContactRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   footerContactIcon: {
//     marginRight: 6,
//     fontSize: 13,
//   },
//   footerContactText: {
//     color: "#E5E7EB",
//     fontSize: 12,
//     flexShrink: 1,
//   },
//   footerSocialRow: {
//     flexDirection: "row",
//     marginTop: 8,
//   },
//   footerSocialIcon: {
//     color: "#E5E7EB",
//     fontSize: 14,
//     marginRight: 10,
//   },
//   footerCopy: {
//     color: "#6B7280",
//     fontSize: 11,
//     textAlign: "left",
//   },
// });




// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   TextInput,
// } from "react-native";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// const Landing = () => {
//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <View style={styles.avatar} />
//           <View>
//             <Text style={styles.locationLabel}>Current Location</Text>
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <MaterialIcons name="location-on" size={16} color="#3b82f6" />
//               <Text style={styles.locationText}> New York, NY</Text>
//             </View>
//           </View>
//         </View>

//         <View>
//           <MaterialIcons name="notifications" size={24} color="#fff" />
//           <View style={styles.notificationDot} />
//         </View>
//       </View>

//       {/* SEARCH */}
//       <View style={styles.searchBox}>
//         <MaterialIcons name="search" size={20} color="#3b82f6" />
//         <TextInput
//           placeholder="Find services, jobs, or homes..."
//           placeholderTextColor="#9ca3af"
//           style={styles.searchInput}
//         />
//         <MaterialIcons name="mic" size={20} color="#3b82f6" />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* BANNER */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <View style={styles.banner}>
//             <Text style={styles.badge}>LIMITED OFFER</Text>
//             <Text style={styles.bannerTitle}>50% Off Home Cleaning</Text>
//             <TouchableOpacity style={styles.bannerBtn}>
//               <Text style={styles.bannerBtnText}>Book Now</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         {/* CORE SERVICES */}
//         <Text style={styles.sectionTitle}>Core Services</Text>

//         <View style={styles.grid}>
//           {[
//             { name: "Housing", icon: "home" },
//             { name: "Education", icon: "school" },
//             { name: "Freelance", icon: "work" },
//             { name: "Buy/Sell", icon: "shopping-bag" },
//             { name: "Bills", icon: "receipt" },
//             { name: "Wallet", icon: "account-balance-wallet" },
//             { name: "Cleaning", icon: "cleaning-services" },
//             { name: "More", icon: "grid-view" },
//           ].map((item, i) => (
//             <View key={i} style={styles.gridItem}>
//               <View style={styles.gridIcon}>
//                 <MaterialIcons name={item.icon} size={28} color="#3b82f6" />
//               </View>
//               <Text style={styles.gridText}>{item.name}</Text>
//             </View>
//           ))}
//         </View>

//         {/* TRENDING */}
//         <View style={styles.trendingHeader}>
//           <Text style={styles.sectionTitle}>Trending Near You</Text>
//           <Text style={styles.viewAll}>View All</Text>
//         </View>

//         {/* CARD */}
//         <View style={styles.card}>
//           <Image
//             source={{ uri: "https://i.imgur.com/7D7I6dI.png" }}
//             style={styles.cardImage}
//           />
//           <View style={{ flex: 1 }}>
//             <Text style={styles.cardTitle}>Expert Math Tutor</Text>
//             <Text style={styles.cardSub}>Education • 0.5 mi away</Text>
//             <View style={styles.cardFooter}>
//               <Text style={styles.price}>$30/hr</Text>
//               <TouchableOpacity style={styles.cardBtn}>
//                 <Text style={styles.cardBtnText}>Book</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* REFER */}
//         <View style={styles.referBox}>
//           <View>
//             <Text style={styles.referTitle}>Refer & Earn</Text>
//             <Text style={styles.referSub}>Invite friends to earn rewards</Text>
//           </View>
//           <TouchableOpacity style={styles.inviteBtn}>
//             <Text style={styles.inviteText}>Invite</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 80 }} />
//       </ScrollView>

//       {/* BOTTOM TAB */}
//       <View style={styles.bottomTab}>
//         {["home", "calendar-month", "account-balance-wallet", "chat", "person"].map(
//           (icon, i) => (
//             <MaterialIcons
//               key={i}
//               name={icon}
//               size={26}
//               color={i === 0 ? "#3b82f6" : "#9ca3af"}
//             />
//           )
//         )}
//       </View>
//     </View>
//   );
// };

// export default Landing;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation ,useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const isLoggedIn = false;

const Landing = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const route = useRoute<any>();

const isLoggedIn = route?.params?.isLoggedIn === true;

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* PROFILE + TOOLTIP */}
          <TouchableOpacity
  style={styles.profileWrapper}
  activeOpacity={0.8}
  onPress={() => {
    if (!isLoggedIn) {
      navigation.navigate("AuthScreen");
    }
  }}
>
  <View style={styles.avatar} />

  {!isLoggedIn && (
    <View style={styles.profileTooltip}>
      <Text style={styles.tooltipText}>
        Please Sign up for accessing the services
      </Text>
    </View>
  )}
</TouchableOpacity>



          {/* LOCATION */}
          <View>
            <Text style={styles.locationLabel}>Current Location</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="location-on" size={16} color="#3b82f6" />
              <Text style={styles.locationText}> New York, NY</Text>
            </View>
          </View>
        </View>


        {/* BELL */}
<TouchableOpacity
  style={styles.notificationWrapper}
  onPress={() => navigation.navigate("Notifications")}
  activeOpacity={0.7}
>
  <MaterialIcons name="notifications" size={24} color="#fff" />
  {!isLoggedIn && <View style={styles.notificationDot} />}
</TouchableOpacity>

      </View>

      {/* ================= SEARCH ================= */}
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color="#3b82f6" />
        <TextInput
          placeholder="Find services, jobs, or homes..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
        />
        <MaterialIcons name="mic" size={20} color="#3b82f6" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= BANNER ================= */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.banner}>
            <Text style={styles.badge}>LIMITED OFFER</Text>
            <Text style={styles.bannerTitle}>50% Off Home Cleaning</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ================= CORE SERVICES ================= */}
        <Text style={styles.sectionTitle}>Core Services</Text>

        <View style={styles.grid}>
          {[
            { name: "Housing", icon: "home" },
            { name: "Education", icon: "school" },
            { name: "Freelance", icon: "work" },
            { name: "Buy/Sell", icon: "shopping-bag" },
            { name: "Bills", icon: "receipt" },
            { name: "Wallet", icon: "account-balance-wallet" },
            { name: "Cleaning", icon: "cleaning-services" },
            { name: "More", icon: "grid-view" },
          ].map((item, i) => {
    const isCleaning = item.name === "Cleaning";

    return (
      <TouchableOpacity
        key={i}
        style={styles.gridItem}
        activeOpacity={0.8}
        onPress={() => {
          if (isCleaning) {
            if (!isLoggedIn) {
              navigation.navigate("AuthScreen");   //  guard
            } else {
              navigation.navigate("CleaningServiceScreen"); //  access
            }
          }
        }}
      >
        <View style={styles.gridIcon}>
          <MaterialIcons name={item.icon} size={28} color="#3b82f6" />
        </View>
        <Text style={styles.gridText}>{item.name}</Text>
      </TouchableOpacity>
    );
  })}
</View>

        {/* ================= TRENDING ================= */}
        <View style={styles.trendingHeader}>
          <Text style={styles.sectionTitle}>Trending Near You</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: "https://i.imgur.com/7D7I6dI.png" }}
            style={styles.cardImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Expert Math Tutor</Text>
            <Text style={styles.cardSub}>Education • 0.5 mi away</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.price}>$30/hr</Text>
              <TouchableOpacity style={styles.cardBtn}>
                <Text style={styles.cardBtnText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= REFER & EARN ================= */}
        <View style={styles.referBox}>
          <View>
            <Text style={styles.referTitle}>Refer & Earn</Text>
            <Text style={styles.referSub}>Invite friends to earn rewards</Text>
          </View>
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteText}>Invite</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ================= BOTTOM TAB ================= */}
      <View style={styles.bottomTab}>
        {["home", "calendar-month", "account-balance-wallet", "chat", "person"].map(
          (icon, i) => (
            <MaterialIcons
              key={i}
              name={icon}
              size={26}
              color={i === 0 ? "#3b82f6" : "#9ca3af"}
            />
          )
        )}
      </View>
    </View>
  );
};

export default Landing;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    overflow: "visible",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  /* PROFILE */
  profileWrapper: {
    position: "relative",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#374151",
  },

  // profileTooltip: {
  //   position: "absolute",
  //   top: 48,
  //   // left: 10,
  //   backgroundColor: "#ffffff",
  //   // paddingHorizontal: 12,
  //   // paddingVertical: 8,
  //   borderRadius: 10,
  //   maxWidth: 220,
  //   elevation: 12,
  //   zIndex: 999,
  // },

profileTooltip: {
  position: "absolute",
  bottom:-48,              // above avatar
  // top: 48,                 // below avatar
  left: 0,                 // keep inside screen
  backgroundColor: "#ffffff",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 12,
  minWidth: 180,           //  prevents vertical text
  maxWidth: 240,
  elevation: 10,
  zIndex: 999,
},



  tooltipText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
  },

  /* LOCATION */
  locationLabel: { fontSize: 12, color: "#9ca3af" },
  locationText: { color: "#fff", fontWeight: "600" },

  /* NOTIFICATION */
  notificationWrapper: {
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },

  /* SEARCH */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    margin: 30,
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 8,
  },

  searchInput: { flex: 1, color: "#fff" },

  /* BANNER */
  banner: {
    width: 300,
    height: 150,
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 16,
    marginLeft: 16,
    justifyContent: "flex-end",
  },

  badge: {
    backgroundColor: "#fff",
    color: "#2563eb",
    fontSize: 10,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },

  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 6,
  },

  bannerBtn: {
    backgroundColor: "#1e40af",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  bannerBtnText: { color: "#fff", fontSize: 12 },

  /* CORE SERVICES */
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    margin: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  gridItem: { alignItems: "center", marginBottom: 20, width: "22%" },

  gridIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  gridText: { color: "#e5e7eb", fontSize: 12, marginTop: 6 },

  /* TRENDING */
  trendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  viewAll: { color: "#3b82f6", marginTop: 18 },

  card: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    margin: 16,
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },

  cardImage: { width: 80, height: 80, borderRadius: 12 },

  cardTitle: { color: "#fff", fontWeight: "bold" },
  cardSub: { color: "#9ca3af", fontSize: 12, marginVertical: 4 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: { color: "#3b82f6", fontWeight: "bold" },

  cardBtn: {
    backgroundColor: "#2563eb33",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  cardBtnText: { color: "#3b82f6", fontSize: 12 },

  /* REFER */
  referBox: {
    margin: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  referTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  referSub: { color: "#dbeafe", fontSize: 12 },

  inviteBtn: {
    backgroundColor: "#ffffff33",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },

  inviteText: { color: "#fff", fontWeight: "bold" },

  /* BOTTOM TAB */
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#020617",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
});
