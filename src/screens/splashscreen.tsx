// src/screens/Splash.tsx
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

interface SplashProps {
  onFinish: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  // Animations
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const scaleLogo = useRef(new Animated.Value(0.8)).current;
  const shineAnim = useRef(new Animated.Value(-1)).current;
  const fadeText = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeLogo, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.spring(scaleLogo, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }),
      ]),
      Animated.timing(fadeText, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(shineAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Call onFinish after 3 seconds
    const timer = setTimeout(() => onFinish(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const shineTranslate = shineAnim.interpolate({ inputRange: [-1, 1], outputRange: [-200, 200] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#04276e" />
      <LinearGradient colors={['#0f62a5', '#4f92dd', '#04276e']} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.logoWrapper, { opacity: fadeLogo, transform: [{ scale: scaleLogo }] }]}>
       <Image 
  source={require('../assets/swachlogo.png')} 
  style={styles.logoImage} 
/>
        <Animated.View style={[styles.shineOverlay, { transform: [{ translateX: shineTranslate }] }]} />
      </Animated.View>

      <Animated.View style={[styles.textWrapper, { opacity: fadeText }]}>
        <Text style={styles.title}>Swachify</Text>
        <Text style={styles.subtitle}>Premium Cleaning Services</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrapper: { alignItems: 'center', justifyContent: 'center' },
  logoImage: {
    width: 170,
    height: 170,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 12 },
      android: { elevation: 12 },
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
    transform: [{ rotate: '25deg' }],
    borderRadius: 30,
    // backgroundColor: 'rgba(255,255,255,0.3)',
  },
  textWrapper: { marginTop: 30, alignItems: 'center' },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: { marginTop: 10, fontSize: 18, color: '#EAF3FF', opacity: 0.9, letterSpacing: 0.5 },
});
