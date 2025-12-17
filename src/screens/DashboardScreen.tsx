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
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";

// Shared data import
import { GlobalAppData } from "./FreelancerPremiumScreen";

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

/**
 * FIXED: ProfileDropdown moved outside to fix the syntax error
 */
const ProfileDropdown = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.profileDropdown}>
    <View style={styles.profileDropdownItem}>
      <Text style={styles.profileDropdownUserText}>User</Text>
    </View>
    <View style={styles.dropdownDivider} />
    <TouchableOpacity 
      style={styles.profileDropdownItem} 
      onPress={() => {
        onClose();
        Alert.alert("Logout", "You have been logged out.");
      }}
    >
      <Text style={styles.logoutIcon}>⟲ </Text>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
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

const TrackerStep = ({ 
  number, 
  title, 
  desc, 
  active, 
  completed 
}: { 
  number: string; 
  title: string; 
  desc: string; 
  active?: boolean; 
  completed?: boolean; 
}) => (
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
  
  // State for toggling profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const isMobile = Dimensions.get("window").width < 768;

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
            
            <Text style={styles.otpHint}>OTP: 933547</Text>

            <div style={styles.otpActionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowOtpModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp}>
                <Text style={styles.verifyBtnText}>Verify & Continue</Text>
              </TouchableOpacity>
            </div>
          </View>
        </View>
      </Modal>

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SWACHIFY INDIA</Text>
          <Text style={styles.portal}>Freelancer Portal</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate("FreelancerPremiumFlow")}
          >
            <Text style={styles.backText}>← Back To Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileCircle}
            onPress={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu Overlay */}
        {showProfileDropdown && (
          <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />
        )}
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
                <TrackerStep number="3" title="Job Started" desc="Service in progress" active={currentStep >= 3} completed={currentStep > 3} />
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
  header: { 
    backgroundColor: "#FFF", 
    padding: 16, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    elevation: 4,
    zIndex: 1000 // Ensuring dropdown is on top
  },
  brand: { fontSize: 18, fontWeight: "900", color: PRIMARY_BLUE },
  portal: { fontSize: 12, color: "#777" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  backBtn: { backgroundColor: "#EEE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  backText: { fontWeight: "600" },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  profileIconText: { fontSize: 20, color: PRIMARY_BLUE },
  profileDropdown: {
    position: 'absolute',
    top: 65,
    right: 16,
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 8,
    zIndex: 2000,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  profileDropdownItem: { padding: 12, flexDirection: 'row', alignItems: 'center' },
  profileDropdownUserText: { fontSize: 15, fontWeight: '700', color: '#333' },
  dropdownDivider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 10 },
  logoutText: { fontSize: 15, color: '#D9534F', fontWeight: '600', marginLeft: 4 },
  logoutIcon: { color: '#D9534F', fontSize: 18 },
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
});