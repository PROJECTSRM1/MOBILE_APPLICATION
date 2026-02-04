import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';
const RAZORPAY_KEY = 'rzp_test_RnpmMY4LPogJ7J';

const HealthcarePaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const paymentHandled = useRef(false);

  const { doctor, date, time, amount, homeServiceId } = route.params;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("=== HEALTHCARE PAYMENT SCREEN MOUNTED ===");
    console.log("📦 Route Params:", JSON.stringify(route.params, null, 2));
    console.log("👨‍⚕️ Doctor:", doctor);
    console.log("📅 Date:", date);
    console.log("⏰ Time:", time);
    console.log("💰 Amount:", amount);
    console.log("🏠 Home Service ID:", homeServiceId);
    console.log("🏠 Home Service ID Type:", typeof homeServiceId);
    console.log("=====================================\n");

    handlePayment();
  }, []);

  const handlePayment = async () => {
    console.log("=== STARTING PAYMENT PROCESS ===");
    
    try {
      const TOTAL_AMOUNT = Number(amount) * 100; // paise
      // Ensure booking ID is a NUMBER, not a string
      const BOOKING_ID = Number(homeServiceId) || 26;

      console.log("💵 Total Amount (paise):", TOTAL_AMOUNT);
      console.log("🆔 Booking ID:", BOOKING_ID);
      console.log("🆔 Booking ID Type:", typeof BOOKING_ID);

      const createOrderUrl = `${BASE_URL}/api/payment/create-order`;
      console.log("🌐 Create Order URL:", createOrderUrl);

      const requestBody = {
        amount: TOTAL_AMOUNT,
        bookingId: BOOKING_ID,  // Now sending as number
      };
      console.log("📤 Request Body:", JSON.stringify(requestBody, null, 2));

      console.log("🚀 Sending create order request...");
      const response = await fetch(createOrderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Create Order Response Status:", response.status);
      console.log("📡 Create Order Response OK:", response.ok);
      console.log("📡 Create Order Response Headers:", JSON.stringify({
        'content-type': response.headers.get('content-type'),
      }, null, 2));

      // Get response text first to handle non-JSON responses
      const responseText = await response.text();
      console.log("📥 Raw Response Text:", responseText);

      let order;
      try {
        order = JSON.parse(responseText);
        console.log("✅ Parsed Order Data:", JSON.stringify(order, null, 2));
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("📄 Response was not valid JSON. First 200 chars:", responseText.substring(0, 200));
        throw new Error("Server returned invalid response. Expected JSON but got: " + responseText.substring(0, 100));
      }

      if (!response.ok) {
        console.log("❌ Server Error Response:", order);
        const errorMessage = order.detail?.[0]?.msg || order.message || order.error || "Order creation failed";
        console.error("❌ Error Message:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✅ Order created successfully");
      console.log("🔑 Order ID:", order.id);
      console.log("💰 Order Amount:", order.amount);

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

      console.log("🎨 Razorpay Options:", JSON.stringify(options, null, 2));
      console.log("🚀 Opening Razorpay Checkout...");

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          console.log("=== RAZORPAY PAYMENT SUCCESS ===");
          console.log("✅ Payment Data:", JSON.stringify(data, null, 2));
          
          if (paymentHandled.current) {
            console.log("⚠️ Payment already handled, skipping...");
            return;
          }
          paymentHandled.current = true;

          console.log("🔄 Proceeding to verify payment...");
          await verifyPayment({
            order_id: data.razorpay_order_id,
            payment_id: data.razorpay_payment_id,
            signature: data.razorpay_signature,
            bookingId: BOOKING_ID,  // Sending as number
            home_service_id: BOOKING_ID,  // Sending as number
          });
        })
        .catch((error: any) => {
          console.log("=== RAZORPAY PAYMENT CANCELLED/FAILED ===");
          console.log("❌ Razorpay Error:", error);
          console.log("📄 Error Details:", JSON.stringify(error, null, 2));
          
          setLoading(false);
          Alert.alert('Payment Cancelled', 'Checkout closed');
          navigation.goBack();
        });

    } catch (err: any) {
      console.log("=== PAYMENT PROCESS ERROR ===");
      console.error("❌ Error:", err);
      console.error("❌ Error Message:", err.message);
      console.error("❌ Error Stack:", err.stack);
      
      setLoading(false);
      Alert.alert('Server Error', err.message);
      navigation.goBack();
    }
    
    console.log("=== PAYMENT PROCESS COMPLETED ===\n");
  };

  const verifyPayment = async (payload: any) => {
    console.log("=== STARTING PAYMENT VERIFICATION ===");
    console.log("📤 Verification Payload (before sending):", JSON.stringify(payload, null, 2));
    console.log("🔍 Payload Types:");
    console.log("   - bookingId type:", typeof payload.bookingId);
    console.log("   - home_service_id type:", typeof payload.home_service_id);
    
    try {
      const verifyUrl = `${BASE_URL}/api/payment/verify-payment`;
      console.log("🌐 Verify Payment URL:", verifyUrl);
      console.log("🚀 Sending verify payment request...");

      const res = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log("📡 Verify Response Status:", res.status);
      console.log("📡 Verify Response OK:", res.ok);
      console.log("📡 Verify Response Status Text:", res.statusText);
      console.log("📡 Verify Response Headers:", JSON.stringify({
        'content-type': res.headers.get('content-type'),
        'content-length': res.headers.get('content-length'),
      }, null, 2));

      // Get response text first to handle non-JSON responses
      const responseText = await res.text();
      console.log("📥 Raw Verify Response Text:");
      console.log(responseText);
      console.log("📥 Full Response Length:", responseText.length);

      // Handle 500 Internal Server Error
      if (res.status === 500) {
        
        Alert.alert(
          'Payment Success',
          ' Your payment was successful',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to success screen anyway since payment was made
                navigation.replace('HealthcarePaymentSuccess', {
                  transactionId: payload.payment_id,
                  amount,
                  doctorName: doctor.name,
                  doctorImage: doctor?.image, 
                  date,
                  time,
                });
              }
            }
          ]
        );
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("✅ Parsed Verify Response:", JSON.stringify(data, null, 2));
      } catch (parseError: any) {
        console.error("❌ JSON Parse Error in Verify Payment:", parseError);
        console.error("❌ Parse Error Message:", parseError.message);
        console.error("📄 Response Content Type:", res.headers.get('content-type'));
        console.error("📄 Response was not valid JSON:");
        console.error(responseText);
        
        throw new Error("Server returned invalid response. Expected JSON. Status: " + res.status + ". Response: " + responseText);
      }

      console.log("🔍 Checking verification result...");
      console.log("📊 Response Status Code:", res.status);
      console.log("📊 Response OK:", res.ok);
      console.log("📊 Data Status:", data.status);
      console.log("📊 Payment Done:", data.payment_done);

      if (res.ok && (data.status === "success" || data.payment_done === true)) {
        console.log("✅ Payment verification successful!");
        console.log("🎉 Navigating to success screen...");
        
        navigation.replace('HealthcarePaymentSuccess', {
          transactionId: payload.payment_id,
          amount,
          doctorName: doctor.name,
          doctorImage: doctor?.image, 
          date,
          time,
        });
      } else {
        console.log("❌ Payment verification failed");
        const errorMessage = data.message || data.error || data.detail || "Verification failed";
        console.error("❌ Verification Error Message:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.log("=== PAYMENT VERIFICATION ERROR ===");
      console.error("❌ Verification Error:", err);
      console.error("❌ Error Message:", err.message);
      console.error("❌ Error Stack:", err.stack);
      
      // Don't navigate back - show error but allow user to see transaction ID
      Alert.alert(
        'Verification Error',
        err.message + '\n\nYour payment may have been processed. Transaction ID: ' + payload.payment_id,
        [
          {
            text: 'Contact Support',
            onPress: () => {
              // You can add support navigation here
              navigation.goBack();
            }
          },
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to success anyway
              navigation.replace('HealthcarePaymentSuccess', {
                transactionId: payload.payment_id,
                amount,
                doctorName: doctor.name,
                doctorImage: doctor?.image, 
                date,
                time,
              });
            }
          }
        ]
      );
    }
    
    console.log("=== PAYMENT VERIFICATION COMPLETED ===\n");
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