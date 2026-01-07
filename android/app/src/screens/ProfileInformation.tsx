import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path, Circle } from 'react-native-svg';

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
    <SafeAreaView style={styles.container}>
      {/* HEADER WITH BACK ARROW */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
            <LeftArrowIcon />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>

        {/* Spacer to keep title centered */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE SECTION */}
        <View style={styles.profileRow}>
          {/* Default Avatar (Male/Female style) */}
          <View style={styles.avatarWrapper}>
            <DefaultAvatar />
          </View>

          {/* Login / Signup (UNCHANGED) */}
          <TouchableOpacity style={styles.loginTextOnly}>
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
          icon={<HomeIcon />}
          title="Housing & Cleaning"
          desc="Maids, repairs, & cleaning"
          value={services.housing}
          onToggle={() => toggleService('housing')}
        />
        <ServiceItem
          icon={<EducationIcon />}
          title="Education"
          desc="Tutors, courses, & materials"
          value={services.education}
          onToggle={() => toggleService('education')}
        />
        <ServiceItem
          icon={<StoreIcon />}
          title="Buy / Sell / Rent"
          desc="Marketplace for locals"
          value={services.marketplace}
          onToggle={() => toggleService('marketplace')}
        />
        <ServiceItem
          icon={<RecycleIcon />}
          title="Swachify Products"
          desc="Eco-friendly goods"
          value={services.products}
          onToggle={() => toggleService('products')}
        />
        <ServiceItem
          icon={<WorkIcon />}
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

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 2.4.0 (Build 1042)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------- DEFAULT AVATAR (MAN/WOMAN STYLE) ---------- */

const DefaultAvatar = () => (
  <Svg width={48} height={48} viewBox="0 0 64 64">
    <Circle cx="32" cy="32" r="32" fill="#1e293b" />
    <Circle cx="32" cy="24" r="10" fill="#9ca3af" />
    <Path
      d="M12 56c0-11 9-18 20-18s20 7 20 18"
      fill="#9ca3af"
    />
  </Svg>
);

/* ---------- SERVICE ITEM ---------- */

const ServiceItem = ({ icon, title, desc, value, onToggle }: any) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceLeft}>
      <View style={styles.iconBox}>{icon}</View>
      <View>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDesc}>{desc}</Text>
      </View>
    </View>

    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#374151', true: '#2563eb' }}
      thumbColor="#ffffff"
    />
  </View>
);

const ListItem = ({ label }: { label: string }) => (
  <TouchableOpacity style={styles.listItem}>
    <Text style={styles.listText}>{label}</Text>
    <RightArrowIcon />
  </TouchableOpacity>
);

/* ---------- SVG ICONS ---------- */

const HomeIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill="#2563eb" d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3z" />
  </Svg>
);

const EducationIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill="#2563eb" d="M12 3L1 9l11 6 9-4.91V17h2V9z" />
  </Svg>
);

const StoreIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill="#2563eb" d="M4 4h16l-2 7H6zM6 13h12v7H6z" />
  </Svg>
);

const RecycleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill="#2563eb" d="M12 2l4 7h-3l-1.5-3L10 9H7z" />
  </Svg>
);

const WorkIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill="#2563eb" d="M4 7h16v12H4zM9 4h6v3H9z" />
  </Svg>
);

const RightArrowIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M9 6l6 6-6 6"
      fill="none"
      stroke="#6b7280"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LeftArrowIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M15 18l-6-6 6-6"
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);



/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
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
    gap: 14,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c2333',
  },

  loginTextOnly: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
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
  },
  sectionDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c2333',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#223055',
    alignItems: 'center',
    justifyContent: 'center',
  },

  serviceTitle: {
    color: '#ffffff',
    fontWeight: '700',
  },
  serviceDesc: {
    color: '#9ca3af',
    fontSize: 12,
  },

  listBox: {
    backgroundColor: '#1c2333',
    borderRadius: 14,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b3448',
  },
  listText: {
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
  backArrow: {
  fontSize: 27,
  color: '#ffffff',
  fontWeight: '600',
  
},

});

export default ProfileInformation;
