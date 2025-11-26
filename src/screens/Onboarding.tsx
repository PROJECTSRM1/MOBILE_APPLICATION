

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const IMAGES: ImageSourcePropType[] = [
  require('../../assets/swachlogo.png'),
  require('../../assets/swachlogo.png'),
  require('../../assets/swachlogo.png'),
];

const PAGES = [
  { title: 'Keep it clean', subtitle: 'Expert cleaning tailored to your home.', image: IMAGES[0] },
  { title: 'Book in seconds', subtitle: 'Easy scheduling with trusted professionals.', image: IMAGES[1] },
  { title: 'Sit back & relax', subtitle: 'We handle everything — premium results.', image: IMAGES[2] },
];

export default function Onboarding({ onDone }: { onDone: () => void }): React.ReactElement {
  const scrollRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = (e: any) => {
    scrollX.setValue(e.nativeEvent.contentOffset.x);
  };

  const onScrollEnd = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setIndex(page);
  };

  const next = () => {
    if (index < PAGES.length - 1) {
      const i = index + 1;
      scrollRef.current?.scrollTo({ x: i * SCREEN_W, animated: true });
      setIndex(i);
      scrollX.setValue(i * SCREEN_W);
    } else {
      onDone();
    }
  };

  const skip = () => {
    const last = PAGES.length - 1;
    scrollRef.current?.scrollTo({ x: last * SCREEN_W, animated: true });
    setIndex(last);
    scrollX.setValue(last * SCREEN_W);
  };

  // Pages
  const pageViews = PAGES.map((p, i) => {
    const inputRange = [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });

    return React.createElement(
      View,
      { key: `pg-${i}`, style: [styles.page, { width: SCREEN_W }] },
      React.createElement(Animated.Image, {
        source: p.image,
        style: [styles.image, { opacity, transform: [{ scale }] }],
        resizeMode: 'contain',
      }),
      React.createElement(Text, { style: styles.title }, p.title),
      React.createElement(Text, { style: styles.subtitle }, p.subtitle)
    );
  });

  const scrollView = React.createElement(
    ScrollView,
    {
      horizontal: true,
      pagingEnabled: true,
      showsHorizontalScrollIndicator: false,
      onScroll,
      ref: (r: any) => (scrollRef.current = r),
      onMomentumScrollEnd: onScrollEnd,
      scrollEventThrottle: 16,
    },
    ...pageViews
  );

  // YOUR EXACT DOT STYLE
  const dots = PAGES.map((_, i) =>
    React.createElement(View, {
      key: `dot-${i}`,
      style: [styles.dot, i === index && styles.dotActive],
    })
  );

  // Buttons (side-by-side, last page centered)
  let buttons;
  if (index === PAGES.length - 1) {
    // Centered Get Started
    const gs = React.createElement(
      TouchableOpacity as any,
      { onPress: next, style: styles.getStartedBtn, activeOpacity: 0.92 },
      React.createElement(Text, { style: styles.getStartedText }, 'Get Started')
    );

    buttons = React.createElement(View, { style: styles.buttonsCenter }, gs);
  } else {
    const skipBtn = React.createElement(
      TouchableOpacity as any,
      { onPress: skip, style: styles.sideBtnLeft, activeOpacity: 0.8 },
      React.createElement(Text, { style: styles.skipText }, 'Skip')
    );

    const nextBtn = React.createElement(
      TouchableOpacity as any,
      { onPress: next, style: styles.sideBtnRight, activeOpacity: 0.92 },
      React.createElement(Text, { style: styles.nextText }, 'Next')
    );

    buttons = React.createElement(View, { style: styles.buttonsRow }, skipBtn, nextBtn);
  }

  return React.createElement(
    View,
    { style: styles.root },
    React.createElement(StatusBar, { translucent: true, barStyle: 'light-content', backgroundColor: 'transparent' }),

    // Center content
    React.createElement(View, { style: styles.contentCenter }, scrollView),

    // YOUR DOT STYLE below content
    React.createElement(View, { style: styles.dotsWrap }, ...dots),

    // Buttons below dots
    buttons
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#071026',
  },

  // Centering main onboarding content
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  page: {
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_W * 0.6,
    height: SCREEN_W * 0.6,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 28,
    fontSize: 13,
  },

  dotsWrap: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 24,
  },
  dot: {
    minWidth: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 6,
    marginBottom: 120,

  },
  dotActive: {
    backgroundColor: '#0ef0c7',
    minWidth: 18,
    borderRadius: 9,
  },

  // side buttons
  buttonsRow: {
    position: 'absolute',
    bottom: 80,
    left: 80,
    right: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sideBtnLeft: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sideBtnRight: {
    backgroundColor: '#0ef0c7',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  skipText: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
  },
  nextText: {
    color: '#012a26',
    fontWeight: '800',
  },

  // Only Get Started (center)
  buttonsCenter: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  getStartedBtn: {
    backgroundColor: '#0ef0c7',
    paddingHorizontal: 34,
    paddingVertical: 12,
    borderRadius: 999,
  },
  getStartedText: {
    color: '#012a26',
    fontWeight: '800',
  },
});
