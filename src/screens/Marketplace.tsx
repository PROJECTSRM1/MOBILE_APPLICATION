import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  RefreshControl,
  Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Property {
  id: string;
  title?: string;
  price: string;
  image?: string;
  images?: string[];
  rating?: number;
  distance?: string;
  type?: string;
  propertyType?: string;
  isNew?: boolean;
  isFavorite?: boolean;
  listingType: 'buy' | 'rent';
  description?: string;
  sqft?: string;
  bhk?: string;
  location?: string;
  area?: string;
  furnishingType?: string;
  landType?: string;
  ownerName?: string;
  brand?: string;
  model?: string;
  year?: string;
  mobileNumber?: string;
  createdAt?: string;
  itemCondition?: string;
}

const Marketplace = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [location, setLocation] = useState('Near New York, NY');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showListingTypeModal, setShowListingTypeModal] = useState(false);
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Time');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All Ratings');
  
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    requestLocationPermission();
    loadListings();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadListings();
    });
    return unsubscribe;
  }, [navigation]);

  const loadListings = async () => {
    try {
      const storedListings = await AsyncStorage.getItem('marketplace_listings');
      if (storedListings) {
        const parsedListings = JSON.parse(storedListings);
        
        const formattedListings = parsedListings.map((listing: any) => {
          const isNew = listing.createdAt && 
            (new Date().getTime() - new Date(listing.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
          
          let title = '';
          if (listing.propertyType === 'Apartment' || listing.propertyType === 'Villa' || listing.propertyType === 'Independent House') {
            title = `${listing.bhk || ''} ${listing.propertyType} in ${listing.area || 'Unknown'}`;
          } else if (listing.propertyType === 'Land') {
            title = `${listing.landType || ''} Land in ${listing.area || 'Unknown'}`;
          } else if (['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(listing.propertyType)) {
            title = `${listing.brand || ''} ${listing.model || ''} ${listing.year || ''}`.trim();
          } else {
            title = `${listing.propertyType} in ${listing.area || 'Unknown'}`;
          }

          return {
            id: listing.id,
            title: title || listing.propertyType,
            price: `₹${parseFloat(listing.price).toLocaleString('en-IN')}`,
            image: listing.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
            images: listing.images,
            rating: 4.5 + Math.random() * 0.5,
            distance: `${(Math.random() * 5).toFixed(1)} km away`,
            type: listing.propertyType,
            propertyType: listing.propertyType,
            listingType: listing.type,
            isNew,
            isFavorite: false,
            description: listing.description,
            sqft: listing.sqft,
            bhk: listing.bhk,
            location: listing.location,
            area: listing.area,
            furnishingType: listing.furnishingType,
            landType: listing.landType,
            ownerName: listing.ownerName,
            brand: listing.brand,
            model: listing.model,
            year: listing.year,
            mobileNumber: listing.mobileNumber,
            createdAt: listing.createdAt,
            itemCondition: listing.itemCondition,
          };
        });

        setProperties(formattedListings);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    setRefreshing(false);
  };

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
        console.log('Location permission denied');
      }
    } catch (error) {
      console.warn('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'MarketplaceApp/1.0',
                'Accept': 'application/json',
              },
            }
          );

          const data = await response.json();

          console.log('Geocode data:', data);

          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.suburb ||
            'Your Area';

          const state = data?.address?.state || '';

          setLocation(`Near ${city}, ${state}`);
        } catch (error) {
          console.log('Geocode error:', error);
          setLocation('Location detected');
        }
      },
      (error) => {
        console.log('Location error:', error);
        setLocation('Location unavailable');
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

  const filteredProperties = properties.filter((property) => {
    const matchesTab = property.listingType === activeTab;
    
    const matchesCategory = selectedCategory === 'All' ? true : 
      selectedCategory === 'Land' ? property.propertyType === 'Land' :
      selectedCategory === 'Apartment' ? property.propertyType === 'Apartment' :
      selectedCategory === 'Vehicle' ? ['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(property.propertyType || '') :
      selectedCategory === 'House' ? ['Villa', 'Independent House'].includes(property.propertyType || '') :
      selectedCategory === 'Commercial' ? ['Office', 'Hospital', 'Commercial Space'].includes(property.propertyType || '') : true;
    
    const matchesPropertyType = selectedPropertyType === 'All' ? true : property.propertyType === selectedPropertyType;
    
    let matchesDate = true;
    if (property.createdAt && selectedDateFilter !== 'All Time') {
      const propertyDate = new Date(property.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - propertyDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (selectedDateFilter === 'Today') matchesDate = diffDays <= 1;
      else if (selectedDateFilter === 'Last 7 Days') matchesDate = diffDays <= 7;
      else if (selectedDateFilter === 'Last 30 Days') matchesDate = diffDays <= 30;
      else if (selectedDateFilter === 'Last 3 Months') matchesDate = diffDays <= 90;
    }
    
    let matchesRating = true;
    if (selectedRatingFilter !== 'All Ratings' && property.rating) {
      const minRating = parseFloat(selectedRatingFilter.split('+')[0]);
      matchesRating = property.rating >= minRating;
    }
    
    const matchesSearch = property.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         property.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesCategory && matchesPropertyType && matchesDate && matchesRating && matchesSearch;
  });

  const categories = [
    { id: 'All', icon: 'apps', label: 'All' },
    { id: 'Land', icon: 'landscape', label: 'Land' },
    { id: 'Apartment', icon: 'apartment', label: 'Apartment' },
    { id: 'Vehicle', icon: 'directions-car', label: 'Vehicle' },
    { id: 'House', icon: 'home', label: 'House' },
    { id: 'Commercial', icon: 'business', label: 'Commercial' },
  ];

  const listingTypeOptions = ['Buy', 'Rent'];

  const propertyTypeOptions = [
    'All',
    'Apartment',
    'Villa',
    'Independent House',
    'Land',
    'Bike',
    'Car',
    'Lorry',
    'Auto',
    'Bus',
    'Office',
    'Hospital',
    'Commercial Space',
  ];

  const dateFilterOptions = [
    'All Time',
    'Today',
    'Last 7 Days',
    'Last 30 Days',
    'Last 3 Months',
  ];

  const ratingFilterOptions = [
    'All Ratings',
    '4.5+ Stars',
    '4.0+ Stars',
    '3.5+ Stars',
    '3.0+ Stars',
  ];

  const FilterModal = ({ visible, onClose, options, selectedValue, onSelect, title }: any) => (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option: string) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, selectedValue === option && styles.selectedOption]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text style={[styles.optionText, selectedValue === option && styles.selectedOptionText]}>
                  {option}
                </Text>
                {selectedValue === option && (
                  <MaterialIcons name="check" size={20} color="#135bec" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0c10" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Marketplace</Text>
          <TouchableOpacity 
            style={styles.listingTypeDropdown}
            onPress={() => setShowListingTypeModal(true)}
          >
            <Text style={styles.listingTypeText}>
              {activeTab === 'buy' ? 'Buy' : 'Rent'}
            </Text>
            <MaterialIcons name="expand-more" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => navigation.navigate('SellItem')}
        >
          <MaterialIcons name="add" size={16} color="#fff" />
          <Text style={styles.sellButtonText}>Sell/Rent</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.filterPill}
            onPress={() => setShowPropertyTypeModal(true)}
          >
            <Text style={styles.filterText}>
              {selectedPropertyType === 'All' ? 'Property Type' : selectedPropertyType}
            </Text>
            <MaterialIcons name="expand-more" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterPill}
            onPress={() => setShowDateModal(true)}
          >
            <Text style={styles.filterText}>
              {selectedDateFilter === 'All Time' ? 'Updated Date' : selectedDateFilter}
            </Text>
            <MaterialIcons name="expand-more" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterPill}
            onPress={() => setShowRatingModal(true)}
          >
            <Text style={styles.filterText}>
              {selectedRatingFilter === 'All Ratings' ? 'Ratings' : selectedRatingFilter}
            </Text>
            <MaterialIcons name="expand-more" size={14} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#135bec"
            colors={['#135bec']}
          />
        }
      >
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search homes, cars, land..."
            placeholderTextColor="#4b5563"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationLeft}>
            <View style={styles.locationIconContainer}>
              <MaterialIcons name="location-on" size={20} color="#135bec" />
            </View>
            <View>
              <Text style={styles.locationLabel}>CURRENT LOCATION</Text>
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={requestLocationPermission}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialIcons
                name={category.icon}
                size={18}
                color={selectedCategory === category.id ? '#fff' : '#94a3b8'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.activeCategoryText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.propertiesHeader}>
          <Text style={styles.propertiesTitle}>
            {filteredProperties.length} Properties Near You
          </Text>
          <View style={styles.sortContainer}>
            <MaterialIcons name="tune" size={16} color="#94a3b8" />
            <Text style={styles.sortText}>Sort</Text>
          </View>
        </View>

        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color="#232936" />
            <Text style={styles.emptyTitle}>No Properties Found</Text>
            <Text style={styles.emptySubtitle}>
              {properties.length === 0 
                ? 'Be the first to list a property!' 
                : 'Try adjusting your filters or search'}
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('SellItem')}
            >
              <Text style={styles.emptyButtonText}>Post a Listing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
              {filteredProperties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('BuyerPage', {
                      property: property, // pass full property
                    })
                  }
                >
                <View style={styles.cardImage}>
                  <Image source={{ uri: property.image }} style={styles.image} />
                  {property.isFavorite && (
                    <View style={styles.favoriteButton}>
                      <MaterialIcons name="favorite" size={18} color="#fff" />
                    </View>
                  )}
                  <View style={styles.topBadgesContainer}>
                    {property.listingType === 'buy' ? (
                      <View style={styles.saleBadge}>
                        <Text style={styles.saleBadgeText}>FOR SALE</Text>
                      </View>
                    ) : (
                      <View style={styles.rentBadge}>
                        <Text style={styles.rentBadgeText}>FOR RENT</Text>
                      </View>
                    )}
                    {property.itemCondition && (
                      <View style={[
                        styles.conditionBadge,
                        property.itemCondition === 'New Item' ? styles.newConditionBadge : styles.oldConditionBadge
                      ]}>
                        <Text style={styles.conditionBadgeText}>
                          {property.itemCondition === 'New Item' ? 'NEW' : 'USED'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.ratingBadge}>
                    <MaterialIcons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{property.rating?.toFixed(1)}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {property.title}
                  </Text>
                  <Text style={styles.cardPrice}>{property.price}</Text>
                  {property.location && (
                    <View style={styles.locationRow}>
                      <MaterialIcons name="location-on" size={12} color="#64748b" />
                      <Text style={styles.locationDetailText} numberOfLines={1}>
                        {property.location}
                      </Text>
                    </View>
                  )}
                  {property.area && (
                    <View style={styles.areaRow}>
                      <MaterialIcons name="place" size={12} color="#64748b" />
                      <Text style={styles.areaDetailText} numberOfLines={1}>
                        {property.area}
                      </Text>
                    </View>
                  )}
                  <View style={styles.cardDetails}>
                    {property.sqft && (
                      <View style={styles.detailItem}>
                        <MaterialIcons name="square-foot" size={12} color="#64748b" />
                        <Text style={styles.detailText}>{property.sqft} sqft</Text>
                      </View>
                    )}
                    {property.bhk && (
                      <View style={styles.detailItem}>
                        <MaterialIcons name="bed" size={12} color="#64748b" />
                        <Text style={styles.detailText}>{property.bhk}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.distanceContainer}>
                    <MaterialIcons name="near-me" size={12} color="#94a3b8" />
                    <Text style={styles.distanceText}>{property.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color="#135bec" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="grid-view" size={24} color="#64748b" />
          <Text style={styles.navText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#64748b" />
          <Text style={styles.navText}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#64748b" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <FilterModal
        visible={showListingTypeModal}
        onClose={() => setShowListingTypeModal(false)}
        options={listingTypeOptions}
        selectedValue={activeTab === 'buy' ? 'Buy' : 'Rent'}
        onSelect={(value: string) => setActiveTab(value.toLowerCase() as 'buy' | 'rent')}
        title="Select Listing Type"
      />

      <FilterModal
        visible={showPropertyTypeModal}
        onClose={() => setShowPropertyTypeModal(false)}
        options={propertyTypeOptions}
        selectedValue={selectedPropertyType}
        onSelect={setSelectedPropertyType}
        title="Select Property Type"
      />

      <FilterModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        options={dateFilterOptions}
        selectedValue={selectedDateFilter}
        onSelect={setSelectedDateFilter}
        title="Filter by Date"
      />

      <FilterModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        options={ratingFilterOptions}
        selectedValue={selectedRatingFilter}
        onSelect={setSelectedRatingFilter}
        title="Filter by Rating"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0c10',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  listingTypeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b26',
    borderWidth: 1,
    borderColor: '#232936',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  listingTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  sellButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#135bec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  sellButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b26',
    borderWidth: 1,
    borderColor: '#232936',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b26',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    paddingVertical: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIconContainer: {
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    padding: 6,
    borderRadius: 8,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#135bec',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#161b26',
    borderWidth: 1,
    borderColor: '#232936',
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    gap: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#135bec',
    borderColor: '#135bec',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  activeCategoryText: {
    color: '#fff',
  },
  propertiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  propertiesTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#135bec',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
card: {
width: (width - 48) / 2,
margin: 8,
},
cardImage: {
width: '100%',
aspectRatio: 4 / 5,
borderRadius: 16,
overflow: 'hidden',
position: 'relative',
marginBottom: 8,
},
image: {
width: '100%',
height: '100%',
},
favoriteButton: {
position: 'absolute',
top: 8,
right: 8,
backgroundColor: 'rgba(255, 255, 255, 0.2)',
padding: 6,
borderRadius: 20,
},
topBadgesContainer: {
position: 'absolute',
top: 8,
left: 8,
flexDirection: 'column',
gap: 4,
},
newBadge: {
backgroundColor: '#10b981',
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
},
newBadgeText: {
fontSize: 10,
fontWeight: '700',
color: '#fff',
letterSpacing: 1,
},
saleBadge: {
backgroundColor: '#3b82f6',
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
},
saleBadgeText: {
fontSize: 9,
fontWeight: '700',
color: '#fff',
letterSpacing: 0.5,
},
rentBadge: {
backgroundColor: '#f59e0b',
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
},
rentBadgeText: {
fontSize: 9,
fontWeight: '700',
color: '#fff',
letterSpacing: 0.5,
},
conditionBadge: {
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
},
newConditionBadge: {
backgroundColor: '#8b5cf6',
},
oldConditionBadge: {
backgroundColor: '#6b7280',
},
conditionBadgeText: {
fontSize: 9,
fontWeight: '700',
color: '#fff',
letterSpacing: 0.5,
},
ratingBadge: {
position: 'absolute',
bottom: 8,
left: 8,
backgroundColor: 'rgba(0, 0, 0, 0.4)',
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: 6,
gap: 4,
},
ratingText: {
fontSize: 10,
fontWeight: '700',
color: '#fff',
},
cardContent: {
paddingHorizontal: 4,
},
cardTitle: {
fontSize: 14,
fontWeight: '700',
color: '#fff',
marginBottom: 4,
},
cardPrice: {
fontSize: 16,
fontWeight: '800',
color: '#135bec',
marginBottom: 6,
},
locationRow: {
flexDirection: 'row',
alignItems: 'center',
gap: 4,
marginBottom: 3,
},
locationDetailText: {
fontSize: 10,
fontWeight: '500',
color: '#64748b',
flex: 1,
},
areaRow: {
flexDirection: 'row',
alignItems: 'center',
gap: 4,
marginBottom: 6,
},
areaDetailText: {
fontSize: 10,
fontWeight: '500',
color: '#64748b',
flex: 1,
},
cardDetails: {
flexDirection: 'row',
gap: 12,
marginBottom: 4,
},
detailItem: {
flexDirection: 'row',
alignItems: 'center',
gap: 4,
},
detailText: {
fontSize: 10,
fontWeight: '500',
color: '#64748b',
},
distanceContainer: {
flexDirection: 'row',
alignItems: 'center',
gap: 4,
},
distanceText: {
fontSize: 10,
fontWeight: '500',
color: '#64748b',
},
bottomNav: {
flexDirection: 'row',
justifyContent: 'space-around',
alignItems: 'center',
backgroundColor: 'rgba(10, 12, 16, 0.95)',
borderTopWidth: 1,
borderTopColor: '#1e293b',
paddingTop: 12,
paddingBottom: 24,
},
navItem: {
alignItems: 'center',
gap: 4,
},
navText: {
fontSize: 10,
fontWeight: '700',
color: '#64748b',
},
activeNavText: {
color: '#135bec',
},
modalOverlay: {
flex: 1,
backgroundColor: 'rgba(0, 0, 0, 0.7)',
justifyContent: 'flex-end',
},
modalContent: {
backgroundColor: '#161b26',
borderTopLeftRadius: 24,
borderTopRightRadius: 24,
maxHeight: '70%',
paddingBottom: 24,
},
modalHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: 20,
paddingVertical: 16,
borderBottomWidth: 1,
borderBottomColor: '#232936',
},
modalTitle: {
fontSize: 18,
fontWeight: '700',
color: '#fff',
},
optionsList: {
paddingHorizontal: 16,
paddingTop: 8,
},
optionItem: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingVertical: 16,
paddingHorizontal: 12,
borderBottomWidth: 1,
borderBottomColor: '#232936',
},
selectedOption: {
backgroundColor: 'rgba(19, 91, 236, 0.1)',
},
optionText: {
fontSize: 16,
fontWeight: '500',
color: '#fff',
},
selectedOptionText: {
color: '#135bec',
fontWeight: '600',
},
});

export default Marketplace;