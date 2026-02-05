import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
  Animated,
  ActivityIndicator,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { Hospital } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// API Base URL - Update this with your actual base URL
const API_BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextAvailable: string;
  price: number;
  type: 'doctor';
  image: string;
  experience?: number;
  availableFrom?: string;
  availableTo?: string;
}

interface Hospital {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextAvailable: string;
  price: number;
  type: 'hospital' | 'clinic' | 'specialist center';
  image: string;
  location?: string;
  contactNumber?: string;
  status?: string;
  doctors?: Array<{
    id: string;
    name: string;
    specialty: string;
    rating: number;
    image: string;
  }>;
}

interface Lab {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextAvailable: string;
  price: number;
  type: 'lab';
  image: string;
  homeCollection?: boolean;
  distance?: number;
  status?: string;
  estimatedDelivery?: string;
}

interface Pharmacy {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextAvailable: string;
  price: number;
  type: 'store';
  image: string;
  pharmacyType?: string;
  services?: string;
  deliveryTime?: string;
  homeDelivery?: boolean;
  distance?: number;
  status?: string;
}

type ServiceItem = Doctor | Hospital | Lab | Pharmacy;

const DoctorListScreen = () => {
  const navigation = useNavigation<any>();

  // --- Dropdown States ---
  const [consultationType, setConsultationType] = useState('Online');
  const [showConsultationDropdown, setShowConsultationDropdown] = useState(false);
  const [serviceType, setServiceType] = useState('Doctor');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // --- API Data States ---
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  
  // --- Loading States ---
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- New States for functionality ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDoctorBookedModal, setShowDoctorBookedModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter States
  const [filterPriceRange, setFilterPriceRange] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterAvailability, setFilterAvailability] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('none');

  // Form States
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [wantsAmbulance, setWantsAmbulance] = useState<string | null>(null);
  const [pickupTime, setPickupTime] = useState('');
  const [ambulanceFieldLocked, setAmbulanceFieldLocked] = useState(false);

  // Time Picker States
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [selectedPickupTime, setSelectedPickupTime] = useState(new Date());
  const [showLabStoreModal, setShowLabStoreModal] = useState(false);
  const [isDelivery, setIsDelivery] = useState<boolean | null>(null);
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prescription, setPrescription] = useState<string | null>(null);
  const [customTimeModal, setCustomTimeModal] = useState(false);
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState<'AM' | 'PM'>('AM');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Auto-scroll state
  const scrollViewRef = useRef<ScrollView>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const scrollPosition = useRef(0);

  // Animation values
  const animatedPlaceholders = ['doctor', 'specialist', 'condition'];
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ==================== API FUNCTIONS ====================

  // Fetch Available Doctors
  const fetchDoctors = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/available-doctors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to match our interface
      const transformedDoctors: Doctor[] = data.map((doctor: any) => ({
        id: String(doctor.doctor_id),
        name: doctor.doctor_name,
        specialty: doctor.specialization_name,
        rating: doctor.rating || 0,
        nextAvailable: doctor.available_from && doctor.available_to 
          ? `${formatTimeFromAPI(doctor.available_from)} - ${formatTimeFromAPI(doctor.available_to)}`
          : 'Not Available',
        price: doctor.fees_per_hour || 0,
        type: 'doctor' as const,
        image: 'https://i.pravatar.cc/150?img=' + (doctor.doctor_id % 70),
        experience: doctor.experience_years,
        availableFrom: doctor.available_from,
        availableTo: doctor.available_to,
      }));

      setDoctors(transformedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setApiError('Failed to load doctors. Please try again.');
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Available Hospitals
  const fetchHospitals = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/available-hospitals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const transformedHospitals: Hospital[] = data.map((hospital: any) => ({
        id: String(hospital.hospital_id),
        name: hospital.hospital_name,
        specialty: hospital.specialty_type,
        rating: hospital.rating || 0,
        nextAvailable: hospital.hospital_status === 'OPEN' ? 'Open Now' : 'Open 24/7',
        price: hospital.fees_per_hour || 0,
        type: 'hospital' as const,
        image: require('../../assets/hospital1.jpg'),
        location: hospital.location,
        contactNumber: hospital.contact_number,
        status: hospital.hospital_status,
        doctors: [],
      }));

      setHospitals(transformedHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setApiError('Failed to load hospitals. Please try again.');
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Available Labs
  const fetchLabs = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/available-labs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const transformedLabs: Lab[] = data.map((lab: any) => ({
        id: String(lab.lab_id),
        name: lab.lab_name,
        specialty: lab.specialization_name || 'All Lab Tests',
        rating: lab.rating || 0,
        nextAvailable: lab.status === 'OPEN' 
          ? (lab.next_available || 'Available Now')
          : (lab.next_available || 'Currently Closed'),
        price: lab.fees_per_test || 0,
        type: 'lab' as const,
        image: require('../../assets/lab1.jpg'),
        homeCollection: lab.home_collection || false,
        distance: lab.distance_km,
        status: lab.status,
        estimatedDelivery: lab.estimated_delivery,
      }));

      setLabs(transformedLabs);
    } catch (error) {
      console.error('Error fetching labs:', error);
      setApiError('Failed to load labs. Please try again.');
      setLabs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Available Pharmacies
  const fetchPharmacies = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/available-pharmacies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const transformedPharmacies: Pharmacy[] = data.map((pharmacy: any) => ({
        id: String(pharmacy.pharmacy_id),
        name: pharmacy.pharmacy_name,
        specialty: pharmacy.services || 'Medicines & Healthcare',
        rating: pharmacy.rating || 0,
        nextAvailable: pharmacy.status === 'OPEN' 
          ? (pharmacy.next_available || 'Open Now')
          : (pharmacy.next_available || 'Currently Closed'),
        price: 0,
        type: 'store' as const,
        image: require('../../assets/med1.jpg'),
        pharmacyType: pharmacy.pharmacy_type,
        services: pharmacy.services,
        deliveryTime: pharmacy.delivery_time,
        homeDelivery: pharmacy.home_delivery || false,
        distance: pharmacy.distance_km,
        status: pharmacy.status,
      }));

      setPharmacies(transformedPharmacies);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setApiError('Failed to load pharmacies. Please try again.');
      setPharmacies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time from API
  const formatTimeFromAPI = (timeString: string) => {
    if (!timeString) return '';
    
    // Handle HH:MM:SS format
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0]);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    
    return timeString;
  };

  // ==================== EFFECTS ====================

  // Initial load - fetch doctors by default
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch data when service type changes
  useEffect(() => {
    if (consultationType === 'Online') {
      if (serviceType === 'Doctor') {
        fetchDoctors();
      } else if (serviceType === 'Labs') {
        fetchLabs();
      } else if (serviceType === 'Medical Store') {
        fetchPharmacies();
      } else if (serviceType === 'Complete Treatment') {
        fetchHospitals();
      }
    } else if (consultationType === 'Offline') {
      if (serviceType === 'Doctor' || serviceType === 'Complete Treatment') {
        fetchHospitals();
      } else if (serviceType === 'Labs') {
        fetchLabs();
      } else if (serviceType === 'Medical Store') {
        fetchPharmacies();
      }
    }
  }, [serviceType, consultationType]);

  useEffect(() => {
    if (!isSearchFocused && searchQuery === '') {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      
      const interval = setInterval(() => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: -20,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          setCurrentPlaceholderIndex((prev) => (prev + 1) % animatedPlaceholders.length);
          
          slideAnim.setValue(20);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, 2000);

      return () => clearInterval(interval);
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [isSearchFocused, searchQuery, fadeAnim, slideAnim]);

  const categories = [
    { id: 0, name: 'All', icon: 'grid-view', color: '#6366f1', bgColor: '#eef2ff', specialty: null },
    { id: 1, name: 'Heart', icon: 'favorite', color: '#2d7576', bgColor: '#e8f4f4', specialty: 'Cardiologist' },
    { id: 2, name: 'Skin', icon: 'healing', color: '#ea580c', bgColor: '#ffedd5', specialty: 'Dermatologist' },
    { id: 3, name: 'Mental', icon: 'psychology', color: '#2563eb', bgColor: '#dbeafe', specialty: 'Psychiatrist' },
    { id: 4, name: 'Eyes', icon: 'visibility', color: '#9333ea', bgColor: '#f3e8ff', specialty: 'Ophthalmologist' },
    { id: 5, name: 'Diet', icon: 'restaurant', color: '#16a34a', bgColor: '#dcfce7', specialty: 'Nutritionist' },
  ];

  const searchSuggestions =
    serviceType === 'Doctor'
      ? ['fever', 'cold', 'cough', 'skin', 'heart']
      : serviceType === 'Labs'
      ? ['blood test', 'x-ray', 'cbc']
      : serviceType === 'Medical Store'
      ? ['apollo pharmacy', 'medplus']
      : ['apollo', 'city hospital', 'clinic'];

  // Consultation type options
  const consultationOptions = ['Online', 'Offline'];

  // Service type options
  const serviceOptions = ['Doctor', 'Complete Treatment', 'Labs', 'Medical Store'];

  // Get filtered suggestions
  const getFilteredSuggestions = () => {
    if (searchQuery === '') return searchSuggestions;
    return searchSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredSuggestions = getFilteredSuggestions();

  // Get data based on consultation type and service type
const getAvailableData = (): ServiceItem[] => {
  // 🔹 OFFLINE MODE
  if (consultationType === 'Offline') {
    if (serviceType === 'Doctor') {
      // OFFLINE doctor → show SAME doctors list as online
      return doctors;
    }

    if (serviceType === 'Labs') return labs;
    if (serviceType === 'Medical Store') return pharmacies;
    if (serviceType === 'Complete Treatment') return hospitals;
  }

  // 🔹 ONLINE MODE
  if (consultationType === 'Online') {
    if (serviceType === 'Doctor') return doctors;
    if (serviceType === 'Labs') return labs;
    if (serviceType === 'Medical Store') return pharmacies;
    if (serviceType === 'Complete Treatment') return hospitals;
  }

  return [];
};

const isBookingAllowed = (item: ServiceItem) => {
  // ❌ Offline doctor list → NO booking
  if (consultationType === 'Offline' && serviceType === 'Doctor') {
    return false;
  }

  // ❌ Offline labs & medical store → NO booking
  if (
    consultationType === 'Offline' &&
    (item.type === 'lab' || item.type === 'store')
  ) {
    return false;
  }

  return true; // ✅ everything else allowed
};


  const symptomToSpecialtyMap: Record<string, string[]> = {
    fever: ['General Practitioner'],
    cold: ['General Practitioner'],
    cough: ['General Practitioner'],
    heart: ['Cardiologist'],
    chest: ['Cardiologist'],
    skin: ['Dermatologist'],
    acne: ['Dermatologist'],
    mental: ['Psychiatrist'],
    stress: ['Psychiatrist'],
    eye: ['Ophthalmologist'],
    diet: ['Nutritionist'],
    vomiting: ['General Practitioner'],
  };

  // Filter data based on selected category and filters
  const getFilteredData = () => {
    let data = getAvailableData();

    const query = searchQuery.trim().toLowerCase();

    // 🔎 SEARCH FILTER
    if (query.length > 0) {
      if (consultationType === 'Online' && serviceType === 'Doctor') {
        const matchedSpecialties = symptomToSpecialtyMap[query] || [];
        data = data.filter((doc: any) =>
          doc.name.toLowerCase().includes(query) ||
          doc.specialty.toLowerCase().includes(query) ||
          matchedSpecialties.includes(doc.specialty)
        );
      } else if (consultationType === 'Offline' && serviceType === 'Doctor') {
        data = data.filter((hospital: any) =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.specialty.toLowerCase().includes(query)
        );
      } else if (serviceType === 'Labs') {
        data = data.filter((lab: any) =>
          lab.name.toLowerCase().includes(query) ||
          lab.specialty.toLowerCase().includes(query)
        );
      } else if (serviceType === 'Medical Store') {
        data = data.filter((store: any) =>
          store.name.toLowerCase().includes(query)
        );
      } else if (serviceType === 'Complete Treatment') {
        data = data.filter((hospital: any) =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.specialty.toLowerCase().includes(query)
        );
      }
    }

    // 🎯 CATEGORY FILTER
    if (selectedCategory) {
      data = data.filter(item => item.specialty === selectedCategory);
    }

    // 💰 PRICE FILTER
    if (filterPriceRange) {
      if (filterPriceRange === 'low') {
        data = data.filter(item => item.price < 500);
      } else if (filterPriceRange === 'medium') {
        data = data.filter(item => item.price >= 500 && item.price < 1000);
      } else if (filterPriceRange === 'high') {
        data = data.filter(item => item.price >= 1000);
      }
    }

    // ⭐ RATING FILTER
    if (filterRating) {
      data = data.filter(item => item.rating >= filterRating);
    }

    // ⏰ AVAILABILITY FILTER
    if (filterAvailability === 'now') {
      data = data.filter(item =>
        item.nextAvailable === 'Available Now' ||
        item.nextAvailable === 'Open Now' ||
        item.nextAvailable === 'Open 24/7'
      );
    }

    // 🔃 SORTING
    if (sortBy === 'price-low') {
      data = [...data].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      data = [...data].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      data = [...data].sort((a, b) => b.rating - a.rating);
    }

    return data;
  };

  const filteredData = getFilteredData();

  // Auto-scroll for list
  useEffect(() => {
    if (autoScrollEnabled && filteredData.length > 2) {
      const interval = setInterval(() => {
        scrollPosition.current += 1;
        if (scrollPosition.current > filteredData.length * 140) {
          scrollPosition.current = 0;
        }
        scrollViewRef.current?.scrollTo({
          y: scrollPosition.current,
          animated: true,
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [autoScrollEnabled, filteredData.length]);

  const handleCategoryPress = (specialty: string | null) => {
    if (specialty === null) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(specialty);
    }
  };

  const handleBookNow = (item: any) => {
    if (consultationType === 'Online' && item.type === 'doctor') {
      navigation.navigate('AppointmentBooking', {
        doctor: item,
      });
      return;
    }

    if (item.type === 'lab' || item.type === 'store') {
      setSelectedDoctor(item);
      setShowLabStoreModal(true);
      return;
    }

    if (
      item.type === 'hospital' ||
      item.type === 'clinic' ||
      item.type === 'specialist center'
    ) {
      setSelectedDoctor(item);
      setShowOfflineForm(true);
      return;
    }
  };

  const handleLabStoreConfirm = () => {
    if (!prescription) return Alert.alert("Required", "Please upload a prescription");
    if (isDelivery === null) return Alert.alert("Required", "Please select delivery option");
    if (isDelivery && !address.trim()) return Alert.alert("Required", "Please enter delivery address");

    Alert.alert(
      "Order Placed!", 
      `Your request for ${selectedDoctor.name} has been received.\nMode: ${isDelivery ? 'Delivery' : 'Self-Visit'}`
    );
    closeLabStoreModal();
  };

  const closeLabStoreModal = () => {
    setShowLabStoreModal(false);
    setIsDelivery(null);
    setAddress('');
    setInstructions('');
    setPrescription(null);
  };

  const handleCamera = async () => {
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    });

    if (result.assets && result.assets.length > 0) {
      setPrescription(result.assets[0].uri || null);
    }
  };

  const handleGallery = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setPrescription(result.assets[0].uri || null);
    }
  };

  const clearAllFilters = () => {
    setFilterPriceRange(null);
    setFilterRating(null);
    setFilterAvailability(null);
    setSortBy('none');
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const hasActiveFilters = filterPriceRange || filterRating || filterAvailability || sortBy !== 'none';

  const handleDropdownSelect = (item: string) => {
    setSearchQuery(item);
    setShowDropdown(false);
    setIsSearchFocused(false);

    setTimeout(() => {
      setShowTypeModal(true);
    }, 200);
  };

  const closeForm = () => {
    setShowOfflineForm(false);
    setWantsAmbulance(null);
    setAppointmentTime('');
    setAppointmentDate('');
    setPickupTime('');
    setAmbulanceFieldLocked(false);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${month} ${year}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getMinimumTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now;
  };

  const onDateChange = (event: any, selectedDateValue?: Date) => {
    setShowDatePicker(false);
    if (selectedDateValue) {
      setSelectedDate(selectedDateValue);
      setAppointmentDate(formatDate(selectedDateValue));
      setAppointmentTime('');
      
      if (isToday(selectedDateValue)) {
        const minTime = getMinimumTime();
        setSelectedTime(minTime);
      } else {
        const futureTime = new Date(selectedDateValue);
        futureTime.setHours(9, 0, 0, 0);
        setSelectedTime(futureTime);
      }
    }
  };

  const handleFinalBooking = () => {
    if (!appointmentDate) {
      return Alert.alert("Missing", "Please select appointment date");
    }

    if (!appointmentTime) {
      return Alert.alert("Missing", "Please select appointment time");
    }

    if (!wantsAmbulance) {
      return Alert.alert("Missing", "Please select ambulance option");
    }

    if (wantsAmbulance === "yes" && !pickupTime) {
      return Alert.alert("Missing", "Please select pickup time");
    }

    Alert.alert(
      "Booking Confirmed ✅",
      `${selectedDoctor?.type === 'doctor' ? 'Doctor' : 'Hospital'}: ${selectedDoctor?.name}
Specialty: ${selectedDoctor?.specialty || 'N/A'}
Date: ${appointmentDate}
Time: ${appointmentTime}
Ambulance: ${wantsAmbulance === 'yes' ? `Yes (Pickup: ${pickupTime})` : 'No'}`,
      [
        {
          text: "View Hospital Doctors",
          onPress: () => {
            closeForm();
            navigation.navigate("Offline", {
              hospital: {
              ...selectedDoctor,
              hospital_id: selectedDoctor.id, // ✅ Add hospital_id from the id field
            },
            });
          },
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]
    );
  };

  const getSectionTitle = () => {
    if (consultationType === 'Offline') {
      if (serviceType === 'Complete Treatment' || serviceType === 'Doctor') {
        return 'Available Hospitals';
      } else if (serviceType === 'Labs') {
        return 'Available Labs';
      } else if (serviceType === 'Medical Store') {
        return 'Available Medical Stores';
      }
    }

    if (serviceType === 'Doctor') {
      return selectedCategory ? `${selectedCategory}s` : 'Available Doctors';
    } else if (serviceType === 'Labs') {
      return 'Available Labs';
    } else if (serviceType === 'Medical Store') {
      return 'Available Medical Stores';
    } else if (serviceType === 'Complete Treatment') {
      return 'Available Hospitals';
    }

    return 'Available Services';
  };

  const parseCustomTimeToDate = (
    hour: string,
    minute: string,
    ampm: 'AM' | 'PM'
  ) => {
    const h = parseInt(hour, 10) % 12 + (ampm === 'PM' ? 12 : 0);
    const m = parseInt(minute, 10);

    const date = new Date(selectedDate);
    date.setHours(h, m, 0, 0);
    return date;
  };

  const getImageSource = (image: any) => {
    if (typeof image === 'string' && image.startsWith('http')) {
      return { uri: image };
    }

    if (typeof image === 'number') {
      return image;
    }

    return require('../../assets/hospital1.jpg');
  };

  return (
     <TouchableWithoutFeedback
    onPress={() => {
      Keyboard.dismiss();
      setShowConsultationDropdown(false);
      setShowServiceDropdown(false);
    }}
  >
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafaf9" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back-ios" size={20} color="#2d7576" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find a Specialist</Text>
        <TouchableOpacity 
          style={styles.headerAmbulanceButton}
          onPress={() => navigation.navigate("Ambulance")}
        >
          <Icon name="local-hospital" size={18} color="#ffffff" />
          <Text style={styles.headerAmbulanceText}>Ambulance</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdowns Row */}
      <View style={styles.dropdownsRow}>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => {
              setShowConsultationDropdown(!showConsultationDropdown);
              setShowServiceDropdown(false);
            }}
          >
            <Text style={styles.dropdownButtonText}>{consultationType}</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#2d7576" />
          </TouchableOpacity>
          
          {showConsultationDropdown && (
            <View style={styles.dropdownMenu}>
              {consultationOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setConsultationType(option);
                    setShowConsultationDropdown(false);
                    setSelectedCategory(null);
                  }}
                >
                  <Text style={[
                    styles.dropdownMenuText,
                    consultationType === option && styles.dropdownMenuTextActive
                  ]}>
                    {option}
                  </Text>
                  {consultationType === option && (
                    <Icon name="check" size={18} color="#2d7576" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.dropdownWrapper}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => {
              setShowServiceDropdown(!showServiceDropdown);
              setShowConsultationDropdown(false);
            }}
          >
            <Text style={styles.dropdownButtonText}>{serviceType}</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#2d7576" />
          </TouchableOpacity>
          
          {showServiceDropdown && (
            <View style={styles.dropdownMenu}>
              {serviceOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setServiceType(option);
                    setShowServiceDropdown(false);
                    setSelectedCategory(null);
                  }}
                >
                  <Text style={[
                    styles.dropdownMenuText,
                    serviceType === option && styles.dropdownMenuTextActive
                  ]}>
                    {option}
                  </Text>
                  {serviceType === option && (
                    <Icon name="check" size={18} color="#2d7576" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.primaryCard}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Feeling unwell?</Text>
              <Text style={styles.cardSubtitle}>
                Describe your symptoms for a quick recommendation.
              </Text>
              <TouchableOpacity 
                style={styles.cardButton} 
                onPress={() => navigation.navigate("Form")}
              >
                <Text style={styles.cardButtonText}>Submit your Health Condition</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardDecoration}>
              <Icon name="medical-services" size={120} color="rgba(255,255,255,0.2)" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <View style={styles.searchInputContainer}>
              {searchQuery === '' && !isSearchFocused && (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.searchPrefix}>Search </Text>
                  <Animated.Text
                    style={[
                      styles.animatedPlaceholder,
                      {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                      },
                    ]}
                  >
                    {animatedPlaceholders[currentPlaceholderIndex]}
                  </Animated.Text>
                </View>
              )}
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder=""
              />
            </View>
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <View style={styles.filterIconContainer}>
                <Icon name="tune" size={20} color="#2d7576" style={styles.filterIcon} />
                {hasActiveFilters && <View style={styles.filterBadge} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {serviceType === 'Doctor' && consultationType === 'Online' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => {
              const isActive = category.specialty === null 
                ? selectedCategory === null 
                : selectedCategory === category.specialty;
              
              return (
                <TouchableOpacity 
                  key={category.id} 
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress(category.specialty)}
                >
                  <View style={[
                    styles.categoryIcon, 
                    { backgroundColor: category.bgColor },
                    isActive && styles.categoryIconActive
                  ]}>
                    <Icon name={category.icon} size={28} color={category.color} />
                  </View>
                  <Text style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {getSectionTitle()}
          </Text>
          <TouchableOpacity 
            onPress={() => setAutoScrollEnabled(!autoScrollEnabled)}
            style={styles.autoScrollToggle}
          >
            <Icon 
              name={autoScrollEnabled ? "pause" : "play-arrow"} 
              size={20} 
              color="#2d7576" 
            />
            <Text style={styles.autoScrollText}>
              {autoScrollEnabled ? 'Pause' : 'Auto'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2d7576" />
            <Text style={styles.loadingText}>Loading {serviceType.toLowerCase()}...</Text>
          </View>
        ) : apiError ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{apiError}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                if (consultationType === 'Online') {
                  if (serviceType === 'Doctor') fetchDoctors();
                  else if (serviceType === 'Labs') fetchLabs();
                  else if (serviceType === 'Medical Store') fetchPharmacies();
                  else if (serviceType === 'Complete Treatment') fetchHospitals();
                } else {
                  if (serviceType === 'Doctor' || serviceType === 'Complete Treatment') fetchHospitals();
                  else if (serviceType === 'Labs') fetchLabs();
                  else if (serviceType === 'Medical Store') fetchPharmacies();
                }
              }}
            >
              <Icon name="refresh" size={20} color="#fff" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.doctorsScrollView}
            showsVerticalScrollIndicator={false}
            onTouchStart={() => setAutoScrollEnabled(false)}
            nestedScrollEnabled={true}
          >
            <View style={styles.doctorsList}>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.doctorCard}>
                    <Image
                      source={getImageSource(item.image)}
                      style={styles.doctorImage}
                    />

                    <View style={styles.doctorInfo}>
                      <View style={styles.doctorHeader}>
                        <Text style={styles.doctorName}>{item.name}</Text>
                        <View style={styles.ratingContainer}>
                          <Icon name="star" size={14} color="#eab308" />
                          <Text style={styles.ratingText}>
                            {item.rating > 0 ? item.rating.toFixed(1) : 'N/A'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.specialtyText}>{item.specialty.toUpperCase()}</Text>
                      
                      {/* Additional info based on type */}
                      {item.type === 'doctor' && (item as Doctor).experience && (
                        <Text style={styles.experienceText}>
                          {(item as Doctor).experience} years experience
                        </Text>
                      )}
                      
                      {item.type === 'hospital' && (item as Hospital).location && (
                        <Text style={styles.locationText}>
                          <Icon name="location-on" size={12} color="#9ca3af" /> {(item as Hospital).location}
                        </Text>
                      )}
                      
                      {item.type === 'lab' && (item as Lab).homeCollection && (
                        <View style={styles.badgeContainer}>
                          <Icon name="home" size={12} color="#16a34a" />
                          <Text style={styles.badgeText}>Home Collection</Text>
                        </View>
                      )}
                      
                      {item.type === 'store' && (item as Pharmacy).pharmacyType && (
                        <Text style={styles.pharmacyTypeText}>
                          {(item as Pharmacy).pharmacyType}
                        </Text>
                      )}
                      
                      <Text style={styles.availabilityText}>
                        {item.type === 'doctor' ? 'Available: ' : item.type === 'store' ? 'Delivery: ' : 'Timing: '}
                        {item.type === 'store' && (item as Pharmacy).deliveryTime 
                          ? (item as Pharmacy).deliveryTime 
                          : item.nextAvailable}
                      </Text>
                      
                      <View style={styles.doctorFooter}>
                        <Text style={styles.priceText}>
                          {item.price > 0 
                            ? `₹${item.price}${item.type === 'doctor' || item.type === 'hospital' ? '/hr' : ''}` 
                            : 'Contact for price'}
                        </Text>
                        {!(
                          consultationType === 'Offline' &&
                          (serviceType === 'Doctor' ||
                            item.type === 'lab' ||
                            item.type === 'store')
                        ) ? (
                          <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() => handleBookNow(item)}
                          >
                            <Text style={styles.bookButtonText}>
                              {item.type === 'store'
                                ? 'Order'
                                : item.type === 'lab'
                                ? 'Book Test'
                                : 'Book Now'}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={[styles.bookButton, { backgroundColor: '#e5e7eb' }]}>
                            <Text style={[styles.bookButtonText, { color: '#9ca3af' }]}>
                              View Only
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="search-off" size={48} color="#9ca3af" />
                  <Text style={styles.emptyStateText}>No {serviceType.toLowerCase()}s found</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={showDoctorBookedModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.successIconContainer}>
              <Icon name="check-circle" size={64} color="#16a34a" />
            </View>
            <Text style={styles.popupTitle}>Booking Confirmed!</Text>
            <Text style={styles.popupSub}>
              Your appointment with {selectedDoctor?.name} has been successfully booked.
            </Text>
            <View style={styles.bookingDetailsContainer}>
              <View style={styles.bookingDetailRow}>
                <Icon name="event" size={18} color="#2d7576" />
                <Text style={styles.bookingDetailText}>
                  {selectedDoctor?.nextAvailable}
                </Text>
              </View>
              {selectedDoctor?.price > 0 && (
                <View style={styles.bookingDetailRow}>
                  <Icon name="attach-money" size={18} color="#2d7576" />
                  <Text style={styles.bookingDetailText}>
                    ₹{selectedDoctor?.price}/hr
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.confirmOkButton}
              onPress={() => {
                setShowDoctorBookedModal(false);
                setSelectedDoctor(null);
              }}
            >
              <Text style={styles.confirmOkButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTypeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.popupTitle}>Consultation Type</Text>
            <Text style={styles.popupSub}>Do you want an offline or online appointment?</Text>
            <View style={styles.popupBtnRow}>
              <TouchableOpacity 
                style={[styles.popupBtn, {backgroundColor: '#2d7576'}]}
                onPress={() => { setShowTypeModal(false); setShowOfflineForm(true); }}
              >
                <Text style={styles.popupBtnText}>Offline</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.popupBtn, {backgroundColor: '#2563eb'}]}
                onPress={() => navigation.navigate("Form")}
              >
                <Text style={styles.popupBtnText}>Online</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{marginTop: 15}} onPress={() => setShowTypeModal(false)}>
              <Text style={{color: '#9ca3af'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showOfflineForm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.formCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formHeader}>Booking Details</Text>
              
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>
                  <Icon name="event" size={16} color="#2d7576" /> Appointment Date
                </Text>
                <TouchableOpacity 
                  style={styles.modernInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <View style={styles.inputContent}>
                    <Icon name="calendar-today" size={20} color={appointmentDate ? '#2d7576' : '#9ca3af'} />
                    <Text style={appointmentDate ? styles.inputValueText : styles.inputPlaceholderText}>
                      {appointmentDate || 'Tap to select date'}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>
                  <Icon name="access-time" size={16} color="#2d7576" /> Appointment Time
                </Text>
                <TouchableOpacity 
                  style={styles.modernInput}
                  onPress={() => {
                    if (!appointmentDate) {
                      Alert.alert('Select Date First', 'Please select an appointment date before choosing time.');
                      return;
                    }
                    setCustomTimeModal(true);
                  }}
                >
                  <View style={styles.inputContent}>
                    <Icon name="schedule" size={20} color={appointmentTime ? '#2d7576' : '#9ca3af'} />
                    <Text style={appointmentTime ? styles.inputValueText : styles.inputPlaceholderText}>
                      {appointmentTime || 'Tap to select time'}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {!ambulanceFieldLocked && (
                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>
                    <Icon name="local-hospital" size={16} color="#2d7576" /> Need Ambulance Service?
                  </Text>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity 
                      style={[styles.modernChoiceBtn, wantsAmbulance === 'yes' && styles.modernChoiceBtnActive]}
                      onPress={() => { 
                        setWantsAmbulance('yes'); 
                        setAmbulanceFieldLocked(true);
                      }}
                    >
                      <Icon name="check-circle" size={20} color={wantsAmbulance === 'yes' ? '#fff' : '#2d7576'} />
                      <Text style={wantsAmbulance === 'yes' ? styles.modernChoiceTextActive : styles.modernChoiceText}>
                        Yes, I need
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modernChoiceBtn, wantsAmbulance === 'no' && styles.modernChoiceBtnActive]}
                      onPress={() => { 
                        setWantsAmbulance('no'); 
                        setAmbulanceFieldLocked(true);
                      }}
                    >
                      <Icon name="cancel" size={20} color={wantsAmbulance === 'no' ? '#fff' : '#ef4444'} />
                      <Text style={wantsAmbulance === 'no' ? styles.modernChoiceTextActive : styles.modernChoiceText}>
                        No, thanks
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {wantsAmbulance === 'yes' && (
                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>
                    <Icon name="local-taxi" size={16} color="#2d7576" /> Pickup Time
                  </Text>
                  <TouchableOpacity 
                    style={styles.modernInput}
                    onPress={() => {
                      if (!appointmentTime) {
                        Alert.alert('Select Appointment Time First', 'Please select appointment time before choosing pickup time.');
                        return;
                      }
                      setCustomTimeModal(true);
                    }}
                  >
                    <View style={styles.inputContent}>
                      <Icon name="directions-car" size={20} color={pickupTime ? '#2d7576' : '#9ca3af'} />
                      <Text style={pickupTime ? styles.inputValueText : styles.inputPlaceholderText}>
                        {pickupTime || 'Tap to select pickup time'}
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              )}
            
              <TouchableOpacity
                style={styles.modernFinalBookBtn}
                onPress={handleFinalBooking}
              >
                <Icon name="check-circle" size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.modernFinalBookText}>Confirm Booking</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={closeForm} style={styles.modernCancelBtn}>
                <Text style={styles.modernCancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              setAppointmentDate(formatDate(date));
              setAppointmentTime('');
            }
          }}
        />
      )}

      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterCard}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters & Sort</Text>
              <TouchableOpacity onPress={clearAllFilters}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.filterOptionsGrid}>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterPriceRange === 'low' && styles.filterChipActive]}
                    onPress={() => setFilterPriceRange(filterPriceRange === 'low' ? null : 'low')}
                  >
                    <Text style={[styles.filterChipText, filterPriceRange === 'low' && styles.filterChipTextActive]}>
                      Under ₹500
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterPriceRange === 'medium' && styles.filterChipActive]}
                    onPress={() => setFilterPriceRange(filterPriceRange === 'medium' ? null : 'medium')}
                  >
                    <Text style={[styles.filterChipText, filterPriceRange === 'medium' && styles.filterChipTextActive]}>
                      ₹500 - ₹1000
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterPriceRange === 'high' && styles.filterChipActive]}
                    onPress={() => setFilterPriceRange(filterPriceRange === 'high' ? null : 'high')}
                  >
                    <Text style={[styles.filterChipText, filterPriceRange === 'high' && styles.filterChipTextActive]}>
                      ₹1000+
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Rating</Text>
                <View style={styles.filterOptionsGrid}>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterRating === 4 && styles.filterChipActive]}
                    onPress={() => setFilterRating(filterRating === 4 ? null : 4)}
                  >
                    <Icon name="star" size={14} color={filterRating === 4 ? '#fff' : '#eab308'} />
                    <Text style={[styles.filterChipText, filterRating === 4 && styles.filterChipTextActive]}>
                      4+ Stars
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterRating === 4.5 && styles.filterChipActive]}
                    onPress={() => setFilterRating(filterRating === 4.5 ? null : 4.5)}
                  >
                    <Icon name="star" size={14} color={filterRating === 4.5 ? '#fff' : '#eab308'} />
                    <Text style={[styles.filterChipText, filterRating === 4.5 && styles.filterChipTextActive]}>
                      4.5+ Stars
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Availability</Text>
                <View style={styles.filterOptionsGrid}>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterAvailability === 'now' && styles.filterChipActive]}
                    onPress={() => setFilterAvailability(filterAvailability === 'now' ? null : 'now')}
                  >
                    <Icon name="access-time" size={14} color={filterAvailability === 'now' ? '#fff' : '#2d7576'} />
                    <Text style={[styles.filterChipText, filterAvailability === 'now' && styles.filterChipTextActive]}>
                      Available Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.filterOptionsColumn}>
                  <TouchableOpacity 
                    style={[styles.sortOption, sortBy === 'price-low' && styles.sortOptionActive]}
                    onPress={() => setSortBy('price-low')}
                  >
                    <Icon name="arrow-upward" size={16} color={sortBy === 'price-low' ? '#2d7576' : '#9ca3af'} />
                    <Text style={[styles.sortOptionText, sortBy === 'price-low' && styles.sortOptionTextActive]}>
                      Price: Low to High
                    </Text>
                    {sortBy === 'price-low' && (
                      <Icon name="check-circle" size={20} color="#2d7576" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sortOption, sortBy === 'price-high' && styles.sortOptionActive]}
                    onPress={() => setSortBy('price-high')}
                  >
                    <Icon name="arrow-downward" size={16} color={sortBy === 'price-high' ? '#2d7576' : '#9ca3af'} />
                    <Text style={[styles.sortOptionText, sortBy === 'price-high' && styles.sortOptionTextActive]}>
                      Price: High to Low
                    </Text>
                    {sortBy === 'price-high' && (
                      <Icon name="check-circle" size={20} color="#2d7576" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sortOption, sortBy === 'rating' && styles.sortOptionActive]}
                    onPress={() => setSortBy('rating')}
                  >
                    <Icon name="star" size={16} color={sortBy === 'rating' ? '#2d7576' : '#9ca3af'} />
                    <Text style={[styles.sortOptionText, sortBy === 'rating' && styles.sortOptionTextActive]}>
                      Highest Rated
                    </Text>
                    {sortBy === 'rating' && (
                      <Icon name="check-circle" size={20} color="#2d7576" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.filterCancelBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.filterCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.filterApplyBtn}
                onPress={applyFilters}
              >
                <Text style={styles.filterApplyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={customTimeModal} transparent animationType="fade">
        <View style={styles.timeOverlay}>
          <View style={styles.timeCard}>
            <Text style={styles.timeTitle}>Enter Time</Text>

            <View style={styles.timeRow}>
              <TextInput
                style={styles.timeBoxActive}
                keyboardType="number-pad"
                maxLength={2}
                value={hour}
                onChangeText={setHour}
              />

              <Text style={styles.colon}>:</Text>

              <TextInput
                style={styles.timeBox}
                keyboardType="number-pad"
                maxLength={2}
                value={minute}
                onChangeText={setMinute}
              />

              <View style={styles.ampmBox}>
                <TouchableOpacity
                  style={ampm === 'AM' ? styles.ampmActive : styles.ampm}
                  onPress={() => setAmPm('AM')}
                >
                  <Text style={ampm === 'AM' ? styles.ampmTextActive : styles.ampmText}>AM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={ampm === 'PM' ? styles.ampmActive : styles.ampm}
                  onPress={() => setAmPm('PM')}
                >
                  <Text style={ampm === 'PM' ? styles.ampmTextActive : styles.ampmText}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timeActions}>
              <TouchableOpacity onPress={() => setCustomTimeModal(false)}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const appointmentDateTime = parseCustomTimeToDate(hour, minute, ampm);

                  if (isToday(selectedDate) && appointmentDateTime <= new Date()) {
                    Alert.alert("Invalid Time", "Please select a future time");
                    return;
                  }

                  setSelectedTime(appointmentDateTime);
                  setAppointmentTime(formatTime(appointmentDateTime));

                  const pickup = new Date(appointmentDateTime);
                  pickup.setHours(pickup.getHours() - 1);

                  setSelectedPickupTime(pickup);
                  setPickupTime(formatTime(pickup));

                  setCustomTimeModal(false);
                }}
              >
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Icon name="home" size={24} color="#2d7576" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} 
          onPress={() => navigation.navigate("MyBookings")}
        >
          <Icon name="calendar-today" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="folder-open" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Modal 
        visible={showLabStoreModal} 
        transparent 
        animationType="slide"
        onRequestClose={closeLabStoreModal}
      >
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.sheetHandle} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
              <Text style={styles.sheetTitle}>
                {selectedDoctor?.type === 'lab' ? 'Book Lab Test' : 'Order Medicines'}
              </Text>
              <Text style={styles.sheetSub}>{selectedDoctor?.name}</Text>

              <View style={styles.sheetSection}>
                <Text style={styles.sheetLabel}>Upload Prescription</Text>
                <View style={styles.uploadRow}>
                  <TouchableOpacity style={styles.uploadBtn} onPress={handleCamera}>
                    <Icon name="photo-camera" size={24} color="#2d7576" />
                    <Text style={styles.uploadBtnText}>Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.uploadBtn} onPress={handleGallery}>
                    <Icon name="image" size={24} color="#2d7576" />
                    <Text style={styles.uploadBtnText}>Gallery</Text>
                  </TouchableOpacity>
                </View>

                {prescription && (
                  <View style={styles.previewContainer}>
                    <Image source={{ uri: prescription }} style={styles.prescriptionPreview} />
                    <TouchableOpacity 
                      style={styles.removeImageBtn} 
                      onPress={() => setPrescription(null)}
                    >
                      <Icon name="cancel" size={20} color="#ef4444" />
                    </TouchableOpacity>
                    <Text style={styles.uploadSuccessText}>Prescription attached</Text>
                  </View>
                )}
              </View>

              <View style={styles.sheetSection}>
                <Text style={styles.sheetLabel}>How would you like to proceed?</Text>
                <View style={styles.choiceRow}>
                  <TouchableOpacity 
                    style={[styles.modernChoiceBtn, isDelivery === true && styles.modernChoiceBtnActive]}
                    onPress={() => setIsDelivery(true)}
                  >
                    <Icon name="local-shipping" size={20} color={isDelivery === true ? '#fff' : '#2d7576'} />
                    <Text style={isDelivery === true ? styles.modernChoiceTextActive : styles.modernChoiceText}>Delivery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modernChoiceBtn, isDelivery === false && styles.modernChoiceBtnActive]}
                    onPress={() => setIsDelivery(false)}
                  >
                    <Icon name="store" size={20} color={isDelivery === false ? '#fff' : '#2d7576'} />
                    <Text style={isDelivery === false ? styles.modernChoiceTextActive : styles.modernChoiceText}>Visit Store</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {isDelivery && (
                <View style={styles.sheetSection}>
                  <Text style={styles.sheetLabel}>Delivery Address</Text>
                  <TextInput 
                    style={styles.sheetInput}
                    placeholder="Enter full address..."
                    multiline
                    numberOfLines={3}
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>
              )}

              <View style={styles.sheetSection}>
                <Text style={styles.sheetLabel}>Special Instructions (Optional)</Text>
                <TextInput 
                  style={styles.sheetInput}
                  placeholder="E.g. Call before arrival, substitute generic names..."
                  value={instructions}
                  onChangeText={setInstructions}
                />
              </View>

              <TouchableOpacity style={styles.sheetConfirmBtn} onPress={handleLabStoreConfirm}>
                <Text style={styles.sheetConfirmBtnText}>Confirm Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.sheetCancelBtn} onPress={closeLabStoreModal}>
                <Text style={styles.sheetCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fafaf9',
  },
  headerAmbulanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  headerAmbulanceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  dropdownsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 12,
  },
  dropdownWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f9f9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2d7576',
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d7576',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 2000,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownMenuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  dropdownMenuTextActive: {
    color: '#2d7576',
    fontWeight: '700',
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  primaryCard: {
    backgroundColor: '#2d7576',
    borderRadius: 12,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#2d7576',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    zIndex: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 16,
    maxWidth: 200,
  },
  cardButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    color: '#2d7576',
    fontSize: 14,
    fontWeight: '700',
  },
  cardDecoration: {
    position: 'absolute',
    right: -24,
    bottom: -24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    paddingLeft: 16,
  },
  searchInputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    position: 'relative',
  },
  placeholderContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  searchPrefix: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  animatedPlaceholder: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#131616',
    padding: 0,
  },
  filterIcon: {
    paddingRight: 12,
  },
  filterIconContainer: {
    position: 'relative',
    paddingRight: 12,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  categoriesContainer: {
    paddingVertical: 24,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 70,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIconActive: {
    borderWidth: 2,
    borderColor: '#2d7576',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525b',
  },
  categoryTextActive: {
    color: '#2d7576',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131616',
  },
  autoScrollToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  autoScrollText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d7576',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2d7576',
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2d7576',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  doctorsScrollView: {
    maxHeight: 500,
    paddingHorizontal: 16,
  },
  doctorsList: {
    paddingBottom: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e4e4e7',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#131616',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717a',
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2d7576',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  availabilityText: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  experienceText: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  pharmacyTypeText: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#131616',
  },
  bookButton: {
    backgroundColor: '#2d7576',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navItemActive: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2d7576',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupCard: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  bookingDetailsContainer: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingDetailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  popupSub: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  popupBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  popupBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  popupBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  formCard: {
    width: width * 0.9,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  formHeader: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
    color: '#2d7576',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  inputValueText: {
    fontSize: 15,
    color: '#131616',
    fontWeight: '600',
  },
  inputPlaceholderText: {
    fontSize: 15,
    color: '#9ca3af',
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modernChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  modernChoiceBtnActive: {
    backgroundColor: '#2d7576',
    borderColor: '#2d7576',
  },
  modernChoiceText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  modernChoiceTextActive: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  modernFinalBookBtn: {
    flexDirection: 'row',
    backgroundColor: '#2d7576',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2d7576',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modernFinalBookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modernCancelBtn: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 12,
  },
  modernCancelText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  filterCard: {
    width: width * 0.95,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 'auto',
    marginBottom: 0,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d7576',
  },
  clearAllText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOptionsColumn: {
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#2d7576',
    borderColor: '#2d7576',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    gap: 12,
  },
  sortOptionActive: {
    backgroundColor: '#e8f4f4',
    borderWidth: 1.5,
    borderColor: '#2d7576',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortOptionTextActive: {
    color: '#2d7576',
    fontWeight: '700',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filterCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  filterCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6b7280',
  },
  filterApplyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2d7576',
    shadowColor: '#2d7576',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterApplyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  confirmOkButton: {
    backgroundColor: '#2d7576',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2d7576',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmOkButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#131616',
  },
  sheetSub: {
    fontSize: 14,
    color: '#2d7576',
    fontWeight: '600',
    marginBottom: 20,
  },
  sheetSection: {
    marginBottom: 20,
  },
  sheetLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9f9',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d7576',
    borderStyle: 'dashed',
    gap: 8,
  },
  uploadBtnText: {
    color: '#2d7576',
    fontWeight: '700',
    fontSize: 14,
  },
  uploadSuccessText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
  sheetInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  sheetConfirmBtn: {
    backgroundColor: '#2d7576',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  sheetConfirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  sheetCancelBtn: {
    padding: 16,
    alignItems: 'center',
  },
  sheetCancelBtnText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    position: 'relative',
  },
  prescriptionPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -5,
    left: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  timeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeCard: {
    width: '85%',
    backgroundColor: '#2f2f2f',
    borderRadius: 16,
    padding: 20,
  },
  timeTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
timeBoxActive: {
  backgroundColor: '#3b82f6',
  color: '#fff',
  width: 70,
  height: 60,
  textAlign: 'center',
  fontSize: 28,
  borderRadius: 8,
},

timeBox: {
  backgroundColor: '#555',
  color: '#fff',
  width: 70,
  height: 60,
  textAlign: 'center',
  fontSize: 28,
  borderRadius: 8,
},

colon: {
  color: '#fff',
  fontSize: 30,
  marginHorizontal: 4,
},

ampmBox: {
  marginLeft: 10,
},

ampm: {
  padding: 6,
},

ampmActive: {
  backgroundColor: '#3b82f6',
  padding: 6,
  borderRadius: 6,
},

ampmText: {
  color: '#aaa',
},

ampmTextActive: {
  color: '#fff',
  fontWeight: '700',
},

timeActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},

cancelText: {
  color: '#aaa',
  fontWeight: '700',
},

okText: {
  color: '#3b82f6',
  fontWeight: '800',
},
});

export default DoctorListScreen;