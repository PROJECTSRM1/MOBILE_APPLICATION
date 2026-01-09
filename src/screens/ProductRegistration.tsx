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
  Alert, // ✅ ADDED
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";

const ProductRegistration = ({ navigation }: any) => {
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  /* ---------- IMAGE PICKER ---------- */
  const handleAddPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 0, // multiple images
    });

    if (!result.didCancel && result.assets) {
      const selectedImages = result.assets
        .map((asset) => asset.uri)
        .filter(Boolean) as string[];

      setImages((prev) => [...prev, ...selectedImages]);
    }
  };

  /* ---------- REGISTER PRODUCT ---------- */
  const handleRegisterProduct = () => {
    Alert.alert(
      "Success 🎉",
      "Product registered successfully",
      [
        {
          text: "OK",
          onPress: () => {
            setCompanyName("");
            setProductName("");
            setDescription("");
            setImages([]);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios-new" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Product Registration</Text>
        <Text style={styles.subtitle}>
          Enter the details of your Swachify product below to list it on the platform.
        </Text>

        {/* Company */}
        <Text style={styles.label}>Company / Entrepreneur Name</Text>
        <TextInput
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="eg. Swachify Corp"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />

        {/* Product */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          value={productName}
          onChangeText={setProductName}
          placeholder="eg. Eco-Bin Pro"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the key features and sustainability impact of your product."
          placeholderTextColor="#6b7280"
          style={[styles.input, styles.textArea]}
          multiline
        />

        {/* Imagery */}
        <Text style={styles.label}>Product Imagery</Text>

        <TouchableOpacity style={styles.uploadBox} onPress={handleAddPhoto}>
          <View style={styles.cameraCircle}>
            <Icon name="photo-camera" size={22} color="#3b82f6" />
          </View>
          <Text style={styles.uploadText}>Add Photos</Text>
          <Text style={styles.uploadSubText}>PNG, JPG up to 10MB</Text>
        </TouchableOpacity>

        {/* Preview images */}
        {images.length > 0 && (
          <View style={styles.imageRow}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.previewImage} />
            ))}
          </View>
        )}

        {/* Register Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleRegisterProduct} // ✅ ADDED
        >
          <Icon name="apps" size={18} color="#fff" />
          <Text style={styles.submitText}>Register Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProductRegistration;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 20,
  },

  label: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    backgroundColor: "#0b1220",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  uploadBox: {
    marginTop: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#1f2937",
    borderRadius: 14,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0b1220",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  uploadText: {
    color: "#e5e7eb",
    fontWeight: "600",
  },

  uploadSubText: {
    color: "#6b7280",
    fontSize: 12,
  },

  imageRow: {
    flexDirection: "row",
    marginTop: 14,
    flexWrap: "wrap",
  },

  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },

  submitBtn: {
    marginTop: 28,
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
  },
});
