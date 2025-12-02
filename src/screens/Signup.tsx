// src/screens/Signup.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;
type Role = "customer" | "user" | null;

const SERVICE_OPTIONS = [
  "Cleaning",
  "Packers & Movers",
  "Home Services",
  "Rentals",
  "Buy&Sale Properties",
  "Construction Materials",
];

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function Signup(props: any) {
  const { navigation, route } = props as Props;
  const initialRole = (route?.params as any)?.role as Role | undefined;
  const [role, setRole] = useState<Role>(initialRole ?? null);

  // common fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // customer-specific
  const [otp, setOtp] = useState("");
  const [workType, setWorkType] = useState("");
  const [expectedCost, setExpectedCost] = useState("");
  const [address, setAddress] = useState("");

  // user/service-provider-specific
  const [govtId, setGovtId] = useState("");
  const [serviceTypes, setServiceTypes] = useState(""); // earlier field reused

  // dropdown modal state
  const [dropOpen, setDropOpen] = useState(false);

  // OTP helper states
  const resendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [loading, setLoading] = useState(false);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
        resendIntervalRef.current = null;
      }
    };
  }, []);

  // send a dummy OTP (6 digits), set otp state and start 30s cooldown
  const sendOtp = () => {
    // basic phone validation before sending
    if (!/^\d{7,15}$/.test(phone)) {
      Alert.alert("Invalid phone", "Please enter a valid phone number before requesting OTP.");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    setOtp(code);
    setOtpSent(true);
    setResendTimer(30);
    console.log("Dummy OTP generated:", code);

    Alert.alert("OTP", `Your OTP is ${code}`);

    // clear previous interval if exists
    if (resendIntervalRef.current) {
      clearInterval(resendIntervalRef.current);
      resendIntervalRef.current = null;
    }

    // start countdown
    resendIntervalRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          // clear interval and reset state
          if (resendIntervalRef.current) {
            clearInterval(resendIntervalRef.current);
            resendIntervalRef.current = null;
          }
          setOtpSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // === validateAndSubmit (made explicit to avoid role/dashboard swaps) ===
  const validateAndSubmit = () => {
    if (!role) {
      Alert.alert("Select role", "Please choose Customer or User to continue.");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter your name.");
      return;
    }
    if (!/^\d{7,15}$/.test(phone)) {
      Alert.alert("Invalid phone", "Please enter a valid phone number.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    // if (password.length < 6) {
    //   Alert.alert("Weak password", "Password should be at least 6 characters.");
    //   return;
    // }

    // role-specific checks
    if (role === "customer") {
      if (!workType.trim()) {
        Alert.alert("Missing work type", "Please describe what service you need.");
        return;
      }
      if (!address.trim()) {
        Alert.alert("Missing address", "Please add a service address.");
        return;
      }
      // OTP is optional currently. If you want to require it uncomment the next lines:
      // if (!otp.trim()) {
      //   Alert.alert("Missing OTP", "Please request/enter the OTP.");
      //   return;
      // }
    } else if (role === "user") {
      if (!serviceTypes.trim()) {
        Alert.alert("Missing services", "Please choose at least one primary service in the dropdown.");
        return;
      }
      if (!govtId.trim()) {
        Alert.alert("Missing ID", "Please enter your Govt ID or registration number.");
        return;
      }
    }

    console.log("Submitting signup for role:", role);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

     switch (role) {
  case "customer":
    Alert.alert("Success", "Account created — please login to continue.");
    // send role and email to the Login screen so it can redirect after login
    navigation.replace("Login", { role: "customer", prefilledEmail: email || "" });
    return;

  case "user":
    Alert.alert("Success", "Account created — please login to continue.");
    navigation.replace("Login", { role: "user", prefilledEmail: email || "" });
    return;


        default:
          // fallback (shouldn't happen)
          Alert.alert("Success", "Account created — redirecting.");
          navigation.replace("Login");
          return;
      }
    }, 900);
  };
  // === end validateAndSubmit ===

  if (!role) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
        <View style={styles.wrapperCentered}>
          <Text style={styles.bigTitle}>Sign up as</Text>

          <TouchableOpacity
            style={[styles.roleBtn, { backgroundColor: "#fff" }]}
            activeOpacity={0.9}
            onPress={() => {
              console.log("Role selected: customer");
              setRole("customer");
            }}
          >
            <Text style={styles.roleBtnTitle}>Customer Signup</Text>
            <Text style={styles.roleBtnSub}>Book services, request quotes, manage bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, { marginTop: 12 }]}
            activeOpacity={0.9}
            onPress={() => {
              console.log("Role selected: user");
              setRole("user");
            }}
          >
            <Text style={styles.roleBtnTitle}>User / Service Provider Signup</Text>
            <Text style={styles.roleBtnSub}>Offer services, receive bookings, manage availability</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{role === "customer" ? "Customer Signup" : "Service Provider Signup"}</Text>

            {/* Common fields */}
            <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#9aa0a6" style={styles.input} autoCapitalize="words" />
            <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" placeholderTextColor="#9aa0a6" keyboardType="phone-pad" style={styles.input} />
            <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#9aa0a6" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            {/* <View style={styles.passwordRow}>
              <TextInput value={password} onChangeText={setPassword} placeholder="Create password" placeholderTextColor="#9aa0a6" secureTextEntry={!showPassword} style={[styles.input, { flex: 1 }]} />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn}>
                <Text style={{ fontWeight: "700" }}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View> */}

            {/* Role-specific inputs */}
            {role === "customer" ? (
              <>
                {/* OTP row: input + Send OTP button */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <TextInput
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Verification OTP (optional)"
                    placeholderTextColor="#9aa0a6"
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  />

                  <TouchableOpacity
                    onPress={sendOtp}
                    style={[
                      {
                        marginLeft: 10,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 10,
                        backgroundColor: otpSent ? "#d0e9e6" : "#0e8b7b",
                      },
                    ]}
                    disabled={otpSent}
                  >
                    <Text style={{ color: otpSent ? "#6b7b78" : "#fff", fontWeight: "700" }}>
                      {otpSent ? `Resend (${resendTimer}s)` : "Send OTP"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput value={workType} onChangeText={setWorkType} placeholder="Work required (eg. Deep cleaning / Carpet / Move out)" placeholderTextColor="#9aa0a6" style={styles.input} />
                <TextInput value={expectedCost} onChangeText={setExpectedCost} placeholder="Expected budget (optional)" placeholderTextColor="#9aa0a6" keyboardType="numeric" style={styles.input} />
                <TextInput value={address} onChangeText={setAddress} placeholder="Service address" placeholderTextColor="#9aa0a6" style={[styles.input, { height: 88 }]} multiline />
              </>
            ) : (
              <>
                {/* Dropdown for selecting service categories */}
                <TouchableOpacity style={styles.dropdown} onPress={() => setDropOpen(true)}>
                  <Text style={styles.dropdownLabel}>{serviceTypes || "Select primary service (required)"}</Text>
                </TouchableOpacity>

                {/* The dropdown modal */}
                <Modal visible={dropOpen} animationType="slide" transparent>
                  <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setDropOpen(false)}>
                    <View style={styles.modalSheet}>
                      <Text style={{ fontWeight: "800", marginBottom: 8 }}>Select primary service</Text>
                      <FlatList
                        data={SERVICE_OPTIONS}
                        keyExtractor={(i) => i}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => {
                              setServiceTypes(item);
                              setDropOpen(false);
                            }}
                          >
                            <Text style={{ fontSize: 15 }}>{item}</Text>
                          </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>

                <TextInput value={govtId} onChangeText={setGovtId} placeholder="Govt ID / Registration No." placeholderTextColor="#9aa0a6" style={styles.input} />
                <TextInput value={address} onChangeText={setAddress} placeholder="Base address / City" placeholderTextColor="#9aa0a6" style={styles.input} />

                {/* <View style={styles.uploadPlaceholder}>
                  <Text style={{ color: "#6c7680" }}>Upload ID / certificates — integrate image picker here</Text>
                </View> */}
              </>
            )}

            <TouchableOpacity style={[styles.primaryBtn, loading && styles.disabledBtn]} onPress={validateAndSubmit} activeOpacity={0.9} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? "Creating..." : "Sign up"}</Text>
            </TouchableOpacity>

            <View style={{ height: 18 }} />

            <TouchableOpacity style={styles.link} onPress={() => setRole(null)}>
              <Text style={styles.linkText}>Change role</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.link, { marginTop: 8 }]} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>

            <View style={{ height: 60 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF1F5",paddingTop: 20},
  wrapperCentered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  bigTitle: { fontSize: 28, fontWeight: "900", marginBottom: 20, color: "#24333a" },
  roleBtn: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  roleBtnTitle: { fontWeight: "800", fontSize: 16, marginBottom: 6 },
  roleBtnSub: { color: "#6b7b80", fontSize: 13 },

  wrap: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 28 },
  title: { fontSize: 26, fontWeight: "800", color: "#2b3b3b", marginBottom: 12 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#d6dce0",
    borderRadius: 30,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  passwordRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  eyeBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  primaryBtn: { backgroundColor: "#2f4858", borderRadius: 28, paddingVertical: 14, alignItems: "center", marginTop: 6 },
  disabledBtn: { opacity: 0.6 },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  uploadPlaceholder: {
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e6ea",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  divLine: { flex: 1, height: 1, backgroundColor: "#d6dce0" },
  divText: { marginHorizontal: 12, color: "#7f8b8b" },
  link: { marginTop: 12, alignItems: "center" },
  linkText: { color: "#2b6b6b", textDecorationLine: "underline" },
  backLink: { marginTop: 22 },
  backText: { color: "#7a8c93" },

  // dropdown styles
  dropdown: {
    height: 52,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#d6dce0",
    paddingHorizontal: 18,
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  dropdownLabel: { color: "#24333a" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#fff", padding: 18, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: "60%" },
  modalItem: { paddingVertical: 12 },
});
