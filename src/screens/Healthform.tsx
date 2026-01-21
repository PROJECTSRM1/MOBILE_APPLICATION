import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const ConsultationRequestScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [sufferingDays, setSufferingDays] = useState<string>('');
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);
  const [selectedDoctorType, setSelectedDoctorType] = useState<string>('General Practitioner');
  const [showDoctorTypePicker, setShowDoctorTypePicker] = useState<boolean>(false);
  
  // Booking flow states
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  const [canConnect, setCanConnect] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(60); // 5 minutes in seconds

  // Check if all required fields are filled
  const isFormComplete = description.trim() !== '' && 
                         sufferingDays.trim() !== '' && 
                         hasInsurance !== null &&
                         selectedDoctor !== null;

  const doctorTypes = [
    'General Practitioner',
    'Cardiologist',
    'Dermatologist',
    'Psychiatrist',
    'Ophthalmologist',
  ];

  const allDoctors = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      type: 'General Practitioner',
      experience: '12 years experience',
      rating: 4.9,
      availableTime: '2:00 PM',
      status: 'AVAILABLE NOW',
      statusColor: '#2d7576',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Dr. Sarah Miller',
      type: 'General Practitioner',
      experience: '8 years experience',
      rating: 4.8,
      availableTime: '4:30 PM',
      status: 'STARTS IN 30 MIN',
      statusColor: '#2d7576',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Dr. Michael Roberts',
      type: 'Cardiologist',
      experience: '15 years experience',
      rating: 4.9,
      availableTime: '3:00 PM',
      status: 'AVAILABLE NOW',
      statusColor: '#2d7576',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    },
    {
      id: 4,
      name: 'Dr. Emily Chen',
      type: 'Cardiologist',
      experience: '10 years experience',
      rating: 4.7,
      availableTime: '5:00 PM',
      status: 'STARTS IN 1 HR',
      statusColor: '#2d7576',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    },
    {
      id: 5,
      name: 'Dr. David Park',
      type: 'Dermatologist',
      experience: '9 years experience',
      rating: 4.8,
      availableTime: '1:30 PM',
      status: 'AVAILABLE NOW',
      statusColor: '#2d7576',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    },
    {
      id: 6,
      name: 'Dr. Lisa Anderson',
      type: 'Psychiatrist',
      experience: '11 years experience',
      rating: 5.0,
      availableTime: '2:30 PM',
      status: 'AVAILABLE NOW',
      statusColor: '#2d7576',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    },
    {
      id: 7,
      name: 'Dr. Robert Lee',
      type: 'Ophthalmologist',
      experience: '14 years experience',
      rating: 4.9,
      availableTime: '6:00 PM',
      status: 'STARTS IN 45 MIN',
      statusColor: '#2d7576',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    },
  ];

  const doctors = allDoctors.filter(doctor => doctor.type === selectedDoctorType);
  const selectedDoctorData = allDoctors.find(doc => doc.id === selectedDoctor);

  useEffect(() => {
    if (isPaymentComplete && !canConnect && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setCanConnect(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaymentComplete, canConnect, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBookAppointment = () => {
    if (!isFormComplete) {
      Alert.alert('Incomplete Form', 'Please fill all required fields and select a doctor.');
      return;
    }
    
    Alert.alert(
      'Payment Required',
      'Proceed to PhonePe for payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            setTimeout(() => {
              setIsBooked(true);
              setIsPaymentComplete(true);
              Alert.alert('Success', 'Payment completed! Your appointment is booked.');
            }, 1500);
          },
        },
      ]
    );
  };

  if (isBooked && isPaymentComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#131616" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Confirmed</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <View style={styles.confirmationCard}>
            <View style={styles.successIconContainer}>
              <Icon name="check-circle" size={80} color="#10b981" />
            </View>
            <Text style={styles.confirmationTitle}>Appointment Booked!</Text>
            <Text style={styles.confirmationSubtitle}>Payment completed successfully</Text>

            {selectedDoctorData && (
              <View style={styles.appointmentDetails}>
                <Image source={{ uri: selectedDoctorData.image }} style={styles.doctorImageSmall} />
                <View style={styles.doctorDetailsSmall}>
                  <Text style={styles.doctorNameSmall}>{selectedDoctorData.name}</Text>
                  <Text style={styles.doctorSpecialtySmall}>{selectedDoctorType}</Text>
                  <View style={styles.timeInfoContainer}>
                    <Icon name="schedule" size={16} color="#2d7576" />
                    <Text style={styles.appointmentTimeText}>
                      Scheduled at {selectedDoctorData.availableTime}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {!canConnect && (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingText}>Your consultation will start in:</Text>
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.waitingSubtext}>Please wait while we prepare your session</Text>
              </View>
            )}
          </View>

          {/* <View style={styles.specialistsHeader}>
            <Text style={styles.specialistsTitle}>Specialists</Text>
            <View style={styles.nearbyBadge}>
              <Text style={styles.nearbyText}>{doctors.length} Available</Text>
            </View>
          </View> */}

          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.doctorsScroll}
            contentContainerStyle={styles.doctorsScrollContent}
          >
            {doctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
                <View style={styles.ratingBadge}>
                  <Icon name="star" size={16} color="#eab308" />
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                </View>
                <View style={styles.doctorCardContent}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorExperience}>{doctor.experience}</Text>
                  <View style={styles.statusBadge}>
                    <Icon name="schedule" size={16} color={doctor.statusColor} />
                    <Text style={[styles.statusText, { color: doctor.statusColor }]}>
                      Available at {doctor.availableTime}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView> */}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.connectButton, !canConnect && styles.connectButtonDisabled]}
            disabled={!canConnect}
            onPress={() => {
              if (canConnect) {
                navigation.navigate('Telecom');
              }
            }}
          >
            <Icon name="videocam" size={24} color="#ffffff" />
            <Text style={styles.connectButtonText}>
              {canConnect ? 'Connect Online Now' : 'Please Wait...'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#131616" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation Request</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Icon name="info" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DOCTOR SPECIALIZED</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowDoctorTypePicker(true)}
          >
            <Text style={styles.dropdownText}>{selectedDoctorType}</Text>
            <Icon name="unfold-more" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your symptoms or health concerns in detail..."
            placeholderTextColor="#cbd5e1"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HOW MANY DAYS ARE YOU SUFFERING?</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter number of days (e.g., 3)"
            placeholderTextColor="#cbd5e1"
            keyboardType="numeric"
            value={sufferingDays}
            onChangeText={setSufferingDays}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DO YOU HAVE HEALTH INSURANCE?</Text>
          <View style={styles.insuranceContainer}>
            <TouchableOpacity
              style={[
                styles.insuranceButton,
                hasInsurance === true && styles.insuranceButtonSelected,
              ]}
              onPress={() => setHasInsurance(true)}
            >
              <View style={styles.radioOuter}>
                {hasInsurance === true && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.insuranceText,
                  hasInsurance === true && styles.insuranceTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.insuranceButton,
                hasInsurance === false && styles.insuranceButtonSelected,
              ]}
              onPress={() => setHasInsurance(false)}
            >
              <View style={styles.radioOuter}>
                {hasInsurance === false && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.insuranceText,
                  hasInsurance === false && styles.insuranceTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {(description.trim() !== '' && sufferingDays.trim() !== '' && hasInsurance !== null) && (
          <>
            <View style={styles.specialistsHeader}>
              <Text style={styles.specialistsTitle}>Specialists</Text>
              <View style={styles.nearbyBadge}>
                <Text style={styles.nearbyText}>{doctors.length} Nearby</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.doctorsScroll}
              contentContainerStyle={styles.doctorsScrollContent}
            >
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <TouchableOpacity
                    key={doctor.id}
                    style={[
                      styles.doctorCard,
                      selectedDoctor === doctor.id && styles.doctorCardSelected,
                    ]}
                    onPress={() => setSelectedDoctor(doctor.id)}
                  >
                    <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
                    <View style={styles.ratingBadge}>
                      <Icon name="star" size={16} color="#eab308" />
                      <Text style={styles.ratingText}>{doctor.rating}</Text>
                    </View>
                    <View style={styles.doctorCardContent}>
                      <Text style={styles.doctorName}>{doctor.name}</Text>
                      <Text style={styles.doctorExperience}>{doctor.experience}</Text>
                      <View style={styles.statusBadge}>
                        <Icon name="schedule" size={16} color={doctor.statusColor} />
                        <Text style={[styles.statusText, { color: doctor.statusColor }]}>
                          Available at {doctor.availableTime}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noDoctorsContainer}>
                  <Icon name="info-outline" size={48} color="#cbd5e1" />
                  <Text style={styles.noDoctorsText}>No specialists available</Text>
                  <Text style={styles.noDoctorsSubtext}>
                    Please select a different doctor type
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.connectButton, !isFormComplete && styles.connectButtonDisabled]}
          disabled={!isFormComplete}
          onPress={handleBookAppointment}
        >
          <Icon name="event" size={24} color="#ffffff" />
          <Text style={styles.connectButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDoctorTypePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDoctorTypePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDoctorTypePicker(false)}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Doctor Type</Text>
              <TouchableOpacity onPress={() => setShowDoctorTypePicker(false)}>
                <Icon name="close" size={24} color="#131616" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerOptions}>
              {doctorTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pickerOption,
                    selectedDoctorType === type && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedDoctorType(type);
                    setShowDoctorTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      selectedDoctorType === type && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                  {selectedDoctorType === type && (
                    <Icon name="check" size={20} color="#2d7576" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#131616',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d7576',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2d7576',
    letterSpacing: 1,
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#131616',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: '#131616',
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputField: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: '#131616',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  insuranceContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  insuranceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  insuranceButtonSelected: {
    borderColor: '#2d7576',
    backgroundColor: '#f0fdf4',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2d7576',
  },
  insuranceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  insuranceTextSelected: {
    color: '#2d7576',
    fontWeight: '700',
  },
  specialistsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  specialistsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#131616',
  },
  nearbyBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  nearbyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d7576',
  },
  doctorsScroll: {
    paddingLeft: 24,
  },
  doctorsScrollContent: {
    paddingRight: 24,
    gap: 16,
  },
  doctorCard: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  doctorCardSelected: {
    borderColor: '#2d7576',
  },
  doctorImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#2d7576',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#131616',
  },
  doctorCardContent: {
    padding: 16,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#131616',
    marginBottom: 4,
  },
  doctorExperience: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d7576',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#2d7576',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  connectButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
  },
  connectButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  pickerOptions: {
    paddingHorizontal: 20,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerOptionSelected: {
    backgroundColor: '#f0fdf4',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#131616',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#2d7576',
    fontWeight: '700',
  },
  noDoctorsContainer: {
    width: 280,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDoctorsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 12,
  },
  noDoctorsSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
  // Added Styles for the "Booked" View
  confirmationCard: {
    backgroundColor: '#ffffff',
    margin: 24,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#131616',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  appointmentDetails: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  doctorImageSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorDetailsSmall: {
    flex: 1,
  },
  doctorNameSmall: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  doctorSpecialtySmall: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  timeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appointmentTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d7576',
  },
  waitingContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    width: '100%',
  },
  waitingText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#2d7576',
    letterSpacing: 2,
    marginBottom: 8,
  },
  waitingSubtext: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});

export default ConsultationRequestScreen