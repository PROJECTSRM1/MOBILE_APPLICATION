import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../App";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.navigate("SignupChoice");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Background Image */}
      <Image
        source={{
          uri: "https://i.postimg.cc/6Qy0XJfJ/bg-login.jpg",
        }}
        style={styles.backgroundImage}
      />

      <View style={styles.bottomCard}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* Forgot */}
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Gradient Login Button */}
        <LinearGradient
          colors={["#6A5AE0", "#7A74F0"]}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Signup */}
        <View style={styles.row}>
          <Text style={styles.smallText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignupChoice")}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

// ---------------- STYLES -------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#000",
  },

  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  bottomCard: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 12,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  forgotText: {
    color: "#6A5AE0",
    textAlign: "right",
    fontWeight: "600",
    marginBottom: 20,
  },

  gradientButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  smallText: {
    color: "#666",
  },

  signupText: {
    color: "#6A5AE0",
    fontWeight: "700",
    marginLeft: 6,
  },
});
