import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"];

const SERVICES = [
  "Floor Cleaning",
  "Room Cleaning",
  "Washroom Cleaning",
  "Balcony Cleaning",
  "Kitchen",
  "Office",
];

const DURATIONS = ["15 Mins", "30 Mins", "45 Mins", "60 Mins"];
interface AddonItem {
  id: number;
  service: string;
  duration: string;
  date: Date | null;
}
const BookCleaningScreen = ({ navigation }: any) => {
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
const [selectedAddonId, setSelectedAddonId] = useState<number | null>(null);

  const [jobDate, setJobDate] = useState<Date | null>(null);
  const [addonDate, setAddonDate] = useState<Date | null>(null);

  const [showJobPicker, setShowJobPicker] = useState(false);
  const [showAddonPicker, setShowAddonPicker] = useState(false);
const [addons, setAddons] = useState<AddonItem[]>([
    { id: Date.now(), service: "Floor Cleaning", duration: "30 Mins", date: null }
  ]);
  const [serviceModal, setServiceModal] = useState(false);
  const [durationModal, setDurationModal] = useState(false);

  const [selectedService, setSelectedService] = useState("Floor Cleaning");
  const [selectedDuration, setSelectedDuration] = useState("30 Mins");

  const formatDate = (d: Date) =>
    `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
const addNewAddon = () => {
    const newAddon: AddonItem = {
      id: Date.now(),
      service: "Select Service",
      duration: "30 Mins",
      date: null,
    };
    setAddons([...addons, newAddon]);
  };

  const deleteAddon = (id: number) => {
    setAddons(addons.filter((item) => item.id !== id));
  };

  const updateAddon = (id: number, field: keyof AddonItem, value: any) => {
    setAddons(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity>
            <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Cleaning</Text>
          <TouchableOpacity>
            <MaterialIcons name="more-horiz" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* JOB DETAILS */}
        <View style={styles.jobCard}>
          <Text style={styles.cardTitle}>Job Details</Text>

          <View style={styles.row}>
            <View style={styles.inputBox}>
              <Text style={styles.label}>Floor Area (Sqft)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="e.g. 1200"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Text style={styles.unit}>sqft</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowJobPicker(true)}
            >
              <Text style={styles.label}>Date</Text>
              <View style={styles.inputRow}>
                <Text style={styles.placeholder}>
                  {jobDate ? formatDate(jobDate) : "DD/MM/YYYY"}
                </Text>
                <MaterialIcons name="calendar-today" size={18} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* TIME */}
        <View style={styles.timeHeader}>
          <Text style={styles.sectionTitle}>Select Start Time</Text>
          <Text style={styles.duration}>1 Hour Duration</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TIMES.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timePill,
                selectedTime === time && styles.timePillActive,
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextActive,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ADDONS */}
        <View style={styles.addonHeader}>
          <Text style={styles.sectionTitle}>Addons</Text>
         <TouchableOpacity style={styles.addBtn} onPress={addNewAddon}>

            <MaterialIcons name="add" size={20} color="#3b82f6" />
            <Text style={styles.addText}>Add New</Text>
          </TouchableOpacity>
        </View>

    {addons.map((addon, index) => (
  <View key={addon.id} style={styles.addonCard}>
    <View style={styles.addonAccent} />

    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.addonTop}>
        <Text style={styles.addonTitle}>
          ADDING SERVICE #{index + 1}
        </Text>

        <TouchableOpacity onPress={() => deleteAddon(addon.id)}>
          <MaterialIcons name="delete" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* SERVICE */}
      <Text style={styles.label}>Select Service</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          setSelectedAddonId(addon.id);
          setServiceModal(true);
        }}
      >
        <Text style={styles.dropdownText}>{addon.service}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={22} color="#94a3b8" />
      </TouchableOpacity>

      <View style={styles.row}>
        {/* DURATION */}
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => {
            setSelectedAddonId(addon.id);
            setDurationModal(true);
          }}
        >
          <Text style={styles.label}>Duration</Text>
          <View style={styles.inputRow}>
            <Text style={styles.placeholder}>{addon.duration}</Text>
            <MaterialIcons name="access-time" size={18} color="#94a3b8" />
          </View>
        </TouchableOpacity>

        {/* DATE */}
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => {
            setSelectedAddonId(addon.id);
            setShowAddonPicker(true);
          }}
        >
          <Text style={styles.label}>Date</Text>
          <View style={styles.inputRow}>
            <Text style={styles.placeholder}>
              {addon.date ? formatDate(addon.date) : "Same day"}
            </Text>
            <MaterialIcons name="calendar-today" size={18} color="#94a3b8" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
))}


        {/* SUMMARY */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Base Service</Text>
            <Text style={styles.summaryText}>$80.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Addons (1)</Text>
            <Text style={styles.summaryText}>$25.00</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
     {/* CTA */}
<View style={styles.ctaWrapper}>
  <TouchableOpacity 
    style={styles.ctaBtn}
    onPress={() => navigation.navigate("PaymentSummary")} // Use the name you gave this screen in your Stack.Navigator
  >
    <MaterialIcons name="lock" size={20} color="#fff" />
    <Text style={styles.ctaText}>Add to Cart and Checkout</Text>
  </TouchableOpacity>
</View>

      {/* DATE PICKERS */}
    {showJobPicker && (
  <DateTimePicker
    value={jobDate || new Date()}
    mode="date"
    onChange={(_event: any, d?: Date) => { // Use _event to show it's unused
      setShowJobPicker(false);
      if (d) setJobDate(d);
    }}
  />
)}

 {showAddonPicker && (
  <DateTimePicker
    value={new Date()}
    mode="date"
    onChange={(_event: any, d?: Date) => { // Fixes the 'any' type error
      setShowAddonPicker(false);
      if (d && selectedAddonId !== null) {
        updateAddon(selectedAddonId, "date", d);
      }
    }}
  />
)}
  



      {/* SERVICE MODAL */}
      <Modal transparent animationType="slide" visible={serviceModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {SERVICES.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.modalItem}
               onPress={() => {
  if (selectedAddonId !== null) {
    updateAddon(selectedAddonId, "service", s);
  }
  setServiceModal(false);
}}

              >
                <Text style={styles.modalText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* DURATION MODAL */}
      <Modal transparent animationType="slide" visible={durationModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.modalItem}
                onPress={() => {
  if (selectedAddonId !== null) {
    updateAddon(selectedAddonId, "duration", d);
  }
  setDurationModal(false);
}}

              >
                <Text style={styles.modalText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookCleaningScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  headerSafe: {
    backgroundColor: "#020617",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  jobCard: {
    backgroundColor: "#0f172a",
    margin: 16,
    borderRadius: 20,
    paddingBottom: 16,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    padding: 16,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },

  inputBox: {
    flex: 1,
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },

  label: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },

  unit: {
    color: "#64748b",
  },

  placeholder: {
    color: "#64748b",
    fontSize: 15,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 28,
  },

  timeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 28,
  },

  duration: {
    color: "#94a3b8",
  },

  timePill: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginLeft: 16,
    marginTop: 14,
  },

  timePillActive: {
    backgroundColor: "#2563eb",
  },

  timeText: {
    color: "#cbd5f5",
    fontWeight: "600",
  },

  timeTextActive: {
    color: "#fff",
  },

  addonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
    alignItems: "center",
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  addText: {
    color: "#3b82f6",
    marginLeft: 4,
    fontWeight: "600",
  },

  addonCard: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  addonAccent: {
    width: 4,
    backgroundColor: "#2563eb",
  },

  addonTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  addonTitle: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "700",
  },

  dropdown: {
    backgroundColor: "#020617",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  dropdownText: {
    color: "#fff",
    fontSize: 15,
  },

  summary: {
    backgroundColor: "#0f172a",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  summaryText: {
    color: "#cbd5f5",
    fontSize: 14,
  },

  ctaWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#020617",
    padding: 16,
  },

  ctaBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  modalItem: {
    paddingVertical: 14,
  },

  modalText: {
    color: "#fff",
    fontSize: 16,
  },
});
