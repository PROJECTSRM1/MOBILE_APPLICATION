// import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f4f7" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* HEADER */}
        <Text style={styles.header}>Settings</Text>
        <Text style={styles.subHeader}>Customize your preferences</Text>

        {/* ACCOUNT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Profile Information</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Email & Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* PREFERENCES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Language</Text>
          </TouchableOpacity>
        </View>

        {/* SUPPORT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Help & FAQs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Terms & Privacy</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 6,
    color: "#1e1e1e",
  },
  subHeader: {
    color: "#6c757d",
    marginBottom: 16,
  },

  section: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e8eaed",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e1e1e",
    marginBottom: 12,
  },

  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e8eaed",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },

  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    marginHorizontal: 40,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
