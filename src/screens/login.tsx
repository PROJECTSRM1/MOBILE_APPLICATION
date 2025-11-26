import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LoginProps {
  onLoginDone?: () => void;     // ✔ updated
  onGoToSignup?: () => void;    // ✔ correct
}

export default function Login({ onLoginDone, onGoToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (onLoginDone) onLoginDone();  // ✔ updated
  };

  return (
    <LinearGradient
      colors={['#0981f8ff', '#365f92ff', '#031c36ff']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={['#1a4e9eff', '#0d3875ff']}
            style={styles.buttonInner}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={onGoToSignup}>
          <Text style={styles.signupText}>Don’t have an account? Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: { fontSize: 32, color: '#fff', fontWeight: '700', marginBottom: 40 },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
    color: '#fff',
  },
  button: { width: '100%' },
  buttonInner: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  signupText: { color: '#ccc', fontSize: 16 },
});
