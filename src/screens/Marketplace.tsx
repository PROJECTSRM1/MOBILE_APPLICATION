import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image,
  Dimensions, StatusBar, Platform, RefreshControl, Modal, Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../context/ThemeContext";

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
}

const getDummyData = (): Property[] => [
  { id: 'dummy_1', title: '3 BHK Apartment in Gachibowli', price: '₹85,00,000', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500'], rating: 4.8, distance: '1.2 km away', propertyType: 'Apartment', listingType: 'buy', sqft: '1450', bhk: '3 BHK', location: '123 Park Avenue, Gachibowli, Hyderabad', area: 'Gachibowli', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'dummy_2', title: '2 BHK Apartment in Madhapur', price: '₹18,000', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'], rating: 4.5, distance: '2.8 km away', propertyType: 'Apartment', listingType: 'rent', sqft: '1100', bhk: '2 BHK', location: '45 Green Valley, Madhapur, Hyderabad', area: 'Madhapur', furnishingType: 'Semi', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'dummy_3', title: 'Honda City 2022', price: '₹12,50,000', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500', images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'], rating: 4.7, distance: '3.5 km away', propertyType: 'Car', listingType: 'buy', brand: 'Honda', model: 'City', year: '2022', ownerName: 'Rajesh Kumar', mobileNumber: '+91 98765 43210', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 86400000).toISOString(), location: 'Kondapur, Hyderabad', area: 'Kondapur' },
  { id: 'dummy_4', title: 'Villa in Jubilee Hills', price: '₹1,85,00,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500'], rating: 4.9, distance: '4.2 km away', propertyType: 'Villa', listingType: 'buy', sqft: '3200', bhk: '4 BHK', location: 'Plot 12, Road No 45, Jubilee Hills, Hyderabad', area: 'Jubilee Hills', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'dummy_5', title: 'Commercial Land in Patancheru', price: '₹2,50,00,000', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500'], rating: 4.6, distance: '8.1 km away', propertyType: 'Land', listingType: 'buy', sqft: '10000', landType: 'Commercial', location: 'Sector 5, IDA Patancheru, Hyderabad', area: 'Patancheru', ownerName: 'Suresh Enterprises', marketValue: '2,50,00,000', registrationStatus: 'registered', itemCondition: 'New Item', createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'dummy_6', title: 'Royal Enfield Classic 350', price: '₹1,45,000', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500', images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500'], rating: 4.4, distance: '1.9 km away', propertyType: 'Bike', listingType: 'buy', brand: 'Royal Enfield', model: 'Classic 350', year: '2021', ownerName: 'Amit Sharma', mobileNumber: '+91 98123 45678', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), location: 'Hitech City, Hyderabad', area: 'Hitech City' },
  { id: 'dummy_7', title: 'Independent House in Banjara Hills', price: '₹45,000', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500'], rating: 4.7, distance: '5.3 km away', propertyType: 'Independent House', listingType: 'rent', sqft: '2200', bhk: '3 BHK', location: '78 Road No 12, Banjara Hills, Hyderabad', area: 'Banjara Hills', furnishingType: 'Unfurnished', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'dummy_8', title: 'Office Space in Financial District', price: '₹75,000', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=500'], rating: 4.8, distance: '6.7 km away', propertyType: 'Office', listingType: 'rent', sqft: '1800', location: 'Tower B, Nanakramguda, Financial District, Hyderabad', area: 'Financial District', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'dummy_9', title: 'Maruti Suzuki Swift 2023', price: '₹7,85,000', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500', images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500'], rating: 4.9, distance: '2.4 km away', propertyType: 'Car', listingType: 'buy', brand: 'Maruti Suzuki', model: 'Swift', year: '2023', ownerName: 'Priya Singh', mobileNumber: '+91 99876 54321', itemCondition: 'New Item', createdAt: new Date(Date.now() - 86400000).toISOString(), location: 'Kukatpally, Hyderabad', area: 'Kukatpally' },
  { id: 'dummy_10', title: 'Agriculture Land in Shamshabad', price: '₹45,00,000', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'], rating: 4.3, distance: '15.2 km away', propertyType: 'Land', listingType: 'buy', sqft: '43560', landType: 'Agriculture', location: 'Survey No 234, Shamshabad, Hyderabad', area: 'Shamshabad', ownerName: 'Ramesh Patel', marketValue: '45,00,000', registrationStatus: 'registered', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 'dummy_11', title: '1 BHK Apartment in Ameerpet', price: '₹12,000', image: 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=500', images: ['https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=500'], rating: 4.5, distance: '0.8 km away', propertyType: 'Apartment', listingType: 'rent', sqft: '650', bhk: '1 BHK', location: '12 SR Nagar Main Road, Ameerpet, Hyderabad', area: 'Ameerpet', furnishingType: 'Semi', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'dummy_12', title: 'Tata Ace Lorry 2020', price: '₹4,25,000', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500', images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500'], rating: 4.2, distance: '7.6 km away', propertyType: 'Lorry', listingType: 'buy', brand: 'Tata', model: 'Ace', year: '2020', ownerName: 'Vijay Transport', mobileNumber: '+91 97654 32109', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 12 * 86400000).toISOString(), location: 'LB Nagar, Hyderabad', area: 'LB Nagar' },
  { id: 'dummy_13', title: '4 BHK Villa in Kokapet', price: '₹95,000', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500', images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500'], rating: 4.9, distance: '9.4 km away', propertyType: 'Villa', listingType: 'rent', sqft: '3800', bhk: '4 BHK', location: 'Villa 7, Aparna Zenon, Kokapet, Hyderabad', area: 'Kokapet', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'dummy_14', title: 'Bajaj Pulsar NS200', price: '₹95,000', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500', images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500'], rating: 4.6, distance: '3.1 km away', propertyType: 'Bike', listingType: 'buy', brand: 'Bajaj', model: 'Pulsar NS200', year: '2022', ownerName: 'Rohan Verma', mobileNumber: '+91 98234 56789', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), location: 'Dilsukhnagar, Hyderabad', area: 'Dilsukhnagar' },
  { id: 'dummy_15', title: 'Commercial Space in Begumpet', price: '₹1,25,00,000', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'], rating: 4.7, distance: '5.9 km away', propertyType: 'Commercial Space', listingType: 'buy', sqft: '2500', location: 'Shop 23, Paradise Circle, Begumpet, Hyderabad', area: 'Begumpet', itemCondition: 'New Item', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'dummy_16', title: 'Hyundai Creta 2021', price: '₹14,50,000', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500', images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500'], rating: 4.8, distance: '4.3 km away', propertyType: 'Car', listingType: 'buy', brand: 'Hyundai', model: 'Creta', year: '2021', ownerName: 'Anjali Mehta', mobileNumber: '+91 96543 21098', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 9 * 86400000).toISOString(), location: 'Miyapur, Hyderabad', area: 'Miyapur' },
  { id: 'dummy_17', title: '2 BHK Independent House in Uppal', price: '₹62,00,000', image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=500', images: ['https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=500'], rating: 4.4, distance: '6.8 km away', propertyType: 'Independent House', listingType: 'buy', sqft: '1600', bhk: '2 BHK', location: '34 Garden Lane, Uppal, Hyderabad', area: 'Uppal', furnishingType: 'Unfurnished', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: 'dummy_18', title: 'Hospital Building in Secunderabad', price: '₹2,50,000', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500', images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500'], rating: 4.6, distance: '11.2 km away', propertyType: 'Hospital', listingType: 'rent', sqft: '8500', location: 'MG Road, Secunderabad, Hyderabad', area: 'Secunderabad', itemCondition: 'New Item', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'dummy_19', title: 'TVS Jupiter Scooter', price: '₹52,000', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500', images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500'], rating: 4.3, distance: '2.7 km away', propertyType: 'Bike', listingType: 'buy', brand: 'TVS', model: 'Jupiter', year: '2020', ownerName: 'Sneha Reddy', mobileNumber: '+91 95432 10987', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 11 * 86400000).toISOString(), location: 'Kompally, Hyderabad', area: 'Kompally' },
  { id: 'dummy_20', title: '3 BHK Apartment in Manikonda', price: '₹35,000', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500'], rating: 4.7, distance: '3.9 km away', propertyType: 'Apartment', listingType: 'rent', sqft: '1550', bhk: '3 BHK', location: 'Apartment 305, My Home Bhooja, Manikonda, Hyderabad', area: 'Manikonda', furnishingType: 'Full', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  
  // HOSTEL DUMMY DATA
  { id: 'hostel_1', title: 'Boys Hostel in Kukatpally', price: '₹8,500', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500', images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500'], rating: 4.5, distance: '1.5 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '25', availableRooms: '8', hostelType: 'Boys', foodIncluded: 'Yes', hasAC: true, hasWifi: true, hasTV: false, hasLaundry: true, hasParking: true, hasSecurity: true, location: '45 KPHB Colony, Kukatpally, Hyderabad', area: 'Kukatpally', itemCondition: 'New Item', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'hostel_2', title: 'Girls Hostel in Gachibowli', price: '₹10,000', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500'], rating: 4.8, distance: '0.8 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '30', availableRooms: '12', hostelType: 'Girls', foodIncluded: 'Yes', hasAC: true, hasWifi: true, hasTV: true, hasLaundry: true, hasParking: true, hasSecurity: true, location: '12 Vinayak Nagar, Gachibowli, Hyderabad', area: 'Gachibowli', itemCondition: 'New Item', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'hostel_3', title: 'Co-living Hostel in Madhapur', price: '₹9,000', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500'], rating: 4.6, distance: '2.1 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '40', availableRooms: '15', hostelType: 'Co-living', foodIncluded: 'No', hasAC: false, hasWifi: true, hasTV: false, hasLaundry: false, hasParking: true, hasSecurity: true, location: '23 Kavuri Hills, Madhapur, Hyderabad', area: 'Madhapur', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'hostel_4', title: 'Boys PG in Ameerpet', price: '₹7,500', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'], rating: 4.3, distance: '1.2 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '20', availableRooms: '6', hostelType: 'Boys', foodIncluded: 'Yes', hasAC: false, hasWifi: true, hasTV: false, hasLaundry: true, hasParking: false, hasSecurity: true, location: '56 Punjagutta Main Road, Ameerpet, Hyderabad', area: 'Ameerpet', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'hostel_5', title: 'Girls PG in Hitech City', price: '₹11,000', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500'], rating: 4.9, distance: '0.5 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '18', availableRooms: '4', hostelType: 'Girls', foodIncluded: 'Yes', hasAC: true, hasWifi: true, hasTV: true, hasLaundry: true, hasParking: true, hasSecurity: true, location: '78 Cyber Towers Road, Hitech City, Hyderabad', area: 'Hitech City', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'hostel_6', title: 'Student Hostel in Dilsukhnagar', price: '₹6,500', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500', images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500'], rating: 4.2, distance: '3.5 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '35', availableRooms: '10', hostelType: 'Co-living', foodIncluded: 'No', hasAC: false, hasWifi: true, hasTV: false, hasLaundry: false, hasParking: false, hasSecurity: true, location: '90 Moosarambagh, Dilsukhnagar, Hyderabad', area: 'Dilsukhnagar', itemCondition: 'Old Item', createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'hostel_7', title: 'Premium Boys Hostel in Kondapur', price: '₹12,000', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'], rating: 4.7, distance: '2.8 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '22', availableRooms: '5', hostelType: 'Boys', foodIncluded: 'Yes', hasAC: true, hasWifi: true, hasTV: true, hasLaundry: true, hasParking: true, hasSecurity: true, location: '34 Botanical Garden Road, Kondapur, Hyderabad', area: 'Kondapur', itemCondition: 'New Item', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'hostel_8', title: 'Working Women Hostel in Banjara Hills', price: '₹13,500', image: 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=500', images: ['https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=500'], rating: 4.8, distance: '4.2 km away', propertyType: 'Hostel', listingType: 'rent', totalRooms: '15', availableRooms: '3', hostelType: 'Girls', foodIncluded: 'Yes', hasAC: true, hasWifi: true, hasTV: true, hasLaundry: true, hasParking: true, hasSecurity: true, location: 'Road No 3, Banjara Hills, Hyderabad', area: 'Banjara Hills', itemCondition: 'New Item', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  
  // HOTEL DUMMY DATA
  { id: 'hotel_1', title: 'Taj Krishna Hotel', price: '₹8,500', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500'], rating: 4.9, distance: '5.2 km away', propertyType: 'Hotel', listingType: 'rent', hotelName: 'Taj Krishna', hotelStarRating: '5', totalRooms: '260', availableRooms: '45', checkInTime: '2:00 PM', checkOutTime: '12:00 PM', roomTypes: ['Deluxe', 'Premium', 'Suite'], hasRestaurant: true, hasGym: true, hasPool: true, hasSpa: true, hasConferenceRoom: true, hasWifi: true, hasParking: true, petFriendly: false, cancellationPolicy: 'Free cancellation up to 24 hours before check-in', location: 'Road No 1, Banjara Hills, Hyderabad', area: 'Banjara Hills', itemCondition: 'New Item', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'hotel_2', title: 'Novotel Hyderabad Convention Centre', price: '₹6,000', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'], rating: 4.7, distance: '3.8 km away', propertyType: 'Hotel', listingType: 'rent', hotelName: 'Novotel', hotelStarRating: '5', totalRooms: '287', availableRooms: '62', checkInTime: '3:00 PM', checkOutTime: '11:00 AM', roomTypes: ['Standard', 'Executive', 'Suite'], hasRestaurant: true, hasGym: true, hasPool: true, hasSpa: true, hasConferenceRoom: true, hasWifi: true, hasParking: true, petFriendly: false, cancellationPolicy: 'Free cancellation up to 48 hours before check-in', location: 'Hitech City, Hyderabad', area: 'Hitech City', itemCondition: 'New Item', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'hotel_3', title: 'Lemon Tree Hotel', price: '₹3,500', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500'], rating: 4.4, distance: '2.1 km away', propertyType: 'Hotel', listingType: 'rent', hotelName: 'Lemon Tree Hotel', hotelStarRating: '4', totalRooms: '102', availableRooms: '28', checkInTime: '2:00 PM', checkOutTime: '12:00 PM', roomTypes: ['Standard', 'Superior'], hasRestaurant: true, hasGym: true, hasPool: false, hasSpa: false, hasConferenceRoom: true, hasWifi: true, hasParking: true, petFriendly: false, cancellationPolicy: 'Non-refundable', location: 'Gachibowli, Hyderabad', area: 'Gachibowli', itemCondition: 'New Item', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'hotel_4', title: 'The Park Hotel', price: '₹7,200', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'], rating: 4.8, distance: '6.5 km away', propertyType: 'Hotel', listingType: 'rent', hotelName: 'The Park', hotelStarRating: '5', totalRooms: '132', availableRooms: '19', checkInTime: '3:00 PM', checkOutTime: '11:00 AM', roomTypes: ['Luxury', 'Premium', 'Executive'], hasRestaurant: true, hasGym: true, hasPool: true, hasSpa: true, hasConferenceRoom: true, hasWifi: true, hasParking: true, petFriendly: true, cancellationPolicy: 'Free cancellation up to 72 hours before check-in', location: 'Somajiguda, Hyderabad', area: 'Somajiguda', itemCondition: 'New Item', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'hotel_5', title: 'Radisson Blu Plaza', price: '₹5,800', image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=500', images: ['https://images.unsplash.com/photo-1455587734955-081b22074882?w=500'], rating: 4.6, distance: '4.7 km away', propertyType: 'Hotel', listingType: 'rent', hotelName: 'Radisson Blu Plaza', hotelStarRating: '5', totalRooms: '211', availableRooms: '38', checkInTime: '2:00 PM', checkOutTime: '12:00 PM', roomTypes: ['Business', 'Premium', 'Suite'], hasRestaurant: true, hasGym: true, hasPool: true, hasSpa: true, hasConferenceRoom: true, hasWifi: true, hasParking: true, petFriendly: false, cancellationPolicy: 'Free cancellation up to 24 hours before check-in', location: 'Banjara Hills, Hyderabad', area: 'Banjara Hills', itemCondition: 'New Item', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

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
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Time');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All Ratings');
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

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
          } else if (listing.propertyType === 'Hostel') {
            title = `${listing.hostelType || ''} Hostel in ${listing.area || 'Unknown'}`;
          } else if (listing.propertyType === 'Hotel') {
            title = listing.hotelName || `Hotel in ${listing.area || 'Unknown'}`;
          } else {
            title = `${listing.propertyType} in ${listing.area || 'Unknown'}`;
          }

          // Ensure images array exists and has at least one image
          const imagesArray = listing.images && Array.isArray(listing.images) && listing.images.length > 0 
            ? listing.images 
            : ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500'];
          
          return {
            id: listing.id, 
            title: title || listing.propertyType,
            price: `₹${parseFloat(listing.price).toLocaleString('en-IN')}`,
            image: imagesArray[0], // Always use first image from array
            images: imagesArray, 
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
            registrationStatus: listing.registrationStatus, 
            marketValue: listing.marketValue,
            registrationValue: listing.registrationValue,
            documentImages: listing.documentImages,
            hostelType: listing.hostelType,
            totalRooms: listing.totalRooms,
            availableRooms: listing.availableRooms,
            foodIncluded: listing.foodIncluded,
            hasAC: listing.hasAC,
            hasWifi: listing.hasWifi,
            hasTV: listing.hasTV,
            hasLaundry: listing.hasLaundry,
            hasParking: listing.hasParking,
            hasSecurity: listing.hasSecurity,
            hotelName: listing.hotelName,
            hotelStarRating: listing.hotelStarRating,
            checkInTime: listing.checkInTime,
            checkOutTime: listing.checkOutTime,
            roomTypes: listing.roomTypes,
            hasRestaurant: listing.hasRestaurant,
            hasGym: listing.hasGym,
            hasPool: listing.hasPool,
            hasSpa: listing.hasSpa,
            hasConferenceRoom: listing.hasConferenceRoom,
            petFriendly: listing.petFriendly,
            cancellationPolicy: listing.cancellationPolicy,
            isUserListing: true,
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

  const handleDeleteListing = async () => {
    if (!propertyToDelete) return;

    try {
      const storedListings = await AsyncStorage.getItem('marketplace_listings');
      if (storedListings) {
        const listings = JSON.parse(storedListings);
        const updatedListings = listings.filter((listing: any) => listing.id !== propertyToDelete.id);
        await AsyncStorage.setItem('marketplace_listings', JSON.stringify(updatedListings));
        
        setShowDeleteModal(false);
        setPropertyToDelete(null);
        await loadListings();
        
        Alert.alert('Success', 'Listing deleted successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete listing');
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

  const filteredProperties = properties.filter((property) => {
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
      const diffTime = Math.abs(now.getTime() - propertyDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (selectedDateFilter === 'Today') matchesDate = diffDays <= 1;
      else if (selectedDateFilter === 'Last 7 Days') matchesDate = diffDays <= 7;
      else if (selectedDateFilter === 'Last 30 Days') matchesDate = diffDays <= 30;
      else if (selectedDateFilter === 'Last 3 Months') matchesDate = diffDays <= 90;
    }
    
    const matchesRating = selectedRatingFilter === 'All Ratings' || 
      (property.rating && property.rating >= parseFloat(selectedRatingFilter.split('+')[0]));
    
    const matchesSearch = searchQuery === '' || 
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.hotelName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesCategory && matchesPropertyType && matchesDate && matchesRating && matchesSearch;
  });

  const handlePropertyTypeSelect = (propertyType: string) => {
    setSelectedPropertyType(propertyType);
    if (propertyType !== 'All') {
      const category = getCategoryFromPropertyType(propertyType);
      setSelectedCategory(category);
    }
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
    <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
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
              style={styles.deleteCancelButton}
              onPress={() => {
                setShowDeleteModal(false);
                setPropertyToDelete(null);
              }}
            >
              <Text style={styles.deleteCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteConfirmButton}
              onPress={handleDeleteListing}
            >
              <Text style={styles.deleteConfirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
          <TextInput style={styles.searchInput} placeholder="Search homes, cars, land, hostels, hotels..." placeholderTextColor="#4b5563" value={searchQuery} onChangeText={setSearchQuery} />
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
            { id: 'House', icon: 'home', label: 'House' },
            { id: 'Commercial', icon: 'business', label: 'Commercial' }
          ].map((category) => (
            <TouchableOpacity key={category.id} style={[styles.categoryButton, selectedCategory === category.id && styles.activeCategoryButton]} onPress={() => setSelectedCategory(category.id)}>
              <MaterialIcons name={category.icon} size={18} color={selectedCategory === category.id ? '#fff' : '#94a3b8'} />
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.activeCategoryText]}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.propertiesHeader}>
          <Text style={styles.propertiesTitle}>{filteredProperties.length} Properties Near You</Text>
          <View style={styles.sortContainer}><MaterialIcons name="tune" size={16} color="#94a3b8" /><Text style={styles.sortText}>Sort</Text></View>
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
            {filteredProperties.map((property) => (
              <TouchableOpacity key={property.id} style={styles.card} activeOpacity={0.85}
                onPress={() => navigation.navigate('BuyerPage', { property })}
              >
                <View style={styles.cardImage}>
                  <Image source={{ uri: property.image }} style={styles.image} />
                  <View style={styles.favoriteButton}>
                    <MaterialIcons 
                      name={wishlistIds.includes(property.id) ? "favorite" : "favorite-border"} 
                      size={18} 
                      color={wishlistIds.includes(property.id) ? "#ef4444" : "#fff"} 
                    />
                  </View>
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
                  <View style={styles.ratingBadge}><MaterialIcons name="star" size={12} color="#fbbf24" /><Text style={styles.ratingText}>{property.rating?.toFixed(1)}</Text></View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{property.title}</Text>
                  <Text style={styles.cardPrice}>
                    {property.price}
                    {property.listingType === 'rent' && <Text style={styles.perMonthText}>/night</Text>}
                  </Text>
                  <View style={styles.locationRow}><MaterialIcons name="location-on" size={12} color="#64748b" /><Text style={styles.locationDetailText} numberOfLines={1}>{property.location}</Text></View>
                  <View style={styles.areaRow}><MaterialIcons name="place" size={12} color="#64748b" /><Text style={styles.areaDetailText} numberOfLines={1}>{property.area}</Text></View>
                  <View style={styles.cardDetails}>
                    {property.sqft && <View style={styles.detailItem}><MaterialIcons name="square-foot" size={12} color="#64748b" /><Text style={styles.detailText}>{property.sqft} sqft</Text></View>}
                    {property.bhk && <View style={styles.detailItem}><MaterialIcons name="bed" size={12} color="#64748b" /><Text style={styles.detailText}>{property.bhk}</Text></View>}
                    {property.totalRooms && <View style={styles.detailItem}><MaterialIcons name="meeting-room" size={12} color="#64748b" /><Text style={styles.detailText}>{property.totalRooms} rooms</Text></View>}
                    {property.hotelStarRating && <View style={styles.detailItem}><MaterialIcons name="star" size={12} color="#fbbf24" /><Text style={styles.detailText}>{property.hotelStarRating} Star</Text></View>}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
    cardDetails: { flexDirection: 'row', gap: 12, marginBottom: 4 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    detailText: { fontSize: 10, fontWeight: '500', color: '#64748b' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
    locationDetailText: { fontSize: 10, fontWeight: '500', color: '#64748b', flex: 1 },
    areaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    areaDetailText: { fontSize: 10, fontWeight: '500', color: '#64748b', flex: 1 },
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
  });