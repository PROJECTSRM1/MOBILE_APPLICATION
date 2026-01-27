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
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ================= SCREEN ================= */

const AuthScreen = () => {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  /* ===== SHARED ===== */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* ===== REGISTER ONLY ===== */
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [workType, setWorkType] = useState('');

  /* ===== DOCTOR FIELDS ===== */
  const [hospitalName, setHospitalName] = useState('');
  const [certificate, setCertificate] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [designation, setDesignation] = useState('');
  const [workingType, setWorkingType] = useState('');

  /* ===== JUSTRIDE DRIVER FIELDS ===== */
  const [vehicleInsurance, setVehicleInsurance] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [vehicleRC, setVehicleRC] = useState('');
  const [hasPollutionCert, setHasPollutionCert] = useState('');
  const [pollutionCertificate, setPollutionCertificate] = useState('');
  const [yearOfPurchase, setYearOfPurchase] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');

  /* ===== SERVICE OPTIONS ===== */
 const serviceOptions = [
  { label: 'Cleaning & Home Services', value: 1 },
  { label: 'just  Ride', value: 2 },
  { label: 'Buy/Sell/Rental', value: 3 },
  { label: 'Raw Materials', value: 4 },
  { label: 'Education', value: 5 },
  { label: 'Swachify Products', value: 6 },
  { label: 'Health Services', value: 7 }, // ✅ ADD THIS LINE
];


  /* ================= HELPER FUNCTIONS ================= */
  const hasJustRide = selectedServices.includes(2);
  const showDriverFields = hasJustRide && workType === 'looking';
  const hasHealthService = selectedServices.includes(7); // ✅ ADD THIS


  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'All required fields must be filled');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (selectedServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }

    // Additional validation for doctor role
    if (role === 'doctor') {
      if (!hospitalName || !certificate || !yearsOfExperience || !designation || !workingType) {
        Alert.alert('Error', 'All doctor-specific fields must be filled');
        return;
      }
    }

    // Additional validation for JustRide driver
    if (showDriverFields) {
      if (!vehicleInsurance || !driverLicense || !vehicleRC || !yearOfPurchase || !vehicleModel || !hasPollutionCert) {
        Alert.alert('Error', 'All JustRide driver fields must be filled');
        return;
      }
      if (hasPollutionCert === 'yes' && !pollutionCertificate) {
        Alert.alert('Error', 'Please upload pollution certificate');
        return;
      }
    }

    const userProfile: any = {
      firstName,
      lastName,
      email,
      mobile,
      aadhaar,
      location,
      role,
      workType,
      selectedServices,
    };

    // Add doctor-specific fields if role is doctor
    if (role === 'doctor') {
      userProfile.hospitalName = hospitalName;
      userProfile.certificate = certificate;
      userProfile.yearsOfExperience = yearsOfExperience;
      userProfile.designation = designation;
      userProfile.workingType = workingType;
    }

    // Add JustRide driver fields
    if (showDriverFields) {
      userProfile.driverDetails = {
        vehicleInsurance,
        driverLicense,
        vehicleRC,
        hasPollutionCert,
        pollutionCertificate: hasPollutionCert === 'yes' ? pollutionCertificate : null,
        yearOfPurchase,
        vehicleModel,
      };
    }

    try {
      await AsyncStorage.setItem(
        'userProfile',
        JSON.stringify(userProfile),
      );

      await AsyncStorage.setItem('authEmail', email);
      await AsyncStorage.setItem('authPassword', password);

      setActiveTab('login');

      Alert.alert(
        'Success',
        'Registration completed. Please login.',
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('authEmail');
      const storedPassword = await AsyncStorage.getItem('authPassword');

      if (!storedEmail || !storedPassword) {
        Alert.alert('Not Registered', 'Please register first.');
        return;
      }

      if (email !== storedEmail || password !== storedPassword) {
        Alert.alert('Invalid Credentials', 'Email or password is incorrect.');
        return;
      }

      Alert.alert('Login Successful', 'Welcome back!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Landing'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  /* ================= HANDLE SERVICE SELECTION ================= */
 const handleServiceToggle = (serviceValue: number) => {
  setSelectedServices((prev) => {
    let updated;

    if (prev.includes(serviceValue)) {
      updated = prev.filter((s) => s !== serviceValue);
    } else {
      updated = [...prev, serviceValue];
    }

    // ✅ If Health Service removed, reset doctor role
    if (!updated.includes(7) && role === 'doctor') {
      setRole('');
    }

    return updated;
  });
};


  const getSelectedServiceLabels = () => {
    if (selectedServices.length === 0) return 'Select services';
    return serviceOptions
      .filter((s) => selectedServices.includes(s.value))
      .map((s) => s.label)
      .join(', ');
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
              <Text
                style={activeTab === 'login'
                  ? styles.activeText
                  : styles.inactiveText}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'register' && styles.activeTab]}
              onPress={() => setActiveTab('register')}
            >
              <Text
                style={activeTab === 'register'
                  ? styles.activeText
                  : styles.inactiveText}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* REGISTER */}
          {activeTab === 'register' && (
            <>
              <Text style={styles.title}>Create Account</Text>

              {/* SELECT SERVICES DROPDOWN */}
              <Text style={styles.label}>Select Services *</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowServiceModal(true)}
              >
                <Text
                  style={[
                    styles.dropdownTriggerText,
                    selectedServices.length === 0 && styles.placeholderText,
                  ]}
                  numberOfLines={2}
                >
                  {getSelectedServiceLabels()}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              <Input label="First Name" value={firstName} onChange={setFirstName} />
              <Input label="Last Name" value={lastName} onChange={setLastName} />
              <Input label="Mobile Number" value={mobile} onChange={setMobile} />
              <Input label="Email ID" value={email} onChange={setEmail} />
              <Input label="Password" value={password} onChange={setPassword} secure />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                secure
              />
              <Input label="Aadhaar Number" value={aadhaar} onChange={setAadhaar} />
              <Input label="Location" value={location} onChange={setLocation} />

            {hasHealthService && (
  <>
    <Text style={styles.label}>Select Role</Text>
    <View style={styles.dropdownWrapper}>
      <Picker
        selectedValue={role}
        onValueChange={setRole}
        style={styles.picker}
        dropdownIconColor="#ffffff"
      >
        <Picker.Item label="Select role" value="" />
        <Picker.Item label="Doctor" value="doctor" />
      </Picker>
    </View>
  </>
)}


              {/* DOCTOR-SPECIFIC FIELDS */}
              {role === 'doctor' && (
                <>
                  <Input label="Hospital Name" value={hospitalName} onChange={setHospitalName} />
                  <Input label="Certificate" value={certificate} onChange={setCertificate} />
                  <Input label="Years of Experience" value={yearsOfExperience} onChange={setYearsOfExperience} />
                  <Input label="Designation" value={designation} onChange={setDesignation} />

                  <Text style={styles.label}>Select Working Type</Text>
                  <View style={styles.dropdownWrapper}>
                    <Picker
                      selectedValue={workingType}
                      onValueChange={setWorkingType}
                      style={styles.picker}
                      dropdownIconColor="#ffffff"
                    >
                      <Picker.Item label="Choose working type" value="" />
                      <Picker.Item label="Online" value="online" />
                      <Picker.Item label="Offline" value="offline" />
                      <Picker.Item label="Both" value="both" />
                    </Picker>
                  </View>
                </>
              )}

            {role !== 'doctor' && (
  <>
    <Text style={styles.label}>Select Work Type</Text>

    <View style={styles.dropdownWrapper}>
      <Picker
        selectedValue={workType}
        onValueChange={setWorkType}
        style={styles.picker}
        dropdownIconColor="#ffffff"
      >
        <Picker.Item label="Choose work type" value="" />
        <Picker.Item label="Assigning for work" value="assigning" />
        <Picker.Item label="Looking for Work" value="looking" />
        <Picker.Item label="Both" value="both" />
      </Picker>
    </View>
  </>
)}


              {/* JUSTRIDE DRIVER FIELDS */}
              {showDriverFields && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Driver Details</Text>
                  </View>

                  <Input 
                    label="Vehicle Insurance" 
                    value={vehicleInsurance} 
                    onChange={setVehicleInsurance} 
                  />
                  
                  <Input 
                    label="Driver License" 
                    value={driverLicense} 
                    onChange={setDriverLicense} 
                  />
                  
                  <Input 
                    label="Vehicle Registration Certificate (RC)" 
                    value={vehicleRC} 
                    onChange={setVehicleRC} 
                  />

                  <Text style={styles.label}>Pollution Certificate</Text>
                  <View style={styles.dropdownWrapper}>
                    <Picker
                      selectedValue={hasPollutionCert}
                      onValueChange={setHasPollutionCert}
                      style={styles.picker}
                      dropdownIconColor="#ffffff"
                    >
                      <Picker.Item label="Do you have pollution certificate?" value="" />
                      <Picker.Item label="Yes" value="yes" />
                      <Picker.Item label="No" value="no" />
                    </Picker>
                  </View>

                  {hasPollutionCert === 'yes' && (
                    <Input 
                      label="Upload Pollution Certificate" 
                      value={pollutionCertificate} 
                      onChange={setPollutionCertificate}
                      placeholder="Certificate number or upload path"
                    />
                  )}

                  <Input 
                    label="Year of Purchase" 
                    value={yearOfPurchase} 
                    onChange={setYearOfPurchase}
                    placeholder="e.g., 2020"
                  />
                  
                  <Input 
                    label="Vehicle Model" 
                    value={vehicleModel} 
                    onChange={setVehicleModel}
                    placeholder="e.g., Honda City"
                  />
                </>
              )}

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleRegister}
              >
                <Text style={styles.primaryText}>Register</Text>
              </TouchableOpacity>

              <SocialSection />
            </>
          )}

          {/* LOGIN */}
          {activeTab === 'login' && (
            <>
              <Text style={styles.title}>Welcome Back</Text>

              <Input label="Email ID" value={email} onChange={setEmail} />
              <Input label="Password" value={password} onChange={setPassword} secure />

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleLogin}
              >
                <Text style={styles.primaryText}>Log In →</Text>
              </TouchableOpacity>

              <Text style={styles.link}>Forgot Password?</Text>
              <SocialSection />
            </>
          )}
        </View>
      </ScrollView>

      {/* SERVICE SELECTION MODAL */}
      <Modal
        visible={showServiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Services</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}
             contentContainerStyle={{ paddingBottom: 120 }} 
            >
              {serviceOptions.map((service) => (
                <TouchableOpacity
                  key={service.value}
                  style={styles.modalOption}
                  onPress={() => handleServiceToggle(service.value)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedServices.includes(service.value) && styles.checkboxChecked,
                    ]}
                  >
                    {selectedServices.includes(service.value) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.modalOptionText}>{service.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setShowServiceModal(false)}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

/* ================= COMPONENTS ================= */

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

const SocialSection = () => (
  <>
    <Text style={styles.or}>OR CONTINUE WITH</Text>
    <View style={styles.socialRow}>
      <SocialBtn text="G" />
      <SocialBtn text="" />
      <SocialBtn text="in" />
    </View>
    <Text style={styles.terms}>
      By continuing, you agree to our Terms of Service and Privacy Policy.
    </Text>
  </>
);

const SocialBtn = ({ text }: any) => (
  <TouchableOpacity style={styles.socialBtn}>
    <Text style={styles.socialText}>{text}</Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },

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

  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#fff' },

  label: { fontWeight: '600', marginBottom: 6, color: '#e5e7eb' },
  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: '#fff',
  },

  // Section Header
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },

  // Dropdown Trigger Styles
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
    flex: 1,
    fontSize: 14,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  dropdownArrow: {
    color: '#9ca3af',
    fontSize: 12,
    marginLeft: 8,
  },

  dropdownWrapper: {
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 14,
  },
  picker: { color: '#fff' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0b1220',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
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
    fontWeight: '300',
  },
  modalScrollView: {
    padding: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4b5563',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOptionText: {
    color: '#e5e7eb',
    fontSize: 15,
    flex: 1,
  },
 modalDoneBtn: {
  backgroundColor: '#2563eb',
  marginHorizontal: 20,
  marginBottom: 30, // ✅ MORE SPACE FROM LIST
  padding: 16,
  borderRadius: 14,
  alignItems: 'center',
},

  modalDoneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  primaryBtn: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  link: { textAlign: 'center', color: '#3b82f6', marginTop: 14 },

  or: { textAlign: 'center', marginVertical: 20, color: '#9ca3af' },

  socialRow: { flexDirection: 'row', justifyContent: 'space-between' },
  socialBtn: {
    flex: 1,
    marginHorizontal: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  socialText: { fontWeight: '700', fontSize: 18, color: '#fff' },

  terms: { textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 },
});

export default AuthScreen;