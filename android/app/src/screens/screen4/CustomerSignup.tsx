import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

const CustomerSignup: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <Image
        source={require("../../assets/swachlogo.png")} // ✅ local image
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#000" // black placeholder
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile No"
        placeholderTextColor="#000"
        onChangeText={setMobile}
        value={mobile}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email ID"
        placeholderTextColor="#000"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerSignup;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center", backgroundColor: "#E8F5E9" },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    color: "#000", // input text color
  },
  btn: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
