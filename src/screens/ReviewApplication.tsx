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
  Pencil,
  Calendar,
  User,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

/* =========================
   MAIN SCREEN
========================= */
const ReviewApplication = () => {
   const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <ChevronLeft size={22} color="#fff" />
          <Text style={styles.headerTitle}>Review Application</Text>
          <TouchableOpacity>
            <Text style={styles.editAll}>Edit All</Text>
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
            <Text style={styles.name}>Alex Johnson</Text>
            <Text style={styles.appId}>#INT-2024-8832</Text>

            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Draft Status</Text>
            </View>
          </View>
        </View>

        {/* BASIC INFO */}
        <Section title="Basic Info">
          <InfoRow
            icon={<Calendar size={18} color="#3b82f6" />}
            label="DATE OF BIRTH"
            value="January 15, 2001"
          />

          <InfoRow
            icon={<User size={18} color="#3b82f6" />}
            label="GENDER"
            value="Non-binary"
          />
        </Section>

        {/* EDUCATION */}
        <Section title="Educational Qualifications">
          <InfoRow
            icon={<GraduationCap size={18} color="#3b82f6" />}
            label="DEGREE"
            value="B.Sc. Computer Science"
            subValue="Stanford University, 2024"
          />
        </Section>

        {/* SKILLS */}
        <Section title="Skills">
          <View style={styles.skillWrap}>
            {["Python", "UI Design", "React", "Figma", "Project Mgmt"].map(
              (skill) => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              )
            )}
          </View>
        </Section>

        {/* CONTACT INFO */}
        <Section title="Contact Information">
          <InfoRow
            icon={<Mail size={18} color="#3b82f6" />}
            label="EMAIL"
            value="alex.johnson@edu-mail.com"
          />

          <InfoRow
            icon={<Phone size={18} color="#3b82f6" />}
            label="PHONE"
            value="+1 (555) 012-3456"
          />
        </Section>

        {/* DECLARATION */}
        <View style={styles.declaration}>
          <View style={styles.checkbox} />
          <Text style={styles.declarationText}>
            I hereby certify that the information provided is accurate and true
            to the best of my knowledge. I understand that any false statement
            may disqualify me from this internship.
          </Text>
        </View>

        {/* SUBMIT BUTTON */}
       <TouchableOpacity
  style={styles.submitBtn}
  onPress={() => navigation.navigate("ApplicationSuccess" as never)}
>
  <Text style={styles.submitText}>Submit Application ➜</Text>
</TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewApplication;

/* =========================
   REUSABLE COMPONENTS
========================= */

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pencil size={16} color="#3b82f6" />
    </View>
    {children}
  </View>
);

const InfoRow = ({ icon, label, value, subValue }: any) => (
  <View style={styles.infoRow}>
    <View style={styles.iconBox}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      {subValue && <Text style={styles.infoSub}>{subValue}</Text>}
    </View>
  </View>
);

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1220",
  },

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
  editAll: {
    color: "#3b82f6",
    fontWeight: "600",
  },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "#121a2f",
    margin: 16,
    padding: 16,
    borderRadius: 18,
    gap: 14,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  appId: {
    color: "#60a5fa",
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: "#0f2a4d",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
  },
  statusText: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "600",
  },

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
    color: "#e5e7eb",
    fontWeight: "700",
    fontSize: 15,
  },

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
    backgroundColor: "#0f2a4d",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    color: "#6b7280",
    fontSize: 12,
  },
  infoValue: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 2,
  },
  infoSub: {
    color: "#9ca3af",
    marginTop: 2,
  },

  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillChip: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  skillText: {
    color: "#e5e7eb",
    fontWeight: "500",
  },

  declaration: {
    flexDirection: "row",
    gap: 10,
    margin: 16,
    backgroundColor: "#121a2f",
    padding: 14,
    borderRadius: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#3b82f6",
    marginTop: 4,
  },
  declarationText: {
    color: "#9ca3af",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },

  submitBtn: {
    backgroundColor: "#2563eb",
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
