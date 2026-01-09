import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import JobDetailsScreen from "./JobDetailsScreen";
import JobDetailsScreen from "./JobDetailsScreen";


const Stack = createNativeStackNavigator();

// const COMPANIES = [
const COMPANIES = [
  {
    id: 1,
    name: "TechFlow Systems",
    industry: "Software Engineering",
    description:
      "Leading the way in AI and machine learning solutions for enterprise clients worldwide.",
    location: "San Francisco, CA",
    size: "500+",
    isRemote: false,
    badge: "4 Internships",
    badgeColor: "#135bec",
    active: "Active 2h ago",
    icon: "code",
    iconBg: "#3b82f6",
  },
  {
    id: 2,
    name: "EduGrow",
    industry: "EdTech",
    description:
      "Helping students learn faster through personalized curriculum and AI-driven tutoring assistants.",
    location: "Austin, TX",
    size: "50-200",
    isRemote: false,
    badge: "1 Job Opening",
    badgeColor: "#22c55e",
    active: "Active 1d ago",
    icon: "school",
    iconBg: "#f97316",
  },
  {
    id: 3,
    name: "Apex Banking",
    industry: "Finance & Banking",
    description:
      "Global financial solutions for the modern era. Secure banking infrastructure.",
    location: "London, UK",
    size: "1000+",
    isRemote: false,
    badge: "Hiring Frozen",
    badgeColor: "#6b7280",
    icon: "account-balance",
    iconBg: "#334155",
  },
  {
    id: 4,
    name: "EcoDynamics",
    industry: "Green Energy",
    description:
      "Developing sustainable energy grids powered by next-gen solar technology.",
    location: "Remote",
    size: "50-200",
    isRemote: true,
    badge: "2 Senior Roles",
    badgeColor: "#16a34a",
    active: "Active 4h ago",
    icon: "eco",
    iconBg: "#22c55e",
  },
];


const CompaniesScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState("");

  const filteredCompanies = useMemo(() => {
    return COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Companies</Text>
        </View>
      </SafeAreaView>

      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color="#9da6b9" />
        <TextInput
          placeholder="Search companies..."
          placeholderTextColor="#9da6b9"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredCompanies.map((company) => (
          <TouchableOpacity
            key={company.id}
            onPress={() => navigation.navigate("JobDetails", { company })}
          >
            <View style={styles.card}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.metaText}>{company.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// export default function CompaniesListingScreen() {
// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// //         <Stack.Screen name="Companies" component={CompaniesScreen} />
// //         <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// }

export default CompaniesScreen;



/* ---------------- COMPONENTS ---------------- */

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, active && styles.activeChip]}
  >
    <Text numberOfLines={1} style={styles.chipText}>
      {label}
    </Text>
    {label !== "All" && (
      <MaterialIcons name="expand-more" size={18} color="#fff" />
    )}
  </TouchableOpacity>
);

const Dropdown = ({
  visible,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: string[];
  onSelect: (v: string) => void;
  onClose: () => void;
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <TouchableOpacity style={styles.modalBg} onPress={onClose}>
      <View style={styles.dropdown}>
        {options.map((o) => (
          <TouchableOpacity
            key={o}
            style={styles.option}
            onPress={() => onSelect(o)}
          >
            <Text style={styles.optionText}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

const CompanyCard = ({ company }: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={[styles.logo, { backgroundColor: company.iconBg }]}>
        <MaterialIcons name={company.icon} size={24} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.companyName}>{company.name}</Text>
        <Text style={styles.category}>{company.industry}</Text>
      </View>

      <MaterialIcons name="bookmark-border" size={22} color="#9da6b9" />
    </View>

    <Text style={styles.description}>{company.description}</Text>

    <View style={styles.meta}>
      <Text style={styles.metaText}>📍 {company.location}</Text>
      <Text style={styles.metaText}>👥 {company.size} employees</Text>
    </View>

    <View style={styles.cardFooter}>
      <View
        style={[styles.badge, { backgroundColor: company.badgeColor + "22" }]}
      >
        <Text style={[styles.badgeText, { color: company.badgeColor }]}>
          {company.badge}
        </Text>
      </View>
      {company.active && <Text style={styles.active}>{company.active}</Text>}
    </View>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101622" },
  safeHeader: { backgroundColor: "#101622" },

  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1c212e",
  },

  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c212e",
    margin: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },

  searchInput: { flex: 1, color: "#fff", marginLeft: 8 },

  filterBar: { height: 56, justifyContent: "center" },

  chip: {
    height: 40,
    minWidth: 80,
    maxWidth: 180,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1c212e",
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },

  activeChip: { borderWidth: 1, borderColor: "#135bec" },

  chipText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 6,
    flexShrink: 1,
  },

  content: { padding: 16, paddingTop: 8 },

  resultText: { color: "#9da6b9", marginBottom: 12 },

  card: {
    backgroundColor: "#1c212e",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  cardHeader: { flexDirection: "row", alignItems: "center" },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  companyName: { color: "#fff", fontSize: 16, fontWeight: "700" },

  category: { color: "#135bec", fontSize: 12 },

  description: { color: "#9da6b9", marginVertical: 8, fontSize: 13 },

  meta: { flexDirection: "row", justifyContent: "space-between" },

  metaText: { color: "#9da6b9", fontSize: 12 },

  cardFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },

  badgeText: { fontWeight: "700", fontSize: 12 },

  active: { color: "#9da6b9", fontSize: 11 },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  dropdown: {
    backgroundColor: "#1c212e",
    width: "70%",
    borderRadius: 14,
  },

  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2a3245",
  },

  optionText: { color: "#fff", textAlign: "center" },
});