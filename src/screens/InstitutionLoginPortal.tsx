import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const InstitutionLoginPortal = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!registrationNumber.trim()) {
      Alert.alert("Required", "Please enter your registration number");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    // Navigate to OTP verification
    navigation.navigate("InstitutionOTPVerification", {
      registrationNumber,
      email,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Institutional Login</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.mainContent}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <Icon name="school" size={48} color={colors.primary} />
        </View>

        {/* Title Section */}
        <Text style={styles.title}>Institutional Login</Text>
        <Text style={styles.subtitle}>
          Enter your registration details to continue.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Registration Number Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>REGISTRATION NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., REG-123456"
              placeholderTextColor={colors.subText + "80"}
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              autoCapitalize="characters"
            />
          </View>

          {/* Email Address Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., admin@institution.edu"
              placeholderTextColor={colors.subText + "80"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Help Link */}
          <TouchableOpacity style={styles.helpLink}>
            <Text style={styles.helpLinkText}>
              Can't find your registration number?
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* SSO Button */}
          <TouchableOpacity style={styles.ssoButton} activeOpacity={0.8}>
            <Icon name="domain" size={20} color={colors.text} />
            <Text style={styles.ssoButtonText}>Log in with SSO</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>AUTHORIZED ACCESS ONLY</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Support</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InstitutionLoginPortal;

const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: "flex-start",
      justifyContent: "center",
      paddingLeft: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    mainContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 32,
      paddingBottom: 24,
      width: "100%",
    },
    iconContainer: {
      width: 120,
      height: 120,
      backgroundColor: colors.primary + "0D",
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 32,
      alignSelf: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: -0.5,
      lineHeight: 36,
      marginBottom: 12,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 15,
      fontWeight: "400",
      color: colors.subText,
      lineHeight: 22,
      marginBottom: 48,
      textAlign: "center",
      paddingHorizontal: 16,
    },
    form: {
      width: "100%",
      gap: 28,
    },
    fieldContainer: {
      gap: 10,
    },
    label: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.subText,
      letterSpacing: 1.8,
      textAlign: "center",
      marginBottom: 2,
    },
    input: {
      width: "100%",
      height: 64,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 18,
      paddingHorizontal: 20,
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      textAlign: "center",
      letterSpacing: 0.5,
    },
    loginButton: {
      width: "100%",
      height: 58,
      backgroundColor: colors.primary,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 10,
      marginTop: 8,
    },
    loginButtonText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 0.3,
    },
    helpLink: {
      alignItems: "center",
      marginTop: -8,
      paddingVertical: 8,
    },
    helpLinkText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginVertical: 8,
      paddingHorizontal: 16,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.subText,
      letterSpacing: 2.8,
    },
    ssoButton: {
      width: "100%",
      height: 58,
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    ssoButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    footer: {
      marginTop: "auto",
      paddingTop: 32,
      paddingBottom: 16,
      alignItems: "center",
      gap: 12,
    },
    footerTitle: {
      fontSize: 10,
      fontWeight: "500",
      color: colors.subText + "AA",
      letterSpacing: 2.2,
      lineHeight: 18,
      textAlign: "center",
    },
    footerLinks: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    footerLink: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.subText,
    },
    footerDot: {
      fontSize: 12,
      color: colors.border,
    },
  });