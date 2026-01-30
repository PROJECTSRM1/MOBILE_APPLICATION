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

// Job data based on company ID for unique listings
// const getJobData = (company: Company) => {
//   const jobDataByCompanyId: { [key: number]: {
//     title: string;
//     description: string;
//     requirements: string[];
//     salary: string;
//   }} = {
//     1: { // TechFlow Systems
//       title: "Senior Full Stack Developer",
//       description: "We are looking for an experienced Senior Full Stack Developer to join our engineering team. You will be responsible for designing and implementing scalable AI-powered solutions, working with cutting-edge technologies, and mentoring junior developers to build world-class products that serve enterprise clients globally.",
//       requirements: [
//         "5+ years of experience in full-stack development with React and Node.js",
//         "Strong understanding of cloud platforms (AWS, Azure, or GCP)",
//         "Experience with microservices architecture and containerization",
//         "Hands-on experience with AI/ML integration and APIs"
//       ],
//       salary: "$140k - $180k/yr"
//     },
//     2: { // EduGrow
//       title: "Product Manager - EdTech",
//       description: "Join our team as a Product Manager to shape the future of education technology. You'll work closely with designers, engineers, and educators to create innovative learning solutions that impact millions of students worldwide through personalized curriculum and AI-driven tutoring.",
//       requirements: [
//         "3+ years of product management experience in tech or education sector",
//         "Proven track record of launching successful EdTech products",
//         "Strong analytical and user research skills with student-focused approach",
//         "Experience working with AI-driven learning platforms"
//       ],
//       salary: "$110k - $140k/yr"
//     },
//     3: { // Apex Banking
//       title: "Senior Financial Analyst",
//       description: "We're seeking a skilled Senior Financial Analyst to help drive strategic decisions through data analysis and financial modeling. You'll work with executive leadership to provide insights that shape our financial strategy and business growth in the global financial services sector.",
//       requirements: [
//         "Bachelor's degree in Finance, Economics, or related field; MBA preferred",
//         "5+ years of experience in financial analysis or investment banking",
//         "Advanced proficiency in Excel, SQL, and financial modeling",
//         "Experience with regulatory compliance and risk management"
//       ],
//       salary: "$150k - $190k/yr"
//     },
//     4: { // EcoDynamics
//       title: "Senior Renewable Energy Engineer",
//       description: "Be part of the renewable energy revolution! We're looking for a talented Senior Engineer to design and implement next-generation solar and wind energy solutions that will power sustainable communities around the world. Work remotely with a global team passionate about climate action.",
//       requirements: [
//         "Master's degree in Electrical, Mechanical, or Energy Engineering",
//         "5+ years of experience in renewable energy systems design",
//         "Expertise in energy storage systems and smart grid integration",
//         "Experience with remote collaboration and distributed teams"
//       ],
//       salary: "$120k - $155k/yr"
//     },
//     5: { // CloudNine Solutions
//       title: "DevOps Engineer - Cloud Infrastructure",
//       description: "We're building the next generation of cloud infrastructure and DevOps tools for modern enterprises. Join our team to work on cutting-edge cloud-native technologies, automation, and infrastructure-as-code solutions that empower businesses to scale efficiently.",
//       requirements: [
//         "4+ years of experience in DevOps, SRE, or Cloud Engineering",
//         "Strong expertise in Kubernetes, Docker, and container orchestration",
//         "Proficiency in Infrastructure-as-Code tools (Terraform, CloudFormation)",
//         "Experience with CI/CD pipelines and automation frameworks"
//       ],
//       salary: "$130k - $170k/yr"
//     },
//     6: { // HealthTech Innovations
//       title: "Senior Product Designer - Healthcare",
//       description: "We are looking for a creative Senior Product Designer to join our core team revolutionizing patient care. You will be responsible for defining the user experience for our AI-powered diagnostic tools and telemedicine platforms, working closely with healthcare professionals, engineers, and product management.",
//       requirements: [
//         "5+ years of experience in product design or UX/UI roles",
//         "Proficiency in Figma, Adobe Suite, and prototyping tools",
//         "Strong portfolio demonstrating healthcare or medical design solutions",
//         "Understanding of HIPAA compliance and healthcare accessibility standards"
//       ],
//       salary: "$125k - $160k/yr"
//     }
//   };

//   // Return job data for the specific company, or default if not found
//   return jobDataByCompanyId[company.id] || {
//     title: "Senior Professional",
//     description: company.description,
//     requirements: [
//       "Relevant years of experience in the field",
//       "Strong technical and communication skills",
//       "Proven track record of success"
//     ],
//     salary: "$100k - $150k/yr"
//   };
// };

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
// const ALL_COMPANIES: Company[] = [
//   {
//     id: 1,
//     name: "TechFlow Systems",
//     industry: "Software Engineering",
//     description: "Leading the way in AI and machine learning solutions for enterprise clients worldwide.",
//     location: "San Francisco, CA",
//     size: "500+",
//     isRemote: false,
//     badge: "4 Internships",
//     badgeColor: "#135bec",
//     active: "Active 2h ago",
//     icon: "code",
//     iconBg: "#3b82f6",
//   },
//   {
//     id: 2,
//     name: "EduGrow",
//     industry: "EdTech",
//     description: "Helping students learn faster through personalized curriculum and AI-driven tutoring assistants.",
//     location: "Austin, TX",
//     size: "50-200",
//     isRemote: false,
//     badge: "1 Job Opening",
//     badgeColor: "#22c55e",
//     active: "Active 1d ago",
//     icon: "school",
//     iconBg: "#f97316",
//   },
//   {
//     id: 3,
//     name: "Apex Banking",
//     industry: "Finance & Banking",
//     description: "Global financial solutions for the modern era.",
//     location: "London, UK",
//     size: "1000+",
//     isRemote: false,
//     badge: "Hiring Frozen",
//     badgeColor: "#6b7280",
//     icon: "account-balance",
//     iconBg: "#334155",
//   },
//   {
//     id: 4,
//     name: "EcoDynamics",
//     industry: "Green Energy",
//     description: "Developing sustainable energy grids powered by next-gen solar technology.",
//     location: "Remote",
//     size: "50-200",
//     isRemote: true,
//     badge: "2 Senior Roles",
//     badgeColor: "#16a34a",
//     active: "Active 4h ago",
//     icon: "eco",
//     iconBg: "#22c55e",
//   },
//   {
//     id: 5,
//     name: "CloudNine Solutions",
//     industry: "Software Engineering",
//     description: "Building next-generation cloud infrastructure and DevOps tools.",
//     location: "Seattle, WA",
//     size: "200-500",
//     isRemote: true,
//     badge: "3 Internships",
//     badgeColor: "#135bec",
//     active: "Active 5h ago",
//     icon: "cloud",
//     iconBg: "#0ea5e9",
//   },
//   {
//     id: 6,
//     name: "HealthTech Innovations",
//     industry: "Healthcare",
//     description: "Revolutionizing patient care with AI-powered diagnostic tools.",
//     location: "Boston, MA",
//     size: "100-200",
//     isRemote: false,
//     badge: "5 Job Openings",
//     badgeColor: "#22c55e",
//     active: "Active 3h ago",
//     icon: "local-hospital",
//     iconBg: "#ef4444",
//   },
// ];

// const company = ALL_COMPANIES.find(c => c.id === companyId)!;
// const jobData = getJobData(company);
useEffect(() => {
  fetchCompanyDetails();
}, [companyId]);

const fetchCompanyDetails = async () => {
  try {
    const response = await fetch(
      "https://swachify-india-be-1-mcrb.onrender.com/api/jobs"
    );

    const result = await response.json();

    // ✅ SAFELY extract array
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
// const jobData = {
//   title: `${company?.industry ?? ''} Professional`,
//   description: company?.description ?? '',
//   requirements: [
//     "Relevant experience in the field",
//     "Strong problem-solving skills",
//     "Good communication abilities"
//   ],
//   salary: "As per company standards",
// };

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