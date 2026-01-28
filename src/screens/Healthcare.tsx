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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const DoctorListScreen = () => {
  const navigation = useNavigation<any>();

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
  const [showAddonButton, setShowAddonButton] = useState(false);
  const [showAssetsField, setShowAssetsField] = useState(false);
  const [wantsAssets, setWantsAssets] = useState<string | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<number | null>(null);

  // Time Picker States
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [selectedPickupTime, setSelectedPickupTime] = useState(new Date());

  // Animation values
  const animatedPlaceholders = ['doctor', 'specialist', 'condition'];
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

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

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      rating: 4.9,
      nextAvailable: '2:00 PM',
      price: 120,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDefhoSvqKkMBWYVqZmO31qWWnyETobXPIsvpgbpzACIuHiMFEibbVFxBem0oGX3QoB0fhv_F1vxstFtpZ9MZtJrSR0w6C0hWrFdCCM4W9SvwqLpolKvEc-_XcCTQTkxb3ssl0Y2_54wJJhFeAav5jIY1u67UzbCzmwt9ZDmKzDS1B1a0oNg8Bk0UYaIHl3t-4pmKj1J0rBtiCQ166vq6P6-J-EY8t-SLAd_04RsNPEY5nG6FNOxfdVdqN-6THzt-DkVYTRVoyf43-p',
    },
    {
      id: 2,
      name: 'Dr. Marcus Chen',
      specialty: 'Dermatologist',
      rating: 4.8,
      nextAvailable: '4:30 PM',
      price: 95,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZxglrHKMq2uMTcYd1cm6mtfzxS1mY1mpgodoSsZvgEo3YKjv3ywe7slrcDWxhv_7JZYJujIKEXQ9Wk0k3C0kTB-7uKOxGgxJO32Vtygny2g4Mq-OHjSYSclsDnK7DQae1TVtgVgG50NmWJnHhsJC35bRYTkdmjUlo3TqLSJ_YA8tcuZJykmHycmTwRlimQA1t2X778p2trNfkwF66UJkETjd4JWPTCnP9d3PK7LiZ-ZTg6ImvDnQS4p_lhGV49CcvLmQo9GrIDHT8',
    },
    {
      id: 3,
      name: 'Dr. Elena Rodriguez',
      specialty: 'General Practitioner',
      rating: 5.0,
      nextAvailable: 'Available Now',
      price: 110,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD07PPrdJIIL_BVVG0Ju36so7KdlOsmi-K67ouC847RMwRD1yYS-tHGoR3TP7kMVZ7ceepz5vEbGi9hQgCAzaTc8iShTgdIxbChTvIfnUFqQiXjtHLncBOfPynmXFABLYshcwfgQDUiQUNTpW-eQ6shkBwwhzL_hSoTNpMcRdsQLwKOH8lwqvRRq19WrdfiiyFt3Xl451O1geQIf_VrJc3ZRvbcxDmYaVwpVdFj609MY_zUYwjMqB-93ZfuJ7zBGw8XOYoO3r3c1yPa',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Psychiatrist',
      rating: 4.7,
      nextAvailable: '3:00 PM',
      price: 130,
      image: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 5,
      name: 'Dr. Emily Thompson',
      specialty: 'Ophthalmologist',
      rating: 4.9,
      nextAvailable: '1:30 PM',
      price: 105,
      image: 'https://i.pravatar.cc/150?img=47',
    },
    {
      id: 6,
      name: 'Dr. Michael Brown',
      specialty: 'Nutritionist',
      rating: 4.6,
      nextAvailable: '5:00 PM',
      price: 85,
      image: 'https://i.pravatar.cc/150?img=13',
    },
  ];

  const searchSuggestions = ['fever', 'cough', 'cold', 'vomiting', 'sinus'];

  // Filter doctors based on selected category and filters
  let filteredDoctors = selectedCategory 
    ? doctors.filter(doctor => doctor.specialty === selectedCategory)
    : doctors;

  // Apply price filter
  if (filterPriceRange) {
    if (filterPriceRange === 'low') {
      filteredDoctors = filteredDoctors.filter(doc => doc.price < 100);
    } else if (filterPriceRange === 'medium') {
      filteredDoctors = filteredDoctors.filter(doc => doc.price >= 100 && doc.price < 120);
    } else if (filterPriceRange === 'high') {
      filteredDoctors = filteredDoctors.filter(doc => doc.price >= 120);
    }
  }

  // Apply rating filter
  if (filterRating) {
    filteredDoctors = filteredDoctors.filter(doc => doc.rating >= filterRating);
  }

  // Apply availability filter
  if (filterAvailability === 'now') {
    filteredDoctors = filteredDoctors.filter(doc => doc.nextAvailable === 'Available Now');
  }

  // Apply sorting
  if (sortBy === 'price-low') {
    filteredDoctors = [...filteredDoctors].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredDoctors = [...filteredDoctors].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredDoctors = [...filteredDoctors].sort((a, b) => b.rating - a.rating);
  }

  const handleCategoryPress = (specialty: string | null) => {
    if (specialty === null) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(specialty);
    }
  };

  const handleDoctorBookNow = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowDoctorBookedModal(true);
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
    setShowAssetsField(false);
    setWantsAssets(null);
    setSelectedAssistant(null);
    setAppointmentTime('');
    setAppointmentDate('');
    setPickupTime('');
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

  const onTimeChange = (event: any, selectedTimeValue?: Date) => {
    setShowTimePicker(false);
    if (selectedTimeValue) {
      if (isToday(selectedDate)) {
        const now = new Date();
        if (selectedTimeValue <= now) {
          Alert.alert('Invalid Time', 'Please select a future time for today\'s appointment.');
          return;
        }
      }
      
      setSelectedTime(selectedTimeValue);
      setAppointmentTime(formatTime(selectedTimeValue));
      
      const pickupDate = new Date(selectedTimeValue);
      pickupDate.setHours(pickupDate.getHours() - 1);
      setSelectedPickupTime(pickupDate);
      setPickupTime(formatTime(pickupDate));
    }
  };

  const onPickupTimeChange = (event: any, selectedTimeValue?: Date) => {
    setShowPickupTimePicker(false);
    if (selectedTimeValue) {
      if (selectedTimeValue >= selectedTime) {
        Alert.alert('Invalid Time', 'Pickup time must be before appointment time.');
        return;
      }
      
      setSelectedPickupTime(selectedTimeValue);
      setPickupTime(formatTime(selectedTimeValue));
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

    if (!showAssetsField) {
      return Alert.alert("Missing", "Please complete addon selection");
    }

    if (wantsAssets === "yes" && !selectedAssistant) {
      return Alert.alert("Missing", "Please select an assistant");
    }

    Alert.alert(
      "Booking Confirmed ✅",
      `Your appointment has been booked for ${appointmentDate} at ${appointmentTime}.`,
      [{ text: "OK", onPress: closeForm }]
    );
  };

  return (
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

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  setShowDropdown(true);
                  setIsSearchFocused(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 150);
                  setIsSearchFocused(false);
                }}
              />
            </View>
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <View style={styles.filterIconContainer}>
                <Icon name="tune" size={20} color="#2d7576" style={styles.filterIcon} />
                {hasActiveFilters && <View style={styles.filterBadge} />}
              </View>
            </TouchableOpacity>
          </View>
          
          {showDropdown && (
            <View style={styles.dropdownContainer}>
              {searchSuggestions
                .filter(s => searchQuery === '' || s.includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <TouchableOpacity 
                    key={item} 
                    style={styles.dropdownItem}
                    onPress={() => handleDropdownSelect(item)}
                  >
                    <Icon name="search" size={16} color="#9ca3af" style={{ marginRight: 12 }} />
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory}s` : 'Available Doctors'}
          </Text>
        </View>

        <View style={styles.doctorsList}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <TouchableOpacity key={doctor.id} style={styles.doctorCard}>
                <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorHeader}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={14} color="#eab308" />
                      <Text style={styles.ratingText}>{doctor.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.specialtyText}>{doctor.specialty.toUpperCase()}</Text>
                  <Text style={styles.availabilityText}>Next available: {doctor.nextAvailable}</Text>
                  <View style={styles.doctorFooter}>
                    <Text style={styles.priceText}>${doctor.price}/hr</Text>
                    <TouchableOpacity 
                      style={styles.bookButton}
                      onPress={() => handleDoctorBookNow(doctor)}
                    >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search-off" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>No doctors found in this specialty</Text>
            </View>
          )}
        </View>

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
              <View style={styles.bookingDetailRow}>
                <Icon name="attach-money" size={18} color="#2d7576" />
                <Text style={styles.bookingDetailText}>
                  ${selectedDoctor?.price}/hr
                </Text>
              </View>
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
              
              <Text style={styles.inputLabel}>Select Appointment Date</Text>
              <TouchableOpacity 
                style={styles.formInput}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateTimeDisplay}>
                  <Icon name="event" size={20} color="#2d7576" style={{marginRight: 8}} />
                  <Text style={appointmentDate ? styles.timeText : styles.timePlaceholder}>
                    {appointmentDate || 'Select date'}
                  </Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={onDateChange}
                />
              )}

              <Text style={styles.inputLabel}>Select Appointment Time</Text>
              <TouchableOpacity 
                style={styles.formInput}
                onPress={() => {
                  if (!appointmentDate) {
                    Alert.alert('Select Date First', 'Please select an appointment date before choosing time.');
                    return;
                  }
                  setShowTimePicker(true);
                }}
              >
                <View style={styles.dateTimeDisplay}>
                  <Icon name="access-time" size={20} color="#2d7576" style={{marginRight: 8}} />
                  <Text style={appointmentTime ? styles.timeText : styles.timePlaceholder}>
                    {appointmentTime || 'Select time'}
                  </Text>
                </View>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  minimumDate={isToday(selectedDate) ? getMinimumTime() : undefined}
                  onChange={onTimeChange}
                />
              )}

              <Text style={styles.inputLabel}>Do you want ambulance services?</Text>
              <View style={styles.choiceRow}>
                <TouchableOpacity 
                  style={[styles.choiceBtn, wantsAmbulance === 'yes' && styles.choiceBtnActive]}
                  onPress={() => { setWantsAmbulance('yes'); setShowAddonButton(true); }}
                >
                  <Text style={wantsAmbulance === 'yes' ? styles.choiceTextActive : styles.choiceText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.choiceBtn, wantsAmbulance === 'no' && styles.choiceBtnActive]}
                  onPress={() => { setWantsAmbulance('no'); setShowAssetsField(true); }}
                >
                  <Text style={wantsAmbulance === 'no' ? styles.choiceTextActive : styles.choiceText}>No</Text>
                </TouchableOpacity>
              </View>

              {wantsAmbulance === 'yes' && (
                <>
                  <Text style={styles.inputLabel}>Select Pickup Time</Text>
                  <TouchableOpacity 
                    style={styles.formInput}
                    onPress={() => {
                      if (!appointmentTime) {
                        Alert.alert('Select Appointment Time First', 'Please select appointment time before choosing pickup time.');
                        return;
                      }
                      setShowPickupTimePicker(true);
                    }}
                  >
                    <View style={styles.dateTimeDisplay}>
                      <Icon name="local-taxi" size={20} color="#2d7576" style={{marginRight: 8}} />
                      <Text style={pickupTime ? styles.timeText : styles.timePlaceholder}>
                        {pickupTime || 'Select pickup time'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showPickupTimePicker && (
                    <DateTimePicker
                      value={selectedPickupTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={onPickupTimeChange}
                    />
                  )}
                  {showAddonButton && (
                    <TouchableOpacity 
                      style={styles.addonBtn} 
                      onPress={() => setShowAssetsField(true)}
                    >
                      <Text style={styles.addonBtnText}>Addon Services</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

              {showAssetsField && (
                <View style={{marginTop: 15}}>
                  <Text style={styles.inputLabel}>Do you want patient assistance?</Text>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity 
                      style={[styles.choiceBtn, wantsAssets === 'yes' && styles.choiceBtnActive]}
                      onPress={() => setWantsAssets('yes')}
                    >
                      <Text style={wantsAssets === 'yes' ? styles.choiceTextActive : styles.choiceText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.choiceBtn, wantsAssets === 'no' && styles.choiceBtnActive]}
                      onPress={() => setWantsAssets('no')}
                    >
                      <Text style={wantsAssets === 'no' ? styles.choiceTextActive : styles.choiceText}>No</Text>
                    </TouchableOpacity>
                  </View>

                  {wantsAssets === 'yes' && (
                    <View style={styles.assetsList}>
                      <Text style={[styles.inputLabel, {marginTop: 5}]}>Select an Assistant</Text>
                      {[1, 2, 3].map((item) => {
                        const isSelected = selectedAssistant === item;
                        return (
                          <TouchableOpacity 
                            key={item} 
                            style={[
                              styles.assetItem, 
                              isSelected && styles.assetItemActive
                            ]}
                            onPress={() => setSelectedAssistant(item)}
                          >
                            <Image 
                              source={{uri: `https://i.pravatar.cc/100?u=${item + 10}`}} 
                              style={styles.assetImg} 
                            />
                            <View style={{flex: 1, marginLeft: 12}}>
                              <Text style={[styles.assetName, isSelected && {color: '#2d7576'}]}>
                                Asset Assistant {item === 1 ? 'A' : item === 2 ? 'B' : 'C'}
                              </Text>
                              <View style={styles.ratingContainer}>
                                <Icon name="star" size={12} color="#eab308" />
                                <Text style={styles.ratingText}>4.{8 + item} • Professional</Text>
                              </View>
                            </View>
                            
                            <View style={[styles.radioButton, isSelected && styles.radioButtonActive]}>
                              {isSelected && <View style={styles.radioInner} />}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={styles.finalBookBtn}
                onPress={handleFinalBooking}
              >
                <Text style={styles.finalBookText}>Book Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={closeForm} style={{alignSelf: 'center', marginTop: 10}}>
                <Text style={{color: '#ef4444'}}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
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
              {/* Price Range Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.filterOptionsGrid}>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterPriceRange === 'low' && styles.filterChipActive]}
                    onPress={() => setFilterPriceRange(filterPriceRange === 'low' ? null : 'low')}
                  >
                    <Text style={[styles.filterChipText, filterPriceRange === 'low' && styles.filterChipTextActive]}>
                      Under $100
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterPriceRange === 'medium' && styles.filterChipActive]}
                    onPress={() => setFilterPriceRange(filterPriceRange === 'medium' ? null : 'medium')}
                  >
                    <Text style={[styles.filterChipText, filterPriceRange === 'medium' && styles.filterChipTextActive]}>
                      $100 - $120
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterChip, filterPriceRange === 'high' && styles.filterChipActive]}
                    onPress={() => setFilterPriceRange(filterPriceRange === 'high' ? null : 'high')}
                  >
                    <Text style={[styles.filterChipText, filterPriceRange === 'high' && styles.filterChipTextActive]}>
                      $120+
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>


              {/* Availability Filter */}
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

              {/* Sort By */}
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

            {/* Filter Actions */}
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

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Icon name="home" size={24} color="#2d7576" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-today" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Consults</Text>
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
    </SafeAreaView>
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
    marginBottom: 8,
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
  dropdownContainer: {
    backgroundColor: '#ffffff',
    marginTop: 4,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
  },
  dropdownText: {
    fontSize: 14,
    color: '#131616',
    textTransform: 'capitalize',
    fontWeight: '500',
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
  doctorsList: {
    paddingHorizontal: 16,
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
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d7576',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#374151',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    color: '#000',
  },
  dateTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  choiceBtnActive: {
    backgroundColor: '#2d7576',
    borderColor: '#2d7576',
  },
  choiceText: {
    color: '#374151',
    fontWeight: '600',
  },
  choiceTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  addonBtn: {
    marginTop: 10,
    backgroundColor: '#e8f4f4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d7576',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addonBtnText: {
    color: '#2d7576',
    fontWeight: '700',
  },
  assetsList: {
    marginTop: 10,
    gap: 10,
  },
  assetItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
  },
  assetImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  assetName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  finalBookBtn: {
    backgroundColor: '#2d7576',
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
  },
  finalBookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetItemActive: {
    borderColor: '#2d7576',
    borderWidth: 1.5,
    backgroundColor: '#f0f9f9',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioButtonActive: {
    borderColor: '#2d7576',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#2d7576',
  },
  timeText: {
    fontSize: 14,
    color: '#000',
    paddingVertical: 2,
  },
  timePlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
    paddingVertical: 2,
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
});

export default DoctorListScreen;  