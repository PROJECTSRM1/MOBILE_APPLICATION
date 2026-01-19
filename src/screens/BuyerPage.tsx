import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
}

const BuyerPage = ({ route, navigation }: any) => {
  const { property } = route.params as { property: Property };
  
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = property.images || [property.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500'];

  const validateForm = () => {
    if (!fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      alert('Please enter a valid mobile number');
      return false;
    }
    if (!deliveryAddress.trim()) {
      alert('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handleBuyProperty = () => {
    if (validateForm()) {
      setShowSuccessModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0c10" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite-border" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.propertyImage} />
            ))}
          </ScrollView>
          
          <View style={styles.imageIndicatorContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  activeImageIndex === index && styles.activeImageIndicator,
                ]}
              />
            ))}
          </View>

          <View style={styles.badgesContainer}>
            <View style={property.listingType === 'buy' ? styles.saleBadge : styles.rentBadge}>
              <Text style={styles.badgeText}>
                {property.listingType === 'buy' ? 'FOR SALE' : 'FOR RENT'}
              </Text>
            </View>
            {property.itemCondition && (
              <View style={[
                styles.conditionBadge,
                property.itemCondition === 'New Item' ? styles.newConditionBadge : styles.oldConditionBadge
              ]}>
                <Text style={styles.badgeText}>
                  {property.itemCondition === 'New Item' ? 'NEW' : 'USED'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.titleRow}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            {property.rating && (
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#fbbf24" />
                <Text style={styles.ratingText}>{property.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.propertyPrice}>{property.price}</Text>

          {property.propertyType && (
            <View style={styles.infoRow}>
              <MaterialIcons name="category" size={16} color="#64748b" />
              <Text style={styles.infoText}>{property.propertyType}</Text>
            </View>
          )}

          {property.location && (
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={16} color="#64748b" />
              <Text style={styles.infoText}>{property.location}</Text>
            </View>
          )}

          {property.area && (
            <View style={styles.infoRow}>
              <MaterialIcons name="place" size={16} color="#64748b" />
              <Text style={styles.infoText}>{property.area}</Text>
            </View>
          )}

          {property.distance && (
            <View style={styles.infoRow}>
              <MaterialIcons name="near-me" size={16} color="#64748b" />
              <Text style={styles.infoText}>{property.distance}</Text>
            </View>
          )}

          <View style={styles.detailsGrid}>
            {property.sqft && (
              <View style={styles.detailCard}>
                <MaterialIcons name="square-foot" size={24} color="#135bec" />
                <Text style={styles.detailValue}>{property.sqft}</Text>
                <Text style={styles.detailLabel}>Sq. Ft.</Text>
              </View>
            )}
            {property.bhk && (
              <View style={styles.detailCard}>
                <MaterialIcons name="bed" size={24} color="#135bec" />
                <Text style={styles.detailValue}>{property.bhk}</Text>
                <Text style={styles.detailLabel}>Type</Text>
              </View>
            )}
            {property.furnishingType && (
              <View style={styles.detailCard}>
                <MaterialIcons name="chair" size={24} color="#135bec" />
                <Text style={styles.detailValue}>{property.furnishingType}</Text>
                <Text style={styles.detailLabel}>Furnishing</Text>
              </View>
            )}
            {property.landType && (
              <View style={styles.detailCard}>
                <MaterialIcons name="landscape" size={24} color="#135bec" />
                <Text style={styles.detailValue}>{property.landType}</Text>
                <Text style={styles.detailLabel}>Land Type</Text>
              </View>
            )}
            {property.brand && (
              <View style={styles.detailCard}>
                <MaterialIcons name="directions-car" size={24} color="#135bec" />
                <Text style={styles.detailValue}>{property.brand}</Text>
                <Text style={styles.detailLabel}>Brand</Text>
              </View>
            )}
            {property.model && (
              <View style={styles.detailCard}>
                <MaterialIcons name="info" size={24} color="#135bec" />
                <Text style={styles.detailValue}>{property.model}</Text>
                <Text style={styles.detailLabel}>Model</Text>
              </View>
            )}
            {property.year && (
              <View style={styles.detailCard}>
                <MaterialIcons name="calendar-today" size={24} color="#135bec" />
                <Text style={styles.detailValue}>{property.year}</Text>
                <Text style={styles.detailLabel}>Year</Text>
              </View>
            )}
          </View>

          {property.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{property.description}</Text>
            </View>
          )}

          {property.ownerName && (
            <View style={styles.ownerSection}>
              <Text style={styles.sectionTitle}>Owner Details</Text>
              <View style={styles.ownerCard}>
                <View style={styles.ownerAvatar}>
                  <MaterialIcons name="person" size={32} color="#135bec" />
                </View>
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>{property.ownerName}</Text>
                  {property.mobileNumber && (
                    <Text style={styles.ownerContact}>{property.mobileNumber}</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <MaterialIcons name="phone" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Your Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#4b5563"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>MOBILE NUMBER</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor="#4b5563"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>DELIVERY ADDRESS</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your complete delivery address"
                placeholderTextColor="#4b5563"
                multiline
                numberOfLines={4}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.bottomPriceLabel}>Total Amount</Text>
          <Text style={styles.bottomPrice}>{property.price}</Text>
        </View>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyProperty}>
          <MaterialIcons name="shopping-cart" size={20} color="#fff" />
          <Text style={styles.buyButtonText}>
            {property.listingType === 'buy' ? 'Buy Property' : 'Book Property'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <MaterialIcons name="check-circle" size={80} color="#10b981" />
            </View>
            <Text style={styles.successTitle}>Property Booked Successfully!</Text>
            <Text style={styles.successMessage}>
              Your booking request has been submitted. The property owner will contact you shortly.
            </Text>
            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Name:</Text>
                <Text style={styles.successDetailValue}>{fullName}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Mobile:</Text>
                <Text style={styles.successDetailValue}>{mobileNumber}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Property:</Text>
                <Text style={styles.successDetailValue} numberOfLines={1}>
                  {property.title}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Amount:</Text>
                <Text style={styles.successDetailValue}>{property.price}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.successButton} onPress={handleCloseSuccessModal}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#232936',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    position: 'relative',
  },
  propertyImage: {
    width: width,
    height: width * 1.1,
    backgroundColor: '#161b26',
  },
  imageIndicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeImageIndicator: {
    backgroundColor: '#fff',
    width: 24,
  },
  badgesContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'column',
    gap: 6,
  },
  saleBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rentBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newConditionBadge: {
    backgroundColor: '#8b5cf6',
  },
  oldConditionBadge: {
    backgroundColor: '#6b7280',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  detailsSection: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b26',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  propertyPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#135bec',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  detailCard: {
    backgroundColor: '#161b26',
    borderWidth: 1,
    borderColor: '#232936',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: (width - 56) / 3,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 4,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94a3b8',
    lineHeight: 22,
  },
  ownerSection: {
    marginBottom: 24,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b26',
    borderWidth: 1,
    borderColor: '#232936',
    borderRadius: 12,
    padding: 16,
  },
  ownerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  ownerContact: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  callButton: {
    backgroundColor: '#135bec',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#161b26',
    borderWidth: 1,
    borderColor: '#232936',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bottomSection: {
    backgroundColor: 'rgba(10, 12, 16, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#232936',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  priceContainer: {
    marginBottom: 12,
  },
  bottomPriceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#135bec',
  },
  buyButton: {
    backgroundColor: '#135bec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    backgroundColor: '#161b26',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successDetails: {
    width: '100%',
    backgroundColor: '#0a0c10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  successDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  successDetailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  successButton: {
    backgroundColor: '#135bec',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});

export default BuyerPage;

function alert(arg0: string) {
    throw new Error('Function not implemented.');
}
