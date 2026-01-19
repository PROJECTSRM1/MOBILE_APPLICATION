import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";


interface PropertyOption {
  id: string;
  icon: string;
  title: string;
  price: string;
}

const HomeSub = () => {
    const navigation = useNavigation<any>();


  const [selectedProperty, setSelectedProperty] = useState('1bhk');
  const [searchText, setSearchText] = useState('');

  const homeCleaningOptions: PropertyOption[] = [
    { id: '1bhk', icon: 'bed', title: '1 BHK', price: '$80' },
    { id: '2bhk', icon: 'meeting-room', title: '2 BHK', price: '$120' },
    { id: '3bhk', icon: 'home-work', title: '3 BHK+', price: '$180' },
    { id: 'studio', icon: 'apartment', title: 'Studio Apartment', price: '$65' },
    { id: 'villa', icon: 'villa', title: 'Villa/Penthouse', price: '$250' },
  ];

  const getSelectedTitle = () => {

    const selected = homeCleaningOptions.find(opt => opt.id === selectedProperty);
    return selected?.title || '1 BHK';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101c22" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Selection</Text>
        <View style={styles.backButton} />
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconContainer}>
              <MaterialIcons name="search" size={24} color="#9db0b9" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for property types..."
              placeholderTextColor="#9db0b9"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Property Specifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Specifications</Text>

          {/* Home Cleaning Card - Expanded */}
          <View style={styles.serviceCardContainer}>
            <View style={[styles.serviceCard, styles.serviceCardActive]}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_d23tAeEbgRVj2m8CN3pa5ZAjdoFxuc5nBVOZbbN-MLFoc_MHGUoR-zoF_XKVAu-U00yt7ghZqOqFk-vel8kUFHEEtQOB5lJLTLH7Ph6pQdrooCXZ3wGSp-LxXc0067_sbf4Ly0UzKdL1-9B8nLGOr29w6iML-7g8khD4X1VN3SgQin-EOecwh1_mMLIZlDOGwdojdzJeu9ZLk33ykT6r8STGmLacWh0eAGru4DIz27fsAONFRHVrBus9vVAHpluED0eazk0ghdk' }}
                style={styles.serviceCardImage}
              />
              <View style={styles.serviceCardOverlay} />
              <View style={styles.expandButton}>
                <MaterialIcons name="keyboard-arrow-up" size={16} color="#fff" />
              </View>
              <View style={styles.serviceCardContent}>
                <Text style={styles.serviceCardTitle}>Home Cleaning</Text>
                <Text style={styles.serviceCardSubtitle}>SELECT PROPERTY SIZE</Text>
              </View>
            </View>
            </View>

            {/* Property Options */}
            <View style={styles.propertyOptions}>
              {homeCleaningOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.propertyOption,
                    selectedProperty === option.id && styles.propertyOptionSelected
                  ]}
                  onPress={() => setSelectedProperty(option.id)}
                >
                  <View style={styles.propertyOptionLeft}>
                    <View style={[
                      styles.propertyIconContainer,
                      selectedProperty === option.id && styles.propertyIconContainerActive
                    ]}>
                      <MaterialIcons 
                        name={option.icon as any} 
                        size={24} 
                        color={selectedProperty === option.id ? '#135BEC' : '#9db0b9'} 
                      />
                    </View>
                    <View>
                      <Text style={styles.propertyTitle}>{option.title}</Text>
                      <Text style={styles.propertyPrice}>Starting from {option.price}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedProperty === option.id && styles.checkboxSelected
                  ]}>
                    {selectedProperty === option.id && (
                      <MaterialIcons name="check" size={14} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        
        {/* Bottom Padding for Fixed Elements */}
        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Floating Continue Button */}
      <View style={styles.floatingButtonContainer}>
        <View style={styles.floatingButton}>
          <View>
            <Text style={styles.floatingButtonTitle}>Home Cleaning</Text>
            <Text style={styles.floatingButtonSubtitle}>Selected: {getSelectedTitle()}</Text>
          </View>
    <TouchableOpacity
  style={styles.continueButton}
  onPress={() => navigation.navigate("HomeSubCat")}
>
  <Text style={styles.continueButtonText}>
    Continue
  </Text>
</TouchableOpacity>


        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color="#135BEC" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="calendar-today" size={24} color="#9db0b9" />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#9db0b9" />
          <Text style={styles.navText}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#9db0b9" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101c22',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#283339',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchIconContainer: {
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#fff',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  serviceCardContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  serviceCard: {
    height: 128,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceCardActive: {
    borderWidth: 2,
    borderColor: '#135BEC',
    shadowColor: '#135BEC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  serviceCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  serviceCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 28, 34, 0.7)',
  },
  expandButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#135BEC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  expandButtonInactive: {
    backgroundColor: 'transparent',
  },
  serviceCardContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  serviceCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  serviceCardSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#135BEC',
    letterSpacing: 1.2,
  },
  serviceCardSubtitleInactive: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9db0b9',
    letterSpacing: 1.2,
  },
  propertyOptions: {
    marginTop: 8,
    paddingLeft: 16,
  },
  propertyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c2a31',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  propertyOptionSelected: {
    borderWidth: 2,
    borderColor: '#135BEC',
    shadowColor: '#135BEC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  propertyOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#283339',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  propertyIconContainerActive: {
    backgroundColor: 'rgba(19, 164, 236, 0.2)',
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  propertyPrice: {
    fontSize: 12,
    color: '#9db0b9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#135BEC',
    borderColor: '#135BEC',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 42, 49, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  floatingButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  floatingButtonSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#135BEC',
  },
  continueButton: {
    backgroundColor: '#135BEC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 80,
    backgroundColor: '#0c161b',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#135BEC',
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9db0b9',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 6,
    left: '50%',
    width: 128,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    transform: [{ translateX: -64 }],
  },
});

export default HomeSub;