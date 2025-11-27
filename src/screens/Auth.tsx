import React from 'react';
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
  onGoToSignup: () => void;
}

export default function Auth({ onGoToLogin, onGoToSignup }: AuthProps) {
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

  // Rounded Image wrapper similar to onboarding
  imageWrapper: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,

    // Premium glow effect
    borderWidth: 2,
    borderColor: 'rgba(0, 200, 255, 0.2)',
    // shadowColor: '#00c8ff',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    // elevation: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  image: {
    width: '150%',
    height: '100%',
    resizeMode: 'contain',
  },

  title: { fontSize: 30, fontWeight: "700", textAlign: "center", marginTop: 10 },
  subtitle: { textAlign: "center", color: "#777", marginTop: 5, fontSize: 19 },

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
});
