import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


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

type FilterType = 'ALL' | 'MOVING' | 'IDLE' | 'OFF-ROUTE';

const BusTrackingScreen = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showMapView, setShowMapView] = useState<boolean>(false);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const { colors, lightMode } = useTheme();

  const busData: Bus[] = [
    {
      id: 1,
      number: '042',
      name: 'Alpha',
      driver: 'John Doe',
      status: 'MOVING',
      statusColor: colors.success,
      location: 'North Main St • 2.4 miles away',
      iconBg: lightMode ? '#dbeafe' : '#1e3a8a',
      iconColor: colors.primary,
      icon: '🚌',
      borderColor: colors.border,
      speed: '35 mph',
      speedChange: '+5 mph from avg',
      nextStop: 'Maple Avenue',
      eta: '4 mins',
    },
    {
      id: 2,
      number: '018',
      name: 'Bravo',
      driver: 'Sarah Smith',
      status: 'IDLE',
      statusColor: '#f59e0b',
      location: 'East Gate Terminal • Stationary',
      iconBg: lightMode ? '#fef3c7' : '#78350f',
      iconColor: '#f59e0b',
      icon: '🚌',
      borderColor: colors.border,
      speed: '0 mph',
      speedChange: 'Stationary',
      nextStop: 'Main Terminal',
      eta: '10 mins',
    },
    {
      id: 3,
      number: '109',
      name: 'Charlie',
      driver: 'Mike Johnson',
      status: 'MOVING',
      statusColor: colors.success,
      location: 'Arriving at Main Campus',
      iconBg: lightMode ? '#dbeafe' : '#1e3a8a',
      iconColor: colors.primary,
      icon: '🚌',
      borderColor: colors.border,
      highlight: true,
      speed: '28 mph',
      speedChange: '+2 mph from avg',
      nextStop: 'Main Campus',
      eta: '2 mins',
    },
    {
      id: 4,
      number: '007',
      name: 'Delta',
      driver: 'Tom Brown',
      status: 'OFF-ROUTE',
      statusColor: colors.danger,
      location: 'Unknown Location • GPS Lag',
      iconBg: lightMode ? '#fee2e2' : '#7f1d1d',
      iconColor: colors.danger,
      icon: '⚠️',
      borderColor: lightMode ? '#fecaca' : '#991b1b',
      alert: true,
      speed: '15 mph',
      speedChange: 'GPS Error',
      nextStop: 'Unknown',
      eta: 'N/A',
    },
    {
      id: 5,
      number: '055',
      name: 'Echo',
      driver: 'Lisa Davis',
      status: 'MOVING',
      statusColor: colors.success,
      location: 'Central Expressway • In Transit',
      iconBg: lightMode ? '#dbeafe' : '#1e3a8a',
      iconColor: colors.primary,
      icon: '🚌',
      borderColor: colors.border,
      speed: '42 mph',
      speedChange: '+8 mph from avg',
      nextStop: 'Express Terminal',
      eta: '6 mins',
    },
  ];

  // Filter and Search Logic
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
    // Select the first bus by default when opening map view
    if (busData.length > 0) {
      setSelectedBus(busData[0]);
      setShowMapView(true);
    }
  };

  // Other buses for map view
  const otherBuses: Bus[] = busData.filter(b => b.id !== selectedBus?.id);

  // Active bus count
  const activeBusCount = busData.filter(b => b.status === 'MOVING').length;
  const totalBusCount = busData.length;
  const alertCount = busData.filter(b => b.alert).length;

  // LIST VIEW COMPONENT
  const renderListView = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar 
        barStyle={lightMode ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.background} 
      />

      {/* Header */}
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
        {/* Search Bar */}
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

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Active Card */}
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.subText }]}>ACTIVE</Text>
              <View style={styles.activeDot} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {activeBusCount} / <Text style={[styles.statValueGray, { color: colors.subText }]}>{totalBusCount}</Text>
            </Text>
            <View style={[styles.progressBar, { backgroundColor: lightMode ? '#e2e8f0' : '#1e293b' }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(activeBusCount / totalBusCount) * 100}%` }]} />
            </View>
          </View>

          {/* Alerts Card */}
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.subText }]}>ALERTS</Text>
              <MaterialIcons name="warning" size={16} color="#f59e0b" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>0{alertCount}</Text>
            <Text style={[styles.statSubtext, { color: colors.subText }]}>REQUIRE ATTENTION</Text>
          </View>
        </View>

        {/* Fleet Status Section */}
        <View style={styles.fleetSection}>
          <View style={styles.fleetHeader}>
            <Text style={[styles.fleetTitle, { color: colors.text }]}>Fleet Status</Text>
          </View>

          {/* Filter Active Indicator */}
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

          {/* Bus List */}
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

  // MAP VIEW COMPONENT
  const renderMapView = () => (
    <SafeAreaView style={[styles.mapContainer, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar 
        barStyle={lightMode ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.background} 
      />
      
      {/* Top Navigation Bar */}
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

      {/* Map Container */}
      <View style={styles.mapContent}>
        {/* Map Background */}
        <View style={styles.mapBackground}>
          <View style={[styles.mapOverlay, { backgroundColor: lightMode ? 'rgba(255,255,255,0.3)' : 'rgba(16,25,34,0.4)' }]} />
          
          {/* Map Placeholder with Grid */}
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
                <View style={[styles.busMarker, { backgroundColor: colors.primary }]}>
                  <MaterialCommunityIcons name="bus" size={24} color="#ffffff" />
                </View>
                <View style={styles.busMarkerLine} />
                <View style={[styles.busLabel, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                  <Text style={[styles.busLabelText, { color: colors.text }]}>
                    BUS-{selectedBus.number}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Other Bus Pins */}
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

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
            <MaterialIcons name="search" size={20} color={colors.placeholder} style={styles.searchIconMap} />
            <TextInput
              style={[styles.searchInputMap, { color: colors.text }]}
              placeholder="Search Bus ID or Route"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <View style={styles.zoomButtonGroup}>
              <TouchableOpacity 
                style={[styles.zoomButton, styles.zoomButtonTop, { backgroundColor: colors.card }]}
                onPress={() => console.log('Zoom in')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add" size={24} color={colors.text} />
              </TouchableOpacity>
              <View style={[styles.zoomDivider, { backgroundColor: colors.border }]} />
              <TouchableOpacity 
                style={[styles.zoomButton, styles.zoomButtonBottom, { backgroundColor: colors.card }]}
                onPress={() => console.log('Zoom out')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="remove" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.navigationButton, { backgroundColor: colors.card }]}
              onPress={() => console.log('Center location')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="navigation" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      {selectedBus && (
        <View style={[styles.bottomSheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          {/* Handle */}
          <View style={styles.bottomSheetHandle}>
            <View style={[styles.handle, { backgroundColor: colors.subText }]} />
          </View>

          <ScrollView 
            style={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Bus Profile Header */}
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

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {/* Current Speed Card */}
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

              {/* Next Stop Card */}
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

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.contactButton, { backgroundColor: colors.primary }]}
                onPress={() => console.log('Contact driver:', selectedBus.driver)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="call" size={20} color="#ffffff" />
                <Text style={styles.contactButtonText}>Contact Driver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.moreButton, { backgroundColor: colors.surface }]}
                onPress={() => console.log('More options')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="more-horiz" size={24} color={colors.text} />
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
      
      {/* Map View Modal */}
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
  // LIST VIEW STYLES
  container: {
    flex: 1,
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
  viewMapButton: {
    fontSize: 14,
    fontWeight: '600',
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
//   bottomNav: {
//     borderTopWidth: 1,
//     paddingHorizontal: 24,
//     paddingTop: 12,
//     paddingBottom: Platform.OS === 'ios' ? 0 : 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   navItem: {
//     alignItems: 'center',
//     gap: 4,
//   },
//   navLabelInactive: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   navLabelActive: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
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

  // MAP VIEW STYLES
  mapContainer: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 20,
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
    flex: 1,
    backgroundColor: '#d4d4d4',
    position: 'relative',
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
  busMarkerLine: {
    width: 4,
    height: 12,
    backgroundColor: '#ffffff',
  },
  busLabel: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  busLabelText: {
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
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
    elevation: 5,
  },
  searchIconMap: {
    marginRight: 12,
  },
  searchInputMap: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: 80,
    gap: 12,
  },
  zoomButtonGroup: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
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
    elevation: 5,
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
    elevation: 10,
    maxHeight: '65%',
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
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
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  contactButton: {
    flex: 1,
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
  moreButton: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
});

export default BusTrackingScreen;