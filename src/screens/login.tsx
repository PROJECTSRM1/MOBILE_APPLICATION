import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

interface LoginProps {
  onLoginDone: (role: "user" | "customer") => void;
  onGoToSignup: () => void;
  onBack: () => void;
  prefillEmail?: string;
}

export default function Login({
  onLoginDone,
  onGoToSignup,
  onBack,
  prefillEmail,
}: LoginProps) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "customer">("user");

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
  }, [prefillEmail]);

  const handleLogin = () => {
    if (!email.includes("@")) return Alert.alert("Enter valid email");
    if (!password.trim()) return Alert.alert("Enter valid password");

    // Role-based login
    onLoginDone(role);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.header}>Hey,{"\n"}Welcome Back</Text>

      {/* Email Input */}
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

      {/* Password Input */}
      <View style={styles.inputBox}>
        <Text style={styles.icon}>🔒</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#B5B5B5"
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Select Login Role */}
      <Text style={styles.roleLabel}>Login as:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleBtn, role === "user" && styles.roleActive]}
          onPress={() => setRole("user")}
        >
          <Text style={[styles.roleText, role === "user" && styles.roleTextActive]}>
            User
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleBtn, role === "customer" && styles.roleActive]}
          onPress={() => setRole("customer")}
        >
          <Text
            style={[
              styles.roleText,
              role === "customer" && styles.roleTextActive,
            ]}
          >
            Customer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
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

      {/* Bottom */}
      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Text style={styles.signupLink} onPress={onGoToSignup}>
          Sign Up
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

  roleLabel: { marginTop: 10, marginBottom: 8, color: "#444", fontSize: 15 },
  roleContainer: { flexDirection: "row", marginBottom: 20 },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#aaa",
    alignItems: "center",
    marginRight: 10,
  },
  roleActive: { backgroundColor: "#222", borderColor: "#222" },
  roleText: { fontSize: 15, color: "#555" },
  roleTextActive: { color: "#fff", fontWeight: "700" },

  loginBtn: {
    backgroundColor: "#222",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  or: { textAlign: "center", marginVertical: 22, color: "#666", fontSize: 15 },

  googleBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 28,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 25,
  },
  googleImg: { width: 22, height: 22, marginRight: 10 },
  googleText: { fontSize: 16, color: "#000" },

  bottomText: { textAlign: "center", fontSize: 15, color: "#444" },
  signupLink: { fontWeight: "700", color: "#000" },
});
