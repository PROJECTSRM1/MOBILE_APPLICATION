import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const CART_STORAGE_KEY = "swachify_cart";

export default function swachifycart() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  };

  const updateQuantity = async (id: number, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const removeItem = async (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * (item.quantity || 1)), 0
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.itemBrand, { color: colors.subText }]}>{item.brand}</Text>
        <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.price}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
            <MaterialIcons name="remove" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity || 1}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
            <MaterialIcons name="add" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteBtn}>
        <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <MaterialIcons name="shopping-cart" size={80} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.subText }]}>Your cart is empty</Text>
          <TouchableOpacity 
            style={[styles.shopBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.shopBtnText}>Go Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
          />
          <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.subText }]}>Total Amount</Text>
              <Text style={[styles.totalPrice, { color: colors.text }]}>₹{calculateTotal().toLocaleString('en-IN')}</Text>
            </View>
            <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  cartItem: { flexDirection: 'row', padding: 12, borderRadius: 16, marginBottom: 16, borderWidth: 1, alignItems: 'center' },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemTitle: { fontSize: 15, fontWeight: '700' },
  itemBrand: { fontSize: 12, marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 15 },
  qtyBtn: { padding: 4, borderRadius: 6, backgroundColor: 'rgba(157, 166, 185, 0.1)' },
  qtyText: { fontSize: 14, fontWeight: '700' },
  deleteBtn: { padding: 8 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, marginTop: 16 },
  shopBtn: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  shopBtnText: { color: '#fff', fontWeight: '700' },
  footer: { padding: 20, borderTopWidth: 1 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 14 },
  totalPrice: { fontSize: 20, fontWeight: '800' },
  checkoutBtn: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});