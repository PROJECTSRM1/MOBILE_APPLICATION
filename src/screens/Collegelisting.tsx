import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
//   SafeAreaView,

} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from "react-native-safe-area-context";
/* ---------------- Types ---------------- */
type FilterType = 'location' | 'aggregate' | 'scholarship';

type Student = {
  name: string;
  id: string;
  course: string;
  distance: string;
  gpa: string;
  color: string;
  avatar?: string;
};

type College = {
  name: string;
  tag: string;
  location: string;
  students: string;
  image: { uri: string };
  list: Student[];
  footer: string;
};

type CollegesData = Record<FilterType, College[]>;

/* ---------------- Screen ---------------- */
const CollegesScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('location');

  /* -------- DATA BASED ON FILTER -------- */
  const collegesData: CollegesData = {
    location: [
  {
    name: 'Stanford University',
    tag: 'IVY LEAGUE',
    location: 'San Francisco, CA',
    students: '120 Students Listed',
    image: {
      uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    },
    list: [
      {
        name: 'Alice M.',
        id: '#8821',
        course: 'M.Sc Data Science',
        distance: '2km away',
        gpa: '9.2 GPA',
        color: '#2563eb',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        name: 'John D.',
        id: '#9932',
        course: 'B.A Economics',
        distance: '5km away',
        gpa: '8.9 GPA',
        color: '#10b981',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        name: 'Sophia L.',
        id: '#7712',
        course: 'B.Tech AI',
        distance: '7km away',
        gpa: '9.0 GPA',
        color: '#ec4899',
        avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      },
    ],
    footer: 'View all',
  },

  {
    name: 'Harvard University',
    tag: 'IVY LEAGUE',
    location: 'Cambridge, MA',
    students: '95 Students Listed',
    image: {
      uri: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    },
    list: [
      {
        name: 'Emma R.',
        id: '#7754',
        course: 'M.A Economics',
        distance: '3km away',
        gpa: '9.5 GPA',
        color: '#2563eb',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      {
        name: 'Michael T.',
        id: '#6641',
        course: 'B.Sc Mathematics',
        distance: '6km away',
        gpa: '9.0 GPA',
        color: '#10b981',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      {
        name: 'Daniel P.',
        id: '#5532',
        course: 'M.Sc Finance',
        distance: '4km away',
        gpa: '8.8 GPA',
        color: '#6366f1',
        avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      },
    ],
    footer: 'View all',
  },

  {
    name: 'Yale University',
    tag: 'IVY LEAGUE',
    location: 'New Haven, CT',
    students: '70 Students Listed',
    image: {
      uri: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a',
    },
    list: [
      {
        name: 'Olivia S.',
        id: '#4482',
        course: 'Law',
        distance: '5km away',
        gpa: '9.3 GPA',
        color: '#22c55e',
        avatar: 'https://randomuser.me/api/portraits/women/35.jpg',
      },
    ],
    footer: 'View all',
  },
],

    aggregate: [
  {
    name: 'MIT',
    tag: 'TECHNOLOGY',
    location: 'Cambridge, MA',
    students: '85 Students Listed',
    image: {
      uri: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    },
    list: [
      {
        name: 'Sarah K.',
        id: '#4402',
        course: 'M.Eng Computer Science',
        distance: '12km away',
        gpa: '9.8 GPA',
        color: '#f59e0b',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      },
      {
        name: 'David L.',
        id: '#1109',
        course: 'B.Sc Physics',
        distance: '14km away',
        gpa: '9.1 GPA',
        color: '#2563eb',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
    ],
    footer: 'View all',
  },

  {
    name: 'Caltech',
    tag: 'HIGH AGGREGATE',
    location: 'Pasadena, CA',
    students: '60 Students Listed',
    image: {
      uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    },
    list: [
      {
        name: 'Kevin R.',
        id: '#9901',
        course: 'Astrophysics',
        distance: '10km away',
        gpa: '9.9 GPA',
        color: '#22c55e',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      },
    ],
    footer: 'View all',
  },
],


    scholarship: [
      {
        name: 'UC Berkeley',
        tag: 'SCHOLARSHIPS',
        location: 'Berkeley, CA',
        students: '60 Students Listed',
        image: {
          uri: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
        },
        list: [],
        footer: 'View scholarship students',
      },
    ],
  };

  const activeColleges: College[] = collegesData[activeFilter];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ✅ SAFE AREA HEADER */}
           <SafeAreaView edges={["top"]} style={styles.headerSafe}></SafeAreaView>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="search" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Colleges</Text>
        <Text style={styles.subtitle}>Find top talent near you</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            <FilterChip
              label="Location Nearby"
              active={activeFilter === 'location'}
              onPress={() => setActiveFilter('location')}
            />
            <FilterChip
              label="Student Aggregate"
              active={activeFilter === 'aggregate'}
              onPress={() => setActiveFilter('aggregate')}
            />
            <FilterChip
              label="Scholarships"
              active={activeFilter === 'scholarship'}
              onPress={() => setActiveFilter('scholarship')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeColleges.map((college: College, index: number) => (
          <CollegeCard key={index} {...college} />
        ))}
      </ScrollView>
    </View>
  );
};

/* ---------------- Components ---------------- */

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.filterChip, active && { backgroundColor: '#2563eb' }]}
  >
    <Text style={[styles.filterText, active && { color: '#fff' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const CollegeCard = ({
  name,
  tag,
  location,
  students,
  image,
  list,
  footer,
}: College) => {
  const [expanded, setExpanded] = useState(false);

  const visibleStudents = expanded ? list : list.slice(0, 2);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardTag}>{tag}</Text>
          <Text style={styles.cardLocation}>{location}</Text>
          <Text style={styles.studentCount}>{students}</Text>
        </View>
        <Image source={image} style={styles.collegeImage} />
      </View>

      {visibleStudents.map((item: Student, index: number) => (
        <View key={index} style={styles.studentRow}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.studentName}>
              {item.name}{' '}
              <Text style={styles.studentId}>{item.id}</Text>
            </Text>
            <Text style={styles.course}>{item.course}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        </View>
      ))}

      {list.length > 2 && (
        <TouchableOpacity
          style={styles.footer}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.footerText}>
            {expanded ? 'Show less' : footer} →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101622' },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 8 },
  subtitle: { color: '#9ca3af', marginTop: 4 },
  filters: { flexDirection: 'row', marginTop: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 999,
    marginRight: 10,
  },
  filterText: { color: '#d1d5db', fontWeight: '600' },
  content: { padding: 16 },
  card: { backgroundColor: '#1c1f27', borderRadius: 14, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  cardTag: { color: '#9ca3af', fontSize: 12 },
  cardLocation: { color: '#9ca3af', marginTop: 6 },
  studentCount: { marginTop: 8, color: '#2563eb', fontWeight: '700' },
  collegeImage: { width: 80, height: 80, borderRadius: 10 },
  studentRow: {
    flexDirection: 'row',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#2a2f3a',
  },
   headerSafe: {
    // marginTop: StatusBar.currentHeight,

  backgroundColor: "#0d1321",
},

  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  studentName: { color: '#fff', fontWeight: '700' },
  studentId: { color: '#6b7280', fontSize: 12 },
  course: { color: '#d1d5db', marginTop: 2 },
  distance: { color: '#9ca3af', marginTop: 2 },
  footer: {
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2a2f3a',
  },
  footerText: { color: '#2563eb', fontWeight: '700' },
});

export default CollegesScreen;