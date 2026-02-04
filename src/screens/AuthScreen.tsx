import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";

/* ================= API CONFIG ================= */

const API_BASE_URL = "https://swachify-india-be-1-mcrb.onrender.com"; // Replace with your actual API base URL

/* ================= VALIDATIONS ================= */

const onlyLetters = (text: string) => text.replace(/[^a-zA-Z\s]/g, "");
const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, "");
const validateEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

/* ================= SCREEN ================= */

const AuthScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  // REGISTER STATES
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= REGISTER API ================= */

  const handleRegister = async () => {
    console.log("=== REGISTER FUNCTION CALLED ===");
    
    // Validation
    if (!firstName || !lastName || !mobile || !email || !password || !confirmPassword) {
      console.log("❌ Validation failed: All fields are required");
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      console.log("❌ Validation failed: Invalid email");
      Alert.alert("Error", "Enter a valid email");
      return;
    }

    if (mobile.length !== 10) {
      console.log("❌ Validation failed: Invalid mobile number");
      Alert.alert("Error", "Enter valid 10-digit mobile number");
      return;
    }

  

    if (password.length < 6) {
      console.log("❌ Validation failed: Password too short");
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      console.log("❌ Validation failed: Passwords do not match");
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    console.log("✅ All validations passed");

    // Prepare request body
    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      mobile: mobile,
      password: password,
      confirm_password: confirmPassword,
      work_type_id: 1,
      service_ids: [],
      professional_details: {
        experience_years: null,
        expertise_in: []
      },
      gender_id: null,
      dob: null,
      state_id: null,
      district_id: null,
      address: null,
      business_type_id: null,
      product_name: null,
      business_description: null,
      org_name: null,
      gst_number: null,
      job_skill_id: null,
      government_id: {}
    };

    console.log("📦 Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("🌐 API URL:", `${API_BASE_URL}/api/auth/register`);

    setLoading(true);

    try {
      console.log("🚀 Starting API call...");
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response Status:", response.status);
      console.log("📡 Response OK:", response.ok);

      const data = await response.json();
      console.log("📥 Response Data:", JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log("✅ Registration successful");
        
        // Store user data in AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        console.log("💾 User data stored in AsyncStorage");

        Alert.alert("Success", "Registered successfully. Please login.", [
          {
            text: "OK",
            onPress: () => {
              setActiveTab("login");
              setPassword("");
              setConfirmPassword("");
              // Clear registration fields
              setFirstName("");
              setLastName("");
              setMobile("");
              setEmail("");
              console.log("🔄 Switched to login tab and cleared fields");
            },
          },
        ]);
      } else {
        // Handle error response
        const errorMessage = data.message || data.error || "Registration failed";
        console.log("❌ Registration failed:", errorMessage);
        Alert.alert("Registration Failed", errorMessage);
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      console.log("=== REGISTER FUNCTION COMPLETED ===\n");
    }
  };

  /* ================= LOGIN API ================= */

  const handleLogin = async () => {
    console.log("=== LOGIN FUNCTION CALLED ===");
    
    // Validation
    if (!email || !password) {
      console.log("❌ Validation failed: Email and password are required");
      Alert.alert("Error", "Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      console.log("❌ Validation failed: Invalid email");
      Alert.alert("Error", "Enter a valid email");
      return;
    }

    console.log("✅ All validations passed");

    // Prepare request body
    const requestBody = {
      email_or_phone: email,
      password: password,
      latitude: null,
      longitude: null,
    };

    console.log("📦 Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("🌐 API URL:", `${API_BASE_URL}/api/auth/login`);

    setLoading(true);

    try {
      console.log("🚀 Starting API call...");
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response Status:", response.status);
      console.log("📡 Response OK:", response.ok);

      const data = await response.json();
      console.log("📥 Response Data:", JSON.stringify(data, null, 2));

      if (response.ok) {

  console.log("✅ Login successful");

  // ✅ Save login flag
  await AsyncStorage.setItem("isLoggedIn", "true");

  // ✅ Save full response
  await AsyncStorage.setItem(
    "userData",
    JSON.stringify(data)
  );

  // ✅ Build user profile for Profile screen
  const userProfile = {
    firstName: data.email_or_phone?.split("@")[0] || "",
    lastName: "",
    email: data.email_or_phone || "",
    mobile: "",
    role: data.role || "",
    selectedServices: data.service_ids || []
  };

  // ✅ Save profile
  await AsyncStorage.setItem(
    "userProfile",
    JSON.stringify(userProfile)
  );

  // ✅ Save token
  if (data.access_token) {
    await AsyncStorage.setItem("authToken", data.access_token);
  }

  Alert.alert("Login Successful", "Welcome back!", [
    {
      text: "OK",
      onPress: () => {
        setEmail("");
        setPassword("");
        navigation.replace("Landing");
      }
    }
  ]);
        
        // Store user data and auth token in AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        console.log("💾 User data stored in AsyncStorage");
        
        await AsyncStorage.setItem("isLoggedIn", "true");
        console.log("💾 Login status stored in AsyncStorage");
        
        // Store user profile if available
        await AsyncStorage.setItem(
  "userData",
  JSON.stringify(data)
);
        if (data.user) {

  const userProfile = {
  firstName: data.email_or_phone?.split("@")[0] || "",
  lastName: "",
  email: data.email_or_phone || "",
  mobile: "",
  role: data.role || "",
  selectedServices: data.service_ids || []
};


  await AsyncStorage.setItem(
    "userProfile",
    JSON.stringify(userProfile)
  );

  console.log("💾 User profile stored:", userProfile);
        }

        // Store auth token if available
        if (data.token) {
          await AsyncStorage.setItem("authToken", data.token);
          console.log("💾 Auth token stored in AsyncStorage");
        }

        Alert.alert("Login Successful", "Welcome back!", [
          { 
            text: "OK", 
            onPress: () => {
              // Clear login fields
              setEmail("");
              setPassword("");
              console.log("🔄 Navigating to Landing screen");
              navigation.replace("Landing");
            }
          },
        ]);
      } else {
        // Handle error response
        const errorMessage = data.message || data.error || "Invalid credentials";
        console.log("❌ Login failed:", errorMessage);
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      console.log("=== LOGIN FUNCTION COMPLETED ===\n");
    }
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
              disabled={loading}
            >
              <Text style={styles.tabText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
              disabled={loading}
            >
              <Text style={styles.tabText}>Register</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "register" && (
            <>
              <Input 
                label="First Name" 
                value={firstName} 
                onChange={(t: string) => setFirstName(onlyLetters(t))}
                editable={!loading}
              />
              <Input 
                label="Last Name" 
                value={lastName} 
                onChange={(t: string) => setLastName(onlyLetters(t))}
                editable={!loading}
              />
              <Input 
                label="Mobile Number" 
                value={mobile} 
                onChange={(t: string) => setMobile(onlyNumbers(t).slice(0, 10))}
                keyboardType="numeric"
                editable={!loading}
              />
              <Input 
                label="Email" 
                value={email} 
                onChange={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <PasswordInput
                label="Create Password"
                value={password}
                onChange={setPassword}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                editable={!loading}
              />

              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                editable={!loading}
              />

              <TouchableOpacity 
                style={[styles.primaryBtn, loading && styles.disabledBtn]} 
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryText}>Register</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {activeTab === "login" && (
            <>
              <Input 
                label="Email" 
                value={email} 
                onChange={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                editable={!loading}
              />

              <TouchableOpacity 
                style={[styles.primaryBtn, loading && styles.disabledBtn]} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryText}>Login</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

/* ================= INPUT COMPONENTS ================= */

const Input = ({ label, value, onChange, keyboardType = "default", autoCapitalize = "sentences", editable = true }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, !editable && styles.disabledInput]}
      value={value}
      onChangeText={onChange}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#9ca3af"
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      editable={editable}
    />
  </>
);

const PasswordInput = ({ label, value, onChange, show, toggle, editable = true }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.passwordWrapper, !editable && styles.disabledInput]}>
      <TextInput
        style={styles.passwordInput}
        value={value}
        secureTextEntry={!show}
        onChangeText={onChange}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#9ca3af"
        editable={editable}
      />
      <TouchableOpacity onPress={toggle} disabled={!editable}>
        <Icon name={show ? "visibility" : "visibility-off"} size={22} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  </>
);

/* ================= STYLES (UNCHANGED) ================= */

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

  disabledBtn: { backgroundColor: "#1e40af", opacity: 0.7 },
  disabledInput: { opacity: 0.6 },
});

export default AuthScreen;