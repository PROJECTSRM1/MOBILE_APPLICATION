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
  onSignupDone: (email: string, password: string) => void;
  onGoToLogin: () => void;
  onBack: () => void;
}

const serviceOptions = [
  "Cleaning and Home Services",
  "Transport",
  "Apartment Rentals",
  "Commercial Plots",
  "Construction Materials",
];

export default function Signup2({ onSignupDone, onGoToLogin, onBack }: SignupProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [govtId, setGovtId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const validateSignup = () => {
    if (!email.includes("@")) return Alert.alert("Enter valid email");
    if (!phone.trim()) return Alert.alert("Enter phone number");
    if (!govtId.trim()) return Alert.alert("Enter Government ID");
    if (!selectedService.trim()) return Alert.alert("Please select a service");
    if (!password.trim()) return Alert.alert("Enter a password");

    Alert.alert(
      "Verification Complete",
      "Your Government ID is verified manually."
    );

    onSignupDone(email, password);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Let's{"\n"}get started</Text>

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

      <View style={styles.inputBox}>
        <Text style={styles.icon}>🔒</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#B5B5B5"
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* SERVICE PICKER */}
      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text style={styles.dropdownText}>
          {selectedService || "Select your service"}
        </Text>
        <Text style={styles.arrow}>{dropdownOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={styles.dropdownList}>
          {serviceOptions.map((service) => (
            <TouchableOpacity
              key={service}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedService(service);
                setDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{service}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.signupBtn} onPress={validateSignup}>
        <Text style={styles.signupText}>Verify & Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or continue with</Text>

      <TouchableOpacity style={styles.googleBtn}>
        <Image source={require("../assets/google.png")} style={styles.googleImg} />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Already have an account?{" "}
        <Text style={styles.loginLink} onPress={onGoToLogin}>
          Login
        </Text>
      </Text>
    </View>
  );
}

// styles remain same as your original code
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

  /* DROPDOWN */
  dropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 28,
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
      paddingHorizontal: 18,
    paddingVertical: 20,
  },
  dropdownText: { color: "#5b5757ff", fontSize: 15 },
  arrow: { fontSize: 16, color: "#555" },

  dropdownList: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  dropdownItemText: { fontSize: 15, color: "#5d5555ff" },

  signupBtn: {
    backgroundColor: "#222",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 10,
  },
  signupText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  or: {
    textAlign: "center",
    marginVertical: 22,
    color: "#666",
    fontSize: 15,
    marginTop: 30,
    marginBottom: 20,
  },

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
