import React, { useState, useEffect, useMemo } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, FlatList, Alert, RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";
import RegisterProductModal from "./RegisterProductModal";

const PRODUCTS_KEY = "swachify_products";
const ORDERS_KEY = "swachify_orders";

// === STATIC DEMO DATA ===
const DEMO_PRODUCTS = [
  {
    id: "demo_1",
    title: "Eco-Friendly Bamboo Toothbrush",
    price: "499",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
    tag: "Company",
    brand: "Nature's Essence"
  },
  {
    id: "demo_2",
    title: "Organic Cotton Tote Bag",
    price: "1200",
    image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400",
    tag: "Entrepreneur",
    brand: "Nature's Essence"
  }
];

const DEMO_ORDERS = [
  {
    orderId: "ord_demo_1",
    customerName: "Rahul Sharma",
    orderDate: "Today, 10:30 AM",
    productTitle: "Eco-Friendly Bamboo Toothbrush",
    price: "499",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
    status: "Paid"
  },
  {
    orderId: "ord_demo_2",
    customerName: "Ananya Iyer",
    orderDate: "Yesterday, 04:15 PM",
    productTitle: "Organic Cotton Tote Bag",
    price: "1200",
    image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400",
    status: "Paid"
  }
];

export default function SwachifyPartnerScreen() {
  const { colors, lightMode } = useTheme(); // Added isDark to handle StatusBar barStyle
  const styles = getStyles(colors);

  const [activeTab, setActiveTab] = useState("orders");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
      const storedOrders = await AsyncStorage.getItem(ORDERS_KEY);
      
      const realProducts = storedProducts ? JSON.parse(storedProducts) : [];
      setProducts([...realProducts, ...DEMO_PRODUCTS]);

      const realOrders = storedOrders ? JSON.parse(storedOrders) : [];
      setOrders([...realOrders, ...DEMO_ORDERS]);

    } catch (e) {
      console.error("Error loading partner data", e);
    } finally {
      setRefreshing(false);
    }
  };

  const totalRevenue = useMemo(() => 
    orders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0), 
  [orders]);

  const renderOrderItem = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderTopRow}>
        <View style={styles.customerInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.customerName ? item.customerName[0] : 'U'}</Text>
          </View>
          <View>
            <Text style={styles.customerName}>{item.customerName || 'Unknown Customer'}</Text>
            <Text style={styles.orderTime}>{item.orderDate}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status || 'Paid'}</Text>
        </View>
      </View>

      <View style={styles.orderDivider} />

      <View style={styles.orderProductRow}>
        <Image source={{ uri: item.image }} style={styles.orderProdImage} />
        <View style={styles.orderProdDetails}>
          <Text style={styles.orderProdTitle} numberOfLines={1}>{item.productTitle}</Text>
          <Text style={styles.orderProdPrice}>₹{parseFloat(item.price).toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity style={styles.shipBtn}>
          <Text style={styles.shipBtnText}>Ship</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInventoryItem = ({ item }: any) => {
    const itemId = String(item.id || '');
    const isDemo = itemId.includes('demo');

    return (
      <View style={styles.inventoryCard}>
        <Image source={{ uri: item.image }} style={styles.invImage} />
        <View style={styles.invInfo}>
          <Text style={styles.invTitle}>{item.title}</Text>
          <Text style={styles.invPrice}>₹{parseFloat(item.price).toLocaleString('en-IN')}</Text>
          <Text style={styles.invStock}>In Stock: 12 units</Text>
        </View>
        
        {!isDemo && (
          <TouchableOpacity 
            onPress={() => Alert.alert("Delete", "Delete product?", [
              {text: "Cancel"}, 
              {text: "Yes", onPress: () => {
                 const updated = products.filter(p => p.id !== item.id);
                 setProducts(updated);
                 AsyncStorage.setItem(
                   PRODUCTS_KEY, 
                   JSON.stringify(updated.filter(p => !String(p.id).includes('demo')))
                 );
              }}
            ])}
          >
            <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Dynamic StatusBar based on theme */}
      <StatusBar 
        barStyle={!lightMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      <SafeAreaView style={{ flex: 1 }}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.dashboardLabel}>Partner Dashboard</Text>
            <Text style={styles.businessName}>Nature's Essence Ltd.</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <MaterialIcons name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "orders" && styles.activeTab]}
            onPress={() => setActiveTab("orders")}
          >
            <MaterialIcons 
               name="shopping-basket" 
               size={20} 
               color={activeTab === "orders" ? "#fff" : colors.subText} 
            />
            <Text style={[styles.tabText, activeTab === "orders" && styles.activeTabText]}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "inventory" && styles.activeTab]}
            onPress={() => setActiveTab("inventory")}
          >
            <MaterialIcons 
               name="inventory" 
               size={20} 
               color={activeTab === "inventory" ? "#fff" : colors.subText} 
            />
            <Text style={[styles.tabText, activeTab === "inventory" && styles.activeTabText]}>Inventory</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeTab === "orders" ? orders : products}
          keyExtractor={(item, index) => (item.id || item.orderId || index).toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor={colors.primary} />}
          renderItem={activeTab === "orders" ? renderOrderItem : renderInventoryItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <MaterialIcons name="history" size={64} color={colors.border} />
              <Text style={styles.emptyText}>No data found</Text>
            </View>
          }
        />

        <TouchableOpacity style={styles.fab} onPress={() => setShowRegisterModal(true)}>
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>

      </SafeAreaView>

      <RegisterProductModal 
        visible={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSubmit={loadData}
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  dashboardLabel: { color: colors.subText, fontSize: 14 },
  businessName: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
  settingsBtn: { backgroundColor: colors.card, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  
  statsContainer: { 
    flexDirection: 'row', 
    backgroundColor: colors.card, 
    margin: 16, 
    borderRadius: 20, 
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
  statValue: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: colors.subText, fontSize: 12, marginTop: 4 },

  tabContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, gap: 10 },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    paddingVertical: 12, 
    borderRadius: 12, 
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  activeTab: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.subText, fontWeight: '600' },
  activeTabText: { color: "#fff" },

  // Order Card Styles
  orderCard: { 
    backgroundColor: colors.card, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerInfo: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: "#fff", fontWeight: 'bold' },
  customerName: { color: colors.text, fontWeight: 'bold', fontSize: 15 },
  orderTime: { color: colors.subText, fontSize: 12 },
  statusBadge: { backgroundColor: colors.success + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: colors.success, fontSize: 10, fontWeight: 'bold' },
  orderDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  orderProductRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orderProdImage: { width: 50, height: 50, borderRadius: 8 },
  orderProdDetails: { flex: 1 },
  orderProdTitle: { color: colors.text, fontSize: 14 },
  orderProdPrice: { color: colors.primary, fontWeight: 'bold', marginTop: 2 },
  shipBtn: { backgroundColor: colors.text, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  shipBtnText: { color: colors.background, fontWeight: 'bold', fontSize: 12 },

  // Inventory Card Styles
  inventoryCard: { 
    flexDirection: 'row', 
    backgroundColor: colors.card, 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 10, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  invImage: { width: 60, height: 60, borderRadius: 10 },
  invInfo: { flex: 1, marginLeft: 12 },
  invTitle: { color: colors.text, fontWeight: 'bold' },
  invPrice: { color: colors.primary, fontSize: 14, fontWeight: 'bold' },
  invStock: { color: colors.subText, fontSize: 11, marginTop: 2 },

  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 30, 
    backgroundColor: colors.primary, 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 8,
    shadowColor: colors.text,
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  emptyView: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.subText, marginTop: 10, fontSize: 16 }
});