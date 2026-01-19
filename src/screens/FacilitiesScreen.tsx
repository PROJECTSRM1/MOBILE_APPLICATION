import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- Custom SVG Icons ---
const Icons = {
  Search: ({ color = '#999' }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" /><Path d="m21 21-4.3-4.3" />
    </Svg>
  ),
  Filter: ({ color = '#666' }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 6h16M4 12h16M4 18h16" />
    </Svg>
  ),
  Lab: ({ color = '#FFF' }) => (
    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2" /><Path d="M8.5 2h7" /><Path d="M7 16h10" />
    </Svg>
  ),
  Pharmacy: ({ color = '#FFF' }) => (
    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
};

// --- Mock Data ---
const facilities = [
  { id: '1', name: 'Wellness Plus Pharmacy', type: 'pharmacy', subtype: 'RETAIL PHARMACY', services: 'Medicines available from last consult', rating: 4.9, distance: 0.8, deliveryTime: '25 - 40 mins', imageColor: '#D4A574' },
  { id: '2', name: 'City Diagnostic Center', type: 'lab', subtype: 'DIAGNOSTIC CENTER', services: 'Blood Tests, MRI, X-Ray, Genetic Screening', rating: 4.8, distance: 1.2, imageColor: '#2C7873' },
  { id: '3', name: 'HealthCare Pharmacy', type: 'pharmacy', subtype: 'RETAIL PHARMACY', services: 'Prescription medicines, OTC drugs', rating: 4.2, distance: 3.5, deliveryTime: '30 - 50 mins', imageColor: '#8B7355' },
];

const FacilitiesScreen = () => {
  const [activeTab, setActiveTab] = useState('pharmacy');
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Filtering Logic
  const filteredData = useMemo(() => {
    return facilities.filter(item => {
      const matchesTab = item.type === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'Nearby' ? item.distance < 2.0 : (activeFilter === 'Ratings 4.5+' ? item.rating >= 4.5 : true);
      return matchesTab && matchesSearch && matchesFilter;
    });
  }, [activeTab, activeFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Labs & Pharmacies</Text>
        <TouchableOpacity><Text style={styles.dotsIcon}>⋮</Text></TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icons.Search />
          <TextInput 
            placeholder="Search facilities or medicines..." 
            style={styles.input} 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icons.Filter />
        </View>
      </View>

      {/* Toggle Tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'lab' && styles.activeTab]} 
          onPress={() => setActiveTab('lab')}
        >
          <View style={styles.tabContent}>
             <Icons.Lab color={activeTab === 'lab' ? '#2C7873' : '#666'} />
             <Text style={[styles.tabText, activeTab === 'lab' && styles.activeTabText]}>Nearby Labs</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pharmacy' && styles.activeTab]} 
          onPress={() => setActiveTab('pharmacy')}
        >
          <View style={styles.tabContent}>
             <Icons.Pharmacy color={activeTab === 'pharmacy' ? '#D4A574' : '#666'} />
             <Text style={[styles.tabText, activeTab === 'pharmacy' && styles.activeTabText]}>Pharmacies</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {['Nearby', 'Ratings 4.5+', 'Home Collect'].map(filter => (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setActiveFilter(filter)}
              style={[styles.chip, activeFilter === filter && styles.activeChip]}
            >
              <Text style={[styles.chipText, activeFilter === filter && styles.activeChipText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dynamic List */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredData.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.distanceRow}>
              <Icons.Location color="#D9534F" />
              <Text style={styles.distanceText}> {item.distance} km away</Text>
            </View>

            <View style={styles.cardMain}>
              <View style={[styles.iconPlaceholder, { backgroundColor: item.imageColor }]}>
                {item.type === 'lab' ? <Icons.Lab /> : <Icons.Pharmacy />}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.facilityName}>{item.name}</Text>
                <Text style={styles.subtype}>{item.subtype}</Text>
                <Text style={styles.services}>{item.services}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Icons.Star />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
               <View>
                  <Text style={styles.deliveryLabel}>ESTIMATED DELIVERY</Text>
                  <Text style={styles.deliveryTime}>{item.deliveryTime || 'N/A'}</Text>
               </View>
               <TouchableOpacity style={styles.orderBtn}>
                  <Text style={styles.orderBtnText}>{item.type === 'pharmacy' ? 'Order Now' : 'Book Test'}</Text>
               </TouchableOpacity>
            </View>
          </View>
        ))}
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  backArrow: { fontSize: 24 },
  dotsIcon: { fontSize: 24 },
  searchSection: { padding: 16 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    paddingHorizontal: 12, 
    height: 50, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 14 },
  tabContainer: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#F0F0F0', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  tabContent: { flexDirection: 'row', alignItems: 'center' },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { marginLeft: 8, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#2C7873' },
  filterScroll: { paddingLeft: 16, marginVertical: 16 },
  chip: { 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#EEE',
    height: 45,
    justifyContent: 'center'
  },
  activeChip: { backgroundColor: '#2C7873', borderColor: '#2C7873' },
  chipText: { fontWeight: '600', color: '#666' },
  activeChipText: { color: '#FFF' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 4 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  distanceText: { color: '#888', fontSize: 12 },
  cardMain: { flexDirection: 'row', alignItems: 'flex-start' },
  iconPlaceholder: { width: 55, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 12 },
  facilityName: { fontSize: 16, fontWeight: '700', color: '#333' },
  subtype: { fontSize: 11, color: '#2C7873', fontWeight: '700', marginTop: 2, textTransform: 'uppercase' },
  services: { fontSize: 12, color: '#777', marginTop: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E5', padding: 6, borderRadius: 8 },
  ratingText: { marginLeft: 4, fontWeight: '700', fontSize: 12 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 15, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deliveryLabel: { fontSize: 10, color: '#999', fontWeight: '700' },
  deliveryTime: { fontSize: 15, fontWeight: '800', color: '#333' },
  orderBtn: { backgroundColor: '#2C7873', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  orderBtnText: { color: '#FFF', fontWeight: '700' },
  mapBtn: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#000', flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30, alignItems: 'center' },
  mapBtnText: { color: '#FFF', fontWeight: '700', marginLeft: 8 }
});

export default FacilitiesScreen;