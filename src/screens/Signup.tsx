import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    // FIX 1: Import Alert from 'react-native' to resolve "Cannot find name 'alert'"
    Alert,
} from "react-native";
// Note: Assumes react-native-linear-gradient is installed and linked
import LinearGradient from "react-native-linear-gradient"; 
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// 1. Define the TypeScript Interface for the StepIndicator Props
interface StepIndicatorProps {
    number: number;
    title: string;
    subtitle: string;
    isActive: boolean;
    isComplete: boolean;
    onPress: (stepNumber: number) => void;
    isDisabled: boolean; 
}

// Interface for the GenderDropdown component to explicitly type the 'value'
interface GenderDropdownProps {
    value: string;
    onSelect: (gender: string) => void;
}

// Interface for Skill Selection Props
interface SkillSelectionProps {
    selectedSkills: string[];
    setSelectedSkills: (skills: string[]) => void;
}

// Interface for Skill Button Props
interface SkillButtonProps {
    skill: string;
    isSelected: boolean;
    onToggle: (skill: string) => void;
}

// Skill Options Array (no change)
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

// Gender Options Array (no change)
const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
];

// Component to represent the step indicator
const StepIndicator: React.FC<StepIndicatorProps> = ({
    number,
    title,
    subtitle,
    isActive,
    isComplete,
    onPress, 
    isDisabled, 
}) => (
    // WRAPPER: Use TouchableOpacity with the correct style
    <TouchableOpacity 
        // 1. Use isDisabled to disable touch functionality
        disabled={isDisabled} 
        style={[
            styles.stepTouchable,
            // 2. Apply a fading style if disabled
            isDisabled && { opacity: 0.5 }, 
        ]}
        onPress={() => onPress(number)}
    >
        {/* Line connector - Moved inside a parent View for correct layout */}
        <View style={styles.stepContainer}>
            {/* Conditional connector for steps 2, 3, 4 */}
            {number > 1 && <View style={isComplete || isActive ? styles.connectorActive : styles.connectorInactive} />}

            <View style={styles.stepContent}>
                <View style={[styles.stepCircle, (isActive || isComplete) && styles.stepCircleActive]}>
                    {/* Conditional render for checkmark or number */}
                    {isComplete ? (
                        <Text style={styles.stepCheckmark}>✓</Text> // Simple checkmark for completeness
                    ) : (
                        <Text style={[styles.stepNumber, (isActive || isComplete) && styles.stepNumberActive]}>
                            {number}
                        </Text>
                    )}
                </View>
                <View style={styles.stepTextContent}>
                    <Text style={[styles.stepTitle, (isActive || isComplete) && styles.stepTitleActive]}>
                        {title}
                    </Text>
                    <Text style={styles.stepSubtitle}>{subtitle}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);


// Component for Skill Selection Buttons (no change)
const SkillButton: React.FC<SkillButtonProps> = ({ skill, isSelected, onToggle }) => (
    <TouchableOpacity
        style={[styles.skillButton, isSelected && styles.skillButtonActive]}
        onPress={() => onToggle(skill)}
    >
        <Text style={[styles.skillButtonText, isSelected && styles.skillButtonTextActive]}>
            {skill}
        </Text>
    </TouchableOpacity>
);

// Component for Skill Selection Block (no change)
const SkillSelection: React.FC<SkillSelectionProps> = ({ selectedSkills, setSelectedSkills }) => {
    const handleToggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            // Remove skill
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else if (selectedSkills.length < 5) { // Optional: Limit to 5 skills
            // Add skill
            setSelectedSkills([...selectedSkills, skill]);
        } else {
            Alert.alert("Limit Reached", "You can select a maximum of 5 skills for now.");
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


// Dropdown component
const GenderDropdown: React.FC<GenderDropdownProps> = ({ value, onSelect }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelectOption = (genderValue: string) => {
        onSelect(genderValue);
        setIsDropdownOpen(false);
    };

    const displayLabel = genderOptions.find(opt => opt.value === value)?.label || "Select your gender";

    return (
        <View style={styles.dropdownWrapper}>
            <TouchableOpacity
                style={[styles.dropdownInput, isDropdownOpen && styles.dropdownInputOpen]}
                onPress={handleToggle}
            >
                <Text
                    style={[
                        styles.dropdownText,
                        value === "" ? styles.dropdownPlaceholder : styles.dropdownSelected,
                    ]}
                >
                    {displayLabel}
                </Text>
                {/* FIX 2: Renamed the style from dropdownArrow to dropdownIcon to avoid conflict with standard CSS/TS types, and removed 'transform' logic for simplicity */}
                <Text
                    style={[
                        styles.dropdownIcon,
                        isDropdownOpen && styles.dropdownIconRotated
                    ]}
                >
                    &#9660;
                </Text>
            </TouchableOpacity>

            {isDropdownOpen && (
                <View style={styles.dropdownOptionsContainer}>
                    {genderOptions.map((option, index) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.dropdownOption,
                                index === genderOptions.length - 1 && { borderBottomWidth: 0 },
                            ]}
                            onPress={() => handleSelectOption(option.value)}
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


export default function Signup() {
    // FIX 3: Explicitly type useNavigation result if not done globally (optional, but good practice)
    const navigation = useNavigation<any>();
    
    // State for form data and current step
    const [selectedGender, setSelectedGender] = useState<string>(""); // Explicit type
    const [currentStep, setCurrentStep] = useState<number>(1); // Explicit type
    const [password, setPassword] = useState<string>(''); // Explicit type
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // Explicit type
    const [location, setLocation] = useState<string>('Hyderabad, India'); // Explicit type
    // State for new skill selection
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // Explicit type
    const [panNumber, setPanNumber] = useState<string>(''); // Explicit type
    // Step 1 states (NEW – required for backend)
const [firstName, setFirstName] = useState<string>("");
const [lastName, setLastName] = useState<string>("");
const [email, setEmail] = useState<string>("");
const [phone, setPhone] = useState<string>("");

// Optional loading flag
const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    // FUNCTION TO ADVANCE STEP
   const handleContinue = async () => {
  // ---------------- STEP 1 VALIDATION ----------------
  if (currentStep === 1) {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Missing Information", "Please fill all required fields.");
      return;
    }
    if (!selectedGender) {
      Alert.alert("Missing Information", "Please select your gender.");
      return;
    }
    setCurrentStep(2);
    return;
  }

  // ---------------- STEP 2 VALIDATION ----------------
  if (currentStep === 2) {
    if (password.length < 6) {
      Alert.alert("Invalid Password", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    setCurrentStep(3);
    return;
  }

  // ---------------- STEP 3 VALIDATION ----------------
  if (currentStep === 3) {
    if (selectedSkills.length === 0) {
      Alert.alert("Skills Required", "Select at least one skill.");
      return;
    }
    if (!panNumber.trim()) {
      Alert.alert("ID Proof Required", "Enter your Government ID.");
      return;
    }
    setCurrentStep(4);
    return;
  }

  // ---------------- FINAL SUBMIT (STEP 4) ----------------
  if (currentStep === 4) {
    try {
      setIsSubmitting(true);

      // Map gender → ID (backend-safe)
      const genderMap: Record<string, number> = {
        male: 1,
        female: 2,
        other: 3,
      };

      // Map skills → IDs (example mapping)
      const skillIds = selectedSkills.map(
        skill => skillOptions.indexOf(skill) + 1
      );

      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        mobile: phone.trim(),
        password: password,
        confirm_password: confirmPassword,
        gender_id: genderMap[selectedGender],
        state_id: 1,          // replace if dynamic later
        district_id: 1,       // replace if dynamic later
        skill_ids: skillIds,  // array → backend friendly
        government_id_type: "PAN",
        government_id_number: panNumber.trim(),
        address: location,
        payment_status: "PAID",
      };

      console.log("FINAL PAYLOAD:", payload);
const response = await fetch(
  "https://swachify-india-be-1-mcrb.onrender.com/api/freelancer/register",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }
);


      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Registration failed");
        return;
      }

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
};

    
    // Function to jump to a specific step
    const handleStepJump = (stepNumber: number) => {
        // Logic to allow jumping only to steps <= currentStep
        if (stepNumber <= currentStep) {
            setCurrentStep(stepNumber);
        } 
    };

    // Data structure for all steps
    const stepsData = [
        { number: 1, title: "Personal Information", subtitle: "Tell us about yourself" },
        { number: 2, title: "Account Security", subtitle: "Create a secure password" },
        { number: 3, title: "Skills & ID Proof", subtitle: "Choose your expertise" },
        { number: 4, title: "Payment", subtitle: "Complete registration fee" },
    ];

    // Function to render the content for the current step (no change)
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    // --- STEP 1: Personal Information Form ---
                    <>
                        <Text style={styles.formTitle}>Tell us about yourself</Text>
                        <View style={styles.inputRow}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John"
                                    placeholderTextColor="#999"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Doe"
                                    placeholderTextColor="#999"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Gender</Text>
                            <GenderDropdown
                                value={selectedGender}
                                onSelect={setSelectedGender}

                            />
                        </View>
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                // autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="9876543210"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                    </>
                );
            case 2:
                return (
                    // --- STEP 2: Account Security Form ---
                    <>
                        <Text style={styles.formTitle}>Create a secure password</Text>
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="********"
                                placeholderTextColor="#999"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="********"
                                placeholderTextColor="#999"
                                secureTextEntry={true}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Location</Text>
                            <TextInput
                                style={[styles.input, styles.staticText]}
                                placeholder="Hyderabad, India"
                                placeholderTextColor="#1f2937"
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </>
                );
            case 3:
                return (
                    // --- STEP 3: Skills & ID Proof ---
                    <>
                        <Text style={styles.formTitle}>Select your skills & upload ID proof</Text>

                        {/* SKILL SELECTION BUTTONS */}
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Select Your Skills</Text>
                            <SkillSelection 
                                selectedSkills={selectedSkills}
                                setSelectedSkills={setSelectedSkills}
                            />
                        </View>
                        
                        {/* GOVERNMENT ID INPUT */}
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Government ID Proof (e.g., PAN/Aadhaar Number)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter ID Number (e.g., PAN Number)"
                                placeholderTextColor="#999"
                                autoCapitalize="characters"
                                value={panNumber}
                                onChangeText={setPanNumber}
                            />
                        </View>
                        
                        {/* UPLOAD BUTTON */}
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Upload ID Proof (Front & Back)</Text>
                            <TouchableOpacity style={styles.uploadButton}>
                                <Text style={styles.uploadButtonText}>Upload Documents</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                );
            case 4:
                return (
                    // --- STEP 4: Payment Section ---
                    <>
                        <Text style={styles.formTitle}>Complete registration fee</Text>

                        {/* PAYMENT CATEGORY BOX */}
                        <View style={styles.paymentCategoryBox}>
                            <Text style={styles.paymentCategoryTitle}>Payment Category</Text>
                            <View style={styles.paymentFeeRow}>
                                <Text style={styles.paymentFeeLabel}>Platform Fee:</Text>
                                <Text style={styles.paymentFeeAmount}>₹ 499</Text>
                            </View>
                        </View>

                        {/* SELECT PAYMENT METHOD */}
                        <Text style={[styles.inputLabel, { marginTop: 20 }]}>Select Payment Method</Text>
                        <View style={styles.paymentMethodsRow}>
                            {/* Razorpay Option (Active state) */}
                            <TouchableOpacity
                                style={[styles.paymentMethodCard, styles.paymentMethodCardActive]}
                                onPress={() => Alert.alert("Razorpay Selected", "Proceed to Razorpay gateway?")}
                            >
                                <Text style={styles.paymentMethodLogo}>R</Text> {/* Placeholder for Razorpay Logo */}
                                <Text style={styles.paymentMethodTextActive}>Razorpay</Text>
                            </TouchableOpacity>

                            {/* Stripe Option (Inactive state) */}
                            <TouchableOpacity
                                style={styles.paymentMethodCard}
                                onPress={() => Alert.alert("Stripe Selected", "Stripe gateway not yet configured.")}
                            >
                                <Text style={styles.paymentMethodLogo}>Stripe</Text> {/* Placeholder for Stripe Logo */}
                                <Text style={styles.paymentMethodText}>Stripe</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <LinearGradient
            colors={["#a78bfa", "#7c3aed"]} // Purple gradient background for the whole page
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Mobile Header/Back Button */}
                <View style={styles.mobileHeader}>
                    <TouchableOpacity onPress={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : navigation.goBack()}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                </View>

                {/* Title Block */}
                <View style={styles.titleBlock}>
                    <Text style={styles.swachifyTitle}>Swachify</Text>
                    <Text style={styles.joinTitle}>Create Your Account</Text>
                    <Text style={styles.joinSubtitle}>
                        Step {currentStep} of 4
                    </Text>
                </View>

                {/* Content Card (Single Column) */}
                <View style={styles.contentCard}>
                    {/* Step Indicators Section - Horizontal flow for mobile responsiveness */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.stepsHorizontalList}
                    >
                        {stepsData.map((step) => (
                            <StepIndicator
                                key={step.number}
                                number={step.number}
                                title={step.title}
                                subtitle={step.subtitle}
                                isActive={step.number === currentStep}
                                isComplete={step.number < currentStep} // Step is complete if its number is less than the current step
                                onPress={handleStepJump} 
                                // CRITICAL CHANGE: Disables steps greater than the current step
                                isDisabled={step.number > currentStep}
                            />
                        ))}
                    </ScrollView>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        {renderStepContent()} {/* RENDER CURRENT STEP CONTENT */}

                        {currentStep !== 4 && ( // Only show the main 'Continue' button if it's NOT step 4
                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <Text style={styles.continueButtonText}>Continue</Text>
                            </TouchableOpacity>
                        )}
                        
                        {/* Payment Actions for Step 4 */}
                        {currentStep === 4 && (
                            <View style={styles.paymentActionRow}>
                                <TouchableOpacity style={styles.payButton} onPress={() => Alert.alert("Payment Initiated", "Redirecting to Razorpay gateway...")}>
                                    <Text style={styles.continueButtonText}>Pay ₹499</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.createAccountButton} onPress={handleContinue}>
                                    <Text style={styles.createAccountButtonText}>Create Account</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <Text style={styles.loginText}>
                            Already have an account?{" "}
                            <Text
                                style={styles.loginLink}
                                onPress={() => {
                                    /* Navigate to Login screen - placeholder */
                                    Alert.alert("Navigation", "Navigate to Login Screen");
                                }}
                            >
                                Login here
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
        alignItems: "center",
    },

    // --- Mobile Header/Title Styles ---
    mobileHeader: {
        width: width,
        paddingTop: 50,
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
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    swachifyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#e0d6fa", // Lighter purple for subtitle effect
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

    // --- Main Content Card (Single Column) ---
    contentCard: {
        width: width, // Full width for mobile design
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "visible", 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 }, // Shadow on top edge
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    // --- Step Indicator Styles (Horizontal Scroll) ---
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
    // Connector line style
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
    stepCheckmark: { // Style for the checkmark
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
        fontWeight: '600',
    },
    stepTitleActive: {
        color: "#7c3aed",
    },
    stepSubtitle: {
        fontSize: 11,
        color: "#9ca3af",
    },

    // --- Form Section Styles ---
    formSection: {
        padding: 20,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 20,
    },

    // Form Inputs
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
        backgroundColor: '#f9fafb', 
    },
    staticText: {
        paddingVertical: 15,
        lineHeight: 20, 
        fontWeight: 'bold',
        backgroundColor: '#fff', 
    },

    // --- Skill Selection Styles ---
    skillSelectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    skillButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    skillButtonActive: {
        borderColor: '#7c3aed',
        backgroundColor: '#eef2ff', 
    },
    skillButtonText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    skillButtonTextActive: {
        color: '#7c3aed',
        fontWeight: '600',
    },


    // --- Dropdown Styles ---
    dropdownWrapper: {
        position: 'relative',
        zIndex: 10, 
    },
    dropdownInput: {
        height: 50,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9fafb',
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
    // FIX 2: Renamed the arrow style for compatibility
    dropdownIcon: {
        fontSize: 18,
        color: "#999",
    },
    // Added style for rotation logic
    dropdownIconRotated: {
        transform: [{ rotate: '180deg' }],
    },
    // Container for the options list
    dropdownOptionsContainer: {
        position: 'absolute',
        top: 50, 
        width: '100%',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 12, 
        borderBottomRightRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderTopWidth: 0, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    dropdownOption: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    dropdownOptionText: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },

    // Buttons
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
        borderColor: '#a78bfa',
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
    
    // --- Payment Styles (Step 4) ---
    paymentCategoryBox: {
        width: '100%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#7c3aed', 
        marginBottom: 20,
    },
    paymentCategoryTitle: {
        fontSize: 16,
        color: '#e0d6fa',
        fontWeight: '500',
        marginBottom: 10,
    },
    paymentFeeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentFeeLabel: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500',
    },
    paymentFeeAmount: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
    },
    paymentMethodsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
        gap: 15,
    },
    paymentMethodCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
    },
    paymentMethodCardActive: {
        borderColor: '#7c3aed',
        backgroundColor: '#f3f4f6',
    },
    paymentMethodLogo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 5,
    },
    paymentMethodText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '600',
    },
    paymentMethodTextActive: {
        fontSize: 14,
        color: '#7c3aed',
        fontWeight: '600',
    },
    paymentActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    payButton: {
        flex: 2, // Larger button for primary action
        backgroundColor: "#10b981", // Green for payment
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    createAccountButton: {
        flex: 1, // Smaller button for secondary action
        backgroundColor: "#e5e7eb", // Light grey
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center", 
        justifyContent: 'center',
    },
    createAccountButtonText: {
        color: "#4b5563",
        fontSize: 16,
        fontWeight: "600",
    }
});