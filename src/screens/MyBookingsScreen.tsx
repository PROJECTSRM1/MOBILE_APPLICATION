import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// --- Data Types ---
type BookingStatus = 'upcoming' | 'completed';

interface Booking {
  id: number;
  doctor: string;
  date: string;
  time: string;
  status: BookingStatus;
  currentStep: number; // 0: Booked, 1: Consulted, 2: Medications, 3: Lab Tests
}

// --- Configuration ---
const dummyBookings: Booking[] = [
  {
    id: 1,
    doctor: 'Dr. Sarah Jenkins',
    date: '30 Jan 2026',
    time: '05:30 PM',
    status: 'upcoming',
    currentStep: 1, // At "Consulted" stage
  },
  {
    id: 2,
    doctor: 'Dr. Marcus Chen',
    date: '30 Jan 2026',
    time: '04:00 PM',
    status: 'upcoming',
    currentStep: 0, // At "Booked" stage
  },
  {
    id: 3,
    doctor: 'Dr. Elena Rodriguez',
    date: '28 Jan 2026',
    time: '10:15 AM',
    status: 'completed',
    currentStep: 3, // At "Lab Tests" stage
  },
];

const STEPS = [
  { label: 'Booked', icon: 'event-available' },
  { label: 'Consulted', icon: 'videocam' },
  { label: 'Medications', icon: 'medical-services' },
  { label: 'Lab Tests', icon: 'biotech' },
];

const MyBookingsScreen = () => {
  const navigation = useNavigation();

  // --- Helper: Render the Tracking System ---
  const renderTracker = (currentStep: number) => {
    // Calculate progress line width
    const progressPercent = (currentStep / (STEPS.length - 1)) * 100;

    return (
      <View style={styles.trackerContainer}>
        {/* Progress Bar Background */}
        <View style={styles.progressLineBase} />
        
        {/* Active Progress Line */}
        <View 
          style={[
            styles.progressLineActive, 
            { width: `${progressPercent}%` }
          ]} 
        />

        {/* Icons and Labels */}
        <View style={styles.stepsWrapper}>
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isPending = index > currentStep;

            return (
              <View key={index} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCircleCompleted,
                    isActive && styles.stepCircleActive,
                    isPending && styles.stepCirclePending,
                  ]}
                >
                  <MaterialIcons
                    name={isCompleted ? 'check' : (step.icon as any)}
                    size={16}
                    color={isCompleted || isActive ? '#fff' : '#94a3b8'}
                  />
                </View>
                <Text style={[
                  styles.stepLabel,
                  (isCompleted || isActive) && styles.stepLabelActive
                ]}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>

        <FlatList
          data={dummyBookings}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isCompleted = item.status === 'completed';

            return (
              <View style={[styles.card, isCompleted && styles.completedCard]}>
                {/* Doctor Info Row */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.doctorName, isCompleted && styles.textStrikethrough]}>
                      {item.doctor}
                    </Text>
                    <View style={styles.dateTimeRow}>
                      <MaterialIcons name="calendar-today" size={14} color="#64748b" />
                      <Text style={styles.dateTimeText}>
                        {item.date} • {item.time}
                      </Text>
                    </View>
                  </View>
                  
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>COMPLETED</Text>
                    </View>
                  )}
                </View>

                {/* Join Call Button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isCompleted ? styles.disabledBtn : styles.joinBtn,
                  ]}
                  disabled={isCompleted}
                  onPress={() =>
                    (navigation as any).navigate('VideoCall', {
                      // 🔥 FIX: Correct object structure for VideoCall screen
                      doctor: {
                        name: item.doctor,
                        title: 'General Practitioner',
                        status: 'Online',
                        videoUri: 'https://www.w3schools.com/html/mov_bbb.mp4', 
                      },
                      user: {
                        name: 'You',
                        videoUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
                      },
                      onEndCall: () => (navigation as any).replace('TreatmentSummary'),
                    })
                  }
                >
                  <Text style={[styles.btnText, isCompleted && { color: '#94a3b8' }]}>
                    {isCompleted ? 'Call Ended' : 'Join Call'}
                  </Text>
                </TouchableOpacity>

                {/* Tracking System */}
                {renderTracker(item.currentStep)}
              </View>
            );
          }}
        />
      </View>

      {/* Simplified Navigation Bar Placeholder (Matches design) */}
      <View style={styles.bottomNav}>
         <MaterialIcons name="home" size={24} color="#94a3b8" />
         <MaterialIcons name="calendar-month" size={24} color="#2563eb" />
         <MaterialIcons name="chat-bubble" size={24} color="#94a3b8" />
         <MaterialIcons name="person" size={24} color="#94a3b8" />
      </View>
    </SafeAreaView>
  );
};

export default MyBookingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 2,
  },
  completedCard: {
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  textStrikethrough: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateTimeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  completedBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  actionBtn: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  joinBtn: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: '#f1f5f9',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // --- Tracker Styles ---
  trackerContainer: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  progressLineBase: {
    position: 'absolute',
    top: 18,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
  },
  progressLineActive: {
    position: 'absolute',
    top: 18,
    left: 20,
    height: 4,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  stepsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    width: (width - 80) / 4, // Dynamic width based on screen
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepCircleCompleted: {
    backgroundColor: '#2563eb',
  },
  stepCircleActive: {
    backgroundColor: '#fff',
    borderColor: '#2563eb',
    borderWidth: 2,
  },
  stepCirclePending: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  }
});