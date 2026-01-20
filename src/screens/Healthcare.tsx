import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const DoctorListScreen = () => {
  const navigation = useNavigation<any>();
  
  // State for filtering
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 0, name: 'All', icon: 'grid-view', color: '#64748b', bgColor: '#f1f5f9' },
    { id: 1, name: 'Heart', icon: 'favorite', color: '#2d7576', bgColor: '#e8f4f4' },
    { id: 2, name: 'Skin', icon: 'healing', color: '#ea580c', bgColor: '#ffedd5' },
    { id: 3, name: 'Mental', icon: 'psychology', color: '#2563eb', bgColor: '#dbeafe' },
    { id: 4, name: 'Eyes', icon: 'visibility', color: '#9333ea', bgColor: '#f3e8ff' },
    { id: 5, name: 'Diet', icon: 'restaurant', color: '#16a34a', bgColor: '#dcfce7' },
  ];

  // Mapping category names to specialty keywords in the doctor data
  const specialtyMap: { [key: string]: string } = {
    'Heart': 'Cardiologist',
    'Skin': 'Dermatologist',
    'Mental': 'Psychiatrist',
    'Eyes': 'Ophthalmologist',
    'Diet': 'Dietitian',
  };

  const allDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      rating: 4.9,
      nextAvailable: '2:00 PM',
      price: 120,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Dr. Marcus Chen',
      specialty: 'Dermatologist',
      rating: 4.8,
      nextAvailable: '4:30 PM',
      price: 95,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Dr. Elena Rodriguez',
      specialty: 'Psychiatrist',
      rating: 5.0,
      nextAvailable: 'Available Now',
      price: 110,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Ophthalmologist',
      rating: 4.7,
      nextAvailable: '10:00 AM',
      price: 130,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    },
    {
        id: 5,
        name: 'Dr. Lisa Wong',
        specialty: 'Dietitian',
        rating: 4.9,
        nextAvailable: '3:15 PM',
        price: 85,
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
      },
  ];

  // Logic to filter doctors based on selection
  const filteredDoctors = selectedCategory === 'All' 
    ? allDoctors 
    : allDoctors.filter(doc => doc.specialty === specialtyMap[selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafaf9" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back-ios" size={20} color="#2d7576" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find a Specialist</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Primary Action Card */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.primaryCard}
            onPress={() => navigation.navigate("Form")}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Feeling unwell?</Text>
              <Text style={styles.cardSubtitle}>
                Describe your symptoms for a quick recommendation.
              </Text>
              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Submit your Health Condition</Text>
              </View>
            </View>
            <View style={styles.cardDecoration}>
              <Icon name="medical-services" size={120} color="rgba(255,255,255,0.2)" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctor, specialty, or condition"
              placeholderTextColor="#9ca3af"
            />
            <Icon name="tune" size={20} color="#2d7576" style={styles.filterIcon} />
          </View>
        </View>

        {/* Categories Section Header - UPDATED TEXT */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={styles.categoryHeaderLabel}>Select the doctor related to</Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category.name;
            return (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(category.name)}
              >
                <View style={[
                    styles.categoryIcon, 
                    { backgroundColor: category.bgColor },
                    isActive && { borderWidth: 2, borderColor: category.color }
                ]}>
                  <Icon name={category.icon} size={28} color={category.color} />
                </View>
                <Text style={[
                    styles.categoryText,
                    isActive && { color: category.color, fontWeight: '800' }
                ]}>
                    {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'Available Doctors' : `${selectedCategory} Specialists`}
          </Text>
          <TouchableOpacity onPress={() => setSelectedCategory('All')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Doctor Cards */}
        <View style={styles.doctorsList}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <TouchableOpacity key={doctor.id} style={styles.doctorCard}>
                <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorHeader}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={14} color="#eab308" />
                      <Text style={styles.ratingText}>{doctor.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.specialtyText}>{doctor.specialty.toUpperCase()}</Text>
                  <Text style={styles.availabilityText}>Next available: {doctor.nextAvailable}</Text>
                  <View style={styles.doctorFooter}>
                    <Text style={styles.priceText}>${doctor.price}/hr</Text>
                    <TouchableOpacity style={styles.bookButton} >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
                <Icon name="info-outline" size={40} color="#9ca3af" />
                <Text style={styles.emptyText}>No doctors found in this category.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Icon name="home" size={24} color="#2d7576" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-today" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Consults</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="folder-open" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fafaf9',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryCard: {
    backgroundColor: '#2d7576',
    borderRadius: 12,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#2d7576',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    zIndex: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 16,
    maxWidth: 200,
  },
  cardButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    color: '#2d7576',
    fontSize: 14,
    fontWeight: '700',
  },
  cardDecoration: {
    position: 'absolute',
    right: -24,
    bottom: -24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    paddingLeft: 16,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#131616',
  },
  filterIcon: {
    paddingRight: 12,
  },
  categoryHeaderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
    letterSpacing: 0.3,
  },
  categoriesContainer: {
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 70,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d7576',
  },
  doctorsList: {
    paddingHorizontal: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e4e4e7',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#131616',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717a',
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2d7576',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  availabilityText: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#131616',
  },
  bookButton: {
    backgroundColor: '#2d7576',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    color: '#9ca3af',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navItemActive: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2d7576',
  },
});

export default DoctorListScreen;