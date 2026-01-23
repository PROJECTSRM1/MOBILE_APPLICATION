import React, { useState, useEffect } from "react";
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
  title: string; 
  category: string; 
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

const ALL_SERVICES: Service[] = [
  { id: "1", title: "Kitchen Cleaning", category: "Home" },
  { id: "2", title: "Washroom Cleaning", category: "Home" },
  { id: "3", title: "Sofa Cleaning", category: "Home" },
  { id: "4", title: "Bedroom Cleaning", category: "Home" },
  { id: "5", title: "Window Cleaning", category: "Home" },
  { id: "6", title: "Full Deep Cleaning", category: "Home" },
  { id: "7", title: "Small Office Cleaning", category: "Commercial" },
  { id: "8", title: "Medium Office Cleaning", category: "Commercial" },
  { id: "9", title: "Large Corporate Office Cleaning", category: "Commercial" },
  { id: "10", title: "Retail Shop/Showroom Cleaning", category: "Commercial" },
  { id: "11", title: "Warehouse/Clinic Cleaning", category: "Commercial" },
  { id: "12", title: "Car", category: "Vehicle" },
  { id: "13", title: "Motor Bike", category: "Vehicle" },
  { id: "14", title: "Heavy", category: "Vehicle" },
  { id: "15", title: "Electric", category: "Vehicle" },
  { id: "16", title: "Bicycle", category: "Vehicle" },
  { id: "17", title: "Pipe Leakage", category: "Plumbing" },
  { id: "18", title: "Tap Fixing", category: "Plumbing" },
  { id: "19", title: "Bathroom Fitting", category: "Plumbing" },
  { id: "20", title: "Water Tank Cleaning", category: "Plumbing" },
  { id: "21", title: "Interior Painting", category: "Painting" },
  { id: "22", title: "Exterior Painting", category: "Painting" },
  { id: "23", title: "Wall Texture", category: "Painting" },
  { id: "24", title: "Repainting", category: "Painting" },
  { id: "25", title: "Wiring", category: "Electrician" },
  { id: "26", title: "Fan Repair", category: "Electrician" },
  { id: "27", title: "Light Installation", category: "Electrician" },
  { id: "28", title: "Power Backup Setup", category: "Electrician" },
  { id: "29", title: "AC Installation", category: "AC Repair" },
  { id: "30", title: "AC Gas Refill", category: "AC Repair" },
  { id: "31", title: "AC General Service", category: "AC Repair" },
  { id: "32", title: "AC Uninstallation", category: "AC Repair" },
  { id: "33", title: "Home Cooking", category: "Chef" },
  { id: "34", title: "Party Catering", category: "Chef" },
  { id: "35", title: "Weekly Meal Plan", category: "Chef" },
  { id: "36", title: "Festival Cooking", category: "Chef" },
];

const BASE_PRICE = 80;
const ADDON_PRICE = 25;

// FIXED: Enhanced category detection function
const detectCategoryFromTitle = (serviceTitle: string): string | null => {
  const cleanTitle = serviceTitle.toLowerCase().replace(/ service$/i, '').trim();
  
  // First, try exact match in ALL_SERVICES
  const exactMatch = ALL_SERVICES.find(s => s.title.toLowerCase() === cleanTitle);
  if (exactMatch) return exactMatch.category;
  
  // Enhanced keyword matching with priority order
  const categoryKeywords: { [key: string]: string[] } = {
    'Plumbing': ['plumb', 'pipe', 'tap', 'leak', 'bathroom fitting', 'water tank', 'drain', 'faucet'],
    'Painting': ['paint', 'interior painting', 'exterior painting', 'texture', 'repaint', 'wall paint'],
    'Electrician': ['wiring', 'fan repair', 'light install', 'power backup', 'electrical', 'switch', 'socket'],
    'AC Repair': ['ac ', 'air condition', 'cooling', 'gas refill', 'hvac', 'ac install'],
    'Chef': ['cook', 'chef', 'catering', 'meal plan', 'festival cooking', 'food', 'party catering'],
    'Commercial': ['office', 'commercial', 'corporate', 'retail', 'shop', 'showroom', 'warehouse', 'clinic'],
    'Home': ['kitchen', 'washroom', 'sofa', 'bedroom', 'window', 'deep cleaning', 'home'],
    'Vehicle': ['car', 'bike', 'motor', 'truck', 'heavy', 'electric', 'ev', 'bicycle', 'cycle', 'vehicle', 'auto'],
  };
  
  // Check categories in order
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => cleanTitle.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};

const BookCleaningScreen: React.FC = () => {
  const route = useRoute<any>();
  const consultationCharge = route.params?.consultationCharge || 0;
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // States
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
  const [allocatedEmployee, setAllocatedEmployee] = useState<Professional | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // FIXED: Initial Data Logic - Handle both direct service selection and allocated employee services
// --- UPDATED INITIAL DATA LOGIC ---
  const incomingSelectedService = route.params?.selectedService; // From Commercial/Vehicle
  const incomingServiceArray = route.params?.selectedServices;  // From ServiceDetails (Plumbing/Painting/etc)
  const incomingAllServices = route.params?.allServices;
  // const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
  //   // 1. If we got an array of services (from ServiceDetailsScreen)
  // if (incomingAllServices && incomingAllServices.length > 0) {
  //   return incomingAllServices.map((title: string) => {
  //     // Find the full service object from ALL_SERVICES by title
  //     const match = ALL_SERVICES.find(s => s.title === title);
  //     return match || {
  //       id: 'virtual-' + Math.random(),
  //       title: title,
  //       category: detectCategoryFromTitle(title) || 'Home'
  //     };
  //   });
  // }

  //   // 2. If we got a single service title (from Commercial/Home/Vehicle)
  //   if (incomingServiceArray && incomingServiceArray.length > 0) {
  //     const match = ALL_SERVICES.find(s => 
  //       s.title.toLowerCase().includes(incomingSelectedService.toLowerCase()) ||
  //       incomingSelectedService.toLowerCase().includes(s.title.toLowerCase())
  //     );
      
  //     if (match) return [match];

  //     // Fallback virtual service
  //     const cat = detectCategoryFromTitle(incomingSelectedService);
  //     return [{
  //       id: 'virtual-' + Date.now(),
  //       title: incomingSelectedService,
  //       category: cat || 'Home'
  //     }];
  //   }
  //   return [];
  // });

  const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
  // PRIORITY 1: Check if we have allServices (from navigation back)
  if (incomingAllServices && incomingAllServices.length > 0) {
    return incomingAllServices.map((title: string) => {
      const match = ALL_SERVICES.find(s => s.title === title);
      return match || {
        id: 'virtual-' + Math.random(),
        title: title,
        category: detectCategoryFromTitle(title) || 'Home'
      };
    });
  }

  // PRIORITY 2: Check if we have selectedServices array from EmployeeAllocation
  if (route.params?.selectedServices && route.params.selectedServices.length > 0) {
    return route.params.selectedServices.map((title: string) => {
      const match = ALL_SERVICES.find(s => s.title === title);
      return match || {
        id: 'virtual-' + Math.random(),
        title: title,
        category: detectCategoryFromTitle(title) || 'Home'
      };
    });
  }

  // PRIORITY 3: Single service from Commercial/Home/Vehicle
  if (incomingSelectedService) {
    const match = ALL_SERVICES.find(s => 
      s.title.toLowerCase().includes(incomingSelectedService.toLowerCase()) ||
      incomingSelectedService.toLowerCase().includes(s.title.toLowerCase())
    );
    
    if (match) return [match];

    const cat = detectCategoryFromTitle(incomingSelectedService);
    return [{
      id: 'virtual-' + Date.now(),
      title: incomingSelectedService,
      category: cat || 'Home'
    }];
  }
  
  return [];
});

  // LOGIC
  const mainService = selectedServices[0];
  const addonServices = selectedServices.slice(1);

  // FIXED: Enhanced filter for remaining services - works for ALL categories
  const remainingServices = mainService 
    ? ALL_SERVICES.filter(
        (service) => 
          service.category === mainService.category && 
          !selectedServices.some((s) => s.id === service.id)
      )
    : [];

  const showFloorField = mainService?.category === "Home" || mainService?.category === "Commercial";
// Allow showing UI if an employee is already allocated (passed from VehicleSub)
const showAllocationUI = (mainService?.category !== "Vehicle" && !mainService?.title?.toLowerCase().includes("chef")) || !!allocatedEmployee;
  const servicePrice = (mainService ? BASE_PRICE : 0) + addonServices.length * ADDON_PRICE;
  const totalPrice = servicePrice + consultationCharge;

  useEffect(() => {
    if (route.params?.allocatedEmployee) {
      setAllocatedEmployee(route.params.allocatedEmployee);
      setShowEmployeeModal(true);
    }
  }, [route.params?.allocatedEmployee]);

  useEffect(() => {
    if (locationType === "default") getCurrentLocation();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      }
    } catch (err) { 
      return false; 
    }
  };

const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
    
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          // 1. Added 'format=jsonv2' for better data structure
          // 2. Added 'accept-language=en' to ensure English results
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=en`,
            {
              headers: {
                'User-Agent': 'ServiceBookingApp/1.0', // IMPORTANT: Nominatim requires a User-Agent or it might fail
              }
            }
          );
          
          const data = await response.json();
          
          // Construct a cleaner address instead of just using display_name (which is often too long)
          const addr = data.address;
          const road = addr.road || addr.suburb || addr.neighbourhood || "";
          const city = addr.city || addr.town || addr.village || "";
          const state = addr.state || "";
          const postcode = addr.postcode || "";

          // Join parts, filtering out empty strings
          const formattedAddress = [road, city, state, postcode]
            .filter(part => part.length > 0)
            .join(", ");

          setCurrentAddress(formattedAddress || data.display_name || "Location detected");
        } catch (e) {
          console.error("Location Fetch Error:", e);
          setCurrentAddress("Error fetching address details");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        setLoadingLocation(false);
        Alert.alert("Location Error", "Please ensure GPS is enabled and try again.");
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 // Cache location for 10 seconds
      }
    );
  };
  const addService = (serviceId: string) => {
    const serviceToAdd = remainingServices.find((s) => s.id === serviceId);
    if (serviceToAdd) {
      setSelectedServices((prev) => [...prev, serviceToAdd]);
      setSelectedAddon(null);
      setShowAddonPicker(false);
    }
  };

  const removeService = (id: string) => setSelectedServices((prev) => prev.filter((s) => s.id !== id));

  // const handleAllocationTypeChange = (value: "auto" | "manual") => {
  //   setAllocationType(value);
  //   navigation.navigate("EmployeeAllocation", { isAutoAllocation: value === "auto" });
  // };
const handleAllocationTypeChange = (value: "auto" | "manual") => {
  setAllocationType(value);
  navigation.navigate("EmployeeAllocation", { 
    isAutoAllocation: value === "auto",
    // ADD THESE LINES TO PRESERVE YOUR DATA
    selectedServices: selectedServices.map(s => s.title), // Pass as titles
    consultationCharge: consultationCharge,
    mainCategory: mainService?.category,
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
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-horiz" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Job Details</Text>

        <Text style={styles.label}>Location</Text>
        <View style={styles.dropdownBox}>
          <Picker
            selectedValue={locationType}
            onValueChange={(value) => {
              setLocationType(value);
              if (value === "default") getCurrentLocation();
              else setCurrentAddress("");
            }}
            dropdownIconColor="#9CA3AF"
            style={styles.picker}
          >
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

        {showAllocationUI && !route.params?.allocatedEmployee &&  (
          <>
            <Text style={styles.label}>Allocation Type ({allocationType === "auto" ? "Auto" : "Manual"})</Text>
            <View style={styles.dropdownBox}>
              <Picker
                selectedValue={allocationType}
                onValueChange={handleAllocationTypeChange}
                dropdownIconColor="#9CA3AF"
                style={styles.picker}
              >
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
          <TouchableOpacity style={[styles.dateInput, { flex: 1 }]} onPress={() => setShowDatePicker(true)}>
            <MaterialIcons name="calendar-today" size={20} color="#9CA3AF" />
            <Text style={styles.dateText}>{date || "Select Date"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.timeInput, { flex: 1 }]} onPress={() => setShowTimePicker(true)}>
            <MaterialIcons name="access-time" size={20} color="#9CA3AF" />
            <Text style={styles.timeText}>{time || "Select Time"}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && <DateTimePicker value={new Date()} mode="date" minimumDate={new Date()} onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d.toLocaleDateString('en-GB')); }} />}
        {showTimePicker && <DateTimePicker value={new Date()} mode="time" onChange={(e, t) => { setShowTimePicker(false); if (t) setTime(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); }} />}

        <View style={styles.extraHoursCard}>
          <View style={styles.extraHoursHeader}>
            <Text style={styles.extraHoursTitle}>Extra Hours</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => setExtraHours(Math.max(0, extraHours - 1))}>
                <Text style={styles.counterIcon}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>+{extraHours} hr</Text>
              <TouchableOpacity onPress={() => setExtraHours(extraHours + 1)}>
                <Text style={styles.counterIcon}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {extraHours > 0 && <TextInput placeholder="Reason for extra hours..." multiline style={styles.textarea} value={reason} onChangeText={setReason} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>UPLOAD PHOTOS</Text>
          <View style={styles.photoContainer}>
            <TouchableOpacity style={styles.photoBoxDashed} onPress={handleTakePhoto}><MaterialIcons name="photo-camera" size={28} color="#135BEC" /></TouchableOpacity>
            <TouchableOpacity style={styles.photoBoxDashed} onPress={handlePickFromGallery}><MaterialIcons name="photo-library" size={28} color="#135BEC" /></TouchableOpacity>
            {images.map((img, i) => (
              <View key={i} style={styles.photoPreview}>
                <Image source={{ uri: img.uri }} style={styles.photoImage} />
                <TouchableOpacity style={styles.removePhoto} onPress={() => setImages(images.filter((_, idx) => idx !== i))}>
                  <MaterialIcons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.thinDivider} />

        {/* FIXED: Add-on Services - Now enabled for ALL categories */}
        <View style={styles.addonHeader}>
          <Text style={styles.sectionTitle}>Add-on Services</Text>
          <TouchableOpacity 
            style={[styles.addBtn, remainingServices.length === 0 && styles.addBtnDisabled]} 
            onPress={() => setShowAddonPicker(true)}
            disabled={remainingServices.length === 0}
          >
            <MaterialIcons name="add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {/* DEBUG INFO - Shows category and available services */}
        {mainService && (
          <Text style={styles.categoryInfo}>
            Category: {mainService.category} • {remainingServices.length} services available
          </Text>
        )}

        {remainingServices.length === 0 && selectedServices.length > 0 && (
          <Text style={styles.noAddonsText}>All services in this category are selected</Text>
        )}

        {showAddonPicker && remainingServices.length > 0 && (
          <View style={styles.dropdownBox}>
            <Picker
              selectedValue={selectedAddon}
              onValueChange={(v) => { 
                if (v && v !== 'placeholder') { 
                  addService(v); 
                } 
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Add-on" value="placeholder" />
              {remainingServices.map(s => <Picker.Item key={s.id} label={s.title} value={s.id} />)}
            </Picker>
          </View>
        )}

        {selectedServices.map((s, i) => (
          <View key={s.id} style={styles.addonCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.addonSelectText}>
                  {i === 0 ? "MAIN: " : "ADD-ON: "}{s.title}
                </Text>
                <Text style={styles.addonCategoryText}>{s.category}</Text>
              </View>
              {i > 0 && (
                <TouchableOpacity onPress={() => removeService(s.id)}>
                  <MaterialIcons name="delete" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* <View style={styles.summary}>
          <SummaryRow label="Services" value={`$${servicePrice}`} styles={styles} />
          {consultationCharge > 0 && <SummaryRow label="Consultation" value={`$${consultationCharge}`} styles={styles} />}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${totalPrice}</Text>
          </View>
        </View> */}
        <View style={styles.summary}>
  <SummaryRow label="Services" value={`₹${servicePrice}`} styles={styles} />
  {consultationCharge > 0 && <SummaryRow label="Consultation" value={`₹${consultationCharge}`} styles={styles} />}
  <View style={styles.summaryDivider} />
  <View style={styles.summaryTotal}>
    <Text style={styles.summaryTotalLabel}>Total</Text>
    <Text style={styles.summaryTotalValue}>₹{totalPrice}</Text>
  </View>
</View>

        <View style={{ height: 100 }} />
      </ScrollView>
{/* 
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate("PaymentScreen", { totalAmount: totalPrice })}>
          <Text style={styles.ctaText}>Checkout</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.bottomBar}>
  <TouchableOpacity 
    style={styles.ctaBtn} 
    onPress={() => navigation.navigate("PaymentScreen", { 
      totalAmount: totalPrice,
      selectedServices: selectedServices.map(s => ({
        service: s.title,
        category: s.category,
        duration: "2-3 hours",
        date: date || "Not selected"
      })),
      floorArea: floorArea || "N/A",
      selectedTime: time || "10:00 AM",
      allocatedEmployee: allocatedEmployee,
      bookingDetails: {
        location: locationType === "default" ? currentAddress : locationDetails,
        customerName: customerName,
        contactNumber: contactNumber,
        extraHours: extraHours,
        reason: reason,
        date: date,
        time: time
      }
    })}
  >
    <Text style={styles.ctaText}>Checkout</Text>
  </TouchableOpacity>
</View>
    </SafeAreaView>
  );
};

const SummaryRow = ({ label, value, styles }: any) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryRowText}>{label}</Text>
    <Text style={styles.summaryRowText}>{value}</Text>
  </View>
);

const getStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border, 
    backgroundColor: colors.surface 
  },
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
  
  // FIXED: Missing Allocated Professional Styles
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
  noAddonsText: { color: colors.subText, fontSize: 13, fontStyle: 'italic', marginBottom: 12 },
  addonCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  addonSelectText: { color: colors.text, fontWeight: '600', fontSize: 15 },
  addonCategoryText: { color: colors.subText, fontSize: 12, marginTop: 2 },
  summary: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryRowText: { color: colors.subText },
  
  // FIXED: Summary Divider (CSS margin '10px 0' -> marginVertical: 10)
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 18, fontWeight: "700", color: colors.text },
  summaryTotalValue: { fontSize: 22, fontWeight: "800", color: colors.primary },
  section: { marginBottom: 20 },

  // FIXED: Bottom Bar (CSS borderTop and padding fixed)
  bottomBar: { 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: colors.border, 
    backgroundColor: colors.surface 
  },
  
  // FIXED: CTA Button (CSS padding, textAlign, cursor, border fixed)
  ctaBtn: { 
    backgroundColor: colors.primary, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    width: '100%' 
  },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: "700" },
});

export default BookCleaningScreen;