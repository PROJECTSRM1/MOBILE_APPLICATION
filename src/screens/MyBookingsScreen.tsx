import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const dummyBookings = [
  {
    id: 1,
    doctor: 'Dr. Sarah Jenkins',
    date: '30 Jan 2026',
    time: '05:30 PM',
  },
  {
    id: 2,
    doctor: 'Dr. Marcus Chen',
    date: '30 Jan 2026',
    time: '04:00 PM',
  },
];

// 🔥 Time check function
const isJoinEnabled = (bookingTime: string) => {
  const now = new Date();

  const [time, modifier] = bookingTime.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const bookingDate = new Date();
  bookingDate.setHours(hours);
  bookingDate.setMinutes(minutes);
  bookingDate.setSeconds(0);

  // allow join 5 minutes before/after
  const diff = Math.abs(bookingDate.getTime() - now.getTime());
  return diff <= 5 * 60 * 1000;
};

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      <FlatList
        data={dummyBookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
        //   const canJoin = isJoinEnabled(item.time);
          const canJoin = true; // 🔥 force join for testing


          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.doctor}</Text>
              <Text style={styles.time}>
                {item.date} • {item.time}
              </Text>

              <TouchableOpacity
                style={[
                  styles.btn,
                  canJoin ? styles.joinBtn : styles.scheduledBtn,
                ]}
                disabled={!canJoin}
                onPress={() =>
  (navigation as any).navigate('VideoCall', {
    doctor: {
      name: item.doctor,
      title: 'Cardiologist',
      status: 'Online',
      videoUri: 'https://www.w3schools.com/html/mov_bbb.mp4', // sample
    },
    user: {
      name: 'You',
      videoUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    onEndCall: () => (navigation as any).replace('TreatmentSummary'),

  })
}

              >
                <Text style={styles.btnText}>
                  {canJoin ? 'Join Call' : 'Call Scheduled'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MyBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  time: {
    color: '#475569',
    marginBottom: 12,
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinBtn: {
    backgroundColor: '#2563eb',
  },
  scheduledBtn: {
    backgroundColor: '#22c55e',
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
