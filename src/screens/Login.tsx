// src/screens/Login.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation, route }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [selectedRole, setSelectedRole] = useState<'customer' | 'user' | undefined>(
    (route?.params as any)?.role
  );

  // Prefill email coming from Signup 
  useEffect(() => {
    if (route?.params?.prefilledEmail) {
      setEmail((route.params as any).prefilledEmail);
    }
  }, [route?.params?.prefilledEmail]);

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    const userRole = selectedRole ?? (route?.params as any)?.role;

    if (!userRole) {
      Alert.alert('Select role', 'Please select whether you are a Customer or a User before logging in.');
      return;
    }

    // TODO: call login API, handle tokens, server role etc.
    Alert.alert('Logged in', `Welcome back, ${email}`);

    if (userRole === 'customer') {
      navigation.replace('CustomerDashboard');
    } else if (userRole === 'user') {
      navigation.replace('UserDashboard');
    } else {
      // fallback (shouldn't happen)
      navigation.replace('CustomerDashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrap}>
            <Text style={styles.title}>Hey,{'\n'}Welcome{'\n'}Back</Text>

            {/* Role selector */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: '#566', marginBottom: 8 }}>I am a</Text>
              <View style={styles.roleSelectRow}>
                <TouchableOpacity
                  onPress={() => setSelectedRole('customer')}
                  style={[
                    styles.roleBtn,
                    selectedRole === 'customer' ? styles.roleBtnSelected : undefined,
                  ]}
                >
                  <Text style={selectedRole === 'customer' ? styles.roleBtnTextSelected : styles.roleBtnText}>
                    Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedRole('user')}
                  style={[
                    styles.roleBtn,
                    selectedRole === 'user' ? styles.roleBtnSelected : undefined,
                  ]}
                >
                  <Text style={selectedRole === 'user' ? styles.roleBtnTextSelected : styles.roleBtnText}>
                    User / Service Provider
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* End role selector */}

            <View style={styles.form}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9aa0a6"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                style={styles.input}
                returnKeyType="next"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9aa0a6"
                secureTextEntry
                style={styles.input}
                returnKeyType="done"
              />

              <TouchableOpacity
                onPress={() => Alert.alert('Forgot password', 'Show reset flow')}
                style={{ alignSelf: 'flex-end', marginBottom: 8 }}
              >
                <Text style={{ color: '#2b6b6b', textDecorationLine: 'underline' }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={onLogin}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBtnText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.divLine} />
                <Text style={styles.divText}>or continue with</Text>
                <View style={styles.divLine} />
              </View>

              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => Alert.alert('Google', 'Implement Google signin')}
                activeOpacity={0.85}
              >
                <Image
                  source={require('../../assets/google.png')}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.linkText}>Don't have an account? Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF1F5' },
  wrap: { paddingHorizontal: 24, paddingTop: 16, flex: 1 },
  title: { fontSize: 36, fontWeight: '800', color: '#2b3b3b', marginTop: 6, marginBottom: 14 },
  form: { marginTop: 6 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#d6dce0',
    borderRadius: 30,
    paddingHorizontal: 18,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  primaryBtn: {
    backgroundColor: '#2f4858',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
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
    backgroundColor: '#fff',
  },
  googleIcon: { width: 20, height: 20, marginRight: 12, resizeMode: 'contain' },
  googleText: { fontWeight: '700', color: '#2b3b3b' },
  link: { marginTop: 14, alignItems: 'center' },
  linkText: { color: '#2b6b6b', textDecorationLine: 'underline' },

  // role selector styles
  roleSelectRow: { flexDirection: 'row', gap: 8 },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d6dce0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBtnSelected: {
    backgroundColor: '#0e8b7b',
    borderColor: '#0e8b7b',
  },
  roleBtnText: { color: '#24333a', fontWeight: '700', textAlign: 'center', fontSize: 14 },
  roleBtnTextSelected: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 14 },
});
