import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { ChevronLeft, User, Circle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types
type Specialty = 'All' | 'Cardiologist' | 'Dermatologist' | 'Optometrist' | 'Neurologist' | 'General';

interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  isActive: boolean;
}

const DOCTORS_DATA: Doctor[] = [
  { id: '1', name: 'Dr. Alice Tan', specialty: 'Cardiologist', isActive: true },
  { id: '2', name: 'Dr. Bob Khumar', specialty: 'Dermatologist', isActive: false },
  { id: '3', name: 'Dr. Charlie Day', specialty: 'Optometrist', isActive: true },
  { id: '4', name: 'Dr. Diana Prince', specialty: 'Neurologist', isActive: true },
  { id: '5', name: 'Dr. Edward Norton', specialty: 'General', isActive: true },
  { id: '6', name: 'Dr. Fiona Glenanne', specialty: 'Cardiologist', isActive: false },
  { id: '7', name: 'Dr. George Costanza', specialty: 'Dermatologist', isActive: true },
];

const DoctorsListScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState<Specialty>('All');

  const specialties: Specialty[] = ['All', 'Cardiologist', 'Dermatologist', 'Optometrist', 'Neurologist', 'General'];

  const filteredDoctors = activeFilter === 'All' 
    ? DOCTORS_DATA 
    : DOCTORS_DATA.filter(doc => doc.specialty === activeFilter);

  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <User size={24} color="#4c739a" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.docName}>{item.name}</Text>
        <Text style={styles.docSpecialty}>{item.specialty}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: item.isActive ? '#dcfce7' : '#fee2e2' }]}>
        <Circle size={8} fill={item.isActive ? '#16a34a' : '#dc2626'} color={item.isActive ? '#16a34a' : '#dc2626'} />
        <Text style={[styles.statusText, { color: item.isActive ? '#16a34a' : '#dc2626' }]}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color="#0d141b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Doctors</Text>
        <View style={{ width: 28 }} /> 
      </View>

      {/* Filter Chips */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {specialties.map((spec) => (
            <TouchableOpacity 
              key={spec} 
              onPress={() => setActiveFilter(spec)}
              style={[styles.chip, activeFilter === spec && styles.activeChip]}
            >
              <Text style={[styles.chipText, activeFilter === spec && styles.activeChipText]}>{spec}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctorCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No doctors found in this category.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0d141b' },
  filterWrapper: { backgroundColor: '#fff', paddingVertical: 12 },
  filterContainer: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeChip: { backgroundColor: '#137fec', borderColor: '#137fec' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#4c739a' },
  activeChipText: { color: '#fff' },
  listContent: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: { flex: 1 },
  docName: { fontSize: 16, fontWeight: 'bold', color: '#0d141b' },
  docSpecialty: { fontSize: 14, color: '#4c739a', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#4c739a' },
});

export default DoctorsListScreen;