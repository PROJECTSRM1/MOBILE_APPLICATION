import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 64;
const CARD_MARGIN = 16;

type Professional = {
  id: string;
  name: string;
  role: string;
  rating: string;
  ratingValue: number;
  distance: string;
  image: string;
  verified?: boolean;
  mobileNumber: string;
};

const PROFESSIONALS: Professional[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Deep Cleaner",
    rating: "4.9 (124)",
    ratingValue: 4.9,
    distance: "0.8 mi",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
    mobileNumber: "xxxx456",
  },
  {
    id: "2",
    name: "David Okon",
    role: "Standard Cleaner",
    rating: "4.7 (89)",
    ratingValue: 4.7,
    distance: "1.2 mi",
    image:  "https://randomuser.me/api/portraits/men/32.jpg" ,
    mobileNumber: "xxxx789",
  },
  {
    id: "3",
    name: "Maria Garcia",
    role: "Deep Cleaner",
    rating: "4.8 (210)",
    ratingValue: 4.8,
    distance: "2.0 mi",
    image: "https://randomuser.me/api/portraits/women/65.jpg" ,
    mobileNumber: "xxxx321",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Window Specialist",
    rating: "4.5 (56)",
    ratingValue: 4.5,
    distance: "5.4 mi",
    image: "https://randomuser.me/api/portraits/men/45.jpg" ,
    mobileNumber: "xxxx654",
  },
];

const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
    },

    header: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },

    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    listHeader: {
      paddingHorizontal: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 16,
    },

    listTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    sortText: {
      color: colors.subText,
      fontSize: 13,
    },

    scrollContent: {
      paddingHorizontal: 32,
      paddingVertical: 20,
    },

    card: {
      width: CARD_WIDTH,
      marginHorizontal: CARD_MARGIN,
      padding: 24,
      borderRadius: 24,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },

    cardSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`,
      shadowColor: colors.primary,
      shadowOpacity: 0.4,
    },

    imageContainer: {
      alignItems: "center",
      marginBottom: 20,
    },

    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: colors.primary,
    },

    verified: {
      position: "absolute",
      bottom: 0,
      right: "35%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 4,
      borderWidth: 2,
      borderColor: "#facc15",
    },

    infoContainer: {
      alignItems: "center",
    },

    name: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 4,
    },

    role: {
      color: colors.subText,
      fontSize: 16,
      marginBottom: 16,
    },

    metaContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 20,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    ratingBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(250,204,21,0.1)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
    },

    distanceBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: `${colors.primary}20`,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
    },

    meta: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },

    mobileContainer: {
      width: "100%",
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },

    mobileLabel: {
      color: colors.subText,
      fontSize: 12,
      marginBottom: 4,
    },

    mobileNumber: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    selectionContainer: {
      position: "absolute",
      top: 24,
      right: 24,
    },

    radio: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
    },

    radioSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },

    radioInner: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: "#fff",
    },

    pagination: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      marginVertical: 20,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },

    dotActive: {
      width: 24,
      backgroundColor: colors.primary,
    },

    footer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    filters: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },

    filterBtn: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    filterText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "500",
    },

    confirmBtn: {
      height: 52,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
    },

    confirmText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },

    loadingText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 24,
      textAlign: "center",
    },

    loadingSubtext: {
      color: colors.subText,
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },
  });

const EmployeeAllocation = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const scrollViewRef = useRef<ScrollView>(null);
 const { colors } = useTheme();
    const styles = getStyles(colors);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoAllocating, setIsAutoAllocating] = useState(false);

  // Check if coming from booking with auto-allocation
  const isAutoAllocation = route.params?.isAutoAllocation || false;

  useEffect(() => {
    if (isAutoAllocation) {
      handleAutoAllocation();
    }
  }, [isAutoAllocation]);

  const handleAutoAllocation = () => {
    setIsAutoAllocating(true);

    // Find employee with highest rating
    setTimeout(() => {
      const sortedByRating = [...PROFESSIONALS].sort(
        (a, b) => b.ratingValue - a.ratingValue
      );
      const topEmployee = sortedByRating[0];

      setIsAutoAllocating(false);
      // navigation.navigate("BookCleaning", {
      //   allocatedEmployee: topEmployee,
      // });
 navigation.navigate({
  name: "BookCleaning",
  params: { 
    allocatedEmployee: topEmployee,
    // PRESERVE ORIGINAL DATA
    selectedServices: route.params?.selectedServices,
    allServices: route.params?.selectedServices, // Use allServices for consistency
    consultationCharge: route.params?.consultationCharge,
  },
  merge: true,
});
    }, 2000);
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_MARGIN * 2));
    setCurrentIndex(index);

    if (PROFESSIONALS[index]) {
      setSelectedId(PROFESSIONALS[index].id);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (CARD_WIDTH + CARD_MARGIN * 2),
      animated: true,
    });
  };

  const handleConfirm = () => {
    const selectedEmployee = PROFESSIONALS.find((p) => p.id === selectedId);
    if (selectedEmployee) {
      // navigation.navigate("BookCleaning", {
      //   allocatedEmployee: selectedEmployee,
      // });
   navigation.navigate({
  name: "BookCleaning",
  params: { 
    allocatedEmployee: selectedEmployee,
    // PRESERVE ORIGINAL DATA
    selectedServices: route.params?.selectedServices,
    allServices: route.params?.selectedServices,
    consultationCharge: route.params?.consultationCharge,
  },
  merge: true,
});
    }
  };

  if (isAutoAllocating) {
    return (
      <SafeAreaView style={styles.safe}>
       <StatusBar
  barStyle={colors.background === "#ffffff" ? "dark-content" : "light-content"}
/>

        <LinearGradient
  colors={[colors.gradientStart, colors.gradientEnd]}
  style={styles.container}
>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1a5cff" />
            <Text style={styles.loadingText}>Allocating best professional for you...</Text>
            <Text style={styles.loadingSubtext}>
              Finding the highest rated professional in your area
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

    <LinearGradient
  colors={[colors.gradientStart, colors.gradientEnd]}
  style={styles.container}
>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-ios-new" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Professional</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Available Professionals</Text>
          <Text style={styles.sortText}>Sorted by: Location</Text>
        </View>

        {/* Horizontal Scrolling Cards */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
          snapToAlignment="center"
          contentContainerStyle={styles.scrollContent}
        >
          {PROFESSIONALS.map((item, index) => {
            const selected = selectedId === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.95}
                onPress={() => {
                  setSelectedId(item.id);
                  scrollToIndex(index);
                }}
                style={[styles.card, selected && styles.cardSelected]}
              >
                {/* Professional Image */}
                <View style={styles.imageContainer}>
                  <Image
  source={{ uri: item.image }}
  style={styles.avatar}
/>
                  {item.verified && (
                    <View style={styles.verified}>
                      <Icon name="verified" size={20} color="#facc15" />
                    </View>
                  )}
                </View>

                {/* Professional Info */}
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={[styles.role, selected && { color: "#1a5cff" }]}>
                    {item.role}
                  </Text>

                  {/* Rating & Distance */}
                  <View style={styles.metaContainer}>
                    <View style={styles.metaRow}>
                      <View style={styles.ratingBox}>
                        <Icon name="star" size={16} color="#facc15" />
                        <Text style={styles.meta}>{item.rating}</Text>
                      </View>
                    </View>

                    <View style={styles.metaRow}>
                      <View style={styles.distanceBox}>
                        <Icon name="near-me" size={16} color="#1a5cff" />
                        <Text style={styles.meta}>{item.distance}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Mobile Number */}
                  <View style={styles.mobileContainer}>
                    <Text style={styles.mobileLabel}>Mobile Number</Text>
                    <Text style={styles.mobileNumber}>{item.mobileNumber}</Text>
                  </View>
                </View>

                {/* Selection Indicator */}
                <View style={styles.selectionContainer}>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {PROFESSIONALS.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              style={[styles.dot, currentIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.filters}>
            <View style={styles.filterBtn}>
              <Icon name="tune" size={18} color="#1a5cff" />
              <Text style={styles.filterText}>Service: Deep Clean</Text>
            </View>
            <View style={styles.filterBtn}>
              <Icon name="sort" size={18} color="#1a5cff" />
              <Text style={styles.filterText}>Sort: Nearby</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleConfirm}>
            <LinearGradient
              colors={["#1a5cff", "#0f4ae0"]}
              style={styles.confirmBtn}
            >
              <Text style={styles.confirmText}>Confirm Allocation</Text>
              <Icon name="check" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EmployeeAllocation;
