import React, { useState, useEffect, useRef } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  location?: string;
}

const Landing = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // ALL useRef HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONS
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const trendingScrollRef = useRef<ScrollView>(null);
  const trendingCurrentIndex = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  /* ================= STATE ================= */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<string>("New York, NY");
  const [userName, setUserName] = useState<string>("");
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Placeholder texts array
  const placeholders = [
    "Find Housing/Cleaning services...",
    "Find Jobs...",
    "Find Swachify Products...",
    "Find Education & Courses...",
    "Find Freelance services...",
    "Find Buy/Sell items...",
    "Find Health Care services...",
    "Find Raw Materials...",
    "Find Just Ride services...",
  ];

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

        if (parsed.location) {
          setUserLocation(parsed.location);
        }

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

  /* ================= ANIMATED PLACEHOLDER EFFECT - FIXED ================= */
  useEffect(() => {
    // Don't animate when search is focused or has text
    if (isSearchFocused || searchQuery) return;

    const animatePlaceholder = () => {
      // Animate out (move up and fade)
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: -20,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change placeholder to next one
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);

        // Reset position immediately (no animation)
        translateYAnim.setValue(20);
        fadeAnim.setValue(0);

        // Small delay before animating in
        setTimeout(() => {
          // Animate in (move to position and fade in)
          Animated.parallel([
            Animated.timing(translateYAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }, 50);
      });
    };

    // Longer interval to avoid rapid cycling
    const interval = setInterval(animatePlaceholder, 3500);
    return () => clearInterval(interval);
  }, [placeholders.length, fadeAnim, translateYAnim, isSearchFocused, searchQuery]);

  /* ================= SEARCH HANDLER ================= */
  const handleSearch = () => {
    if (!isLoggedIn) {
      navigation.navigate("AuthScreen");
      return;
    }

    if (searchQuery.trim()) {
      // You can navigate to a search results screen or perform search logic here
      console.log("Searching for:", searchQuery);
      // navigation.navigate("SearchResults", { query: searchQuery });
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
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
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
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
      route: "RawMaterial",
    },
  ];

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length;

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
    {
      id: "4",
      title: "Car Interior Cleaning",
      category: "Housing / Cleaning",
      distance: "0.8 km away",
      price: "₹799",
      action: "Book",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600",
    },
    {
      id: "5",
      title: "Kitchen Deep Cleaning",
      category: "Housing / Cleaning",
      distance: "0.9 km away",
      price: "₹1,199",
      action: "Book",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600",
    },
    {
      id: "6",
      title: "Plumber – Pipe Repair",
      category: "Freelance",
      distance: "0.5 km away",
      price: "₹350",
      action: "Call",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600",
    },
    {
      id: "7",
      title: "Office Commercial Cleaning",
      category: "Housing / Cleaning",
      distance: "1.5 km away",
      price: "₹2,999",
      action: "Book",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
    },
    {
      id: "8",
      title: "Doctor Consultation",
      category: "Health Care",
      distance: "1.8 km away",
      price: "₹500",
      action: "Book",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600",
    },
  ];

  /* ================= AUTO-SCROLL FOR TRENDING ITEMS - FIXED ================= */
  useEffect(() => {
    if (!trendingServices.length) return;

    const interval = setInterval(() => {
      trendingCurrentIndex.current = (trendingCurrentIndex.current + 1) % trendingServices.length;

      // Calculate the exact scroll position
      // Each card height: 80 (image) + 24 (padding) + 14 (margin) = 118px
      const CARD_HEIGHT = 118;
      
      trendingScrollRef.current?.scrollTo({
        y: trendingCurrentIndex.current * CARD_HEIGHT,
        animated: true,
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [trendingServices.length]);

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

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setShowRoleMenu((prev) => !prev)}
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 13,
                marginRight: 2,
                fontWeight: "500",
              }}
            >
              Select Type
            </Text>
            <MaterialIcons name="expand-more" size={26} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <MaterialIcons name="shopping-cart" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationWrapper}
            onPress={() => navigation.navigate("Notifications")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="notifications" size={24} color={colors.text} />
            {!isLoggedIn && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>

        {showRoleMenu && (
          <View style={styles.roleMenu}>
            <TouchableOpacity
              style={styles.roleItem}
              onPress={() => {
                setShowRoleMenu(false);
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

      {/* ================= SEARCH WITH ANIMATED PLACEHOLDER ================= */}
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color="#3b82f6" />
        <View style={{ flex: 1, overflow: "hidden", height: 20, justifyContent: "center" }}>
          {/* Show animated placeholder only when input is empty and not focused */}
          {!searchQuery && !isSearchFocused && (
            <Animated.Text
              style={[
                styles.searchPlaceholder,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
              pointerEvents="none"
            >
              {placeholders[placeholderIndex]}
            </Animated.Text>
          )}
          {/* TextInput for actual search functionality */}
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => {
              if (!isLoggedIn) {
                navigation.navigate("AuthScreen");
              } else {
                setIsSearchFocused(true);
              }
            }}
            onBlur={() => setIsSearchFocused(false)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity onPress={handleSearch}>
          <MaterialIcons name="mic" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ================= BANNER ================= */}
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
              <Image
                source={{ uri: item.image }}
                style={styles.bannerImage}
              />
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
                      navigation.navigate("JustRideMultiStop");
                      break;

                    case "Health Care":
                      navigation.navigate("Health");
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

        {/* ================= TRENDING - WITH FIXED AUTOSCROLL ================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Near You</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Marketplace")}>
            <Text style={[styles.viewAllText, { marginTop: 10 }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* FIXED CONTAINER WITH HEIGHT */}
        <View style={styles.trendingContainer}>
          <ScrollView
            ref={trendingScrollRef}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          >
            {trendingServices.map((item) => {
              return (
                <View
                  key={item.id}
                  style={styles.card}
                >
                  <Image
                    source={{ uri: item.image }}
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
                </View>
              );
            })}
          </ScrollView>
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

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    safeHeader: {
      backgroundColor: colors.surface,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    profileWrapper: {
      position: "relative",
    },

    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    avatarText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },

    profileTooltip: {
      position: "absolute",
      bottom: -52,
      left: 0,
      backgroundColor: colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      minWidth: 180,
      elevation: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      zIndex: 999,
    },

    tooltipText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "500",
    },

    locationLabel: {
      fontSize: 11,
      color: colors.subText,
      letterSpacing: 0.5,
    },

    locationText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

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
      backgroundColor: colors.danger,
    },

    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 24,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },

    searchPlaceholder: {
      color: "#9ca3af",
      fontSize: 14,
      position: "absolute",
    },

    searchInput: {
      color: colors.text,
      fontSize: 14,
      flex: 1,
      padding: 0,
      margin: 0,
      height: 20,
    },

    banner: {
      width: 300,
      height: 160,
      borderRadius: 24,
      marginLeft: 16,
      overflow: "hidden",
    },

    bannerImage: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 24,
    },

    bannerOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      padding: 16,
      backgroundColor: "rgba(0,0,0,0.35)",
      borderRadius: 24,
    },

    badge: {
      backgroundColor: "#ffffff",
      color: colors.primary,
      fontSize: 10,
      fontWeight: "700",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      alignSelf: "flex-start",
    },

    bannerTitle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "800",
      marginVertical: 6,
    },

    bannerBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 14,
      alignSelf: "flex-start",
    },

    bannerBtnText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "700",
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      marginHorizontal: 16,
      marginVertical: 12,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },

    viewAllText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "700",
      marginRight: 16,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      marginTop: 8,
    },

    gridItem: {
      alignItems: "center",
      marginBottom: 22,
      width: "25%",
    },

    gridIcon: {
      width: 56,
      height: 56,
      backgroundColor: colors.card,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    gridText: {
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
      marginTop: 8,
      textAlign: "center",
      lineHeight: 14,
      height: 28,
    },

    // NEW STYLE FOR TRENDING CONTAINER
    trendingContainer: {
      height: 360,
      overflow: "hidden",
      marginBottom: 16,
    },

    card: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 14,
      borderRadius: 18,
      padding: 12,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardImage: {
      width: 80,
      height: 80,
      borderRadius: 14,
    },

    cardTitle: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 14,
    },

    cardSub: {
      color: colors.subText,
      fontSize: 12,
      marginVertical: 4,
    },

    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    price: {
      color: colors.primary,
      fontWeight: "800",
      fontSize: 15,
    },

    cardBtn: {
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
    },

    cardBtnText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    referBox: {
      margin: 16,
      padding: 18,
      borderRadius: 22,
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    referTitle: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 16,
    },

    referSub: {
      color: "#e0e7ff",
      fontSize: 12,
      marginTop: 2,
    },

    inviteBtn: {
      backgroundColor: "#ffffff33",
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 14,
    },

    inviteText: {
      color: "#fff",
      fontWeight: "700",
    },

    bottomTab: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 12,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    roleMenu: {
      position: "absolute",
      top: 70,
      right: 16,
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 8,
      width: 150,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 12,
      zIndex: 999,
    },

    roleItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },

    roleText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
  });  