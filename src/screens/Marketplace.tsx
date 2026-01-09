import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
} from 'react-native';
import SellItem from './SellItem';

type Category = 'All' | 'Tech' | 'Vehicles' | 'Housing';
type TopFilter = 'TOP_PICKS' | 'NEAR_YOU' | 'NEW';

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

const DATA: Item[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max',
    price: '$1,199',
    location: 'Brooklyn, NY',
    image: require('../../assets/iphone.jpg'),
    category: 'Tech',
    topType: 'TOP_PICKS',
  },
  {
    id: '2',
    title: 'Gaming Laptop',
    price: '$1,499',
    location: 'San Jose, CA',
    image: require('../../assets/iphone.jpg'),
    category: 'Tech',
    topType: 'NEW',
  },
  {
    id: '3',
    title: 'Penthouse Loft',
    price: '$3,200 /mo',
    location: 'Manhattan, NY',
    image: require('../../assets/house.jpg'),
    badge: 'RENT',
    category: 'Housing',
    topType: 'NEAR_YOU',
  },
  {
    id: '4',
    title: '2BHK Apartment',
    price: '$2,100 /mo',
    location: 'Queens, NY',
    image: require('../../assets/house.jpg'),
    category: 'Housing',
    topType: 'TOP_PICKS',
  },
  {
    id: '5',
    title: 'Specialized MTB',
    price: '$850',
    location: 'Denver, CO',
    image: require('../../assets/bike.jpg'),
    category: 'Vehicles',
    topType: 'TOP_PICKS',
  },
  {
    id: '6',
    title: '2023 Tesla Model 3',
    price: '$39,000',
    location: 'San Jose, CA',
    image: require('../../assets/car.jpg'),
    badge: 'VERIFIED',
    category: 'Vehicles',
    topType: 'NEW',
  },
];

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('Tech');
  const [topFilter, setTopFilter] = useState<TopFilter>('TOP_PICKS');
  const [mode, setMode] = useState<'BUY' | 'RENT'>('BUY');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const navigation = useNavigation<any>();


  const filteredData = DATA.filter(item => {
    const categoryMatch =
      activeCategory === 'All' || item.category === activeCategory;
    const topFilterMatch = item.topType === topFilter;
    return categoryMatch && topFilterMatch;
  });

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />

      {item.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.location}>{item.location}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setShowModeDropdown(!showModeDropdown)}
          >
            <Text style={styles.modeText}>
              {mode === 'BUY' ? 'Buy Mode' : 'Rent Mode'}
            </Text>
            <Text style={styles.modeArrow}>▾</Text>
          </TouchableOpacity>

          {showModeDropdown && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMode('BUY');
                  setShowModeDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMode('RENT');
                  setShowModeDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>Rent</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.headerText}>Marketplace</Text>

        <TouchableOpacity
  style={styles.sellButton}
  onPress={() => navigation.navigate('SellItem')}
>
  <Text style={styles.sellText}>Sell</Text>
</TouchableOpacity>

      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search apartments, tech, cars..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* Top Filters */}
      <View style={styles.topFilterRow}>
        {(['TOP_PICKS', 'NEAR_YOU', 'NEW'] as TopFilter[]).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.topFilterItem,
              topFilter === filter && styles.topFilterActive,
            ]}
            onPress={() => setTopFilter(filter)}
          >
            <Text
              style={[
                styles.topFilterText,
                topFilter === filter && styles.topFilterTextActive,
              ]}
            >
              {filter.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {(['All', 'Tech', 'Vehicles', 'Housing'] as Category[]).map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              activeCategory === cat && styles.categoryActive,
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST (NO GAP FIXED) */}
  {/* Section Header */}
<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Trending Near You</Text>
  <Text style={styles.viewAll}>View All</Text>
</View>

{/* FlatList (FIXED – NO GAP) */}
<FlatList
  data={filteredData}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: 'space-between' }}
  contentContainerStyle={{
    paddingBottom: 250, // for bottom nav
  }}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={
    <Text style={styles.emptyText}>No items found</Text>
  }
/>


      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {['Discover', 'Map', 'Chats', 'Profile'].map(tab => (
          <Text key={tab} style={styles.navText}>
            {tab}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Marketplace;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
     marginBottom: 8,
     height:100,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  sellButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sellText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchBox: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    color: '#fff',
  },

  topFilterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  topFilterItem: {
    marginRight: 18,
    paddingBottom: 6,
  },
  topFilterActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  topFilterText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 14,
  },
  topFilterTextActive: {
    color: '#3B82F6',
  },

  categoryRow: {
    marginTop: 8,
    paddingBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },

sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between', 
    marginTop:9,
  marginBottom: 9,
},

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    color: '#2563EB',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 10,
    margin: 6,
    width: '48%',
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  price: {
    color: '#60A5FA',
    fontWeight: '700',
    marginTop: 2,
  },
  location: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B1220',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  navText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },

  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  modeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  modeArrow: {
    color: '#9CA3AF',
    marginLeft: 4,
    fontSize: 14,
  },

  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#111827',
    borderRadius: 10,
    width: 110,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: '#fff',
    fontWeight: '600',
  },});