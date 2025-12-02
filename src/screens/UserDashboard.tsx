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
  Modal,
  TouchableWithoutFeedback,
  ImageSourcePropType,
} from "react-native";

declare var global: any;

type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: ImageSourcePropType;
};

function ensureServicesGlobal() {
  if (!global.__SW_SERVICES__) global.__SW_SERVICES__ = [];
}


const SERVICE_IMAGES: ImageSourcePropType[] = [
  require("../../assets/pack1.jpg"),
  require("../../assets/pack2.jpg"),
  require("../../assets/pack3.jpg"),
  require("../../assets/pack4.jpeg"),
  require("../../assets/pack5.jpg"),
  require("../../assets/pack6.jpg"),
  require("../../assets/pack7.jpg"),
];

export default function UserDashboard(): React.ReactElement {
  ensureServicesGlobal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState<Service[]>(
    Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []
  );

  // selected asset image (ImageSourcePropType)
  const [pickedImage, setPickedImage] = useState<ImageSourcePropType | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

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
      image: pickedImage ?? undefined,
    };

    global.__SW_SERVICES__ = [s, ...(global.__SW_SERVICES__ || [])];
    setServices([...global.__SW_SERVICES__]);

    // reset inputs
    setTitle("");
    setDescription("");
    setPrice("");
    setPickedImage(null);
    Alert.alert("Added", "Service added successfully.");
  };

  const removeService = (id: string) => {
    global.__SW_SERVICES__ = (global.__SW_SERVICES__ || []).filter((x: any) => x.id !== id);
    setServices([...global.__SW_SERVICES__]);
  };

  const renderItem = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.image ? (
          <Image source={item.image} style={styles.thumbImage} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>IMG</Text>
          </View>
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.serviceTitle}>{item.title}</Text>
          <Text style={styles.serviceDesc}>{item.description}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.priceText}>₹{item.price}</Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => removeService(item.id)}>
            <Text style={{ color: "#c43a3a", fontWeight: "700" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.header}>Service Provider — Manage Services</Text>
        <Text style={styles.sub}>Add services your customers will see (images optional).</Text>

        <TextInput
          placeholder="Service title (e.g. Deep Home Cleaning)"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor="#9aa0a6"
        />

        <TextInput
          placeholder="Short description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 86 }]}
          multiline
          placeholderTextColor="#9aa0a6"
        />

        <TextInput
          placeholder="Price (number only)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#9aa0a6"
        />

        {/* --- Asset image selector --- */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: "#566", marginBottom: 8 }}>Service image (optional)</Text>

          <TouchableOpacity style={styles.uploadPlaceholder} onPress={() => setShowImagePicker(true)} activeOpacity={0.85}>
            {pickedImage ? (
              <Image source={pickedImage} style={{ width: 92, height: 68, borderRadius: 8 }} />
            ) : (
              <View style={{ width: 92, height: 68, borderRadius: 8, backgroundColor: "#eaf2f2", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#7d8a8d" }}>No image</Text>
              </View>
            )}

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: "700", color: "#0e8b7b" }}>{pickedImage ? "Selected image" : "Choose from assets"}</Text>
              <Text style={{ color: "#7d8a8d", marginTop: 6, fontSize: 12 }}>
                Tap to open gallery
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Modal gallery for selecting an asset */}
        <Modal visible={showImagePicker} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowImagePicker(false)}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.modalBox}>
                  <Text style={{ fontWeight: "800", marginBottom: 10, fontSize: 16 }}>Select an image</Text>

                  <FlatList
                    data={SERVICE_IMAGES}
                    keyExtractor={(_, i) => i.toString()}
                    numColumns={3}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setPickedImage(item);
                          setShowImagePicker(false);
                        }}
                        style={{ padding: 6 }}
                      >
                        <Image source={item} style={{ width: 96, height: 72, borderRadius: 8 }} />
                      </TouchableOpacity>
                    )}
                  />

                  <TouchableOpacity onPress={() => setShowImagePicker(false)} style={{ marginTop: 12, alignSelf: "center" }}>
                    <Text style={{ color: "#c43a3a", fontWeight: "700" }}>CLOSE</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* --- end modal --- */}

        <TouchableOpacity style={styles.addBtn} onPress={addService}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Add service</Text>
        </TouchableOpacity>

        <View style={{ height: 18 }} />

        <Text style={{ fontWeight: "800", marginBottom: 10 }}>Your services</Text>

        {services.length === 0 ? (
          <View style={styles.empty}>
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
  safe: { flex: 1, backgroundColor: "#f5fbff" },
  wrap: { padding: 20 },
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
  addBtn: {
    backgroundColor: "#0e8b7b",
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  empty: {
    backgroundColor: "#fff",
    padding: 18,
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
  thumbImage: { width: 72, height: 56, borderRadius: 8, resizeMode: "cover" },
  serviceTitle: { fontWeight: "800" },
  serviceDesc: { color: "#58646a", marginTop: 6 },

  priceText: { fontWeight: "900", color: "#0b3f3a" },
  deleteBtn: { marginTop: 12 },

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

  // modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 18,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    maxHeight: "80%",
  },
});
