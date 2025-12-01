import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

interface SignupProps {
  onSignupDone: (email: string) => void; // pass email to login
  onGoToLogin: () => void;
  onBack: () => void;
}

export default function Signup2({ onSignupDone, onGoToLogin, onBack }: SignupProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [govtId, setGovtId] = useState("");

  const validateSignup = () => {
    if (!email.includes("@")) return Alert.alert("Enter valid email");
    if (!phone.trim()) return Alert.alert("Enter phone number");
    if (!govtId.trim()) return Alert.alert("Enter Government ID");

    // Manual verification (no backend)
    Alert.alert("Verification Complete", "Your Government ID is verified manually.");

    // Pass email to login screen
    onSignupDone(email);
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
          placeholder="Enter your phone number"
          placeholderTextColor="#B5B5B5"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Government ID Field */}
      <View style={styles.inputBox}>
        <Text style={styles.icon}>🪪</Text>
        <TextInput
          placeholder="Enter your Govt ID (Aadhar / PAN / DL)"
          placeholderTextColor="#B5B5B5"
          style={styles.input}
          value={govtId}
          onChangeText={setGovtId}
        />
      </View>

      {/* Manual Verify Button */}
      <TouchableOpacity style={styles.signupBtn} onPress={validateSignup}>
        <Text style={styles.signupText}>Verify & Sign Up</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.or}>or continue with</Text>

      {/* Google */}
      <TouchableOpacity style={styles.googleBtn}>
        <Image
          source={require("../assets/google.png")}
          style={styles.googleImg}
        />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      {/* Bottom Link */}
      <Text style={styles.bottomText}>
        Already have an account?{" "}
        <Text style={styles.loginLink} onPress={onGoToLogin}>
          Login
        </Text>
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
