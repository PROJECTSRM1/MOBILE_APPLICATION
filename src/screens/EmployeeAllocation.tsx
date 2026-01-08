import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

type AllocationMethod = "manual" | "auto";

type Professional = {
  id: string;
  name: string;
  role: string;
  rating: string;
  distance: string;
  image: any;
  verified?: boolean;
};

const PROFESSIONALS: Professional[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Deep Cleaner",
    rating: "4.9 (124)",
    distance: "0.8 mi",
    image: { uri: "https://randomuser.me/api/portraits/women/44.jpg" },
    verified: true,
  },
  {
    id: "2",
    name: "David Okon",
    role: "Standard Cleaner",
    rating: "4.7 (89)",
    distance: "1.2 mi",
    image: { uri: "https://randomuser.me/api/portraits/men/32.jpg" },
  },
  {
    id: "3",
    name: "Maria Garcia",
    role: "Deep Cleaner",
    rating: "4.8 (210)",
    distance: "2.0 mi",
    image: { uri: "https://randomuser.me/api/portraits/women/65.jpg" },
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Window Specialist",
    rating: "4.5 (56)",
    distance: "5.4 mi",
    image: { uri: "https://randomuser.me/api/portraits/men/45.jpg" },
  },
];

const EmployeeAllocation = () => {
  const [allocationMethod, setAllocationMethod] =
    useState<AllocationMethod>("manual");
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAuto = allocationMethod === "auto";

  const renderItem = ({ item }: { item: Professional }) => {
    const selected = selectedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isAuto}
        onPress={() => setSelectedId(item.id)}
        style={[
          styles.card,
          selected && !isAuto && styles.cardSelected,
          isAuto && styles.cardDisabled,
        ]}
      >
        <View style={styles.cardRow}>
          <View style={styles.leftRow}>
            <View>
              <Image source={item.image} style={styles.avatar} />
              {item.verified && (
                <View style={styles.verified}>
                  <Icon name="verified" size={14} color="#facc15" />
                </View>
              )}
            </View>

            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text
                style={[
                  styles.role,
                  selected && !isAuto && { color: "#1a5cff" },
                ]}
              >
                {item.role}
              </Text>

              <View style={styles.metaRow}>
                <Icon name="star" size={14} color="#facc15" />
                <Text style={styles.meta}>{item.rating}</Text>
                <View style={styles.dot} />
                <Icon name="near-me" size={14} color="#9da6b9" />
                <Text style={styles.meta}>{item.distance}</Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.radio,
              selected && !isAuto && styles.radioSelected,
            ]}
          >
            {selected && !isAuto && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#0d1321", "#101622"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="arrow-back-ios-new" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Professional</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Allocation Method */}
        <View style={styles.section}>
          <Text style={styles.label}>Allocation Method</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Text style={styles.dropdownText}>
              {allocationMethod === "manual"
                ? "Manual Selection"
                : "Auto Allocation"}
            </Text>
            <Icon
              name={dropdownOpen ? "expand-less" : "expand-more"}
              size={22}
              color="#9da6b9"
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setAllocationMethod("manual");
                  setDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>
                  Manual Selection
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setAllocationMethod("auto");
                  setSelectedId(null);
                  setDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>
                  Auto Allocation
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Available Professionals</Text>
          <Text style={styles.sortText}>Sorted by: Location</Text>
        </View>

        {/* List */}
        <FlatList
          data={PROFESSIONALS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 260 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.filters}>
            <View style={styles.filterBtn}>
              <Icon name="tune" size={18} color="#1a5cff" />
              <Text style={styles.filterText}>Service: Deep Clean</Text>
            </View>
            <View style={styles.filterBtn}>
              <Icon name="sort" size={18} color="#1a5cff" />
              <Text style={styles.filterText}>Sort: Nearby</Text>
            </View>
          </View>

          <LinearGradient
            colors={["#1a5cff", "#0f4ae0"]}
            style={styles.confirmBtn}
          >
            <Text style={styles.confirmText}>Confirm Allocation</Text>
            <Icon name="check" size={20} color="#fff" />
          </LinearGradient>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EmployeeAllocation;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0d1321" },
  container: { flex: 1 },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1c2433",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  section: {
    padding: 16,
    zIndex: 10,
  },
  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 8,
  },

  dropdown: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#1c1f27",
    borderWidth: 1,
    borderColor: "#3b4354",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#1c1f27",
    borderWidth: 1,
    borderColor: "#3b4354",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 16,
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 15,
  },

  listHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  sortText: {
    color: "#9da6b9",
    fontSize: 13,
  },

  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#1c1f27",
    borderWidth: 1,
    borderColor: "#3b4354",
  },
  cardSelected: {
    borderColor: "#1a5cff",
    backgroundColor: "rgba(26,92,255,0.12)",
  },
  cardDisabled: {
    opacity: 0.5,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  verified: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#1c1f27",
    borderRadius: 10,
    padding: 2,
  },

  name: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  role: {
    color: "#9da6b9",
    fontSize: 14,
    marginTop: 2,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  meta: {
    color: "#9da6b9",
    fontSize: 12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3b4354",
    marginHorizontal: 4,
  },

  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#3b4354",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#1a5cff",
    backgroundColor: "#1a5cff",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#111318",
    borderTopWidth: 1,
    borderTopColor: "#3b4354",
  },
  filters: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  filterBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1c1f27",
    borderWidth: 1,
    borderColor: "#3b4354",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  confirmBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});