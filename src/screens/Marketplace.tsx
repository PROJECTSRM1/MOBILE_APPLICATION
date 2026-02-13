import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image,
  Dimensions, StatusBar, Platform, RefreshControl, Modal, Alert, ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get('window');

const API_BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';

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
  registrationStatus?: string;
  registrationValue?: string;
  marketValue?: string;
  documentImages?: string[];
  hostelType?: string;
  totalRooms?: string;
  availableRooms?: string;
  foodIncluded?: string;
  hasAC?: boolean;
  hasWifi?: boolean;
  hasTV?: boolean;
  hasLaundry?: boolean;
  hasParking?: boolean;
  hasSecurity?: boolean;
  hotelName?: string;
  hotelStarRating?: string;
  checkInTime?: string;
  checkOutTime?: string;
  roomTypes?: string[];
  hasRestaurant?: boolean;
  hasGym?: boolean;
  hasPool?: boolean;
  hasSpa?: boolean;
  hasConferenceRoom?: boolean;
  petFriendly?: boolean;
  cancellationPolicy?: string;
  isUserListing?: boolean;
  monthlyRent?: string;
  pricePerNight?: string;
  distanceKm?: string;
  sharingType?: string;
  bedsPerRoom?: string;
  userId?: string;
  createdBy?: string;
}

const Marketplace = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [location, setLocation] = useState('Gachibowli, Hyderabad');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showListingTypeModal, setShowListingTypeModal] = useState(false);
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Time');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All Ratings');
  const [selectedSortOption, setSelectedSortOption] = useState('Newest First');
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { colors } = useTheme();
  const styles = getStyles(colors) as any;
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    requestLocationPermission();
    loadListings();
    loadWishlistIds();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadListings();
      loadWishlistIds();
    });
    return unsubscribe;
  }, [navigation]);

  const loadWishlistIds = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('marketplace_wishlist');
      if (storedWishlist) {
        const wishlist = JSON.parse(storedWishlist);
        setWishlistIds(wishlist.map((item: any) => item.id));
      } else {
        setWishlistIds([]);
      }
    } catch (error) {
      console.error("Error loading wishlist IDs", error);
    }
  };

  const toggleWishlist = async (property: Property, e?: any) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const storedWishlist = await AsyncStorage.getItem('marketplace_wishlist');
      let wishlist: Property[] = storedWishlist ? JSON.parse(storedWishlist) : [];

      const isCurrentlyWishlisted = wishlistIds.includes(property.id);

      if (isCurrentlyWishlisted) {
        wishlist = wishlist.filter(item => item.id !== property.id);
        setWishlistIds(wishlistIds.filter(id => id !== property.id));
      } else {
        wishlist.push(property);
        setWishlistIds([...wishlistIds, property.id]);
      }

      await AsyncStorage.setItem('marketplace_wishlist', JSON.stringify(wishlist));
    } catch (error) {
      Alert.alert("Error", "Could not update wishlist");
    }
  };

  const getPropertyTypeFromId = (propertyTypeId: number): string => {
    const propertyTypeMap: { [key: number]: string } = {
      1: 'Apartment',
      2: 'Villa',
      3: 'Independent House',
      4: 'Land',
      5: 'Bike',
      6: 'Car',
      7: 'Lorry',
      8: 'Auto',
      9: 'Bus',
      10: 'Office',
      11: 'Hospital',
      12: 'Commercial Space',
      13: 'Hostel',
      14: 'Hotel',
    };
    return propertyTypeMap[propertyTypeId] || 'Unknown';
  };

  const getBhkTypeFromId = (bhkTypeId: number): string => {
    const bhkMap: { [key: number]: string } = {
      1: '1 BHK',
      2: '2 BHK',
      3: '3 BHK',
      4: '4 BHK',
      5: '5+ BHK',
    };
    return bhkMap[bhkTypeId] || '';
  };

  const getFurnishingTypeFromId = (furnishingId: number): string => {
    const furnishingMap: { [key: number]: string } = {
      1: 'Full',
      2: 'Semi',
      3: 'Unfurnished',
    };
    return furnishingMap[furnishingId] || '';
  };

  const getListingTypeFromId = (listingTypeId: number): 'buy' | 'rent' => {
    return listingTypeId === 1 ? 'buy' : 'rent';
  };

  const getItemConditionFromId = (itemConditionId: number): string => {
    const conditionMap: { [key: number]: string } = {
      1: 'New Item',
      2: 'Used Item',
    };
    return conditionMap[itemConditionId] || '';
  };

  const getHostelTypeFromId = (hostelTypeId: number): string => {
    const hostelMap: { [key: number]: string } = {
      1: 'Boys',
      2: 'Girls',
      3: 'Co-living',
    };
    return hostelMap[hostelTypeId] || '';
  };

  const getLandTypeFromId = (landTypeId: number): string => {
    const landMap: { [key: number]: string } = {
      1: 'Residential',
      2: 'Commercial',
      3: 'Agricultural',
    };
    return landMap[landTypeId] || '';
  };

  const getStarRatingFromId = (starRatingId: number): string => {
    const ratingMap: { [key: number]: string } = {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
    };
    return ratingMap[starRatingId] || '';
  };

  const transformBackendDataToProperty = (backendData: any): Property => {
    const propertyType = getPropertyTypeFromId(backendData.property_type_id);
    const bhk = getBhkTypeFromId(backendData.bhk_type_id);
    const furnishingType = getFurnishingTypeFromId(backendData.furnishing_id);
    const listingType = getListingTypeFromId(backendData.listing_type_id);
    const itemCondition = getItemConditionFromId(backendData.item_condition_id);
    const hostelType = getHostelTypeFromId(backendData.hostel_type_id);
    const landType = getLandTypeFromId(backendData.land_type_id);
    const hotelStarRating = getStarRatingFromId(backendData.star_rating_id);
    
    // Parse images from upload_photos field
    let images: string[] = [];

    try {
      const rawPhotos = backendData.upload_photos;

      if (rawPhotos) {
        if (Array.isArray(rawPhotos)) {
          images = rawPhotos;
        } else if (typeof rawPhotos === 'string' && rawPhotos.startsWith('http')) {
          images = [rawPhotos];
        } else if (typeof rawPhotos === 'string' && rawPhotos.includes(',')) {
          images = rawPhotos.split(',').map((img: string) => img.trim()).filter(Boolean);
        } else if (typeof rawPhotos === 'string' && rawPhotos.length > 100) {
          images = [`data:image/jpeg;base64,${rawPhotos}`];
        } else if (typeof rawPhotos === 'string') {
          images = [rawPhotos.trim()];
        }
      }
    } catch (error) {
      console.log('Image parse fallback:', backendData.upload_photos);
    }

    images = images.map((img: string) => {
      if (!img) return '';
      if (img.startsWith('http') || img.startsWith('data:image')) return img;
      return `${API_BASE_URL}/${img}`;
    }).filter(Boolean);

    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500'];
    }

    const area = backendData.locality_area && backendData.locality_area.trim() !== '' 
      ? backendData.locality_area.trim() 
      : 'Hyderabad';
    
    const cleanLocation = area;
    
    let title = '';
    if (['Apartment', 'Villa', 'Independent House'].includes(propertyType)) {
      title = `${bhk || ''} ${propertyType}${area !== 'Hyderabad' ? ` in ${area}` : ''}`;
    } else if (propertyType === 'Land') {
      title = `${landType || ''} Land${area !== 'Hyderabad' ? ` in ${area}` : ''}`;
    } else if (['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(propertyType)) {
      const brandName = backendData.band_name || backendData.brand_name || '';
      const modelName = backendData.model_name || '';
      const yearValue = backendData.year || '';
      title = `${brandName} ${modelName} ${yearValue}`.trim() || `${propertyType}${area !== 'Hyderabad' ? ` in ${area}` : ''}`;
    } else if (propertyType === 'Hostel') {
      title = `${hostelType || ''} Hostel${area !== 'Hyderabad' ? ` in ${area}` : ''}`;
    } else if (propertyType === 'Hotel') {
      title = backendData.hotel_name || `Hotel${area !== 'Hyderabad' ? ` in ${area}` : ''}`;
    } else {
      title = `${propertyType}${area !== 'Hyderabad' ? ` in ${area}` : ''}`;
    }

    const isNew = backendData.created_date && 
      (new Date().getTime() - new Date(backendData.created_date).getTime()) < 7 * 24 * 60 * 60 * 1000;

    let priceDisplay = '';
    if (listingType === 'rent') {
      if (propertyType === 'Hotel') {
        priceDisplay = `₹${parseFloat(backendData.price_per_night || 0).toLocaleString('en-IN')}`;
      } else {
        priceDisplay = `₹${parseFloat(backendData.monthly_rent || 0).toLocaleString('en-IN')}`;
      }
    } else {
      priceDisplay = `₹${parseFloat(backendData.expected_price || 0).toLocaleString('en-IN')}`;
    }

    return {
      id: backendData.id?.toString() || Math.random().toString(),
      title: title.trim() || propertyType,
      price: priceDisplay,
      image: images[0],
      images: images,
      rating: backendData.rating ? parseFloat(backendData.rating) : undefined,
      distance: backendData.distance_km ? `${parseFloat(backendData.distance_km).toFixed(1)} km` : undefined,
      type: propertyType,
      propertyType: propertyType,
      listingType: listingType,
      isNew: isNew,
      isFavorite: false,
      description: backendData.property_description,
      sqft: backendData.property_sqft?.toString(),
      bhk: bhk,
      location: cleanLocation,
      area: area,
      furnishingType: furnishingType,
      landType: landType,
      ownerName: backendData.owner_name,
      brand: backendData.band_name || backendData.brand_name,
      model: backendData.model_name,
      year: backendData.year?.toString(),
      mobileNumber: backendData.mobile_number,
      createdAt: backendData.created_date,
      itemCondition: itemCondition,
      registrationStatus: backendData.registration_status_id?.toString(),
      marketValue: backendData.expected_price?.toString(),
      registrationValue: backendData.registration_value?.toString(),
      documentImages: backendData.upload_document ? [backendData.upload_document] : undefined,
      hostelType: hostelType,
      totalRooms: backendData.total_rooms?.toString(),
      availableRooms: backendData.available_rooms?.toString(),
      foodIncluded: backendData.food_included ? 'Yes' : 'No',
      hasAC: backendData.has_ac,
      hasWifi: backendData.has_wifi,
      hasTV: backendData.has_tv,
      hasLaundry: backendData.has_laundry,
      hasParking: backendData.has_parking,
      hasSecurity: backendData.has_security,
      hotelName: backendData.hotel_name,
      hotelStarRating: hotelStarRating,
      checkInTime: backendData.check_in_time,
      checkOutTime: backendData.check_out_time,
      roomTypes: backendData.room_types,
      hasRestaurant: backendData.has_restaurant,
      hasGym: backendData.has_gym,
      hasPool: backendData.has_pool,
      hasSpa: backendData.has_spa,
      hasConferenceRoom: backendData.has_conference_room,
      petFriendly: backendData.pet_friendly,
      cancellationPolicy: backendData.cancellation_policy,
      isUserListing: true,
      monthlyRent: backendData.monthly_rent?.toString(),
      pricePerNight: backendData.price_per_night?.toString(),
      distanceKm: backendData.distance_km?.toString(),
      sharingType: backendData.sharing_type?.toString(),
      bedsPerRoom: backendData.beds_per_room?.toString(),
      userId: backendData.user_id?.toString() || backendData.created_by?.toString(),
      createdBy: backendData.created_by?.toString() || backendData.user_id?.toString(),
    };
  };

  const fetchListingsFromBackend = async (): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/property/sell-listing/all`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const listingsArray = Array.isArray(data) ? data : (data.listings || data.data || []);
      
      return listingsArray.map((item: any) => transformBackendDataToProperty(item));
    } catch (error) {
      console.error('Error fetching listings from backend:', error);
      Alert.alert('Error', 'Failed to load listings from server. Please try again.');
      return [];
    }
  };

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const backendListings = await fetchListingsFromBackend();
      setProperties(backendListings);
    } catch (error) {
      console.error('Error loading listings:', error);
      Alert.alert('Error', 'Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!propertyToDelete) return;

    try {
      setIsDeleting(true);
      const modifiedBy = propertyToDelete.userId || propertyToDelete.createdBy || '25';

      console.log('Deleting listing:', {
        listing_id: propertyToDelete.id,
        modified_by: modifiedBy
      });

      const response = await fetch(
        `${API_BASE_URL}/property/delete/sell/${propertyToDelete.id}?modified_by=${modifiedBy}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = await response.json();
      console.log('Delete response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete listing');
      }
      
      setShowDeleteModal(false);
      setPropertyToDelete(null);
      await loadListings();
      
      Alert.alert('Success', 'Listing deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      Alert.alert('Error', error.message || 'Failed to delete listing. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    await loadWishlistIds();
    setRefreshing(false);
  };

  const requestLocationPermission = async () => {
    try {
      let permission = Platform.OS === 'ios' ? await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE) : await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permission === RESULTS.GRANTED) getCurrentLocation();
    } catch (error) {
      console.warn('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, { headers: { 'User-Agent': 'MarketplaceApp/1.0', 'Accept': 'application/json' } });
          const data = await response.json();
          const suburb = data?.address?.suburb || data?.address?.neighbourhood || '';
          const city = data?.address?.city || data?.address?.town || 'Hyderabad';
          setLocation(`${suburb}, ${city}`);
        } catch (error) { setLocation('Gachibowli, Hyderabad'); }
      },
      (error) => setLocation('Gachibowli, Hyderabad'),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, forceRequestLocation: true, showLocationDialog: true }
    );
  };

  const getCategoryFromPropertyType = (propertyType: string): string => {
    if (propertyType === 'Land') return 'Land';
    if (propertyType === 'Apartment') return 'Apartment';
    if (['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(propertyType)) return 'Vehicle';
    if (['Villa', 'Independent House'].includes(propertyType)) return 'House';
    if (['Office', 'Hospital', 'Commercial Space'].includes(propertyType)) return 'Commercial';
    if (propertyType === 'Hostel') return 'Hostel';
    if (propertyType === 'Hotel') return 'Hotel';
    return 'All';
  };

  const smartSearch = (property: Property, query: string): boolean => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return true;

    const propertyTypeLower = property.propertyType?.toLowerCase() || '';
    if (propertyTypeLower.includes(lowerQuery)) return true;

    const vehicleTypes = ['bike', 'car', 'lorry', 'auto', 'bus'];
    const houseTypes = ['villa', 'independent house'];
    const commercialTypes = ['office', 'hospital', 'commercial space'];

    if (lowerQuery === 'vehicle' || lowerQuery === 'vehicles') {
      return vehicleTypes.includes(propertyTypeLower);
    }
    if (lowerQuery === 'house' || lowerQuery === 'houses' || lowerQuery === 'home' || lowerQuery === 'homes') {
      return houseTypes.includes(propertyTypeLower);
    }
    if (lowerQuery === 'commercial') {
      return commercialTypes.includes(propertyTypeLower);
    }

    const searchableFields = [
      property.title, property.area, property.location, property.brand,
      property.model, property.hotelName, property.hostelType, property.bhk, property.landType
    ].filter(Boolean).map(field => field?.toLowerCase());

    return searchableFields.some(field => field?.includes(lowerQuery));
  };

  const sortProperties = (properties: Property[]): Property[] => {
    const sorted = [...properties];

    switch (selectedSortOption) {
      case 'Newest First':
        return sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'Oldest First':
        return sorted.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      case 'Price: Low to High':
        return sorted.sort((a, b) => parseFloat(a.price.replace(/[₹,]/g, '')) - parseFloat(b.price.replace(/[₹,]/g, '')));
      case 'Price: High to Low':
        return sorted.sort((a, b) => parseFloat(b.price.replace(/[₹,]/g, '')) - parseFloat(a.price.replace(/[₹,]/g, '')));
      case 'Rating: High to Low':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'Rating: Low to High':
        return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      default:
        return sorted;
    }
  };

  const filteredProperties = sortProperties(properties.filter((property) => {
    if (isWishlistActive && !wishlistIds.includes(property.id)) return false;

    const matchesTab = property.listingType === activeTab;
    const matchesCategory = selectedCategory === 'All' ? true : 
      selectedCategory === 'Land' ? property.propertyType === 'Land' :
      selectedCategory === 'Apartment' ? property.propertyType === 'Apartment' :
      selectedCategory === 'Vehicle' ? ['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(property.propertyType || '') :
      selectedCategory === 'House' ? ['Villa', 'Independent House'].includes(property.propertyType || '') :
      selectedCategory === 'Commercial' ? ['Office', 'Hospital', 'Commercial Space'].includes(property.propertyType || '') :
      selectedCategory === 'Hostel' ? property.propertyType === 'Hostel' :
      selectedCategory === 'Hotel' ? property.propertyType === 'Hotel' : true;
    
    const matchesPropertyType = selectedPropertyType === 'All' ? true : property.propertyType === selectedPropertyType;
    
    let matchesDate = true;
    if (property.createdAt && selectedDateFilter !== 'All Time') {
      const propertyDate = new Date(property.createdAt);
      const now = new Date();
      const diffDays = Math.ceil(Math.abs(now.getTime() - propertyDate.getTime()) / (1000 * 60 * 60 * 24));
      if (selectedDateFilter === 'Today') matchesDate = diffDays <= 1;
      else if (selectedDateFilter === 'Last 7 Days') matchesDate = diffDays <= 7;
      else if (selectedDateFilter === 'Last 30 Days') matchesDate = diffDays <= 30;
      else if (selectedDateFilter === 'Last 3 Months') matchesDate = diffDays <= 90;
    }
    
    const matchesRating = selectedRatingFilter === 'All Ratings' || 
      (property.rating && property.rating >= parseFloat(selectedRatingFilter.split('+')[0]));
    
    const matchesSearch = smartSearch(property, searchQuery);
    
    return matchesTab && matchesCategory && matchesPropertyType && matchesDate && matchesRating && matchesSearch;
  }));

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase().trim();
    
    if (lowerQuery === 'vehicle' || lowerQuery === 'vehicles') setSelectedCategory('Vehicle');
    else if (lowerQuery === 'house' || lowerQuery === 'houses' || lowerQuery === 'home' || lowerQuery === 'homes') setSelectedCategory('House');
    else if (lowerQuery === 'apartment' || lowerQuery === 'apartments') setSelectedCategory('Apartment');
    else if (lowerQuery === 'land') setSelectedCategory('Land');
    else if (lowerQuery === 'commercial') setSelectedCategory('Commercial');
    else if (lowerQuery === 'hostel' || lowerQuery === 'hostels') setSelectedCategory('Hostel');
    else if (lowerQuery === 'hotel' || lowerQuery === 'hotels') setSelectedCategory('Hotel');
  }, [searchQuery]);

  const handlePropertyTypeSelect = (propertyType: string) => {
    setSelectedPropertyType(propertyType);
    if (propertyType !== 'All') {
      const category = getCategoryFromPropertyType(propertyType);
      setSelectedCategory(category);
    }
  };

  const getCardDetails = (property: Property) => {
    const details = [];

    if (['Apartment', 'Villa', 'Independent House'].includes(property.propertyType || '')) {
      if (property.sqft) details.push({ icon: 'square-foot', text: `${property.sqft} sqft` });
      if (property.bhk) details.push({ icon: 'bed', text: property.bhk });
      if (property.furnishingType) details.push({ icon: 'weekend', text: property.furnishingType });
    } else if (['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(property.propertyType || '')) {
      if (property.year) details.push({ icon: 'calendar-today', text: property.year });
      if (property.distanceKm) details.push({ icon: 'speed', text: `${property.distanceKm} km` });
      if (property.itemCondition) details.push({ icon: 'verified', text: property.itemCondition === 'New Item' ? 'New' : 'Used' });
    } else if (property.propertyType === 'Land') {
      if (property.sqft) details.push({ icon: 'square-foot', text: `${property.sqft} sqft` });
      if (property.landType) details.push({ icon: 'landscape', text: property.landType });
    } else if (property.propertyType === 'Hostel') {
      if (property.totalRooms) details.push({ icon: 'meeting-room', text: `${property.totalRooms} rooms` });
      if (property.availableRooms) details.push({ icon: 'door-front', text: `${property.availableRooms} available` });
      if (property.foodIncluded === 'Yes') details.push({ icon: 'restaurant', text: 'Food incl.' });
    } else if (property.propertyType === 'Hotel') {
      if (property.hotelStarRating) details.push({ icon: 'star', text: `${property.hotelStarRating} Star` });
      if (property.totalRooms) details.push({ icon: 'meeting-room', text: `${property.totalRooms} rooms` });
    } else if (['Office', 'Hospital', 'Commercial Space'].includes(property.propertyType || '')) {
      if (property.sqft) details.push({ icon: 'square-foot', text: `${property.sqft} sqft` });
    }

    return details;
  };

  const FilterModal = ({ visible, onClose, options, selectedValue, onSelect, title }: any) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}><MaterialIcons name="close" size={24} color={colors.text} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option: string) => (
              <TouchableOpacity key={option}
                style={[styles.optionItem, selectedValue === option && styles.selectedOption]}
                onPress={() => { onSelect(option); onClose(); }}
              >
                <Text style={[styles.optionText, selectedValue === option && styles.selectedOptionText]}>{option}</Text>
                {selectedValue === option && <MaterialIcons name="check" size={20} color="#135bec" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const DeleteConfirmationModal = () => (
    <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => !isDeleting && setShowDeleteModal(false)}>
      <View style={styles.deleteOverlay}>
        <View style={styles.deleteModal}>
          <View style={styles.deleteIconContainer}>
            <MaterialIcons name="delete-forever" size={64} color="#ef4444" />
          </View>
          
          <Text style={styles.deleteTitle}>Delete Listing?</Text>
          
          <Text style={styles.deleteMessage}>
            Are you sure you want to delete this listing? This action cannot be undone.
          </Text>
          
          {propertyToDelete && (
            <View style={styles.deletePropertyInfo}>
              <Image source={{ uri: propertyToDelete.image }} style={styles.deletePropertyImage} />
              <View style={styles.deletePropertyDetails}>
                <Text style={styles.deletePropertyTitle} numberOfLines={1}>{propertyToDelete.title}</Text>
                <Text style={styles.deletePropertyPrice}>{propertyToDelete.price}</Text>
              </View>
            </View>
          )}

          <View style={styles.deleteActions}>
            <TouchableOpacity 
              style={[styles.deleteCancelButton, isDeleting && styles.disabledButton]}
              onPress={() => {
                if (!isDeleting) {
                  setShowDeleteModal(false);
                  setPropertyToDelete(null);
                }
              }}
              disabled={isDeleting}
            >
              <Text style={styles.deleteCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.deleteConfirmButton, isDeleting && styles.disabledButton]}
              onPress={handleDeleteListing}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.deleteConfirmText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0c10" />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Marketplace</Text>
          </View>
          <TouchableOpacity style={styles.sellButton} onPress={() => navigation.navigate('SellItem')}>
            <MaterialIcons name="add" size={16} color="#fff" />
            <Text style={styles.sellButtonText}>Sell/Rent</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0c10" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Marketplace</Text>
        </View>
        <TouchableOpacity style={styles.sellButton} onPress={() => navigation.navigate('SellItem')}>
          <MaterialIcons name="add" size={16} color="#fff" />
          <Text style={styles.sellButtonText}>Sell/Rent</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listingTypeSection}>
        <TouchableOpacity style={styles.listingTypeMainDropdown} onPress={() => setShowListingTypeModal(true)}>
          <View style={styles.listingTypeContent}>
            <MaterialIcons name={activeTab === 'buy' ? 'shopping-cart' : 'home'} size={20} color={colors.primary} />
            <Text style={styles.listingTypeMainText}>{activeTab === 'buy' ? 'Buy' : 'Rent'}</Text>
          </View>
          <MaterialIcons name="expand-more" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.filterPill} onPress={() => setShowPropertyTypeModal(true)}>
            <Text style={styles.filterText}>{selectedPropertyType === 'All' ? 'Property Type' : selectedPropertyType}</Text>
            <MaterialIcons name="expand-more" size={12} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterPill} onPress={() => setShowDateModal(true)}>
            <Text style={styles.filterText}>{selectedDateFilter === 'All Time' ? 'Updated Date' : selectedDateFilter}</Text>
            <MaterialIcons name="expand-more" size={12} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterPill} onPress={() => setShowRatingModal(true)}>
            <Text style={styles.filterText}>{selectedRatingFilter === 'All Ratings' ? 'Ratings' : selectedRatingFilter}</Text>
            <MaterialIcons name="expand-more" size={12} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterPill, isWishlistActive && { borderColor: '#ef4444', backgroundColor: colors.card }]}
            onPress={() => setIsWishlistActive(!isWishlistActive)}
          >
            <MaterialIcons 
              name={isWishlistActive ? "favorite" : "favorite-border"} 
              size={12} 
              color={isWishlistActive ? "#ef4444" : colors.text} 
            />
            <Text style={[styles.filterText, isWishlistActive && { color: '#ef4444' }]}>Wishlist</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#135bec" colors={['#135bec']} />}
      >
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search: vehicles, apartments, hotels, land..." 
            placeholderTextColor="#4b5563" 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationLeft}>
            <View style={styles.locationIconContainer}><MaterialIcons name="location-on" size={20} color="#135bec" /></View>
            <View>
              <Text style={styles.locationLabel}>CURRENT LOCATION</Text>
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {[
            { id: 'All', icon: 'apps', label: 'All' },
            { id: 'Hostel', icon: 'hotel', label: 'Hostel' },
            { id: 'Hotel', icon: 'domain', label: 'Hotel' },
            { id: 'Land', icon: 'landscape', label: 'Land' },
            { id: 'Apartment', icon: 'apartment', label: 'Apartment' },
            { id: 'Vehicle', icon: 'directions-car', label: 'Vehicle' },
            { id: 'Commercial', icon: 'business', label: 'Commercial' },
            { id: 'House', icon: 'home', label: 'House' },
          ].map((category) => (
            <TouchableOpacity key={category.id} style={[styles.categoryButton, selectedCategory === category.id && styles.activeCategoryButton]} onPress={() => setSelectedCategory(category.id)}>
              <MaterialIcons name={category.icon} size={18} color={selectedCategory === category.id ? '#fff' : '#94a3b8'} />
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.activeCategoryText]}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.propertiesHeader}>
          <Text style={styles.propertiesTitle}>{filteredProperties.length} Properties Near You</Text>
          <TouchableOpacity style={styles.sortContainer} onPress={() => setShowSortModal(true)}>
            <MaterialIcons name="tune" size={16} color="#94a3b8" />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name={isWishlistActive ? "favorite-border" : "search-off"} size={64} color="#232936" />
            <Text style={styles.emptyTitle}>{isWishlistActive ? "No Saved Items" : "No Properties Found"}</Text>
            <Text style={styles.emptySubtitle}>{isWishlistActive ? "Items you heart will appear here" : "Try adjusting your filters or search"}</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('SellItem')}>
              <Text style={styles.emptyButtonText}>Post a Listing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProperties.map((property) => {
              const cardDetails = getCardDetails(property);
              
              return (
                <TouchableOpacity key={property.id} style={styles.card} activeOpacity={0.85}
                  onPress={() => navigation.navigate('BuyerPage', { property })}
                >
                  <View style={styles.cardImage}>
                    <Image source={{ uri: property.image }} style={styles.image} />
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={(e) => toggleWishlist(property, e)}
                    >
                      <MaterialIcons 
                        name={wishlistIds.includes(property.id) ? "favorite" : "favorite-border"} 
                        size={18} 
                        color={wishlistIds.includes(property.id) ? "#ef4444" : "#fff"} 
                      />
                    </TouchableOpacity>
                    {property.isUserListing && (
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          setPropertyToDelete(property);
                          setShowDeleteModal(true);
                        }}
                      >
                        <MaterialIcons name="delete" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                    <View style={styles.topBadgesContainer}>
                      {property.listingType === 'buy' ? (
                        <View style={styles.saleBadge}><Text style={styles.saleBadgeText}>FOR SALE</Text></View>
                      ) : (
                        <View style={styles.rentBadge}>
                          <Text style={styles.rentBadgeText}>FOR RENT</Text>
                        </View>
                      )}
                      {property.images && property.images.length > 1 && (
                        <View style={styles.imageCountBadge}>
                          <MaterialIcons name="photo-library" size={12} color="#fff" />
                          <Text style={styles.imageCountText}>{property.images.length}</Text>
                        </View>
                      )}
                    </View>
                    {property.itemCondition && (
                      <View style={styles.conditionBadgeContainer}>
                        <View style={[styles.conditionBadge,
                          property.itemCondition === 'New Item' ? styles.newConditionBadge : styles.oldConditionBadge
                        ]}>
                          <Text style={styles.conditionBadgeText}>
                            {property.itemCondition === 'New Item' ? 'NEW' : 'USED'}
                          </Text>
                        </View>
                      </View>
                    )}
                    {property.rating && (
                      <View style={styles.ratingBadge}>
                        <MaterialIcons name="star" size={12} color="#fbbf24" />
                        <Text style={styles.ratingText}>{property.rating.toFixed(1)}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{property.title}</Text>
                    <Text style={styles.cardPrice}>
                      {property.price}
                      {property.listingType === 'rent' && property.propertyType === 'Hotel' && <Text style={styles.perMonthText}>/night</Text>}
                      {property.listingType === 'rent' && property.propertyType !== 'Hotel' && <Text style={styles.perMonthText}>/month</Text>}
                    </Text>
                    <View style={styles.locationRow}>
                      <MaterialIcons name="location-on" size={12} color="#64748b" />
                      <Text style={styles.locationDetailText} numberOfLines={1}>{property.location}</Text>
                    </View>
                    {cardDetails.length > 0 && (
                      <View style={styles.cardDetails}>
                        {cardDetails.slice(0, 3).map((detail, index) => (
                          <View key={index} style={styles.detailItem}>
                            <MaterialIcons name={detail.icon as any} size={12} color="#64748b" />
                            <Text style={styles.detailText}>{detail.text}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}><MaterialIcons name="home" size={24} color="#135bec" /><Text style={[styles.navText, styles.activeNavText]}>Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><MaterialIcons name="grid-view" size={24} color="#64748b" /><Text style={styles.navText}>Services</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><MaterialIcons name="account-balance-wallet" size={24} color="#64748b" /><Text style={styles.navText}>Wallet</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><MaterialIcons name="person" size={24} color="#64748b" /><Text style={styles.navText}>Profile</Text></TouchableOpacity>
      </View>

      <FilterModal visible={showListingTypeModal} onClose={() => setShowListingTypeModal(false)} options={['Buy', 'Rent']} selectedValue={activeTab === 'buy' ? 'Buy' : 'Rent'} onSelect={(v: string) => setActiveTab(v.toLowerCase() as any)} title="Select Listing Type" />
      <FilterModal 
        visible={showPropertyTypeModal} 
        onClose={() => setShowPropertyTypeModal(false)} 
        options={['All', 'Apartment', 'Villa', 'Independent House', 'Land', 'Bike', 'Car', 'Lorry', 'Auto', 'Bus', 'Office', 'Hospital', 'Commercial Space', 'Hostel', 'Hotel']} 
        selectedValue={selectedPropertyType} 
        onSelect={handlePropertyTypeSelect} 
        title="Select Property Type" 
      />
      <FilterModal visible={showDateModal} onClose={() => setShowDateModal(false)} options={['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months']} selectedValue={selectedDateFilter} onSelect={setSelectedDateFilter} title="Filter by Date" />
      <FilterModal visible={showRatingModal} onClose={() => setShowRatingModal(false)} options={['All Ratings', '4.5+ Stars', '4.0+ Stars', '3.5+ Stars', '3.0+ Stars']} selectedValue={selectedRatingFilter} onSelect={setSelectedRatingFilter} title="Filter by Rating" />
      <FilterModal visible={showSortModal} onClose={() => setShowSortModal(false)} options={['Newest First', 'Oldest First', 'Price: Low to High', 'Price: High to Low', 'Rating: High to Low', 'Rating: Low to High']} selectedValue={selectedSortOption} onSelect={setSelectedSortOption} title="Sort By" />
      <DeleteConfirmationModal />
    </SafeAreaView>
  );
};

export default Marketplace;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    headerTitle: { fontSize: 20, fontWeight: "800", color: colors.text },
    sellButton: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 5 },
    sellButtonText: { fontSize: 13, fontWeight: "700", color: colors.onPrimary ?? "#fff" },
    listingTypeSection: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
    listingTypeMainDropdown: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.card, borderWidth: 2, borderColor: colors.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
    listingTypeContent: { flexDirection: "row", alignItems: "center", gap: 10 },
    listingTypeMainText: { fontSize: 16, fontWeight: "800", color: colors.text, letterSpacing: 0.5 },
    filterContainer: { paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
    filterPill: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14.7, paddingVertical: 5, borderRadius: 16, marginRight: 6, gap: 4 },
    filterText: { fontSize: 10, fontWeight: "700", color: colors.text },
    content: { flex: 1 },
    searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16, marginBottom: 24, borderRadius: 12, paddingHorizontal: 12, borderColor: colors.border },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 12 },
    locationContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 24 },
    locationLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
    locationIconContainer: { backgroundColor: colors.primary + "1A", padding: 6, borderRadius: 8 },
    locationLabel: { fontSize: 10, fontWeight: "700", color: colors.subText, letterSpacing: 1 },
    locationText: { fontSize: 14, fontWeight: "800", color: colors.text },
    categoryScroll: { paddingHorizontal: 8, marginBottom: 32 },
    categoryButton: { flexDirection: "row", alignItems: "center", height: 40, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, borderRadius: 12, marginRight: 8, gap: 8 },
    activeCategoryButton: { backgroundColor: colors.primary, borderColor: colors.primary },
    categoryText: { fontSize: 12, fontWeight: "700", color: colors.subText },
    activeCategoryText: { color: colors.onPrimary ?? "#fff" },
    propertiesHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },
    propertiesTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
    sortContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
    sortText: { fontSize: 12, fontWeight: "700", color: colors.subText },
    emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 32 },
    emptyTitle: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 16, marginBottom: 8 },
    emptySubtitle: { fontSize: 14, fontWeight: "500", color: colors.subText, textAlign: "center", marginBottom: 24 },
    emptyButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    emptyButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },
    bottomNav: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: colors.background + "F2", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, paddingBottom: 24 },
    navItem: { alignItems: "center", gap: 4 },
    navText: { fontSize: 10, fontWeight: "700", color: colors.subText },
    activeNavText: { color: colors.primary },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
    modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "70%", paddingBottom: 24 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    modalTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
    optionsList: { paddingHorizontal: 16, paddingTop: 8 },
    optionItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    selectedOption: { backgroundColor: colors.primary + "1A" },
    optionText: { fontSize: 16, fontWeight: "500", color: colors.text },
    selectedOptionText: { color: colors.primary, fontWeight: "600" },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingBottom: 100 },
    card: { width: (width - 48) / 2, margin: 8 },
    cardImage: { width: '100%', aspectRatio: 4 / 5, borderRadius: 16, overflow: 'hidden', position: 'relative', marginBottom: 8 },
    image: { width: '100%', height: '100%' },
    favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: 6, borderRadius: 20 },
    deleteButton: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(239, 68, 68, 0.95)', padding: 6, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
    ratingBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
    ratingText: { fontSize: 10, fontWeight: '700', color: '#fff' },
    imageCountBadge: { backgroundColor: 'rgba(0, 0, 0, 0.7)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
    imageCountText: { fontSize: 10, fontWeight: '700', color: '#fff' },
    cardContent: { paddingHorizontal: 4 },
    cardTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
    cardPrice: { fontSize: 16, fontWeight: '800', color: '#135bec', marginBottom: 4 },
    cardDetails: { flexDirection: 'row', gap: 12, marginBottom: 4, flexWrap: 'wrap' },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    detailText: { fontSize: 10, fontWeight: '500', color: '#64748b' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    locationDetailText: { fontSize: 10, fontWeight: '500', color: '#64748b', flex: 1 },
    topBadgesContainer: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', gap: 6 },
    conditionBadgeContainer: { position: 'absolute', top: 42, left: 8 },
    saleBadge: { backgroundColor: '#135bec', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    saleBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
    rentBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    rentBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
    conditionBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
    newConditionBadge: { backgroundColor: '#10b981' },
    oldConditionBadge: { backgroundColor: '#6b7280' },
    conditionBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },
    perMonthText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    deleteOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    deleteModal: { backgroundColor: '#161b26', borderRadius: 24, padding: 24, width: '100%', maxWidth: 400 },
    deleteIconContainer: { alignItems: 'center', marginBottom: 20 },
    deleteTitle: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 12 },
    deleteMessage: { fontSize: 15, fontWeight: '500', color: '#94a3b8', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    deletePropertyInfo: { flexDirection: 'row', backgroundColor: '#0f1419', borderRadius: 12, padding: 12, marginBottom: 24, gap: 12 },
    deletePropertyImage: { width: 80, height: 80, borderRadius: 8 },
    deletePropertyDetails: { flex: 1, justifyContent: 'center' },
    deletePropertyTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
    deletePropertyPrice: { fontSize: 16, fontWeight: '800', color: '#135bec' },
    deleteActions: { flexDirection: 'row', gap: 12 },
    deleteCancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#232936', borderWidth: 1, borderColor: '#2d3748', alignItems: 'center' },
    deleteCancelText: { fontSize: 15, fontWeight: '700', color: '#cbd5e1', letterSpacing: 0.3 },
    deleteConfirmButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center' },
    deleteConfirmText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
    disabledButton: { opacity: 0.5 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
    loadingText: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 12 },
  });