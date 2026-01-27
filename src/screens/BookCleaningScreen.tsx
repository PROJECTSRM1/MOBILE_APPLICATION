import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import Geolocation from "react-native-geolocation-service";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { launchCamera, launchImageLibrary, Asset } from "react-native-image-picker";
import { useTheme } from "../context/ThemeContext";

/* =======================
   TYPES & CONSTANTS 
   ======================= */
interface Service { 
  id: string; 
  title?: string;
  name?: string;
  category: string;
  price?: number; 
}

interface Professional { 
  id: string; 
  name: string; 
  role: string; 
  rating: string; 
  distance: string; 
  image: any; 
  verified?: boolean; 
  mobileNumber: string; 
}

// Service Bank for Add-ons based on Vehicle Selection
const VEHICLE_SUB_SERVICES: any = {
  car: [
    { id: 'c1', title: 'Engine Oil Replacement', price: 1500, category: 'Vehicle' },
    { id: 'c2', title: 'Oil Filter Change', price: 450, category: 'Vehicle' },
    { id: 'c3', title: 'AC Filter Cleaning', price: 600, category: 'Vehicle' },
    { id: 'c4', title: 'Brake Pad Checking', price: 800, category: 'Vehicle' },
    { id: 'c5', title: 'Coolant Top-up', price: 300, category: 'Vehicle' },
    { id: 'c6', title: 'Wheel Alignment', price: 1200, category: 'Vehicle' },
    { id: 'c7', title: 'Interior Vacuuming', price: 500, category: 'Vehicle' },
  ],
  bike: [
    { id: 'b1', title: 'Chain Lubrication', price: 150, category: 'Vehicle' },
    { id: 'b2', title: 'Spark Plug Cleaning', price: 100, category: 'Vehicle' },
    { id: 'b3', title: 'Engine Oil (Bike)', price: 450, category: 'Vehicle' },
    { id: 'b4', title: 'Brake Shoe Adjustment', price: 200, category: 'Vehicle' },
    { id: 'b5', title: 'Air Filter Cleaning', price: 150, category: 'Vehicle' },
    { id: 'b6', title: 'Clutch Cable Tightening', price: 100, category: 'Vehicle' },
  ],
  truck: [
    { id: 't1', title: 'Hydraulic System Check', price: 2500, category: 'Vehicle' },
    { id: 't2', title: 'Air Brake Adjustment', price: 1200, category: 'Vehicle' },
    { id: 't3', title: 'Grease Point Lubrication', price: 800, category: 'Vehicle' },
    { id: 't4', title: 'Heavy Duty Oil Change', price: 4500, category: 'Vehicle' },
    { id: 't5', title: 'Suspension Inspection', price: 1500, category: 'Vehicle' },
    { id: 't6', title: 'Fuel Filter Replacement', price: 1800, category: 'Vehicle' },
  ]
};


const ALL_SERVICES: Service[] = [
  { id: "1", title: "Kitchen Cleaning", category: "Home", price: 80 },
  { id: "2", title: "Washroom Cleaning", category: "Home", price: 80 },
  { id: "6", title: "Full Deep Cleaning", category: "Home", price: 150 },
  { id: "17", title: "Pipe Leakage", category: "Plumbing", price: 50 },
  { id: "18", title: "Tap Fixing", category: "Plumbing", price: 40 },
];

const HOME_CLEANING_SERVICES = [
  { id: "1", title: "Kitchen Cleaning", category: "Home", price: 80 },
  { id: "2", title: "Washroom Cleaning", category: "Home", price: 80 },
  { id: "3", title: "Sofa Cleaning", category: "Home", price: 70 },
  { id: "4", title: "Bedroom Cleaning", category: "Home", price: 75 },
  { id: "5", title: "Window Cleaning", category: "Home", price: 60 },
  { id: "6", title: "Full Deep Cleaning", category: "Home", price: 150 },
];

const HOME_SERVICE_OPTIONS: Record<string, { id: string; title: string }[]> = {
  Plumbing: [
    { id: "p1", title: "Pipe Leakage" },
    { id: "p2", title: "Tap Fixing" },
    { id: "p3", title: "Bathroom Fitting" },
    { id: "p4", title: "Water Tank Cleaning" },
  ],
  Painting: [
    { id: "pa1", title: "Interior Painting" },
    { id: "pa2", title: "Exterior Painting" },
    { id: "pa3", title: "Wall Texture" },
    { id: "pa4", title: "Repainting" },
  ],
  Electrician: [
    { id: "e1", title: "Wiring" },
    { id: "e2", title: "Fan Repair" },
    { id: "e3", title: "Light Installation" },
    { id: "e4", title: "Power Backup Setup" },
  ],
  "AC Repair": [
    { id: "a1", title: "AC Installation" },
    { id: "a2", title: "AC Gas Refill" },
    { id: "a3", title: "AC General Service" },
    { id: "a4", title: "AC Uninstallation" },
  ],
  Chef: [
    { id: "c1", title: "Home Cooking" },
    { id: "c2", title: "Party Catering" },
    { id: "c3", title: "Weekly Meal Plan" },
    { id: "c4", title: "Festival Cooking" },
  ],
};

const COMMERCIAL_CLEANING_SERVICES = [
  { id: "c1", title: "Small Office Cleaning", category: "Commercial", price: 49 },
  { id: "c2", title: "Medium Office Cleaning", category: "Commercial", price: 129 },
  { id: "c3", title: "Large Corporate Office Cleaning", category: "Commercial", price: 199 },
  { id: "c4", title: "Retail Shop Cleaning", category: "Commercial", price: 89 },
  { id: "c5", title: "Warehouse / Clinic Cleaning", category: "Commercial", price: 199 },
];

const PLUMBING_SERVICES = [
  { id: "p1", title: "Pipe Leakage", category: "Plumbing", price: 120 },
  { id: "p2", title: "Tap Fixing", category: "Plumbing", price: 80 },
  { id: "p3", title: "Drain Blockage", category: "Plumbing", price: 150 },
  { id: "p4", title: "Shower Installation", category: "Plumbing", price: 200 },
];

const ELECTRICAL_SERVICES = [
  { id: "e1", title: "Switch Repair", category: "Electrical", price: 70 },
  { id: "e2", title: "Fan Installation", category: "Electrical", price: 150 },
  { id: "e3", title: "Light Wiring", category: "Electrical", price: 120 },
];

const AC_SERVICES = [
  { id: "a1", title: "AC Servicing", category: "AC", price: 500 },
  { id: "a2", title: "Gas Refill", category: "AC", price: 1800 },
  { id: "a3", title: "AC Installation", category: "AC", price: 2500 },
];

const CARPENTRY_SERVICES = [
  { id: "c1", title: "Door Repair", category: "Carpentry", price: 300 },
  { id: "c2", title: "Furniture Assembly", category: "Carpentry", price: 450 },
];

const detectCategoryFromTitle = (serviceTitle: string): string | null => {
  if (!serviceTitle || typeof serviceTitle !== 'string') return null;
  const cleanTitle = serviceTitle.toLowerCase().replace(/ service$/i, '').trim();
  const exactMatch = ALL_SERVICES.find(s => s.title?.toLowerCase() === cleanTitle);
  if (exactMatch) return exactMatch.category;
  
  const categoryKeywords: { [key: string]: string[] } = {
    'Plumbing': ['plumb', 'pipe', 'tap', 'leak'],
    'Painting': ['paint', 'texture'],
    'Electrician': ['wiring', 'fan', 'light'],
    'AC Repair': ['ac ', 'air condition'],
    'Chef': ['cook', 'chef', 'food'],
    'Commercial': ['office', 'commercial'],
    'Home': ['cleaning', 'kitchen', 'washroom'],
    'Vehicle': ['car', 'bike', 'motor', 'truck', 'heavy', 'auto'],
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => cleanTitle.includes(keyword))) return category;
  }
  return null;
};

const BookCleaningScreen: React.FC = () => {
  const route = useRoute<any>();
  const mainServiceFromHome = route.params?.mainService;
const addonServicesFromHome: string[] = route.params?.addonServices || [];

  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  // States
  const [jobDescription, setJobDescription] = useState("");
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  const [locationType, setLocationType] = useState<"default" | "other">("default");
  const [allocationType, setAllocationType] = useState<"auto" | "manual">("auto");
  const [floorArea, setFloorArea] = useState("");
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("10:00 AM");
  const [extraHours, setExtraHours] = useState(0);
  const [reason, setReason] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [images, setImages] = useState<Asset[]>([]);
  const [showAddonPicker, setShowAddonPicker] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [allocatedEmployee, setAllocatedEmployee] = useState<Professional | null>(route.params?.allocatedEmployee || null);

  // --- REFACTORED INITIAL SERVICE LOGIC ---
  const [selectedServices, setSelectedServices] = useState<any[]>(() => {

  // ✅ NEW HOME CLEANING FLOW
  if (mainServiceFromHome) {
    const main = {
      id: "main-service",
      title: mainServiceFromHome,
      category: "Home",
      price: 80,
      isMain: true,
    };

    const addons = addonServicesFromHome.map((s, index) => ({
      id: `addon-${index}`,
      title: s,
      category: "Home",
      price: 80,
      isMain: false,
    }));

    return [main, ...addons];
  }

  // ✅ OLD EXISTING FLOWS (vehicle, plumbing etc)
  if (route.params?.selectedServices) {
    return route.params.selectedServices;
  }

  const incomingS = route.params?.selectedService;
  if (incomingS) {
    const title = typeof incomingS === 'string' ? incomingS : incomingS?.title || '';
    return [{
      id: 'init-1',
      title: title,
      category: detectCategoryFromTitle(title) || route.params?.serviceCategory || 'Home',

      price: 80,
      isMain: true,
    }];
  }

  return [];
});


  const vType = route.params?.vehicleType || 'car';

const remainingServices = useMemo(() => {

  // 🚗 Vehicle flow
  if (route.params?.vehicleType) {
    return VEHICLE_SUB_SERVICES[vType].filter((service: Service) =>
      !selectedServices.some(s => s.title === service.title)
    );
  }

  // 🏠 Home Cleaning flow
  if (selectedServices[0]?.category === "Home") {
    return HOME_CLEANING_SERVICES.filter(service =>
      !selectedServices.some(s => s.title === service.title)
    );
  }

  // 🏢 Commercial Cleaning flow  ✅ NEW
  if (selectedServices[0]?.category === "Commercial") {
    return COMMERCIAL_CLEANING_SERVICES.filter(service =>
      !selectedServices.some(s => s.title === service.title)
    );
  }// 🏠 Home Services (Plumbing, Painting, Electrician, AC Repair, Chef)
if (HOME_SERVICE_OPTIONS[selectedServices[0]?.category]) {
  return HOME_SERVICE_OPTIONS[selectedServices[0].category]
    .filter(service =>
      !selectedServices.some(s => s.title === service.title)
    )
    .map(service => ({
      ...service,
      category: selectedServices[0].category,
      price: 80,
    }));
}



  // fallback
  return ALL_SERVICES.filter(s =>
    s.category === selectedServices[0]?.category &&
    !selectedServices.some(sel => sel.title === s.title)
  );

}, [selectedServices, vType]);



  // Sync Pricing
  const servicePrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const consultationCharge = route.params?.consultationCharge || 0;
  const totalPrice = servicePrice + consultationCharge;

  const showFloorField = selectedServices[0]?.category === "Home" || selectedServices[0]?.category === "Commercial";
  const showAllocationUI = (selectedServices[0]?.category !== "Vehicle" && !selectedServices[0]?.title?.toLowerCase().includes("chef")) || !!allocatedEmployee;

  useEffect(() => {
    if (locationType === "default") getCurrentLocation();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    } catch (err) { return false; }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=en`, { headers: { 'User-Agent': 'ServiceApp' } });
          const data = await response.json();
          const addr = data.address;
          const formatted = [addr.road || addr.suburb || "", addr.city || addr.town || "", addr.state || ""].filter(p => p.length > 0).join(", ");
          setCurrentAddress(formatted || data.display_name || "Location detected");
        } catch (e) { setCurrentAddress("Error fetching address"); } finally { setLoadingLocation(false); }
      },
      (error) => { setLoadingLocation(false); Alert.alert("Location Error", "GPS is required."); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const addService = (serviceId: string) => {
  const s = remainingServices.find((item: any) => item.id === serviceId);
  if (s) {
    setSelectedServices((prev) => [
      ...prev,
      {
        id: `addon-${s.id}-${Date.now()}`,
        title: s.title,
        category: s.category,
        price: s.price,
        isMain: false,
      }
    ]);

      setSelectedAddon(null);
      setShowAddonPicker(false);
    }
  };

  const removeService = (id: string) => setSelectedServices((prev) => prev.filter((s) => s.id !== id));

  const handleAllocationTypeChange = (value: "auto" | "manual") => {
    setAllocationType(value);
    navigation.navigate("EmployeeAllocation", { 
      isAutoAllocation: value === "auto",
      selectedServices: selectedServices.map(s => s.title || s.name),
      consultationCharge: consultationCharge,
      mainCategory: selectedServices[0]?.category,
    });
  };

  const handleTakePhoto = async () => {
    const result = await launchCamera({ mediaType: "photo", quality: 0.7 });
    if (!result.didCancel && result.assets) setImages((prev) => [...prev, ...result.assets!]);
  };

  const handlePickFromGallery = async () => {
    const result = await launchImageLibrary({ mediaType: "photo", selectionLimit: 0, quality: 0.7 });
    if (!result.didCancel && result.assets) setImages((prev) => [...prev, ...result.assets!]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Service</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}><MaterialIcons name="more-horiz" size={24} color="#9CA3AF" /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Job Details</Text>

        {/* --- DESCRIPTION FIELD FOR VEHICLE --- */}
        {route.params?.vehicleType && (
          <View style={styles.section}>
            <Text style={styles.label}>VEHICLE PROBLEM DESCRIPTION</Text>
            <TextInput
              placeholder="E.g. Brake noise, oil leak noticed..."
              placeholderTextColor="#9CA3AF"
              multiline
              style={[styles.input, styles.textArea]}
              value={jobDescription}
              onChangeText={setJobDescription}
            />
          </View>
        )}

        <Text style={styles.label}>Location</Text>
        <View style={styles.dropdownBox}>
          <Picker selectedValue={locationType} onValueChange={(v) => { setLocationType(v); if (v === "default") getCurrentLocation(); }} style={styles.picker}>
            <Picker.Item label="Default Location (Home)" value="default" />
            <Picker.Item label="Other Location" value="other" />
          </Picker>
        </View>

        {locationType === "default" && (
          <View style={styles.detectedLocationBox}>
            <View style={styles.locationRow}>
              <MaterialIcons name={loadingLocation ? "location-searching" : "location-on"} size={20} color="#135BEC" />
              <Text style={styles.detectedLocationText}>{loadingLocation ? "Detecting..." : currentAddress || "Tap to detect"}</Text>
            </View>
          </View>
        )}

        {locationType === "other" && (
          <View>
            <TextInput placeholder="Customer Name" placeholderTextColor="#9CA3AF" style={styles.input} value={customerName} onChangeText={setCustomerName} />
            <TextInput placeholder="Contact Number" keyboardType="phone-pad" placeholderTextColor="#9CA3AF" style={styles.input} value={contactNumber} onChangeText={setContactNumber} />
            <TextInput placeholder="Location Details" multiline style={[styles.input, styles.textArea]} value={locationDetails} onChangeText={setLocationDetails} />
          </View>
        )}

        {showAllocationUI && !route.params?.allocatedEmployee && (
          <>
            <Text style={styles.label}>Allocation Type</Text>
            <View style={styles.dropdownBox}>
              <Picker selectedValue={allocationType} onValueChange={handleAllocationTypeChange} style={styles.picker}>
                <Picker.Item label="Auto-Allocation" value="auto" />
                <Picker.Item label="Manual Allocation" value="manual" />
              </Picker>
            </View>
          </>
        )}

        {showAllocationUI && allocatedEmployee && (
          <View style={styles.allocatedCard}>
            <View style={styles.allocatedHeader}>
              <Text style={styles.allocatedTitle}>Allocated Professional</Text>
              <TouchableOpacity onPress={() => setAllocatedEmployee(null)}><MaterialIcons name="close" size={20} color="#9CA3AF" /></TouchableOpacity>
            </View>
            <View style={styles.allocatedContent}>
              <Image source={typeof allocatedEmployee.image === "number" ? allocatedEmployee.image : { uri: allocatedEmployee.image }} style={styles.allocatedAvatar} />
              <View>
                <Text style={styles.allocatedName}>{allocatedEmployee.name}</Text>
                <Text style={styles.allocatedRole}>{allocatedEmployee.role} • ⭐ {allocatedEmployee.rating}</Text>
              </View>
            </View>
          </View>
        )}

        {showFloorField && (
          <View style={styles.section}>
            <Text style={styles.label}>FLOOR AREA (SQFT)</Text>
            <View style={styles.floorInput}>
              <TextInput style={styles.floorField} placeholder="1400" keyboardType="numeric" value={floorArea} onChangeText={setFloorArea} />
              <Text style={styles.sqftLabel}>SQFT</Text>
            </View>
          </View>
        )}

        <View style={styles.dateTimeRow}>
          <TouchableOpacity style={[styles.dateInput, { flex: 1 }]} onPress={() => setShowDatePicker(true)}><MaterialIcons name="calendar-today" size={20} color="#9CA3AF" /><Text style={styles.dateText}>{date || "Select Date"}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.timeInput, { flex: 1 }]} onPress={() => setShowTimePicker(true)}><MaterialIcons name="access-time" size={20} color="#9CA3AF" /><Text style={styles.timeText}>{time || "Select Time"}</Text></TouchableOpacity>
        </View>

        {showDatePicker && <DateTimePicker value={new Date()} mode="date" minimumDate={new Date()} onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d.toLocaleDateString('en-GB')); }} />}
        {showTimePicker && <DateTimePicker value={new Date()} mode="time" onChange={(e, t) => { setShowTimePicker(false); if (t) setTime(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); }} />}

        <View style={styles.extraHoursCard}>
          <View style={styles.extraHoursHeader}>
            <Text style={styles.extraHoursTitle}>Extra Hours</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => setExtraHours(Math.max(0, extraHours - 1))}><Text style={styles.counterIcon}>-</Text></TouchableOpacity>
              <Text style={styles.counterText}>+{extraHours} hr</Text>
              <TouchableOpacity onPress={() => setExtraHours(extraHours + 1)}><Text style={styles.counterIcon}>+</Text></TouchableOpacity>
            </View>
          </View>
          {extraHours > 0 && <TextInput placeholder="Reason..." multiline style={styles.textarea} value={reason} onChangeText={setReason} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>UPLOAD PHOTOS</Text>
          <View style={styles.photoContainer}>
            <TouchableOpacity style={styles.photoBoxDashed} onPress={handleTakePhoto}><MaterialIcons name="photo-camera" size={28} color="#135BEC" /></TouchableOpacity>
            <TouchableOpacity style={styles.photoBoxDashed} onPress={handlePickFromGallery}><MaterialIcons name="photo-library" size={28} color="#135BEC" /></TouchableOpacity>
            {images.map((img, i) => (
              <View key={i} style={styles.photoPreview}><Image source={{ uri: img.uri }} style={styles.photoImage} /><TouchableOpacity style={styles.removePhoto} onPress={() => setImages(images.filter((_, idx) => idx !== i))}><MaterialIcons name="close" size={14} color="#fff" /></TouchableOpacity></View>
            ))}
          </View>
        </View>

        <View style={styles.thinDivider} />

        <View style={styles.addonHeader}>
          <Text style={styles.sectionTitle}>Services Selected</Text>
          <TouchableOpacity 
  style={[styles.addBtn, remainingServices.length === 0 && styles.addBtnDisabled]} 
  onPress={() => setServiceModalVisible(true)}
  disabled={remainingServices.length === 0}
>

            <MaterialIcons name="add" size={18} color="#fff" /><Text style={styles.addBtnText}>Add More</Text>
          </TouchableOpacity>
        </View>

         {false && (

          <View style={styles.dropdownBox}>
            <Picker selectedValue={selectedAddon} onValueChange={(v) => { if (v && v !== 'placeholder') addService(v); }} style={styles.picker}>
              <Picker.Item label="Select Service" value="placeholder" />
              {remainingServices.map((s: any) => <Picker.Item key={s.id} label={`${s.title || s.name} - ₹${s.price}`} value={s.id} />)}
            </Picker>
          </View>
        )}

        {selectedServices.map((s, i) => (
  <View key={s.id} style={styles.addonCard}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.addonSelectText, s.isMain && { color: colors.primary }]}>
          {s.title || s.name}
        </Text>
        <Text style={styles.addonCategoryText}>
          {s.isMain ? "Main Service" : "Add-on"} • ₹{s.price}
        </Text>
      </View>

      {/* ❌ Do NOT allow delete for main service */}
      {!s.isMain && (
        <TouchableOpacity onPress={() => removeService(s.id)}>
          <MaterialIcons name="delete" size={20} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  </View>
))}


        <View style={styles.summary}>
          <SummaryRow label="Items Total" value={`₹${servicePrice}`} styles={styles} />
          {consultationCharge > 0 && <SummaryRow label="Garage Base Fee" value={`₹${consultationCharge}`} styles={styles} />}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotal}><Text style={styles.summaryTotalLabel}>Final Amount</Text><Text style={styles.summaryTotalValue}>₹{totalPrice}</Text></View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.ctaBtn} 
          onPress={() => navigation.navigate("PaymentScreen", { 
            totalAmount: totalPrice,
           selectedServices: selectedServices.map(s => ({
  title: s.title || s.name,
  price: s.price,
  category: s.category
})),

            allocatedEmployee: allocatedEmployee,
            bookingDetails: {
              location: locationType === "default" ? currentAddress : locationDetails,
              description: jobDescription,
              date: date,
              time: time,
              employee: allocatedEmployee?.name,
              vehicle: route.params?.vehicleInfo
            }
          })}
        >
          <Text style={styles.ctaText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={serviceModalVisible} transparent animationType="slide">
  <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center" }}>
    <View style={{ backgroundColor: colors.surface, margin: 20, borderRadius: 16, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 15 }}>
        Select Service
      </Text>

      <ScrollView>
        {remainingServices.map((s: any) => (
          <TouchableOpacity
            key={s.id}
            style={{ paddingVertical: 12 }}
            onPress={() => {
              addService(s.id);
              setServiceModalVisible(false);
            }}
          >
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {s.title || s.name} - ₹{s.price}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={{ marginTop: 10 }}>
        <Text style={{ color: colors.primary, textAlign: "right", fontWeight: "600" }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

const SummaryRow = ({ label, value, styles }: any) => (
  <View style={styles.summaryRow}><Text style={styles.summaryRowText}>{label}</Text><Text style={styles.summaryRowText}>{value}</Text></View>
);

const getStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  iconBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  content: { padding: 16 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { color: colors.subText, fontSize: 14, fontWeight: "500", marginBottom: 8 },
  dropdownBox: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: 'hidden' },
  picker: { height: 50, color: colors.text },
  input: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, color: colors.text, marginBottom: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  detectedLocationBox: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detectedLocationText: { color: colors.text, fontSize: 14, flexShrink: 1 },
  floorInput: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, height: 50 },
  floorField: { flex: 1, color: colors.text },
  sqftLabel: { color: colors.subText },
  dateTimeRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  dateInput: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 12, height: 50, paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: colors.border },
  timeInput: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 12, height: 50, paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: colors.border },
  dateText: { color: colors.text },
  timeText: { color: colors.text },
  extraHoursCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  extraHoursHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  extraHoursTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  counterContainer: { flexDirection: "row", alignItems: "center", gap: 15 },
  counterIcon: { fontSize: 24, color: colors.primary, fontWeight: '700' },
  counterText: { color: colors.text, fontWeight: '600' },
  textarea: { backgroundColor: colors.background, borderRadius: 8, padding: 10, marginTop: 10, color: colors.text, height: 60 },
  photoContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoBoxDashed: { width: 70, height: 70, borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  photoPreview: { width: 70, height: 70, borderRadius: 10, overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%' },
  removePhoto: { position: 'absolute', top: 2, right: 2, backgroundColor: 'red', borderRadius: 10 },
  thinDivider: { height: 1, backgroundColor: colors.border, marginVertical: 20 },
  allocatedCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  allocatedHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  allocatedTitle: { fontSize: 12, fontWeight: "700", color: colors.subText, textTransform: 'uppercase' },
  allocatedContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  allocatedAvatar: { width: 50, height: 50, borderRadius: 25 },
  allocatedName: { fontSize: 16, fontWeight: "700", color: colors.text },
  allocatedRole: { fontSize: 14, color: colors.subText },
  addonHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  addBtnDisabled: { backgroundColor: colors.subText, opacity: 0.5 },
  addBtnText: { color: '#fff', marginLeft: 4, fontWeight: '600' },
  categoryInfo: { color: colors.primary, fontSize: 13, marginBottom: 12, fontWeight: '500' },
  addonCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  addonSelectText: { color: colors.text, fontWeight: '600', fontSize: 15 },
  addonCategoryText: { color: colors.subText, fontSize: 12, marginTop: 2 },
  summary: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryRowText: { color: colors.subText },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 18, fontWeight: "700", color: colors.text },
  summaryTotalValue: { fontSize: 22, fontWeight: "800", color: colors.primary },
  section: { marginBottom: 20 },
  bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  ctaBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', width: '100%' },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: "700" },
});

export default BookCleaningScreen;