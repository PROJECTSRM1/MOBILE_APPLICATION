import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  FlatList,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

declare var global: any;
const LOGO = require("../../assets/swachlogo.jpg"); // adjust filename/path if needed

export default function Settings(): React.ReactElement {
  const nav = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [availabilityEnabled, setAvailabilityEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  // live profile fields
  const [name, setName] = useState("Service Provider");
  const [email, setEmail] = useState("provider@example.com");

  // edit modal fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const LANGUAGES = ["English", "हिन्दी", "Deutsch", "Español"];

  useEffect(() => {
    // Load profile from global on mount (no AsyncStorage)
    const g = (global.__SW_USER__ as any) || null;
    if (g) {
      setName(g.name ?? "Service Provider");
      setEmail(g.email ?? "provider@example.com");
      setEditName(g.name ?? "Service Provider");
      setEditEmail(g.email ?? "provider@example.com");
    } else {
      // defaults
      setEditName("Service Provider");
      setEditEmail("provider@example.com");
    }
    setLoading(false);
  }, []);

  const saveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Validation", "Please fill both name and email.");
      return;
    }

    const userObj = { name: editName.trim(), email: editEmail.trim() };
    // Persist to global only
    global.__SW_USER__ = userObj;

    // update UI
    setName(userObj.name);
    setEmail(userObj.email);
    setShowEditProfile(false);
    Alert.alert("Saved", "Profile updated.");
  };

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          try {
            global.__SW_USER__ = null;
            global.__SW_SERVICES__ = [];
          } catch (e) {
            // ignore
          }

          // reset navigation stack to Landing
          nav.reset({
            index: 0,
            routes: [{ name: "Landing" }],
          });
        },
      },
    ]);
  };

  const changePassword = () => {
    Alert.alert("Change password", "This would open the change-password flow.");
  };

  const openHelp = () => {
    Alert.alert("Help", "Open FAQ or support chat.");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, darkTheme ? styles.darkBg : null]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={darkTheme ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <Image source={LOGO} style={styles.logoSmall} />
            <View>
              <Text style={[styles.title, darkTheme ? styles.darkText : null]}>Settings</Text>
              <Text style={[styles.subtitle, darkTheme ? styles.darkSub : null]}>Manage your account & app</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => {
              nav.navigate("UserDashboard");
            }}
          >
            <Text style={{ fontWeight: "700", color: "#0e8b7b" }}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.card, darkTheme ? styles.cardDark : null]}>
          <View style={styles.profileRow}>
            <View>
              <Text style={[styles.cardTitle, darkTheme ? styles.darkText : null]}>{name}</Text>
              <Text style={[styles.smallMuted, darkTheme ? styles.darkSub : null]}>{email}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditName(name);
                  setEditEmail(email);
                  setShowEditProfile(true);
                }}
              >
                <Text style={{ color: "#0e8b7b", fontWeight: "800" }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={[styles.card, darkTheme ? styles.cardDark : null]}>
          <Text style={[styles.sectionTitle, darkTheme ? styles.darkText : null]}>Preferences</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingTitle, darkTheme ? styles.darkText : null]}>Notifications</Text>
              <Text style={[styles.smallMuted, darkTheme ? styles.darkSub : null]}>Push updates for new orders & messages</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingTitle, darkTheme ? styles.darkText : null]}>Availability</Text>
              <Text style={[styles.smallMuted, darkTheme ? styles.darkSub : null]}>Show customers you're online</Text>
            </View>
            <Switch value={availabilityEnabled} onValueChange={setAvailabilityEnabled} />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingTitle, darkTheme ? styles.darkText : null]}>Dark theme</Text>
              <Text style={[styles.smallMuted, darkTheme ? styles.darkSub : null]}>Reduce brightness (placeholder)</Text>
            </View>
            <Switch value={darkTheme} onValueChange={setDarkTheme} />
          </View>
        </View>

        {/* Account */}
        <View style={[styles.card, darkTheme ? styles.cardDark : null]}>
          <Text style={[styles.sectionTitle, darkTheme ? styles.darkText : null]}>Account</Text>

          <TouchableOpacity style={styles.rowButton} onPress={() => Alert.alert("Profile", "Open profile details.")}>
            <Text style={[styles.rowText, darkTheme ? styles.darkText : null]}>Edit profile</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowButton} onPress={changePassword}>
            <Text style={[styles.rowText, darkTheme ? styles.darkText : null]}>Change password</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowButton} onPress={() => setShowLanguages(true)}>
            <Text style={[styles.rowText, darkTheme ? styles.darkText : null]}>Language</Text>
            <Text style={[styles.rowSub, darkTheme ? styles.darkSub : null]}>{language}</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={[styles.card, darkTheme ? styles.cardDark : null]}>
          <Text style={[styles.sectionTitle, darkTheme ? styles.darkText : null]}>Support</Text>

          <TouchableOpacity style={styles.rowButton} onPress={openHelp}>
            <Text style={[styles.rowText, darkTheme ? styles.darkText : null]}>Help & FAQ</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowButton}
            onPress={() => Alert.alert("About", `Swachify — © ${new Date().getFullYear()}`)}
          >
            <Text style={[styles.rowText, darkTheme ? styles.darkText : null]}>About</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={{ fontWeight: "900", fontSize: 18, marginBottom: 8 }}>Edit profile</Text>

            <TextInput placeholder="Full name" value={editName} onChangeText={setEditName} style={styles.modalInput} />
            <TextInput
              placeholder="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              style={styles.modalInput}
              keyboardType="email-address"
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Text style={{ color: "#c43a3a", fontWeight: "800" }}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={saveProfile}>
                <Text style={{ color: "#0e8b7b", fontWeight: "800" }}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language selection modal */}
      <Modal visible={showLanguages} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={{ fontWeight: "900", fontSize: 18, marginBottom: 8 }}>Choose language</Text>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical: 12 }}
                  onPress={() => {
                    setLanguage(item);
                    setShowLanguages(false);
                    Alert.alert("Language", `Language set to ${item}`);
                  }}
                >
                  <Text style={{ fontWeight: item === language ? "900" : "600" }}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={{ marginTop: 12, alignSelf: "center" }} onPress={() => setShowLanguages(false)}>
              <Text style={{ color: "#c43a3a", fontWeight: "800" }}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5fbff" },
  darkBg: { backgroundColor: "#0b1315" },
  wrap: { padding: 20, paddingTop: 32 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12},
  brandRow: { flexDirection: "row", alignItems: "center" },
  logoSmall: { width: 44, height: 44, marginRight: 10 },

  headerAction: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#eef8f6",
  },

  title: { fontSize: 20, fontWeight: "900" },
  subtitle: { color: "#556", marginTop: 2 },
  darkText: { color: "#fff" },
  darkSub: { color: "#c9d1d1" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: { backgroundColor: "#071012" },

  profileRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontWeight: "900", fontSize: 16 },
  smallMuted: { color: "#7d8a8d", marginTop: 4 },

  editBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#eef8f6" },

  sectionTitle: { fontWeight: "900", marginBottom: 10, fontSize: 14 },

  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },

  settingTitle: { fontWeight: "800" },

  rowButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { fontWeight: "700" },
  rowSub: { color: "#7d8a8d", marginRight: 10 },
  rowArrow: { color: "#7d8a8d", fontSize: 20 },

  logoutBtn: {
    backgroundColor: "#c43a3a",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 18,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
  },
  modalInput: {
    backgroundColor: "#f6f8f8",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e6eef0",
  },
});
