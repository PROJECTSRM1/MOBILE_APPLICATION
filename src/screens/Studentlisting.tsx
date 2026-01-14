import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ChevronLeft,
  Search,
  Clock,
  Star,
  X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";


/* =======================
   TYPES
======================= */
interface Student {
  id: number;
  name: string;
  program: string;
  avatar: string;
  rating: number;
  status: "active" | "completed";
  attendance: number;
  shift: string;
  skills: string[];
}

/* =======================
   DATA
======================= */
const studentsData: Student[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    program: "B.Tech Computer Science",
    rating: 4.8,
    status: "active",
    attendance: 92,
    shift: "Shift: 10:00 AM - 07:00 PM",
    skills: ["Java", "React"],
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Michael Chen",
    program: "M.S. Data Science",
    rating: 4.5,
    status: "completed",
    attendance: 88,
    shift: "Shift: 10:00 AM - 07:00 PM",
    skills: ["Python", "Angular"],
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    program: "B.E. Information Tech",
    rating: 4.9,
    status: "active",
    attendance: 95,
    shift: "Shift: 10:00 AM - 07:00 PM",
    skills: ["React", "Swift"],
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "David Kim",
    program: "B.S. Software Eng",
    rating: 4.7,
    status: "completed",
    attendance: 90,
    shift: "Shift: 10:00 AM - 07:00 PM",
    skills: ["Java", "Python"],
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Priya Sharma",
    program: "M.Tech AI & ML",
    rating: 4.6,
    status: "active",
    attendance: 94,
    shift: "Shift: 10:00 AM - 07:00 PM",
    skills: ["Python", "React"],
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "James Wilson",
    program: "B.S. Computer Eng",
    rating: 4.4,
    status: "active",
    attendance: 87,
    shift: "Shift: 10:00 AM - 07:00 PM",
    skills: ["Swift", "Angular"],
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

const skills = ["All", "Java", "Python", "Angular", "React", "Swift"];

/* =======================
   SCREEN
======================= */
const Collegelisting = () => {
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  const filteredStudents = useMemo(() => {
    return studentsData.filter((s) => {
      const matchName = s.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchSkill =
        selectedSkill === "All" || s.skills.includes(selectedSkill);
      return matchName && matchSkill;
    });
  }, [searchQuery, selectedSkill]);
const ListHeader = () => (
  <View>
  

    {/* SKILLS */}
    <FlatList
      data={skills}
      horizontal
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filters}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => setSelectedSkill(item)}
          style={[
            styles.filter,
            selectedSkill === item && styles.filterActive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              selectedSkill === item && styles.filterTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />

    <View style={{ height: 12 }} />
  </View>
);

const renderStudent = ({ item }: { item: Student }) => {
  const isActive = item.status === "active";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.program}>{item.program}</Text>
            </View>

            <View style={styles.rating}>
              <Star size={14} color="#facc15" fill="#facc15"/>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text
              style={[
                styles.status,
                isActive ? styles.active : styles.completed,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
            <Text style={styles.attendance}>
              • {item.attendance}% Attendance
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.shift}>
  <Clock size={16} color="#9ca3af" />
  <Text style={styles.shiftText}>{item.shift}</Text>
</View>


        <TouchableOpacity
          style={[
            styles.contactBtn,
            !isActive && styles.contactBtnDisabled,
          ]}
        >
          <Text style={styles.contactText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Students</Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            setIsSearchOpen(!isSearchOpen);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        >
          <Search size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      {isSearchOpen && (
        <View style={styles.searchBox}>
          <Search size={18} color="#9ca3af" />
          <TextInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search students..."
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      )}


      {/* LIST */}
<FlatList
  data={filteredStudents}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderStudent}
  ListHeaderComponent={ListHeader}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
/>


    </View>
  </SafeAreaView>
);

};

export default Collegelisting;

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101622",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  iconBtn: {
    padding: 6,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1C2333",
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 8,
    height: 44,
  },
  filters: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filter: {
    paddingHorizontal: 18,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3a4454",
    justifyContent: "center",
  },
  filterActive: {
    backgroundColor: "#135bec",
    borderColor: "#135bec",
  },
  filterText: {
    color: "#9ca3af",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#1C2333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  program: {
    color: "#135bec",
    fontSize: 12,
  },
  rating: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  ratingText: {
    color: "#facc15",
    fontWeight: "700",
  },
 statusRow: {
  flexDirection: "row",
  marginTop: 6,
  gap: 10,          
  alignItems: "center",
},

status: {
  fontSize: 12,
  fontWeight: "600",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  overflow: "hidden",
  textTransform: "capitalize", 
},


active: {
  backgroundColor: "#0f2f24", 
  color: "#22c55e",           
},

completed: {
  backgroundColor: "#1f2937", 
  color: "#9ca3af",           
},


  attendance: {
    color: "#9ca3af",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#2a3444",
    marginVertical: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shift: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  shiftText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  contactBtn: {
    backgroundColor: "#135bec",
    paddingHorizontal: 20,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
  },
  contactBtnDisabled: {
    backgroundColor: "#2a3444",
  },
  contactText: {
    color: "#fff",
    fontWeight: "700",
  },
  safeArea: {
  flex: 1,
  backgroundColor: "#101622",
},
listContent: {
  flexGrow: 1,          
  paddingHorizontal: 16,
  paddingBottom: 32,
},


});
