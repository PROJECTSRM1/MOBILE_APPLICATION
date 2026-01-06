
// // src/screens/Signup.tsx
// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     TextInput,
//     ScrollView,
//     Dimensions,
//     Alert,
//     Platform,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import { useNavigation } from "@react-navigation/native";

// const { width } = Dimensions.get("window");

// // TypeScript interfaces (optional, helpful when editing later)
// interface StepIndicatorProps {
//     number: number;
//     title: string;
//     subtitle: string;
//     isActive: boolean;
//     isComplete: boolean;
//     onPress: (stepNumber: number) => void;
//     isDisabled: boolean;
// }

// interface GenderDropdownProps {
//     value: string;
//     onSelect: (gender: string) => void;
// }

// interface SkillSelectionProps {
//     selectedSkills: string[];
//     setSelectedSkills: (skills: string[]) => void;
// }

// interface SkillButtonProps {
//     skill: string;
//     isSelected: boolean;
//     onToggle: (skill: string) => void;
// }

// const skillOptions = [
//     "Plumbing",
//     "Electrical",
//     "Cleaning",
//     "Painting",
//     "Carpentry",
//     "AC Repair",
//     "Moving",
//     "Gardening",
//     "Home Maintenance",
//     "Interior Design",
// ];

// const genderOptions = [
//     { label: "Male", value: "male" },
//     { label: "Female", value: "female" },
//     { label: "Other", value: "other" },
// ];

// const StepIndicator: React.FC<StepIndicatorProps> = ({
//     number,
//     title,
//     subtitle,
//     isActive,
//     isComplete,
//     onPress,
//     isDisabled,
// }) => (
//     <TouchableOpacity
//         disabled={isDisabled}
//         style={[styles.stepTouchable, isDisabled && { opacity: 0.5 }]}
//         onPress={() => onPress(number)}
//     >
//         <View style={styles.stepContainer}>
//             {number > 1 && (
//                 <View style={isComplete || isActive ? styles.connectorActive : styles.connectorInactive} />
//             )}

//             <View style={styles.stepContent}>
//                 <View style={[styles.stepCircle, (isActive || isComplete) && styles.stepCircleActive]}>
//                     {isComplete ? (
//                         <Text style={styles.stepCheckmark}>✓</Text>
//                     ) : (
//                         <Text style={[styles.stepNumber, (isActive || isComplete) && styles.stepNumberActive]}>
//                             {number}
//                         </Text>
//                     )}
//                 </View>
//                 <View style={styles.stepTextContent}>
//                     <Text style={[styles.stepTitle, (isActive || isComplete) && styles.stepTitleActive]}>
//                         {title}
//                     </Text>
//                     <Text style={styles.stepSubtitle}>{subtitle}</Text>
//                 </View>
//             </View>
//         </View>
//     </TouchableOpacity>
// );

// const SkillButton: React.FC<SkillButtonProps> = ({ skill, isSelected, onToggle }) => (
//     <TouchableOpacity
//         style={[styles.skillButton, isSelected && styles.skillButtonActive]}
//         onPress={() => onToggle(skill)}
//     >
//         <Text style={[styles.skillButtonText, isSelected && styles.skillButtonTextActive]}>{skill}</Text>
//     </TouchableOpacity>
// );

// const SkillSelection: React.FC<SkillSelectionProps> = ({ selectedSkills, setSelectedSkills }) => {
//     const handleToggleSkill = (skill: string) => {
//         if (selectedSkills.includes(skill)) {
//             setSelectedSkills(selectedSkills.filter((s) => s !== skill));
//         } else if (selectedSkills.length < 5) {
//             setSelectedSkills([...selectedSkills, skill]);
//         } else {
//             Alert.alert("Limit Reached", "You can select a maximum of 5 skills for now.");
//         }
//     };

//     return (
//         <View style={styles.skillSelectionContainer}>
//             {skillOptions.map((skill) => (
//                 <SkillButton key={skill} skill={skill} isSelected={selectedSkills.includes(skill)} onToggle={handleToggleSkill} />
//             ))}
//         </View>
//     );
// };

// const GenderDropdown: React.FC<GenderDropdownProps> = ({ value, onSelect }) => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     const handleToggle = () => {
//         setIsDropdownOpen(!isDropdownOpen);
//     };

//     const handleSelectOption = (genderValue: string) => {
//         onSelect(genderValue);
//         setIsDropdownOpen(false);
//     };

//     const displayLabel = genderOptions.find((opt) => opt.value === value)?.label || "Select your gender";

//     return (
//         <View style={styles.dropdownWrapper}>
//             <TouchableOpacity style={[styles.dropdownInput, isDropdownOpen && styles.dropdownInputOpen]} onPress={handleToggle}>
//                 <Text style={[styles.dropdownText, value === "" ? styles.dropdownPlaceholder : styles.dropdownSelected]}>
//                     {displayLabel}
//                 </Text>
//                 <Text style={[styles.dropdownIcon, isDropdownOpen && styles.dropdownIconRotated]}>&#9660;</Text>
//             </TouchableOpacity>

//             {isDropdownOpen && (
//                 <View style={styles.dropdownOptionsContainer}>
//                     {genderOptions.map((option, index) => (
//                         <TouchableOpacity
//                             key={option.value}
//                             style={[styles.dropdownOption, index === genderOptions.length - 1 && { borderBottomWidth: 0 }]}
//                             onPress={() => handleSelectOption(option.value)}
//                         >
//                             <Text style={styles.dropdownOptionText}>{option.label}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             )}
//         </View>
//     );
// };

// export default function Signup() {
//     const navigation = useNavigation() as any;

//     const [selectedGender, setSelectedGender] = useState<string>("");
//     const [currentStep, setCurrentStep] = useState<number>(1);
//     const [password, setPassword] = useState<string>("");
//     const [confirmPassword, setConfirmPassword] = useState<string>("");
//     const [location, setLocation] = useState<string>("Hyderabad, India");
//     const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
//     const [panNumber, setPanNumber] = useState<string>("");

//     const stepsData = [
//         { number: 1, title: "Personal Information", subtitle: "Tell us about yourself" },
//         { number: 2, title: "Account Security", subtitle: "Create a secure password" },
//         { number: 3, title: "Skills & ID Proof", subtitle: "Choose your expertise" },
//         { number: 4, title: "Payment", subtitle: "Complete registration fee" },
//     ];

//     const handleContinue = () => {
//         // Step 1 basic check (gender required)
//         if (currentStep === 1) {
//             if (selectedGender === "") {
//                 Alert.alert("Missing Information", "Please select your gender.");
//                 return;
//             }
//         }

//         // Step 2 validations
//         if (currentStep === 2) {
//             if (password.length < 6) {
//                 Alert.alert("Invalid Password", "Password must be at least 6 characters long.");
//                 return;
//             }
//             if (password !== confirmPassword) {
//                 Alert.alert("Password Mismatch", "Password and Confirm Password must match.");
//                 return;
//             }
//         }

//         // Step 3 validations
//         if (currentStep === 3) {
//             if (selectedSkills.length === 0) {
//                 Alert.alert("Skills Required", "Please select at least one skill.");
//                 return;
//             }
//             if (panNumber.trim().length === 0) {
//                 Alert.alert("ID Proof Required", "Please enter your Government ID (PAN/Aadhaar number).");
//                 return;
//             }
//         }

//         if (currentStep < 4) {
//             setCurrentStep((prev) => prev + 1);
//         } else {
//             Alert.alert("Registration Complete!", "Your account is ready for review.");
//         }
//     };

//     const handleStepJump = (stepNumber: number) => {
//         if (stepNumber <= currentStep) {
//             setCurrentStep(stepNumber);
//         }
//     };

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 1:
//                 return (
//                     <>
//                         <Text style={styles.formTitle}>Tell us about yourself</Text>
//                         <View style={styles.inputRow}>
//                             <View style={styles.inputGroup}>
//                                 <Text style={styles.inputLabel}>First Name</Text>
//                                 <TextInput style={styles.input} placeholder="John" placeholderTextColor="#999" />
//                             </View>
//                             <View style={styles.inputGroup}>
//                                 <Text style={styles.inputLabel}>Last Name</Text>
//                                 <TextInput style={styles.input} placeholder="Doe" placeholderTextColor="#999" />
//                             </View>
//                         </View>
//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Gender</Text>
//                             <GenderDropdown value={selectedGender} onSelect={setSelectedGender} />
//                         </View>
//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Email Address</Text>
//                             <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#999" keyboardType="email-address" />
//                         </View>
//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Phone Number</Text>
//                             <TextInput style={styles.input} placeholder="9876543210" placeholderTextColor="#999" keyboardType="phone-pad" />
//                         </View>
//                     </>
//                 );
//             case 2:
//                 return (
//                     <>
//                         <Text style={styles.formTitle}>Create a secure password</Text>
//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Password</Text>
//                             <TextInput style={styles.input} placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
//                         </View>
//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Confirm Password</Text>
//                             <TextInput style={styles.input} placeholder="********" placeholderTextColor="#999" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
//                         </View>
//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Location</Text>
//                             <TextInput style={[styles.input, styles.staticText]} placeholder="Hyderabad, India" placeholderTextColor="#1f2937" value={location} onChangeText={setLocation} />
//                         </View>
//                     </>
//                 );
//             case 3:
//                 return (
//                     <>
//                         <Text style={styles.formTitle}>Select your skills & upload ID proof</Text>
//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Select Your Skills</Text>
//                             <SkillSelection selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
//                         </View>

//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Government ID Proof (e.g., PAN/Aadhaar Number)</Text>
//                             <TextInput style={styles.input} placeholder="Enter ID Number (e.g., PAN Number)" placeholderTextColor="#999" autoCapitalize="characters" value={panNumber} onChangeText={setPanNumber} />
//                         </View>

//                         <View style={styles.inputGroupFull}>
//                             <Text style={styles.inputLabel}>Upload ID Proof (Front & Back)</Text>
//                             <TouchableOpacity style={styles.uploadButton}>
//                                 <Text style={styles.uploadButtonText}>Upload Documents</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </>
//                 );
//             case 4:
//                 return (
//                     <>
//                         <Text style={styles.formTitle}>Complete registration fee</Text>

//                         <View style={styles.paymentCategoryBox}>
//                             <Text style={styles.paymentCategoryTitle}>Payment Category</Text>
//                             <View style={styles.paymentFeeRow}>
//                                 <Text style={styles.paymentFeeLabel}>Platform Fee:</Text>
//                                 <Text style={styles.paymentFeeAmount}>₹ 499</Text>
//                             </View>
//                         </View>

//                         <Text style={[styles.inputLabel, { marginTop: 20 }]}>Select Payment Method</Text>
//                         <View style={styles.paymentMethodsRow}>
//                             <TouchableOpacity style={[styles.paymentMethodCard, styles.paymentMethodCardActive]} onPress={() => Alert.alert("Razorpay Selected", "Proceed to Razorpay gateway?")}>
//                                 <Text style={styles.paymentMethodLogo}>R</Text>
//                                 <Text style={styles.paymentMethodTextActive}>Razorpay</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.paymentMethodCard} onPress={() => Alert.alert("Stripe Selected", "Stripe gateway not yet configured.")}>
//                                 <Text style={styles.paymentMethodLogo}>S</Text>
//                                 <Text style={styles.paymentMethodText}>Stripe</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <LinearGradient colors={["#a78bfa", "#7c3aed"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollContent}>
//                 <View style={styles.mobileHeader}>
//                     <TouchableOpacity onPress={() => (currentStep > 1 ? setCurrentStep((prev) => prev - 1) : navigation.goBack())}>
//                         <Text style={styles.backButtonText}>← Back</Text>
//                     </TouchableOpacity>
//                 </View>

//                 <View style={styles.titleBlock}>
//                     <Text style={styles.swachifyTitle}>Swachify</Text>
//                     <Text style={styles.joinTitle}>Create Your Account</Text>
//                     <Text style={styles.joinSubtitle}>Step {currentStep} of 4</Text>
//                 </View>

//                 <View style={styles.contentCard}>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepsHorizontalList}>
//                         {stepsData.map((step) => (
//                             <StepIndicator
//                                 key={step.number}
//                                 number={step.number}
//                                 title={step.title}
//                                 subtitle={step.subtitle}
//                                 isActive={step.number === currentStep}
//                                 isComplete={step.number < currentStep}
//                                 onPress={handleStepJump}
//                                 isDisabled={step.number > currentStep}
//                             />
//                         ))}
//                     </ScrollView>

//                     <View style={styles.formSection}>
//                         {renderStepContent()}

//                         {currentStep !== 4 && (
//                             <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
//                                 <Text style={styles.continueButtonText}>Continue</Text>
//                             </TouchableOpacity>
//                         )}

//                         {currentStep === 4 && (
//                             <View style={styles.paymentActionRow}>
//                                 <TouchableOpacity style={styles.payButton} onPress={() => Alert.alert("Payment Initiated", "Redirecting to Razorpay gateway...")}>
//                                     <Text style={styles.continueButtonText}>Pay ₹499</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={styles.createAccountButton} onPress={handleContinue}>
//                                     <Text style={styles.createAccountButtonText}>Create Account</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}

//                         <Text style={styles.loginText}>
//                             Already have an account?{" "}
//                             <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
//                                 Login here
//                             </Text>
//                         </Text>
//                     </View>
//                 </View>
//             </ScrollView>
//         </LinearGradient>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     scrollContent: {
//         flexGrow: 1,
//         paddingBottom: 20,
//         alignItems: "center",
//     },
//     mobileHeader: {
//         width: width,
//         // paddingTop: Platform.OS === "ios" ? 60 : 50,
//         paddingTop: 10,
//         paddingHorizontal: 20,
//         marginBottom: 20,
//     },
//     backButtonText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "600",
//     },
//     titleBlock: {
//         width: width * 0.9,
//         alignItems: "flex-start",
//         marginBottom: 20,
//     },
//     swachifyTitle: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#e0d6fa",
//         marginBottom: 5,
//     },
//     joinTitle: {
//         fontSize: 28,
//         fontWeight: "bold",
//         color: "#fff",
//         marginBottom: 5,
//     },
//     joinSubtitle: {
//         fontSize: 16,
//         color: "#fff",
//     },
//     contentCard: {
//         width: width,
//         backgroundColor: "#fff",
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         overflow: "visible",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: -5 },
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         elevation: 5,
//     },
//     stepTouchable: {
//         width: 140,
//         paddingHorizontal: 5,
//     },
//     stepContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     stepsHorizontalList: {
//         paddingHorizontal: 15,
//         paddingVertical: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: "#f3f4f6",
//     },
//     connectorInactive: {
//         height: 2,
//         width: 15,
//         backgroundColor: "#e5e7eb",
//     },
//     connectorActive: {
//         height: 2,
//         width: 15,
//         backgroundColor: "#7c3aed",
//     },
//     stepContent: {
//         flexDirection: "row",
//         alignItems: "center",
//         flexShrink: 1,
//     },
//     stepCircle: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         backgroundColor: "#e5e7eb",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 10,
//     },
//     stepCircleActive: {
//         backgroundColor: "#7c3aed",
//     },
//     stepNumber: {
//         color: "#4b5563",
//         fontSize: 14,
//         fontWeight: "bold",
//     },
//     stepNumberActive: {
//         color: "#fff",
//     },
//     stepCheckmark: {
//         color: "#fff",
//         fontSize: 18,
//         fontWeight: "bold",
//     },
//     stepTextContent: {
//         flexShrink: 1,
//     },
//     stepTitle: {
//         fontSize: 14,
//         color: "#9ca3af",
//         fontWeight: "600",
//     },
//     stepTitleActive: {
//         color: "#7c3aed",
//     },
//     stepSubtitle: {
//         fontSize: 11,
//         color: "#9ca3af",
//     },
//     formSection: {
//         padding: 20,
//     },
//     formTitle: {
//         fontSize: 22,
//         fontWeight: "bold",
//         color: "#1f2937",
//         marginBottom: 20,
//     },
//     inputRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 15,
//         gap: 15,
//     },
//     inputGroup: {
//         flex: 1,
//     },
//     inputGroupFull: {
//         width: "100%",
//         marginBottom: 15,
//     },
//     inputLabel: {
//         fontSize: 14,
//         color: "#4b5563",
//         marginBottom: 5,
//         fontWeight: "600",
//     },
//     input: {
//         height: 50,
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 12,
//         paddingHorizontal: 15,
//         fontSize: 16,
//         color: "#1f2937",
//         backgroundColor: "#f9fafb",
//     },
//     staticText: {
//         paddingVertical: 15,
//         lineHeight: 20,
//         fontWeight: "bold",
//         backgroundColor: "#fff",
//     },
//     skillSelectionContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 10,
//         marginBottom: 10,
//     },
//     skillButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         borderRadius: 20,
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         backgroundColor: "#f9fafb",
//         marginRight: 8,
//         marginBottom: 8,
//     },
//     skillButtonActive: {
//         borderColor: "#7c3aed",
//         backgroundColor: "#eef2ff",
//     },
//     skillButtonText: {
//         fontSize: 14,
//         color: "#4b5563",
//         fontWeight: "500",
//     },
//     skillButtonTextActive: {
//         color: "#7c3aed",
//         fontWeight: "600",
//     },
//     dropdownWrapper: {
//         position: "relative",
//         zIndex: 10,
//     },
//     dropdownInput: {
//         height: 50,
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 12,
//         paddingHorizontal: 15,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         backgroundColor: "#f9fafb",
//     },
//     dropdownInputOpen: {
//         borderColor: "#7c3aed",
//         borderBottomLeftRadius: 0,
//         borderBottomRightRadius: 0,
//     },
//     dropdownPlaceholder: {
//         fontSize: 16,
//         color: "#999",
//     },
//     dropdownSelected: {
//         fontSize: 16,
//         color: "#1f2937",
//     },
//     dropdownText: {
//         fontSize: 16,
//     },
//     dropdownIcon: {
//         fontSize: 18,
//         color: "#999",
//     },
//     dropdownIconRotated: {
//         transform: [{ rotate: "180deg" }],
//     },
//     dropdownOptionsContainer: {
//         position: "absolute",
//         top: 50,
//         width: "100%",
//         backgroundColor: "#fff",
//         borderBottomLeftRadius: 12,
//         borderBottomRightRadius: 12,
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderTopWidth: 0,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 5 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 5,
//         overflow: "hidden",
//     },
//     dropdownOption: {
//         paddingVertical: 15,
//         paddingHorizontal: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: "#f3f4f6",
//     },
//     dropdownOptionText: {
//         fontSize: 16,
//         color: "#1f2937",
//         fontWeight: "500",
//     },
//     continueButton: {
//         backgroundColor: "#7c3aed",
//         paddingVertical: 15,
//         borderRadius: 12,
//         marginTop: 20,
//         marginBottom: 20,
//     },
//     continueButtonText: {
//         color: "#fff",
//         fontSize: 18,
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     uploadButton: {
//         backgroundColor: "#eef2ff",
//         paddingVertical: 15,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: "#a78bfa",
//     },
//     uploadButtonText: {
//         color: "#7c3aed",
//         fontSize: 16,
//         fontWeight: "600",
//         textAlign: "center",
//     },
//     loginText: {
//         textAlign: "center",
//         fontSize: 14,
//         color: "#6b7280",
//         paddingBottom: 20,
//     },
//     loginLink: {
//         color: "#7c3aed",
//         fontWeight: "bold",
//     },
//     paymentCategoryBox: {
//         width: "100%",
//         padding: 20,
//         borderRadius: 15,
//         backgroundColor: "#7c3aed",
//         marginBottom: 20,
//     },
//     paymentCategoryTitle: {
//         fontSize: 16,
//         color: "#e0d6fa",
//         fontWeight: "500",
//         marginBottom: 10,
//     },
//     paymentFeeRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     paymentFeeLabel: {
//         fontSize: 18,
//         color: "#fff",
//         fontWeight: "500",
//     },
//     paymentFeeAmount: {
//         fontSize: 30,
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     paymentMethodsRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 10,
//         marginBottom: 20,
//         gap: 15,
//     },
//     paymentMethodCard: {
//         flex: 1,
//         padding: 20,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         alignItems: "center",
//     },
//     paymentMethodCardActive: {
//         borderColor: "#7c3aed",
//         backgroundColor: "#f3f4f6",
//     },
//     paymentMethodLogo: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#1f2937",
//         marginBottom: 5,
//     },
//     paymentMethodText: {
//         fontSize: 14,
//         color: "#4b5563",
//         fontWeight: "600",
//     },
//     paymentMethodTextActive: {
//         fontSize: 14,
//         color: "#7c3aed",
//         fontWeight: "600",
//     },
//     paymentActionRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         gap: 15,
//         marginTop: 20,
//         marginBottom: 20,
//     },
//     payButton: {
//         flex: 2,
//         backgroundColor: "#10b981",
//         paddingVertical: 15,
//         borderRadius: 12,
//         alignItems: "center",
//     },
//     createAccountButton: {
//         flex: 1,
//         backgroundColor: "#e5e7eb",
//         paddingVertical: 15,
//         borderRadius: 12,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     createAccountButtonText: {
//         color: "#4b5563",
//         fontSize: 16,
//         fontWeight: "600",
//     },
// });

// src/screens/Signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

/* ================== CONSTANTS ================== */

const skillOptions = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "AC Repair",
  "Moving",
  "Gardening",
  "Home Maintenance",
  "Interior Design",
];

const genderOptions = [
  { label: "Male", value: "male", id: 1 },
  { label: "Female", value: "female", id: 2 },
  { label: "Other", value: "other", id: 3 },
];

/* ================== STEP INDICATOR ================== */

const StepIndicator = ({
  number,
  title,
  subtitle,
  isActive,
  isComplete,
  onPress,
  isDisabled,
}: any) => (
  <TouchableOpacity
    disabled={isDisabled}
    style={[styles.stepTouchable, isDisabled && { opacity: 0.5 }]}
    onPress={() => onPress(number)}
  >
    <View style={styles.stepContainer}>
      {number > 1 && (
        <View
          style={isComplete || isActive ? styles.connectorActive : styles.connectorInactive}
        />
      )}
      <View style={styles.stepContent}>
        <View
          style={[
            styles.stepCircle,
            (isActive || isComplete) && styles.stepCircleActive,
          ]}
        >
          {isComplete ? (
            <Text style={styles.stepCheckmark}>✓</Text>
          ) : (
            <Text
              style={[
                styles.stepNumber,
                (isActive || isComplete) && styles.stepNumberActive,
              ]}
            >
              {number}
            </Text>
          )}
        </View>
        <View style={styles.stepTextContent}>
          <Text
            style={[
              styles.stepTitle,
              (isActive || isComplete) && styles.stepTitleActive,
            ]}
          >
            {title}
          </Text>
          <Text style={styles.stepSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

/* ================== SKILLS ================== */

const SkillButton = ({ skill, isSelected, onToggle }: any) => (
  <TouchableOpacity
    style={[styles.skillButton, isSelected && styles.skillButtonActive]}
    onPress={() => onToggle(skill)}
  >
    <Text
      style={[
        styles.skillButtonText,
        isSelected && styles.skillButtonTextActive,
      ]}
    >
      {skill}
    </Text>
  </TouchableOpacity>
);

const SkillSelection = ({ selectedSkills, setSelectedSkills }: any) => {
  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s: string) => s !== skill));
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      Alert.alert("Limit Reached", "You can select a maximum of 5 skills.");
    }
  };

  return (
    <View style={styles.skillSelectionContainer}>
      {skillOptions.map(skill => (
        <SkillButton
          key={skill}
          skill={skill}
          isSelected={selectedSkills.includes(skill)}
          onToggle={handleToggleSkill}
        />
      ))}
    </View>
  );
};

/* ================== GENDER DROPDOWN ================== */

const GenderDropdown = ({ value, onSelect }: any) => {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    genderOptions.find(g => g.value === value)?.label ||
    "Select your gender";

  return (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity
        style={[
          styles.dropdownInput,
          open && styles.dropdownInputOpen,
        ]}
        onPress={() => setOpen(!open)}
      >
        <Text
          style={[
            styles.dropdownText,
            value === "" ? styles.dropdownPlaceholder : styles.dropdownSelected,
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={styles.dropdownIcon}>⌄</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownOptionsContainer}>
          {genderOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

/* ================== MAIN COMPONENT ================== */

export default function Signup() {
  const navigation = useNavigation<any>();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("Hyderabad, India");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [panNumber, setPanNumber] = useState("");

  const stepsData = [
    { number: 1, title: "Personal Information", subtitle: "Tell us about yourself" },
    { number: 2, title: "Account Security", subtitle: "Create a secure password" },
    { number: 3, title: "Skills & ID Proof", subtitle: "Choose your expertise" },
    { number: 4, title: "Payment", subtitle: "Complete registration fee" },
  ];

  /* ================== BACKEND REGISTER ================== */

  const handleRegister = async () => {
    try {
      const genderId =
        genderOptions.find(g => g.value === selectedGender)?.id || 0;

      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        mobile,
        password,
        confirm_password: confirmPassword,
        gender_id: genderId,
        state_id: 0,
        district_id: 0,
        skill_id: 1,
        government_id_type: "PAN",
        government_id_number: panNumber,
        address: location,
      };

      const res = await fetch(
        "https://swachify-india-be-1-mcrb.onrender.com/api/freelancer/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      // if (!res.ok) {
      //   Alert.alert("Registration Failed", data?.message || "Error");
      //   return;
      // }
      if (!res.ok) {
  Alert.alert(
    "Registration Failed",
    JSON.stringify(data, null, 2)
  );
  console.log(" BACKEND ERROR:", data);
  return;
}


      Alert.alert("Success", "Registration completed successfully");
      navigation.navigate("Login");
    } catch {
      Alert.alert("Error", "Unable to connect to server");
    }
  };

  /* ================== VALIDATION + FLOW ================== */

  const handleContinue = () => {
    if (currentStep === 1 && selectedGender === "") {
      Alert.alert("Missing Info", "Please select your gender.");
      return;
    }

    if (currentStep === 2) {
      if (password.length < 6) {
        Alert.alert("Invalid Password", "Minimum 6 characters required.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Mismatch", "Passwords do not match.");
        return;
      }
    }

    if (currentStep === 3) {
      if (!selectedSkills.length || !panNumber.trim()) {
        Alert.alert("Required", "Skills & ID proof required.");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleRegister();
    }
  };

  const handleStepJump = (step: number) => {
    if (step <= currentStep) setCurrentStep(step);
  };

  /* ================== UI ================== */

  return (
    <LinearGradient colors={["#a78bfa", "#7c3aed"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleBlock}>
          <Text style={styles.swachifyTitle}>Swachify</Text>
          <Text style={styles.joinTitle}>Create Your Account</Text>
          <Text style={styles.joinSubtitle}>Step {currentStep} of 4</Text>
        </View>

        <View style={styles.contentCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stepsData.map(step => (
              <StepIndicator
                key={step.number}
                {...step}
                isActive={step.number === currentStep}
                isComplete={step.number < currentStep}
                onPress={handleStepJump}
                isDisabled={step.number > currentStep}
              />
            ))}
          </ScrollView>

          <View style={styles.formSection}>
            {currentStep === 1 && (
              <>
                <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
                <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
                <GenderDropdown value={selectedGender} onSelect={setSelectedGender} />
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
                <TextInput style={styles.input} placeholder="Phone" value={mobile} onChangeText={setMobile} />
              </>
            )}

            {currentStep === 2 && (
              <>
                <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
              </>
            )}

            {currentStep === 3 && (
              <>
                <SkillSelection selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
                <TextInput style={styles.input} placeholder="PAN / Aadhaar Number" value={panNumber} onChangeText={setPanNumber} />
                <TouchableOpacity style={styles.uploadButton} onPress={() => Alert.alert("Coming Soon")}>
                  <Text style={styles.uploadButtonText}>Upload Documents</Text>
                </TouchableOpacity>
              </>
            )}

            {currentStep === 4 && (
              <>
                <View style={styles.paymentCategoryBox}>
                  <Text style={styles.paymentCategoryTitle}>Platform Fee</Text>
                  <Text style={styles.paymentFeeAmount}>₹ 499</Text>
                </View>

                <View style={styles.paymentActionRow}>
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => Alert.alert("Payment", "Razorpay integration pending")}
                  >
                    <Text style={styles.continueButtonText}>Pay ₹499</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.createAccountButton}
                    onPress={handleContinue}
                  >
                    <Text style={styles.createAccountButtonText}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>
                
              </>
            )}
          </View>
          {/* FOOTER CONTINUE BUTTON — STEP 1–3 */}
{currentStep < 4 && (
  <View style={styles.footerButtonContainer}>
    <TouchableOpacity
      style={styles.continueButton}
      onPress={handleContinue}
    >
      <Text style={styles.continueButtonText}>
        Continue
      </Text>
    </TouchableOpacity>
  </View>
)}

        </View>
      </ScrollView>
    </LinearGradient>
  );
}



/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
        // paddingTop: Platform.OS === "ios" ? 60 : 50,
        alignItems: "center",
    },
    mobileHeader: {
        width: width,
        // paddingTop: Platform.OS === "ios" ? 60 : 50,
        paddingTop: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    titleBlock: {
        width: width * 0.9,
        alignItems: "flex-start",
        marginBottom: 20,
    },
    swachifyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#e0d6fa",
        marginBottom: 5,
    },
    joinTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
    },
    joinSubtitle: {
        fontSize: 16,
        color: "#fff",
    },
    contentCard: {
        width: width,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "visible",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    stepTouchable: {
        width: 140,
        paddingHorizontal: 5,
    },
    stepContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    stepsHorizontalList: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    connectorInactive: {
        height: 2,
        width: 15,
        backgroundColor: "#e5e7eb",
    },
    connectorActive: {
        height: 2,
        width: 15,
        backgroundColor: "#7c3aed",
    },
    stepContent: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    stepCircleActive: {
        backgroundColor: "#7c3aed",
    },
    stepNumber: {
        color: "#4b5563",
        fontSize: 14,
        fontWeight: "bold",
    },
    stepNumberActive: {
        color: "#fff",
    },
    stepCheckmark: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    stepTextContent: {
        flexShrink: 1,
    },
    stepTitle: {
        fontSize: 14,
        color: "#9ca3af",
        fontWeight: "600",
    },
    stepTitleActive: {
        color: "#7c3aed",
    },
    stepSubtitle: {
        fontSize: 11,
        color: "#9ca3af",
    },
    formSection: {
        padding: 20,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        gap: 15,
    },
    inputGroup: {
        flex: 1,
    },
    inputGroupFull: {
        width: "100%",
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: "#4b5563",
        marginBottom: 5,
        fontWeight: "600",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#1f2937",
        backgroundColor: "#f9fafb",
    },
    staticText: {
        paddingVertical: 15,
        lineHeight: 20,
        fontWeight: "bold",
        backgroundColor: "#fff",
    },
    skillSelectionContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 10,
    },
    skillButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
        marginRight: 8,
        marginBottom: 8,
    },
    skillButtonActive: {
        borderColor: "#7c3aed",
        backgroundColor: "#eef2ff",
    },
    skillButtonText: {
        fontSize: 14,
        color: "#4b5563",
        fontWeight: "500",
    },
    skillButtonTextActive: {
        color: "#7c3aed",
        fontWeight: "600",
    },
    dropdownWrapper: {
        position: "relative",
        zIndex: 10,
    },
    dropdownInput: {
        height: 50,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f9fafb",
    },
    dropdownInputOpen: {
        borderColor: "#7c3aed",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: "#999",
    },
    dropdownSelected: {
        fontSize: 16,
        color: "#1f2937",
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownIcon: {
        fontSize: 18,
        color: "#999",
    },
    dropdownIconRotated: {
        transform: [{ rotate: "180deg" }],
    },
    dropdownOptionsContainer: {
        position: "absolute",
        top: 50,
        width: "100%",
        backgroundColor: "#fff",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderTopWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        overflow: "hidden",
    },
    dropdownOption: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    dropdownOptionText: {
        fontSize: 16,
        color: "#1f2937",
        fontWeight: "500",
    },
    continueButton: {
        backgroundColor: "#7c3aed",
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20,
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    uploadButton: {
        backgroundColor: "#eef2ff",
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#a78bfa",
    },
    uploadButtonText: {
        color: "#7c3aed",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    loginText: {
        textAlign: "center",
        fontSize: 14,
        color: "#6b7280",
        paddingBottom: 20,
    },
    loginLink: {
        color: "#7c3aed",
        fontWeight: "bold",
    },
    paymentCategoryBox: {
        width: "100%",
        padding: 20,
        borderRadius: 15,
        backgroundColor: "#7c3aed",
        marginBottom: 20,
    },
    paymentCategoryTitle: {
        fontSize: 16,
        color: "#e0d6fa",
        fontWeight: "500",
        marginBottom: 10,
    },
    paymentFeeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paymentFeeLabel: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "500",
    },
    paymentFeeAmount: {
        fontSize: 30,
        color: "#fff",
        fontWeight: "bold",
    },
    paymentMethodsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 20,
        gap: 15,
    },
    paymentMethodCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        alignItems: "center",
    },
    paymentMethodCardActive: {
        borderColor: "#7c3aed",
        backgroundColor: "#f3f4f6",
    },
    paymentMethodLogo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 5,
    },
    paymentMethodText: {
        fontSize: 14,
        color: "#4b5563",
        fontWeight: "600",
    },
    paymentMethodTextActive: {
        fontSize: 14,
        color: "#7c3aed",
        fontWeight: "600",
    },
    paymentActionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    payButton: {
        flex: 2,
        backgroundColor: "#10b981",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    createAccountButton: {
        flex: 1,
        backgroundColor: "#e5e7eb",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    createAccountButtonText: {
        color: "#4b5563",
        fontSize: 16,
        fontWeight: "600",
    },
    footerButtonContainer: {
  padding: 20,
  backgroundColor: "#fff",
},

// continueButton: {
//   backgroundColor: "#7c3aed",
//   paddingVertical: 14,
//   borderRadius: 12,
// },

// continueButtonText: {
//   color: "#fff",
//   fontSize: 16,
//   fontWeight: "700",
//   textAlign: "center",
// },

});