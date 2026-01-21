import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
// import { useTheme } from "../context/ThemeContext";

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  ambulancesAvailable: number;
  estimatedTime: string;
  phoneNumber: string;
  type: string;
}

interface InsuranceData {
  hasInsurance: boolean;
  provider?: string;
  policyNumber?: string;
}

const AmbulanceBookingScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [verifyingAadhar, setVerifyingAadhar] = useState(false);
  const [insuranceData, setInsuranceData] = useState<InsuranceData | null>(null);

  useEffect(() => {
    // Fetch nearby hospitals within 30 km on component mount
    fetchNearbyHospitals();
  }, []);

  const fetchNearbyHospitals = () => {
    setLoading(true);
    // Simulate API call to get nearby hospitals within 30 km based on user's location
    setTimeout(() => {
      const mockHospitals: Hospital[] = [
        {
          id: 1,
          name: 'Apollo Hospital',
          address: 'Jubilee Hills, Hyderabad',
          distance: '2.3 km',
          ambulancesAvailable: 3,
          estimatedTime: '8 mins',
          phoneNumber: '+91-40-23607777',
          type: 'Multi-specialty',
        },
        {
          id: 2,
          name: 'Care Hospital',
          address: 'Banjara Hills, Hyderabad',
          distance: '3.1 km',
          ambulancesAvailable: 2,
          estimatedTime: '12 mins',
          phoneNumber: '+91-40-61656565',
          type: 'Multi-specialty',
        },
        {
          id: 3,
          name: 'Yashoda Hospital',
          address: 'Somajiguda, Hyderabad',
          distance: '4.5 km',
          ambulancesAvailable: 4,
          estimatedTime: '15 mins',
          phoneNumber: '+91-40-23550000',
          type: 'Super-specialty',
        },
        {
          id: 4,
          name: 'KIMS Hospital',
          address: 'Secunderabad, Hyderabad',
          distance: '4.8 km',
          ambulancesAvailable: 1,
          estimatedTime: '18 mins',
          phoneNumber: '+91-40-44885000',
          type: 'Multi-specialty',
        },
        {
          id: 5,
          name: 'Continental Hospital',
          address: 'Gachibowli, Hyderabad',
          distance: '8.2 km',
          ambulancesAvailable: 2,
          estimatedTime: '25 mins',
          phoneNumber: '+91-40-67041000',
          type: 'Multi-specialty',
        },
        {
          id: 6,
          name: 'Global Hospital',
          address: 'Lakdi-ka-pul, Hyderabad',
          distance: '12.5 km',
          ambulancesAvailable: 3,
          estimatedTime: '30 mins',
          phoneNumber: '+91-40-44777777',
          type: 'Super-specialty',
        },
        {
          id: 7,
          name: 'Medicover Hospital',
          address: 'Madhapur, Hyderabad',
          distance: '15.8 km',
          ambulancesAvailable: 1,
          estimatedTime: '35 mins',
          phoneNumber: '+91-40-68334455',
          type: 'Multi-specialty',
        },
        {
          id: 8,
          name: 'Rainbow Childrens Hospital',
          address: 'Banjara Hills, Hyderabad',
          distance: '18.4 km',
          ambulancesAvailable: 2,
          estimatedTime: '40 mins',
          phoneNumber: '+91-40-44558888',
          type: 'Specialty',
        },
      ];
      setHospitals(mockHospitals);
      setLoading(false);
    }, 1500);
  };

  const validateAadhar = (aadhar: string): boolean => {
    // Remove spaces and check if it's 12 digits
    const cleanAadhar = aadhar.replace(/\s/g, '');
    return /^\d{12}$/.test(cleanAadhar);
  };

  const verifyAadharAndFetchInsurance = async () => {
    if (!validateAadhar(aadharNumber)) {
      Alert.alert('Invalid Aadhar', 'Please enter a valid 12-digit Aadhar number');
      return false;
    }

    setVerifyingAadhar(true);

    // Simulate API call to verify Aadhar and fetch insurance data
    await new Promise<void>(resolve => setTimeout(resolve, 2000));

    // Mock insurance database lookup based on Aadhar
    // In real implementation, this would call a government API or insurance registry
    const mockInsuranceDatabase: { [key: string]: InsuranceData } = {
      '123456789012': {
        hasInsurance: true,
        provider: 'Star Health Insurance',
        policyNumber: 'SH2024567890',
      },
      '234567890123': {
        hasInsurance: true,
        provider: 'ICICI Lombard',
        policyNumber: 'IL2024123456',
      },
      '345678901234': {
        hasInsurance: false,
      },
    };

    const cleanAadhar = aadharNumber.replace(/\s/g, '');
    const insuranceInfo = mockInsuranceDatabase[cleanAadhar] || { hasInsurance: false };

    setInsuranceData(insuranceInfo);
    setVerifyingAadhar(false);

    if (insuranceInfo.hasInsurance) {
      Alert.alert(
        'Insurance Found!',
        `We found an active insurance policy:\n\nProvider: ${insuranceInfo.provider}\nPolicy: ${insuranceInfo.policyNumber}\n\nThis will be used for your ambulance booking.`,
        [{ text: 'OK' }]
      );
    } else {
      return new Promise<boolean>((resolve) => {
        Alert.alert(
          'No Insurance Found',
          'No active health insurance policy found linked to this Aadhar number.\n\nHow would you like to proceed?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Pay Directly',
              onPress: () => resolve(true),
            },
          ]
        );
      });
    }

    return true;
  };

  const handleBookAmbulance = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!patientName.trim()) {
      Alert.alert('Error', 'Please enter patient name');
      return;
    }
    if (!aadharNumber.trim()) {
      Alert.alert('Error', 'Please enter Aadhar number');
      return;
    }

    const verified = await verifyAadharAndFetchInsurance();
    if (verified) {
      confirmBooking();
    }
  };

  const confirmBooking = () => {
    setShowBookingModal(false);
    
    const insuranceMessage = insuranceData?.hasInsurance
      ? `\n\nInsurance: ${insuranceData.provider}\nPolicy: ${insuranceData.policyNumber}`
      : '\n\nPayment: Direct payment at hospital';

    Alert.alert(
      'Booking Confirmed!',
      `Ambulance from ${selectedHospital?.name} is on the way!\n\nPatient: ${patientName}\nAadhar: ${aadharNumber}${insuranceMessage}\n\nEstimated Time: ${selectedHospital?.estimatedTime}\nEmergency Contact: ${selectedHospital?.phoneNumber}`,
      [
        {
          text: 'Track Ambulance',
          onPress: () => {
            // Navigate to tracking screen
          },
        },
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setPatientName('');
            setAadharNumber('');
            setInsuranceData(null);
          },
        },
      ]
    );
  };

  const formatAadhar = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 12 digits
    const limited = cleaned.substring(0, 12);
    
    // Format as XXXX XXXX XXXX
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatted;
  };

  const renderBookingModal = () => (
    <Modal
      visible={showBookingModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowBookingModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Patient Details</Text>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Icon name="close" size={24} color="#131616" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedHospital && (
              <View style={styles.hospitalSummary}>
                <Icon name="local-hospital" size={24} color="#dc2626" />
                <View style={styles.hospitalSummaryText}>
                  <Text style={styles.hospitalSummaryName}>{selectedHospital.name}</Text>
                  <Text style={styles.hospitalSummaryDetail}>
                    {selectedHospital.distance} • {selectedHospital.estimatedTime}
                  </Text>
                </View>
              </View>
            )}

            <View>
              <Text style={styles.inputLabel}>Patient Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter patient's full name"
                placeholderTextColor="#9ca3af"
                value={patientName}
                onChangeText={setPatientName}
              />

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Aadhar Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="XXXX XXXX XXXX"
                placeholderTextColor="#9ca3af"
                value={aadharNumber}
                onChangeText={(text) => setAadharNumber(formatAadhar(text))}
                keyboardType="numeric"
                maxLength={14} // 12 digits + 2 spaces
              />

              {insuranceData && (
                <View style={[
                  styles.infoBox,
                  { backgroundColor: insuranceData.hasInsurance ? '#d1fae5' : '#fee2e2' }
                ]}>
                  <Icon 
                    name={insuranceData.hasInsurance ? "check-circle" : "info-outline"} 
                    size={20} 
                    color={insuranceData.hasInsurance ? "#059669" : "#dc2626"} 
                  />
                  <View style={{ flex: 1 }}>
                    {insuranceData.hasInsurance ? (
                      <>
                        <Text style={[styles.infoText, { color: '#059669', fontWeight: '700' }]}>
                          Insurance Found
                        </Text>
                        <Text style={[styles.infoText, { color: '#059669', marginTop: 4 }]}>
                          Provider: {insuranceData.provider}
                        </Text>
                        <Text style={[styles.infoText, { color: '#059669' }]}>
                          Policy: {insuranceData.policyNumber}
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.infoText, { color: '#dc2626' }]}>
                        No insurance found. Direct payment will be required at the hospital.
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <View style={[styles.infoBox, { marginTop: 16 }]}>
                <Icon name="security" size={20} color="#2563eb" />
                <Text style={styles.infoText}>
                  Your Aadhar will be verified to check for linked health insurance policies
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButtonPrimary, { flex: 1 }]}
              onPress={handleConfirmBooking}
              disabled={verifyingAadhar}
            >
              {verifyingAadhar ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalButtonPrimaryText}>Verify & Confirm Booking</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafaf9" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={20} color="#2d7576" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Ambulance</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Emergency Banner */}
      <View style={styles.emergencyBanner}>
        <Icon name="warning" size={24} color="#dc2626" />
        <Text style={styles.emergencyText}>
          For life-threatening emergencies, call 108 immediately
        </Text>
      </View>

      {/* Hospitals List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2d7576" />
            <Text style={styles.loadingText}>Finding nearby hospitals...</Text>
          </View>
        ) : (
          <>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {hospitals.length} hospitals found within 30 km
              </Text>
              <View style={styles.locationIndicator}>
                <Icon name="my-location" size={16} color="#2d7576" />
                <Text style={styles.locationText}>Hyderabad, Telangana</Text>
              </View>
            </View>

            {hospitals.map((hospital) => (
              <View key={hospital.id} style={styles.hospitalCard}>
                <View style={styles.hospitalHeader}>
                  <View style={styles.hospitalIconContainer}>
                    <Icon name="local-hospital" size={28} color="#dc2626" />
                  </View>
                  <View style={styles.hospitalMainInfo}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalType}>{hospital.type}</Text>
                  </View>
                </View>

                <View style={styles.hospitalDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={16} color="#71717a" />
                    <Text style={styles.detailText}>{hospital.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="directions-car" size={16} color="#71717a" />
                    <Text style={styles.detailText}>
                      {hospital.distance} away • {hospital.estimatedTime} arrival
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="local-shipping" size={16} color="#71717a" />
                    <Text style={styles.detailText}>
                      {hospital.ambulancesAvailable} ambulance{hospital.ambulancesAvailable > 1 ? 's' : ''} available
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="phone" size={16} color="#71717a" />
                    <Text style={styles.detailText}>{hospital.phoneNumber}</Text>
                  </View>
                </View>

                <View style={styles.hospitalActions}>
                  <TouchableOpacity style={styles.callButton}>
                    <Icon name="phone" size={18} color="#2d7576" />
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookNowButton}
                    onPress={() => handleBookAmbulance(hospital)}
                  >
                    <Text style={styles.bookNowButtonText}>Book Now</Text>
                    <Icon name="arrow-forward" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {renderBookingModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fafaf9',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    gap: 12,
  },
  emergencyText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#71717a',
  },
  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#131616',
    marginBottom: 8,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#71717a',
  },
  hospitalCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hospitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hospitalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalMainInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#131616',
    marginBottom: 4,
  },
  hospitalType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d7576',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hospitalDetails: {
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    color: '#52525b',
  },
  hospitalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2d7576',
    gap: 6,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d7576',
  },
  bookNowButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#dc2626',
    gap: 6,
  },
  bookNowButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  hospitalSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 12,
  },
  hospitalSummaryText: {
    flex: 1,
  },
  hospitalSummaryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#131616',
    marginBottom: 2,
  },
  hospitalSummaryDetail: {
    fontSize: 12,
    color: '#71717a',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#131616',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#131616',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1e40af',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#2d7576',
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default AmbulanceBookingScreen;