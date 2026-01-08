import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InternshipDetailsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="arrow-back-ios-new" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Internship Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Company Section */}
        <View style={styles.companyRow}>
          <Image
            source={{
              uri: 'https://dummyimage.com/200x200/1f2937/ffffff&text=LOGO',
            }}
            style={styles.logo}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.role}>UX/UI Design Intern</Text>

            <View style={styles.inline}>
              <Icon name="business" size={16} color="#3b82f6" />
              <Text style={styles.subText}> TechSolutions Inc.</Text>
            </View>

            <View style={styles.inline}>
              <Icon name="location-on" size={14} color="#9ca3af" />
              <Text style={styles.subText}>
                {' '}
                San Francisco, CA (Remote)
              </Text>
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.grid}>
          {infoCard('calendar-month', 'Duration', '6 Months', '#3b82f6')}
          {infoCard('payments', 'Stipend', '$25/hr', '#22c55e')}
          {infoCard('public', 'Location', 'Remote', '#a855f7')}
          {infoCard('work-history', 'Type', 'Full-time', '#f97316')}
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About the role</Text>
        <Text style={styles.paragraph}>
          We are looking for a creative intern to join our design team. You will
          work closely with product managers and developers to create intuitive
          user experiences. You'll have the opportunity to contribute to
          real-world projects and learn from experienced designers.
        </Text>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>Requirements</Text>
        {requirement('Proficiency in Figma and Adobe Creative Suite')}
        {requirement('Understanding of user-centered design principles')}
        {requirement('Ability to create wireframes and prototypes')}
        {requirement('Strong communication and collaboration skills')}

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
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyText}>Apply Now</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* ---------------- Reusable UI ---------------- */

const infoCard = (
  icon: string,
  label: string,
  value: string,
  color: string,
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

const requirement = (text: string) => (
  <View style={styles.reqRow}>
    <Icon name="check-circle" size={20} color="#3b82f6" />
    <Text style={styles.reqText}>{text}</Text>
  </View>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#101622',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#1f2937',
  },
  iconBtn: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    padding: 16,
    paddingBottom: 140,
  },
  companyRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#1f2937',
  },
  role: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  subText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  card: {
    width: '48%',
    backgroundColor: '#1c2333',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    padding: 6,
    borderRadius: 8,
  },
  cardLabel: {
    color: '#9ca3af',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  cardValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  paragraph: {
    color: '#9ca3af',
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
    color: '#9ca3af',
    fontSize: 15,
    flex: 1,
  },
  alert: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#2a1f12',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  alertTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  alertText: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#101622',
    borderTopWidth: 1,
    borderColor: '#1f2937',
  },
  applyBtn: {
    backgroundColor: '#135bec',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default InternshipDetailsScreen;
