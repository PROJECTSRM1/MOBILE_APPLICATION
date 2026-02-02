import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
// import { useRoute } from "@react-navigation/native";

interface Student {
  id: string;
  name: string;
  studentId: string;
  year: number;
  avatar?: string;
  initials: string;
  color: string;
}

const InstitutionStudents = () => {
  const navigation = useNavigation<any>();
  const { colors, lightMode } = useTheme();
  const styles = getStyles(colors);
  // const route = useRoute<any>();
  // const { branchName } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'id'>('name');

  // Dummy student data
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      studentId: 'STU987654',
      year: 3,
      avatar: 'https://i.pravatar.cc/150?img=12',
      initials: 'RS',
      color: '#64748b',
    },
    {
      id: '2',
      name: 'Ananya Kapoor',
      studentId: 'STU987210',
      year: 2,
      initials: 'AK',
      color: '#3b82f6',
    },
    {
      id: '3',
      name: 'Vikram Malhotra',
      studentId: 'STU987889',
      year: 4,
      initials: 'VM',
      color: '#8b5cf6',
    },
    {
      id: '4',
      name: 'Priya Verma',
      studentId: 'STU987112',
      year: 1,
      initials: 'PV',
      color: '#a855f7',
    },
    {
      id: '5',
      name: 'Siddharth Khanna',
      studentId: 'STU987554',
      year: 3,
      initials: 'SK',
      color: '#eab308',
    },
    {
      id: '6',
      name: 'Rohan Joshi',
      studentId: 'STU987321',
      year: 2,
      initials: 'RJ',
      color: '#10b981',
    },
    {
      id: '7',
      name: 'Ishita Mehta',
      studentId: 'STU987445',
      year: 4,
      initials: 'IM',
      color: '#f59e0b',
    },
    {
      id: '8',
      name: 'Arjun Patel',
      studentId: 'STU987667',
      year: 1,
      initials: 'AP',
      color: '#06b6d4',
    },
    {
      id: '9',
      name: 'Neha Gupta',
      studentId: 'STU987778',
      year: 3,
      initials: 'NG',
      color: '#ec4899',
    },
    {
      id: '10',
      name: 'Karan Singh',
      studentId: 'STU987889',
      year: 2,
      initials: 'KS',
      color: '#14b8a6',
    },
  ]);

  const [visibleStudents, setVisibleStudents] = useState(6);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'year') {
      return a.year - b.year;
    } else {
      return a.studentId.localeCompare(b.studentId);
    }
  });

  const displayedStudents = sortedStudents.slice(0, visibleStudents);

  const loadMoreStudents = () => {
    setVisibleStudents((prev) => prev + 6);
  };

  const handleSortToggle = () => {
    if (sortBy === 'name') {
      setSortBy('year');
    } else if (sortBy === 'year') {
      setSortBy('id');
    } else {
      setSortBy('name');
    }
  };

  const getSortLabel = () => {
    if (sortBy === 'name') return 'Sort by: Name';
    if (sortBy === 'year') return 'Sort by: Year';
    return 'Sort by: ID';
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
        <Text style={styles.headerTitle}>Main Campus Branch</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color={colors.subText}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or student ID"
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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
        {displayedStudents.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={styles.studentCard}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('StudentOverviewScreen', {
                student: student,
              })
            }
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
                <Text style={styles.studentInitials}>{student.initials}</Text>
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
            <Text style={styles.loadMoreText}>Load More Students</Text>
          </TouchableOpacity>
        )}

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="school" size={64} color={colors.border} />
            <Text style={styles.emptyStateText}>No students found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingAddButton} activeOpacity={0.8}>
        <Icon name="person-add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="people" size={24} color={colors.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Students</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="table-chart" size={24} color={colors.subText} />
          <Text style={styles.navLabel}>Fees</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="description" size={24} color={colors.subText} />
          <Text style={styles.navLabel}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="settings" size={24} color={colors.subText} />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InstitutionStudents;

const getStyles = (colors: any) => StyleSheet.create({
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
    paddingBottom: 140,
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
  },
  floatingAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subText,
    marginTop: 4,
  },
  navLabelActive: {
    color: colors.primary,
  },
});