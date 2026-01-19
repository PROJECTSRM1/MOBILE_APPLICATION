import React from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";

/* =========================
   MAIN SCREEN
========================= */
const CandidateProfile = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { student } = route.params;

  /* 🔹 RANDOMIZED PARENT DATA (BASED ON STUDENT ID) */
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
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Candidate Profile</Text>
          <Share2 size={20} color="#fff" />
        </View>

        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: student.avatar }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>

          <Text style={styles.name}>{student.name}</Text>

          <View style={styles.idRow}>
            <Text style={styles.candidateId}>#{student.id}</Text>
            <FileText size={14} color="#60a5fa" />
          </View>

          <Text style={styles.subText}>Enrolled - Batch 2024</Text>
        </View>

        {/* PERSONAL IDENTITY */}
        <Section title="Personal Identity">
          <IdentityCard
            title="Aadhar Card"
            value="XXXX-XXXX-1234"
            icon={<Fingerprint size={20} color="#9ca3af" />}
          />

          <IdentityCard
            title="PAN Card"
            value="ABCDE1234F"
            icon={<FileText size={20} color="#9ca3af" />}
          />

          <View style={styles.nocCard}>
            <View>
              <Text style={styles.cardTitle}>NOC Status</Text>
              <Text style={styles.cardSub}>Clearance from Department</Text>
            </View>

            <View style={styles.approvedPill}>
              <BadgeCheck size={14} color="#22c55e" />
              <Text style={styles.approvedText}>APPROVED</Text>
            </View>
          </View>
        </Section>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Download size={16} color="#fff" />
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

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const IdentityCard = ({ title, value, icon }: any) => (
  <View style={styles.identityCard}>
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{value}</Text>

      {/* <TouchableOpacity style={styles.viewBtn}>
        <Text style={styles.viewText}>View Document</Text>
      </TouchableOpacity> */}
    </View>

    {icon}
  </View>
);

const EducationCard = ({ degree, institute, score, year }: any) => (
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

const FamilyCard = ({ label, name, phone }: any) => (
  <View style={styles.familyCard}>
    <Text style={styles.familyLabel}>{label}</Text>
    <Text style={styles.familyName}>{name}</Text>

    <View style={styles.phoneRow}>
      <Phone size={14} color="#60a5fa" />
      <Text style={styles.phoneText}>{phone}</Text>
    </View>
  </View>
);

/* =========================
   STYLES
========================= */


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0b1220" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  profileSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#2563eb",
  },
  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22c55e",
    position: "absolute",
    bottom: 4,
    right: 4,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  idRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    alignItems: "center",
  },
  candidateId: {
    color: "#60a5fa",
    fontWeight: "600",
  },

  subText: {
    color: "#9ca3af",
    marginTop: 4,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  sectionTitle: {
    color: "#e5e7eb",
    fontWeight: "700",
    marginBottom: 12,
  },

  identityCard: {
    backgroundColor: "#1b2538",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "600",
  },
  cardSub: {
    color: "#9ca3af",
    marginTop: 4,
  },

  viewBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  viewText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  nocCard: {
    backgroundColor: "#1b2538",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  approvedPill: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#0f2f24",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  approvedText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "700",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 20,
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },

  secondaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },

  eduCard: {
    backgroundColor: "#1b2538",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },

  eduTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  eduSub: {
    color: "#9ca3af",
    marginTop: 4,
  },

  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  eduMeta: {
    color: "#6b7280",
    fontSize: 12,
  },
  eduValue: {
    color: "#60a5fa",
    fontWeight: "700",
    marginTop: 2,
  },

  familyCard: {
    backgroundColor: "#1b2538",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  familyLabel: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "600",
  },
  familyName: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 4,
  },

  phoneRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    alignItems: "center",
  },
  phoneText: {
    color: "#60a5fa",
    fontWeight: "600",
  },
});

