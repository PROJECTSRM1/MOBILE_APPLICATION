import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://swachify-india-be-1-mcrb.onrender.com";

// Configuration
const API_CONFIG = {
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 2,
  RETRY_DELAY: 2000,
};

const InstitutionLoginPortal = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    if (!registrationNumber.trim()) {
      Alert.alert("Required", "Please enter your registration number");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email address");
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  /**
   * Delay utility function
   */
  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  /**
   * Save login session data
   */
  const saveLoginSession = async (
    institutionData: any,
    email: string,
    identityNumber: string
  ) => {
    try {
      const sessionData = {
        isLoggedIn: true,
        institutionId: institutionData.institution_id || institutionData.id,
        institutionName: institutionData.institution_name,
        email: email,
        identityNumber: identityNumber,
        loginTime: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        "@institution_session",
        JSON.stringify(sessionData)
      );

      console.log("✓ Session saved successfully");
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  /**
   * Login API call with retry logic
   */
  const loginWithRetry = async (
    retryCount: number = 0
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    const payload = {
      email: email.trim().toLowerCase(),
      identity_number: registrationNumber.trim(),
    };

    console.log("\n=== Institution Login API Call ===");
    console.log("URL:", `${BASE_URL}/institution/student/login`);
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("Attempt:", retryCount + 1);
    console.log("===================================\n");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.REQUEST_TIMEOUT
      );

      const response = await fetch(`${BASE_URL}/institution/student/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("=== Login API Response ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      // Try to get response text
      let responseText = "";
      try {
        responseText = await response.text();
        console.log("Response Text:", responseText);
      } catch (textError) {
        console.error("Error reading response text:", textError);
      }

      console.log("==========================\n");

      // Parse JSON response
      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          throw new Error("Invalid JSON response from server");
        }
      } else {
        console.error("Non-JSON response received:", responseText);
        if (!response.ok) {
          throw new Error(responseText || `Server error: ${response.status}`);
        }
        // If OK but non-JSON, try to handle
        throw new Error(
          "Server returned non-JSON response. Please contact support."
        );
      }

      if (!response.ok) {
        // Check if we should retry on server errors (500+)
        if (retryCount < API_CONFIG.MAX_RETRIES && response.status >= 500) {
          console.log(
            `Server error (${response.status}), retrying in ${API_CONFIG.RETRY_DELAY}ms...`
          );
          await delay(API_CONFIG.RETRY_DELAY);
          return loginWithRetry(retryCount + 1);
        }

        // For 4xx errors (authentication failed), don't retry
        const errorMessage =
          responseData.message ||
          responseData.detail ||
          responseData.error ||
          "Login failed. Please check your credentials.";

        return {
          success: false,
          error: errorMessage,
        };
      }

      // Success
      console.log("=== Login Successful ===");
      console.log("Response Data:", JSON.stringify(responseData, null, 2));
      console.log("========================\n");

      return {
        success: true,
        data: responseData,
      };
    } catch (error: any) {
      console.error("=== Login API Error ===");
      console.error("Error:", error);
      console.error("Error Message:", error.message);
      console.error("=======================\n");

      // Retry on network/timeout errors
      if (
        retryCount < API_CONFIG.MAX_RETRIES &&
        (error.name === "AbortError" ||
          error.message?.includes("Network") ||
          error.message?.includes("timeout"))
      ) {
        console.log(
          `Network/timeout error, retrying in ${API_CONFIG.RETRY_DELAY}ms...`
        );
        await delay(API_CONFIG.RETRY_DELAY);
        return loginWithRetry(retryCount + 1);
      }

      return {
        success: false,
        error: error.message || "Network error occurred. Please try again.",
      };
    }
  };

  /**
   * Handle Login
   */
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await loginWithRetry();

      if (result.success && result.data) {
        // Save login session
        await saveLoginSession(
          result.data,
          email.trim(),
          registrationNumber.trim()
        );

        // Show success message
        Alert.alert(
          "Login Successful",
          `Welcome, ${result.data.institution_name || "Institution"}!`,
          [
            {
              text: "Continue",
              onPress: () => {
                // Navigate to PortalStandalonePartner
                navigation.navigate("PartnerPortalStandalone", {
                  institutionId:
                    result.data.institution_id || result.data.id || null,
                  institutionName: result.data.institution_name || "",
                });
              },
            },
          ]
        );
      } else {
        // Login failed
        Alert.alert(
          "Login Failed",
          result.error ||
            "Unable to login. Please check your credentials and try again."
        );
      }
    } catch (error: any) {
      console.error("=== Unexpected Error ===");
      console.error("Error:", error);
      console.error("========================\n");

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.name === "AbortError") {
        errorMessage =
          "Request timed out. Please check your internet connection and try again.";
      } else if (
        error.message?.includes("Network request failed") ||
        error.name === "TypeError"
      ) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
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
              style={[styles.input, loading && styles.inputDisabled]}
              placeholder="e.g., REG-123456"
              placeholderTextColor={colors.subText + "80"}
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          {/* Email Address Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={[styles.input, loading && styles.inputDisabled]}
              placeholder="e.g., admin@institution.edu"
              placeholderTextColor={colors.subText + "80"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.loginButtonText}>Logging in...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Help Link */}
          <TouchableOpacity
            style={styles.helpLink}
            disabled={loading}
            onPress={() => {
              Alert.alert(
                "Need Help?",
                "Please contact your institution administrator or support team for assistance with your registration number.",
                [{ text: "OK" }]
              );
            }}
          >
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
          <TouchableOpacity
            style={[styles.ssoButton, loading && styles.ssoButtonDisabled]}
            activeOpacity={0.8}
            disabled={loading}
            onPress={() => {
              Alert.alert(
                "SSO Login",
                "Single Sign-On feature coming soon!",
                [{ text: "OK" }]
              );
            }}
          >
            <Icon
              name="domain"
              size={20}
              color={loading ? colors.subText : colors.text}
            />
            <Text
              style={[
                styles.ssoButtonText,
                loading && { color: colors.subText },
              ]}
            >
              Log in with SSO
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>AUTHORIZED ACCESS ONLY</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity
              disabled={loading}
              onPress={() => {
                Alert.alert("Support", "Contact: support@swachify.com");
              }}
            >
              <Text style={styles.footerLink}>Support</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity
              disabled={loading}
              onPress={() => {
                Alert.alert("Privacy", "Privacy policy information here.");
              }}
            >
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
    inputDisabled: {
      opacity: 0.6,
      backgroundColor: colors.surface + "80",
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
    loginButtonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 0.3,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
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
    ssoButtonDisabled: {
      opacity: 0.5,
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