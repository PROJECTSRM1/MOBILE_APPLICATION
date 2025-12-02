import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width: SCREEN_W } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeOne'>;

export default function WelcomeOne({ navigation }: Props) {
  return (
    <View style={styles.root}>
      {/* SWACHIFY LOGO */}
      <Image
        source={require('../../assets/swachlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* TITLE */}
      <Text style={styles.title}>SWACHIFY</Text>

      {/* SUBTITLE */}
      <Text style={styles.subtitle}>
        We handle everything — premium results.
      </Text>

      {/* BUTTON ROW */}
      <View style={styles.btnRow}>
        {/* LOGIN */}
        <TouchableOpacity
          style={[styles.btn, styles.btnActive]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.btnText, styles.btnTextActive]}>Login</Text>
        </TouchableOpacity>

        {/* SIGN-UP */}
        <TouchableOpacity
          style={[styles.btn, styles.btnInactive]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.btnText, styles.btnTextInactive]}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#deebef',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 120,
  },

  logo: {
    width: SCREEN_W * 0.45,
    height: SCREEN_W * 0.45,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f3a47',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#4f6b75',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 90,
    paddingHorizontal: 40,
  },

  btnRow: {
    flexDirection: 'row',
    width: SCREEN_W * 0.9,
    justifyContent: 'space-between',
  },

  btn: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },

  btnActive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c2d4db',    
  },

  btnInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c2d4db',
  },

  btnText: {
    fontSize: 16,
    fontWeight: '700',
  },

  btnTextActive: {
    color: '#274957',
  },

  btnTextInactive: {
    color: '#274957',
  },
});
