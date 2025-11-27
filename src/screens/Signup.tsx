// src/screens/Signup.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar , Image} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function Signup({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
      <View style={styles.wrap}>
        <Text style={styles.title}>Let's get{'\n'}started</Text>

        <View style={styles.form}>
          <TextInput placeholder="Enter your email" style={styles.input} placeholderTextColor="#9aa0a6" keyboardType="email-address" />
          <TextInput placeholder="Enter your phone no" style={styles.input} placeholderTextColor="#9aa0a6" keyboardType="phone-pad" />
          <TextInput placeholder="Create a password" style={styles.input} placeholderTextColor="#9aa0a6" secureTextEntry />
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { /* handle signup */ }}>
            <Text style={styles.primaryBtnText}>Sign up</Text>
          </TouchableOpacity>
           <View style={styles.dividerRow}>
                      <View style={styles.divLine} />
                      <Text style={styles.divText}>or continue with</Text>
                      <View style={styles.divLine} />
                    </View>

   <TouchableOpacity style={styles.googleBtn} onPress={() => { /* handle Google */ }}>
            <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>                    

          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF1F5' },
  wrap: { paddingHorizontal: 24, paddingTop: 28 },
  title: { fontSize: 28, fontWeight: '800', color: '#2b3b3b', marginBottom: 18 },
  form: { marginTop: 12 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#d6dce0',
    borderRadius: 30,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  primaryBtn: { backgroundColor: '#2f4858', borderRadius: 28, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  divLine: { flex: 1, height: 1, backgroundColor: '#d6dce0' },
  divText: { marginHorizontal: 12, color: '#7f8b8b' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

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
  link: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#2b6b6b', textDecorationLine: 'underline' }
});
