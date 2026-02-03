import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const API_BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';

// ---------------- TYPES ----------------
type BookingStatus = 'upcoming' | 'completed';

interface Booking {
  id: number;
  doctor: string;
  date: string;
  time: string;
  status: BookingStatus;
  currentStep: number;
}

// ---------------- STEPS ----------------
const STEPS = [
  { label: 'Booked', icon: 'event-available' },
  { label: 'Consulted', icon: 'videocam' },
  { label: 'Medications', icon: 'medical-services' },
  { label: 'Lab Tests', icon: 'biotech' },
];

// ---------------- COMPONENT ----------------
const MyBookingsScreen = () => {
  const navigation = useNavigation();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH BOOKINGS ----------------
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/healthcare/appointments/user/1`
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();

      // Transform API → UI model
      const formatted: Booking[] = data.map((item: any) => {
        const dt = new Date(item.appointment_time + "Z");


        const date = dt.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

        const time = dt.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return {
          id: item.id,
          doctor: item.doctor_name || 'Doctor',
          date,
          time,
          status:
            new Date(item.appointment_time) < new Date()
              ? 'completed'
              : 'upcoming',
          currentStep: 0,
        };
      });

      setBookings(formatted);
    } catch (error: any) {
      console.log('Fetch bookings error:', error);
      Alert.alert('Error', 'Unable to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TRACKER ----------------
  const renderTracker = (currentStep: number) => {
    const progressPercent = (currentStep / (STEPS.length - 1)) * 100;

    return (
      <View style={styles.trackerContainer}>
        <View style={styles.progressLineBase} />
        <View
          style={[
            styles.progressLineActive,
            { width: `${progressPercent}%` },
          ]}
        />

        <View style={styles.stepsWrapper}>
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <View key={index} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCircleCompleted,
                    isActive && styles.stepCircleActive,
                  ]}
                >
                  <MaterialIcons
                    name={isCompleted ? 'check' : (step.icon as any)}
                    size={16}
                    color="#fff"
                  />
                </View>

                <Text
                  style={[
                    styles.stepLabel,
                    (isCompleted || isActive) && styles.stepLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isCompleted = item.status === 'completed';

              return (
                <View
                  style={[styles.card, isCompleted && styles.completedCard]}
                >
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.doctorName}>
                        {item.doctor}
                      </Text>

                      <View style={styles.dateTimeRow}>
                        <MaterialIcons
                          name="calendar-today"
                          size={14}
                          color="#64748b"
                        />
                        <Text style={styles.dateTimeText}>
                          {item.date} • {item.time}
                        </Text>
                      </View>
                    </View>

                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>
                          COMPLETED
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      isCompleted
                        ? styles.disabledBtn
                        : styles.joinBtn,
                    ]}
                    disabled={isCompleted}
                    onPress={() =>
                      (navigation as any).navigate('VideoCall')
                    }
                  >
                    <Text style={styles.btnText}>
                      {isCompleted ? 'Call Ended' : 'Join Call'}
                    </Text>
                  </TouchableOpacity>

                  {renderTracker(item.currentStep)}
                </View>
              );
            }}
          />
        )}
      </View>

      {/* Bottom Nav */}
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