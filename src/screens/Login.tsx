
import React, { useState } from 'react';
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

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }
    // TODO: call login API, handle tokens, navigate to main app
    Alert.alert('Logged in', `Welcome back, ${email}`);
    // navigation.replace('Main'); // when you have a main app stack
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF1F5" />
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrap}>
            <Text style={styles.title}>Hey,{'\n'}Welcome{'\n'}Back</Text>

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
                accessibilityLabel="Email input"
                returnKeyType="next"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9aa0a6"
                secureTextEntry
                style={styles.input}
                accessibilityLabel="Password input"
                returnKeyType="done"
              />

              <TouchableOpacity onPress={() => Alert.alert('Forgot password', 'Show reset flow')} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
                <Text style={{ color: '#2b6b6b', textDecorationLine: 'underline' }}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={onLogin} activeOpacity={0.9} accessibilityRole="button">
                <Text style={styles.primaryBtnText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.divLine} />
                <Text style={styles.divText}>or continue with</Text>
                <View style={styles.divLine} />
              </View>

              <TouchableOpacity style={styles.googleBtn} onPress={() => Alert.alert('Google', 'Implement Google signin')} activeOpacity={0.85}>
                <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
                <Text style={styles.googleText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Signup')} accessibilityRole="link">
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
    backgroundColor: '#fff',
  },
  googleIcon: { width: 20, height: 20, marginRight: 12, resizeMode: 'contain' },
  googleText: { fontWeight: '700', color: '#2b3b3b' },
  link: { marginTop: 14, alignItems: 'center' },
  linkText: { color: '#2b6b6b', textDecorationLine: 'underline' },
});
