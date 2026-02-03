import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get('window');

// --- Category Specific Services ---
const SUB_SERVICES_DATA: any = {
  car: [
    { id: 'c1', name: 'Engine Oil Replacement', price: 1500, selected: true },
    { id: 'c2', name: 'Oil Filter Change', price: 450, selected: true },
    { id: 'c3', name: 'AC Filter Cleaning', price: 600, selected: false },
    { id: 'c4', name: 'Brake Pad Checking', price: 800, selected: false },
    { id: 'c5', name: 'Coolant Top-up', price: 300, selected: false },
    { id: 'c6', name: 'Wheel Alignment', price: 1200, selected: false },
    { id: 'c7', name: 'Interior Vacuuming', price: 500, selected: false },
  ],
  bike: [
    { id: 'b1', name: 'Chain Lubrication', price: 150, selected: true },
    { id: 'b2', name: 'Spark Plug Cleaning', price: 100, selected: true },
    { id: 'b3', name: 'Engine Oil (Bike)', price: 450, selected: true },
    { id: 'b4', name: 'Brake Shoe Adjustment', price: 200, selected: false },
    { id: 'b5', name: 'Air Filter Cleaning', price: 150, selected: false },
    { id: 'b6', name: 'Clutch Cable Tightening', price: 100, selected: false },
  ],
  truck: [
    { id: 't1', name: 'Hydraulic System Check', price: 2500, selected: true },
    { id: 't2', name: 'Air Brake Adjustment', price: 1200, selected: true },
    { id: 't3', name: 'Grease Point Lubrication', price: 800, selected: true },
    { id: 't4', name: 'Heavy Duty Oil Change', price: 4500, selected: true },
    { id: 't5', name: 'Suspension Inspection', price: 1500, selected: false },
    { id: 't6', name: 'Fuel Filter Replacement', price: 1800, selected: false },
  ]
};

const VEHICLE_DATA: any = {
  car: { brands: ['Maruti', 'Hyundai', 'Tata', 'Toyota', 'Honda'], fuel: ['Petrol', 'Diesel', 'CNG', 'EV'], icon: 'directions-car' },
  bike: { brands: ['Hero', 'Honda', 'Bajaj', 'Royal Enfield', 'Yamaha'], fuel: ['Petrol', 'Electric'], icon: 'two-wheeler' },
  truck: { brands: ['Tata', 'Ashok Leyland', 'Eicher', 'BharatBenz'], fuel: ['Diesel', 'CNG'], icon: 'local-shipping' }
};

const GARAGE_NAMES: any = {
  car: ['Supreme Car Care', 'Apex Auto Garage', 'Luxury Wheels Rajkot'],
  bike: ['Rapid Bike Fix', 'QuickCycle Hub', 'Two-Wheeler Masters'],
  truck: ['Heavy Hauler Service', 'Truck Masters GIDC', 'Commercial Fleet Care']
};

const EMPLOYEES = [
  { id: 'e1', name: 'Rahul M.', role: 'Senior Mechanic', rating: '4.8', distance: '1.2 km', image: 'https://randomuser.me/api/portraits/men/32.jpg', mobileNumber: '9876543210' },
  { id: 'e2', name: 'Suresh K.', role: 'Expert Technician', rating: '4.9', distance: '0.8 km', image: 'https://randomuser.me/api/portraits/men/44.jpg', mobileNumber: '9876543211' },
  { id: 'e3', name: 'Amit P.', role: 'Maintenance Lead', rating: '4.7', distance: '2.5 km', image: 'https://randomuser.me/api/portraits/men/86.jpg', mobileNumber: '9876543212' },
];

const VehicleSub = () => {
  const navigation = useNavigation<any>();
  const { colors, lightMode } = useTheme();
  const styles = getStyles(colors);

  const [vehicleType, setVehicleType] = useState('car'); 
  const [brand, setBrand] = useState(VEHICLE_DATA['car'].brands[0]);
  const [fuel, setFuel] = useState(VEHICLE_DATA['car'].fuel[0]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [description, setDescription] = useState('');
  
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [tempServices, setTempServices] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState(EMPLOYEES[0]);

  // Cart State
  const [cartItems, setCartItems] = useState<any[]>([]);

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

  const packages = useMemo(() => [
    { id: 'p1', name: 'Standard Service', garageName: GARAGE_NAMES[vehicleType][0], address: '102, Royal Plaza, Rajkot', rating: '4.8', basePrice: 1200 },
    { id: 'p2', name: 'Comprehensive Care', garageName: GARAGE_NAMES[vehicleType][1], address: 'Plot 45, GIDC Phase 3, Rajkot', rating: '4.9', basePrice: 2500 },
    { id: 'p3', name: 'Express Checkup', garageName: GARAGE_NAMES[vehicleType][2], address: 'University Road, Rajkot', rating: '4.6', basePrice: 800 },
  ], [vehicleType]);

  const handleVehicleChange = (type: string) => {
    setVehicleType(type);
    setBrand(VEHICLE_DATA[type].brands[0]);
    setFuel(VEHICLE_DATA[type].fuel[0]);
    setShowBrandDropdown(false);
    setShowFuelDropdown(false);
  };

  const handleViewDetails = (pkg: any) => {
    setSelectedPackage(pkg);
    setTempServices(SUB_SERVICES_DATA[vehicleType]);
    setShowDetail(true);
  };

  const currentTotal = useMemo(() => {
    const servicesTotal = tempServices.reduce((sum, s) => s.selected ? sum + s.price : sum, 0);
    const garageFee = selectedPackage?.basePrice || 0;
    return servicesTotal + garageFee;
  }, [tempServices, selectedPackage]);

  // FIXED ACTION: ADD TO CART
  const handleAddToCart = async () => {
    try {
      const existing = await AsyncStorage.getItem("cartItems");
      let cart = existing ? JSON.parse(existing) : [];
      
      const newCartItem = {
        id: `veh-${Date.now()}`,
        title: `${brand} ${selectedPackage.name}`,
        category: "Vehicle",
        price: currentTotal,
        // Metadata for the BookCleaning form
        vehicleType,
        brand,
        fuel,
        description,
        allocatedEmployee: selectedEmp,
        consultationCharge: selectedPackage.basePrice,
        subServices: tempServices.filter(s => s.selected)
      };

      cart.push(newCartItem);
      await AsyncStorage.setItem("cartItems", JSON.stringify(cart));
      setCartItems(cart);
      setShowDetail(false);
    } catch (e) { console.log(e); }
  };

  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle={!lightMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Services</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {Object.keys(VEHICLE_DATA).map((type) => (
              <TouchableOpacity key={type} onPress={() => handleVehicleChange(type)}
                style={[styles.typeBtn, { backgroundColor: colors.card, borderColor: colors.border }, vehicleType === type && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                <MaterialIcons name={VEHICLE_DATA[type].icon} size={18} color={vehicleType === type ? '#fff' : colors.subText} />
                <Text style={{ color: vehicleType === type ? '#fff' : colors.subText, fontSize: 11, fontWeight: '700', marginLeft: 6 }}>{type.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.dropdownRow}>
            <TouchableOpacity style={styles.dropdownBtn} onPress={() => { setShowBrandDropdown(!showBrandDropdown); setShowFuelDropdown(false); }}>
              <Text style={styles.dropdownLabel}>BRAND</Text>
              <View style={styles.dropValueRow}><Text style={styles.dropdownValue}>{brand}</Text><MaterialIcons name="expand-more" size={18} color={colors.primary} /></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownBtn} onPress={() => { setShowFuelDropdown(!showFuelDropdown); setShowBrandDropdown(false); }}>
              <Text style={styles.dropdownLabel}>FUEL TYPE</Text>
              <View style={styles.dropValueRow}><Text style={styles.dropdownValue}>{fuel}</Text><MaterialIcons name="expand-more" size={18} color={colors.primary} /></View>
            </TouchableOpacity>
          </View>

          {showBrandDropdown && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listScroll}>
              {VEHICLE_DATA[vehicleType].brands.map((b: string) => (
                <TouchableOpacity key={b} style={styles.listChip} onPress={() => { setBrand(b); setShowBrandDropdown(false); }}>
                  <Text style={[styles.infoText, brand === b && { color: colors.primary, fontWeight: '800' }]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {showFuelDropdown && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listScroll}>
              {VEHICLE_DATA[vehicleType].fuel.map((f: string) => (
                <TouchableOpacity key={f} style={styles.listChip} onPress={() => { setFuel(f); setShowFuelDropdown(false); }}>
                  <Text style={[styles.infoText, fuel === f && { color: colors.primary, fontWeight: '800' }]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.sectionTitle}>Available Garages</Text>
          {packages.map((item) => (
            <View key={item.id} style={styles.ownerCard}>
              <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                <Image source={{ uri: 'https://img.freepik.com/free-photo/auto-mechanic-working-garage-repair-service_1150-13725.jpg' }} style={styles.serviceImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.ownerName}>{item.garageName}</Text>
                  <Text style={styles.infoText}>📍 {item.address}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <MaterialIcons name="star" size={14} color="#fbbf24" />
                    <Text style={[styles.infoText, { fontWeight: '700' }]}> {item.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.buyButton} onPress={() => handleViewDetails(item)}>
                <Text style={styles.buyButtonText}>VIEW DETAILS</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{height: 100}} />
      </ScrollView>

      {/* Floating View Cart Bar */}
      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingCart} 
          onPress={() => navigation.navigate("Cart")}
          activeOpacity={0.9}
        >
          <View>
            <Text style={styles.cartCountText}>{cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''}</Text>
            <Text style={styles.cartPriceText}>₹{totalCartPrice}</Text>
          </View>
          <View style={styles.viewCartAction}>
            <Text style={styles.cartActionText}>View Cart</Text>
            <MaterialIcons name="shopping-cart" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      )}

      {/* --- DETAILS MODAL --- */}
      <Modal visible={showDetail} animationType="slide">
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowDetail(false)}><MaterialIcons name="close" size={24} color={colors.text} /></TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedPackage?.name}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.content}>
            <View style={[styles.ownerCard, { margin: 16 }]}>
              <Text style={styles.ownerName}>{selectedPackage?.garageName}</Text>
              <Text style={styles.infoText}>{selectedPackage?.address}</Text>
            </View>

            <View style={{ padding: 16 }}>
              <Text style={styles.sectionTitle}>{vehicleType.toUpperCase()} SERVICES INCLUDED</Text>
              {tempServices.map((s) => (
                <TouchableOpacity key={s.id} style={styles.checkRow} 
                  onPress={() => setTempServices(tempServices.map(item => item.id === s.id ? {...item, selected: !item.selected} : item))}>
                   <MaterialIcons name={s.selected ? "check-box" : "check-box-outline-blank"} size={22} color={s.selected ? colors.primary : colors.subText} />
                   <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.ownerName, { fontSize: 14 }]}>{s.name}</Text>
                      <Text style={styles.infoText}>₹{s.price}</Text>
                   </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ padding: 16 }}>
              <Text style={styles.sectionTitle}>Problem Description (Optional)</Text>
              <TextInput
                placeholder="e.g. Brakes are making noise, oil leak noticed, etc."
                placeholderTextColor={colors.subText}
                multiline
                numberOfLines={4}
                style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border }]}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={{ padding: 16 }}>
              <Text style={styles.sectionTitle}>ALLOCATE PROFESSIONAL</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {EMPLOYEES.map((emp) => (
                  <TouchableOpacity key={emp.id} onPress={() => setSelectedEmp(emp)}
                    style={[styles.empCard, { borderColor: selectedEmp.id === emp.id ? colors.primary : colors.border }]}>
                    <Image source={{ uri: emp.image }} style={styles.empImg} />
                    <Text style={[styles.ownerName, { fontSize: 11, marginTop: 5, textAlign: 'center' }]}>{emp.name}</Text>
                    <Text style={{ fontSize: 9, color: colors.subText }}>⭐ {emp.rating}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{height: 120}} />
          </ScrollView>

          <View style={[styles.cardFooter, { padding: 20, backgroundColor: colors.card }]}>
             <View>
                <Text style={styles.dropdownLabel}>ESTIMATED TOTAL</Text>
                <Text style={styles.bottomPrice}>₹ {currentTotal}</Text>
             </View>
             <TouchableOpacity style={styles.buyButton} onPress={handleAddToCart}>
                <Text style={styles.buyButtonText}>ADD TO CART</Text>
             </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  content: { flex: 1 },
  detailsSection: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  typeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginRight: 8 },
  dropdownRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  dropdownBtn: { flex: 1, backgroundColor: colors.card, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  dropdownLabel: { fontSize: 9, color: colors.subText, fontWeight: '800' },
  dropValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  dropdownValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  listScroll: { marginTop: 10 },
  listChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, backgroundColor: colors.card, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  ownerCard: { backgroundColor: colors.card, padding: 16, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: colors.border },
  serviceImg: { width: 60, height: 60, borderRadius: 10 },
  ownerName: { fontSize: 16, fontWeight: '700', color: colors.text },
  infoText: { fontSize: 12, color: colors.subText },
  buyButton: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  buyButtonText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  checkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  empCard: { width: 95, alignItems: 'center', padding: 10, backgroundColor: colors.card, borderRadius: 12, marginRight: 12, borderWidth: 2 },
  empImg: { width: 45, height: 45, borderRadius: 25 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border },
  bottomPrice: { fontSize: 22, fontWeight: '800', color: colors.primary },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 12, color: colors.text, fontSize: 14, height: 100, textAlignVertical: 'top', marginTop: 5 },
  
  // Floating Cart Bar
  floatingCart: { 
    position: 'absolute', 
    bottom: 20, 
    left: 16, 
    right: 16, 
    backgroundColor: colors.primary, 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  cartCountText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700' },
  cartPriceText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  viewCartAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cartActionText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default VehicleSub;