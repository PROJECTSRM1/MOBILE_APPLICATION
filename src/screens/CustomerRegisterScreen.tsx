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
import Ionicons from "react-native-vector-icons/Ionicons";

const CustomerRegisterScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePass, setSecurePass] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("CustomerLogin")}>
            <Text style={styles.tabText}>Login</Text>
          </TouchableOpacity>

          <Text style={[styles.tabText, styles.activeTab]}>Register</Text>
        </View>

        {/* First + Last Name */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={securePass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
            <Ionicons
              name={securePass ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={secureConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
            <Ionicons
              name={secureConfirm ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerBtn}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        {/* Vendor Link */}
        <TouchableOpacity>
          <Text style={styles.vendorText}>Are you a vendor?</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerRegisterScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 30,
  },
  tabText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  activeTab: {
    color: "#2563EB",
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
    paddingBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },

  label: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 6,
    marginTop: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
  },

  registerBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  registerText: {
    fontSize: 16,
    color: "#111827",
  },

  vendorText: {
    marginTop: 20,
    fontSize: 14,
    color: "#2563EB",
  },
});
