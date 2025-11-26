import React, { useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <SplashScreen />
    </SafeAreaProvider>
  );
}

function SplashScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  // Animations
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const scaleLogo = useRef(new Animated.Value(0.8)).current;
  const shineAnim = useRef(new Animated.Value(-1)).current;
  const fadeText = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo Fade-in and Scale-up Sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeLogo, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(scaleLogo, {
          toValue: 1,
          friction: 4,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeText, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Shine animation across the logo (optional subtle premium effect)
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate shine position
  const shineTranslate = shineAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#073e6c', '#1b4f8c', '#071e4d']}
        style={StyleSheet.absoluteFill}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: fadeLogo,
            transform: [{ scale: scaleLogo }],
            marginTop: safeAreaInsets.top,
          },
        ]}
      >
        <Image
          source={require('./assets/logo/swachlogo.png')}
          style={styles.logoImage}
        />
        {/* Optional subtle shine overlay */}
        <Animated.View
          style={[
            styles.shineOverlay,
            {
              transform: [{ translateX: shineTranslate }],
            },
          ]}
        />
      </Animated.View>

      {/* App Title & Subtitle */}
      <Animated.View style={[styles.textWrapper, { opacity: fadeText }]}>
        <Text style={styles.title}>Swachify</Text>
        <Text style={styles.subtitle}>Premium Cleaning Services</Text>
      </Animated.View>
    </View>
  );
}

// =============== PREMIUM STYLES ===============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: 170,
    height: 170,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },

  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 170,
    // backgroundColor: 'rgba(255,255,255,0.25)',
    transform: [{ rotate: '25deg' }],
    borderRadius: 30,
  },

  textWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },

  title: {
    fontSize: 42,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#EAF3FF',
    opacity: 0.9,
    letterSpacing: 0.5,
  },
});

export default App;
