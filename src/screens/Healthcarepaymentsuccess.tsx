import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Healthcarepaymentsuccess = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { 
    transactionId, 
    amount, 
    doctorName, 
    doctorImage, 
    date, 
    time 
  } = route.params as any;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f8f6" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.navigate('Health')}
        >
          <Icon name="close" size={24} color="#0d1b0d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.iconSection}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Icon name="check" size={48} color="#fff" />
            </View>
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.headline}>Payment Successful!</Text>
          <Text style={styles.subheadline}>
            Your appointment with {doctorName || 'your doctor'} is confirmed.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.amountHeader}>
            <Text style={styles.amountLabel}>TOTAL AMOUNT PAID</Text>
            <Text style={styles.amountValue}>₹{amount || '0'}</Text>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.rowBetween}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValueBold}>#{transactionId || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.doctorRow}>
              <Image
                source={{ uri: doctorImage || 'https://via.placeholder.com/80' }}
                style={styles.doctorThumb}
              />
              <View>
                <Text style={styles.doctorNameText}>{doctorName || 'Doctor'}</Text>
                <Text style={styles.doctorSpecialtyText}>Specialist</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Icon name="calendar-today" size={18} color="#13ec13" />
                <Text style={styles.badgeText}>{date}</Text>
              </View>
              <View style={styles.badge}>
                <Icon name="schedule" size={18} color="#13ec13" />
                <Text style={styles.badgeText}>{time}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 🔥 UPDATED BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { opacity: 0.6 }]}
            disabled={true}
          >
            <Text style={styles.primaryButtonText}
            onPress={() => navigation.navigate('MyBookings')}
>Call scheduled</Text>
          </TouchableOpacity>

          {/* 🔥 helper text */}
          <Text style={{ marginTop: 10, color: '#64748b', fontSize: 13, textAlign: 'center' }}>
            You can join the consultation from My Bookings at the scheduled time.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0d1b0d',
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconSection: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(19, 236, 19, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#13ec13',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#13ec13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  textSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0d1b0d',
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 15,
    color: '#4c604c',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 30,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    marginTop: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eef2ee',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  amountHeader: {
    backgroundColor: 'rgba(19, 236, 19, 0.05)',
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f1',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4c9a4c',
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0d1b0d',
    marginTop: 4,
  },
  cardDetails: {
    padding: 24,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#4c604c',
    fontWeight: '500',
  },
  detailValueBold: {
    fontSize: 14,
    color: '#0d1b0d',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f1',
    width: '100%',
    marginVertical: 20,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorThumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 16,
    backgroundColor: '#f1f5f1',
  },
  doctorNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0d1b0d',
  },
  doctorSpecialtyText: {
    fontSize: 13,
    color: '#4c604c',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8f6',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0d1b0d',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#13ec13',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#13ec13',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#eef2ee',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#0d1b0d',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default Healthcarepaymentsuccess;