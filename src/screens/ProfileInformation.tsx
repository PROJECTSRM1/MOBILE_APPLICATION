/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileInformation = () => {
  const [services, setServices] = useState({
    housing: true,
    education: true,
    marketplace: false,
    products: true,
    freelancer: false,
  });

  const toggleService = (key: keyof typeof services) => {
    setServices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile Settings</Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Row */}
          <View style={styles.profileRow}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300' }}
              style={styles.avatar}
            />

            <TouchableOpacity>
              <Text style={styles.loginText}>Login / Signup</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Customize Dashboard */}
          <Text style={styles.sectionTitle}>Customize Dashboard</Text>
          <Text style={styles.sectionDesc}>
            Toggle the services you want to see on your home screen.
          </Text>

          <ServiceItem
            title="Housing & Cleaning"
            desc="Maids, repairs, & cleaning"
            value={services.housing}
            onToggle={() => toggleService('housing')}
          />
          <ServiceItem
            title="Education"
            desc="Tutors, courses, & materials"
            value={services.education}
            onToggle={() => toggleService('education')}
          />
          <ServiceItem
            title="Buy / Sell / Rent"
            desc="Marketplace for locals"
            value={services.marketplace}
            onToggle={() => toggleService('marketplace')}
          />
          <ServiceItem
            title="Swachify Products"
            desc="Eco-friendly goods"
            value={services.products}
            onToggle={() => toggleService('products')}
          />
          <ServiceItem
            title="Freelancer"
            desc="Find gigs or hire talent"
            value={services.freelancer}
            onToggle={() => toggleService('freelancer')}
          />

          {/* General */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            General
          </Text>

          <View style={styles.listBox}>
            <ListItem label="Account Information" />
            <ListItem label="Notifications" />
            <ListItem label="Privacy Settings" />
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Version 2.4.0 (Build 1042)</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

/* ---------- Components ---------- */

const ServiceItem = ({
  title,
  desc,
  value,
  onToggle,
}: {
  title: string;
  desc: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.serviceCard}>
    <View style={{ flex: 1 }}>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDesc}>{desc}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#374151', true: '#135bec' }}
      thumbColor="#ffffff"
    />
  </View>
);

const ListItem = ({ label }: { label: string }) => (
  <TouchableOpacity style={styles.listItem}>
    <Text style={styles.listText}>{label}</Text>
    <Icon name="chevron-right" size={22} color="#9ca3af" />
  </TouchableOpacity>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101622',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#135bec',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60a5fa',
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2333',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  listBox: {
    backgroundColor: '#1c2333',
    borderRadius: 14,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b3448',
  },
  listText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 30,
  },
});

export default ProfileInformation;
