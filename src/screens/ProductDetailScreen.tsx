import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  Dimensions,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/* ================= PRICE HELPER ================= */
const formatPrice = (value: any) => {
  if (!value) return "₹0";
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  if (isNaN(num)) return `₹${value}`;
  return `₹${num.toLocaleString("en-IN")}`;
};

export default function ProductDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { product } = route.params;

  // Slider State
  const [activeIndex, setActiveIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: "",
    vehicleType: "",
  });
  
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const WISHLIST_KEY = "wishlist_items";

  const vehicleTypes = [
    { label: "Bike", value: "bike", icon: "two-wheeler" },
    { label: "Light Motor Cargo", value: "light_cargo", icon: "local-shipping" },
    { label: "DCM Van", value: "dcm_van", icon: "airport-shuttle" },
    { label: "Freight / Lorry", value: "freight", icon: "local-shipping" },
  ];

  React.useEffect(() => {
    const checkWishlist = async () => {
      const stored = await AsyncStorage.getItem(WISHLIST_KEY);
      const wishlist = stored ? JSON.parse(stored) : [];
      const exists = wishlist.some((item: any) => item.id === product.id);
      setIsWishlisted(exists);
    };
    checkWishlist();
  }, []);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter 10-digit phone";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    if (!formData.vehicleType) newErrors.vehicleType = "Select vehicle";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBuyProduct = () => {
    if (!validateForm()) return;
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.goBack();
    }, 2500);
  };

  const handleWishlistToggle = async () => {
    const stored = await AsyncStorage.getItem(WISHLIST_KEY);
    let wishlist = stored ? JSON.parse(stored) : [];
    if (isWishlisted) {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
    } else {
      wishlist.push(product);
    }
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
    setShowWishlistModal(true);
    setTimeout(() => setShowWishlistModal(false), 2000);
  };

  // Determine which images to show (prefer the 'images' array from Modal)
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE SLIDER */}
        <View style={styles.sliderWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {displayImages.map((imgUri: string, index: number) => (
              <Image
                key={index}
                source={{ uri: imgUri }}
                style={styles.sliderImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* DOT INDICATORS */}
          {displayImages.length > 1 && (
            <View style={styles.pagination}>
              {displayImages.map((_: any, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    activeIndex === i ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="star" size={16} color="#fbbf24" />
              <Text style={styles.metaText}>{product.rating || 5}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="location-on" size={16} color="#9da6b9" />
              <Text style={styles.metaText}>{product.distance} km away</Text>
            </View>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>
          
          {product.description && (
            <View style={styles.descBox}>
               <Text style={styles.descTitle}>Description</Text>
               <Text style={styles.descText}>{product.description}</Text>
            </View>
          )}
        </View>

        {/* ORDER FORM */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Order Details</Text>
          <Input styles={styles} label="Full Name *" value={formData.name} error={errors.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
          <Input styles={styles} label="Phone Number *" keyboard="phone-pad" maxLength={10} value={formData.phone} error={errors.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
          <Input styles={styles} label="Delivery Address *" multiline value={formData.address} error={errors.address} onChange={(v: string) => setFormData({ ...formData, address: v })} />
          <Input styles={styles} label="Quantity *" placeholder="Eg: 2 kg / 5 pcs" value={formData.quantity} error={errors.quantity} onChange={(v: string) => setFormData({ ...formData, quantity: v })} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type *</Text>
            <TouchableOpacity style={[styles.dropdown, errors.vehicleType && styles.errorBorder]} onPress={() => setShowVehicleDropdown(true)}>
              <Text style={styles.dropdownText}>{vehicleTypes.find(v => v.value === formData.vehicleType)?.label || "Select Vehicle Type"}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#9da6b9" />
            </TouchableOpacity>
            {errors.vehicleType && <Text style={styles.error}>{errors.vehicleType}</Text>}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlistToggle}>
              <MaterialIcons name={isWishlisted ? "favorite" : "favorite-border"} size={20} color={isWishlisted ? "#ef4444" : "#135bec"} />
              <Text style={[styles.wishlistText, isWishlisted && styles.wishlistTextActive]}>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyProduct}>
              <MaterialIcons name="shopping-cart" size={20} color="#fff" />
              <Text style={styles.buyText}>Buy Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* MODALS (Vehicle, Success, Wishlist) stay exactly same as your previous code */}
      <Modal transparent visible={showVehicleDropdown}>
        <TouchableOpacity style={styles.overlay} onPress={() => setShowVehicleDropdown(false)}>
          <View style={styles.modal}>
            {vehicleTypes.map(v => (
              <TouchableOpacity key={v.value} style={styles.modalItem} onPress={() => { setFormData({ ...formData, vehicleType: v.value }); setShowVehicleDropdown(false); }}>
                <MaterialIcons name={v.icon} size={22} color="#135bec" />
                <Text style={styles.modalText}>{v.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={showWishlistModal} animationType="fade">
        <View style={styles.toastContainer}><View style={styles.toast}><Text style={styles.toastText}>{isWishlisted ? "Added to Wishlist" : "Removed from Wishlist"}</Text></View></View>
      </Modal>

      <Modal transparent visible={showSuccessModal}>
        <View style={styles.successOverlay}><View style={styles.successBox}><MaterialIcons name="check-circle" size={64} color="#22c55e" /><Text style={styles.successTitle}>Order Successful</Text></View></View>
      </Modal>
    </View>
  );
}

const Input = ({ label, value, onChange, error, placeholder, multiline, keyboard, maxLength, styles }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, error && styles.errorBorder]} placeholder={placeholder} placeholderTextColor="#6b7280" value={value} onChangeText={onChange} multiline={multiline} keyboardType={keyboard} maxLength={maxLength} />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
    headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
    
    // SLIDER STYLES
    sliderWrapper: { height: 300, backgroundColor: colors.surface, position: 'relative' },
    sliderImage: { width: SCREEN_WIDTH, height: 300 },
    pagination: { position: 'absolute', bottom: 15, flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 8 },
    dot: { height: 8, borderRadius: 4 },
    activeDot: { width: 24, backgroundColor: colors.primary },
    inactiveDot: { width: 8, backgroundColor: 'rgba(255,255,255,0.5)' },

    productInfo: { backgroundColor: colors.card, margin: 16, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border },
    productTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
    productBrand: { color: colors.subText, marginTop: 4 },
    metaRow: { flexDirection: "row", gap: 16, marginTop: 12 },
    metaItem: { flexDirection: "row", gap: 4, alignItems: "center" },
    metaText: { color: colors.subText },
    priceBox: { marginTop: 16 },
    price: { color: colors.primary, fontSize: 24, fontWeight: "800" },
    descBox: { marginTop: 15, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 15 },
    descTitle: { color: colors.text, fontWeight: '700', marginBottom: 5 },
    descText: { color: colors.subText, lineHeight: 20 },
    formContainer: { padding: 20 },
    formTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 16 },
    inputGroup: { marginBottom: 14 },
    label: { color: colors.text, fontWeight: "600", marginBottom: 6 },
    input: { backgroundColor: colors.card, borderRadius: 12, padding: 14, color: colors.text, borderWidth: 1, borderColor: colors.border },
    dropdown: { backgroundColor: colors.card, borderRadius: 12, padding: 14, flexDirection: "row", justifyContent: "space-between", borderWidth: 1, borderColor: colors.border },
    dropdownText: { color: colors.text },
    error: { color: colors.danger, fontSize: 12, marginTop: 4 },
    errorBorder: { borderColor: colors.danger },
    buttonRow: { flexDirection: "row", gap: 12, marginTop: 6 },
    wishlistButton: { flex: 1, padding: 16, borderRadius: 12, flexDirection: "row", justifyContent: "center", gap: 8, borderWidth: 2, borderColor: colors.primary },
    wishlistText: { color: colors.primary, fontWeight: "700" },
    wishlistTextActive: { color: colors.danger },
    buyButton: { flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 12, flexDirection: "row", justifyContent: "center", gap: 8 },
    buyText: { color: "#ffffff", fontWeight: "700" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
    modal: { backgroundColor: colors.card, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    modalItem: { flexDirection: "row", gap: 12, paddingVertical: 14 },
    modalText: { color: colors.text, fontSize: 15 },
    successOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
    successBox: { backgroundColor: colors.card, padding: 32, borderRadius: 24, alignItems: "center" },
    successTitle: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 12 },
    toastContainer: { flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 100 },
    toast: { backgroundColor: colors.card, padding: 15, borderRadius: 8, elevation: 8 },
    toastText: { color: colors.text, fontWeight: "600" },
  });