import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type PropertyType = 'small' | 'medium' | 'large' | 'retail' | 'warehouse';

interface PropertyOption {
  id: PropertyType;
  icon: string;
  title: string;
  subtitle: string;
  price: string;
  isQuote?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CommercialPropertyScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>('medium');

const handleContinue = () => {
  // 1. Find the object for the selected ID (small, medium, etc.)
  const selectedData = properties.find(p => p.id === selectedProperty);

  if (selectedData) {
    // 2. Navigate to the Detail screen using the Title as the key
    navigation.navigate("CleaningDetailScreen", { 
      title: selectedData.title // e.g., "Small Office"
    });
  }
};


  const properties: PropertyOption[] = [
    {
      id: 'small',
      icon: 'computer',
      title: 'Small Office',
      subtitle: 'Up to 500 sqft',
      price: 'From $49',
    },
    {
      id: 'medium',
      icon: 'chair',
      title: 'Medium Office',
      subtitle: '500-2000 sqft',
      price: 'From $129',
    },
    {
      id: 'large',
      icon: 'business',
      title: 'Large Corporate Office',
      subtitle: '2000+ sqft',
      price: 'Quote',
      isQuote: true,
    },
    {
      id: 'retail',
      icon: 'store',
      title: 'Retail Shop/Showroom',
      subtitle: 'Public facing areas',
      price: 'From $89',
    },
    {
      id: 'warehouse',
      icon: 'warehouse',
      title: 'Warehouse/Clinic',
      subtitle: 'Specialized sanitation',
      price: 'From $199',
    },
  ];

  const renderPropertyCard = (property: PropertyOption) => {
    const isSelected = selectedProperty === property.id;

    return (
      <TouchableOpacity
        key={property.id}
        style={[styles.propertyCard, isSelected && styles.propertyCardSelected]}
        onPress={() => setSelectedProperty(property.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            isSelected ? styles.iconContainerSelected : styles.iconContainerDefault,
          ]}
        >
          <MaterialIcons 
            name={property.icon} 
            size={28} 
            color={isSelected ? '#135BEC' : '#9db0b9'} 
          />
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertySubtitle}>{property.subtitle}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.priceText,
              property.isQuote ? styles.priceQuote : styles.priceNormal,
            ]}
          >
            {property.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#101c22" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commercial Property</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Headline & Description */}
        <View style={styles.headlineContainer}>
          <Text style={styles.headline}>Select property type</Text>
          <Text style={styles.description}>
            Choose the option that best describes your commercial workspace for an accurate estimate.
          </Text>
        </View>

        {/* Property List */}
        <View style={styles.propertyList}>
          {properties.map(renderPropertyCard)}
        </View>

        {/* Bottom spacing for fixed button */}
        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom || 24 }]}>
        {/* Action Button */}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>
              View Packages for {properties.find(p => p.id === selectedProperty)?.title}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tab}>
            <MaterialIcons name="home" size={26} color="#64748b" />
            <Text style={styles.tabLabelInactive}>HOME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <MaterialIcons name="calendar-today" size={26} color="#135BEC" />
            <Text style={styles.tabLabelActive}>BOOKINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <MaterialIcons name="account-balance-wallet" size={26} color="#64748b" />
            <Text style={styles.tabLabelInactive}>WALLET</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <MaterialIcons name="person" size={26} color="#64748b" />
            <Text style={styles.tabLabelInactive}>PROFILE</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: 'rgba(16, 28, 34, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headlineContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#9db0b9',
    lineHeight: 24,
  },
  propertyList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2a33',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  propertyCardSelected: {
    borderColor: '#135BEC',
    shadowColor: '#135BEC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconContainerDefault: {
    backgroundColor: '#283339',
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(19, 91, 236, 0.2)',
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  propertySubtitle: {
    fontSize: 14,
    color: '#9db0b9',
  },
  priceContainer: {
    marginLeft: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
  },
  priceNormal: {
    color: '#135BEC',
  },
  priceQuote: {
    color: '#9db0b9',
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(16, 28, 34, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  actionButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  continueButton: {
    backgroundColor: '#135BEC',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#135BEC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabelActive: {
    fontSize: 10,
    fontWeight: '500',
    color: '#135BEC',
    letterSpacing: 0.5,
  },
  tabLabelInactive: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
    letterSpacing: 0.5,
  },
});

export default CommercialPropertyScreen;