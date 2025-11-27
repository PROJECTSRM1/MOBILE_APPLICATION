import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

interface AuthProps {
  onGoToLogin: () => void;
  onGoToSignup: () => void;
}

export default function Auth({ onGoToLogin, onGoToSignup }: AuthProps) {
  return (
    <View style={styles.container}>

      <Image
        source={require("../assets/swachlogo.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>SWACHIFY</Text>

      <Text style={styles.subtitle}>
        Your trusted solution for cleaning, moving, rentals, construction, and more.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.leftButton} onPress={onGoToLogin}>
          <Text style={styles.leftText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rightButton} onPress={onGoToSignup}>
          <Text style={styles.rightText}>Sign-up</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 25, justifyContent: "center" },
  image: { width: "100%", height: 300 },
  title: { fontSize: 30, fontWeight: "700", textAlign: "center", marginTop: 10 },
  subtitle: { textAlign: "center", color: "#777", marginTop: 5, fontSize: 19 },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 350,
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
});
