import React, { useState } from "react";
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
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

/* ================= PRICE HELPER ================= */
// Works with values coming from storage:
// "500", "₹500", "1,200", "500/kg", undefined
const formatPrice = (value: any) => {
  if (!value) return "₹0";

  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const num = Number(cleaned);

  if (isNaN(num)) return `₹${value}`; // fallback (never NaN)
  return `₹${num.toLocaleString("en-IN")}`;
};

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product } = route.params;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: "", // STRING (kg / pcs / packs)
    vehicleType: "",
  });

  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const vehicleTypes = [
    { label: "Bike", value: "bike", icon: "two-wheeler" },
    { label: "Light Motor Cargo", value: "light_cargo", icon: "local-shipping" },
    { label: "DCM Van", value: "dcm_van", icon: "airport-shuttle" },
    { label: "Freight / Lorry", value: "freight", icon: "local-shipping" },
  ];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter valid 10-digit phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    if (!formData.vehicleType) newErrors.vehicleType = "Select vehicle type";

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

  const getVehicleLabel = () => {
    const selected = vehicleTypes.find(v => v.value === formData.vehicleType);
    return selected ? selected.label : "Select Vehicle Type";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      {/* HEADER */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE – NO CUTTING */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
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

          {/* ✅ SAFE PRICE */}
          <View style={styles.priceBox}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>
        </View>

        {/* ORDER FORM */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Order Details</Text>

          <Input
            label="Full Name *"
            value={formData.name}
            error={errors.name}
            onChange={(v: string) => setFormData({ ...formData, name: v })}
          />

          <Input
            label="Phone Number *"
            keyboard="phone-pad"
            maxLength={10}
            value={formData.phone}
            error={errors.phone}
            onChange={(v: string) => setFormData({ ...formData, phone: v })}
          />

          <Input
            label="Delivery Address *"
            multiline
            value={formData.address}
            error={errors.address}
            onChange={(v: string) => setFormData({ ...formData, address: v })}
          />

          <Input
            label="Quantity *"
            placeholder="Eg: 2 kg / 5 pcs / 1 pack"
            value={formData.quantity}
            error={errors.quantity}
            onChange={(v: string) => setFormData({ ...formData, quantity: v })}
          />

          {/* VEHICLE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type *</Text>
            <TouchableOpacity
              style={[styles.dropdown, errors.vehicleType && styles.errorBorder]}
              onPress={() => setShowVehicleDropdown(true)}
            >
              <Text style={styles.dropdownText}>{getVehicleLabel()}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#9da6b9" />
            </TouchableOpacity>
            {errors.vehicleType && <Text style={styles.error}>{errors.vehicleType}</Text>}
          </View>

          <TouchableOpacity style={styles.buyButton} onPress={handleBuyProduct}>
            <MaterialIcons name="shopping-cart" size={20} color="#fff" />
            <Text style={styles.buyText}>Buy Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* VEHICLE MODAL */}
      <Modal transparent visible={showVehicleDropdown}>
        <TouchableOpacity style={styles.overlay} onPress={() => setShowVehicleDropdown(false)}>
          <View style={styles.modal}>
            {vehicleTypes.map(v => (
              <TouchableOpacity
                key={v.value}
                style={styles.modalItem}
                onPress={() => {
                  setFormData({ ...formData, vehicleType: v.value });
                  setErrors({ ...errors, vehicleType: "" });
                  setShowVehicleDropdown(false);
                }}
              >
                <MaterialIcons name={v.icon} size={22} color="#135bec" />
                <Text style={styles.modalText}>{v.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* SUCCESS */}
      <Modal transparent visible={showSuccessModal}>
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <MaterialIcons name="check-circle" size={64} color="#22c55e" />
            <Text style={styles.successTitle}>Order Successful</Text>
            <Text style={styles.successText}>Your order has been placed successfully</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= INPUT COMPONENT ================= */
const Input = ({ label, value, onChange, error, placeholder, multiline, keyboard, maxLength }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.errorBorder]}
      placeholder={placeholder}
      placeholderTextColor="#6b7280"
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      keyboardType={keyboard}
      maxLength={maxLength}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101622" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  imageWrapper: {
    height: 260,
    backgroundColor: "#0f1522",
    justifyContent: "center",
  },
  productImage: { width: "100%", height: "100%" },

  productInfo: {
    backgroundColor: "#1c212e",
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  productTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  productBrand: { color: "#9da6b9", marginTop: 4 },
  metaRow: { flexDirection: "row", gap: 16, marginTop: 12 },
  metaItem: { flexDirection: "row", gap: 4, alignItems: "center" },
  metaText: { color: "#9da6b9" },

  priceBox: { marginTop: 16 },
  price: { color: "#135bec", fontSize: 24, fontWeight: "800" },

  formContainer: { padding: 20 },
  formTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 16 },

  inputGroup: { marginBottom: 14 },
  label: { color: "#fff", fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#1c212e",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdown: {
    backgroundColor: "#1c212e",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdownText: { color: "#fff" },

  error: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  errorBorder: { borderColor: "#ef4444" },

  buyButton: {
    backgroundColor: "#135bec",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buyText: { color: "#fff", fontWeight: "700" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#1c212e",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalItem: { flexDirection: "row", gap: 12, paddingVertical: 14 },
  modalText: { color: "#fff", fontSize: 15 },

  successOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  successBox: {
    backgroundColor: "#1c212e",
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
  },
  successTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },
  successText: { color: "#9da6b9", marginTop: 8 },
});

