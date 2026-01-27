import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Image, StatusBar, Modal, Dimensions, Alert
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get('window');

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
  itemCondition?: string;
  registrationStatus?: 'registered' | 'non-registered';
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
}

const BuyerPage = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { property } = route.params as { property: Property };
  
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [isDocViewerVisible, setIsDocViewerVisible] = useState(false);
  const [selectedDocImage, setSelectedDocImage] = useState<string | null>(null);

  const images = property.images || [property.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500'];

  const isHostel = property.propertyType === 'Hostel';
  const isLand = property.propertyType === 'Land';

  // Check if this is a dummy hostel (starts with 'hostel_')
  const isDummyHostel = property.id.startsWith('hostel_');

  // Smart hostel data handling - use actual data if available, otherwise use defaults only for dummy data
  const hostelData = isHostel ? {
    hostelType: property.hostelType || 'Boys',
    totalRooms: property.totalRooms || (isDummyHostel ? '20' : 'N/A'),
    availableRooms: property.availableRooms || (isDummyHostel ? '5' : 'N/A'),
    foodIncluded: property.foodIncluded || (isDummyHostel ? 'Yes' : 'No'),
    hasAC: property.hasAC !== undefined ? property.hasAC : isDummyHostel,
    hasWifi: property.hasWifi !== undefined ? property.hasWifi : isDummyHostel,
    hasTV: property.hasTV !== undefined ? property.hasTV : false,
    hasLaundry: property.hasLaundry !== undefined ? property.hasLaundry : isDummyHostel,
    hasParking: property.hasParking !== undefined ? property.hasParking : isDummyHostel,
    hasSecurity: property.hasSecurity !== undefined ? property.hasSecurity : isDummyHostel,
  } : null;

  useEffect(() => {
    checkWishlistStatus();
  }, []);

  const checkWishlistStatus = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('marketplace_wishlist');
      if (storedWishlist) {
        const wishlist: Property[] = JSON.parse(storedWishlist);
        const exists = wishlist.some(item => item.id === property.id);
        setIsWishlisted(exists);
      }
    } catch (error) {
      console.error("Error checking wishlist", error);
    }
  };

  const toggleWishlist = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('marketplace_wishlist');
      let wishlist: Property[] = storedWishlist ? JSON.parse(storedWishlist) : [];

      if (isWishlisted) {
        wishlist = wishlist.filter(item => item.id !== property.id);
        setIsWishlisted(false);
      } else {
        wishlist.push(property);
        setIsWishlisted(true);
      }

      await AsyncStorage.setItem('marketplace_wishlist', JSON.stringify(wishlist));
    } catch (error) {
      Alert.alert("Error", "Could not update wishlist");
    }
  };

  const formatCurrency = (val: string | undefined) => {
    if (!val) return 'N/A';
    return `₹${parseFloat(val).toLocaleString('en-IN')}`;
  };

  const handleBuyProperty = () => {
    if (!fullName || !mobileNumber || !deliveryAddress) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setShowSuccessModal(true);
  };

  const getAvailableAmenities = () => {
    if (!isHostel || !hostelData) return [];
    
    const amenities = [];
    if (hostelData.hasAC) amenities.push({ icon: 'ac-unit', label: 'AC' });
    if (hostelData.hasWifi) amenities.push({ icon: 'wifi', label: 'WiFi' });
    if (hostelData.hasTV) amenities.push({ icon: 'tv', label: 'TV' });
    if (hostelData.hasLaundry) amenities.push({ icon: 'local-laundry-service', label: 'Laundry' });
    if (hostelData.hasParking) amenities.push({ icon: 'local-parking', label: 'Parking' });
    if (hostelData.hasSecurity) amenities.push({ icon: 'security', label: 'Security' });
    return amenities;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0c10" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleWishlist}>
          <MaterialIcons 
            name={isWishlisted ? "favorite" : "favorite-border"} 
            size={26} 
            color={isWishlisted ? "#ef4444" : colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <ScrollView
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.propertyImage} />
            ))}
          </ScrollView>
          <View style={styles.imageIndicatorContainer}>
            {images.map((_, index) => (
              <View key={index} style={[styles.imageIndicator, activeImageIndex === index && styles.activeImageIndicator]} />
            ))}
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.propertyTitle}>{property.title || property.propertyType}</Text>
          <Text style={styles.propertyPrice}>
  {property.price}
  {property.listingType === 'rent' && <Text style={styles.perMonthText}>/month</Text>}
</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color="#64748b" />
            <Text style={styles.infoText}>{property.location}, {property.area}</Text>
          </View>

          {isHostel && hostelData && (
            <View style={styles.hostelTypeBadge}>
              <MaterialIcons name="domain" size={16} color="#fff" />
              <Text style={styles.hostelTypeText}>{hostelData.hostelType} Hostel</Text>
            </View>
          )}

          {isLand && (
            <View style={[styles.landStatusBadge, property.registrationStatus === 'registered' ? styles.regBg : styles.nonRegBg]}>
              <MaterialIcons name={property.registrationStatus === 'registered' ? "verified" : "gavel"} size={16} color="#fff" />
              <Text style={styles.landStatusText}>
                {property.registrationStatus === 'registered' ? 'Registered Land' : 'Non-Registered (Attested Copy)'}
              </Text>
            </View>
          )}

          {isHostel && hostelData ? (
            <View style={styles.detailsGrid}>
              <DetailCard icon="meeting-room" label="Total Rooms" value={hostelData.totalRooms} />
              <DetailCard icon="check-circle" label="Available" value={hostelData.availableRooms} />
              <DetailCard icon="restaurant" label="Food" value={hostelData.foodIncluded} />
              <DetailCard icon="new-releases" label="Condition" value={property.itemCondition || 'N/A'} />
            </View>
          ) : (
            <View style={styles.detailsGrid}>
              {property.sqft && <DetailCard icon="square-foot" label="Sq. Ft." value={property.sqft} />}
              {property.landType && <DetailCard icon="landscape" label="Land Type" value={property.landType} />}
              
              {isLand && (
                <>
                  <DetailCard icon="account-balance" label="Reg. Value" value={formatCurrency(property.registrationValue)} />
                  <DetailCard icon="trending-up" label="Market Value" value={formatCurrency(property.marketValue)} />
                </>
              )}
              {property.bhk && <DetailCard icon="bed" label="BHK" value={property.bhk} />}
            </View>
          )}

          {isHostel && getAvailableAmenities().length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities & Services</Text>
              <View style={styles.amenitiesGrid}>
                {getAvailableAmenities().map((amenity, index) => (
                  <View key={index} style={styles.amenityCard}>
                    <View style={styles.amenityIconContainer}>
                      <MaterialIcons name={amenity.icon} size={24} color="#135bec" />
                    </View>
                    <Text style={styles.amenityLabel}>{amenity.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {property.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{property.description}</Text>
            </View>
          )}

          {property.documentImages && property.documentImages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Legal Documents</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {property.documentImages.map((doc, idx) => (
                  <TouchableOpacity key={idx} style={styles.docWrapper} onPress={() => { setSelectedDocImage(doc); setIsDocViewerVisible(true); }}>
                    <Image source={{ uri: doc }} style={styles.docThumb} />
                    <View style={styles.docOverlay}>
                      <MaterialIcons name="visibility" size={24} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {property.ownerName && (
            <View style={styles.ownerCard}>
              <View style={styles.ownerAvatar}><MaterialIcons name="person" size={30} color="#135bec" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ownerName}>{property.ownerName}</Text>
                <Text style={styles.ownerContact}>{property.mobileNumber}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}><MaterialIcons name="phone" size={20} color="#fff" /></TouchableOpacity>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Inquiry Form</Text>
            <CustomInput label="FULL NAME" value={fullName} onChange={setFullName} placeholder="John Doe" />
            <CustomInput label="MOBILE" value={mobileNumber} onChange={setMobileNumber} placeholder="10 Digit Number" keyboard="phone-pad" />
            <CustomInput label="ADDRESS" value={deliveryAddress} onChange={setDeliveryAddress} placeholder="Detailed Address" multiline />
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomSection}>
        <View>
          <Text style={styles.bottomPriceLabel}>Price</Text>
          <Text style={styles.bottomPrice}>
  {property.price}
  {property.listingType === 'rent' && <Text style={styles.bottomPerMonthText}>/month</Text>}
</Text>
        </View>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyProperty}>
          <Text style={styles.buyButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isDocViewerVisible} transparent={false} animationType="fade" onRequestClose={() => setIsDocViewerVisible(false)}>
        <View style={styles.fullScreenContainer}>
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity onPress={() => setIsDocViewerVisible(false)} style={styles.closeFullBtn}>
              <MaterialIcons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>Document View</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.fullScreenImageContent}>
            {selectedDocImage && <Image source={{ uri: selectedDocImage }} style={styles.fullScreenImage} resizeMode="contain" />}
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <MaterialIcons name="check-circle" size={80} color="#10b981" />
            <Text style={styles.successTitle}>Inquiry Sent!</Text>
            <Text style={styles.successMessage}>The owner has been notified. They will contact you shortly.</Text>
            <TouchableOpacity style={styles.successButton} onPress={() => { setShowSuccessModal(false); navigation.goBack(); }}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const DetailCard = ({ icon, label, value }: any) => {
  const { colors } = useTheme();
  return (
    <View style={{
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
      borderRadius: 12, padding: 12, alignItems: 'center', width: (width - 44) / 2, marginBottom: 12
    }}>
      <MaterialIcons name={icon} size={22} color="#135bec" />
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 4 }}>{value}</Text>
      <Text style={{ fontSize: 10, color: colors.subText }}>{label}</Text>
    </View>
  );
};

const CustomInput = ({ label, value, onChange, placeholder, keyboard, multiline }: any) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.subText, marginBottom: 8 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor="#4b5563" keyboardType={keyboard} multiline={multiline}
        style={{
          backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
          borderRadius: 12, padding: 14, color: colors.text, textAlignVertical: multiline ? 'top' : 'center',
          minHeight: multiline ? 80 : 50
        }}
      />
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  favoriteButton: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  content: { flex: 1 },
  imageSection: { position: 'relative' },
  propertyImage: { width, height: width * 0.9, backgroundColor: colors.card },
  imageIndicatorContainer: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  imageIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  activeImageIndicator: { backgroundColor: '#fff', width: 18 },
  detailsSection: { padding: 16 },
  propertyTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 4 },
  propertyPrice: { fontSize: 26, fontWeight: '800', color: colors.primary, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  infoText: { fontSize: 14, color: colors.subText },
  hostelTypeBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 20,
    backgroundColor: '#1e40af',
    alignSelf: 'flex-start'
  },
  hostelTypeText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 13 
  },
  landStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginBottom: 20 },
  regBg: { backgroundColor: '#065f46' },
  nonRegBg: { backgroundColor: '#92400e' },
  landStatusText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  descriptionText: { fontSize: 14, color: colors.subText, lineHeight: 22 },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  amenityCard: {
    width: (width - 56) / 3,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  amenityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  docWrapper: { marginRight: 12, width: 110, height: 140, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  docThumb: { width: '100%', height: '100%' },
  docOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  ownerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 16, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: colors.border },
  ownerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  ownerName: { fontSize: 16, fontWeight: '700', color: colors.text },
  ownerContact: { fontSize: 13, color: colors.subText },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  formSection: { marginTop: 32 },
  bottomSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  bottomPriceLabel: { fontSize: 12, color: colors.subText, fontWeight: '700' },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: colors.primary },
  buyButton: { backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  buyButtonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  successModal: { backgroundColor: colors.card, borderRadius: 24, padding: 32, alignItems: 'center' },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 16 },
  successMessage: { fontSize: 14, color: colors.subText, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  successButton: { backgroundColor: colors.primary, width: '100%', padding: 14, borderRadius: 12, alignItems: 'center' },
  successButtonText: { color: '#fff', fontWeight: '700' },
  fullScreenContainer: { flex: 1, backgroundColor: '#000' },
  fullScreenHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  closeFullBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  fullScreenTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  fullScreenImageContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: width, height: height * 0.8 },
  bottomPerMonthText: { fontSize: 12, fontWeight: '600', color: colors.subText },
  perMonthText: { fontSize: 14, fontWeight: '600', color: colors.subText },
});

export default BuyerPage;