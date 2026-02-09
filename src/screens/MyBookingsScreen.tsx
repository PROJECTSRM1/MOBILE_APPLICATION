import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HealthcareBottomNav from './HealthcareBottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  appointmentTimestamp: number;
  callJoined: boolean;
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
  const [userId, setUserId] = useState<number | null>(null);

  // ---------------- GET USER ID FROM ASYNCSTORAGE ----------------
  useEffect(() => {
    getUserId();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchBookings();
      }
    }, [userId])
  );

  const getUserId = async () => {
    console.log("=== FETCHING USER ID FROM ASYNCSTORAGE (MyBookings) ===");
    
    try {
      // Try multiple sources to get user ID
      const userData = await AsyncStorage.getItem("userData");
      const userProfile = await AsyncStorage.getItem("userProfile");
      
      console.log("📦 User Data from AsyncStorage:", userData);
      console.log("📦 User Profile from AsyncStorage:", userProfile);

      if (userData) {
        const parsed = JSON.parse(userData);
        console.log("👤 Parsed User Data:", parsed);
        
        // Handle different response structures
        if (parsed.user && parsed.user.id) {
          setUserId(parsed.user.id);
          console.log("✅ User ID found (user.id):", parsed.user.id);
        } else if (parsed.id) {
          setUserId(parsed.id);
          console.log("✅ User ID found (id):", parsed.id);
        } else if (parsed.user_id) {
          setUserId(parsed.user_id);
          console.log("✅ User ID found (user_id):", parsed.user_id);
        } else {
          console.log("⚠️ User ID not found in userData");
        }
      } else if (userProfile) {
        const parsed = JSON.parse(userProfile);
        console.log("👤 Parsed User Profile:", parsed);
        
        if (parsed.id) {
          setUserId(parsed.id);
          console.log("✅ User ID found in profile:", parsed.id);
        } else {
          console.log("⚠️ User ID not found in userProfile");
        }
      } else {
        console.log("❌ No user data found in AsyncStorage");
      }
    } catch (error) {
      console.error("❌ Error fetching user ID:", error);
    }
    
    console.log("=== USER ID FETCH COMPLETED (MyBookings) ===\n");
  };

  // ---------------- FETCH BOOKINGS ----------------
  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const fetchBookings = async () => {
    console.log("=== FETCHING BOOKINGS ===");
    
    if (!userId) {
      console.log("❌ User ID not available, cannot fetch bookings");
      Alert.alert(
        'Error',
        'User information not found. Please login again.',
        [
          {
            text: 'OK',
            onPress: () => (navigation as any).navigate('AuthScreen')
          }
        ]
      );
      return;
    }

    console.log("✅ User ID available:", userId);

    try {
      setLoading(true);

      const apiUrl = `${API_BASE_URL}/healthcare/appointments/user/${userId}`;
      console.log("🌐 API URL:", apiUrl);
      console.log("🚀 Starting API call...");

      const response = await fetch(apiUrl);

      console.log("📡 Response Status:", response.status);
      console.log("📡 Response OK:", response.ok);

      if (!response.ok) {
        const text = await response.text();
        console.log("❌ Error Response:", text);
        throw new Error(text);
      }

      const data = await response.json();
      console.log("📥 Response Data:", JSON.stringify(data, null, 2));

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

        let step = 0;

        if (item.call_booking_status === 'Consulted') {
          step = 1;
        } else if (item.call_booking_status === 'Medications') {
          step = 2;
        } else if (item.call_booking_status === 'Lab Tests') {
          step = 3;
        }

        const appointmentTs = new Date(item.appointment_time).getTime();

        return {
          id: item.id,
          doctor: item.doctor?.name || 'Doctor',
          date,
          time,
          status: appointmentTs < Date.now() ? 'completed' : 'upcoming',
          currentStep: step,
          appointmentTimestamp: appointmentTs,
          callJoined: step > 0,
        };
      });

      console.log("✅ Bookings formatted:", formatted.length, "items");
      setBookings(formatted);
    } catch (error: any) {
      console.error('❌ Fetch bookings error:', error);
      Alert.alert('Error', 'Unable to load bookings');
    } finally {
      setLoading(false);
      console.log("=== FETCH BOOKINGS COMPLETED ===\n");
    }
  };

  // ---------------- UPDATE BOOKING STATUS ----------------
  const updateBookingStatus = async (appointmentId: number) => {
    console.log("=== UPDATING BOOKING STATUS ===");
    console.log("📝 Appointment ID:", appointmentId);

    try {
      const apiUrl = `${API_BASE_URL}/healthcare/appointments/${appointmentId}/call-booking-status?call_booking_status=Consulted`;
      console.log("🌐 API URL:", apiUrl);
      console.log("🚀 Starting PATCH request...");

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("📡 Response Status:", response.status);
      console.log("📡 Response OK:", response.ok);

      if (!response.ok) {
        const text = await response.text();
        console.log("❌ Error Response:", text);
        throw new Error(text);
      }

      const data = await response.json();
      console.log("📥 Update Response Data:", JSON.stringify(data, null, 2));
      console.log("✅ Booking status updated successfully");

      return true;
    } catch (error: any) {
      console.error('❌ Update booking status error:', error);
      Alert.alert('Error', 'Failed to update booking status');
      return false;
    } finally {
      console.log("=== UPDATE BOOKING STATUS COMPLETED ===\n");
    }
  };

  // ---------------- HANDLE JOIN CALL ----------------
  const handleJoinCall = async (appointmentId: number) => {
    console.log("🎥 Join Call clicked for booking:", appointmentId);

    const updated = await updateBookingStatus(appointmentId);

    if (updated) {
      setBookings(prev =>
        prev.map(b =>
          b.id === appointmentId
            ? { ...b, callJoined: true, currentStep: 1 }
            : b
        )
      );

      (navigation as any).navigate('VideoCall');
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
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-busy" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyText}>
              You haven't made any appointments yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isCompleted = item.status === 'completed';
              const now = Date.now();

              const isBeforeTime = now < item.appointmentTimestamp;
              const isJoinDisabled =
                isCompleted || isBeforeTime || item.callJoined;
              
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
                      isJoinDisabled
                        ? styles.disabledBtn
                        : styles.joinBtn,
                    ]}
                    disabled={isJoinDisabled}
                    onPress={() => handleJoinCall(item.id)}
                  >
                    <Text style={[
                      styles.btnText,
                      isJoinDisabled && styles.disabledBtnText
                    ]}>
                      {item.callJoined
                        ? 'Call Joined'
                        : isBeforeTime
                        ? 'Not Started'
                        : isCompleted
                        ? 'Call Ended'
                        : 'Join Call'}
                    </Text>
                  </TouchableOpacity>

                  {renderTracker(item.currentStep)}
                </View>
              );
            }}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <HealthcareBottomNav
        activeTab="bookings"
        onNavigate={(tab) => {
          switch (tab) {
            case 'home':
              // Navigation handled by component
              break;
            case 'bookings':
              // Already on bookings
              break;
            case 'records':
              Alert.alert('Coming Soon', 'Records feature coming soon!');
              break;
            case 'profile':
              // Navigation handled by component
              break;
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#131616',
    letterSpacing: -0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#131616',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completedCard: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#64748b',
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#16a34a',
    fontSize: 10,
    fontWeight: '800',
  },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  joinBtn: {
    backgroundColor: '#2d7576',
    shadowColor: '#2d7576',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: '#f3f4f6',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  disabledBtnText: {
    color: '#9ca3af',
  },
  trackerContainer: {
    position: 'relative',
    marginTop: 8,
  },
  progressLineBase: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
  },
  progressLineActive: {
    position: 'absolute',
    top: 20,
    left: 20,
    height: 4,
    backgroundColor: '#2d7576',
    borderRadius: 2,
  },
  stepsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    width: (width - 80) / 4,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepCircleCompleted: {
    backgroundColor: '#2d7576',
    borderColor: 'transparent',
  },
  stepCircleActive: {
    backgroundColor: '#fff',
    borderColor: '#2d7576',
    borderWidth: 2,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#2d7576',
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default MyBookingsScreen;