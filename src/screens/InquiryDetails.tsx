import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
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
  image: string;
}

type InquiryStatus = "contacted" | "visiting" | "negotiating" | "sold" | "cancelled";

const InquiryDetails = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { colors,lightMode } = useTheme();
  const isDark = !lightMode;
  const styles = getStyles(colors, isDark);

  const inquiry = (route.params as any)?.inquiry as Inquiry;
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatus>("visiting");

  if (!inquiry) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>No inquiry data available</Text>
      </View>
    );
  }

  const handleCallCustomer = () => {
    console.log("Calling customer:", inquiry.phone);
    // Implement call functionality
  };

  const handleMessage = () => {
    console.log("Messaging customer:", inquiry.customerName);
    // Implement message functionality
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.safeHeader} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Inquiry Details</Text>

        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-horiz" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Customer Info Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <View style={styles.avatarCircle}>
              <MaterialIcons name="account-circle" size={48} color={colors.primary} />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{inquiry.customerName}</Text>
              <Text style={styles.customerRole}>Potential Buyer</Text>
            </View>
          </View>

          <View style={styles.contactSection}>
            <View style={styles.contactItem}>
              <MaterialIcons name="call" size={20} color={colors.primary} />
              <Text style={styles.contactText}>{inquiry.phone}</Text>
            </View>

            <View style={styles.contactItem}>
              <MaterialIcons name="mail" size={20} color={colors.primary} />
              <Text style={styles.contactText}>{inquiry.email}</Text>
            </View>

            <View style={styles.addressSection}>
              <Text style={styles.addressLabel}>DETAILED ADDRESS</Text>
              <View style={styles.addressContent}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={colors.primary}
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.addressText}>{inquiry.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Property Card */}
        <View style={styles.propertyCard}>
          <View style={styles.propertyImageContainer}>
            <Image
              source={{ uri: inquiry.image }}
              style={styles.propertyImage}
            />
            <View style={styles.propertyBadges}>
              <View style={styles.badgeForSale}>
                <Text style={styles.badgeText}>FOR SALE</Text>
              </View>
              <View style={styles.badgeNew}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            </View>
          </View>

          <View style={styles.propertyContent}>
            <View style={styles.propertyHeader}>
              <View style={styles.propertyTitleSection}>
                <Text style={styles.propertyTitle}>
                  {inquiry.propertyDetails}
                </Text>
                <Text style={styles.propertyPrice}>{inquiry.price}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={14} color="#fbbf24" />
                <Text style={styles.ratingText}>{inquiry.rating}</Text>
              </View>
            </View>

            {/* Inquiry Status Dropdown */}
            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>INQUIRY STATUS</Text>
              <View style={styles.statusDropdown}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownText}>
                    {inquiryStatus === "contacted" && "Contacted"}
                    {inquiryStatus === "visiting" && "Visiting Scheduled"}
                    {inquiryStatus === "negotiating" && "Negotiating"}
                    {inquiryStatus === "sold" && "Sold / Completed"}
                    {inquiryStatus === "cancelled" && "Cancelled"}
                  </Text>
                  <MaterialIcons name="expand-more" size={20} color={colors.subText} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>Recent Activity</Text>

          <View style={styles.timelineContainer}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Inquiry Received</Text>
                <Text style={styles.timelineTime}>Today, 10:30 AM</Text>
              </View>
            </View>

            <View style={[styles.timelineItem, styles.timelineItemInactive]}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Assigned to Partner</Text>
                <Text style={styles.timelineTime}>Today, 10:35 AM</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleMessage}
          activeOpacity={0.7}
        >
          <MaterialIcons name="chat-bubble" size={20} color={colors.primary} />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCallCustomer}
          activeOpacity={0.7}
        >
          <MaterialIcons name="call" size={20} color="#ffffff" />
          <Text style={styles.callButtonText}>Call Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InquiryDetails;

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
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    moreButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    customerCard: {
      backgroundColor: colors.surface,
      margin: 16,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    customerHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 24,
    },
    avatarCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: isDark ? "#1e3a8a33" : "#dbeafe",
      alignItems: "center",
      justifyContent: "center",
    },
    customerInfo: {
      flex: 1,
    },
    customerName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    customerRole: {
      fontSize: 14,
      color: colors.subText,
    },
    contactSection: {
      gap: 16,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    contactText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    addressSection: {
      paddingTop: 16,
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    addressLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subText,
      letterSpacing: 1,
      marginBottom: 8,
    },
    addressContent: {
      flexDirection: "row",
      gap: 12,
    },
    addressText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },
    propertyCard: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    propertyImageContainer: {
      position: "relative",
      height: 192,
    },
    propertyImage: {
      width: "100%",
      height: "100%",
    },
    propertyBadges: {
      position: "absolute",
      top: 16,
      left: 16,
      flexDirection: "row",
      gap: 8,
    },
    badgeForSale: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeNew: {
      backgroundColor: "#22c55e",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 0.5,
    },
    propertyContent: {
      padding: 20,
    },
    propertyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    propertyTitleSection: {
      flex: 1,
      paddingRight: 12,
    },
    propertyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      lineHeight: 24,
      marginBottom: 4,
    },
    propertyPrice: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.primary,
      marginTop: 4,
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.text,
    },
    statusSection: {
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    statusLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subText,
      letterSpacing: 1,
      marginBottom: 8,
    },
    statusDropdown: {
      position: "relative",
    },
    dropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: isDark ? "#1e293b" : "#f8fafc",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    dropdownText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    activitySection: {
      paddingHorizontal: 24,
      marginTop: 8,
    },
    activityTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.subText,
      marginBottom: 16,
    },
    timelineContainer: {
      paddingLeft: 16,
      borderLeftWidth: 2,
      borderLeftColor: colors.border,
      paddingBottom: 16,
    },
    timelineItem: {
      position: "relative",
      paddingLeft: 24,
      marginBottom: 16,
    },
    timelineItemInactive: {
      opacity: 0.6,
    },
    timelineDot: {
      position: "absolute",
      left: -9,
      top: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.subText,
      borderWidth: 4,
      borderColor: colors.background,
    },
    timelineDotActive: {
      backgroundColor: colors.primary,
    },
    timelineContent: {
      gap: 2,
    },
    timelineTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    timelineTime: {
      fontSize: 12,
      color: colors.subText,
    },
    bottomActions: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      gap: 16,
      backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(248, 250, 252, 0.95)",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      padding: 16,
      paddingBottom: 32,
    },
    messageButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
      paddingVertical: 16,
      borderRadius: 16,
    },
    messageButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    callButton: {
      flex: 1.5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 16,
    },
    callButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#ffffff",
    },
  });