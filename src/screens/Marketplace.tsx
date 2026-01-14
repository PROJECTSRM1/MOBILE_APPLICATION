import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigation, useRoute } from '@react-navigation/native'; // Added useRoute
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';


import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

type Category = 'All' | 'Tech' | 'Vehicles' | 'Housing';
type TopFilter = 'TOP_PICKS' | 'NEAR_YOU' | 'NEW';

const Compass = ({ size = 24, color = '#9CA3AF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M16 8l-2 6-6 2 2-6 6-2z" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

const MapIcon = ({ size = 24, color = '#9CA3AF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 4l6-2 6 2v16l-6-2-6 2-6-2V2l6 2z" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

const MessageCircle = ({ size = 24, color = '#9CA3AF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5a8.5 8.5 0 1 1-4.5-7.5L22 3l-1.5 5.5A8.4 8.4 0 0 1 21 11.5z" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

const User = ({ size = 24, color = '#9CA3AF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);


type Item = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: any;
  badge?: string;
  category: Category;
  topType: TopFilter;
};

// Original data moved inside state
const INITIAL_DATA: Item[] = [
  { id: '1', title: 'iPhone 15 Pro Max', price: '$1,199', location: 'Brooklyn, NY', image: require('../../assets/iphone.jpg'), category: 'Tech', topType: 'TOP_PICKS' },
  { id: '2', title: 'Gaming Laptop', price: '$1,499', location: 'San Jose, CA', image: require('../../assets/iphone.jpg'), category: 'Tech', topType: 'NEW' },
  { id: '3', title: 'Penthouse Loft', price: '$3,200 /mo', location: 'Manhattan, NY', image: require('../../assets/house.jpg'), badge: 'RENT', category: 'Housing', topType: 'NEAR_YOU' },
  { id: '4', title: '2BHK Apartment', price: '$2,100 /mo', location: 'Queens, NY', image: require('../../assets/house.jpg'), category: 'Housing', topType: 'TOP_PICKS' },
  { id: '5', title: 'Specialized MTB', price: '$850', location: 'Denver, CO', image: require('../../assets/bike.jpg'), category: 'Vehicles', topType: 'TOP_PICKS' },
  { id: '6', title: 'Tesla Model 3', price: '$39,000', location: 'San Jose, CA', image: require('../../assets/car.jpg'), badge: 'VERIFIED', category: 'Vehicles', topType: 'NEW' },

  // --- New items ---
  { id: '7', title: 'MacBook Air M2', price: '$999', location: 'Austin, TX', image: require('../../assets/a20.jpg'), category: 'Tech', topType: 'TOP_PICKS' },
  { id: '8', title: 'iPad Pro 12.9"', price: '$899', location: 'Seattle, WA', image: require('../../assets/iphone.jpg'), category: 'Tech', topType: 'NEW' },
  { id: '9', title: 'Sony WH-1000XM5', price: '$299', location: 'Chicago, IL', image: require('../../assets/iphone.jpg'), category: 'Tech', topType: 'NEAR_YOU' },
  { id: '10', title: 'React Native Course', price: '$25', location: 'Online', image: require('../../assets/samsung.jpg'), badge: 'POPULAR', category: 'Tech', topType: 'TOP_PICKS' },

  { id: '11', title: 'Studio Apartment', price: '$1,500 /mo', location: 'Boston, MA', image: require('../../assets/house.jpg'), category: 'Housing', topType: 'NEW' },
  { id: '12', title: 'Luxury Villa', price: '$5,800 /mo', location: 'Miami, FL', image: require('../../assets/house.jpg'), badge: 'PREMIUM', category: 'Housing', topType: 'TOP_PICKS' },
  { id: '13', title: 'Shared PG Room', price: '$450 /mo', location: 'Jersey City, NJ', image: require('../../assets/house.jpg'), category: 'Housing', topType: 'NEAR_YOU' },
  { id: '14', title: '1BHK Fully Furnished', price: '$1,850 /mo', location: 'Brooklyn, NY', image: require('../../assets/house.jpg'), category: 'Housing', topType: 'NEW' },
  { id: '15', title: 'Yamaha R15 Bike', price: '$1,200', location: 'Los Angeles, CA', image: require('../../assets/bike.jpg'), category: 'Vehicles', topType: 'TOP_PICKS' },
  { id: '16', title: 'Honda Civic 2020', price: '$18,500', location: 'Dallas, TX', image: require('../../assets/car1.jpg'), category: 'Vehicles', topType: 'NEW' },
  { id: '17', title: 'Scooter Activa 6G', price: '$650', location: 'San Diego, CA', image: require('../../assets/mt15.jpg'), category: 'Vehicles', topType: 'NEAR_YOU' },
  { id: '18', title: 'Jeep Wrangler', price: '$42,000', location: 'Phoenix, AZ', image: require('../../assets/car.jpg'), badge: 'VERIFIED', category: 'Vehicles', topType: 'TOP_PICKS' },
  { id: '19', title: 'Canon DSLR Camera', price: '$720', location: 'Portland, OR', image: require('../../assets/a20.jpg'), category: 'Tech', topType: 'NEW' },
  { id: '20', title: 'PlayStation 5', price: '$499', location: 'Atlanta, GA', image: require('../../assets/a20.jpg'), badge: 'HOT', category: 'Tech', topType: 'TOP_PICKS' },
  { id: '21', title: 'Electric Cycle', price: '$1,050', location: 'San Francisco, CA', image: require('../../assets/bike.jpg'), category: 'Vehicles', topType: 'NEAR_YOU' },
{ id: '22', title: 'iPhone 15 Pro Max', price: '$1,199', location: 'Brooklyn, NY', image: require('../../assets/car1.jpg'), category: 'Tech', topType: 'TOP_PICKS' },
{ id: '23', title: 'Gaming Laptop', price: '$1,499', location: 'San Jose, CA', image: require('../../assets/laptop.jpg'), category: 'Tech', topType: 'TOP_PICKS' },
{ id: '24', title: 'MacBook Air M2', price: '$999', location: 'Austin, TX', image: require('../../assets/car.jpg'), category: 'Tech', topType: 'TOP_PICKS' },
{ id: '25', title: 'MT15 Bike', price: '$899', location: 'Seattle, WA', image: require('../../assets/mt15.jpg'), category: 'Vehicles', topType: 'TOP_PICKS' },

];


const Marketplace: React.FC = () => {
  const [items, setItems] = useState<Item[]>(INITIAL_DATA); // Data is now dynamic
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [topFilter, setTopFilter] = useState<TopFilter>('TOP_PICKS');
  const [mode, setMode] = useState<'BUY' | 'RENT'>('BUY');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // EFFECT TO CAPTURE NEW DATA FROM SELL SCREEN
useEffect(() => {
  const handleNewItem = async () => {
    if (!route.params?.newItem) return;

    const newItem = route.params.newItem;

    // 1. Update UI immediately
    setItems(prev => [newItem, ...prev]);

    try {
      // 2. Get already stored items
      const stored = await AsyncStorage.getItem('MARKETPLACE_ITEMS');
      const parsed = stored ? JSON.parse(stored) : [];

      // 3. Append new item to existing ones
      const updated = [newItem, ...parsed];

      // 4. Save back FULL array (not overwrite with only 1)
      await AsyncStorage.setItem(
        'MARKETPLACE_ITEMS',
        JSON.stringify(updated)
      );

      console.log('Saved items:', updated);
    } catch (e) {
      console.log('Save error:', e);
    }

    // 5. Clear param
    navigation.setParams({ newItem: undefined });
  };

  handleNewItem();
}, [route.params?.newItem]);



  const filteredData = items.filter(item => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    const topFilterMatch = item.topType === topFilter;
    return categoryMatch && topFilterMatch;
  });

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {/* Check if image is a local require or a URI object */}
        <Image source={typeof item.image === 'number' ? item.image : (item.image || { uri: 'https://via.placeholder.com/150' })} style={styles.cardImage} />
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const TABS = [
    { id: 'Discover', label: 'Discover', Icon: Compass },
    { id: 'Map', label: 'Map', Icon: MapIcon },
    { id: 'Chats', label: 'Chats', Icon: MessageCircle },
    { id: 'Profile', label: 'Profile', Icon: User },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ zIndex: 100 }}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setShowModeDropdown(!showModeDropdown)}
          >
            <Text style={styles.modeText}>{mode === 'BUY' ? 'Buy Mode' : 'Rent Mode'}</Text>
            <Text style={styles.modeArrow}> ▾</Text>
          </TouchableOpacity>

          {showModeDropdown && (
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMode('BUY'); setShowModeDropdown(false); }}>
                <Text style={styles.dropdownText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMode('RENT'); setShowModeDropdown(false); }}>
                <Text style={styles.dropdownText}>Rent</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.headerText}>Marketplace</Text>

        <TouchableOpacity style={styles.sellButton} onPress={() => navigation.navigate('SellItem')}>
          <Text style={styles.sellText}>Sell</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={
          <>
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Search items..."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.topFilterRow}>
              {(['TOP_PICKS', 'NEAR_YOU', 'NEW'] as TopFilter[]).map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.topFilterItem, topFilter === filter && styles.topFilterActive]}
                  onPress={() => setTopFilter(filter)}
                >
                  <Text style={[styles.topFilterText, topFilter === filter && styles.topFilterTextActive]}>
                    {filter.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {(['All', 'Tech', 'Vehicles', 'Housing'] as Category[]).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, activeCategory === cat && styles.categoryActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Items</Text>
              <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No items found in this category.</Text>}
      />

      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const isActive = tab.id === 'Discover';
          return (
            <TouchableOpacity key={tab.id} style={styles.navItem}>
              <tab.Icon 
                size={24} 
                color={isActive ? '#3B82F6' : '#9CA3AF'} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
export default Marketplace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sellButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sellText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  listPadding: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Space for bottom nav
  },
  searchBox: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 45,
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  searchInput: {
    color: '#fff',
    fontSize: 15,
  },
  topFilterRow: {
    flexDirection: 'row',
    marginHorizontal: 6,
    marginBottom: 15,
    marginTop: 5,
  },
  topFilterItem: {
    marginRight: 20,
    paddingBottom: 8,
  },
  topFilterActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  topFilterText: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 13,
  },
  topFilterTextActive: {
    color: '#3B82F6',
  },
  categoryRow: {
    marginBottom: 20,
    paddingLeft: 6,
  },
  categoryChip: {
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  categoryActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 6,
    flex: 1, // This ensures equal width grid items
    maxWidth: (width / 2) - 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  price: {
    color: '#60A5FA',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 4,
  },
  location: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
  },
bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B1220',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 30, // Extra padding for iPhone bottom bar
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    elevation: 20, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 11,
    marginTop: 4, // Space between icon and text
  },
  navTextActive: {
    color: '#3B82F6', // Blue color for active tab
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  modeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  modeArrow: {
    color: '#3B82F6',
    fontSize: 12,
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  dropdownText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});