
import React, { useState, useEffect,useRef } from "react";
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
import { Animated } from "react-native";


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
  const verticalScrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;


  /* ================= STATE ================= */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<string>("New York, NY");
  const [userName, setUserName] = useState<string>("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
const scrollRef = useRef<ScrollView>(null);
const currentIndex = useRef(0);
const [showRoleMenu, setShowRoleMenu] = useState(false);



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
  /* ================= BANNERS ================= */

const banners = [
  {
    id: "1",
    badge: "LIMITED OFFER",
    title: "50% Off Home Cleaning",
    action: "Book Now",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
    route: "CleaningCategory",
  },
  {
    id: "2",
    badge: "NEW",
    title: "Swachify Eco Products",
    action: "Shop Now",
    image: require("../../assets/pack5.jpg"),
    route: "ProductScreen",
  },
  {
    id: "3",
    badge: "TRENDING",
    title: "Education & Skill Courses",
    action: "Explore",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    route: "EducationHome",
  },
  {
    id: "4",
    badge: "HOT DEAL",
    title: "Buy & Sell Essentials",
    action: "Browse",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
    route: "Marketplace",
  },
{
  id: "5",
  badge: "INDUSTRY",
  title: "Raw Materials Marketplace",
  action: "Know More",
  image: require("../../assets/Raw8.jpg"),
  route: "RawMaterial",
},

];


useEffect(() => {
  if (!banners.length) return;

  const interval = setInterval(() => {
    currentIndex.current =
      (currentIndex.current + 1) % banners.length;

    scrollRef.current?.scrollTo({
      x: currentIndex.current * 300,
      animated: true,
    });
  }, 3000);

  return () => clearInterval(interval);
}, [banners.length]);

const trendingServices = [
  {
    id: "1",
    title: "Bathroom Deep Cleaning",
    category: "Housing / Cleaning",
    distance: "0.4 km away",
    price: "₹899",
    action: "Book",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  },
  {
    id: "2",
    title: "Math Home Tutor (Class 10)",
    category: "Education",
    distance: "0.7 km away",
    price: "₹500/hr",
    action: "Book",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
  },
  {
    id: "3",
    title: "Electrician – Power Issue",
    category: "Freelance",
    distance: "Nearby",
    price: "QUOTE",
    action: "Call",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=600",
  },
  // {
  //   id: "4",
  //   title: "AC Gas Refill",
  //   category: "Housing / Cleaning",
  //   distance: "1.1 km away",
  //   price: "₹1,299",
  //   action: "Book",
  //   image: "https://images.unsplash.com/photo-1597007097974-31b78c71c0e4?w=600",
  // },
  // {
  //   id: "5",
  //   title: "Second-hand Refrigerator",
  //   category: "Buy / Sell",
  //   distance: "1.8 km away",
  //   price: "₹6,500",
  //   action: "View",
  //   image: "https://images.unsplash.com/photo-1581574208520-6a6a1d7c6b2c?w=600",
  // },
  // {
  //   id: "6",
  //   title: "Physiotherapy Home Visit",
  //   category: "Health Care",
  //   distance: "0.9 km away",
  //   price: "₹1,200",
  //   action: "Book",
  //   image: "https://images.unsplash.com/photo-1580281658629-1e0c8c8b72c7?w=600",
  // },
];

// const scrollY = useRef(new Animated.Value(0)).current;


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
        {/* <TouchableOpacity
          style={styles.notificationWrapper}
          onPress={() => navigation.navigate("Notifications")}
          activeOpacity={0.7}
        >
          <MaterialIcons name="notifications" size={24} color="#fff" />
          {!isLoggedIn && <View style={styles.notificationDot} />}
        </TouchableOpacity> */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>

  {/* ROLE DROPDOWN ICON */}
  {/* <TouchableOpacity
    onPress={() => setShowRoleMenu((prev) => !prev)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="expand-more" size={26} color="#fff" />
  </TouchableOpacity> */}

  {/* <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
  <MaterialIcons name="shopping-cart" size={24} color="#fff" />
</TouchableOpacity> */}

  <TouchableOpacity
  onPress={() => setShowRoleMenu((prev) => !prev)}
  activeOpacity={0.7}
  style={{ flexDirection: "row", alignItems: "center" }}
>
  <Text
    style={{
      color: "#fff",
      fontSize: 13,
      marginRight: 2,
      fontWeight: "500",
    }}
  >
    Select Type
  </Text>
  <MaterialIcons name="expand-more" size={26} color="#fff" />
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate("Cart")}>
  <MaterialIcons name="shopping-cart" size={24} color="#fff" />
</TouchableOpacity>

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
  {showRoleMenu && (
    <View style={styles.roleMenu}>
      <TouchableOpacity
        style={styles.roleItem}
        onPress={() => {
          setShowRoleMenu(false);
          // Customer = stay on Landing
        }}
      >
        <Text style={styles.roleText}>Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleItem}
        onPress={() => {
          setShowRoleMenu(false);
          navigation.navigate("EmployeeHomeScreen");
        }}
      >
        <Text style={styles.roleText}>Employee</Text>
      </TouchableOpacity>
    </View>
  )}

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

      {/* <ScrollView showsVerticalScrollIndicator={false}>
       */}

       <Animated.ScrollView
  showsVerticalScrollIndicator={false}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )}
  scrollEventThrottle={16}
>

        {/* ================= BANNER ================= */}

        {/* <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  ref={scrollRef}
>
  {banners.map((item) => (
    <View key={item.id} style={styles.banner}>
      <Text style={styles.badge}>{item.badge}</Text>
      <Text style={styles.bannerTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.bannerBtn}>
        <Text style={styles.bannerBtnText}>{item.action}</Text>
      </TouchableOpacity>
    </View>
  ))}
</ScrollView> */}

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  ref={scrollRef}
>
  {banners.map((item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.banner}
      activeOpacity={0.9}
      onPress={() => {
        if (!isLoggedIn) {
          navigation.navigate("AuthScreen");
          return;
        }
        navigation.navigate(item.route);
      }}
    >
      {/* Background Image */}
    <Image
  source={
    typeof item.image === 'string' 
      ? { uri: item.image } 
      : item.image
  }
  style={styles.bannerImage}
/>
      {/* Overlay */}
      <View style={styles.bannerOverlay}>
        <Text style={styles.badge}>{item.badge}</Text>
        <Text style={styles.bannerTitle}>{item.title}</Text>

        <TouchableOpacity
          style={styles.bannerBtn}
          onPress={() => {
            if (!isLoggedIn) {
              navigation.navigate("AuthScreen");
              return;
            }
            navigation.navigate(item.route);
          }}
        >
          <Text style={styles.bannerBtnText}>{item.action}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>



        {/* ================= CORE SERVICES ================= */}
        {/* <Text style={styles.sectionTitle}>Core Services</Text> */}
        <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Core Services</Text>
</View>

        <View style={styles.grid}>
  {[
    { name: "Housing / Cleaning", icon: "home" },
    { name: "Education", icon: "school" },
    { name: "Freelance", icon: "work" },
    { name: "Buy/Sell", icon: "shopping-bag" },
    { name: "Swachify Products", icon: "shopping-bag" },
    { name: "Health Care", icon: "local-hospital" },
    { name: "Raw Materials", icon: "factory" },
    { name: "Just Ride", icon: "local-shipping" },
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

            case "Freelance":
              navigation.navigate("Freelancer");
              break;

            case "Buy/Sell":
              navigation.navigate("Marketplace");
              break;

            case "Swachify Products":
              navigation.navigate("ProductScreen");
              break;

            case "Raw Materials":
              navigation.navigate("RawMaterial");
              break;

            case "Just Ride":
              navigation.navigate("Transport");
              break;

            case "Health Care":
              // future screen
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

<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Trending Near You</Text>
  <TouchableOpacity
  onPress={() => navigation.navigate("Marketplace")}
>
  <Text style={[styles.viewAllText,{marginTop:10}]}>View All</Text>
</TouchableOpacity>
</View>


{trendingServices.map((item, index) => {
  const inputRange = [
    (index - 1) * 120,
    index * 120,
    (index + 1) * 120,
  ];

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  const translateY = scrollY.interpolate({
    inputRange,
    outputRange: [20, 0, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      key={item.id}
      style={[
        styles.card,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
     <Image 
  source={
    typeof item.image === 'string' 
      ? { uri: item.image } 
      : item.image
  } 
  style={styles.cardImage} 
/>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>
          {item.category} • {item.distance}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>{item.price}</Text>
          <TouchableOpacity style={styles.cardBtn}>
            <Text style={styles.cardBtnText}>{item.action}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
})}


    
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
    
      

      </Animated.ScrollView>

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

  gridItem: { alignItems: "center", marginBottom: 20, width: "25%" },

  gridIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  gridText: {
  color: "#e5e7eb",
  fontSize: 12,
  marginTop: 6,
  textAlign: "center",
  lineHeight: 14,
  height: 28,          
},


  /* TRENDING */
  // trendingHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   paddingHorizontal: 16,
  // },

  // viewAll: { color: "#3b82f6", marginTop: 18 },

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
  moreGrid: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 10,
  marginBottom: 20,
},

sectionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

viewAllText: {
  color: "#3b82f6",
  fontSize: 14,
  fontWeight: "600",
  marginRight: 16,
},

bannerImage: {
  ...StyleSheet.absoluteFillObject,
  borderRadius: 20,
},

bannerOverlay: {
  flex: 1,
  justifyContent: "flex-end",
  padding: 16,
  backgroundColor: "rgba(0,0,0,0.45)",
  borderRadius: 20,
},
roleMenu: {
  position: "absolute",
  top: 70,
  right: 16,
  backgroundColor: "#1e293b",
  borderRadius: 12,
  paddingVertical: 8,
  width: 140,
  zIndex: 999,
  elevation: 10,
},

roleItem: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

roleText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "500",
},



});