import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation, useRoute } from '@react-navigation/native';

const BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';
const RAZORPAY_KEY = 'rzp_test_RnpmMY4LPogJ7J';

const HealthcarePaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const paymentHandled = useRef(false);

  const { doctor, date, time, amount, homeServiceId } = route.params;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handlePayment();
  }, []);

  const handlePayment = async () => {
    try {
      const TOTAL_AMOUNT = Number(amount) * 100; // paise
      const BOOKING_ID = homeServiceId || 26;

      const response = await fetch(`${BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: TOTAL_AMOUNT,
          bookingId: BOOKING_ID,      // healthcare
        }),
      });

      const order = await response.json();

      if (!response.ok) {
        console.log("SERVER:", order);
        throw new Error(order.detail?.[0]?.msg || order.message || "Order creation failed");
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Swachify Healthcare',
        description: `Consultation with ${doctor.name}`,
        order_id: order.id,
        prefill: {
          email: 'user@swachify.com',
          contact: '9999999999',
          name: 'Patient User',
        },
        theme: { color: '#136dec' },
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          if (paymentHandled.current) return;
          paymentHandled.current = true;

          await verifyPayment({
            order_id: data.razorpay_order_id,
            payment_id: data.razorpay_payment_id,
            signature: data.razorpay_signature,
            bookingId: BOOKING_ID,
            home_service_id: BOOKING_ID, // 🔥 added for backend compatibility
          });
        })
        .catch(() => {
          setLoading(false);
          Alert.alert('Payment Cancelled', 'Checkout closed');
          navigation.goBack();
        });

    } catch (err: any) {
      setLoading(false);
      Alert.alert('Server Error', err.message);
      navigation.goBack();
    }
  };

  const verifyPayment = async (payload: any) => {
    try {
      const res = await fetch(`${BASE_URL}/api/payment/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("VERIFY RESPONSE:", data);

      if (res.ok && (data.status === "success" || data.payment_done === true)) {
        navigation.replace('HealthcarePaymentSuccess', {
          transactionId: payload.payment_id,
          amount,
          doctorName: doctor.name,
          doctorImage: doctor?.image, 
          date,
          time,
        });
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (err: any) {
      Alert.alert('Verification Error', err.message);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        <Image source={{ uri: doctor.image }} style={styles.doctorThumb} />
        <ActivityIndicator size="large" color="#136dec" style={{ marginTop: 30 }} />
        <Text style={styles.loadingText}>Connecting to Razorpay...</Text>
        <Text style={styles.subText}>Creating secure payment order</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  doctorThumb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HealthcarePaymentScreen;
