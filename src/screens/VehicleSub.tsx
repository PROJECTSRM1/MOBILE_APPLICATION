import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App"; // adjust path if needed




type ServiceType = 'Interior' | 'Exterior' | 'Full Wash';

interface ServicePrice {
  interior: number;
  exterior: number;
  fullWash: number;
}

interface VehicleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: string;
  prices: ServicePrice;
}

interface BookingCleaning {
  category: VehicleCategory | undefined;
  service: ServiceType;
  price: number;
  duration: string;
}


const VehicleSub = () => {
     const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState<string>('hatchback');
  const [selectedService, setSelectedService] = useState<ServiceType>('Full Wash');
  const [expandedItem, setExpandedItem] = useState<string>('hatchback');

  const categories: VehicleCategory[] = [
    {
      id: 'hatchback',
      name: 'Hatchback/Sedan',
      icon: 'directions-car',
      description: 'Small to medium family cars',
      duration: '45 - 60 mins',
      prices: { interior: 35, exterior: 25, fullWash: 45 },
    },
    {
      id: 'suv',
      name: 'SUV/Luxury',
      icon: 'airport-shuttle',
      description: 'Large vehicles & high-end cars',
      duration: '60 - 90 mins',
      prices: { interior: 55, exterior: 40, fullWash: 75 },
    },
    {
      id: 'motorcycle',
      name: 'Motorcycle/Bike',
      icon: 'two-wheeler',
      description: 'Two-wheelers and scooters',
      duration: '20 - 30 mins',
      prices: { interior: 0, exterior: 15, fullWash: 15 },
    },
    {
      id: 'van',
      name: 'Commercial Van',
      icon: 'local-shipping',
      description: 'Cargo vans and transport vehicles',
      duration: '75 - 120 mins',
      prices: { interior: 65, exterior: 50, fullWash: 95 },
    },
    {
      id: 'bicycle',
      name: 'Bicycle',
      icon: 'pedal-bike',
      description: 'MTB, Road, or Commuter bikes',
      duration: '15 - 25 mins',
      prices: { interior: 0, exterior: 10, fullWash: 10 },
    },
  ];

  const toggleAccordion = (id: string) => {
    const newExpanded = expandedItem === id ? '' : id;
    setExpandedItem(newExpanded);
    if (newExpanded) {
      setSelectedCategory(newExpanded);
      // Reset to Full Wash for motorcycles and bicycles (no interior)
      const cat = categories.find(c => c.id === newExpanded);
      if (cat && cat.prices.interior === 0) {
        setSelectedService('Exterior');
      }
    }
  };

  const getCurrentCategory = (): VehicleCategory | undefined => {
    return categories.find(cat => cat.id === selectedCategory);
  };

  const getCurrentPrice = (): number => {
    const category = getCurrentCategory();
    if (!category) return 0;
    
    const serviceMap: Record<ServiceType, keyof ServicePrice> = {
      'Interior': 'interior',
      'Exterior': 'exterior',
      'Full Wash': 'fullWash',
    };
    
    return category.prices[serviceMap[selectedService]];
  };

  const getCurrentDuration = (): string => {
    const category = getCurrentCategory();
    return category?.duration || '45 - 60 mins';
  };

  const renderServiceSelector = (category: VehicleCategory) => {
    const availableServices: ServiceType[] = category.prices.interior > 0
      ? ['Interior', 'Exterior', 'Full Wash']
      : ['Exterior'];

    return (
      <View style={styles.serviceSelectorContainer}>
        <Text style={styles.serviceSelectorLabel}>Choose service depth:</Text>
        <View style={styles.serviceToggle}>
          {availableServices.map((service) => (
            <TouchableOpacity
              key={service}
              style={[
                styles.serviceOption,
                selectedService === service && styles.serviceOptionActive,
              ]}
              onPress={() => {
                setSelectedService(service);
                setSelectedCategory(category.id);
              }}
            >
              <Text
                style={[
                  styles.serviceOptionText,
                  selectedService === service && styles.serviceOptionTextActive,
                ]}
              >
                {service.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>Estimated Duration</Text>
          <Text style={styles.durationValue}>{category.duration}</Text>
        </View>
        <View style={styles.priceBreakdown}>
          <Text style={styles.priceBreakdownLabel}>Price Breakdown:</Text>
          {category.prices.interior > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>Interior Only</Text>
              <Text style={styles.priceRowValue}>${category.prices.interior}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Exterior Only</Text>
            <Text style={styles.priceRowValue}>${category.prices.exterior}</Text>
          </View>
          {category.prices.interior > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>Full Wash (Best Value)</Text>
              <Text style={[styles.priceRowValue, styles.priceRowValueHighlight]}>
                ${category.prices.fullWash}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      <StatusBar barStyle="light-content" backgroundColor="#0a1419" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
  style={styles.headerButton}
  onPress={() => navigation.goBack()}
>

          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Cleaning</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="info-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Vehicle Category</Text>
          <Text style={styles.sectionSubtitle}>
            Prices vary based on vehicle dimensions
          </Text>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity
            style={[
              styles.quickAccessCard,
              selectedCategory === 'hatchback' && styles.quickAccessCardActive
            ]}
            onPress={() => {
              setSelectedCategory('hatchback');
              setExpandedItem('hatchback');
            }}
          >
            <MaterialIcons 
              name="directions-car" 
              size={40} 
              color={selectedCategory === 'hatchback' ? '#135BEC' : '#64748b'} 
            />
            <Text style={styles.quickAccessText}>Sedan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickAccessCard,
              selectedCategory === 'suv' && styles.quickAccessCardActive
            ]}
            onPress={() => {
              setSelectedCategory('suv');
              setExpandedItem('suv');
            }}
          >
            <MaterialIcons 
              name="airport-shuttle" 
              size={40} 
              color={selectedCategory === 'suv' ? '#135BEC' : '#64748b'} 
            />
            <Text style={styles.quickAccessText}>SUV</Text>
          </TouchableOpacity>
        </View>

        {/* Accordion List */}
        <View style={styles.accordionContainer}>
          {categories.map((category) => (
            <View key={category.id} style={styles.accordionItem}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleAccordion(category.id)}
              >
                <View style={styles.accordionHeaderLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      expandedItem === category.id && styles.iconContainerActive,
                    ]}
                  >
                    <MaterialIcons
                      name={category.icon}
                      size={28}
                      color={expandedItem === category.id ? '#135BEC' : '#64748b'}
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>
                      {category.description}
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name={expandedItem === category.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#94a3b8"
                />
              </TouchableOpacity>

              {expandedItem === category.id && (
                <View style={styles.accordionContent}>
                  {renderServiceSelector(category)}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom Price Card */}
      <View style={styles.bottomCard}>
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>SELECTED PRICE</Text>
            <Text style={styles.priceValue}>${getCurrentPrice().toFixed(2)}</Text>
            <Text style={styles.priceSubtext}>
              {getCurrentCategory()?.name} • {selectedService}
            </Text>
          </View>
 <TouchableOpacity
  style={styles.bookButton}
  onPress={() =>
    navigation.navigate("BookCleaning", {
      category: getCurrentCategory(),
      service: selectedService,
      price: getCurrentPrice(),
      duration: getCurrentDuration(),
    })
  }
>
  <Text style={styles.bookButtonText}>Book Now</Text>
  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
</TouchableOpacity>


        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color="#135BEC" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="calendar-today" size={24} color="#64748b" />
          <Text style={styles.navText}>Bookings</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1419',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293a',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  quickAccessCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2630',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293a',
    paddingVertical: 20,
    gap: 12,
  },
  quickAccessCardActive: {
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    borderColor: '#135BEC',
    borderWidth: 2,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  accordionContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 16,
  },
  accordionItem: {
    backgroundColor: '#111618',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293a',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1a2630',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1a2630',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(19, 164, 236, 0.2)',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  accordionContent: {
    padding: 16,
    backgroundColor: '#111618',
    borderTopWidth: 1,
    borderTopColor: '#1e293a',
  },
  serviceSelectorContainer: {
    gap: 16,
  },
  serviceSelectorLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  serviceToggle: {
    flexDirection: 'row',
    backgroundColor: '#1a2630',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  serviceOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  serviceOptionActive: {
    backgroundColor: '#0a1419',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },
  serviceOptionTextActive: {
    color: '#135BEC',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  durationValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  priceBreakdown: {
    backgroundColor: '#1a2630',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  priceBreakdownLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRowLabel: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  priceRowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  priceRowValueHighlight: {
    color: '#135BEC',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 72,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 20, 25, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#1e293a',
    paddingHorizontal: 16,
    paddingVertical: 16,
   // backdropFilter: 'blur(10px)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.5,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#135BEC',
    marginTop: 4,
  },
  priceSubtext: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#135BEC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#135BEC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0a1419',
    borderTopWidth: 1,
    borderTopColor: '#1e293a',
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 72,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
  },
  navTextActive: {
    color: '#135BEC',
    fontWeight: '700',
  },
});

export default VehicleSub;