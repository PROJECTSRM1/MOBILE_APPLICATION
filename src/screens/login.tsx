import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface LoginProps {
  onLoginDone: () => void;
  onGoToSignup: () => void;
  onBack: () => void;
}

export default function Login({ onLoginDone, onGoToSignup, onBack }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

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
          secureTextEntry={!showPass}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Text style={styles.eye}>{showPass ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={onLoginDone}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or continue with</Text>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleBtn}>
        <Text style={styles.googleIcon}>🌐</Text>
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Don't have an account?{" "}
        <Text style={styles.signupLink} onPress={onGoToSignup}>
          Sign up
        </Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: "#fff" },

  backBtn: { marginBottom: 25 },
  backIcon: { fontSize: 24, color: "#222" },

  header: { fontSize: 30, fontWeight: "700", marginBottom: 35, color: "#000" },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },

  icon: { fontSize: 20, marginRight: 12, color: "#888" },

  input: { flex: 1, fontSize: 16, color: "#000" },

  eye: { fontSize: 22, marginLeft: 10 },

  forgot: { alignSelf: "flex-end", marginBottom: 25 },
  forgotText: { color: "#444", fontSize: 14 },

  loginBtn: {
    backgroundColor: "#222",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
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
    marginBottom: 25,
    backgroundColor: "#fff",
  },
  googleIcon: { fontSize: 20, marginRight: 10 },
  googleText: { fontSize: 16, color: "#000" },

  bottomText: { textAlign: "center", fontSize: 15, color: "#444" },
  signupLink: { fontWeight: "700", color: "#000" },
});
