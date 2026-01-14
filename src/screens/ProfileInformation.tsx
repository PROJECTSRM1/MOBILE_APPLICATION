import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

/* Enable layout animation on Android */
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const H_PADDING = 16;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

/* ================= TYPES ================= */
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  location?: string;
  degree?: string;
  institution?: string;
  percentage?: string;
  certificateName?: string;
  certificateIssuedBy?: string;
  certificateYear?: string;
  nocCertificateNumber?: string;
  nocPoliceStation?: string;
  nocIssueYear?: string;
  expertiseServices?: string[];
  yearsOfExperience?: string;
  additionalSkills?: string;
  drivingLicense?: boolean;
  availableHoursFrom?: string;
  availableHoursTo?: string;
}

type RootStackParamList = {
  AuthScreen: undefined;
  ProfileInformation: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileInformation: React.FC = () => {
  /* ================= NAVIGATION ================= */
  const navigation = useNavigation<NavigationProp>();
  /* ================= STATE ================= */
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [openBasic, setOpenBasic] = useState<boolean>(true);
  const [openEducation, setOpenEducation] = useState<boolean>(false);
  const [openCertificates, setOpenCertificates] = useState<boolean>(false);
  const [openNoc, setOpenNoc] = useState<boolean>(false);
  const [openExpertise, setOpenExpertise] = useState<boolean>(false);

  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('');
  const [certificateName, setCertificateName] = useState<string>('');
  const [certificateIssuedBy, setCertificateIssuedBy] = useState<string>('');
  const [certificateYear, setCertificateYear] = useState<string>('');
  const [nocCertificateNumber, setNocCertificateNumber] = useState<string>('');
  const [nocPoliceStation, setNocPoliceStation] = useState<string>('');
  const [nocIssueYear, setNocIssueYear] = useState<string>('');

  // Expertise fields
  const [expertiseServices, setExpertiseServices] = useState<string[]>(['UI Design', 'Web Dev']);
  const [newService, setNewService] = useState<string>('');
  const [showServiceInput, setShowServiceInput] = useState<boolean>(false);
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [additionalSkills, setAdditionalSkills] = useState<string>('');
  const [drivingLicense, setDrivingLicense] = useState<boolean>(true);
  const [availableHoursFrom, setAvailableHoursFrom] = useState<Date>(new Date());
  const [availableHoursTo, setAvailableHoursTo] = useState<Date>(new Date());
  const [showFromPicker, setShowFromPicker] = useState<boolean>(false);
  const [showToPicker, setShowToPicker] = useState<boolean>(false);

  const [services, setServices] = useState<{
    housing: boolean;
    education: boolean;
  }>({
    housing: true,
    education: true,
  });

  /* ================= LOAD USER DATA ================= */
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userProfile');

      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsed: UserProfile = JSON.parse(storedUser);
      setUser(parsed);

      // Populate form fields with stored data
      setPhone(parsed.mobile ?? '');
      setLocation(parsed.location ?? '');
      setDegree(parsed.degree ?? '');
      setInstitution(parsed.institution ?? '');
      setPercentage(parsed.percentage ?? '');
      setCertificateName(parsed.certificateName ?? '');
      setCertificateIssuedBy(parsed.certificateIssuedBy ?? '');
      setCertificateYear(parsed.certificateYear ?? '');
      setNocCertificateNumber(parsed.nocCertificateNumber ?? '');
      setNocPoliceStation(parsed.nocPoliceStation ?? '');
      setNocIssueYear(parsed.nocIssueYear ?? '');
      setExpertiseServices(parsed.expertiseServices ?? ['UI Design', 'Web Dev']);
      setYearsOfExperience(parsed.yearsOfExperience ?? '');
      setAdditionalSkills(parsed.additionalSkills ?? '');
      setDrivingLicense(parsed.drivingLicense ?? true);
      
      if (parsed.availableHoursFrom) {
        const [hours, minutes] = parsed.availableHoursFrom.split(':');
        const fromDate = new Date();
        fromDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        setAvailableHoursFrom(fromDate);
      }
      
      if (parsed.availableHoursTo) {
        const [hours, minutes] = parsed.availableHoursTo.split(':');
        const toDate = new Date();
        toDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        setAvailableHoursTo(toDate);
      }
    } catch (err) {
      console.log('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE USER DATA ================= */
  const saveUserData = async () => {
    if (!user) return;

    try {
      const updatedUser: UserProfile = {
        ...user,
        mobile: phone,
        location: location,
        degree: degree,
        institution: institution,
        percentage: percentage,
        certificateName: certificateName,
        certificateIssuedBy: certificateIssuedBy,
        certificateYear: certificateYear,
        nocCertificateNumber: nocCertificateNumber,
        nocPoliceStation: nocPoliceStation,
        nocIssueYear: nocIssueYear,
        expertiseServices: expertiseServices,
        yearsOfExperience: yearsOfExperience,
        additionalSkills: additionalSkills,
        drivingLicense: drivingLicense,
        availableHoursFrom: formatTime(availableHoursFrom),
        availableHoursTo: formatTime(availableHoursTo),
      };

      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedUser));
      setUser(updatedUser);
      Alert.alert('Success', 'Profile Edited successfully!');
    } catch (err) {
      console.log('Save error:', err);
      Alert.alert('Error', 'Failed to save profile data.');
    }
  };

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

  const addService = () => {
    if (newService.trim()) {
      setExpertiseServices([...expertiseServices, newService.trim()]);
      setNewService('');
      setShowServiceInput(false);
    }
  };

  const removeService = (index: number) => {
    setExpertiseServices(expertiseServices.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthScreen' }],
              });
            } catch (error) {
              console.log('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
    );
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  /* ================= NO USER STATE ================= */
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>
          No user data found. Please login again.
        </Text>
      </SafeAreaView>
    );
  }

  /* ================= MAIN UI ================= */
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
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            <TouchableOpacity onPress={saveUserData}>
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
            <Field label="Degree">
              <TextInput
                style={styles.input}
                value={degree}
                onChangeText={setDegree}
                placeholder="e.g. B.Tech Computer Science"
                placeholderTextColor="#6b7280"
              />
            </Field>

            <Field label="Institution">
              <TextInput
                style={styles.input}
                value={institution}
                onChangeText={setInstitution}
                placeholder="e.g. Stanford University"
                placeholderTextColor="#6b7280"
              />
            </Field>

            <Field label="Percentage">
              <TextInput
                style={styles.input}
                value={percentage}
                onChangeText={setPercentage}
                placeholder="e.g. 85%"
                placeholderTextColor="#6b7280"
              />
            </Field>
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
            <Field label="Certificate Name">
              <TextInput
                style={styles.input}
                value={certificateName}
                onChangeText={setCertificateName}
                placeholder="e.g. Project Management Professional"
                placeholderTextColor="#6b7280"
              />
            </Field>

            <Field label="Issued By">
              <TextInput
                style={styles.input}
                value={certificateIssuedBy}
                onChangeText={setCertificateIssuedBy}
                placeholder="e.g. PMI"
                placeholderTextColor="#6b7280"
              />
            </Field>

            <Field label="Year">
              <TextInput
                style={styles.input}
                value={certificateYear}
                onChangeText={setCertificateYear}
                placeholder="e.g. 2023"
                placeholderTextColor="#6b7280"
              />
            </Field>
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
            <Field label="Certificate Number">
              <TextInput
                style={styles.input}
                value={nocCertificateNumber}
                onChangeText={setNocCertificateNumber}
                placeholder="Enter certificate number"
                placeholderTextColor="#6b7280"
              />
            </Field>

            <Field label="Near Police Station">
              <TextInput
                style={styles.input}
                value={nocPoliceStation}
                onChangeText={setNocPoliceStation}
                placeholder="Enter police station"
                placeholderTextColor="#6b7280"
              />
            </Field>

            <Field label="Issue Year">
              <TextInput
                style={styles.input}
                value={nocIssueYear}
                onChangeText={setNocIssueYear}
                placeholder="e.g. 2024"
                placeholderTextColor="#6b7280"
              />
            </Field>
          </Card>
        )}

        {/* FREELANCER/EMPLOYEE EXPERTISE */}
        <SectionHeader
          title="Freelancer/Employee Expertise"
          open={openExpertise}
          onPress={() => toggleSection(setOpenExpertise)}
        />
        {openExpertise && (
          <Card>
            <Field label="SERVICES WITH EXPERTISE">
              <View style={styles.servicesContainer}>
                {expertiseServices.map((service, index) => (
                  <View key={index} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>{service}</Text>
                    <TouchableOpacity onPress={() => removeService(index)}>
                      <Icon name="close" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                ))}
                {showServiceInput ? (
                  <View style={styles.addServiceInputContainer}>
                    <TextInput
                      style={styles.addServiceInput}
                      value={newService}
                      onChangeText={setNewService}
                      placeholder="Service name"
                      placeholderTextColor="#6b7280"
                      autoFocus
                      onSubmitEditing={addService}
                    />
                    <TouchableOpacity onPress={addService}>
                      <Icon name="check" size={20} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.addServiceBtn}
                    onPress={() => setShowServiceInput(true)}
                  >
                    <Icon name="add" size={16} color="#3b82f6" />
                    <Text style={styles.addServiceText}>Add Service</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Field>

            <Field label="YEARS OF EXPERIENCE">
              <TextInput
                style={styles.input}
                value={yearsOfExperience}
                onChangeText={setYearsOfExperience}
                placeholder="e.g. 5"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
              />
            </Field>

            <Field label="ADDITIONAL SKILLS">
              <TextInput
                style={[styles.input, styles.textArea]}
                value={additionalSkills}
                onChangeText={setAdditionalSkills}
                placeholder="Describe your specialized skills..."
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </Field>

            <Field label="DRIVING LICENSE">
              <View style={styles.radioGroup}>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setDrivingLicense(true)}
                >
                  <View style={styles.radioCircle}>
                    {drivingLicense && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setDrivingLicense(false)}
                >
                  <View style={styles.radioCircle}>
                    {!drivingLicense && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
              </View>
            </Field>

            <Field label="AVAILABLE HOURS">
              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>FROM</Text>
                  <TouchableOpacity 
                    style={styles.timeInput}
                    onPress={() => setShowFromPicker(true)}
                  >
                    <Text style={styles.timeText}>{formatTime(availableHoursFrom)}</Text>
                    <Icon name="access-time" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>TO</Text>
                  <TouchableOpacity 
                    style={styles.timeInput}
                    onPress={() => setShowToPicker(true)}
                  >
                    <Text style={styles.timeText}>{formatTime(availableHoursTo)}</Text>
                    <Icon name="access-time" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </Field>
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

        {/* GENERAL */}
        <View style={styles.sectionHeaderNoIcon}>
          <Text style={styles.sectionTitle}>General</Text>
        </View>
        <Card noPadding>
          <GeneralItem icon="person" label="Account Information" />
          <GeneralItem icon="notifications" label="Notifications" />
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 2.4.0 (Build 1042)</Text>
      </ScrollView>

      {/* TIME PICKERS */}
      {showFromPicker && (
        <DateTimePicker
          value={availableHoursFrom}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowFromPicker(false);
            if (selectedDate) {
              setAvailableHoursFrom(selectedDate);
            }
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={availableHoursTo}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowToPicker(false);
            if (selectedDate) {
              setAvailableHoursTo(selectedDate);
            }
          }}
        />
      )}
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
        false: '#374151',
        true: '#2563eb',
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
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
  },

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
  textArea: {
    height: 100,
    paddingTop: 12,
  },

  // Services with expertise
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  serviceChipText: {
    color: '#3b82f6',
    fontSize: 13,
  },
  addServiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addServiceText: {
    color: '#3b82f6',
    fontSize: 13,
  },
  addServiceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
    flex: 1,
  },
  addServiceInput: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    padding: 0,
  },

  // Radio buttons
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  radioText: {
    color: '#fff',
    fontSize: 14,
  },

  // Time inputs
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  timeLabel: {
    color: '#9ca3af',
    fontSize: 10,
    marginBottom: 6,
  },
  // ⚠️ NOTHING REMOVED — ONLY COMPLETED

  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  /* ================= CUSTOMIZE DASHBOARD ================= */

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2333',
    marginHorizontal: H_PADDING,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59,130,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  /* ================= GENERAL ================= */

  generalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  generalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  generalText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  /* ================= LOGOUT ================= */

  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    marginHorizontal: H_PADDING,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },

  version: {
    color: '#6b7280',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 30,
  },
});
export default ProfileInformation;