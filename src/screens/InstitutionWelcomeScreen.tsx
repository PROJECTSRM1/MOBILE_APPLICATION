import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const InstitutionWelcomeScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* TOP SECTION - BRAND HEADER */}
      <LinearGradient
        colors={[colors.primary, colors.primary]}
        style={styles.topSection}
      >
        {/* Decorative Background Circle */}
        <View style={styles.decorativeCircle} />
        
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Icon name="school" size={60} color="#ffffff" />
        </View>
        
        {/* Title */}
        <Text style={styles.title}>University Portal</Text>
        <Text style={styles.subtitle}>Excellence in Education</Text>
      </LinearGradient>

      {/* BOTTOM SECTION - INTERACTION ZONE */}
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          {/* Headline & Body */}
          <View style={styles.textSection}>
            <Text style={styles.headline}>Welcome Back</Text>
            <Text style={styles.bodyText}>
              Access your institutional resources and manage your student profile.
            </Text>
          </View>

          {/* Button Group */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => navigation.navigate("InstitutionLoginPortal")}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={() => navigation.navigate("InstitutionRegistrationStep1")}
              activeOpacity={0.8}
            >
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Meta Text */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our
            </Text>
            <TouchableOpacity>
              <Text style={styles.termsLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InstitutionWelcomeScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topSection: {
      flex: 0.95,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 30,
      position: "relative",
      overflow: "hidden",
    },
    decorativeCircle: {
      position: "absolute",
      bottom: -50,
      right: -50,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    logoContainer: {
      width: 100,
      height: 100,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: -0.5,
      textAlign: "center",
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: "400",
      color: "rgba(255, 255, 255, 0.85)",
      textAlign: "center",
    },
    bottomSection: {
      flex: 1.05,
      backgroundColor: colors.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      marginTop: -32,
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 40,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 24,
    },
    contentContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "space-between",
    },
    textSection: {
      marginBottom: 24,
      alignItems: "center",
    },
    headline: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: -0.5,
      lineHeight: 34,
      marginBottom: 10,
      textAlign: "center",
    },
    bodyText: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.subText,
      lineHeight: 20,
      textAlign: "center",
      paddingHorizontal: 8,
    },
    buttonGroup: {
      width: "100%",
      gap: 14,
    },
    signInButton: {
      width: "100%",
      height: 54,
      backgroundColor: colors.primary,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
    },
    signInButtonText: {
      fontSize: 17,
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 0.2,
    },
    createAccountButton: {
      width: "100%",
      height: 54,
      backgroundColor: colors.card ?? colors.surface,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    createAccountButtonText: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 0.2,
    },
    footer: {
      marginTop: 20,
      paddingTop: 8,
      paddingBottom: 8,
      alignItems: "center",
      gap: 4,
    },
    footerText: {
      fontSize: 11,
      fontWeight: "400",
      color: colors.subText,
      textAlign: "center",
    },
    termsLink: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.primary,
      textDecorationLine: "underline",
      marginTop: 2,
    },
  });