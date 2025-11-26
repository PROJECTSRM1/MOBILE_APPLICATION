
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StatusBar,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

// Use your GIF here (case-sensitive path)
const gifSource: ImageSourcePropType = require('./assets/swachlogo.png');

export default function App(): React.ReactElement {
  // Animated refs
  const fadeRef = useRef(new Animated.Value(0));
  const scaleRef = useRef(new Animated.Value(0.95));
  const floatRef = useRef(new Animated.Value(0));

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeRef.current, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scaleRef.current, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // gentle float/breathe loop
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatRef.current, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatRef.current, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    );
    floatLoop.start();

    return () => {
      floatLoop.stop?.();
    };
  }, []);

  // Derived animated values
  const translateY = floatRef.current.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const combinedScale = scaleRef.current.interpolate({ inputRange: [0.95, 1], outputRange: [0.95, 1.01] });

  // sizes
  const GIF_SIZE = Math.round(SCREEN_W * 0.6);

  // Build UI with createElement (no JSX)
  const statusBar = React.createElement(StatusBar, {
    translucent: true,
    backgroundColor: 'transparent',
    barStyle: 'light-content',
  });

  const gif = React.createElement(Animated.Image as any, {
    source: gifSource,
    style: { width: GIF_SIZE, height: GIF_SIZE },
    resizeMode: 'contain' as const,
  });

  const title = React.createElement(Text, { style: styles.title }, 'Swachify');
  const subtitle = React.createElement(Text, { style: styles.subtitle }, 'Cleaning Services — Premium');

  const animatedContainer = React.createElement(
    Animated.View as any,
    {
      style: {
        opacity: fadeRef.current,
        transform: [{ translateY }, { scale: combinedScale }],
        alignItems: 'center' as const,
      },
    },
    gif,
    React.createElement(View, { style: styles.textWrap }, title, subtitle)
  );

  const root = React.createElement(View, { style: styles.root }, statusBar, animatedContainer);

  return root;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#071026', // solid premium background
    alignItems: 'center',
    justifyContent: 'center',
  },

  textWrap: { alignItems: 'center', marginTop: 12 },

  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 6,
  },
});
