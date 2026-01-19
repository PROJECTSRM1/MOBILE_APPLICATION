import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { SafeAreaView } from "react-native-safe-area-context";

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
}
type HomeSubCatParams = {
  propertyType?: '1BHK' | '2BHK' | '3BHK' | 'Studio' | 'Villa';
};


const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 24,
  color = '#000',
}) => (
  <Text style={{ fontSize: size, color, fontFamily: 'MaterialIcons' }}>
    {name}
  </Text>
);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type HomeSubCatRouteProp = RouteProp<RootStackParamList, 'HomeSubCat'>;

type ServiceKey = 'standard' | 'deep' | 'sanitization' | 'window';
type ServicesState = Record<ServiceKey, boolean>;

// Pricing configuration based on property type
const PRICING_CONFIG: Record<string, {
  standard: number;
  deep: number;
  sanitization: number;
  window: number;
  description: string;
}> = {
  '1BHK': {
    standard: 49,
    deep: 89,
    sanitization: 25,
    window: 15,
    description: '1 Bedroom, Hall & Kitchen setup',
  },
  '2BHK': {
    standard: 79,
    deep: 139,
    sanitization: 35,
    window: 15,
    description: '2 Bedrooms, Hall & Kitchen setup',
  },
  '3BHK': {
    standard: 109,
    deep: 189,
    sanitization: 45,
    window: 15,
    description: '3 Bedrooms, Hall & Kitchen setup',
  },
  'Studio': {
    standard: 39,
    deep: 69,
    sanitization: 20,
    window: 12,
    description: 'Studio apartment',
  },
  'Villa': {
    standard: 149,
    deep: 249,
    sanitization: 65,
    window: 20,
    description: 'Independent villa',
  },
};

export default function HomeSubCat() {
  const navigation = useNavigation<any>();

  const route = useRoute<RouteProp<Record<string, HomeSubCatParams>, string>>();

  
  // Get property type from route params, default to '1BHK'
  const propertyType = route.params?.propertyType || '1BHK';
  const pricing = PRICING_CONFIG[propertyType] || PRICING_CONFIG['1BHK'];

  const [services, setServices] = useState<ServicesState>({
    standard: true,
    deep: false,
    sanitization: false,
    window: false,
  });
  const [windowCount, setWindowCount] = useState(2);

  const calculateTotal = () => {
    let total = 0;
    if (services.standard) total += pricing.standard;
    if (services.deep) total += pricing.deep;
    if (services.sanitization) total += pricing.sanitization;
    if (services.window) total += pricing.window * windowCount;
    return total.toFixed(2);
  };

  const toggleService = (service: ServiceKey) => {
    setServices(prev => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101c22" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcon name="arrow_back_ios" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{propertyType} Service Options</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.helpButton}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Cleaning Tasks</Text>
          <Text style={styles.sectionSubtitle}>
            Tailored for a {pricing.description}.
          </Text>
        </View>

        {/* Service List */}
        <View style={styles.serviceList}>
          {/* Standard Cleaning */}
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => toggleService('standard')}
            activeOpacity={0.7}
          >
            <View style={styles.serviceContent}>
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  services.standard && styles.checkboxChecked
                ]}>
                  {services.standard && (
                    <MaterialIcon name="check" size={16} color="#fff" />
                  )}
                </View>
              </View>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>Standard Cleaning</Text>
                <Text style={styles.servicePrice}>${pricing.standard.toFixed(2)}</Text>
                <Text style={styles.serviceDescription}>
                  2 hrs • Dusting, mopping, basic kitchen and bathroom upkeep
                </Text>
              </View>
            </View>
            <View style={styles.serviceAction}>
              <Text style={styles.includedText}>INCLUDED</Text>
            </View>
          </TouchableOpacity>

          {/* Deep Cleaning */}
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => toggleService('deep')}
            activeOpacity={0.7}
          >
            <View style={styles.serviceContent}>
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  services.deep && styles.checkboxChecked
                ]}>
                  {services.deep && (
                    <MaterialIcon name="check" size={16} color="#fff" />
                  )}
                </View>
              </View>
              <View style={styles.serviceDetails}>
                <View style={styles.serviceTitleRow}>
                  <Text style={styles.serviceName}>Deep Cleaning</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>POPULAR</Text>
                  </View>
                </View>
                <Text style={styles.servicePrice}>${pricing.deep.toFixed(2)}</Text>
                <Text style={styles.serviceDescription}>
                  4 hrs • Grime removal, cabinet interiors, vent cleaning
                </Text>
              </View>
            </View>
            <View style={styles.serviceAction}>
              <Text style={styles.addText}>Add</Text>
            </View>
          </TouchableOpacity>

          {/* Sanitization */}
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => toggleService('sanitization')}
            activeOpacity={0.7}
          >
            <View style={styles.serviceContent}>
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  services.sanitization && styles.checkboxChecked
                ]}>
                  {services.sanitization && (
                    <MaterialIcon name="check" size={16} color="#fff" />
                  )}
                </View>
              </View>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>Full Sanitization</Text>
                <Text style={styles.servicePrice}>${pricing.sanitization.toFixed(2)}</Text>
                <Text style={styles.serviceDescription}>
                  1 hr • Hospital-grade surface disinfection
                </Text>
              </View>
            </View>
            <View style={styles.serviceAction}>
              <Text style={styles.addText}>Add</Text>
            </View>
          </TouchableOpacity>

          {/* Window Cleaning */}
          <View style={styles.serviceItemExpanded}>
            <TouchableOpacity
              style={styles.serviceItemTop}
              onPress={() => toggleService('window')}
              activeOpacity={0.7}
            >
              <View style={styles.serviceContent}>
                <View style={styles.checkboxContainer}>
                  <View style={[
                    styles.checkbox,
                    services.window && styles.checkboxChecked
                  ]}>
                    {services.window && (
                      <MaterialIcon name="check" size={16} color="#fff" />
                    )}
                  </View>
                </View>
                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceName}>Window Cleaning</Text>
                  <Text style={styles.servicePrice}>${pricing.window.toFixed(2)} / window</Text>
                  <Text style={styles.serviceDescription}>
                    Glass cleaning (interior & exterior)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Number of windows</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={styles.quantityButtonMinus}
                  onPress={() => setWindowCount(Math.max(1, windowCount - 1))}
                >
                  <MaterialIcon name="remove" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{windowCount}</Text>
                <TouchableOpacity
                  style={styles.quantityButtonPlus}
                  onPress={() => setWindowCount(windowCount + 1)}
                >
                  <MaterialIcon name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Tip Section */}
        <View style={styles.tipContainer}>
          <MaterialIcon name="info" size={20} color="#135BEC" />
          <Text style={styles.tipText}>
            For {propertyType} homes, we recommend selecting{' '}
            <Text style={styles.tipTextBold}>Deep Cleaning</Text> if it's been
            more than 3 months since your last professional service.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        {/* Summary Tab */}
        <View style={styles.summaryTab}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>TOTAL ESTIMATED</Text>
            <Text style={styles.summaryTotal}>${calculateTotal()}</Text>
          </View>
<TouchableOpacity
  style={styles.continueButton}
onPress={() =>
  navigation.navigate("BookCleaning", {
    propertyType,
    selectedServices: services,
    windowCount,
    totalPrice: calculateTotal(),
  })
}

>
  <Text style={styles.continueButtonText}>Continue</Text>
</TouchableOpacity>

        </View>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcon name="home" size={24} color="#9ca3af" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcon name="calendar_today" size={24} color="#135BEC" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcon name="chat_bubble" size={24} color="#9ca3af" />
            <Text style={styles.navLabel}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcon name="person" size={24} color="#9ca3af" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
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
  },
  helpButton: {
    color: '#135BEC',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
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
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  serviceList: {
    marginTop: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: '#1a262e',
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  serviceItemExpanded: {
    backgroundColor: '#1a262e',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  serviceItemTop: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    flex: 1,
  },
  checkboxContainer: {
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#135BEC',
    borderColor: '#135BEC',
  },
  serviceDetails: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  badge: {
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#135BEC',
    fontSize: 10,
    fontWeight: '700',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#135BEC',
    marginTop: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 20,
  },
  serviceAction: {
    marginTop: 4,
  },
  includedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#135BEC',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginLeft: 56,
    marginTop: 12,
    backgroundColor: 'rgba(16, 28, 34, 0.5)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  quantityButtonMinus: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    minWidth: 16,
    textAlign: 'center',
  },
  quantityButtonPlus: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#135BEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 164, 236, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(19, 164, 236, 0.2)',
    flexDirection: 'row',
    gap: 12,
  },
  tipText: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
    flex: 1,
  },
  tipTextBold: {
    color: '#135BEC',
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  summaryTab: {
    backgroundColor: '#1a262e',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryContent: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.5,
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#135BEC',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
  },
  navLabelActive: {
    color: '#135BEC',
  },
});