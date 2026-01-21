import React, { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {useTheme} from "../context/ThemeContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

/* ================= TYPES ================= */
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
  modules?: string[];
  price: string; //  ADDED
}

/* ================= DATA ================= */
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
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    modules: [
      "Spring Boot Basics",
      "REST APIs",
      "Microservices Design",
      "Docker & Kubernetes",
    ],
  },
  {
    id: 2,
    title: "Python for Data Engineering",
    subtitle: "Data Pipelines & ETL mastery",
    progress: 42,
    timeLeft: "3 hours left",
    category: "Python",
    price: "₹499",
    image:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800",
    modules: [
      "Python Fundamentals",
      "ETL Pipelines",
      "Apache Airflow",
      "Data Warehousing",
    ],
  },
  {
    id: 3,
    title: "Project Management Pro",
    subtitle: "Agile & Scrum Methodologies",
    progress: 12,
    cohortActive: true,
    category: "Management",
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    modules: [
      "Project Lifecycle",
      "Agile & Scrum",
      "Risk Management",
      "Stakeholder Communication",
    ],
  },
  {
    id: 4,
    title: "Advanced Java DSA",
    subtitle: "Problem Solving & Competitive Coding",
    progress: 0,
    category: "Java",
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    modules: [
      "Arrays & Strings",
      "Recursion & Backtracking",
      "Trees & Graphs",
      "Dynamic Programming",
      "Interview Patterns",
    ],
  },
  {
    id: 5,
    title: "Python Machine Learning Bootcamp",
    subtitle: "ML from Scratch to Deployment",
    progress: 18,
    timeLeft: "8 hours left",
    category: "Python",
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    modules: [
      "Python for ML",
      "Supervised Learning",
      "Unsupervised Learning",
      "Model Evaluation",
      "ML Deployment",
    ],
  },
  {
    id: 6,
    title: "Leadership & Team Management",
    subtitle: "Managing High Performance Teams",
    progress: 60,
    status: "IN PROGRESS",
    category: "Management",
    price: "₹499",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
    modules: [
      "Leadership Styles",
      "Team Motivation",
      "Conflict Resolution",
      "Decision Making",
    ],
  },
];

/* ================= SCREEN ================= */
const TrainingScreen = () => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

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

              {/* PROGRESS */}
              <View style={styles.progressRow}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${course.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercent}>
                  {course.progress}%
                </Text>
              </View>

              {/* MODULES */}
              {course.modules && (
                <View style={styles.modulesBox}>
                  <Text style={styles.modulesTitle}>
                    Modules Included ({course.modules.length})
                  </Text>
                  {course.modules.map((mod, index) => (
                    <Text key={index} style={styles.moduleItem}>
                      • {mod}
                    </Text>
                  ))}
                </View>
              )}

              {/* BOTTOM ROW */}
              <View style={styles.bottomRow}>
                <View>
                  <Text style={styles.priceText}>{course.price}</Text>
                </View>

                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() =>
                  navigation.navigate("enrollmentDetails", { course })

                  }
                >
                  <Text style={styles.continueText}>ENROLL NOW ➤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrainingScreen;

/* ================= STYLES ================= */
const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background ?? "#0b1220",
      padding: 16,
    },

    /* ================= CATEGORY FILTER ================= */
    categoryFilter: {
      flexDirection: "row",
      gap: 10,
      paddingVertical: 10,
    },

    categoryBtn: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: colors.card ?? "#1c1f27",
      borderWidth: 1,
      borderColor: colors.border ?? "#1f2937",
    },

    activeCategoryBtn: {
      backgroundColor: colors.primary ?? "#2563eb",
      borderColor: colors.primary ?? "#2563eb",
    },

    categoryText: {
      color: colors.subText ?? "#9ca3af",
    },

    activeCategoryText: {
      color: "#ffffff",
      fontWeight: "700",
    },

    /* ================= SECTION ================= */
    sectionTitle: {
      color: colors.text ?? "#ffffff",
      fontSize: 20,
      fontWeight: "700",
    },

    sectionSub: {
      color: colors.subText ?? "#9ca3af",
      marginBottom: 16,
    },

    /* ================= COURSE CARD ================= */
    courseCard: {
      backgroundColor: colors.card ?? "#111827",
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border ?? "#1f2937",
    },

    courseImage: {
      width: "100%",
      height: 140,
    },

    courseBody: {
      padding: 12,
    },

<<<<<<< HEAD
  continueBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  continueText: { color: "#fff", fontWeight: "700" },
});
=======
    statusBadge: {
      backgroundColor: colors.primary ?? "#2563eb",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginBottom: 8,
      alignSelf: "flex-start",
    },

    statusText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "700",
    },

    courseTitle: {
      color: colors.text ?? "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },

    courseSubtitle: {
      color: colors.subText ?? "#9ca3af",
      fontSize: 12,
      marginBottom: 8,
    },

    /* ================= PROGRESS ================= */
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    progressBarBackground: {
      flex: 1,
      height: 6,
      backgroundColor: colors.surface ?? "#1c1f27",
      borderRadius: 3,
      marginRight: 8,
    },

    progressBarFill: {
      height: 6,
      backgroundColor: colors.primary ?? "#2563eb",
      borderRadius: 3,
    },

    progressPercent: {
      color: colors.text ?? "#ffffff",
      fontSize: 12,
    },

    /* ================= MODULES ================= */
    modulesBox: {
      backgroundColor: colors.surface ?? "#1c1f27",
      borderRadius: 12,
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border ?? "#1f2937",
    },

    modulesTitle: {
      color: colors.text ?? "#ffffff",
      fontWeight: "700",
      fontSize: 13,
    },

    moduleItem: {
      color: colors.subText ?? "#9ca3af",
      fontSize: 12,
    },

    /* ================= BOTTOM ================= */
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    priceText: {
      color: colors.success ?? "#22c55e",
      fontSize: 16,
      fontWeight: "800",
    },

    continueBtn: {
      backgroundColor: colors.primary ?? "#2563eb",
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 12,
    },

    continueText: {
      color: "#ffffff",
      fontWeight: "700",
    },
  });
>>>>>>> 5d3b82a55bd4d1cd10e579ce55d8b95863c6bc86
