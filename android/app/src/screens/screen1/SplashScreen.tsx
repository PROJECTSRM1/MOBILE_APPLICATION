import React, { useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar, Dimensions } from 'react-native';
import Video from 'react-native-video';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />

      <Video
        source={require('../../assets/swachgif.mp4')} // MP4 file
        style={styles.video}
        resizeMode="contain"
        repeat={false} // play only once
        muted={true}  // mute video
      />

      <Text style={styles.text}>Welcome to Swachify</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // splash background black
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  text: {
    color: '#fff', // text in white to contrast with black background
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
