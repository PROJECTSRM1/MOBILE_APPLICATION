import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

interface RegisterProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
}

export default function RegisterProductModal({
  visible,
  onClose,
  onSubmit,
}: RegisterProductModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("sustainable");
  const [shopAddress, setShopAddress] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const resetForm = () => {
    setCompanyName("");
    setProductName("");
    setDescription("");
    setPrice("");
    setCategory("sustainable");
    setShopAddress("");
    setSelectedImages([]);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = () => {
    setShowImageOptions(true);
  };

  const handleCameraLaunch = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to capture image');
      } else if (response.assets && response.assets[0]) {
        const uri = response.assets[0].uri;
        if (uri) {
          setSelectedImages([...selectedImages, uri]);
        }
      }
    });
  };

  const handleGalleryLaunch = () => {
    setShowImageOptions(false);

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      selectionLimit: 5,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
      } else if (response.assets) {
        const uris = response.assets
          .map(asset => asset.uri)
          .filter((uri): uri is string => uri !== undefined);
        setSelectedImages([...selectedImages, ...uris]);
      }
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleSubmit = () => {
    if (!companyName || !productName || !price || !shopAddress) {
      Alert.alert("Error", "Please fill in all required fields including shop address");
      return;
    }

    const newProduct = {
      title: productName,
      brand: companyName,
      price: price,
      category,
      tag: "Company",
      shopAddress: shopAddress,
      image: selectedImages.length > 0 
        ? selectedImages[0] 
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuCPd9jjP6RVEZByEt3c_PfY3IPce0OaeCEAlOFjX3LTW6XLM_Y1RJaGUTDXx8wOSlI1t-vry8WGH5sxkxkPoFINWvd8gWx51nrNFaMOGhxYxU8q595cTKdpwg-dYMXP1gUbo7o_1mr88PzAE4e0zv-A7N4uV3KDLmCCRr2wG4DBj4lkvZ5m2k4dQmHGpMjQ2Z536_ETGgsMM5zcm-l4c4J27dqn34e8RnlPl0yIWMFttdkEl7qRdA8OnNXcrZHCyx9ZEHS24Dc2FCc",
      images: selectedImages,
      description: description,
    };

    onSubmit(newProduct);
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#101622" />

        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register Product</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.mainTitle}>Product Registration</Text>
            <Text style={styles.subtitle}>
              Enter the details of your Swachify product below to list it on the platform.
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Company / Entrepreneur Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Swachify Corp"
                placeholderTextColor="#9da6b9"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Eco-Bin Pro"
                placeholderTextColor="#9da6b9"
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Shop Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your shop/business address with landmark"
                placeholderTextColor="#9da6b9"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={shopAddress}
                onChangeText={setShopAddress}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 1499.99"
                placeholderTextColor="#9da6b9"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryRow}>
                <CategoryButton
                  label="Sustainable"
                  value="sustainable"
                  selected={category}
                  onSelect={setCategory}
                />
                <CategoryButton
                  label="Recycled"
                  value="recycled"
                  selected={category}
                  onSelect={setCategory}
                />
                <CategoryButton
                  label="Cleaners"
                  value="cleaners"
                  selected={category}
                  onSelect={setCategory}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the key features and sustainability impact of your product..."
                placeholderTextColor="#9da6b9"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Product Imagery</Text>
              
              <TouchableOpacity 
                style={styles.uploadBox} 
                onPress={handleImagePicker}
              >
                <View style={styles.uploadIconContainer}>
                  <MaterialIcons name="add-a-photo" size={32} color="#135bec" />
                </View>
                <Text style={styles.uploadText}>Add Photos</Text>
                <Text style={styles.uploadHint}>PNG, JPG up to 10MB</Text>
              </TouchableOpacity>

              {selectedImages.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagePreviewContainer}
                >
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.imagePreviewWrapper}>
                      <Image source={{ uri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <MaterialIcons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  {selectedImages.length < 5 && (
                    <TouchableOpacity 
                      style={styles.addMoreButton}
                      onPress={handleImagePicker}
                    >
                      <MaterialIcons name="add" size={24} color="#9da6b9" />
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
            </View>

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <MaterialIcons name="app-registration" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Register Product</Text>
          </TouchableOpacity>
          <View style={styles.homeIndicator} />
        </View>
      </View>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View style={styles.imageOptionsContainer}>
            <Text style={styles.imageOptionsTitle}>Add Product Photo</Text>
            
            <TouchableOpacity
              style={styles.imageOption}
              onPress={handleCameraLaunch}
            >
              <MaterialIcons name="camera-alt" size={24} color="#135bec" />
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageOption}
              onPress={handleGalleryLaunch}
            >
              <MaterialIcons name="photo-library" size={24} color="#135bec" />
              <Text style={styles.imageOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageOption, styles.cancelOption]}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
}

const CategoryButton = ({ label, value, selected, onSelect }: any) => (
  <TouchableOpacity
    style={[styles.categoryButton, selected === value && styles.categoryButtonActive]}
    onPress={() => onSelect(value)}
  >
    <Text
      style={[
        styles.categoryButtonText,
        selected === value && styles.categoryButtonTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101622" },
  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1c212e",
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  scrollView: { flex: 1 },
  content: { padding: 16 },
  mainTitle: { color: "#fff", fontSize: 28, fontWeight: "700", marginTop: 8 },
  subtitle: { color: "#9da6b9", fontSize: 14, marginTop: 8, lineHeight: 20 },
  formSection: { marginTop: 24 },
  label: { color: "#fff", fontSize: 14, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
  input: {
    height: 56,
    backgroundColor: "rgba(28, 33, 46, 0.5)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 15,
  },
  textArea: { height: 100, paddingTop: 16 },
  hint: { color: "#6b7280", fontSize: 12, marginTop: 6, marginLeft: 4 },
  categoryRow: { flexDirection: "row", gap: 10 },
  categoryButton: {
    flex: 1,
    height: 44,
    backgroundColor: "#1c212e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  categoryButtonActive: { backgroundColor: "#135bec", borderColor: "#135bec" },
  categoryButtonText: { color: "#9da6b9", fontSize: 13, fontWeight: "600" },
  categoryButtonTextActive: { color: "#fff" },
  uploadBox: {
    height: 176,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#374151",
    borderRadius: 16,
    backgroundColor: "rgba(28, 33, 46, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadIconContainer: {
    backgroundColor: "rgba(19, 91, 236, 0.2)",
    padding: 12,
    borderRadius: 50,
    marginBottom: 12,
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadHint: {
    color: "#9da6b9",
    fontSize: 12,
    marginTop: 4,
  },
  imagePreviewContainer: {
    marginTop: 16,
  },
  imagePreviewWrapper: {
    position: "relative",
    marginRight: 12,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
  },
  addMoreButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "rgba(28, 33, 46, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: "rgba(16, 22, 34, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#1c212e",
  },
  submitButton: {
    height: 56,
    backgroundColor: "#135bec",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: "#374151",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  imageOptionsContainer: {
    backgroundColor: "#1c212e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  imageOptionsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  imageOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
  },
  imageOptionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelOption: {
    backgroundColor: "transparent",
    justifyContent: "center",
    marginTop: 8,
  },
  cancelOptionText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});