import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Geolocation from "react-native-geolocation-service";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface ServiceProvider {
  id: string;
  name: string;
  type: 'Mechanic' | 'Service Center';
  rating: number;
  reviews: number;
  distance: string;
  isOpen: boolean;
  specialty: string[];
  image: string;
  isEmergency: boolean;
  vehicleTypes: string[];
  mobileNumber: string;
}

const VehicleSub = () => {
  const navigation = useNavigation<any>();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('car');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Location States
  const [currentAddress, setCurrentAddress] = useState("Detecting location...");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const vehicleTypes = [
    { id: 'car', name: 'Car', icon: 'directions-car' },
    { id: 'bike', name: 'Motorbike', icon: 'two-wheeler' },
    { id: 'truck', name: 'Heavy', icon: 'local-shipping' },
    { id: 'ev', name: 'Electric', icon: 'ev-station' },
    { id: 'cycle', name: 'Bicycle', icon: 'pedal-bike' },
  ];

  const providers: ServiceProvider[] = [
    {
      id: '1',
      name: 'Apex Auto Garage',
      type: 'Service Center',
      rating: 4.8,
      reviews: 124,
      distance: '1.2 km',
      isOpen: true,
      specialty: ['Engine', 'Transmission', 'AC'],
      image: 'https://images.unsplash.com/photo-1486006396123-c775170aa562?q=80&w=400',
      isEmergency: true,
      vehicleTypes: ['car', 'ev'],
      mobileNumber: '+1 234 567 890',
    },
    {
      id: '2',
      name: 'QuickFix Moto Hub',
      type: 'Mechanic',
      rating: 4.5,
      reviews: 89,
      distance: '0.8 km',
      isOpen: true,
      specialty: ['Tires', 'Brakes', 'Chain'],
      image: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=400',
      isEmergency: false,
      vehicleTypes: ['bike', 'cycle'],
      mobileNumber: '+1 987 654 321',
    },
    {
      id: '3',
      name: 'Elite EV Care',
      type: 'Service Center',
      rating: 4.9,
      reviews: 56,
      distance: '3.5 km',
      isOpen: false,
      specialty: ['Battery', 'Software', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=400',
      isEmergency: false,
      vehicleTypes: ['car', 'ev'],
      mobileNumber: '+1 555 444 333',
    },
    {
      id: '4',
      name: 'Truck & Heavy Masters',
      type: 'Service Center',
      rating: 4.2,
      reviews: 210,
      distance: '5.2 km',
      isOpen: true,
      specialty: ['Hydraulics', 'Suspension'],
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=400',
      isEmergency: true,
      vehicleTypes: ['truck'],
      mobileNumber: '+1 111 222 333',
    },
    {
      id: '5',
      name: 'Precision Cycle Lab',
      type: 'Mechanic',
      rating: 4.7,
      reviews: 42,
      distance: '2.1 km',
      isOpen: true,
      specialty: ['Gears', 'Frames', 'Custom'],
      image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=400',
      isEmergency: false,
      vehicleTypes: ['cycle'],
      mobileNumber: '+1 888 777 666',
    },
    {
      id: '6',
      name: 'Midnight Mechanics',
      type: 'Mechanic',
      rating: 4.4,
      reviews: 156,
      distance: '4.0 km',
      isOpen: true,
      specialty: ['Breakdown', 'Fuel', 'Jumpstart'],
      image: 'https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?q=80&w=400',
      isEmergency: true,
      vehicleTypes: ['car', 'bike', 'truck'],
      mobileNumber: '+1 000 999 888',
    },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setCurrentAddress("Permission Denied");
      return;
    }

    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`,
            { headers: { "User-Agent": "VehicleApp/1.0" } }
          );
          const data = await response.json();
          const address = data.address.road || data.address.suburb || data.display_name.split(',')[0];
          const city = data.address.city || data.address.town || "";
          setCurrentAddress(`${address}, ${city}`);
        } catch (e) {
          setCurrentAddress("Location Found (Address Error)");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        setCurrentAddress("Location Unavailable");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const filteredProviders = useMemo(() => {
    return providers.filter(p => 
      p.vehicleTypes.includes(selectedVehicle) && 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedVehicle, searchQuery]);

  const handleProviderSelect = (item: ServiceProvider) => {
    navigation.navigate("BookCleaning", {
      selectedService: `${item.name} Service`,
      allocatedEmployee: {
        id: item.id,
        name: item.name,
        role: item.type,
        rating: item.rating.toString(),
        distance: item.distance,
        image: item.image,
        verified: true,
        mobileNumber: item.mobileNumber,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1419" />
      
      {/* Dynamic Header */}
      <View style={styles.header}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>MY CURRENT LOCATION</Text>
            <TouchableOpacity onPress={getCurrentLocation} style={styles.locationRow}>
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#135BEC" />
              ) : (
                <>
                  <Text style={styles.locationText} numberOfLines={1}>{currentAddress}</Text>
                  <MaterialIcons name="my-location" size={16} color="#135BEC" />
                </>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="notifications-none" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color="#64748b" />
          <TextInput
            placeholder={`Search ${selectedVehicle} experts...`}
            placeholderTextColor="#64748b"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Vehicle Selection */}
        <View style={styles.vehicleSection}>
          <Text style={styles.sectionTitle}>Repair Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleScroll}>
            {vehicleTypes.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[styles.vehicleCard, selectedVehicle === v.id && styles.vehicleCardActive]}
                onPress={() => setSelectedVehicle(v.id)}
              >
                <View style={[styles.vIconBox, selectedVehicle === v.id && styles.vIconBoxActive]}>
                  <MaterialIcons name={v.icon} size={28} color={selectedVehicle === v.id ? '#fff' : '#64748b'} />
                </View>
                <Text style={[styles.vText, selectedVehicle === v.id && styles.vTextActive]}>{v.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Professionals List */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Experts Near You</Text>

          {filteredProviders.map((item) => (
            <TouchableOpacity key={item.id} style={styles.providerCard} activeOpacity={0.9} onPress={() => handleProviderSelect(item)}>
              <Image source={{ uri: item.image }} style={styles.providerImage} />
              {item.isEmergency && (
                <View style={styles.emergencyBadge}>
                  <MaterialIcons name="bolt" size={14} color="#fff" />
                  <Text style={styles.emergencyText}>FAST REPAIR</Text>
                </View>
              )}
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.providerName}>{item.name}</Text>
                    <Text style={styles.providerType}>{item.type} • {item.distance}</Text>
                  </View>
                  <View style={styles.ratingBox}>
                    <MaterialIcons name="star" size={14} color="#fbbf24" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <View style={styles.specialtyContainer}>
                  {item.specialty.map((s, idx) => (
                    <View key={idx} style={styles.specialtyChip}><Text style={styles.specialtyChipText}>{s}</Text></View>
                  ))}
                </View>
                <View style={styles.cardFooter}>
                   <View style={styles.statusRow}>
                      <View style={[styles.statusDot, { backgroundColor: item.isOpen ? '#22c55e' : '#ef4444' }]} />
                      <Text style={styles.statusText}>{item.isOpen ? 'Available' : 'Closed'}</Text>
                   </View>
                   <TouchableOpacity style={styles.bookBtn} onPress={() => handleProviderSelect(item)}>
                      <Text style={styles.bookBtnText}>Book Now</Text>
                      <MaterialIcons name="chevron-right" size={18} color="#fff" />
                   </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredProviders.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={60} color="#1e293a" />
              <Text style={styles.emptyText}>No {selectedVehicle} specialists match your search.</Text>
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1419' },
  header: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#0a1419', borderBottomWidth: 1, borderBottomColor: '#1e293a' },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  iconBtn: { width: 40, height: 40, backgroundColor: '#1a2630', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  locationContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  locationLabel: { fontSize: 9, color: '#64748b', fontWeight: '800', letterSpacing: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  locationText: { color: '#fff', fontSize: 13, fontWeight: '600', maxWidth: 160 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a2630', borderRadius: 12, paddingHorizontal: 12, height: 48 },
  searchInput: { flex: 1, color: '#fff', fontSize: 14, marginLeft: 8 },
  vehicleSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginLeft: 16, marginBottom: 16 },
  vehicleScroll: { paddingHorizontal: 16, gap: 16 },
  vehicleCard: { alignItems: 'center', gap: 8, marginRight: 12 },
  vehicleCardActive: { transform: [{ scale: 1.05 }] },
  vIconBox: { width: 62, height: 62, borderRadius: 18, backgroundColor: '#1a2630', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1e293a' },
  vIconBoxActive: { backgroundColor: '#135BEC', borderColor: '#3b82f6' },
  vText: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  vTextActive: { color: '#fff' },
  resultsSection: { marginTop: 24, paddingHorizontal: 16 },
  providerCard: { backgroundColor: '#1a2630', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293a' },
  providerImage: { width: '100%', height: 110 },
  emergencyBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#ef4444', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  emergencyText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  cardInfo: { padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  providerName: { fontSize: 17, fontWeight: '700', color: '#fff' },
  providerType: { fontSize: 12, color: '#64748b', marginTop: 2 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a1419', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 3, alignSelf: 'flex-start' },
  ratingText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  specialtyContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  specialtyChip: { backgroundColor: '#111b21', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, borderWidth: 1, borderColor: '#1e293a' },
  specialtyChipText: { color: '#94a3b8', fontSize: 10, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1e293a' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, color: '#64748b' },
  bookBtn: { backgroundColor: '#135BEC', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, gap: 4 },
  bookBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#64748b', marginTop: 12, textAlign: 'center', fontSize: 14 }
});

export default VehicleSub;