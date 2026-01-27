import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  User,
  Bell,
  Search,
  Calendar,
  Stethoscope,
  Clock,
  Truck,
  Hourglass,
  CheckCircle2,
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  Settings,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Types ---
type BookingStatus = 'Scheduled' | 'Pending' | 'In-Transit' | 'Completed';

interface Booking {
  id: string;
  patientName: string;
  status: BookingStatus;
  service: string;
  dateTime: string;
}

const BookingsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const bookings: Booking[] = [
    { id: '1', patientName: 'John Doe', status: 'Scheduled', service: 'Full Body Checkup - Platinum', dateTime: 'Oct 24, 2023 | 09:00 AM' },
    { id: '2', patientName: 'Jane Smith', status: 'Pending', service: 'Basic Wellness Package', dateTime: 'Oct 24, 2023 | 10:30 AM' },
    { id: '3', patientName: 'Robert Wilson', status: 'In-Transit', service: 'Diabetes Management Kit', dateTime: 'Oct 24, 2023 | 01:15 PM' },
    { id: '4', patientName: 'Emily Davis', status: 'Completed', service: 'Cardiac Screening Plus', dateTime: 'Oct 23, 2023 | 04:45 PM' },
  ];

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'Scheduled': return { color: '#137fec', bg: '#e7f2fd', icon: <Calendar size={20} color="#137fec" /> };
      case 'Pending': return { color: '#f97316', bg: '#fff7ed', icon: <Hourglass size={20} color="#f97316" /> };
      case 'In-Transit': return { color: '#a855f7', bg: '#f5f3ff', icon: <Truck size={20} color="#a855f7" /> };
      case 'Completed': return { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={20} color="#10b981" /> };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <User size={24} color="#137fec" />
        </View>
        <Text style={styles.headerTitle}>Bookings</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#94a3b8" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search by name or phone" 
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['All', 'Pending', 'Scheduled', 'In-Transit'].map((filter) => (
              <TouchableOpacity 
                key={filter} 
                onPress={() => setActiveFilter(filter)}
                style={[styles.chip, activeFilter === filter && styles.activeChip]}
              >
                <Text style={[styles.chipText, activeFilter === filter && styles.activeChipText]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Booking Cards */}
        <View style={styles.listContainer}>
          {bookings.map((item) => {
            const config = getStatusConfig(item.status);
            return (
              <View key={item.id} style={[styles.card, item.status === 'Completed' && { opacity: 0.8 }]}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.statusLabel, { color: config.color }]}>{item.status.toUpperCase()}</Text>
                    <Text style={styles.patientName}>{item.patientName}</Text>
                  </View>
                  <View style={[styles.statusIconContainer, { backgroundColor: config.bg }]}>
                    {config.icon}
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Stethoscope size={18} color="#64748b" />
                    <Text style={styles.detailTextMedium}>{item.service}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar size={18} color="#64748b" />
                    <Text style={styles.detailText}>{item.dateTime}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    item.status === 'Completed' ? styles.btnSecondary : styles.btnPrimary
                  ]}
                >
                  <Text style={[
                    styles.actionButtonText,
                    item.status === 'Completed' ? styles.btnSecondaryText : styles.btnPrimaryText
                  ]}>
                    {item.status === 'Completed' ? 'View Results' : 'View Details'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        
        {/* Padding for Bottom Nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <LayoutDashboard size={24} color="#94a3b8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <ClipboardList size={24} color="#137fec" />
          <Text style={[styles.navText, { color: '#137fec', fontWeight: 'bold' }]}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <BarChart2 size={24} color="#94a3b8" />
          <Text style={styles.navText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Settings size={24} color="#94a3b8" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f6f7f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e7f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  iconButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#f6f7f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  filterSection: {
    backgroundColor: '#f6f7f8',
    paddingBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeChip: {
    backgroundColor: '#137fec',
    borderColor: '#137fec',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  activeChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailTextMedium: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  actionButton: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#137fec',
    shadowColor: '#137fec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnSecondary: {
    backgroundColor: '#f1f5f9',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnPrimaryText: {
    color: '#fff',
  },
  btnSecondaryText: {
    color: '#475569',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    color: '#94a3b8',
  },
});

export default BookingsScreen;