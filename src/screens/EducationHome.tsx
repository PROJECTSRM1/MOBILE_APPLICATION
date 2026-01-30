import React, { useEffect, useState, useRef } from "react";

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
import { useTheme } from "../context/ThemeContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}
interface Student {
  id: number;
  name: string;
  program: string;
  avatar: string;
  academicScore: number;
  rating: number;
  status: "active" | "completed";
  shift: string;
  skills: string[];
}
interface TrendingStudentAPI {
  full_name: string;
  institute: string;
  degree: string;
  attendance_percentage: number;
  active: boolean;
}

interface TrendingStudentUI {
  id: number;
  name: string;
  program: string;
  academicScore: number;
  status: "active" | "completed";
  avatar: string;
  rating: number;
  shift: string;
}

const { width } = Dimensions.get("window");

const EducationHome = () => {
  const [trendingStudents, setTrendingStudents] = useState<TrendingStudentUI[]>([]);
const [loadingTrending, setLoadingTrending] = useState(true);

  const trendingScrollRef = useRef<ScrollView>(null);
  const trendingCurrentIndex = useRef(0);

  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchText, setSearchText] = useState("");
  const filteredTrendingStudents = trendingStudents.filter(
  (student) =>
    student.name.toLowerCase().includes(searchText.toLowerCase()) ||
    student.program.toLowerCase().includes(searchText.toLowerCase())
);


  const [showAllTrending, setShowAllTrending] = useState(false); // NEW

  /* ===== LOAD USER FROM STORAGE ===== */
  useEffect(() => {
  loadUser();
  fetchTrendingStudents();
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
const fetchTrendingStudents = async () => {
  try {
    setLoadingTrending(true);

    const response = await fetch(
      "https://swachify-india-be-1-mcrb.onrender.com/internship/application/trending"
    );

    const data: TrendingStudentAPI[] = await response.json();

    const mapped: TrendingStudentUI[] = data.map((item, index) => ({
  id: index + 1,
  name: item.full_name,
  program: `${item.degree} • ${item.institute}`,
  academicScore: item.attendance_percentage,
  status: item.active ? "active" : "completed",
  avatar: `https://i.pravatar.cc/150?img=${index + 20}`,

  // Added fields
  rating: Number((4 + Math.random()).toFixed(1)), // 4.0 – 5.0
  shift: item.active ? "10:00 AM - 07:00 PM" : "Completed",
}));


    setTrendingStudents(mapped);
  } catch (err) {
    console.log("Trending students API error", err);
  } finally {
    setLoadingTrending(false);
  }
};

  useEffect(() => {
  if (!filteredTrendingStudents.length) return;

  const CARD_HEIGHT = 96;

  const interval = setInterval(() => {
    trendingCurrentIndex.current =
      (trendingCurrentIndex.current + 1) %
      filteredTrendingStudents.length;

    trendingScrollRef.current?.scrollTo({
      y: trendingCurrentIndex.current * CARD_HEIGHT,
      animated: true,
    });
  }, 1800);

  return () => clearInterval(interval);
}, [filteredTrendingStudents.length]);


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
    {
      icon: "account-balance",
      title: "Institution",
      color: "#ec4899",
      screen: "InstitutionRegistrationStep1",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          colors.gradientStart ?? colors.background,
          colors.gradientEnd ?? colors.surface,
        ]}
        style={styles.container}
      >
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
          <TouchableOpacity
            style={styles.bell}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Icon name="notifications-none" size={28} color={colors.text} />
            {/* <View style={styles.dot} /> */}
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9da6b9" />
          <TextInput
            placeholder="Search for colleges, jobs..."
            placeholderTextColor="#9da6b9"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
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
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Explore Categories
            </Text>
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
                <Text style={styles.categoryIconTitle}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>


          {/* TRENDING */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 16 }}>
            <Text style={styles.trendingTitle}>Trending Now</Text>
            <TouchableOpacity onPress={() => setShowAllTrending(!showAllTrending)}>
              <Text style={{ color: colors.primary, fontSize: 14 }}>
                {showAllTrending ? "Show Less" : "View All"}
              </Text>
            </TouchableOpacity>
          </View>


          <View style={{ height: 380, overflow: "hidden", paddingHorizontal: 16 }}>
            <ScrollView
              ref={trendingScrollRef}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            >

              {(showAllTrending ? filteredTrendingStudents : filteredTrendingStudents.slice(0, 4)).map((student) => (
                <TouchableOpacity
                  key={student.id}
                  style={styles.trendingRowCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("CandidateProfile", {
                      student: student,
                    })
                  }
                >
                  <Image source={{ uri: student.avatar }} style={styles.trendingAvatar} />
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingName}>{student.name}</Text>
                    <Text style={styles.trendingSub}>{student.program}</Text>
                    <Text style={styles.trendingScore}>{student.academicScore}% Academic Score</Text>
                    <View style={styles.trendingFooter}>
                      <Text style={styles.rating}>⭐ {student.rating}</Text>
                      <Text style={[styles.status, student.status === "active" ? styles.active : styles.completed]}>
                        {student.status.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.shift}>{student.shift}</Text>
                  </View>
                </TouchableOpacity>

              ))}

            </ScrollView>
          </View>




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

const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: { flex: 1 },

    /* ================= HEADER ================= */
    headerSafe: {
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      alignItems: "center",
      backgroundColor: colors.background,
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },

    welcome: {
      color: colors.subText,
      fontSize: 12,
    },

    username: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    bell: { position: "relative" },

    dot: {
      position: "absolute",
      top: 2,
      right: 2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.danger ?? "#ef4444",
    },

    /* ================= SEARCH ================= */
    searchBox: {
      marginHorizontal: 16,
      height: 48,
      backgroundColor: colors.surface,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
    },

    /* ================= FEATURED ================= */
    featured: {
      margin: 16,
      height: 180,
      borderRadius: 20,
      overflow: "hidden",
    },

    featuredImage: {
      width: "100%",
      height: "100%",
    },

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
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: "flex-start",
    },

    featuredTagText: {
      color: "#ffffff",
      fontSize: 11,
      fontWeight: "700",
    },

    featuredTitle: {
      color: "#ffffff",
      fontSize: 20,
      fontWeight: "700",
      marginTop: 8,
    },

    featuredSub: {
      color: "#e5e7eb",
      fontSize: 13,
      marginTop: 4,
    },

    featuredLink: {
      color: "#ffffff",
      fontSize: 14,
      marginTop: 8,
    },

    /* ================= SECTION ================= */
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 16,
      marginBottom: 16,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },

    viewAll: {
      color: colors.primary,
      fontSize: 14,
    },

    /* ================= CATEGORIES ================= */
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 16,
      marginBottom: 8,
      justifyContent: "space-between",
    },

    categoryIconCard: {
      alignItems: "center",
      width: (width - 32) / 5 - 4,
      marginBottom: 16,
    },

    categoryIconCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      backgroundColor: colors.surfaceAlt,
    },

    categoryIconTitle: {
      color: colors.text,
      fontSize: 11,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 14,
    },

    /* ================= TRENDING ================= */
    trendingTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
      margin: 16,
    },

    trendingCard: {
      width: "90%",
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },

    trendingImage: {
      width: "100%",
      height: 190,
      resizeMode: "cover",
    },

    trendingBody: { padding: 12 },

    trendingName: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },

    trendingSub: {
      color: colors.subText,
      fontSize: 12,
      marginTop: 4,
    },

    trendingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },

    trendingTag: {
      backgroundColor: colors.success + "30",
      color: colors.success,
      fontSize: 12,
      paddingHorizontal: 8,
      borderRadius: 6,
    },

    apply: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    /* ================= BOTTOM NAV ================= */
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 76,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: "row",
      paddingBottom: 12,
    },

    navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 4,
    },

    navText: {
      color: colors.subText,
      fontSize: 11,
    },
    /* ================= TRENDING ROW CARD ================= */

    trendingRowCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      // height: 96,

    },

    trendingAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },

    trendingInfo: {
      flex: 1,
    },

    trendingScore: {
      color: colors.subText,
      fontSize: 12,
      marginTop: 2,
    },

    trendingFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
    },

    rating: {
      color: colors.warning ?? "#facc15",
      fontSize: 12,
      fontWeight: "600",
    },

    status: {
      fontSize: 12,
      fontWeight: "700",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      textAlign: "center",
    },

    active: {
      backgroundColor: (colors.success ?? "#22c55e") + "30",
      color: colors.success ?? "#22c55e",
    },

    completed: {
      backgroundColor: colors.subText + "30",
      color: colors.subText,
    },

    shift: {
      color: colors.subText,
      fontSize: 11,
      marginTop: 2,
    },



  });