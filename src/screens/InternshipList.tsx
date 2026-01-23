import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useTheme } from '../context/ThemeContext';


export interface Internship {
  id: number;
  title: string;
  company: string;
  logoColor: string;
  location: string;
  duration: string;
  type: string | null;
  isRemote: boolean;
  description: string;
  category: string;
}

const internships: Internship[] = [
  {
    id: 1,
    title: 'UX Design Intern',
    company: 'Spotify',
    logoColor: '#1DB954',
    location: 'Stockholm',
    duration: '6 Months',
    type: 'Paid',
    isRemote: false,
    description: 'Join our design team to help shape the future of audio streaming. You will work closely with researchers, product managers...',
    category: 'design'
  },
  {
    id: 2,
    title: 'Software Engineer Intern',
    company: 'Google',
    logoColor: '#4285F4',
    location: 'Remote',
    duration: '3 Months',
    type: null,
    isRemote: true,
    description: 'Work on large-scale systems and help build the future of search. We are looking for students with strong algorithmic skills...',
    category: 'engineering'
  },
  {
    id: 3,
    title: 'Product Design Intern',
    company: 'Apple',
    logoColor: '#000000',
    location: 'Cupertino',
    duration: 'Summer 2024',
    type: null,
    isRemote: false,
    description: "Define the user experience for Apple products. You'll work on everything from hardware interactions to software interfaces.",
    category: 'design'
  },
  {
    id: 4,
    title: 'Marketing Intern',
    company: 'Airbnb',
    logoColor: '#FF5A5F',
    location: 'Remote',
    duration: '12 Weeks',
    type: null,
    isRemote: true,
    description: 'Support our global marketing campaigns and help tell the story of belonging anywhere. Ideal for creative storytellers.',
    category: 'marketing'
  }
];

const filters = ['All', 'Design', 'Engineering', 'Marketing', 'Remote'];

const InternshipsScreen = () => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  type InternshipListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "InternshipList"
>;

const navigation = useNavigation<InternshipListNavProp>();
  const [activeFilter, setActiveFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
const [showFilterModal, setShowFilterModal] = useState(false);

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

  // Filter internships based on active filter and search query
  const filteredInternships = useMemo(() => {
    let result = internships;

    // Show only bookmarked internships if in bookmark view
    if (showBookmarks) {
      result = result.filter(internship => bookmarkedIds.has(internship.id));
    } else {
      // Apply category filter
      if (activeFilter !== 0) {
        const filterName = filters[activeFilter].toLowerCase();
        result = result.filter(internship => {
          if (filterName === 'remote') {
            return internship.isRemote;
          }
          return internship.category === filterName;
        });
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(internship =>
          internship.title.toLowerCase().includes(query) ||
          internship.company.toLowerCase().includes(query) ||
          internship.location.toLowerCase().includes(query)
        );
      }
    }

    return result;
  }, [activeFilter, searchQuery, showBookmarks, bookmarkedIds]);

  const InternshipCard = ({ internship }: { internship: Internship }) => {
    const isBookmarked = bookmarkedIds.has(internship.id);
    
    const handleApplyNow = () => {
      navigation.navigate('Internship', { internship });
    };
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.companyInfo}>
            <View style={[styles.logo, { backgroundColor: internship.logoColor }]}>
              <Text style={styles.logoText}>
                {internship.company.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.jobTitle}>{internship.title}</Text>
              <Text style={styles.companyName}>{internship.company}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => toggleBookmark(internship.id)}>
            <Icon 
              name={isBookmarked ? "bookmark" : "bookmark-border"} 
              size={24} 
              color={isBookmarked ? "#135bec" : "#9da6b9"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Icon 
              name={internship.isRemote ? 'public' : 'location-on'} 
              size={16} 
              color="#9da6b9" 
            />
            <Text style={styles.tagText}>{internship.location}</Text>
          </View>
          <View style={styles.tag}>
            <Icon name="schedule" size={16} color="#9da6b9" />
            <Text style={styles.tagText}>{internship.duration}</Text>
          </View>
          {internship.type && (
            <View style={styles.tag}>
              <Icon name="payments" size={16} color="#9da6b9" />
              <Text style={styles.tagText}>{internship.type}</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {internship.description}
        </Text>

        <TouchableOpacity style={styles.applyButton} onPress={handleApplyNow}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#101622" />
      
        {/* Top Bar */}
        {/* <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="arrow-back-ios" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>
            {showBookmarks ? 'Bookmarks' : 'Internships'}
          </Text>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowBookmarks(!showBookmarks)}
          >
            <View>
              <Icon 
                name={showBookmarks ? "close" : "bookmark"} 
                size={24} 
                color="#ffffff" 
              />
              {!showBookmarks && bookmarkedIds.size > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{bookmarkedIds.size}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View> */}
        {/* Top Bar */}
<View style={styles.topBar}>
  <TouchableOpacity
    style={styles.iconButton}
    onPress={() => navigation.goBack()} //  FIX (safe & required)
  >
    <Icon name="arrow-back-ios" size={20} color={colors.text} />
  </TouchableOpacity>

  <Text style={styles.pageTitle}>
    {showBookmarks ? 'Bookmarks' : 'Internships'}
  </Text>

  <TouchableOpacity
    style={styles.iconButton}
    onPress={() => setShowBookmarks(!showBookmarks)}
  >
    <View>
      <Icon
        name={showBookmarks ? "close" : "bookmark"}
        size={24}
        color={colors.text}
      />
      {!showBookmarks && bookmarkedIds.size > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{bookmarkedIds.size}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
</View>


        {/* Search Bar - Only show when not in bookmarks view */}
        {!showBookmarks && (
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" size={24} color="#9da6b9" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search role, company..."
                placeholderTextColor="#9da6b9"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
             <TouchableOpacity onPress={() => setShowFilterModal(true)}>
  <Icon name="tune" size={24} color="#135bec" style={styles.filterIcon} />
</TouchableOpacity>

            </View>
          </View>
        )}

        {/* Filter Chips - Only show when not in bookmarks view */}
        {!showBookmarks && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.chipsContainer}
            contentContainerStyle={styles.chipsContent}
          >
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.chip,
                  activeFilter === index ? styles.chipActive : styles.chipInactive
                ]}
                onPress={() => setActiveFilter(index)}
              >
                <Text style={styles.chipText}>{filter}</Text>
                {index > 0 && index < 4 && (
                  <Icon name="keyboard-arrow-down" size={18} color="#9da6b9" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
        )}
{/* Filter Modal */}
{showFilterModal && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Filter</Text>
      
      {filters.slice(1).map((filter, index) => (
        <TouchableOpacity
          key={filter}
          style={styles.modalOption}
          onPress={() => {
            setActiveFilter(index + 1); // +1 because filters[0] is "All"
            setShowFilterModal(false);
          }}
        >
          <Text style={styles.modalOptionText}>{filter}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.modalCloseButton}
        onPress={() => setShowFilterModal(false)}
      >
        <Text style={styles.modalCloseText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

        {/* Internship Cards */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon 
                name={showBookmarks ? "bookmark-border" : "search-off"} 
                size={48} 
                color="#9da6b9" 
              />
              <Text style={styles.emptyText}>
                {showBookmarks ? 'No bookmarks yet' : 'No internships found'}
              </Text>
              <Text style={styles.emptySubText}>
                {showBookmarks 
                  ? 'Start bookmarking internships to see them here'
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
              <Icon 
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
              <Icon 
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
              <Icon 
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
              <Icon 
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

    /* ================= TOP BAR ================= */
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },

    iconButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },

    pageTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      textAlign: "center",
      paddingRight: 8,
    },

    badge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
    },

    badgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#fff",
    },

    /* ================= SEARCH ================= */
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
    },

    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 14,
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
    },

    searchIcon: {
      paddingLeft: 16,
      color: colors.subText,
    },

    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      paddingHorizontal: 12,
    },

    filterIcon: {
      paddingRight: 16,
      color: colors.primary,
    },

    /* ================= FILTER CHIPS ================= */
    chipsContainer: {
      maxHeight: 52,
      backgroundColor: colors.surface,
    },

    chipsContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 8,
    },

    chip: {
      height: 36,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      borderRadius: 18,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },

    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    chipInactive: {
      backgroundColor: colors.card,
    },

    chipText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginRight: 4,
    },

    /* ================= LIST ================= */
    scrollView: {
      flex: 1,
    },

    cardsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 16,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },

    companyInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    logo: {
      width: 48,
      height: 48,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },

    logoText: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },

    jobTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      lineHeight: 20,
    },

    companyName: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.subText,
      marginTop: 2,
    },

    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
    },

    tag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.muted,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },

    tagText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.subText,
    },
/* ================= FILTER MODAL ================= */
modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},

modalContent: {
  width: '80%',
  backgroundColor: colors.surface,
  borderRadius: 16,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: colors.text,
  marginBottom: 16,
  textAlign: 'center',
},

modalOption: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: colors.card,
  marginBottom: 8,
},

modalOptionText: {
  fontSize: 16,
  color: colors.text,
  fontWeight: '500',
},

modalCloseButton: {
  marginTop: 12,
  paddingVertical: 12,
  borderRadius: 12,
  backgroundColor: colors.muted,
  alignItems: 'center',
},

modalCloseText: {
  fontSize: 16,
  fontWeight: '600',
  color: colors.text,
},

    description: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.subText,
      marginBottom: 16,
    },

    applyButton: {
      width: "100%",
      height: 42,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    applyButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#fff",
    },

    /* ================= BOTTOM NAV ================= */
    bottomNavContainer: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    bottomNav: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      height: 64,
    },

    navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },

    navLabel: {
      fontSize: 10,
      fontWeight: "500",
      color: colors.subText,
      marginTop: 4,
    },

    navLabelActive: {
      color: colors.primary,
      fontWeight: "700",
    },

    /* ================= EMPTY ================= */
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },

    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginTop: 16,
    },

    emptySubText: {
      fontSize: 14,
      color: colors.subText,
      marginTop: 8,
      textAlign: "center",
    },
  });


export default InternshipsScreen;