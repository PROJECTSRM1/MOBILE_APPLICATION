import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Branch {
  id: string;
  branchName: string;
  locationCity: string;
  branchCode: string;
  branchHead: string;
}

interface RouteParams {
  formData: any;
}

const InstitutionRegistrationStep2 = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { formData: step1Data } = (route.params as RouteParams) || {};

  const [numberOfBranches, setNumberOfBranches] = useState(1);
  const [academicYearStart, setAcademicYearStart] = useState(new Date("2023-09-01"));
  const [academicYearEnd, setAcademicYearEnd] = useState(new Date("2024-06-30"));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [branches, setBranches] = useState<Branch[]>([
    {
      id: "1",
      branchName: "",
      locationCity: "",
      branchCode: "",
      branchHead: "",
    },
  ]);

  const [errors, setErrors] = useState<{
    [key: string]: { [field: string]: string };
  }>({});

  const updateBranchCount = (increment: boolean) => {
    const newCount = increment
      ? numberOfBranches + 1
      : Math.max(1, numberOfBranches - 1);
    setNumberOfBranches(newCount);

    if (increment) {
      setBranches([
        ...branches,
        {
          id: String(newCount),
          branchName: "",
          locationCity: "",
          branchCode: "",
          branchHead: "",
        },
      ]);
    } else if (newCount < branches.length) {
      setBranches(branches.slice(0, newCount));
    }
  };

  const updateBranch = (id: string, field: keyof Branch, value: string) => {
    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === id ? { ...branch, [field]: value } : branch
      )
    );
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: "" },
    }));
  };

  const deleteBranch = (id: string) => {
    if (branches.length === 1) {
      Alert.alert("Error", "At least one branch is required");
      return;
    }
    Alert.alert(
      "Delete Branch",
      "Are you sure you want to delete this branch?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setBranches((prev) => prev.filter((branch) => branch.id !== id));
            setNumberOfBranches((prev) => Math.max(1, prev - 1));
          },
        },
      ]
    );
  };

  const validateBranches = (): boolean => {
    const newErrors: { [key: string]: { [field: string]: string } } = {};
    let isValid = true;

    branches.forEach((branch) => {
      const branchErrors: { [field: string]: string } = {};

      if (!branch.branchName.trim()) {
        branchErrors.branchName = "Branch name is required";
        isValid = false;
      }

      if (!branch.locationCity.trim()) {
        branchErrors.locationCity = "Location/City is required";
        isValid = false;
      }

      if (!branch.branchCode.trim()) {
        branchErrors.branchCode = "Branch code is required";
        isValid = false;
      }

      if (!branch.branchHead.trim()) {
        branchErrors.branchHead = "Branch head is required";
        isValid = false;
      }

      if (Object.keys(branchErrors).length > 0) {
        newErrors[branch.id] = branchErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleCompleteRegistration = () => {
    if (validateBranches()) {
      // Save the complete registration data
      const registrationData = {
        ...step1Data,
        academicYearStart: academicYearStart.toISOString(),
        academicYearEnd: academicYearEnd.toISOString(),
        numberOfBranches,
        branches,
      };
      
      console.log("Registration Data:", registrationData);
      
      // Navigate directly to PartnerPortal after successful registration
      Alert.alert(
        "Registration Complete",
        "Your institution registration has been submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to Partner Portal
              navigation.navigate("PartnerPortalStandalone");

            },
          },
        ]
      );
    } else {
      Alert.alert("Validation Error", "Please fill all required fields for each branch");
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[
          colors.gradientStart ?? colors.background,
          colors.gradientEnd ?? colors.surface,
        ]}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back-ios" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Branch Configuration</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* PROGRESS */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <View style={styles.progressTop}>
                <Text style={styles.progressLabel}>Branch Setup</Text>
                <Text style={styles.stepText}>Step 2 of 2</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: "100%" }]} />
              </View>
            </View>
            <Text style={styles.breadcrumb}>
              <Text style={styles.breadcrumbText}>Institution Details</Text>
              <Text style={styles.breadcrumbSeparator}> &gt; </Text>
              <Text style={[styles.breadcrumbText, { color: colors.primary }]}>
                Branch Setup
              </Text>
            </Text>
          </View>

          {/* PAGE TITLE */}
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Define your branches</Text>
            <Text style={styles.pageSubtitle}>
              Add the specific locations and administrative heads for your institution.
            </Text>
          </View>

          {/* OPERATIONAL DETAILS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OPERATIONAL DETAILS</Text>

            {/* Number of Branches */}
            <View style={styles.branchCountCard}>
              <View style={styles.branchCountLeft}>
                <View style={styles.iconCircle}>
                  <Icon name="storefront" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.branchCountTitle}>Number of Branches</Text>
                  <Text style={styles.branchCountSubtitle}>
                    Total operational sites
                  </Text>
                </View>
              </View>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateBranchCount(false)}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{numberOfBranches}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateBranchCount(true)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Academic Year Dates */}
            <View style={styles.datesCard}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Academic Year Start</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(academicYearStart)}</Text>
                  <Icon name="calendar-today" size={20} color={colors.subText} />
                </TouchableOpacity>
              </View>

              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Academic Year End</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(academicYearEnd)}</Text>
                  <Icon name="calendar-today" size={20} color={colors.subText} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* BRANCH CONFIGURATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BRANCH CONFIGURATION</Text>

            {branches.map((branch, index) => (
              <View key={branch.id} style={styles.branchCard}>
                {/* Branch Header */}
                <View style={styles.branchHeader}>
                  <Text style={styles.branchHeaderTitle}>Branch {index + 1}</Text>
                  {branches.length > 1 && (
                    <TouchableOpacity onPress={() => deleteBranch(branch.id)}>
                      <Icon name="delete" size={24} color={colors.danger || "#ef4444"} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Branch Fields */}
                <View style={styles.branchBody}>
                  <View style={styles.branchInputContainer}>
                    <Text style={styles.branchInputLabel}>Branch Name</Text>
                    <TextInput
                      style={[
                        styles.branchInput,
                        errors[branch.id]?.branchName && styles.branchInputError,
                      ]}
                      placeholder="e.g. Downtown Campus"
                      placeholderTextColor={colors.subText}
                      value={branch.branchName}
                      onChangeText={(text) =>
                        updateBranch(branch.id, "branchName", text)
                      }
                    />
                    {errors[branch.id]?.branchName && (
                      <Text style={styles.errorText}>
                        {errors[branch.id].branchName}
                      </Text>
                    )}
                  </View>

                  <View style={styles.branchInputContainer}>
                    <Text style={styles.branchInputLabel}>Location/City</Text>
                    <View style={styles.locationInputWrapper}>
                      <Icon
                        name="location-on"
                        size={20}
                        color={colors.subText}
                        style={styles.locationIcon}
                      />
                      <TextInput
                        style={[
                          styles.branchInput,
                          styles.locationInput,
                          errors[branch.id]?.locationCity && styles.branchInputError,
                        ]}
                        placeholder="e.g. New York"
                        placeholderTextColor={colors.subText}
                        value={branch.locationCity}
                        onChangeText={(text) =>
                          updateBranch(branch.id, "locationCity", text)
                        }
                      />
                    </View>
                    {errors[branch.id]?.locationCity && (
                      <Text style={styles.errorText}>
                        {errors[branch.id].locationCity}
                      </Text>
                    )}
                  </View>

                  <View style={styles.branchRow}>
                    <View style={[styles.branchInputContainer, { flex: 1 }]}>
                      <Text style={styles.branchInputLabel}>Branch Code</Text>
                      <TextInput
                        style={[
                          styles.branchInput,
                          errors[branch.id]?.branchCode && styles.branchInputError,
                        ]}
                        placeholder="NYC-01"
                        placeholderTextColor={colors.subText}
                        value={branch.branchCode}
                        onChangeText={(text) =>
                          updateBranch(branch.id, "branchCode", text)
                        }
                      />
                      {errors[branch.id]?.branchCode && (
                        <Text style={styles.errorText}>
                          {errors[branch.id].branchCode}
                        </Text>
                      )}
                    </View>

                    <View style={[styles.branchInputContainer, { flex: 1 }]}>
                      <Text style={styles.branchInputLabel}>Branch Head</Text>
                      <TextInput
                        style={[
                          styles.branchInput,
                          errors[branch.id]?.branchHead && styles.branchInputError,
                        ]}
                        placeholder="Manager Name"
                        placeholderTextColor={colors.subText}
                        value={branch.branchHead}
                        onChangeText={(text) =>
                          updateBranch(branch.id, "branchHead", text)
                        }
                      />
                      {errors[branch.id]?.branchHead && (
                        <Text style={styles.errorText}>
                          {errors[branch.id].branchHead}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Add Another Branch Button */}
            <TouchableOpacity
              style={styles.addBranchButton}
              onPress={() => updateBranchCount(true)}
              activeOpacity={0.7}
            >
              <Icon name="add-circle" size={24} color={colors.primary} />
              <Text style={styles.addBranchText}>Add Another Branch</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* BOTTOM BUTTONS */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.backButton2}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteRegistration}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>Complete Registration</Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={academicYearStart}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setAcademicYearStart(selectedDate);
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={academicYearEnd}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                setAcademicYearEnd(selectedDate);
              }
            }}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default InstitutionRegistrationStep2;

const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    progressSection: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: colors.surface + "80",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    progressHeader: {
      marginBottom: 12,
    },
    progressTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    stepText: {
      fontSize: 14,
      color: colors.text,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    breadcrumb: {
      fontSize: 12,
      color: colors.subText,
    },
    breadcrumbText: {
      color: colors.subText,
    },
    breadcrumbSeparator: {
      color: colors.subText,
    },
    titleSection: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    pageSubtitle: {
      fontSize: 14,
      color: colors.subText,
    },
    section: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1,
      marginBottom: 12,
    },
    branchCountCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    branchCountLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    branchCountTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    branchCountSubtitle: {
      fontSize: 12,
      color: colors.subText,
      marginTop: 2,
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    counterButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    counterButtonText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    counterValue: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      width: 24,
      textAlign: "center",
    },
    datesCard: {
      flexDirection: "row",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    dateInputContainer: {
      flex: 1,
    },
    dateLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    dateInput: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateText: {
      fontSize: 14,
      color: colors.text,
    },
    branchCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    branchHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    branchHeaderTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    branchBody: {
      padding: 16,
      gap: 16,
    },
    branchInputContainer: {
      gap: 6,
    },
    branchInputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    branchInput: {
      fontSize: 14,
      color: colors.text,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    branchInputError: {
      borderColor: colors.danger || "#ef4444",
      borderWidth: 2,
    },
    locationInputWrapper: {
      position: "relative",
    },
    locationIcon: {
      position: "absolute",
      left: 12,
      top: 12,
      zIndex: 1,
    },
    locationInput: {
      paddingLeft: 40,
    },
    branchRow: {
      flexDirection: "row",
      gap: 16,
    },
    errorText: {
      fontSize: 12,
      color: colors.danger || "#ef4444",
      marginTop: 4,
    },
    addBranchButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary + "60",
      borderRadius: 12,
      backgroundColor: colors.primary + "10",
      gap: 8,
      marginTop: 8,
    },
    addBranchText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.primary,
    },
    bottomButtons: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface + "F0",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 16,
    },
    backButton2: {
      flex: 1,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    completeButton: {
      flex: 2,
      paddingVertical: 12,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    completeButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#ffffff",
    },
  });