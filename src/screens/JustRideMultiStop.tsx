import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useEffect } from "react";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Platform } from "react-native";



interface Destination {
  id: number;
  name: string;
  address: string;
  icon: string;
  iconColor: string;
}


const { width } = Dimensions.get('window');
const MAX_STOPS = 5;

const JustrideMultiStop = () => {
  const [stops, setStops] = useState(['']);
const [currentLocation, setCurrentLocation] = useState("Fetching location...");

  
  const recentDestinations = [
    {
      id: 1,
      name: 'Grand Central Terminal',
      address: '89 E 42nd St, New York',
      icon: 'history',
      iconColor: '#9CA3AF'
    },
    {
      id: 2,
      name: 'Home',
      address: '123 Sunset Boulevard, LA',
      icon: 'home',
      iconColor: '#135bec'
    },
    {
      id: 3,
      name: 'Tech Park Office',
      address: 'Industrial Area Phase II',
      icon: 'work',
      iconColor: '#9CA3AF'
    }
  ];

  const services = [
    { id: 1, name: 'Parcel', icon: 'inventory-2' },
    { id: 2, name: 'Metro', icon: 'subway' },
    { id: 3, name: 'Scooty', icon: 'two-wheeler' },
    { id: 4, name: 'All', icon: 'apps' }
  ];

  const addStop = () => {
    if (stops.length < MAX_STOPS) {
      setStops([...stops, '']);
    }
  };

  const removeStop = (index: number) => {

    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops.length === 0 ? [''] : newStops);
  };

const updateStop = (index: number, value: string) => {

    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const selectDestination = (destination: Destination) => {

    if (stops[0] === '') {
      updateStop(0, destination.name);
    } else {
      addStop();
      updateStop(stops.length, destination.name);
    }
  };

  type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "JustRideMultiStop"
>;

const navigation = useNavigation<NavigationProp>();
useEffect(() => {
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setCurrentLocation("Location permission denied");
        return;
      }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Convert lat/lng → readable address
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then(res => res.json())
          .then(data => {
            const area =
              data.address.suburb ||
              data.address.city ||
              data.address.town ||
              "Current Location";

            setCurrentLocation(area);
          })
          .catch(() => {
            setCurrentLocation("Current Location");
          });
      },
      (error) => {
        setCurrentLocation("Unable to fetch location");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  requestLocationPermission();
}, []);


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
    

      {/* Header */}
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>Justride</Text>
        <View style={styles.menuButton} />
      </View>

      {/* Map Background */}
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiqr11bD-yGjQvXOqwJCt8QHLjwSaY5-Ibgn9JQgjxtYV4k_VVJGKzvtSVzemOfZUmml5T9rfslnZuNPJUFbKlsU2wDB8uFt78OUea8z7PaMiPrfm49yt9-dfU_3N_2Myn20EQEO-1nR99XT0z3oD7TmRMbRB5LeJmwGUNHz-k_NkRNfFle1T0oP9tph20Vjzl6S31bH4zGhbHcxAVmaXE6T6WUm3sI33INRgqXsnge2XM866YguWfN9U6L3d10hDC8YG6Wy0scF4' }}
        style={styles.mapBackground}
        imageStyle={{ opacity: 0.4 }}
      >
        <View style={styles.mapOverlay} />
        
        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Input Card */}
          <View style={styles.inputCard}>
            {/* Current Location */}
            <View style={styles.currentLocationSection}>
              <Text style={styles.sectionLabel}>CURRENT LOCATION</Text>
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="near-me" size={20} color="#135bec" />
                </View>
                <Text style={styles.locationText}>{currentLocation}</Text>
              </View>
            </View>

            {/* Stops Section */}
            <View style={styles.stopsSection}>
              <View style={styles.verticalLine} />
              
              {stops.map((stop, index) => (
                <View key={index} style={styles.stopWrapper}>
                  <View style={styles.stopInputRow}>
                    <View style={[styles.stopInputContainer, index === 0 && styles.activeInput]}>
                      <View style={styles.iconContainer}>
                        <MaterialIcons name="location-on" size={20} color="#135bec" />
                      </View>
                      <TextInput
                        style={styles.stopInput}
                        placeholder="Where to?"
                        placeholderTextColor="#9CA3AF"
                        value={stop}
                        onChangeText={(text) => updateStop(index, text)}
                        autoFocus={index === 0}
                      />
                      <TouchableOpacity style={styles.micIcon}>
                        <MaterialIcons name="mic" size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                    
                    {index === 0 ? (
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={addStop}
                        disabled={stops.length >= MAX_STOPS}
                      >
                        <MaterialIcons name="add" size={24} color="#135bec" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeStop(index)}
                      >
                        <MaterialIcons name="close" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              {/* Add Stop Placeholder */}
              {stops.length < MAX_STOPS && (
                <View style={styles.addStopPlaceholder}>
                  <View style={styles.dashedBorder}>
                    <View style={styles.iconContainer}>
                      <MaterialIcons name="radio-button-checked" size={18} color="#9CA3AF" />
                    </View>
                    <Text style={styles.placeholderText}>
                      Add up to {MAX_STOPS} stops...
                    </Text>
                  </View>
                  <View style={{ width: 48 }} />
                </View>
              )}
            </View>
          </View>

          {/* Services */}
        <View style={styles.servicesSection}>
  {services.map((service) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceItem}
      onPress={() => {
        if (service.name === "All") {
          navigation.navigate("JustrideApp");
        }
      }}
    >
      <View style={styles.serviceIcon}>
        <MaterialIcons name={service.icon} size={28} color="#135bec" />
      </View>
      <Text style={styles.serviceName}>{service.name}</Text>
    </TouchableOpacity>
  ))}
</View>


          {/* Recent Destinations */}
          <View style={styles.recentSection}>
            <View style={styles.dragHandle} />
            
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Destinations</Text>
              <Text style={styles.seeAll}>See all</Text>
            </View>

            <View style={styles.destinationsList}>
              {recentDestinations.map((dest) => (
                <TouchableOpacity 
                  key={dest.id} 
                  style={styles.destinationItem}
                  onPress={() => selectDestination(dest)}
                >
                  <View style={[styles.destIcon, dest.icon === 'home' && styles.destIconPrimary]}>
                    <MaterialIcons 
                      name={dest.icon} 
                      size={24} 
                      color={dest.iconColor} 
                    />
                  </View>
                  <View style={styles.destInfo}>
                    <Text style={styles.destName}>{dest.name}</Text>
                    <Text style={styles.destAddress}>{dest.address}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Multi-Stop</Text>
              <MaterialIcons name="map" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Bottom Indicator */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
  },
  statusBar: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  time: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginHorizontal: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1c1f27',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.27,
  },
  mapBackground: {
    flex: 1,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 22, 34, 0.6)',
  },
  scrollContent: {
    flex: 1,
  },
  inputCard: {
    backgroundColor: '#1c222d',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  currentLocationSection: {
    marginBottom: 8,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282e39',
    borderRadius: 8,
    height: 48,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  stopsSection: {
    position: 'relative',
    marginTop: 8,
  },
  verticalLine: {
    position: 'absolute',
    left: 21,
    top: 0,
    bottom: 24,
    width: 2,
    backgroundColor: '#4B5563',
  },
  stopWrapper: {
    marginBottom: 12,
    zIndex: 10,
  },
  stopInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282e39',
    borderRadius: 8,
    height: 56,
  },
  activeInput: {
    borderWidth: 2,
    borderColor: 'rgba(19, 91, 236, 0.5)',
  },
  stopInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  micIcon: {
    paddingHorizontal: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 91, 236, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addStopPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
    zIndex: 10,
  },
  dashedBorder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232832',
    borderRadius: 8,
    height: 48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4B5563',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
  servicesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  serviceItem: {
    alignItems: 'center',
    gap: 8,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1c1f27',
    borderWidth: 1,
    borderColor: '#3b4354',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  recentSection: {
    backgroundColor: '#1c1f27',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#4B5563',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.27,
  },
  seeAll: {
    color: '#135bec',
    fontSize: 14,
    fontWeight: '700',
  },
  destinationsList: {
    gap: 4,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3142',
  },
  destIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a3142',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destIconPrimary: {
    backgroundColor: 'transparent',
  },
  destInfo: {
    flex: 1,
  },
  destName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  destAddress: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: '#135bec',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  bottomBar: {
    height: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  bottomIndicator: {
    width: 128,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
});

export default JustrideMultiStop;