import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';

/* DATA */
const MATERIALS = [
  {
    id: 1,
    title: 'Premium OPC Cement',
    rating: 4.8,
    reviews: 124,
    price: '$8.50 / Bag',
    distance: 2.4,
    badge: 'NEW',
    icon: 'cube-outline',
  },
  {
    id: 2,
    title: 'River Sand (Fine)',
    rating: 4.5,
    reviews: 89,
    price: '$45.00 / Ton',
    distance: 5.1,
    badge: 'Added 2h ago',
    icon: 'dots-grid',
  },
  {
    id: 3,
    title: 'Red Clay Bricks',
    rating: 4.9,
    reviews: 210,
    price: '$0.35 / Unit',
    distance: 1.2,
    badge: 'Added 5h ago',
    icon: 'image-outline',
  },
  {
    id: 4,
    title: 'TMT Steel Rods (12mm)',
    rating: 4.2,
    reviews: 45,
    price: '$780.00 / Ton',
    distance: 12,
    badge: 'Added 1d ago',
    icon: 'format-align-center',
  },
];

const RawMaterial = () => {
  const [selectedRange, setSelectedRange] = useState('0-10');
  const [location, setLocation] = useState('Detecting location...');
  const [locationError, setLocationError] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let permission;
      if (Platform.OS === 'ios') {
        permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }

      if (permission === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        setLocation('Location permission denied');
        setLocationError(true);
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.warn('Error requesting location permission:', error);
      setLocation('Location unavailable');
      setLocationError(true);
      setIsLoadingLocation(false);
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'RawMaterialApp/1.0',
                'Accept': 'application/json',
              },
            }
          );

          const data = await response.json();

          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.suburb ||
            'Your Area';

          const state = data?.address?.state || '';

          setLocation(`${city}${state ? ', ' + state : ''}`);
          setLocationError(false);
        } catch (error) {
          console.log('Geocode error:', error);
          setLocation('Location detected');
          setLocationError(false);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.log('Location error:', error);
        setLocation('Location unavailable');
        setLocationError(true);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  const filteredMaterials = MATERIALS.filter(item => {
    const matchesRange = (() => {
      if (selectedRange === '0-10') return item.distance <= 10;
      if (selectedRange === '10') return item.distance <= 10;
      if (selectedRange === '20') return item.distance <= 20;
      if (selectedRange === '20-40')
        return item.distance > 20 && item.distance <= 40;
      if (selectedRange === '40+') return item.distance > 40;
      return true;
    })();

    const matchesSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesRange && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="arrow-left" size={22} color="#fff" />
          <Text style={styles.headerTitle}>Marketplace</Text>
        </View>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <Icon
              name={locationError ? 'refresh' : 'map-marker'}
              size={16}
              color="#3b82f6"
            />
          )}
          <Text
            style={[
              styles.location,
              locationError && styles.locationError,
            ]}
            numberOfLines={1}
          >
            {' '}
            {location}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Icon name="magnify" size={18} color="#9ca3af" />
        <TextInput
          placeholder="Search for cement, sand, bricks..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 220 }}>
        {/* RECENTLY ADDED */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <Text style={styles.sectionSub}>
              Fresh materials near your location
            </Text>
          </View>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        {/* LIST */}
        {filteredMaterials.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="package-variant-closed" size={64} color="#1f2937" />
            <Text style={styles.emptyTitle}>No materials found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters or search
            </Text>
          </View>
        ) : (
          filteredMaterials.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconBox}>
                <Icon name={item.icon} size={26} color="#cbd5f5" />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text
                    style={
                      item.badge === 'NEW' ? styles.newBadge : styles.timeText
                    }
                  >
                    {item.badge}
                  </Text>
                </View>

                <Text style={styles.ratingText}>
                  ⭐ {item.rating}{' '}
                  <Text style={styles.reviewText}>
                    ({item.reviews} reviews)
                  </Text>
                </Text>

                <View style={styles.cardBottom}>
                  <Text style={styles.price}>{item.price}</Text>
                  <Text style={styles.distance}>▲ {item.distance} km</Text>
                </View>
              </View>
            </View>
          ))
        )}

        {/* RANGE + RATING (EXACT MATCH) */}
        <View style={styles.filterContainer}>
          <Text style={styles.rangeLabel}>RANGE</Text>

          <View style={styles.rangeRow}>
            {RangeBtn('0-10', '0-10km', selectedRange, setSelectedRange)}
            {RangeBtn('10', '10km', selectedRange, setSelectedRange)}
            {RangeBtn('20', '20km', selectedRange, setSelectedRange)}
            {RangeBtn('20-40', '20-40km', selectedRange, setSelectedRange)}
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingBtn}>
              <Icon name="star-outline" size={14} color="#9ca3af" />
              <Text style={styles.ratingTextBtn}>Rating: Low to High</Text>
            </View>

            <View style={[styles.ratingBtn, styles.ratingActive]}>
              <Icon name="star" size={14} color="#3b82f6" />
              <Text style={styles.ratingTextActive}>
                Rating: High to Low
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM TABS */}
      <View style={styles.bottomTabs}>
        <BottomTab icon="home-outline" label="Home" />
        <BottomTab icon="storefront" label="Market" active />
        <BottomTab icon="clipboard-text-outline" label="Orders" />
        <BottomTab icon="chat-outline" label="Quotes" />
        <BottomTab icon="account-outline" label="Profile" />
      </View>
    </SafeAreaView>
  );
};

/* RANGE BUTTON */
const RangeBtn = (
  value: string,
  label: string,
  selected: string,
  setSelected: any
) => (
  <TouchableOpacity
    key={value}
    onPress={() => setSelected(value)}
    style={[styles.rangeBtn, selected === value && styles.rangeBtnActive]}
  >
    <Text
      style={[
        styles.rangeText,
        selected === value && styles.rangeTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* BOTTOM TAB */
const BottomTab = ({ icon, label, active }: any) => (
  <View style={styles.tabItem}>
    <Icon name={icon} size={22} color={active ? '#3b82f6' : '#64748b'} />
    <Text style={[styles.tabText, active && styles.tabActive]}>{label}</Text>
  </View>
);

export default RawMaterial;

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: '50%',
  },
  location: { color: '#3b82f6', fontWeight: '600', fontSize: 13 },
  locationError: { color: '#ef4444' },

  searchBox: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#111827',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, height: 42, color: '#fff', marginLeft: 6 },

  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  sectionSub: { color: '#94a3b8', fontSize: 12 },
  seeAll: { color: '#3b82f6', fontWeight: '600' },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  newBadge: {
    color: '#22c55e',
    backgroundColor: '#22c55e22',
    fontSize: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  timeText: { color: '#94a3b8', fontSize: 11 },

  ratingText: { color: '#facc15', fontSize: 12, marginVertical: 4 },
  reviewText: { color: '#94a3b8' },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: { color: '#3b82f6', fontWeight: '700' },
  distance: { color: '#94a3b8', fontSize: 12 },

  /* RANGE + RATING */
  filterContainer: {
    margin: 16,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 12,
  },
  rangeLabel: { color: '#94a3b8', fontSize: 11, marginBottom: 6 },
  rangeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rangeBtn: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rangeBtnActive: { backgroundColor: '#2563eb' },
  rangeText: { color: '#94a3b8', fontSize: 12 },
  rangeTextActive: { color: '#fff', fontWeight: '600' },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  ratingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingActive: { borderColor: '#2563eb' },
  ratingTextBtn: { color: '#94a3b8', fontSize: 12 },
  ratingTextActive: { color: '#3b82f6', fontSize: 12 },

  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  tabItem: { alignItems: 'center' },
  tabText: { fontSize: 10, color: '#64748b' },
  tabActive: { color: '#3b82f6' },
});