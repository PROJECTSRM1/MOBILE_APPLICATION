import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image,
  Dimensions, StatusBar, Platform, RefreshControl, Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get('window');

interface Property {
  id: string; title?: string; price: string; image?: string; images?: string[];
  rating?: number; distance?: string; type?: string; propertyType?: string;
  isNew?: boolean; isFavorite?: boolean; listingType: 'buy' | 'rent';
  description?: string; sqft?: string; bhk?: string; location?: string; area?: string;
  furnishingType?: string; landType?: string; ownerName?: string; brand?: string;
  model?: string; year?: string; mobileNumber?: string; createdAt?: string;
  itemCondition?: string; registrationStatus?: string; marketValue?: string;
}

const getDummyData = (): Property[] => [
  { id: 'dummy_1', title: '3 BHK Apartment in Downtown', price: '₹85,00,000', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500'], rating: 4.8, distance: '1.2 km away', propertyType: 'Apartment', listingType: 'buy', sqft: '1450', bhk: '3 BHK', location: '123 Park Avenue, Downtown', area: 'Downtown', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'dummy_2', title: '2 BHK Apartment in Suburb', price: '₹18,000/month', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'], rating: 4.5, distance: '2.8 km away', propertyType: 'Apartment', listingType: 'rent', sqft: '1100', bhk: '2 BHK', location: '45 Green Valley, Suburb', area: 'Green Valley', furnishingType: 'Semi', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'dummy_3', title: 'Honda City 2022', price: '₹12,50,000', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500', images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'], rating: 4.7, distance: '3.5 km away', propertyType: 'Car', listingType: 'buy', brand: 'Honda', model: 'City', year: '2022', ownerName: 'Rajesh Kumar', mobileNumber: '+91 98765 43210', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'dummy_4', title: 'Villa in Greenfield Estate', price: '₹1,85,00,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500'], rating: 4.9, distance: '4.2 km away', propertyType: 'Villa', listingType: 'buy', sqft: '3200', bhk: '4 BHK', location: 'Plot 12, Greenfield Estate', area: 'Greenfield', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'dummy_5', title: 'Commercial Land in Industrial Hub', price: '₹2,50,00,000', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500'], rating: 4.6, distance: '8.1 km away', propertyType: 'Land', listingType: 'buy', sqft: '10000', landType: 'Commercial', location: 'Sector 5, Industrial Area', area: 'Industrial Hub', ownerName: 'Suresh Enterprises', marketValue: '2,50,00,000', registrationStatus: 'registered', itemCondition: 'New Item', createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'dummy_6', title: 'Royal Enfield Classic 350', price: '₹1,45,000', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500', images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500'], rating: 4.4, distance: '1.9 km away', propertyType: 'Bike', listingType: 'buy', brand: 'Royal Enfield', model: 'Classic 350', year: '2021', ownerName: 'Amit Sharma', mobileNumber: '+91 98123 45678', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'dummy_7', title: 'Independent House in Riverside', price: '₹45,000/month', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500'], rating: 4.7, distance: '5.3 km away', propertyType: 'Independent House', listingType: 'rent', sqft: '2200', bhk: '3 BHK', location: '78 River Road, Riverside', area: 'Riverside', furnishingType: 'Unfurnished', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'dummy_8', title: 'Office Space in Business District', price: '₹75,000/month', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=500'], rating: 4.8, distance: '6.7 km away', propertyType: 'Office', listingType: 'rent', sqft: '1800', location: 'Tower B, Tech Park', area: 'Business District', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'dummy_9', title: 'Maruti Suzuki Swift 2023', price: '₹7,85,000', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500', images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500'], rating: 4.9, distance: '2.4 km away', propertyType: 'Car', listingType: 'buy', brand: 'Maruti Suzuki', model: 'Swift', year: '2023', ownerName: 'Priya Singh', mobileNumber: '+91 99876 54321', itemCondition: 'New Item', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'dummy_10', title: 'Agriculture Land in Rural Area', price: '₹45,00,000', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'], rating: 4.3, distance: '15.2 km away', propertyType: 'Land', listingType: 'buy', sqft: '43560', landType: 'Agriculture', location: 'Village Road, Rural District', area: 'Countryside', ownerName: 'Ramesh Patel', marketValue: '45,00,000', registrationStatus: 'registered', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 'dummy_11', title: '1 BHK Apartment in City Center', price: '₹12,000/month', image: 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=500', images: ['https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=500'], rating: 4.5, distance: '0.8 km away', propertyType: 'Apartment', listingType: 'rent', sqft: '650', bhk: '1 BHK', location: '12 Main Street, City Center', area: 'City Center', furnishingType: 'Semi', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'dummy_12', title: 'Tata Ace Lorry 2020', price: '₹4,25,000', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500', images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500'], rating: 4.2, distance: '7.6 km away', propertyType: 'Lorry', listingType: 'buy', brand: 'Tata', model: 'Ace', year: '2020', ownerName: 'Vijay Transport', mobileNumber: '+91 97654 32109', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'dummy_13', title: '4 BHK Villa in Luxury Enclave', price: '₹95,000/month', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500', images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500'], rating: 4.9, distance: '9.4 km away', propertyType: 'Villa', listingType: 'rent', sqft: '3800', bhk: '4 BHK', location: 'Villa 7, Luxury Enclave', area: 'Posh Area', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'dummy_14', title: 'Bajaj Pulsar NS200', price: '₹95,000', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500', images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500'], rating: 4.6, distance: '3.1 km away', propertyType: 'Bike', listingType: 'buy', brand: 'Bajaj', model: 'Pulsar NS200', year: '2022', ownerName: 'Rohan Verma', mobileNumber: '+91 98234 56789', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'dummy_15', title: 'Commercial Space in Mall', price: '₹1,25,00,000', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'], rating: 4.7, distance: '5.9 km away', propertyType: 'Commercial Space', listingType: 'buy', sqft: '2500', location: 'Shop 23, Metro Mall', area: 'Shopping District', itemCondition: 'New Item', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'dummy_16', title: 'Hyundai Creta 2021', price: '₹14,50,000', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500', images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500'], rating: 4.8, distance: '4.3 km away', propertyType: 'Car', listingType: 'buy', brand: 'Hyundai', model: 'Creta', year: '2021', ownerName: 'Anjali Mehta', mobileNumber: '+91 96543 21098', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 'dummy_17', title: '2 BHK Independent House in Suburb', price: '₹62,00,000', image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=500', images: ['https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=500'], rating: 4.4, distance: '6.8 km away', propertyType: 'Independent House', listingType: 'buy', sqft: '1600', bhk: '2 BHK', location: '34 Garden Lane, Suburb', area: 'Garden Colony', furnishingType: 'Unfurnished', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: 'dummy_18', title: 'Hospital Building for Rent', price: '₹2,50,000/month', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500', images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500'], rating: 4.6, distance: '11.2 km away', propertyType: 'Hospital', listingType: 'rent', sqft: '8500', location: 'Medical District, Hospital Road', area: 'Medical Hub', itemCondition: 'New Item', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'dummy_19', title: 'TVS Jupiter Scooter', price: '₹52,000', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500', images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500'], rating: 4.3, distance: '2.7 km away', propertyType: 'Bike', listingType: 'buy', brand: 'TVS', model: 'Jupiter', year: '2020', ownerName: 'Sneha Reddy', mobileNumber: '+91 95432 10987', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 11 * 86400000).toISOString() },
  { id: 'dummy_20', title: '3 BHK Apartment in Tech Park Area', price: '₹35,000/month', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500'], rating: 4.7, distance: '3.9 km away', propertyType: 'Apartment', listingType: 'rent', sqft: '1550', bhk: '3 BHK', location: 'Apartment 305, Tech Towers', area: 'Tech Park', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
];

const Marketplace = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [location, setLocation] = useState('Near Hyderabad, Telangana');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showListingTypeModal, setShowListingTypeModal] = useState(false);
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Time');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All Ratings');
  const { colors } = useTheme();
  const styles = getStyles(colors) as any;
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
      let userListings: Property[] = [];
      
      if (storedListings) {
        const parsedListings = JSON.parse(storedListings);
        const verifiedListings = parsedListings.filter((listing: any) => listing.isVerified === true);
        
        userListings = verifiedListings.map((listing: any) => {
          const isNew = listing.createdAt && 
            (new Date().getTime() - new Date(listing.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
          
          let title = '';
          if (['Apartment', 'Villa', 'Independent House'].includes(listing.propertyType)) {
            title = `${listing.bhk || ''} ${listing.propertyType} in ${listing.area || 'Unknown'}`;
          } else if (listing.propertyType === 'Land') {
            title = `${listing.landType || ''} Land in ${listing.area || 'Unknown'}`;
          } else if (['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(listing.propertyType)) {
            title = `${listing.brand || ''} ${listing.model || ''} ${listing.year || ''}`.trim();
          } else {
            title = `${listing.propertyType} in ${listing.area || 'Unknown'}`;
          }

          return {
            id: listing.id, title: title || listing.propertyType,
            price: `₹${parseFloat(listing.price).toLocaleString('en-IN')}`,
            image: listing.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
            images: listing.images, rating: 4.5 + Math.random() * 0.5,
            distance: `${(Math.random() * 5).toFixed(1)} km away`,
            type: listing.propertyType, propertyType: listing.propertyType,
            listingType: listing.type, isNew, isFavorite: false,
            description: listing.description, sqft: listing.sqft, bhk: listing.bhk,
            location: listing.location, area: listing.area, furnishingType: listing.furnishingType,
            landType: listing.landType, ownerName: listing.ownerName, brand: listing.brand,
            model: listing.model, year: listing.year, mobileNumber: listing.mobileNumber,
            createdAt: listing.createdAt, itemCondition: listing.itemCondition,
            registrationStatus: listing.registrationStatus, marketValue: listing.marketValue,
          };
        });
      }

      const allListings = [...getDummyData(), ...userListings];
      setProperties(allListings);
    } catch (error) {
      console.error('Error loading listings:', error);
      setProperties(getDummyData());
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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'User-Agent': 'MarketplaceApp/1.0', 'Accept': 'application/json' } }
          );
          const data = await response.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.village || 'Your Area';
          const state = data?.address?.state || '';
          setLocation(`Near ${city}, ${state}`);
        } catch (error) {
          setLocation('Location detected');
        }
      },
      () => setLocation('Location unavailable'),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const filteredProperties = properties.filter((property) => {
    const matchesTab = property.listingType === activeTab;
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory === 'Land' && property.propertyType === 'Land') ||
      (selectedCategory === 'Apartment' && property.propertyType === 'Apartment') ||
      (selectedCategory === 'Vehicle' && ['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(property.propertyType || '')) ||
      (selectedCategory === 'House' && ['Villa', 'Independent House'].includes(property.propertyType || '')) ||
      (selectedCategory === 'Commercial' && ['Office', 'Hospital', 'Commercial Space'].includes(property.propertyType || ''));
    
    const matchesPropertyType = selectedPropertyType === 'All' || property.propertyType === selectedPropertyType;
    
    let matchesDate = true;
    if (property.createdAt && selectedDateFilter !== 'All Time') {
      const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(property.createdAt).getTime()) / 86400000);
      matchesDate = (selectedDateFilter === 'Today' && diffDays <= 1) ||
                   (selectedDateFilter === 'Last 7 Days' && diffDays <= 7) ||
                   (selectedDateFilter === 'Last 30 Days' && diffDays <= 30) ||
                   (selectedDateFilter === 'Last 3 Months' && diffDays <= 90);
    }
    
    const matchesRating = selectedRatingFilter === 'All Ratings' || 
      (property.rating && property.rating >= parseFloat(selectedRatingFilter.split('+')[0]));
    
    const matchesSearch = searchQuery === '' || 
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const FilterModal = ({ visible, onClose, options, selectedValue, onSelect, title }: any) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option: string) => (
              <TouchableOpacity key={option}
                style={[styles.optionItem, selectedValue === option && styles.selectedOption]}
                onPress={() => { onSelect(option); onClose(); }}
              >
                <Text style={[styles.optionText, selectedValue === option && styles.selectedOptionText]}>
                  {option}
                </Text>
                {selectedValue === option && <MaterialIcons name="check" size={20} color="#135bec" />}
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
          <TouchableOpacity style={styles.listingTypeDropdown} onPress={() => setShowListingTypeModal(true)}>
            <Text style={styles.listingTypeText}>{activeTab === 'buy' ? 'Buy' : 'Rent'}</Text>
            <MaterialIcons name="expand-more" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sellButton} onPress={() => navigation.navigate('SellItem')}>
          <MaterialIcons name="add" size={16} color="#fff" />
          <Text style={styles.sellButtonText}>Sell/Rent</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.filterPill} onPress={() => setShowPropertyTypeModal(true)}>
            <Text style={styles.filterText}>
              {selectedPropertyType === 'All' ? 'Property Type' : selectedPropertyType}
            </Text>
            <MaterialIcons name="expand-more" size={14} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill} onPress={() => setShowDateModal(true)}>
            <Text style={styles.filterText}>
              {selectedDateFilter === 'All Time' ? 'Updated Date' : selectedDateFilter}
            </Text>
            <MaterialIcons name="expand-more" size={14} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill} onPress={() => setShowRatingModal(true)}>
            <Text style={styles.filterText}>
              {selectedRatingFilter === 'All Ratings' ? 'Ratings' : selectedRatingFilter}
            </Text>
            <MaterialIcons name="expand-more" size={14} color={colors.text} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#135bec" colors={['#135bec']} />}
      >
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search homes, cars, land..."
            placeholderTextColor="#4b5563" value={searchQuery} onChangeText={setSearchQuery} />
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
            <TouchableOpacity key={category.id}
              style={[styles.categoryButton, selectedCategory === category.id && styles.activeCategoryButton]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialIcons name={category.icon} size={18}
                color={selectedCategory === category.id ? '#fff' : '#94a3b8'} />
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.activeCategoryText]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.propertiesHeader}>
          <Text style={styles.propertiesTitle}>{filteredProperties.length} Properties Near You</Text>
          <View style={styles.sortContainer}>
            <MaterialIcons name="tune" size={16} color="#94a3b8" />
            <Text style={styles.sortText}>Sort</Text>
          </View>
        </View>

        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color="#232936" />
            <Text style={styles.emptyTitle}>No Properties Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('SellItem')}>
              <Text style={styles.emptyButtonText}>Post a Listing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProperties.map((property) => (
              <TouchableOpacity key={property.id} style={styles.card} activeOpacity={0.85}
                onPress={() => navigation.navigate('BuyerPage', { property })}
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
                      <View style={[styles.conditionBadge,
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
                  <Text style={styles.cardTitle} numberOfLines={1}>{property.title}</Text>
                  <Text style={styles.cardPrice}>{property.price}</Text>
                  {property.location && (
                    <View style={styles.locationRow}>
                      <MaterialIcons name="location-on" size={12} color="#64748b" />
                      <Text style={styles.locationDetailText} numberOfLines={1}>{property.location}</Text>
                    </View>
                  )}
                  {property.area && (
                    <View style={styles.areaRow}>
                      <MaterialIcons name="place" size={12} color="#64748b" />
                      <Text style={styles.areaDetailText} numberOfLines={1}>{property.area}</Text>
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

      <FilterModal visible={showListingTypeModal} onClose={() => setShowListingTypeModal(false)}
        options={['Buy', 'Rent']} selectedValue={activeTab === 'buy' ? 'Buy' : 'Rent'}
        onSelect={(v: string) => setActiveTab(v.toLowerCase() as 'buy' | 'rent')} title="Select Listing Type" />
      
      <FilterModal visible={showPropertyTypeModal} onClose={() => setShowPropertyTypeModal(false)}
        options={['All', 'Apartment', 'Villa', 'Independent House', 'Land', 'Bike', 'Car', 'Lorry', 'Auto', 'Bus', 'Office', 'Hospital', 'Commercial Space']}
        selectedValue={selectedPropertyType} onSelect={setSelectedPropertyType} title="Select Property Type" />
      
      <FilterModal visible={showDateModal} onClose={() => setShowDateModal(false)}
        options={['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months']}
        selectedValue={selectedDateFilter} onSelect={setSelectedDateFilter} title="Filter by Date" />
      
      <FilterModal visible={showRatingModal} onClose={() => setShowRatingModal(false)}
        options={['All Ratings', '4.5+ Stars', '4.0+ Stars', '3.5+ Stars', '3.0+ Stars']}
        selectedValue={selectedRatingFilter} onSelect={setSelectedRatingFilter} title="Filter by Rating" />
    </SafeAreaView>
  );
};

export default Marketplace;

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  listingTypeDropdown: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 4 },
  listingTypeText: { fontSize: 12, fontWeight: "700", color: colors.text },
  sellButton: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4 },
  sellButtonText: { fontSize: 12, fontWeight: "700", color: colors.onPrimary ?? "#fff" },
  filterContainer: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterPill: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, gap: 6 },
  filterText: { fontSize: 11, fontWeight: "700", color: colors.text },
  content: { flex: 1 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16, marginBottom: 24, borderRadius: 12, paddingHorizontal: 12, borderColor: colors.border },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 12 },
  locationContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 24 },
  locationLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  locationIconContainer: { backgroundColor: colors.primary + "1A", padding: 6, borderRadius: 8 },
  locationLabel: { fontSize: 10, fontWeight: "700", color: colors.subText, letterSpacing: 1 },
  locationText: { fontSize: 14, fontWeight: "800", color: colors.text },
  changeText: { fontSize: 11, fontWeight: "700", color: colors.primary },
  categoryScroll: { paddingHorizontal: 16, marginBottom: 32 },
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
  emptyButtonText: { fontSize: 14, fontWeight: "700", color: colors.onPrimary ?? "#fff" },
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
  favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 6, borderRadius: 20 },
  topBadgesContainer: { position: 'absolute', top: 8, left: 8, gap: 6 },
  saleBadge: { backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  saleBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  rentBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  rentBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  conditionBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  newConditionBadge: { backgroundColor: '#3b82f6' },
  oldConditionBadge: { backgroundColor: '#64748b' },
  conditionBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  ratingBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  ratingText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  cardContent: { paddingHorizontal: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#135bec', marginBottom: 4 },
  cardDetails: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 10, fontWeight: '500', color: '#64748b' },
  distanceContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distanceText: { fontSize: 10, fontWeight: '500', color: '#64748b' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  locationDetailText: { fontSize: 10, fontWeight: '500', color: '#64748b', flex: 1 },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  areaDetailText: { fontSize: 10, fontWeight: '500', color: '#64748b', flex: 1 },
});