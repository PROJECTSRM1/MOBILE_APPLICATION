import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [openSection, setOpenSection] = useState(""); 
  const [openSub, setOpenSub] = useState(""); 

  // Preference States
  const [selectedTheme, setSelectedTheme] = useState("Light");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  // DARK THEME STATE
  const isDark = selectedTheme === "Dark";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#f2f4f7",
      }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* HEADER */}
        <Text style={[styles.header, { color: isDark ? "#fff" : "#1e1e1e" }]}>
          Settings
        </Text>
        <Text style={[styles.subHeader, { color: isDark ? "#bbb" : "#6c757d" }]}>
          Customize your preferences
        </Text>

        {/* ACCOUNT SECTION */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: isDark ? "#111" : "#fff",
              borderColor: isDark ? "#333" : "#e8eaed",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              setOpenSection(openSection === "Account" ? "" : "Account")
            }
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fff" : "#1e1e1e" },
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>

          {openSection === "Account" && (
            <>
              {/* Profile Information */}
              <TouchableOpacity
                style={styles.option}
                onPress={() =>
                  setOpenSub(openSub === "profile" ? "" : "profile")
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Profile Information
                </Text>
              </TouchableOpacity>

              {openSub === "profile" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? "#333" : "#fff",
                        color: isDark ? "#fff" : "#000",
                        borderColor: isDark ? "#555" : "#ddd",
                      },
                    ]}
                  />
                  <TextInput
                    placeholder="Username"
                    placeholderTextColor="#999"
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? "#333" : "#fff",
                        color: isDark ? "#fff" : "#000",
                        borderColor: isDark ? "#555" : "#ddd",
                      },
                    ]}
                  />
                </View>
              )}

              {/* Email & Phone */}
              <TouchableOpacity
                style={styles.option}
                onPress={() =>
                  setOpenSub(openSub === "email" ? "" : "email")
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Email & Phone
                </Text>
              </TouchableOpacity>

              {openSub === "email" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#999"
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? "#333" : "#fff",
                        color: isDark ? "#fff" : "#000",
                        borderColor: isDark ? "#555" : "#ddd",
                      },
                    ]}
                  />
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? "#333" : "#fff",
                        color: isDark ? "#fff" : "#000",
                        borderColor: isDark ? "#555" : "#ddd",
                      },
                    ]}
                  />
                </View>
              )}

              {/* Change Password */}
              <TouchableOpacity
                style={styles.option}
                onPress={() =>
                  setOpenSub(openSub === "password" ? "" : "password")
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Change Password
                </Text>
              </TouchableOpacity>

              {openSub === "password" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Enter New Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? "#333" : "#fff",
                        color: isDark ? "#fff" : "#000",
                        borderColor: isDark ? "#555" : "#ddd",
                      },
                    ]}
                  />
                  <TextInput
                    placeholder="Confirm New Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? "#333" : "#fff",
                        color: isDark ? "#fff" : "#000",
                        borderColor: isDark ? "#555" : "#ddd",
                      },
                    ]}
                  />
                  <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveText}>Update Password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* PREFERENCES SECTION */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: isDark ? "#111" : "#fff",
              borderColor: isDark ? "#333" : "#e8eaed",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              setOpenSection(openSection === "Preferences" ? "" : "Preferences")
            }
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fff" : "#1e1e1e" },
              ]}
            >
              Preferences
            </Text>
          </TouchableOpacity>

          {openSection === "Preferences" && (
            <>
              {/* Notifications */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => setOpenSub(openSub === "notif" ? "" : "notif")}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Notifications
                </Text>
              </TouchableOpacity>

              {openSub === "notif" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <Text style={[styles.label, { color: isDark ? "#eee" : "#444" }]}>
                      Enable Notifications
                    </Text>
                    <Switch
                      value={notificationEnabled}
                      onValueChange={setNotificationEnabled}
                    />
                  </View>
                </View>
              )}

              {/* Theme */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => setOpenSub(openSub === "theme" ? "" : "theme")}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Theme
                </Text>
              </TouchableOpacity>

              {openSub === "theme" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  {["Light", "Dark", "System Default"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.radioOption}
                      onPress={() => setSelectedTheme(item)}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          {
                            borderColor: isDark ? "#aaa" : "#999",
                            backgroundColor:
                              selectedTheme === item
                                ? isDark
                                  ? "#fff"
                                  : "#000"
                                : "transparent",
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.label,
                          { color: isDark ? "#eee" : "#444" },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Language */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => setOpenSub(openSub === "lang" ? "" : "lang")}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Language
                </Text>
              </TouchableOpacity>

              {openSub === "lang" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  {["English", "Hindi", "Telugu", "Tamil"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.radioOption}
                      onPress={() => setSelectedLanguage(item)}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          {
                            borderColor: isDark ? "#aaa" : "#999",
                            backgroundColor:
                              selectedLanguage === item
                                ? isDark
                                  ? "#fff"
                                  : "#000"
                                : "transparent",
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.label,
                          { color: isDark ? "#eee" : "#444" },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* SUPPORT SECTION */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: isDark ? "#111" : "#fff",
              borderColor: isDark ? "#333" : "#e8eaed",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              setOpenSection(openSection === "Support" ? "" : "Support")
            }
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fff" : "#1e1e1e" },
              ]}
            >
              Support
            </Text>
          </TouchableOpacity>

          {openSection === "Support" && (
            <>
              {/* Help */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => setOpenSub(openSub === "help" ? "" : "help")}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Help & FAQs
                </Text>
              </TouchableOpacity>

              {openSub === "help" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.infoText,
                      { color: isDark ? "#eee" : "#555" },
                    ]}
                  >
                    Find answers to commonly asked questions here.
                  </Text>
                </View>
              )}

              {/* Contact */}
              <TouchableOpacity
                style={styles.option}
                onPress={() =>
                  setOpenSub(openSub === "contact" ? "" : "contact")
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ddd" : "#444" },
                  ]}
                >
                  Contact Support
                </Text>
              </TouchableOpacity>

              {openSub === "contact" && (
                <View
                  style={[
                    styles.expandBox,
                    {
                      backgroundColor: isDark ? "#222" : "#f9fafb",
                      borderColor: isDark ? "#444" : "#e2e3e4",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.infoText,
                      { color: isDark ? "#eee" : "#555" },
                    ]}
                  >
                    Email: support@yourapp.com
                  </Text>
                  <Text
                    style={[
                      styles.infoText,
                      { color: isDark ? "#eee" : "#555" },
                    ]}
                  >
                    Phone: +91 99887 66755
                  </Text>
                </View>
              )}
            </>
          )}
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
  },
  subHeader: {
    marginBottom: 16,
  },

  section: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
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
  },

  expandBox: {
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
  },

  label: {
    fontSize: 15,
  },

  infoText: {
    fontSize: 15,
    marginBottom: 6,
  },

  saveBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
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
