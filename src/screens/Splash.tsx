

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
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_W } = Dimensions.get('window');

// const gifSource: ImageSourcePropType = require('../../assets/swachlogo.jpg');

export default function Splash(): React.ReactElement {
  const navigation = useNavigation<any>();

  const fadeRef = useRef(new Animated.Value(0));
  const scaleRef = useRef(new Animated.Value(0.95));
  const floatRef = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeRef.current, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(scaleRef.current, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatRef.current, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatRef.current, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );

    floatLoop.start();

    const timer = setTimeout(() => {
      Animated.timing(fadeRef.current, { toValue: 0, duration: 350, useNativeDriver: true }).start(
        () => {
          floatLoop.stop?.();
          // navigate to Onboarding
          navigation.replace('Onboarding');
        }
      );
    }, 1600);

    return () => {
      clearTimeout(timer);
      floatLoop.stop?.();
    };
  }, [navigation]);

  const translateY = floatRef.current.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const scale = scaleRef.current.interpolate({ inputRange: [0.95, 1], outputRange: [0.95, 1.01] });

  const IMG_SIZE = Math.round(SCREEN_W * 0.6);

  const statusBar = React.createElement(StatusBar, {
    translucent: true,
    backgroundColor: 'transparent',
    barStyle: 'light-content',
  });

  const img = React.createElement(Animated.Image as any, {
    // source: gifSource,
    style: { width: IMG_SIZE, height: IMG_SIZE },
    resizeMode: 'contain',
  });

  const title = React.createElement(Text, { style: styles.title }, 'Swachify');
  const subtitle = React.createElement(Text, { style: styles.subtitle }, 'All Services In One Platform');

  const animatedBox = React.createElement(
    Animated.View as any,
    {
      style: {
        opacity: fadeRef.current,
        transform: [{ translateY }, { scale }],
        alignItems: 'center',
      },
    },
    img,
    React.createElement(View, { style: styles.textWrap }, title, subtitle)
  );

  return React.createElement(View, { style: styles.root }, statusBar, animatedBox);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#071026',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
    fontSize: 13,
  },
});
