import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrainingScreen from "./TrainingScreen";


interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

const { width } = Dimensions.get("window");

const EducationHome = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<UserProfile | null>(null);

  /* ===== LOAD USER FROM STORAGE ===== */
  useEffect(() => {
    loadUser();
  }, []);
  
  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userProfile");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Failed to load user", error);
    }
  };

  const categories = [
    {
      icon: "school",
      title: "Students",
      color: "#3b82f6",
      screen: "StudentListing",
    },
    {
      icon: "work",
      title: "Internships",
      color: "#8b5cf6",
      screen: "InternshipList",
    },
    {
      icon: "apartment",
      title: "Companies",
      color: "#f97316",
      screen: "CompaniesListingScreen",
    },
    {
      icon: "explore",
      title: "Training",
      color: "#10b981",
      screen: "Training",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#0d1321", "#101622"]} style={styles.container}>
        {/* HEADER */}
        <SafeAreaView edges={["top"]} style={styles.headerSafe}></SafeAreaView>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/11.jpg" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcome}>Welcome back,</Text>
              <Text style={styles.username}>
                {user ? `${user.firstName} ${user.lastName}` : "User"}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bell}>
            <Icon name="notifications" size={22} color="#fff" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9da6b9" />
          <TextInput
            placeholder="Search for colleges, jobs..."
            placeholderTextColor="#9da6b9"
            style={styles.searchInput}
          />
          <Icon name="mic" size={20} color="#1a5cff" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 180 }}
        >
          {/* FEATURED CARD */}
          <View style={styles.featured}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200",
              }}
              style={styles.featuredImage}
            />
            <View style={styles.overlay} />
            <View style={styles.featuredContent}>
              <View style={styles.featuredTag}>
                <Text style={styles.featuredTagText}>FEATURED</Text>
              </View>
              <Text style={styles.featuredTitle}>
                Top University of the Week
              </Text>
              <Text style={styles.featuredSub}>
                Discover the latest computer science programs...
              </Text>
              <Text style={styles.featuredLink}>
                View Details <Icon name="arrow-forward" size={14} />
              </Text>
            </View>
          </View>

          {/* CATEGORIES - UPDATED ICON GRID LAYOUT */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryIconCard}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.screen) {
                    navigation.navigate(item.screen);
                  }
                }}
              >
                <View
                  style={[
                    styles.categoryIconCircle,
                    { backgroundColor: item.color },
                  ]}
                >
                  <Icon name={item.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.categoryIconTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* TRENDING */}
          <Text style={styles.trendingTitle}>Trending Now</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              {
                title: "Google Internship",
                sub: "Software Engineering • Remote",
                tag: "New",
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
              },
              {
                title: "Harvard University",
                sub: "Business Administration",
                tag: "Fall 2024",
                image:
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
              },
            ].map((item, index) => (
              <View key={index} style={styles.trendingCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.trendingImage}
                />
                <View style={styles.trendingBody}>
                  <Text style={styles.trendingName}>{item.title}</Text>
                  <Text style={styles.trendingSub}>{item.sub}</Text>
                  <View style={styles.trendingRow}>
                    <Text style={styles.trendingTag}>{item.tag}</Text>
                    <Text style={styles.apply}>APPLY</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        {/* BOTTOM NAV */}
        <View style={styles.bottomNav}>
          {[
            { icon: "home", label: "Home" },
            { icon: "school", label: "Education", active: true },
            { icon: "credit-card", label: "Finance" },
            { icon: "person", label: "Profile" },
          ].map((item, index) => (
            <View key={index} style={styles.navItem}>
              <Icon
                name={item.icon}
                size={24}
                color={item.active ? "#1a5cff" : "#9da6b9"}
              />
              <Text
                style={[
                  styles.navText,
                  item.active && { color: "#1a5cff" },
                ]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EducationHome;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0d1321" },
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  welcome: { color: "#9da6b9", fontSize: 12 },
  username: { color: "#fff", fontSize: 18, fontWeight: "700" },
  bell: { position: "relative" },
  dot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },

  searchBox: {
    marginHorizontal: 16,
    height: 48,
    backgroundColor: "#1c1f27",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 15 },

  featured: {
    margin: 16,
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
  },
  featuredImage: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  featuredContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  featuredTag: {
    backgroundColor: "#1a5cff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  featuredTagText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  featuredTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  featuredSub: { color: "#d1d5db", fontSize: 13, marginTop: 4 },
  featuredLink: { color: "#fff", fontSize: 14, marginTop: 8 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  viewAll: { color: "#1a5cff", fontSize: 14 },

  // NEW: Category Icon Grid Styles
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 20,
  },
  categoryIconCard: {
    alignItems: "center",
    width: (width - 32 - 60) / 4, // 4 items per row with gaps
  },
  categoryIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryIconTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },

  trendingTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    margin: 16,
  },
  trendingCard: {
    width: 260,
    marginLeft: 16,
    backgroundColor: "#1c1f27",
    borderRadius: 16,
    overflow: "hidden",
  },
  trendingImage: {
    width: "100%",
    height: 120,
  },
  trendingBody: { padding: 12 },
  trendingName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  trendingSub: { color: "#9da6b9", fontSize: 12, marginTop: 4 },
  trendingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  trendingTag: {
    backgroundColor: "#22c55e30",
    color: "#22c55e",
    fontSize: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  apply: { color: "#1a5cff", fontSize: 12, fontWeight: "700" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: "#1c1f27",
    borderTopWidth: 1,
    borderTopColor: "#2a3140",
    flexDirection: "row",
    paddingBottom: 12,
  },
  headerSafe: {
    backgroundColor: "#0d1321",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  navText: { color: "#9da6b9", fontSize: 11 },
});