import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
 
  StatusBar,
  Dimensions,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AppointmentBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const doctor = (route.params as any)?.doctor || {
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBROnWXidRzaw7EPTx5VFvmmDYHcpOKYDyII0kwHPPBPQ1ZkobWhUS_lH2OOi18HIk1npptJgLhqai1mOQv7F4ZFuLgzHRuOEd484WIE5UtUsMmhuy9w4-Md8V9mM8-ZH0ANyqqLpxh00MyYlNx8C_5UllV40E2TMuiAEqtk-8MgC7LGxWCYGCEzeIhfBRuNDosbjt0m2kKZRgzOsZRs_j1BTdy4XgVcXsAs8qatCjbHY7g9dPQ77AlmzwtAhn6VNnfp42SmFvZQ2K',
    doctor_id: 0,
    specialization_id: 0,
    price: 50,
  };

  const [selectedDateId, setSelectedDateId] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [dynamicDates, setDynamicDates] = useState<any[]>([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);

  // API loading flag — drives the spinner + disabled state on the button
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const timeSlots = {
    Morning: ['08:00 AM', '09:30 AM', '10:00 AM', '11:30 AM'],
    Afternoon: ['12:30 PM', '02:00 PM', '03:30 PM', '04:00 PM'],
    Evening: ['05:30 PM', '06:00 PM', '07:30 PM'],
  };

  const disabledSlots = ['11:30 AM'];

  // ---------------------------------------------------------------
  // greyed-out past slots — only applies when the user is looking
  // at today's date
  // ---------------------------------------------------------------
  const isTimeInPast = (timeStr: string) => {
    const today = new Date();
    const isSelectedMonthCurrent = selectedMonthIndex === today.getMonth();
    const isSelectedDayToday = dynamicDates[selectedDateId]?.dateNumber === today.getDate();

    if (!isSelectedMonthCurrent || !isSelectedDayToday) return false;

    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const currentHours = today.getHours();
    const currentMinutes = today.getMinutes();

    if (currentHours > hours) return true;
    if (currentHours === hours && currentMinutes >= minutes) return true;

    return false;
  };

  // ---------------------------------------------------------------
  // effects
  // ---------------------------------------------------------------
  useEffect(() => {
    generateDatesForMonth(selectedMonthIndex);
  }, [selectedMonthIndex]);

  // auto-pick the first available slot whenever the chosen date changes
  useEffect(() => {
    const allSlots = [...timeSlots.Morning, ...timeSlots.Afternoon, ...timeSlots.Evening];
    const firstAvailable = allSlots.find(
      (slot) => !isTimeInPast(slot) && !disabledSlots.includes(slot)
    );
    setSelectedTime(firstAvailable || '');
  }, [selectedDateId, dynamicDates]);

  // ---------------------------------------------------------------
  // date list builder
  // ---------------------------------------------------------------
  const generateDatesForMonth = (monthIdx: number) => {
    const days: any[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    let startDate = new Date(currentYear, monthIdx, 1);
    if (monthIdx === today.getMonth()) startDate = today;

    for (let i = 0; i < 14; i++) {
      const tempDate = new Date(startDate);
      tempDate.setDate(startDate.getDate() + i);
      if (tempDate.getMonth() !== monthIdx && i > 0) break;
      days.push({
        dayName: tempDate.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNumber: tempDate.getDate(),
        id: i,
        fullDate: `${tempDate.getDate()} ${monthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`,
        rawDate: new Date(tempDate),
      });
    }
    setDynamicDates(days);
    setSelectedDateId(0);
  };

  // ---------------------------------------------------------------
  // helpers: "08:00 AM" → 24-h object  |  date + slot → ISO string
  // ---------------------------------------------------------------
  const parseTimeSlot = (timeStr: string): { hours: number; minutes: number } => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const buildAppointmentISO = (): string => {
    const selectedDateObj: Date = dynamicDates[selectedDateId]?.rawDate ?? new Date();
    const { hours, minutes } = parseTimeSlot(selectedTime);
    const dt = new Date(selectedDateObj);
    dt.setHours(hours, minutes, 0, 0);
    return dt.toISOString();
  };

  // ---------------------------------------------------------------
  // POST /healthcare/appointments
  //   called directly by the "Confirm Appointment" button
  //   ✅ success  →  navigate('HealthcarePayment', { … })
  //   ❌ failure  →  Alert with the server message
  // ---------------------------------------------------------------
  const createAppointment = async () => {
    if (!selectedTime) return;

    setIsBookingLoading(true);

    try {
      const appointmentTime = buildAppointmentISO();

      // only the fields relevant to an online doctor booking are sent;
      // ambulance / assistant / lab / pharmacy keys are intentionally omitted
      const payload: Record<string, any> = {
        user_id: 1,                                                // swap with real authenticated user id
        consultation_type_id: 1,                                   // 1 = Online
        appointment_time: new Date(appointmentTime)
    .toISOString()
    .slice(0, 19),
        doctor_id: doctor.doctor_id ?? Number(doctor.id) ?? null,
        doctor_specialization_id: doctor.specialization_id ?? null,
        description: "General consultation",
        days_of_suffering: 0,

        health_insurance: false,

        required_ambulance: false,
        ambulance_id: null,
        pickup_time: null,

        required_assistant: false,
        assistant_id: null,

        labs_id: null,
        pharmacies_id: null
      };

      const response = await fetch(`${API_BASE_URL}/healthcare/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `Server error (${response.status})`);
      }

      // ✅ appointment created — move to payment
      (navigation as any).navigate('HealthcarePayment', {
        doctor: doctor,
        date: dynamicDates[selectedDateId]?.fullDate,
        time: selectedTime,
        amount: doctor.price ?? 50,
        homeServiceId: '26',
      });
    } catch (error: any) {
      console.error('Appointment creation failed:', error);
      Alert.alert(
        'Booking Failed',
        error?.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsBookingLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // sub-components
  // ---------------------------------------------------------------
  const TimeSlot = ({ time }: { time: string }) => {
    const isSelected = selectedTime === time;
    const isPast = isTimeInPast(time);
    const isManuallyDisabled = disabledSlots.includes(time);
    const isDisabled = isPast || isManuallyDisabled;

    return (
      <TouchableOpacity
        disabled={isDisabled}
        onPress={() => setSelectedTime(time)}
        style={[
          styles.timeSlot,
          isSelected && styles.timeSlotSelected,
          isDisabled && styles.timeSlotDisabled,
        ]}
      >
        <Text
          style={[
            styles.timeSlotText,
            isSelected && styles.timeSlotTextSelected,
            isDisabled && styles.timeSlotTextDisabled,
          ]}
        >
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  // ---------------------------------------------------------------
  // render
  // ---------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafaf9" />

      {/* ── header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-ios" size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Appointment Time</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* doctor card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: doctor.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialtyText}>Specialist {doctor.specialty}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color="#eab308" />
              <Text style={styles.ratingText}>
                {doctor.rating}{' '}
                <Text style={styles.reviewText}>(120 reviews)</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* date row + month selector */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity onPress={() => setIsMonthModalVisible(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.monthText}>{monthNames[selectedMonthIndex]}</Text>
              <Icon name="expand-more" size={16} color="#2d7576" style={{ marginLeft: 2 }} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
          {dynamicDates.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedDateId(item.id)}
              style={[styles.dateChip, selectedDateId === item.id && styles.dateChipSelected]}
            >
              <Text style={[styles.dayText, selectedDateId === item.id && styles.textWhite]}>
                {item.dayName}
              </Text>
              <Text style={[styles.dateNumber, selectedDateId === item.id && styles.textWhite]}>
                {item.dateNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Morning slots */}
        <View style={styles.slotHeader}>
          <Icon name="light-mode" size={18} color="#fb923c" />
          <Text style={styles.slotTitle}>Morning</Text>
        </View>
        <View style={styles.grid}>
          {timeSlots.Morning.map((time) => (
            <TimeSlot key={time} time={time} />
          ))}
        </View>

        {/* Afternoon slots */}
        <View style={styles.slotHeader}>
          <Icon name="wb-sunny" size={18} color="#eab308" />
          <Text style={styles.slotTitle}>Afternoon</Text>
        </View>
        <View style={styles.grid}>
          {timeSlots.Afternoon.map((time) => (
            <TimeSlot key={time} time={time} />
          ))}
        </View>

        {/* Evening slots */}
        <View style={styles.slotHeader}>
          <Icon name="dark-mode" size={18} color="#818cf8" />
          <Text style={styles.slotTitle}>Evening</Text>
        </View>
        <View style={styles.grid}>
          {timeSlots.Evening.map((time) => (
            <TimeSlot key={time} time={time} />
          ))}
        </View>
      </ScrollView>

      {/* ── month picker modal ── */}
      <Modal visible={isMonthModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMonthModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <FlatList
              data={monthNames}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  disabled={index < new Date().getMonth()}
                  style={[
                    styles.monthOption,
                    selectedMonthIndex === index && styles.monthOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedMonthIndex(index);
                    setIsMonthModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      selectedMonthIndex === index && styles.monthOptionTextActive,
                      index < new Date().getMonth() && { color: '#cbd5e1' },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── fixed footer with confirm button only ── */}
      <View style={styles.bottomFixedContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedTime || isBookingLoading) && { backgroundColor: '#cbd5e1' },
            ]}
            disabled={!selectedTime || isBookingLoading}
            onPress={createAppointment}
          >
            {isBookingLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fafaf9' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: '#fafaf9', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb' 
  },
  backButton: { 
    padding: 4 
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#131616' 
  },
  scrollContainer: { 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 120 
  },
  profileCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    padding: 14, 
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.05)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileImage: { 
    width: 70, 
    height: 70, 
    borderRadius: 35 
  },
  profileInfo: { 
    marginLeft: 14, 
    justifyContent: 'center' 
  },
  doctorName: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#131616' 
  },
  specialtyText: { 
    fontSize: 13, 
    color: '#71717a' 
  },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4 
  },
  ratingText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#52525b', 
    marginLeft: 4 
  },
  reviewText: { 
    color: '#9ca3af', 
    fontWeight: '400' 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20, 
    alignItems: 'center' 
  },
  sectionTitle: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#131616' 
  },
  monthText: { 
    color: '#2d7576', 
    fontWeight: '800', 
    fontSize: 15 
  },
  dateList: { 
    marginTop: 10, 
    marginBottom: 8 
  },
  dateChip: { 
    width: 60, 
    height: 76, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.05)' 
  },
  dateChipSelected: { 
    backgroundColor: '#2d7576', 
    borderColor: '#2d7576', 
    elevation: 3 
  },
  dayText: { 
    fontSize: 11, 
    color: '#9ca3af', 
    fontWeight: '500' 
  },
  dateNumber: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#131616', 
    marginTop: 2 
  },
  textWhite: { 
    color: '#fff' 
  },
  slotHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 24, 
    marginBottom: 12 
  },
  slotTitle: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#131616', 
    marginLeft: 8 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  timeSlot: { 
    width: (width - 52) / 3, 
    paddingVertical: 12, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: 'rgba(0,0,0,0.05)' 
  },
  timeSlotSelected: { 
    backgroundColor: '#e8f4f4', 
    borderColor: '#2d7576', 
    borderWidth: 1.5 
  },
  timeSlotDisabled: { 
    backgroundColor: '#f3f4f6', 
    opacity: 0.4 
  },
  timeSlotText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#52525b' 
  },
  timeSlotTextSelected: { 
    color: '#2d7576', 
    fontWeight: '800' 
  },
  timeSlotTextDisabled: { 
    color: '#cbd5e1' 
  },
  bottomFixedContainer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(0,0,0,0.05)' 
  },
  buttonWrapper: { 
    padding: 14 
  },
  confirmButton: { 
    backgroundColor: '#2d7576', 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: 'center' 
  },
  confirmButtonText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '800' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: width * 0.75, 
    maxHeight: height * 0.5, 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    padding: 18 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  monthOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  monthOptionActive: { 
    backgroundColor: '#e8f4f4' 
  },
  monthOptionText: { 
    fontSize: 15, 
    fontWeight: '600' 
  },
  monthOptionTextActive: { 
    color: '#2d7576' 
  },
});

export default AppointmentBookingScreen;