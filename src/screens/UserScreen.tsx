import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

// Define the interface for a single task object
interface Task {
  id: string;
  service: string;
  timeSlot: string;
  assignedTo: string;
}

export default function UserScreen() {
  const [service, setService] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  // Fix: Explicitly type the tasks state as an array of Task objects (Task[])
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (!service.trim() || !timeSlot.trim()) return;

    // The type is now correctly inferred or explicitly set as Task
    const newTask: Task = {
      id: Date.now().toString(),
      service,
      timeSlot,
      assignedTo: "",
    };

    setTasks([newTask, ...tasks]);
    setService("");
    setTimeSlot("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create New Task</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Service Name (Ex: Cleaning)"
          value={service}
          onChangeText={setService}
          style={styles.input}
        />
        <TextInput
          placeholder="Time Slot (Ex: 10:00 AM - 11:00 AM)"
          value={timeSlot}
          onChangeText={setTimeSlot}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.btnText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeading}>Your Created Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            {/* These properties (item.service, item.timeSlot, item.assignedTo) are now known to TypeScript */}
            <Text style={styles.taskName}>{item.service}</Text>
            <Text style={styles.time}>{item.timeSlot}</Text>
            <Text style={styles.status}>
              {item.assignedTo ? `Assigned to: ${item.assignedTo}` : "Available"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2F4F7" },
  heading: { fontSize: 28, fontWeight: "700", marginBottom: 15 },
  subHeading: { fontSize: 20, fontWeight: "600", marginTop: 20, marginBottom: 10 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: "#1A73E8",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  taskCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  taskName: { fontSize: 18, fontWeight: "700" },
  time: { color: "#555", marginTop: 4 },
  status: { marginTop: 6, fontWeight: "600", color: "#1A73E8" },
});