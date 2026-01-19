
import { Navigation } from 'lucide-react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  useColorScheme,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';




// SVG Icons
const SearchIcon = ({ size = 20, color = "#9da6b9" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FilterIcon = ({ size = 20, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6H20M7 12H17M10 18H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BackIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BuildingIcon = ({ size = 16, color = "#64748b" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 6h.01M12 6h.01M16 6h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 10h.01M12 10h.01M16 10h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 14h.01M12 14h.01M16 14h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M10 22v-4h4v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MenuIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="18" r="1.5" fill={color} />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#facc15" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

const HomeIcon = ({ size = 24, color = "#64748b", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
    <Path
      d="M9 22V12H15V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GroupIcon = ({ size = 24, color = "#135bec", filled = true }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill={filled ? color : "none"} />
    <Path
      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MessageIcon = ({ size = 24, color = "#64748b", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
  </Svg>
);

const ProfileIcon = ({ size = 24, color = "#64748b", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill={filled ? color : "none"} />
  </Svg>
);

interface OrganisationDetails {
  orgName: string;
  gstin: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  skills: string[];
  hourlyRate: number;
  image: string;

  // NEW FLAGS
  isActive: boolean;
  isEnrolled: boolean;

  // Only if freelancer belongs to company (bulk)
  organisation?: OrganisationDetails;
}


const serviceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    service: 'Plumber',
    rating: 4.8,
    reviews: 156,
    skills: ['Pipe Fitting', 'Drainage'],
    hourlyRate: 350,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      isActive: true,
      isEnrolled: true,
  },
  {
    id: '2',
    name: 'Lakshmi Devi',
    service: 'Cleaner',
    rating: 5.0,
    reviews: 203,
    skills: ['Deep Cleaning', 'Sanitization'],
    hourlyRate: 250,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isActive: false,
      isEnrolled: true,
  },
  {
    id: '3',
    name: 'Suresh Reddy',
    service: 'Electrician',
    rating: 4.7,
    reviews: 98,
    skills: ['Wiring', 'Repair'],
    hourlyRate: 400,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    isActive: true,
  isEnrolled: true,
  organisation: {
    orgName: "Sparkle Cleaning Pvt Ltd",
    gstin: "29ABCDE1234F1Z5"
  }
  },
  {
    id: '4',
    name: 'Priya Sharma',
    service: 'Washer',
    rating: 4.9,
    reviews: 142,
    skills: ['Machine Wash', 'Dry Cleaning'],
    hourlyRate: 200,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
     isActive: false,
      isEnrolled: true,
  },
  {
    id: '5',
    name: 'Vijay Rao',
    service: 'Plumber',
    rating: 4.6,
    reviews: 87,
    skills: ['Installation', 'Maintenance'],
    hourlyRate: 320,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
     isActive: true,
      isEnrolled: false,
  },
  {
    id: '6',
    name: 'Anita Patel',
    service: 'Cleaner',
    rating: 4.8,
    reviews: 175,
    skills: ['Home Cleaning', 'Kitchen'],
    hourlyRate: 280,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      isActive: true,
      isEnrolled: false,
  },
  {
    id: '7',
    name: 'Karthik Menon',
    service: 'Electrician',
    rating: 4.9,
    reviews: 134,
    skills: ['Smart Home', 'Installation'],
    hourlyRate: 450,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      isActive: false,
  isEnrolled: true,
  organisation: {
    orgName: "Sparkle Cleaning Pvt Ltd",
    gstin: "29ABCDE1234F1Z5"
  }
  },
  {
    id: '8',
    name: 'Deepa Singh',
    service: 'Washer',
    rating: 4.7,
    reviews: 98,
    skills: ['Laundry', 'Ironing'],
    hourlyRate: 220,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    isActive: true,
  isEnrolled: true,
  organisation: {
    orgName: "Sparkle Cleaning Pvt Ltd",
    gstin: "29ABCDE1234F1Z5"
  }
  },
    {
  id: '9',
  name: 'Mohit Verma',
  service: 'Plumber',
  rating: 4.5,
  reviews: 76,
  skills: ['Leak Fixing', 'Bathroom Fitting'],
  hourlyRate: 300,
  image: 'https://source.unsplash.com/400x400/?plumber,man&sig=9',
  isActive: true,
  isEnrolled: true,
},
{
  id: '10',
  name: 'Sneha Iyer',
  service: 'Cleaner',
  rating: 4.9,
  reviews: 221,
  skills: ['Office Cleaning', 'Floor Polishing'],
  hourlyRate: 270,
  image: 'https://source.unsplash.com/400x400/?cleaner,woman&sig=10',
  isActive: true,
  isEnrolled: true,
},
{
  id: '11',
  name: 'Arjun Singh',
  service: 'Electrician',
  rating: 4.6,
  reviews: 110,
  skills: ['Appliance Repair', 'Fan Installation'],
  hourlyRate: 380,
  image: 'https://source.unsplash.com/400x400/?electrician,man&sig=11',
  isActive: false,
  isEnrolled: true,
},
{
  id: '12',
  name: 'Pooja Nair',
  service: 'Washer',
  rating: 4.8,
  reviews: 164,
  skills: ['Steam Ironing', 'Fabric Care'],
  hourlyRate: 230,
  image: 'https://source.unsplash.com/400x400/?laundry,woman&sig=12',
  isActive: true,
  isEnrolled: true,
},
{
  id: '13',
  name: 'Rahul Das',
  service: 'Plumber',
  rating: 4.4,
  reviews: 59,
  skills: ['Motor Repair', 'Tank Cleaning'],
  hourlyRate: 310,
  image: 'https://source.unsplash.com/400x400/?plumber,worker&sig=13',
  isActive: false,
  isEnrolled: false,
},
{
  id: '14',
  name: 'Neha Kapoor',
  service: 'Cleaner',
  rating: 5.0,
  reviews: 287,
  skills: ['Villa Cleaning', 'Move-out Cleaning'],
  hourlyRate: 320,
  image: 'https://source.unsplash.com/400x400/?housekeeping,woman&sig=14',
  isActive: true,
  isEnrolled: true,
  organisation: {
    orgName: "UrbanCare Services",
    gstin: "27ABCDE4321K9Z2"
  }
},
{
  id: '15',
  name: 'Imran Khan',
  service: 'Electrician',
  rating: 4.7,
  reviews: 143,
  skills: ['Inverter Setup', 'CCTV Install'],
  hourlyRate: 420,
  image: 'https://source.unsplash.com/400x400/?technician,man&sig=15',
  isActive: true,
  isEnrolled: true,
},
{
  id: '16',
  name: 'Kavya Joshi',
  service: 'Washer',
  rating: 4.6,
  reviews: 92,
  skills: ['Curtain Wash', 'Delicate Clothes'],
  hourlyRate: 210,
  image: 'https://source.unsplash.com/400x400/?laundry,person&sig=16',
  isActive: false,
  isEnrolled: true,
},
{
  id: '17',
  name: 'Sanjay Patel',
  service: 'Plumber',
  rating: 4.9,
  reviews: 198,
  skills: ['Pipeline Design', 'Commercial Plumbing'],
  hourlyRate: 500,
  image: 'https://source.unsplash.com/400x400/?plumbing,man&sig=17',
  isActive: true,
  isEnrolled: true,
  organisation: {
    orgName: "AquaFlow Solutions",
    gstin: "24AAQCA1122P1Z8"
  }
},
{
  id: '18',
  name: 'Aditi Roy',
  service: 'Cleaner',
  rating: 4.7,
  reviews: 134,
  skills: ['Bathroom Deep Clean', 'Balcony Cleaning'],
  hourlyRate: 260,
  image: 'https://source.unsplash.com/400x400/?cleaning,woman&sig=18',
  isActive: true,
  isEnrolled: false,
},
{
  id: '19',
  name: 'Naveen Kumar',
  service: 'Electrician',
  rating: 4.3,
  reviews: 48,
  skills: ['Switch Board Repair', 'Short Circuit Fix'],
  hourlyRate: 340,
  image: 'https://source.unsplash.com/400x400/?electrician,technician&sig=19',
  isActive: false,
  isEnrolled: true,
},
{
  id: '20',
  name: 'Ritu Malhotra',
  service: 'Washer',
  rating: 5.0,
  reviews: 312,
  skills: ['Premium Laundry', 'Dry Iron Finish'],
  hourlyRate: 280,
  image: 'https://source.unsplash.com/400x400/?laundry,woman,portrait&sig=20',
  isActive: true,
  isEnrolled: true,
},
{
  id: '21',
  name: 'Balaji N',
  service: 'Plumber',
  rating: 4.6,
  reviews: 121,
  skills: ['Sink Repair', 'Water Heater Install'],
  hourlyRate: 360,
  image: 'https://source.unsplash.com/400x400/?maintenance,man&sig=21',
  isActive: true,
  isEnrolled: false,
},
{
  id: '22',
  name: 'Fatima Shaikh',
  service: 'Cleaner',
  rating: 4.8,
  reviews: 177,
  skills: ['Kitchen Deep Clean', 'Dust Removal'],
  hourlyRate: 290,
  image: 'https://source.unsplash.com/400x400/?maid,cleaner,woman&sig=22',
  isActive: true,
  isEnrolled: true,
  organisation: {
    orgName: "CleanPro India",
    gstin: "30BBBCD9988M1Z1"
  }
},
{
  id: '23',
  name: 'Rohit Shetty',
  service: 'Electrician',
  rating: 4.9,
  reviews: 204,
  skills: ['Home Automation', 'Panel Upgrade'],
  hourlyRate: 480,
  image: 'https://source.unsplash.com/400x400/?engineer,technician&sig=23',
  isActive: true,
  isEnrolled: true,
},];

const categories = ['All', 'Plumber', 'Cleaner', 'Electrician', 'Washer'];

const Freelancer = () => {
const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('services');
  const [showOnlyActive, setShowOnlyActive] = useState(false);


const filteredProviders = serviceProviders.filter(provider => {
  const matchesCategory = selectedCategory === 'All' || provider.service === selectedCategory;

  const matchesSearch =
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.skills.some(skill =>
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const matchesActive = showOnlyActive ? provider.isActive : true;

  return (
    matchesCategory &&
    matchesSearch &&
    provider.isEnrolled &&
    matchesActive
  );
});


  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#101622' : '#f6f6f8',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon size={24} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>

        <Text style={[styles.headerTitle, isDarkMode && styles.textWhite]}>
          Freelancers
        </Text>
        <TouchableOpacity style={styles.menuButton}>
          <MenuIcon size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <View style={[styles.searchBar, isDarkMode && styles.searchBarDark]}>
            <SearchIcon size={20} color="#9da6b9" />
            <TextInput
              style={[styles.searchInput, isDarkMode && styles.textWhite]}
              placeholder="Search services or names"
              placeholderTextColor="#9da6b9"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
              style={[
                styles.filterButton,
                showOnlyActive && { backgroundColor: '#22c55e' } // green when active
              ]}
              onPress={() => setShowOnlyActive(prev => !prev)}
            >
              <FilterIcon size={20} color="#fff" />
            </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
     <View>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.categoriesContainer}
    contentContainerStyle={styles.categoriesContent}
  >
    {categories.map((category) => (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryChip,
          selectedCategory === category && styles.categoryChipActive,
          isDarkMode && selectedCategory !== category && styles.categoryChipDark,
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === category && styles.categoryTextActive,
            isDarkMode && selectedCategory !== category && styles.categoryTextDark,
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>

      {/* Service Providers List */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <View
              key={provider.id}
              style={[styles.card, isDarkMode && styles.cardDark]}
            >
              <Image
                source={{ uri: provider.image }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.providerName, isDarkMode && styles.textWhite]}>
                        {provider.name}
                      </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
  <View
    style={{
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: provider.isActive ? '#22c55e' : '#ef4444',
    }}
  />
  <Text
    style={{
      fontSize: 12,
      color: provider.isActive ? '#22c55e' : '#ef4444',
      fontWeight: '600',
    }}
  >
    {provider.isActive ? 'Active' : 'Inactive'}
  </Text>
</View>

                    </View>

                    <Text style={styles.providerService}>
                      {provider.service}
                    </Text>
                  </View>
                  <View style={[styles.ratingBadge, isDarkMode && styles.ratingBadgeDark]}>
                    <StarIcon size={14} color="#facc15" />
                    <Text style={[styles.ratingText, isDarkMode && styles.ratingTextDark]}>
                      {provider.rating}
                    </Text>
                    <Text style={styles.reviewCount}>({provider.reviews})</Text>
                  </View>
                </View>
                {provider.organisation && (
                    <View style={{ marginTop: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <BuildingIcon size={14} color="#64748b" />
                        <Text style={{ fontSize: 12, color: '#64748b' }}>
                          {provider.organisation.orgName}
                        </Text>
                      </View>

                      <Text style={{ fontSize: 10, color: '#94a3b8', marginLeft: 20 }}>
                        GSTIN: {provider.organisation.gstin}
                      </Text>
                    </View>
                  )}
                <View style={styles.skillsContainer}>
                  {provider.skills.map((skill, index) => (
                    <View key={index} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.startingAtText}>STARTING AT</Text>
                    <Text style={[styles.priceText, isDarkMode && styles.textWhite]}>
                      ₹{provider.hourlyRate}
                      <Text style={styles.priceUnit}>/hr</Text>
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.portfolioButton}>
                    <Text style={styles.portfolioButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, isDarkMode && styles.textWhite]}>
              No service providers found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, isDarkMode && styles.bottomNavDark]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <HomeIcon 
            size={24} 
            color={activeTab === 'home' ? '#135bec' : '#64748b'} 
            filled={activeTab === 'home'}
          />
          <Text style={[
            styles.navLabel,
            activeTab === 'home' && styles.navLabelActive,
            activeTab !== 'home' && styles.navLabelInactive,
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('services')}
        >
          <GroupIcon 
            size={24} 
            color={activeTab === 'services' ? '#135bec' : '#64748b'} 
            filled={activeTab === 'services'}
          />
          <Text style={[
            styles.navLabel,
            activeTab === 'services' && styles.navLabelActive,
            activeTab !== 'services' && styles.navLabelInactive,
          ]}>
            Services
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('messages')}
        >
          <MessageIcon 
            size={24} 
            color={activeTab === 'messages' ? '#135bec' : '#64748b'} 
            filled={activeTab === 'messages'}
          />
          <Text style={[
            styles.navLabel,
            activeTab === 'messages' && styles.navLabelActive,
            activeTab !== 'messages' && styles.navLabelInactive,
          ]}>
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
        >
          <ProfileIcon 
            size={24} 
            color={activeTab === 'profile' ? '#135bec' : '#64748b'} 
            filled={activeTab === 'profile'}
          />
          <Text style={[
            styles.navLabel,
            activeTab === 'profile' && styles.navLabelActive,
            activeTab !== 'profile' && styles.navLabelInactive,
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f6f6f8',
  },
  headerDark: {
    backgroundColor: '#101622',
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textWhite: {
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBarDark: {
    backgroundColor: '#1c2433',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#135bec',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
categoriesContainer: {
    // Reduced padding to make it more compact
    paddingVertical: 8, 
    flexGrow: 0, 
  },
  categoriesContent: {
    paddingHorizontal: 16, // Move horizontal padding here for better scrolling
    gap: 8, // Slightly tighter gap
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6, // Reduced from 10 to 6
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    // Subtle shadow for light mode
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#135bec',
    borderColor: '#135bec',
    elevation: 3,
  },
  categoryChipDark: {
    backgroundColor: '#1c2433',
    borderColor: '#334155',
  },
  categoryText: {
    fontSize: 13, // Slightly smaller font for a cleaner look
    fontWeight: '500',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryTextDark: {
    color: '#9da6b9',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardDark: {
    backgroundColor: '#1c2433',
    borderColor: '#334155',
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e2e8f0',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  providerService: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 2,
  },
  ratingBadgeDark: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ca8a04',
  },
  ratingTextDark: {
    color: '#facc15',
  },
  reviewCount: {
    fontSize: 10,
    color: '#94a3b8',
  },
  skillsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  skillBadge: {
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  skillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#135bec',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  dividerDark: {
    backgroundColor: '#334155',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startingAtText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748b',
  },
  portfolioButton: {
    backgroundColor: '#135bec',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  portfolioButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  bottomNavDark: {
    backgroundColor: 'rgba(16, 22, 34, 0.9)',
    borderTopColor: '#334155',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#135bec',
  },
  navLabelInactive: {
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default Freelancer;