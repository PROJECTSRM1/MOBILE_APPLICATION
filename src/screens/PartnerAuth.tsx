import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ================= SCREEN ================= */

const PartnerAuth = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  /* ===== LOGIN ===== */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* ===== REGISTER ===== */
  const [partnerName, setPartnerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [partnersCount, setPartnersCount] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);

  const modules = [
    { label: 'Education', value: 'education' },
    { label: 'Buy / Sell / Rent', value: 'marketplace' },
    { label: 'Health Care', value: 'healthcare' },
    { label: 'Swachify Products', value: 'swachify' },
    { label: 'Just Ride', value: 'justride' },
  ];

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    if (
      !partnerName ||
      !companyName ||
      !gstNumber ||
      !partnersCount ||
      !email ||
      !password ||
      !selectedModule
    ) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const count = Number(partnersCount);
    if (count < 2 || count > 20) {
      Alert.alert('Error', 'Partners must be between 2 and 20');
      return;
    }

    const partnerProfile = {
      role: 'partner',
      partnerName,
      companyName,
      gstNumber,
      partnersCount: count,
      email,
      module: selectedModule,
    };

    await AsyncStorage.setItem(
      'partnerProfile',
      JSON.stringify(partnerProfile),
    );

    await AsyncStorage.setItem('partnerEmail', email);
    await AsyncStorage.setItem('partnerPassword', password);

    Alert.alert('Success', 'Partner registered successfully');
    setActiveTab('login');
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    const storedEmail = await AsyncStorage.getItem('partnerEmail');
    const storedPassword = await AsyncStorage.getItem('partnerPassword');
    const profile = await AsyncStorage.getItem('partnerProfile');

    if (!storedEmail || !storedPassword || !profile) {
      Alert.alert('Error', 'Partner not registered');
      return;
    }

    if (email !== storedEmail || password !== storedPassword) {
      Alert.alert('Error', 'Invalid credentials');
      return;
    }

    const parsed = JSON.parse(profile);

    const dashboardMap: any = {
      education: 'EducationPartnerDashboard',
      marketplace: 'buysellPartnerDashboard',
      healthcare: 'HealthcarePartnerDashboard',
      swachify: 'SwachifyPartnerScreen',
      justride: 'DriverDashboard',
    };

    navigation.replace(dashboardMap[parsed.module]);
  };

  /* ================= UI ================= */

  return (
    <LinearGradient colors={['#020617', '#020617']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>

          {/* TABS */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={activeTab === 'login' ? styles.activeText : styles.inactiveText}>
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'register' && styles.activeTab]}
              onPress={() => setActiveTab('register')}
            >
              <Text style={activeTab === 'register' ? styles.activeText : styles.inactiveText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* REGISTER */}
          {activeTab === 'register' && (
            <>
              <Text style={styles.title}>Partner Registration</Text>

              <Input label="Partner Name" value={partnerName} onChange={setPartnerName} />
              <Input label="Company / Firm Name" value={companyName} onChange={setCompanyName} />
              <Input label="GST Number" value={gstNumber} onChange={setGstNumber} />
              <Input
                label="Number of Partners"
                value={partnersCount}
                onChange={setPartnersCount}
                placeholder="Min 2, Max 20"
              />
              <Input label="Email ID" value={email} onChange={setEmail} />
              <Input label="Password" value={password} onChange={setPassword} secure />

              {/* MODULE SELECT */}
              <Text style={styles.label}>Select Module *</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowModuleModal(true)}
              >
                <Text style={styles.dropdownTriggerText}>
                  {selectedModule
                    ? modules.find(m => m.value === selectedModule)?.label
                    : 'Choose module'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                <Text style={styles.primaryText}>Register</Text>
              </TouchableOpacity>
            </>
          )}

          {/* LOGIN */}
          {activeTab === 'login' && (
            <>
              <Text style={styles.title}>Partner Login</Text>
              <Input label="Email ID" value={email} onChange={setEmail} />
              <Input label="Password" value={password} onChange={setPassword} secure />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
                <Text style={styles.primaryText}>Log In →</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* MODULE MODAL */}
      <Modal visible={showModuleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Module</Text>
              <TouchableOpacity onPress={() => setShowModuleModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {modules.map(m => (
              <TouchableOpacity
                key={m.value}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedModule(m.value);
                  setShowModuleModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

/* ================= INPUT ================= */

const Input = ({ label, value, onChange, secure, placeholder }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      secureTextEntry={secure}
      onChangeText={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      placeholderTextColor="#9ca3af"
    />
  </>
);

export default PartnerAuth;


const styles = StyleSheet.create({
  container: { flex: 1 },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },

  card: {
    backgroundColor: '#0b1220',
    borderRadius: 20,
    padding: 20,
  },

  tabs: { flexDirection: 'row', marginBottom: 20 },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
  },

  activeTab: { borderBottomColor: '#2563eb' },

  activeText: { fontWeight: '700', color: '#fff' },
  inactiveText: { color: '#9ca3af' },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },

  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#e5e7eb',
  },

  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: '#fff',
  },

  dropdownTrigger: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownTriggerText: {
    color: '#fff',
    fontSize: 14,
  },

  dropdownArrow: {
    color: '#9ca3af',
    fontSize: 12,
  },

  primaryBtn: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#0b1220',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  modalClose: {
    fontSize: 24,
    color: '#9ca3af',
  },

  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },

  modalOptionText: {
    color: '#e5e7eb',
    fontSize: 15,
  },
});
