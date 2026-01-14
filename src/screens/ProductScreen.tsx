import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/* =======================
   TYPES
======================= */

type MarketItem = {
  id: number;
  title: string;
  price: string;
  image: string;
  distance: number;
  rating: number;
  createdAt: string;
};

type ServiceItem = {
  id: number;
  title: string;
  distance: number;
  price: string;
};

/* =======================
   MOCK DATA
======================= */

const PRODUCTS: MarketItem[] = [
  {
    id: 1,
    title: "Bamboo Toothbrush Set",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    distance: 2.4,
    rating: 4.6,
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    title: "Glass Water Bottle",
    price: "$24.50",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    distance: 31,
    rating: 4.4,
    createdAt: "2025-01-14",
  },
  {
    id: 3,
    title: "Organic Cotton Tote",
    price: "$15.00",
    image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93",
    distance: 6.8,
    rating: 4.1,
    createdAt: "2025-01-12",
  },
  {
    id: 4,
    title: "Handmade Lavender Soap",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25",
    distance: 2,
    rating: 4.8,
    createdAt: "2025-01-16",
  },
];

const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Plastic Waste Collection",
    distance: 1.2,
    price: "Free",
  },
  {
    id: 2,
    title: "Eco-Home Cleaning",
    distance: 3.5,
    price: "$25/hr",
  },
];

/* =======================
   SCREEN
======================= */

const ProductScreen = () => {
  const [search, setSearch] = useState("");
//   const [ratingSort, setRatingSort] = useState<"low-high" | "high-low" | null>(
//     null
//   );

// type DistanceFilter = "0-10" | "10-20" | "20-40" | "40+" | null;
// type RatingSort = "low-high" | "high-low" | null;

// const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>(null);
// const [ratingSort, setRatingSort] = useState<RatingSort>(null);

// ⬇️ ADD HERE (inside ProductScreen component)

const [showDistanceMenu, setShowDistanceMenu] = useState(false);
const [showRatingMenu, setShowRatingMenu] = useState(false);

type DistanceFilter = "0-10" | "10-20" | "20-40" | "40+" | null;
type RatingSort = "low-high" | "high-low" | null;

const [distanceFilter, setDistanceFilter] =
  useState<DistanceFilter>("0-10");
const [ratingSort, setRatingSort] =
  useState<RatingSort>("high-low");



//   const filteredProducts = useMemo(() => {
//     let data = PRODUCTS.filter((p) =>
//       p.title.toLowerCase().includes(search.toLowerCase())
//     );

//     if (ratingSort === "low-high") {
//       data = [...data].sort((a, b) => a.rating - b.rating);
//     }
//     if (ratingSort === "high-low") {
//       data = [...data].sort((a, b) => b.rating - a.rating);
//     }

//     data = [...data].sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//     );

//     return data;
//   }, [search, ratingSort]);

const filteredProducts = useMemo(() => {
  let data = PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // 📍 Distance filter
  if (distanceFilter === "0-10") {
    data = data.filter((p) => p.distance <= 10);
  }
  if (distanceFilter === "10-20") {
    data = data.filter((p) => p.distance > 10 && p.distance <= 20);
  }
  if (distanceFilter === "20-40") {
    data = data.filter((p) => p.distance > 20 && p.distance <= 40);
  }
  if (distanceFilter === "40+") {
    data = data.filter((p) => p.distance > 40);
  }

  // ⭐ Rating sort
  if (ratingSort === "low-high") {
    data = [...data].sort((a, b) => a.rating - b.rating);
  }
  if (ratingSort === "high-low") {
    data = [...data].sort((a, b) => b.rating - a.rating);
  }

  // 🆕 Recently added
  data = [...data].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return data;
}, [search, distanceFilter, ratingSort]);



  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Swachify Market</Text>
          <MaterialIcons name="shopping-bag" size={22} color="#FFF" />
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search eco products & services"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* RECENTLY ADDED */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added Nearby</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          <View style={styles.grid}>
            {filteredProducts.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.distance} KM AWAY</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>
            ))}
          </View>

          {/* ECO SERVICES */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Eco-Services Nearby</Text>
          </View>

          {SERVICES.map((s) => (
            <View key={s.id} style={styles.serviceCard}>
              <View>
                <Text style={styles.serviceTitle}>{s.title}</Text>
                <Text style={styles.serviceSub}>
                  {s.distance} km • {s.price}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </View>
          ))}

          <View style={{ height: 140 }} />
        </ScrollView>

        {/* SORT BAR */}
        {/* <View style={styles.sortBar}>
          <TouchableOpacity>
            <Text style={styles.sortText}>0–10 km</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRatingSort("high-low")}>
            <Text style={styles.sortText}>High to Low</Text>
          </TouchableOpacity>
        </View> */}
{/* SORT BAR */}
<View style={styles.sortBar}>
  {/* Distance dropdown */}
  <View style={styles.dropdownWrapper}>
    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => {
        setShowDistanceMenu(!showDistanceMenu);
        setShowRatingMenu(false);
      }}
    >
      <MaterialIcons name="location-on" size={16} color="#9CA3AF" />
      <Text style={styles.dropdownText}>
        {distanceFilter === "0-10" && "0–10km"}
        {distanceFilter === "10-20" && "10–20km"}
        {distanceFilter === "20-40" && "20–40km"}
        {distanceFilter === "40+" && ">40km"}
      </Text>
      <MaterialIcons name="keyboard-arrow-down" size={18} color="#9CA3AF" />
    </TouchableOpacity>

    {showDistanceMenu && (
      <View style={styles.menu}>
        {["0-10", "10-20", "20-40", "40+"].map((d) => (
          <TouchableOpacity
            key={d}
            style={styles.menuItem}
            onPress={() => {
              setDistanceFilter(d as DistanceFilter);
              setShowDistanceMenu(false);
            }}
          >
            <Text style={styles.menuText}>
              {d === "40+" ? ">40 km" : d.replace("-", "–") + " km"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>

  {/* Rating dropdown */}
  <View style={styles.dropdownWrapper}>
    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => {
        setShowRatingMenu(!showRatingMenu);
        setShowDistanceMenu(false);
      }}
    >
      <MaterialIcons name="star" size={16} color="#9CA3AF" />
      <Text style={styles.dropdownText}>
        {ratingSort === "high-low" ? "High to Low" : "Low to High"}
      </Text>
      <MaterialIcons name="keyboard-arrow-down" size={18} color="#9CA3AF" />
    </TouchableOpacity>

    {showRatingMenu && (
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setRatingSort("high-low");
            setShowRatingMenu(false);
          }}
        >
          <Text style={styles.menuText}>High to Low</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setRatingSort("low-high");
            setShowRatingMenu(false);
          }}
        >
          <Text style={styles.menuText}>Low to High</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
</View>


        {/* BOTTOM TABS */}
        <View style={styles.bottomTab}>
          <Tab icon="home" label="Home" />
          <Tab icon="storefront" label="Market" active />
          <Tab icon="analytics" label="Stats" />
          <Tab icon="person" label="Profile" />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* =======================
   COMPONENTS
======================= */

const Tab = ({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) => (
  <View style={styles.tabItem}>
    <MaterialIcons
      name={icon}
      size={22}
      color={active ? "#2563EB" : "#9CA3AF"}
    />
    <Text style={[styles.tabLabel, active && { color: "#2563EB" }]}>
      {label}
    </Text>
  </View>
);

export default ProductScreen;

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "800" },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  searchInput: { flex: 1, color: "#FFF", marginLeft: 8 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 12,
  },
  sectionTitle: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  viewAll: { color: "#3B82F6", fontWeight: "700" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    width: "47%",
    backgroundColor: "#1F2937",
    borderRadius: 18,
    padding: 10,
  },
  cardImage: { height: 140, borderRadius: 14 },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  cardTitle: { color: "#FFF", fontWeight: "700", marginTop: 8 },
  cardPrice: { color: "#3B82F6", fontWeight: "800", marginTop: 2 },
  rating: { color: "#FACC15", fontSize: 12, marginTop: 4 },

  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  serviceTitle: { color: "#FFF", fontWeight: "700" },
  serviceSub: { color: "#9CA3AF", marginTop: 4 },

//   sortBar: {
//     position: "absolute",
//     bottom: 56,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 12,
//     backgroundColor: "#0F172A",
//   },

sortBar: {
  position: "absolute",
  bottom: 56,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-evenly",
  paddingVertical: 12,
  backgroundColor: "#0F172A",
},

  sortText: { color: "#FFF", fontWeight: "700", marginHorizontal: 12, },

  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#020617",
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 10, color: "#9CA3AF" },
//   sortBar: {
//   position: "absolute",
//   bottom: 56,
//   left: 0,
//   right: 0,
//   flexDirection: "row",
//   justifyContent: "space-evenly",
//   paddingVertical: 12,
//   backgroundColor: "#0F172A",
// },

dropdownWrapper: {
  position: "relative",
},

dropdown: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#1F2937",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 18,
  gap: 6,
},

dropdownText: {
  color: "#FFF",
  fontWeight: "600",
  fontSize: 13,
},

menu: {
  position: "absolute",
  top: -140,
  width: 140,
  backgroundColor: "#1F2937",
  borderRadius: 14,
  paddingVertical: 6,
  zIndex: 50,
},

menuItem: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

menuText: {
  color: "#FFF",
  fontSize: 13,
},

});
