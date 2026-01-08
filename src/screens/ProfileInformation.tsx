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
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/* Enable layout animation on Android */
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const H_PADDING = 16;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

const ProfileInformation: React.FC = () => {
  /* ================= HOOKS ================= */
  const [openBasic, setOpenBasic] = useState<boolean>(true);
  const [openEducation, setOpenEducation] = useState<boolean>(false);
  const [openCertificates, setOpenCertificates] = useState<boolean>(false);
  const [openNoc, setOpenNoc] = useState<boolean>(false);

  const [phone, setPhone] = useState<string>('+1 (555) 123-4567');
  const [location, setLocation] = useState<string>('San Francisco, CA');

  const [services, setServices] = useState<{
    housing: boolean;
    education: boolean;
    marketplace: boolean;
    products: boolean;
    freelancer: boolean;
  }>({
    housing: true,
    education: true,
    marketplace: false,
    products: true,
    freelancer: false,
  });

  /* ================= HELPERS ================= */
  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter((prev: boolean) => !prev);
  };

  const toggleService = (key: keyof typeof services) => {
    setServices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE */}
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

        <Divider />

        {/* BASIC INFORMATION */}
        <SectionHeader
          title="Basic Information"
          open={openBasic}
          onPress={() => toggleSection(setOpenBasic)}
        />
        {openBasic && (
          <Card>
            <Field label="Phone Number">
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
              />
            </Field>

            <Field label="Location">
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="San Francisco, CA"
                placeholderTextColor="#6b7280"
              />
            </Field>
          </Card>
        )}

        {/* EDUCATION */}
        <SectionHeader
          title="Education Qualification"
          open={openEducation}
          onPress={() => toggleSection(setOpenEducation)}
        />
        {openEducation && (
          <Card>
            <Input label="Degree" placeholder="e.g. B.Tech Computer Science" />
            <Input label="Institution" placeholder="e.g. Stanford University" />
            <Input label="Percentage" placeholder="e.g. 85%" />
          </Card>
        )}

        {/* CERTIFICATES */}
        <SectionHeader
          title="Certificates"
          open={openCertificates}
          onPress={() => toggleSection(setOpenCertificates)}
        />
        {openCertificates && (
          <Card>
            <Input
              label="Certificate Name"
              placeholder="e.g. Project Management Professional"
            />
            <Input label="Issued By" placeholder="e.g. PMI" />
            <Input label="Year" placeholder="e.g. 2023" />
          </Card>
        )}

        {/* NOC */}
        <SectionHeader
          title="NOC Details"
          open={openNoc}
          onPress={() => toggleSection(setOpenNoc)}
        />
        {openNoc && (
          <Card>
            <Input
              label="Certificate Number"
              placeholder="Enter certificate number"
            />
            <Input
              label="Near Police Station"
              placeholder="Enter police station"
            />
            <Input label="Issue Year" placeholder="e.g. 2024" />
          </Card>
        )}

        <Divider />

        {/* CUSTOMIZE DASHBOARD */}
        <View style={styles.sectionHeaderNoIcon}>
          <Text style={styles.sectionTitle}>Customize Dashboard</Text>
        </View>
        <Text style={styles.sectionDesc}>
          Toggle the services you want to see on your home screen.
        </Text>

        <ServiceItem
          icon="home"
          title="Housing & Cleaning"
          value={services.housing}
          onToggle={() => toggleService('housing')}
        />
        <ServiceItem
          icon="school"
          title="Education"
          value={services.education}
          onToggle={() => toggleService('education')}
        />
        <ServiceItem
          icon="store"
          title="Buy / Sell / Rent"
          value={services.marketplace}
          onToggle={() => toggleService('marketplace')}
        />
        <ServiceItem
          icon="recycling"
          title="Swachify Products"
          value={services.products}
          onToggle={() => toggleService('products')}
        />
        <ServiceItem
          icon="work"
          title="Freelancer"
          value={services.freelancer}
          onToggle={() => toggleService('freelancer')}
        />

        {/* GENERAL */}
        <View style={styles.sectionHeaderNoIcon}>
          <Text style={styles.sectionTitle}>General</Text>
        </View>
        <Card noPadding>
          <GeneralItem icon="person" label="Account Information" />
          <GeneralItem icon="notifications" label="Notifications" />
          <GeneralItem icon="lock" label="Privacy Settings" />
        </Card>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 2.4.0 (Build 1042)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ================= PURE UI COMPONENTS ================= */

const Divider = () => <View style={styles.divider} />;

const SectionHeader: React.FC<{
  title: string;
  open: boolean;
  onPress: () => void;
}> = ({ title, open, onPress }) => (
  <TouchableOpacity style={styles.sectionHeader} onPress={onPress}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Icon name={open ? 'remove' : 'add'} size={22} color="#3b82f6" />
  </TouchableOpacity>
);

const Card: React.FC<{ children: React.ReactNode; noPadding?: boolean }> = ({
  children,
  noPadding,
}) => (
  <View style={[styles.card, noPadding && styles.noPadding]}>{children}</View>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const Input: React.FC<{ label: string; placeholder: string }> = ({
  label,
  placeholder,
}) => (
  <Field label={label}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#6b7280"
    />
  </Field>
);

const ServiceItem: React.FC<{
  icon: string;
  title: string;
  value: boolean;
  onToggle: () => void;
}> = ({ icon, title, value, onToggle }) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceIcon}>
      <Icon name={icon} size={22} color="#3b82f6" />
    </View>
    <Text style={styles.serviceTitle}>{title}</Text>
    <Switch
  value={value}
  onValueChange={onToggle}
  trackColor={{
    false: '#374151', // dark gray (OFF)
    true: '#2563eb',  // blue (ON) – same as your icons
  }}
  thumbColor={value ? '#ffffff' : '#9ca3af'}
  ios_backgroundColor="#374151"
/>

  </View>
);

const GeneralItem: React.FC<{ icon: string; label: string }> = ({
  icon,
  label,
}) => (
  <TouchableOpacity style={styles.generalItem}>
    <View style={styles.generalLeft}>
      <Icon name={icon} size={20} color="#9ca3af" />
      <Text style={styles.generalText}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={22} color="#6b7280" />
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#101622' },
  flexOne: { flex: 1 },

  header: {
    height: 56 + STATUS_BAR_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: H_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: { width: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },

  profileRow: {
    flexDirection: 'row',
    padding: H_PADDING,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#2563eb',
    marginRight: 16,
  },
  name: { color: '#fff', fontSize: 18, fontWeight: '700' },
  email: { color: '#9ca3af', fontSize: 13 },
  edit: { color: '#3b82f6', marginTop: 6, fontWeight: '600' },

  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginHorizontal: H_PADDING,
    marginVertical: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    marginTop: 24,
    alignItems: 'center',
  },
  sectionHeaderNoIcon: {
    paddingHorizontal: H_PADDING,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sectionDesc: {
    color: '#9ca3af',
    fontSize: 12,
    paddingHorizontal: H_PADDING,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#1c2333',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: H_PADDING,
  },
  noPadding: { padding: 0 },

  field: { marginBottom: 14 },
  label: { color: '#9ca3af', fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
  },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2333',
    marginHorizontal: H_PADDING,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#111827',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceTitle: { color: '#fff', flex: 1 },

  generalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b3448',
  },
  generalLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  generalText: { color: '#fff', fontWeight: '500' },

  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    margin: H_PADDING,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '700' },

  version: {
    textAlign: 'center',
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 30,
  },
});

export default ProfileInformation;
