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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile Settings</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={styles.avatar}
          />

          <View style={styles.flexOne}>
            <Text style={styles.name}>Jane Doe</Text>
            <Text style={styles.email}>jane.doe@superapp.com</Text>
            <TouchableOpacity>
              <Text style={styles.edit}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customize Dashboard */}
        <Text style={styles.sectionTitle}>Customize Dashboard</Text>
        <Text style={styles.sectionDesc}>
          Toggle the services you want to see on your home screen.
        </Text>

        <ServiceItem
          icon="home"
          title="Housing & Cleaning"
          desc="Maids, repairs, & cleaning"
          value={services.housing}
          onToggle={() => toggleService('housing')}
        />
        <ServiceItem
          icon="school"
          title="Education"
          desc="Tutors, courses, & materials"
          value={services.education}
          onToggle={() => toggleService('education')}
        />
        <ServiceItem
          icon="store"
          title="Buy / Sell / Rent"
          desc="Marketplace for locals"
          value={services.marketplace}
          onToggle={() => toggleService('marketplace')}
        />
        <ServiceItem
          icon="recycling"
          title="Swachify Products"
          desc="Eco-friendly goods"
          value={services.products}
          onToggle={() => toggleService('products')}
        />
        <ServiceItem
          icon="work"
          title="Freelancer"
          desc="Find gigs or hire talent"
          value={services.freelancer}
          onToggle={() => toggleService('freelancer')}
        />

        {/* General */}
        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
          General
        </Text>

        <View style={styles.listBox}>
          <ListItem icon="person" label="Account Information" />
          <ListItem icon="notifications" label="Notifications" />
          <ListItem icon="lock" label="Privacy Settings" />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 2.4.0 (Build 1042)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------- Components ---------- */

const ServiceItem = ({
  icon,
  title,
  desc,
  value,
  onToggle,
}: {
  icon: string;
  title: string;
  desc: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceIconBox}>
      <Icon name={icon} size={22} color="#3b82f6" />
    </View>

    <View style={styles.flexOne}>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDesc}>{desc}</Text>
    </View>

    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#374151', true: '#2563eb' }}
      thumbColor="#fff"
    />
  </View>
);

const ListItem = ({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) => (
  <TouchableOpacity style={styles.listItem}>
    <View style={styles.listLeft}>
      <Icon name={icon} size={20} color="#9ca3af" />
      <Text style={styles.listText}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={22} color="#6b7280" />
  </TouchableOpacity>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101622',
    paddingTop: StatusBar.currentHeight,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  flexOne: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  edit: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },

  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginHorizontal: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  sectionSpacing: {
    marginTop: 24,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2333',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  serviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },

  listBox: {
    backgroundColor: '#1c2333',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    marginHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b3448',
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },

  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    alignItems: 'center',
    marginHorizontal: 16,
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
