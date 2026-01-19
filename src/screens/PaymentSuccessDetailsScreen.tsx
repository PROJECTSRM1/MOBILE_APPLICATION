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

const PaymentSuccessDetailsScreen = ({ navigation }: any) => {
  const route = useRoute<any>();

  const {
    allocatedEmployee,
    bookingDetails,
    transactionId,
  } = route.params || {};

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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  content: { padding: 16 },

  timeline: { marginBottom: 24 },

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
  },

  timelineTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  timelineSub: {
    color: "#94a3b8",
    fontSize: 12,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },

  coverImage: {
    width: "100%",
    height: 140,
  },

  cardBody: { padding: 16 },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  serviceName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  badge: {
    backgroundColor: "#22c55e33",
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeText: {
    color: "#22c55e",
    fontWeight: "700",
    fontSize: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },

  infoText: { color: "#94a3b8", flexShrink: 1 },

  professionalCard: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  role: {
    color: "#facc15",
    fontWeight: "700",
    marginTop: 4,
  },

  experience: {
    color: "#94a3b8",
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
    backgroundColor: "#334155",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
