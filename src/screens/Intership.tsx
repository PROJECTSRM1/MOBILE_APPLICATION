import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Internship } from './InternshipList';
import { useTheme } from '../context/ThemeContext';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// -------------------- TYPES --------------------
type InternshipDetailRouteProp = RouteProp<RootStackParamList, 'Internship'>;
type InternshipDetailNavProp = NativeStackNavigationProp<RootStackParamList, 'Internship'>;

// -------------------- COMPONENT --------------------
const InternshipDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<InternshipDetailNavProp>();
  const route = useRoute<InternshipDetailRouteProp>();
  const { internship } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios-new" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Internship Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Company Section */}
        <View style={styles.companyRow}>
          <View style={[styles.logo, { backgroundColor: internship.logoColor }]}>
            <Text style={styles.logoText}>
              {internship.company.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.role}>{internship.title}</Text>

            <View style={styles.inline}>
              <Icon name="business" size={16} color={colors.text} />
              <Text style={styles.subText}> {internship.company}</Text>
            </View>

            <View style={styles.inline}>
              <Icon 
                name={internship.isRemote ? 'public' : 'location-on'} 
                size={14} 
                color="#9ca3af" 
              />
              <Text style={styles.subText}>
                {' '}{internship.location}{internship.isRemote ? ' (Remote)' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.grid}>
          {infoCard('calendar-month', 'Duration', internship.duration, '#3b82f6', styles)}
          {internship.type && infoCard('payments', 'Stipend', internship.type, '#22c55e', styles)}
          {infoCard('public', 'Location', internship.isRemote ? 'Remote' : 'On-site', '#a855f7', styles)}
          {infoCard('category', 'Category', internship.category.charAt(0).toUpperCase() + internship.category.slice(1), '#f97316', styles)}
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About the role</Text>
        <Text style={styles.paragraph}>
          {internship.description}
        </Text>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>Requirements</Text>
        {requirement('Strong understanding of ' + internship.category + ' principles', styles)}
        {requirement('Excellent communication and collaboration skills', styles)}
        {requirement('Ability to work in a fast-paced environment', styles)}
        {requirement('Portfolio demonstrating relevant experience', styles)}

        {/* Alert */}
        <View style={styles.alert}>
          <Icon name="warning" size={22} color="#f59e0b" />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Action Required</Text>
            <Text style={styles.alertText}>
              Please check the details before applying. Once submitted, the
              application is final and cannot be edited.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => navigation.navigate('ReviewApplication', { internship })}
        >
          <Text style={styles.applyText}>Apply Now</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// -------------------- REUSABLE UI --------------------
const infoCard = (
  icon: string,
  label: string,
  value: string,
  color: string,
  styles: any,
) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const requirement = (text: string, styles: any) => (
  <View style={styles.reqRow}>
    <Icon name="check-circle" size={20} color="#3b82f6" />
    <Text style={styles.reqText}>{text}</Text>
  </View>
);

// -------------------- STYLES --------------------
const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* ================= HEADER ================= */
    header: {
      height: 96,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    iconBtn: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      paddingRight: 40,
    },

    /* ================= BODY ================= */
    container: {
      padding: 16,
      paddingBottom: 140,
    },

    companyRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 24,
      alignItems: 'center',
    },

    logo: {
      width: 80,
      height: 80,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    logoText: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.text,
    },

    role: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '800',
    },

    inline: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      gap: 6,
    },

    subText: {
      color: colors.subText,
      fontSize: 14,
    },

    /* ================= GRID ================= */
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 28,
    },

    card: {
      width: '48%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    iconBox: {
      padding: 6,
      borderRadius: 10,
      backgroundColor: colors.surface,
    },

    cardLabel: {
      color: colors.subText,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
    },

    cardValue: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      marginTop: 10,
    },

    /* ================= CONTENT ================= */
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 12,
    },

    paragraph: {
      color: colors.subText,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 24,
    },

    reqRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
      alignItems: 'flex-start',
    },

    reqText: {
      color: colors.subText,
      fontSize: 15,
      flex: 1,
      lineHeight: 22,
    },

    /* ================= ALERT ================= */
    alert: {
      flexDirection: 'row',
      gap: 12,
      backgroundColor: colors.warningBg ?? colors.card,
      borderRadius: 16,
      padding: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: colors.warningBorder ?? colors.border,
    },

    alertTitle: {
      color: colors.text,
      fontWeight: '700',
      marginBottom: 4,
    },

    alertText: {
      color: colors.subText,
      fontSize: 13,
      lineHeight: 18,
    },

    /* ================= FOOTER ================= */
    footer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    applyBtn: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 14,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      alignItems: 'center',
    },

    applyText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '700',
    },
  });

export default InternshipDetailsScreen;
