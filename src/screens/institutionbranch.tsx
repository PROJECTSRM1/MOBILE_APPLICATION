import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
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

const BranchDirectoryScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://swachify-india-be-1-mcrb.onrender.com/institution/student/branch-directory?branch_id=-1"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();
      console.log("🎯 Branches API Response:", data);

      // Map API response to Branch type
      const mappedBranches: Branch[] = data.map((branch: any) => ({
        id: branch.branch_id?.toString(),
        name: branch.branch_name,
        location: branch.location || "Location not specified",
        students: branch.student_count || 0,
        status: branch.status?.toUpperCase() || "ACTIVE",
        icon: getIconForBranch(branch.branch_name),
      }));

      setBranches(mappedBranches);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching branches:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to assign icons based on branch name
  const getIconForBranch = (name: string): string => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("engineering") || lowerName.includes("tech")) {
      return "account-cog";
    } else if (lowerName.includes("computer") || lowerName.includes("cs")) {
      return "laptop";
    } else if (lowerName.includes("arts") || lowerName.includes("humanities")) {
      return "palette";
    } else if (lowerName.includes("science")) {
      return "flask";
    } else if (
      lowerName.includes("commerce") ||
      lowerName.includes("business")
    ) {
      return "briefcase";
    } else if (lowerName.includes("medical") || lowerName.includes("health")) {
      return "hospital-box";
    }
    return "school"; // default icon
  };

  const totalStudents = branches.reduce(
    (sum, branch) => sum + branch.students,
    0
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading branches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Icon name="alert-circle" size={48} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBranches}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Branch Directory</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="filter" size={22} color={colors.text} />
          </TouchableOpacity>
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
        <TouchableOpacity onPress={fetchBranches}>
          <Ionicons name="refresh" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.branchLeft}>
                <View style={styles.branchIcon}>
                  <Icon name={item.icon} size={22} color="#2563EB" />
                </View>
                <View style={styles.branchInfo}>
                  <Text style={styles.branchName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.branchLocation} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "INACTIVE" && styles.statusBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "INACTIVE" && styles.statusTextInactive,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {/* STUDENT BUBBLES */}
            <View style={styles.studentsRow}>
              <View style={styles.avatar} />
              <View style={styles.avatar} />
              <View style={styles.avatarCount}>
                <Text style={styles.avatarText}>
                  {item.students > 1000
                    ? `+${Math.floor(item.students / 1000)}k`
                    : `+${item.students}`}
                </Text>
              </View>
              <Text style={styles.studentCount}>
                {item.students} Students enrolled
              </Text>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("InstitutionStudents", {
                  branchId: item.id,
                  branchName: item.name,
                })
              }
            >
              <Text style={styles.viewButtonText}>
                View Students{" "}
                <Ionicons name="chevron-forward" size={16} color="#ffffff" />
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="folder-open-outline" size={48} color={colors.subText} />
            <Text style={styles.emptyText}>No branches found</Text>
            <Text style={styles.emptySubtext}>
              Branches will appear here once they are added
            </Text>
          </View>
        }
      />

      {/* REQUEST ACCESS - Inside ScrollView */}
      {branches.length > 0 && (
        <View style={styles.requestButtonContainer}>
          <TouchableOpacity
            style={styles.requestButton}
            activeOpacity={0.7}
            onPress={() => {
              // Handle request new branch access
              console.log("Request new branch access");
            }}
          >
            <Icon name="plus-circle-outline" size={22} color="#1A73E8" />
            <Text style={styles.requestText}>Request New Branch Access</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* BOTTOM TABS */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7}>
          <Icon name="view-grid" size={22} color="#1A73E8" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7}>
          <Icon name="account-group-outline" size={22} color="#94A3B8" />
          <Text style={styles.tabLabel}>Students</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7}>
          <Icon name="clipboard-text-outline" size={22} color="#94A3B8" />
          <Text style={styles.tabLabel}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7}>
          <Icon name="cog-outline" size={22} color="#94A3B8" />
          <Text style={styles.tabLabel}>Settings</Text>
        </TouchableOpacity>
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

    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },

    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },

    errorText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.danger,
      textAlign: "center",
      paddingHorizontal: 20,
    },

    retryButton: {
      marginTop: 16,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },

    retryButtonText: {
      color: "#ffffff",
      fontWeight: "600",
      fontSize: 15,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },

    headerIcons: {
      flexDirection: "row",
      gap: 12,
    },

    iconButton: {
      padding: 4,
    },

    statsContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginBottom: 8,
      gap: 12,
    },

    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    statIconBlue: {
      backgroundColor: "#1A73E8" + "15",
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },

    statIconOrange: {
      backgroundColor: "#F97316" + "15",
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },

    statLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subText,
      letterSpacing: 0.5,
      marginBottom: 4,
    },

    statValue: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 160, // Space for request button + bottom tabs
    },

    card: {
      backgroundColor: colors.card,
      marginBottom: 12,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    branchLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      marginRight: 8,
    },

    branchIcon: {
      backgroundColor: "#2563EB" + "15",
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },

    branchInfo: {
      flex: 1,
    },

    branchName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },

    branchLocation: {
      fontSize: 13,
      color: colors.subText,
    },

    statusBadge: {
      backgroundColor: colors.success + "20",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },

    statusBadgeInactive: {
      backgroundColor: colors.subText + "20",
    },

    statusText: {
      color: colors.success,
      fontSize: 11,
      fontWeight: "600",
    },

    statusTextInactive: {
      color: colors.subText,
    },

    studentsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.border,
      marginRight: -6,
      borderWidth: 2,
      borderColor: colors.card,
    },

    avatarCount: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
      borderWidth: 2,
      borderColor: colors.card,
    },

    avatarText: {
      fontSize: 9,
      fontWeight: "600",
      color: colors.primary,
    },

    studentCount: {
      marginLeft: 8,
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },

    viewButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    viewButtonText: {
      color: "#ffffff",
      fontWeight: "600",
      fontSize: 15,
    },

    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 20,
    },

    emptyText: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    emptySubtext: {
      marginTop: 4,
      fontSize: 14,
      color: colors.subText,
      textAlign: "center",
    },

    requestButtonContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.surface,
    },

    requestButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary,
      borderRadius: 14,
      padding: 14,
      gap: 8,
      backgroundColor: colors.card,
    },

    requestText: {
      color: colors.primary,
      fontWeight: "600",
      fontSize: 15,
    },

    bottomTabs: {
      height: 70,
      backgroundColor: colors.card,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 8,
    },

    tabButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
    },

    tabLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: "#94A3B8",
      marginTop: 4,
    },

    tabLabelActive: {
      color: "#1A73E8",
    },
  });