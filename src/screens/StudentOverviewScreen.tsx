// import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/* ---------------- TYPES ---------------- */

type InstallmentStatus = "PAID" | "OVERDUE" | "UPCOMING";

interface Installment {
  title: string;
  amount: string;
  date: string;
  status: InstallmentStatus;
}

interface StudentData {
  name: string;
  fatherName: string;
  academicYear: string;
  background: string;
  admissionDate: string;
  documents: {
    aadhaar: string;
    pan: string;
    casteCertificate: boolean;
  };
  marks: {
    tenth: string;
    inter: string;
    degree: string;
  };
  installments: Installment[];
  scholarship: {
    eligible: boolean;
    amount?: string;
    disbursedDate?: string;
  };
  academicProgress: {
    currentSGPA: string;
    attendance: string;
    backlogs: number;
  };
}

/* ---------------- DUMMY DATA ---------------- */

const studentData: StudentData = {
  name: "Rahul Sharma",
  fatherName: "Mr. Suresh Sharma",
  academicYear: "2023–2024",
  background: "Science Stream, CBSE",
  admissionDate: "15 Aug 2021",

  documents: {
    aadhaar: "**** 8920",
    pan: "ABCP****3D",
    casteCertificate: false,
  },

  marks: {
    tenth: "89.4%",
    inter: "87.2%",
    degree: "SGPA 8.92",
  },

  installments: [
    {
      title: "1st Installment",
      amount: "₹45,000",
      date: "Paid on 12 Sep",
      status: "PAID",
    },
    {
      title: "2nd Installment",
      amount: "₹45,000",
      date: "Overdue (Due 05 Jan)",
      status: "OVERDUE",
    },
    {
      title: "3rd Installment",
      amount: "₹45,000",
      date: "Due 20 May 2024",
      status: "UPCOMING",
    },
  ],

  scholarship: {
    eligible: true,
    amount: "₹25,000.00",
    disbursedDate: "10 Oct 2023",
  },

  academicProgress: {
    currentSGPA: "8.92",
    attendance: "92%",
    backlogs: 0,
  },
};

/* ---------------- COMPONENT ---------------- */

const StudentOverviewScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { student } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Details</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="more-vert" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{student.name}</Text>
              <Text style={styles.profileCourse}>
                B.Tech Computer Science | Year 3
              </Text>
              <Text style={styles.profileId}>{student.studentId}</Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Father's Name</Text>
              <Text style={styles.detailValue}>{studentData.fatherName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Background</Text>
              <Text style={styles.detailValue}>{studentData.background}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission Date</Text>
              <Text style={styles.detailValue}>{studentData.admissionDate}</Text>
            </View>
          </View>
        </View>

        {/* Identity Documents */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Identity Documents</Text>

          <View style={styles.documentItem}>
            <View style={styles.documentLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#E3F2FD" }]}>
                <MaterialCommunityIcons name="card-account-details" size={20} color="#2196F3" />
              </View>
              <Text style={styles.documentText}>Aadhaar: {studentData.documents.aadhaar}</Text>
            </View>
            <MaterialIcons name="verified" size={20} color="#4CAF50" />
          </View>

          <View style={styles.documentItem}>
            <View style={styles.documentLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#E3F2FD" }]}>
                <MaterialCommunityIcons name="credit-card" size={20} color="#2196F3" />
              </View>
              <Text style={styles.documentText}>PAN: {studentData.documents.pan}</Text>
            </View>
            <MaterialIcons name="verified" size={20} color="#4CAF50" />
          </View>
        </View>

        {/* Scholarship */}
        {studentData.scholarship.eligible && (
          <View style={styles.scholarshipCard}>
            <View style={styles.scholarshipHeader}>
              <Text style={styles.scholarshipTitle}>MERIT SCHOLARSHIP</Text>
              <MaterialIcons name="stars" size={24} color="#2196F3" />
            </View>
            <Text style={styles.scholarshipAmount}>
              ₹ {studentData.scholarship.amount}
            </Text>
            <Text style={styles.scholarshipDate}>
              Disbursed on {studentData.scholarship.disbursedDate}
            </Text>
          </View>
        )}

        {/* Fee Installments */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Fee Installments</Text>

          {studentData.installments.map((item, index) => (
            <View key={index} style={styles.installmentItem}>
              <View style={styles.installmentLeft}>
                <View
                  style={[
                    styles.installmentIcon,
                    item.status === "PAID"
                      ? styles.paidBg
                      : item.status === "OVERDUE"
                      ? styles.overdueBg
                      : styles.upcomingBg,
                  ]}
                >
                  <MaterialIcons
                    name={
                      item.status === "PAID"
                        ? "check-circle"
                        : item.status === "OVERDUE"
                        ? "warning"
                        : "schedule"
                    }
                    size={24}
                    color={
                      item.status === "PAID"
                        ? "#4CAF50"
                        : item.status === "OVERDUE"
                        ? "#F44336"
                        : "#9E9E9E"
                    }
                  />
                </View>
                <View>
                  <Text style={styles.installmentTitle}>{item.title}</Text>
                  <Text
                    style={[
                      styles.installmentDate,
                      item.status === "OVERDUE" && styles.overdueText,
                    ]}
                  >
                    {item.date}
                  </Text>
                </View>
              </View>
              <Text style={styles.installmentAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Academic Progress */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Academic Progress</Text>

          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Sem 1</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Sem 2</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Sem 3</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Sem 4</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current SGPA</Text>
              <Text style={styles.statValue}>{studentData.academicProgress.currentSGPA}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Attendance</Text>
              <Text style={styles.statValue}>{studentData.academicProgress.attendance}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Backlogs</Text>
              <Text style={styles.statValue}>{studentData.academicProgress.backlogs}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton}>
          <MaterialIcons name="download" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Download Transcript</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <MaterialIcons name="email" size={20} color="#2196F3" />
          <Text style={styles.secondaryButtonText}>Contact Administrator</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default StudentOverviewScreen;

/* ---------------- STYLES ---------------- */

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    backButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },

    menuButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    scrollView: {
      flex: 1,
    },

    profileCard: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },

    profileInfo: {
      flex: 1,
    },

    profileName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },

    profileCourse: {
      fontSize: 14,
      color: colors.subText,
      marginBottom: 4,
    },

    profileId: {
      fontSize: 14,
      fontWeight: "600",
      color: "#2196F3",
    },

    profileDetails: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
    },

    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    detailLabel: {
      fontSize: 14,
      color: colors.subText,
    },

    detailValue: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },

    sectionCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },

    documentItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 8,
    },

    documentLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    documentText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },

    scholarshipCard: {
      backgroundColor: "#E3F2FD",
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: "#90CAF9",
    },

    scholarshipHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },

    scholarshipTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: "#2196F3",
      letterSpacing: 0.5,
    },

    scholarshipAmount: {
      fontSize: 28,
      fontWeight: "700",
      color: "#2196F3",
      marginBottom: 4,
    },

    scholarshipDate: {
      fontSize: 13,
      color: "#1976D2",
    },

    installmentItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    installmentLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    installmentIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    paidBg: {
      backgroundColor: "#E8F5E9",
    },

    overdueBg: {
      backgroundColor: "#FFEBEE",
    },

    upcomingBg: {
      backgroundColor: "#F5F5F5",
    },

    installmentTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },

    installmentDate: {
      fontSize: 13,
      color: colors.subText,
    },

    overdueText: {
      color: "#F44336",
      fontWeight: "500",
    },

    installmentAmount: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    progressGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },

    progressItem: {
      alignItems: "center",
      paddingVertical: 8,
    },

    progressLabel: {
      fontSize: 13,
      color: colors.subText,
    },

    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    statItem: {
      alignItems: "center",
    },

    statLabel: {
      fontSize: 13,
      color: colors.subText,
      marginBottom: 4,
    },

    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#2196F3",
    },

    primaryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#2196F3",
      marginHorizontal: 16,
      marginBottom: 12,
      paddingVertical: 14,
      borderRadius: 10,
      gap: 8,
    },

    primaryButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#fff",
    },

    secondaryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#2196F3",
      gap: 8,
    },

    secondaryButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#2196F3",
    },
  });