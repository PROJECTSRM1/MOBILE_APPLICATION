// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StatusBar,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";

// type AllocationMethod = "manual" | "auto";

// type Professional = {
//   id: string;
//   name: string;
//   role: string;
//   rating: string;
//   distance: string;
//   image: any;
//   verified?: boolean;
// };

// const PROFESSIONALS: Professional[] = [
//   {
//     id: "1",
//     name: "Sarah Jenkins",
//     role: "Deep Cleaner",
//     rating: "4.9 (124)",
//     distance: "0.8 mi",
//     image: { uri: "https://randomuser.me/api/portraits/women/44.jpg" },
//     verified: true,
//   },
//   {
//     id: "2",
//     name: "David Okon",
//     role: "Standard Cleaner",
//     rating: "4.7 (89)",
//     distance: "1.2 mi",
//     image: { uri: "https://randomuser.me/api/portraits/men/32.jpg" },
//   },
//   {
//     id: "3",
//     name: "Maria Garcia",
//     role: "Deep Cleaner",
//     rating: "4.8 (210)",
//     distance: "2.0 mi",
//     image: { uri: "https://randomuser.me/api/portraits/women/65.jpg" },
//   },
//   {
//     id: "4",
//     name: "James Wilson",
//     role: "Window Specialist",
//     rating: "4.5 (56)",
//     distance: "5.4 mi",
//     image: { uri: "https://randomuser.me/api/portraits/men/45.jpg" },
//   },
// ];

// const EmployeeAllocation = () => {
//   const [allocationMethod, setAllocationMethod] =
//     useState<AllocationMethod>("manual");
//   const [selectedId, setSelectedId] = useState<string | null>("1");
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const isAuto = allocationMethod === "auto";

//   const renderItem = ({ item }: { item: Professional }) => {
//     const selected = selectedId === item.id;

//     return (
//       <TouchableOpacity
//         activeOpacity={0.85}
//         disabled={isAuto}
//         onPress={() => setSelectedId(item.id)}
//         style={[
//           styles.card,
//           selected && !isAuto && styles.cardSelected,
//           isAuto && styles.cardDisabled,
//         ]}
//       >
//         <View style={styles.cardRow}>
//           <View style={styles.leftRow}>
//             <View>
//               <Image source={item.image} style={styles.avatar} />
//               {item.verified && (
//                 <View style={styles.verified}>
//                   <Icon name="verified" size={14} color="#facc15" />
//                 </View>
//               )}
//             </View>

//             <View>
//               <Text style={styles.name}>{item.name}</Text>
//               <Text
//                 style={[
//                   styles.role,
//                   selected && !isAuto && { color: "#1a5cff" },
//                 ]}
//               >
//                 {item.role}
//               </Text>

//               <View style={styles.metaRow}>
//                 <Icon name="star" size={14} color="#facc15" />
//                 <Text style={styles.meta}>{item.rating}</Text>
//                 <View style={styles.dot} />
//                 <Icon name="near-me" size={14} color="#9da6b9" />
//                 <Text style={styles.meta}>{item.distance}</Text>
//               </View>
//             </View>
//           </View>

//           <View
//             style={[
//               styles.radio,
//               selected && !isAuto && styles.radioSelected,
//             ]}
//           >
//             {selected && !isAuto && <View style={styles.radioInner} />}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" />

//       <LinearGradient colors={["#0d1321", "#101622"]} style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity>
//             <Icon name="arrow-back-ios-new" size={22} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Select Professional</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Allocation Method */}
//         <View style={styles.section}>
//           <Text style={styles.label}>Allocation Method</Text>

//           <TouchableOpacity
//             activeOpacity={0.8}
//             style={styles.dropdown}
//             onPress={() => setDropdownOpen(!dropdownOpen)}
//           >
//             <Text style={styles.dropdownText}>
//               {allocationMethod === "manual"
//                 ? "Manual Selection"
//                 : "Auto Allocation"}
//             </Text>
//             <Icon
//               name={dropdownOpen ? "expand-less" : "expand-more"}
//               size={22}
//               color="#9da6b9"
//             />
//           </TouchableOpacity>

//           {dropdownOpen && (
//             <View style={styles.dropdownMenu}>
//               <TouchableOpacity
//                 style={styles.dropdownItem}
//                 onPress={() => {
//                   setAllocationMethod("manual");
//                   setDropdownOpen(false);
//                 }}
//               >
//                 <Text style={styles.dropdownItemText}>
//                   Manual Selection
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.dropdownItem}
//                 onPress={() => {
//                   setAllocationMethod("auto");
//                   setSelectedId(null);
//                   setDropdownOpen(false);
//                 }}
//               >
//                 <Text style={styles.dropdownItemText}>
//                   Auto Allocation
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* List Header */}
//         <View style={styles.listHeader}>
//           <Text style={styles.listTitle}>Available Professionals</Text>
//           <Text style={styles.sortText}>Sorted by: Location</Text>
//         </View>

//         {/* List */}
//         <FlatList
//           data={PROFESSIONALS}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingBottom: 260 }}
//           showsVerticalScrollIndicator={false}
//         />

//         {/* Footer */}
//         <View style={styles.footer}>
//           <View style={styles.filters}>
//             <View style={styles.filterBtn}>
//               <Icon name="tune" size={18} color="#1a5cff" />
//               <Text style={styles.filterText}>Service: Deep Clean</Text>
//             </View>
//             <View style={styles.filterBtn}>
//               <Icon name="sort" size={18} color="#1a5cff" />
//               <Text style={styles.filterText}>Sort: Nearby</Text>
//             </View>
//           </View>

//           <LinearGradient
//             colors={["#1a5cff", "#0f4ae0"]}
//             style={styles.confirmBtn}
//           >
//             <Text style={styles.confirmText}>Confirm Allocation</Text>
//             <Icon name="check" size={20} color="#fff" />
//           </LinearGradient>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// export default EmployeeAllocation;

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#0d1321" },
//   container: { flex: 1 },

//   header: {
//     height: 56,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#1c2433",
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   section: {
//     padding: 16,
//     zIndex: 10,
//   },
//   label: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "500",
//     marginBottom: 8,
//   },

//   dropdown: {
//     height: 56,
//     borderRadius: 14,
//     backgroundColor: "#1c1f27",
//     borderWidth: 1,
//     borderColor: "#3b4354",
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   dropdownText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   dropdownMenu: {
//     marginTop: 8,
//     borderRadius: 14,
//     backgroundColor: "#1c1f27",
//     borderWidth: 1,
//     borderColor: "#3b4354",
//     overflow: "hidden",
//   },
//   dropdownItem: {
//     padding: 16,
//   },
//   dropdownItemText: {
//     color: "#fff",
//     fontSize: 15,
//   },

//   listHeader: {
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   listTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   sortText: {
//     color: "#9da6b9",
//     fontSize: 13,
//   },

//   card: {
//     marginHorizontal: 16,
//     marginVertical: 8,
//     padding: 16,
//     borderRadius: 16,
//     backgroundColor: "#1c1f27",
//     borderWidth: 1,
//     borderColor: "#3b4354",
//   },
//   cardSelected: {
//     borderColor: "#1a5cff",
//     backgroundColor: "rgba(26,92,255,0.12)",
//   },
//   cardDisabled: {
//     opacity: 0.5,
//   },

//   cardRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   leftRow: {
//     flexDirection: "row",
//     gap: 16,
//     alignItems: "center",
//   },

//   avatar: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//   },
//   verified: {
//     position: "absolute",
//     bottom: -2,
//     right: -2,
//     backgroundColor: "#1c1f27",
//     borderRadius: 10,
//     padding: 2,
//   },

//   name: {
//     color: "#fff",
//     fontSize: 17,
//     fontWeight: "700",
//   },
//   role: {
//     color: "#9da6b9",
//     fontSize: 14,
//     marginTop: 2,
//   },

//   metaRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 6,
//   },
//   meta: {
//     color: "#9da6b9",
//     fontSize: 12,
//   },
//   dot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#3b4354",
//     marginHorizontal: 4,
//   },

//   radio: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     borderWidth: 2,
//     borderColor: "#3b4354",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   radioSelected: {
//     borderColor: "#1a5cff",
//     backgroundColor: "#1a5cff",
//   },
//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#fff",
//   },

//   footer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: "#111318",
//     borderTopWidth: 1,
//     borderTopColor: "#3b4354",
//   },
//   filters: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 16,
//   },
//   filterBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 10,
//     backgroundColor: "#1c1f27",
//     borderWidth: 1,
//     borderColor: "#3b4354",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   filterText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "500",
//   },

//   confirmBtn: {
//     height: 52,
//     borderRadius: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   confirmText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------------- MOCK PROFESSIONALS ---------------- */
const PROFESSIONALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    rating: 4.9,
    reviews: 124,
    service: "Deep Cleaner",
    phone: "xxxx456",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "John Carter",
    rating: 4.7,
    reviews: 98,
    service: "Floor Cleaner",
    phone: "xxxx981",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Emily Watson",
    rating: 4.8,
    reviews: 111,
    service: "Kitchen Cleaner",
    phone: "xxxx223",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    name: "Michael Brown",
    rating: 4.6,
    reviews: 76,
    service: "Office Cleaner",
    phone: "xxxx778",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
  },
];

/* ---------------- SCREEN ---------------- */
const EmployeeAllocationScreen = ({ navigation }: any) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  /* Pick random 3 profiles */
  useEffect(() => {
    const shuffled = [...PROFESSIONALS].sort(() => 0.5 - Math.random());
    setProfiles(shuffled.slice(0, 3));
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Professional</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* HORIZONTAL SCROLL */}
      <View style={styles.carouselWrapper}>
  <FlatList
    data={profiles}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id.toString()}
    snapToInterval={260}
    decelerationRate="fast"
    contentContainerStyle={styles.carousel}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[
          styles.card,
          selected?.id === item.id && styles.cardActive,
        ]}
        onPress={() => {
          setSelected(item);
          setShowModal(true);
        }}
      >
        <Image source={{ uri: item.image }} style={styles.avatar} />

        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>
            {item.rating} ({item.reviews})
          </Text>
        </View>

        <Text style={styles.service}>{item.service}</Text>
      </TouchableOpacity>
    )}
  />
</View>


      {/* CONFIRM MODAL */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Image source={{ uri: selected?.image }} style={styles.modalAvatar} />

            <Text style={styles.modalName}>{selected?.name}</Text>
            <Text style={styles.modalSub}>Professional Selected</Text>

            <View style={styles.modalInfo}>
              <InfoRow label="Ratings" value={`⭐ ${selected?.rating} (${selected?.reviews})`} />
              <InfoRow label="Service" value={selected?.service} />
              <InfoRow label="Mobile Number" value={selected?.phone} />
            </View>

            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => {
                setShowModal(false);
                navigation.goBack(); // send back selected professional if needed
              }}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ---------------- INFO ROW ---------------- */
const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default EmployeeAllocationScreen;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

 card: {
  width: 220,
  height: 260,              // 👈 FIXED HEIGHT
  backgroundColor: "#0f172a",
  borderRadius: 22,
  padding: 16,
  marginRight: 16,
  alignItems: "center",
  justifyContent: "center", // 👈 CENTER CONTENT
},

carouselWrapper: {
  flex: 1,
  justifyContent: "center",   // vertical centering
},

carousel: {
  paddingHorizontal: 16,
  alignItems: "center",
},

  cardActive: {
    borderWidth: 2,
    borderColor: "#2563eb",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },

  name: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
  marginTop: 6,
},
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  star: { color: "#facc15", marginRight: 4 },

  rating: { color: "#cbd5f5" },

  service: {
  color: "#3b82f6",
  marginTop: 10,
  fontWeight: "600",
},

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  modalAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },

  modalName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  modalSub: {
    color: "#2563eb",
    marginVertical: 6,
  },

  modalInfo: {
    width: "100%",
    backgroundColor: "#020617",
    borderRadius: 14,
    padding: 12,
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  infoLabel: { color: "#94a3b8" },
  infoValue: { color: "#fff", fontWeight: "600" },

  okBtn: {
    backgroundColor: "#2563eb",
    width: "100%",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  okText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
