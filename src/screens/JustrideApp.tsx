import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// Material Icons Components
const ArrowLeft = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const Menu = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12h18M3 6h18M3 18h18" />
  </Svg>
);

const Search = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" />
  </Svg>
);

const MapPin = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </Svg>
);

const Navigation = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 11l19-9-9 19-2-8-8-2z" />
  </Svg>
);

const JustrideApp = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [fromLocation, setFromLocation] = useState('Grand Central Terminal, NY');
  const [toLocation, setToLocation] = useState('Empire State Building');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All Services', 'Commute', 'Delivery', 'Luxury'];

  const allServices = [
    {
      id: 1,
      name: 'Metro Ticket',
      icon: '🚇',
      iconColor: '#135bec',
      availability: '3 tickets available nearby',
      availabilityColor: '#135bec',
      price: '$2.75',
      distance: '0.5 km',
      category: 'Commute',
      priceValue: 2.75,
    },
    {
      id: 2,
      name: 'Parcel',
      icon: '📦',
      iconColor: '#f59e0b',
      availability: '12 couriers nearby',
      availabilityColor: '#9da6b9',
      price: 'From $5',
      distance: 'Instant pick',
      category: 'Delivery',
      priceValue: 5,
    },
    {
      id: 3,
      name: 'Scooty',
      icon: '🛵',
      iconColor: '#10b981',
      availability: '8 available nearby',
      availabilityColor: '#135bec',
      price: '$3.20',
      distance: '1.2 km',
      category: 'Commute',
      priceValue: 3.20,
    },
    {
      id: 4,
      name: 'Bike',
      icon: '🏍️',
      iconColor: '#38bdf8',
      availability: '15 available nearby',
      availabilityColor: '#135bec',
      price: '$2.50',
      distance: '0.8 km',
      category: 'Commute',
      priceValue: 2.50,
    },
    {
      id: 5,
      name: 'Cab Non AC',
      icon: '🚗',
      iconColor: '#9ca3af',
      availability: '5 available nearby',
      availabilityColor: '#9da6b9',
      price: '$8.00',
      distance: '2.1 km',
      category: 'Commute',
      priceValue: 8.00,
    },
    {
      id: 6,
      name: 'Auto',
      icon: '🛺',
      iconColor: '#eab308',
      availability: '2 available nearby',
      availabilityColor: '#135bec',
      price: '$4.50',
      distance: '0.3 km',
      category: 'Commute',
      priceValue: 4.50,
    },
    {
      id: 7,
      name: 'Cab Premium',
      icon: '🚙',
      iconColor: '#818cf8',
      availability: '4 available nearby',
      availabilityColor: '#9da6b9',
      price: '$15.50',
      distance: '1.5 km',
      category: 'Luxury',
      priceValue: 15.50,
    },
    {
      id: 8,
      name: 'Auto Seat Share',
      icon: '👥',
      iconColor: '#fb923c',
      availability: 'Ready to go',
      availabilityColor: '#135bec',
      price: '$1.20',
      distance: '0.2 km',
      category: 'Commute',
      priceValue: 1.20,
    },
    {
      id: 9,
      name: 'Bike Lite',
      icon: '🚴',
      iconColor: '#f472b6',
      availability: '20+ available',
      availabilityColor: '#9da6b9',
      price: '$0.90',
      distance: '0.1 km',
      category: 'Commute',
      priceValue: 0.90,
    },
    {
      id: 10,
      name: 'Shared Auto',
      icon: '👨‍👩‍👧',
      iconColor: '#34d399',
      availability: 'Frequent availability',
      availabilityColor: '#9da6b9',
      price: '$1.00',
      distance: 'Multiple',
      category: 'Commute',
      priceValue: 1.00,
    },
    {
      id: 11,
      name: 'Cab Priority',
      icon: '⭐',
      iconColor: '#f87171',
      availability: '1 available nearby',
      availabilityColor: '#135bec',
      price: '$22.00',
      distance: '3 mins',
      category: 'Luxury',
      priceValue: 22.00,
    },
    {
      id: 12,
      name: 'Travel',
      icon: '✈️',
      iconColor: '#c084fc',
      availability: 'Inter-city bookings',
      availabilityColor: '#9da6b9',
      price: 'Custom',
      distance: 'Plan trip',
      category: 'Luxury',
      priceValue: 0,
    },
  ];

  // Dynamic filtering with useMemo for performance
  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const matchesCategory = selectedCategory === 'All Services' || service.category === selectedCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.availability.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory('All Services');
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Justride</Text>
        
        <TouchableOpacity style={styles.headerButton}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Location Fields */}
      <View style={styles.locationContainer}>
        <View style={styles.locationFieldsWrapper}>
          <View style={styles.routeLine} />
          
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotStart]}>
              <View style={styles.locationDotInner} />
            </View>
            <View style={styles.locationInputWrapper}>
              <TextInput
                style={styles.locationInput}
                value={fromLocation}
                onChangeText={setFromLocation}
                placeholderTextColor="#9da6b9"
              />
              <View style={styles.locationIcon}>
                <MapPin size={16} color="#9da6b9" />
              </View>
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotEnd]}>
              <View style={styles.locationDotInner} />
            </View>
            <View style={styles.locationInputWrapper}>
              <TextInput
                style={styles.locationInput}
                value={toLocation}
                onChangeText={setToLocation}
                placeholder="Where to?"
                placeholderTextColor="#9da6b9"
              />
              <View style={styles.locationIcon}>
                <Navigation size={16} color="#9da6b9" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchIcon}>
            <Search size={18} color="#9da6b9" />
          </View>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search services..."
            placeholderTextColor="#9da6b9"
          />
        </View>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      <ScrollView 
        style={styles.servicesContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AVAILABLE TRANSPORT & DELIVERY</Text>
          <Text style={styles.serviceCount}>
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              activeOpacity={0.7}
            >
              <View style={styles.serviceLeft}>
                <View style={[styles.serviceIcon, { backgroundColor: `${service.iconColor}15` }]}>
                  <Text style={styles.serviceIconText}>{service.icon}</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={[styles.serviceAvailability, { color: service.availabilityColor }]}>
                    {service.availability}
                  </Text>
                </View>
              </View>
              <View style={styles.serviceRight}>
                <Text style={styles.servicePrice}>{service.price}</Text>
                <Text style={styles.serviceDistance}>{service.distance}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Search size={48} color="#4b5563" />
            <Text style={styles.emptyText}>
              No services found matching your filters
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Gradient Overlay */}
      <View style={styles.bottomGradient} pointerEvents="none" />

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.reviewButton} activeOpacity={0.9}>
          <Text style={styles.reviewButtonText}>Review Selection</Text>
          <Text style={styles.reviewButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* Header */
    header: {
      height: 56,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      backgroundColor: colors.background,
    },

    headerButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    /* Location */
    locationContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    locationFieldsWrapper: {
      position: "relative",
    },

    routeLine: {
      position: "absolute",
      left: 23,
      top: 28,
      bottom: 28,
      width: 2,
      backgroundColor: colors.primary + "4D",
      zIndex: 0,
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      zIndex: 10,
    },

    locationDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 4,
      borderColor: colors.background,
      marginRight: 12,
    },

    locationDotStart: {
      backgroundColor: colors.primary,
    },

    locationDotEnd: {
      backgroundColor: colors.success,
    },

    locationDotInner: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.onPrimary ?? "#fff",
    },

    locationInputWrapper: {
      flex: 1,
      position: "relative",
    },

    locationInput: {
      height: 48,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingRight: 40,
      color: colors.text,
      fontSize: 14,
    },

    locationIcon: {
      position: "absolute",
      right: 12,
      top: 16,
    },

    /* Search */
    searchContainer: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },

    searchWrapper: {
      position: "relative",
    },

    searchIcon: {
      position: "absolute",
      left: 12,
      top: 11,
      zIndex: 1,
    },

    searchInput: {
      height: 40,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingLeft: 40,
      paddingRight: 16,
      color: colors.text,
      fontSize: 14,
    },

    /* Categories */
    categoryScroll: {
      maxHeight: 52,
    },

    categoryContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    categoryChip: {
      height: 36,
      paddingHorizontal: 20,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },

    categoryText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.subText,
    },

    categoryTextActive: {
      color: colors.onPrimary ?? "#fff",
      fontWeight: "700",
    },

    /* Services */
    servicesContainer: {
      flex: 1,
      marginTop: 8,
    },

    servicesContent: {
      paddingBottom: 20,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },

    sectionTitle: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.text + "99",
      letterSpacing: 1.5,
    },

    serviceCount: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.primary,
    },

    serviceCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 88,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "33",
    },

    serviceLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    serviceIcon: {
      width: 56,
      height: 56,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      backgroundColor: colors.surface,
    },

    serviceIconText: {
      fontSize: 28,
    },

    serviceInfo: {
      flex: 1,
    },

    serviceName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },

    serviceAvailability: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.subText,
    },

    serviceRight: {
      alignItems: "flex-end",
      marginLeft: 16,
    },

    servicePrice: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },

    serviceDistance: {
      fontSize: 12,
      color: colors.subText,
    },

    /* Empty State */
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 64,
      paddingHorizontal: 16,
    },

    emptyText: {
      fontSize: 14,
      color: colors.subText,
      textAlign: "center",
      marginTop: 16,
      marginBottom: 16,
    },

    clearButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 8,
    },

    clearButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.onPrimary ?? "#fff",
    },

    /* Bottom */
    bottomGradient: {
      position: "absolute",
      bottom: 88,
      left: 0,
      right: 0,
      height: 96,
      backgroundColor: "transparent",
    },

    bottomButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    reviewButton: {
      backgroundColor: colors.primary,
      height: 56,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
    },

    reviewButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.onPrimary ?? "#fff",
      marginRight: 8,
    },

    reviewButtonIcon: {
      fontSize: 20,
      color: colors.onPrimary ?? "#fff",
    },
  });

export default JustrideApp;