import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // or use images for icons

const UserSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [govId, setGovId] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Let's{'\n'}get started</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#777"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Phone Input */}
      <View style={styles.inputContainer}>
        <Icon name="phone-outline" size={20} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Enter your phone number"
          placeholderTextColor="#777"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Govt ID Input */}
      <View style={styles.inputContainer}>
        <Icon name="card-account-details-outline" size={20} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Enter your Govt ID (Aadhar / PAN / DL)"
          placeholderTextColor="#777"
          style={styles.input}
          value={govId}
          onChangeText={setGovId}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Verify & Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or continue with</Text>

      {/* Google Sign In Button */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account? <Text style={styles.loginLink}>Login</Text>
      </Text>
    </View>
  );
};

export default UserSignup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#D3D3D3", // light grey like screenshot
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginVertical: 15,
    color: "#555",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
  },
  loginText: {
    marginTop: 15,
    textAlign: "center",
    color: "#555",
  },
  loginLink: {
    fontWeight: "bold",
  },
});
