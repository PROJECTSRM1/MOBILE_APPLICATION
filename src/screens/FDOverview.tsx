
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Alert,
//   TextInput,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";

// /* ================= TYPES ================= */

// type Job = {
//   id: string;
//   title: string;
//   price: number;
//   customer: string;
//   location: string;
//   time: string;
// };

// /* ================= CONSTANTS ================= */

// const JOB_STAGES = [
//   "On the way",
//   "Reached location",
//   "Job Started",
//   "Job Completed",
// ];

// /* ================= COMPONENT ================= */

// const FDOverview = () => {
//   const route = useRoute<any>();
//   const navigation = useNavigation<any>();

//   /* -------- STATE -------- */

//   const [menuOpen, setMenuOpen] = useState(false);

//   const [pendingJobs, setPendingJobs] = useState<Job[]>(
//     route.params?.approvalPending || []
//   );

//   const [activeJob, setActiveJob] = useState<Job | null>(null);
//   const [completedJobs, setCompletedJobs] = useState<Job[]>([]);

//   const [currentStep, setCurrentStep] = useState(1);
//   const [stage3Images, setStage3Images] = useState<string[]>([]);
// const [stage4Images, setStage4Images] = useState<string[]>([]);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otpInput, setOtpInput] = useState("");
//   const [jobImages, setJobImages] = useState<string[]>([]);

//   /* ================= LOGIC ================= */

// //   const handleNextStage = () => {
// //     // OTP before Job Started
// //     if (currentStep === 2) {
// //       setShowOtpModal(true);
// //       return;
// //     }

// //     // Image required before Job Completed
// //     if (currentStep === 3 && jobImages.length === 0) {
// //       Alert.alert(
// //         "Image Required",
// //         "Please upload job images before completing the job."
// //       );
// //       return;
// //     }

// //     // Complete job
// //     if (currentStep === 3 && activeJob) {
// //       setCompletedJobs(prev => [...prev, activeJob]);
// //       setActiveJob(null);
// //       setCurrentStep(1);
// //       setJobImages([]);
// //       return;
// //     }

// //     setCurrentStep(prev => prev + 1);
// //   };

// //   const verifyOtp = () => {
// //     if (otpInput === "3333") {
// //       setShowOtpModal(false);
// //       setOtpInput("");
// //       setCurrentStep(3);
// //     } else {
// //       Alert.alert("Invalid OTP");
// //     }
// //   };

// const handleNextStage = () => {
//   // Stage 3 requires image
//   if (currentStep === 3 && stage3Images.length === 0) {
//     Alert.alert(
//       "Image Required",
//       "Please upload job started proof images."
//     );
//     return;
//   }

//   // Stage 4 requires image
//   if (currentStep === 4 && stage4Images.length === 0) {
//     Alert.alert(
//       "Image Required",
//       "Please upload job completion proof images."
//     );
//     return;
//   }

//   if (currentStep < 4) {
//     setCurrentStep(prev => prev + 1);
//   }
// };
//   const verifyOtp = () => {
//     if (otpInput === "3333") {
//       setShowOtpModal(false);
//       setOtpInput("");
//       setCurrentStep(3);
//     } else {
//       Alert.alert("Invalid OTP");
//     }
//   };
//   /* ================= UI ================= */

//   return (
//     <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
//       {/* ================= HEADER ================= */}
//       <View style={styles.headerContainer}>
//         <View>
//           <Text style={styles.logo}>SWACHIFY INDIA</Text>
//           <Text style={styles.subLogo}>Freelancer Portal</Text>
//         </View>

//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.navigate("FreelancerDashboard")}
//         >
//           <Text style={styles.backText}>← Back to Requests</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
//           <View style={styles.profileCircle}>
//             <Image
//               source={{
//                 uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//               }}
//               style={styles.profileIcon}
//             />
//           </View>
//         </TouchableOpacity>
//       </View>

//       {menuOpen && (
//         <View style={styles.menuBox}>
//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => navigation.navigate("Login")}
//           >
//             <Text style={styles.menuText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* ================= DASHBOARD ================= */}
//       <Text style={styles.heading}>Dashboard Overview</Text>
//       <Text style={styles.subheading}>
//         Track your performance at a glance
//       </Text>

//       <View style={styles.cardRow}>
//         <View style={[styles.card, styles.blueBorder]}>
//           <Text style={styles.cardTitle}>Total Earnings</Text>
//           <Text style={styles.cardValue}>₹0</Text>
//           <Text style={styles.cardDesc}>From 0 completed jobs</Text>
//         </View>

//         <View style={[styles.card, styles.yellowBorder]}>
//           <Text style={styles.cardTitle}>Approval Pending</Text>
//           <Text style={styles.cardValue}>{pendingJobs.length}</Text>
//           <Text style={styles.cardDesc}>
//             Jobs waiting for admin review
//           </Text>
//         </View>
//       </View>

//       <View style={styles.cardRow}>
//         <View style={[styles.card, styles.blueBorder]}>
//           <Text style={styles.cardTitle}>Available Jobs</Text>
//           <Text style={styles.cardValue}>20</Text>
//           <Text style={styles.cardDesc}>
//             Start from Available Requests below
//           </Text>
//         </View>

//         <View style={[styles.card, styles.blueBorder]}>
//           <Text style={styles.cardTitle}>Client Rating</Text>
//           <Text style={styles.ratingValue}>⭐ 4.8</Text>
//           <Text style={styles.cardDesc}>
//             Based on recent jobs
//           </Text>
//         </View>
//       </View>

//       {/* ================= SKILLS ================= */}
//       <Text style={styles.sectionTitle}>My Skills</Text>
//       <View style={styles.skillsRow}>
//         <Text style={styles.skill}>Cleaning</Text>
//         <Text style={styles.skill}>Home Services</Text>
//         <Text style={styles.skill}>Plumbing</Text>
//         <Text style={styles.skill}>Electrical</Text>
//       </View>

//       {/* ================= APPROVAL PENDING ================= */}
//       <Text style={styles.sectionTitle}>Approval Pending</Text>

//       {pendingJobs.length === 0 ? (
//         <Text style={styles.empty}>
//           No jobs are waiting for approval.
//         </Text>
//       ) : (
//         pendingJobs.map(job => (
//           <View key={job.id} style={styles.pendingCard}>
//             <View style={styles.pendingRow}>
//               <Text style={styles.pendingTitle}>{job.title}</Text>
//               <Text style={styles.pendingPrice}>₹{job.price}</Text>
//             </View>

//             <Text style={styles.pendingStatus}>
//               Waiting for admin approval
//             </Text>
//             <Text style={styles.pendingMeta}>
//               Customer: {job.customer}
//             </Text>
//             <Text style={styles.pendingMeta}>📍 {job.location}</Text>
//             <Text style={styles.pendingMeta}>⏱ {job.time}</Text>

//             <TouchableOpacity
//               style={styles.pendingButton}
//               onPress={() => {
//                 setActiveJob(job);
//                 setPendingJobs(prev =>
//                   prev.filter(p => p.id !== job.id)
//                 );
//               }}
//             >
//               <Text style={styles.pendingBtnText}>
//                 Mark Approved
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ))
//       )}

//       {/* ================= ACTIVE JOB ================= */}
//       <Text style={styles.sectionTitle}>My Active Job</Text>

//       {activeJob ? (
//         <View style={styles.activeCard}>
//           <View style={styles.activeHeader}>
//             <View>
//               <Text style={styles.activeTitle}>
//                 {activeJob.title}
//               </Text>
//               <Text style={styles.pendingMeta}>
//                 Ticket ID: {activeJob.id}
//               </Text>
//             </View>

//             <View>
//               <Text style={styles.payoutLabel}>Payout</Text>
//               <Text style={styles.payoutAmount}>
//                 ₹{activeJob.price}
//               </Text>
//             </View>
//           </View>

//           <Text style={styles.pendingMeta}>📍 {activeJob.location}</Text>
//           <Text style={styles.pendingMeta}>⏱ {activeJob.time}</Text>
//           {/* LIVE JOB STATUS */}
// <View style={styles.liveStatusCard}>
//   <Text style={styles.liveTitle}>Live job status</Text>

//   {[
//     {
//       title: "On the way",
//       desc: "You are travelling to the customer location.",
//     },
//     {
//       title: "Reached location",
//       desc: "You have reached the customer address.",
//     },
//     {
//       title: "Job Started",
//       desc: "Mandatory multiple image proof required.",
//     },
//     {
//       title: "Job Completed",
//       desc:
//         "Mandatory multiple image proof required to confirm completion.",
//     },
//   ].map((item, index) => (
//     <View key={index} style={styles.statusRow}>
//       <Text
//         style={[
//           styles.statusTitle,
//           index + 1 <= currentStep && styles.statusActive,
//         ]}
//       >
//         {index + 1}. {item.title}
//       </Text>
//       <Text style={styles.statusDesc}>{item.desc}</Text>
//     </View>
//   ))}
// </View>

// {(currentStep === 3 || currentStep === 4) && (
//   <View>
//     <TouchableOpacity
//       style={styles.uploadBtn}
//       onPress={() => {
//         if (currentStep === 3) {
//           setStage3Images(prev => [...prev, "img"]);
//         } else {
//           setStage4Images(prev => [...prev, "img"]);
//         }
//       }}
//     >
//       <Text style={styles.uploadBtnText}>
//         Capture / Upload proof
//       </Text>
//     </TouchableOpacity>

//     <TouchableOpacity
//       style={[
//         styles.completeBtn,
//         currentStep === 4 &&
//           stage4Images.length === 0 && {
//             backgroundColor: "#9CA3AF",
//           },
//       ]}
//       disabled={currentStep === 4 && stage4Images.length === 0}
//       onPress={() => {
//         // your existing complete job logic
//       }}
//     >
//       <Text style={styles.completeBtnText}>Complete job</Text>
//     </TouchableOpacity>
//   </View>
// )}


//         </View>
//       ) : (
//         <Text style={styles.empty}>
//           No jobs in progress yet.
//         </Text>
//       )}

//       {/* ================= RECENTLY COMPLETED ================= */}
//       <Text style={styles.sectionTitle}>Recently Completed</Text>

//       {completedJobs.length === 0 ? (
//         <Text style={styles.empty}>
//           You haven't completed any jobs yet.
//         </Text>
//       ) : (
//         completedJobs.map(job => (
//           <View key={job.id} style={styles.pendingCard}>
//             <Text style={styles.pendingTitle}>{job.title}</Text>
//             <Text style={styles.pendingMeta}>₹{job.price}</Text>
//           </View>
//         ))
//       )}

//       {/* ================= OTP MODAL ================= */}
//       {showOtpModal && (
//         <View style={styles.otpOverlay}>
//           <View style={styles.otpBox}>
//             <Text style={{ fontWeight: "700", marginBottom: 10 }}>
//               Verify OTP
//             </Text>

//             <TextInput
//               placeholder="Enter OTP"
//               keyboardType="number-pad"
//               value={otpInput}
//               onChangeText={setOtpInput}
//               style={styles.otpInput}
//             />

//             <TouchableOpacity
//               style={styles.primaryBtn}
//               onPress={verifyOtp}
//             >
//               <Text style={styles.primaryBtnText}>Verify</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// export default FDOverview;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   root: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },

//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   logo: { fontSize: 20, fontWeight: "800", color: "#2563EB" },
//   subLogo: { fontSize: 12, color: "#6B7280" },

//   backBtn: {
//     backgroundColor: "#FFF",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//   },

//   backText: { fontWeight: "600", color: "#374151" },

//   profileCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   profileIcon: { width: 32, height: 32 },

//   menuBox: {
//     position: "absolute",
//     right: 10,
//     top: 70,
//     width: 120,
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     elevation: 8,
//   },

//   menuItem: { padding: 12 },
//   menuText: { fontWeight: "700", color: "#EF4444" },

//   heading: { fontSize: 22, fontWeight: "800" },
//   subheading: { color: "#6B7280", marginBottom: 15 },

//   cardRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },

//   card: {
//     width: "48%",
//     backgroundColor: "#FFF",
//     padding: 16,
//     borderRadius: 12,
//   },

//   blueBorder: { borderLeftWidth: 4, borderLeftColor: "#3B82F6" },
//   yellowBorder: { borderLeftWidth: 4, borderLeftColor: "#FACC15" },

//   cardTitle: { fontWeight: "700" },
//   cardValue: { fontSize: 22, fontWeight: "800" },
//   ratingValue: { fontSize: 22, fontWeight: "800", color: "#F59E0B" },
//   cardDesc: { fontSize: 12, color: "#6B7280" },

//   sectionTitle: { marginTop: 20, fontWeight: "700", fontSize: 16 },

//   skillsRow: { flexDirection: "row", flexWrap: "wrap" },
//   skill: {
//     backgroundColor: "#E0F2FE",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginRight: 8,
//     marginBottom: 8,
//   },

//   empty: { color: "#9CA3AF", textAlign: "center", marginVertical: 14 },

//   pendingCard: {
//     backgroundColor: "#FFF8E1",
//     borderWidth: 1,
//     borderColor: "#FACC15",
//     borderRadius: 14,
//     padding: 16,
//     marginVertical: 10,
//   },

//   pendingRow: { flexDirection: "row", justifyContent: "space-between" },
//   pendingTitle: { fontWeight: "800", fontSize: 16 },
//   pendingPrice: { fontWeight: "700", fontSize: 18, color: "#22C55E" },
//   pendingStatus: { fontSize: 12, color: "#6B7280" },
//   pendingMeta: { fontSize: 13, color: "#6B7280", marginTop: 4 },

//   pendingButton: {
//     backgroundColor: "#FDE047",
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//     alignItems: "center",
//   },

//   pendingBtnText: { fontWeight: "700" },

//   activeCard: {
//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   activeHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   activeTitle: { fontSize: 16, fontWeight: "700" },

//   payoutLabel: { fontSize: 12, color: "#6B7280" },
//   payoutAmount: { fontSize: 18, fontWeight: "800", color: "#16A34A" },

//   stagePill: {
//     alignSelf: "flex-start",
//     backgroundColor: "#E0F2FE",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginTop: 12,
//   },

//   stageText: { color: "#2563EB", fontWeight: "600" },

//   stepper: { marginTop: 16 },
//   stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   stepDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#CBD5E1",
//     marginRight: 12,
//   },

//   stepDotActive: { backgroundColor: "#2563EB" },
//   stepText: { fontSize: 14, color: "#6B7280" },
//   stepTextActive: { color: "#0F172A", fontWeight: "600" },

//   primaryBtn: {
//     backgroundColor: "#FACC15",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 16,
//   },

//   primaryBtnText: { fontSize: 16, fontWeight: "700", color: "#111827" },

//   otpOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   otpBox: {
//     backgroundColor: "#FFF",
//     padding: 20,
//     borderRadius: 12,
//     width: "80%",
//   },

//   otpInput: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//   },
//   liveStatusCard: {
//   backgroundColor: "#0F172A",
//   borderRadius: 18,
//   padding: 18,
//   marginTop: 20,
// },

// liveTitle: {
//   color: "#E5E7EB",
//   fontWeight: "700",
//   marginBottom: 16,
// },

// statusRow: {
//   marginBottom: 14,
// },

// statusTitle: {
//   color: "#9CA3AF",
//   fontWeight: "600",
// },

// statusActive: {
//   color: "#E5E7EB",
// },

// statusDesc: {
//   color: "#9CA3AF",
//   fontSize: 12,
//   marginTop: 4,
// },

// uploadBtn: {
//   backgroundColor: "#CA8A04",
//   padding: 12,
//   borderRadius: 14,
//   alignItems: "center",
//   marginTop: 12,
// },

// uploadBtnText: {
//   fontWeight: "700",
//   color: "#111827",
// },

// completeBtn: {
//   backgroundColor: "#E5E7EB",
//   padding: 14,
//   borderRadius: 14,
//   alignItems: "center",
//   marginTop: 14,
// },

// completeBtnText: {
//   fontWeight: "700",
//   color: "#6B7280",
// },

// });
import React, { useState , useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Image } from "react-native";

// Shared data import
import { GlobalAppData } from "./FreelancerDashboard";
// import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
interface JobRequest {
  id: string;
  category: string;
  price: string;
  customer: string;
  description: string;
  location: string;
  date: string;
  phone?: string;
  email?: string;
}

const PRIMARY_BLUE = "#1565C0";
const PRIMARY_YELLOW = "#F4B400";
const TEXT_COLOR_DARK = "#333";

type RootStackParamList = {
  AvailableRequestsScreen: undefined;
  DashboardScreen: undefined;
  FreelancerPremiumFlow: undefined;
  [key: string]: object | undefined;
};

type DashboardScreenNavigationProp = NavigationProp<RootStackParamList>;

const StatCard = ({
  title,
  value,
  desc,
  color,
}: {
  title: string;
  value: string;
  desc: string;
  color: string;
}) => (
  <View style={styles.statCard}>
    <View style={[styles.sideStrip, { backgroundColor: color }]} />
    <View style={{ padding: 16, flex: 1 }}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statDesc}>{desc}</Text>
    </View>
  </View>
);

const TrackerStep = ({
  number,
  title,
  desc,
  active,
  completed,
  showProofBtn,
  onProofPress,
  uploadedImages = []   // ✅ DEFAULT VALUE
}: {

  number: string; 
  title: string; 
  desc: string; 
  active?: boolean; 
  completed?: boolean;
  showProofBtn?: boolean;
  onProofPress?: () => void;
  uploadedImages?: string[];

}) => (

  <View style={{ marginBottom: 12 }}>
    <View style={styles.stepRow}>
      <View style={[styles.stepIndicator, active && styles.stepIndicatorActive]}>
        <Text style={[styles.stepNum, active && styles.stepNumActive]}>{completed ? "✓" : number}</Text>
      </View>
      <View style={styles.stepTextContent}>
        <Text style={[styles.stepTitle, active && styles.stepTitleActive]}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
        
        {/* Added Button UI */}
      {showProofBtn && active && !completed && (
  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>

    <TouchableOpacity 
      style={styles.uploadProofBtn} 
      onPress={onProofPress}
    >
      <Text style={styles.uploadProofIcon}>📤</Text>
      <Text style={styles.uploadProofText}>
        {uploadedImages.length > 0 ? "Add / Replace images" : "Image 1"}
      </Text>
    </TouchableOpacity>

    {/* ✅ Image count – ONLY AFTER upload */}
    {uploadedImages.length > 0 && (
      <Text style={{ marginLeft: 10, fontSize: 11, color: "#7FA6C8" }}>
        {uploadedImages.length} image added
      </Text>
    )}

  </View>
)}


      </View>
    </View>
  </View>
);

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1); 
  const [pendingList, setPendingList] = useState<JobRequest[]>(GlobalAppData.pendingList || []);
  const [activeJob, setActiveJob] = useState<JobRequest | null>(null);
  const [completedList, setCompletedList] = useState<JobRequest[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const isMobile = Dimensions.get("window").width < 768;
  const [generatedOtp, setGeneratedOtp] = useState<string>("");

// const handleCaptureProof = () => {
//   Alert.alert(
//     "Upload Proof",
//     "Select proof from:",
//     [
//       { 
//         text: "Take Photo", 
//         onPress: () => {
//           launchCamera({
//             mediaType: 'photo',
//             quality: 0.8,
//             saveToPhotos: true,
//           }, (response: ImagePickerResponse) => {
//             if (response.didCancel) {
//               console.log('User cancelled camera');
//             } else if (response.errorCode) {
//               Alert.alert("Error", response.errorMessage || "Camera Error");
//             } else if (response.assets && response.assets.length > 0) {
//               const uri = response.assets[0].uri;
//               if (uri) setUploadedImages(prev => [...prev, uri]);
//               Alert.alert("Success", "Photo captured successfully!");
//               console.log("Image URI:", uri);
//             }
//           });
//         } 
//       },
//       { 
//         text: "Upload from Gallery", 
//         onPress: () => {
//           launchImageLibrary({
//             mediaType: 'photo',
//             quality: 0.8,
//           }, (response: ImagePickerResponse) => {
//             if (response.assets && response.assets.length > 0) {
//               const uri = response.assets[0].uri;
//   if (uri) setUploadedImages(prev => [...prev, uri]);
//               Alert.alert("Success", "Image selected from gallery!");
//             }
//           });
//         } 
//       },
//       { text: "Cancel", style: "cancel" }
//     ]
//   );
// };
  // UPDATED LOGIC: If a job is active, show the alert pop-up instead of starting a new job
  const handleStartJob = (job: JobRequest) => {
    if (activeJob) {
      setShowAlert(true); // Triggers the modal shown in image_cd3643.png
      return;
    }
    const jobWithContacts = {
        ...job,
        phone: "+91 98765 00003",
        email: "amit.singh@example.com"
    };
    setActiveJob(jobWithContacts);
    // Remove only this job; others stay in pendingList
    const newList = pendingList.filter((item: JobRequest) => item.id !== job.id);
    setPendingList(newList);
    GlobalAppData.pendingCount = newList.length;
  };

  const handleNextStep = () => {
   if (currentStep === 2) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  setGeneratedOtp(otp);
  setShowOtpModal(true);

  console.log("Generated OTP:", otp); // remove later
  return;
}

    if (currentStep < 4) {
      setCurrentStep((prev: number) => prev + 1);
    } else {
      Alert.alert("Complete Job", "Has the work been finished?", [
        { text: "No" },
        { 
          text: "Yes", 
          onPress: () => { 
            if (activeJob) {
              setCompletedList(prev => [activeJob, ...prev]);
            }
            setActiveJob(null); 
            setCurrentStep(1); 
          } 
        }
      ]);
    }
  };

  const verifyOtp = () => {
    if (otpInput === generatedOtp) {
 
      setShowOtpModal(false);
      setOtpInput("");
      setCurrentStep(3); 
    } else {
      Alert.alert("Invalid OTP", "Please enter the correct 6-digit OTP.");
    }
  };
const freelancerId = 184; // later from login

  const fetchAssignedActiveJob = async () => {
  try {
    const response = await fetch(
      "https://swachify-india-be-1-mcrb.onrender.com/api/home-service",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    const data = await response.json();

    // ONLY assigned job for THIS freelancer
    const assignedJob = data.find(
      (item: any) =>
        item.assigned_to === freelancerId &&
        item.payment_done === true
    );

    if (assignedJob) {
      setActiveJob({
        id: `TKT${assignedJob.id}`,
        category: "Home Service",
        price: `₹${assignedJob.service_price}`,
        customer: assignedJob.full_name,
        description: assignedJob.problem_description,
        location: assignedJob.address,
        date: assignedJob.preferred_date,
        phone: assignedJob.mobile,
        email: assignedJob.email,
      });
    }
  } catch (e) {
    console.error("Assigned job fetch failed", e);
  }
};

useEffect(() => {
  fetchAssignedActiveJob();
}, []);



  return (
    <SafeAreaView style={styles.container}>
      {/* Alert Modal - Matches image_cd3643.png logic */}
      <Modal transparent visible={showAlert} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
               <Text style={{ fontSize: 24, marginRight: 10 }}>⚠️</Text>
               <Text style={styles.alertTitle}>Complete the current active job</Text>
            </View>
            <Text style={styles.alertMessage}>
                You already have an active booking in progress. Please complete or close the current job before starting a new one.
            </Text>
            <TouchableOpacity style={styles.okBtn} onPress={() => setShowAlert(false)}>
              <Text style={styles.okBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* OTP Modal */}
      <Modal transparent visible={showOtpModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.otpBox}>
            <View style={styles.otpHeader}>
              <Text style={styles.otpTitle}>Verify OTP with customer</Text>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.otpSub}>Ask the customer for the OTP shown in their SMS/app and enter it below.</Text>
            
            <TextInput 
              style={styles.otpInput} 
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otpInput}
              onChangeText={setOtpInput}
            />
            
           <Text style={styles.otpHint}>OTP: {generatedOtp}</Text>


            <View style={styles.otpActionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowOtpModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp}>
                <Text style={styles.verifyBtnText}>Verify & Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      

      {/* Header */}
<View style={styles.header}>
  <View>
    <Text style={styles.brand}>SWACHIFY INDIA</Text>
    <Text style={styles.portal}>Freelancer Portal</Text>
  </View>

  {/*  New Container for Button + Profile Icon */}
  <View style={styles.headerRight}>
    <TouchableOpacity
      style={styles.backBtn}
      onPress={() => navigation.navigate("FreelancerDashboard")}
    >
      <Text style={styles.backText}>← Back To Requests</Text>
    </TouchableOpacity>

    {/*  Profile Icon */}
    <TouchableOpacity style={styles.profileCircle}>
      <Text style={styles.profileIconText}>👤</Text>
    </TouchableOpacity>
  </View>
</View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard Overview</Text>
        <Text style={styles.subtitle}>Track your performance at a glance</Text>

        <View style={styles.cardRow}>
          <StatCard title="Total Earnings" value={`₹${completedList.length * 1200}`} desc={`From ${completedList.length} completed jobs`} color={PRIMARY_BLUE} />
          <StatCard title="Approval Pending" value={pendingList.length.toString()} desc="Jobs in review" color={PRIMARY_YELLOW} />
        </View>

        <View style={styles.cardRow}>
          <StatCard title="Available Jobs" value="20" desc="Nearby requests" color={PRIMARY_BLUE} />
          <StatCard title="Client Rating" value="⭐ 4.8" desc="Based on history" color={PRIMARY_BLUE} />
        </View>

        <View style={styles.jobSection}>
          <Text style={styles.jobTitle}>My Active Job</Text>
          <Text style={styles.jobSubtitle}>Live status of your current service</Text>
          
          {activeJob ? (
            <View style={[styles.activeJobContainer, { flexDirection: isMobile ? "column" : "row" }]}>
              <View style={styles.activeInfoSide}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.jobCardCategory}>{activeJob.category}</Text>
                      <View style={styles.inProgressBadge}><Text style={styles.inProgressText}>In Progress</Text></View>
                    </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 10, color: '#888' }}>Payout</Text>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#2E7D32' }}>{activeJob.price}</Text>
                  </View>
                </View>

                <Text style={styles.jobCardId}>Ticket ID: {activeJob.id}</Text>
                <View style={{flexDirection: 'row', marginBottom: 12}}>
                    <Text style={styles.metaMini}>📍 {activeJob.location}</Text>
                    <Text style={[styles.metaMini, {marginLeft: 10}]}>🕒 {activeJob.date}</Text>
                </View>
                
                <View style={styles.customerDetailsBox}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#999', marginBottom: 8, letterSpacing: 0.5 }}>CUSTOMER DETAILS</Text>
                    <Text style={styles.customerName}>👤 {activeJob.customer}</Text>
                    <Text style={styles.customerMetaLine}>📞 {activeJob.phone || "+91 00000 00000"}</Text>
                    <Text style={styles.customerMetaLine}>✉️ {activeJob.email || "customer@example.com"}</Text>
                    <Text style={styles.customerMetaLine}>📍 {activeJob.location}</Text>
                </View>

                <View style={styles.currentStageRow}>
                    <Text style={styles.stageLabel}>Current stage <Text style={styles.stageBlue}>
                      {currentStep === 1 ? "On the way" : currentStep === 2 ? "Reached location" : currentStep === 3 ? "Job Started" : "Completed"}
                    </Text></Text>
                </View>
                
                <TouchableOpacity style={styles.helpLink}>
                    <Text style={{ color: PRIMARY_BLUE, fontSize: 12, fontWeight: '600' }}>❓ Get help with this job</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.trackerSide, isMobile && { width: "100%" }]}>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>Live job status</Text>
                </View>
                
                <TrackerStep number="1" title="On the way" desc="Traveling to client" active={currentStep >= 1} completed={currentStep > 1} />
                <TrackerStep number="2" title="Reached location" desc="At customer address" active={currentStep >= 2} completed={currentStep > 2} />
              <TrackerStep 
  number="3"
  title="Job Started"
  desc="Service in progress"
  active={currentStep >= 3}
  completed={currentStep > 3}
  showProofBtn={true}
//   onProofPress={handleCaptureProof}
  uploadedImages={uploadedImages}
/>



{/* Selected images preview */}
{/* Selected images preview */}
{/* Selected images preview with actions */}
{uploadedImages.length > 0 && (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
    {uploadedImages.map((uri, index) => (
      <View key={index} style={{ marginRight: 10, alignItems: "center" }}>

        <Image
          source={{ uri }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
        />

        <View style={{ flexDirection: "row", marginTop: 4 }}>
          {/* <TouchableOpacity onPress={handleCaptureProof} style={{ marginRight: 8 }}>
            <Text style={{ fontSize: 10, color: "#FFD54F", fontWeight: "bold" }}>
              Replace
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() =>
              setUploadedImages(prev => prev.filter((_, i) => i !== index))
            }
          >
            <Text style={{ fontSize: 10, color: "#EF5350", fontWeight: "bold" }}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    ))}
  </ScrollView>
)}



<TrackerStep 
    number="4" title="Job Completed" desc="Confirm finish" 
    active={currentStep >= 4} 
    showProofBtn={true} 
    // onProofPress={handleCaptureProof} 
/>
                
                <TouchableOpacity style={styles.moveNextBtn} onPress={handleNextStep}>
                  <Text style={styles.moveNextText}>Move to next stage</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🛠️</Text>
                <Text style={styles.emptyText}>No jobs currently in progress.</Text>
            </View>
          )}
        </View>

        <View style={styles.jobSection}>
          <Text style={styles.jobTitle}>Approval Pending</Text>
          <Text style={styles.jobSubtitle}>Jobs waiting for admin review</Text>

          {pendingList.length > 0 ? (
            pendingList.map((job: JobRequest, index: number) => (
              <View key={`${job.id}-${index}`} style={styles.premiumJobCard}>
                <View style={styles.jobCardHeader}>
                  <Text style={styles.jobCardCategory}>{job.category}</Text>
                  <Text style={styles.jobCardPrice}>{job.price}</Text>
                </View>
                <View style={styles.statusTag}>
                  <Text style={styles.statusTagText}>Waiting for admin approval</Text>
                </View>
                <Text style={styles.jobCardId}>Ticket ID: {job.id}</Text>
                <Text style={styles.jobCardCustomer}>
                  Customer: <Text style={{ fontWeight: "bold" }}>{job.customer}</Text>
                </Text>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.jobCardDesc}>{job.description}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaItem}>📍 {job.location}</Text>
                  <Text style={styles.metaItem}>🕒 {job.date}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.markApprovedBtn} 
                  onPress={() => handleStartJob(job)}
                >
                  <Text style={styles.markApprovedText}>Mark approved & start job</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>✉️</Text>
              <Text style={styles.emptyText}>No jobs are waiting for approval.</Text>
            </View>
          )}
        </View>

        <View style={styles.jobSection}>
          <Text style={styles.jobTitle}>Recently Completed</Text>
          <Text style={styles.jobSubtitle}>Jobs you have successfully finished</Text>
          {completedList.length > 0 ? (
            completedList.map((job) => (
              <View key={job.id} style={[styles.premiumJobCard, { borderColor: '#A5D6A7' }]}>
                <View style={styles.jobCardHeader}>
                  <Text style={styles.jobCardCategory}>{job.category}</Text>
                  <Text style={[styles.jobCardPrice, { color: '#2E7D32' }]}>{job.price}</Text>
                </View>
                <View style={[styles.statusTag, { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' }]}>
                  <Text style={[styles.statusTagText, { color: '#2E7D32' }]}>Job Completed ✅</Text>
                </View>
                <Text style={styles.jobCardId}>Ticket ID: {job.id}</Text>
                <Text style={styles.jobCardCustomer}>Customer: <Text style={{fontWeight: 'bold'}}>{job.customer}</Text></Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaItem}>📍 {job.location}</Text>
                  <Text style={styles.metaItem}>🕒 {job.date}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBox}>
                  <Text style={styles.emptyIcon}>✅</Text>
                </View>
                <Text style={styles.emptyText}>You haven't completed any jobs yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5F9" },
  header: { backgroundColor: "#FFF", padding: 16, flexDirection: "row", justifyContent: "space-between", elevation: 4 },
  brand: { fontSize: 18, fontWeight: "900", color: PRIMARY_BLUE },
  portal: { fontSize: 12, color: "#777" },
  backBtn: { backgroundColor: "#EEE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  backText: { fontWeight: "600" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "800", color: "#222" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  statCard: { width: "48%", backgroundColor: "#FFF", borderRadius: 16, flexDirection: "row", elevation: 4 },
  sideStrip: { width: 6, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  statTitle: { fontSize: 12, color: "#666" },
  statValue: { fontSize: 20, fontWeight: "900", marginVertical: 4 },
  statDesc: { fontSize: 10, color: "#888" },
  jobSection: { marginBottom: 30 },
  jobTitle: { fontSize: 18, fontWeight: "800", color: TEXT_COLOR_DARK },
  jobSubtitle: { fontSize: 13, color: "#666", marginBottom: 15 },
  emptyContainer: { alignItems: "center", paddingVertical: 20, backgroundColor: "#FFF", borderRadius: 16, borderWidth: 1, borderColor: "#EFEFEF" },
  emptyIconBox: { width: 50, height: 40, backgroundColor: "#F7F7F7", borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 8, opacity: 0.6 },
  emptyIcon: { fontSize: 18 },
  emptyText: { fontSize: 13, color: "#888" },
  premiumJobCard: { backgroundColor: "#FFF", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: "#FFD54F", elevation: 2 },
  jobCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  jobCardCategory: { fontSize: 14, fontWeight: "700", color: "#333" },
  jobCardPrice: { fontSize: 15, fontWeight: "900", color: "#2E7D32" },
  statusTag: { backgroundColor: "#FFF8E1", alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12, borderWidth: 1, borderColor: "#FFD54F", marginBottom: 8 },
  statusTagText: { color: "#F57C00", fontSize: 11, fontWeight: "bold" },
  jobCardId: { fontSize: 12, color: "#777", marginBottom: 2 },
  jobCardCustomer: { fontSize: 14, color: "#333", marginBottom: 10 },
  descriptionContainer: { borderLeftWidth: 3, borderLeftColor: "#E0E0E0", paddingLeft: 10, marginBottom: 10 },
  jobCardDesc: { fontSize: 13, color: "#555", fontStyle: "italic" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  metaItem: { fontSize: 11, color: "#666", marginRight: 15 },
  markApprovedBtn: { backgroundColor: "#000", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignSelf: "flex-start" },
  markApprovedText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  activeJobContainer: { backgroundColor: "#FFF", borderRadius: 12, flexDirection: "row", elevation: 8, minHeight: 320, overflow: "hidden", borderWidth: 1, borderColor: '#E0E0E0', marginVertical: 10 },
  activeInfoSide: { flex: 1.4, padding: 15, justifyContent: 'space-between' },
  inProgressBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 8, borderWidth: 1, borderColor: PRIMARY_BLUE },
  inProgressText: { color: PRIMARY_BLUE, fontSize: 10, fontWeight: 'bold' },
  metaMini: { fontSize: 10, color: '#888' },
  customerDetailsBox: { backgroundColor: "#F9FAFB", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 10 },
  customerName: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  customerMetaLine: { fontSize: 11, color: PRIMARY_BLUE, marginBottom: 2 },
  currentStageRow: { backgroundColor: '#E1F5FE', padding: 10, borderRadius: 8, marginBottom: 5 },
  helpLink: { paddingVertical: 5 },
  trackerSide: { flex: 1, backgroundColor: "#101D2D", padding: 12, justifyContent: 'center' },
  liveBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 4, borderRadius: 20, marginBottom: 20, alignItems: 'center', width: '80%', alignSelf: 'center' },
  liveBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  stepRow: { flexDirection: "row", alignItems: 'center' },
  stepIndicator: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#455A64', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  stepIndicatorActive: { borderColor: '#FFF', backgroundColor: 'rgba(255,255,255,0.1)' },
  stepNum: { color: "#455A64", fontSize: 10, fontWeight: 'bold' },
  stepNumActive: { color: "#FFF" },
  stepTextContent: { flex: 1 },
  stepTitle: { color: "#455A64", fontSize: 11, fontWeight: "bold" },
  stepTitleActive: { color: "#FFF" },
  stepDesc: { color: "#455A64", fontSize: 9 },
  moveNextBtn: { backgroundColor: PRIMARY_YELLOW, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  moveNextText: { color: "#000", fontWeight: "bold", fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  alertBox: { backgroundColor: "#FFF", borderRadius: 12, padding: 20, width: "80%" },
  alertTitle: { fontSize: 18, fontWeight: "bold", color: "#222" },
  alertMessage: { color: "#666", marginBottom: 20, fontSize: 14, lineHeight: 20 },
  okBtn: { backgroundColor: PRIMARY_BLUE, alignSelf: 'flex-end', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 5 },
  okBtnText: { color: "#FFF", fontWeight: "bold" },
  stageLabel: { fontSize: 12, color: "#555" },
  stageBlue: { color: PRIMARY_BLUE, fontWeight: "bold" },
  otpBox: { backgroundColor: "#FFF", borderRadius: 12, padding: 20, width: "85%" },
  otpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  otpTitle: { fontSize: 18, fontWeight: "bold", color: "#222" },
  closeX: { fontSize: 18, color: "#999" },
  otpSub: { fontSize: 13, color: "#666", marginBottom: 15, lineHeight: 18 },
  otpInput: { borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 10, color: "#333" },
  otpHint: { fontSize: 12, color: "#888", marginBottom: 20 },
  otpActionRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 15 },
  cancelBtnText: { color: "#333", fontWeight: "600" },
  verifyBtn: { backgroundColor: "#111", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
  verifyBtnText: { color: "#FFF", fontWeight: "bold" },
  uploadProofBtn: { 
  backgroundColor: "#B28900", 
  flexDirection: 'row', 
  alignItems: 'center', 
  paddingVertical: 6, 
  paddingHorizontal: 12, 
  borderRadius: 20, 
  marginTop: 8, 
  alignSelf: 'flex-start' 
},
uploadProofIcon: { fontSize: 12, marginRight: 6 },
uploadProofText: { color: "#000", fontSize: 10, fontWeight: "bold" },
  // Add these inside your StyleSheet
headerRight: {
  flexDirection: "row",
  alignItems: "center",
},
profileCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: PRIMARY_BLUE, // Matches the blue in your image
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 12, // Space between button and icon
},
profileIconText: {
  fontSize: 20,
  color: PRIMARY_BLUE,
},
 profileDropdownItem: { padding: 12, flexDirection: 'row', alignItems: 'center' },
  profileDropdownUserText: { fontSize: 15, fontWeight: '700', color: '#333' },
  dropdownDivider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 10 },
  logoutText: { fontSize: 15, color: '#D9534F', fontWeight: '600', marginLeft: 4 },
  logoutIcon: { color: '#D9534F', fontSize: 18, transform: [{ rotate: '90deg' }] },
  profileDropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 8,
    zIndex: 20, 
  },
});