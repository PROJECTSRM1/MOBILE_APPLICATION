// src/screens/UserDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

declare var global: any;

type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
};

function ensureServicesGlobal() {
  if (!global.__SW_SERVICES__) global.__SW_SERVICES__ = [];
}

export default function UserDashboard(): React.ReactElement {
  const nav = useNavigation<any>();
  ensureServicesGlobal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState<Service[]>(
    Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []
  );

  useEffect(() => {
    const id = setInterval(() => {
      setServices(Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []);
    }, 400);
    return () => clearInterval(id);
  }, []);

  const addService = () => {
    if (!title.trim() || !description.trim() || !price.trim()) {
      Alert.alert("Missing fields", "Please fill title, description and price.");
      return;
    }
    const s: Service = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
    };

    global.__SW_SERVICES__ = [s, ...(global.__SW_SERVICES__ || [])];
    setServices([...global.__SW_SERVICES__]);
    setTitle("");
    setDescription("");
    setPrice("");
  };

  const removeService = (id: string) => {
    global.__SW_SERVICES__ = (global.__SW_SERVICES__ || []).filter((x: any) => x.id !== id);
    setServices([...global.__SW_SERVICES__]);
  };

  const renderItem = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.thumbPlaceholder}>
          <Text style={{ color: "#fff" }}>IMG</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontWeight: "800" }}>{item.title}</Text>
          <Text style={{ color: "#58646a", marginTop: 6 }}>{item.description}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontWeight: "900", color: "#0b3f3a" }}>₹{item.price}</Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => removeService(item.id)}>
            <Text style={{ color: "#c43a3a" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5fbff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", marginBottom: 12 }}>Service Provider — Manage Services</Text>

        <Text style={{ color: "#566" }}>Add new service (this will be available to customers)</Text>

        <TextInput
          placeholder="Service title (e.g. Deep Home Cleaning)"
          placeholderTextColor="#1d1e1fff"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Short description"
          placeholderTextColor="#1d1e1fff"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 86 }]}
          multiline
        />
        <TextInput
          placeholder="Price (number only)"
          placeholderTextColor="#1d1e1fff"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addService}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Add service</Text>
        </TouchableOpacity>

        <View style={{ height: 18 }} />

        <Text style={{ fontWeight: "800", marginBottom: 10 }}>Your services</Text>

        {services.length === 0 ? (
          <View style={{ padding: 20, borderRadius: 8, backgroundColor: "#fff", alignItems: "center" }}>
            <Text style={{ color: "#7d8a8d" }}>No services yet — add your first service</Text>
          </View>
        ) : (
          <FlatList data={services} keyExtractor={(i) => i.id} renderItem={renderItem} scrollEnabled={false} />
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e6eef0",
  },
  addBtn: {
    backgroundColor: "#0e8b7b",
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  card: {
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  thumbPlaceholder: {
    width: 72,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#2e6b63",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: { marginTop: 14 },
});