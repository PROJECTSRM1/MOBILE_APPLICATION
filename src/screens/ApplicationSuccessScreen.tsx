import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

const ApplicationSuccessScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#0b1220", "#0e1627", "#0b1220"]}
        style={styles.container}
      >
        {/* Success Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Icon name="check" size={42} color="#ffffff" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Congratulations, Alex!</Text>
        <Text style={styles.subtitle}>
          Your application for the{" "}
          <Text style={styles.boldText}>UI/UX Design Internship</Text> has been
          submitted successfully.
        </Text>

        {/* Application Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>APPLICATION DETAILS</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="work-outline" size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.label}>Position</Text>
              <Text style={styles.value}>UI/UX Design Intern</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="business" size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.label}>Company</Text>
              <Text style={styles.value}>TechVision Studio</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.appIdLabel}>APPLICATION ID</Text>
              <Text style={styles.appId}>#INT-2024-8832</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>RECEIVED</Text>
            </View>
          </View>
        </View>

        {/* Primary Button */}
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
          <Text style={styles.primaryText}>View Application Status →</Text>
        </TouchableOpacity>

        {/* Secondary Button */}
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
          <Text style={styles.secondaryText}>Explore More Internships</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ApplicationSuccessScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b1220",
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  /* Success Icon */
  iconWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },

  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },

  /* Text */
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 28,
  },

  boldText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  /* Card */
  card: {
    backgroundColor: "#121b2f",
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
  },

  cardHeader: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  label: {
    color: "#9ca3af",
    fontSize: 12,
  },

  value: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginVertical: 14,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appIdLabel: {
    color: "#6b7280",
    fontSize: 11,
  },

  appId: {
    color: "#3b82f6",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Buttons */
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
    elevation: 6,
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#1e293b",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  secondaryText: {
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: "600",
  },
});
