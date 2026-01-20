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
  duration: string;
  rating: number;
  hours: string;
  materials: Material[];
  video?: Video;
}

/* ===================== SCREEN ===================== */
const TrainingDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState<"Documents" | "Media (Videos)">(
    "Documents"
  );

  const course: CourseDetails = {
    id: 1,
    title: "Advanced UI/UX Design Systems",
    subtitle: "Professional Certification",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    duration: "24h 30m",
    rating: 4.8,
    hours: "10AM-7PM",
    materials: [
      { name: "Course Syllabus & Schedule", type: "pdf", size: "2.4 MB" },
      { name: "Design Thinking Workbook", type: "docx", size: "1.1 MB" },
    ],
    video: {
      title: "01. Understanding the Grid System",
      description:
        "Learn how to create responsive grids for mobile and desktop views.",
      thumbnail:
        "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800",
      duration: "12:45",
    },
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ================= HERO ================= */}
        <ImageBackground source={{ uri: course.image }} style={styles.imageHeader}>
          <LinearGradient
            colors={[
              "rgba(11,18,32,0.15)",
              "rgba(11,18,32,0.6)",
              "#0b1220",
            ]}
            style={styles.overlay}
          >
            {/* Top Bar */}
            <View style={styles.headerTop}>
              <TouchableOpacity>
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

            {/* Title */}
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

        {/* ================= INFO CARDS ================= */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Icon name="schedule" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>DURATION</Text>
            <Text style={styles.infoValue}>{course.duration}</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="star" size={20} color="#facc15" />
            <Text style={styles.infoLabel}>RATING</Text>
            <Text style={styles.infoValue}>{course.rating} / 5.0</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="check-circle" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>HOURS</Text>
            <Text style={styles.infoValue}>{course.hours}</Text>
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
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Course Materials</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>

            {course.materials.map((mat) => (
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

        {/* ================= VIDEO ================= */}
        {activeTab === "Media (Videos)" && course.video && (
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>Introductory Videos</Text>

            <View style={styles.videoCard}>
              <Image
                source={{ uri: course.video.thumbnail }}
                style={styles.videoThumbnail}
              />

              <View style={styles.videoCenterPlay}>
                <Icon name="play-arrow" size={36} color="#fff" />
              </View>

              <View style={styles.videoLabel}>
                <Text style={styles.videoLabelText}>VIDEO</Text>
              </View>

              <View style={styles.videoDurationPill}>
                <Text style={styles.videoDurationText}>
                  {course.video.duration}
                </Text>
              </View>
            </View>

            <Text style={styles.videoTitle}>{course.video.title}</Text>
            <Text style={styles.videoDesc}>{course.video.description}</Text>
          </View>
        )}

        {/* ================= LOCKED PROGRESS ================= */}
        <View style={styles.lockedProgress}>
          <View style={styles.progressHeader}>
            <Icon name="lock" size={16} color="#9ca3af" />
            <Text style={styles.progressTitle}>Progress Tracking</Text>
          </View>

          <View style={styles.progressBarBackground} />

          <Text style={styles.progressDesc}>
            Enroll now to start monitoring your learning progress.
          </Text>
        </View>
      </ScrollView>

      {/* ================= ENROLL BAR ================= */}
      <View style={styles.enrollSection}>
        <Text style={styles.price}>Full Access $199.00</Text>
        <TouchableOpacity style={styles.enrollBtn}>
          <Text style={styles.enrollText}>Enroll Now ➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TrainingDetailsScreen;

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1220" },

  imageHeader: { height: 260, width: "100%" },
  overlay: { flex: 1, padding: 16, justifyContent: "space-between" },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  badge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },

  imageTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#111827",
    flex: 1,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  infoLabel: { color: "#9ca3af", fontSize: 12, marginTop: 4 },
  infoValue: { color: "#fff", fontWeight: "700", marginTop: 2 },

  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabBtn: { marginRight: 24 },
  tabText: { color: "#9ca3af", fontWeight: "600" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  tabUnderline: {
    height: 2,
    backgroundColor: "#2563eb",
    marginTop: 6,
    borderRadius: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  viewAll: { color: "#2563eb", fontWeight: "600" },

  materialCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b2538",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
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

  videoCard: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
  },
  videoThumbnail: { width: "100%", height: 180 },
  videoCenterPlay: {
    position: "absolute",
    top: "40%",
    left: "42%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 14,
    borderRadius: 40,
  },
  videoLabel: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#2563eb",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoLabelText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  videoDurationPill: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoDurationText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  videoTitle: { color: "#fff", fontWeight: "700", marginTop: 4 },
  videoDesc: { color: "#9ca3af", fontSize: 12 },

  lockedProgress: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#1f2937",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  progressHeader: { flexDirection: "row", alignItems: "center" },
  progressTitle: {
    color: "#9ca3af",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 12,
  },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#1b2538",
    borderRadius: 3,
    marginVertical: 8,
  },
  progressDesc: { color: "#6b7280", fontSize: 12 },

  enrollSection: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0b1220",
    borderTopWidth: 1,
    borderTopColor: "#1b2538",
    alignItems: "center",
  },
  price: { color: "#fff", fontWeight: "800", fontSize: 16 },
  enrollBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  enrollText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
