import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

/* =======================
   TYPES
======================= */

interface Doctor {
  name: string;
  title: string;
  status: 'Online' | 'Busy' | 'Offline';
  videoUri: string;
}

interface User {
  name: string;
  videoUri: string;
}

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
}

interface VideoCallScreenProps {
  doctor: Doctor;
  user: User;
  onEndCall: () => void;
}

/* =======================
   COMPONENT
======================= */

function VideoCallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctor, user, onEndCall } = route.params as any;
  /* ---------- STATE ---------- */
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(0);

  const [network, setNetwork] = useState<'good' | 'average' | 'poor'>('good');

  const controlsOpacity = new Animated.Value(1);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = () => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  /* ---------- AUTO HIDE CONTROLS ---------- */
  useEffect(() => {
    if (!showControls) return;

    const t = setTimeout(() => {
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 3000);

    return () => clearTimeout(t);
  }, [showControls]);

  const onScreenTap = () => {
    if (!showControls) {
      setShowControls(true);
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  /* ---------- NETWORK QUALITY (SIMULATED) ---------- */
  useEffect(() => {
    const t = setInterval(() => {
      const r = Math.random();
      if (r > 0.8) setNetwork('poor');
      else if (r > 0.5) setNetwork('average');
      else setNetwork('good');
    }, 5000);
    return () => clearInterval(t);
  }, []);

  /* ---------- CHAT ---------- */
  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: input },
    ]);
    setInput('');
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onScreenTap}>
        <ImageBackground source={{ uri: doctor.videoUri }} style={styles.videoBackground}>
          <View style={styles.overlay} />

          {/* TOP BAR */}
          <Animated.View style={[styles.topBar, { opacity: controlsOpacity }]}>
            <SafeAreaView>
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.name}>{doctor.name}</Text>
                  <Text style={styles.sub}>
                    {doctor.title} • {doctor.status}
                  </Text>
                  <Text style={styles.net}>
                    Network: {network.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.timerBox}>
                  <Text style={styles.timer}>{formatTime()}</Text>
                </View>
              </View>

              {isRecording && (
                <View style={styles.recording}>
                  <View style={styles.redDot} />
                  <Text style={styles.recText}>REC</Text>
                </View>
              )}
            </SafeAreaView>
          </Animated.View>

          {/* PIP */}
          <View style={styles.pip}>
            <ImageBackground source={{ uri: user.videoUri }} style={styles.pipVideo}>
              {!isCameraOn && (
                <View style={styles.cameraOff}>
                  <Icon name="videocam-off" size={24} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 12 }}>Camera Off</Text>
                </View>
              )}
            </ImageBackground>
          </View>

          {/* SIDE */}
          <Animated.View style={[styles.side, { opacity: controlsOpacity }]}>
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={() => {
                setChatOpen(true);
                setUnread(0);
              }}
            >
              <Icon name="chat" size={22} color="#fff" />
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* CONTROLS */}
          <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
            <SafeAreaView edges={['bottom']}>
              <View style={styles.controlRow}>
                <Control icon={isMuted ? 'mic-off' : 'mic'} label="Mute" onPress={() => setIsMuted(!isMuted)} />
                <Control icon={isCameraOn ? 'videocam' : 'videocam-off'} label="Camera" onPress={() => setIsCameraOn(!isCameraOn)} />
                <Control icon={isSpeakerOn ? 'volume-up' : 'volume-off'} label="Speaker" onPress={() => setIsSpeakerOn(!isSpeakerOn)} />
                <Control icon={isRecording ? 'stop' : 'fiber-manual-record'} label="Record" onPress={() => setIsRecording(!isRecording)} />
                <TouchableOpacity onPress={onEndCall} style={styles.endBtn}>
                  <Icon name="call-end" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </ImageBackground>
      </TouchableOpacity>

      {/* CHAT MODAL */}
      <Modal visible={chatOpen} animationType="slide">
        <SafeAreaView style={styles.chat}>
          <Text style={styles.chatTitle}>Chat</Text>

          <View style={{ flex: 1 }}>
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.msg,
                  m.sender === 'user' ? styles.userMsg : styles.docMsg,
                ]}
              >
                <Text>{m.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type message"
              style={styles.input}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Icon name="send" size={22} color="#2563eb" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setChatOpen(false)}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default VideoCallScreen;

/* =======================
   SMALL COMPONENT
======================= */

const Control = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.ctrl} onPress={onPress}>
    <View style={styles.ctrlCircle}>
      <Icon name={icon} size={22} color="#fff" />
    </View>
    <Text style={styles.ctrlLabel}>{label}</Text>
  </TouchableOpacity>
);

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoBackground: { width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },

  topBar: { position: 'absolute', top: 0, width: '100%' },
  topRow: { padding: 16, flexDirection: 'row', justifyContent: 'space-between' },
  name: { color: '#fff', fontSize: 18, fontWeight: '700' },
  sub: { color: 'rgba(255,255,255,0.8)' },
  net: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },

  timerBox: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 16 },
  timer: { color: '#fff', fontWeight: '700' },

  recording: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 16 },
  redDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'red' },
  recText: { color: 'red', fontWeight: '700' },

  pip: { position: 'absolute', top: 120, right: 20, width: 120, height: 160 },
  pipVideo: { width: '100%', height: '100%' },
  cameraOff: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },

  side: { position: 'absolute', right: 20, top: '45%' },
  sideBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10 },

  controls: { position: 'absolute', bottom: 0, width: '100%' },
  controlRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  ctrl: { alignItems: 'center' },
  ctrlCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  ctrlLabel: { color: '#fff', fontSize: 11, marginTop: 4 },

  endBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },

  chat: { flex: 1, padding: 16 },
  chatTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  msg: { padding: 10, borderRadius: 10, marginVertical: 4, maxWidth: '70%' },
  userMsg: { backgroundColor: '#dbeafe', alignSelf: 'flex-end' },
  docMsg: { backgroundColor: '#e5e7eb', alignSelf: 'flex-start' },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12 },
  close: { textAlign: 'center', marginTop: 8, color: '#2563eb' },
});
