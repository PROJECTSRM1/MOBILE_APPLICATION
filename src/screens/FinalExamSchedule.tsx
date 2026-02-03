import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Switch,
  Modal,
  Alert,
  Share,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────
const BASE_URL = 'https://swachify-india-be-1-mcrb.onrender.com';
const EXAM_SCHEDULE_ENDPOINT = '/institution/management/exam-schedule';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ApiExamItem {
  exam_date: string;
  day_name: string;
  subject_name: string;
  exam_type: string;
  start_time: string;
  end_time: string;
  location: string;
  notification_status: string | null;
  notification_scheduled_date: string | null;
}

interface ExamData {
  id: string;
  subject: string;
  date: string;
  day: string;
  time: string;
  location: string;
  color: string;
  category: 'final';
  notificationStatus: string | null;
  notificationScheduledDate: string | null;
}

interface ReminderData {
  id: string;
  examId: string;
  subject: string;
  enabled: boolean;
  triggerTime: string;
  sound: string;
  createdAt: Date;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  status: 'success' | 'failed';
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedExams: string[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const SUBJECT_COLORS = [
  '#3B82F6','#A855F7','#10B981','#F59E0B',
  '#EF4444','#8B5CF6','#EC4899','#14B8A6',
];

function formatTime(raw: string): string {
  const [hh, mm] = raw.split(':').map(Number);
  const period = hh >= 12 ? 'PM' : 'AM';
  const h12 = hh % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${period}`;
}

function formatDate(raw: string): string {
  const [, month, day] = raw.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${String(day).padStart(2, '0')}`;
}

/**
 * Matches "Final", "Final Exam", "Finals", "final", "FINAL EXAM" …
 * Basically anything that contains the word "final".
 */
function isFinalExam(examType: string | null | undefined): boolean {
  if (!examType) return false;
  return examType.trim().toLowerCase().includes('final');
}

function mapApiToExams(items: ApiExamItem[]): ExamData[] {
  const colorMap: Record<string, string> = {};
  let colorIdx = 0;

  return items.map((item, idx) => {
    if (!colorMap[item.subject_name]) {
      colorMap[item.subject_name] = SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length];
      colorIdx++;
    }
    return {
      id: `${item.exam_date}-${item.subject_name}-${idx}`,
      subject: item.subject_name,
      date: formatDate(item.exam_date),
      day: item.day_name,
      time: `${formatTime(item.start_time)} - ${formatTime(item.end_time)}`,
      location: item.location,
      color: colorMap[item.subject_name],
      category: 'final' as const,
      notificationStatus: item.notification_status,
      notificationScheduledDate: item.notification_scheduled_date,
    };
  });
}

// ─────────────────────────────────────────────
// Static data (Logs & Staff)
// ─────────────────────────────────────────────
const sampleLogs: LogEntry[] = [
  { id: '1', timestamp: 'Oct 28, 2023 - 09:15 AM', message: 'Notification sent to 298 parents',       status: 'success' },
  { id: '2', timestamp: 'Oct 28, 2023 - 09:16 AM', message: 'Failed to send to 8 contacts',           status: 'failed'  },
  { id: '3', timestamp: 'Oct 28, 2023 - 09:22 AM', message: 'Retry successful for 7 contacts',        status: 'success' },
  { id: '4', timestamp: 'Oct 28, 2023 - 09:25 AM', message: 'Final exam schedule confirmation sent', status: 'success' },
];

const sampleStaff: StaffMember[] = [
  { id: '1', name: 'Dr. Alice Johnson',   email: 'alice.j@school.edu',  phone: '+1 234-567-8901', assignedExams: ['1','3','5'] },
  { id: '2', name: 'Prof. Bob Smith',     email: 'bob.s@school.edu',   phone: '+1 234-567-8902', assignedExams: ['2','4']     },
  { id: '3', name: 'Dr. Carol Williams',  email: 'carol.w@school.edu', phone: '+1 234-567-8903', assignedExams: ['1','2','6'] },
  { id: '4', name: 'Prof. David Brown',   email: 'david.b@school.edu', phone: '+1 234-567-8904', assignedExams: ['3','4','5'] },
];

const triggerTimeOptions = ['15 minutes','30 minutes','1 hour','2 hours','1 day','2 days','1 week'];
const notificationSounds = ['Chime','Bell','Alert','Notification','Classic','Modern','Gentle'];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const FinalExamSchedule = ({ institutionId = -1 }: { institutionId?: number }) => {
  const { colors, lightMode } = useTheme();
  const navigation = useNavigation();

  const [currentScreen, setCurrentScreen] = useState<
    'timetable' | 'reminder' | 'logs' | 'staff' | 'saved-reminders'
  >('timetable');
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);

  // ── API state ──
  const [examData, setExamData]     = useState<ExamData[]>([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── reminder ──
  const [reminderEnabled, setReminderEnabled]     = useState(true);
  const [triggerTime, setTriggerTime]             = useState('2 days');
  const [notificationSound, setNotificationSound] = useState('Bell');
  const [savedReminders, setSavedReminders]       = useState<ReminderData[]>([]);

  // ── modals ──
  const [showTriggerTimeModal, setShowTriggerTimeModal] = useState(false);
  const [showSoundModal, setShowSoundModal]             = useState(false);

  // ─────────────────────────────────────────────
  // Android Back Button Handler
  // ─────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentScreen === 'reminder' || currentScreen === 'logs' || currentScreen === 'staff' || currentScreen === 'saved-reminders') {
          // Go back to timetable screen
          setCurrentScreen('timetable');
          setSelectedExam(null);
          return true; // Prevent default back behavior
        }
        // On timetable screen, allow default behavior (go back in navigation)
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [currentScreen])
  );

  // ─────────────────────────────────────────────
  // Fetch  –  exam_type=-1 → get ALL → filter
  // client-side for anything containing "final".
  // ─────────────────────────────────────────────
  const fetchFinalExams = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const url =
        `${BASE_URL}${EXAM_SCHEDULE_ENDPOINT}` +
        `?exam_type=-1` +
        `&institution_id=${institutionId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data: ApiExamItem[] = await response.json();

      // Client-side filter: keep only Final exams
      const finalOnly = data.filter((item) => isFinalExam(item.exam_type));
      console.log('[FinalExamSchedule] After filter – kept:', finalOnly.length, 'of', data.length);

      setExamData(mapApiToExams(finalOnly));
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch exam schedule');
      Alert.alert('Fetch Error', err.message || 'Unable to load final exam schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  useEffect(() => {
    fetchFinalExams();
  }, [fetchFinalExams]);

  // ─────────────────────────────────────────────
  // Derived
  // ─────────────────────────────────────────────
  const groupedExams = examData.reduce((acc, exam) => {
    const key = `${exam.day}, ${exam.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(exam);
    return acc;
  }, {} as Record<string, ExamData[]>);

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────
  const handleExamPress       = (exam: ExamData) => { setSelectedExam(exam); setCurrentScreen('reminder'); };
  const handleBackToTimetable = () => { setCurrentScreen('timetable'); setSelectedExam(null); };

  const handleBack = () => {
    if (currentScreen === 'reminder' || currentScreen === 'logs' || currentScreen === 'staff' || currentScreen === 'saved-reminders') {
      setCurrentScreen('timetable');
      setSelectedExam(null);
    }
  };

  const handleSaveReminder = () => {
    if (!selectedExam) return;
    setSavedReminders((prev) => [...prev, {
      id: Date.now().toString(),
      examId: selectedExam.id,
      subject: selectedExam.subject,
      enabled: reminderEnabled,
      triggerTime,
      sound: notificationSound,
      createdAt: new Date(),
    }]);
    Alert.alert('Reminder Saved', `Final exam reminder for ${selectedExam.subject} has been saved successfully!`, [
      { text: 'View All Reminders', onPress: () => setCurrentScreen('saved-reminders') },
      { text: 'OK',                 onPress: handleBackToTimetable },
    ]);
  };

  const handleExportPDF = async () => {
    try {
      const message =
        `Final Exam Schedule\n\n` +
        Object.entries(groupedExams)
          .map(([date, exams]) =>
            `${date}\n` + exams.map((e) => `  • ${e.subject} - ${e.time} (${e.location})`).join('\n')
          ).join('\n\n');
      await Share.share({ message, title: 'Final Exam Schedule' });
    } catch { Alert.alert('Error', 'Failed to share the timetable'); }
  };

  const handleDeleteReminder = (id: string) => {
    Alert.alert('Delete Reminder', 'Are you sure you want to delete this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setSavedReminders((prev) => prev.filter((r) => r.id !== id)) },
    ]);
  };

  // ─────────────────────────────────────────────
  // Modals
  // ─────────────────────────────────────────────
  const renderTriggerTimeModal = () => (
    <Modal visible={showTriggerTimeModal} transparent animationType="slide"
      onRequestClose={() => setShowTriggerTimeModal(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTriggerTimeModal(false)}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Trigger Time</Text>
            <TouchableOpacity onPress={() => setShowTriggerTimeModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.subText} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {triggerTimeOptions.map((option) => (
              <TouchableOpacity key={option}
                style={[styles.modalOption, { borderBottomColor: colors.border }, triggerTime === option && { backgroundColor: colors.surfaceAlt }]}
                onPress={() => { setTriggerTime(option); setShowTriggerTimeModal(false); }}>
                <Text style={[styles.modalOptionText, { color: triggerTime === option ? colors.primary : colors.text }]}>{option}</Text>
                {triggerTime === option && <MaterialIcons name="check" size={24} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderSoundModal = () => (
    <Modal visible={showSoundModal} transparent animationType="slide"
      onRequestClose={() => setShowSoundModal(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSoundModal(false)}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Notification Sound</Text>
            <TouchableOpacity onPress={() => setShowSoundModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.subText} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {notificationSounds.map((sound) => (
              <TouchableOpacity key={sound}
                style={[styles.modalOption, { borderBottomColor: colors.border }, notificationSound === sound && { backgroundColor: colors.surfaceAlt }]}
                onPress={() => { setNotificationSound(sound); setShowSoundModal(false); }}>
                <View style={styles.soundOptionContent}>
                  <MaterialIcons name="music-note" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                  <Text style={[styles.modalOptionText, { color: notificationSound === sound ? colors.primary : colors.text }]}>{sound}</Text>
                </View>
                {notificationSound === sound && <MaterialIcons name="check" size={24} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // ─────────────────────────────────────────────
  // Logs Screen
  // ─────────────────────────────────────────────
  const renderLogsScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={lightMode ? 'dark-content' : 'light-content'} backgroundColor={colors.surface} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="chevron-left" size={24} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notification Logs</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>DELIVERY LOGS</Text>
          {sampleLogs.map((log) => (
            <View key={log.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.logItem}>
                <View style={[styles.logIcon, { backgroundColor: log.status === 'success' ? '#10B9811A' : '#EF44441A' }]}>
                  <MaterialIcons name={log.status === 'success' ? 'check-circle' : 'error'} size={24} color={log.status === 'success' ? '#10B981' : '#EF4444'} />
                </View>
                <View style={styles.logContent}>
                  <Text style={[styles.logMessage, { color: colors.text }]}>{log.message}</Text>
                  <Text style={[styles.logTimestamp, { color: colors.subText }]}>{log.timestamp}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // ─────────────────────────────────────────────
  // Staff Screen
  // ─────────────────────────────────────────────
  const renderStaffScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={lightMode ? 'dark-content' : 'light-content'} backgroundColor={colors.surface} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="chevron-left" size={24} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Staff Assignments</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>ASSIGNED STAFF ({sampleStaff.length})</Text>
          {sampleStaff.map((staff) => (
            <View key={staff.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.staffItem}>
                <View style={[styles.staffAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.staffAvatarText}>{staff.name.split(' ').map((n) => n[0]).join('')}</Text>
                </View>
                <View style={styles.staffDetails}>
                  <Text style={[styles.staffName, { color: colors.text }]}>{staff.name}</Text>
                  <Text style={[styles.staffEmail, { color: colors.subText }]}>{staff.email}</Text>
                  <Text style={[styles.staffPhone, { color: colors.subText }]}>{staff.phone}</Text>
                  <View style={styles.assignedExamsBadge}>
                    <MaterialIcons name="event" size={14} color={colors.primary} />
                    <Text style={[styles.assignedExamsText, { color: colors.primary }]}>
                      {staff.assignedExams.length} exam{staff.assignedExams.length > 1 ? 's' : ''} assigned
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // ─────────────────────────────────────────────
  // Saved Reminders Screen
  // ─────────────────────────────────────────────
  const renderSavedRemindersScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={lightMode ? 'dark-content' : 'light-content'} backgroundColor={colors.surface} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="chevron-left" size={24} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Reminders</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {savedReminders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-off" size={64} color={colors.subText} />
            <Text style={[styles.emptyStateText, { color: colors.subText }]}>No reminders saved yet</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subText }]}>ALL REMINDERS ({savedReminders.length})</Text>
            {savedReminders.map((reminder) => (
              <View key={reminder.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.reminderItem}>
                  <View style={[styles.reminderIcon, { backgroundColor: `${colors.primary}1A` }]}>
                    <MaterialIcons name="notifications-active" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.reminderDetails}>
                    <Text style={[styles.reminderSubject, { color: colors.text }]}>{reminder.subject}</Text>
                    <Text style={[styles.reminderInfo, { color: colors.subText }]}>Alert: {reminder.triggerTime} before</Text>
                    <Text style={[styles.reminderInfo, { color: colors.subText }]}>Sound: {reminder.sound}</Text>
                    <Text style={[styles.reminderInfo, { color: colors.subText }]}>Status: {reminder.enabled ? 'Enabled' : 'Disabled'}</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReminder(reminder.id)}>
                    <MaterialIcons name="delete" size={24} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  // ─────────────────────────────────────────────
  // Timetable Screen (main)
  // ─────────────────────────────────────────────
  const renderTimetableScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={lightMode ? 'dark-content' : 'light-content'} backgroundColor={colors.surface} />

      <View style={styles.headerWithBack}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialIcons name="chevron-left" size={40} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenterContent}>
          <Text style={[styles.headerTitleCenter, { color: colors.text }]}>Final Exam Schedule</Text>
          {examData.length > 0 && examData[0].notificationScheduledDate && (
            <Text style={[styles.headerSubtitle, { color: colors.subText }]}>
              {formatDate(examData[0].notificationScheduledDate)}
            </Text>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.subText }]}>Fetching Final Exam Schedule…</Text>
          </View>
        )}

        {/* Error */}
        {!loading && fetchError && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={56} color="#EF4444" />
            <Text style={[styles.errorTitle, { color: colors.text }]}>Failed to Load Schedule</Text>
            <Text style={[styles.errorSubtitle, { color: colors.subText }]}>{fetchError}</Text>
            <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={fetchFinalExams}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {!loading && !fetchError && examData.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-note" size={64} color={colors.subText} />
            <Text style={[styles.emptyStateText, { color: colors.subText }]}>No Final exams scheduled</Text>
          </View>
        )}

        {/* ── Data ── */}
        {!loading && !fetchError && examData.length > 0 && (
          <>
            {/* Notification Info */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.subText }]}>NOTIFICATION INFO</Text>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.notificationCard}>
                  <View style={[styles.iconContainer, { backgroundColor: '#8B5CF61A' }]}>
                    <MaterialIcons name="school" size={24} color="#8B5CF6" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={[styles.notificationTitle, { color: colors.text }]}>Final Exam Notifications</Text>
                    <Text style={[styles.notificationSubtitle, { color: colors.subText }]}>
                      {examData.filter((e) => e.notificationStatus != null).length} of {examData.length} exams notified
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: '#8B5CF61A' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#8B5CF6' }]}>
                      {examData.some((e) => e.notificationStatus != null) ? 'SENT' : 'PENDING'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.notificationFooter, { borderTopColor: colors.border }]}>
                  <Text style={[styles.scheduledText, { color: colors.subText }]}>
                    {examData[0]?.notificationScheduledDate
                      ? `Scheduled: ${formatDate(examData[0].notificationScheduledDate)}`
                      : 'Not yet scheduled'}
                  </Text>
                  <TouchableOpacity onPress={() => setCurrentScreen('logs')}>
                    <Text style={[styles.viewLogsText, { color: colors.primary }]}>View Logs</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Important Notice */}
            <View style={styles.section}>
              <View style={[styles.importantNotice, { backgroundColor: '#8B5CF60D', borderColor: '#8B5CF61A' }]}>
                <MaterialIcons name="info" size={20} color="#8B5CF6" />
                <Text style={[styles.importantNoticeText, { color: colors.text }]}>
                  Final exams are comprehensive and carry 40% weightage
                </Text>
              </View>
            </View>

            {/* Schedule Overview */}
            <View style={styles.section}>
              <View style={styles.scheduleHeader}>
                <Text style={[styles.sectionTitle, { color: colors.subText }]}>SCHEDULE OVERVIEW</Text>
                <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
                  <MaterialIcons name="download" size={16} color={colors.primary} />
                  <Text style={[styles.exportText, { color: colors.primary }]}>Export PDF</Text>
                </TouchableOpacity>
              </View>

              {Object.entries(groupedExams).map(([dateKey, exams]) => (
                <View key={dateKey} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.dateHeader, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.dateText, { color: colors.subText }]}>{dateKey.toUpperCase()}</Text>
                    <Text style={[styles.subjectCount, { color: colors.primary }]}>
                      {exams.length} Subject{exams.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                  {exams.map((exam, index) => (
                    <TouchableOpacity key={exam.id}
                      style={[styles.examItem, index < exams.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                      onPress={() => handleExamPress(exam)} activeOpacity={0.7}>
                      <View style={styles.examContent}>
                        <View style={[styles.colorBar, { backgroundColor: exam.color }]} />
                        <View style={styles.examDetails}>
                          <View style={styles.examTitleRow}>
                            <Text style={[styles.examSubject, { color: colors.text }]}>{exam.subject}</Text>
                            <View style={styles.finalBadge}>
                              <Text style={styles.finalBadgeText}>FINAL</Text>
                            </View>
                          </View>
                          <Text style={[styles.examTime, { color: colors.subText }]}>{exam.time}</Text>
                        </View>
                      </View>
                      <Text style={[styles.examLocation, { color: colors.placeholder }]}>{exam.location}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            {/* Invigilation */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.subText }]}>INVIGILATION SUMMARY</Text>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.staffContainer}>
                  <View style={styles.avatarGroup}>
                    <View style={[styles.avatar, { backgroundColor: '#60A5FA', borderColor: colors.card }]}><Text style={styles.avatarText}>A</Text></View>
                    <View style={[styles.avatar, { backgroundColor: '#34D399', borderColor: colors.card }]}><Text style={styles.avatarText}>B</Text></View>
                    <View style={[styles.avatar, { backgroundColor: '#FBBF24', borderColor: colors.card }]}><Text style={styles.avatarText}>C</Text></View>
                    <View style={[styles.avatar, { backgroundColor: '#F87171', borderColor: colors.card }]}><Text style={styles.avatarText}>D</Text></View>
                    <View style={[styles.avatarMore, { backgroundColor: colors.surfaceAlt, borderColor: colors.card }]}>
                      <Text style={[styles.avatarMoreText, { color: colors.text }]}>+14</Text>
                    </View>
                  </View>
                  <Text style={[styles.staffText, { color: colors.subText }]}>18 Staff Assigned</Text>
                </View>
                <TouchableOpacity style={[styles.manageButton, { backgroundColor: colors.surfaceAlt }]} onPress={() => setCurrentScreen('staff')}>
                  <Text style={[styles.manageButtonText, { color: colors.primary }]}>Manage Staff Assignments</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Saved Reminders CTA */}
            {savedReminders.length > 0 && (
              <View style={styles.section}>
                <TouchableOpacity style={[styles.savedRemindersButton, { backgroundColor: colors.primary }]} onPress={() => setCurrentScreen('saved-reminders')}>
                  <MaterialIcons name="bookmark" size={20} color="#FFFFFF" />
                  <Text style={styles.savedRemindersButtonText}>View Saved Reminders ({savedReminders.length})</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <View style={[styles.homeIndicator, { backgroundColor: colors.border }]} />
    </SafeAreaView>
  );

  // ─────────────────────────────────────────────
  // Reminder Screen
  // ─────────────────────────────────────────────
  const renderReminderScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <StatusBar barStyle={lightMode ? 'dark-content' : 'light-content'} backgroundColor={colors.surface} />
      <View style={[styles.reminderHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.reminderBackButton} onPress={handleBackToTimetable}>
          <MaterialIcons name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.reminderTitleCenter, { color: colors.text }]}>Set Final Exam Reminder</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.reminderScrollView} contentContainerStyle={styles.reminderScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.reminderSection}>
          <Text style={[styles.reminderSectionTitle, { color: colors.subText }]}>EXAM DETAILS</Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Final Exam Subject</Text>
            <View style={[styles.selectInput, { backgroundColor: colors.card }]}>
              <Text style={[styles.selectText, { color: colors.text }]}>{selectedExam?.subject || 'Select subject'}</Text>
            </View>
            {selectedExam && (
              <View style={[styles.examInfo, { borderTopColor: colors.border }]}>
                <Text style={[styles.examInfoText, { color: colors.subText }]}>{selectedExam.day}, {selectedExam.date} • {selectedExam.time}</Text>
                <Text style={[styles.examInfoText, { color: colors.subText }]}>Location: {selectedExam.location}</Text>
                <View style={styles.finalExamBadge}>
                  <MaterialIcons name="school" size={14} color="#8B5CF6" />
                  <Text style={[styles.finalExamBadgeText, { color: '#8B5CF6' }]}>Final Examination</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.reminderSection}>
          <Text style={[styles.reminderSectionTitle, { color: colors.subText }]}>REMINDER SETTINGS</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}1A` }]}>
                  <MaterialIcons name="notifications-active" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>Enable Notifications</Text>
              </View>
              <Switch value={reminderEnabled} onValueChange={setReminderEnabled}
                trackColor={{ false: colors.surfaceAlt, true: colors.primary }} thumbColor="#FFFFFF" ios_backgroundColor={colors.surfaceAlt} />
            </View>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={() => setShowTriggerTimeModal(true)}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F59E0B1A' }]}>
                  <MaterialIcons name="schedule" size={20} color="#F59E0B" />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>Trigger Alert</Text>
              </View>
              <View style={styles.triggerTimeContainer}>
                <Text style={[styles.triggerTimeText, { color: colors.primary }]}>{triggerTime}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => setShowSoundModal(true)}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#A855F71A' }]}>
                  <MaterialIcons name="music-note" size={20} color="#A855F7" />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>Notification Sound</Text>
              </View>
              <View style={styles.soundRight}>
                <Text style={[styles.soundText, { color: colors.subText }]}>{notificationSound}</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.subText} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={[styles.infoBoxContent, { backgroundColor: '#8B5CF60D', borderColor: '#8B5CF61A' }]}>
            <MaterialIcons name="lightbulb" size={18} color="#8B5CF6" style={{ marginRight: 8 }} />
            <Text style={[styles.infoText, { color: colors.subText, flex: 1 }]}>
              "Final exam reminders are crucial for comprehensive preparation. Set alerts well in advance."
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.reminderFooter, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSaveReminder} activeOpacity={0.8}>
          <MaterialIcons name="save" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Reminder</Text>
        </TouchableOpacity>
      </View>

      {renderTriggerTimeModal()}
      {renderSoundModal()}
    </SafeAreaView>
  );

  // ── Route ──
  if (currentScreen === 'logs')            return renderLogsScreen();
  if (currentScreen === 'staff')           return renderStaffScreen();
  if (currentScreen === 'saved-reminders') return renderSavedRemindersScreen();
  if (currentScreen === 'reminder')        return renderReminderScreen();
  return renderTimetableScreen();
};

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  headerWithBack: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 8 },
  headerBackButton: { padding: 4 },
  headerCenterContent: { alignItems: 'center', flex: 1 },
  headerSpacer: { width: 40 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, fontWeight: '500', marginLeft: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerTitleCenter: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, fontWeight: '500' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 12 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 12 },
  importantNotice: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
  importantNoticeText: { fontSize: 14, fontWeight: '500', marginLeft: 12, flex: 1 },
  notificationCard: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  notificationContent: { flex: 1 },
  notificationTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  notificationSubtitle: { fontSize: 14 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },
  notificationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  scheduledText: { fontSize: 14 },
  viewLogsText: { fontSize: 14, fontWeight: '600' },
  scheduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exportButton: { flexDirection: 'row', alignItems: 'center' },
  exportText: { fontSize: 14, fontWeight: '500', marginLeft: 4 },
  dateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderTopLeftRadius: 16, borderTopRightRadius: 16, marginHorizontal: -16, marginTop: -16, marginBottom: 8 },
  dateText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  subjectCount: { fontSize: 12, fontWeight: '500' },
  examItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  examContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  colorBar: { width: 6, height: 40, borderRadius: 3, marginRight: 12 },
  examDetails: { flex: 1 },
  examTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  examSubject: { fontSize: 14, fontWeight: '700', marginRight: 8 },
  finalBadge: { backgroundColor: '#8B5CF61A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  finalBadgeText: { color: '#8B5CF6', fontSize: 9, fontWeight: '700' },
  examTime: { fontSize: 12 },
  examLocation: { fontSize: 10, fontWeight: '500' },
  staffContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarGroup: { flexDirection: 'row', marginRight: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: -8, borderWidth: 2 },
  avatarText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  avatarMore: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: -8, borderWidth: 2 },
  avatarMoreText: { fontSize: 10, fontWeight: '700' },
  staffText: { fontSize: 14, fontWeight: '500' },
  manageButton: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  manageButtonText: { fontSize: 14, fontWeight: '700' },
  homeIndicator: { position: 'absolute', bottom: 4, left: '50%', width: 128, height: 4, borderRadius: 2, transform: [{ translateX: -64 }] },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  reminderBackButton: { position: 'absolute', left: 16 },
  reminderTitleCenter: { fontSize: 18, fontWeight: '700' },
  reminderScrollView: { flex: 1 },
  reminderScrollContent: { paddingBottom: 120 },
  reminderSection: { marginTop: 16 },
  reminderSectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, paddingHorizontal: 16, paddingBottom: 8, paddingTop: 16 },
  inputContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  inputLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  selectInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  selectText: { fontSize: 16, fontWeight: '400' },
  examInfo: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  examInfoText: { fontSize: 13, marginBottom: 4 },
  finalExamBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 6 },
  finalExamBadgeText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  settingsCard: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, minHeight: 56, borderBottomWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingText: { fontSize: 16, fontWeight: '500' },
  triggerTimeContainer: { flexDirection: 'row', alignItems: 'center' },
  triggerTimeText: { fontSize: 16, fontWeight: '600', marginRight: 4 },
  soundRight: { flexDirection: 'row', alignItems: 'center' },
  soundText: { fontSize: 14, marginRight: 4 },
  infoBox: { marginTop: 32, paddingHorizontal: 16, alignItems: 'center' },
  infoBoxContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderRadius: 12, borderWidth: 1 },
  infoText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  reminderFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
  saveButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalScroll: { maxHeight: 400 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalOptionText: { fontSize: 16, fontWeight: '500' },
  soundOptionContent: { flexDirection: 'row', alignItems: 'center' },
  logItem: { flexDirection: 'row', alignItems: 'flex-start' },
  logIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logContent: { flex: 1 },
  logMessage: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  logTimestamp: { fontSize: 12 },
  staffItem: { flexDirection: 'row', alignItems: 'flex-start' },
  staffAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  staffAvatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  staffDetails: { flex: 1 },
  staffName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  staffEmail: { fontSize: 13, marginBottom: 2 },
  staffPhone: { fontSize: 13, marginBottom: 8 },
  assignedExamsBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  assignedExamsText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyStateText: { fontSize: 16, marginTop: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  loadingText: { fontSize: 15, marginTop: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80, paddingHorizontal: 24 },
  errorTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  errorSubtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  retryButton: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  reminderItem: { flexDirection: 'row', alignItems: 'flex-start' },
  reminderIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reminderDetails: { flex: 1 },
  reminderSubject: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  reminderInfo: { fontSize: 13, marginBottom: 3 },
  deleteButton: { padding: 8 },
  savedRemindersButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  savedRemindersButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginLeft: 8 },
});

export default FinalExamSchedule;