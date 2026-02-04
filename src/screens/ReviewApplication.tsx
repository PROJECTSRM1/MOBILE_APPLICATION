import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  Pencil,
  Calendar,
  User,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/* =========================
   MAIN SCREEN
========================= */
const ReviewApplication = () => {
  const genderMap: Record<string, string> = {
    "1": "Male",
    "2": "Female",
    "3": "Other",
  };

  const reverseGenderMap: Record<string, string> = {
    Male: "1",
    Female: "2",
    Other: "3",
  };

  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation();
  const USER_ID = 1;
  
  const [fullName, setFullName] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Add this

  /* 🔹 SECTION EDIT MODES */
  const [basicEdit, setBasicEdit] = useState(false);
  const [educationEdit, setEducationEdit] = useState(false);
  const [contactEdit, setContactEdit] = useState(false);

  /* 🔹 Editable values */
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isDeclared, setIsDeclared] = useState(false);
  const [declarationError, setDeclarationError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  /* 🔹 Edit All handler */
  const toggleEditAll = () => {
    const enable = !(basicEdit && educationEdit && contactEdit);
    setBasicEdit(enable);
    setEducationEdit(enable);
    setContactEdit(enable);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value.replace(/\D/g, ""));
  };

 const updateApplication = async () => {
  try {
    setSubmitting(true);
    
    const payload = {
      full_name: fullName,
      dob,
      gender: reverseGenderMap[gender] || gender,
      degree,
      institute: college,
      percentage: "",
      email,
      phone,
    };

    console.log("=== SUBMISSION DEBUG ===");
    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    const res = await fetch(
      `https://swachify-india-be-1-mcrb.onrender.com/internship/application/${USER_ID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);

    const json = await res.json();
    console.log("Full API Response:", JSON.stringify(json, null, 2));

    // Check multiple possible success indicators
    if (res.ok && (json?.status === true || json?.status === "success" || json?.success)) {
      console.log("✅ API call successful");
      return true;
    } else {
      console.log("❌ API returned non-success status");
      console.log("Response status field:", json?.status);
      throw new Error(json?.message || json?.error || "Update failed");
    }
  } catch (err: any) {
    console.error("=== UPDATE ERROR ===");
    console.error("Error type:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error:", err);
    
    Alert.alert(
      "Submission Failed", 
      err.message || "Failed to submit application. Please try again."
    );
    return false;
  } finally {
    setSubmitting(false);
  }
};

  const fetchApplication = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://swachify-india-be-1-mcrb.onrender.com/internship/application/${USER_ID}`
      );

      const app = await res.json();
      console.log("Fetched application:", app); // Debug log

      // ✅ Map backend → UI (FIXED: removed duplicate gender setting)
      setFullName(app.full_name || "");
      setApplicationId(app.application_code || "");
      setGender(genderMap[app.gender] || app.gender || ""); // Only set once
      setDob(app.dob || "");
      setDegree(app.degree || "");
      setCollege(app.institute || "");
      setEmail(app.email || "");
      setPhone(app.phone || "");
    } catch (err) {
      console.error("Fetch application error:", err);
      Alert.alert("Error", "Failed to load application data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ color: colors.text, textAlign: "center", marginTop: 40 }}>
          Loading application…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Review Application</Text>

          <TouchableOpacity onPress={toggleEditAll}>
            <Text style={styles.editAll}>
              {basicEdit && educationEdit && contactEdit ? "Save" : "Edit All"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
            }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{fullName || "—"}</Text>

            {applicationId ? (
              <Text style={styles.appId}>{applicationId}</Text>
            ) : null}

            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Draft Status</Text>
            </View>
          </View>
        </View>

        {/* BASIC INFO */}
        <Section
          title="Basic Info"
          onEdit={() => setBasicEdit(!basicEdit)}
          styles={styles}
          colors={colors}
        >
          <EditableRow
            icon={<Calendar size={18} color={colors.primary} />}
            label="DATE OF BIRTH"
            value={dob}
            editable={basicEdit}
            onChange={setDob}
            styles={styles}
          />

          <EditableRow
            icon={<User size={18} color={colors.primary} />}
            label="GENDER"
            value={gender}
            editable={basicEdit}
            onChange={setGender}
            styles={styles}
          />
        </Section>

        {/* EDUCATION */}
        <Section
          title="Educational Qualifications"
          onEdit={() => setEducationEdit(!educationEdit)}
          styles={styles}
          colors={colors}
        >
          <EditableRow
            icon={<GraduationCap size={18} color={colors.primary} />}
            label="DEGREE"
            value={degree}
            subValue={college}
            editable={educationEdit}
            onChange={setDegree}
            onSubChange={setCollege}
            styles={styles}
          />
        </Section>

        {/* CONTACT INFO */}
        <Section
          title="Contact Information"
          onEdit={() => setContactEdit(!contactEdit)}
          styles={styles}
          colors={colors}
        >
          <EditableRow
            icon={<Mail size={18} color={colors.primary} />}
            label="EMAIL"
            value={email}
            editable={contactEdit}
            onChange={(val: string) => {
              setEmail(val);
              setEmailError("");
            }}
            styles={styles}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <EditableRow
            icon={<Phone size={18} color={colors.primary} />}
            label="PHONE"
            value={phone}
            editable={contactEdit}
            onChange={(val: string) => {
              setPhone(val);
              setPhoneError("");
            }}
            styles={styles}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </Section>

        <View style={styles.declarationContainer}>
          {declarationError && (
            <Text style={styles.errorText}>
              Please accept the declaration before submitting.
            </Text>
          )}

          {/* DECLARATION */}
          <View style={styles.declaration}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                isDeclared && { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                setIsDeclared(!isDeclared);
                setDeclarationError(false);
              }}
              activeOpacity={0.8}
            >
              {isDeclared && (
                <MaterialIcons name="check" size={16} color="#fff" />
              )}
            </TouchableOpacity>

            <Text style={styles.declarationText}>
              I hereby certify that the information provided is accurate and true
              to the best of my knowledge.
            </Text>
          </View>
        </View>

        {/* SUBMIT */}
       <TouchableOpacity
  style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
  disabled={submitting}
  onPress={async () => {
    console.log("Submit button pressed");
    
    let hasError = false;

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    // Validate phone
    if (!validatePhone(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      hasError = true;
    }

    // Check declaration
    if (!isDeclared) {
      setDeclarationError(true);
      hasError = true;
    }

    if (hasError) {
      console.log("Validation failed");
      return;
    }

    console.log("Validation passed");
    
    // TEMPORARY: Skip API call for testing navigation
    console.log("Navigating to success screen...");
    navigation.navigate("ApplicationSuccess" as never);
    
    // ORIGINAL CODE (comment back in after testing):
    // const success = await updateApplication();
    // if (success) {
    //   navigation.navigate("ApplicationSuccess" as never);
    // }
  }}
>
  <Text style={styles.submitText}>
    {submitting ? "Submitting..." : "Submit Application ➜"}
  </Text>
</TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewApplication;

/* =========================
   REUSABLE COMPONENTS
========================= */

const Section = ({ title, children, onEdit, styles, colors }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Pencil size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

const EditableRow = ({
  icon,
  label,
  value,
  subValue,
  editable,
  onChange,
  onSubChange,
  styles,
}: any) => (
  <View style={styles.infoRow}>
    <View style={styles.iconBox}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>

      {editable ? (
        <>
          <TextInput
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
          {subValue !== undefined && (
            <TextInput
              value={subValue}
              onChangeText={onSubChange}
              style={styles.inputSub}
            />
          )}
        </>
      ) : (
        <>
          <Text style={styles.infoValue}>{value}</Text>
          {subValue && <Text style={styles.infoSub}>{subValue}</Text>}
        </>
      )}
    </View>
  </View>
);

/* =========================
   STYLES (UNCHANGED)
========================= */


const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* ================= HEADER ================= */
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      alignItems: "center",
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },

    editAll: {
      color: colors.primary,
      fontWeight: "600",
    },

    /* ================= PROFILE CARD ================= */
    profileCard: {
      flexDirection: "row",
      backgroundColor: colors.card,
      margin: 16,
      padding: 16,
      borderRadius: 18,
      gap: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
errorText: {
  color: "#ff4d4f",
  fontSize: 12,
  marginBottom: 8,
},


    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },

    name: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 16,
    },
declarationContainer: {
  marginHorizontal: 16,
  marginTop: 16,
},

    appId: {
      color: colors.primary,
      marginTop: 2,
    },

    statusPill: {
      backgroundColor: colors.primary + "20",
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      marginTop: 6,
    },

    statusText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "600",
    },

    /* ================= SECTION ================= */
    section: {
      paddingHorizontal: 16,
      marginTop: 22,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    sectionTitle: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 15,
    },

    /* ================= INFO ROW ================= */
    infoRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 18,
      alignItems: "flex-start",
    },

    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
    },

    infoLabel: {
      color: colors.subText,
      fontSize: 12,
    },

    infoValue: {
      color: colors.text,
      fontWeight: "600",
      marginTop: 2,
    },

    infoSub: {
      color: colors.subText,
      marginTop: 2,
    },

    /* ================= INPUTS ================= */
    input: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 10,
      color: colors.text,
      marginTop: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },

    inputSub: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 10,
      color: colors.subText,
      marginTop: 6,
      fontSize: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    /* ================= DECLARATION ================= */
   declaration: {
  flexDirection: "row",
  gap: 10,
  backgroundColor: colors.card,
  padding: 14,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: colors.border,
},


   checkbox: {
  width: 18,
  height: 18,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
},


    declarationText: {
      color: colors.subText,
      fontSize: 12,
      flex: 1,
      lineHeight: 18,
    },

    /* ================= SUBMIT ================= */
    submitBtn: {
      backgroundColor: colors.primary,
      marginHorizontal: 16,
      marginBottom: 30,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
    },

    submitText: {
      color: "#ffffff",
      fontWeight: "700",
      fontSize: 16,
    },
  });