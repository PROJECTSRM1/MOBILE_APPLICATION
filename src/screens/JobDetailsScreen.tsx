import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { useTheme } from "../context/ThemeContext";

type RootStackParamList = {
  Companies: undefined;
  JobDetails: { companyId: number };
};


interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  location: string;
  size: string;
  isRemote: boolean;
  badge: string;
  badgeColor: string;
  active?: string;
  icon: string;
  iconBg: string;
}

type JobDetailsRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;
type JobDetailsNavProp = NativeStackNavigationProp<RootStackParamList, 'JobDetails'>;



const JobDetailsScreen = () => {
  const { colors } = useTheme();
    const styles = getStyles(colors);
  const navigation = useNavigation<JobDetailsNavProp>();
  const route = useRoute<JobDetailsRouteProp>();
  //const { company } = route.params;
  const [company, setCompany] = useState<Company | null>(null);
const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
const { companyId } = route.params;

useEffect(() => {
  fetchCompanyDetails();
}, [companyId]);

const fetchCompanyDetails = async () => {
  try {
    const response = await fetch(
      "https://swachify-india-be-1-mcrb.onrender.com/api/jobs"
    );

    const result = await response.json();

    //  SAFELY extract array
    const list = Array.isArray(result)
      ? result
      : result.data || result.companies || [];

    if (!Array.isArray(list)) {
      throw new Error("Companies list is not an array");
    }

    const data = list.find(
      (c: any) => c.company_id === companyId
    );

    if (!data) {
      throw new Error("Company not found");
    }

    const mappedCompany: Company = {
      id: data.company_id,
      name: data.company_name,
      industry: data.industry_name,
      description: `Currently ${data.hiring_status}`,
      location: data.location,
      size: data.company_size,
      isRemote: data.location.toLowerCase().includes("remote"),
      badge:
        data.internships_count > 0
          ? `${data.internships_count} Internships`
          : data.jobs_count > 0
          ? `${data.jobs_count} Job Openings`
          : "Hiring Frozen",
      badgeColor: data.hiring_status === "Active" ? "#22c55e" : "#6b7280",
      active: `Last active ${new Date(data.last_active_time).toDateString()}`,
      icon: "business",
      iconBg: "#135bec",
    };

    setCompany(mappedCompany);
  } catch (err) {
    console.error("JobDetails fetch error:", err);
  } finally {
    setLoading(false);
  }
};


  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };


if (loading || !company) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: colors.text, textAlign: "center", marginTop: 40 }}>
        Loading job details...
      </Text>
    </SafeAreaView>
  );
}

const jobData = {
  title: `${company.industry} Professional`,
  description: company.description,
  requirements: [
    "Relevant experience in the field",
    "Strong problem-solving skills",
    "Good communication abilities",
  ],
  salary: "As per company standards",
};

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={"#101622"} />
        
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Job Details</Text>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleBookmark}
          >
            <MaterialIcons 
              name={isBookmarked ? "bookmark" : "bookmark-border"} 
              size={24} 
              color={isBookmarked ? "#135bec" : "#ffffff"} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Job Header */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <View style={[styles.companyLogo, { backgroundColor: company.iconBg }]}>
                <MaterialIcons name={company.icon} size={36} color="#fff" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.jobTitle}>{jobData.title}</Text>
                <View style={styles.companyInfoRow}>
                  <Text style={styles.companyName}>{company.name}</Text>
                  <View style={styles.dot} />
                  <Text style={styles.postedTime}>2 days ago</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Key Details Grid */}
          <View style={styles.detailsGrid}>
            {/* Location Card */}
            <View style={styles.detailCard}>
              <View style={[styles.detailIcon, { backgroundColor: '#135bec20' }]}>
                <MaterialIcons name="location-on" size={20} color="#135bec" />
              </View>
              <Text style={styles.detailLabel}>LOCATION</Text>
              <Text style={styles.detailValue}>{company.location}</Text>
            </View>

            {/* Salary Card */}
            <View style={styles.detailCard}>
              <View style={[styles.detailIcon, { backgroundColor: '#22c55e20' }]}>
                <MaterialIcons name="attach-money" size={20} color="#22c55e" />
              </View>
              <Text style={styles.detailLabel}>SALARY</Text>
              <Text style={styles.detailValue}>{jobData.salary}</Text>
            </View>

            {/* Notice Period Card */}
            <View style={styles.detailCard}>
              <View style={[styles.detailIcon, { backgroundColor: '#f9731620' }]}>
                <MaterialIcons name="timer" size={20} color="#f97316" />
              </View>
              <Text style={styles.detailLabel}>NOTICE PERIOD</Text>
              <Text style={styles.detailValue}>30 Days</Text>
            </View>

            {/* Job Type Card */}
            <View style={styles.detailCard}>
              <View style={[styles.detailIcon, { backgroundColor: '#a855f720' }]}>
                <MaterialIcons name="work" size={20} color="#a855f7" />
              </View>
              <Text style={styles.detailLabel}>JOB TYPE</Text>
              <Text style={styles.detailValue}>{company.isRemote ? 'Remote' : 'On-site'}</Text>
            </View>
          </View>

          {/* About the Role */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Role</Text>
            <Text 
              style={styles.description} 
              numberOfLines={expandedDescription ? undefined : 3}
            >
              {jobData.description}
            </Text>
            <TouchableOpacity 
              onPress={() => setExpandedDescription(!expandedDescription)}
            >
              <Text style={styles.readMore}>
                {expandedDescription ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.requirementsList}>
              {jobData.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <MaterialIcons name="check-circle" size={20} color="#135bec" />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          </View>

         {/* Office Location */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Office Location</Text>

  <View style={styles.mapContainer}>
    <WebView
      source={{
        uri: `https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(
          company.location
        )}&zoom=13`,
      }}
      style={{ flex: 1 }}
      javaScriptEnabled
      domStorageEnabled
    />
  </View>
</View>


          {/* Important Notice */}
          <View style={styles.alertContainer}>
            <View style={styles.alert}>
              <MaterialIcons name="info" size={24} color="#f97316" />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Important Notice</Text>
                <Text style={styles.alertText}>
                  Please check the details before apply. Applications cannot be edited once submitted for review.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Apply Button */}
        <SafeAreaView style={styles.bottomContainer} edges={['bottom']}>
          <View style={styles.applyButtonContainer}>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background ?? '#101622',
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background ?? '#101622',
      borderBottomWidth: 1,
      borderBottomColor: colors.border ?? '#1f2937',
    },

    iconButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },

    pageTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text ?? '#ffffff',
      flex: 1,
      textAlign: 'center',
    },

    scrollView: {
      flex: 1,
    },

    scrollContent: {
      paddingBottom: 20,
    },

    headerSection: {
      padding: 16,
      paddingTop: 24,
    },

    headerContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
    },

    companyLogo: {
      width: 80,
      height: 80,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    headerText: {
      flex: 1,
      justifyContent: 'center',
    },

    jobTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text ?? '#ffffff',
      lineHeight: 28,
      marginBottom: 6,
    },

    companyInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    companyName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.subText ?? '#9da6b9',
    },

    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.subText ?? '#9da6b9',
    },

    postedTime: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.subText ?? '#9da6b9',
    },

    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 12,
      marginTop: 8,
    },

    detailCard: {
      width: '48%',
      backgroundColor: colors.card ?? '#1A2230',
      borderRadius: 16,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border ?? '#2a3141',
    },

    detailIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },

    detailLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.subText ?? '#9da6b9',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },

    detailValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text ?? '#ffffff',
    },

    section: {
      paddingHorizontal: 16,
      paddingTop: 24,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text ?? '#ffffff',
      marginBottom: 12,
    },

    description: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.subText ?? '#9da6b9',
    },

    readMore: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary ?? '#135bec',
      marginTop: 8,
    },

    requirementsList: {
      gap: 12,
    },

    requirementItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },

    requirementText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 22,
      color: colors.subText ?? '#9da6b9',
    },

    mapContainer: {
      width: '100%',
      height: 160,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.card ?? '#1A2230',
      position: 'relative',
    },

    mapOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },

    mapLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(26, 34, 48, 0.95)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },

    mapLabelText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#ffffff',
    },

    alertContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    alert: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: '#f9731610',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: '#f9731630',
    },

    alertContent: {
      flex: 1,
      gap: 4,
    },

    alertTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text ?? '#ffffff',
    },

    alertText: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.subText ?? '#9da6b9',
    },

    bottomContainer: {
      backgroundColor: colors.background ?? '#101622',
      borderTopWidth: 1,
      borderTopColor: colors.border ?? '#1f2937',
    },

    applyButtonContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },

    applyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary ?? '#135bec',
      height: 52,
      borderRadius: 16,
      gap: 8,
      shadowColor: colors.primary ?? '#135bec',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },

    applyButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#ffffff',
    },
  });


export default JobDetailsScreen;