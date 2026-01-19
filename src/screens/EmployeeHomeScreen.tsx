import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/* ================= DUMMY DATA ================= */

const initialRequests = [
  {
    id: "1",
    service: "Home Cleaning",
    location: "Downtown",
    time: "Today, 3:00 PM",
    earnings: "₹800",
    urgency: "NEW",
  },
  {
    id: "2",
    service: "Electrician Service",
    location: "City Center",
    time: "Tomorrow, 10:00 AM",
    earnings: "₹1200",
    urgency: "URGENT",
  },
  {
    id: "3",
    service: "Raw Material Delivery",
    location: "Industrial Area",
    time: "Today, 6:00 PM",
    earnings: "₹1500",
    urgency: "NEW",
  },
  {
    id: "4",
    service: "Plumbing Work",
    location: "Green Park",
    time: "Tomorrow, 1:00 PM",
    earnings: "₹900",
    urgency: "NEW",
  },
  {
    id: "5",
    service: "House Painting",
    location: "Lake View Road",
    time: "Tomorrow, 9:00 AM",
    earnings: "₹2200",
    urgency: "URGENT",
  },
  {
    id: "6",
    service: "Construction Material Supply",
    location: "Ring Road",
    time: "Today, 5:30 PM",
    earnings: "₹1800",
    urgency: "NEW",
  },
  {
    id: "7",
    service: "AC Repair Service",
    location: "Uptown",
    time: "Tomorrow, 11:30 AM",
    earnings: "₹1400",
    urgency: "NEW",
  },
  {
    id: "8",
    service: "Office Cleaning",
    location: "Tech Park",
    time: "Tomorrow, 6:00 AM",
    earnings: "₹2000",
    urgency: "URGENT",
  },
];

/* ================= SCREEN ================= */

const EmployeeHomeScreen = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const acceptJob = (job: any) => {
    setRequests((prev) => prev.filter((item) => item.id !== job.id));
    setActiveJobs((prev) => [...prev, job]);
  };

  const completeJob = (job: any) => {
    setActiveJobs((prev) => prev.filter((item) => item.id !== job.id));
    setHistory((prev) => [...prev, job]);
  };

  const cancelJob = (job: any) => {
    setActiveJobs((prev) => prev.filter((item) => item.id !== job.id));
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Employee Dashboard</Text>
        <MaterialIcons name="work-outline" size={26} color="#fff" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= NEW REQUESTS ================= */}
        <Text style={styles.sectionTitle}>New Requests</Text>

        {requests.length === 0 && (
          <Text style={styles.emptyText}>No new requests</Text>
        )}

        {requests.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.service}>{item.service}</Text>

              <View
                style={[
                  styles.badge,
                  item.urgency === "URGENT" && styles.urgentBadge,
                ]}
              >
                <Text style={styles.badgeText}>{item.urgency}</Text>
              </View>
            </View>

            <Text style={styles.metaText}>{item.location}</Text>
            <Text style={styles.metaText}>{item.time}</Text>

            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Earnings</Text>
              <Text style={styles.earningsValue}>{item.earnings}</Text>
            </View>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => acceptJob(item)}
            >
              <Text style={styles.acceptText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ================= ACTIVE JOBS ================= */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Active Jobs
        </Text>

        {activeJobs.length === 0 && (
          <Text style={styles.emptyText}>No active jobs</Text>
        )}

        {activeJobs.map((job) => (
          <View key={job.id} style={styles.activeCard}>
            <View>
              <Text style={styles.service}>{job.service}</Text>
              <Text style={styles.metaText}>{job.location}</Text>
              <Text style={styles.metaText}>{job.time}</Text>
              <Text style={styles.earningsValue}>{job.earnings}</Text>
            </View>

            <View style={styles.activeActions}>
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => completeJob(job)}
              >
                <Text style={styles.completeText}>Complete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => cancelJob(job)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ================= HISTORY ================= */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Job History
        </Text>

        {history.length === 0 && (
          <Text style={styles.emptyText}>No completed jobs</Text>
        )}

        {history.map((job) => (
          <View key={job.id} style={styles.historyCard}>
            <View>
              <Text style={styles.service}>{job.service}</Text>
              <Text style={styles.metaText}>{job.location}</Text>
              <Text style={styles.metaText}>{job.time}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.earningsValue}>{job.earnings}</Text>
              <Text style={styles.completedText}>COMPLETED</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default EmployeeHomeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  emptyText: {
    color: "#9ca3af",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  activeCard: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  historyCard: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  service: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  badge: {
    backgroundColor: "#2563eb33",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  urgentBadge: {
    backgroundColor: "#dc262633",
  },

  badgeText: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "700",
  },

  metaText: {
    color: "#cbd5f5",
    fontSize: 13,
    marginBottom: 2,
  },

  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  earningsLabel: {
    color: "#9ca3af",
    fontSize: 13,
  },

  earningsValue: {
    color: "#22c55e",
    fontSize: 15,
    fontWeight: "700",
  },

  acceptBtn: {
    marginTop: 14,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  acceptText: {
    color: "#fff",
    fontWeight: "600",
  },

  activeActions: {
    justifyContent: "center",
    gap: 8,
  },

  completeBtn: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  completeText: {
    color: "#022c22",
    fontWeight: "700",
  },

  cancelBtn: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  cancelText: {
    color: "#fff",
    fontWeight: "700",
  },

  completedText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
});
