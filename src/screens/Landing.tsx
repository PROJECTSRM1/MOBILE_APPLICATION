

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
// import { useNavigation ,useRoute } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// const isLoggedIn = false;

// const Landing = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<any>>();

//   const route = useRoute<any>();

// const isLoggedIn = route?.params?.isLoggedIn === true;

//   return (
//     <View style={styles.container}>
//       {/* ================= HEADER ================= */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           {/* PROFILE + TOOLTIP */}
//           <TouchableOpacity
//   style={styles.profileWrapper}
//   activeOpacity={0.8}
//   onPress={() => {
//     if (!isLoggedIn) {
//       navigation.navigate("AuthScreen");
//     }
//   }}
// >
//   <View style={styles.avatar} />

//   {!isLoggedIn && (
//     <View style={styles.profileTooltip}>
//       <Text style={styles.tooltipText}>
//         Please Sign up for accessing the services
//       </Text>
//     </View>
//   )}
// </TouchableOpacity>



//           {/* LOCATION */}
//           <View>
//             <Text style={styles.locationLabel}>Current Location</Text>
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <MaterialIcons name="location-on" size={16} color="#3b82f6" />
//               <Text style={styles.locationText}> New York, NY</Text>
//             </View>
//           </View>
//         </View>


//         {/* BELL */}
// <TouchableOpacity
//   style={styles.notificationWrapper}
//   onPress={() => navigation.navigate("Notifications")}
//   activeOpacity={0.7}
// >
//   <MaterialIcons name="notifications" size={24} color="#fff" />
//   {!isLoggedIn && <View style={styles.notificationDot} />}
// </TouchableOpacity>

//       </View>

//       {/* ================= SEARCH ================= */}
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
//         {/* ================= BANNER ================= */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <View style={styles.banner}>
//             <Text style={styles.badge}>LIMITED OFFER</Text>
//             <Text style={styles.bannerTitle}>50% Off Home Cleaning</Text>
//             <TouchableOpacity style={styles.bannerBtn}>
//               <Text style={styles.bannerBtnText}>Book Now</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         {/* ================= CORE SERVICES ================= */}
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
//           ].map((item, i) => {
//     const isCleaning = item.name === "Cleaning";

//     return (
//       <TouchableOpacity
//         key={i}
//         style={styles.gridItem}
//         activeOpacity={0.8}
//         onPress={() => {
//           if (isCleaning) {
//             if (!isLoggedIn) {
//               navigation.navigate("AuthScreen");   //  guard
//             } else {
//               navigation.navigate("CleaningServiceScreen"); //  access
//             }
//           }
//         }}
//       >
//         <View style={styles.gridIcon}>
//           <MaterialIcons name={item.icon} size={28} color="#3b82f6" />
//         </View>
//         <Text style={styles.gridText}>{item.name}</Text>
//       </TouchableOpacity>
//     );
//   })}
// </View>

//         {/* ================= TRENDING ================= */}
//         <View style={styles.trendingHeader}>
//           <Text style={styles.sectionTitle}>Trending Near You</Text>
//           <Text style={styles.viewAll}>View All</Text>
//         </View>

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

//         {/* ================= REFER & EARN ================= */}
//         <View style={styles.referBox}>
//           <View>
//             <Text style={styles.referTitle}>Refer & Earn</Text>
//             <Text style={styles.referSub}>Invite friends to earn rewards</Text>
//           </View>
//           <TouchableOpacity style={styles.inviteBtn}>
//             <Text style={styles.inviteText}>Invite</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 90 }} />
//       </ScrollView>

//       {/* ================= BOTTOM TAB ================= */}
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

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0f172a" },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//     alignItems: "center",
//     overflow: "visible",
//   },

//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },

//   /* PROFILE */
//   profileWrapper: {
//     position: "relative",
//   },

//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#374151",
//   },

//   // profileTooltip: {
//   //   position: "absolute",
//   //   top: 48,
//   //   // left: 10,
//   //   backgroundColor: "#ffffff",
//   //   // paddingHorizontal: 12,
//   //   // paddingVertical: 8,
//   //   borderRadius: 10,
//   //   maxWidth: 220,
//   //   elevation: 12,
//   //   zIndex: 999,
//   // },

// profileTooltip: {
//   position: "absolute",
//   bottom:-48,              // above avatar
//   // top: 48,                 // below avatar
//   left: 0,                 // keep inside screen
//   backgroundColor: "#ffffff",
//   paddingHorizontal: 14,
//   paddingVertical: 10,
//   borderRadius: 12,
//   minWidth: 180,           //  prevents vertical text
//   maxWidth: 240,
//   elevation: 10,
//   zIndex: 999,
// },



//   tooltipText: {
//     color: "#000",
//     fontSize: 12,
//     fontWeight: "500",
//   },

//   /* LOCATION */
//   locationLabel: { fontSize: 12, color: "#9ca3af" },
//   locationText: { color: "#fff", fontWeight: "600" },

//   /* NOTIFICATION */
//   notificationWrapper: {
//     position: "relative",
//   },

//   notificationDot: {
//     position: "absolute",
//     top: -2,
//     right: -2,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "red",
//   },

//   /* SEARCH */
//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1e293b",
//     margin: 30,
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     gap: 8,
//   },

//   searchInput: { flex: 1, color: "#fff" },

//   /* BANNER */
//   banner: {
//     width: 300,
//     height: 150,
//     backgroundColor: "#2563eb",
//     borderRadius: 20,
//     padding: 16,
//     marginLeft: 16,
//     justifyContent: "flex-end",
//   },

//   badge: {
//     backgroundColor: "#fff",
//     color: "#2563eb",
//     fontSize: 10,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//     alignSelf: "flex-start",
//   },

//   bannerTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 6,
//   },

//   bannerBtn: {
//     backgroundColor: "#1e40af",
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     alignSelf: "flex-start",
//   },

//   bannerBtnText: { color: "#fff", fontSize: 12 },

//   /* CORE SERVICES */
//   sectionTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     margin: 16,
//   },

//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-around",
//   },

//   gridItem: { alignItems: "center", marginBottom: 20, width: "22%" },

//   gridIcon: {
//     width: 56,
//     height: 56,
//     backgroundColor: "#1e293b",
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   gridText: { color: "#e5e7eb", fontSize: 12, marginTop: 6 },

//   /* TRENDING */
//   trendingHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//   },

//   viewAll: { color: "#3b82f6", marginTop: 18 },

//   card: {
//     flexDirection: "row",
//     backgroundColor: "#1e293b",
//     margin: 16,
//     borderRadius: 16,
//     padding: 12,
//     gap: 12,
//   },

//   cardImage: { width: 80, height: 80, borderRadius: 12 },

//   cardTitle: { color: "#fff", fontWeight: "bold" },
//   cardSub: { color: "#9ca3af", fontSize: 12, marginVertical: 4 },

//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   price: { color: "#3b82f6", fontWeight: "bold" },

//   cardBtn: {
//     backgroundColor: "#2563eb33",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },

//   cardBtnText: { color: "#3b82f6", fontSize: 12 },

//   /* REFER */
//   referBox: {
//     margin: 16,
//     padding: 16,
//     borderRadius: 18,
//     backgroundColor: "#2563eb",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   referTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   referSub: { color: "#dbeafe", fontSize: 12 },

//   inviteBtn: {
//     backgroundColor: "#ffffff33",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },

//   inviteText: { color: "#fff", fontWeight: "bold" },

//   /* BOTTOM TAB */
//   bottomTab: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#020617",
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 12,
//   },
// });





import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  location?: string;
}

const Landing = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();

  /* ================= STATE ================= */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<string>("New York, NY");
  const [userName, setUserName] = useState<string>("");

  /* ================= LOAD USER DATA ================= */
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const checkLoginStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userProfile");

      if (storedUser) {
        const parsed: UserProfile = JSON.parse(storedUser);
        setIsLoggedIn(true);

        // Set user location if available
        if (parsed.location) {
          setUserLocation(parsed.location);
        }

        // Set user name for display
        if (parsed.firstName) {
          setUserName(parsed.firstName);
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserLocation("New York, NY");
      }
    } catch (err) {
      console.log("Error loading user data:", err);
      setIsLoggedIn(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <SafeAreaView edges={["top"]} style={styles.safeHeader}></SafeAreaView>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* PROFILE + TOOLTIP */}
          <TouchableOpacity
            style={styles.profileWrapper}
            activeOpacity={0.8}
            onPress={() => {
              if (!isLoggedIn) {
                navigation.navigate("AuthScreen");
              } else {
                navigation.navigate("ProfileInformation");
              }
            }}
          >
            <View style={styles.avatar}>
              {isLoggedIn && userName ? (
                <Text style={styles.avatarText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              ) : null}
            </View>

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
              <Text style={styles.locationText}> {userLocation}</Text>
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
            { name: "Housing / Cleaning", icon: "home" },
            { name: "Education", icon: "school" },
            { name: "Freelance", icon: "work" },
            { name: "Buy/Sell", icon: "shopping-bag" },
            { name: "Wallet", icon: "account-balance-wallet" },
            { name: "More", icon: "grid-view" },
          ].map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={styles.gridItem}
                activeOpacity={0.8}
                onPress={() => {
                  if (!isLoggedIn) {
                    navigation.navigate("AuthScreen");
                    return;
                  }

                  switch (item.name) {
                    case "Housing / Cleaning":
                      navigation.navigate("CleaningCategory");
                      break;

                    case "Education":
                      navigation.navigate("EducationHome");
                      break;

                    default:
                      break;
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

        <View style={styles.card}>
          <Image
            source={{ uri: "https://i.imgur.com/7D7I6dI.png" }}
            style={styles.cardImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Modern Studio Apt</Text>
            <Text style={styles.cardSub}>Housing • DownTown</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.price}>$1200/mo</Text>
              <TouchableOpacity style={styles.cardBtn}>
                <Text style={styles.cardBtnText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: "https://i.imgur.com/7D7I6dI.png" }}
            style={styles.cardImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Licensed Electrician</Text>
            <Text style={styles.cardSub}>Services • Available Now</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.price}>QUOTE</Text>
              <TouchableOpacity style={styles.cardBtn}>
                <Text style={styles.cardBtnText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: "https://i.imgur.com/7D7I6dI.png" }}
            style={styles.cardImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Licensed Electrician</Text>
            <Text style={styles.cardSub}>Services • Available Now</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.price}>QUOTE</Text>
              <TouchableOpacity style={styles.cardBtn}>
                <Text style={styles.cardBtnText}>Call</Text>
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
            <TouchableOpacity
              key={i}
              onPress={() => {
                if (i === 4) {
                  if (!isLoggedIn) {
                    navigation.navigate("AuthScreen");
                  } else {
                    navigation.navigate("ProfileInformation");
                  }
                }
              }}
            >
              <MaterialIcons
                name={icon}
                size={26}
                color={i === 0 ? "#3b82f6" : "#9ca3af"}
              />
            </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  profileTooltip: {
    position: "absolute",
    bottom: -48,
    left: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 180,
    maxWidth: 240,
    elevation: 10,
    zIndex: 999,
  },

  safeHeader: {
    backgroundColor: "#0f172a",
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

  gridItem: { alignItems: "center", marginBottom: 20, width: "32%" },

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