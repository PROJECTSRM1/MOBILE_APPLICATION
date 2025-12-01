// src/screens/CustomerScreen.tsx
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface Task {
  id: number;
  service: string;
  timeSlot: string;
  assigned?: boolean;
}

const initialTasks: Task[] = [
  { id: 1, service: "Cleaning", timeSlot: "10:00 AM - 11:00 AM" },
  { id: 2, service: "Repair", timeSlot: "11:00 AM - 12:00 PM" },
];

export default function CustomerScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const assignTask = (taskId: number) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, assigned: true } : task));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.service}</Text>
            <Text>{item.timeSlot}</Text>
            <TouchableOpacity
              style={[styles.button, item.assigned && { backgroundColor: "#ccc" }]}
              disabled={item.assigned}
              onPress={() => assignTask(item.id)}
            >
              <Text style={styles.buttonText}>{item.assigned ? "Assigned" : "Assign to me"}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  taskItem: { padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
  button: { marginTop: 10, padding: 10, backgroundColor: "#007bff", borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
});
