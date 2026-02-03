import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

/* ---------------- CONSTANTS ---------------- */
const PROPERTY_TYPES = [
  { label: "1 BHK", value: "1bhk", floors: 1 },
  { label: "2 BHK", value: "2bhk", floors: 1 },
  { label: "3 BHK", value: "3bhk", floors: 2 },
  { label: "4 BHK", value: "4bhk", floors: 2 },
  { label: "Villa", value: "villa", floors: 3 },
  { label: "Duplex", value: "duplex", floors: 2 },
  { label: "Studio Apartment", value: "studio", floors: 1 },
];

const INTERNAL_SERVICES = {
  Plumbing: [
    { id: "p1", title: "Pipe Leakage", price: 299, image: require("../../assets/pl.jpg"), needsFloorInfo: true },
    { id: "p2", title: "Tap Fixing", price: 149, image: require("../../assets/tf.jpg"), needsFloorInfo: false },
    { id: "p3", title: "Bathroom Fitting", price: 899, image: require("../../assets/bf.jpg"), needsFloorInfo: true },
    { id: "p4", title: "Water Tank Cleaning", price: 1200, image: require("../../assets/wtc.jpg"), needsFloorInfo: false },
  ],
  Painting: [
    { id: "pa1", title: "Interior Painting", price: 5000, image: require("../../assets/ip.jpg"), needsFloorInfo: true },
    { id: "pa2", title: "Exterior Painting", price: 8000, image: require("../../assets/ep.jpg"), needsFloorInfo: true },
  ],
  Electrician: [
    { id: "e1", title: "Wiring", price: 499, image: require("../../assets/wire.jpg"), needsFloorInfo: true },
    { id: "e2", title: "Fan Repair", price: 199, image: require("../../assets/fan.jpg"), needsFloorInfo: false },
  ],
  // ... (Keep other services same as your previous code)
};

const CONSULTATION_CHARGE = 50;

const ServiceDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { service } = route.params;
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const data = INTERNAL_SERVICES[service.title as keyof typeof INTERNAL_SERVICES] || [];

  const [propertyType, setPropertyType] = useState("2bhk");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [floorSelections, setFloorSelections] = useState<{ [key: string]: number }>({});
  const [cartItems, setCartItems] = useState<any[]>([]);

  const currentProperty = PROPERTY_TYPES.find(p => p.value === propertyType);
  const maxFloors = currentProperty?.floors || 1;

  // Sync with Cart on focus
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    try {
      const existing = await AsyncStorage.getItem("cartItems");
      setCartItems(existing ? JSON.parse(existing) : []);
    } catch (e) { console.log(e); }
  };

  const toggleService = (item: any) => {
    const exists = selectedServices.find((s) => s.id === item.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.id !== item.id));
      const newFloorSelections = { ...floorSelections };
      delete newFloorSelections[item.id];
      setFloorSelections(newFloorSelections);
    } else {
      setSelectedServices([...selectedServices, item]);
      if (item.needsFloorInfo) {
        setFloorSelections({ ...floorSelections, [item.id]: 1 });
      }
    }
  };

  const updateFloorSelection = (serviceId: string, floor: number) => {
    setFloorSelections(prev => ({ ...prev, [serviceId]: floor }));
  };

  // ADD TO CART LOGIC
  const handleAddToCart = async () => {
    if (selectedServices.length === 0) return;

    try {
      const existing = await AsyncStorage.getItem("cartItems");
      let cart = existing ? JSON.parse(existing) : [];

      // Package all selected internal services into the cart
      selectedServices.forEach(s => {
        const itemToAdd = {
          id: `int-${s.id}-${Date.now()}`, // Unique ID
          title: s.title,
          category: service.title, // e.g. Plumbing
          price: s.price || 199,
          propertyType: currentProperty?.label,
          selectedFloor: s.needsFloorInfo ? floorSelections[s.id] : null,
          consultationCharge: selectedServices.length > 1 ? CONSULTATION_CHARGE : 0
        };
        
        // Avoid duplicate logic if needed, or just push
        cart.push(itemToAdd);
      });

      await AsyncStorage.setItem("cartItems", JSON.stringify(cart));
      setCartItems(cart);
      setSelectedServices([]); // Clear selection after adding
      setFloorSelections({});
      Alert.alert("Success", "Services added to cart");
    } catch (e) { console.log(e); }
  };

  const isSelected = (id: string) => selectedServices.some((s) => s.id === id);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{service.title}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          <View style={styles.section}>
            <Text style={styles.label}>PROPERTY TYPE</Text>
            <View style={styles.dropdownBox}>
              <Picker
                selectedValue={propertyType}
                onValueChange={setPropertyType}
                style={styles.picker}
              >
                {PROPERTY_TYPES.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>
            <Text style={styles.propertyInfo}>
              {currentProperty?.label} • {maxFloors} Floor(s)
            </Text>
          </View>

          <Text style={styles.question}>Select services for {service.title}</Text>
          
          <View style={styles.gridContainer}>
            {data.map((item: any, index: number) => {
              if (index % 2 !== 0) return null;
              const firstItem = data[index];
              const secondItem = data[index + 1];
              return (
                <View key={index} style={styles.row}>
                  {renderCard(firstItem)}
                  {secondItem && renderCard(secondItem)}
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* FLOATING ACTION BAR FOR SELECTION */}
        {selectedServices.length > 0 && (
          <View style={styles.bottomSelectionBar}>
            <View>
              <Text style={styles.selectionTitle}>{selectedServices.length} Selected</Text>
              <Text style={styles.selectionSub}>Add to proceed</Text>
            </View>
            <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>ADD TO CART</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* URBAN COMPANY STYLE VIEW CART BAR */}
        {cartItems.length > 0 && selectedServices.length === 0 && (
          <TouchableOpacity 
            style={styles.floatingCart} 
            onPress={() => navigation.navigate("Cart")}
          >
            <View>
              <Text style={styles.cartCountText}>{cartItems.length} ITEM(S)</Text>
              <Text style={styles.cartPriceText}>₹{totalCartPrice}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={styles.cartActionText}>View Cart</Text>
              <Icon name="shopping-cart" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );

  function renderCard(item: any) {
    const selected = isSelected(item.id);
    const currentFloor = floorSelections[item.id] || 1;
    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          style={[styles.card, selected && styles.cardSelected]}
          onPress={() => toggleService(item)}
        >
          {selected && <Icon name="check-circle" size={20} color="#10b981" style={styles.checkIcon} />}
          <Image source={item.image} style={styles.image} />
          <Text style={styles.cardText}>{item.title}</Text>
          <Text style={styles.cardPrice}>₹{item.price}</Text>
        </TouchableOpacity>

        {selected && item.needsFloorInfo && (
          <View style={styles.floorCounter}>
            <TouchableOpacity onPress={() => updateFloorSelection(item.id, Math.max(1, currentFloor - 1))}>
              <Icon name="remove-circle-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.floorText}>Fl. {currentFloor}</Text>
            <TouchableOpacity onPress={() => updateFloorSelection(item.id, Math.min(maxFloors, currentFloor + 1))}>
              <Icon name="add-circle-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
};

const getStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  header: { flexDirection: "row", padding: 16, alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  section: { padding: 16 },
  label: { color: colors.subText, fontSize: 12, fontWeight: "700", marginBottom: 8 },
  dropdownBox: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, height: 50, justifyContent: 'center' },
  picker: { color: colors.text },
  propertyInfo: { color: colors.primary, fontSize: 12, marginTop: 5, fontWeight: '600' },
  question: { color: colors.text, fontSize: 20, fontWeight: "800", paddingHorizontal: 16, marginTop: 10 },
  gridContainer: { padding: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  cardWrapper: { width: "48%" },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 10, alignItems: "center", borderWidth: 2, borderColor: "transparent" },
  cardSelected: { borderColor: colors.primary },
  checkIcon: { position: 'absolute', top: 5, right: 5, zIndex: 1 },
  image: { width: "100%", height: 100, borderRadius: 12 },
  cardText: { color: colors.text, fontSize: 14, fontWeight: "700", marginTop: 8 },
  cardPrice: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  floorCounter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 8, backgroundColor: colors.card, borderRadius: 8, padding: 5, borderWidth: 1, borderColor: colors.border },
  floorText: { color: colors.text, fontWeight: '700', fontSize: 12 },
  
  // Selection Bar
  bottomSelectionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border },
  selectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  selectionSub: { fontSize: 12, color: colors.subText },
  addToCartBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  addToCartText: { color: '#fff', fontWeight: 'bold' },

  // UC Floating Cart
  floatingCart: { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: colors.primary, flexDirection: 'row', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between', elevation: 5 },
  cartCountText: { color: '#eee', fontSize: 10, fontWeight: 'bold' },
  cartPriceText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cartActionText: { color: '#fff', fontWeight: 'bold' }
});

export default ServiceDetailsScreen;