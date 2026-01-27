import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface Inquiry {
  id: string;
  customerName: string;
  propertyType: string;
  propertyDetails: string;
  phone: string;
  email: string;
  address: string;
  price: string;
  rating: number;
  inquiryType: "BUY" | "RENT";
  date: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  iconBgDark: string; // Added for dark mode
  image: string;
}

const PartnerDashboard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors,lightMode } = useTheme();
  const isDark = !lightMode;
  const styles = getStyles(colors, isDark);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const inquiries: Inquiry[] = [
    {
      id: "1",
      customerName: "Rahul Sharma",
      propertyType: "3 BHK Apartment in Gachibowli",
      propertyDetails: "3 BHK Apartment in Gachibowli",
      phone: "+91 98765 43210",
      email: "rahul.sharma@example.com",
      address: "Apt 402, Sunshine Residency, Near HITEC City, Kondapur, Hyderabad, Telangana - 500084",
      price: "₹85,00,000",
      rating: 4.8,
      inquiryType: "BUY",
      date: "Today, 10:45 AM",
      icon: "apartment",
      iconColor: "#3b82f6",
      iconBg: "#dbeafe",
      iconBgDark: "#1e3a8a33",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      customerName: "Ananya Reddy",
      propertyType: "Honda City 2022 • V-Variant",
      propertyDetails: "Honda City 2022 • V-Variant",
      phone: "+91 98765 43211",
      email: "ananya.reddy@example.com",
      address: "Flat 201, Green Valley Apartments, Madhapur, Hyderabad, Telangana - 500081",
      price: "₹12,50,000",
      rating: 4.9,
      inquiryType: "BUY",
      date: "Yesterday",
      icon: "directions-car",
      iconColor: "#a855f7",
      iconBg: "#f3e8ff",
      iconBgDark: "#581c8733",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      customerName: "Kiran Kumar",
      propertyType: "Standalone Villa in Kokapet",
      propertyDetails: "Standalone Villa in Kokapet",
      phone: "+91 98765 43212",
      email: "kiran.kumar@example.com",
      address: "Villa No. 15, Palm Grove Colony, Kokapet, Hyderabad, Telangana - 500075",
      price: "₹45,000/month",
      rating: 4.7,
      inquiryType: "RENT",
      date: "22 Oct, 2023",
      icon: "home",
      iconColor: "#f97316",
      iconBg: "#ffedd5",
      iconBgDark: "#7c2d1233",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    },
    {
      id: "4",
      customerName: "Srinivas Rao",
      propertyType: "200 Sq Yards Open Land",
      propertyDetails: "200 Sq Yards Open Land",
      phone: "+91 98765 43213",
      email: "srinivas.rao@example.com",
      address: "Plot No. 42, Survey No. 123, Mokila Village, Hyderabad, Telangana - 501203",
      price: "₹35,00,000",
      rating: 4.6,
      inquiryType: "BUY",
      date: "21 Oct, 2023",
      icon: "landscape",
      iconColor: "#3b82f6",
      iconBg: "#dbeafe",
      iconBgDark: "#1e3a8a33",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    },
  ];

  const handleInquiryPress = (inquiry: Inquiry) => {
    navigation.navigate("InquiryDetails", { inquiry });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.safeHeader} />
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingLabel}>GOOD MORNING</Text>
          <Text style={styles.headerTitle}>Partner Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons
            name="notifications"
            size={24}
            color={colors.subText}
          />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Total Inquiries Card */}
          <View style={styles.primaryCard}>
            <View style={styles.primaryCardContent}>
              <Text style={styles.primaryCardLabel}>Total Inquiries</Text>
              <View style={styles.primaryCardStats}>
                <Text style={styles.primaryCardNumber}>128</Text>
                <Text style={styles.primaryCardChange}>+12% this week</Text>
              </View>
            </View>
            <View style={styles.primaryCardGlow} />
          </View>

          {/* Secondary Cards */}
          <View style={styles.secondaryCardsRow}>
            <View style={styles.secondaryCard}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? "#7c2d1233" : "#ffedd5" }]}>
                <MaterialIcons name="schedule" size={20} color="#f97316" />
              </View>
              <Text style={styles.secondaryCardLabel}>
                Pending Follow-ups
              </Text>
              <Text style={styles.secondaryCardNumber}>14</Text>
            </View>

            <View style={styles.secondaryCard}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? "#14532d33" : "#dcfce7" }]}>
                <MaterialIcons name="list-alt" size={20} color="#22c55e" />
              </View>
              <Text style={styles.secondaryCardLabel}>Active Listings</Text>
              <Text style={styles.secondaryCardNumber}>42</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.actionsScroll}
          contentContainerStyle={styles.actionsContent}
        >
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Add Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="tune" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Filter</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Recent Inquiries Section */}
        <View style={styles.inquiriesHeader}>
          <Text style={styles.inquiriesTitle}>Recent Inquiries</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Inquiries List */}
        <View style={styles.inquiriesList}>
          {inquiries.map((inquiry) => (
            <TouchableOpacity
              key={inquiry.id}
              style={styles.inquiryCard}
              onPress={() => handleInquiryPress(inquiry)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.inquiryIcon, 
                { backgroundColor: isDark ? inquiry.iconBgDark : inquiry.iconBg }
              ]}>
                <MaterialIcons
                  name={inquiry.icon}
                  size={24}
                  color={inquiry.iconColor}
                />
              </View>

              <View style={styles.inquiryContent}>
                <View style={styles.inquiryHeader}>
                  <Text style={styles.inquiryName}>{inquiry.customerName}</Text>
                  <View style={[
                    styles.inquiryTypeBadge,
                    inquiry.inquiryType === "BUY" 
                      ? styles.buyBadge 
                      : styles.rentBadge
                  ]}>
                    <Text style={[
                      styles.inquiryTypeText,
                      inquiry.inquiryType === "BUY"
                        ? styles.buyText
                        : styles.rentText
                    ]}>
                      {inquiry.inquiryType}
                    </Text>
                  </View>
                </View>
                <Text style={styles.inquiryProperty} numberOfLines={1}>
                  {inquiry.propertyDetails}
                </Text>
                <View style={styles.inquiryFooter}>
                  <View style={styles.inquiryDate}>
                    <MaterialIcons
                      name="calendar-today"
                      size={12}
                      color={colors.subText}
                    />
                    <Text style={styles.inquiryDateText}>{inquiry.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color={colors.primary} />
          <Text style={[styles.navLabel, { color: colors.primary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="chat-bubble-outline" size={24} color={colors.subText} />
          <Text style={styles.navLabel}>Inquiries</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="inventory-2" size={24} color={colors.subText} />
          <Text style={styles.navLabel}>Listings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person-outline" size={24} color={colors.subText} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* iOS-style home indicator */}
      <View style={styles.homeIndicator} />
    </View>
  );
};

export default PartnerDashboard;

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeHeader: {
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
    },
    greetingLabel: {
      fontSize: 11,
      fontWeight: "500",
      color: colors.subText,
      letterSpacing: 1.2,
      marginBottom: 2,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    notificationDot: {
      position: "absolute",
      top: 8,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#ef4444",
      borderWidth: 2,
      borderColor: colors.background,
    },
    statsContainer: {
      paddingHorizontal: 20,
      marginTop: 16,
    },
    primaryCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 20,
      position: "relative",
      overflow: "hidden",
      marginBottom: 16,
    },
    primaryCardContent: {
      zIndex: 2,
    },
    primaryCardLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: "#bfdbfe",
      marginBottom: 4,
    },
    primaryCardStats: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      marginTop: 4,
    },
    primaryCardNumber: {
      fontSize: 48,
      fontWeight: "700",
      color: "#ffffff",
      lineHeight: 52,
    },
    primaryCardChange: {
      fontSize: 14,
      color: "#bfdbfe",
      marginBottom: 8,
    },
    primaryCardGlow: {
      position: "absolute",
      right: -16,
      bottom: -16,
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      opacity: 0.6,
    },
    secondaryCardsRow: {
      flexDirection: "row",
      gap: 16,
    },
    secondaryCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    secondaryCardLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.subText,
      marginBottom: 4,
    },
    secondaryCardNumber: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginTop: 4,
    },
    actionsScroll: {
      marginTop: 24,
    },
    actionsContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginRight: 12,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    inquiriesHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 32,
      marginBottom: 16,
    },
    inquiriesTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    inquiriesList: {
      paddingHorizontal: 20,
      gap: 12,
    },
    inquiryCard: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      gap: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    inquiryIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    inquiryContent: {
      flex: 1,
    },
    inquiryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    inquiryName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
    },
    inquiryTypeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    },
    buyBadge: {
      backgroundColor: "#dbeafe",
    },
    rentBadge: {
      backgroundColor: "#f1f5f9",
    },
    inquiryTypeText: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    buyText: {
      color: "#3b82f6",
    },
    rentText: {
      color: "#64748b",
    },
    inquiryProperty: {
      fontSize: 14,
      color: colors.subText,
      marginBottom: 8,
    },
    inquiryFooter: {
      flexDirection: "row",
      alignItems: "center",
    },
    inquiryDate: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    inquiryDateText: {
      fontSize: 11,
      color: colors.subText,
    },
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
      paddingBottom: 28,
    },
    navItem: {
      alignItems: "center",
      gap: 4,
    },
    navLabel: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.subText,
    },
    homeIndicator: {
      position: "absolute",
      bottom: 4,
      left: "50%",
      marginLeft: -64,
      width: 128,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.isDark ? "#475569" : "#cbd5e1",
    },
  });