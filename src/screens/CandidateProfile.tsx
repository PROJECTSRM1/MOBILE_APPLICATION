import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  ChevronLeft,
  Share2,
  FileText,
  Edit3,
  Download,
  Fingerprint,
  BadgeCheck,
  Phone,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "CandidateProfile">>();
  const { student } = route.params;

  /* ✅ VERIFICATION STATE */
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  /* ✅ LOAD VERIFICATION STATUS */
  useEffect(() => {
    const loadVerificationStatus = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("userProfile");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setIsVerified(!!parsedProfile?.isVerified);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.log("Error loading verification status", error);
        setIsVerified(false);
      }
    };
    loadVerificationStatus();
  }, []);

  /* 🔹 RANDOMIZED PARENT DATA */
  const parentProfiles = [
    {
      father: "Rajesh Sharma",
      fatherPhone: "+91 98765 43210",
      mother: "Sunita Sharma",
      motherPhone: "+91 98765 01234",
    },
    {
      father: "Suresh Reddy",
      fatherPhone: "+91 91234 56789",
      mother: "Lakshmi Reddy",
      motherPhone: "+91 99876 54321",
    },
    {
      father: "Anil Verma",
      fatherPhone: "+91 90123 45678",
      mother: "Pooja Verma",
      motherPhone: "+91 93456 78901",
    },
    {
      father: "Mahesh Rao",
      fatherPhone: "+91 88990 11223",
      mother: "Kavita Rao",
      motherPhone: "+91 77665 44332",
    },
  ];

  const parentIndex = student.id % parentProfiles.length;
  const parents = parentProfiles[parentIndex];

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

          <Text style={styles.name}>{student.name}</Text>

          <View style={styles.idRow}>
            <Text style={styles.candidateId}>#{student.id}</Text>
            <FileText size={14} color={colors.primary} />
          </View>

          <Text style={styles.subText}>Enrolled - Batch 2024</Text>
        </View>

        {/* PERSONAL IDENTITY */}
        <Section title="Personal Identity">
          <IdentityCard
            title="Aadhar Card"
            value="XXXX-XXXX-1234"
            icon={<Fingerprint size={20} color={colors.subText} />}
          />

          <IdentityCard
            title="PAN Card"
            value="ABCDE1234F"
            icon={<FileText size={20} color={colors.subText} />}
          />

          {/* ✅ DYNAMIC NOC STATUS */}
          <View style={styles.nocCard}>
            <View>
              <Text style={styles.cardTitle}>NOC Status</Text>
              <Text style={styles.cardSub}>Clearance from Department</Text>
            </View>

            <View
              style={[
                styles.approvedPill,
                { backgroundColor: isVerified ? "#22c55e20" : "#ef444420" },
              ]}
            >
              <BadgeCheck
                size={14}
                color={isVerified ? "#22c55e" : "#ef4444"}
              />
              <Text
                style={[
                  styles.approvedText,
                  { color: isVerified ? "#22c55e" : "#ef4444" },
                ]}
              >
                {isVerified ? "VERIFIED" : "NOT VERIFIED"}
              </Text>
            </View>
          </View>
        </Section>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Download size={16} color={colors.text} />
            <Text style={styles.secondaryText}>PDF Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Edit3 size={16} color="#fff" />
            <Text style={styles.primaryText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* EDUCATION */}
        <EducationCard
          degree="Master of Computer Applications"
          institute="Indian Institute of Technology, Delhi"
          score="88.5%"
          year="2023"
        />

        <EducationCard
          degree="Bachelor of Science (IT)"
          institute="Delhi University"
          score="9.2 CGPA"
          year="2021"
        />

        {/* FAMILY DETAILS */}
        <Section title="Family Details">
          <FamilyCard
            label="Father's Information"
            name={parents.father}
            phone={parents.fatherPhone}
          />

          <FamilyCard
            label="Mother's Information"
            name={parents.mother}
            phone={parents.motherPhone}
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

type SectionProps = {
  title: string;
  children: React.ReactNode;
};
const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

type IdentityCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};
const IdentityCard: React.FC<IdentityCardProps> = ({ title, value, icon }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.identityCard}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{value}</Text>
      </View>
      {icon}
    </View>
  );
};

type EducationCardProps = {
  degree: string;
  institute: string;
  score: string;
  year: string;
};
const EducationCard: React.FC<EducationCardProps> = ({
  degree,
  institute,
  score,
  year,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.eduCard}>
      <Text style={styles.eduTitle}>{degree}</Text>
      <Text style={styles.eduSub}>{institute}</Text>

      <View style={styles.eduRow}>
        <View>
          <Text style={styles.eduMeta}>Score</Text>
          <Text style={styles.eduValue}>{score}</Text>
        </View>

        <View>
          <Text style={styles.eduMeta}>Passing Year</Text>
          <Text style={styles.eduValue}>{year}</Text>
        </View>
      </View>
    </View>
  );
};

type FamilyCardProps = {
  label: string;
  name: string;
  phone: string;
};
const FamilyCard: React.FC<FamilyCardProps> = ({ label, name, phone }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.familyCard}>
      <Text style={styles.familyLabel}>{label}</Text>
      <Text style={styles.familyName}>{name}</Text>

      <View style={styles.phoneRow}>
        <Phone size={14} color={colors.primary} />
        <Text style={styles.phoneText}>{phone}</Text>
      </View>
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

    primaryText: { color: "#ffffff", fontWeight: "700" },

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
