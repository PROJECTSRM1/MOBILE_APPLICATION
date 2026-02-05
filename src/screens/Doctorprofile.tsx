import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';



// Icon component placeholder - replace with react-native-vector-icons or your icon library
const Icon = ({ name, size = 24, color = '#64748b' }: { name: string; size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>{name}</Text>
);




const DoctorProfile = () => {
   const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { doctor } = route.params;
  const [assistantEnabled, setAssistantEnabled] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
const [selectedAssistant, setSelectedAssistant] = useState<any>(null);

const doctorData = {
  ...doctor,
  reviews: doctor.reviews ?? '100+',
  patients: doctor.patients ?? '1k+',
  bio:
    doctor.bio ??
    'This doctor is a certified specialist with several years of clinical experience in patient care. They are known for a patient-first approach, clear communication, and evidence-based treatment methods. The doctor has successfully treated hundreds of patients and continuously stays updated with the latest medical advancements to provide safe, accurate, and compassionate healthcare services.',
};

const assistants = [
  {
    id: 1,
    name: 'Emily Watson',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.8,
    reviews: 230,
    price: 1200,
    works: [
      'Queue management',
      'Report collection',
      'Medicine assistance',
      'Food assistance',
    ],
  },
  {
    id: 2,
    name: 'Sophia Brown',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.6,
    reviews: 180,
    price: 1000,
    works: [
      'Basic patient care',
      'Medicine reminders',
      'Mobility support',
    ],
  },
];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar hidden />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
          <MaterialIcons name="arrow-back" size={20} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor Info Section */}
        <View style={styles.doctorSection}>
          <View style={styles.doctorImageContainer}>
            <Image
            source={{ uri: doctor.image }}
            style={styles.doctorImage}
          />
          </View>
          
          <View style={styles.doctorInfo}>
            <View style={styles.topRatedBadge}>
              <Text style={styles.topRatedText}>TOP RATED</Text>
            </View>
            
            <Text style={styles.doctorName}>{doctor.name}</Text>

           <Text style={styles.specialty}>{doctor.specialty}</Text>
            
           <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={14} color="#fbbf24" />
              <Text style={styles.rating}>{doctor.rating}</Text>
              <Text style={styles.reviews}>({doctorData.reviews} Reviews)</Text>
            </View>

            
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Exp.</Text>
                <Text style={styles.statValue}>
                    {doctor.experience ?? '—'} Yrs
                  </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Patients</Text>
                <Text style={styles.statValue}>{doctorData.patients}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Biography Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.biographyText}>
            {doctorData.bio}
          </Text>
        </View>

        {/* Personal Care Assistant Section */}
        <View style={styles.section}>
          <View style={styles.assistantCard}>
            <View style={styles.assistantHeader}>
              <View style={styles.assistantTitleContainer}>
                <Text style={styles.assistantIcon}>🎧</Text>
                <View>
                  <Text style={styles.assistantTitle}>Personal Care Assistant</Text>
                  <Text style={styles.assistantSubtitle}>Enhance your hospital visit experience</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {selectedAssistant ? `₹${selectedAssistant.price}` : '+$25'}
                </Text>
                <Text style={styles.priceLabel}>PER VISIT</Text>
              </View>
            </View>

            <View style={styles.assistantProfile}>
              <Image
                source={{
                  uri: selectedAssistant
                    ? selectedAssistant.image
                    : 'https://randomuser.me/api/portraits/women/44.jpg',
                }}
                style={styles.assistantImage}
              />

              <View style={styles.assistantDetails}>
                <Text style={styles.assistantName}>
                  {selectedAssistant ? selectedAssistant.name : 'Select Assistant'}
                </Text>

                <Text style={styles.assistantAvailability}>
                  {selectedAssistant
                    ? `₹${selectedAssistant.price} per visit`
                    : 'Available for your session'}
                </Text>
              </View>
              <Switch
                    value={assistantEnabled}
                    onValueChange={(value) => {
                      if (value) {
                        setShowAssistantModal(true);
                      } else {
                        setAssistantEnabled(false);
                        setSelectedAssistant(null);
                      }
                    }}
                    trackColor={{ false: '#e2e8f0', true: '#2D7E7E' }}
                    thumbColor="#ffffff"
                  />
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <MaterialIcons name="check-circle" size={14} color="#2D7E7E" />
                <Text style={styles.featureText}>Queue Management</Text>
              </View>

              <View style={styles.feature}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.featureText}>Lab Report Collection</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Patient Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Patient Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq_OD09ZV_hoj9-HAqdPSd4QrUNIwUuWWuZpW4mySb6wzdRdruqwhA1pdZnsp8Ff1mdUOg3CI5iJvMprBr0TqRjgCaIX9q9U0OIYxzBFMojpMKD9RD_zGU5O5nK4CNxb5STXHAE0iw6IW9q0KUuqM6KUR5ZVLLX1Izy8ecV1ES8ngkZN-Kjsb_nAXoCBoSYfDniDREK2rvGzx_oGRMhVheK9XMzdMp--xBsp9qbXRDjAVo568sLo-g0foZop1NU5pcWk-oEgEwCbA' }}
                  style={styles.reviewerImage}
                />
                <View>
                  <Text style={styles.reviewerName}>David Miller</Text>
                  <Text style={styles.reviewTime}>2 days ago</Text>
                </View>
              </View>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.starIcon}>★</Text>
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>
              Dr. Jenkins was very patient and explained my cardiac condition in simple terms. Highly recommended!
            </Text>
          </View>
        </View>

        {/* Bottom spacing for fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
          <MaterialIcons name="event" size={18} color="#ffffff" />
        </TouchableOpacity>

      </View>
      {/* Personal Assistant Bottom Modal */}
<Modal visible={showAssistantModal} transparent animationType="slide">
  <View style={assistantStyles.overlay}>
    <View style={assistantStyles.modal}>

      <Text style={assistantStyles.title}>
        Select Personal Care Assistant
      </Text>

      {assistants.map((assistant) => {
        const isSelected = selectedAssistant?.id === assistant.id;

        return (
          <TouchableOpacity
            key={assistant.id}
            style={[
              assistantStyles.card,
              isSelected && assistantStyles.cardActive,
            ]}
            onPress={() => setSelectedAssistant(assistant)}
          >
            <Image
              source={{ uri: assistant.image }}
              style={assistantStyles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={assistantStyles.name}>{assistant.name}</Text>

              <View style={assistantStyles.ratingRow}>
                <Text style={{ color: '#fbbf24' }}>★</Text>
                <Text style={assistantStyles.rating}>
                  {assistant.rating}
                </Text>
                <Text style={assistantStyles.reviews}>
                  ({assistant.reviews})
                </Text>
              </View>

              <Text style={assistantStyles.price}>
                ₹{assistant.price} / visit
              </Text>
            </View>

            {isSelected && (
          <MaterialIcons name="check-circle" size={20} color="#2D7E7E" />
        )}
          </TouchableOpacity>
        );
      })}

      {selectedAssistant && (
        <View style={assistantStyles.workList}>
          {selectedAssistant.works.map((work: string, index: number) => (
            <View key={index} style={assistantStyles.workItem}>
              <Text style={{ color: '#2D7E7E' }}>✓</Text>
              <Text style={assistantStyles.workText}>{work}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={assistantStyles.actions}>
        <TouchableOpacity
          onPress={() => setShowAssistantModal(false)}
        >
          <Text style={assistantStyles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!selectedAssistant}
          onPress={() => {
            setAssistantEnabled(true);
            setShowAssistantModal(false);
          }}
        >
          <Text style={assistantStyles.confirm}>
            Select Assistant
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  doctorSection: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
  doctorImageContainer: {
    width: 128,
    height: 128,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  doctorInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  topRatedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  topRatedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0d9488',
    letterSpacing: 0.5,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 26,
  },
  specialty: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D7E7E',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starIcon: {
    fontSize: 14,
    color: '#fbbf24',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statBox: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  biographyText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  readMore: {
    color: '#2D7E7E',
    fontWeight: '700',
  },
  assistantCard: {
    backgroundColor: 'rgba(45, 126, 126, 0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(45, 126, 126, 0.2)',
  },
  assistantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  assistantTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  assistantIcon: {
    fontSize: 20,
  },
  assistantTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  assistantSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D7E7E',
  },
  priceLabel: {
    fontSize: 9,
    color: '#94a3b8',
    letterSpacing: -0.3,
  },
  assistantProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  assistantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  assistantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  assistantName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  assistantAvailability: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  checkIcon: {
    fontSize: 14,
    color: '#2D7E7E',
  },
  featureText: {
    fontSize: 10,
    color: '#64748b',
    flex: 1,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D7E7E',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButton: {
    backgroundColor: '#2D7E7E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#2D7E7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  calendarIcon: {
    fontSize: 18,
  },
});
const assistantStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  cardActive: {
    borderWidth: 2,
    borderColor: '#2D7E7E',
    backgroundColor: '#ecfeff',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    fontWeight: '600',
  },
  reviews: {
    fontSize: 12,
    color: '#64748b',
  },
  price: {
    marginTop: 4,
    fontWeight: '700',
    color: '#2D7E7E',
  },
  check: {
    fontSize: 18,
    color: '#2D7E7E',
    fontWeight: '800',
  },
  workList: {
    marginTop: 12,
  },
  workItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  workText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancel: {
    color: '#64748b',
    fontWeight: '600',
  },
  confirm: {
    color: '#2D7E7E',
    fontWeight: '700',
  },
});
export default DoctorProfile;