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
import Icon from "react-native-vector-icons/MaterialIcons";
import { ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

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

const TrainingDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState<"Documents" | "Media (Videos)">(
    "Documents"
  );

  // Dummy course data
  const course: CourseDetails = {
    id: 1,
    title: "Advanced UI/UX Design Systems",
    subtitle: "Professional Certification",
    image:
      "https://images.unsplash.com/photo-1581091215363-9d6c99f145d3?w=800",
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
        "https://images.unsplash.com/photo-1581091215363-9d6c99f145d3?w=800",
      duration: "12:45",
    },
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        {/* IMAGE HEADER */}
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
    {/* Top bar */}
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

    {/* Title section */}
    <View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {course.subtitle.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.imageTitle}>
        {course.title}
      </Text>
    </View>
  </LinearGradient>
</ImageBackground>


        {/* Info Cards */}
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

        {/* Tabs */}
        <View style={styles.tabRow}>
          {["Documents", "Media (Videos)"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as "Documents" | "Media (Videos)")}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Course Materials */}
        {activeTab === "Documents" && (
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            {course.materials.map((mat) => (
              <View key={mat.name} style={styles.materialCard}>
                <View
                  style={[
                    styles.materialIcon,
                    { backgroundColor: mat.type === "pdf" ? "#ef4444" : "#2563eb" },
                  ]}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {mat.type.toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.materialTitle}>{mat.name}</Text>
                  <Text style={styles.materialSize}>
                    {mat.type.toUpperCase()} · {mat.size}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Icon name="download" size={24} color="#2563eb" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Introductory Video */}
        {activeTab === "Media (Videos)" && course.video && (
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <View style={styles.videoCard}>
              <Image
                source={{ uri: course.video.thumbnail }}
                style={styles.videoThumbnail}
              />
              <View style={styles.playOverlay}>
                <Icon name="play-arrow" size={40} color="#fff" />
              </View>
              <View style={styles.videoLabel}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                  VIDEO
                </Text>
              </View>
              <Text style={styles.videoDuration}>{course.video.duration}</Text>
            </View>
            <Text style={styles.videoTitle}>{course.video.title}</Text>
            <Text style={styles.videoDesc}>{course.video.description}</Text>
          </View>
        )}

        {/* Progress Tracking */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Icon name="lock" size={16} color="#6b7280" />
            <Text style={styles.progressTitle}>Progress Tracking</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressDesc}>
            Enroll now to start monitoring your learning progress.
          </Text>
        </View>
      </ScrollView>

      {/* Enroll Button */}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1220" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  bannerWrapper: { marginBottom: 16 },
  banner: { width: "100%", height: 180, borderRadius: 12 },
  badgeOverlay: {
    position: "absolute",
    top: 12,
    left: 16,
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  bannerTitle: {
    position: "absolute",
    bottom: 12,
    left: 16,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
    //  marginTop: -24,  
  },
  imageHeader: {
  height: 260,
  width: "100%",
},




overlay: {
  flex: 1,
  padding: 16,
  justifyContent: "space-between",
},

headerTop: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},


badge: {
  backgroundColor: "#2563eb",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 14,
  alignSelf: "flex-start",
  marginBottom: 8,
},



imageTitle: {
  color: "#fff",
  fontSize: 26,
  fontWeight: "800",
  lineHeight: 32,
},

  infoCard: {
    backgroundColor: "#111827",
    flex: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  infoLabel: { color: "#9ca3af", fontSize: 12, marginTop: 4 },
  infoValue: { color: "#fff", fontWeight: "700", marginTop: 2 },
  tabRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 12 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#2563eb" },
  tabText: { color: "#9ca3af", fontWeight: "600" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  materialCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b2538",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  materialIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  materialTitle: { color: "#fff", fontWeight: "700" },
  materialSize: { color: "#9ca3af", fontSize: 12 },
  videoCard: { position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 8 },
  videoThumbnail: { width: "100%", height: 180, borderRadius: 12 },
  playOverlay: {
    position: "absolute",
    top: "40%",
    left: "45%",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 50,
    padding: 4,
  },
  videoLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#2563eb",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDuration: {
    position: "absolute",
    bottom: 8,
    right: 8,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 10,
  },
  videoTitle: { color: "#fff", fontWeight: "700", fontSize: 14, marginTop: 4 },
  videoDesc: { color: "#9ca3af", fontSize: 12, marginBottom: 16 },
  progressSection: { paddingHorizontal: 16, marginBottom: 24 },
  progressHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  progressTitle: { color: "#6b7280", fontWeight: "700", marginLeft: 6, fontSize: 12 },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#1b2538",
    borderRadius: 3,
    marginBottom: 6,
  },
  progressBarFill: { width: "0%", height: 6, backgroundColor: "#2563eb", borderRadius: 3 },
  progressDesc: { color: "#6b7280", fontSize: 12 },
  enrollSection: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0b1220",
    borderTopWidth: 1,
    borderTopColor: "#1b2538",
    alignItems: "center",
  },
  price: { color: "#fff", fontWeight: "700", fontSize: 16 },
  enrollBtn: { backgroundColor: "#2563eb", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  enrollText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
