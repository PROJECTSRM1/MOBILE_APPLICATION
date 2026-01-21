import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// --- SVG Icons ---
const Icons = {
  Search: ({ color = '#999' }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" /><Path d="m21 21-4.3-4.3" />
    </Svg>
  ),
  Lab: ({ color = '#FFF' }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2" /><Path d="M8.5 2h7" /><Path d="M7 16h10" />
    </Svg>
  ),
  Pharmacy: ({ color = '#FFF' }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><Path d="m8.5 8.5 7 7" />
    </Svg>
  ),
  Map: ({ color = '#FFF' }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" /><Path d="M9 3v15" /><Path d="M15 6v15" />
    </Svg>
  ),
  Star: ({ color = '#FFD700' }) => (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
  ),
  Location: ({ color = '#999' }) => (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><Circle cx="12" cy="10" r="3" />
    </Svg>
  ),
  Clipboard: ({ color = '#1a7f7f' }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <Path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
    </Svg>
  ),
};

const facilitiesData = [
  // Pharmacies
  { id: '1', name: 'Wellness Plus Pharmacy', type: 'pharmacy', subtype: 'RETAIL PHARMACY', services: 'Amoxicillin, Paracetamol, Vitamins', rating: 4.9, distance: 0.8, deliveryTime: '25 - 40 mins', imageColor: '#D4A574', hasHomeService: true },
  { id: '3', name: 'HealthCare Pharmacy', type: 'pharmacy', subtype: 'RETAIL PHARMACY', services: 'Prescription medicines, OTC drugs', rating: 4.2, distance: 3.5, deliveryTime: '30 - 50 mins', imageColor: '#8B7355', hasHomeService: false },
  { id: '6', name: 'Generic Meds', type: 'pharmacy', subtype: 'DISCOUNT STORE', services: 'Affordable Generic Drugs', rating: 4.5, distance: 1.1, deliveryTime: '15 - 20 mins', imageColor: '#1a7f7f', hasHomeService: true },
  { id: '7', name: '24/7 City Pharma', type: 'pharmacy', subtype: 'EMERGENCY CARE', services: 'Antibiotics, First Aid', rating: 3.8, distance: 0.5, deliveryTime: '10 - 15 mins', imageColor: '#f87171', hasHomeService: true },

  // Labs
  { id: '2', name: 'City Diagnostic Center', type: 'lab', subtype: 'DIAGNOSTIC CENTER', services: 'CBC, MRI, X-Ray, Thyroid', rating: 4.8, distance: 1.2, imageColor: '#2C7873', hasHomeService: true },
  { id: '4', name: 'Precision Labs', type: 'lab', subtype: 'PATHOLOGY LAB', services: 'Blood Tests, Glucose, Urine', rating: 4.6, distance: 0.5, imageColor: '#4A90E2', hasHomeService: true },
  { id: '5', name: 'Apollo Health Lab', type: 'lab', subtype: 'DIAGNOSTIC CENTER', services: 'Lipid Profile, Liver Function', rating: 4.4, distance: 4.8, imageColor: '#9B59B6', hasHomeService: false },
  { id: '8', name: 'QuickScan Imaging', type: 'lab', subtype: 'IMAGING CENTER', services: 'Ultrasound, CT Scan', rating: 4.1, distance: 2.1, imageColor: '#64748b', hasHomeService: false },
];

const FacilitiesScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  
  const initialTab = route.params?.activeTab || 'pharmacy';
  const prescribedItems = route.params?.prescribedItems || [];

  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state if navigation params change from the consultation screen
  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params]);

  // --- FULLY DYNAMIC FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return facilitiesData.filter(item => {
      // 1. Filter by Tab (Lab vs Pharmacy)
      const matchesTab = item.type === activeTab;
      if (!matchesTab) return false;

      // 2. Filter by Search (Name or Services)
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.services.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      
      // 3. Filter by Category Chips
      if (activeFilter === 'Nearby') {
        return item.distance <= 1.5; // Nearby is within 1.5km
      }
      if (activeFilter === 'Ratings 4.5+') {
        return item.rating >= 4.5;
      }
      if (activeFilter === 'Home Collect') {
        return item.hasHomeService === true;
      }

      return true; // "All" filter
    });
  }, [activeTab, activeFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Facilities</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Toggle Tab */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'lab' && styles.activeTab]} 
            onPress={() => { setActiveTab('lab'); setActiveFilter('All'); }}
          >
            <View style={styles.tabContent}>
               <Icons.Lab color={activeTab === 'lab' ? '#2C7873' : '#999'} />
               <Text style={[styles.tabText, activeTab === 'lab' && styles.activeTabText]}>Nearby Labs</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pharmacy' && styles.activeTab]} 
            onPress={() => { setActiveTab('pharmacy'); setActiveFilter('All'); }}
          >
            <View style={styles.tabContent}>
               <Icons.Pharmacy color={activeTab === 'pharmacy' ? '#D4A574' : '#999'} />
               <Text style={[styles.tabText, activeTab === 'pharmacy' && styles.activeTabText]}>Pharmacies</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* PRESCRIPTION HIGHLIGHT SECTION */}
        {prescribedItems.length > 0 && (
          <View style={styles.prescriptionHighlight}>
            <View style={styles.highlightHeader}>
              <Icons.Clipboard color={activeTab === 'pharmacy' ? '#D4A574' : '#2C7873'} />
              <Text style={styles.highlightTitle}>
                {activeTab === 'pharmacy' ? 'Prescribed Medicines' : 'Requested Lab Tests'}
              </Text>
            </View>
            <View style={styles.itemsWrapper}>
              {prescribedItems.map((item: any, index: number) => (
                <View key={index} style={styles.itemChip}>
                  <Text style={styles.itemChipText}>{item.name}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.highlightFooter}>Showing facilities matching your results</Text>
          </View>
        )}

        {/* CATEGORY CHIPS FILTER */}
        <View style={styles.chipWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {['All', 'Nearby', 'Ratings 4.5+', 'Home Collect'].map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.categoryChip, isActive && styles.activeCategoryChip]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.categoryChipText, isActive && styles.activeCategoryChipText]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Icons.Search />
            <TextInput 
              placeholder={`Search in ${activeTab === 'pharmacy' ? 'pharmacies' : 'labs'}...`} 
              style={styles.input} 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={{color: '#94a3b8', fontSize: 12, fontWeight: '700'}}>CLEAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* List of Facilities */}
        <View style={styles.list}>
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.distanceRow}>
                  <Icons.Location color="#f87171" />
                  <Text style={styles.distanceText}> {item.distance} km away</Text>
                </View>

                <View style={styles.cardMain}>
                  <View style={[styles.iconPlaceholder, { backgroundColor: item.imageColor }]}>
                    {item.type === 'lab' ? <Icons.Lab /> : <Icons.Pharmacy />}
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.facilityName}>{item.name}</Text>
                    <Text style={styles.subtype}>{item.subtype}</Text>
                    <Text style={styles.services} numberOfLines={1}>{item.services}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Icons.Star />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View>
                      <Text style={styles.deliveryLabel}>
                        {item.type === 'pharmacy' ? 'ESTIMATED DELIVERY' : 'NEXT AVAILABLE SLOT'}
                      </Text>
                      <Text style={styles.deliveryTime}>
                        {item.type === 'pharmacy' ? item.deliveryTime : 'Today, 04:30 PM'}
                      </Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.orderBtn, { backgroundColor: item.type === 'lab' ? '#2C7873' : '#D4A574' }]}
                    onPress={() => Alert.alert(`Proceeding with ${item.name}`)}
                  >
                      <Text style={styles.orderBtnText}>
                        {item.type === 'pharmacy' ? 'Order Now' : 'Book Test'}
                      </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noData}>
              <Icons.Search color="#cbd5e1" />
              <Text style={styles.noDataText}>No {activeTab}s found matching "{activeFilter}"</Text>
              <TouchableOpacity onPress={() => {setActiveFilter('All'); setSearchQuery('');}}>
                <Text style={styles.resetText}>Reset all filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Map Button */}
      <TouchableOpacity style={styles.mapBtn}>
        <Icons.Map />
        <Text style={styles.mapBtnText}>View on Map</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF' },
  backButton: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  backArrow: { fontSize: 24, color: '#0f172a' },
  
  tabContainer: { flexDirection: 'row', margin: 16, backgroundColor: '#f1f5f9', borderRadius: 16, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabContent: { flexDirection: 'row', alignItems: 'center' },
  activeTab: { backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabText: { marginLeft: 8, fontWeight: '600', color: '#94a3b8', fontSize: 13 },
  activeTabText: { color: '#0f172a', fontWeight: '700' },

  // Prescription Highlight
  prescriptionHighlight: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 5,
    borderLeftColor: '#1a7f7f',
    elevation: 2,
  },
  highlightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  highlightTitle: { marginLeft: 10, fontSize: 15, fontWeight: '800', color: '#1e293b' },
  itemsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  itemChip: { backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  itemChipText: { fontSize: 12, color: '#1a7f7f', fontWeight: '700' },
  highlightFooter: { marginTop: 10, fontSize: 11, color: '#94a3b8', fontStyle: 'italic' },

  // Category Chips Filter
  chipWrapper: { marginBottom: 16 },
  chipScroll: { paddingHorizontal: 16, gap: 10 },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCategoryChip: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
  },
  activeCategoryChipText: {
    color: '#fff',
  },

  searchSection: { paddingHorizontal: 16, marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, height: 55, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1e293b', fontWeight: '500' },

  list: { paddingHorizontal: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  distanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  distanceText: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  cardMain: { flexDirection: 'row', alignItems: 'flex-start' },
  iconPlaceholder: { width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 15 },
  facilityName: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  subtype: { fontSize: 10, color: '#1a7f7f', fontWeight: '900', marginTop: 3, textTransform: 'uppercase', letterSpacing: 1 },
  services: { fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: '500' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  ratingText: { marginLeft: 5, fontWeight: '800', fontSize: 13, color: '#92400e' },
  
  cardFooter: { borderTopWidth: 1, borderTopColor: '#f1f5f9', marginTop: 15, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deliveryLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '800', letterSpacing: 0.5 },
  deliveryTime: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  orderBtn: { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 12, elevation: 2 },
  orderBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

  mapBtn: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#0f172a', flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 28, borderRadius: 35, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
  mapBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 10, fontSize: 15 },

  noData: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  noDataText: { color: '#64748b', fontSize: 15, textAlign: 'center', marginTop: 15, fontWeight: '600' },
  resetText: { color: '#1a7f7f', fontWeight: '800', marginTop: 15, fontSize: 14, textDecorationLine: 'underline' }
});

export default FacilitiesScreen;