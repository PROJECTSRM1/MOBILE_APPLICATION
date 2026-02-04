import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

interface Student {
  id: string;
  name: string;
  studentId: string;
  year: number;
  fatherName?: string;
  admissionDate?: string;
  currentSgpa?: string;
  attendance?: string;
  backlogs?: string;
  avatar?: string;
  initials: string;
  color: string;
}

const InstitutionStudents = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, lightMode } = useTheme();
  const styles = getStyles(colors);

  // Branch ID from previous screen
  const branchId = route?.params?.branchId;
  const branchName = route?.params?.branchName;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'id'>('name');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleStudents, setVisibleStudents] = useState(10);

  // Fetch students from backend
  useEffect(() => {
    if (!branchId) {
      console.log('❌ branchId not received in InstitutionStudents screen');
      Alert.alert('Error', 'Branch ID not found');
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        const url = `https://swachify-india-be-1-mcrb.onrender.com/institution/student/by_branch_id?branch_id=${branchId}`;
        console.log('🌍 Calling API:', url);

        const response = await fetch(url);
        console.log('📡 Status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('🎯 RAW Students API Response:', data);

        // Handle both array and object response formats
        const studentList = Array.isArray(data) ? data : data.students || [];

        if (studentList.length === 0) {
          console.log('⚠️ No students found for this branch');
        }

        const formatted: Student[] = studentList.map((item: any, index: number) => {
          // Extract first name for initials
          const fullName = item.student_name || 'Unknown';
          const nameParts = fullName.split(' ');
          const initials = nameParts
            .slice(0, 2)
            .map((n: string) => n[0])
            .join('')
            .toUpperCase();

          return {
            id: item.student_id?.toString() || index.toString(),
            name: fullName,
            studentId: item.student_id?.toString() || 'N/A',
            year: parseInt(item.academic_year?.split('-')[0]) || 1,
            fatherName: item.father_name || '—',
            admissionDate: item.admission_date || '—',
            currentSgpa: item.current_sgpa || '—',
            attendance: item.attendance || '—',
            backlogs: item.backlogs?.toString() || '0',
            avatar: item.profile_image_url || undefined,
            initials: initials || 'NA',
            color: ['#64748b', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 6],
          };
        });

        console.log('✅ Formatted Students:', formatted.length);
        setStudents(formatted);
      } catch (error: any) {
        console.error('❌ Error fetching students:', error);
        Alert.alert('Error', 'Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [branchId]);

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'year') return a.year - b.year;
    return a.studentId.localeCompare(b.studentId);
  });

  // Display limited students
  const displayedStudents = sortedStudents.slice(0, visibleStudents);

  const loadMoreStudents = () => {
    setVisibleStudents((prev) => Math.min(prev + 10, sortedStudents.length));
  };

  const handleSortToggle = () => {
    if (sortBy === 'name') setSortBy('year');
    else if (sortBy === 'year') setSortBy('id');
    else setSortBy('name');
  };

  const getSortLabel = () => {
    if (sortBy === 'name') return 'Sort by: Name';
    if (sortBy === 'year') return 'Sort by: Year';
    return 'Sort by: ID';
  };

  // Handle student card click
  const handleStudentClick = (student: Student) => {
    navigation.navigate('StudentOverviewScreen', { 
      student: {
        ...student,
        branchId,
        branchName,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        backgroundColor={colors.card}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {branchName || `Branch ${branchId}`}
        </Text>

        {/* Three dots menu - placeholder for future functionality */}
        <TouchableOpacity 
  style={styles.filterButton}
  onPress={() => {
    // Future: Add filter/sort options menu
    Alert.alert('Coming Soon', 'Advanced filters will be available soon');
  }}
>
  <Icon name="tune" size={24} color={colors.text} />
</TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.subText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or student ID"
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={colors.subText} />
          </TouchableOpacity>
        )}
      </View>

      {/* Students Header */}
      <View style={styles.studentsHeader}>
        <Text style={styles.studentCount}>
          STUDENTS ({filteredStudents.length})
        </Text>
        <TouchableOpacity onPress={handleSortToggle}>
          <Text style={styles.sortButton}>{getSortLabel()}</Text>
        </TouchableOpacity>
      </View>

      {/* Students List */}
      <ScrollView
        style={styles.studentsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.studentsListContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading students...</Text>
          </View>
        ) : displayedStudents.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={64} color={colors.border} />
            <Text style={styles.emptyStateText}>No Students Found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'No students enrolled in this branch'}
            </Text>
          </View>
        ) : (
          <>
            {displayedStudents.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.studentCard}
                activeOpacity={0.7}
                onPress={() => handleStudentClick(student)}
              >
                {student.avatar ? (
                  <Image 
                    source={{ uri: student.avatar }} 
                    style={styles.studentAvatar} 
                  />
                ) : (
                  <View
                    style={[
                      styles.studentAvatarPlaceholder,
                      { backgroundColor: student.color },
                    ]}
                  >
                    <Text style={styles.studentInitials}>
                      {student.initials}
                    </Text>
                  </View>
                )}

                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View style={styles.studentMeta}>
                    <Text style={styles.studentId}>ID: {student.studentId}</Text>
                    <Text style={styles.studentMetaSeparator}> • </Text>
                    <Text style={styles.studentYear}>Year {student.year}</Text>
                  </View>
                </View>

                <Icon name="chevron-right" size={24} color={colors.placeholder} />
              </TouchableOpacity>
            ))}

            {/* Load More Button */}
            {visibleStudents < sortedStudents.length && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreStudents}
              >
                <Icon name="refresh" size={18} color={colors.primary} />
                <Text style={styles.loadMoreText}>
                  Load More ({sortedStudents.length - visibleStudents} remaining)
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InstitutionStudents;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 8,
    },
    filterButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      padding: 0,
    },
    studentsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 8,
    },
    studentCount: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.subText,
      letterSpacing: 0.5,
    },
    sortButton: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
    },
    studentsList: {
      flex: 1,
    },
    studentsListContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 80,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 14,
      color: colors.subText,
    },
    studentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    studentAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    studentAvatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    studentInitials: {
      fontSize: 16,
      fontWeight: '700',
      color: '#ffffff',
    },
    studentInfo: {
      flex: 1,
    },
    studentName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    studentMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    studentId: {
      fontSize: 13,
      color: colors.subText,
    },
    studentMetaSeparator: {
      fontSize: 13,
      color: colors.border,
    },
    studentYear: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
    },
    loadMoreButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      marginTop: 8,
      marginBottom: 16,
      gap: 8,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    loadMoreText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.subText,
      marginTop: 16,
      marginBottom: 4,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: colors.placeholder,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
  });