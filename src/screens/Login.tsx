 
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const Login: React.FC = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = () => {
    // TODO: Hook up your real API here
    console.log("Login:", { email, password, remember });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      <LinearGradient
        colors={["#3B82F6", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.root}
      >
        {/* Back button same style as Signup */}   
        <TouchableOpacity
          style={styles.backTop}
          onPress={() => navigation.navigate("Freelancer")}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainRow}>
            {/* LEFT BRAND PANEL (similar to signup left card style) */}
            <View style={styles.leftCard}>
              <LinearGradient
                colors={["#0EA5E9", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.leftInner}
              >
                <Text style={styles.brandTitle}>Swachify Freelance</Text>
                <Text style={styles.leftSubtitle}>
                  Empowering freelancers with real-time job opportunities
                  nearby.
                </Text>

                <View style={styles.bulletRow}>
                  <Text style={styles.bulletIcon}>⚡</Text>
                  <Text style={styles.bulletText}>Instant job requests</Text>
                </View>

                <View style={styles.bulletRow}>
                  <Text style={styles.bulletIcon}>💼</Text>
                  <Text style={styles.bulletText}>Manage your projects</Text>
                </View>

                <View style={styles.bulletRow}>
                  <Text style={styles.bulletIcon}>🪙</Text>
                  <Text style={styles.bulletText}>Track your earnings</Text>
                </View>

                <View style={styles.bulletRow}>
                  <Text style={styles.bulletIcon}>⭐</Text>
                  <Text style={styles.bulletText}>
                    Build professional reputation
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* RIGHT LOGIN CARD – same “card” feeling as signup form card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Welcome Back</Text>
              <Text style={styles.formSubtitle}>
                Login to access your freelancer dashboard
              </Text>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword((p) => !p)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeText}>
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember + Forgot */}
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRemember((p) => !p)}
                  activeOpacity={0.8}
                >
                  <View style={styles.checkbox}>
                    {remember && <View style={styles.checkboxTick} />}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => console.log("Forgot password")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login button */}
              <TouchableOpacity
                style={styles.loginBtn}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("FreelancerDashboard")}
              >
                <Text style={styles.loginBtnText}>Login</Text>
              </TouchableOpacity>

              {/* Signup link */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don&apos;t have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Signup")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signupLink}>Sign up free</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

// Back button – same style as Signup
  backTop: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    color: "#E5E7EB",
    fontSize: 16,
    marginRight: 4,
  },
  backText: {
    color: "#E5E7EB",
    fontSize: 14,
  },

  contentContainer: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: "center",
  },
  mainRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  /* LEFT CARD (brand panel) */
  leftCard: {
    width: "100%",
    backgroundColor: "rgba(15,23,42,0.18)",
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  leftInner: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  brandTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  leftSubtitle: {
    color: "#E5E7EB",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  bulletText: {
    color: "#F9FAFB",
    fontSize: 13,
  },

  /* LOGIN FORM CARD */
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  formSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 18,
  },

  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    fontSize: 14,
    color: "#111827",
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eyeText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxTick: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#111827",
  },
  rememberText: {
    fontSize: 12,
    color: "#374151",
  },

  forgotText: {
    fontSize: 12,
    color: "#2563EB",
  },

  loginBtn: {
    backgroundColor: "#000000",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  signupText: {
    fontSize: 13,
    color: "#6B7280",
  },
  signupLink: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "700",
  },
});
