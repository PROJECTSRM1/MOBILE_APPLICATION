// Onboarding.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const { width } = Dimensions.get("window");

interface OnboardingProps {
  onDone: () => void;
}

const slides = [
  {
    id: 1,
    image: require("../../assets/onboarding1.jpg"),
    title: "Welcome to Swachify",
    subtitle: "Your trusted cleaning & home service partner.",
  },
  {
    id: 2,
    image: require("../../assets/onboarding2.jpg"),
    title: "Professional Cleaners",
    subtitle: "Verified and dependable cleaning experts.",
  },
  {
    id: 3,
    image: require("../../assets/onboarding3.jpg"),
    title: "Easy Booking",
    subtitle: "Schedule services in just a few taps.",
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(slideIndex);
  };

  const goToSlide = (page: number) => {
    scrollRef.current?.scrollTo({ x: page * width, animated: true });
  };

  const next = () => {
    if (index < slides.length - 1) goToSlide(index + 1);
  };

  const back = () => {
    if (index > 0) goToSlide(index - 1);
  };

  return (
    <View style={styles.container}>
      {/* SLIDER */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((item) => (
          <View key={item.id} style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* DOTS */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, index === i && styles.activeDot]}
          />
        ))}
      </View>

      {/* BUTTONS BELOW DOTS */}
      <View style={styles.buttonsContainer}>

        {/* If LAST SCREEN → Back + Get Started */}
        {index === slides.length - 1 ? (
          <>
            {/* BACK (only on last screen) */}
            <TouchableOpacity style={styles.button} onPress={back}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            {/* GET STARTED */}
            <TouchableOpacity
              style={[styles.button, styles.getStartedButton]}
              onPress={onDone}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* No Back button on 1 & 2 */}

            {/* SKIP */}
            <TouchableOpacity style={styles.button} onPress={onDone}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>

            {/* NEXT */}
            <TouchableOpacity style={styles.button} onPress={next}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  image: {
    width: 260,
    height: 260,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    color: "#00FF66",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    width: "80%",
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 60,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#555",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#00FF66",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 60,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderColor: "#00FF66",
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  buttonText: {
    color: "#00FF66",
    fontSize: 16,
    fontWeight: "600",
  },
  getStartedButton: {
    backgroundColor: "#00FF66",
  },
  getStartedText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
