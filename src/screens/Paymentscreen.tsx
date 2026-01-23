import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { useTheme } from '../context/ThemeContext';
import { createOrder, verifyPayment } from "../services/paymentApi";

/* ---------------- CONSTANTS ---------------- */

const RAZORPAY_KEY = "rzp_test_RnpmMY4LPogJ7J";

/* ---------------- SCREEN ---------------- */

const PaymentScreen = ({ navigation }: any) => {
  const paymentHandled = useRef(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // ✅ useRoute MUST be inside component
  const route = useRoute<any>();

  const {
    addons = [],
    floorArea,
    selectedTime,
    allocatedEmployee,
    bookingDetails,
  } = route.params || {};

  const { colors } = useTheme();
  const styles = getStyles(colors);

  const TOTAL_AMOUNT = 14750;
  const BOOKING_ID = 26;

  /* ---------------- PAYMENT HANDLER ---------------- */

  const handlePayment = async () => {
    try {
      const order = await createOrder(TOTAL_AMOUNT, BOOKING_ID);

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Swachify",
        description: "Home Service Payment",
        order_id: order.id,
        prefill: {
          email: "user@email.com",
          contact: "9999999999",
          name: "User",
        },
        theme: { color: "#2563eb" },
      };

      paymentHandled.current = false;

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          if (paymentHandled.current) return;
          paymentHandled.current = true;

          await verifyPayment({
            order_id: data.razorpay_order_id,
            payment_id: data.razorpay_payment_id,
            signature: data.razorpay_signature,
            home_service_id: BOOKING_ID,
          });

          setPaymentSuccess(true);
        })
        .catch(() => {
          if (paymentHandled.current) return;
          paymentHandled.current = true;
          Alert.alert("Payment Failed", "Transaction cancelled");
        });
    } catch {
      Alert.alert("Error", "Unable to initiate payment");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>SERVICE DETAILS</Text>

        {addons.map((addon: any, index: number) => (
          <View key={index} style={styles.card}>
            <View style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{addon.service}</Text>

                <View style={styles.tagRow}>
                  <View style={styles.blueTag}>
                    <Text style={styles.blueTagText}>{floorArea} sqft</Text>
                  </View>
                  <Text style={styles.subInfoText}>{addon.duration}</Text>
                </View>

                <View style={styles.dateRow}>
                  <MaterialIcons
                    name="calendar-today"
                    size={14}
                    color="#94a3b8"
                  />
                  <Text style={styles.dateText}>
                    {addon.date} • {selectedTime}
                  </Text>
                </View>
              </View>

              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
                }}
                style={styles.serviceImage}
              />
            </View>
          </View>
        ))}

        <Text style={styles.sectionLabel}>PAYMENT BREAKDOWN</Text>

        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹147.50</Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handlePayment}>
          <Text style={styles.checkoutText}>Checkout ₹147.50</Text>
        </TouchableOpacity>
      </View>

      {/* SUCCESS MODAL */}
      <Modal visible={paymentSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MaterialIcons
              name="check-circle"
              size={80}
              color="#22c55e"
              style={{ marginBottom: 16 }}
            />

            <Text style={styles.modalTitle}>Payment Successful</Text>
            <Text style={styles.modalSub}>
              Your payment has been completed successfully.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setPaymentSuccess(false);

                if (!allocatedEmployee || !bookingDetails) {
                  Alert.alert(
                    "Error",
                    "Booking details missing. Please contact support."
                  );
                  return;
                }

                navigation.replace("PaymentSuccessDetails", {
                  allocatedEmployee,
                  bookingDetails,
                  transactionId: "CLEAN-88291",
                });
              }}
            >
              <Text style={styles.modalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentScreen;

/* ---------------- STYLES ---------------- */

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 15,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 100,
    },

    sectionLabel: {
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
      marginTop: 25,
      marginBottom: 10,
      letterSpacing: 0.5,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },

    serviceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    serviceInfo: {
      flex: 1,
      marginRight: 12,
    },

    serviceName: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
    },

    tagRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    blueTag: {
      backgroundColor: colors.primary + "33",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 8,
    },

    blueTagText: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: "700",
    },

    subInfoText: {
      color: colors.subText,
      fontSize: 13,
    },

    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    dateText: {
      color: colors.subText,
      fontSize: 14,
    },

    serviceImage: {
      width: 100,
      height: 100,
      borderRadius: 12,
    },

    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    totalLabel: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    totalValue: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: "800",
    },

    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      padding: 16,
      paddingBottom: 30,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    checkoutBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
    },

    checkoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalCard: {
      width: "85%",
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },

    modalTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 8,
    },

    modalSub: {
      color: colors.subText,
      fontSize: 14,
      textAlign: "center",
      marginBottom: 24,
    },

    modalBtn: {
      backgroundColor: colors.success || "#22c55e",
      borderRadius: 12,
      height: 48,
      paddingHorizontal: 40,
      justifyContent: "center",
      alignItems: "center",
    },

    modalBtnText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "800",
    },
  });
