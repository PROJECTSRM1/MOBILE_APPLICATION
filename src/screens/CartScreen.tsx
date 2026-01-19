import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

interface CartItem {
  id: string;
  title: string;
  category: string;
  duration?: string;
  price: number;
}

const CartScreen = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [cartItems, setCartItems] = useState<CartItem[]>([
  {
    id: "clean-001",
    title: "Bathroom Deep Cleaning",
    category: "Housing / Cleaning",
    duration: "2 hrs",
    price: 899,
  },
  {
    id: "edu-002",
    title: "Math Home Tutor (Class 10)",
    category: "Education",
    duration: "1 hr",
    price: 500,
  },
  {
    id: "free-003",
    title: "Electrician – Power Issue",
    category: "Freelance",
    price: 300,
  },
]);

  const [loading, setLoading] = useState(false);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);

  /* ================= LOAD CART ================= */


// const loadCart = useCallback(async () => {
//   try {
//     setLoading(true);
//     const data = await AsyncStorage.getItem("cartItems");
//     setCartItems(data ? JSON.parse(data) : []);
//   } catch (e) {
//     console.log("Failed to load cart", e);
//     setCartItems([]);
//   } finally {
//     setLoading(false);
//   }
// }, []);

// useFocusEffect(
//   useCallback(() => {
//     loadCart();
//   }, [loadCart])
// );


//   useEffect(() => {
//     loadCart();
//   }, [loadCart]);

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (id: string) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    await AsyncStorage.setItem("cartItems", JSON.stringify(updated));
  };

  /* ================= CALCULATIONS ================= */
  const serviceTotal = cartItems.reduce((sum, i) => sum + i.price, 0);
  const convenienceFee = cartItems.length ? 49 : 0;
  const totalPayable = serviceTotal + convenienceFee;

  /* ================= EMPTY STATE ================= */
  if (!cartItems.length) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="shopping-cart" size={64} color="#334155" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>
          Add services from Core Services to continue
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      {/* SERVICES */}
      {/* <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadCart} />
        }
      > */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceMeta}>
                {item.category}
                {item.duration ? ` • ${item.duration}` : ""}
              </Text>
              <Text style={styles.price}>₹{item.price}</Text>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => setShowPriceBreakup(true)}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalAmount}>₹{totalPayable}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.proceedBtn}> */}
        <TouchableOpacity
  style={[
    styles.proceedBtn,
    cartItems.length === 0 && { opacity: 0.5 },
  ]}
  disabled={cartItems.length === 0}
>

          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
      </View>

      {/* PRICE BREAKUP */}
      {showPriceBreakup && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Price Details</Text>

            <Row label="Services" value={serviceTotal} />
            <Row label="Convenience Fee" value={convenienceFee} />
            <View style={styles.divider} />
            <Row label="Total" value={totalPayable} bold />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowPriceBreakup(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const Row = ({ label, value, bold }: any) => (
  <View style={styles.row}>
    <Text style={[styles.rowText, bold && styles.bold]}>{label}</Text>
    <Text style={[styles.rowText, bold && styles.bold]}>₹{value}</Text>
  </View>
);

export default CartScreen;


/* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0f172a",
//   },

//   header: {
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderColor: "#1e293b",
//   },

//   headerTitle: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "600",
//   },

//   cartBadge: {
//     position: "absolute",
//     top: -6,
//     right: -8,
//     backgroundColor: "#ef4444",
//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 4,
//   },

//   cartBadgeText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "700",
//   },

//   safetyBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#052e16",
//     margin: 16,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     gap: 6,
//   },

//   safetyText: {
//     color: "#22c55e",
//     fontSize: 13,
//     fontWeight: "500",
//   },

//   serviceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 18,
//     borderBottomWidth: 1,
//     borderColor: "#1e293b",
//   },

//   serviceTitle: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   serviceMeta: {
//     color: "#9ca3af",
//     fontSize: 13,
//     marginTop: 4,
//   },

//   addMore: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 18,
//   },

//   addMoreText: {
//     color: "#2563eb",
//     fontSize: 14,
//     marginLeft: 6,
//     fontWeight: "500",
//   },

//   bottomBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#020617",
//     borderTopWidth: 1,
//     borderColor: "#1e293b",
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   totalLabel: {
//     color: "#9ca3af",
//     fontSize: 12,
//   },

//   totalAmount: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },

//   breakupText: {
//     color: "#3b82f6",
//     fontSize: 12,
//     marginTop: 2,
//   },

//   bookBtn: {
//     backgroundColor: "#2563eb",
//     paddingHorizontal: 28,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },

//   bookText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
//   },

//   modalOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },

//   modalSheet: {
//     backgroundColor: "#020617",
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     padding: 20,
//   },

//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },

//   modalTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   priceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//   },

//   priceLabel: {
//     color: "#9ca3af",
//     fontSize: 14,
//   },

//   priceValue: {
//     color: "#fff",
//     fontSize: 14,
//   },

//   divider: {
//     height: 1,
//     backgroundColor: "#1e293b",
//     marginVertical: 10,
//   },

//   totalFinal: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#1e293b",
  },

  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },

  card: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  serviceTitle: { color: "#fff", fontSize: 15, fontWeight: "500" },
  serviceMeta: { color: "#9ca3af", fontSize: 12, marginVertical: 4 },
  price: { color: "#3b82f6", fontWeight: "600" },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#020617",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#1e293b",
  },

  totalLabel: { color: "#9ca3af", fontSize: 12 },
  totalAmount: { color: "#fff", fontSize: 18, fontWeight: "600" },

  proceedBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },

  proceedText: { color: "#fff", fontWeight: "600" },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  emptyTitle: { color: "#fff", fontSize: 18, marginTop: 12 },
  emptySub: { color: "#9ca3af", marginTop: 4 },

  modalOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#020617",
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  modalTitle: { color: "#fff", fontSize: 16, marginBottom: 16 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  rowText: { color: "#9ca3af" },
  bold: { color: "#fff", fontWeight: "600" },

  divider: { height: 1, backgroundColor: "#1e293b", marginVertical: 10 },

  closeBtn: {
    marginTop: 16,
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
