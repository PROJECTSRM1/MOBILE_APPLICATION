import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  SafeAreaView,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

/* ---------------- DATA ---------------- */


const PRODUCTS= [
  {
    id: 1,
    title: "Bamboo Toothbrush Set",
    brand: "EcoLife Co.",
    price: "$12.99",
    category: "sustainable",
    tag: "Company",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTjnndcFoBFEs9X3YCwzAmDLIdttJ2XEd9Q3Og4WG0_pbVHbyQlfRvWfFPDVzuGf36wDpmMgPI1XAqt2YarKVEVX2IDqLo1PiAo-RXdalyAEUkeqHDzxDtdeqkE2Si-UiTis-5-hFMcjfoXdnvIkQP8i78yP5jcRR0qf4AvECL_HF8K4BbacxiVoAPI43-amqKVfH0q-vvOB1l5UqdiYykvTOyHyayP5anKPUu7TNrcNweMnEXB0lpYE1cpjyjj96md7WdC8rHOoU",
    distance: 5,          
    rating: 4.6,            
    createdAt: "2025-01-12"  
  },
  {
    id: 2,
    title: "Glass Water Bottle",
    brand: "Jane's Handcrafted",
    price: "$24.50",
    category: "recycled",
    tag: "Entrepreneur",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyEE_IXez6Mzm0Vo6uF1E-43UkENnT4Ew4x1xhNChk36YydT5XZZrvpzoh1VIsWaehiT99TIfMJ_uAHDUnYtQDwxhXe0ucjHaS175CdUuOZQ1JyF23MFGLCa6dGVoxD73w68FcVDUDTqUI9omZRM81_zqNiPFPGFZzfFJ888m4rZT_rVtUierDgNv8KSAVhnUjedJozODVN394P_qtYpqxau0nDcU6j3GftP1fdyae6dP2WKLh9qyxXwXiaaSo3map2dOmre_nS2Q",
    distance: 12,
    rating: 4.1,
    createdAt: "2025-01-08"
  
  },
  {
    id: 3,
    title: "Organic Cotton Tote",
    brand: "Green Ventures",
    price: "$15.00",
    category: "sustainable",
    tag: "Company",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFrspr-ttnFY_zCp_Tw9Brsin5KfhyyTQN3U4bCjwTnriUaq3cmQam5q3K0ta-GVIazXuzGE6jx4obdQH6UkUWvwyt40tYbiP9ecKzG7fJmSPzZBpaaEzvjluiFBtdCDAmqWIUuEXeNZapM3XO0YNLca8KCZYIxhUWlJOpIRLJkFnZ9_B4ShTRPDBU6LJ1qqzOiz8u2bZtxEL8PS2X0SxiVr8ChZlqi31RyJ0BW37DAH7Ek_HaYnwduaY3FTRhtqHl8ZiWKWA6PpQ",
    distance: 22,
    rating: 3.9,
    createdAt: "2025-01-05"  
  },
  {
    id: 4,
    title: "Handmade Lavender Soap",
    brand: "Nature's Essence",
    price: "$8.99",
    category: "cleaners",
    tag: "Entrepreneur",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKTUN_up43-VnVCcymv3mLFr3rZZ96SfCFH8AesLT_ziSJUTGu6TCMH9yXsKxUeficpBINztBa2wJyysrCXvoPyX01D4oWULxQJrTmfLlEqO_pDDhGrRVUG4iIcPBadNqwWW-nRvmNqYoSPcwpXDd7PyKOnVGU6s-lygh6D_Qp6XV-hc5RqmkGk7YhnHlLemB0DyRbM4_QpzY0sDnfM3e5vKlWHt5PBal1QQ8L2LBhdvOCIeVsPjhnIV9E1A2gIEnXFvxE-W77Of4",
    distance: 45,
    rating: 4.8,
    createdAt: "2025-01-14"  
  },
];

const ENTREPRENEURS = [
  { name: "Sarah K.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Mark T.", image: "https://randomuser.me/api/portraits/men/46.jpg" },
  { name: "Elena R.", image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "James W.", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Sofia L.", image: "https://randomuser.me/api/portraits/women/65.jpg" },
];

/* ---------------- SCREEN ---------------- */

export default function SwachifyMarketScreen() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
//   const [distanceFilter, setDistanceFilter] = useState(null); 
// const [ratingSort, setRatingSort] = useState(null);
// type RatingSort = "low-high" | "high-low" | null;
// type DistanceFilter = "0-10" | "10-20" | "20-40" | "40+" | null;

// const [ratingSort, setRatingSort] = useState<RatingSort>(null);
// const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>(null);



  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        activeFilter === "all" || p.category === activeFilter;

      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, search]);

  // const filteredProducts = useMemo(() => {
//   let data = PRODUCTS.filter((p) => {
//     const matchesCategory =
//       activeFilter === "all" || p.category === activeFilter;

//     const matchesSearch =
//       p.title.toLowerCase().includes(search.toLowerCase()) ||
//       p.brand.toLowerCase().includes(search.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   // 📍 Distance filter
//   if (distanceFilter) {
//     data = data.filter((p) => {
//       if (distanceFilter === "0-10") return p.distance <= 10;
//       if (distanceFilter === "10-20") return p.distance > 10 && p.distance <= 20;
//       if (distanceFilter === "20-40") return p.distance > 20 && p.distance <= 40;
//       if (distanceFilter === "40+") return p.distance > 40;
//       return true;
//     });
//   }

//   //  Rating sort
//   if (ratingSort === "low-high") {
//     data = [...data].sort((a, b) => a.rating - b.rating);
//   }

//   if (ratingSort === "high-low") {
//     data = [...data].sort((a, b) => b.rating - a.rating);
//   }

//   //  Recently added first
//   data = [...data].sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   );

//   return data;
// }, [activeFilter, search, distanceFilter, ratingSort]);


  const addToCart = () => {
    setCartCount((prev) => prev + 1);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      {/* HEADER */}
      <SafeAreaView>
        <View style={styles.header}>
          <MaterialIcons name="menu" size={24} color="#fff" />
          <Text style={styles.headerTitle}>
            Swachify <Text style={{ color: "#135bec" }}>Market</Text>
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Swachifycart" as never)} style={{ position: "relative" }}>
            <MaterialIcons name="shopping-bag" size={24} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SEARCH */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#9da6b9" />
            <TextInput
              placeholder="Search eco products..."
              placeholderTextColor="#9da6b9"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* FILTERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          <Filter label="All Products" value="all" active={activeFilter} setActive={setActiveFilter} />
          <Filter label="Sustainable" value="sustainable" icon="eco" active={activeFilter} setActive={setActiveFilter} />
          <Filter label="Recycled" value="recycled" icon="recycling" active={activeFilter} setActive={setActiveFilter} />
          <Filter label="Cleaners" value="cleaners" icon="sanitizer" active={activeFilter} setActive={setActiveFilter} />
        </ScrollView>

        {/* PRODUCTS */}
        <View style={styles.grid}>
          {filteredProducts.map((item) => (
            <View key={item.id} style={styles.card}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.cardImage}
                imageStyle={{ borderRadius: 18 }}
              >
                <Text style={styles.tag}>{item.tag}</Text>

                <TouchableOpacity style={styles.addBtn} onPress={addToCart}>
                  <MaterialIcons name="add-shopping-cart" size={18} color="#fff" />
                </TouchableOpacity>
              </ImageBackground>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBrand}>{item.brand}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* ENTREPRENEURS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRow}>
          {ENTREPRENEURS.map((e) => (
            <View key={e.name} style={styles.avatarItem}>
              <Image source={{ uri: e.image }} style={styles.avatar} />
              <Text style={styles.avatarText}>{e.name}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <FooterTab icon="home" label="Home" />
        <FooterTab icon="storefront" label="Market" active />
        <FooterTab icon="analytics" label="Stats" />
        <FooterTab icon="person" label="Profile" />
      </View>

      {/* TOAST */}
      <Modal transparent visible={showToast} animationType="fade">
        <View style={styles.toastWrapper}>
          <View style={styles.toast}>
            <MaterialIcons name="check-circle" size={20} color="#22c55e" />
            <Text style={styles.toastText}>Item added to cart</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Filter = ({ label, value, icon, active, setActive }: any) => (
  <TouchableOpacity
    onPress={() => setActive(value)}
    style={[styles.chip, active === value && styles.chipActive]}
  >
    {icon && <MaterialIcons name={icon} size={16} color="#9da6b9" />}
    <Text style={[styles.chipText, active === value && { color: "#fff" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FooterTab = ({ icon, label, active }: any) => (
  <TouchableOpacity style={styles.footerTab}>
    <MaterialIcons
      name={icon}
      size={22}
      color={active ? "#135bec" : "#9da6b9"}
    />
    <Text style={[styles.footerText, active && { color: "#135bec" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101622" },

  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },

  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#135bec",
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cartText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  searchRow: { padding: 16 },
  searchBox: {
    height: 48,
    backgroundColor: "#1c212e",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, color: "#fff", marginLeft: 6 },

  chips: { paddingHorizontal: 16 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1c212e",
    marginRight: 10,
  },
  chipActive: { backgroundColor: "#135bec" },
  chipText: { color: "#9da6b9", fontSize: 13, fontWeight: "600" },

  grid: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: { width: "47%" },
  cardImage: {
    height: 190,
    borderRadius: 18,
    justifyContent: "space-between",
    padding: 10,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.9)",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: "#135bec",
  },
  addBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#135bec",
    padding: 8,
    borderRadius: 10,
  },
  cardTitle: { color: "#fff", fontSize: 13, fontWeight: "700", marginTop: 6 },
  cardBrand: { color: "#9da6b9", fontSize: 11 },
  cardPrice: { color: "#135bec", fontSize: 14, fontWeight: "800" },

  avatarRow: { paddingHorizontal: 16, marginTop: 12 },
  avatarItem: { alignItems: "center", marginRight: 16 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#135bec",
  },
  avatarText: { color: "#fff", fontSize: 10, marginTop: 6 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#0f1522",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1c212e",
  },
  footerTab: { flex: 1, alignItems: "center", justifyContent: "center" },
  footerText: { fontSize: 10, color: "#9da6b9", marginTop: 2 },

  toastWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#1c212e",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  toastText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
