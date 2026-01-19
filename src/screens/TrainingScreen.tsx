import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface Course {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  status?: string;
  timeLeft?: string;
  cohortActive?: boolean;
  image: string;
  participants?: number;
  category: string;
}

const categories = ["All", "Java", "Python", "Management"];

const courses: Course[] = [
  {
    id: 1,
    title: "Java Microservices Architecture",
    subtitle: "Advanced Backend Development",
    progress: 75,
    status: "IN PROGRESS",
    participants: 12,
    category: "Java",
    image: "https://images.unsplash.com/photo-1581091215363-9d6c99f145d3?w=800",
  },
  {
    id: 2,
    title: "Python for Data Engineering",
    subtitle: "Data Pipelines & ETL mastery",
    progress: 42,
    timeLeft: "3 hours left",
    category: "Python",
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800",
  },
  {
    id: 3,
    title: "Project Management Pro",
    subtitle: "Agile & Scrum Methodologies",
    progress: 12,
    cohortActive: true,
    category: "Management",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  },
];

const TrainingScreen = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* CATEGORY FILTER */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilter}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                activeCategory === cat && styles.activeCategoryBtn,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Active Training</Text>
        <Text style={styles.sectionSub}>Pick up where you left off</Text>

        {filteredCourses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <Image source={{ uri: course.image }} style={styles.courseImage} />
            <View style={styles.courseBody}>
              {course.status && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{course.status}</Text>
                </View>
              )}
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseSubtitle}>{course.subtitle}</Text>

              <View style={styles.progressRow}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${course.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercent}>{course.progress}%</Text>
              </View>

              <View style={styles.bottomRow}>
                {course.participants && (
                  <Text style={styles.bottomText}>+{course.participants}</Text>
                )}
                {course.timeLeft && (
                  <Text style={styles.bottomText}>{course.timeLeft}</Text>
                )}
                {course.cohortActive && (
                  <Text style={styles.bottomText}>Cohort active</Text>
                )}

                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() =>
                    navigation.navigate("TrainingDetails", {
                      courseId: course.id,
                    })
                  }
                >
                  <Text style={styles.continueText}>Continue ➤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {filteredCourses.length === 0 && (
          <Text style={styles.noCoursesText}>
            No courses found in this category.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrainingScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1220", padding: 16 },
  categoryFilter: { flexDirection: "row", gap: 10, paddingVertical: 10 },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1c1f27",
  },
  activeCategoryBtn: { backgroundColor: "#2563eb" },
  categoryText: { color: "#9ca3af" },
  activeCategoryText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 4 },
  sectionSub: { color: "#9ca3af", marginBottom: 16 },
  courseCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  courseImage: { width: "100%", height: 140 },
  courseBody: { padding: 12 },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  courseTitle: { color: "#fff", fontWeight: "700", fontSize: 16, marginBottom: 2 },
  courseSubtitle: { color: "#9ca3af", fontSize: 12, marginBottom: 8 },
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#1c1f27",
    borderRadius: 3,
    marginRight: 8,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#2563eb",
    borderRadius: 3,
  },
  progressPercent: { color: "#fff", fontSize: 12, fontWeight: "600" },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bottomText: { color: "#9ca3af", fontSize: 12 },
  continueBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  continueText: { color: "#fff", fontWeight: "700" },
  noCoursesText: { color: "#9ca3af", fontSize: 14, textAlign: "center", marginTop: 20 },
});
