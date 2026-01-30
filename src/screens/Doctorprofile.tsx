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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Icon component placeholder - replace with react-native-vector-icons or your icon library
const Icon = ({ name, size = 24, color = '#64748b' }: { name: string; size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>{name}</Text>
);

const DoctorProfile = () => {
  const [assistantEnabled, setAssistantEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar hidden />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="←" size={20} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="♡" size={22} color="#64748b" />
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
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALdtsN03FkaeKqp-LuEQl3zRCSSGFrIPP8olMubt83zP37HhgaWcFF8lfKRj3oxqJOgIQbs_SQNF3wh70Csp6MTddFP4kTR_q8387HWQqH5FowvHFVziqzdPPBLo70zIaORmAmK77S-CPeVrj44he6oILlHB3gE0x1KYNS77Jf0VUofoRbmlwMGTX97AbFTjtSLefBInpTKnZ4i5nKDRahqt3EJzR4oRBKndt83udNFU_w3TazPmg_vQoW1OfP3rMkRMcGQ-1sV9M' }}
              style={styles.doctorImage}
            />
          </View>
          
          <View style={styles.doctorInfo}>
            <View style={styles.topRatedBadge}>
              <Text style={styles.topRatedText}>TOP RATED</Text>
            </View>
            
            <Text style={styles.doctorName}>Dr. Sarah Jenkins</Text>
            <Text style={styles.specialty}>Senior Cardiologist</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.rating}>4.9</Text>
              <Text style={styles.reviews}>(120+ Reviews)</Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Exp.</Text>
                <Text style={styles.statValue}>8 Yrs</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Patients</Text>
                <Text style={styles.statValue}>2.5k+</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Biography Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.biographyText}>
            Dr. Sarah Jenkins is a board-certified cardiologist with over 8 years of experience in cardiovascular medicine. She specializes in non-invasive diagnostic cardiology and preventive heart health. She is dedicated to providing compassionate care...{' '}
            <Text style={styles.readMore}>Read More</Text>
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
                <Text style={styles.price}>+$25</Text>
                <Text style={styles.priceLabel}>PER VISIT</Text>
              </View>
            </View>

            <View style={styles.assistantProfile}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAq_z58w1zHFfWcBsg0rEmBbgw1OARhYW5vLSdfXBMnaa5IHIMHlr4NKnAP5gdvcW0zTIQKP9qPved6iNVTZZUyMCYPVO_XLcNsii-yKaXWe-vfHeDygrsE1NwEp4wHcIJIupJ0hgNLytB4K1RWTVOc1WdbeHHu17UeB9ACvxoEX-L-UwuIak3PoX11bsZbOAqEbkRdppEzGZ5Dx-c48Q1vdR-sjLa6rSZPJPXzHHndGL1VrtFLJTDW_bdoCTIznoZ3oNf0GVNQ4A' }}
                style={styles.assistantImage}
              />
              <View style={styles.assistantDetails}>
                <Text style={styles.assistantName}>Emily Watson</Text>
                <Text style={styles.assistantAvailability}>Available for your session</Text>
              </View>
              <Switch
                value={assistantEnabled}
                onValueChange={setAssistantEnabled}
                trackColor={{ false: '#e2e8f0', true: '#2D7E7E' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.checkIcon}>✓</Text>
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
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>
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

export default DoctorProfile;