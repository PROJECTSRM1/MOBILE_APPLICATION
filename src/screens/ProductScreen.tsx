import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

/* =======================
   TYPES
   ======================= */

interface ProductProps {
  id: string;
  title: string;
  stock: string;
  price: string;
  status: string;
  statusColor: string;
  image: string;
  faded?: boolean;
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
   SCREEN
   ======================= */

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  /* 🔥 PRODUCTS STATE (STATIC + DYNAMIC) */
  const [products, setProducts] = useState<ProductProps[]>([
    {
      id: "1",
      title: "Eco-friendly Cleaning Kit",
      stock: "45 units",
      price: "$24.99",
      status: "LIVE ON STORE",
      statusColor: "#22C55E",
      image:
        "https://images.unsplash.com/photo-1586105251261-72a756497a11",
    },
    {
      id: "2",
      title: "Smart Waste Segregator",
      stock: "12 units",
      price: "$89.00",
      status: "LOW STOCK",
      statusColor: "#F59E0B",
      image:
        "https://images.unsplash.com/photo-1618220179428-22790b461013",
    },
    {
      id: "3",
      title: "Organic Liquid Detergent",
      stock: "0 units",
      price: "$12.50",
      status: "SOLD OUT",
      statusColor: "#9CA3AF",
      image:
        "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c",
      faded: true,
    },
  ]);

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
                  setProducts(prev => [newProduct, ...prev]);
                },
              })
            }
          >
            <MaterialIcons name="add" size={22} color="#FFF" />
            <Text style={styles.primaryBtnText}>
              Register New Product
            </Text>
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
            <Stat title="ACTIVE" value="18" color="#22C55E" />
            <Stat title="DRAFTS" value="6" color="#F59E0B" />
          </View>

          {/* LIST HEADER */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Active Products</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("SwachifyMarketScreen")
              }
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* 🔥 DYNAMIC PRODUCTS */}
          {products.map(item => (
            <Product key={item.id} {...item} />
          ))}
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
}) => (
  <View style={[styles.productCard, faded && { opacity: 0.6 }]}>
    <Image source={{ uri: image }} style={styles.productImage} />

    <View style={styles.productContent}>
      <Text style={styles.productTitle}>{title}</Text>
      <Text style={styles.productSub}>
        Stock: {stock} • {price}
      </Text>

      <View style={styles.statusRow}>
        <View
          style={[styles.statusDot, { backgroundColor: statusColor }]}
        />
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
    <Text
      style={[
        styles.tabLabel,
        active && { color: "#3B82F6" },
      ]}
    >
      {label}
    </Text>
  </View>
);

export default PaymentScreen;

/* =======================
   STYLES (UNCHANGED)
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
  productTitle: { color: "#FFF", fontWeight: "800" },
  productSub: { color: "#9CA3AF", marginTop: 6 },
  statusRow: { flexDirection: "row", marginTop: 10, gap: 8 },
  statusDot: { width: 9, height: 9, borderRadius: 4.5 },
  statusText: { fontSize: 11, fontWeight: "800" },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#0F172A",
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 10, color: "#9CA3AF" },
});

