import React, { useState, useRef } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const STATIC_OTP = "123456";

const InstitutionOTPVerification = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { registrationNumber, email } = route.params || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the complete 6-digit OTP");
      return;
    }

    if (enteredOtp === STATIC_OTP) {
      Alert.alert("Success", "OTP verified successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("InstitutionPartnerPortal"),
        },
      ]);
    } else {
      Alert.alert("Invalid OTP", "The OTP you entered is incorrect. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = () => {
    Alert.alert("OTP Sent", `A new OTP has been sent to ${email}`);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
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
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.mainContent}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <Icon name="mail-outline" size={48} color={colors.primary} />
        </View>

        {/* Title Section */}
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {"\n"}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOTP}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Registration Number Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Registration Number</Text>
          <Text style={styles.infoValue}>{registrationNumber}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            For demo purposes, use OTP: <Text style={styles.demoOtp}>123456</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InstitutionOTPVerification;

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
      paddingVertical: 10,
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
      paddingTop: 24,
      paddingBottom: 20,
      width: "100%",
    },
    iconContainer: {
      width: 110,
      height: 110,
      backgroundColor: colors.primary + "0D",
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 28,
      alignSelf: "center",
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: -0.5,
      lineHeight: 34,
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.subText,
      lineHeight: 20,
      marginBottom: 36,
      textAlign: "center",
      paddingHorizontal: 16,
    },
    emailText: {
      fontWeight: "600",
      color: colors.primary,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginBottom: 32,
      paddingHorizontal: 8,
    },
    otpInput: {
      width: 48,
      height: 58,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    otpInputFilled: {
      borderColor: colors.primary,
      borderWidth: 2,
      backgroundColor: colors.primary + "0D",
    },
    verifyButton: {
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
      marginBottom: 20,
    },
    verifyButtonText: {
      fontSize: 17,
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 0.3,
    },
    resendContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      marginBottom: 24,
      flexWrap: "wrap",
      paddingHorizontal: 16,
    },
    resendText: {
      fontSize: 13,
      fontWeight: "400",
      color: colors.subText,
    },
    resendLink: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
      textDecorationLine: "underline",
    },
    infoCard: {
      width: "100%",
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 20,
      alignItems: "center",
      gap: 4,
      marginBottom: 20,
    },
    infoLabel: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.subText,
      letterSpacing: 1.6,
      textTransform: "uppercase",
    },
    infoValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 1,
      marginTop: 2,
    },
    footer: {
      marginTop: "auto",
      paddingTop: 16,
      paddingBottom: 12,
      alignItems: "center",
    },
    footerText: {
      fontSize: 11,
      fontWeight: "400",
      color: colors.subText,
      textAlign: "center",
      lineHeight: 16,
    },
    demoOtp: {
      fontWeight: "700",
      color: colors.primary,
      fontSize: 13,
    },
  });