import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

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
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "EnrollmentDetails">>();

  // Get the selected course from route params
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

  // State for editable fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [qualification, setQualification] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => (navigation as any).goBack()}
          >
            <Icon name="arrow-back-ios" size={18} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>ENROLLMENT DETAILS</Text>
          <View style={{ width: 32 }} />
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
          colors={["#111827", "#020617"]}
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
                  <Icon name="check-circle" size={18} color="#3b82f6" />
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

          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            placeholder="name@example.com"
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
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

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Qualification</Text>
              <TextInput
                placeholder="Enter your qualification"
                style={styles.input}
                value={qualification}
                onChangeText={setQualification}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>Graduation Year</Text>
              <TextInput
                placeholder="e.g., 2024"
                style={styles.input}
                value={graduationYear}
                onChangeText={setGraduationYear}
              />
            </View>
          </View>

          {/* UPLOAD */}
          <View style={styles.uploadBox}>
            <Icon name="cloud-upload" size={28} color="#3b82f6" />
            <Text style={styles.uploadText}>Drop files or browse</Text>
            <Text style={styles.uploadSub}>
              Support: PDF, JPG, PNG (Max 5MB)
            </Text>
          </View>
        </View>

        {/* ================= CONFIRM BUTTON ================= */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() =>
            (navigation as any).navigate("TrainingDetails", { course: courseData })
          }
        >
          <Text style={styles.confirmText}>Confirm & Enroll</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* ================= TRUST ================= */}
        <Text style={styles.trustText}>Trusted by 10k+ students worldwide</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EnrollmentDetailsScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },

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
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  progressBox: { paddingHorizontal: 16 },
  progressLabel: { color: "#3b82f6", fontSize: 12 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  progressTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  progressStep: { color: "#9ca3af" },

  progressBarBg: {
    height: 4,
    backgroundColor: "#1f2937",
    borderRadius: 2,
  },
  progressBarFill: {
    width: "100%",
    height: 4,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },

  courseCard: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
  },

  premiumBadge: {
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  premiumText: { color: "#93c5fd", fontSize: 11, fontWeight: "700" },

  courseTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  courseMeta: { color: "#9ca3af", marginVertical: 6 },

  sectionLabel: {
    color: "#60a5fa",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 8,
  },

  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  featureText: { color: "#e5e7eb", fontSize: 13 },

  formSection: { paddingHorizontal: 16, marginTop: 20 },
  formTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 12 },

  inputLabel: { color: "#9ca3af", fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 14,
    padding: 14,
    color: "#fff",
    marginBottom: 14,
  },

  confirmBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  row: { flexDirection: "row" },

  uploadBox: {
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  uploadText: { color: "#fff", fontWeight: "700", marginTop: 8 },
  uploadSub: { color: "#9ca3af", fontSize: 12, marginTop: 4 },

  trustText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 40,
    fontSize: 12,
  },
});
