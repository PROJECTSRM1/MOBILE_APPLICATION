import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Switch,
  Platform,
  Modal,
  Alert,
  Share,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../context/ThemeContext";



// Types
interface ExamData {
  id: string;
  subject: string;
  date: string;
  day: string;
  time: string;
  location: string;
  color: string;
  category: 'midterm' | 'final';
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

// Add Props interface for navigation
interface MidTermNotificationsProps {
  navigation?: any; // Add your navigation type here
  onBack?: () => void; // Or use a callback function
}

// Sample Data
const examData: ExamData[] = [
  {
    id: '1',
    subject: 'Mathematics',
    date: 'Oct 02',
    day: 'Monday',
    time: '09:00 AM - 11:30 AM',
    location: 'Hall A',
    color: '#3B82F6',
    category: 'midterm',
  },
  {
    id: '2',
    subject: 'English Literature',
    date: 'Oct 02',
    day: 'Monday',
    time: '01:00 PM - 03:00 PM',
    location: 'Room 402',
    color: '#A855F7',
    category: 'midterm',
  },
  {
    id: '3',
    subject: 'Physical Sciences',
    date: 'Oct 03',
    day: 'Tuesday',
    time: '10:00 AM - 12:30 PM',
    location: 'Lab 2',
    color: '#10B981',
    category: 'midterm',
  },
  {
    id: '4',
    subject: 'History & Civics',
    date: 'Oct 04',
    day: 'Wednesday',
    time: '02:00 PM - 04:00 PM',
    location: 'Main Hall',
    color: '#F59E0B',
    category: 'midterm',
  },
  {
    id: '5',
    subject: 'Chemistry',
    date: 'Nov 15',
    day: 'Tuesday',
    time: '10:00 AM - 12:00 PM',
    location: 'Lab 1',
    color: '#EF4444',
    category: 'final',
  },
  {
    id: '6',
    subject: 'Physics',
    date: 'Nov 16',
    day: 'Wednesday',
    time: '09:00 AM - 11:00 AM',
    location: 'Hall B',
    color: '#8B5CF6',
    category: 'final',
  },
];

const sampleLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: 'Sep 20, 2023 - 10:30 AM',
    message: 'Notification sent to 285 parents',
    status: 'success',
  },
  {
    id: '2',
    timestamp: 'Sep 20, 2023 - 10:31 AM',
    message: 'Failed to send to 15 contacts',
    status: 'failed',
  },
  {
    id: '3',
    timestamp: 'Sep 20, 2023 - 10:35 AM',
    message: 'Retry successful for 12 contacts',
    status: 'success',
  },
];

const sampleStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Alice Johnson',
    email: 'alice.j@school.edu',
    phone: '+1 234-567-8901',
    assignedExams: ['1', '3'],
  },
  {
    id: '2',
    name: 'Prof. Bob Smith',
    email: 'bob.s@school.edu',
    phone: '+1 234-567-8902',
    assignedExams: ['2', '4'],
  },
  {
    id: '3',
    name: 'Dr. Carol Williams',
    email: 'carol.w@school.edu',
    phone: '+1 234-567-8903',
    assignedExams: ['1', '2'],
  },
];

const triggerTimeOptions = ['15 minutes', '30 minutes', '1 hour', '2 hours', '1 day', '2 days', '1 week'];
const notificationSounds = ['Chime', 'Bell', 'Alert', 'Notification', 'Classic', 'Modern', 'Gentle'];

const MidTermNotifications: React.FC<MidTermNotificationsProps> = ({ navigation, onBack }) => {
  const { colors, lightMode } = useTheme();
  
  const [currentScreen, setCurrentScreen] = useState<'timetable' | 'reminder' | 'logs' | 'staff' | 'saved-reminders'>('timetable');
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [activeTab, setActiveTab] = useState<'midterm' | 'final'>('midterm');
  const [activeNavTab, setActiveNavTab] = useState('home');
  
  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [triggerTime, setTriggerTime] = useState('1 day');
  const [notificationSound, setNotificationSound] = useState('Chime');
  const [savedReminders, setSavedReminders] = useState<ReminderData[]>([]);
  
  // Modal states
  const [showTriggerTimeModal, setShowTriggerTimeModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);

  const filteredExams = examData.filter(exam => exam.category === activeTab);

  const groupedExams = filteredExams.reduce((acc, exam) => {
    const key = `${exam.day}, ${exam.date}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(exam);
    return acc;
  }, {} as Record<string, ExamData[]>);

  const handleExamPress = (exam: ExamData) => {
    setSelectedExam(exam);
    setCurrentScreen('reminder');
  };

  const handleBackToTimetable = () => {
    setCurrentScreen('timetable');
    setSelectedExam(null);
  };

  const handleBack = () => {
    if (currentScreen === 'timetable') {
      // Navigate to previous screen in your app
      if (navigation) {
        navigation.goBack();
      } else if (onBack) {
        onBack();
      } else {
        // Fallback: show alert if no navigation is provided
        Alert.alert('Navigation', 'Please provide navigation prop or onBack callback');
      }
    } else {
      setCurrentScreen('timetable');
      setSelectedExam(null);
    }
  };


  const handleSaveReminder = () => {
    if (!selectedExam) return;

    const newReminder: ReminderData = {
      id: Date.now().toString(),
      examId: selectedExam.id,
      subject: selectedExam.subject,
      enabled: reminderEnabled,
      triggerTime,
      sound: notificationSound,
      createdAt: new Date(),
    };

    setSavedReminders([...savedReminders, newReminder]);
    
    Alert.alert(
      'Reminder Saved',
      `Reminder for ${selectedExam.subject} has been saved successfully!`,
      [
        {
          text: 'View All Reminders',
          onPress: () => setCurrentScreen('saved-reminders'),
        },
        {
          text: 'OK',
          onPress: handleBackToTimetable,
        },
      ]
    );
  };

  const handleExportPDF = async () => {
    try {
      const message = `Exam Timetable - ${activeTab === 'midterm' ? 'Mid-term' : 'Final'} Exams\n\n${Object.entries(groupedExams).map(([date, exams]) => 
        `${date}\n${exams.map(exam => `  • ${exam.subject} - ${exam.time} (${exam.location})`).join('\n')}`
      ).join('\n\n')}`;

      await Share.share({
        message: message,
        title: 'Exam Timetable',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the timetable');
    }
  };

  const handleViewLogs = () => {
    setCurrentScreen('logs');
  };

  const handleManageStaff = () => {
    setCurrentScreen('staff');
  };

  const handleViewSavedReminders = () => {
    setCurrentScreen('saved-reminders');
  };

  const handleDeleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedReminders(savedReminders.filter(r => r.id !== id));
          },
        },
      ]
    );
  };

  // Render Trigger Time Modal
  const renderTriggerTimeModal = () => (
    <Modal
      visible={showTriggerTimeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTriggerTimeModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowTriggerTimeModal(false)}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Trigger Time</Text>
            <TouchableOpacity onPress={() => setShowTriggerTimeModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.subText} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {triggerTimeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  { borderBottomColor: colors.border },
                  triggerTime === option && { backgroundColor: colors.surfaceAlt },
                ]}
                onPress={() => {
                  setTriggerTime(option);
                  setShowTriggerTimeModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  { color: triggerTime === option ? colors.primary : colors.text }
                ]}>
                  {option}
                </Text>
                {triggerTime === option && (
                  <MaterialIcons name="check" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Render Notification Sound Modal
  const renderSoundModal = () => (
    <Modal
      visible={showSoundModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSoundModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSoundModal(false)}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Notification Sound</Text>
            <TouchableOpacity onPress={() => setShowSoundModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.subText} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {notificationSounds.map((sound) => (
              <TouchableOpacity
                key={sound}
                style={[
                  styles.modalOption,
                  { borderBottomColor: colors.border },
                  notificationSound === sound && { backgroundColor: colors.surfaceAlt },
                ]}
                onPress={() => {
                  setNotificationSound(sound);
                  setShowSoundModal(false);
                }}
              >
                <View style={styles.soundOptionContent}>
                  <MaterialIcons name="music-note" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                  <Text style={[
                    styles.modalOptionText,
                    { color: notificationSound === sound ? colors.primary : colors.text }
                  ]}>
                    {sound}
                  </Text>
                </View>
                {notificationSound === sound && (
                  <MaterialIcons name="check" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Render Logs Screen
  const renderLogsScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        backgroundColor={colors.surface}
      />

      {/* Header */}
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
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>
            DELIVERY LOGS
          </Text>
          {sampleLogs.map((log) => (
            <View
              key={log.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.logItem}>
                <View style={[
                  styles.logIcon,
                  { backgroundColor: log.status === 'success' ? '#10B9811A' : '#EF44441A' }
                ]}>
                  <MaterialIcons
                    name={log.status === 'success' ? 'check-circle' : 'error'}
                    size={24}
                    color={log.status === 'success' ? '#10B981' : '#EF4444'}
                  />
                </View>
                <View style={styles.logContent}>
                  <Text style={[styles.logMessage, { color: colors.text }]}>
                    {log.message}
                  </Text>
                  <Text style={[styles.logTimestamp, { color: colors.subText }]}>
                    {log.timestamp}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Render Staff Management Screen
  const renderStaffScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        backgroundColor={colors.surface}
      />

      {/* Header */}
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
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>
            ASSIGNED STAFF ({sampleStaff.length})
          </Text>
          {sampleStaff.map((staff) => (
            <View
              key={staff.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.staffItem}>
                <View style={[styles.staffAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.staffAvatarText}>
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.staffDetails}>
                  <Text style={[styles.staffName, { color: colors.text }]}>
                    {staff.name}
                  </Text>
                  <Text style={[styles.staffEmail, { color: colors.subText }]}>
                    {staff.email}
                  </Text>
                  <Text style={[styles.staffPhone, { color: colors.subText }]}>
                    {staff.phone}
                  </Text>
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

  // Render Saved Reminders Screen
  const renderSavedRemindersScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        backgroundColor={colors.surface}
      />

      {/* Header */}
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
            <Text style={[styles.emptyStateText, { color: colors.subText }]}>
              No reminders saved yet
            </Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subText }]}>
              ALL REMINDERS ({savedReminders.length})
            </Text>
            {savedReminders.map((reminder) => (
              <View
                key={reminder.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.reminderItem}>
                  <View style={[styles.reminderIcon, { backgroundColor: `${colors.primary}1A` }]}>
                    <MaterialIcons name="notifications-active" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.reminderDetails}>
                    <Text style={[styles.reminderSubject, { color: colors.text }]}>
                      {reminder.subject}
                    </Text>
                    <Text style={[styles.reminderInfo, { color: colors.subText }]}>
                      Alert: {reminder.triggerTime} before
                    </Text>
                    <Text style={[styles.reminderInfo, { color: colors.subText }]}>
                      Sound: {reminder.sound}
                    </Text>
                    <Text style={[styles.reminderInfo, { color: colors.subText }]}>
                      Status: {reminder.enabled ? 'Enabled' : 'Disabled'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteReminder(reminder.id)}
                  >
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

  // Render Exam Timetable Screen
  const renderTimetableScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <View style={styles.headerWithBack}>
  <TouchableOpacity
    style={styles.headerBackButton}
    onPress={handleBack}
    activeOpacity={0.7}
  >
    <MaterialIcons
      name="chevron-left"
      size={36}
      color={colors.primary}
    />
  </TouchableOpacity>

  <View style={styles.headerCenterContent}>
    <Text style={[styles.headerTitleCenter, { color: colors.text }]}>
      Exam Timetable
    </Text>
  </View>

  <View style={styles.headerSpacer} />
</View>


      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>
            NOTIFICATION INFO
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.notificationCard}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="notifications-active" size={24} color="#F59E0B" />
              </View>
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                  Mid-term Notifications
                </Text>
                <Text style={[styles.notificationSubtitle, { color: colors.subText }]}>
                  Sent to 95% of parent contacts
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>SENT</Text>
              </View>
            </View>
            <View style={[styles.notificationFooter, { borderTopColor: colors.border }]}>
              <Text style={[styles.scheduledText, { color: colors.subText }]}>
                Scheduled: Sep 20, 2023
              </Text>
              <TouchableOpacity onPress={handleViewLogs}>
                <Text style={[styles.viewLogsText, { color: colors.primary }]}>View Logs</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Schedule Overview */}
        <View style={styles.section}>
          <View style={styles.scheduleHeader}>
            <Text style={[styles.sectionTitle, { color: colors.subText }]}>
              SCHEDULE OVERVIEW
            </Text>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
              <MaterialIcons name="download" size={16} color={colors.primary} />
              <Text style={[styles.exportText, { color: colors.primary }]}>Export PDF</Text>
            </TouchableOpacity>
          </View>

          {Object.entries(groupedExams).map(([dateKey, exams]) => (
            <View
              key={dateKey}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.dateHeader, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.dateText, { color: colors.subText }]}>
                  {dateKey.toUpperCase()}
                </Text>
                <Text style={[styles.subjectCount, { color: colors.primary }]}>
                  {exams.length} Subject{exams.length > 1 ? 's' : ''}
                </Text>
              </View>
              {exams.map((exam, index) => (
                <TouchableOpacity
                  key={exam.id}
                  style={[
                    styles.examItem,
                    index < exams.length - 1 && { 
                      borderBottomWidth: 1, 
                      borderBottomColor: colors.border
                    }
                  ]}
                  onPress={() => handleExamPress(exam)}
                  activeOpacity={0.7}
                >
                  <View style={styles.examContent}>
                    <View style={[styles.colorBar, { backgroundColor: exam.color }]} />
                    <View style={styles.examDetails}>
                      <Text style={[styles.examSubject, { color: colors.text }]}>
                        {exam.subject}
                      </Text>
                      <Text style={[styles.examTime, { color: colors.subText }]}>
                        {exam.time}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.examLocation, { color: colors.placeholder }]}>
                    {exam.location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Invigilation Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>
            INVIGILATION SUMMARY
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.staffContainer}>
              <View style={styles.avatarGroup}>
                <View style={[styles.avatar, { backgroundColor: '#60A5FA', borderColor: colors.card }]}>
                  <Text style={styles.avatarText}>A</Text>
                </View>
                <View style={[styles.avatar, { backgroundColor: '#34D399', borderColor: colors.card }]}>
                  <Text style={styles.avatarText}>B</Text>
                </View>
                <View style={[styles.avatar, { backgroundColor: '#FBBF24', borderColor: colors.card }]}>
                  <Text style={styles.avatarText}>C</Text>
                </View>
                <View style={[styles.avatarMore, { backgroundColor: colors.surfaceAlt, borderColor: colors.card }]}>
                  <Text style={[styles.avatarMoreText, { color: colors.text }]}>+12</Text>
                </View>
              </View>
              <Text style={[styles.staffText, { color: colors.subText }]}>
                15 Staff Assigned
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.manageButton, { backgroundColor: colors.surfaceAlt }]}
              onPress={handleManageStaff}
            >
              <Text style={[styles.manageButtonText, { color: colors.primary }]}>
                Manage Staff Assignments
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved Reminders Button */}
        {savedReminders.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.savedRemindersButton, { backgroundColor: colors.primary }]}
              onPress={handleViewSavedReminders}
            >
              <MaterialIcons name="bookmark" size={20} color="#FFFFFF" />
              <Text style={styles.savedRemindersButtonText}>
                View Saved Reminders ({savedReminders.length})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={[styles.homeIndicator, { backgroundColor: colors.border }]} />
    </SafeAreaView>
  );

  // Render Set Reminder Screen
  const renderReminderScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <StatusBar
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <View style={[styles.reminderHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.reminderBackButton}
          onPress={handleBackToTimetable}
        >
          <MaterialIcons name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.reminderTitleCenter, { color: colors.text }]}>
          Set Exam Reminder
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.reminderScrollView}
        contentContainerStyle={styles.reminderScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Exam Details Section */}
        <View style={styles.reminderSection}>
          <Text style={[styles.reminderSectionTitle, { color: colors.subText }]}>
            EXAM DETAILS
          </Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Exam Subject
            </Text>
            <View style={[styles.selectInput, { backgroundColor: colors.card }]}>
              <Text style={[styles.selectText, { color: colors.text }]}>
                {selectedExam?.subject || 'Select subject'}
              </Text>
            </View>
            {selectedExam && (
              <View style={[styles.examInfo, { borderTopColor: colors.border }]}>
                <Text style={[styles.examInfoText, { color: colors.subText }]}>
                  {selectedExam.day}, {selectedExam.date} • {selectedExam.time}
                </Text>
                <Text style={[styles.examInfoText, { color: colors.subText }]}>
                  Location: {selectedExam.location}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Reminder Settings Section */}
        <View style={styles.reminderSection}>
          <Text style={[styles.reminderSectionTitle, { color: colors.subText }]}>
            REMINDER SETTINGS
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            {/* Enable Notifications */}
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}1A` }]}>
                  <MaterialIcons name="notifications-active" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Enable Notifications
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.surfaceAlt}
              />
            </View>

            {/* Trigger Alert */}
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
              onPress={() => setShowTriggerTimeModal(true)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F59E0B1A' }]}>
                  <MaterialIcons name="schedule" size={20} color="#F59E0B" />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Trigger Alert
                </Text>
              </View>
              <View style={styles.triggerTimeContainer}>
                <Text style={[styles.triggerTimeText, { color: colors.primary }]}>
                  {triggerTime}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>

            {/* Notification Sound */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setShowSoundModal(true)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#A855F71A' }]}>
                  <MaterialIcons name="music-note" size={20} color="#A855F7" />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Notification Sound
                </Text>
              </View>
              <View style={styles.soundRight}>
                <Text style={[styles.soundText, { color: colors.subText }]}>
                  {notificationSound}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.subText} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={[styles.infoBoxContent, { backgroundColor: `${colors.primary}0D`, borderColor: `${colors.primary}1A` }]}>
            <Text style={[styles.infoText, { color: colors.subText }]}>
              "Reminders help ensure all staff are prepared for upcoming proctoring duties."
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button Footer */}
      <View style={[styles.reminderFooter, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveReminder}
          activeOpacity={0.8}
        >
          <MaterialIcons name="save" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Reminder</Text>
        </TouchableOpacity>
      </View>

      {renderTriggerTimeModal()}
      {renderSoundModal()}
    </SafeAreaView>
  );

  // Main render logic
  if (currentScreen === 'logs') return renderLogsScreen();
  if (currentScreen === 'staff') return renderStaffScreen();
  if (currentScreen === 'saved-reminders') return renderSavedRemindersScreen();
  if (currentScreen === 'reminder') return renderReminderScreen();
  return renderTimetableScreen();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerCenter: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerWithBack: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 16,
},

headerBackButton: {
  padding: 8,
  borderRadius: 20,
},

headerCenterContent: {
  flex: 1,
  alignItems: 'center',
},

headerSpacer: {
  width: 36,
},

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitleCenter: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F59E0B1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: '#10B9811A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  scheduledText: {
    fontSize: 14,
  },
  viewLogsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subjectCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  examItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  examContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorBar: {
    width: 6,
    height: 40,
    borderRadius: 3,
    marginRight: 12,
  },
  examDetails: {
    flex: 1,
  },
  examSubject: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  examTime: {
    fontSize: 12,
  },
  examLocation: {
    fontSize: 10,
    fontWeight: '500',
  },
  staffContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  avatarMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
  },
  avatarMoreText: {
    fontSize: 10,
    fontWeight: '700',
  },
  staffText: {
    fontSize: 14,
    fontWeight: '500',
  },
  manageButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    width: 128,
    height: 4,
    borderRadius: 2,
    transform: [{ translateX: -64 }],
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  reminderBackButton: {
    position: 'absolute',
    left: 16,
  },
  reminderTitleCenter: {
    fontSize: 18,
    fontWeight: '700',
  },
  reminderScrollView: {
    flex: 1,
  },
  reminderScrollContent: {
    paddingBottom: 120,
  },
  reminderSection: {
    marginTop: 16,
  },
  reminderSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectText: {
    fontSize: 16,
    fontWeight: '400',
  },
  examInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  examInfoText: {
    fontSize: 13,
    marginBottom: 4,
  },
  settingsCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  triggerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerTimeText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  soundRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundText: {
    fontSize: 14,
    marginRight: 4,
  },
  infoBox: {
    marginTop: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  infoBoxContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  reminderFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  soundOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logMessage: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  logTimestamp: {
    fontSize: 12,
  },
  staffItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  staffAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  staffAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  staffEmail: {
    fontSize: 13,
    marginBottom: 2,
  },
  staffPhone: {
    fontSize: 13,
    marginBottom: 8,
  },
  assignedExamsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  assignedExamsText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderSubject: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  reminderInfo: {
    fontSize: 13,
    marginBottom: 3,
  },
  deleteButton: {
    padding: 8,
  },
  savedRemindersButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  savedRemindersButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default MidTermNotifications;