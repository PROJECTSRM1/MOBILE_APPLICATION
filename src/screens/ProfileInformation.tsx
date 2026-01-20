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
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { getLightMode, setLightMode } from "../utils/theme";
import { useTheme } from "../context/ThemeContext";

// const { lightMode, toggleTheme } = useTheme();


const { width } = Dimensions.get('window');

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

interface MarketplaceListing {
  id: string;
  type: 'buy' | 'rent';
  propertyType: string;
  price: string;
  images?: string[];
  area?: string;
  bhk?: string;
  sqft?: string;
  landType?: string;
  brand?: string;
  model?: string;
  year?: string;
  createdAt?: string;
}

interface SwachifyProduct {
  id: string;
  title: string;
  price: string;
  image?: string;
  category: string;
  createdAt?: string;
}

type RootStackParamList = {
  AuthScreen: undefined;
  ProfileInformation: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileInformation: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  // const { lightMode, toggleTheme } = useTheme();
  const { lightMode, toggleTheme, colors } = useTheme();
  const styles = getStyles(colors);
  const Divider = () => <View style={styles.divider} />;

  const SectionHeader = ({
    title,
    open,
    onPress,
  }: {
    title: string;
    open: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={onPress}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Icon
        name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
        size={24}
        color={colors.subText}
      />
    </TouchableOpacity>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.card}>{children}</View>
  );

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );

  const ServiceItem = ({
    icon,
    title,
    value,
    onToggle,
  }: {
    icon: string;
    title: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceLeft}>
        <Icon name={icon} size={24} color={colors.primary} />
        <Text style={styles.serviceTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: colors.border,
          true: colors.primary + "80",
        }}
        thumbColor={value ? colors.primary : colors.subText}
      />
    </View>
  );


  /* ================= STATE ================= */
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [openBasic, setOpenBasic] = useState<boolean>(true);
  const [openEducation, setOpenEducation] = useState<boolean>(false);
  const [openCertificates, setOpenCertificates] = useState<boolean>(false);
  const [openNoc, setOpenNoc] = useState<boolean>(false);
  const [openExpertise, setOpenExpertise] = useState<boolean>(false);
  const [openMarketplace, setOpenMarketplace] = useState<boolean>(false);
  const [openSwachify, setOpenSwachify] = useState<boolean>(false);

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

  // Marketplace & Swachify
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([]);
  const [swachifyProducts, setSwachifyProducts] = useState<SwachifyProduct[]>([]);

  const [services, setServices] = useState<{
    housing: boolean;
    education: boolean;
    marketplace: boolean;
    swachify: boolean;
  }>({
    housing: true,
    education: true,
    marketplace: true,
    swachify: true,
  });
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
const [openWishlist, setOpenWishlist] = useState<boolean>(false);





  /* ================= LOAD USER DATA ================= */
 useEffect(() => {
  loadUserFromStorage();
  loadMarketplaceListings();
  loadSwachifyProducts();
  loadServicePreferences();
  loadWishlist();
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

  const loadMarketplaceListings = async () => {
    try {
      const storedListings = await AsyncStorage.getItem('marketplace_listings');
      if (storedListings) {
        const listings = JSON.parse(storedListings);
        setMarketplaceListings(listings);
      }
    } catch (error) {
      console.error('Error loading marketplace listings:', error);
    }
  };

  const loadSwachifyProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('swachify_products');
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        setSwachifyProducts(products);
      }
    } catch (error) {
      console.error('Error loading swachify products:', error);
    }
  };

  const loadServicePreferences = async () => {
    try {
      const storedServices = await AsyncStorage.getItem('service_preferences');
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      }
    } catch (error) {
      console.error('Error loading service preferences:', error);
    }
  };

  const loadWishlist = async () => {
  try {
    const storedWishlist = await AsyncStorage.getItem("wishlist_items");
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  } catch (error) {
    console.log("Error loading wishlist:", error);
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
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.log('Save error:', err);
      Alert.alert('Error', 'Failed to save profile data.');
    }
  };

  /* ================= DELETE FUNCTIONS ================= */
  const deleteMarketplaceListing = async (id: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedListings = marketplaceListings.filter(item => item.id !== id);
              await AsyncStorage.setItem('marketplace_listings', JSON.stringify(updatedListings));
              setMarketplaceListings(updatedListings);
              Alert.alert('Success', 'Listing deleted successfully!');
            } catch (error) {
              console.error('Error deleting listing:', error);
              Alert.alert('Error', 'Failed to delete listing.');
            }
          },
        },
      ],
    );
  };

  const deleteSwachifyProduct = async (id: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedProducts = swachifyProducts.filter(item => item.id !== id);
              await AsyncStorage.setItem('swachify_products', JSON.stringify(updatedProducts));
              setSwachifyProducts(updatedProducts);
              Alert.alert('Success', 'Product deleted successfully!');
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product.');
            }
          },
        },
      ],
    );
  };

  /* ================= HELPERS ================= */
  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter((prev: boolean) => !prev);
  };

  const toggleService = async (key: keyof typeof services) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newServices = { ...services, [key]: !services[key] };
    setServices(newServices);
    
    // Save preferences to AsyncStorage
    try {
      await AsyncStorage.setItem('service_preferences', JSON.stringify(newServices));
    } catch (error) {
      console.error('Error saving service preferences:', error);
    }
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

  const getListingTitle = (listing: MarketplaceListing): string => {
    if (['Apartment', 'Villa', 'Independent House'].includes(listing.propertyType)) {
      return `${listing.bhk || ''} ${listing.propertyType} in ${listing.area || 'Unknown'}`;
    } else if (listing.propertyType === 'Land') {
      return `${listing.landType || ''} Land in ${listing.area || 'Unknown'}`;
    } else if (['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(listing.propertyType)) {
      return `${listing.brand || ''} ${listing.model || ''} ${listing.year || ''}`.trim();
    } else {
      return `${listing.propertyType} in ${listing.area || 'Unknown'}`;
    }
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
    <SafeAreaView style={styles.safeArea }>
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

       {/* WISHLIST HEADER */}
    <TouchableOpacity
  style={styles.serviceItem}
  onPress={() => navigation.navigate("Wishlist")}
>
  <View style={styles.serviceLeft}>
    <Icon name="favorite" size={24} color="#ef4444" />
    <Text style={styles.serviceTitle}>
      Wishlist ({wishlistItems.length})
    </Text>
  </View>

  <Icon
    name="chevron-right"
    size={24}
    color={colors.subText}
  />
</TouchableOpacity>



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
        
        {/* MARKETPLACE SERVICE ITEM */}
        <ServiceItem
          icon="store"
          title="Marketplace"
          value={services.marketplace}
          onToggle={() => toggleService('marketplace')}
        />

        {/* MARKETPLACE LISTINGS - Only show when marketplace is enabled */}
        {services.marketplace && (
          <>
            <SectionHeader
              title={`My Marketplace Listings (${marketplaceListings.length})`}
              open={openMarketplace}
              onPress={() => toggleSection(setOpenMarketplace)}
            />
            {openMarketplace && (
              <Card>
                {marketplaceListings.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Icon name="store" size={48} color="#374151" />
                    <Text style={styles.emptyText}>No listings yet</Text>
                    <Text style={styles.emptySubtext}>Your marketplace posts will appear here</Text>
                  </View>
                ) : (
                  <View style={styles.listingsGrid}>
                    {marketplaceListings.map((listing) => (
                      <View key={listing.id} style={styles.listingCard}>
                        <Image 
                          source={{ uri: listing.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500' }} 
                          style={styles.listingImage}
                        />
                        <View style={styles.listingContent}>
                          <View style={styles.listingBadge}>
                            <Text style={styles.listingBadgeText}>
                              {listing.type.toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.listingTitle} numberOfLines={1}>
                            {getListingTitle(listing)}
                          </Text>
                          <Text style={styles.listingPrice}>
                            ₹{parseFloat(listing.price).toLocaleString('en-IN')}
                          </Text>
                          <View style={styles.listingDetails}>
                            {listing.sqft && (
                              <View style={styles.listingDetail}>
                                <Icon name="square-foot" size={12} color="#6b7280" />
                                <Text style={styles.listingDetailText}>{listing.sqft} sqft</Text>
                              </View>
                            )}
                            {listing.bhk && (
                              <View style={styles.listingDetail}>
                                <Icon name="bed" size={12} color="#6b7280" />
                                <Text style={styles.listingDetailText}>{listing.bhk}</Text>
                              </View>
                            )}
                          </View>
                          <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => deleteMarketplaceListing(listing.id)}
                          >
                            <Icon name="delete" size={18} color="#ef4444" />
                            <Text style={styles.deleteButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            )}
          </>
        )}

        {/* SWACHIFY SERVICE ITEM */}
        <ServiceItem
          icon="eco"
          title="Swachify"
          value={services.swachify}
          onToggle={() => toggleService('swachify')}
        />

        {/* SWACHIFY PRODUCTS - Only show when swachify is enabled */}
        {services.swachify && (
          <>
            <SectionHeader
              title={`My Swachify Products (${swachifyProducts.length})`}
              open={openSwachify}
              onPress={() => toggleSection(setOpenSwachify)}
            />
            {openSwachify && (
              <Card>
                {swachifyProducts.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Icon name="eco" size={48} color="#374151" />
                    <Text style={styles.emptyText}>No products yet</Text>
                    <Text style={styles.emptySubtext}>Your Swachify products will appear here</Text>
                  </View>
                ) : (
                  <View style={styles.listingsGrid}>
                    {swachifyProducts.map((product) => (
  <View key={product.id} style={styles.listingCard}>
    <Image 
      source={{ uri: product.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500' }} 
      style={styles.listingImage}
    />
    <View style={styles.listingContent}>
      <View style={[styles.listingBadge, styles.swachifyBadge]}>
        <Text style={styles.listingBadgeText}>
          {product.category.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.listingTitle} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.listingPrice}>
        {product.price && !isNaN(parseFloat(product.price)) 
          ? parseFloat(product.price).toLocaleString('en-IN')
          : product.price || '0'}
      </Text>
                          <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => deleteSwachifyProduct(product.id)}
                          >
                            <Icon name="delete" size={18} color="#ef4444" />
                            <Text style={styles.deleteButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            )}
          </>
        )}

        <Divider />
        <View style={styles.serviceItem}>
  <View style={styles.serviceLeft}>
    <Icon name="light-mode" size={24} color="#facc15" />
    <Text style={styles.serviceTitle}>Light Mode</Text>
  </View>

  <Switch
    value={lightMode}
    onValueChange={toggleTheme}
    trackColor={{ false: "#374151", true: "#fde68a" }}
    thumbColor={lightMode ? "#facc15" : "#9ca3af"}
  />
</View>


        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

/* ================= HELPER COMPONENTS ================= */



const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    loadingText: {
      color: colors.text,
      fontSize: 16,
      textAlign: "center",
      marginTop: 100,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: H_PADDING,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerIcon: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },

    profileRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: H_PADDING,
      backgroundColor: colors.surface,
    },

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 16,
    },

    flexOne: {
      flex: 1,
    },

    name: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },

    email: {
      fontSize: 14,
      color: colors.subText,
      marginBottom: 8,
    },

    edit: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },

    divider: {
      height: 8,
      backgroundColor: colors.background,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: H_PADDING,
      paddingVertical: 16,
      backgroundColor: colors.surface,
    },

    sectionHeaderNoIcon: {
      paddingHorizontal: H_PADDING,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: colors.surface,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    sectionDesc: {
      fontSize: 13,
      color: colors.subText,
      paddingHorizontal: H_PADDING,
      paddingBottom: 12,
      backgroundColor: colors.surface,
    },

    card: {
      backgroundColor: colors.surface,
      paddingHorizontal: H_PADDING,
      paddingBottom: 16,
    },

    field: {
      marginBottom: 20,
    },

    fieldLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.subText,
      marginBottom: 8,
      letterSpacing: 0.5,
    },

    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },

    textArea: {
      minHeight: 100,
      paddingTop: 12,
    },

    servicesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    serviceChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.primary,
    },

    serviceChipText: {
      color: colors.text,
      fontSize: 14,
    },

    addServiceInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 4,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },

    addServiceInput: {
      color: colors.text,
      fontSize: 14,
      minWidth: 100,
      padding: 4,
    },

    addServiceBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 4,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: "dashed",
    },

    addServiceText: {
      color: colors.primary,
      fontSize: 14,
    },

    radioGroup: {
      flexDirection: "row",
      gap: 24,
    },

    radioOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    radioSelected: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },

    radioText: {
      color: colors.text,
      fontSize: 15,
    },

    timeRow: {
      flexDirection: "row",
      gap: 12,
    },

    timeField: {
      flex: 1,
    },

    timeLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subText,
      marginBottom: 6,
      letterSpacing: 0.5,
    },

    timeInput: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    timeText: {
      color: colors.text,
      fontSize: 15,
    },

    serviceItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: H_PADDING,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    serviceLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    serviceTitle: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "500",
    },

    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
    },

    emptyText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.subText,
      marginTop: 16,
    },

    emptySubtext: {
      fontSize: 13,
      color: colors.subText,
      marginTop: 4,
    },

    listingsGrid: {
      gap: 16,
    },

    listingCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },

    listingImage: {
      width: "100%",
      height: 300,
      backgroundColor: colors.border,
    },

    listingContent: {
      padding: 12,
    },

    listingBadge: {
      backgroundColor: colors.primary + "20",
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: "flex-start",
      marginBottom: 8,
    },

    swachifyBadge: {
      backgroundColor: "#10b98120",
    },

    listingBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 0.5,
    },

    listingTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 6,
    },

    listingPrice: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 8,
    },

    listingDetails: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    },

    listingDetail: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    listingDetailText: {
      fontSize: 12,
      color: colors.subText,
    },

    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.danger + "20",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.danger + "40",
    },

    deleteButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.danger,
    },

    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginHorizontal: H_PADDING,
      marginTop: 24,
      paddingVertical: 14,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.danger,
    },

    logoutText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.danger,
    },
  });


export default ProfileInformation