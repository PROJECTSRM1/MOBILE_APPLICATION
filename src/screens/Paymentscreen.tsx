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
import { createOrder, verifyPayment } from "../services/paymentApi";

const RAZORPAY_KEY = "rzp_test_RnpmMY4LPogJ7J";

const PaymentScreen = ({ navigation }: any) => {
  const paymentHandled = useRef(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const route = useRoute<any>();

  const {
    addons = [],
    floorArea,
    selectedTime,
  } = route.params || {};

  const TOTAL_AMOUNT = 14750;
  const BOOKING_ID = 26; // ✅ REAL home_service_id

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

          // ✅ SHOW SUCCESS POPUP
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
                  <MaterialIcons name="calendar-today" size={14} color="#94a3b8" />
                  <Text style={styles.dateText}>
                    {addon.date} • {selectedTime}
                  </Text>
                </View>
              </View>

              <Image
                source={{ uri: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a" }}
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handlePayment}>
          <Text style={styles.checkoutText}>Checkout ₹147.50</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ SUCCESS POPUP */}
      <Modal
        visible={paymentSuccess}
        transparent
        animationType="fade"
      >
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
              onPress={() => setPaymentSuccess(false)}
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



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},

modalCard: {
  width: "85%",
  backgroundColor: "#0f172a",
  borderRadius: 20,
  padding: 24,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},

modalTitle: {
  color: "#fff",
  fontSize: 22,
  fontWeight: "800",
  marginBottom: 8,
},

modalSub: {
  color: "#94a3b8",
  fontSize: 14,
  textAlign: "center",
  marginBottom: 24,
},

modalBtn: {
  backgroundColor: "#22c55e",
  borderRadius: 12,
  height: 48,
  paddingHorizontal: 40,
  justifyContent: "center",
  alignItems: "center",
},

modalBtnText: {
  color: "#020617",
  fontSize: 16,
  fontWeight: "800",
},

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
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
    color: "#fff",
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
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  blueTagText: {
    color: "#3b82f6",
    fontSize: 10,
    fontWeight: "700",
  },
  subInfoText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconBox: {
    width: 44,
    height: 34,
    backgroundColor: "#1e293b",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  methodTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  methodSub: {
    color: "#64748b",
    fontSize: 12,
  },
  changeText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  breakdownLabel: {
    color: "#94a3b8",
    fontSize: 15,
  },
  breakdownValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    color: "#2563eb",
    fontSize: 22,
    fontWeight: "800",
  },
  policyText: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    marginTop: 25,
    lineHeight: 18,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#020617",
    padding: 16,
    paddingBottom: 30,
  },
  checkoutBtn: {
    backgroundColor: "#2563eb",
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
});

