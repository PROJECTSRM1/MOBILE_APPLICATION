// src/screens/Signup.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SignupProps {
  onSignupDone: () => void;
  onGoToLogin: () => void;
}

export default function Signup({ onSignupDone, onGoToLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // You can add API/validation here
    onSignupDone(); // After signup → triggers Home from App.tsx
  };

  return (
    <LinearGradient colors={['#0981f8ff', '#365f92ff', '#031c36ff']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

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

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <LinearGradient colors={['#1a4e9eff', '#0d3875ff']} style={styles.buttonInner}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToLogin} style={{ marginTop: 20 }}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
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
    paddingHorizontal: 20
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 40
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
    color: '#fff'
  },
  button: { width: '100%' },
  buttonInner: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  },
  loginText: {
    color: '#ccc',
    fontSize: 16
  }
});
