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

const API_BASE_URL = "https://swachify-india-be-1-mcrb.onrender.com";

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
    // Validation
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

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem(
  "registeredUser",
  JSON.stringify({
    first_name: data.first_name ?? firstName,
    last_name: data.last_name ?? lastName,
    email: data.email ?? email,
    mobile: data.mobile ?? mobile,
  })
);


        Alert.alert("Success", "Registered successfully. Please login.", [
          {
            text: "OK",
            onPress: () => {
              setActiveTab("login");
              setPassword("");
              setConfirmPassword("");
              setFirstName("");
              setLastName("");
              setMobile("");
              setEmail("");
            },
          },
        ]);
      } else {
        // Display backend error message
        let errorMessage = "Registration failed";
        
        if (data.detail) {
          // Handle FastAPI validation errors
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((err: any) => err.msg).join("\n");
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }

        // Handle specific error cases
        if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("exist")) {
          errorMessage = "This email is already registered. Please login or use a different email.";
        } else if (errorMessage.toLowerCase().includes("mobile") && errorMessage.toLowerCase().includes("exist")) {
          errorMessage = "This mobile number is already registered. Please login or use a different number.";
        } else if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("required")) {
          errorMessage = "Email is required";
        } else if (errorMessage.toLowerCase().includes("mobile") && errorMessage.toLowerCase().includes("required")) {
          errorMessage = "Mobile number is required";
        }

        Alert.alert("Registration Failed", errorMessage);
      }
    } catch (error: any) {
      Alert.alert(
        "Connection Error", 
        "Unable to connect to server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN API ================= */

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Enter a valid email");
      return;
    }

    // Prepare request body
    const requestBody = {
      email_or_phone: email,
      password: password,
      latitude: null,
      longitude: null,
    };

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Save login flag
        await AsyncStorage.setItem("isLoggedIn", "true");

        // Save full response
        await AsyncStorage.setItem("userData", JSON.stringify(data));

        // Build user profile for Profile screen
        const userProfile = {
  email: data.email_or_phone || "",
  role: data.role || "",
  selectedServices: data.service_ids || []
};


        // Save profile
        await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));

        // Save token
        if (data.access_token) {
          await AsyncStorage.setItem("authToken", data.access_token);
        } else if (data.token) {
          await AsyncStorage.setItem("authToken", data.token);
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
      } else {
        // Display backend error message
        let errorMessage = "Invalid credentials";
        
        if (data.detail) {
          // Handle FastAPI validation errors
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((err: any) => err.msg).join("\n");
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }

        // Handle specific error cases
        if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("not found")) {
          errorMessage = "This email is not registered. Please sign up first.";
        } else if (errorMessage.toLowerCase().includes("password") && errorMessage.toLowerCase().includes("incorrect")) {
          errorMessage = "Incorrect password. Please try again.";
        } else if (errorMessage.toLowerCase().includes("invalid") && errorMessage.toLowerCase().includes("credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("required")) {
          errorMessage = "Email is required";
        } else if (errorMessage.toLowerCase().includes("password") && errorMessage.toLowerCase().includes("required")) {
          errorMessage = "Password is required";
        }

        Alert.alert("Login Failed", errorMessage);
      }
    } catch (error: any) {
      Alert.alert(
        "Connection Error", 
        "Unable to connect to server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <LinearGradient colors={["#020617", "#020617"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome</Text>
            <Text style={styles.headerSubtitle}>
              {activeTab === "login" ? "Sign in to continue" : "Create your account"}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "login" && styles.activeTab]}
              onPress={() => setActiveTab("login")}
              disabled={loading}
            >
              <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
              disabled={loading}
            >
              <Text style={[styles.tabText, activeTab === "register" && styles.activeTabText]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register Form */}
          {activeTab === "register" && (
            <>
              <Input 
                label="First Name" 
                value={firstName} 
                onChange={(t: string) => setFirstName(onlyLetters(t))}
                editable={!loading}
                icon="person"
              />
              <Input 
                label="Last Name" 
                value={lastName} 
                onChange={(t: string) => setLastName(onlyLetters(t))}
                editable={!loading}
                icon="person-outline"
              />
              <Input 
                label="Mobile Number" 
                value={mobile} 
                onChange={(t: string) => setMobile(onlyNumbers(t).slice(0, 10))}
                keyboardType="numeric"
                editable={!loading}
                icon="phone"
              />
              <Input 
                label="Email" 
                value={email} 
                onChange={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                icon="email"
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
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loadingText}>Creating account...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryText}>Register</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <>
              <Input 
                label="Email" 
                value={email} 
                onChange={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                icon="email"
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
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loadingText}>Signing in...</Text>
                  </View>
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

const Input = ({ 
  label, 
  value, 
  onChange, 
  keyboardType = "default", 
  autoCapitalize = "sentences", 
  editable = true,
  icon 
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, !editable && styles.disabledInput]}>
      {icon && <Icon name={icon} size={20} color="#6b7280" style={styles.inputIcon} />}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#6b7280"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
      />
    </View>
  </View>
);

const PasswordInput = ({ 
  label, 
  value, 
  onChange, 
  show, 
  toggle, 
  editable = true 
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.passwordWrapper, !editable && styles.disabledInput]}>
      <Icon name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
      <TextInput
        style={styles.passwordInput}
        value={value}
        secureTextEntry={!show}
        onChangeText={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#6b7280"
        editable={editable}
      />
      <TouchableOpacity onPress={toggle} disabled={!editable} style={styles.eyeIcon}>
        <Icon name={show ? "visibility" : "visibility-off"} size={22} color="#6b7280" />
      </TouchableOpacity>
    </View>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scroll: { 
    flexGrow: 1, 
    justifyContent: "center", 
    padding: 16,
    paddingVertical: 40,
  },
  card: { 
    backgroundColor: "#0f172a", 
    borderRadius: 24, 
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },

  tabs: { 
    flexDirection: "row", 
    marginBottom: 24,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 4,
  },
  tab: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: { 
    backgroundColor: "#2563eb",
  },
  tabText: { 
    color: "#94a3b8", 
    fontWeight: "600",
    fontSize: 15,
  },
  activeTabText: {
    color: "#fff",
  },

  inputContainer: {
    marginBottom: 16,
  },
  label: { 
    color: "#e5e7eb", 
    marginBottom: 8, 
    fontWeight: "600",
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  inputIcon: {
    marginLeft: 14,
  },
  input: { 
    flex: 1,
    color: "#fff", 
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  passwordInput: { 
    flex: 1, 
    color: "#fff", 
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  eyeIcon: {
    paddingHorizontal: 14,
  },

  primaryBtn: { 
    backgroundColor: "#2563eb", 
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  disabledBtn: { 
    backgroundColor: "#1e40af", 
    opacity: 0.6,
  },
  disabledInput: { 
    opacity: 0.6,
    borderColor: "#1e293b",
  },
});

export default AuthScreen;