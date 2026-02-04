import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';


// TypeScript Interface
interface Bus {
  id: number;
  number: string;
  name: string;
  driver: string;
  status: 'MOVING' | 'IDLE' | 'OFF-ROUTE';
  statusColor: string;
  location: string;
  iconBg: string;
  iconColor: string;
  icon: string;
  borderColor: string;
  speed: string;
  speedChange: string;
  nextStop: string;
  eta: string;
  highlight?: boolean;
  alert?: boolean;
}

interface BusAlert {
  id: number;
  bus_id: string;
  alert_type: string;
  alert_message: string;
  alert_time: string;
  resolved: boolean;
  is_active: boolean;
}

type FilterType = 'ALL' | 'MOVING' | 'IDLE' | 'OFF-ROUTE';

const BusTrackingScreen = () => {
  // ============================================
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL
  // NEVER CONDITIONALLY OR INSIDE CALLBACKS
  // ============================================
  
  // 1. Navigation hook MUST come first
  const navigation = useNavigation<any>();
  
  // 2. Context hooks - useTheme MUST be called unconditionally
  const theme = useTheme();
  const { colors, lightMode } = theme;
  
  // 3. All useState hooks
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showMapView, setShowMapView] = useState<boolean>(false);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [busData, setBusData] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<BusAlert[]>([]);
  const [showAlertsModal, setShowAlertsModal] = useState<boolean>(false);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isMapCentered, setIsMapCentered] = useState<boolean>(true);

  // 4. useCallback hooks - fetchBusData
  const fetchBusData = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      
      const response = await api.get('/institution/management/bus-fleet/get-all-buses');
      
      // Get theme values inside the callback
      const currentLightMode = theme.lightMode;
      const currentColors = theme.colors;
      
      // Transform API response to match our Bus interface
      const transformedData: Bus[] = response.data.map((bus: any, index: number) => {
        const randomStatus = Math.random();
        let status: 'MOVING' | 'IDLE' | 'OFF-ROUTE' = 'IDLE';
        let statusColor = '#f59e0b';
        let iconBg = currentLightMode ? '#fef3c7' : '#78350f';
        let iconColor = '#f59e0b';
        let borderColor = currentColors.border;
        let alert = false;
        
        if (randomStatus > 0.6) {
          status = 'MOVING';
          statusColor = currentColors.success;
          iconBg = currentLightMode ? '#dbeafe' : '#1e3a8a';
          iconColor = currentColors.primary;
        } else if (randomStatus > 0.4) {
          status = 'IDLE';
          statusColor = '#f59e0b';
          iconBg = currentLightMode ? '#fef3c7' : '#78350f';
          iconColor = '#f59e0b';
        } else {
          status = 'OFF-ROUTE';
          statusColor = currentColors.danger;
          iconBg = currentLightMode ? '#fee2e2' : '#7f1d1d';
          iconColor = currentColors.danger;
          borderColor = currentLightMode ? '#fecaca' : '#991b1b';
          alert = true;
        }
        
        const locations = [
          'North Main St • 2.4 miles away',
          'East Gate Terminal • Stationary',
          'Arriving at Main Campus',
          'Central Expressway • In Transit',
          'Unknown Location • GPS Lag',
        ];
        
        const speeds = ['35 mph', '28 mph', '0 mph', '42 mph', '15 mph'];
        const speedChanges = ['+5 mph from avg', '+2 mph from avg', 'Stationary', '+8 mph from avg', 'GPS Error'];
        const nextStops = ['Maple Avenue', 'Main Terminal', 'Main Campus', 'Express Terminal', 'Unknown'];
        const etas = ['4 mins', '10 mins', '2 mins', '6 mins', 'N/A'];
        
        return {
          id: bus.id,
          number: bus.bus_id,
          name: bus.bus_name,
          driver: bus.driver_name || 'Not Assigned',
          status,
          statusColor,
          location: status === 'OFF-ROUTE' ? 'Unknown Location • GPS Lag' : locations[index % locations.length],
          iconBg,
          iconColor,
          icon: status === 'OFF-ROUTE' ? '⚠️' : '🚌',
          borderColor,
          speed: status === 'IDLE' ? '0 mph' : speeds[index % speeds.length],
          speedChange: status === 'IDLE' ? 'Stationary' : speedChanges[index % speedChanges.length],
          nextStop: status === 'OFF-ROUTE' ? 'Unknown' : nextStops[index % nextStops.length],
          eta: status === 'OFF-ROUTE' ? 'N/A' : etas[index % etas.length],
          highlight: index === 2,
          alert,
        };
      });
      
      setBusData(transformedData);
    } catch (error: any) {
      console.error('Error fetching bus data:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch bus data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [theme]);

  // 5. useEffect hooks
  useEffect(() => {
    fetchBusData();
    fetchAlertsCount();
  }, [fetchBusData]);

  // ============================================
  // REGULAR FUNCTIONS (NOT HOOKS)
  // ============================================

  const fetchAlertsCount = async () => {
    try {
      const response = await api.get('/institution/management/bus/alerts');
      
      if (response.data && Array.isArray(response.data)) {
        setAlerts(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching alerts count:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBusData(true);
  };

  const fetchAlerts = async () => {
    try {
      setLoadingAlerts(true);
      setShowAlertsModal(true);
      
      const response = await api.get('/institution/management/bus/alerts');
      
      let alertsData = response.data;
      
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        if (response.data.data) {
          alertsData = response.data.data;
        } else if (response.data.alerts) {
          alertsData = response.data.alerts;
        } else if (response.data.results) {
          alertsData = response.data.results;
        }
      }
      
      if (!alertsData || !Array.isArray(alertsData)) {
        setAlerts([]);
        return;
      }
      
      const sortedAlerts = [...alertsData].sort((a: BusAlert, b: BusAlert) => {
        const dateA = new Date(a.alert_time).getTime();
        const dateB = new Date(b.alert_time).getTime();
        return dateB - dateA;
      });
      
      setAlerts(sortedAlerts);
    } catch (error: any) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to fetch alerts. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleAlertsPress = () => {
    fetchAlerts();
  };

  const filteredBuses = busData.filter((bus) => {
    const matchesFilter = activeFilter === 'ALL' || bus.status === activeFilter;
    const matchesSearch = 
      bus.number.toLowerCase().includes(searchText.toLowerCase()) ||
      bus.name.toLowerCase().includes(searchText.toLowerCase()) ||
      bus.driver.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBusPress = (bus: Bus): void => {
    setSelectedBus(bus);
    setShowMapView(true);
  };

  const handleCloseMapView = (): void => {
    setShowMapView(false);
    setTimeout(() => setSelectedBus(null), 300);
  };

  const handleFilterSelect = (filter: FilterType): void => {
    setActiveFilter(filter);
    setShowFilterMenu(false);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleViewMap = (): void => {
    if (busData.length > 0) {
      setSelectedBus(busData[0]);
      setShowMapView(true);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
    setIsMapCentered(false);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    setIsMapCentered(false);
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    setIsMapCentered(true);
    setTimeout(() => {
      Alert.alert('Map Recentered', 'Map view has been reset to center position');
    }, 100);
  };

  const handleContactDriver = () => {
    if (selectedBus) {
      Alert.alert(
        'Contact Driver',
        `Do you want to call ${selectedBus.driver}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Call',
            onPress: () => {
              const phoneNumber = 'tel:+1234567890';
              Linking.openURL(phoneNumber).catch(err => {
                Alert.alert('Error', 'Unable to make phone call');
              });
            }
          }
        ]
      );
    }
  };

  const otherBuses: Bus[] = busData.filter(b => b.id !== selectedBus?.id);
  const activeBusCount = busData.filter(b => b.status === 'MOVING').length;
  const totalBusCount = busData.length;
  const alertCount = alerts.length > 0 ? alerts.filter(a => a.is_active && !a.resolved).length : busData.filter(b => b.alert).length;

  // ============================================
  // RENDER LOGIC
  // ============================================

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <StatusBar 
          barStyle={lightMode ? 'dark-content' : 'light-content'} 
          backgroundColor={colors.background} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading bus data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderListView = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar 
        barStyle={lightMode ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.background} 
      />

      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bus Tracking Status</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowFilterMenu(true)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="filter-list" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <MaterialIcons name="search" size={20} color={colors.placeholder} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by bus number or driver..."
            placeholderTextColor={colors.placeholder}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} activeOpacity={0.7}>
              <MaterialIcons name="close" size={20} color={colors.placeholder} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.subText }]}>ACTIVE</Text>
              <View style={styles.activeDot} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {activeBusCount} / <Text style={[styles.statValueGray, { color: colors.subText }]}>{totalBusCount}</Text>
            </Text>
            <View style={[styles.progressBar, { backgroundColor: lightMode ? '#e2e8f0' : '#1e293b' }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${totalBusCount > 0 ? (activeBusCount / totalBusCount) * 100 : 0}%` }]} />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleAlertsPress}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.subText }]}>ALERTS</Text>
              <MaterialIcons name="warning" size={16} color="#f59e0b" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>0{alertCount}</Text>
            <Text style={[styles.statSubtext, { color: colors.subText }]}>REQUIRE ATTENTION</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fleetSection}>
          <View style={styles.fleetHeader}>
            <Text style={[styles.fleetTitle, { color: colors.text }]}>Fleet Status</Text>
          </View>

          {activeFilter !== 'ALL' && (
            <View style={styles.filterActiveContainer}>
              <Text style={[styles.filterActiveText, { color: colors.subText }]}>
                Filtered by: {activeFilter}
              </Text>
              <TouchableOpacity onPress={() => setActiveFilter('ALL')} activeOpacity={0.7}>
                <MaterialIcons name="close" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.busList}>
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <TouchableOpacity
                  key={bus.id}
                  style={[
                    styles.busCard,
                    { backgroundColor: colors.card, borderColor: bus.borderColor },
                    bus.alert && styles.busCardAlert,
                  ]}
                  onPress={() => handleBusPress(bus)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.busIconContainer,
                      { backgroundColor: bus.iconBg },
                    ]}
                  >
                    <MaterialCommunityIcons 
                      name="bus" 
                      size={32} 
                      color={bus.iconColor}
                    />
                  </View>

                  <View style={styles.busInfo}>
                    <View style={styles.busHeader}>
                      <Text style={[styles.busTitle, { color: colors.text }]}>
                        Bus #{bus.number} - {bus.name}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              bus.status === 'MOVING'
                                ? lightMode ? '#d1fae5' : '#064e3b'
                                : bus.status === 'IDLE'
                                ? lightMode ? '#fef3c7' : '#78350f'
                                : lightMode ? '#fee2e2' : '#7f1d1d',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: bus.statusColor },
                          ]}
                        >
                          {bus.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.locationContainer}>
                      <MaterialIcons 
                        name={bus.alert ? 'location-off' : bus.highlight ? 'school' : 'location-on'} 
                        size={16} 
                        color={bus.highlight ? colors.primary : colors.subText} 
                      />
                      <Text
                        style={[
                          styles.locationText,
                          { color: colors.subText },
                          bus.highlight && { color: colors.primary, fontWeight: '500' },
                        ]}
                      >
                        {bus.location}
                      </Text>
                    </View>
                  </View>

                  <MaterialIcons name="chevron-right" size={24} color={colors.subText} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="search-off" size={48} color={colors.subText} />
                <Text style={[styles.emptyStateText, { color: colors.subText }]}>
                  No buses found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Alerts Modal */}
      <Modal
        visible={showAlertsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAlertsModal(false)}
      >
        <View style={styles.alertsModalOverlay}>
          <View style={[styles.alertsModalContent, { backgroundColor: colors.background }]}>
            <View style={styles.alertsModalHeader}>
              <View style={styles.alertsHeaderLeft}>
                <MaterialIcons name="warning" size={24} color="#f59e0b" />
                <View>
                  <Text style={[styles.alertsModalTitle, { color: colors.text }]}>Bus Alerts</Text>
                  {!loadingAlerts && (
                    <Text style={[styles.alertsCount, { color: colors.subText }]}>
                      {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => setShowAlertsModal(false)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {loadingAlerts ? (
              <View style={styles.alertsLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.alertsLoadingText, { color: colors.text }]}>Loading alerts...</Text>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {alerts && alerts.length > 0 ? (
                  <ScrollView 
                    contentContainerStyle={styles.alertsScrollViewContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {alerts.map((alert, index) => {
                      let formattedDate = 'Invalid Date';
                      let formattedTime = 'Invalid Time';
                      
                      try {
                        const alertDate = new Date(alert.alert_time);
                        formattedDate = alertDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                        formattedTime = alertDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                      } catch (e) {
                        console.error('Date parsing error:', e);
                      }

                      return (
                        <View 
                          key={`alert-${alert.id}-${index}`}
                          style={[
                            styles.alertCard,
                            { 
                              backgroundColor: colors.card, 
                              borderColor: alert.resolved ? colors.border : '#f59e0b',
                              opacity: alert.resolved ? 0.6 : 1,
                            }
                          ]}
                        >
                          <View style={styles.alertCardHeader}>
                            <View style={styles.alertBusInfo}>
                              <MaterialCommunityIcons 
                                name="bus-alert" 
                                size={20} 
                                color={alert.resolved ? colors.success : '#f59e0b'} 
                              />
                              <Text style={[styles.alertBusId, { color: colors.text }]}>
                                Bus #{alert.bus_id}
                              </Text>
                            </View>
                            <View style={[
                              styles.alertTypeBadge,
                              { 
                                backgroundColor: alert.alert_type === 'delay' 
                                  ? lightMode ? '#fef3c7' : '#78350f'
                                  : lightMode ? '#fee2e2' : '#7f1d1d'
                              }
                            ]}>
                              <Text style={[
                                styles.alertTypeText,
                                { 
                                  color: alert.alert_type === 'delay' ? '#f59e0b' : colors.danger 
                                }
                              ]}>
                                {alert.alert_type.toUpperCase()}
                              </Text>
                            </View>
                          </View>

                          <Text style={[styles.alertMessage, { color: colors.text }]}>
                            {alert.alert_message}
                          </Text>

                          <View style={styles.alertFooter}>
                            <View style={styles.alertTimeContainer}>
                              <MaterialIcons name="access-time" size={14} color={colors.subText} />
                              <Text style={[styles.alertTime, { color: colors.subText }]}>
                                {formattedDate} at {formattedTime}
                              </Text>
                            </View>
                            {alert.resolved && (
                              <View style={styles.resolvedBadge}>
                                <MaterialIcons name="check-circle" size={14} color={colors.success} />
                                <Text style={[styles.resolvedText, { color: colors.success }]}>
                                  Resolved
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View style={styles.noAlertsContainer}>
                    <MaterialIcons name="check-circle-outline" size={64} color={colors.success} />
                    <Text style={[styles.noAlertsTitle, { color: colors.text }]}>
                      All Clear!
                    </Text>
                    <Text style={[styles.noAlertsSubtitle, { color: colors.subText }]}>
                      No alerts found
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Menu Modal */}
      <Modal
        visible={showFilterMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterMenu(false)}
        >
          <View style={[styles.filterMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.filterMenuTitle, { color: colors.text }]}>Filter by Status</Text>
            
            <TouchableOpacity 
              style={[styles.filterMenuItem, activeFilter === 'ALL' && { backgroundColor: colors.primary + '20' }]}
              onPress={() => handleFilterSelect('ALL')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="select-all" size={20} color={colors.text} />
              <Text style={[styles.filterMenuText, { color: colors.text }]}>All Buses</Text>
              {activeFilter === 'ALL' && <MaterialIcons name="check" size={20} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterMenuItem, activeFilter === 'MOVING' && { backgroundColor: colors.primary + '20' }]}
              onPress={() => handleFilterSelect('MOVING')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="directions-bus" size={20} color={colors.success} />
              <Text style={[styles.filterMenuText, { color: colors.text }]}>Moving</Text>
              {activeFilter === 'MOVING' && <MaterialIcons name="check" size={20} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterMenuItem, activeFilter === 'IDLE' && { backgroundColor: colors.primary + '20' }]}
              onPress={() => handleFilterSelect('IDLE')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="pause-circle-outline" size={20} color="#f59e0b" />
              <Text style={[styles.filterMenuText, { color: colors.text }]}>Idle</Text>
              {activeFilter === 'IDLE' && <MaterialIcons name="check" size={20} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterMenuItem, activeFilter === 'OFF-ROUTE' && { backgroundColor: colors.primary + '20' }]}
              onPress={() => handleFilterSelect('OFF-ROUTE')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="error-outline" size={20} color={colors.danger} />
              <Text style={[styles.filterMenuText, { color: colors.text }]}>Off-Route</Text>
              {activeFilter === 'OFF-ROUTE' && <MaterialIcons name="check" size={20} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );

  const renderMapView = () => (
    <SafeAreaView style={[styles.mapContainer, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar 
        barStyle={lightMode ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={[styles.topNav, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleCloseMapView}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.navTitle, { color: colors.text }]}>Live Tracking</Text>
        
        <TouchableOpacity onPress={handleCloseMapView} activeOpacity={0.7}>
          <Text style={[styles.listViewButton, { color: colors.primary }]}>
            List View
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContent}>
        {/* Map Background with Zoom */}
        <View style={[styles.mapBackground, { transform: [{ scale: zoomLevel }] }]}>
          <View style={[styles.mapOverlay, { backgroundColor: lightMode ? 'rgba(255,255,255,0.3)' : 'rgba(16,25,34,0.4)' }]} />
          
          <View style={styles.mapGrid}>
            <Text style={[styles.mapLabel, { color: colors.subText }]}>West New</Text>
            <Text style={[styles.mapLabel, styles.mapLabelRight, { color: colors.subText }]}>City of New York</Text>
            <Text style={[styles.mapLabel, styles.mapLabelCenter, { color: colors.subText }]}>MANHATTAN</Text>
            <Text style={[styles.mapLabel, styles.mapLabelBottom, { color: colors.subText }]}>New York</Text>
          </View>

          {/* Selected Bus Pin */}
          {selectedBus && (
            <View style={[styles.busPin, styles.selectedBusPin]}>
              <View style={styles.busMarkerContainer}>
                <View style={[styles.busMarker, { backgroundColor: colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 }]}>
                  <MaterialCommunityIcons name="bus" size={28} color="#ffffff" />
                </View>
                <View style={styles.busLabelWrapper}>
                  <View style={[styles.busLabel, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                    <Text style={[styles.busLabelText, { color: colors.text }]}>
                      BUS-{selectedBus.number}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Other Buses */}
          {otherBuses.slice(0, 2).map((bus, index) => (
            <View 
              key={bus.id}
              style={[
                styles.busPin,
                index === 0 ? { top: '25%', right: '25%' } : { bottom: '33%', right: '33%' }
              ]}
            >
              <View style={[styles.busMarker, styles.inactiveBusMarker, { backgroundColor: colors.subText }]}>
                <MaterialCommunityIcons name="bus" size={20} color="#ffffff" style={{ opacity: 0.8 }} />
              </View>
            </View>
          ))}
        </View>

        {/* Search Bar - OUTSIDE scaled container */}
        <View style={[styles.searchBarMap, { backgroundColor: colors.card }]}>
          <MaterialIcons name="search" size={20} color={colors.placeholder} />
          <TextInput
            style={[styles.searchInputMap, { color: colors.text }]}
            placeholder="Search Bus ID or Route"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Zoom Controls - OUTSIDE scaled container */}
        <View style={styles.zoomControls}>
          <View style={styles.zoomButtonGroup}>
            <TouchableOpacity 
              style={[styles.zoomButton, styles.zoomButtonTop, { backgroundColor: colors.card }]}
              onPress={handleZoomIn}
              activeOpacity={0.7}
            >
              <MaterialIcons name="add" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={[styles.zoomDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity 
              style={[styles.zoomButton, styles.zoomButtonBottom, { backgroundColor: colors.card }]}
              onPress={handleZoomOut}
              activeOpacity={0.7}
            >
              <MaterialIcons name="remove" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.navigationButton, { backgroundColor: isMapCentered ? colors.primary : colors.card }]}
            onPress={handleRecenter}
            activeOpacity={0.7}
          >
            <MaterialIcons name="navigation" size={24} color={isMapCentered ? '#ffffff' : colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      {selectedBus && (
        <View style={[styles.bottomSheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={styles.bottomSheetHandle}>
            <View style={[styles.handle, { backgroundColor: colors.subText }]} />
          </View>

          <ScrollView 
            style={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <View style={[styles.driverAvatar, { borderColor: colors.primary, backgroundColor: lightMode ? '#e0f2fe' : colors.surface }]}>
                  <MaterialIcons name="person" size={40} color={colors.primary} />
                </View>
                
                <View style={styles.busDetails}>
                  <View style={styles.busNameRow}>
                    <Text style={[styles.busName, { color: colors.text }]}>
                      Bus-{selectedBus.number}
                    </Text>
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.driverName, { color: colors.subText }]}>
                    Driver: {selectedBus.driver}
                  </Text>
                  
                  <View style={styles.statusRow}>
                    <View style={styles.statusDot} />
                    <Text style={[styles.statusTextMap, { color: colors.success }]}>
                      {selectedBus.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={[styles.statCardMap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.statHeaderMap}>
                  <MaterialIcons name="speed" size={16} color={colors.subText} />
                  <Text style={[styles.statTitleMap, { color: colors.subText }]}>
                    CURRENT SPEED
                  </Text>
                </View>
                <Text style={[styles.statValueMap, { color: colors.text }]}>
                  {selectedBus.speed}
                </Text>
                <Text style={[styles.statSubtextMap, { color: colors.success }]}>
                  {selectedBus.speedChange}
                </Text>
              </View>

              <View style={[styles.statCardMap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.statHeaderMap}>
                  <MaterialIcons name="location-on" size={16} color={colors.subText} />
                  <Text style={[styles.statTitleMap, { color: colors.subText }]}>
                    NEXT STOP
                  </Text>
                </View>
                <Text style={[styles.statValueMap, styles.statValueSmaller, { color: colors.text }]} numberOfLines={1}>
                  {selectedBus.nextStop}
                </Text>
                <Text style={[styles.statSubtextMap, { color: colors.primary }]}>
                  ETA {selectedBus.eta}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.contactButton, { backgroundColor: colors.primary }]}
                onPress={handleContactDriver}
                activeOpacity={0.7}
              >
                <MaterialIcons name="call" size={20} color="#ffffff" />
                <Text style={styles.contactButtonText}>Contact Driver</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );

  return (
    <>
      {renderListView()}
      
      <Modal
        visible={showMapView}
        animationType="slide"
        onRequestClose={handleCloseMapView}
      >
        {renderMapView()}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchContainer: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statValueGray: {
    fontSize: 28,
    fontWeight: '700',
  },
  progressBar: {
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  statSubtext: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  fleetSection: {
    marginBottom: 100,
  },
  fleetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  fleetTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  filterActiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 12,
  },
  filterActiveText: {
    fontSize: 12,
    fontWeight: '500',
  },
  busList: {
    gap: 16,
  },
  busCard: {
    padding: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
  },
  busCardAlert: {
    borderWidth: 2,
  },
  busIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busInfo: {
    flex: 1,
    gap: 4,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  busTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 14,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  filterMenu: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  filterMenuTitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  filterMenuText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  alertsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  alertsModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  alertsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  alertsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertsModalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  alertsCount: {
    fontSize: 12,
    marginTop: 2,
  },
  alertsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  alertsLoadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  alertsScrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  alertCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  alertBusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertBusId: {
    fontSize: 16,
    fontWeight: '700',
  },
  alertTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertTypeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertTime: {
    fontSize: 12,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  resolvedText: {
    fontSize: 11,
    fontWeight: '600',
  },
  noAlertsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  noAlertsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  noAlertsSubtitle: {
    fontSize: 14,
  },
  mapContainer: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 30,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  listViewButton: {
    fontSize: 14,
    fontWeight: '700',
    width: 70,
    textAlign: 'right',
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d4d4d4',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
  },
  mapLabel: {
    fontSize: 12,
    fontWeight: '500',
    position: 'absolute',
  },
  mapLabelRight: {
    right: 20,
    top: 20,
  },
  mapLabelCenter: {
    top: '40%',
    left: '35%',
    fontSize: 14,
    fontWeight: '600',
  },
  mapLabelBottom: {
    bottom: '30%',
    right: '35%',
    fontSize: 16,
    fontWeight: '700',
  },
  busPin: {
    position: 'absolute',
    zIndex: 10,
  },
  selectedBusPin: {
    top: '40%',
    left: '30%',
  },
  busMarkerContainer: {
    alignItems: 'center',
  },
  busMarker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inactiveBusMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    opacity: 0.7,
  },
  busLabelWrapper: {
    marginTop: 8,
    alignItems: 'center',
  },
  busLabel: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  busLabelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchBarMap: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    gap: 12,
    zIndex: 20,
  },
  searchInputMap: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: 80,
    gap: 12,
    zIndex: 20,
  },
  zoomButtonGroup: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  zoomButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  zoomButtonBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  zoomDivider: {
    height: 1,
  },
  navigationButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    maxHeight: '65%',
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
    zIndex: 25,
  },
  bottomSheetHandle: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  bottomSheetContent: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  driverAvatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  busNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  busName: {
    fontSize: 20,
    fontWeight: '700',
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  liveBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  driverName: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusTextMap: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCardMap: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statHeaderMap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statTitleMap: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statValueMap: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statValueSmaller: {
    fontSize: 18,
  },
  statSubtextMap: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BusTrackingScreen;