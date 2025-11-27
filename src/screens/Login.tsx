// src/screens/Login.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
      <View style={styles.wrap}>


        <Text style={styles.title}>Hey,{'\n'}Welcome{'\n'}Back</Text>

        <View style={styles.form}>
          <TextInput placeholder="Enter your email" style={styles.input} placeholderTextColor="#9aa0a6" keyboardType="email-address" />
          <TextInput placeholder="Enter your password" style={styles.input} placeholderTextColor="#9aa0a6" secureTextEntry/>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { /* handle login */ }}>
            <Text style={styles.primaryBtnText}>Login</Text>
          </TouchableOpacity>

          {/* divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View>

          {/* Google button */}
          <TouchableOpacity style={styles.googleBtn} onPress={() => { /* handle Google */ }}>
            <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF1F5' },
  wrap: { paddingHorizontal: 24, paddingTop: 16 },
  topPillRow: { flexDirection: 'row', alignSelf: 'center', marginBottom: 8, borderRadius: 40, overflow: 'hidden' },
  topPill: { paddingVertical: 8, paddingHorizontal: 28, borderRadius: 28 },
  topPillActive: { backgroundColor: '#2f4858' },
  topPillInactive: { backgroundColor: '#eaf0f2' },
  topPillText: { fontWeight: '700', fontSize: 16 },

  title: { fontSize: 36, fontWeight: '800', color: '#2b3b3b', marginTop: 6, marginBottom: 14 },
  form: { marginTop: 6 },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#d6dce0',
    borderRadius: 30,
    paddingHorizontal: 18,
    marginBottom: 12,
    backgroundColor: '#fff'
  },

  primaryBtn: { backgroundColor: '#2f4858', borderRadius: 28, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  divLine: { flex: 1, height: 1, backgroundColor: '#d6dce0' },
  divText: { marginHorizontal: 12, color: '#7f8b8b' },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.4,
    borderColor: '#d6dce0',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 22,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  googleIcon: { width: 20, height: 20, marginRight: 12, resizeMode: 'contain' },
  googleText: { fontWeight: '700', color: '#2b3b3b' },

  link: { marginTop: 14, alignItems: 'center' },
  linkText: { color: '#2b6b6b', textDecorationLine: 'underline' },
});
