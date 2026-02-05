import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'cardiology', label: 'Cardiology', icon: 'heart-pulse' },
  { id: 'neurology', label: 'Neurology', icon: 'brain' },
  { id: 'pediatrics', label: 'Pediatrics', icon: 'baby-face-outline' },
];

// ✅ API Base URL
const API_BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';

const HospitalDoctorsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { hospital } = route.params || { hospital: { name: 'Apollo Medical Center', hospital_id: null } };

  // ✅ NEW STATES
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ FETCH DOCTORS FROM API
  useEffect(() => {
    const fetchHospitalDoctors = async () => {
      if (!hospital?.hospital_id) {
        setApiError('Hospital ID not provided');
        return;
      }

      setIsLoading(true);
      setApiError(null);

      try {
        // Build the API URL with optional specialization_id parameter
        let apiUrl = `${API_BASE_URL}/healthcare/hospital/${hospital.hospital_id}/doctors`;
        
        // If a category is selected (not 'all'), you could add specialization_id as query param
        // For now, we'll fetch all doctors and filter on the frontend
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // ✅ Transform API response to match your interface
        const transformedDoctors = data.map((doctor: any) => ({
          id: String(doctor.doctor_id),
          name: doctor.doctor_name,
          specialty: doctor.specialization_name,
          rating: doctor.rating || 4.8,
          image: `https://i.pravatar.cc/150?img=${doctor.doctor_id % 70}`,
          experience: doctor.experience_years,
          availableFrom: doctor.available_from,
          availableTo: doctor.available_to,
          fees: doctor.fees_per_hour,
        }));

        setDoctors(transformedDoctors);
      } catch (error) {
        console.error('Error fetching hospital doctors:', error);
        setApiError('Failed to load doctors. Please try again.');
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalDoctors();
  }, [hospital?.hospital_id]);

  // ✅ FILTER DOCTORS
  const getFilteredDoctors = () => {
    let filtered = doctors;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((doc: any) => 
        doc.specialty.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((doc: any) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredDoctors = getFilteredDoctors();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcon name="arrow-back" size={26} color="#0D9488" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctors</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.hospitalRow}>
          <MaterialIcon name="business" size={22} color="#0D9488" />
          <Text style={styles.hospitalName}>{hospital?.name}</Text>
        </View>
      </View>

      {/* Category Section */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map(category => {
            const isActive = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon
                  name={category.icon}
                  size={20}
                  color={isActive ? '#FFFFFF' : '#0D9488'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcon name="search" size={22} color="#94A3B8" />
        <TextInput
          placeholder="Search doctors, specialties..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcon name="tune" size={20} color="#0D9488" />
        </TouchableOpacity>
      </View>

      {/* ✅ LOADING/ERROR/DOCTORS LIST */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={styles.loadingText}>Loading doctors...</Text>
        </View>
      ) : apiError ? (
        <View style={styles.errorContainer}>
          <MaterialIcon name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{apiError}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcon name="search-off" size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>No doctors found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DoctorProfile', { doctor: item })}
            >
              <Image
                source={{
                  uri: item.image || 'https://i.pravatar.cc/150?img=12',
                }}
                style={styles.avatar}
              />

              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.rating >= 4.5 && (
                    <View style={styles.topRatedBadge}>
                      <Text style={styles.topRatedText}>Top Rated</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.specialty}>{item.specialty}</Text>

                {item.experience && (
                  <Text style={styles.experienceText}>
                    {item.experience} years experience
                  </Text>
                )}

                <View style={styles.metaRow}>
                  <View style={styles.ratingRow}>
                    <MaterialIcon name="star" size={16} color="#FACC15" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>

                  <View style={styles.availableRow}>
                    <View style={styles.availableDot} />
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                </View>

                {item.fees && (
                  <Text style={styles.feesText}>₹{item.fees}/hr</Text>
                )}
              </View>

              <MaterialIcon name="chevron-right" size={24} color="#CBD5E1" />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  hospitalName: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F0FDFA',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#0D9488',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#0D9488',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 15,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  topRatedBadge: {
    marginLeft: 8,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  topRatedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#166534',
  },
  specialty: {
    fontSize: 15,
    color: '#0D9488',
    fontWeight: '600',
    marginVertical: 4,
  },
  experienceText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  availableText: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '600',
  },
  feesText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default HospitalDoctorsScreen;