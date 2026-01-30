import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";



type Branch = {
  id: string;
  name: string;
  location: string;
  students: number;
  status: "ACTIVE" | "INACTIVE";
  icon: string;
};

const branches: Branch[] = [
  {
    id: "1",
    name: "Engineering & Tech",
    location: "Main Campus, Block A",
    students: 1240,
    status: "ACTIVE",
    icon: "account-cog",
  },
  {
    id: "2",
    name: "Arts & Humanities",
    location: "West Wing, Block C",
    students: 856,
    status: "ACTIVE",
    icon: "palette",
  },
  {
    id: "3",
    name: "Pure Sciences",
    location: "North Block, Lab Area",
    students: 620,
    status: "ACTIVE",
    icon: "flask",
  },
];

const BranchDirectoryScreen = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
      const navigation = useNavigation<any>(); // 👈 ADD THIS

  const totalStudents = branches.reduce(
    (sum, branch) => sum + branch.students,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Branch Directory</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={22} color="#000" />
          <Ionicons name="filter" size={22} color="#000" />
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconBlue}>
            <Icon name="account-group" size={22} color="#1A73E8" />
          </View>
          <Text style={styles.statLabel}>TOTAL STUDENTS</Text>
          <Text style={styles.statValue}>{totalStudents}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconOrange}>
            <Icon name="source-branch" size={22} color="#F97316" />
          </View>
          <Text style={styles.statLabel}>BRANCH COUNT</Text>
          <Text style={styles.statValue}>{branches.length}</Text>
        </View>
      </View>

      {/* SECTION */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Branches</Text>
        {/* <Text style={styles.updatedText}>Updated 2h ago</Text> */}
      </View>

      {/* LIST */}
      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 160 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.branchLeft}>
                <View style={styles.branchIcon}>
                  <Icon name={item.icon} size={22} color="#2563EB" />
                </View>
                <View>
                  <Text style={styles.branchName}>{item.name}</Text>
                  <Text style={styles.branchLocation}>{item.location}</Text>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            {/* STUDENT BUBBLES */}
            <View style={styles.studentsRow}>
              <View style={styles.avatar} />
              <View style={styles.avatar} />
              <View style={styles.avatarCount}>
                <Text style={styles.avatarText}>
                  +{Math.floor(item.students / 1000)}k
                </Text>
              </View>
              <Text style={styles.studentCount}>
                {item.students} Students enrolled
              </Text>
            </View>

           <TouchableOpacity
  style={styles.viewButton}
  onPress={() =>
    navigation.navigate("InstitutionStudents", {
      branchId: item.id,
      branchName: item.name,
    })
  }
>
  <Text style={styles.viewButtonText}>
    View Students <Ionicons name="chevron-forward" size={16} />
  </Text>
</TouchableOpacity>

          </View>
        )}
      />

      {/* REQUEST ACCESS */}
      <TouchableOpacity style={styles.requestButton}>
        <Icon name="plus-circle-outline" size={22} color="#1A73E8" />
        <Text style={styles.requestText}>Request New Branch Access</Text>
      </TouchableOpacity>

      {/* BOTTOM TABS (STATIC UI) */}
      <View style={styles.bottomTabs}>
        <Icon name="view-grid" size={22} color="#1A73E8" />
        <Icon name="account-group-outline" size={22} color="#94A3B8" />
        <Icon name="clipboard-text-outline" size={22} color="#94A3B8" />
        <Icon name="cog-outline" size={22} color="#94A3B8" />
      </View>
    </SafeAreaView>
  );
};

export default BranchDirectoryScreen;


const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    headerIcons: {
      flexDirection: "row",
      gap: 16,
    },

    statsContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      marginRight: 12,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    statIconBlue: {
      backgroundColor: colors.surfaceAlt,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statIconOrange: {
      backgroundColor: colors.surfaceAlt,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },

    statLabel: {
      fontSize: 12,
      color: colors.subText,
    },
    statValue: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    updatedText: {
      fontSize: 12,
      color: colors.primary,
    },

    card: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 16,
      borderRadius: 16,
    },

    branchLeft: {
      flexDirection: "row",
      gap: 12,
    },
    branchIcon: {
      backgroundColor: colors.surfaceAlt,
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    branchName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    branchLocation: {
      fontSize: 13,
      color: colors.subText,
    },

    statusBadge: {
      backgroundColor: colors.success + "20", // soft success background
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    statusText: {
      color: colors.success,
      fontSize: 12,
    },

    studentsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 12,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.border,
      marginRight: -6,
    },
    avatarCount: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    avatarText: {
      fontSize: 10,
      color: colors.primary,
    },
    studentCount: {
      marginLeft: 8,
      fontWeight: "600",
      color: colors.text,
    },

    viewButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    viewButtonText: {
      color: colors.background,
      fontWeight: "600",
    },

    requestButton: {
      position: "absolute",
      bottom: 80,
      left: 16,
      right: 16,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary,
      borderRadius: 14,
      padding: 14,
      alignItems: "center",
      gap: 6,
    },
    requestText: {
      color: colors.primary,
      fontWeight: "600",
    },

    bottomTabs: {
      position: "absolute",
      bottom: 0,
      height: 64,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderTopWidth: 1,
      borderColor: colors.border,
    },
  });
