import React, { useState, useMemo ,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from '../context/ThemeContext';
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// Define your navigation types
type RootStackParamList = {
    CompaniesListingScreen: undefined;  
  JobDetails: { companyId: number };
   Landing: undefined;  // Add this
  EducationHome: undefined;  // Add this
  ProfileInformation: undefined; 
};


interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  location: string;
  size: string;
  isRemote: boolean;
  badge: string;
  badgeColor: string;
  active?: string;
  icon: string;
  iconBg: string;
  // description: string;
}

const SIZES = ['All', '50-200', '200-500', '500+', '1000+'];
type CompaniesNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompaniesListingScreen"
>;

const CompaniesScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<CompaniesNavProp>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<number>(2);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'name' | 'location' | 'size' | null>(null);
const [companies, setCompanies] = useState<Company[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const [industries, setIndustries] = useState<string[]>(['All']);
const [locations, setLocations] = useState<string[]>(['All']);


useEffect(() => {
  fetchCompanies();
}, []);

const fetchCompanies = async () => {
  try {
    setLoading(true);
    const response = await fetch(
      "https://swachify-india-be-1-mcrb.onrender.com/api/jobs/openings"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Industry mapping based on industry_id
    const industryMap: { [key: number]: string } = {
      1: "AI & Machine Learning",
      2: "Cloud Computing",
      6: "EdTech",
      8: "Finance & Banking",
      9: "Healthcare",
      14: "Software Engineering",
    };

    // Function to extract location from company address
    const getLocationFromAddress = (address: string): string => {
      if (!address) return 'Remote';
      
      const addr = address.toLowerCase();
      
      if (addr.includes('hyderabad')) return 'Hyderabad';
      if (addr.includes('bangalore') || addr.includes('bengaluru')) return 'Bangalore';
      if (addr.includes('mumbai')) return 'Mumbai';
      if (addr.includes('chennai')) return 'Chennai';
      if (addr.includes('pune')) return 'Pune';
      if (addr.includes('remote')) return 'Remote';
      
      return address; // Return original if no match
    };

    // Map companies with proper industry and location
    const mappedCompanies: Company[] = data.map((item: any, index: number) => {
      const industry = industryMap[item.industry_id] || "Other";
      const location = getLocationFromAddress(item.company_address || '');
      
      return {
        id: item.id || index,
        name: item.company_name || "Unknown Company",
        industry: industry,
        location: location,
        size: item.company_size_id ? `${item.company_size_id * 50}-${item.company_size_id * 50 + 200}` : "Not specified",
        isRemote: location === 'Remote',
        description: item.role_description || item.requirements || "No description available",
        badge: item.is_active ? "Open Position" : "Position Closed",
        badgeColor: item.is_active ? "#22c55e" : "#6b7280",
        active: item.created_date 
          ? `Posted ${new Date(item.created_date).toLocaleDateString()}` 
          : "Recently posted",
        icon: "business",
        iconBg: "#135bec",
      };
    });

    // Extract unique industries from the data
    const uniqueIndustries = Array.from(
      new Set(mappedCompanies.map(company => company.industry).filter(industry => industry !== "Other"))
    ).sort();

    // Extract unique locations from the data
    const uniqueLocations = Array.from(
      new Set(mappedCompanies.map(company => company.location))
    ).filter(loc => ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'Pune', 'Remote'].includes(loc))
    .sort();

    setIndustries(['All', ...uniqueIndustries]);
    setLocations(['All', ...uniqueLocations]);
    setCompanies(mappedCompanies);
    setError(null);
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Failed to load companies. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  // Dropdown states
  const [showIndustryDropdown, setShowIndustryDropdown] = useState<boolean>(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState<boolean>(false);
  
  // Pagination
  const [displayCount, setDisplayCount] = useState<number>(4);

  // Toggle bookmark
  const toggleBookmark = (id: number) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Filter companies based on filters and search query
 // Filter companies based on filters and search query
const filteredCompanies = useMemo(() => {
  let result = companies;

  // Show only bookmarked companies if in bookmark view
  if (showBookmarks) {
    result = result.filter(company => bookmarkedIds.has(company.id));
  } else {
    // Apply industry filter
    if (selectedIndustry !== 'All') {
      result = result.filter(company => 
        company.industry === selectedIndustry
      );
    }

    // Apply location filter
    if (selectedLocation !== 'All') {
      if (selectedLocation === 'Remote') {
        result = result.filter(company => company.isRemote);
      } else {
        result = result.filter(company => 
          company.location === selectedLocation
        );
      }
    }

    // Apply size filter - FIXED VERSION
    if (selectedSize !== 'All') {
      result = result.filter(company => {
        if (company.size === 'Not specified') return false;
        
        // Extract the lower bound from company size (e.g., "50-250" -> 50)
        const companyMinSize = parseInt(company.size.split('-')[0]);
        
        switch (selectedSize) {
          case '50-200':
            return companyMinSize >= 50 && companyMinSize < 200;
          case '200-500':
            return companyMinSize >= 200 && companyMinSize < 500;
          case '500+':
            return companyMinSize >= 500 && companyMinSize < 1000;
          case '1000+':
            return companyMinSize >= 1000;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query)
      );
    }
  }

  // Apply sorting
  if (sortBy) {
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });
  }

  return result;
}, [selectedIndustry, selectedLocation, selectedSize, searchQuery, showBookmarks, bookmarkedIds, sortBy, companies]);

  // Companies to display (with pagination)
  const displayedCompanies = showBookmarks ? filteredCompanies : filteredCompanies.slice(0, displayCount);
  const hasMoreCompanies = !showBookmarks && displayCount < filteredCompanies.length;

  const loadMoreCompanies = () => {
    setDisplayCount(prev => Math.min(prev + 4, filteredCompanies.length));
  };

const CompanyCard = ({ 
  company, 
  bookmarkedIds, 
  toggleBookmark 
}: { 
  company: Company; 
  bookmarkedIds: Set<number>;
  toggleBookmark: (id: number) => void;
}) => {
  const isBookmarked = bookmarkedIds.has(company.id);
  
  const handleViewDetails = () => {
    navigation.navigate('JobDetails', { companyId: company.id });

  };
  
  return (
    <TouchableOpacity onPress={handleViewDetails} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.companyInfo}>
            <View style={[styles.logo, { backgroundColor: company.iconBg }]}>
              <MaterialIcons name={company.icon} size={24} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.industry}>{company.industry}</Text>
            </View>
          </View>
          <TouchableOpacity 
  onPress={(e) => {
    e.stopPropagation(); // Prevent card click when bookmarking
    toggleBookmark(company.id);
  }}
>
  <MaterialIcons 
    name={isBookmarked ? "bookmark" : "bookmark-border"} 
    size={24} 
    color={isBookmarked ? colors.primary : "#9da6b9"} 
  />
</TouchableOpacity>

        </View>

        <Text style={styles.description} numberOfLines={2}>
          {company.description}
        </Text>

        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <MaterialIcons 
              name={company.isRemote ? 'public' : 'location-on'} 
              size={14} 
              color="#9da6b9" 
            />
            <Text style={styles.tagText}>{company.location}</Text>
          </View>
          <View style={styles.tag}>
            <MaterialIcons name="people" size={14} color="#9da6b9" />
            <Text style={styles.tagText}>{company.size} employees</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View
            style={[styles.badge, { backgroundColor: company.badgeColor + "22" }]}
          >
            <MaterialIcons 
              name={company.badge.includes('Internship') ? 'work' : 
                    company.badge.includes('Opening') ? 'check-circle' : 
                    'info'} 
              size={14} 
              color={company.badgeColor} 
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.badgeText, { color: company.badgeColor }]}>
              {company.badge}
            </Text>
          </View>
          {company.active && <Text style={styles.active}>{company.active}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

  const DropdownModal = ({ 
    visible, 
    onClose, 
    options, 
    selected, 
    onSelect, 
    title 
  }: { 
    visible: boolean; 
    onClose: () => void; 
    options: string[]; 
    selected: string; 
    onSelect: (option: string) => void;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownModal}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.dropdownList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  selected === option && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                  setDisplayCount(4); // Reset pagination when filter changes
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selected === option && styles.dropdownItemTextSelected
                ]}>
                  {option}
                </Text>
                {selected === option && (
                  <MaterialIcons name="check" size={20} color="#135bec" />
                )}
              </TouchableOpacity>
            ))}
            {loading && (
  <Text style={{ textAlign: "center", color: colors.subText }}>
    Loading companies...
  </Text>
)}

{error && (
  <Text style={{ textAlign: "center", color: "red" }}>
    {error}
  </Text>
)}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#101622" />
      
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
  style={styles.iconButton} 
  onPress={() => navigation.goBack()}
>
  <MaterialIcons name="arrow-back" size={24} color={colors.text} />
</TouchableOpacity>

          <Text style={styles.pageTitle}>
            {showBookmarks ? 'Bookmarks' : 'Companies'}
          </Text>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowBookmarks(!showBookmarks)}
          >
            <View>
              <MaterialIcons 
                name={showBookmarks ? "close" : "bookmark-border"} 
                size={24} 
                color="#ffffff" 
              />
              {!showBookmarks && bookmarkedIds.size > 0 && (
                <View style={styles.bookmarkBadge}>
                  <Text style={styles.bookmarkBadgeText}>{bookmarkedIds.size}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar - Only show when not in bookmarks view */}
        {!showBookmarks && (
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color="#9da6b9" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search companies, roles..."
                placeholderTextColor="#9da6b9"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setDisplayCount(4); // Reset pagination when search changes
                }}
              />
            </View>
          </View>
        )}

        {/* Dropdown Filters - Only show when not in bookmarks view */}
        {!showBookmarks && (
          <View style={styles.filtersRow}>
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowIndustryDropdown(true)}
            >
              <Text style={styles.filterLabel}>
                {selectedIndustry === 'All' ? 'Industry' : selectedIndustry}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowLocationDropdown(true)}
            >
              <Text style={styles.filterLabel}>
                {selectedLocation === 'All' ? 'Location' : selectedLocation.length > 10 ? selectedLocation.substring(0, 10) + '...' : selectedLocation}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowSizeDropdown(true)}
            >
              <Text style={styles.filterLabel}>
                {selectedSize === 'All' ? 'Size' : selectedSize}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Dropdown Modals */}
        <DropdownModal
          visible={showIndustryDropdown}
          onClose={() => setShowIndustryDropdown(false)}
          options={industries}
          selected={selectedIndustry}
          onSelect={setSelectedIndustry}
          title="Select Industry"
        />
        
        <DropdownModal
          visible={showLocationDropdown}
          onClose={() => setShowLocationDropdown(false)}
          options={locations}
          selected={selectedLocation}
          onSelect={setSelectedLocation}
          title="Select Location"
        />
        
        <DropdownModal
          visible={showSizeDropdown}
          onClose={() => setShowSizeDropdown(false)}
          options={SIZES}
          selected={selectedSize}
          onSelect={setSelectedSize}
          title="Select Size"
        />

        {/* Results Counter and Sort - Only show when not in bookmarks view */}
        {/* Results Counter and Sort - Only show when not in bookmarks view */}
{/* Results Counter and Sort - Only show when not in bookmarks view */}
{!showBookmarks && (
  <View style={styles.resultsBar}>
    <Text style={styles.resultsText}>
      Showing {filteredCompanies.length} companies
    </Text>
    <TouchableOpacity
      style={styles.sortButton}
      onPress={() => {
        setSortBy(prev =>
          prev === 'name'
            ? 'location'
            : prev === 'location'
            ? 'size'
            : 'name'
        );
        setDisplayCount(4); // reset pagination
      }}
    >
      <Text style={styles.sortText}>
        {sortBy ? `Sorted by ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}` : 'Sort by'}
      </Text>
      <MaterialIcons 
        name={sortBy ? "arrow-upward" : "sort"} 
        size={18} 
        color="#135bec" 
      />
    </TouchableOpacity>
  </View>
)}
        {/* Company Cards */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {displayedCompanies.length > 0 ? (
            <>
            {displayedCompanies.map((company) => (
  <CompanyCard 
    key={company.id} 
    company={company} 
    bookmarkedIds={bookmarkedIds} 
    toggleBookmark={toggleBookmark} 
  />
))}

              
              {/* Load More Button - Only show when there are more companies to load */}
              {hasMoreCompanies && (
                <TouchableOpacity 
                  style={styles.loadMoreButton}
                  onPress={loadMoreCompanies}
                >
                  <Text style={styles.loadMoreText}>Load more companies</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#135bec" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons 
                name={showBookmarks ? "bookmark-border" : "search-off"} 
                size={48} 
                color="#9da6b9" 
              />
              <Text style={styles.emptyText}>
                {showBookmarks ? 'No bookmarks yet' : 'No companies found'}
              </Text>
              <Text style={styles.emptySubText}>
                {showBookmarks 
                  ? 'Start bookmarking companies to see them here'
                  : 'Try adjusting your filters or search query'
                }
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
       {/* Bottom Navigation */}
<SafeAreaView style={styles.bottomNavContainer} edges={['bottom']}>
  <View style={styles.bottomNav}>
    <TouchableOpacity 
      style={styles.navItem}
      onPress={() => {
        setActiveTab(0);
        navigation.navigate('Landing');  // Add navigation
      }}
    >
      <MaterialIcons 
        name="home" 
        size={24} 
        color={activeTab === 0 ? '#135bec' : '#9da6b9'} 
      />
      <Text style={[
        styles.navLabel,
        activeTab === 0 && styles.navLabelActive
      ]}>Home</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={styles.navItem}
      onPress={() => {
        setActiveTab(1);
        navigation.navigate('EducationHome');  // Add navigation
      }}
    >
      <MaterialIcons 
        name="school" 
        size={24} 
        color={activeTab === 1 ? '#135bec' : '#9da6b9'} 
      />
      <Text style={[
        styles.navLabel,
        activeTab === 1 && styles.navLabelActive
      ]}>Education</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={styles.navItem}
      onPress={() => {
        setActiveTab(2);
        // Stay on current screen (Companies) or navigate to a Jobs listing screen
        navigation.navigate('CompaniesListingScreen');  // If you want to refresh/stay here
      }}
    >
      <MaterialIcons 
        name="work" 
        size={24} 
        color={activeTab === 2 ? '#135bec' : '#9da6b9'} 
      />
      <Text style={[
        styles.navLabel,
        activeTab === 2 && styles.navLabelActive
      ]}>Jobs</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={styles.navItem}
      onPress={() => {
        setActiveTab(3);
        navigation.navigate('ProfileInformation');  // Add navigation
      }}
    >
      <MaterialIcons 
        name="person" 
        size={24} 
        color={activeTab === 3 ? '#135bec' : '#9da6b9'} 
      />
      <Text style={[
        styles.navLabel,
        activeTab === 3 && styles.navLabelActive
      ]}>Profile</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
topBar: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: colors.background 
},
pageTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: colors.text, // white text
  flex: 1,
  textAlign: 'center',
},

    iconButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },

    // pageTitle: {
    //   fontSize: 18,
    //   fontWeight: '700',
    //   color: colors.text,
    //   flex: 1,
    //   textAlign: 'center',
    // },

    bookmarkBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },

    bookmarkBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#ffffff',
    },

    searchContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },

    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      height: 48,
      paddingHorizontal: 16,
      gap: 12,
    },

    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
    },

    filtersRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 12,
    },

    filterDropdown: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 8,
      height: 40,
    },

    filterLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      flex: 1,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },

    dropdownModal: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '70%',
    },

    dropdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    dropdownTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },

    dropdownList: {
      maxHeight: 400,
    },

    dropdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    dropdownItemSelected: {
      backgroundColor: colors.primary + '15',
    },

    dropdownItemText: {
      fontSize: 16,
      color: colors.text,
    },

    dropdownItemTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },

    resultsBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    resultsText: {
      fontSize: 14,
      color: colors.subText,
    },

    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    sortText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },

    scrollView: {
      flex: 1,
    },

    cardsContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 20,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },

    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },

    companyInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },

    logo: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },

    companyName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },

    industry: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.primary,
    },

    description: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.subText,
      marginBottom: 12,
    },

    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },

    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    tagText: {
      fontSize: 13,
      color: colors.subText,
    },

    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },

    badgeText: {
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 4,
    },

    active: {
      color: colors.subText,
      fontSize: 12,
    },

    loadMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 6,
    },

    loadMoreText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },

    bottomNavContainer: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 8,
    },

    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },

    navLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.subText,
      marginTop: 4,
    },

    navLabelActive: {
      color: colors.primary,
    },

    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
    },

    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 16,
    },

    emptySubText: {
      fontSize: 14,
      color: colors.subText,
      marginTop: 8,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
  });


export default CompaniesScreen;