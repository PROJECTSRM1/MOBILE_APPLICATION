// src/screens/CustomerDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  // Picker,
  Platform,
  Image, // <--- 1. IMPORT IMAGE COMPONENT
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

declare var global: any;

function ensureGlobals() {
  if (!global.__SW_ASSIGNMENTS__) global.__SW_ASSIGNMENTS__ = [];
  if (!global.__SW_SERVICES__) global.__SW_SERVICES__ = [];
}


export default function CustomerDashboard(): React.ReactElement {
  ensureGlobals();

  const [services, setServices] = useState<any[]>(
    Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []
  );
  const [items, setItems] = useState<any[]>(
    Array.isArray(global.__SW_ASSIGNMENTS__) ? [...global.__SW_ASSIGNMENTS__] : []
  );

  // form state for creating request
  const [serviceId, setServiceId] = useState<string | null>(services[0]?.id ?? null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setServices(Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []);
      setItems(Array.isArray(global.__SW_ASSIGNMENTS__) ? [...global.__SW_ASSIGNMENTS__] : []);
    }, 400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // keep selected serviceId in sync when services update
    if ((!serviceId || !services.find((s) => s.id === serviceId)) && services.length > 0) {
      setServiceId(services[0].id);
    }
  }, [services]);

  const createRequest = () => {
    if (!serviceId) {
      Alert.alert("No services", "No services are available to request. Ask provider to add services.");
      return;
    }
    if (!customerName.trim() || !/^\d{7,15}$/.test(customerPhone) || !address.trim()) {
      Alert.alert("Missing fields", "Please enter name, phone (7-15 digits) and address.");
      return;
    }

    const s = services.find((x) => x.id === serviceId);
    
    // --- 1. UPDATE: Include imageUri in the assignment object ---
    const assignment = {
      id: Date.now().toString(),
      serviceId,
      serviceTitle: s?.title ?? "Service",
      // Include imageUri from the selected service
      imageUri: s?.imageUri || null, 
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      preferredDate: preferredDate.trim(),
      preferredTime: preferredTime.trim(),
      notes: notes.trim(),
      createdAt: Date.now(),
      status: "pending",
    };
    // -----------------------------------------------------------

    global.__SW_ASSIGNMENTS__ = [assignment, ...(global.__SW_ASSIGNMENTS__ || [])];
    setItems([...global.__SW_ASSIGNMENTS__]);

    // clear form
    setCustomerName("");
    setCustomerPhone("");
    setAddress("");
    setPreferredDate("");
    setPreferredTime("");
    setNotes("");

    Alert.alert("Request created", "Your service request has been created and is pending.");
  };

  const updateStatus = (id: string, status: string) => {
    global.__SW_ASSIGNMENTS__ = (global.__SW_ASSIGNMENTS__ || []).map((it: any) =>
      it.id === id ? { ...it, status } : it
    );
    setItems([...global.__SW_ASSIGNMENTS__]);
  };

  const confirmAndUpdate = (id: string, status: string, label?: string) => {
    if (label) {
      Alert.alert(label, `Are you sure you want to mark this request as "${label}"?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => updateStatus(id, status) },
      ]);
    } else {
      updateStatus(id, status);
    }
  };

  const renderActions = (row: any) => {
    switch (row.status) {
      case "pending":
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.btn, styles.accept]} onPress={() => confirmAndUpdate(row.id, "accepted", "Accept")}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.reject]} onPress={() => confirmAndUpdate(row.id, "cancelled", "Reject")}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        );
      case "accepted":
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.btn, styles.progress]} onPress={() => confirmAndUpdate(row.id, "in_progress", "Start Work")}>
              <Text style={styles.btnText}>Start Work</Text>
            </TouchableOpacity>
          </View>
        );
      case "in_progress":
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.btn, styles.complete]} onPress={() => confirmAndUpdate(row.id, "completed", "Mark Completed")}>
              <Text style={styles.btnText}>Complete</Text>
            </TouchableOpacity>
          </View>
        );
      case "completed":
        return <Text style={styles.done}>Completed ✓</Text>;
      case "cancelled":
        return <Text style={styles.cancelled}>Cancelled ✕</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.header}>Customer — Create Request</Text>
        <Text style={styles.sub}>Choose a service below and create a request for providers to accept.</Text>

        <View style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: "700", marginBottom: 6 }}>Select service</Text>

          {services.length === 0 ? (
            <View style={{ backgroundColor: "#fff", padding: 12, borderRadius: 10 }}>
              <Text style={{ color: "#7c8a92" }}>No services available — ask provider to add services.</Text>
            </View>
          ) : (
            // simple Picker; if you use RN Picker, import; fallback to custom buttons
            Platform.OS === "android" || Platform.OS === "ios" ? (
              // using built-in Picker (deprecated import in some RN versions) — adapt if you use @react-native-picker/picker
              // Fallback to manual selection list if Picker not available.
              <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 10 }}>
                {services.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setServiceId(s.id)}
                    style={{
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: s.id === serviceId ? "#e6f6f2" : "transparent",
                      marginBottom: 6,
                      paddingHorizontal: 8,
                      flexDirection: 'row', 
                      alignItems: 'center', 
                    }}
                  >
                    {/* Display image in the service selection list (small) */}
                    {s.imageUri ? (
                      <Image
                        source={{ uri: s.imageUri }}
                        // Use a smaller size for the selection list
                        style={[styles.serviceImage, { width: 40, height: 40, marginRight: 10 }]}
                      />
                    ) : null}
                    
                    <View style={{ flex: 1, marginLeft: s.imageUri ? 10 : 0 }}>
                      <Text style={{ fontWeight: s.id === serviceId ? "900" : "700" }}>{s.title}</Text>
                      <Text style={{ color: "#6b7b80", marginTop: 4 }}>₹{s.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          )}
        </View>

        <View style={{ height: 12 }} />

        <TextInput placeholder="Your name" value={customerName} onChangeText={setCustomerName} style={styles.input}  placeholderTextColor="#1d1e1fff"/>
        <TextInput placeholder="Phone (7-15 digits)" value={customerPhone} onChangeText={setCustomerPhone} style={styles.input} keyboardType="phone-pad" placeholderTextColor="#1d1e1fff" />
        <TextInput placeholder="Service address" value={address} onChangeText={setAddress} style={[styles.input, { height: 80 }]} multiline  placeholderTextColor="#1d1e1fff"/>
        <TextInput placeholder="Preferred date (optional)" value={preferredDate} onChangeText={setPreferredDate} style={styles.input} placeholderTextColor="#1d1e1fff"/>
        <TextInput placeholder="Preferred time (optional)" value={preferredTime} onChangeText={setPreferredTime} style={styles.input} placeholderTextColor="#1d1e1fff"/>
        <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes} style={[styles.input, { height: 86 }]} multiline placeholderTextColor="#1d1e1fff"/>

        <TouchableOpacity style={styles.primaryBtn} onPress={createRequest}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Create Request</Text>
        </TouchableOpacity>

        <View style={{ height: 18 }} />

        <Text style={{ fontSize: 18, fontWeight: "800", marginTop: 8 }}>All Requests</Text>
        <Text style={{ color: "#556", marginBottom: 8 }}>Requests created by customers / visible for provider acceptance</Text>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No requests yet. Requests will appear here after creation.</Text>
          </View>
        ) : (
          items.map((row) => (
            <View key={row.id} style={styles.card}>
              
              {/* --- UPDATE: Render image and then title on separate lines --- */}
              {row.imageUri ? (
                <Image
                  source={{ uri: row.imageUri }}
                  // Use the large style defined below
                  style={styles.serviceImage} 
                />
              ) : null}

              <Text style={[styles.title, { marginTop: row.imageUri ? 8 : 0, marginBottom: 8 }]}>
                {row.serviceTitle || "Service Request"}
              </Text>
              {/* ------------------------------------------------------ */}

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Customer:</Text>
                <Text style={styles.metaValue}>{row.customerName} ({row.customerPhone})</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Address:</Text>
                <Text style={styles.metaValue}>{row.address}</Text>
              </View>

              {row.preferredDate ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Date:</Text>
                  <Text style={styles.metaValue}>{row.preferredDate} {row.preferredTime ? ` • ${row.preferredTime}` : ""}</Text>
                </View>
              ) : null}

              {row.notes ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Notes:</Text>
                  <Text style={styles.metaValue}>{row.notes}</Text>
                </View>
              ) : null}

              <View style={{ marginTop: 10 }}>{renderActions(row)}</View>
            </View>
          ))
        )}

        <View style={{ height: 70 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4fafc" },
  wrap: { padding: 18 },
  header: { fontSize: 22, fontWeight: "900", marginBottom: 6 },
  sub: { color: "#556", marginBottom: 12 },

  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e6eef0",
  },
  primaryBtn: {
    backgroundColor: "#0e8b7b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },


  empty: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: { color: "#7c8a92" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: "800" },
  metaRow: { flexDirection: "row", marginTop: 8 },
  metaLabel: { width: 90, color: "#5b6b70", fontWeight: "700" },
  metaValue: { flex: 1, color: "#4b5a5f" },

  // --- UPDATED IMAGE STYLE FOR LARGE DISPLAY IN CARD ---
  serviceImage: {
    // Adjusted width to 100% of the card/view and height for a typical large image display
    width: '100%', 
    height: 150,
    borderRadius: 8,
    marginBottom: 8, // Add space below the image before the title
  },
  // ----------------------------------------------------

  status: { marginTop: 10, fontWeight: "900" },
  status_pending: { color: "#b87f00" },
  status_accepted: { color: "#0b84a5" },
  status_in_progress: { color: "#6b3aa8" },
  status_completed: { color: "#0d8a4a" },
  status_cancelled: { color: "#c63939" },

  actionRow: { flexDirection: "row", marginTop: 6 },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginRight: 10 },
  btnText: { color: "#fff", fontWeight: "800" },
  accept: { backgroundColor: "#0b8f52" },
  reject: { backgroundColor: "#d33c3c" },
  progress: { backgroundColor: "#2f5ac8" },
  complete: { backgroundColor: "#008577" },

  done: { color: "#2e7d32", marginTop: 8, fontWeight: "800" },
  cancelled: { color: "#b71c1c", marginTop: 8, fontWeight: "800" },
});