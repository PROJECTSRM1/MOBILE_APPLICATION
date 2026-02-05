import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Health: undefined;
  MyBookings: undefined;
  ProfileInformation: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HealthcareBottomNavProps {
  activeTab: 'home' | 'bookings' | 'records' | 'profile';
  onNavigate?: (tab: 'home' | 'bookings' | 'records' | 'profile') => void;
}

const HealthcareBottomNav: React.FC<HealthcareBottomNavProps> = ({ 
  activeTab, 
  onNavigate 
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleTabPress = (tab: 'home' | 'bookings' | 'records' | 'profile') => {
    // Call the optional onNavigate callback
    if (onNavigate) {
      onNavigate(tab);
    }
    
    // Navigate to the appropriate screen
    switch (tab) {
      case 'home':
        navigation.navigate('Health');
        break;
      case 'bookings':
        navigation.navigate('MyBookings');
        break;
      case 'profile':
        navigation.navigate('ProfileInformation');
        break;
      case 'records':
        // Alert handled by onNavigate
        break;
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={activeTab === 'home' ? styles.navItemActive : styles.navItem}
        onPress={() => handleTabPress('home')}
      >
        <Icon 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? '#2d7576' : '#9ca3af'} 
        />
        <Text style={activeTab === 'home' ? styles.navTextActive : styles.navText}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={activeTab === 'bookings' ? styles.navItemActive : styles.navItem}
        onPress={() => handleTabPress('bookings')}
      >
        <Icon 
          name="calendar-today" 
          size={24} 
          color={activeTab === 'bookings' ? '#2d7576' : '#9ca3af'} 
        />
        <Text style={activeTab === 'bookings' ? styles.navTextActive : styles.navText}>
          Bookings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={activeTab === 'records' ? styles.navItemActive : styles.navItem}
        onPress={() => handleTabPress('records')}
      >
        <Icon 
          name="folder-open" 
          size={24} 
          color={activeTab === 'records' ? '#2d7576' : '#9ca3af'} 
        />
        <Text style={activeTab === 'records' ? styles.navTextActive : styles.navText}>
          Records
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={activeTab === 'profile' ? styles.navItemActive : styles.navItem}
        onPress={() => handleTabPress('profile')}
      >
        <Icon 
          name="person" 
          size={24} 
          color={activeTab === 'profile' ? '#2d7576' : '#9ca3af'} 
        />
        <Text style={activeTab === 'profile' ? styles.navTextActive : styles.navText}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default HealthcareBottomNav;