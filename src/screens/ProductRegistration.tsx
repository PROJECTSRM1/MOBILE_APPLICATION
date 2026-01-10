import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";

const ProductRegistration = ({ navigation, route }: any) => {
  const { onAddProduct } = route.params;

  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  /* IMAGE PICKER */
  const handleAddPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
    });

    if (!result.didCancel && result.assets?.[0]?.uri) {
      setImages([result.assets[0].uri]);
    }
  };

  /* REGISTER PRODUCT */
  const handleRegisterProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      title: productName,
      stock: "1 unit",
      price: "$0.00",
      status: "LIVE ON STORE",
      statusColor: "#22C55E",
      image:
        images[0] ||
        "https://images.unsplash.com/photo-1586105251261-72a756497a11",
    };

    onAddProduct(newProduct);

    Alert.alert("Success 🎉", "Product registered successfully", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios-new" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Product Registration</Text>

        <Text style={styles.label}>Company Name</Text>
        <TextInput
          value={companyName}
          onChangeText={setCompanyName}
          style={styles.input}
        />

        <Text style={styles.label}>Product Name</Text>
        <TextInput
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <Text style={styles.label}>Product Imagery</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handleAddPhoto}>
          <Icon name="photo-camera" size={22} color="#3b82f6" />
          <Text style={styles.uploadText}>Add Photos</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <Image source={{ uri: images[0] }} style={styles.previewImage} />
        )}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleRegisterProduct}
        >
          <Text style={styles.submitText}>Register Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProductRegistration;

/* STYLES (UNCHANGED) */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  content: { padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  label: { color: "#e5e7eb", marginTop: 14 },
  input: {
    backgroundColor: "#0b1220",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
  },
  textArea: { height: 100 },
  uploadBox: {
    marginTop: 10,
    height: 120,
    borderWidth: 1,
    borderColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  uploadText: { color: "#e5e7eb" },
  previewImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginTop: 12,
  },
  submitBtn: {
    marginTop: 28,
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700" },
});
