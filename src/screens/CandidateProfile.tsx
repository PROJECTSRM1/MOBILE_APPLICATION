import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import {
  ChevronLeft,
  Share2,
  FileText,
  Edit3,
  Download,
  UploadCloud,
  Fingerprint,
  BadgeCheck,
  Phone,
} from "lucide-react-native";

import {
  useNavigation,
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import DocumentPicker from "react-native-document-picker";

/* =========================
   TYPES
========================= */

type Student = {
  id: number;
  name: string;
  avatar: string;
};

type RootStackParamList = {
  CandidateProfile: {
    student: Student;
  };
};

/* =========================
   MAIN SCREEN
========================= */

const CandidateProfile = () => {
  const handleUploadResume = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [
        DocumentPicker.types.pdf,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
      ],
    });

    console.log("Selected resume:", res);
    // res.uri  -> file path
    // res.name -> file name
  } catch (err: any) {
    if (DocumentPicker.isCancel(err)) {
      console.log("User cancelled upload");
    } else {
      console.log("Upload error:", err);
    }
  }
};

  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<RootStackParamList, "CandidateProfile">>();
  const { student } = route.params;

  const { colors } = useTheme();
  const styles = getStyles(colors);

  /* ===== EDIT MODE ===== */
  const [editMode, setEditMode] = useState(false);

  /* ===== PROFILE ===== */
  const [name, setName] = useState(student.name);

  /* ===== IDENTITY ===== */
  const [aadhar, setAadhar] = useState("XXXX-XXXX-1234");
  const [pan, setPan] = useState("ABCDE1234F");

  /* ===== EDUCATION ===== */
  const [mcaScore, setMcaScore] = useState("88.5%");
  const [bscScore, setBscScore] = useState("9.2 CGPA");

  /* ===== FAMILY ===== */
  const [fatherName, setFatherName] = useState("Rajesh Sharma");
  const [fatherPhone, setFatherPhone] = useState("+91 98765 43210");
  const [motherName, setMotherName] = useState("Sunita Sharma");
  const [motherPhone, setMotherPhone] = useState("+91 98765 01234");

  /* ===== VERIFICATION ===== */
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const loadStatus = async () => {
      const stored = await AsyncStorage.getItem("userProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsVerified(!!parsed?.isVerified);
      }
    };
    loadStatus();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Candidate Profile</Text>
          <Share2 size={20} color={colors.text} />
        </View>

        {/* PROFILE */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: student.avatar }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>

          {editMode ? (
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.editInput}
            />
          ) : (
            <Text style={styles.name}>{name}</Text>
          )}

          <View style={styles.idRow}>
            <Text style={styles.candidateId}>#{student.id}</Text>
            <FileText size={14} color={colors.primary} />
          </View>

          <Text style={styles.subText}>Enrolled – Batch 2024</Text>
        </View>

        {/* PERSONAL IDENTITY */}
        <Section title="Personal Identity">
          <EditableRow
            label="Aadhar Card"
            value={aadhar}
            setValue={setAadhar}
            editMode={editMode}
          />
          <EditableRow
            label="PAN Card"
            value={pan}
            setValue={setPan}
            editMode={editMode}
          />

          <View style={styles.nocCard}>
            <View>
              <Text style={styles.cardTitle}>NOC Status</Text>
              <Text style={styles.cardSub}>Clearance from Department</Text>
            </View>

            <View
              style={[
                styles.approvedPill,
                {
                  backgroundColor: isVerified
                    ? "#22c55e20"
                    : "#ef444420",
                },
              ]}
            >
              <BadgeCheck
                size={14}
                color={isVerified ? "#22c55e" : "#ef4444"}
              />
              <Text
                style={[
                  styles.approvedText,
                  {
                    color: isVerified ? "#22c55e" : "#ef4444",
                  },
                ]}
              >
                {isVerified ? "VERIFIED" : "NOT VERIFIED"}
              </Text>
            </View>
          </View>
        </Section>

        {/* ACTION BUTTONS */}
       {/* ACTION BUTTONS */}
<View style={styles.actionRow}>
  {/* DOWNLOAD RESUME */}
  <TouchableOpacity style={styles.secondaryBtn}>
    <Download size={16} color={colors.text} />
    <Text style={styles.secondaryText}>Download Resume</Text>
  </TouchableOpacity>

  {/* UPLOAD RESUME */}
  <TouchableOpacity style={styles.secondaryBtn}>
    <UploadCloud size={16} color={colors.text} />
    <Text style={styles.secondaryText}>Upload Resume</Text>
  </TouchableOpacity>

  {/* EDIT PROFILE */}
  <TouchableOpacity
    style={styles.primaryBtn}
    onPress={() => setEditMode(!editMode)}
  >
    <Edit3 size={16} color="#fff" />
    <Text style={styles.primaryText}>
      {editMode ? "Save Profile" : "Edit Profile"}
    </Text>
  </TouchableOpacity>
</View>


        {/* EDUCATION */}
        <EducationCard
          degree="Master of Computer Applications"
          institute="IIT Delhi"
          score={mcaScore}
          setScore={setMcaScore}
          year="2023"
          editMode={editMode}
        />

        <EducationCard
          degree="Bachelor of Science (IT)"
          institute="Delhi University"
          score={bscScore}
          setScore={setBscScore}
          year="2021"
          editMode={editMode}
        />

        {/* FAMILY */}
        <Section title="Family Details">
          <FamilyEditable
            label="Father's Information"
            name={fatherName}
            setName={setFatherName}
            phone={fatherPhone}
            setPhone={setFatherPhone}
            editMode={editMode}
          />

          <FamilyEditable
            label="Mother's Information"
            name={motherName}
            setName={setMotherName}
            phone={motherPhone}
            setPhone={setMotherPhone}
            editMode={editMode}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CandidateProfile;

/* =========================
   REUSABLE COMPONENTS
========================= */

const Section = ({ title, children }: any) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const EditableRow = ({ label, value, setValue, editMode }: any) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.identityCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{label}</Text>
        {editMode ? (
          <TextInput
            value={value}
            onChangeText={setValue}
            style={styles.editInput}
          />
        ) : (
          <Text style={styles.cardSub}>{value}</Text>
        )}
      </View>
      <Fingerprint size={20} color={colors.subText} />
    </View>
  );
};

const EducationCard = ({
  degree,
  institute,
  score,
  setScore,
  year,
  editMode,
}: any) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.eduCard}>
      <Text style={styles.eduTitle}>{degree}</Text>
      <Text style={styles.eduSub}>{institute}</Text>

      <View style={styles.eduRow}>
        <View>
          <Text style={styles.eduMeta}>Score</Text>
          {editMode ? (
            <TextInput
              value={score}
              onChangeText={setScore}
              style={styles.editInput}
            />
          ) : (
            <Text style={styles.eduValue}>{score}</Text>
          )}
        </View>

        <View>
          <Text style={styles.eduMeta}>Passing Year</Text>
          <Text style={styles.eduValue}>{year}</Text>
        </View>
      </View>
    </View>
  );
};

const FamilyEditable = ({
  label,
  name,
  setName,
  phone,
  setPhone,
  editMode,
}: any) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.familyCard}>
      <Text style={styles.familyLabel}>{label}</Text>

      {editMode ? (
        <>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.editInput}
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.editInput}
          />
        </>
      ) : (
        <>
          <Text style={styles.familyName}>{name}</Text>
          <View style={styles.phoneRow}>
            <Phone size={14} color={colors.primary} />
            <Text style={styles.phoneText}>{phone}</Text>
          </View>
        </>
      )}
    </View>
  );
};

/* =========================
   STYLES
========================= */

const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      alignItems: "center",
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
    profileSection: { alignItems: "center", marginVertical: 16 },
    avatarWrapper: { position: "relative", marginBottom: 10 },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    onlineDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: "#22c55e",
      position: "absolute",
      bottom: 4,
      right: 4,
      borderWidth: 2,
      borderColor: colors.background,
    },
    name: { color: colors.text, fontSize: 18, fontWeight: "700" },
    editInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 8,
      color: colors.text,
      marginTop: 6,
    },
    idRow: { flexDirection: "row", gap: 6, marginTop: 4 },
    candidateId: { color: colors.primary, fontWeight: "600" },
    subText: { color: colors.subText, marginTop: 4 },
    section: { paddingHorizontal: 16, marginTop: 22 },
    sectionTitle: { color: colors.text, fontWeight: "700", marginBottom: 12 },
    identityCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: { color: colors.text, fontWeight: "600" },
    cardSub: { color: colors.subText, marginTop: 4 },
    nocCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    approvedPill: {
      flexDirection: "row",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      alignItems: "center",
    },
    approvedText: { fontSize: 12, fontWeight: "700" },
    actionRow: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      marginTop: 20,
    },
    secondaryBtn: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 14,
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      alignItems: "center",
    },
    secondaryText: { color: colors.text, fontWeight: "600" },
    primaryText: { color: "#fff", fontWeight: "700" },
    eduCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    eduTitle: { color: colors.text, fontWeight: "700" },
    eduSub: { color: colors.subText, marginTop: 4 },
    eduRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    eduMeta: { color: colors.subText, fontSize: 12 },
    eduValue: { color: colors.primary, fontWeight: "700", marginTop: 2 },
    familyCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    familyLabel: { color: colors.primary, fontSize: 12, fontWeight: "600" },
    familyName: { color: colors.text, fontWeight: "700", marginTop: 4 },
    phoneRow: {
      flexDirection: "row",
      gap: 6,
      marginTop: 6,
      alignItems: "center",
    },
    phoneText: { color: colors.primary, fontWeight: "600" },
  });
