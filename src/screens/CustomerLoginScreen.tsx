import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";


const CustomerLoginScreen = () => {
      const navigation = useNavigation<any>();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [remember, setRemember] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Tabs */}
       <View style={styles.tabContainer}>
  <Text style={[styles.tabText, styles.activeTab]}>Login</Text>

  <TouchableOpacity
    onPress={() => navigation.navigate("CustomerRegister")}
  >
    <Text style={styles.tabText}>Register</Text>
  </TouchableOpacity>
</View>

        {/* Email / Phone */}
        <Text style={styles.label}>Email / Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="john@example.com or +91 98765 43210"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Remember + Forgot */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRemember(!remember)}
          >
            <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
     <TouchableOpacity
  style={styles.loginBtn}
  onPress={() => navigation.navigate("CustomerHome")}
>
  <Text style={styles.loginBtnText}>Login</Text>
</TouchableOpacity>


        {/* Skip Login */}
        <TouchableOpacity style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerLoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef0f0ff",
  },
  content: {
    padding: 20,
  },

  /* Tabs */
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    gap: 40,
  },
  tabText: {
    fontSize: 16,
    color: "#3f629fff",
  },
  activeTab: {
    color: "#2563EB",
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
    paddingBottom: 6,
  },

  label: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 6,
    marginTop: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#373738ff",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0e0f11ff",
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color:'#111827',
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#2563EB",
  },
  rememberText: {
    fontSize: 14,
    color: "#111827",
  },

  forgotText: {
    fontSize: 14,
    color: "#2563EB",
  },

  loginBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  loginBtnText: {
    fontSize: 16,
    color: "#111827",
  },

  skipBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  skipText: {
    fontSize: 16,
    color: "#111827",
  },
});
