
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

/* ================= TYPES ================= */

type Job = {
  id: string;
  title: string;
  price: number;
  customer: string;
  location: string;
  time: string;
};

/* ================= CONSTANTS ================= */

const JOB_STAGES = [
  "On the way",
  "Reached location",
  "Job Started",
  "Job Completed",
];

/* ================= COMPONENT ================= */

const FDOverview = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  /* -------- STATE -------- */

  const [menuOpen, setMenuOpen] = useState(false);

  const [pendingJobs, setPendingJobs] = useState<Job[]>(
    route.params?.approvalPending || []
  );

  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [stage3Images, setStage3Images] = useState<string[]>([]);
const [stage4Images, setStage4Images] = useState<string[]>([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [jobImages, setJobImages] = useState<string[]>([]);

  /* ================= LOGIC ================= */

//   const handleNextStage = () => {
//     // OTP before Job Started
//     if (currentStep === 2) {
//       setShowOtpModal(true);
//       return;
//     }

//     // Image required before Job Completed
//     if (currentStep === 3 && jobImages.length === 0) {
//       Alert.alert(
//         "Image Required",
//         "Please upload job images before completing the job."
//       );
//       return;
//     }

//     // Complete job
//     if (currentStep === 3 && activeJob) {
//       setCompletedJobs(prev => [...prev, activeJob]);
//       setActiveJob(null);
//       setCurrentStep(1);
//       setJobImages([]);
//       return;
//     }

//     setCurrentStep(prev => prev + 1);
//   };

//   const verifyOtp = () => {
//     if (otpInput === "3333") {
//       setShowOtpModal(false);
//       setOtpInput("");
//       setCurrentStep(3);
//     } else {
//       Alert.alert("Invalid OTP");
//     }
//   };

const handleNextStage = () => {
  // Stage 3 requires image
  if (currentStep === 3 && stage3Images.length === 0) {
    Alert.alert(
      "Image Required",
      "Please upload job started proof images."
    );
    return;
  }

  // Stage 4 requires image
  if (currentStep === 4 && stage4Images.length === 0) {
    Alert.alert(
      "Image Required",
      "Please upload job completion proof images."
    );
    return;
  }

  if (currentStep < 4) {
    setCurrentStep(prev => prev + 1);
  }
};
  const verifyOtp = () => {
    if (otpInput === "3333") {
      setShowOtpModal(false);
      setOtpInput("");
      setCurrentStep(3);
    } else {
      Alert.alert("Invalid OTP");
    }
  };
  /* ================= UI ================= */

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* ================= HEADER ================= */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.logo}>SWACHIFY INDIA</Text>
          <Text style={styles.subLogo}>Freelancer Portal</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("FreelancerDashboard")}
        >
          <Text style={styles.backText}>← Back to Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <View style={styles.profileCircle}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.profileIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <View style={styles.menuBox}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= DASHBOARD ================= */}
      <Text style={styles.heading}>Dashboard Overview</Text>
      <Text style={styles.subheading}>
        Track your performance at a glance
      </Text>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.blueBorder]}>
          <Text style={styles.cardTitle}>Total Earnings</Text>
          <Text style={styles.cardValue}>₹0</Text>
          <Text style={styles.cardDesc}>From 0 completed jobs</Text>
        </View>

        <View style={[styles.card, styles.yellowBorder]}>
          <Text style={styles.cardTitle}>Approval Pending</Text>
          <Text style={styles.cardValue}>{pendingJobs.length}</Text>
          <Text style={styles.cardDesc}>
            Jobs waiting for admin review
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.blueBorder]}>
          <Text style={styles.cardTitle}>Available Jobs</Text>
          <Text style={styles.cardValue}>20</Text>
          <Text style={styles.cardDesc}>
            Start from Available Requests below
          </Text>
        </View>

        <View style={[styles.card, styles.blueBorder]}>
          <Text style={styles.cardTitle}>Client Rating</Text>
          <Text style={styles.ratingValue}>⭐ 4.8</Text>
          <Text style={styles.cardDesc}>
            Based on recent jobs
          </Text>
        </View>
      </View>

      {/* ================= SKILLS ================= */}
      <Text style={styles.sectionTitle}>My Skills</Text>
      <View style={styles.skillsRow}>
        <Text style={styles.skill}>Cleaning</Text>
        <Text style={styles.skill}>Home Services</Text>
        <Text style={styles.skill}>Plumbing</Text>
        <Text style={styles.skill}>Electrical</Text>
      </View>

      {/* ================= APPROVAL PENDING ================= */}
      <Text style={styles.sectionTitle}>Approval Pending</Text>

      {pendingJobs.length === 0 ? (
        <Text style={styles.empty}>
          No jobs are waiting for approval.
        </Text>
      ) : (
        pendingJobs.map(job => (
          <View key={job.id} style={styles.pendingCard}>
            <View style={styles.pendingRow}>
              <Text style={styles.pendingTitle}>{job.title}</Text>
              <Text style={styles.pendingPrice}>₹{job.price}</Text>
            </View>

            <Text style={styles.pendingStatus}>
              Waiting for admin approval
            </Text>
            <Text style={styles.pendingMeta}>
              Customer: {job.customer}
            </Text>
            <Text style={styles.pendingMeta}>📍 {job.location}</Text>
            <Text style={styles.pendingMeta}>⏱ {job.time}</Text>

            <TouchableOpacity
              style={styles.pendingButton}
              onPress={() => {
                setActiveJob(job);
                setPendingJobs(prev =>
                  prev.filter(p => p.id !== job.id)
                );
              }}
            >
              <Text style={styles.pendingBtnText}>
                Mark Approved
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* ================= ACTIVE JOB ================= */}
      <Text style={styles.sectionTitle}>My Active Job</Text>

      {activeJob ? (
        <View style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <View>
              <Text style={styles.activeTitle}>
                {activeJob.title}
              </Text>
              <Text style={styles.pendingMeta}>
                Ticket ID: {activeJob.id}
              </Text>
            </View>

            <View>
              <Text style={styles.payoutLabel}>Payout</Text>
              <Text style={styles.payoutAmount}>
                ₹{activeJob.price}
              </Text>
            </View>
          </View>

          <Text style={styles.pendingMeta}>📍 {activeJob.location}</Text>
          <Text style={styles.pendingMeta}>⏱ {activeJob.time}</Text>
          {/* LIVE JOB STATUS */}
<View style={styles.liveStatusCard}>
  <Text style={styles.liveTitle}>Live job status</Text>

  {[
    {
      title: "On the way",
      desc: "You are travelling to the customer location.",
    },
    {
      title: "Reached location",
      desc: "You have reached the customer address.",
    },
    {
      title: "Job Started",
      desc: "Mandatory multiple image proof required.",
    },
    {
      title: "Job Completed",
      desc:
        "Mandatory multiple image proof required to confirm completion.",
    },
  ].map((item, index) => (
    <View key={index} style={styles.statusRow}>
      <Text
        style={[
          styles.statusTitle,
          index + 1 <= currentStep && styles.statusActive,
        ]}
      >
        {index + 1}. {item.title}
      </Text>
      <Text style={styles.statusDesc}>{item.desc}</Text>
    </View>
  ))}
</View>

{(currentStep === 3 || currentStep === 4) && (
  <View>
    <TouchableOpacity
      style={styles.uploadBtn}
      onPress={() => {
        if (currentStep === 3) {
          setStage3Images(prev => [...prev, "img"]);
        } else {
          setStage4Images(prev => [...prev, "img"]);
        }
      }}
    >
      <Text style={styles.uploadBtnText}>
        Capture / Upload proof
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.completeBtn,
        currentStep === 4 &&
          stage4Images.length === 0 && {
            backgroundColor: "#9CA3AF",
          },
      ]}
      disabled={currentStep === 4 && stage4Images.length === 0}
      onPress={() => {
        // your existing complete job logic
      }}
    >
      <Text style={styles.completeBtnText}>Complete job</Text>
    </TouchableOpacity>
  </View>
)}


        </View>
      ) : (
        <Text style={styles.empty}>
          No jobs in progress yet.
        </Text>
      )}

      {/* ================= RECENTLY COMPLETED ================= */}
      <Text style={styles.sectionTitle}>Recently Completed</Text>

      {completedJobs.length === 0 ? (
        <Text style={styles.empty}>
          You haven't completed any jobs yet.
        </Text>
      ) : (
        completedJobs.map(job => (
          <View key={job.id} style={styles.pendingCard}>
            <Text style={styles.pendingTitle}>{job.title}</Text>
            <Text style={styles.pendingMeta}>₹{job.price}</Text>
          </View>
        ))
      )}

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <View style={styles.otpOverlay}>
          <View style={styles.otpBox}>
            <Text style={{ fontWeight: "700", marginBottom: 10 }}>
              Verify OTP
            </Text>

            <TextInput
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otpInput}
              onChangeText={setOtpInput}
              style={styles.otpInput}
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={verifyOtp}
            >
              <Text style={styles.primaryBtnText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default FDOverview;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  logo: { fontSize: 20, fontWeight: "800", color: "#2563EB" },
  subLogo: { fontSize: 12, color: "#6B7280" },

  backBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  backText: { fontWeight: "600", color: "#374151" },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: { width: 32, height: 32 },

  menuBox: {
    position: "absolute",
    right: 10,
    top: 70,
    width: 120,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 8,
  },

  menuItem: { padding: 12 },
  menuText: { fontWeight: "700", color: "#EF4444" },

  heading: { fontSize: 22, fontWeight: "800" },
  subheading: { color: "#6B7280", marginBottom: 15 },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
  },

  blueBorder: { borderLeftWidth: 4, borderLeftColor: "#3B82F6" },
  yellowBorder: { borderLeftWidth: 4, borderLeftColor: "#FACC15" },

  cardTitle: { fontWeight: "700" },
  cardValue: { fontSize: 22, fontWeight: "800" },
  ratingValue: { fontSize: 22, fontWeight: "800", color: "#F59E0B" },
  cardDesc: { fontSize: 12, color: "#6B7280" },

  sectionTitle: { marginTop: 20, fontWeight: "700", fontSize: 16 },

  skillsRow: { flexDirection: "row", flexWrap: "wrap" },
  skill: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  empty: { color: "#9CA3AF", textAlign: "center", marginVertical: 14 },

  pendingCard: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FACC15",
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
  },

  pendingRow: { flexDirection: "row", justifyContent: "space-between" },
  pendingTitle: { fontWeight: "800", fontSize: 16 },
  pendingPrice: { fontWeight: "700", fontSize: 18, color: "#22C55E" },
  pendingStatus: { fontSize: 12, color: "#6B7280" },
  pendingMeta: { fontSize: 13, color: "#6B7280", marginTop: 4 },

  pendingButton: {
    backgroundColor: "#FDE047",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  pendingBtnText: { fontWeight: "700" },

  activeCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  activeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  activeTitle: { fontSize: 16, fontWeight: "700" },

  payoutLabel: { fontSize: 12, color: "#6B7280" },
  payoutAmount: { fontSize: 18, fontWeight: "800", color: "#16A34A" },

  stagePill: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  stageText: { color: "#2563EB", fontWeight: "600" },

  stepper: { marginTop: 16 },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    marginRight: 12,
  },

  stepDotActive: { backgroundColor: "#2563EB" },
  stepText: { fontSize: 14, color: "#6B7280" },
  stepTextActive: { color: "#0F172A", fontWeight: "600" },

  primaryBtn: {
    backgroundColor: "#FACC15",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },

  primaryBtnText: { fontSize: 16, fontWeight: "700", color: "#111827" },

  otpOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  otpBox: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },

  otpInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  liveStatusCard: {
  backgroundColor: "#0F172A",
  borderRadius: 18,
  padding: 18,
  marginTop: 20,
},

liveTitle: {
  color: "#E5E7EB",
  fontWeight: "700",
  marginBottom: 16,
},

statusRow: {
  marginBottom: 14,
},

statusTitle: {
  color: "#9CA3AF",
  fontWeight: "600",
},

statusActive: {
  color: "#E5E7EB",
},

statusDesc: {
  color: "#9CA3AF",
  fontSize: 12,
  marginTop: 4,
},

uploadBtn: {
  backgroundColor: "#CA8A04",
  padding: 12,
  borderRadius: 14,
  alignItems: "center",
  marginTop: 12,
},

uploadBtnText: {
  fontWeight: "700",
  color: "#111827",
},

completeBtn: {
  backgroundColor: "#E5E7EB",
  padding: 14,
  borderRadius: 14,
  alignItems: "center",
  marginTop: 14,
},

completeBtnText: {
  fontWeight: "700",
  color: "#6B7280",
},

});
