import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

interface CartItem {
  id: string;
  title: string;
  category: string;
  duration?: string;
  price: number;
}

const CartScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const styles = getStyles(colors) as any;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);

  /* ================= LOAD REAL DATA FROM STORAGE ================= */
  const loadCartData = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("cartItems");
      if (storedItems) {
        setCartItems(JSON.parse(storedItems));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCartData();
    }, [])
  );

  /* ================= REMOVE ITEM LOGIC ================= */
  const removeItem = async (id: string) => {
    try {
      const updated = cartItems.filter((i) => i.id !== id);
      setCartItems(updated);
      await AsyncStorage.setItem("cartItems", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  /* ================= CALCULATIONS ================= */
  const serviceTotal = cartItems.reduce((sum, i) => sum + i.price, 0);
  const convenienceFee = cartItems.length ? 49 : 0;
  const totalPayable = serviceTotal + convenienceFee;

  /* ================= EMPTY STATE UI ================= */
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.emptyContainer}>
          <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
          <MaterialIcons name="shopping-cart" size={80} color={colors.border} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>
            Looks like you haven't added any services yet.
          </Text>
          <TouchableOpacity 
            style={styles.goBackBtn} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
      
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Cart ({cartItems.length})</Text>
          <View style={{ width: 24 }} />
        </View>

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

              <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => removeItem(item.id)}
              >
                <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Safety Note */}
          <View style={styles.safetyCard}>
            <MaterialIcons name="verified-user" size={20} color="#10b981" />
            <Text style={styles.safetyText}>UC Safe: Professionals follow 100% safety protocols</Text>
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>

        {/* BOTTOM ACTION BAR */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.priceContainer} 
            onPress={() => setShowPriceBreakup(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Text style={styles.totalAmount}>₹{totalPayable}</Text>
               <MaterialIcons name="keyboard-arrow-up" size={20} color={colors.text} />
            </View>
            <Text style={styles.viewDetailText}>View Price Breakup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={() => navigation.navigate("BookCleaning", { 
              selectedServices: cartItems 
            })}
          >
            <Text style={styles.proceedText}>Proceed to Book</Text>
          </TouchableOpacity>
        </View>

        {/* PRICE BREAKUP MODAL */}
        {showPriceBreakup && (
          <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={() => setShowPriceBreakup(false)}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalIndicator} />
              <Text style={styles.modalTitle}>Payment Summary</Text>

              <Row label="Item Total" value={serviceTotal} styles={styles} />
              <Row label="Convenience Fee" value={convenienceFee} styles={styles} />
              
              <View style={styles.divider} />
              
              <Row label="Total Payable" value={totalPayable} bold styles={styles} />

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowPriceBreakup(false)}
              >
                <Text style={{ color: "#fff", fontWeight: '700' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

/* ================= HELPER COMPONENT ================= */
const Row = ({ label, value, bold, styles }: any) => (
  <View style={styles.row}>
    <Text style={[styles.rowText, bold && styles.boldText]}>{label}</Text>
    <Text style={[styles.rowText, bold && styles.boldText]}>₹{value}</Text>
  </View>
);

/* ================= STYLES ================= */
const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.surface, // Matches header/footer background
    },
    container: { 
      flex: 1, 
      backgroundColor: colors.background 
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
    card: {
      flexDirection: "row",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    serviceTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
    serviceMeta: { color: colors.subText, fontSize: 12, marginVertical: 4 },
    price: { color: colors.text, fontWeight: "700", fontSize: 15, marginTop: 4 },
    deleteBtn: { padding: 8 },
    safetyCard: {
      flexDirection: 'row',
      backgroundColor: '#f0fdf4',
      margin: 16,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      gap: 10,
    },
    safetyText: { color: '#065f46', fontSize: 12, flex: 1 },
    
    /* BOTTOM BAR */
    bottomBar: {
      backgroundColor: colors.surface,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      // Removed absolute positioning as SafeAreaView handles the spacing
    },
    priceContainer: { flex: 1 },
    totalAmount: { color: colors.text, fontSize: 20, fontWeight: "800" },
    viewDetailText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
    proceedBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
    },
    proceedText: { color: "#fff", fontWeight: "700", fontSize: 15 },

    /* EMPTY STATE */
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "700", marginTop: 20 },
    emptySub: { color: colors.subText, textAlign: 'center', marginTop: 10, fontSize: 14 },
    goBackBtn: { marginTop: 30, backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
    goBackText: { color: '#fff', fontWeight: '700' },

    /* MODAL */
    modalOverlay: {
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: colors.surface,
      padding: 24,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    modalIndicator: { width: 40, height: 4, backgroundColor: colors.border, alignSelf: 'center', borderRadius: 2, marginBottom: 20 },
    modalTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 20 },
    row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
    rowText: { color: colors.subText, fontSize: 14 },
    boldText: { color: colors.text, fontWeight: "700", fontSize: 16 },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 15 },
    closeBtn: { marginTop: 20, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  });

export default CartScreen;