import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { 
  ArrowLeft, Mic, MicOff, Phone, Video, 
  ClipboardCheck, Microscope, 
  ShoppingBag, MapPin,
  Download,
  FileText
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TelemedicineConsultation: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isMuted, setIsMuted] = useState(false);
  
  const [showPrescription, setShowPrescription] = useState(false);
  const [showTests, setShowTests] = useState(false);
  
  // Static data (as if received from an API/Doctor)
  const tablets = [
    { id: '1', name: 'Amoxicillin', dosage: '500mg - Twice daily' },
    { id: '2', name: 'Paracetamol', dosage: '650mg - As needed' }
  ];
  
  const labTests = [
    { id: '1', name: 'Complete Blood Count (CBC)' },
    { id: '2', name: 'Thyroid Profile' }
  ];

  const togglePrescription = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPrescription(!showPrescription);
  };

  const toggleTests = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowTests(!showTests);
  };

  // Logic for "Real" Download simulation
  const handleDownload = async (type: string) => {
    Alert.alert("Downloading...", `Saving your ${type} as PDF to your local storage.`);
    
    // Note: In a production app, you would use:
    // 1. react-native-blob-util to download a PDF from a URL
    // 2. OR react-native-html-to-pdf to generate a PDF from this list
    
    setTimeout(() => {
      Alert.alert("Success", "File saved to /Downloads/Prescription_Jan20.pdf");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#1a7f7f" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.doctorName}>Dr. Julianne Smith</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE CONSULTATION</Text>
          </View>
        </View>
        <View style={{width: 44}} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video Call Section */}
        <View style={styles.videoWrapper}>
          <View style={styles.videoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800' }}
              style={styles.videoBackground}
            />
            <View style={styles.pipContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }}
                style={styles.pipImage}
              />
            </View>
            <View style={styles.controlsContainer}>
              <View style={styles.controlsBlur}>
                <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.controlButton}>
                  {isMuted ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.endCallButton} onPress={() => navigation.goBack()}>
                  <Phone size={24} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Video size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Medical Documents</Text>
          <Text style={styles.sectionSubtitle}>View and download your digital records</Text>

          {/* DIGITAL PRESCRIPTION SECTION */}
          <View style={[styles.mainCard, showPrescription && styles.activeCard]}>
            <TouchableOpacity style={styles.cardHeader} onPress={togglePrescription}>
              <View style={styles.iconBox}>
                <ClipboardCheck size={24} color="#1a7f7f" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Digital Prescription</Text>
                <Text style={styles.cardSubtitle}>{tablets.length} Medicines prescribed</Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadIconBtn} 
                onPress={() => handleDownload('Prescription')}
              >
                <Download size={20} color="#1a7f7f" />
              </TouchableOpacity>
            </TouchableOpacity>

            {showPrescription && (
              <View style={styles.expandedContent}>
                <View style={styles.listHeader}>
                  <FileText size={16} color="#64748b" />
                  <Text style={styles.listHeaderText}>Official Medicine List</Text>
                </View>

                {tablets.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemNameText}>{item.name}</Text>
                      <Text style={styles.itemDetailText}>{item.dosage}</Text>
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={styles.ctaButton}
                  onPress={() => navigation.navigate("Facility", { 
                    activeTab: 'pharmacy', 
                    prescribedItems: tablets 
                  })}
                >
                  <ShoppingBag size={18} color="#fff" />
                  <Text style={styles.ctaButtonText}>Order Medicines Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* RECOMMENDED TESTS SECTION */}
          <View style={[styles.mainCard, showTests && styles.activeCard]}>
            <TouchableOpacity style={styles.cardHeader} onPress={toggleTests}>
              <View style={styles.iconBoxSecondary}>
                <Microscope size={24} color="#1a7f7f" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Lab Test Requisition</Text>
                <Text style={styles.cardSubtitle}>{labTests.length} Tests required</Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadIconBtn} 
                onPress={() => handleDownload('Lab Requisition')}
              >
                <Download size={20} color="#1a7f7f" />
              </TouchableOpacity>
            </TouchableOpacity>

            {showTests && (
              <View style={styles.expandedContent}>
                <View style={styles.listHeader}>
                  <FileText size={16} color="#64748b" />
                  <Text style={styles.listHeaderText}>Required Lab Procedures</Text>
                </View>

                {labTests.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemNameText}>{item.name}</Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity 
                    style={[styles.ctaButton, {backgroundColor: '#0f172a'}]}
                    onPress={() => navigation.navigate("Facility", { 
                      activeTab: 'lab', 
                      prescribedItems: labTests 
                    })}
                  >
                    <MapPin size={18} color="#fff" />
                    <Text style={styles.ctaButtonText}>Find Nearby Labs</Text>
                  </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f9f9', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  doctorName: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center' },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80', marginRight: 6 },
  liveText: { fontSize: 11, color: '#1a7f7f', fontWeight: '700' },
  videoWrapper: { padding: 16 },
  videoContainer: { width: '100%', height: 350, borderRadius: 24, overflow: 'hidden', backgroundColor: '#000' },
  videoBackground: { width: '100%', height: '100%' },
  pipContainer: { position: 'absolute', top: 12, right: 12, width: 80, height: 110, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' },
  pipImage: { width: '100%', height: '100%' },
  controlsContainer: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  controlsBlur: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 30, alignItems: 'center', gap: 15 },
  controlButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  endCallButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f87171', alignItems: 'center', justifyContent: 'center' },
  
  contentSection: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  sectionSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20 },

  mainCard: { 
    backgroundColor: '#f8fafc', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  activeCard: {
    borderColor: '#1a7f7f',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#1a7f7f',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#e0f2f1', alignItems: 'center', justifyContent: 'center' },
  iconBoxSecondary: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  cardHeaderText: { marginLeft: 15, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  cardSubtitle: { fontSize: 12, color: '#94a3b8' },
  downloadIconBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },

  expandedContent: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 },
  listHeaderText: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f8fafc', padding: 15, borderRadius: 16 },
  itemInfo: { flex: 1 },
  itemNameText: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  itemDetailText: { fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: '500' },
  
  ctaButton: { 
    backgroundColor: '#1a7f7f', 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15 
  },
  ctaButtonText: { color: '#fff', fontWeight: '700', fontSize: 14, marginLeft: 8 }
});
 
export default TelemedicineConsultation;