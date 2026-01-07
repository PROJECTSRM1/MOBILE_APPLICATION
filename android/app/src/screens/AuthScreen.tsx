import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // shared (auto-fill login)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // register-only
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [location, setLocation] = useState('');
  const [lookingForWork, setLookingForWork] = useState('');
  const [workType, setWorkType] = useState('');

  const handleRegister = () => {
    if (!email || !password) {
      alert('Email and Password are required');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setActiveTab('login');
  };

  return (
    <LinearGradient colors={['#020617', '#020617']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={activeTab === 'login' ? styles.activeText : styles.inactiveText}>
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'register' && styles.activeTab]}
              onPress={() => setActiveTab('register')}
            >
              <Text style={activeTab === 'register' ? styles.activeText : styles.inactiveText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* REGISTER */}
          {activeTab === 'register' && (
            <>
              <Text style={styles.title}>Create Account</Text>

              <Input label="First Name" value={firstName} onChange={setFirstName} />
              <Input label="Last Name" value={lastName} onChange={setLastName} />
              <Input label="Mobile Number" value={mobile} onChange={setMobile} />
              <Input label="Email ID" value={email} onChange={setEmail} />
              <Input label="Password" value={password} onChange={setPassword} secure />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                secure
              />
              <Input label="Aadhaar Number" value={aadhaar} onChange={setAadhaar} />
              <Input label="Location" value={location} onChange={setLocation} />
              <Input
                label="Looking for Work"
                value={lookingForWork}
                onChange={setLookingForWork}
              />

              {/* ✅ DROPDOWN */}
              <Text style={styles.label}>Select Work Type</Text>
              <View style={styles.dropdownWrapper}>
                <Picker
                  selectedValue={workType}
                  onValueChange={setWorkType}
                  style={styles.picker}
                  dropdownIconColor="#ffffff"
                >
                  <Picker.Item label="Choose work type" value="" />
                  <Picker.Item label="Assigning for work" value="assigning" />
                  <Picker.Item label="Looking for Work" value="looking" />
                  <Picker.Item label="Both" value="both" />
                </Picker>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                <Text style={styles.primaryText}>Register</Text>
              </TouchableOpacity>

              <SocialSection />
            </>
          )}

          {/* LOGIN */}
          {activeTab === 'login' && (
            <>
              <Text style={styles.title}>Welcome Back</Text>

              <Input label="Email ID" value={email} onChange={setEmail} />
              <Input label="Password" value={password} onChange={setPassword} secure />

              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Log In →</Text>
              </TouchableOpacity>

              <Text style={styles.link}>Forgot Password?</Text>
              <SocialSection />
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const Input = ({ label, value, onChange, secure }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      secureTextEntry={secure}
      onChangeText={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor="#9ca3af"
    />
  </>
);

const SocialSection = () => (
  <>
    <Text style={styles.or}>OR CONTINUE WITH</Text>
    <View style={styles.socialRow}>
      <SocialBtn text="G" />
      <SocialBtn text="" />
      <SocialBtn text="in" />
    </View>
    <Text style={styles.terms}>
      By continuing, you agree to our Terms of Service and Privacy Policy.
    </Text>
  </>
);

const SocialBtn = ({ text }: any) => (
  <TouchableOpacity style={styles.socialBtn}>
    <Text style={styles.socialText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },

  card: {
    backgroundColor: '#0b1220',
    borderRadius: 20,
    padding: 20,
  },

  tabs: { flexDirection: 'row', marginBottom: 20 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
  },
  activeTab: { borderBottomColor: '#2563eb' },
  activeText: { fontWeight: '700', color: '#fff' },
  inactiveText: { color: '#9ca3af' },

  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#fff' },

  label: { fontWeight: '600', marginBottom: 6, color: '#e5e7eb' },
  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: '#fff',
  },

  dropdownWrapper: {
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 14,
  },
  picker: { color: '#fff' },

  primaryBtn: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  link: { textAlign: 'center', color: '#3b82f6', marginTop: 14 },

  or: { textAlign: 'center', marginVertical: 20, color: '#9ca3af' },

  socialRow: { flexDirection: 'row', justifyContent: 'space-between' },
  socialBtn: {
    flex: 1,
    marginHorizontal: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  socialText: { fontWeight: '700', fontSize: 18, color: '#fff' },

  terms: { textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 },
});

export default AuthScreen;

function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
