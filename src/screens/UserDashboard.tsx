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
  Image,
} from "react-native";
// removed unused useNavigation import to avoid linter/TS warnings
// import { useNavigation } from "@react-navigation/native";

declare var global: any;

type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: string; // optional preview URI
};

function ensureServicesGlobal() {
  if (!global.__SW_SERVICES__) global.__SW_SERVICES__ = [];
}

export default function UserDashboard(): React.ReactElement {
  // ensure global array exists
  ensureServicesGlobal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState<Service[]>(
    Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []
  );

  // preview URI only (UI placeholder). Set this manually or hook up picker later.
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setServices(Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []);
    }, 400);
    return () => clearInterval(id);
  }, []);

  // Stub functions — currently do nothing. Hook up react-native-image-picker or expo-image-picker later.
  const pickImage = async () => {
    // TODO: integrate image picker here.
    // Quick test: uncomment to simulate a picked image:
    // setPickedImage("https://via.placeholder.com/300x180.png");
  };

  const takePhoto = async () => {
    // TODO: integrate camera capture here.
    // Quick test: uncomment to simulate a taken photo:
    // setPickedImage("https://via.placeholder.com/300x180.png");
  };

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
      image: pickedImage ?? undefined,
    };

    global.__SW_SERVICES__ = [s, ...(global.__SW_SERVICES__ || [])];
    setServices([...global.__SW_SERVICES__]);
    setTitle("");
    setDescription("");
    setPrice("");
    setPickedImage(null); 
  };

  const removeService = (id: string) => {
    global.__SW_SERVICES__ = (global.__SW_SERVICES__ || []).filter((x: any) => x.id !== id);
    setServices([...global.__SW_SERVICES__]);
  };

  const renderItem = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: 72, height: 56, borderRadius: 8 }} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={{ color: "#fff" }}>IMG</Text>
          </View>
        )}

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
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Short description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 86 }]}
          multiline
        />
        <TextInput
          placeholder="Price (number only)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* --- Upload placeholder section (UI only) --- */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: "#566", marginBottom: 8 }}>Service image (optional)</Text>

          <View style={styles.uploadPlaceholder}>
            {pickedImage ? (
              <Image source={{ uri: pickedImage }} style={{ width: 92, height: 68, borderRadius: 8 }} />
            ) : (
              <View style={{ width: 92, height: 68, borderRadius: 8, backgroundColor: "#eaf2f2", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#7d8a8d" }}>No image</Text>
              </View>
            )}

            <View style={{ marginLeft: 12, flex: 1 }}>
              <TouchableOpacity onPress={pickImage} style={{ paddingVertical: 8 }}>
                <Text style={{ color: "#0e8b7b", fontWeight: "700" }}>Pick image</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto} style={{ paddingVertical: 6 }}>
                <Text style={{ color: "#0e8b7b" }}>Take photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* --- end upload section --- */}

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
  uploadPlaceholder: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6eef0",
  },
});
