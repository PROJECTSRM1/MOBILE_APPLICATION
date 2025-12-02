import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../App"; // adjust path if needed

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const SignupChoice: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      {/* Logo above buttons */}
      <Image
        source={require("../../assets/swachlogo.png")} // ✅ Local image
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CustomerSignup")}
      >
        <Text style={styles.text}>Customer Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#000" }]}
        onPress={() => navigation.navigate("UserSignup")}
      >
        <Text style={[styles.text, { color: "#fff" }]}>User Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupChoice;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#E8F5E9", // optional background color
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  button: {
    width: "70%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
