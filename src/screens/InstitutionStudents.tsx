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
  Modal,
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
  const [visibleStudents, setVisibleStudents] = useState(20); // Initial load: 20 students
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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
          const nameParts = fullName.trim().split(' ');
          
          // Get first two initials from name parts
          let initials = '';
          if (nameParts.length >= 2) {
            initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
          } else if (nameParts.length === 1) {
            initials = nameParts[0].substring(0, 2).toUpperCase();
          } else {
            initials = 'NA';
          }

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
            initials: initials,
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
  const remainingStudents = sortedStudents.length - visibleStudents;
  const hasMoreStudents = remainingStudents > 0;

  const loadMoreStudents = () => {
    // Load 20 more students at a time
    setVisibleStudents((prev) => Math.min(prev + 20, sortedStudents.length));
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

  // Handle filter button click
  const handleFilterPress = () => {
    setShowFilterMenu(true);
  };

  // Apply filter
  const applyFilter = (filterType: 'name' | 'year' | 'id') => {
    setSortBy(filterType);
    setShowFilterMenu(false);
    // Reset visible students when filter changes
    setVisibleStudents(20);
  };

  // Reset visible students when search changes
  useEffect(() => {
    setVisibleStudents(20);
  }, [searchQuery]);

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

        {/* Filter button */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleFilterPress}
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
          {filteredStudents.length > visibleStudents && (
            <Text style={styles.studentCountSubtext}>
              {' '}• Showing {visibleStudents}
            </Text>
          )}
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
                {/* Avatar with proper initials display */}
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

            {/* Load More Button - Optimized for large lists */}
            {hasMoreStudents && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreStudents}
                activeOpacity={0.7}
              >
                <View style={styles.loadMoreContent}>
                  <Icon name="expand-more" size={24} color={colors.primary} />
                  <View style={styles.loadMoreTextContainer}>
                    <Text style={styles.loadMoreText}>Load More Students</Text>
                    <Text style={styles.loadMoreSubtext}>
                      {remainingStudents} more student{remainingStudents !== 1 ? 's' : ''} available
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* All Loaded Message */}
            {!hasMoreStudents && sortedStudents.length > 20 && (
              <View style={styles.allLoadedContainer}>
                <Icon name="check-circle" size={20} color={colors.primary} />
                <Text style={styles.allLoadedText}>
                  All {sortedStudents.length} students loaded
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Filter Menu Modal */}
      <Modal
        visible={showFilterMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterMenu(false)}
        >
          <View style={styles.filterMenuContainer}>
            <View style={styles.filterMenuHeader}>
              <Text style={styles.filterMenuTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterMenu(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterMenuContent}>
              <Text style={styles.filterSectionTitle}>SORT BY</Text>
              
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortBy === 'name' && styles.filterOptionActive,
                ]}
                onPress={() => applyFilter('name')}
              >
                <Icon
                  name="sort-by-alpha"
                  size={22}
                  color={sortBy === 'name' ? colors.primary : colors.subText}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    sortBy === 'name' && styles.filterOptionTextActive,
                  ]}
                >
                  Name (A-Z)
                </Text>
                {sortBy === 'name' && (
                  <Icon name="check" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortBy === 'year' && styles.filterOptionActive,
                ]}
                onPress={() => applyFilter('year')}
              >
                <Icon
                  name="calendar-today"
                  size={22}
                  color={sortBy === 'year' ? colors.primary : colors.subText}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    sortBy === 'year' && styles.filterOptionTextActive,
                  ]}
                >
                  Academic Year
                </Text>
                {sortBy === 'year' && (
                  <Icon name="check" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortBy === 'id' && styles.filterOptionActive,
                ]}
                onPress={() => applyFilter('id')}
              >
                <Icon
                  name="badge"
                  size={22}
                  color={sortBy === 'id' ? colors.primary : colors.subText}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    sortBy === 'id' && styles.filterOptionTextActive,
                  ]}
                >
                  Student ID
                </Text>
                {sortBy === 'id' && (
                  <Icon name="check" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    studentCountSubtext: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.placeholder,
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
      color: '#FFFFFF',
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
      backgroundColor: colors.card,
      borderRadius: 12,
      marginTop: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    loadMoreContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      gap: 12,
    },
    loadMoreTextContainer: {
      alignItems: 'center',
    },
    loadMoreText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 2,
    },
    loadMoreSubtext: {
      fontSize: 12,
      color: colors.subText,
    },
    allLoadedContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    allLoadedText: {
      fontSize: 14,
      fontWeight: '500',
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    filterMenuContainer: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 40,
    },
    filterMenuHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterMenuTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    filterMenuContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    filterSectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.subText,
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: colors.background,
      gap: 12,
    },
    filterOptionActive: {
      backgroundColor: colors.primary + '15',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    filterOptionText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    filterOptionTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
  });