import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* =======================
   TYPES
   ======================= */

interface ProductProps {
  id: string | number;
  title: string;
  stock: string;
  price: string;
  status: string;
  statusColor: string;
  image: string;
  faded?: boolean;
  brand?: string;
  category?: string;
}

interface TabProps {
  icon: string;
  label: string;
  active?: boolean;
}

interface StatProps {
  title: string;
  value: string;
  color?: string;
}

/* =======================
   INITIAL STATIC PRODUCTS
   ======================= */

const STATIC_PRODUCTS: ProductProps[] = [
  {
    id: "1",
    title: "Eco-friendly Cleaning Kit",
    stock: "45 units",
    price: "$24.99",
    status: "LIVE ON STORE",
    statusColor: "#22C55E",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
  },
  {
    id: "2",
    title: "Smart Waste Segregator",
    stock: "12 units",
    price: "$89.00",
    status: "LOW STOCK",
    statusColor: "#F59E0B",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
  },
  {
    id: "3",
    title: "Organic Liquid Detergent",
    stock: "0 units",
    price: "$12.50",
    status: "SOLD OUT",
    statusColor: "#9CA3AF",
    image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c",
    faded: true,
  },
];

/* =======================
   SCREEN
   ======================= */

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [products, setProducts] = useState<ProductProps[]>(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(true);

  /* LOAD PRODUCTS FROM ASYNC STORAGE */
  const loadProducts = async () => {
    try {
      const registeredProductsJson = await AsyncStorage.getItem("@registered_products");
      const registeredProducts = registeredProductsJson
        ? JSON.parse(registeredProductsJson)
        : [];

      // Combine static products with registered products
      const combined = [...registeredProducts, ...STATIC_PRODUCTS];
      setProducts(combined);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  /* RELOAD WHEN SCREEN COMES INTO FOCUS */
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  /* CALCULATE STATS */
  const activeProducts = products.filter(
    (p) => p.status === "LIVE ON STORE"
  ).length;
  const lowStockProducts = products.filter(
    (p) => p.status === "LOW STOCK"
  ).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={22} color="#3B82F6" />
            </View>

            <View>
              <Text style={styles.headerSubtitle}>Seller Portal</Text>
              <Text style={styles.headerTitle}>Swachify Products</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <MaterialIcons name="notifications" size={22} color="#FACC15" />
            <MaterialIcons name="settings" size={22} color="#93C5FD" />
          </View>
        </View>

        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* REGISTER BUTTON */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate("ProductRegistration", {
                onAddProduct: (newProduct: ProductProps) => {
                  setProducts((prev) => [newProduct, ...prev]);
                },
              })
            }
          >
            <MaterialIcons name="add" size={22} color="#FFF" />
            <Text style={styles.primaryBtnText}>Register New Product</Text>
          </TouchableOpacity>

          {/* SEARCH */}
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>
              Search your inventory...
            </Text>
            <MaterialIcons name="tune" size={20} color="#9CA3AF" />
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <Stat title="TOTAL" value={products.length.toString()} />
            <Stat
              title="ACTIVE"
              value={activeProducts.toString()}
              color="#22C55E"
            />
            <Stat
              title="LOW STOCK"
              value={lowStockProducts.toString()}
              color="#F59E0B"
            />
          </View>

          {/* LIST HEADER */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Active Products</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SwachifyMarketScreen")}
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* LOADING STATE */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <MaterialIcons name="refresh" size={32} color="#3B82F6" />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : products.length > 0 ? (
            /* PRODUCTS LIST */
            products.map((item) => <Product key={item.id} {...item} />)
          ) : (
            /* EMPTY STATE */
            <View style={styles.emptyState}>
              <MaterialIcons name="inventory-2" size={48} color="#6B7280" />
              <Text style={styles.emptyText}>No products yet</Text>
              <Text style={styles.emptySubtext}>
                Register your first product to get started
              </Text>
            </View>
          )}
        </ScrollView>

        {/* BOTTOM TAB */}
        <View style={styles.bottomTab}>
          <Tab icon="inventory" label="Inventory" active />
          <Tab icon="shopping-cart" label="Orders" />
          <Tab icon="bar-chart" label="Insights" />
          <Tab icon="person" label="Profile" />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* =======================
   COMPONENTS
   ======================= */

const Stat: React.FC<StatProps> = ({ title, value, color = "#FFFFFF" }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statTitle, { color }]}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const Product: React.FC<ProductProps> = ({
  title,
  stock,
  price,
  status,
  statusColor,
  image,
  faded = false,
  brand,
}) => (
  <View style={[styles.productCard, faded && { opacity: 0.6 }]}>
    <Image source={{ uri: image }} style={styles.productImage} />

    <View style={styles.productContent}>
      <Text style={styles.productTitle} numberOfLines={1}>
        {title}
      </Text>
      {brand && <Text style={styles.productBrand}>{brand}</Text>}
      <Text style={styles.productSub}>
        Stock: {stock} • {price}
      </Text>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {status}
        </Text>
      </View>
    </View>

    <MaterialIcons name="more-vert" size={22} color="#9CA3AF" />
  </View>
);

const Tab: React.FC<TabProps> = ({ icon, label, active = false }) => (
  <View style={styles.tabItem}>
    <MaterialIcons
      name={icon}
      size={22}
      color={active ? "#3B82F6" : "#9CA3AF"}
    />
    <Text style={[styles.tabLabel, active && { color: "#3B82F6" }]}>
      {label}
    </Text>
  </View>
);

export default PaymentScreen;

/* =======================
   STYLES
   ======================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: { flexDirection: "row", gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerSubtitle: { color: "#9CA3AF", fontSize: 12 },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  headerActions: { flexDirection: "row", gap: 14 },
  content: { padding: 16, paddingBottom: 120 },
  primaryBtn: {
    flexDirection: "row",
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "700" },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchPlaceholder: { flex: 1, color: "#9CA3AF", marginLeft: 8 },
  statsRow: { flexDirection: "row", marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#1F2937",
    marginHorizontal: 4,
    padding: 14,
    borderRadius: 14,
  },
  statTitle: { fontSize: 11, fontWeight: "700" },
  statValue: { fontSize: 22, color: "#FFF", fontWeight: "800" },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listTitle: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  viewAll: { color: "#3B82F6", fontWeight: "700" },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  productImage: { width: 80, height: 80, borderRadius: 14 },
  productContent: { flex: 1, marginLeft: 16 },
  productTitle: { color: "#FFF", fontWeight: "800", fontSize: 15 },
  productBrand: { color: "#60A5FA", fontSize: 12, marginTop: 2 },
  productSub: { color: "#9CA3AF", marginTop: 6, fontSize: 13 },
  statusRow: { flexDirection: "row", marginTop: 10, gap: 8, alignItems: "center" },
  statusDot: { width: 9, height: 9, borderRadius: 4.5 },
  statusText: { fontSize: 11, fontWeight: "800" },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySubtext: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#0F172A",
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 10, color: "#9CA3AF" },
});