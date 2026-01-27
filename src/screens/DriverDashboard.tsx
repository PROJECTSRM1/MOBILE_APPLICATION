import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

// ==================== TYPES ====================

type ServiceType = 'scooty' | 'bike' | 'car' | 'xl_car' | 'parcel' | 'metro';
type RideStatus = 'completed' | 'cancelled' | 'in_progress';
type NotificationType = 'payment' | 'promo' | 'ride_request' | 'alert' | 'system';
type TabType = 'home' | 'rides' | 'earnings' | 'notifications' | 'profile';
type FilterService = 'all' | ServiceType;
type StatusFilter = 'all' | RideStatus;

interface ServiceConfig {
  label: string;
  bgColor: string;
  color: string;
  icon: string;
}

interface Ride {
  id: string;
  serviceType: ServiceType;
  pickup: string;
  dropoff: string;
  distance: string;
  duration: string;
  fare: number;
  paymentMethod?: string;
  status: RideStatus;
  date: string;
  time: string;
  customerName?: string;
  customerRating?: number;
  tip?: number;
  parcelDescription?: string;
  parcelWeight?: string;
  metroLine?: string;
  platform?: string;
}

interface ActiveRide extends Omit<Ride, 'date' | 'time'> {
  estimatedArrival: string;
  otp?: string;
}

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  amount?: number;
  serviceType?: ServiceType;
}

interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  todayRides: number;
  weekRides: number;
  monthRides: number;
  todayHours: number;
  avgPerRide: number;
  byServiceType: Record<ServiceType, { amount: number; rides: number }>;
}

interface DailyEarnings {
  date: string;
  amount: number;
}

// ==================== CONFIG ====================

const SERVICE_CONFIG: Record<ServiceType, ServiceConfig> = {
  scooty: { label: 'Scooty', bgColor: '#ECFDF5', color: '#059669', icon: 'circle' },
  bike: { label: 'Bike', bgColor: '#ECFDF5', color: '#059669', icon: 'circle' },
  car: { label: 'Car', bgColor: '#EFF6FF', color: '#2563EB', icon: 'square' },
  xl_car: { label: 'XL Car', bgColor: '#EEF2FF', color: '#6366F1', icon: 'square' },
  parcel: { label: 'Parcel', bgColor: '#FEF3C7', color: '#D97706', icon: 'package' },
  metro: { label: 'Metro', bgColor: '#F5F3FF', color: '#7C3AED', icon: 'compass' },
};

// ==================== MOCK DATA ====================

const MOCK_RIDES: Ride[] = [
  {
    id: '1',
    serviceType: 'car',
    pickup: 'Koramangala 5th Block',
    dropoff: 'MG Road Metro Station',
    distance: '5.2 km',
    duration: '18 min',
    fare: 185,
    paymentMethod: 'cash',
    status: 'completed',
    date: '2025-01-27',
    time: '09:30 AM',
    customerName: 'Priya Sharma',
    customerRating: 4.9,
    tip: 20,
  },
  {
    id: '2',
    serviceType: 'bike',
    pickup: 'Indiranagar',
    dropoff: 'HSR Layout',
    distance: '3.8 km',
    duration: '12 min',
    fare: 95,
    paymentMethod: 'upi',
    status: 'completed',
    date: '2025-01-27',
    time: '08:45 AM',
    customerName: 'Amit Kumar',
    customerRating: 5.0,
  },
  {
    id: '3',
    serviceType: 'parcel',
    pickup: 'Jayanagar 4th Block',
    dropoff: 'BTM Layout',
    distance: '4.5 km',
    duration: '15 min',
    fare: 120,
    paymentMethod: 'cash',
    status: 'completed',
    date: '2025-01-26',
    time: '06:15 PM',
    parcelDescription: 'Documents',
    parcelWeight: '0.5 kg',
  },
  {
    id: '4',
    serviceType: 'car',
    pickup: 'Whitefield',
    dropoff: 'Electronic City',
    distance: '12.5 km',
    duration: '28 min',
    fare: 0,
    paymentMethod: 'upi',
    status: 'cancelled',
    date: '2025-01-26',
    time: '04:30 PM',
    customerName: 'Rahul Verma',
  },
  {
    id: '5',
    serviceType: 'bike',
    pickup: 'Marathahalli',
    dropoff: 'Bellandur',
    distance: '6.2 km',
    duration: '15 min',
    fare: 0,
    paymentMethod: 'cash',
    status: 'cancelled',
    date: '2025-01-26',
    time: '02:15 PM',
    customerName: 'Sneha Reddy',
  },
  {
    id: '6',
    serviceType: 'scooty',
    pickup: 'BTM Layout',
    dropoff: 'Koramangala',
    distance: '2.8 km',
    duration: '10 min',
    fare: 65,
    paymentMethod: 'upi',
    status: 'completed',
    date: '2025-01-26',
    time: '11:20 AM',
    customerName: 'Aisha Khan',
    customerRating: 4.8,
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received ₹185 for your ride to MG Road',
    time: '5 min ago',
    read: false,
    amount: 185,
    serviceType: 'car',
  },
  {
    id: '2',
    type: 'promo',
    title: 'Special Bonus!',
    message: 'Complete 5 more rides today to earn ₹500 bonus',
    time: '1 hour ago',
    read: false,
  },
];

const MOCK_EARNINGS_SUMMARY: EarningsSummary = {
  today: 2450,
  thisWeek: 12800,
  thisMonth: 48500,
  todayRides: 12,
  weekRides: 58,
  monthRides: 245,
  todayHours: 8,
  avgPerRide: 204,
  byServiceType: {
    car: { amount: 25000, rides: 102 },
    bike: { amount: 8500, rides: 78 },
    scooty: { amount: 5200, rides: 45 },
    xl_car: { amount: 6800, rides: 12 },
    parcel: { amount: 2400, rides: 6 },
    metro: { amount: 600, rides: 2 },
  },
};

const MOCK_DAILY_EARNINGS: DailyEarnings[] = [
  { date: '2025-01-21', amount: 1850 },
  { date: '2025-01-22', amount: 2100 },
  { date: '2025-01-23', amount: 1650 },
  { date: '2025-01-24', amount: 2350 },
  { date: '2025-01-25', amount: 1900 },
  { date: '2025-01-26', amount: 2500 },
  { date: '2025-01-27', amount: 2450 },
];

const generateRideRequest = (serviceType: ServiceType): Omit<ActiveRide, 'id'> => {
  const pickups = ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'BTM'];
  const dropoffs = ['MG Road', 'Jayanagar', 'Electronic City', 'Marathahalli', 'Bellandur'];
  
  return {
    serviceType,
    pickup: pickups[Math.floor(Math.random() * pickups.length)],
    dropoff: dropoffs[Math.floor(Math.random() * dropoffs.length)],
    distance: `${(Math.random() * 10 + 1).toFixed(1)} km`,
    duration: `${Math.floor(Math.random() * 30 + 5)} min`,
    fare: Math.floor(Math.random() * 300 + 100),
    paymentMethod: Math.random() > 0.5 ? 'cash' : 'upi',
    status: 'in_progress',
    estimatedArrival: `${Math.floor(Math.random() * 10 + 2)} min`,
    customerName: ['Amit', 'Priya', 'Rajesh', 'Neha'][Math.floor(Math.random() * 4)],
    customerRating: Number((Math.random() * 0.5 + 4.5).toFixed(1)),
    otp: Math.floor(1000 + Math.random() * 9000).toString(),
  };
};

// ==================== COMPONENTS ====================

const StatusToggle = ({ isOnline, onToggle }: { isOnline: boolean; onToggle: () => void }) => {
  const [animation] = useState(new Animated.Value(isOnline ? 1 : 0));

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isOnline ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [isOnline, animation]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 32],
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.toggleContainer,
        { backgroundColor: isOnline ? '#10B981' : '#CBD5E1' },
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX }] },
        ]}
      >
        <View
          style={[
            styles.toggleDot,
            { backgroundColor: isOnline ? '#10B981' : '#94A3B8' },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const EarningsCard = ({
  todayEarnings,
  weeklyEarnings,
  ridesCompleted,
  hoursOnline,
}: {
  todayEarnings: number;
  weeklyEarnings: number;
  ridesCompleted: number;
  hoursOnline: number;
}) => {
  return (
    <View style={styles.earningsCard}>
      <View style={styles.earningsHeader}>
        <View>
          <Text style={styles.earningsLabel}>Today's Earnings</Text>
          <View style={styles.earningsAmount}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <Text style={styles.earningsValue}>{todayEarnings.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.trendingBadge}>
          <Icon name="trending-up" size={14} color="#FFF" />
          <Text style={styles.trendingText}>+12%</Text>
        </View>
      </View>

      <View style={styles.earningsStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{ridesCompleted}</Text>
          <Text style={styles.statLabel}>RIDES</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={styles.statValue}>{hoursOnline}h</Text>
          <Text style={styles.statLabel}>ONLINE</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{weeklyEarnings}</Text>
          <Text style={styles.statLabel}>THIS WEEK</Text>
        </View>
      </View>
    </View>
  );
};

const QuickStats = ({
  rating,
  acceptance,
  cancellation,
  streak,
}: {
  rating: number;
  acceptance: number;
  cancellation: number;
  streak: number;
}) => {
  const stats = [
    { icon: 'star', value: rating.toFixed(1), label: 'Rating', color: '#F59E0B' },
    { icon: 'navigation', value: `${acceptance}%`, label: 'Accept', color: '#10B981' },
    { icon: 'clock', value: `${cancellation}%`, label: 'Cancel', color: '#64748B' },
    { icon: 'zap', value: streak.toString(), label: 'Streak', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.quickStats}>
      {stats.map((stat, index) => (
        <View key={stat.label} style={styles.statCard}>
          <Icon name={stat.icon} size={20} color={stat.color} />
          <Text style={styles.statCardValue}>{stat.value}</Text>
          <Text style={styles.statCardLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const ServiceButtons = ({
  activeService,
  onServiceChange,
}: {
  activeService: FilterService;
  onServiceChange: (service: FilterService) => void;
}) => {
  const services: { id: FilterService; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'bike', label: 'Bike', icon: 'circle' },
    { id: 'scooty', label: 'Scooty', icon: 'circle' },
    { id: 'car', label: 'Car', icon: 'square' },
    { id: 'xl_car', label: 'XL Car', icon: 'square' },
    { id: 'parcel', label: 'Parcel', icon: 'package' },
    { id: 'metro', label: 'Metro', icon: 'compass' },
  ];

  return (
    <View style={styles.serviceContainer}>
      <Text style={styles.sectionTitle}>Select Service Type</Text>
      <View style={styles.serviceGrid}>
        {services.map((service) => {
          const isActive = activeService === service.id;
          const config =
            service.id === 'all'
              ? { bgColor: '#EFF6FF', color: '#2563EB' }
              : SERVICE_CONFIG[service.id as ServiceType];

          return (
            <TouchableOpacity
              key={service.id}
              onPress={() => onServiceChange(service.id)}
              style={[
                styles.serviceButton,
                isActive && {
                  backgroundColor: config.bgColor,
                  borderColor: config.color,
                },
              ]}
              activeOpacity={0.7}
            >
              <Icon
                name={service.icon}
                size={20}
                color={isActive ? config.color : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.serviceButtonText,
                  isActive && { color: config.color },
                ]}
              >
                {service.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const RecentRides = ({ rides, onViewAll }: { rides: Ride[]; onViewAll: () => void }) => {
  const renderRide = ({ item }: { item: Ride }) => {
    const config = SERVICE_CONFIG[item.serviceType];

    return (
      <TouchableOpacity style={styles.rideCard} activeOpacity={0.7}>
        <View
          style={[
            styles.rideIcon,
            {
              backgroundColor:
                item.status === 'completed' ? config.bgColor : '#FEE2E2',
            },
          ]}
        >
          <Icon
            name={config.icon}
            size={20}
            color={item.status === 'completed' ? config.color : '#EF4444'}
          />
        </View>
        <View style={styles.rideInfo}>
          <Text style={styles.rideDestination} numberOfLines={1}>
            {item.dropoff}
          </Text>
          <View style={styles.rideMetaRow}>
            <Text style={styles.rideMeta}>{item.time}</Text>
            <Text style={styles.rideMeta}> • </Text>
            <Text style={styles.rideMeta}>{config.label}</Text>
          </View>
        </View>
        <View style={styles.rideRight}>
          <Text
            style={[
              styles.rideFare,
              item.status === 'completed'
                ? styles.fareCompleted
                : styles.fareCancelled,
            ]}
          >
            {item.status === 'completed' ? `₹${item.fare}` : 'Cancelled'}
          </Text>
          {item.customerRating && item.status === 'completed' && (
            <View style={styles.rideRating}>
              <Icon name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.customerRating}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.recentRidesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>Recent Rides</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={onViewAll}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="chevron-right" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={rides}
        renderItem={renderRide}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const RideRequestModal = ({
  visible,
  ride,
  onAccept,
  onDecline,
}: {
  visible: boolean;
  ride: Omit<ActiveRide, 'id'> | null;
  onAccept: () => void;
  onDecline: () => void;
}) => {
  if (!ride) return null;

  const config = SERVICE_CONFIG[ride.serviceType];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDecline}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.rideRequestCard}>
          <View style={styles.requestHeader}>
            <View style={styles.requestHeaderLeft}>
              <View style={[styles.requestIcon, { backgroundColor: config.bgColor }]}>
                <Icon name={config.icon} size={24} color={config.color} />
              </View>
              <View>
                <Text style={styles.requestType}>
                  New {config.label} Request
                </Text>
                <Text style={styles.requestDistance}>{ride.distance} away</Text>
              </View>
            </View>
            <View style={styles.requestFare}>
              <Text style={styles.requestFareAmount}>₹{ride.fare}</Text>
              <Text style={styles.requestETA}>{ride.estimatedArrival} pickup</Text>
            </View>
          </View>

          <View style={styles.requestRoute}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.routeText}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={styles.routeAddress}>{ride.pickup}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#EF4444' }]} />
              <View style={styles.routeText}>
                <Text style={styles.routeLabel}>DROP</Text>
                <Text style={styles.routeAddress}>{ride.dropoff}</Text>
              </View>
            </View>
          </View>

          <View style={styles.requestActions}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={onDecline}
              activeOpacity={0.7}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={onAccept}
              activeOpacity={0.7}
            >
              <Text style={styles.acceptButtonText}>Accept Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LiveRideTracking = ({
  ride,
  onComplete,
  onCancel,
}: {
  ride: ActiveRide;
  onComplete: () => void;
  onCancel: () => void;
}) => {
  const [stage, setStage] = useState<'pickup' | 'trip' | 'dropoff'>('pickup');
  const config = SERVICE_CONFIG[ride.serviceType];

  const handleArrived = () => {
    if (stage === 'pickup') setStage('trip');
  };

  const handleStartTrip = () => {
    if (stage === 'trip') setStage('dropoff');
  };

  return (
    <ScrollView style={styles.liveRideContainer}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapContent}>
          <View style={[styles.mapIcon, { backgroundColor: config.bgColor }]}>
            <Icon name={config.icon} size={40} color={config.color} />
          </View>
          <Text style={styles.mapTitle}>Live Map Tracking</Text>
          <Text style={styles.mapSubtitle}>GPS location active</Text>
        </View>

        {/* Stage Indicator */}
        <View style={styles.stageIndicator}>
          {['pickup', 'trip', 'dropoff'].map((s) => (
            <View
              key={s}
              style={[
                styles.stageBar,
                s === stage && styles.stageBarActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Ride Info */}
      <View style={styles.rideInfoCard}>
        <View style={styles.rideInfoHeader}>
          <View style={styles.rideInfoLeft}>
            <View style={[styles.rideInfoIcon, { backgroundColor: config.bgColor }]}>
              <Icon name={config.icon} size={28} color={config.color} />
            </View>
            <View>
              <Text style={styles.rideInfoType}>{config.label}</Text>
              <Text style={styles.rideInfoDistance}>
                {ride.distance} • {ride.duration}
              </Text>
            </View>
          </View>
          <View style={styles.rideInfoRight}>
            <Text style={styles.rideInfoFare}>₹{ride.fare}</Text>
            <Text style={styles.rideInfoPayment}>{ride.paymentMethod}</Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.liveRoute}>
          <View style={styles.liveRoutePoint}>
            <View
              style={[
                styles.liveRouteDot,
                stage === 'pickup'
                  ? styles.liveRouteDotActive
                  : { backgroundColor: '#10B981' },
              ]}
            />
            <View style={styles.liveRouteText}>
              <Text style={styles.liveRouteLabel}>PICKUP</Text>
              <Text style={styles.liveRouteAddress}>{ride.pickup}</Text>
            </View>
            {stage === 'pickup' && (
              <Text style={styles.liveRouteETA}>{ride.estimatedArrival}</Text>
            )}
          </View>
          <View style={styles.liveRouteLine} />
          <View style={styles.liveRoutePoint}>
            <View
              style={[
                styles.liveRouteDot,
                stage === 'dropoff'
                  ? styles.liveRouteDotActive
                  : { backgroundColor: '#EF4444' },
              ]}
            />
            <View style={styles.liveRouteText}>
              <Text style={styles.liveRouteLabel}>DROP</Text>
              <Text style={styles.liveRouteAddress}>{ride.dropoff}</Text>
            </View>
          </View>
        </View>

        {/* OTP */}
        {ride.otp && stage !== 'dropoff' && (
          <View style={styles.otpContainer}>
            <View style={styles.otpLeft}>
              <Icon name="shield" size={20} color="#2563EB" />
              <Text style={styles.otpLabel}>Ride OTP</Text>
            </View>
            <Text style={styles.otpCode}>{ride.otp}</Text>
          </View>
        )}
      </View>

      {/* Customer Info */}
      {ride.customerName && (
        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Icon name="user" size={28} color="#64748B" />
            </View>
            <View>
              <Text style={styles.customerName}>{ride.customerName}</Text>
              {ride.customerRating && (
                <View style={styles.customerRating}>
                  <Icon name="star" size={14} color="#F59E0B" />
                  <Text style={styles.customerRatingText}>
                    {ride.customerRating}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.customerActions}>
            <TouchableOpacity style={styles.customerActionButton}>
              <Icon name="phone" size={20} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.customerActionButton}>
              <Icon name="message-square" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.liveActions}>
        <TouchableOpacity
          style={styles.cancelRideButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Icon name="x" size={20} color="#EF4444" />
          <Text style={styles.cancelRideText}>Cancel</Text>
        </TouchableOpacity>

        {stage === 'pickup' && (
          <TouchableOpacity
            style={styles.arrivedButton}
            onPress={handleArrived}
            activeOpacity={0.7}
          >
            <Icon name="navigation" size={20} color="#FFF" />
            <Text style={styles.arrivedButtonText}>Arrived</Text>
          </TouchableOpacity>
        )}

        {stage === 'trip' && (
          <TouchableOpacity
            style={styles.startTripButton}
            onPress={handleStartTrip}
            activeOpacity={0.7}
          >
            <Icon name="navigation" size={20} color="#FFF" />
            <Text style={styles.startTripButtonText}>Start Trip</Text>
          </TouchableOpacity>
        )}

        {stage === 'dropoff' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={onComplete}
            activeOpacity={0.7}
          >
            <Icon name="check-circle" size={20} color="#FFF" />
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const BottomNav = ({
  activeTab,
  onTabChange,
  notificationCount = 0,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  notificationCount?: number;
}) => {
  const tabs: { id: TabType; icon: string; label: string }[] = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'rides', icon: 'file-text', label: 'History' },
    { id: 'earnings', icon: 'credit-card', label: 'Earnings' },
    { id: 'notifications', icon: 'bell', label: 'Alerts' },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <View style={styles.navIconContainer}>
              <Icon
                name={tab.icon}
                size={20}
                color={isActive ? '#2563EB' : '#94A3B8'}
              />
              {tab.id === 'notifications' && notificationCount > 0 && (
                <View style={styles.navBadge}>
                  <Text style={styles.navBadgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
              {isActive && <View style={styles.navIndicator} />}
            </View>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ==================== MAIN APP ====================

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeService, setActiveService] = useState<FilterService>('all');
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [pendingRide, setPendingRide] = useState<Omit<ActiveRide, 'id'> | null>(null);
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const generateRandomRequest = useCallback(() => {
    const services: ServiceType[] =
      activeService === 'all'
        ? ['bike', 'scooty', 'car', 'xl_car', 'parcel', 'metro']
        : [activeService];
    const randomService = services[Math.floor(Math.random() * services.length)];
    return generateRideRequest(randomService);
  }, [activeService]);

  useEffect(() => {
    if (isOnline && !activeRide) {
      const timer = setTimeout(() => {
        const request = generateRandomRequest();
        setPendingRide(request);
        setShowRideRequest(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowRideRequest(false);
      setPendingRide(null);
    }
  }, [isOnline, activeRide, generateRandomRequest]);

  const handleAcceptRide = () => {
    if (pendingRide) {
      const newActiveRide: ActiveRide = {
        ...pendingRide,
        id: `ride-${Date.now()}`,
        status: 'in_progress',
      };
      setActiveRide(newActiveRide);
      setShowRideRequest(false);
      setPendingRide(null);

      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'ride_request',
        title: 'Ride Accepted',
        message: `You accepted a ${pendingRide.serviceType} ride to ${pendingRide.dropoff}`,
        time: 'Just now',
        read: false,
        serviceType: pendingRide.serviceType,
        amount: pendingRide.fare,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
  };

  const handleDeclineRide = () => {
    setShowRideRequest(false);
    setPendingRide(null);
    setTimeout(() => {
      if (isOnline && !activeRide) {
        const request = generateRandomRequest();
        setPendingRide(request);
        setShowRideRequest(true);
      }
    }, 5000);
  };

  const handleCompleteRide = () => {
    if (activeRide) {
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'payment',
        title: 'Ride Completed',
        message: `₹${activeRide.fare} earned for ride to ${activeRide.dropoff}`,
        time: 'Just now',
        read: false,
        amount: activeRide.fare,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setActiveRide(null);
    }
  };

  const handleCancelRide = () => {
    setActiveRide(null);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredRides = MOCK_RIDES.filter(
    (ride) => {
      const matchesService = activeService === 'all' || ride.serviceType === activeService;
      const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
      return matchesService && matchesStatus;
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="menu" size={20} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerGreeting}>Good Morning</Text>
            <Text style={styles.headerName}>Rajesh Kumar</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setActiveTab('notifications')}
          >
            <Icon name="bell" size={20} color="#1E293B" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <StatusToggle isOnline={isOnline} onToggle={() => setIsOnline(!isOnline)} />
        </View>
      </View>

      {/* Status Banner */}
      <View
        style={[
          styles.statusBanner,
          {
            backgroundColor: isOnline
              ? activeRide
                ? '#FB923C'
                : '#22C55E'
              : '#94A3B8',
          },
        ]}
      >
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>
          {activeRide
            ? `Active Ride - ${activeRide.serviceType.replace('_', ' ').toUpperCase()}`
            : isOnline
            ? 'You are Online - Ready for rides'
            : 'You are Offline'}
        </Text>
      </View>

      {/* Location Bar */}
      {activeTab === 'home' && !activeRide && (
        <View style={styles.locationBar}>
          <Icon name="map-pin" size={16} color="#2563EB" />
          <Text style={styles.locationLabel}>Current Location:</Text>
          <Text style={styles.locationValue}>Koramangala, Bengaluru</Text>
        </View>
      )}

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeRide && activeTab === 'home' ? (
          <LiveRideTracking
            ride={activeRide}
            onComplete={handleCompleteRide}
            onCancel={handleCancelRide}
          />
        ) : activeTab === 'home' && !activeRide ? (
          <>
            <EarningsCard
              todayEarnings={MOCK_EARNINGS_SUMMARY.today}
              weeklyEarnings={MOCK_EARNINGS_SUMMARY.thisWeek}
              ridesCompleted={MOCK_EARNINGS_SUMMARY.todayRides}
              hoursOnline={MOCK_EARNINGS_SUMMARY.todayHours}
            />
            <QuickStats rating={4.8} acceptance={92} cancellation={3} streak={5} />
            <ServiceButtons
              activeService={activeService}
              onServiceChange={setActiveService}
            />
            <RecentRides rides={filteredRides.slice(0, 3)} onViewAll={() => setActiveTab('rides')} />
          </>
        ) : activeTab === 'rides' ? (
          <>
            <View style={styles.filterContainer}>
              <Text style={styles.sectionTitle}>Ride History</Text>
              <View style={styles.filterButtons}>
                <TouchableOpacity 
                  style={[styles.filterButton, statusFilter === 'all' && styles.filterButtonActive]}
                  onPress={() => setStatusFilter('all')}
                >
                  <Text style={[styles.filterButtonText, statusFilter === 'all' && styles.filterButtonTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterButton, statusFilter === 'completed' && styles.filterButtonActive]}
                  onPress={() => setStatusFilter('completed')}
                >
                  <Text style={[styles.filterButtonText, statusFilter === 'completed' && styles.filterButtonTextActive]}>Completed</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterButton, statusFilter === 'cancelled' && styles.filterButtonActive]}
                  onPress={() => setStatusFilter('cancelled')}
                >
                  <Text style={[styles.filterButtonText, statusFilter === 'cancelled' && styles.filterButtonTextActive]}>Cancelled</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.historyList}>
              {filteredRides.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="inbox" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyStateText}>No rides found</Text>
                  <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
                </View>
              ) : (
                filteredRides.map((ride) => {
                const config = SERVICE_CONFIG[ride.serviceType];
                return (
                  <TouchableOpacity key={ride.id} style={styles.historyCard} activeOpacity={0.7}>
                    <View style={styles.historyHeader}>
                      <View style={[styles.historyIcon, { backgroundColor: config.bgColor }]}>
                        <Icon name={config.icon} size={20} color={config.color} />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyDate}>{ride.date} • {ride.time}</Text>
                        <Text style={styles.historyType}>{config.label}</Text>
                      </View>
                      <View style={styles.historyFare}>
                        <Text style={[
                          styles.historyFareAmount,
                          ride.status === 'cancelled' && styles.fareCancelled
                        ]}>
                          {ride.status === 'cancelled' ? 'Cancelled' : `₹${ride.fare}`}
                        </Text>
                        {ride.status === 'completed' && (
                          <Text style={styles.historyPayment}>{ride.paymentMethod}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.historyRoute}>
                      <View style={styles.historyRouteRow}>
                        <Icon name="circle" size={10} color="#10B981" />
                        <Text style={styles.historyLocation} numberOfLines={1}>{ride.pickup}</Text>
                      </View>
                      <View style={styles.historyRouteRow}>
                        <Icon name="map-pin" size={10} color="#EF4444" />
                        <Text style={styles.historyLocation} numberOfLines={1}>{ride.dropoff}</Text>
                      </View>
                    </View>
                    <View style={styles.historyFooter}>
                      <Text style={styles.historyDistance}>{ride.distance} • {ride.duration}</Text>
                      {ride.customerRating && (
                        <View style={styles.historyRating}>
                          <Icon name="star" size={12} color="#F59E0B" />
                          <Text style={styles.historyRatingText}>{ride.customerRating}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }))}
            </View>
          </>
        ) : activeTab === 'earnings' ? (
          <>
            <View style={styles.earningsSummaryCard}>
              <Text style={styles.earningsSummaryTitle}>Monthly Earnings</Text>
              <View style={styles.earningsSummaryAmount}>
                <Text style={styles.earningsSummaryRupee}>₹</Text>
                <Text style={styles.earningsSummaryValue}>
                  {MOCK_EARNINGS_SUMMARY.thisMonth.toLocaleString()}
                </Text>
              </View>
              <View style={styles.earningsSummaryStats}>
                <View style={styles.earningsSummaryStatItem}>
                  <Text style={styles.earningsSummaryStatLabel}>Total Rides</Text>
                  <Text style={styles.earningsSummaryStatValue}>
                    {MOCK_EARNINGS_SUMMARY.monthRides}
                  </Text>
                </View>
                <View style={styles.earningsSummaryStatItem}>
                  <Text style={styles.earningsSummaryStatLabel}>Avg Per Ride</Text>
                  <Text style={styles.earningsSummaryStatValue}>
                    ₹{MOCK_EARNINGS_SUMMARY.avgPerRide}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.earningsPeriodCard}>
              <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
              <View style={styles.earningsPeriodRow}>
                <View style={styles.earningsPeriodItem}>
                  <Text style={styles.earningsPeriodLabel}>Today</Text>
                  <Text style={styles.earningsPeriodValue}>
                    ₹{MOCK_EARNINGS_SUMMARY.today.toLocaleString()}
                  </Text>
                  <Text style={styles.earningsPeriodRides}>
                    {MOCK_EARNINGS_SUMMARY.todayRides} rides
                  </Text>
                </View>
                <View style={styles.earningsPeriodDivider} />
                <View style={styles.earningsPeriodItem}>
                  <Text style={styles.earningsPeriodLabel}>This Week</Text>
                  <Text style={styles.earningsPeriodValue}>
                    ₹{MOCK_EARNINGS_SUMMARY.thisWeek.toLocaleString()}
                  </Text>
                  <Text style={styles.earningsPeriodRides}>
                    {MOCK_EARNINGS_SUMMARY.weekRides} rides
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.earningsByServiceCard}>
              <Text style={styles.sectionTitle}>By Service Type</Text>
              {Object.entries(MOCK_EARNINGS_SUMMARY.byServiceType).map(([type, data]) => {
                const config = SERVICE_CONFIG[type as ServiceType];
                return (
                  <View key={type} style={styles.serviceEarningRow}>
                    <View style={styles.serviceEarningLeft}>
                      <View style={[styles.serviceEarningIcon, { backgroundColor: config.bgColor }]}>
                        <Icon name={config.icon} size={16} color={config.color} />
                      </View>
                      <View>
                        <Text style={styles.serviceEarningType}>{config.label}</Text>
                        <Text style={styles.serviceEarningRides}>{data.rides} rides</Text>
                      </View>
                    </View>
                    <Text style={styles.serviceEarningAmount}>₹{data.amount.toLocaleString()}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.dailyEarningsCard}>
              <Text style={styles.sectionTitle}>Last 7 Days</Text>
              <View style={styles.dailyEarningsChart}>
                {MOCK_DAILY_EARNINGS.map((day, index) => {
                  const maxAmount = Math.max(...MOCK_DAILY_EARNINGS.map(d => d.amount));
                  const height = (day.amount / maxAmount) * 120;
                  return (
                    <View key={day.date} style={styles.dailyEarningsBar}>
                      <View style={styles.dailyEarningsBarContainer}>
                        <View
                          style={[
                            styles.dailyEarningsBarFill,
                            { height, backgroundColor: index === MOCK_DAILY_EARNINGS.length - 1 ? '#2563EB' : '#CBD5E1' }
                          ]}
                        />
                      </View>
                      <Text style={styles.dailyEarningsDay}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })[0]}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        ) : activeTab === 'notifications' ? (
          <>
            <View style={styles.notificationsHeader}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <TouchableOpacity
                onPress={() => {
                  setNotifications(notifications.map(n => ({ ...n, read: true })));
                }}
              >
                <Text style={styles.markAllReadText}>Mark all read</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.notificationsList}>
              {notifications.map((notification) => {
                const getNotificationIcon = (type: NotificationType) => {
                  switch (type) {
                    case 'payment': return 'dollar-sign';
                    case 'promo': return 'gift';
                    case 'ride_request': return 'navigation';
                    case 'alert': return 'alert-circle';
                    case 'system': return 'settings';
                  }
                };

                const getNotificationColor = (type: NotificationType) => {
                  switch (type) {
                    case 'payment': return '#10B981';
                    case 'promo': return '#F59E0B';
                    case 'ride_request': return '#2563EB';
                    case 'alert': return '#EF4444';
                    case 'system': return '#64748B';
                  }
                };

                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      !notification.read && styles.notificationCardUnread
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setNotifications(notifications.map(n =>
                        n.id === notification.id ? { ...n, read: true } : n
                      ));
                    }}
                  >
                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: `${getNotificationColor(notification.type)}20` }
                      ]}
                    >
                      <Icon
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        {!notification.read && <View style={styles.notificationDot} />}
                      </View>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    {notification.amount && (
                      <Text style={styles.notificationAmount}>₹{notification.amount}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : activeTab === 'profile' ? (
          <View style={styles.profileContainer}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitials}>RK</Text>
            </View>
            <Text style={styles.profileName}>Rajesh Kumar</Text>
            <Text style={styles.profileSince}>Partner since Jan 2023</Text>
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Icon name="star" size={16} color="#F59E0B" />
                <Text style={styles.profileStatText}>4.8 Rating</Text>
              </View>
              <View style={styles.profileStat}>
                <Icon name="zap" size={16} color="#2563EB" />
                <Text style={styles.profileStatText}>Gold Partner</Text>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Ride Request Modal */}
      <RideRequestModal
        visible={showRideRequest && isOnline && !activeRide}
        ride={pendingRide}
        onAccept={handleAcceptRide}
        onDecline={handleDeclineRide}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={unreadCount}
      />
    </SafeAreaView>
  );
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGreeting: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  headerName: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: '700',
  },
  toggleContainer: {
    width: 64,
    height: 36,
    borderRadius: 18,
    padding: 2,
  },
  toggleThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusBanner: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  statusText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 6,
  },
  locationLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  earningsCard: {
    backgroundColor: '#2563EB',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#BFDBFE',
    fontWeight: '500',
    marginBottom: 8,
  },
  earningsAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  rupeeSymbol: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '700',
    marginTop: 4,
  },
  earningsValue: {
    fontSize: 48,
    color: '#FFF',
    fontWeight: '700',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    height: 32,
  },
  trendingText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '700',
  },
  earningsStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statValue: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#BFDBFE',
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statCardValue: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 2,
  },
  statCardLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1,
  },
  serviceContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 16,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceButton: {
    width: (width - 72) / 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  recentRidesContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '700',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  rideIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideInfo: {
    flex: 1,
  },
  rideDestination: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  rideMetaRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  rideMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  rideRight: {
    alignItems: 'flex-end',
  },
  rideFare: {
    fontSize: 14,
    fontWeight: '700',
  },
  fareCompleted: {
    color: '#10B981',
  },
  fareCancelled: {
    color: '#EF4444',
  },
  rideRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  rideRequestCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 60,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  requestHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestType: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1,
  },
  requestDistance: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 2,
  },
  requestFare: {
    alignItems: 'flex-end',
  },
  requestFareAmount: {
    fontSize: 32,
    color: '#2563EB',
    fontWeight: '700',
  },
  requestETA: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  requestRoute: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: 'row',
    gap: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  routeText: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginLeft: 5,
    marginVertical: 8,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
  liveRideContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 224,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    marginBottom: 16,
    position: 'relative',
  },
  mapContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  stageIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  stageBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  stageBarActive: {
    backgroundColor: '#2563EB',
  },
  rideInfoCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  rideInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rideInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rideInfoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideInfoType: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1,
  },
  rideInfoDistance: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 2,
  },
  rideInfoRight: {
    alignItems: 'flex-end',
  },
  rideInfoFare: {
    fontSize: 32,
    color: '#2563EB',
    fontWeight: '700',
  },
  rideInfoPayment: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  liveRoute: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  liveRoutePoint: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
  },
  liveRouteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  liveRouteDotActive: {
    backgroundColor: '#2563EB',
  },
  liveRouteText: {
    flex: 1,
  },
  liveRouteLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  liveRouteAddress: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  liveRouteETA: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    position: 'absolute',
    right: 0,
    top: 4,
  },
  liveRouteLine: {
    width: 2,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginLeft: 5,
    marginVertical: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  otpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otpLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  otpCode: {
    fontSize: 32,
    color: '#2563EB',
    fontWeight: '700',
    letterSpacing: 4,
  },
  customerCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
  },
  customerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  customerRatingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  customerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  customerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelRideButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelRideText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '700',
  },
  arrivedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  arrivedButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
  startTripButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10B981',
  },
  startTripButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  completeButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  profileAvatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileInitials: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: '700',
  },
  profileName: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '700',
  },
  profileSince: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  profileStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileStatText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBadgeText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: '700',
  },
  navIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
  },
  navLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#2563EB',
  },
  // History Tab Styles
  filterContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  historyType: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 2,
  },
  historyFare: {
    alignItems: 'flex-end',
  },
  historyFareAmount: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: '700',
  },
  historyPayment: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  historyRoute: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  historyRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  historyLocation: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDistance: {
    fontSize: 12,
    color: '#64748B',
  },
  historyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyRatingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '700',
  },
  // Earnings Tab Styles
  earningsSummaryCard: {
    backgroundColor: '#2563EB',
    borderRadius: 24,
    padding: 24,
  },
  earningsSummaryTitle: {
    fontSize: 14,
    color: '#BFDBFE',
    fontWeight: '500',
    marginBottom: 12,
  },
  earningsSummaryAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  earningsSummaryRupee: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: '700',
    marginRight: 4,
  },
  earningsSummaryValue: {
    fontSize: 48,
    color: '#FFF',
    fontWeight: '700',
  },
  earningsSummaryStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 20,
  },
  earningsSummaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsSummaryStatLabel: {
    fontSize: 12,
    color: '#BFDBFE',
    marginBottom: 8,
  },
  earningsSummaryStatValue: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '700',
  },
  earningsPeriodCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  earningsPeriodRow: {
    flexDirection: 'row',
  },
  earningsPeriodItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsPeriodLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  earningsPeriodValue: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 4,
  },
  earningsPeriodRides: {
    fontSize: 12,
    color: '#64748B',
  },
  earningsPeriodDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  earningsByServiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  serviceEarningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  serviceEarningLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceEarningIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEarningType: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  serviceEarningRides: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  serviceEarningAmount: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '700',
  },
  dailyEarningsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dailyEarningsChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  dailyEarningsBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dailyEarningsBarContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120,
  },
  dailyEarningsBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  dailyEarningsDay: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 8,
  },
  // Notifications Tab Styles
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  markAllReadText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notificationCardUnread: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
    flex: 1,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  notificationAmount: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '700',
    marginLeft: 8,
  },
  // Empty State Styles
  emptyState: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
});

export default DriverDashboard;