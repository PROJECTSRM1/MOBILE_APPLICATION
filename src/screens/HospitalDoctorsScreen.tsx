import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
// Note: Ensure you have react-native-vector-icons installed
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const hospitalDoctors = [
  {
    id: 1,
    name: 'Dr. Rahul Verma',
    specialty: 'Cardiologist',
    rating: 4.8,
    image: 'https://i.pravatar.cc/150?img=12', // Replace with your local assets
  },
  {
    id: 2,
    name: 'Dr. Anjali Mehta',
    specialty: 'Neurologist',
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?img=26',
  },
  {
    id: 3,
    name: 'Dr. Sameer Khan',
    specialty: 'Orthopedic',
    rating: 4.7,
    image: 'https://i.pravatar.cc/150?img=11',
  },
];

const HospitalDoctorsScreen = () => {
    const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialIcon name="arrow-back" size={28} color="#2d7576" />
        </TouchableOpacity>
        <Text style={styles.headerTopLabel}>APPOINTMENT</Text>
        <Text style={styles.title}>City General Hospital Doctors</Text>
      </View>

      {/* List */}
      <FlatList
        data={hospitalDoctors}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={()=>{
            navigation.navigate("DoctorProfile");
          }}> 
            <Image source={{ uri: item.image }} style={styles.image} />
            
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
              <View style={styles.ratingRow}>
                <MaterialIcon name="star" size={18} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <MaterialIcon name="chevron-right" size={28} color="#cbd5e1" />
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Can't find your doctor?{' '}
              <Text style={styles.searchLink}>Search here</Text>
            </Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="moon-waning-crescent" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation Mock */}
      <View style={styles.bottomTab}>
        <View style={styles.tabItem}>
          <Icon name="home" size={28} color="#2d7576" />
          <Text style={[styles.tabLabel, {color: '#2d7576'}]}>Home</Text>
        </View>
        <View style={styles.tabItem}>
          <Icon name="calendar-check" size={24} color="#94a3b8" />
          <Text style={styles.tabLabel}>Bookings</Text>
        </View>
        <View style={styles.tabItem}>
          <Icon name="chat-processing" size={24} color="#94a3b8" />
          <Text style={styles.tabLabel}>Chat</Text>
        </View>
        <View style={styles.tabItem}>
          <Icon name="account" size={24} color="#94a3b8" />
          <Text style={styles.tabLabel}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HospitalDoctorsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    marginBottom: 10,
    marginLeft: -5,
  },
  headerTopLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d7576',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f4c4c',
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  specialty: {
    fontSize: 15,
    color: '#2d7576',
    fontWeight: '600',
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '500',
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  searchLink: {
    color: '#2d7576',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#2d7576',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  bottomTab: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});