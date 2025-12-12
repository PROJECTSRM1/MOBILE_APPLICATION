import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Platform,
  Alert, // ✅ Import Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

// Define the Root Stack for type safety
type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
   FreelancerPremiumFlow: undefined;// Target screen
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
  if (!email || !password) {
    Alert.alert("Validation Error", "Please enter email and password");
    return;
  }

  // Correct navigation
  navigation.replace("FreelancerPremiumFlow");
};
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>&lt;</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Main Card */}
        <View style={styles.card}>
          {/* Left Panel */}
          <View style={styles.leftPanel}>
            <Text style={styles.logoTitle}>Swachify Freelance</Text>
            <Text style={styles.panelSubtitle}>
              Empowering freelancers with real-time job opportunities nearby.
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>• Instant job requests</Text>
              <Text style={styles.featureItem}>• Manage your projects</Text>
              <Text style={styles.featureItem}>• Track your earnings</Text>
              <Text style={styles.featureItem}>• Build professional reputation</Text>
            </View>
          </View>

          {/* Right Panel */}
          <View style={styles.rightPanel}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.accessText}>Login to access your freelancer dashboard</Text>

            {/* Email Input */}
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Text style={styles.passwordToggleText}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.customCheckbox, rememberMe && styles.customCheckboxActive]}>
                  {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.signupTextContainer}>
              <Text style={styles.dontHaveAccountText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Sign up free</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  backButton: { position: "absolute", top: 30, left: 20, flexDirection: "row", alignItems: "center", padding: 10, zIndex: 10 },
  backArrow: { fontSize: 20, color: "#000", marginRight: 5, fontWeight: "bold" },
  backText: { fontSize: 14, color: "#000", marginLeft: 5 },
  card: {
    flexDirection: width > 768 ? "row" : "column",
    width: width > 768 ? 900 : width * 0.9,
    minHeight: width > 768 ? 550 : "auto",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginTop: 50,
  },
  leftPanel: { width: width > 768 ? "40%" : "100%", padding: 40, justifyContent: "center", backgroundColor: "#4c26a7" },
  logoTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  panelSubtitle: { fontSize: 14, color: "#e0e0e0", marginBottom: 30 },
  featureList: { gap: 15, marginTop: 20 },
  featureItem: { fontSize: 15, color: "#fff", fontWeight: "600" },
  rightPanel: { width: width > 768 ? "60%" : "100%", padding: 40, paddingTop: 50 },
  welcomeTitle: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 5 },
  accessText: { fontSize: 16, color: "#555", marginBottom: 30 },
  label: { fontSize: 14, color: "#333", fontWeight: "500", marginBottom: 8, marginTop: 15 },
  input: { height: 48, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 15, backgroundColor: "#fff" },
  passwordContainer: { flexDirection: "row", alignItems: "center", height: 48, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, backgroundColor: "#fff" },
  passwordInput: { flex: 1, paddingHorizontal: 15, fontSize: 15 },
  eyeIcon: { padding: 10 },
  passwordToggleText: { fontSize: 14, color: "#888", fontWeight: "600" },
  optionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15, marginBottom: 25 },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  customCheckbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#888", justifyContent: "center", alignItems: "center" },
  customCheckboxActive: { backgroundColor: "#000", borderColor: "#000" },
  checkboxCheck: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  rememberMeText: { fontSize: 13, color: "#555", marginLeft: 10 },
  forgotPasswordText: { fontSize: 13, color: "#007bff", fontWeight: "500" },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
      android: { elevation: 8 },
    }),
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  signupTextContainer: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  dontHaveAccountText: { fontSize: 14, color: "#555" },
  signupLink: { fontSize: 14, color: "#007bff", fontWeight: "600" },
});
