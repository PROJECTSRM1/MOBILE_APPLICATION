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
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// const IMAGES: ImageSourcePropType[] = [
//   require('../../assets/swachlogo.png'),
//   require('../../assets/swachlogo.png'),
//   require('../../assets/swachlogo.png'),
// ];

const PAGES = [
  { title: 'Keep it clean', subtitle: 'Expert cleaning tailored to your home.', image: null },
  { title: 'Book in seconds', subtitle: 'Easy scheduling with trusted professionals.', image: null },
  // { title: 'Sit back & relax', subtitle: 'We handle everything — premium results.', image: IMAGES[2] },
];

export default function Onboarding(): React.ReactElement {
  const navigation = useNavigation<any>();
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

  // move to next page (used by the Next button on first page)
  const goToPage = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * SCREEN_W, animated: true });
    setIndex(i);
    scrollX.setValue(i * SCREEN_W);
  };

  const next = () => {
    if (index < PAGES.length - 1) {
      goToPage(index + 1);
    } else {
      navigation.replace('Landing'); 
    }
  };

  // Page views
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
        // source: p.image,
        style: [styles.image, { opacity, transform: [{ scale }] }],
        resizeMode: 'contain',
      }),
      React.createElement(Text, { style: styles.title }, p.title),
      React.createElement(Text, { style: styles.subtitle }, p.subtitle)
    );
  });

  // Dots
  const dots = PAGES.map((_, i) =>
    React.createElement(View, {
      key: `dot-${i}`,
      style: [styles.dot, i === index && styles.dotActive],
    })
  );

  // Bottom area: page 0 -> Next, page 1 -> Get started
  const bottomArea = (() => {
    if (index === 0) {
      // Page 1: Next only
      return React.createElement(
        View,
        { style: styles.buttonsCenter },
        React.createElement(
          TouchableOpacity as any,
          { onPress: next, style: styles.nextPrimaryBtn, activeOpacity: 0.92 },
          React.createElement(Text, { style: styles.nextPrimaryText }, 'Next')
        )
      );
    }

    // Page 2: Get started -> FreelancerScreen
    return React.createElement(
      View,
      { style: styles.buttonsCenter },
      React.createElement(
        TouchableOpacity as any,
        {
          onPress: () => navigation.replace('Landing'),
          style: styles.getStartedBtn,
          activeOpacity: 0.92,
        },
        React.createElement(Text, { style: styles.getStartedText }, 'Get started')
      )
    );
  })();

  // The scroll view element
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

  return React.createElement(
    View,
    { style: styles.root },
    React.createElement(StatusBar, {
      translucent: true,
      barStyle: 'light-content',
      backgroundColor: 'transparent',
    }),
    React.createElement(View, { style: styles.contentCenter }, scrollView),
    React.createElement(View, { style: styles.dotsWrap }, ...dots),
    bottomArea
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#071026',
  },

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
    bottom: 180,
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
  },
  dotActive: {
    backgroundColor: '#0ef0c7',
    minWidth: 18,
    borderRadius: 9,
  },

  // Centered button area (Next / Get started)
  buttonsCenter: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextPrimaryBtn: {
    backgroundColor: '#0ef0c7',
    paddingHorizontal: 34,
    paddingVertical: 12,
    borderRadius: 999,
  },
  nextPrimaryText: {
    color: '#012a26',
    fontWeight: '800',
  },

  getStartedBtn: {
    backgroundColor: '#0ef0c7',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 999,
  },
  getStartedText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
});
