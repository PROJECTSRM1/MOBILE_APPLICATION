import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 24,
  color = '#fff',
  style,
}) => (
  <Text style={[{ fontSize: size, color }, style]}>{name}</Text>
);


const JustrideApp = () => {
  const [fromLocation, setFromLocation] = useState('Grand Central Terminal, NY');
  const [toLocation, setToLocation] = useState('Empire State Building');
  const [selectedCategory, setSelectedCategory] = useState('All Services');

  const categories = ['All Services', 'Commute', 'Delivery', 'Luxury'];

  const services = [
    {
      id: 1,
      name: 'Metro Ticket',
      icon: '🚇',
      iconColor: '#135bec',
      availability: '3 tickets available nearby',
      availabilityColor: '#135bec',
      price: '$2.75',
      distance: '0.5 km',
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
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
  
      
      {/* Header */}
      <View style={styles.header}>
  <TouchableOpacity style={[styles.headerButton, styles.leftButton]}>
    <Text style={styles.headerIcon}>←</Text>
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Justride</Text>

  <TouchableOpacity style={[styles.headerButton, styles.rightButton]}>
    <Text style={styles.headerIcon}>⋮</Text>
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
            <TextInput
              style={styles.locationInput}
              value={fromLocation}
              onChangeText={setFromLocation}
              placeholderTextColor="#9da6b9"
            />
          </View>

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotEnd]}>
              <View style={styles.locationDotInner} />
            </View>
            <TextInput
              style={styles.locationInput}
              value={toLocation}
              onChangeText={setToLocation}
              placeholder="Where to?"
              placeholderTextColor="#9da6b9"
            />
          </View>
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
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>AVAILABLE TRANSPORT & DELIVERY</Text>
        
        {services.map((service) => (
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
        ))}
        
        <View style={{ height: 100 }} />
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
  },
 header: {
  height: 56,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#101622',
},

 headerButton: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: 48,
  justifyContent: 'center',
  alignItems: 'center',
},
leftButton: {
  left: 0,
},

rightButton: {
  right: 0,
},

  headerIcon: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationFieldsWrapper: {
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    left: 23,
    top: 28,
    bottom: 28,
    width: 2,
    backgroundColor: 'rgba(19, 91, 236, 0.3)',
    zIndex: 0,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 10,
  },
  locationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#101622',
    marginRight: 12,
  },
  locationDotStart: {
    backgroundColor: '#135bec',
  },
  locationDotEnd: {
    backgroundColor: '#10b981',
  },
  locationDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  locationInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#1c1f27',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b4354',
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 14,
  },
  categoryScroll: {
    maxHeight: 52,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  categoryChip: {
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#282e39',
    borderWidth: 1,
    borderColor: '#3b4354',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryChipActive: {
    backgroundColor: '#135bec',
    borderColor: '#135bec',
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9da6b9',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  servicesContainer: {
    flex: 1,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceIconText: {
    fontSize: 28,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  serviceAvailability: {
    fontSize: 12,
    fontWeight: '600',
  },
  serviceRight: {
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  serviceDistance: {
    fontSize: 12,
    color: '#9da6b9',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 40,
    backgroundColor: 'transparent',
    
  },
  
  reviewButton: {
    backgroundColor: '#135bec',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
  },
  reviewButtonIcon: {
    fontSize: 20,
    color: '#fff',
  },
});

export default JustrideApp;