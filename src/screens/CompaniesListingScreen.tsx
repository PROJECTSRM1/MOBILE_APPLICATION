import React, { useState, useMemo } from "react";
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

// Define your navigation types
type RootStackParamList = {
  Companies: undefined;
  JobDetails: { companyId: number };
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
}

const ALL_COMPANIES: Company[] = [
  {
    id: 1,
    name: "TechFlow Systems",
    industry: "Software Engineering",
    description:
      "Leading the way in AI and machine learning solutions for enterprise clients worldwide. Join ou...",
    location: "San Francisco, CA",
    size: "500+",
    isRemote: false,
    badge: "4 Internships",
    badgeColor: "#135bec",
    active: "Active 2h ago",
    icon: "code",
    iconBg: "#3b82f6",
  },
  {
    id: 2,
    name: "EduGrow",
    industry: "EdTech",
    description:
      "Helping students learn faster through personalized curriculum and AI-driven tutoring assistants.",
    location: "Austin, TX",
    size: "50-200",
    isRemote: false,
    badge: "1 Job Opening",
    badgeColor: "#22c55e",
    active: "Active 1d ago",
    icon: "school",
    iconBg: "#f97316",
  },
  {
    id: 3,
    name: "Apex Banking",
    industry: "Finance & Banking",
    description:
      "Global financial solutions for the modern era. We build secure infrastructure for the next generatio...",
    location: "London, UK",
    size: "1000+",
    isRemote: false,
    badge: "Hiring Frozen",
    badgeColor: "#6b7280",
    icon: "account-balance",
    iconBg: "#334155",
  },
  {
    id: 4,
    name: "EcoDynamics",
    industry: "Green Energy",
    description:
      "Developing sustainable energy grids powered by next-gen solar technology. Fully remote team...",
    location: "Remote",
    size: "50-200",
    isRemote: true,
    badge: "2 Senior Roles",
    badgeColor: "#16a34a",
    active: "Active 4h ago",
    icon: "eco",
    iconBg: "#22c55e",
  },
  {
    id: 5,
    name: "CloudNine Solutions",
    industry: "Software Engineering",
    description:
      "Building next-generation cloud infrastructure and DevOps tools for modern enterprises...",
    location: "Seattle, WA",
    size: "200-500",
    isRemote: true,
    badge: "3 Internships",
    badgeColor: "#135bec",
    active: "Active 5h ago",
    icon: "cloud",
    iconBg: "#0ea5e9",
  },
  {
    id: 6,
    name: "HealthTech Innovations",
    industry: "Healthcare",
    description:
      "Revolutionizing patient care with AI-powered diagnostic tools and telemedicine platforms...",
    location: "Boston, MA",
    size: "100-200",
    isRemote: false,
    badge: "5 Job Openings",
    badgeColor: "#22c55e",
    active: "Active 3h ago",
    icon: "local-hospital",
    iconBg: "#ef4444",
  },
];

const INDUSTRIES = ['All', 'Software Engineering', 'EdTech', 'Finance & Banking', 'Green Energy', 'Healthcare'];
const LOCATIONS = ['All', 'Remote', 'San Francisco, CA', 'Austin, TX', 'London, UK', 'Seattle, WA', 'Boston, MA'];
const SIZES = ['All', '50-200', '200-500', '500+', '1000+'];

type CompaniesNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Companies"
>;

const CompaniesScreen = () => {
  const navigation = useNavigation<CompaniesNavProp>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<number>(2);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  
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
  const filteredCompanies = useMemo(() => {
    let result = ALL_COMPANIES;

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

      // Apply size filter
      if (selectedSize !== 'All') {
        result = result.filter(company => company.size === selectedSize);
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

    return result;
  }, [selectedIndustry, selectedLocation, selectedSize, searchQuery, showBookmarks, bookmarkedIds]);

  // Companies to display (with pagination)
  const displayedCompanies = showBookmarks ? filteredCompanies : filteredCompanies.slice(0, displayCount);
  const hasMoreCompanies = !showBookmarks && displayCount < filteredCompanies.length;

  const loadMoreCompanies = () => {
    setDisplayCount(prev => Math.min(prev + 4, filteredCompanies.length));
  };

 const CompanyCard = ({ company }: { company: Company }) => {
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
              <MaterialIcons name={company.icon} size={24} color="#fff" />
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
              color={isBookmarked ? "#135bec" : "#9da6b9"} 
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
              <MaterialIcons name="close" size={24} color="#ffffff" />
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
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
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
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#ffffff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowLocationDropdown(true)}
            >
              <Text style={styles.filterLabel}>
                {selectedLocation === 'All' ? 'Location' : selectedLocation.length > 10 ? selectedLocation.substring(0, 10) + '...' : selectedLocation}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#ffffff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowSizeDropdown(true)}
            >
              <Text style={styles.filterLabel}>
                {selectedSize === 'All' ? 'Size' : selectedSize}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Dropdown Modals */}
        <DropdownModal
          visible={showIndustryDropdown}
          onClose={() => setShowIndustryDropdown(false)}
          options={INDUSTRIES}
          selected={selectedIndustry}
          onSelect={setSelectedIndustry}
          title="Select Industry"
        />
        
        <DropdownModal
          visible={showLocationDropdown}
          onClose={() => setShowLocationDropdown(false)}
          options={LOCATIONS}
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
        {!showBookmarks && (
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              Showing {filteredCompanies.length} companies
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortText}>Sort by</Text>
              <MaterialIcons name="sort" size={18} color="#135bec" />
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
                <CompanyCard key={company.id} company={company} />
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
        <SafeAreaView style={styles.bottomNavContainer} edges={['bottom']}>
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab(0)}
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
              onPress={() => setActiveTab(1)}
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
              onPress={() => setActiveTab(2)}
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
              onPress={() => setActiveTab(3)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#101622',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  bookmarkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#135bec',
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
    backgroundColor: '#1E232E',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
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
    backgroundColor: '#1E232E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    height: 40,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  dropdownModal: {
    backgroundColor: '#1C222C',
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
    borderBottomColor: '#2a3141',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
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
    borderBottomColor: '#2a3141',
  },
  dropdownItemSelected: {
    backgroundColor: '#135bec15',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#ffffff',
  },
  dropdownItemTextSelected: {
    color: '#135bec',
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
    color: '#9da6b9',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#135bec',
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
    backgroundColor: '#1C222C',
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
    color: '#ffffff',
    marginBottom: 2,
  },
  industry: {
    fontSize: 13,
    fontWeight: '500',
    color: '#135bec',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#9da6b9',
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
    color: '#9da6b9',
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
    fontWeight: '600',
    fontSize: 12,
  },
  active: {
    color: '#9da6b9',
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
    color: '#135bec',
  },
  bottomNavContainer: {
    backgroundColor: '#101622',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
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
    color: '#9da6b9',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#135bec',
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
    color: '#ffffff',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9da6b9',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});


export default CompaniesScreen;