import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface AuthProps {
  onGoToLogin: () => void;
  onGoToCustomerSignup: () => void;
  onGoToUserSignup: () => void;
}

export default function Auth({
  onGoToLogin,
  onGoToCustomerSignup,
  onGoToUserSignup,
}: AuthProps) {

  // Show customer/user options
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* Rounded Premium Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/swachlogo4.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>SWACHIFY</Text>

      <Text style={styles.subtitle}>
        Your trusted solution for cleaning, moving, rentals, construction, and more.
      </Text>

      {/* --- Normal Login / Signup Buttons (Visible Initially) --- */}
      {!showOptions && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.leftButton} onPress={onGoToLogin}>
            <Text style={styles.leftText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => setShowOptions(true)}
          >
            <Text style={styles.rightText}>Sign-up</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- Signup Options (Customer / User) --- */}
      {showOptions && (
        <View style={styles.optionContainer}>
          
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onGoToCustomerSignup}
          >
            <Text style={styles.optionText}>Customer Signup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.userBtn]}
            onPress={onGoToUserSignup}
          >
            <Text style={[styles.optionText, { color: "#fff" }]}>User Signup</Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity onPress={() => setShowOptions(false)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#536d89ff", padding: 25, justifyContent: "center" },

  imageWrapper: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: 'rgba(0, 200, 255, 0.2)',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  image: {
    width: '150%',
    height: '100%',
    resizeMode: 'contain',
  },

  title: { fontSize: 30, fontWeight: "700", textAlign: "center", marginTop: 10 },
  subtitle: { textAlign: "center", color: "#000", marginTop: 5, fontSize: 19, fontWeight: "500" },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 300,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    overflow: "hidden",
  },

  leftButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#000",
    alignItems: "center",
  },

  rightButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  leftText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  rightText: { color: "#000", fontSize: 16, fontWeight: "700" },

  /* -------- Signup Options Styling -------- */

  optionContainer: {
    marginTop: 250,
    alignItems: "center",
  },

  optionButton: {
    width: "90%",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },

  userBtn: {
    backgroundColor: "#000",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  backText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
