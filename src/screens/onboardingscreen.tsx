// src/screens/Onboarding.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to Swachify',
    description: 'A premium platform redefining India’s cleanliness movement.',
    image: require('../assets/swachlogo.png'),
  },
  {
    key: '2',
    title: 'Track Waste Smartly',
    description: 'Monitor waste disposal with cutting-edge smart solutions.',
   image: require('../assets/swachlogo2.jpg'),
  },
  {
    key: '3',
    title: 'Join the Revolution',
    description: 'Be a proud contributor to a cleaner and greener India.',
    image: require('../assets/swachlogo3.jpg'),
  },
];

interface OnboardingProps {
  onDone: () => void;
}

export default function Onboarding({ onDone }: OnboardingProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onDone();
    }
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => {
          const animatedWidth = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [8, 22, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: animatedWidth, opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#0981f8ff', '#365f92ff', '#031c36ff']}
      style={styles.container}
    >
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });

          const fade = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });

          return (
            <View style={[styles.slide, { width }]}>
              <Animated.View style={[styles.card, { opacity: fade, transform: [{ scale }] }]}>
               <View style={styles.imageWrapper}>
  <Image source={item.image} style={styles.image} />
</View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </Animated.View>
            </View>
          );
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {renderDots()}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <LinearGradient
          colors={['#1a4e9eff', '#0d3875ff']}
          style={styles.buttonInner}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 28,
    alignItems: 'center',

    // 💎 Premium glass effect
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    // backdropFilter: 'blur(15px)',
  },

  image: {
  width: '200%',
  height: '125%',
  resizeMode: 'contain',
},


  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },

  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

 dotsContainer: {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 110,
  alignSelf: 'center',
  gap: 10,
},

dot: {
  width: 12,
  height: 12,
  transform: [{ rotate: '150deg' }],
  backgroundColor: 'rgba(255,255,255,0.8)',
  marginHorizontal: 8,
  borderRadius: 2,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
},


  // dot: {
  //   height: 8,
  //   backgroundColor: '#688ca2ff',
  //   marginHorizontal: 5,
  //   borderRadius: 10,
  //   alignSelf: 'center',
  //   // alignItems: 'center',
  // },

  button: {
    position: 'absolute',
    bottom: 40,
    
    alignSelf: 'center',
  },

  buttonInner: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 25,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  imageWrapper: {
  width: width * 0.55,
  height: width * 0.55,
  borderRadius: (width * 0.55) / 2,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 25,

  // Premium glowing ring
  // backgroundColor: 'rgba(255,255,255,0.05)',
  borderWidth: 2,
  borderColor: 'rgba(255,255,255,0.2)',
  // shadowColor: '#00c8ff',
  shadowOpacity: 0.6,
  shadowRadius: 20,
  // elevation: 12,
},

});
