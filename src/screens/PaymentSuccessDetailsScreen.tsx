import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
const PaymentSuccessDetailsScreen = ({ navigation }: any) => {
  const route = useRoute<any>();
 const { colors } = useTheme();
    const styles = getStyles(colors);
  const {
    allocatedEmployee,
    bookingDetails,
    transactionId,
  } = route.params || {};

  // Helper components that use styles are defined here so they can access `styles`
  const TimelineItem = ({ title, subtitle, active = false }: any) => (
    <View style={styles.timelineItem}>
      <View
        style={[
          styles.dot,
          { backgroundColor: active ? "#22c55e" : "#475569" },
        ]}
      />
      <View>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineSub}>{subtitle}</Text>
      </View>
    </View>
  );

  const InfoRow = ({ icon, text }: any) => (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={16} color="#94a3b8" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );

  const ActionButton = ({ icon, label, primary, onPress }: any) => (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        primary && { backgroundColor: "#2563eb" },
      ]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={18} color="#fff" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="check-circle" size={26} color="#22c55e" />
        <Text style={styles.headerTitle}>Payment Successful</Text>
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <MaterialIcons name="close" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* TIMELINE */}
        <View style={styles.timeline}>
          <TimelineItem
            title="Payment Confirmed"
            subtitle={`Transaction #${transactionId}`}
            active
          />
          <TimelineItem
            title="Professional Assigned"
            subtitle="Assigned just now"
            active
          />
          <TimelineItem
            title="Cleaner On the Way"
            subtitle={`Estimated arrival ${bookingDetails?.time}`}
          />
        </View>

        {/* BOOKING DETAILS */}
        <Text style={styles.sectionTitle}>Active Booking Details</Text>

        <View style={styles.card}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
            }}
            style={styles.coverImage}
          />

          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>
                {bookingDetails?.serviceName}
              </Text>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>Confirmed</Text>
              </View>
            </View>

            <InfoRow
              icon="calendar-today"
              text={`${bookingDetails?.date} • ${bookingDetails?.time}`}
            />

            <InfoRow
              icon="location-on"
              text={bookingDetails?.address}
            />
          </View>
        </View>

        {/* PROFESSIONAL */}
        <Text style={styles.sectionTitle}>Your Professional</Text>

        <View style={styles.professionalCard}>
          <Image
            source={allocatedEmployee?.image}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {allocatedEmployee?.name}
          </Text>

          <Text style={styles.role}>
            {allocatedEmployee?.role} • ⭐ {allocatedEmployee?.rating}
          </Text>

          <Text style={styles.experience}>
            Verified Professional
          </Text>

          <View style={styles.actionRow}>
            <ActionButton
              icon="call"
              label="Call"
              onPress={() =>
                Linking.openURL(`tel:${allocatedEmployee?.mobileNumber}`)
              }
            />

            <ActionButton
              icon="chat"
              label="Chat"
              primary
              onPress={() => Alert.alert("Coming Soon", "Chat feature coming soon")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentSuccessDetailsScreen;

/* ---------------- COMPONENTS ---------------- */

// helper components removed (now defined inside main component)

/* ---------------- STYLES ---------------- */

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },

    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    content: {
      padding: 16,
    },

    timeline: {
      marginBottom: 24,
    },

    timelineItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
      gap: 12,
    },

    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },

    timelineTitle: {
      color: colors.text,
      fontWeight: "700",
    },

    timelineSub: {
      color: colors.subText,
      fontSize: 12,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 12,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },

    coverImage: {
      width: "100%",
      height: 140,
    },

    cardBody: {
      padding: 16,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    serviceName: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },

    badge: {
      backgroundColor: `${colors.success}33`,
      paddingHorizontal: 10,
      borderRadius: 20,
    },

    badgeText: {
      color: colors.success,
      fontWeight: "700",
      fontSize: 12,
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 6,
    },

    infoText: {
      color: colors.subText,
      flexShrink: 1,
    },

    professionalCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      marginBottom: 12,
    },

    name: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
    },

    role: {
      color: colors.warning,
      fontWeight: "700",
      marginTop: 4,
    },

    experience: {
      color: colors.subText,
      marginVertical: 6,
    },

    actionRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
    },

    actionBtn: {
      flexDirection: "row",
      gap: 6,
      backgroundColor: colors.surfaceAlt,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
    },

    actionText: {
      color: colors.text,
      fontWeight: "700",
    },
  });
