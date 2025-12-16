import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
// IMPORT FIX: Use destructuring for direct access to the library method
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

// Shared data import
import { GlobalAppData } from "./FreelancerPremiumScreen";

// 1. Explicit interface for Job objects
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

// =======================================================
// 1. NAVIGATION TYPES
// =======================================================
type RootStackParamList = {
  AvailableRequestsScreen: undefined;
  DashboardScreen: undefined;
  FreelancerPremiumFlow: undefined;
  [key: string]: object | undefined;
};

type DashboardScreenNavigationProp = NavigationProp<RootStackParamList>;

// =======================================================
// 2. REUSABLE COMPONENTS
// =======================================================

const JobSection = ({
  title,
  subtitle,
  emptyMessage,
  icon,
}: {
  title: string;
  subtitle: string;
  emptyMessage: string;
  icon: string;
}) => (
  <View style={styles.jobSection}>
    <Text style={styles.jobTitle}>{title}</Text>
    <Text style={styles.jobSubtitle}>{subtitle}</Text>
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBox}>
        <Text style={styles.emptyIcon}>{icon}</Text>
      </View>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  </View>
);

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

const TrackerStep = ({ number, title, desc, active, completed, action }: { number: string; title: string; desc: string; active?: boolean; completed?: boolean; action?: React.ReactNode }) => (
  <View style={{ marginBottom: 12 }}>
    <View style={styles.stepRow}>
      <View style={[styles.stepIndicator, active && styles.stepIndicatorActive]}>
        <Text style={[styles.stepNum, active && styles.stepNumActive]}>{completed ? "✓" : number}</Text>
      </View>
      <View style={styles.stepTextContent}>
        <Text style={[styles.stepTitle, active && styles.stepTitleActive]}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>
    </View>
    {active && !completed && action}
  </View>
);

// =======================================================
// 3. MAIN SCREEN
// =======================================================
export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1); 
  const [pendingList, setPendingList] = useState<JobRequest[]>(GlobalAppData.pendingList || []);
  const [activeJob, setActiveJob] = useState<JobRequest | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleStartJob = (job: JobRequest) => {
    if (activeJob) {
      setShowAlert(true);
      return;
    }
    const jobWithContacts = {
        ...job,
        phone: "+91 98765 00003",
        email: "amit.singh@example.com"
    };
    setActiveJob(jobWithContacts);
    const newList = pendingList.filter((item: JobRequest) => item.id !== job.id);
    setPendingList(newList);
    GlobalAppData.pendingCount = newList.length;
  };

  // UPDATED: Robust gallery opening logic
  const handleImageUpload = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1, // Only 1 for now based on your state
    };

    try {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to open gallery');
        } else if (response.assets && response.assets.length > 0) {
          setUploadedImage(response.assets[0].uri || null);
          Alert.alert("Success", "Proof selected from gallery!");
        }
      });
    } catch (error) {
      Alert.alert("Error", "Could not open gallery. Ensure the app has permissions.");
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      setShowOtpModal(true);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev: number) => prev + 1);
    } else {
      Alert.alert("Complete Job", "Has the work been finished?", [
        { text: "No" },
        { text: "Yes", onPress: () => { setActiveJob(null); setCurrentStep(1); setUploadedImage(null); }}
      ]);
    }
  };

  const verifyOtp = () => {
    if (otpInput === "933547") { 
      setShowOtpModal(false);
      setOtpInput("");
      setCurrentStep(3); 
    } else {
      Alert.alert("Invalid OTP", "Please enter the correct 6-digit OTP.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Alert Modal */}
      <Modal transparent visible={showAlert} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Complete current active job</Text>
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
            
            <Text style={styles.otpHint}>OTP: 933547</Text>

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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("FreelancerPremiumFlow")}
        >
          <Text style={styles.backText}>← Back To Requests</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard Overview</Text>
        <Text style={styles.subtitle}>Track your performance at a glance</Text>

        <View style={styles.cardRow}>
          <StatCard title="Total Earnings" value="₹0" desc="From 0 completed jobs" color={PRIMARY_BLUE} />
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
            <View style={styles.activeJobContainer}>
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

              <View style={styles.trackerSide}>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>Live job status</Text>
                </View>
                
                <TrackerStep number="1" title="On the way" desc="Traveling" active={currentStep >= 1} completed={currentStep > 1} />
                <TrackerStep number="2" title="Reached location" desc="At address" active={currentStep >= 2} completed={currentStep > 2} />
                
                <TrackerStep 
                  number="3" 
                  title="Job Started" 
                  desc={uploadedImage ? "✅ Proof Selected" : "Mandatory multiple image proof required."} 
                  active={currentStep >= 3} 
                  completed={currentStep > 3}
                  action={
                    currentStep === 3 && (
                      <TouchableOpacity 
                        style={[styles.moveNextBtn, { backgroundColor: uploadedImage ? '#2E7D32' : '#A58114', marginTop: 8, paddingVertical: 8, width: '90%' }]}
                        onPress={handleImageUpload}
                      >
                        <Text style={[styles.moveNextText, { fontSize: 10, color: '#FFF' }]}>
                            {uploadedImage ? "Change Proof" : "📤 Capture / Upload proof"}
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                />
                
                <TrackerStep number="4" title="Job Completed" desc="Confirm finish" active={currentStep >= 4} />
                
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

        <JobSection
          title="Recently Completed"
          subtitle="Jobs you have successfully finished"
          emptyMessage="You haven't completed any jobs yet."
          icon="✅"
        />
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
  jobCardCategory: { fontSize: 16, fontWeight: "700", color: "#333" },
  jobCardPrice: { fontSize: 18, fontWeight: "900", color: "#2E7D32" },
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
  
  activeJobContainer: { 
    backgroundColor: "#FFF", 
    borderRadius: 12, 
    flexDirection: "row", 
    elevation: 8, 
    minHeight: 320, 
    overflow: "hidden",
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 10
  },
  activeInfoSide: { 
    flex: 1.4, 
    padding: 15,
    justifyContent: 'space-between' 
  },
  inProgressBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE
  },
  inProgressText: { color: PRIMARY_BLUE, fontSize: 10, fontWeight: 'bold' },
  metaMini: { fontSize: 10, color: '#888' },
  customerDetailsBox: { 
    backgroundColor: "#F9FAFB", 
    borderRadius: 8, 
    padding: 12, 
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 10
  },
  customerName: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  customerMetaLine: { fontSize: 11, color: PRIMARY_BLUE, marginBottom: 2 },
  currentStageRow: { backgroundColor: '#E1F5FE', padding: 10, borderRadius: 8, marginBottom: 5 },
  helpLink: { paddingVertical: 5 },
  
  trackerSide: { 
    flex: 1, 
    backgroundColor: "#101D2D", 
    padding: 12,
    justifyContent: 'center' 
  },
  liveBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center'
  },
  liveBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  stepRow: { flexDirection: "row", alignItems: 'center' },
  stepIndicator: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    borderWidth: 1, 
    borderColor: '#455A64', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 10
  },
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
  alertTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  alertMessage: { color: "#666", marginBottom: 20 },
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
});