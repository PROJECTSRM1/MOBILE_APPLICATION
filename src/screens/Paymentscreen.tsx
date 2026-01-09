// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from "react-native";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { SafeAreaView } from "react-native-safe-area-context";

// const PaymentSummaryScreen = ({ navigation }: any) => { 
//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         {/* 2. Add onPress to the back button */}
//         <TouchableOpacity 
//           style={styles.backBtn} 
//           onPress={() => navigation.goBack()}
//         >
//           <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
//         </TouchableOpacity>
        
//         <Text style={styles.headerTitle}>Payment Summary</Text>
//         <View style={{ width: 40 }} /> 
//       </View>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* SERVICE DETAILS */}
//         <Text style={styles.sectionLabel}>SERVICE DETAILS</Text>
//         <View style={styles.card}>
//           <View style={styles.serviceRow}>
//             <View style={styles.serviceInfo}>
//               <Text style={styles.serviceName}>Deep Home Cleaning</Text>
//               <View style={styles.tagRow}>
//                 <View style={styles.blueTag}>
//                   <Text style={styles.blueTagText}>2 BHK</Text>
//                 </View>
//                 <Text style={styles.subInfoText}>Standard • 3 Hours</Text>
//               </View>
//               <View style={styles.dateRow}>
//                 <MaterialIcons name="calendar-today" size={14} color="#94a3b8" />
//                 <Text style={styles.dateText}>Sat, Oct 24 • 10:00 AM</Text>
//               </View>
//             </View>
//             <Image
//               source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop' }}
//               style={styles.serviceImage}
//             />
//           </View>
//         </View>

//         {/* PAYMENT METHOD */}
//         <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
//         <View style={styles.card}>
//           <View style={styles.paymentRow}>
//             <View style={styles.methodLeft}>
//               <View style={styles.cardIconBox}>
//                 <MaterialIcons name="credit-card" size={24} color="#fff" />
//               </View>
//               <View>
//                 <Text style={styles.methodTitle}>Apple Pay</Text>
//                 <Text style={styles.methodSub}>Default method</Text>
//               </View>
//             </View>
//             <TouchableOpacity>
//               <Text style={styles.changeText}>Change</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* PAYMENT BREAKDOWN */}
//         <Text style={styles.sectionLabel}>PAYMENT BREAKDOWN</Text>
//         <View style={styles.card}>
//           <View style={styles.breakdownRow}>
//             <Text style={styles.breakdownLabel}>Estimated Cost</Text>
//             <Text style={styles.breakdownValue}>$120.00</Text>
//           </View>
//           <View style={styles.breakdownRow}>
//             <Text style={styles.breakdownLabel}>Platform Fee</Text>
//             <Text style={styles.breakdownValue}>$5.00</Text>
//           </View>
//           <View style={styles.breakdownRow}>
//             <Text style={styles.breakdownLabel}>GST (18%)</Text>
//             <Text style={styles.breakdownValue}>$22.50</Text>
//           </View>
          
//           <View style={styles.divider} />

//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Total Payable</Text>
//             <Text style={styles.totalValue}>$147.50</Text>
//           </View>
//         </View>

//         {/* POLICY TEXT */}
//         <Text style={styles.policyText}>
//           By proceeding, you agree to our{" "}
//           <Text style={styles.linkText}>Terms of Service</Text> and{" "}
//           <Text style={styles.linkText}>Cancellation Policy</Text>.
//         </Text>
//       </ScrollView>

//       {/* FOOTER CTA */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.checkoutBtn}
//         onPress={() => navigation.navigate("EmployeeAllocation")}
//         >
//           <Text style={styles.checkoutText}>Checkout for Payment $147.50</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#020617", // Deep dark background
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 15,
//   },
//   backBtn: {
//     padding: 8,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 100,
//   },
//   sectionLabel: {
//     color: "#64748b",
//     fontSize: 12,
//     fontWeight: "600",
//     marginTop: 25,
//     marginBottom: 10,
//     letterSpacing: 0.5,
//   },
//   card: {
//     backgroundColor: "#0f172a", // Card background
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.05)",
//   },
//   serviceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   serviceInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   serviceName: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 8,
//   },
//   tagRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   blueTag: {
//     backgroundColor: "#1e3a8a",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   blueTagText: {
//     color: "#3b82f6",
//     fontSize: 10,
//     fontWeight: "700",
//   },
//   subInfoText: {
//     color: "#94a3b8",
//     fontSize: 13,
//   },
//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   dateText: {
//     color: "#94a3b8",
//     fontSize: 14,
//   },
//   serviceImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 12,
//   },
//   paymentRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   methodLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   cardIconBox: {
//     width: 44,
//     height: 34,
//     backgroundColor: "#1e293b",
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   methodTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   methodSub: {
//     color: "#64748b",
//     fontSize: 12,
//   },
//   changeText: {
//     color: "#2563eb",
//     fontWeight: "600",
//   },
//   breakdownRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   breakdownLabel: {
//     color: "#94a3b8",
//     fontSize: 15,
//   },
//   breakdownValue: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "rgba(255,255,255,0.1)",
//     marginVertical: 15,
//   },
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   totalLabel: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   totalValue: {
//     color: "#2563eb",
//     fontSize: 22,
//     fontWeight: "800",
//   },
//   policyText: {
//     color: "#64748b",
//     fontSize: 12,
//     textAlign: "center",
//     marginTop: 25,
//     lineHeight: 18,
//   },
//   linkText: {
//     textDecorationLine: "underline",
//   },
//   footer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#020617",
//     padding: 16,
//     paddingBottom: 30,
//   },
//   checkoutBtn: {
//     backgroundColor: "#2563eb",
//     borderRadius: 12,
//     height: 56,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checkoutText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });

// export default PaymentSummaryScreen;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

const PaymentScreen = ({ navigation }: any) => {
  const route = useRoute<any>();

  const {
    services = [],
    floorArea,
    jobDate,
    selectedTime,
    addonsCount,
  } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment Summary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* SERVICE DETAILS */}
        <Text style={styles.sectionLabel}>SERVICE DETAILS</Text>

        {services.map((service: string, index: number) => (
          <View key={index} style={styles.card}>
            <View style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service}</Text>

                <View style={styles.tagRow}>
                  <View style={styles.blueTag}>
                    <Text style={styles.blueTagText}>{floorArea} sqft</Text>
                  </View>
                  <Text style={styles.subInfoText}>Addon Service</Text>
                </View>

                <View style={styles.dateRow}>
                  <MaterialIcons
                    name="calendar-today"
                    size={14}
                    color="#94a3b8"
                  />
                  <Text style={styles.dateText}>
                    {jobDate} • {selectedTime}
                  </Text>
                </View>
              </View>

              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop",
                }}
                style={styles.serviceImage}
              />
            </View>
          </View>
        ))}

        {/* PAYMENT METHOD */}
        <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <View style={styles.methodLeft}>
              <View style={styles.cardIconBox}>
                <MaterialIcons name="credit-card" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.methodTitle}>Apple Pay</Text>
                <Text style={styles.methodSub}>Default method</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PAYMENT BREAKDOWN */}
        <Text style={styles.sectionLabel}>PAYMENT BREAKDOWN</Text>
        <View style={styles.card}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              Addon Services ({addonsCount})
            </Text>
            <Text style={styles.breakdownValue}>$120.00</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Platform Fee</Text>
            <Text style={styles.breakdownValue}>$5.00</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>GST (18%)</Text>
            <Text style={styles.breakdownValue}>$22.50</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>$147.50</Text>
          </View>
        </View>

        <Text style={styles.policyText}>
          By proceeding, you agree to our{" "}
          <Text style={styles.linkText}>Terms of Service</Text> and{" "}
          <Text style={styles.linkText}>Cancellation Policy</Text>.
        </Text>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("EmployeeAllocation")}
        >
          <Text style={styles.checkoutText}>Checkout for Payment $147.50</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617", // Deep dark background
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
    backgroundColor: "#0f172a", // Card background
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

export default PaymentScreen;