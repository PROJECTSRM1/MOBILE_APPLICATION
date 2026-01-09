import React from "react";
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

/* =======================
   TYPES
   ======================= */

interface ProductProps {
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
          {/* PRIMARY BUTTON */}
          <TouchableOpacity style={styles.primaryBtn}>
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
            <Stat title="TOTAL" value="24" />
            <Stat title="ACTIVE" value="18" color="#22C55E" />
            <Stat title="DRAFTS" value="6" color="#F59E0B" />
          </View>

          {/* LIST HEADER */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Active Products</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          {/* PRODUCTS */}
          <Product
            title="Eco-friendly Cleaning Kit"
            stock="45 units"
            price="$24.99"
            status="LIVE ON STORE"
            statusColor="#22C55E"
            image="https://images.unsplash.com/photo-1586105251261-72a756497a11"
          />

          <Product
            title="Smart Waste Segregator"
            stock="12 units"
            price="$89.00"
            status="LOW STOCK"
            statusColor="#F59E0B"
            image="https://images.unsplash.com/photo-1618220179428-22790b461013"
          />

          <Product
            title="Organic Liquid Detergent"
            stock="0 units"
            price="$12.50"
            status="SOLD OUT"
            statusColor="#9CA3AF"
            image="https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c"
            faded
          />

          <Product
            title="All-Purpose Bio-Cleaner"
            stock="120 units"
            price="$15.00"
            status="UNDER REVIEW"
            statusColor="#3B82F6"
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          />
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

const Stat: React.FC<StatProps> = ({
  title,
  value,
  color = "#FFFFFF",
}) => (
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
      <Text style={styles.productTitle} numberOfLines={2}>
        {title}
      </Text>

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

    <MaterialIcons
      name="more-vert"
      size={22}
      color="#9CA3AF"
      style={{ marginTop: 6 }}
    />
  </View>
);

const Tab: React.FC<TabProps> = ({
  icon,
  label,
  active = false,
}) => (
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
   STYLES
   ======================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  container: {
    flex: 1,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },

  headerSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  headerActions: {
    flexDirection: "row",
    gap: 14,
  },

  /* CONTENT */
  content: {
    padding: 16,
    paddingBottom: 120,
  },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    marginBottom: 16,
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  searchPlaceholder: {
    flex: 1,
    color: "#9CA3AF",
    marginLeft: 8,
  },

  /* STATS */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#1F2937",
    marginHorizontal: 4,
    borderRadius: 14,
    padding: 14,
  },

  statTitle: {
    fontSize: 11,
    fontWeight: "700",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* LIST */
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  listTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  viewAll: {
    color: "#3B82F6",
    fontWeight: "700",
  },

  /* PRODUCT CARD (ENLARGED & PROFESSIONAL) */
  productCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#1F2937",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#111827",
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 16,
  },

  productContent: {
    flex: 1,
    paddingTop: 2,
  },

  productTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  productSub: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 6,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* BOTTOM TAB */
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    backgroundColor: "#0F172A",
  },

  tabItem: {
    alignItems: "center",
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    marginTop: 2,
  },
});