import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

/* ================= TYPES ================= */
interface Course {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  materials: { name: string; type: string; size: string }[];
}

type RouteParams = {
  EnrollmentDetails: { course: Course };
};

const EnrollmentDetailsScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "EnrollmentDetails">>();

  const [courseData, setCourseData] = useState<Course>({
    id: 0,
    title: "",
    subtitle: "",
    image: "",
    materials: [],
  });

  useEffect(() => {
    if (route.params?.course) {
      setCourseData(route.params.course);
    }
  }, [route.params]);

  /* ================= FORM STATES ================= */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [qualification, setQualification] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  /* ================= DOCUMENT UPLOAD ================= */
  const [documents, setDocuments] = useState<string[]>([]);
const [errors, setErrors] = useState<{
  fullName?: string;
  email?: string;
  university?: string;
  qualification?: string;
  graduationYear?: string;
   documents?: string;
}>({});

  const pickDocuments = () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 10 - documents.length },
      (response) => {
        if (response.assets) {
          const imgs = response.assets.map((a) => a.uri || "");
          setDocuments([...documents, ...imgs]);
        }
      }
    );
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };
const validateForm = () => {
  const newErrors: typeof errors = {};

  // Full Name: only letters and spaces
  if (!fullName.trim()) {
    newErrors.fullName = "Full name is required";
  } else if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
    newErrors.fullName = "Full name can only contain letters";
  }

  // Email
  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    newErrors.email = "Enter a valid email address";
  }

  // University
  if (!university.trim()) {
    newErrors.university = "University name is required";
  }

  // Qualification
  if (!qualification.trim()) {
    newErrors.qualification = "Qualification is required";
  }

  // Graduation Year: 4-digit number
  if (!graduationYear.trim()) {
    newErrors.graduationYear = "Graduation year is required";
  } else if (!/^\d{4}$/.test(graduationYear)) {
    newErrors.graduationYear = "Enter a valid year (e.g. 2024)";
  }
  if (documents.length === 0) {
    newErrors.documents = "Please upload at least one document";
  }
  setErrors(newErrors);

  // Returns true if no errors
  return Object.keys(newErrors).length === 0;
};

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => (navigation as any).goBack()}
          >
            <Icon name="arrow-back-ios" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ENROLLMENT DETAILS</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* ================= PROGRESS ================= */}
        <View style={styles.progressBox}>
          <Text style={styles.progressLabel}>REGISTRATION PROGRESS</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressTitle}>Final Review</Text>
            <Text style={styles.progressStep}>Step 3 of 3</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* ================= COURSE CARD ================= */}
        <LinearGradient
          colors={[colors.surfaceAlt, colors.background]}
          style={styles.courseCard}
        >
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM COURSE</Text>
          </View>

          <Text style={styles.courseTitle}>{courseData.title}</Text>
          <Text style={styles.courseMeta}>⏱ 12 Weeks • ⭐ 4.9 Rating</Text>

          <Text style={styles.sectionLabel}>COURSE OVERVIEW</Text>

          <View style={styles.featuresRow}>
            {["Docker & K8s", "Spring Cloud", "Event-Driven", "API Gateway"].map(
              (item) => (
                <View key={item} style={styles.featureItem}>
                  <Icon name="check-circle" size={18} color={colors.primary} />
                  <Text style={styles.featureText}>{item}</Text>
                </View>
              )
            )}
          </View>
        </LinearGradient>

        {/* ================= PERSONAL INFO ================= */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>👤 Personal Information</Text>

          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            
          />
{errors.fullName && (
  <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
    {errors.fullName}
  </Text>
)}

          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            placeholder="name@example.com"
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && (
  <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
    {errors.email}
  </Text>
)}

        </View>

        {/* ================= ACADEMIC INFO ================= */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>🎓 Academic Background</Text>

          <Text style={styles.inputLabel}>University / College Name</Text>
          <TextInput
            placeholder="Search institution"
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={university}
            onChangeText={setUniversity}
          />
          {errors.university && (
  <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
    {errors.university}
  </Text>
)}


          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Qualification</Text>
              <TextInput
                placeholder="Your qualification"
                placeholderTextColor="#6b7280"
                style={styles.input}
                value={qualification}
                onChangeText={setQualification}
              />
              {errors.qualification && (
  <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
    {errors.qualification}
  </Text>
)}

            </View>

            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Graduation Year</Text>
              <TextInput
                placeholder="2024"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                style={styles.input}
                value={graduationYear}
                onChangeText={setGraduationYear}
              />
              {errors.graduationYear && (
  <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
    {errors.graduationYear}
  </Text>
)}

            </View>
          </View>

          {/* ================= DOCUMENT UPLOAD ================= */}
          <Text style={styles.inputLabel}>Upload Certificates / ID Proof</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.uploadBox} onPress={pickDocuments}>
              <Icon name="cloud-upload" size={30} color={colors.primary} />
              <Text style={styles.uploadText}>UPLOAD</Text>
              <Text style={styles.uploadSub}>Max 10 images</Text>
            </TouchableOpacity>

            {documents.map((doc, index) => (
              <View key={index} style={styles.docPreview}>
                <Image source={{ uri: doc }} style={styles.docImage} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeDocument(index)}
                >
                  <Icon name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {errors.documents && (
  <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4, marginBottom: 8 }}>
    {errors.documents}
  </Text>
)}

        </View>

        {/* ================= CONFIRM ================= */}
        <TouchableOpacity
          style={styles.confirmBtn}
        onPress={() => {
  if (!validateForm()) return;

  (navigation as any).navigate("TrainingDetails", {
    course: courseData,
  });
}}

        >
          <Text style={styles.confirmText}>Confirm & Enroll</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.trustText}>
          Trusted by 10k+ students worldwide
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EnrollmentDetailsScreen;

/* ================= STYLES ================= */
const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },

    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },

    headerTitle: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 14,
    },

    progressBox: { paddingHorizontal: 16, marginBottom: 8 },
    progressLabel: { color: colors.primary, fontSize: 12 },
    progressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 6,
    },
    progressTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
    progressStep: { color: colors.subText },

    progressBarBg: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 6,
      overflow: "hidden",
    },
    progressBarFill: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.primary,
    },

    courseCard: {
      margin: 16,
      padding: 18,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
    },

    premiumBadge: {
      backgroundColor: colors.primary + "20",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 8,
      alignSelf: "flex-start",
    },

    premiumText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: "700",
    },

    courseTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 4,
    },

    courseMeta: {
      color: colors.subText,
      marginBottom: 12,
    },

    sectionLabel: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 8,
    },

    featuresRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },

    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    featureText: { color: colors.text },

    formSection: {
      paddingHorizontal: 16,
      marginTop: 22,
    },

    formTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 12,
    },

    inputLabel: {
      color: colors.subText,
      fontSize: 12,
      marginBottom: 4,
    },

    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 14,
      color: colors.text,
      marginBottom: 14,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },

    halfInput: { flex: 1 },

    uploadBox: {
      width: 120,
      height: 120,
      borderRadius: 18,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    uploadText: {
      fontWeight: "700",
      color: colors.text,
      marginTop: 6,
    },

    uploadSub: {
      fontSize: 11,
      color: colors.subText,
    },

    docPreview: {
      width: 120,
      height: 120,
      borderRadius: 18,
      marginRight: 12,
      position: "relative",
    },

    docImage: {
      width: "100%",
      height: "100%",
      borderRadius: 18,
    },

    removeBtn: {
      position: "absolute",
      top: 6,
      right: 6,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 4,
      borderRadius: 10,
    },

    confirmBtn: {
      margin: 16,
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 22,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      elevation: 6,
    },

    confirmText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 16,
    },

    trustText: {
      color: colors.subText,
      textAlign: "center",
      marginTop: 20,
    },
  });
