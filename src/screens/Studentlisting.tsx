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

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

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
   DATA (12 STUDENTS)
======================= */

const studentsData: Student[] = [
  {
    id: 2045,
    name: "Sarah Jenkins",
    program: "B.Tech Computer Science",
    rating: 4.8,
    status: "active",
    attendance: 92,
    shift: "10:00 AM - 07:00 PM",
    skills: ["Java", "Python"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    id: 1988,
    name: "Michael Chen",
    program: "M.S. Data Science",
    rating: 4.5,
    status: "completed",
    attendance: 88,
    shift: "10:00 AM - 07:00 PM",
    skills: ["Python", "Angular"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  {
    id: 2092,
    name: "Emily Rodriguez",
    program: "B.E. Information Tech",
    rating: 4.9,
    status: "active",
    attendance: 95,
    shift: "10:00 AM - 07:00 PM",
    skills: ["React"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  },
  {
    id: 2101,
    name: "David Kim",
    program: "B.S. Software Eng",
    rating: 4.7,
    status: "completed",
    attendance: 90,
    shift: "10:00 AM - 07:00 PM",
    skills: ["Java"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
  {
    id: 2112,
    name: "Ananya Rao",
    program: "B.Tech AI & ML",
    rating: 4.6,
    status: "active",
    attendance: 91,
    shift: "09:00 AM - 06:00 PM",
    skills: ["Python", "React"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
  },
  {
    id: 2115,
    name: "Rahul Mehta",
    program: "B.E. CSE",
    rating: 4.3,
    status: "completed",
    attendance: 82,
    shift: "10:00 AM - 07:00 PM",
    skills: ["Angular"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
  },
  {
    id: 2120,
    name: "Sneha Iyer",
    program: "B.Tech IT",
    rating: 4.9,
    status: "active",
    attendance: 97,
    shift: "09:30 AM - 06:30 PM",
    skills: ["Java", "React"],
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200",
  },
  {
    id: 2123,
    name: "Arjun Patel",
    program: "B.S. Data Analytics",
    rating: 4.4,
    status: "completed",
    attendance: 78,
    shift: "10:00 AM - 07:00 PM",
    skills: ["Python"],
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200",
  },
];

/* =======================
   FILTERS
======================= */
const topTabs = ["All Students", "Top Performers", "Recent Joiners"];
const aggregateFilters = ["90%+", "80-90%", "60-80%"];
const certFilters = ["Java", "Python", "React", "Angular"];
const internshipFilters = ["Completed", "In Progress"];
const Dropdown = ({
  label,
  value,
  options,
  onSelect,
  styles,
}: {
  label: string;
  value: string | null;
  options: string[];
  onSelect: (val: string | null) => void;
  styles: any;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.dropdownCol}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText} numberOfLines={1}>
          {value ?? label}
        </Text>
        <Text style={styles.dropdownArrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              onSelect(null);
              setOpen(false);
            }}
          >
            <Text style={styles.dropdownItemText}>All</Text>
          </TouchableOpacity>

          {options.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


/* =======================
   SCREEN
======================= */
const Studentlisting = () => {
    const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("All Students");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [selectedAggregate, setSelectedAggregate] = useState<string | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  /* =======================
     FILTER LOGIC
  ======================= */
 const filteredStudents = useMemo(() => {
  // 🔹 TOP PERFORMERS (NO FILTERS)
  if (activeTab === "Top Performers") {
    return studentsData.filter(
      (s) => s.rating >= 4.7 || s.attendance >= 90
    );
  }

  // 🔹 RECENT JOINERS (NO FILTERS)
  if (activeTab === "Recent Joiners") {
    return [...studentsData]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }

  // 🔹 ALL STUDENTS (EXISTING FILTERS)
  return studentsData.filter((s) => {
   const query = searchQuery.toLowerCase().trim();

const matchNameOrId =
  s.name.toLowerCase().includes(query) ||
  s.id.toString().includes(query);


    const matchCert =
      !selectedCert || s.skills.includes(selectedCert);

    const matchAggregate =
      !selectedAggregate ||
      (selectedAggregate === "90%+" && s.attendance >= 90) ||
      (selectedAggregate === "80-90%" &&
        s.attendance >= 80 &&
        s.attendance < 90) ||
      (selectedAggregate === "60-80%" &&
        s.attendance >= 60 &&
        s.attendance < 80);

    const matchInternship =
      !selectedInternship ||
      (selectedInternship === "Completed" &&
        s.status === "completed") ||
      (selectedInternship === "In Progress" &&
        s.status === "active");

    return (
  matchNameOrId &&
  matchCert &&
  matchAggregate &&
  matchInternship
);

  });
}, [
  activeTab,
  searchQuery,
  selectedCert,
  selectedAggregate,
  selectedInternship,
]);


  /* =======================
     HEADER FILTERS
  ======================= */
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
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  /* =======================
   HEADER FILTERS (UPDATED UI ONLY)
======================= */
const ListHeader = () => (
  <View style={styles.filterContainer}>
    {/* TOP TABS */}
    <View style={styles.tabRow}>
      {topTabs.map((item) => {
        const active = activeTab === item;
        return (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveTab(item)}
            style={[styles.tabPill, active && styles.tabPillActive]}
          >
            <Text
              style={[
                styles.tabPillText,
                active && styles.tabPillTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {/* DROPDOWNS ONLY FOR ALL STUDENTS */}
    {activeTab === "All Students" && (
      <View style={styles.dropdownRow}>
        <Dropdown
          label="Aggregate"
          value={selectedAggregate}
          options={aggregateFilters}
          onSelect={setSelectedAggregate}
          styles={styles}
        />

        <Dropdown
          label="Cert"
          value={selectedCert}
          options={certFilters}
          onSelect={setSelectedCert}
          styles={styles}
        />

        <Dropdown
          label="Internship"
          value={selectedInternship}
          options={internshipFilters}
          onSelect={setSelectedInternship}
          styles={styles}
        />
      </View>
    )}
  </View>
);



  /* =======================
     STUDENT CARD
  ======================= */
const renderStudent = ({ item }: { item: Student }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() =>
      navigation.navigate("CandidateProfile", {
        student: item,
      })
    }
  >
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        <View style={styles.infoCol}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.program}>{item.program}</Text>
          <Text style={styles.attendance}>
            {item.attendance}% Academic Score
          </Text>

          <View style={styles.shift}>
            <Clock size={14} color="#9ca3af" />
            <Text style={styles.shiftText}>{item.shift}</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View style={styles.rating}>
            <Star size={14} color="#facc15" fill="#facc15" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>

          <Text style={styles.candidateId}>ID: {item.id}</Text>

          <View
            style={[
              styles.statusPill,
              item.status === "active"
                ? styles.activePill
                : styles.completedPill,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === "active"
                  ? styles.activeText
                  : styles.completedText,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);




  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ChevronLeft size={24} color={colors.text} />
          <Text style={styles.title}>Students</Text>
          <TouchableOpacity
            onPress={() => {
              setIsSearchOpen(!isSearchOpen);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            <Search size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {isSearchOpen && (
          <View style={styles.searchBox}>
            <Search size={18} color="#9ca3af" />
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Search students..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <FlatList
          data={filteredStudents}
          renderItem={renderStudent}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Studentlisting;

/* =======================
   STYLES (UNCHANGED PREMIUM)
======================= */
const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
    },

    /* ================= HEADER ================= */
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    /* ================= SEARCH ================= */
    searchBox: {
      flexDirection: "row",
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 12,
      paddingHorizontal: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    input: {
      flex: 1,
      color: colors.text,
      height: 44,
    },

    /* ================= TABS ================= */
    tabs: {
      paddingHorizontal: 16,
      gap: 12,
    },

    tab: {
      paddingHorizontal: 18,
      height: 36,
      borderRadius: 20,
      backgroundColor: colors.card,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    tabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    tabText: {
      color: colors.subText,
    },

    tabTextActive: {
      color: "#ffffff",
      fontWeight: "700",
    },

    sectionLabel: {
      color: colors.muted ?? colors.subText,
      marginLeft: 16,
      marginTop: 16,
      fontSize: 12,
      fontWeight: "700",
    },

    /* ================= FILTERS ================= */
    filters: {
      paddingHorizontal: 16,
      gap: 10,
      marginTop: 8,
    },

    chip: {
      paddingHorizontal: 16,
      height: 34,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      backgroundColor: colors.card,
    },

    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    chipText: {
      color: colors.subText,
    },

    chipTextActive: {
      color: "#ffffff",
      fontWeight: "700",
    },

    /* ================= LIST ================= */
    listContent: {
      padding: 16,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    topRow: {
      flexDirection: "row",
      gap: 14,
    },

    avatar: {
      width: 56,
      height: 56,
      borderRadius: 16,
    },

    name: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },

    program: {
      color: colors.primary,
      fontSize: 13,
    },

    attendance: {
      color: colors.subText,
      fontSize: 12,
    },

    rating: {
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
    },

    ratingText: {
      color: "#facc15", // semantic (rating stays yellow)
      fontWeight: "700",
    },

    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },

    shift: {
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
    },

    shiftText: {
      color: colors.subText,
      fontSize: 12,
    },

    /* ================= STATUS ================= */
    statusPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },

    activePill: {
      backgroundColor: colors.success + "22",
    },

    completedPill: {
      backgroundColor: colors.card,
    },

    statusText: {
      fontSize: 11,
      fontWeight: "700",
    },

    activeText: {
      color: colors.success ?? "#22c55e",
    },

    completedText: {
      color: colors.subText,
    },

    /* ================= DROPDOWNS ================= */
    filterContainer: {
      paddingBottom: 8,
    },

    dropdownRow: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 16,
      marginBottom: 14,
    },

    dropdownCol: {
      flex: 1,
    },

    dropdownWrapper: {
      paddingHorizontal: 16,
      marginBottom: 14,
    },

    dropdown: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
    },

    dropdownText: {
      color: colors.text,
      fontSize: 13,
    },

    dropdownArrow: {
      color: colors.subText,
      fontSize: 12,
    },

    dropdownMenu: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginTop: 6,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },

    dropdownItem: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    dropdownItemText: {
      color: colors.text,
      fontSize: 13,
    },

    /* ================= NAME ROW ================= */
    nameRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    candidateId: {
      color: colors.subText,
      fontSize: 12,
      fontWeight: "600",
    },

    infoCol: {
      flex: 1,
      gap: 4,
    },

    rightCol: {
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 90,
    },
    tabRow: {
  flexDirection: "row",
  gap: 10,
  paddingHorizontal: 16,
  marginBottom: 16,
},

tabPill: {
  paddingHorizontal: 18,
  height: 34,
  borderRadius: 18,
  backgroundColor: colors.card,
  justifyContent: "center",
  borderWidth: 1,
  borderColor: colors.border,
},

tabPillActive: {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
},

tabPillText: {
  color: colors.subText,
  fontSize: 13,
},

tabPillTextActive: {
  color: "#ffffff",
  fontWeight: "700",
},

// filterContainer: {
//   paddingBottom: 8,
// },

  });
