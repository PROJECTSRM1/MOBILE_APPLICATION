import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const JobDetailsScreen = ({ route, navigation }: any) => {
  const { company } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      {/* HEADER */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Job Details</Text>

          <MaterialIcons name="bookmark-border" size={24} color="#fff" />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        {/* JOB HEADER */}
        <View style={styles.jobHeader}>
          <View style={[styles.logo, { backgroundColor: company.iconBg }]}>
            <MaterialIcons name={company.icon} size={28} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle}>Senior Product Designer</Text>
            <Text style={styles.companyMeta}>
              {company.name} • 2 days ago
            </Text>
          </View>
        </View>

        {/* INFO CARDS */}
        <View style={styles.grid}>
          <InfoCard icon="location-on" label="Location" value={company.location} />
          <InfoCard icon="attach-money" label="Salary" value="$120k - $150k/yr" />
          <InfoCard icon="timer" label="Notice Period" value="30 Days" />
          <InfoCard
            icon="work"
            label="Job Type"
            value={company.isRemote ? "Remote" : "Onsite"}
          />
        </View>

        <Section title="About the Role">
          <Text style={styles.paragraph}>
            We are looking for a creative Senior Product Designer to join our core team.
          </Text>
        </Section>

        <Section title="Requirements">
          <Requirement text="5+ years experience in product design." />
          <Requirement text="Strong portfolio." />
          <Requirement text="Figma / Adobe tools." />
        </Section>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* APPLY */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyText}>Apply Now</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobDetailsScreen;


/* ---------------- COMPONENTS ---------------- */

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.infoCard}>
    <MaterialIcons name={icon} size={20} color="#135bec" />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={{ marginTop: 20 }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Requirement = ({ text }: { text: string }) => (
  <View style={styles.requirement}>
    <MaterialIcons name="check-circle" size={18} color="#135bec" />
    <Text style={styles.requirementText}>{text}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101622" },

  safeHeader: { backgroundColor: "#101622" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1c212e",
  },

  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  content: { padding: 16 },

  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  jobTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },

  companyMeta: { color: "#9da6b9", marginTop: 4 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  infoCard: {
    width: "48%",
    backgroundColor: "#1c212e",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  infoLabel: { color: "#9da6b9", fontSize: 12, marginTop: 6 },

  infoValue: { color: "#fff", fontWeight: "700", marginTop: 2 },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  paragraph: { color: "#9da6b9", lineHeight: 22 },

  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  requirementText: {
    color: "#9da6b9",
    marginLeft: 8,
    flex: 1,
  },

  mapBox: {
    height: 140,
    borderRadius: 16,
    backgroundColor: "#1c212e",
    alignItems: "center",
    justifyContent: "center",
  },

  mapText: { color: "#fff", fontWeight: "700" },

  notice: {
    flexDirection: "row",
    backgroundColor: "#f973161a",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },

  noticeTitle: { color: "#fff", fontWeight: "700" },

  noticeText: { color: "#9da6b9", marginTop: 2 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#101622",
    borderTopWidth: 1,
    borderTopColor: "#1c212e",
  },

  applyBtn: {
    height: 52,
    backgroundColor: "#135bec",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  applyText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});