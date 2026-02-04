import React, { useMemo, useState, useEffect } from "react";
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
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RegisterProductModal from "./RegisterProductModal";
import { useTheme } from "../context/ThemeContext";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: "Bamboo Toothbrush Set",
    brand: "EcoLife Co.",
    price: "500",
    category: "sustainable",
    tag: "Company",
    shopAddress: "123 Green Street, Eco Park, Hyderabad",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTjnndcFoBFEs9X3YCwzAmDLIdttJ2XEd9Q3Og4WG0_pbVHbyQlfRvWfFPDVzuGf36wDpmMgPI1XAqt2YarKVEVX2IDqLo1PiAo-RXdalyAEUkeqHDzxDtdeqkE2Si-UiTis-5-hFMcjfoXdnvIkQP8i78yP5jcRR0qf4AvECL_HF8K4BbacxiVoAPI43-amqKVfH0q-vvOB1l5UqdiYykvTOyHyayP5anKPUu7TNrcNweMnEXB0lpYE1cpjyjj96md7WdC8rHOoU",
    distance: 5,
    rating: 4.6,
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    title: "Glass Water Bottle",
    brand: "Jane's Handcrafted",
    price: "1000",
    category: "recycled",
    tag: "Entrepreneur",
    shopAddress: "45 Craft Lane, Banjara Hills, Hyderabad",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyEE_IXez6Mzm0Vo6uF1E-43UkENnT4Ew4x1xhNChk36YydT5XZZrvpzoh1VIsWaehiT99TIfMJ_uAHDUnYtQDwxhXe0ucjHaS175CdUuOZQ1JyF23MFGLCa6dGVoxD73w68FcVDUDTqUI9omZRM81_zqNiPFPGFZzfFJ888m4rZT_rVtUierDgNv8KSAVhnUjedJozODVN394P_qtYpqxau0nDcU6j3GftP1fdyae6dP2WKLh9qyxXwXiaaSo3map2dOmre_nS2Q",
    distance: 12,
    rating: 4.1,
    createdAt: "2025-01-08",
  },
  {
    id: 3,
    title: "Organic Cotton Tote",
    brand: "Green Ventures",
    price: "1500",
    category: "sustainable",
    tag: "Company",
    shopAddress: "789 Organic Avenue, Gachibowli, Hyderabad",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFrspr-ttnFY_zCp_Tw9Brsin5KfhyyTQN3U4bCjwTnriUaq3cmQam5q3K0ta-GVIazXuzGE6jx4obdQH6UkUWvwyt40tYbiP9ecKzG7fJmSPzZBpaaEzvjluiFBtdCDAmqWIUuEXeNZapM3XO0YNLca8KCZYIxhUWlJOpIRLJkFnZ9_B4ShTRPDBU6LJ1qqzOiz8u2bZtxEL8PS2X0SxiVr8ChZlqi31RyJ0BW37DAH7Ek_HaYnwduaY3FTRhtqHl8ZiWKWA6PpQ",
    distance: 22,
    rating: 3.9,
    createdAt: "2025-01-05",
  },
  {
    id: 4,
    title: "Handmade Lavender Soap",
    brand: "Nature's Essence",
    price: "10000",
    category: "cleaners",
    tag: "Entrepreneur",
    shopAddress: "321 Nature Road, Jubilee Hills, Hyderabad",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKTUN_up43-VnVCcymv3mLFr3rZZ96SfCFH8AesLT_ziSJUTGu6TCMH9yXsKxUeficpBINztBa2wJyysrCXvoPyX01D4oWULxQJrTmfLlEqO_pDDhGrRVUG4iIcPBadNqwWW-nRvmNqYoSPcwpXDd7PyKOnVGU6s-lygh6D_Qp6XV-hc5RqmkGk7YhnHlLemB0DyRbM4_QpzY0sDnfM3e5vKlWHt5PBal1QQ8L2LBhdvOCIeVsPjhnIV9E1A2gIEnXFvxE-W77Of4",
    distance: 45,
    rating: 4.8,
    createdAt: "2025-01-14",
  },
];

const ENTREPRENEURS = [
  { name: "Sarah K.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Mark T.", image: "https://randomuser.me/api/portraits/men/46.jpg" },
  { name: "Elena R.", image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "James W.", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Sofia L.", image: "https://randomuser.me/api/portraits/women/65.jpg" },
];

const STORAGE_KEY = "swachify_products";

export default function SwachifyMarketScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Item added to cart");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Sort states
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [ratingSort, setRatingSort] = useState("none");

  useEffect(() => {
    loadProducts();
    loadCartCount(); // Initial load of cart count

    // Refresh cart count whenever the screen is focused (returned to)
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartCount();
    });
    return unsubscribe;
  }, [navigation]);

  const loadCartCount = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("swachify_cart");
      if (storedCart) {
        const cart = JSON.parse(storedCart);
        const total = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (e) {
      console.error("Error loading cart count:", e);
    }
  };

  const loadProducts = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts(INITIAL_PRODUCTS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts(INITIAL_PRODUCTS);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesCategory = activeFilter === "all" || p.category === activeFilter;
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (distanceFilter !== "all") {
      filtered = filtered.filter((p) => {
        const dist = p.distance || 0;
        switch (distanceFilter) {
          case "0-10": return dist >= 0 && dist <= 10;
          case "10-20": return dist > 10 && dist <= 20;
          case "20-40": return dist > 20 && dist <= 40;
          case "40+": return dist > 40;
          default: return true;
        }
      });
    }

    if (ratingSort === "low-to-high") {
      filtered = [...filtered].sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (ratingSort === "high-to-low") {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (ratingSort === "none") {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }

    return filtered;
  }, [activeFilter, search, products, distanceFilter, ratingSort]);

  const addToCart = async (product: any) => {
    try {
      const storedCart = await AsyncStorage.getItem("swachify_cart");
      let cart = storedCart ? JSON.parse(storedCart) : [];

      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem("swachify_cart", JSON.stringify(cart));
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));

      setToastMessage("Added to cart");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  const handleProductRegistered = async (newProduct: any) => {
    try {
      const productToAdd = {
        ...newProduct,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
        rating: 0,
        distance: Math.floor(Math.random() * 50) + 1,
      };

      const updatedProducts = [productToAdd, ...products];
      setProducts(updatedProducts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

      setShowRegisterModal(false);
      setToastMessage("Product registered successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to save product");
    }
  };

  const resetSortFilters = () => {
    setDistanceFilter("all");
    setRatingSort("none");
    setShowSortModal(false);
  };

  const applySortFilters = () => {
    setShowSortModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      <SafeAreaView>
        <View style={styles.header}>
          <MaterialIcons name="menu" size={24} color={colors.text} />
          <Text style={styles.headerTitle}>
            Swachify <Text style={{ color: "#135bec" }}>Market</Text>
          </Text>

          {/* REDIRECT TO Swachifycart ADDED HERE */}
          <TouchableOpacity onPress={() => navigation.navigate("Swachifycart")}>
            <MaterialIcons name="shopping-bag" size={24} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#9da6b9" />
            <TextInput
              placeholder="Search products, services, brands..."
              placeholderTextColor="#9da6b9"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <MaterialIcons name="close" size={18} color="#9da6b9" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Register Button */}
        <View style={styles.registerButtonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => setShowRegisterModal(true)}
          >
            <MaterialIcons name="add-business" size={20} color="#fff" />
            <Text style={styles.registerButtonText}>Register Product</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          <Filter label="All Products" value="all" active={activeFilter} setActive={setActiveFilter} colors={colors} styles={styles} />
          <Filter label="Sustainable" value="sustainable" icon="eco" active={activeFilter} setActive={setActiveFilter} colors={colors} styles={styles} />
          <Filter label="Recycled" value="recycled" icon="recycling" active={activeFilter} setActive={setActiveFilter} colors={colors} styles={styles} />
          <Filter label="Cleaners" value="cleaners" icon="sanitizer" active={activeFilter} setActive={setActiveFilter} colors={colors} styles={styles} />
        </ScrollView>

        {/* Sort Button */}
        <View style={styles.sortButtonContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <MaterialIcons name="tune" size={20} color="#135bec" />
            <Text style={styles.sortButtonText}>
              Sort & Filter
              {(distanceFilter !== "all" || ratingSort !== "none") && (
                <Text style={styles.activeFilterIndicator}> •</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </Text>
          {(distanceFilter !== "all" || ratingSort !== "none") && (
            <TouchableOpacity onPress={resetSortFilters}>
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Product Grid */}
        <View style={styles.grid}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={64} color="#374151" />
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          ) : (
            filteredProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("ProductDetail", { product: item })
                }
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: 18 }}
                >
                  <Text style={styles.tag}>{item.tag}</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                    <MaterialIcons name="add-shopping-cart" size={18} color="#fff" />
                  </TouchableOpacity>
                </ImageBackground>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBrand}>{item.brand}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={14} color="#fbbf24" />
                    <Text style={styles.ratingText}>{item.rating || 5}</Text>
                  </View>
                  <View style={styles.distanceContainer}>
                    <MaterialIcons name="location-on" size={14} color="#9da6b9" />
                    <Text style={styles.distanceText}>{item.distance} km</Text>
                  </View>
                </View>
                <Text style={styles.cardPrice}>
                  {item.price && !isNaN(parseFloat(item.price))
                    ? "₹" + parseFloat(item.price).toLocaleString('en-IN')
                    : item.price || '0'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Entrepreneurs Section */}
        {filteredProducts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Featured Entrepreneurs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRow}>
              {ENTREPRENEURS.map((e) => (
                <View key={e.name} style={styles.avatarItem}>
                  <Image source={{ uri: e.image }} style={styles.avatar} />
                  <Text style={styles.avatarText}>{e.name}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <FooterTab icon="home" label="Home" active colors={colors} styles={styles} />
        <FooterTab icon="storefront" label="Market" active={false} colors={colors} styles={styles} />
        <FooterTab icon="analytics" label="Stats" active={false} colors={colors} styles={styles} />
        <FooterTab icon="person" label="Profile" active={false} colors={colors} styles={styles} />
      </View>

      {/* Toast */}
      <Modal transparent visible={showToast} animationType="fade">
        <View style={styles.toastWrapper}>
          <View style={styles.toast}>
            <MaterialIcons name="check-circle" size={20} color="#22c55e" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortModalContainer}>
            <View style={styles.sortModalHeader}>
              <Text style={styles.sortModalTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.sortSection}>
                <Text style={styles.sortSectionTitle}>Distance from You</Text>
                {["all", "0-10", "10-20", "20-40", "40+"].map((dist) => (
                  <TouchableOpacity
                    key={dist}
                    style={[styles.sortOption, distanceFilter === dist && styles.sortOptionActive]}
                    onPress={() => setDistanceFilter(dist)}
                  >
                    <MaterialIcons
                      name={distanceFilter === dist ? "radio-button-checked" : "radio-button-unchecked"}
                      size={20}
                      color={distanceFilter === dist ? "#135bec" : "#9da6b9"}
                    />
                    <Text style={[styles.sortOptionText, distanceFilter === dist && styles.sortOptionTextActive]}>
                      {dist === "all" ? "All Distances" : dist === "40+" ? "Above 40 km" : `${dist} km`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.sortSection}>
                <Text style={styles.sortSectionTitle}>Sort by Rating</Text>
                {[
                  { label: "Most Recent First", val: "none" },
                  { label: "Rating: High to Low", val: "high-to-low" },
                  { label: "Rating: Low to High", val: "low-to-high" }
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.val}
                    style={[styles.sortOption, ratingSort === opt.val && styles.sortOptionActive]}
                    onPress={() => setRatingSort(opt.val)}
                  >
                    <MaterialIcons
                      name={ratingSort === opt.val ? "radio-button-checked" : "radio-button-unchecked"}
                      size={20}
                      color={ratingSort === opt.val ? "#135bec" : "#9da6b9"}
                    />
                    <Text style={[styles.sortOptionText, ratingSort === opt.val && styles.sortOptionTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.sortModalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={resetSortFilters}>
                <Text style={styles.resetButtonText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applySortFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <RegisterProductModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSubmit={handleProductRegistered}
      />
    </View>
  );
}

const Filter = ({ label, value, icon, active, setActive, colors, styles }: any) => (
  <TouchableOpacity
    onPress={() => setActive(value)}
    style={[styles.chip, active === value && styles.chipActive]}
  >
    {icon && (
      <MaterialIcons
        name={icon}
        size={16}
        color={active === value ? "#ffffff" : colors.subText}
      />
    )}
    <Text style={[styles.chipText, active === value && styles.activeChipText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FooterTab = ({ icon, label, active, colors, styles }: any) => (
  <TouchableOpacity style={styles.footerTab}>
    <MaterialIcons
      name={icon}
      size={22}
      color={active ? colors.primary : colors.subText}
    />
    <Text style={[styles.footerText, active && { color: colors.primary }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { height: 56, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
    cartBadge: { position: "absolute", top: -6, right: -6, backgroundColor: colors.primary, borderRadius: 10, width: 16, height: 16, alignItems: "center", justifyContent: "center" },
    cartText: { color: "#ffffff", fontSize: 10, fontWeight: "700" },
    searchRow: { padding: 16, paddingBottom: 8 },
    searchBox: { height: 48, backgroundColor: colors.card, borderRadius: 16, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: colors.border },
    searchInput: { flex: 1, color: colors.text, fontSize: 15 },
    registerButtonContainer: { paddingHorizontal: 16, paddingBottom: 12 },
    registerButton: { backgroundColor: colors.primary, height: 48, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    registerButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
    chips: { paddingHorizontal: 16, marginBottom: 8 },
    chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, height: 40, borderRadius: 20, backgroundColor: colors.card, marginRight: 10, borderWidth: 1, borderColor: colors.border },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { color: colors.subText, fontSize: 13, fontWeight: "600" },
    activeChipText: { color: "#ffffff" },
    sortButtonContainer: { paddingHorizontal: 16, paddingBottom: 8 },
    sortButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.primary },
    sortButtonText: { color: colors.primary, fontSize: 14, fontWeight: "600" },
    activeFilterIndicator: { color: colors.success ?? "#22c55e", fontSize: 20 },
    resultsContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8 },
    resultsText: { color: colors.subText, fontSize: 13 },
    clearFiltersText: { color: colors.primary, fontSize: 13, fontWeight: "600" },
    grid: { padding: 16, flexDirection: "row", flexWrap: "wrap", gap: 14 },
    emptyContainer: { width: "100%", alignItems: "center", justifyContent: "center", paddingVertical: 60 },
    emptyText: { color: colors.text, fontSize: 18, fontWeight: "600", marginTop: 16 },
    emptySubtext: { color: colors.subText, fontSize: 14, marginTop: 6 },
    card: { width: "47%" },
    cardImage: { height: 190, borderRadius: 18, justifyContent: "space-between", padding: 10, backgroundColor: colors.card },
    tag: { backgroundColor: "rgba(255,255,255,0.9)", fontSize: 10, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, color: colors.primary, alignSelf: "flex-start" },
    addBtn: { alignSelf: "flex-end", backgroundColor: colors.primary, padding: 8, borderRadius: 10 },
    cardTitle: { color: colors.text, fontSize: 13, fontWeight: "700", marginTop: 6 },
    cardBrand: { color: colors.subText, fontSize: 11, marginTop: 2 },
    cardMeta: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
    ratingContainer: { flexDirection: "row", alignItems: "center", gap: 2 },
    ratingText: { color: "#fbbf24", fontSize: 12, fontWeight: "600" },
    distanceContainer: { flexDirection: "row", alignItems: "center", gap: 2 },
    distanceText: { color: colors.subText, fontSize: 11 },
    cardPrice: { color: colors.primary, fontSize: 15, fontWeight: "800", marginTop: 4 },
    sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "700", paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
    avatarRow: { paddingHorizontal: 16, marginBottom: 12 },
    avatarItem: { alignItems: "center", marginRight: 16 },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: colors.primary },
    avatarText: { color: colors.text, fontSize: 10, marginTop: 6 },
    footer: { position: "absolute", bottom: 0, left: 0, right: 0, height: 64, backgroundColor: colors.surface, flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border },
    footerTab: { flex: 1, alignItems: "center", justifyContent: "center" },
    footerText: { fontSize: 10, color: colors.subText, marginTop: 2 },
    toastWrapper: { position: "absolute", top: 60, left: 0, right: 0, alignItems: "center", zIndex: 999, paddingHorizontal: 16 },
    toast: { flexDirection: "row", gap: 8, backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: colors.border, elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6 },
    toastText: { color: colors.text, fontSize: 13, fontWeight: "600" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
    sortModalContainer: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "80%", borderTopWidth: 1, borderTopColor: colors.border },
    sortModalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
    sortModalTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
    sortSection: { paddingHorizontal: 20, paddingTop: 20 },
    sortSectionTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 12 },
    sortOption: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: colors.card, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
    sortOptionActive: { backgroundColor: colors.primary + "15", borderColor: colors.primary },
    sortOptionText: { color: colors.subText, fontSize: 15, fontWeight: "500" },
    sortOptionTextActive: { color: colors.text, fontWeight: "600" },
    sortModalFooter: { flexDirection: "row", gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
    resetButton: { flex: 1, paddingVertical: 14, backgroundColor: colors.card, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: colors.border },
    resetButtonText: { color: colors.text, fontSize: 15, fontWeight: "600" },
    applyButton: { flex: 1, paddingVertical: 14, backgroundColor: colors.primary, borderRadius: 12, alignItems: "center" },
    applyButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  });