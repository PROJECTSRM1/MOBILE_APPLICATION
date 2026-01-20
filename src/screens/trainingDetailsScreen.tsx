import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

/* ===================== TYPES ===================== */
interface Material {
  name: string;
  type: "pdf" | "docx";
  size: string;
}

interface Video {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
}

interface CourseDetails {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  duration?: string;
  rating?: number;
  hours?: string;
  materials: Material[];
  video?: Video;
}

/* ===================== STATIC FALLBACK DATA ===================== */
const SAMPLE_MATERIALS: Material[] = [
  { name: "Course Syllabus & Schedule", type: "pdf", size: "2.4MB" },
  { name: "Design Thinking Workbook", type: "docx", size: "1.1MB" },
];

const SAMPLE_VIDEO: Video = {
  title: "01. Understanding the Grid System",
  description:
    "Learn how to create responsive grids for mobile and desktop views.",
  thumbnail:
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
  duration: "12:45",
};

/* ===== COURSE INFO MAP ===== */
const COURSE_INFO_MAP: Record<
  number,
  { duration: string; rating: number; hours: string }
> = {
  1: { duration: "6 Weeks", rating: 4.8, hours: "42 Hours" },
  2: { duration: "4 Weeks", rating: 4.5, hours: "30 Hours" },
  3: { duration: "3 Weeks", rating: 4.2, hours: "20 Hours" },
  4: { duration: "8 Weeks", rating: 4.9, hours: "60 Hours" },
};

/* ===================== SCREEN ===================== */
const TrainingDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const params = route.params as { course?: CourseDetails };
  const course = params?.course;

  const [activeTab, setActiveTab] = useState<
    "Documents" | "Media (Videos)"
  >("Documents");

  if (!course) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
          Course data not available
        </Text>
      </SafeAreaView>
    );
  }

  const materialsToShow =
    course.materials && course.materials.length > 0
      ? course.materials
      : SAMPLE_MATERIALS;

  const videoToShow = course.video || SAMPLE_VIDEO;

  const courseInfo = COURSE_INFO_MAP[course.id];

  const durationToShow =
    course.duration || courseInfo?.duration || "4 Weeks";
  const ratingToShow =
    course.rating || courseInfo?.rating || 4.5;
  const hoursToShow =
    course.hours || courseInfo?.hours || "30 Hours";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ================= HERO ================= */}
        <ImageBackground
          source={{ uri: course.image }}
          style={styles.imageHeader}
        >
          <LinearGradient
            colors={[
              "rgba(11,18,32,0.15)",
              "rgba(11,18,32,0.6)",
              "#0b1220",
            ]}
            style={styles.overlay}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Course Details</Text>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ marginRight: 12 }}>
                  <Icon name="share" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Icon name="more-vert" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {course.subtitle.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.imageTitle}>{course.title}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* ================= INFO ================= */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Icon name="schedule" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>DURATION</Text>
            <Text style={styles.infoValue}>{durationToShow}</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="star" size={20} color="#facc15" />
            <Text style={styles.infoLabel}>RATING</Text>
            <Text style={styles.infoValue}>{ratingToShow} / 5.0</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="check-circle" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>HOURS</Text>
            <Text style={styles.infoValue}>{hoursToShow}</Text>
          </View>
        </View>

        {/* ================= TABS ================= */}
        <View style={styles.tabRow}>
          {["Documents", "Media (Videos)"].map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() =>
                  setActiveTab(tab as "Documents" | "Media (Videos)")
                }
                style={styles.tabBtn}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ================= DOCUMENTS ================= */}
        {activeTab === "Documents" && (
          <View style={{ paddingHorizontal: 16 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Course Materials</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>

            {materialsToShow.map((mat) => (
              <View key={mat.name} style={styles.materialCard}>
                <View
                  style={[
                    styles.materialIcon,
                    {
                      backgroundColor:
                        mat.type === "pdf" ? "#ef4444" : "#2563eb",
                    },
                  ]}
                >
                  <Text style={styles.materialIconText}>
                    {mat.type.toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.materialTitle}>{mat.name}</Text>
                  <Text style={styles.materialSize}>
                    {mat.type.toUpperCase()} · {mat.size}
                  </Text>
                </View>

                <Icon name="download" size={22} color="#2563eb" />
              </View>
            ))}
          </View>
        )}

        {/* ================= VIDEOS ================= */}
        {activeTab === "Media (Videos)" && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.sectionTitle}>Introductory Videos</Text>

            <View style={styles.videoCard}>
              <Image
                source={{ uri: videoToShow.thumbnail }}
                style={styles.videoThumbnail}
              />
              <View style={styles.videoCenterPlay}>
                <Icon name="play-arrow" size={36} color="#fff" />
              </View>
            </View>

            <Text style={styles.videoTitle}>{videoToShow.title}</Text>
            <Text style={styles.videoDesc}>{videoToShow.description}</Text>
          </View>
        )}

        {/* ================= PROGRESS ================= */}
        <View style={styles.progressCard}>
          <Icon name="lock" size={18} color="#9ca3af" />
          <Text style={styles.progressText}>
            Progress tracking will be available once the course is unlocked.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrainingDetailsScreen;

/* ===================== STYLES (UNCHANGED) ===================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1220" },

  imageHeader: { height: 260 },
  overlay: { flex: 1, padding: 16, justifyContent: "space-between" },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  badge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  imageTitle: { color: "#fff", fontSize: 26, fontWeight: "800" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#111827",
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  infoLabel: { color: "#9ca3af", fontSize: 12 },
  infoValue: { color: "#fff", fontWeight: "700" },

  tabRow: { flexDirection: "row", paddingHorizontal: 16 },
  tabBtn: { marginRight: 24 },
  tabText: { color: "#9ca3af", fontWeight: "600" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  tabUnderline: { height: 2, backgroundColor: "#2563eb", marginTop: 6 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  viewAll: { color: "#2563eb", fontSize: 13 },

  materialCard: {
    flexDirection: "row",
    backgroundColor: "#1b2538",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  materialIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  materialIconText: { color: "#fff", fontWeight: "800", fontSize: 11 },
  materialTitle: { color: "#fff", fontWeight: "700" },
  materialSize: { color: "#9ca3af", fontSize: 12 },

  videoCard: { borderRadius: 14, overflow: "hidden", marginVertical: 12 },
  videoThumbnail: { width: "100%", height: 180 },
  videoCenterPlay: {
    position: "absolute",
    top: "40%",
    left: "42%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 14,
    borderRadius: 40,
  },
  videoTitle: { color: "#fff", fontWeight: "700" },
  videoDesc: { color: "#9ca3af", fontSize: 12 },

  progressCard: {
    margin: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
  },
  progressText: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
});