import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const PRIMARY_BLUE = "#1565C0";
const PRIMARY_YELLOW = "#F4B400";
const TEXT_COLOR_DARK = "#333";

// =======================================================
// 1. NAVIGATION TYPES (UPDATED)
// =======================================================
type RootStackParamList = {
  AvailableRequestsScreen: undefined;
  DashboardScreen: undefined;
  FreelancerPremiumFlow: undefined; // ✅ ADDED
  [key: string]: object | undefined;
};

type DashboardScreenNavigationProp =
  NavigationProp<RootStackParamList>;

// =======================================================
// 2. JOB SECTION COMPONENT
// =======================================================
const JobSection = ({
  title,
  subtitle,
  emptyMessage,
  icon,
}: {
  title: string;
  subtitle: string;
  emptyMessage: string;
  icon: string;
}) => (
  <View style={styles.jobSection}>
    <Text style={styles.jobTitle}>{title}</Text>
    <Text style={styles.jobSubtitle}>{subtitle}</Text>

    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBox}>
        <Text style={styles.emptyIcon}>{icon}</Text>
      </View>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  </View>
);

// =======================================================
// 3. STAT CARD COMPONENT
// =======================================================
const StatCard = ({
  title,
  value,
  desc,
  color,
}: {
  title: string;
  value: string;
  desc: string;
  color: string;
}) => (
  <View style={styles.statCard}>
    <View style={[styles.sideStrip, { backgroundColor: color }]} />
    <View style={{ padding: 16 }}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statDesc}>{desc}</Text>
    </View>
  </View>
);

// =======================================================
// 4. MAIN SCREEN
// =======================================================
export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SWACHIFY INDIA</Text>
          <Text style={styles.portal}>Freelancer Portal</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("FreelancerPremiumFlow")} // ✅ UPDATED
        >
          <Text style={styles.backText}>← Back To Requests</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* TITLE */}
        <Text style={styles.title}>Dashboard Overview</Text>
        <Text style={styles.subtitle}>
          Track your performance at a glance
        </Text>

        {/* STATS */}
        <View style={styles.cardRow}>
          <StatCard
            title="Total Earnings"
            value="₹0"
            desc="From 0 completed jobs"
            color={PRIMARY_BLUE}
          />
          <StatCard
            title="Approval Pending"
            value="0"
            desc="Jobs waiting for admin review"
            color={PRIMARY_YELLOW}
          />
        </View>

        <View style={styles.cardRow}>
          <StatCard
            title="Available Jobs"
            value="20"
            desc="Start from Available Requests below"
            color={PRIMARY_BLUE}
          />
          <StatCard
            title="Client Rating"
            value="⭐ 4.8"
            desc="Based on recent jobs"
            color={PRIMARY_BLUE}
          />
        </View>

        {/* SKILLS */}
        <Text style={styles.skillTitle}>My Skills</Text>
        <Text style={styles.skillSub}>
          Used to match you with the right jobs
        </Text>

        <View style={styles.skillRow}>
          {["Cleaning", "Home Services", "Plumbing", "Electrical"].map(
            (skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            )
          )}
        </View>

        {/* JOB STATUS SECTIONS */}
        <JobSection
          title="Approval Pending"
          subtitle="Jobs you have accepted and are waiting for admin approval"
          emptyMessage="No jobs are waiting for approval."
          icon="✉️"
        />

        <JobSection
          title="My Active Job"
          subtitle="Live status of your current service"
          emptyMessage="No jobs currently in progress. Accept a request to get started."
          icon="🛠️"
        />

        <JobSection
          title="Recently Completed"
          subtitle="Jobs you have completed through the flow"
          emptyMessage="You haven't completed any jobs yet."
          icon="✅"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// =======================================================
// STYLES (UNCHANGED)
// =======================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5F9" },

  header: {
    backgroundColor: "#FFF",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 4,
  },
  brand: { fontSize: 18, fontWeight: "900", color: PRIMARY_BLUE },
  portal: { fontSize: 12, color: "#777" },

  backBtn: {
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: { fontWeight: "600" },

  content: { padding: 20 },

  title: { fontSize: 24, fontWeight: "800", color: "#222" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    flexDirection: "row",
    elevation: 6,
  },
  sideStrip: {
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  statTitle: { fontSize: 13, color: "#666" },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 6,
  },
  statDesc: { fontSize: 12, color: "#888" },

  skillTitle: { fontSize: 20, fontWeight: "800", marginTop: 20 },
  skillSub: { fontSize: 13, color: "#666", marginBottom: 10 },

  skillRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 30 },

  skillChip: {
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    color: PRIMARY_BLUE,
    fontWeight: "700",
    fontSize: 13,
  },

  jobSection: { marginBottom: 35 },
  jobTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_COLOR_DARK,
  },
  jobSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "#FFF",
    borderRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  emptyIconBox: {
    width: 60,
    height: 40,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    opacity: 0.6,
  },
  emptyIcon: { fontSize: 20, opacity: 0.4 },
  emptyText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
