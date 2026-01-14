import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  TransportComingSoon: undefined;
  Landing: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TransportComingSoon() {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNotifyMe = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      // Navigate to landing page after modal closes
      navigation.navigate('Landing');
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transport</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Image Container with Glow */}
        <View style={styles.imageContainer}>
          <View style={styles.glowEffect} />
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP9J7xsKWutQw3pMRUcNHmRJDTuht-jY9CvBwJUWUv0BqJMxfGPqALLu8NZJlujJzO0ifId9guLzN_XkYIfueqMs1py878IFcpg_gOTyER1cW_iq1G34cUubaTWDq9oY9YTgV9Ex2GZKSnQ9FByeGQXCyBbSFD3_s577UfWOQGWORTBRbohgWJSrCNV-fqI1SyiYi_2KbnsPLF-K3BcZOVbOZ-lPb1GyPOCxcAqo5CclICs6jnyAHWJeXFyMJr3dXbNiUH8FbJB-Q',
            }}
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.headlineText}>Coming Soon</Text>
          <Text style={styles.subtitleText}>NEW FEATURE IN PROGRESS</Text>
          <Text style={styles.bodyText}>
            We're working on something revolutionary to move you and your goods
            faster. Stay tuned for the ultimate transport experience!
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotInactive]} />
          <View style={[styles.progressDot, styles.progressDotInactive]} />
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.notifyButton}
          onPress={handleNotifyMe}
          activeOpacity={0.8}
        >
          <Icon name="notifications-active" size={24} color="#fff" />
          <Text style={styles.notifyButtonText}>Notify Me</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon name="check-circle" size={48} color="#135bec" />
            </View>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>
              We will notify you once transport is ready.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 48,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width - 48,
    maxWidth: 400,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: '75%',
    height: '75%',
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    borderRadius: 9999,
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 80,
    elevation: 10,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  headlineText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#135bec',
    letterSpacing: 3,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: '#9da6b9',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: '#135bec',
  },
  progressDotInactive: {
    backgroundColor: 'rgba(19, 91, 236, 0.4)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  notifyButton: {
    backgroundColor: '#135bec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a2332',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width - 64,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(19, 91, 236, 0.2)',
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  modalMessage: {
    fontSize: 16,
    color: '#9da6b9',
    textAlign: 'center',
    lineHeight: 22,
  },
});