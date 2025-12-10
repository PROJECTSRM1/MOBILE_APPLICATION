// // src/screens/Signup.tsx
// import React, { useState, useRef, useEffect } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Alert,
//   ScrollView,
//   Modal,
//   FlatList,
//   Pressable,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../App";

// type Props = NativeStackScreenProps<RootStackParamList, "Signup">;
// type Role = "customer" | "user" | null;

// const SERVICE_OPTIONS = [
//   "Cleaning",
//   "Packers & Movers",
//   "Home Services",
//   "Rentals",
//   "Buy&Sale Properties",
//   "Construction Materials",
// ];

// const validateEmail = (email: string) =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// export default function Signup(props: any) {
//   const { navigation, route } = props as Props;
//   const initialRole = (route?.params as any)?.role as Role | undefined;
//   const [role, setRole] = useState<Role>(initialRole ?? null);

//   // common fields
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState(""); // password enabled
//   const [showPassword, setShowPassword] = useState(false);

//   // customer-specific
//   const [otp, setOtp] = useState("");
//   const [workType, setWorkType] = useState("");
//   const [expectedCost, setExpectedCost] = useState("");
//   const [address, setAddress] = useState("");

//   // user/service-provider-specific
//   const [govtId, setGovtId] = useState("");
//   const [serviceTypes, setServiceTypes] = useState(""); // earlier field reused

//   // dropdown modal state
//   const [dropOpen, setDropOpen] = useState(false);

//   // OTP helper states
//   const resendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const [otpSent, setOtpSent] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);

//   const [loading, setLoading] = useState(false);

//   // cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (resendIntervalRef.current) {
//         clearInterval(resendIntervalRef.current);
//         resendIntervalRef.current = null;
//       }
//     };
//   }, []);

//   // send a dummy OTP (6 digits), set otp state and start 30s cooldown
//   const sendOtp = () => {
//     if (!/^\d{7,15}$/.test(phone)) {
//       Alert.alert("Invalid phone", "Please enter a valid phone number before requesting OTP.");
//       return;
//     }

//     const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
//     setOtp(code);
//     setOtpSent(true);
//     setResendTimer(30);
//     console.log("Dummy OTP generated:", code);

//     Alert.alert("OTP", `Your OTP is ${code}`);

//     if (resendIntervalRef.current) {
//       clearInterval(resendIntervalRef.current);
//       resendIntervalRef.current = null;
//     }

//     resendIntervalRef.current = setInterval(() => {
//       setResendTimer((prev) => {
//         if (prev <= 1) {
//           if (resendIntervalRef.current) {
//             clearInterval(resendIntervalRef.current);
//             resendIntervalRef.current = null;
//           }
//           setOtpSent(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   // === validateAndSubmit (made explicit to avoid role/dashboard swaps) ===
//   const validateAndSubmit = () => {
//     if (!role) {
//       Alert.alert("Select role", "Please choose Customer or User to continue.");
//       return;
//     }
//     if (!name.trim()) {
//       Alert.alert("Missing name", "Please enter your name.");
//       return;
//     }
//     if (!/^\d{7,15}$/.test(phone)) {
//       Alert.alert("Invalid phone", "Please enter a valid phone number.");
//       return;
//     }
//     if (!validateEmail(email)) {
//       Alert.alert("Invalid email", "Please enter a valid email address.");
//       return;
//     }
//     if (!password || password.length < 4) {
//       Alert.alert("Weak password", "Password should be at least 4 characters.");
//       return;
//     }

//     // role-specific checks
//     if (role === "customer") {
//       if (!workType.trim()) {
//         Alert.alert("Missing work type", "Please describe what service you need.");
//         return;
//       }
//       if (!address.trim()) {
//         Alert.alert("Missing address", "Please add a service address.");
//         return;
//       }
//     } else if (role === "user") {
//       if (!serviceTypes.trim()) {
//         Alert.alert("Missing services", "Please choose at least one primary service in the dropdown.");
//         return;
//       }
//       // if (!govtId.trim()) {
//       //   Alert.alert("Missing ID", "Please enter your Govt ID or registration number.");
//       //   return;
//       // }
//     }

//     console.log("Submitting signup for role:", role);

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);

//       switch (role) {
//         case "customer":
//           Alert.alert("Success", "Account created — please login to continue.");
//           navigation.replace("Login", {
//             role: "customer",
//             prefilledEmail: email || "",
//             prefilledPassword: password || "",
//           });
//           return;

//         case "user":
//           Alert.alert("Success", "Account created — please login to continue.");
//           navigation.replace("Login", {
//             role: "user",
//             prefilledEmail: email || "",
//             prefilledPassword: password || "",
//           });
//           return;

//         default:
//           Alert.alert("Success", "Account created — redirecting.");
//           navigation.replace("Login");
//           return;
//       }
//     }, 900);
//   };

//   if (!role) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
//         <View style={styles.wrapperCentered}>
//           <Text style={styles.bigTitle}>Sign up as</Text>

//           <TouchableOpacity
//             style={[styles.roleBtn, { backgroundColor: "#fff" }]}
//             activeOpacity={0.9}
//             onPress={() => {
//               console.log("Role selected: customer");
//               setRole("customer");
//             }}
//           >
//             <Text style={styles.roleBtnTitle}>Customer Signup</Text>
//             <Text style={styles.roleBtnSub}>Book services, request quotes, manage bookings</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.roleBtn, { marginTop: 12 }]}
//             activeOpacity={0.9}
//             onPress={() => {
//               console.log("Role selected: user");
//               setRole("user");
//             }}
//           >
//             <Text style={styles.roleBtnTitle}>User / Service Provider Signup</Text>
//             <Text style={styles.roleBtnSub}>Offer services, receive bookings, manage availability</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }


//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
//       <KeyboardAvoidingView
//         behavior={Platform.select({ ios: "padding", android: undefined })}
//         style={{ flex: 1 }}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
//             <Text style={styles.title}>{role === "customer" ? "Customer Signup" : "Service Provider Signup"}</Text>

//             {/* Common fields */}
//             <TextInput
//               value={name}
//               onChangeText={setName}
//               placeholder="Full name"
//               placeholderTextColor="#9aa0a6"
//               style={styles.input}
//               autoCapitalize="words"
//             />
//             <TextInput
//               value={phone}
//               onChangeText={setPhone}
//               placeholder="Phone number"
//               placeholderTextColor="#9aa0a6"
//               keyboardType="phone-pad"
//               style={styles.input}
//             />
//             <TextInput
//               value={email}
//               onChangeText={setEmail}
//               placeholder="Email address"
//               placeholderTextColor="#9aa0a6"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               style={styles.input}
//             />

//             {/* Password row (restored) */}
//             <View style={styles.passwordRow}>
//               <TextInput
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Create password"
//                 placeholderTextColor="#9aa0a6"
//                 secureTextEntry={!showPassword}
//                 style={[styles.input, { flex: 1 }]}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn}>
//                 <Text style={{ fontWeight: "700" }}>{showPassword ? "Hide" : "Show"}</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Role-specific inputs */}
//             {role === "customer" ? (
//               <>
//                 {/* OTP row: input + Send OTP button */}
//                 <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
//                   <TextInput
//                     value={otp}
//                     onChangeText={setOtp}
//                     placeholder="Verification OTP (optional)"
//                     placeholderTextColor="#9aa0a6"
//                     keyboardType="numeric"
//                     style={[styles.input, { flex: 1, marginBottom: 0 }]}
//                   />

//                   <TouchableOpacity
//                     onPress={sendOtp}
//                     style={[
//                       {
//                         marginLeft: 10,
//                         paddingVertical: 12,
//                         paddingHorizontal: 14,
//                         borderRadius: 10,
//                         backgroundColor: otpSent ? "#d0e9e6" : "#0e8b7b",
//                       },
//                     ]}
//                     disabled={otpSent}
//                   >
//                     <Text style={{ color: otpSent ? "#6b7b78" : "#fff", fontWeight: "700" }}>
//                       {otpSent ? `Resend (${resendTimer}s)` : "Send OTP"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 <TextInput
//                   value={workType}
//                   onChangeText={setWorkType}
//                   placeholder="Work required (eg. Deep cleaning / Carpet / Move out)"
//                   placeholderTextColor="#9aa0a6"
//                   style={styles.input}
//                 />
//                 <TextInput
//                   value={expectedCost}
//                   onChangeText={setExpectedCost}
//                   placeholder="Expected budget (optional)"
//                   placeholderTextColor="#9aa0a6"
//                   keyboardType="numeric"
//                   style={styles.input}
//                 />
//                 <TextInput
//                   value={address}
//                   onChangeText={setAddress}
//                   placeholder="Service address"
//                   placeholderTextColor="#9aa0a6"
//                   style={[styles.input, { height: 88 }]}
//                   multiline
//                 />
//               </>
//             ) : (
//               <>
//                 <TouchableOpacity style={styles.dropdown} onPress={() => setDropOpen(true)}>
//                   <Text style={styles.dropdownLabel}>{serviceTypes || "Select primary service (required)"}</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {role === "user" && (
//               <>
//                 {/* <TextInput value={govtId} onChangeText={setGovtId} placeholder="Govt ID / Registration No." placeholderTextColor="#9aa0a6" style={styles.input} /> */}
//                 <TextInput value={address} onChangeText={setAddress} placeholder="Base address / City" placeholderTextColor="#9aa0a6" style={styles.input} />
//               </>
//             )}

//             <TouchableOpacity style={[styles.primaryBtn, loading && styles.disabledBtn]} onPress={validateAndSubmit} activeOpacity={0.9} disabled={loading}>
//               <Text style={styles.primaryBtnText}>{loading ? "Creating..." : "Sign up"}</Text>
//             </TouchableOpacity>

//             <View style={{ height: 18 }} />

//             <TouchableOpacity style={styles.link} onPress={() => setRole(null)}>
//               <Text style={styles.linkText}>Change role</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.link, { marginTop: 8 }]}
//               onPress={() => {
//                 navigation.replace("Login");
//               }}
//             >
//               <Text style={styles.linkText}>Already have an account? Login</Text>
//             </TouchableOpacity>

//             <View style={{ height: 60 }} />
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>

//       {/* Dropdown modal placed outside ScrollView so it won't accidentally overlay content when closed */}
//       <Modal
//         visible={dropOpen}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setDropOpen(false)}
//       >
//         <Pressable
//           style={styles.modalBackdrop}
//           onPress={() => setDropOpen(false)}
//           android_ripple={{ color: "rgba(0,0,0,0.05)" }}
//         >
//           <TouchableWithoutFeedback>
//             <View style={styles.modalSheet}>
//               <Text style={{ fontWeight: "800", marginBottom: 8 }}>Select primary service</Text>
//               <FlatList
//                 data={SERVICE_OPTIONS}
//                 keyExtractor={(i) => i}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.modalItem}
//                     onPress={() => {
//                       setServiceTypes(item);
//                       setDropOpen(false);
//                     }}
//                   >
//                     <Text style={{ fontSize: 15 }}>{item}</Text>
//                   </TouchableOpacity>
//                 )}
//                 ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//               />
//             </View>
//           </TouchableWithoutFeedback>
//         </Pressable>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#EAF1F5", paddingTop: 20 },
//   wrapperCentered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
//   bigTitle: { fontSize: 28, fontWeight: "900", marginBottom: 20, color: "#24333a" },
//   roleBtn: {
//     width: "100%",
//     maxWidth: 560,
//     backgroundColor: "#fff",
//     padding: 18,
//     borderRadius: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   roleBtnTitle: { fontWeight: "800", fontSize: 16, marginBottom: 6 },
//   roleBtnSub: { color: "#6b7b80", fontSize: 13 },

//   wrap: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 28 },
//   title: { fontSize: 26, fontWeight: "800", color: "#2b3b3b", marginBottom: 12 },
//   input: {
//     height: 52,
//     borderWidth: 1,
//     borderColor: "#d6dce0",
//     borderRadius: 30,
//     paddingHorizontal: 16,
//     marginBottom: 12,
//     backgroundColor: "#fff",
//   },
//   passwordRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
//   eyeBtn: { paddingHorizontal: 12, paddingVertical: 8 },
//   primaryBtn: { backgroundColor: "#2f4858", borderRadius: 28, paddingVertical: 14, alignItems: "center", marginTop: 6 },
//   disabledBtn: { opacity: 0.6 },
//   primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
//   uploadPlaceholder: {
//     height: 64,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e0e6ea",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//     backgroundColor: "#fff",
//   },
//   dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
//   divLine: { flex: 1, height: 1, backgroundColor: "#d6dce0" },
//   divText: { marginHorizontal: 12, color: "#7f8b8b" },
//   link: { marginTop: 12, alignItems: "center" },
//   linkText: { color: "#2b6b6b", textDecorationLine: "underline" },
//   backLink: { marginTop: 22 },
//   backText: { color: "#7a8c93" },

//   // dropdown styles
//   dropdown: {
//     height: 52,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: "#d6dce0",
//     paddingHorizontal: 18,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//     marginBottom: 12,
//   },
//   dropdownLabel: { color: "#24333a" },

//   // modal
//   modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
//   modalSheet: { backgroundColor: "#fff", padding: 18, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: "60%" },
//   modalItem: { paddingVertical: 12 },
// });
// src/screens/Signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const Signup: React.FC = () => {
  const navigation = useNavigation<any>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const onContinue = () => {
    // later you can validate and go to Step 2 screen
    console.log("Step 1 values:", { firstName, lastName, gender, email, phone });
  };

  const GENDERS = ["Male", "Female", "Other"];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      <LinearGradient
        colors={["#3B82F6", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.root}
      >
        {/* Back text (top-left) */}
        <TouchableOpacity
          style={styles.backTop}
          onPress={() => navigation.navigate("Freelancer")}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainRow}>
            {/* LEFT PANEL – join our community + steps */}
            <View style={styles.leftCard}>
              <Text style={styles.brandTitle}>Swachify</Text>
              <Text style={styles.leftHeading}>Join Our Community</Text>
              <Text style={styles.leftSubtitle}>
                Start your freelancing journey today and unlock endless
                opportunities.
              </Text>

              {/* Steps */}
              <View style={styles.stepsWrap}>
                {/* Step 1 active */}
                <View style={[styles.stepRow, styles.stepRowActive]}>
                  <View style={[styles.stepCircle, styles.stepCircleActive]}>
                    <Text style={styles.stepNumberActive}>1</Text>
                  </View>
                  <View>
                    <Text style={[styles.stepTitle, styles.stepTitleActive]}>
                      Personal Information
                    </Text>
                    <Text style={styles.stepDesc}>Tell us about yourself</Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={styles.stepRow}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <View>
                    <Text style={styles.stepTitle}>Account Security</Text>
                    <Text style={styles.stepDesc}>
                      Create a secure password
                    </Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={styles.stepRow}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                  <View>
                    <Text style={styles.stepTitle}>Skills & ID Proof</Text>
                    <Text style={styles.stepDesc}>Choose your expertise</Text>
                  </View>
                </View>

                {/* Step 4 */}
                <View style={styles.stepRow}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>4</Text>
                  </View>
                  <View>
                    <Text style={styles.stepTitle}>Payment</Text>
                    <Text style={styles.stepDesc}>
                      Complete registration fee
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT PANEL – form card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Create Your Account</Text>
              <Text style={styles.formStepText}>Step 1 of 4</Text>

              {/* progress bar */}
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>

              {/* first + last name */}
              <View style={styles.row}>
                <View style={styles.inputCol}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    placeholderTextColor="#9CA3AF"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={styles.inputCol}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor="#9CA3AF"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              {/* gender (inline dropdown) */}
              <View style={[styles.inputColFull, styles.dropdownWrapper]}>
                <Text style={styles.inputLabel}>Gender</Text>

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowGenderOptions((p) => !p)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      !gender && { color: "#9CA3AF" },
                    ]}
                  >
                    {gender || "Select your gender"}
                  </Text>
                  <Text style={styles.dropdownArrow}>⌄</Text>
                </TouchableOpacity>

                {/* Inline options list — appears under the input */}
                {showGenderOptions && (
                  <View style={styles.inlineOptions}>
                    {GENDERS.map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={styles.inlineOptionItem}
                        activeOpacity={0.8}
                        onPress={() => {
                          setGender(g);
                          setShowGenderOptions(false);
                        }}
                      >
                        <Text style={styles.inlineOptionText}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* email */}
              <View style={styles.inputColFull}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* phone */}
              <View style={styles.inputColFull}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* continue button */}
              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.9}
                onPress={onContinue}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>

              {/* login link */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginLink}>Login here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default Signup;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backTop: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    color: "#E5E7EB",
    fontSize: 16,
    marginRight: 4,
  },
  backText: {
    color: "#E5E7EB",
    fontSize: 14,
  },
  contentContainer: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: "center",
  },
  mainRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  /* LEFT CARD */
  leftCard: {
    backgroundColor: "rgba(15,23,42,0.18)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    width: "100%",
  },
  brandTitle: {
    color: "#E5E7EB",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
  },
  leftHeading: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  leftSubtitle: {
    color: "#E5E7EB",
    fontSize: 13,
    marginBottom: 20,
  },
  stepsWrap: {
    marginTop: 4,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    opacity: 0.6,
  },
  stepRowActive: {
    opacity: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepCircleActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  stepNumber: {
    color: "#E5E7EB",
    fontWeight: "600",
  },
  stepNumberActive: {
    color: "#4F46E5",
    fontWeight: "800",
  },
  stepTitle: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 14,
  },
  stepTitleActive: {
    color: "#FFFFFF",
  },
  stepDesc: {
    color: "#CBD5F5",
    fontSize: 11,
  },

  /* FORM CARD */
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: "100%",
    marginTop: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  formStepText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginBottom: 18,
  },
  progressFill: {
    width: "25%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#8B5CF6",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputCol: {
    width: "48%",
    marginBottom: 14,
  },
  inputColFull: {
    width: "100%",
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },

  dropdownWrapper: {
    position: "relative", // parent for absolute inline options
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 14,
    color: "#111827",
  },
  dropdownArrow: {
    fontSize: 16,
    color: "#6B7280",
  },

  /* INLINE OPTIONS (appears below input like web select) */
  inlineOptions: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 56, // places it right below the input (adjust if input height changes)
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: Platform.OS === "android" ? 8 : 10,
    zIndex: 999,
    overflow: "hidden",
  },
  inlineOptionItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  inlineOptionText: {
    fontSize: 14,
    color: "#111827",
  },

  continueBtn: {
    marginTop: 10,
    backgroundColor: "#6366F1",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  continueText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  loginText: {
    fontSize: 13,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "700",
  },
});
