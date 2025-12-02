import React, { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

interface SignupProps {
  onSignupDone: (email: string, password: string) => void; // Pass password too
  onGoToLogin: () => void;
  onBack: () => void;
}

export default function Signup({ onSignupDone, onGoToLogin, onBack }: SignupProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = () => {
    if (!email.includes("@")) return Alert.alert("Enter valid email");
    if (!password.trim()) return Alert.alert("Enter a password");
    if (!phone.trim()) return Alert.alert("Enter phone number");

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);

    Alert.alert("OTP Sent", `Your OTP is: ${randomOtp}`);
  };

  const verifyOtp = () => {
  if (otp !== generatedOtp) return Alert.alert("Invalid OTP");
  onSignupDone(email, password);  // <-- pass password here
};
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.header}>Let's{"\n"}get started</Text>

      {/* Email */}
      <View style={styles.inputBox}>
        <Text style={styles.icon}>📧</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#B5B5B5"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Phone Number */}
      <View style={styles.inputBox}>
        <Text style={styles.icon}>📱</Text>
        <TextInput
          placeholder="Enter your phone no"
          placeholderTextColor="#B5B5B5"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Password */}
      <View style={styles.inputBox}>
        <Text style={styles.icon}>🔒</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#B5B5B5"
          style={styles.input}
          secureTextEntry={true}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* OTP Button */}
      {!otpSent && (
        <TouchableOpacity style={styles.signupBtn} onPress={sendOtp}>
          <Text style={styles.signupText}>Send OTP</Text>
        </TouchableOpacity>
      )}

      {/* OTP Input */}
      {otpSent && (
        <>
          <View style={styles.inputBox}>
            <Text style={styles.icon}>🔢</Text>
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor="#B5B5B5"
              style={styles.input}
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
            />
          </View>

          <TouchableOpacity style={styles.signupBtn} onPress={verifyOtp}>
            <Text style={styles.signupText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Divider */}
      <Text style={styles.or}>or continue with</Text>

      {/* Google */}
      <TouchableOpacity style={styles.googleBtn}>
        <Image source={require("../assets/google.png")} style={styles.googleImg} />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      {/* Bottom Text */}
      <Text style={styles.bottomText}>
        Already have an account?{" "}
        <Text style={styles.loginLink} onPress={onGoToLogin}>Login</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: "#ccc" },
  backBtn: { marginBottom: 25 },
  backIcon: { fontSize: 24, color: "#222" },
  header: { fontSize: 30, fontWeight: "700", marginBottom: 35, color: "#000" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 18,
    backgroundColor: "#FAFAFA",
  },
  icon: { fontSize: 18, marginRight: 10, color: "#A8A8A8" },
  input: { flex: 1, fontSize: 15, color: "#000" },
  signupBtn: {
    backgroundColor: "#222",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 10,
  },
  signupText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  or: { textAlign: "center", marginVertical: 22, color: "#666", fontSize: 15, marginTop: 30, marginBottom: 20 },
  googleBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 28,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 50,
    backgroundColor: "#fff",
  },
  googleImg: { width: 22, height: 22, marginRight: 10 },
  googleText: { fontSize: 16, color: "#000" },
  bottomText: { textAlign: "center", fontSize: 15, color: "#444" },
  loginLink: { fontWeight: "700", color: "#000" },
});
