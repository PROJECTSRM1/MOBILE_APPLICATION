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
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("sustainable");
  const [shopAddress, setShopAddress] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [productsAdded, setProductsAdded] = useState(0);

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setPrice("");
    setCategory("sustainable");
    setSelectedImages([]);
    // Note: We don't reset companyName and shopAddress as they're likely same for multiple products
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

  const createProductObject = () => {
    return {
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
  };

  const handleSubmit = () => {
    if (!companyName || !productName || !price || !shopAddress) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newProduct = createProductObject();
    onSubmit(newProduct);
    resetAllFields();
  };

  const handleSaveAndAddAnother = () => {
    if (!companyName || !productName || !price || !shopAddress) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newProduct = createProductObject();
    onSubmit(newProduct);
    
    const currentCount = productsAdded + 1;
    setProductsAdded(currentCount);
    
    // Show success message
    Alert.alert(
      "Success", 
      `Product ${currentCount} added! Add another product or click "Done" to finish.`,
      [{ text: "OK" }]
    );
    
    resetForm();
  };

  const handleClose = () => {
    if (productsAdded > 0 || companyName || productName || price) {
      Alert.alert(
        "Confirm Exit",
        productsAdded > 0 
          ? `You have added ${productsAdded} product(s). Any unsaved changes will be lost. Exit anyway?`
          : "You have unsaved changes. Exit anyway?",
        [
          { text: "Cancel", style: "cancel" },
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
      resetAllFields();
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
              <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register Product</Text>
            {productsAdded > 0 && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{productsAdded}</Text>
              </View>
            )}
            {productsAdded === 0 && <View style={{ width: 40 }} />}
          </View>
        </SafeAreaView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.mainTitle}>Product Registration</Text>
            <Text style={styles.subtitle}>
              Enter the details of your Swachify product below to list it on the platform.
            </Text>

            {productsAdded > 0 && (
              <View style={styles.successBanner}>
                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.successText}>
                  {productsAdded} product{productsAdded > 1 ? 's' : ''} added successfully!
                </Text>
              </View>
            )}

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
                    styles={styles}
                  />
                  <CategoryButton
                    label="Recycled"
                    value="recycled"
                    selected={category}
                    onSelect={setCategory}
                    styles={styles}
                  />
                  <CategoryButton
                    label="Cleaners"
                    value="cleaners"
                    selected={category}
                    onSelect={setCategory}
                    styles={styles}
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

            <View style={{ height: 140 }} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.saveAndAddButton} 
            onPress={handleSaveAndAddAnother}
          >
            <MaterialIcons name="add-circle-outline" size={20} color="#135bec" />
            <Text style={styles.saveAndAddButtonText}>Save & Add Another</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <MaterialIcons name="check" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {productsAdded > 0 ? 'Done' : 'Register Product'}
            </Text>
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

const CategoryButton = ({ label, value, selected, onSelect, styles }: any) => (
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

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: colors.background 
    },
    
    header: {
      height: 56,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    
    backButton: { 
      width: 40, 
      height: 40, 
      justifyContent: "center", 
      alignItems: "center" 
    },
    
    headerTitle: { 
      color: colors.text, 
      fontSize: 18, 
      fontWeight: "700" 
    },
    
    counterBadge: {
      backgroundColor: colors.success ?? "#10b981",
      borderRadius: 12,
      minWidth: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 8,
    },
    
    counterText: {
      color: colors.onPrimary ?? "#fff",
      fontSize: 12,
      fontWeight: "700",
    },
    
    scrollView: { 
      flex: 1 
    },
    
    content: { 
      padding: 16 
    },
    
    mainTitle: { 
      color: colors.text, 
      fontSize: 28, 
      fontWeight: "700", 
      marginTop: 8 
    },
    
    subtitle: { 
      color: colors.subText, 
      fontSize: 14, 
      marginTop: 8, 
      lineHeight: 20 
    },
    
    successBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.successBg ?? "rgba(16, 185, 129, 0.1)",
      borderWidth: 1,
      borderColor: colors.success ?? "#10b981",
      borderRadius: 12,
      padding: 12,
      marginTop: 16,
    },
    
    successText: {
      color: colors.success ?? "#10b981",
      fontSize: 14,
      fontWeight: "600",
      flex: 1,
    },
    
    formSection: { 
      marginTop: 24 
    },
    
    label: { 
      color: colors.text, 
      fontSize: 14, 
      fontWeight: "600", 
      marginBottom: 8, 
      marginLeft: 4 
    },
    
    input: {
      height: 56,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      color: colors.text,
      fontSize: 15,
    },
    
    textArea: { 
      height: 100, 
      paddingTop: 16 
    },
    
    hint: { 
      color: colors.subText, 
      fontSize: 12, 
      marginTop: 6, 
      marginLeft: 4 
    },
    
    categoryRow: { 
      flexDirection: "row", 
      gap: 10 
    },
    
    categoryButton: {
      flex: 1,
      height: 44,
      backgroundColor: colors.card,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    
    categoryButtonActive: { 
      backgroundColor: colors.primary, 
      borderColor: colors.primary 
    },
    
    categoryButtonText: { 
      color: colors.subText, 
      fontSize: 13, 
      fontWeight: "600" 
    },
    
    categoryButtonTextActive: { 
      color: colors.onPrimary ?? "#fff" 
    },
    
    uploadBox: {
      height: 176,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      borderRadius: 16,
      backgroundColor: colors.cardSecondary ?? "rgba(28, 33, 46, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    
    uploadIconContainer: {
      backgroundColor: colors.primaryBg ?? "rgba(19, 91, 236, 0.2)",
      padding: 12,
      borderRadius: 50,
      marginBottom: 12,
    },
    
    uploadText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    
    uploadHint: {
      color: colors.subText,
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
      borderColor: colors.border,
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
      borderColor: colors.border,
      backgroundColor: colors.cardSecondary ?? "rgba(28, 33, 46, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    
    footer: {
      padding: 16,
      backgroundColor: colors.background + "F2",
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    
    saveAndAddButton: {
      height: 56,
      backgroundColor: colors.primaryBg ?? "rgba(19, 91, 236, 0.1)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 12,
    },
    
    saveAndAddButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "700",
    },
    
    submitButton: {
      height: 56,
      backgroundColor: colors.primary,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    
    submitButtonText: { 
      color: colors.onPrimary ?? "#fff", 
      fontSize: 16, 
      fontWeight: "700" 
    },
    
    homeIndicator: {
      width: 128,
      height: 4,
      backgroundColor: colors.border,
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
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 40,
    },
    
    imageOptionsTitle: {
      color: colors.text,
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
      backgroundColor: colors.cardSecondary ?? "rgba(255, 255, 255, 0.05)",
      borderRadius: 12,
      marginBottom: 12,
    },
    
    imageOptionText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    
    cancelOption: {
      backgroundColor: "transparent",
      justifyContent: "center",
      marginTop: 8,
    },
    
    cancelOptionText: {
      color: colors.danger ?? "#ff4444",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });