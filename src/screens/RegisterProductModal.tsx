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
import { useTheme } from "../context/ThemeContext";

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
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  // Form States
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("sustainable");
  const [shopAddress, setShopAddress] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  // UI States
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [productsAdded, setProductsAdded] = useState(0);

  // --- FORM CLEANUP ---
  const resetFormAfterAddAnother = () => {
    setProductName("");
    setDescription("");
    setPrice("");
    setCategory("sustainable");
    setSelectedImages([]);
    // We keep Company Name and Shop Address because they usually stay the same for one seller
  };

  const resetAllFields = () => {
    setCompanyName("");
    setProductName("");
    setDescription("");
    setPrice("");
    setCategory("sustainable");
    setShopAddress("");
    setSelectedImages([]);
    setProductsAdded(0);
  };

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    if (!companyName.trim()) {
      Alert.alert("Validation Error", "Please enter Company or Entrepreneur name.");
      return false;
    }
    if (!productName.trim()) {
      Alert.alert("Validation Error", "Please enter the Product name.");
      return false;
    }
    if (!shopAddress.trim()) {
      Alert.alert("Validation Error", "Please enter the Shop address.");
      return false;
    }
    const priceNum = parseFloat(price);
    if (!price.trim() || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Validation Error", "Please enter a valid positive price amount.");
      return false;
    }
    if (selectedImages.length === 0) {
      Alert.alert("Validation Error", "Please add at least one product image.");
      return false;
    }
    if (!description.trim() || description.length < 10) {
        Alert.alert("Validation Error", "Description must be at least 10 characters long.");
        return false;
    }
    return true;
  };

  // --- UPDATED CAMERA & PERMISSION HANDLING ---
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Swachify needs access to your camera to take product photos.',
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

  const handleCameraLaunch = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera permission is required to take photos.");
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      cameraType: 'back' as const,
      saveToPhotos: false, // Prevents Android "Write Storage" permission issues
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage || 'Failed to open camera');
      } else if (response.assets && response.assets[0]?.uri) {
        setSelectedImages(prev => [...prev, response.assets![0].uri!]);
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
      if (response.assets) {
        const uris = response.assets
          .map(asset => asset.uri)
          .filter((uri): uri is string => uri !== undefined);
        setSelectedImages(prev => [...prev, ...uris]);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const createProductObject = () => {
    return {
      title: productName,
      brand: companyName,
      price: price,
      category,
      tag: "Company",
      shopAddress: shopAddress,
      image: selectedImages[0], 
      images: selectedImages,
      description: description,
    };
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newProduct = createProductObject();
    onSubmit(newProduct);
    resetAllFields();
    onClose();
  };

  const handleSaveAndAddAnother = () => {
    if (!validateForm()) return;

    const newProduct = createProductObject();
    onSubmit(newProduct);
    
    setProductsAdded(prev => prev + 1);
    Alert.alert("Success", `Product added! You can now add another item or click Complete.`);
    resetFormAfterAddAnother();
  };

  const handleClose = () => {
    if (productName.trim() || price.trim() || selectedImages.length > 0) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved information. Are you sure you want to exit?",
        [
          { text: "Stay", style: "cancel" },
          { 
            text: "Exit", 
            style: "destructive",
            onPress: () => {
              resetAllFields();
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#101622" />

        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register Product</Text>
            {productsAdded > 0 ? (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{productsAdded}</Text>
              </View>
            ) : <View style={{ width: 40 }} />}
          </View>
        </SafeAreaView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.mainTitle}>Product Details</Text>
            <Text style={styles.subtitle}>
              List your sustainable products on Swachify Market. All fields with * are required.
            </Text>

            {productsAdded > 0 && (
              <View style={styles.successBanner}>
                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.successText}>
                  {productsAdded} product(s) added so far.
                </Text>
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={styles.label}>Company / Entrepreneur Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. EcoLife Solutions"
                placeholderTextColor="#9da6b9"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bamboo Toothbrush"
                placeholderTextColor="#9da6b9"
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Shop Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Full address of the shop/business"
                placeholderTextColor="#9da6b9"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={shopAddress}
                onChangeText={setShopAddress}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Price (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#9da6b9"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryRow}>
                  <CategoryButton label="Sustainable" value="sustainable" selected={category} onSelect={setCategory} styles={styles} />
                  <CategoryButton label="Recycled" value="recycled" selected={category} onSelect={setCategory} styles={styles} />
                  <CategoryButton label="Cleaners" value="cleaners" selected={category} onSelect={setCategory} styles={styles} />
                </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Description * (min 10 chars)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What makes this product special?"
                placeholderTextColor="#9da6b9"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Product Imagery (At least 1) *</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={() => setShowImageOptions(true)}>
                <View style={styles.uploadIconContainer}>
                  <MaterialIcons name="add-a-photo" size={32} color={colors.primary} />
                </View>
                <Text style={styles.uploadText}>Add Product Photos</Text>
                <Text style={styles.uploadHint}>Captured: {selectedImages.length} / 5</Text>
              </TouchableOpacity>

              {selectedImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.imagePreviewWrapper}>
                      <Image source={{ uri }} style={styles.imagePreview} />
                      <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                        <MaterialIcons name="close" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={{ height: 140 }} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveAndAddButton} onPress={handleSaveAndAddAnother}>
            <MaterialIcons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.saveAndAddButtonText}>Save & Add Another</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <MaterialIcons name="check" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {productsAdded > 0 ? 'Complete Registration' : 'Register Product'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* IMAGE OPTIONS MODAL */}
      <Modal visible={showImageOptions} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowImageOptions(false)}>
          <View style={styles.imageOptionsContainer}>
            <Text style={styles.imageOptionsTitle}>Product Photo Source</Text>
            <TouchableOpacity style={styles.imageOption} onPress={handleCameraLaunch}>
              <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
              <Text style={styles.imageOptionText}>Take New Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageOption} onPress={handleGalleryLaunch}>
              <MaterialIcons name="photo-library" size={24} color={colors.primary} />
              <Text style={styles.imageOptionText}>Pick from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.imageOption, styles.cancelOption]} onPress={() => setShowImageOptions(false)}>
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
}

const CategoryButton = ({ label, value, selected, onSelect, styles }: any) => (
  <TouchableOpacity
    style={[styles.categoryButton, selected === value && styles.categoryButtonActive]}
    onPress={() => onSelect(value)}
  >
    <Text style={[styles.categoryButtonText, selected === value && styles.categoryButtonTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { height: 56, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
    headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
    counterBadge: { backgroundColor: "#10b981", borderRadius: 12, minWidth: 24, height: 24, justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
    counterText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    scrollView: { flex: 1 },
    content: { padding: 16 },
    mainTitle: { color: colors.text, fontSize: 24, fontWeight: "700", marginTop: 8 },
    subtitle: { color: colors.subText, fontSize: 14, marginTop: 4, lineHeight: 20 },
    successBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(16, 185, 129, 0.1)", borderWidth: 1, borderColor: "#10b981", borderRadius: 12, padding: 12, marginTop: 16 },
    successText: { color: "#10b981", fontSize: 14, fontWeight: "600", flex: 1 },
    formSection: { marginTop: 24 },
    label: { color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
    input: { height: 52, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, color: colors.text, fontSize: 15 },
    textArea: { height: 90, paddingTop: 12 },
    categoryRow: { flexDirection: "row", gap: 10 },
    categoryButton: { flex: 1, height: 40, backgroundColor: colors.card, borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.border },
    categoryButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    categoryButtonText: { color: colors.subText, fontSize: 12, fontWeight: "600" },
    categoryButtonTextActive: { color: "#fff" },
    uploadBox: { height: 130, borderWidth: 2, borderStyle: "dashed", borderColor: colors.border, borderRadius: 16, backgroundColor: colors.card, justifyContent: "center", alignItems: "center" },
    uploadIconContainer: { backgroundColor: "rgba(19, 91, 236, 0.1)", padding: 12, borderRadius: 50, marginBottom: 8 },
    uploadText: { color: colors.text, fontSize: 16, fontWeight: "600" },
    uploadHint: { color: colors.subText, fontSize: 12, marginTop: 4 },
    imagePreviewContainer: { marginTop: 16 },
    imagePreviewWrapper: { position: "relative", marginRight: 12 },
    imagePreview: { width: 85, height: 85, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
    removeImageButton: { position: "absolute", top: -5, right: -5, backgroundColor: "#ef4444", borderRadius: 12, padding: 2 },
    footer: { padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    saveAndAddButton: { height: 50, backgroundColor: "rgba(19, 91, 236, 0.05)", borderRadius: 12, borderWidth: 1, borderColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 },
    saveAndAddButtonText: { color: colors.primary, fontSize: 15, fontWeight: "700" },
    submitButton: { height: 50, backgroundColor: colors.primary, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    submitButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)", justifyContent: "flex-end" },
    imageOptionsContainer: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
    imageOptionsTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 20, textAlign: "center" },
    imageOption: { flexDirection: "row", alignItems: "center", gap: 16, padding: 16, backgroundColor: colors.card, borderRadius: 12, marginBottom: 12 },
    imageOptionText: { color: colors.text, fontSize: 16, fontWeight: "600" },
    cancelOption: { backgroundColor: "transparent", justifyContent: "center" },
    cancelOptionText: { color: "#ef4444", fontSize: 16, fontWeight: "600" },
  });