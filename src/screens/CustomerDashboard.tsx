// src/screens/CustomerDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Image,
} from "react-native";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const assignment = {
      id: Date.now().toString(),
      serviceId,
      serviceTitle: s?.title ?? " service",
      serviceImage: s?.image ?? undefined, 
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      preferredDate: preferredDate.trim(),
      preferredTime: preferredTime.trim(),
      notes: notes.trim(),
      createdAt: Date.now(),
      status: "pending",
    };

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
            <TouchableOpacity
              style={[styles.actionBtn, styles.accept]}
              onPress={() => confirmAndUpdate(row.id, "accepted", "Accept")}
            >
              <Text style={styles.actionBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.reject]}
              onPress={() => confirmAndUpdate(row.id, "cancelled", "Reject")}
            >
              <Text style={styles.actionBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        );
      case "accepted":
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.progress]}
              onPress={() => confirmAndUpdate(row.id, "in_progress", "Start Work")}
            >
              <Text style={styles.actionBtnText}>Start Work</Text>
            </TouchableOpacity>
          </View>
        );
      case "in_progress":
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.complete]}
              onPress={() => confirmAndUpdate(row.id, "completed", "Mark Completed")}
            >
              <Text style={styles.actionBtnText}>Complete</Text>
            </TouchableOpacity>
          </View>
        );
      case "completed":
        return <Text style={styles.statusChipCompleted}>Completed ✓</Text>;
      case "cancelled":
        return <Text style={styles.statusChipCancelled}>Cancelled ✕</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Create Service Request</Text>
          <Text style={styles.smallMuted}>Add request details — providers will see and accept</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Request details</Text>

          <Text style={styles.label}>Select service</Text>
          {services.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No services available — ask provider to add services.</Text>
            </View>
          ) : (
            <View style={styles.serviceList}>
              {services.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => setServiceId(s.id)}
                  style={[
                    styles.serviceRow,
                    s.id === serviceId ? styles.serviceRowSelected : undefined,
                  ]}
                  activeOpacity={0.85}
                >
                  {s.image ? (
                    <Image source={s.image} style={styles.serviceThumb} />
                  ) : (
                    <View style={styles.serviceThumbPlaceholder}>
                      <Text style={{ color: "#fff", fontWeight: "700" }}>IMG</Text>
                    </View>
                  )}

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.serviceTitle, s.id === serviceId ? styles.serviceTitleSelected : undefined]}>
                      {s.title}
                    </Text>
                    <Text style={styles.servicePrice}>₹{s.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput placeholder="Your name" value={customerName} onChangeText={setCustomerName} style={styles.input} />
          <TextInput
            placeholder="Phone (7-15 digits)"
            value={customerPhone}
            onChangeText={setCustomerPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput placeholder="Service address" value={address} onChangeText={setAddress} style={[styles.input, { height: 88 }]} multiline />
          <View style={styles.row}>
            <TextInput placeholder="Preferred date (optional)" value={preferredDate} onChangeText={setPreferredDate} style={[styles.input, { flex: 1 }]} />
            <View style={{ width: 12 }} />
            <TextInput placeholder="Preferred time (optional)" value={preferredTime} onChangeText={setPreferredTime} style={[styles.input, { flex: 1 }]} />
          </View>
          <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes} style={[styles.input, { height: 86 }]} multiline />

          <TouchableOpacity style={styles.primaryBtn} onPress={createRequest} activeOpacity={0.9}>
            <Text style={styles.primaryBtnText}>Create Request</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 8 }} />

        <Text style={styles.sectionTitle}>All Requests</Text>
        <Text style={styles.smallMuted}>Requests created by customers — providers can accept</Text>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No requests yet. Requests will appear here after creation.</Text>
          </View>
        ) : (
          items.map((row) => (
            <View key={row.id} style={styles.card}>
              <View style={styles.metaHeader}>
                <Text style={styles.title}>{row.serviceTitle || "Service Request"}</Text>
                <Text style={[styles.statusText, (styles as any)[`status_${row.status}`]]}>
                  {row.status.toUpperCase()}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {row.serviceImage ? (
                  <Image source={row.serviceImage} style={styles.requestThumb} />
                ) : (
                  <View style={styles.requestThumbPlaceholder}>
                    <Text style={{ color: "#fff", fontWeight: "700" }}>IMG</Text>
                  </View>
                )}

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Customer</Text>
                    <Text style={styles.metaValue}>{row.customerName} ({row.customerPhone})</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Address</Text>
                    <Text style={styles.metaValue}>{row.address}</Text>
                  </View>

                  {row.preferredDate ? (
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Date</Text>
                      <Text style={styles.metaValue}>{row.preferredDate} {row.preferredTime ? ` • ${row.preferredTime}` : ""}</Text>
                    </View>
                  ) : null}

                  {row.notes ? (
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Notes</Text>
                      <Text style={styles.metaValue}>{row.notes}</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={{ marginTop: 10 }}>{renderActions(row)}</View>
            </View>
          ))
        )}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const tint = "#0e8b7b";
const neutral = "#4b5a5f";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6fbfb" },
  wrap: { padding: 18, paddingTop: 36 },
  headerRow: { marginBottom: 12 },
  header: { fontSize: 22, fontWeight: "900", color: "#123b38" },
  smallMuted: { color: "#556", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 14 },
      android: { elevation: 3 },
    }),
  },
  cardTitle: { fontWeight: "800", marginBottom: 8, fontSize: 16, color: "#1f4543" },

  label: { marginTop: 8, marginBottom: 8, color: "#4b5a5f", fontWeight: "700" },
  emptyCard: { backgroundColor: "#fff8f6", padding: 12, borderRadius: 10 },
  emptyText: { color: "#7c8a92" },

  serviceList: { marginBottom: 6 },
  serviceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8, borderRadius: 10, marginBottom: 6 },
  serviceRowSelected: { backgroundColor: "#e6f6f2" },
  serviceThumb: { width: 56, height: 42, borderRadius: 8, resizeMode: "cover" },
  serviceThumbPlaceholder: { width: 56, height: 42, borderRadius: 8, backgroundColor: "#2e6b63", alignItems: "center", justifyContent: "center" },
  serviceTitle: { fontWeight: "700", color: "#24333a" },
  serviceTitleSelected: { fontWeight: "900", color: tint },
  servicePrice: { color: "#6b7b80", marginTop: 3 },

  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e6eef0",
  },

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },

  primaryBtn: {
    backgroundColor: tint,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  sectionTitle: { fontSize: 18, fontWeight: "800", marginTop: 18 },

  empty: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  title: { fontSize: 16, fontWeight: "800", color: "#1b4240" },
  metaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  // Request thumbnail and layout
  requestThumb: { width: 84, height: 64, borderRadius: 8, resizeMode: "cover" },
  requestThumbPlaceholder: { width: 84, height: 64, borderRadius: 8, backgroundColor: "#2e6b63", alignItems: "center", justifyContent: "center" },

  metaRow: { flexDirection: "row", marginTop: 8 },
  metaLabel: { width: 100, color: "#5b6b70", fontWeight: "700" },
  metaValue: { flex: 1, color: "#4b5a5f" },

  statusText: { fontWeight: "900", fontSize: 12, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  status_pending: { color: "#b87f00", backgroundColor: "#fff4e6" },
  status_accepted: { color: "#0b84a5", backgroundColor: "#eaf6fb" },
  status_in_progress: { color: "#6b3aa8", backgroundColor: "#f3eaff" },
  status_completed: { color: "#0d8a4a", backgroundColor: "#e9fbf0" },
  status_cancelled: { color: "#c63939", backgroundColor: "#fff2f2" },

  actionRow: { flexDirection: "row", marginTop: 6 },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginRight: 10, minWidth: 110, alignItems: "center" },
  actionBtnText: { color: "#fff", fontWeight: "800" },
  accept: { backgroundColor: "#0b8f52" },
  reject: { backgroundColor: "#d33c3c" },
  progress: { backgroundColor: "#2f5ac8" },
  complete: { backgroundColor: "#008577" },

  statusChipCompleted: { marginTop: 8, color: "#2e7d32", fontWeight: "800" },
  statusChipCancelled: { marginTop: 8, color: "#b71c1c", fontWeight: "800" },
});
 