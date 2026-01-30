
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'cardiology', label: 'Cardiology', icon: 'heart-pulse' },
  { id: 'neurology', label: 'Neurology', icon: 'brain' },
  { id: 'pediatrics', label: 'Pediatrics', icon: 'baby-face-outline' },
];

const HospitalDoctorsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // Use hospital name from params or default to Apollo Medical Center for preview
  const { hospital } = route.params || { hospital: { name: 'Apollo Medical Center' } };

  const doctors = hospital?.doctors || [];
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Section */}
      <View style={styles.header}>
        {/* Top Row: Back and Centered Title */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcon name="arrow-back" size={26} color="#0D9488" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctors</Text>
          <View style={{ width: 26 }} /> {/* Spacer to keep title centered */}
        </View>

        {/* Hospital Name Row: Icon then Name side-by-side */}
        <View style={styles.hospitalRow}>
          <MaterialIcon name="business" size={22} color="#0D9488" />
          <Text style={styles.hospitalName}>{hospital?.name}</Text>
        </View>
      </View>

      {/* Category Section: Compact Horizontal Pills */}
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
        />
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcon name="tune" size={20} color="#0D9488" />
        </TouchableOpacity>
      </View>

      {/* Doctor List */}
      <FlatList
        data={doctors}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DoctorProfile', { doctor: item })}
          >
            <Image source={{ uri: item.image }} style={styles.avatar} />

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

              <View style={styles.metaRow}>
                <View style={styles.ratingRow}>
                  <MaterialIcon name="star" size={16} color="#FACC15" />
                  <Text style={styles.ratingText}>{item.rating || '4.8'}</Text>
                </View>

                <View style={styles.availableRow}>
                  <View style={styles.availableDot} />
                  <Text style={styles.availableText}>Available</Text>
                </View>
              </View>
            </View>

            <MaterialIcon name="chevron-right" size={24} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  /* Header */
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

  /* Categories (Horizontal Pills - Medium Size) */
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
    backgroundColor: '#F0FDFA', // Pale medical teal
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

  /* Search Bar */
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

  /* Doctor Cards (Medium Size) */
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
});

export default HospitalDoctorsScreen;