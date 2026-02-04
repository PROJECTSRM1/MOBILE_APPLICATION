import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const PartnerPortalStandalone = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.closeButton} />
        
        <Text style={styles.headerTitle}>Partner Portal</Text>
        
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <Text style={styles.helpIcon}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSubtitle}>
            Please select your access mode to continue
          </Text>
        </View>

        {/* Student View Card */}
        <View style={styles.card}>
          <View style={[styles.cardImageContainer, styles.studentGradient]}>
            {/* Background Image */}
            <Image 
              source={require('../../assets/student1.jpg')}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
            
            {/* Overlay */}
            <View style={styles.imageOverlay} />
            
            {/* Classroom Graphics */}
            <View style={styles.classroomContainer}>
              <View style={styles.classroomWindow} />
              <View style={styles.classroomDoor} />
              <View style={styles.classroomDesk1} />
              <View style={styles.classroomDesk2} />
              <View style={styles.classroomDesk3} />
            </View>

            {/* Graduation Cap Icon */}
            <View style={styles.iconCircle}>
              <View style={styles.graduationCap}>
                <View style={styles.capTop} />
                <View style={styles.capSquare} />
                <View style={styles.capTassel} />
              </View>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Student View</Text>
              <View style={styles.previewBadge}>
                <Text style={styles.previewText}>PREVIEW</Text>
              </View>
            </View>
            
            <Text style={styles.cardDescription}>
              Access course materials, grades, and all student-facing features to verify the learning experience.
            </Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate("institutionbranchscreen" as never)}
            >
              <Text style={styles.primaryButtonText}>Enter Student View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Management View Card */}
        <View style={styles.card}>
          <View style={[styles.cardImageContainer, styles.managementGradient]}>
            {/* Background Image */}
            <Image 
              source={require('../../assets/management.jpg')}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
            
            {/* Overlay */}
            <View style={styles.imageOverlay} />
            
            {/* Tablet/Dashboard Graphics */}
            <View style={styles.tabletContainer}>
              <View style={styles.tabletScreen}>
                {/* Header Lines */}
                <View style={styles.tabletHeader}>
                  <View style={styles.tabletHeaderLine} />
                  <View style={styles.tabletHeaderLine} />
                </View>

                {/* Dashboard Grid */}
                <View style={styles.dashboardGrid}>
                  <View style={styles.dashboardItem}>
                    <View style={styles.dashboardLine} />
                    <View style={styles.dashboardValue} />
                  </View>
                  <View style={styles.dashboardItem}>
                    <View style={styles.dashboardLine} />
                    <View style={styles.dashboardValue} />
                  </View>
                </View>

                {/* Chart Area */}
                <View style={styles.chartContainer}>
                  <View style={styles.chartBar1} />
                  <View style={styles.chartBar2} />
                  <View style={styles.chartBar3} />
                  <View style={styles.chartBar4} />
                  <View style={styles.chartBar5} />
                </View>
              </View>
            </View>

            {/* Analytics Icon */}
            <View style={styles.analyticsIcon}>
              <View style={styles.analyticsGraph}>
                <View style={styles.analyticsLine} />
                <View style={styles.analyticsDot1} />
                <View style={styles.analyticsDot2} />
                <View style={styles.analyticsCog}>
                  <View style={styles.cogCenter} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Management View</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminText}>ADMIN</Text>
              </View>
            </View>
            
            <Text style={styles.cardDescription}>
              Review analytics, manage enrollments, configure portal settings, and generate institution reports.
            </Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate("ManagementOverview" as never)}
            >
              <Text style={styles.primaryButtonText}>Enter Management View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Need assistance with your account?
          </Text>
          <Text style={styles.footerLink}>
            Contact System Administrator
          </Text>
          
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>All systems operational</Text>
          </View>
        </View>
      </ScrollView>

      {/* Help Modal */}
      <Modal
        visible={showHelpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.helpIconLarge}>
                <Text style={styles.helpIconLargeText}>?</Text>
              </View>
              <Text style={styles.modalTitle}>Partner Portal Guide</Text>
              <Text style={styles.modalSubtitle}>Choose the right access mode for your needs</Text>
            </View>

            <ScrollView 
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Student View Help Section */}
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <View style={styles.helpIconSmall}>
                    <View style={styles.graduationCapSmall}>
                      <View style={styles.capTopSmall} />
                      <View style={styles.capSquareSmall} />
                    </View>
                  </View>
                  <Text style={styles.helpSectionTitle}>Student View</Text>
                  <View style={styles.previewBadgeSmall}>
                    <Text style={styles.previewTextSmall}>PREVIEW</Text>
                  </View>
                </View>
                
                <Text style={styles.helpDescription}>
                  Experience the portal exactly as your students see it. Perfect for:
                </Text>
                
                <View style={styles.helpList}>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Testing course content before publishing
                    </Text>
                  </View>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Verifying assignment submissions and grading
                    </Text>
                  </View>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Checking how materials appear on mobile devices
                    </Text>
                  </View>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Understanding the student learning journey
                    </Text>
                  </View>
                </View>
              </View>

              {/* Management View Help Section */}
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <View style={styles.helpIconSmall}>
                    <View style={styles.analyticsIconSmall}>
                      <View style={styles.analyticsLineSmall} />
                      <View style={styles.analyticsDotSmall} />
                    </View>
                  </View>
                  <Text style={styles.helpSectionTitle}>Management View</Text>
                  <View style={styles.adminBadgeSmall}>
                    <Text style={styles.adminTextSmall}>ADMIN</Text>
                  </View>
                </View>
                
                <Text style={styles.helpDescription}>
                  Access powerful administrative tools and insights. Use this to:
                </Text>
                
                <View style={styles.helpList}>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Monitor student progress and performance analytics
                    </Text>
                  </View>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Manage enrollments and user permissions
                    </Text>
                  </View>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Generate comprehensive institutional reports
                    </Text>
                  </View>
                  <View style={styles.helpListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.helpListText}>
                      Configure portal settings and customization
                    </Text>
                  </View>
                </View>
              </View>

              {/* Quick Tips Section */}
              <View style={styles.tipsSection}>
                <Text style={styles.tipsSectionTitle}>💡 Quick Tips</Text>
                
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>Switching Views</Text>
                  <Text style={styles.tipText}>
                    You can easily switch between views anytime by returning to this portal screen.
                  </Text>
                </View>
                
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>Data Security</Text>
                  <Text style={styles.tipText}>
                    Both views maintain the same security standards. Your actions are logged for accountability.
                  </Text>
                </View>
                
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>Need Help?</Text>
                  <Text style={styles.tipText}>
                    Contact your system administrator for account issues or additional permissions.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Got it, thanks!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  helpButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.text,
  },
  helpIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: colors.subText,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  imageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(43, 135, 184, 0.3)',
  },
  studentGradient: {
    backgroundColor: '#2b87b8',
  },
  managementGradient: {
    backgroundColor: '#e0f0f9',
  },
  // Student View - Classroom Graphics
  classroomContainer: {
    position: 'absolute',
    left: 30,
    top: 40,
    width: 140,
    height: 100,
  },
  classroomWindow: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 50,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  classroomDoor: {
    position: 'absolute',
    left: 60,
    top: 10,
    width: 30,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 4,
  },
  classroomDesk1: {
    position: 'absolute',
    right: 40,
    bottom: 0,
    width: 25,
    height: 12,
    backgroundColor: 'rgba(101, 67, 33, 0.6)',
    borderRadius: 2,
  },
  classroomDesk2: {
    position: 'absolute',
    right: 15,
    bottom: 0,
    width: 20,
    height: 12,
    backgroundColor: 'rgba(101, 67, 33, 0.5)',
    borderRadius: 2,
  },
  classroomDesk3: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    backgroundColor: 'rgba(101, 67, 33, 0.4)',
    borderRadius: 2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 60,
    top: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  graduationCap: {
    width: 36,
    height: 36,
    position: 'relative',
  },
  capTop: {
    position: 'absolute',
    top: 8,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1a73e8',
  },
  capSquare: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    width: 20,
    height: 16,
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  capTassel: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 3,
    height: 12,
    backgroundColor: '#1a73e8',
  },
  // Management View - Tablet/Dashboard Graphics
  tabletContainer: {
    position: 'relative',
    width: 160,
    height: 120,
  },
  tabletScreen: {
    width: 140,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#2d3748',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tabletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  tabletHeaderLine: {
    width: 40,
    height: 3,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
  },
  dashboardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dashboardItem: {
    width: '48%',
  },
  dashboardLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#e2e8f0',
    marginBottom: 3,
    borderRadius: 1,
  },
  dashboardValue: {
    width: '60%',
    height: 6,
    backgroundColor: '#cbd5e0',
    borderRadius: 1,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
    paddingTop: 8,
  },
  chartBar1: {
    width: 8,
    height: 20,
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  chartBar2: {
    width: 8,
    height: 12,
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  chartBar3: {
    width: 8,
    height: 28,
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  chartBar4: {
    width: 8,
    height: 16,
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  chartBar5: {
    width: 8,
    height: 32,
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  analyticsIcon: {
    position: 'absolute',
    right: 0,
    top: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  analyticsGraph: {
    width: 28,
    height: 28,
    position: 'relative',
  },
  analyticsLine: {
    position: 'absolute',
    top: 8,
    left: 2,
    width: 24,
    height: 2,
    backgroundColor: '#1a73e8',
    transform: [{ rotate: '25deg' }],
  },
  analyticsDot1: {
    position: 'absolute',
    top: 12,
    left: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1a73e8',
  },
  analyticsDot2: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1a73e8',
  },
  analyticsCog: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1a73e8',
  },
  cogCenter: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a73e8',
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  previewBadge: {
    backgroundColor: colors.surfaceAlt || '#f0f4ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  previewText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary || '#1a73e8',
    letterSpacing: 0.5,
  },
  adminBadge: {
    backgroundColor: (colors.success || '#10b981') + '22',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adminText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success || '#10b981',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.subText,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary || '#1a73e8',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: colors.primary || '#1a73e8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.subText,
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary || '#1a73e8',
    marginBottom: 20,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success || '#10b981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: colors.subText,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    width: '100%',
    maxWidth: 480,
    height: height * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  helpIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary || '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  helpIconLargeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.subText,
    textAlign: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 8,
  },
  helpSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  helpSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  helpIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  graduationCapSmall: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  capTopSmall: {
    position: 'absolute',
    top: 2,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1a73e8',
  },
  capSquareSmall: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    width: 8,
    height: 8,
    backgroundColor: '#1a73e8',
    borderRadius: 1,
  },
  analyticsIconSmall: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  analyticsLineSmall: {
    position: 'absolute',
    top: 4,
    left: 2,
    width: 12,
    height: 1.5,
    backgroundColor: '#1a73e8',
    transform: [{ rotate: '25deg' }],
  },
  analyticsDotSmall: {
    position: 'absolute',
    bottom: 4,
    right: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a73e8',
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  previewBadgeSmall: {
    backgroundColor: colors.surfaceAlt || '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  previewTextSmall: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary || '#1a73e8',
    letterSpacing: 0.5,
  },
  adminBadgeSmall: {
    backgroundColor: (colors.success || '#10b981') + '22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminTextSmall: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.success || '#10b981',
    letterSpacing: 0.5,
  },
  helpDescription: {
    fontSize: 14,
    color: colors.subText,
    lineHeight: 20,
    marginBottom: 16,
  },
  helpList: {
    marginLeft: 4,
  },
  helpListItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary || '#1a73e8',
    marginTop: 7,
    marginRight: 12,
  },
  helpListText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tipsSection: {
    padding: 24,
  },
  tipsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary || '#1a73e8',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: colors.subText,
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: colors.primary || '#1a73e8',
    marginHorizontal: 24,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary || '#1a73e8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default PartnerPortalStandalone;