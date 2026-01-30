import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBROnWXidRzaw7EPTx5VFvmmDYHcpOKYDyII0kwHPPBPQ1ZkobWhUS_lH2OOi18HIk1npptJgLhqai1mOQv7F4ZFuLgzHRuOEd484WIE5UtUsMmhuy9w4-Md8V9mM8-ZH0ANyqqLpxh00MyYlNx8C_5UllV40E2TMuiAEqtk-8MgC7LGxWCYGCEzeIhfBRuNDosbjt0m2kKZRgzOsZRs_j1BTdy4XgVcXsAs8qatCjbHY7g9dPQ77AlmzwtAhn6VNnfp42SmFvZA2K',
  };

  const [selectedDateId, setSelectedDateId] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [dynamicDates, setDynamicDates] = useState<any[]>([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const timeSlots = {
    Morning: ['08:00 AM', '09:30 AM', '10:00 AM', '11:30 AM'],
    Afternoon: ['12:30 PM', '02:00 PM', '03:30 PM', '04:00 PM'],
    Evening: ['05:30 PM', '06:00 PM', '07:30 PM'],
  };

  const disabledSlots = ['11:30 AM'];

  // Logic to check if a time slot has already passed for Today
  const isTimeInPast = (timeStr: string) => {
    const today = new Date();
    const isSelectedMonthCurrent = selectedMonthIndex === today.getMonth();
    const isSelectedDayToday = dynamicDates[selectedDateId]?.dateNumber === today.getDate();

    // If it's not today, all slots are available (unless manually disabled)
    if (!isSelectedMonthCurrent || !isSelectedDayToday) return false;

    // Parse "09:30 AM"
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

  useEffect(() => {
    generateDatesForMonth(selectedMonthIndex);
  }, [selectedMonthIndex]);

  // When date changes, find the first available time slot
  useEffect(() => {
    const allSlots = [...timeSlots.Morning, ...timeSlots.Afternoon, ...timeSlots.Evening];
    const firstAvailable = allSlots.find(slot => !isTimeInPast(slot) && !disabledSlots.includes(slot));
    setSelectedTime(firstAvailable || '');
  }, [selectedDateId, dynamicDates]);

  const generateDatesForMonth = (monthIdx: number) => {
    const days = [];
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
        fullDate: `${tempDate.getDate()} ${monthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`
      });
    }
    setDynamicDates(days);
    setSelectedDateId(0);
  };

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
          isDisabled && styles.timeSlotDisabled
        ]}
      >
        <Text style={[
          styles.timeSlotText, 
          isSelected && styles.timeSlotTextSelected, 
          isDisabled && styles.timeSlotTextDisabled
        ]}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-ios" size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Appointment Time</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Profile */}
        <View style={styles.profileCard}>
          <Image source={{ uri: doctor.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialtyText}>Specialist {doctor.specialty}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color="#fbbf24" />
              <Text style={styles.ratingText}>{doctor.rating} <Text style={styles.reviewText}>(120 reviews)</Text></Text>
            </View>
          </View>
        </View>

        {/* Date Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity onPress={() => setIsMonthModalVisible(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Text style={styles.monthText}>{monthNames[selectedMonthIndex]}</Text>
               <Icon name="expand-more" size={16} color="#136dec" style={{marginLeft: 2}} />
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
              <Text style={[styles.dayText, selectedDateId === item.id && styles.textWhite]}>{item.dayName}</Text>
              <Text style={[styles.dateNumber, selectedDateId === item.id && styles.textWhite]}>{item.dateNumber}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Slots */}
        <View style={styles.slotHeader}>
          <Icon name="light-mode" size={18} color="#fb923c" />
          <Text style={styles.slotTitle}>Morning</Text>
        </View>
        <View style={styles.grid}>{timeSlots.Morning.map((time) => <TimeSlot key={time} time={time} />)}</View>

        <View style={styles.slotHeader}>
          <Icon name="wb-sunny" size={18} color="#eab308" />
          <Text style={styles.slotTitle}>Afternoon</Text>
        </View>
        <View style={styles.grid}>{timeSlots.Afternoon.map((time) => <TimeSlot key={time} time={time} />)}</View>

        <View style={styles.slotHeader}>
          <Icon name="dark-mode" size={18} color="#818cf8" />
          <Text style={styles.slotTitle}>Evening</Text>
        </View>
        <View style={styles.grid}>{timeSlots.Evening.map((time) => <TimeSlot key={time} time={time} />)}</View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={isConfirmModalVisible} transparent animationType="slide">
        <View style={styles.confirmOverlay}>
          <SafeAreaView style={styles.confirmModalContent}>
            <View style={styles.bottomSheetHandle} />
            <ScrollView contentContainerStyle={{paddingBottom: 40}}>
                <Text style={styles.confirmHeadline}>Appointment Confirmed! 🎉</Text>
                <Text style={styles.confirmSubheadline}>Your slot is reserved. Please complete payment to confirm.</Text>
                <View style={styles.summaryCard}>
                    <Image source={{ uri: doctor.image }} style={styles.summaryImage} />
                    <View>
                        <Text style={styles.specialtyTag}>{doctor.specialty.toUpperCase()}</Text>
                        <Text style={styles.summaryName}>{doctor.name}</Text>
                        <Text style={styles.summaryHospital}>St. Mary's Hospital, NY</Text>
                    </View>
                </View>
                <View style={styles.detailList}>
                    <DetailItem icon="calendar-today" label="Date" value={dynamicDates[selectedDateId]?.fullDate || ""} />
                    <DetailItem icon="schedule" label="Time (IST)" value={selectedTime} />
                    <DetailItem icon="videocam" label="Meeting Mode" value="Online Video Consultation" />
                </View>
                <View style={styles.confirmActionContainer}>
                    <TouchableOpacity 
                        style={styles.payNowBtn}
                        onPress={() => {
                            setIsConfirmModalVisible(false);
                            (navigation as any).navigate('HealthcarePayment', {
                                doctor: doctor,
                                date: dynamicDates[selectedDateId]?.fullDate,
                                time: selectedTime,
                                amount: 50,
                                homeServiceId: "26"
                            });
                        }}
                    >
                        <Text style={styles.payNowBtnText}>Pay Now ($50.00)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBookingBtn} onPress={() => setIsConfirmModalVisible(false)}>
                        <Text style={styles.cancelBookingBtnText}>Cancel Appointment</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Month Selection Modal */}
      <Modal visible={isMonthModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsMonthModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <FlatList
              data={monthNames}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  disabled={index < new Date().getMonth()}
                  style={[styles.monthOption, selectedMonthIndex === index && styles.monthOptionActive]}
                  onPress={() => { setSelectedMonthIndex(index); setIsMonthModalVisible(false); }}
                >
                  <Text style={[styles.monthOptionText, selectedMonthIndex === index && styles.monthOptionTextActive, index < new Date().getMonth() && {color: '#cbd5e1'}]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Footer */}
      <View style={styles.bottomFixedContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={[styles.confirmButton, !selectedTime && {backgroundColor: '#cbd5e1'}]} 
            disabled={!selectedTime}
            onPress={() => setIsConfirmModalVisible(true)}
          >
            <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabBar}>
          <TabItem icon="home" label="Home" />
          <TabItem icon="calendar-month" label="Booking" active />
          <TabItem icon="chat-bubble-outline" label="Messages" />
          <TabItem icon="person-outline" label="Profile" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const DetailItem = ({icon, label, value}: any) => (
    <View style={styles.detailItemRow}>
        <View style={styles.detailIconBg}><Icon name={icon} size={22} color="#136dec" /></View>
        <View>
            <Text style={styles.detailValue}>{value}</Text>
            <Text style={styles.detailLabel}>{label}</Text>
        </View>
    </View>
);

const TabItem = ({ icon, label, active = false }: any) => (
  <View style={styles.tabItem}>
    <Icon name={icon} size={22} color={active ? '#136dec' : '#94a3b8'} />
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f6f7f8', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  scrollContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 220 },
  profileCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  profileImage: { width: 70, height: 70, borderRadius: 35 },
  profileInfo: { marginLeft: 14, justifyContent: 'center' },
  doctorName: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  specialtyText: { fontSize: 13, color: '#64748b' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#334155', marginLeft: 4 },
  reviewText: { color: '#94a3b8', fontWeight: '400' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  monthText: { color: '#136dec', fontWeight: '800', fontSize: 15 },
  dateList: { marginTop: 10, marginBottom: 8 },
  dateChip: { width: 60, height: 76, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  dateChipSelected: { backgroundColor: '#136dec', borderColor: '#136dec', elevation: 3 },
  dayText: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  dateNumber: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  textWhite: { color: '#fff' },
  slotHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  slotTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a', marginLeft: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlot: { width: (width - 52) / 3, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#f1f5f9' },
  timeSlotSelected: { backgroundColor: '#eff6ff', borderColor: '#136dec', borderWidth: 1.5 },
  timeSlotDisabled: { backgroundColor: '#f1f5f9', opacity: 0.4 }, // Increased opacity to show it's disabled
  timeSlotText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  timeSlotTextSelected: { color: '#136dec', fontWeight: '800' },
  timeSlotTextDisabled: { color: '#cbd5e1' },
  bottomFixedContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  buttonWrapper: { padding: 14 },
  confirmButton: { backgroundColor: '#136dec', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  confirmButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: Platform.OS === 'ios' ? 25 : 12, paddingTop: 8 },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 10, color: '#94a3b8', marginTop: 3, fontWeight: '600' },
  tabLabelActive: { color: '#136dec' },
  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  confirmModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16 },
  bottomSheetHandle: { width: 45, height: 5, backgroundColor: '#cfd9e7', borderRadius: 10, alignSelf: 'center', marginVertical: 12 },
  confirmHeadline: { fontSize: 26, fontWeight: '800', color: '#0d131b', textAlign: 'center', marginTop: 8 },
  confirmSubheadline: { fontSize: 14, color: '#4c6c9a', textAlign: 'center', marginTop: 6, marginBottom: 20 },
  summaryCard: { flexDirection: 'row', backgroundColor: '#f6f7f8', borderRadius: 18, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#eef2f6' },
  summaryImage: { width: 64, height: 64, borderRadius: 12, marginRight: 16 },
  specialtyTag: { color: '#136dec', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  summaryName: { fontSize: 18, fontWeight: '800', color: '#0d131b', marginTop: 2 },
  summaryHospital: { fontSize: 12, color: '#4c6c9a', marginTop: 1 },
  detailList: { marginTop: 10 },
  detailItemRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, paddingHorizontal: 4 },
  detailIconBg: { width: 48, height: 48, backgroundColor: 'rgba(19, 109, 236, 0.1)', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  detailValue: { fontSize: 16, fontWeight: '700', color: '#0d131b' },
  detailLabel: { fontSize: 12, color: '#4c6c9a', marginTop: 1 },
  confirmActionContainer: { marginTop: 20 },
  payNowBtn: { backgroundColor: '#136dec', paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 4 },
  payNowBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  cancelBookingBtn: { paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  cancelBookingBtnText: { color: '#4c6c9a', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.75, maxHeight: height * 0.5, backgroundColor: '#fff', borderRadius: 18, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  monthOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  monthOptionActive: { backgroundColor: '#eff6ff' },
  monthOptionText: { fontSize: 15, fontWeight: '600' },
  monthOptionTextActive: { color: '#136dec' },
});

export default AppointmentBookingScreen;