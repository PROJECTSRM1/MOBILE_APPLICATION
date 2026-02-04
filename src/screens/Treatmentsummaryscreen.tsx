import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { SafeAreaView } from 'react-native-safe-area-context';

const TreatmentSummaryScreen = () => {
  const [rating, setRating] = useState(4);
  const medicinesRef = useRef(null);
  const labTestsRef = useRef(null);
  const fullReportRef = useRef(null);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <Icon
          name="star"
          size={28}
          color={index < rating ? '#fbbf24' : '#475569'}
        />
      </TouchableOpacity>
    ));
  };

  // Request storage permission for Android
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          // Android 13 and above
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Storage Permission',
              message: 'App needs access to save treatment reports',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android 12 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to save treatment reports',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Capture and save image
  const captureAndSaveImage = async (ref: any, filename: string) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to save images');
        return null;
      }

      // Capture the view as image
      const uri = await captureRef(ref, {
        format: 'png',
        quality: 1,
      });

      // Define save path
      const destPath = `${RNFS.DownloadDirectoryPath}/${filename}`;

      // Copy to downloads folder
      await RNFS.copyFile(uri, destPath);

      return destPath;
    } catch (error) {
      console.error('Error capturing image:', error);
      throw error;
    }
  };

  // Share image
  const shareImage = async (uri: string, title: string) => {
    try {
      const shareOptions = {
        title: title,
        url: `file://${uri}`,
        type: 'image/png',
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.log('Share cancelled or error:', error);
    }
  };

  // Handle View Full Report
  const handleViewFullReport = async () => {
    try {
      Alert.alert('Generating Report', 'Please wait...');

      // Capture all sections
      const fullReportPath = await captureAndSaveImage(
        fullReportRef,
        `treatment_summary_${Date.now()}.png`
      );
      const medicinesPath = await captureAndSaveImage(
        medicinesRef,
        `medicines_${Date.now()}.png`
      );
      const labTestsPath = await captureAndSaveImage(
        labTestsRef,
        `lab_tests_${Date.now()}.png`
      );

      if (fullReportPath && medicinesPath && labTestsPath) {
        Alert.alert(
          'Report Generated',
          'Your treatment summary has been saved to Downloads folder!',
          [
            {
              text: 'Share Full Report',
              onPress: () => shareImage(fullReportPath, 'Treatment Summary'),
            },
            {
              text: 'Share Medicines',
              onPress: () => shareImage(medicinesPath, 'Prescribed Medicines'),
            },
            {
              text: 'Share Lab Tests',
              onPress: () => shareImage(labTestsPath, 'Lab Tests'),
            },
            { text: 'Done' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report. Please try again.');
      console.error(error);
    }
  };

  // Handle Download Report
  const handleDownloadReport = async () => {
    try {
      Alert.alert('Generating Images', 'Creating downloadable images...');

      const medicinesPath = await captureAndSaveImage(
        medicinesRef,
        `prescribed_medicines_${Date.now()}.png`
      );
      const labTestsPath = await captureAndSaveImage(
        labTestsRef,
        `recommended_lab_tests_${Date.now()}.png`
      );

      if (medicinesPath && labTestsPath) {
        Alert.alert(
          'Images Saved',
          'Prescribed Medicines and Lab Tests images have been saved to Downloads!',
          [
            {
              text: 'Share Medicines',
              onPress: () => shareImage(medicinesPath, 'Prescribed Medicines'),
            },
            {
              text: 'Share Lab Tests',
              onPress: () => shareImage(labTestsPath, 'Recommended Lab Tests'),
            },
            { text: 'Done' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download images. Please try again.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101822" />

      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back-ios" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Treatment Summary</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Full Report Wrapper */}
        <View ref={fullReportRef} collapsable={false} style={styles.reportWrapper}>
          {/* Doctor Card */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorLabel}>ATTENDING PHYSICIAN</Text>
              <Text style={styles.doctorName}>Dr. Sarah Jenkins</Text>
              <Text style={styles.doctorSpecialty}>General Practitioner</Text>
              <View style={styles.certificationBadge}>
                <Icon name="verified" size={16} color="#136dec" />
                <Text style={styles.certificationText}>Board Certified</Text>
              </View>
            </View>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB1OqZle5rEXKPCkmHV0vwXZkmXt8wtlxqf4exw4nyRqNr1NP6gtpyBkrkhmpLNXbMenKGfmDdVsUGZgZDP-LBmkvk64ZoZNA66pXjkOH7IDtBkYMEg1lhxBkzPxoW_IEvnxFWCIclomUxykBPAGJWMiCDLbvxtZnz3v3jSftYUjx1BvACnKqaWwure1pu5lCxBbaRaRnepwfmL1WMOtWrrw8wa-m0rmoohgy-0789smllBvRx423EDzrbgSN0QSweIDrmX1ENjY1Z',
              }}
              style={styles.doctorImage}
              resizeMode="cover"
            />
          </View>

          {/* Diagnosis Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnosis Summary</Text>
            <Text style={styles.diagnosisText}>
              Acute Bronchitis - rest and hydration recommended. Continued
              monitoring of temperature is advised. Avoid irritants like smoke.
            </Text>
          </View>

          {/* Prescribed Medicines Section - Capturable */}
          <View style={styles.section}>
            <View ref={medicinesRef} collapsable={false} style={styles.captureContainer}>
              <View style={styles.captureHeader}>
                <Icon name="medication" size={28} color="#136dec" />
                <Text style={styles.captureHeaderTitle}>Prescribed Medicines</Text>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
                <Text style={styles.itemCount}>2 Items</Text>
              </View>

              <View style={styles.listContainer}>
                {/* Medicine 1 */}
                <View style={styles.listItem}>
                  <View style={styles.iconContainer}>
                    <Icon name="medication" size={24} color="#136dec" />
                  </View>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>Amoxicillin</Text>
                    <Text style={styles.listItemSubtitle}>
                      500mg • 2x Daily • 7 Days
                    </Text>
                  </View>
                </View>

                {/* Medicine 2 */}
                <View style={styles.listItem}>
                  <View style={styles.iconContainer}>
                    <Icon name="local-drink" size={24} color="#136dec" />
                  </View>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>Cough Syrup</Text>
                    <Text style={styles.listItemSubtitle}>
                      10ml • Before Bedtime • As needed
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.captureFooter}>
                <Text style={styles.captureFooterText}>
                  Dr. Sarah Jenkins • General Practitioner
                </Text>
                <Text style={styles.captureFooterDate}>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Recommended Lab Tests Section - Capturable */}
          <View style={[styles.section, styles.lastSection]}>
            <View ref={labTestsRef} collapsable={false} style={styles.captureContainer}>
              <View style={styles.captureHeader}>
                <Icon name="science" size={28} color="#136dec" />
                <Text style={styles.captureHeaderTitle}>Recommended Lab Tests</Text>
              </View>

              <Text style={styles.sectionTitle}>Recommended Lab Tests</Text>

              <View style={styles.listContainer}>
                {/* Lab Test 1 */}
                <View style={styles.listItem}>
                  <View style={styles.iconContainer}>
                    <Icon name="science" size={24} color="#136dec" />
                  </View>
                  <View style={styles.listItemContent}>
                    <View style={styles.labTestHeader}>
                      <Text style={styles.listItemTitle}>
                        Full Blood Count (FBC)
                      </Text>
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>URGENT</Text>
                      </View>
                    </View>
                    <Text style={styles.listItemSubtitle}>
                      Required for infection monitoring
                    </Text>
                  </View>
                </View>

                {/* Lab Test 2 */}
                <View style={styles.listItem}>
                  <View style={styles.iconContainer}>
                    <Icon name="medical-services" size={24} color="#136dec" />
                  </View>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>Chest X-Ray</Text>
                    <Text style={styles.listItemSubtitle}>
                      Standard follow-up
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.captureFooter}>
                <Text style={styles.captureFooterText}>
                  Dr. Sarah Jenkins • General Practitioner
                </Text>
                <Text style={styles.captureFooterDate}>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackQuestion}>
            How was your experience today?
          </Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <TouchableOpacity>
            <Text style={styles.rateButton}>Rate Your Consultation</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewFullReport}
          >
            <Text style={styles.primaryButtonText}>View Full Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleDownloadReport}
          >
            <Icon name="picture-as-pdf" size={20} color="#136dec" />
            <Text style={styles.secondaryButtonText}>
              Download Report (PDF)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={26} color="#64748b" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="medical-services" size={26} color="#136dec" />
          <Text style={[styles.navText, styles.navTextActive]}>Consults</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="description" size={26} color="#64748b" />
          <Text style={styles.navText}>Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={26} color="#64748b" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101822',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#101822',
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  reportWrapper: {
    backgroundColor: '#101822',
  },
  doctorCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#192433',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  doctorInfo: {
    flex: 1,
    marginRight: 16,
  },
  doctorLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92a9c9',
    letterSpacing: 1,
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#92a9c9',
    marginBottom: 12,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#136dec',
  },
  doctorImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  lastSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#136dec',
  },
  diagnosisText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#192433',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 109, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#92a9c9',
  },
  labTestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  urgentBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ef4444',
    letterSpacing: 0.5,
  },
  captureContainer: {
    backgroundColor: '#192433',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  captureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  captureHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  captureFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  captureFooterText: {
    fontSize: 13,
    color: '#92a9c9',
    marginBottom: 4,
  },
  captureFooterDate: {
    fontSize: 12,
    color: '#64748b',
  },
  feedbackSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  feedbackQuestion: {
    fontSize: 14,
    color: '#92a9c9',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  rateButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#136dec',
    marginTop: 8,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#136dec',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#136dec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#136dec',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#136dec',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#192433',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
  },
  navTextActive: {
    color: '#136dec',
  },
});

export default TreatmentSummaryScreen;