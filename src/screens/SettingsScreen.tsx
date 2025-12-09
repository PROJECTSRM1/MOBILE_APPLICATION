import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  LayoutAnimation,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* --------------------- Setting Row Component ---------------------- */
interface SettingRowProps {
  title: string;
  subtitle?: string;
  withSwitch?: boolean;
  switchValue?: boolean;
  onSwitch?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  subtitle,
  withSwitch = false,
  switchValue = false,
  onSwitch,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.settingRow}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {withSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitch}
          trackColor={{ false: "#777", true: "#6EC6FF" }}
          thumbColor={switchValue ? "#fff" : "#eee"}
        />
      )}
    </TouchableOpacity>
  );
};

/* ----------------- Expandable Section Component ------------------- */
interface ExpandableProps {
  title: string;
  children?: React.ReactNode;
}

const ExpandableSettingRow: React.FC<ExpandableProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View style={styles.expandBox}>
      <TouchableOpacity onPress={toggle} style={styles.expandHeader}>
        <Text style={styles.expandTitle}>{title}</Text>
        <Text style={styles.expandArrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && <View style={styles.subBox}>{children}</View>}
    </View>
  );
};

/* ---------------------- Main Screen ---------------------- */
export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [vibration, setVibration] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [location, setLocation] = useState(false);
  const [preciseLocation, setPreciseLocation] = useState(false);

  /* Account – Controlled Inputs */
  const [userName, setUserName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("9876543210");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  /* Animate layout changes on theme toggle */
  useEffect(() => {
    if (Platform.OS === "android") LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [darkMode]);

  /* Dynamic styles */
  const bgColor = darkMode ? "#121212" : "#faf8f8ff";
  const cardColor = darkMode ? "rgba(50,50,50,0.3)" : "rgba(22,21,21,0.08)";
  const textColor = darkMode ? "#fff" : "#181616ff";
  const subTextColor = darkMode ? "#ccc" : "#131212ff";
  const inputBgColor = darkMode ? "#333" : "#fff";
  const inputBorderColor = darkMode ? "#555" : "#ccc";
  const placeholderColor = darkMode ? "#aaa" : "#888";

  const switchTrackColor = { false: "#555", true: "#6EC6FF" };
  const switchThumbColor = darkMode ? "#fff" : "#fff";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Settings</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Card */}
        <View style={[styles.glassCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.profileName, { color: textColor }]}>{userName}</Text>
          <Text style={[styles.profileEmail, { color: subTextColor }]}>{email}</Text>
        </View>

        {/* Preferences */}
        <View style={[styles.glassCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Preferences</Text>

          <ExpandableSettingRow title="Notifications">
            <SettingRow
              title="Enable Notifications"
              withSwitch
              switchValue={notifications}
              onSwitch={setNotifications}
            />
            <SettingRow
              title="Vibration Alerts"
              withSwitch
              switchValue={vibration}
              onSwitch={setVibration}
            />
          </ExpandableSettingRow>

          {/* Appearance */}
          <ExpandableSettingRow title="Appearance">
            <SettingRow
              title="Dark Mode"
              withSwitch
              switchValue={darkMode}
              onSwitch={setDarkMode}
            />
          </ExpandableSettingRow>

          <ExpandableSettingRow title="Location Services">
            <SettingRow
              title="Location Access"
              subtitle="Allow the app to access your location"
              withSwitch
              switchValue={location}
              onSwitch={setLocation}
            />
            <SettingRow
              title="Precise Location"
              withSwitch
              switchValue={preciseLocation}
              onSwitch={setPreciseLocation}
            />
          </ExpandableSettingRow>
        </View>

        {/* Account Section */}
        <View style={[styles.glassCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>

          {/* Edit Profile */}
          <ExpandableSettingRow title="Edit Profile">
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: textColor }]}>User Name</Text>
              <TextInput
                style={[
                  styles.inputBox,
                  { backgroundColor: inputBgColor, color: textColor, borderColor: inputBorderColor },
                ]}
                value={userName}
                onChangeText={setUserName}
                placeholder="Enter name"
                placeholderTextColor={placeholderColor}
              />

              <Text style={[styles.inputLabel, { color: textColor }]}>Email ID</Text>
              <TextInput
                style={[
                  styles.inputBox,
                  { backgroundColor: inputBgColor, color: textColor, borderColor: inputBorderColor },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                placeholderTextColor={placeholderColor}
              />

              <Text style={[styles.inputLabel, { color: textColor }]}>Phone Number</Text>
              <TextInput
                style={[
                  styles.inputBox,
                  { backgroundColor: inputBgColor, color: textColor, borderColor: inputBorderColor },
                ]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor={placeholderColor}
              />
            </View>
          </ExpandableSettingRow>

          {/* Change Password */}
          <ExpandableSettingRow title="Change Password">
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: textColor }]}>New Password</Text>
              <TextInput
                style={[
                  styles.inputBox,
                  { backgroundColor: inputBgColor, color: textColor, borderColor: inputBorderColor },
                ]}
                value={newPass}
                onChangeText={setNewPass}
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor={placeholderColor}
              />
              
              <Text style={[styles.inputLabel, { color: textColor }]}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.inputBox,
                  { backgroundColor: inputBgColor, color: textColor, borderColor: inputBorderColor },
                ]}
                value={confirmPass}
                onChangeText={setConfirmPass}
                secureTextEntry
                placeholder="Confirm password"
                placeholderTextColor={placeholderColor}
              />
            </View>
          </ExpandableSettingRow>

        </View>

        {/* Support */}
        <View style={[styles.glassCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Support</Text>
          <SettingRow title="Help & Support" onPress={() => {}} />
          <SettingRow title="About App" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { fontSize: 26, fontWeight: "700", paddingHorizontal: 20, paddingBottom: 12 },
  glassCard: {
    width: "90%",
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "center",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  profileName: { fontSize: 20, fontWeight: "700" },
  profileEmail: { marginTop: 4, fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  settingRow: { width: "100%", flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  settingTitle: { fontSize: 15, fontWeight: "600" },
  settingSubtitle: { fontSize: 12, marginTop: 2 },
  expandBox: { marginBottom: 8 },
  expandHeader: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  expandTitle: { fontSize: 15, fontWeight: "600" },
  expandArrow: { fontSize: 16 },
  subBox: { paddingLeft: 16, paddingTop: 6, borderLeftWidth: 2, borderLeftColor: "rgba(255, 255, 255, 0.3)" },
  inputGroup: { paddingVertical: 6, gap: 10 },
  inputLabel: { fontSize: 13, fontWeight: "600" },
  inputBox: { width: "95%", borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 14 },
});
