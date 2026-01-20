
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ImageBackground, Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');



const ScootyView = () => {
    const navigation = useNavigation<any>();


  const [viewState, setViewState] = useState<'browse' | 'on_trip'>('browse');
  const [rideTime, setRideTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (viewState === 'on_trip') {
      interval = setInterval(() => setRideTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [viewState]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000' }} 
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: 0.2 }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>

           <Text style={styles.whiteText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{viewState === 'on_trip' ? 'Live Trip' : 'Nearby Scooters'}</Text>
      </View>

      {viewState === 'browse' ? (
        <View style={styles.bottomSheet}>
           <View style={styles.dragHandle} />
           <View style={styles.infoRow}>
              <View>
                 <Text style={styles.scooterName}>Justride Pro</Text>
                 <Text style={styles.plate}>TS 08 BX 1234</Text>
              </View>
              <View style={styles.batteryBadge}>
                 <Text style={styles.batteryText}>92%🔋</Text>
              </View>
           </View>

           <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                 <Text style={styles.statVal}>42km</Text>
                 <Text style={styles.statLabel}>Range</Text>
              </View>
              <View style={styles.statBox}>
                 <Text style={styles.statVal}>₹5/min</Text>
                 <Text style={styles.statLabel}>Fare</Text>
              </View>
           </View>

           <TouchableOpacity style={styles.bookBtn} onPress={() => setViewState('on_trip')}>
              <Text style={styles.bookBtnText}>Start Ride</Text>
           </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tripContainer}>
           <View style={styles.timerCircle}>
              <Text style={styles.timeText}>{formatTime(rideTime)}</Text>
              <Text style={styles.timeLabel}>ONGOING RIDE</Text>
           </View>

           <View style={styles.fareRow}>
              <View style={styles.fareCard}>
                 <Text style={styles.fareTitle}>EST. FARE</Text>
                 <Text style={styles.fareAmount}>₹{(rideTime * 0.08 + 20).toFixed(2)}</Text>
              </View>
              <View style={styles.fareCard}>
                 <Text style={styles.fareTitle}>DISTANCE</Text>
                 <Text style={styles.fareAmount}>{(rideTime * 0.01).toFixed(2)}km</Text>
              </View>
           </View>

           <TouchableOpacity style={styles.endBtn} onPress={() => navigation.goBack()}>

              <Text style={styles.endBtnText}>End Trip</Text>
           </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { 
    height: 120, paddingTop: 50, paddingHorizontal: 24,
    flexDirection: 'row', alignItems: 'center', zIndex: 10 
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900', marginLeft: 16 },
  whiteText: { color: 'white', fontWeight: 'bold' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.8)', alignItems: 'center', justifyContent: 'center' },
  bottomSheet: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#0f172a', borderTopLeftRadius: 40, borderTopRightRadius: 40, 
    padding: 32, paddingBottom: 50 
  },
  dragHandle: { width: 40, height: 4, backgroundColor: '#1e293b', borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  scooterName: { color: 'white', fontSize: 24, fontWeight: '900' },
  plate: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  batteryBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  batteryText: { color: '#10b981', fontWeight: '900', fontSize: 10 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statBox: { flex: 1, backgroundColor: '#1e293b', padding: 16, borderRadius: 20 },
  statVal: { color: 'white', fontSize: 18, fontWeight: '900' },
  statLabel: { color: '#475569', fontSize: 9, fontWeight: '900', marginTop: 4 },
  bookBtn: { backgroundColor: '#6366f1', height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bookBtnText: { color: 'white', fontSize: 18, fontWeight: '900' },
  tripContainer: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  timerCircle: { 
    width: 260, height: 260, borderRadius: 130, borderWidth: 8, 
    borderColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', 
    justifyContent: 'center', marginBottom: 60 
  },
  timeText: { color: 'white', fontSize: 56, fontWeight: '900' },
  timeLabel: { color: '#6366f1', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginTop: 10 },
  fareRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  fareCard: { flex: 1, backgroundColor: '#0f172a', padding: 24, borderRadius: 32, alignItems: 'center' },
  fareTitle: { color: '#475569', fontSize: 9, fontWeight: '900', marginBottom: 8 },
  fareAmount: { color: 'white', fontSize: 22, fontWeight: '900' },
  endBtn: { width: '100%', height: 72, backgroundColor: '#ef4444', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  endBtnText: { color: 'white', fontSize: 18, fontWeight: '900' }
});

export default ScootyView;