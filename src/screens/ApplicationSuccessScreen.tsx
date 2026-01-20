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
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const ApplicationSuccessScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Gradient Background */}
      <LinearGradient
        colors={[
          colors.background,
          colors.surface,
          colors.background,
        ]}
        style={styles.container}
      >
        {/* Success Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Icon
              name="check"
              size={42}
              color="#ffffff"
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Congratulations, Alex!
        </Text>

        <Text style={styles.subtitle}>
          Your application for the{" "}
          <Text style={styles.boldText}>
            UI/UX Design Internship
          </Text>{" "}
          has been submitted successfully.
        </Text>

        {/* Application Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>
            APPLICATION DETAILS
          </Text>

          {/* Position */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon
                name="work-outline"
                size={20}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.label}>Position</Text>
              <Text style={styles.value}>
                UI/UX Design Intern
              </Text>
            </View>
          </View>

          {/* Company */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon
                name="business"
                size={20}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.label}>Company</Text>
              <Text style={styles.value}>
                TechVision Studio
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.appIdLabel}>
                APPLICATION ID
              </Text>
              <Text style={styles.appId}>
                #INT-2024-8832
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                RECEIVED
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryText}>
            View Application Status →
          </Text>
        </TouchableOpacity>

        {/* Secondary Button */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryText}>
            Explore More Internships
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default ApplicationSuccessScreen;
const getStyles = (colors: any) =>
  StyleSheet.create({
    /* Safe Area */
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: colors.background,
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
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 10,
      shadowColor: colors.primary,
      shadowOpacity: 0.4,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },

    /* Text */
    title: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 12,
    },

    subtitle: {
      color: colors.subText,
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      paddingHorizontal: 10,
      marginBottom: 28,
    },

    boldText: {
      color: colors.text,
      fontWeight: "700",
    },

    /* Card */
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 28,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardHeader: {
      color: colors.subText,
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
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },

    label: {
      color: colors.subText,
      fontSize: 12,
    },

    value: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
      marginTop: 2,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 14,
    },

    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    appIdLabel: {
      color: colors.subText,
      fontSize: 11,
    },

    appId: {
      color: colors.primary,
      fontWeight: "700",
      fontSize: 14,
      marginTop: 4,
    },

    statusBadge: {
      backgroundColor: colors.success + "20",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.success + "40",
    },

    statusText: {
      color: colors.success,
      fontSize: 12,
      fontWeight: "700",
    },

    /* Buttons */
    primaryBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 18,
      alignItems: "center",
      marginBottom: 14,
      elevation: 6,
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },

    primaryText: {
      color: colors.onPrimary ?? "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },

    secondaryBtn: {
      backgroundColor: colors.card,
      paddingVertical: 16,
      borderRadius: 18,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    secondaryText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
    },
  });
