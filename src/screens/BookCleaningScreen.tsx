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
import {  PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

/* =======================
   TYPES
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

/* =======================
   CONSTANTS
   ======================= */
const ALL_SERVICES: Service[] = [
  // Home Services
  { id: "1", title: "Plumbing", category: "Home" },
  { id: "2", title: "Painting", category: "Home" },
  { id: "3", title: "Electrician", category: "Home" },

  // Apartment Cleaning
  { id: "4", title: "Floor Cleaning", category: "Apartment" },
  { id: "5", title: "Kitchen Cleaning", category: "Apartment" },
  { id: "6", title: "Washroom Cleaning", category: "Apartment" },

  // Commercial Cleaning
  { id: "7", title: "Office Cleaning", category: "Commercial" },
  { id: "8", title: "Villa Cleaning", category: "Commercial" },
  { id: "9", title: "Pool Cleaning", category: "Commercial" },

  // Vehicle Cleaning
  { id: "10", title: "Car Cleaning", category: "Vehicle" },
  { id: "11", title: "Bike Cleaning", category: "Vehicle" },
];

const TIME_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];

const BASE_PRICE = 80;
const ADDON_PRICE = 25;

/* =======================
   SCREEN
   ======================= */

const BookCleaningScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [locationType, setLocationType] = useState<"default" | "other">("default");
  const [allocationType, setAllocationType] = useState<"auto" | "manual">("auto");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [floorArea, setFloorArea] = useState("");
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
    const incoming = route.params?.selectedServices || [];

    // CASE 1: Already full objects (Home Services)
    if (incoming.length && typeof incoming[0] === "object") {
      return incoming;
    }

    // CASE 2: Titles only (Cleaning Services)
    return incoming
      .map((title: string) => ALL_SERVICES.find((s) => s.title === title))
      .filter(Boolean) as Service[];
  });

  const [showAddonPicker, setShowAddonPicker] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Employee Allocation States
  const [allocatedEmployee, setAllocatedEmployee] = useState<Professional | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const mainService = selectedServices[0];
  const addonServices = selectedServices.slice(1);
  const remainingServices = ALL_SERVICES.filter(
    (service) => !selectedServices.some((s) => s.id === service.id)
  );

  const totalPrice = (mainService ? BASE_PRICE : 0) + addonServices.length * ADDON_PRICE;

  // Check if employee was allocated from EmployeeAllocation screen
  useEffect(() => {
    if (route.params?.allocatedEmployee) {
      setAllocatedEmployee(route.params.allocatedEmployee);
      setShowEmployeeModal(true);
    }
  }, [route.params?.allocatedEmployee]);

  // Auto-fetch location on mount when default is selected
  useEffect(() => {
    if (locationType === "default") {
      getCurrentLocation();
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location to show your current address",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // iOS
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to detect your current location"
      );
      return;
    }

    setLoadingLocation(true);
    setCurrentAddress("Detecting location...");

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "BookCleaningApp/1.0",
              },
            }
          );

          const data = await response.json();
          const address = data.display_name || "Address not found";
          setCurrentAddress(address);
          console.log("Address fetched:", address);
        } catch (e) {
          console.error("Geocoding error:", e);
          setCurrentAddress("Unable to fetch address. Please try again.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoadingLocation(false);
        setCurrentAddress(`Error: ${error.message || "Unable to get location"}`);
        
        Alert.alert(
          "Location Error",
          "Unable to get your current location. Please check your GPS settings."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  const addService = (serviceId: string) => {
    const serviceToAdd = remainingServices.find((s) => s.id === serviceId);
    if (!serviceToAdd) return;

    setSelectedServices((prev) => [...prev, serviceToAdd]);
  };

  const removeService = (id: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  };

  const onDateChange = (_event: any, pickedDate?: Date) => {
    setShowDatePicker(false);

    if (pickedDate) {
      setSelectedDate(pickedDate);

      const formattedDate = pickedDate.toLocaleDateString("en-GB"); // DD/MM/YYYY
      setDate(formattedDate);
    }
  };

  const handleAllocationTypeChange = (value: "auto" | "manual") => {
    setAllocationType(value);

    if (value === "manual") {
      // 👉 Manual → open selection screen
      navigation.navigate("EmployeeAllocation", {
        isAutoAllocation: false,
      });
    } else {
      // 👉 Auto → open allocation screen with loader
      setAllocatedEmployee(null);

      navigation.navigate("EmployeeAllocation", {
        isAutoAllocation: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Cleaning</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-horiz" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* JOB DETAILS */}
        <Text style={styles.sectionTitle}>Job Details</Text>

        {/* LOCATION */}
        <Text style={styles.label}>Location</Text>
        <View style={styles.dropdownBox}>
          <Picker
            selectedValue={locationType}
            onValueChange={(value) => {
              setLocationType(value);

              if (value === "default") {
                getCurrentLocation(); // 📍 TRIGGER LOCATION
              } else {
                // Clear location when switching to "other"
                setCurrentAddress("");
              }
            }}
            dropdownIconColor="#9CA3AF"
            style={styles.picker}
          >
            <Picker.Item label="Default Location (Home)" value="default" />
            <Picker.Item label="Other Location" value="other" />
          </Picker>
        </View>

        {locationType === "default" && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Detected Location</Text>

            <View style={styles.detectedLocationBox}>
              {loadingLocation ? (
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-searching" size={20} color="#135BEC" />
                  <Text style={styles.detectedLocationText}>Detecting your location...</Text>
                </View>
              ) : currentAddress ? (
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={20} color="#135BEC" />
                  <Text style={styles.detectedLocationText}>{currentAddress}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={getCurrentLocation} style={styles.locationRow}>
                  <MaterialIcons name="my-location" size={20} color="#9CA3AF" />
                  <Text style={styles.detectedLocationPlaceholder}>Tap to detect location</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* OTHER LOCATION FIELDS */}
        {locationType === "other" && (
          <View style={styles.otherLocationFields}>
            <Text style={styles.label}>Customer Full Name</Text>
            <TextInput
              placeholder="Enter name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
            />

            <Text style={styles.label}>Location Details</Text>
            <TextInput
              placeholder="Street address, building, floor/apartment number..."
              placeholderTextColor="#9CA3AF"
              style={[styles.input, styles.textArea]}
              multiline
              value={locationDetails}
              onChangeText={setLocationDetails}
            />
          </View>
        )}

        {/* ALLOCATION TYPE */}
        {/* <Text style={styles.label}>Allocation Type</Text>
         */}
         <Text style={styles.label}>
  {allocationType === "auto"
    ? "Allocation Type (Auto)"
    : "Allocation Type (Manual)"}
</Text>

        <View style={styles.dropdownBox}>
          <Picker
            selectedValue={allocationType}
            onValueChange={(value)=>handleAllocationTypeChange(value)}
            dropdownIconColor="#9CA3AF"
            style={styles.picker}
          >
            <Picker.Item label="Auto-Allocation (Recommended)" value="auto" />
            <Picker.Item label="Manual Allocation" value="manual" />
          </Picker>
        </View>

        {/* ALLOCATED EMPLOYEE CARD */}
        {allocatedEmployee && (
          <View style={styles.allocatedCard}>
            <View style={styles.allocatedHeader}>
              <Text style={styles.allocatedTitle}>Allocated Professional</Text>
              <TouchableOpacity onPress={() => setAllocatedEmployee(null)}>
                <MaterialIcons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.allocatedContent}>
              <View style={styles.allocatedLeft}>
                <View>
                  <Image source={allocatedEmployee.image} style={styles.allocatedAvatar} />
                  {allocatedEmployee.verified && (
                    <View style={styles.verifiedBadge}>
                      <MaterialIcons name="verified" size={14} color="#facc15" />
                    </View>
                  )}
                </View>

                <View>
                  <Text style={styles.allocatedName}>{allocatedEmployee.name}</Text>
                  <Text style={styles.allocatedRole}>{allocatedEmployee.role}</Text>

                  <View style={styles.allocatedMeta}>
                    <MaterialIcons name="star" size={14} color="#facc15" />
                    <Text style={styles.metaText}>{allocatedEmployee.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* FLOOR AREA & DATE */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Floor Area (Sqft)</Text>
            <View style={styles.inputWithSuffix}>
              <TextInput
                placeholder="e.g. 1200"
                placeholderTextColor="#9CA3AF"
                style={styles.inputFlex}
                keyboardType="numeric"
                value={floorArea}
                onChangeText={setFloorArea}
              />
              <Text style={styles.suffixText}>sqft</Text>
            </View>
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                style={styles.inputFlex}
                value={date}
                editable={false}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <MaterialIcons name="calendar-today" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="calendar"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* DIVIDER */}
        <View style={styles.sectionDivider} />

        {/* START TIME */}
        <View style={styles.timeHeader}>
          <Text style={styles.sectionTitle}>Select Start Time</Text>
          <Text style={styles.subText}>1 Hour Duration</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeScroll}
        >
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeChip,
                selectedTime === time && styles.timeChipActive,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextActive,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* DIVIDER */}
        <View style={styles.thinDivider} />

        {/* ADDONS */}
        <View style={styles.addonHeader}>
          <Text style={styles.sectionTitle}>Addons</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddonPicker(true)}
            disabled={remainingServices.length === 0}
          >
            <MaterialIcons name="add" size={18} color="#2563EB" />
            <Text style={styles.addBtnText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {showAddonPicker && remainingServices.length > 0 && (
          <View style={styles.dropdownBox}>
            <Picker
              selectedValue={selectedAddon}
              onValueChange={(value) => {
                if (value) {
                  addService(value);
                  setSelectedAddon(null);
                  setShowAddonPicker(false);
                }
              }}
              dropdownIconColor="#9CA3AF"
              style={styles.picker}
            >
              <Picker.Item label="Select a service" value={null} />
              {remainingServices.map((service) => (
                <Picker.Item key={service.id} label={service.title} value={service.id} />
              ))}
            </Picker>
          </View>
        )}

        {mainService && (
          <>
            <Text style={styles.addonTitle}>MAIN SERVICE</Text>

            <View style={styles.addonCard}>
              <View style={styles.addonAccent} />
              <View style={styles.addonContent}>
                <Text style={styles.addonSelectText}>{mainService.title}</Text>
              </View>
            </View>
          </>
        )}
        {addonServices.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Add-on Services</Text>

            {addonServices.map((addon, index) => (
              <View key={addon.id} style={styles.addonCard}>
                <View style={styles.addonAccent} />
                <View style={styles.addonContent}>
                  <View style={styles.addonCardHeader}>
                    <Text style={styles.addonTitle}>ADD-ON SERVICE #{index + 1}</Text>

                    <TouchableOpacity onPress={() => removeService(addon.id)}>
                      <MaterialIcons name="delete" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.addonSelectText}>{addon.title}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* COST SUMMARY */}
        <View style={styles.summary}>
          <SummaryRow
            label={`Add-ons (${addonServices.length})`}
            value={`$${(addonServices.length * ADDON_PRICE).toFixed(2)}`}
          />
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Estimated Cost</Text>
            <Text style={styles.summaryTotalValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* BOTTOM SPACING */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* BOTTOM CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("PaymentScreen")}
        >
          <MaterialIcons name="shopping-bag" size={22} color="#fff" />
          <Text style={styles.ctaText}>Add to Cart and Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* EMPLOYEE ALLOCATED MODAL */}
      <Modal
        visible={showEmployeeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmployeeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalAvatarContainer}>
              <Image
                source={allocatedEmployee?.image}
                style={styles.modalAvatar}
              />
              {allocatedEmployee?.verified && (
                <View style={styles.modalVerifiedBadge}>
                  <MaterialIcons name="verified" size={18} color="#facc15" />
                </View>
              )}
            </View>

            <Text style={styles.modalName}>{allocatedEmployee?.name}</Text>
            <Text style={styles.modalSubtitle}>Professional Selected</Text>

            <View style={styles.modalInfoGrid}>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Ratings</Text>
                <View style={styles.modalRatingRow}>
                  <MaterialIcons name="star" size={18} color="#facc15" />
                  <Text style={styles.modalInfoValue}>{allocatedEmployee?.rating}</Text>
                </View>
              </View>

              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Service</Text>
                <Text style={styles.modalInfoValue}>{allocatedEmployee?.role}</Text>
              </View>

              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Mobile Number</Text>
                <Text style={styles.modalInfoValue}>{allocatedEmployee?.mobileNumber}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowEmployeeModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* =======================
   SMALL COMPONENTS
   ======================= */

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryRowText}>{label}</Text>
    <Text style={styles.summaryRowText}>{value}</Text>
  </View>
);

export default BookCleaningScreen;

/* =======================
   STYLES
   ======================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#101622",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  content: {
    padding: 16,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  label: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#1C1F27",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B4354",
    paddingHorizontal: 16,
    height: 56,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    justifyContent: "center",
  },

  textArea: {
    height: 100,
    paddingTop: 16,
    textAlignVertical: "top",
  },

  selectBox: {
    backgroundColor: "#1C1F27",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B4354",
    height: 56,
    justifyContent: "center",
    marginBottom: 16,
  },

  selectText: {
    color: "#fff",
    fontSize: 16,
  },

  otherLocationFields: {
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  halfInput: {
    flex: 1,
  },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1F27",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B4354",
    paddingHorizontal: 16,
    height: 56,
  },

  inputWithSuffix: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1F27",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B4354",
    paddingHorizontal: 16,
    height: 56,
  },

  inputFlex: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },

  suffixText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },

  sectionDivider: {
    height: 24,
  },

  timeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },

  subText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "500",
  },

  timeScroll: {
    marginBottom: 8,
  },

  timeChip: {
    backgroundColor: "#282E39",
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  timeChipActive: {
    backgroundColor: "#135BEC",
    shadowColor: "#135BEC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  timeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  timeTextActive: {
    fontWeight: "700",
  },

  thinDivider: {
    height: 4,
    backgroundColor: "#1C1F27",
    borderRadius: 2,
    marginVertical: 24,
  },

  addonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  addBtnText: {
    color: "#135BEC",
    fontWeight: "700",
    fontSize: 14,
  },

  addonCard: {
    backgroundColor: "#1C1F27",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B4354",
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
  },

  addonAccent: {
    width: 4,
    backgroundColor: "#135BEC",
  },

  addonContent: {
    flex: 1,
    padding: 16,
  },

  addonCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  addonTitle: {
    color: "#135BEC",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  addonLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },

  addonSelectBox: {
    backgroundColor: "#101622",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3B4354",
    paddingHorizontal: 16,
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addonSelectText: {
    color: "#fff",
    fontSize: 15,
  },

  summary: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    marginTop: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryRowText: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 12,
  },

  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryTotalLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  summaryTotalValue: {
    color: "#135BEC",
    fontSize: 24,
    fontWeight: "700",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#101622",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },

  ctaBtn: {
    height: 56,
    backgroundColor: "#135BEC",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#135BEC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  dropdownBox: {
    backgroundColor: "#1C1F27",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B4354",
    height: 56,
    justifyContent: "center",
    marginBottom: 16,
  },

  picker: {
    color: "#fff",
    height: 56,
  },

  allocatedCard: {
    backgroundColor: "#1C1F27",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#135BEC",
    padding: 16,
    marginBottom: 16,
  },

  allocatedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  allocatedTitle: {
    color: "#135BEC",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  allocatedContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  allocatedLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  allocatedAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#1C1F27",
    borderRadius: 10,
    padding: 2,
  },

  allocatedName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  allocatedRole: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 2,
  },

  allocatedMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  metaText: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: "#1F2937",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },

  modalAvatarContainer: {
    marginBottom: 16,
  },

  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  modalVerifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 4,
  },

  modalName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  modalSubtitle: {
    color: "#135BEC",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 24,
  },

  modalInfoGrid: {
    width: "100%",
    backgroundColor: "#101622",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3B4354",
  },

  modalInfoLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  modalInfoValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  modalRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  modalButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#135BEC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  detectedLocationBox: {
  backgroundColor: "#1C1F27",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#3B4354",
  paddingHorizontal: 16,
  paddingVertical: 14,
  marginBottom: 16,
},

locationRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

detectedLocationText: {
  color: "#FFFFFF",
  fontSize: 14,
  flexShrink: 1,
},

detectedLocationPlaceholder: {
  color: "#9CA3AF",
  fontSize: 14,
},

});