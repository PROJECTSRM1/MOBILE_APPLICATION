import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

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
  };
}

/* ---------------- DUMMY DATA ---------------- */

const studentData: StudentData = {
  name: "Rahul Sharma",
  fatherName: "Mr. Suresh Sharma",
  academicYear: "2023–2024",
  background: "Science Stream (CBSE)",

  documents: {
    aadhaar: "**** **** 8920",
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
      date: "12 Sep 2023",
      status: "PAID",
    },
    {
      title: "2nd Installment",
      amount: "₹45,000",
      date: "05 Jan 2024",
      status: "OVERDUE",
    },
    {
      title: "3rd Installment",
      amount: "₹45,000",
      date: "20 May 2024",
      status: "UPCOMING",
    },
  ],

  scholarship: {
    eligible: true,
    amount: "₹25,000",
  },
};

/* ---------------- COMPONENT ---------------- */

const StudentOverviewScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const route = useRoute<any>();
const { student } = route.params;


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Student Info */}
      <View style={styles.card}>
        <Text style={styles.name}>{student.name}</Text>
<Text style={styles.subText}>Student ID: {student.studentId}</Text>
<Text style={styles.subText}>Academic Year: {student.year}</Text>

        <Text style={styles.subText}>{studentData.background}</Text>
      </View>

      {/* Identity Documents */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Identity Documents</Text>
        <Text style={styles.item}>Aadhaar: {studentData.documents.aadhaar}</Text>
        <Text style={styles.item}>PAN: {studentData.documents.pan}</Text>
        <Text style={styles.item}>
          Caste Certificate:{" "}
          {studentData.documents.casteCertificate ? "Available" : "Not Uploaded"}
        </Text>
      </View>

      {/* Academic Records */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Marks Memo</Text>
        <Text style={styles.item}>10th: {studentData.marks.tenth}</Text>
        <Text style={styles.item}>Intermediate: {studentData.marks.inter}</Text>
        <Text style={styles.item}>
          Degree / B.Tech: {studentData.marks.degree}
        </Text>
      </View>

      {/* Fee Installments */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Fee Installments</Text>

        {studentData.installments.map((item, index) => (
          <View key={index} style={styles.installmentRow}>
            <View>
              <Text style={styles.item}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>

            <View style={styles.rightAlign}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === "PAID"
                    ? styles.paid
                    : item.status === "OVERDUE"
                    ? styles.overdue
                    : styles.upcoming,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Scholarship */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Scholarship</Text>
        {studentData.scholarship.eligible ? (
          <Text style={styles.item}>
            Eligible – Amount: {studentData.scholarship.amount}
          </Text>
        ) : (
          <Text style={styles.overdue}>Not Eligible</Text>
        )}
      </View>

      {/* Action */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Download Student Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StudentOverviewScreen;

/* ---------------- STYLES ---------------- */

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },

    name: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },

    subText: {
      color: colors.subText,
      marginBottom: 2,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 10,
    },

    item: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 6,
    },

    installmentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },

    date: {
      fontSize: 12,
      color: colors.subText,
    },

    rightAlign: {
      alignItems: "flex-end",
    },

    amount: {
      fontWeight: "600",
      color: colors.text,
    },

    status: {
      fontSize: 12,
      fontWeight: "600",
      marginTop: 2,
    },

    paid: {
      color: colors.success,
    },

    overdue: {
      color: colors.danger,
    },

    upcoming: {
      color: colors.primary,
    },

    button: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 30,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
  });
