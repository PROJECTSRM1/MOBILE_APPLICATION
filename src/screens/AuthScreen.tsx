import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";

/* ================= VALIDATIONS ================= */

const onlyLetters = (text: string) => text.replace(/[^a-zA-Z\s]/g, "");
const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, "");
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ================= SCREEN ================= */

const AuthScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // ✅ UPDATED STATES
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    if (!firstName || !lastName || !mobile || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Enter a valid email");
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert("Error", "Enter valid 10-digit mobile number");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const user = { firstName, lastName, mobile, email, password };

    await AsyncStorage.setItem("userData", JSON.stringify(user));

    Alert.alert("Success", "Registered successfully. Please login.", [
      {
        text: "OK",
        onPress: () => {
          setActiveTab("login");
          setPassword("");
          setConfirmPassword("");
        },
      },
    ]);
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    const stored = await AsyncStorage.getItem("userData");
    if (!stored) {
      Alert.alert("Not Registered", "Please register first");
      return;
    }

    const user = JSON.parse(stored);

    if (email !== user.email || password !== user.password) {
      Alert.alert("Invalid Credentials", "Email or password incorrect");
      return;
    }

    // ✅ PROFILE FOR ProfileInformation SCREEN
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
    };

    await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));
    await AsyncStorage.setItem("isLoggedIn", "true");

    Alert.alert("Login Successful", "Welcome back!", [
      { text: "OK", onPress: () => navigation.replace("Landing") },
    ]);
  };

  /* ================= UI ================= */

  return (
    <LinearGradient colors={["#020617", "#020617"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "login" && styles.activeTab]}
              onPress={() => setActiveTab("login")}
            >
              <Text style={styles.tabText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
            >
              <Text style={styles.tabText}>Register</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "register" && (
            <>
              <Input label="First Name" value={firstName} onChange={(t: string) => setFirstName(onlyLetters(t))} />
              <Input label="Last Name" value={lastName} onChange={(t: string) => setLastName(onlyLetters(t))} />
              <Input label="Mobile Number" value={mobile} onChange={(t: string) => setMobile(onlyNumbers(t).slice(0, 10))} />
              <Input label="Email" value={email} onChange={setEmail} />

              <PasswordInput
                label="Create Password"
                value={password}
                onChange={setPassword}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />

              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                <Text style={styles.primaryText}>Register</Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === "login" && (
            <>
              <Input label="Email" value={email} onChange={setEmail} />

              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
                <Text style={styles.primaryText}>Login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

/* ================= INPUT COMPONENTS ================= */

const Input = ({ label, value, onChange }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#9ca3af"
    />
  </>
);

const PasswordInput = ({ label, value, onChange, show, toggle }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.passwordWrapper}>
      <TextInput
        style={styles.passwordInput}
        value={value}
        secureTextEntry={!show}
        onChangeText={onChange}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#9ca3af"
      />
      <TouchableOpacity onPress={toggle}>
        <Icon name={show ? "visibility" : "visibility-off"} size={22} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  </>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 16 },
  card: { backgroundColor: "#0b1220", borderRadius: 20, padding: 20 },

  tabs: { flexDirection: "row", marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#1f2937" },
  activeTab: { borderBottomColor: "#2563eb" },
  tabText: { color: "#fff", fontWeight: "700" },

  label: { color: "#e5e7eb", marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: "#111827", borderRadius: 12, padding: 14, marginBottom: 14, color: "#fff" },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  passwordInput: { flex: 1, color: "#fff", paddingVertical: 14 },

  primaryBtn: { backgroundColor: "#2563eb", padding: 16, borderRadius: 14, alignItems: "center", marginTop: 10 },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

export default AuthScreen;
