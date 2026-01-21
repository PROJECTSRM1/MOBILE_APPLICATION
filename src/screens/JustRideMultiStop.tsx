import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TextInput,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Menu,
  MapPin,
  Package,
  Train,
  Bike,
  Car,
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Home as HomeIcon,
  Navigation,
  Phone,
  MessageCircle,
  X,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

/* =============================================================================
   TYPES & ENUMS
   ============================================================================= */
enum ServiceType {
  PARCEL = 'Parcel',
  METRO = 'Metro',
  RIDE = 'Ride',
  ALL = 'All',
}

interface Service {
  id: string;
  name: ServiceType;
  description: string;
}

interface Destination {
  id: string;
  name: string;
  address: string;
  iconType: 'work' | 'home' | 'other';
}

interface BookedRide {
  rideName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  driverName: string;
  vehicleNumber: string;
  eta: string;
}

/* =============================================================================
   CONSTANTS & MOCK DATA
   ============================================================================= */

const SERVICES: Service[] = [
  { id: '1', name: ServiceType.PARCEL, description: 'Fast delivery' },
  { id: '2', name: ServiceType.METRO, description: 'Quick transit' },
  { id: '3', name: ServiceType.RIDE, description: 'Full comfort' },
  { id: '4', name: ServiceType.ALL, description: 'All services' },
];

const RECENT_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Office',
    address: 'MG Road, Bengaluru',
    iconType: 'work',
  },
  {
    id: '2',
    name: 'Home',
    address: 'BTM Layout, HSR Sector 2',
    iconType: 'home',
  },
];

const MAP_IMAGE_URL = 'https://picsum.photos/seed/map/1200/1200';

const DRIVER_NAMES = ['Rajesh Kumar', 'Amit Sharma', 'Prakash Reddy', 'Vijay Singh', 'Suresh Patel'];
const VEHICLE_PREFIXES = ['KA01', 'KA02', 'KA03', 'KA05'];

/* =============================================================================
   MAIN COMPONENT
   ============================================================================= */

const JustRideMultiStop: React.FC = () => {
  const navigation = useNavigation<any>();
  const [viewState, setViewState] = useState<'initial' | 'selecting_ride' | 'tracking'>('initial');
  const [pickup, setPickup] = useState<string>('');
  const [dropoff, setDropoff] = useState<string>('');
  const [showFares, setShowFares] = useState<boolean>(false);
  const [bookedRide, setBookedRide] = useState<BookedRide | null>(null);
  const [rideStatus, setRideStatus] = useState<string>('Finding driver...');
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [showCancelledPopup, setShowCancelledPopup] = useState<boolean>(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const modalSlideAnim = React.useRef(new Animated.Value(300)).current;
  const popupScaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (viewState === 'tracking') {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate ride status updates
      const timer1 = setTimeout(() => {
        setRideStatus('Driver found! On the way...');
      }, 2000);

      const timer2 = setTimeout(() => {
        setRideStatus('Driver arriving in 2 mins');
      }, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [viewState]);

  useEffect(() => {
    if (showCancelModal) {
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();
    } else {
      Animated.timing(modalSlideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showCancelModal]);

  useEffect(() => {
    if (showCancelledPopup) {
      Animated.spring(popupScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(popupScaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowCancelledPopup(false);
          setViewState('initial');
          setPickup('');
          setDropoff('');
          setShowFares(false);
          setBookedRide(null);
          setRideStatus('Finding driver...');
          setSelectedReason('');
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCancelledPopup]);

  const handleAction = (serviceName: ServiceType) => {
    if (serviceName === ServiceType.PARCEL) {
      navigation.navigate('ParcelView');
    } else if (serviceName === ServiceType.METRO) {
      navigation.navigate('MetroView');
    } else if (serviceName === ServiceType.ALL) {
      navigation.navigate('JustrideApp');
    } else if (serviceName === ServiceType.RIDE) {
      setViewState('selecting_ride');
    }
  };

  const closeSheet = () => {
    setViewState('initial');
    setPickup('');
    setDropoff('');
    setShowFares(false);
    setBookedRide(null);
  };

  const handleSearchRides = () => {
    if (pickup.trim() && dropoff.trim()) {
      setShowFares(true);
    }
  };

  const calculateFare = (basePrice: number) => {
    const distance = Math.random() * 15 + 5;
    return Math.round(basePrice * distance);
  };

  const generateVehicleNumber = () => {
    const prefix = VEHICLE_PREFIXES[Math.floor(Math.random() * VEHICLE_PREFIXES.length)];
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix} MN ${number}`;
  };

  const handleBookRide = (rideName: string, basePrice: number) => {
    const fare = calculateFare(basePrice);
    const driverName = DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)];
    const vehicleNumber = generateVehicleNumber();
    const eta = `${Math.floor(Math.random() * 8) + 2} min`;

    setBookedRide({
      rideName,
      pickup,
      dropoff,
      fare,
      driverName,
      vehicleNumber,
      eta,
    });
    setViewState('tracking');
  };

  const cancelRide = () => {
    if (!selectedReason) {
      return;
    }
    setShowCancelModal(false);
    setTimeout(() => {
      setShowCancelledPopup(true);
    }, 300);
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
    setSelectedReason('');
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedReason('');
  };

  const selectReason = (reason: string) => {
    setSelectedReason(reason);
  };

  const getServiceIcon = (name: ServiceType) => {
    switch (name) {
      case ServiceType.PARCEL:
        return <Package size={26} color="#6366f1" />;
      case ServiceType.METRO:
        return <Train size={26} color="#6366f1" />;
      case ServiceType.RIDE:
        return <Car size={26} color="#6366f1" />;
      case ServiceType.ALL:
        return <Menu size={26} color="#6366f1" />;
    }
  };

  const getRideIcon = (name: string) => {
    switch (name) {
      case 'Scooty':
        return <Bike size={28} color="#6366f1" />;
      case 'Bike':
        return <Bike size={28} color="#6366f1" />;
      case 'Car':
        return <Car size={28} color="#6366f1" />;
      case 'XL Car':
        return <Navigation size={28} color="#6366f1" />;
      default:
        return <Car size={28} color="#6366f1" />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Just Ride</Text>
      </View>

      {/* Background Map */}
      <ImageBackground
        source={{ uri: MAP_IMAGE_URL }}
        style={styles.mapBg}
        blurRadius={20}
      >
        <View style={styles.mapOverlay} />
      </ImageBackground>

      {/* Main Content - Initial View */}
      {viewState === 'initial' && (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              Where to,{'\n'}
              <Text style={styles.greetingName}>Felix?</Text>
            </Text>
          </View>

          {/* Service Grid */}
          <View style={styles.serviceGrid}>
            {SERVICES.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.serviceCard}
                activeOpacity={0.8}
                onPress={() => handleAction(s.name)}
              >
                <View style={styles.serviceIconBox}>
                  {getServiceIcon(s.name)}
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceDesc}>{s.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Activity */}
          <View style={styles.recentsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
              <ChevronRight size={18} color="#475569" />
            </View>

            {RECENT_DESTINATIONS.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={styles.recentItem}
                activeOpacity={0.6}
              >
                <View style={styles.recentIcon}>
                  {dest.iconType === 'work' ? (
                    <Briefcase size={20} color="#94a3b8" />
                  ) : (
                    <HomeIcon size={20} color="#94a3b8" />
                  )}
                </View>
                <View style={styles.recentDetails}>
                  <Text style={styles.recentName}>{dest.name}</Text>
                  <Text style={styles.recentAddress}>{dest.address}</Text>
                </View>
                <Navigation size={16} color="#6366f1" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Ride Booking View */}
      {viewState === 'selecting_ride' && (
        <View style={styles.rideInputContainer}>
          <View style={styles.inputHeader}>
            <TouchableOpacity onPress={closeSheet} style={styles.backButton}>
              <ArrowLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
            <Text style={styles.inputTitle}>Book a Ride</Text>
          </View>

          <View style={styles.inputFields}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#10b981" />
              <TextInput
                style={styles.textInput}
                placeholder="Pickup Location"
                placeholderTextColor="#64748b"
                value={pickup}
                onChangeText={setPickup}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#ef4444" />
              <TextInput
                style={styles.textInput}
                placeholder="Drop-off Location"
                placeholderTextColor="#64748b"
                value={dropoff}
                onChangeText={setDropoff}
              />
            </View>

            <TouchableOpacity
              style={[styles.searchButton, (!pickup.trim() || !dropoff.trim()) && styles.searchButtonDisabled]}
              onPress={handleSearchRides}
              disabled={!pickup.trim() || !dropoff.trim()}
            >
              <Text style={styles.searchButtonText}>Search Rides</Text>
            </TouchableOpacity>
          </View>

          {showFares && (
            <ScrollView style={styles.faresList} showsVerticalScrollIndicator={false}>
              <Text style={styles.faresTitle}>Available Rides</Text>
              
              <TouchableOpacity 
                style={styles.fareCard} 
                activeOpacity={0.7}
                onPress={() => handleBookRide('Scooty', 8)}
              >
                <View style={styles.fareHeader}>
                  <Bike size={28} color="#6366f1" />
                  <View style={styles.fareInfo}>
                    <Text style={styles.fareName}>Scooty</Text>
                    <Text style={styles.fareDesc}>Quick & Economical</Text>
                  </View>
                </View>
                <Text style={styles.farePrice}>₹{calculateFare(8)}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.fareCard} 
                activeOpacity={0.7}
                onPress={() => handleBookRide('Bike', 10)}
              >
                <View style={styles.fareHeader}>
                  <Bike size={28} color="#6366f1" />
                  <View style={styles.fareInfo}>
                    <Text style={styles.fareName}>Bike</Text>
                    <Text style={styles.fareDesc}>Swift City Commute</Text>
                  </View>
                </View>
                <Text style={styles.farePrice}>₹{calculateFare(10)}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.fareCard} 
                activeOpacity={0.7}
                onPress={() => handleBookRide('Car', 15)}
              >
                <View style={styles.fareHeader}>
                  <Car size={28} color="#6366f1" />
                  <View style={styles.fareInfo}>
                    <Text style={styles.fareName}>Car</Text>
                    <Text style={styles.fareDesc}>Comfortable Sedan</Text>
                  </View>
                </View>
                <Text style={styles.farePrice}>₹{calculateFare(15)}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.fareCard} 
                activeOpacity={0.7}
                onPress={() => handleBookRide('XL Car', 22)}
              >
                <View style={styles.fareHeader}>
                  <Navigation size={28} color="#6366f1" />
                  <View style={styles.fareInfo}>
                    <Text style={styles.fareName}>XL Car</Text>
                    <Text style={styles.fareDesc}>Spacious SUV</Text>
                  </View>
                </View>
                <Text style={styles.farePrice}>₹{calculateFare(22)}</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      )}

      {/* Tracking View */}
      {viewState === 'tracking' && bookedRide && (
        <View style={styles.trackingContainer}>
          {/* Map Area with Pulse */}
          <View style={styles.trackingMapArea}>
            <Animated.View 
              style={[
                styles.pulseDot,
                {
                  transform: [{ scale: pulseAnim }],
                }
              ]}
            />
            <View style={styles.currentLocationDot} />
          </View>

          {/* Ride Info Card */}
          <View style={styles.trackingInfoCard}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{rideStatus}</Text>
            </View>

            <View style={styles.rideInfoSection}>
              <View style={styles.rideTypeRow}>
                {getRideIcon(bookedRide.rideName)}
                <Text style={styles.rideTypeName}>{bookedRide.rideName}</Text>
                <Text style={styles.rideEta}>{bookedRide.eta}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.driverInfoSection}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverInitial}>
                    {bookedRide.driverName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{bookedRide.driverName}</Text>
                  <Text style={styles.vehicleNumber}>{bookedRide.vehicleNumber}</Text>
                </View>
                <View style={styles.contactButtons}>
                  <TouchableOpacity style={styles.contactBtn}>
                    <Phone size={20} color="#6366f1" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactBtn}>
                    <MessageCircle size={20} color="#6366f1" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.locationSection}>
                <View style={styles.locationRow}>
                  <View style={[styles.locationDot, { backgroundColor: '#10b981' }]} />
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.locationLabel}>Pickup</Text>
                    <Text style={styles.locationAddress}>{bookedRide.pickup}</Text>
                  </View>
                </View>
                <View style={styles.locationRow}>
                  <View style={[styles.locationDot, { backgroundColor: '#ef4444' }]} />
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.locationLabel}>Drop-off</Text>
                    <Text style={styles.locationAddress}>{bookedRide.dropoff}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Total Fare</Text>
                <Text style={styles.fareTotalPrice}>₹{bookedRide.fare}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={openCancelModal}
              activeOpacity={0.8}
            >
              <X size={20} color="#ef4444" />
              <Text style={styles.cancelButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1}
            onPress={closeCancelModal}
          />
          <Animated.View 
            style={[
              styles.cancelModal,
              {
                transform: [{ translateY: modalSlideAnim }],
              }
            ]}
          >
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Ride?</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to cancel this ride?
              </Text>
            </View>

            <View style={styles.cancellationReasons}>
              <Text style={styles.reasonsTitle}>SELECT A REASON</Text>
              
              <TouchableOpacity 
                style={[styles.reasonItem, selectedReason === 'Driver is taking too long' && styles.reasonItemSelected]} 
                activeOpacity={0.7}
                onPress={() => selectReason('Driver is taking too long')}
              >
                <Text style={[styles.reasonText, selectedReason === 'Driver is taking too long' && styles.reasonTextSelected]}>
                  Driver is taking too long
                </Text>
                {selectedReason === 'Driver is taking too long' ? (
                  <View style={styles.checkCircle}>
                    <View style={styles.checkCircleInner} />
                  </View>
                ) : (
                  <ChevronRight size={18} color="#64748b" />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.reasonItem, selectedReason === 'Change in plans' && styles.reasonItemSelected]} 
                activeOpacity={0.7}
                onPress={() => selectReason('Change in plans')}
              >
                <Text style={[styles.reasonText, selectedReason === 'Change in plans' && styles.reasonTextSelected]}>
                  Change in plans
                </Text>
                {selectedReason === 'Change in plans' ? (
                  <View style={styles.checkCircle}>
                    <View style={styles.checkCircleInner} />
                  </View>
                ) : (
                  <ChevronRight size={18} color="#64748b" />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.reasonItem, selectedReason === 'Booked by mistake' && styles.reasonItemSelected]} 
                activeOpacity={0.7}
                onPress={() => selectReason('Booked by mistake')}
              >
                <Text style={[styles.reasonText, selectedReason === 'Booked by mistake' && styles.reasonTextSelected]}>
                  Booked by mistake
                </Text>
                {selectedReason === 'Booked by mistake' ? (
                  <View style={styles.checkCircle}>
                    <View style={styles.checkCircleInner} />
                  </View>
                ) : (
                  <ChevronRight size={18} color="#64748b" />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.reasonItem, selectedReason === 'Driver asked to cancel' && styles.reasonItemSelected]} 
                activeOpacity={0.7}
                onPress={() => selectReason('Driver asked to cancel')}
              >
                <Text style={[styles.reasonText, selectedReason === 'Driver asked to cancel' && styles.reasonTextSelected]}>
                  Driver asked to cancel
                </Text>
                {selectedReason === 'Driver asked to cancel' ? (
                  <View style={styles.checkCircle}>
                    <View style={styles.checkCircleInner} />
                  </View>
                ) : (
                  <ChevronRight size={18} color="#64748b" />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.reasonItem, selectedReason === 'Other' && styles.reasonItemSelected]} 
                activeOpacity={0.7}
                onPress={() => selectReason('Other')}
              >
                <Text style={[styles.reasonText, selectedReason === 'Other' && styles.reasonTextSelected]}>
                  Other
                </Text>
                {selectedReason === 'Other' ? (
                  <View style={styles.checkCircle}>
                    <View style={styles.checkCircleInner} />
                  </View>
                ) : (
                  <ChevronRight size={18} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalCancelBtn, !selectedReason && styles.modalCancelBtnDisabled]}
                onPress={cancelRide}
                activeOpacity={0.8}
                disabled={!selectedReason}
              >
                <Text style={styles.modalCancelBtnText}>Yes, Cancel Ride</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalKeepBtn}
                onPress={closeCancelModal}
                activeOpacity={0.8}
              >
                <Text style={styles.modalKeepBtnText}>Keep Ride</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Ride Cancelled Popup */}
      {showCancelledPopup && (
        <View style={styles.popupOverlay}>
          <Animated.View 
            style={[
              styles.cancelledPopup,
              {
                transform: [{ scale: popupScaleAnim }],
              }
            ]}
          >
            <View style={styles.popupIconContainer}>
              <View style={styles.popupCheckmark}>
                <Text style={styles.popupCheckmarkText}>✓</Text>
              </View>
            </View>
            <Text style={styles.popupTitle}>Ride Cancelled</Text>
            <Text style={styles.popupMessage}>
              Your ride has been cancelled successfully
            </Text>
            {selectedReason && (
              <View style={styles.popupReasonBox}>
                <Text style={styles.popupReasonLabel}>Reason:</Text>
                <Text style={styles.popupReasonText}>{selectedReason}</Text>
              </View>
            )}
          </Animated.View>
        </View>
      )}
    </View>
  );
};

/* =============================================================================
   STYLES
   ============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.12,
  },
  mapOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
  },
  titleContainer: {
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  greeting: {
    marginBottom: 32,
  },
  greetingText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  greetingName: {
    color: '#6366f1',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  serviceCard: {
    width: (width - 64) / 2,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 28,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  serviceIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    gap: 4,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#f8fafc',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  recentsSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#475569',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  recentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentDetails: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  recentAddress: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  rideInputContainer: {
    flex: 1,
    zIndex: 100,
    padding: 24,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  inputFields: {
    gap: 16,
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  searchButtonDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  faresList: {
    flex: 1,
  },
  faresTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  fareCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  fareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  fareInfo: {
    flex: 1,
  },
  fareName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4,
  },
  fareDesc: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  farePrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: -0.5,
  },
  trackingContainer: {
    flex: 1,
    zIndex: 100,
  },
  trackingMapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseDot: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    position: 'absolute',
  },
  currentLocationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    borderWidth: 4,
    borderColor: '#f8fafc',
  },
  trackingInfoCard: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  rideInfoSection: {
    gap: 20,
  },
  rideTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rideTypeName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f8fafc',
    flex: 1,
  },
  rideEta: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  driverInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitial: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4,
  },
  vehicleNumber: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationSection: {
    gap: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  locationAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    padding: 18,
    borderRadius: 16,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94a3b8',
  },
  fareTotalPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: -0.5,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ef4444',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cancelModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#334155',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalHeader: {
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  cancellationReasons: {
    marginBottom: 24,
  },
  reasonsTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#475569',
    marginBottom: 16,
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    padding: 18,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  reasonItemSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: '#6366f1',
  },
  reasonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  reasonTextSelected: {
    color: '#6366f1',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  modalActions: {
    gap: 12,
  },
  modalCancelBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
  modalCancelBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  modalKeepBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalKeepBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#f8fafc',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  cancelledPopup: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  popupIconContainer: {
    marginBottom: 20,
  },
  popupCheckmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupCheckmarkText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '900',
  },
  popupTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  popupMessage: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
  },
  popupReasonBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  popupReasonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  popupReasonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
});

export default JustRideMultiStop;