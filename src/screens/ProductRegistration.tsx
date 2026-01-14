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
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductRegistration = ({ navigation, route }: any) => {
  const { onAddProduct } = route.params || {};

  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("sustainable");
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
  const handleRegisterProduct = async () => {
    // Validation
    if (!productName.trim()) {
      Alert.alert("Error", "Please enter a product name");
      return;
    }

    if (!companyName.trim()) {
      Alert.alert("Error", "Please enter a company name");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Error", "Please enter a price");
      return;
    }

    if (!stock.trim()) {
      Alert.alert("Error", "Please enter stock quantity");
      return;
    }

    try {
      const stockValue = parseInt(stock);
      if (isNaN(stockValue) || stockValue < 0) {
        Alert.alert("Error", "Please enter a valid stock quantity");
        return;
      }

      const newProduct = {
        id: Date.now(),
        title: productName.trim(),
        brand: companyName.trim(),
        price: price.startsWith("$") ? price : `$${price}`,
        stock: `${stockValue} unit${stockValue !== 1 ? 's' : ''}`,
        status: "LIVE ON STORE",
        statusColor: "#22C55E",
        category: category,
        tag: "Entrepreneur",
        description: description.trim(),
        image:
          images[0] ||
          "https://images.unsplash.com/photo-1586105251261-72a756497a11",
      };

      // Get existing products from AsyncStorage
      const existingProductsJson = await AsyncStorage.getItem("@registered_products");
      const existingProducts = existingProductsJson
        ? JSON.parse(existingProductsJson)
        : [];

      // Add new product
      const updatedProducts = [...existingProducts, newProduct];

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "@registered_products",
        JSON.stringify(updatedProducts)
      );

      // Call the callback if provided (for backward compatibility)
      if (onAddProduct) {
        onAddProduct(newProduct);
      }

      Alert.alert("Success 🎉", "Product registered successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

      // Reset form
      setCompanyName("");
      setProductName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImages([]);
      setCategory("sustainable");
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to register product. Please try again.");
    }
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
          placeholder="Enter company name"
          placeholderTextColor="#6b7280"
        />

        <Text style={styles.label}>Product Name</Text>
        <TextInput
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
          placeholder="Enter product name"
          placeholderTextColor="#6b7280"
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              style={styles.input}
              placeholder="12.99"
              placeholderTextColor="#6b7280"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Stock (units)</Text>
            <TextInput
              value={stock}
              onChangeText={setStock}
              style={styles.input}
              placeholder="100"
              placeholderTextColor="#6b7280"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              category === "sustainable" && styles.categoryBtnActive,
            ]}
            onPress={() => setCategory("sustainable")}
          >
            <Icon 
              name="eco" 
              size={16} 
              color={category === "sustainable" ? "#fff" : "#9ca3af"} 
            />
            <Text
              style={[
                styles.categoryText,
                category === "sustainable" && styles.categoryTextActive,
              ]}
            >
              Sustainable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryBtn,
              category === "recycled" && styles.categoryBtnActive,
            ]}
            onPress={() => setCategory("recycled")}
          >
            <Icon 
              name="recycling" 
              size={16} 
              color={category === "recycled" ? "#fff" : "#9ca3af"} 
            />
            <Text
              style={[
                styles.categoryText,
                category === "recycled" && styles.categoryTextActive,
              ]}
            >
              Recycled
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryBtn,
              category === "cleaners" && styles.categoryBtnActive,
            ]}
            onPress={() => setCategory("cleaners")}
          >
            <Icon 
              name="cleaning-services" 
              size={16} 
              color={category === "cleaners" ? "#fff" : "#9ca3af"} 
            />
            <Text
              style={[
                styles.categoryText,
                category === "cleaners" && styles.categoryTextActive,
              ]}
            >
              Cleaners
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Enter product description"
          placeholderTextColor="#6b7280"
        />

        <Text style={styles.label}>Product Imagery</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handleAddPhoto}>
          <Icon name="photo-camera" size={22} color="#3b82f6" />
          <Text style={styles.uploadText}>Add Photos</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: images[0] }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeImageBtn}
              onPress={() => setImages([])}
            >
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
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

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  label: { color: "#e5e7eb", marginTop: 14, marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: "#0b1220",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  categoryBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  categoryBtnActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  categoryText: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  uploadBox: {
    marginTop: 6,
    height: 120,
    borderWidth: 1,
    borderColor: "#1f2937",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#0b1220",
  },
  uploadText: { color: "#e5e7eb", marginTop: 6 },
  imagePreviewContainer: {
    position: "relative",
    marginTop: 12,
    alignSelf: "flex-start",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: {
    marginTop: 28,
    marginBottom: 20,
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});