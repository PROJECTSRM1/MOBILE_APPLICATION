import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://swachify-india-be-1-mcrb.onrender.com";

interface FormData {
  institutionName: string;
  institutionType: string;
  identityType: string;
  registrationNumber: string;
  physicalAddress: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  website: string;
  idProof: { name: string; uri: string; type: string } | null;
  addressProof: { name: string; uri: string; type: string } | null;
}

interface DropdownOption {
  label: string;
  value: string;
}

const INSTITUTION_TYPES: DropdownOption[] = [
  { label: "School (K-12)", value: "1" },
  { label: "College", value: "2" },
  { label: "University", value: "3" },
  { label: "Vocational Training", value: "4" },
];

const IDENTITY_TYPES: DropdownOption[] = [
  { label: "Aadhar Card", value: "1" },
  { label: "PAN Card", value: "2" },
  { label: "Registration Certificate", value: "3" },
];

const STORAGE_KEY = "@institution_registration_step1";

const InstitutionRegistrationStep1 = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState<FormData>({
    institutionName: "",
    institutionType: "",
    identityType: "",
    registrationNumber: "",
    physicalAddress: "",
    contactPerson: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",
    idProof: null,
    addressProof: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);
  const [showIdentityDropdown, setShowIdentityDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data whenever formData changes
  useEffect(() => {
    saveData();
  }, [formData]);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const clearSavedData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing saved data:", error);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = "Institution name is required";
    }

    if (!formData.institutionType) {
      newErrors.institutionType = "Please select institution type";
    }

    if (!formData.identityType) {
      newErrors.identityType = "Please select identity type";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    if (!formData.physicalAddress.trim()) {
      newErrors.physicalAddress = "Physical address is required";
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!validateEmail(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    if (formData.website && !validateURL(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    if (!formData.idProof) {
      newErrors.idProof = "ID proof document is required";
    }

    if (!formData.addressProof) {
      newErrors.addressProof = "Address proof document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickDocumentFromGallery = async (type: "idProof" | "addressProof") => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false,
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert(
            "Error",
            response.errorMessage || "Failed to pick image"
          );
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setFormData((prev) => ({
            ...prev,
            [type]: {
              name: asset.fileName || `${type}_${Date.now()}.jpg`,
              uri: asset.uri || "",
              type: asset.type || "image/jpeg",
            },
          }));
          setErrors((prev) => ({ ...prev, [type]: "" }));
        }
      }
    );
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Navigate to step 2 with form data
      navigation.navigate("InstitutionRegistrationStep2", { 
        step1Data: formData 
      });
    } else {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields correctly"
      );
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const selectInstitutionType = (value: string) => {
    updateField("institutionType", value);
    setShowInstitutionDropdown(false);
  };

  const selectIdentityType = (value: string) => {
    updateField("identityType", value);
    setShowIdentityDropdown(false);
  };

  const getInstitutionTypeLabel = () => {
    const option = INSTITUTION_TYPES.find(
      (opt) => opt.value === formData.institutionType
    );
    return option ? option.label : "Select Type";
  };

  const getIdentityTypeLabel = () => {
    const option = IDENTITY_TYPES.find(
      (opt) => opt.value === formData.identityType
    );
    return option ? option.label : "Select Identity Type";
  };

  const renderDropdown = (
    visible: boolean,
    onClose: () => void,
    options: DropdownOption[],
    onSelect: (value: string) => void,
    title: string
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => onSelect(item.value)}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[
          colors.gradientStart ?? colors.background,
          colors.gradientEnd ?? colors.surface,
        ]}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back-ios" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Institution Registration</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* PROGRESS */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.stepLabel}>STEP 1 OF 2</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: "50%" }]} />
              </View>
            </View>
            <Text style={styles.pageTitle}>Institution Profile & KYC</Text>
            <Text style={styles.pageSubtitle}>
              Provide foundational details and verify your identity.
            </Text>
          </View>

          {/* GENERAL INFORMATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GENERAL INFORMATION</Text>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Institution Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.institutionName && styles.inputError,
                  ]}
                  placeholder="Enter full institution name"
                  placeholderTextColor={colors.subText}
                  value={formData.institutionName}
                  onChangeText={(text) => updateField("institutionName", text)}
                />
                {errors.institutionName && (
                  <Text style={styles.errorText}>{errors.institutionName}</Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Institution Type</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    errors.institutionType && styles.inputError,
                  ]}
                  onPress={() => setShowInstitutionDropdown(true)}
                >
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      !formData.institutionType && styles.placeholderText,
                    ]}
                  >
                    {getInstitutionTypeLabel()}
                  </Text>
                  <Icon name="arrow-drop-down" size={24} color={colors.subText} />
                </TouchableOpacity>
                {errors.institutionType && (
                  <Text style={styles.errorText}>{errors.institutionType}</Text>
                )}
              </View>
            </View>
          </View>

          {/* KYC VERIFICATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KYC VERIFICATION</Text>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Identity Type</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    errors.identityType && styles.inputError,
                  ]}
                  onPress={() => setShowIdentityDropdown(true)}
                >
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      !formData.identityType && styles.placeholderText,
                    ]}
                  >
                    {getIdentityTypeLabel()}
                  </Text>
                  <Icon name="arrow-drop-down" size={24} color={colors.subText} />
                </TouchableOpacity>
                {errors.identityType && (
                  <Text style={styles.errorText}>{errors.identityType}</Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Registration Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.registrationNumber && styles.inputError,
                  ]}
                  placeholder="Enter number as per document"
                  placeholderTextColor={colors.subText}
                  value={formData.registrationNumber}
                  onChangeText={(text) =>
                    updateField("registrationNumber", text)
                  }
                />
                {errors.registrationNumber && (
                  <Text style={styles.errorText}>
                    {errors.registrationNumber}
                  </Text>
                )}
              </View>

              <View style={styles.divider} />

              {/* UPLOAD BUTTONS */}
              <View style={styles.uploadSection}>
                <TouchableOpacity
                  style={[
                    styles.uploadButton,
                    formData.idProof && styles.uploadButtonSuccess,
                    errors.idProof && styles.uploadButtonError,
                  ]}
                  onPress={() => pickDocumentFromGallery("idProof")}
                >
                  <View style={styles.uploadContent}>
                    <Icon
                      name="upload-file"
                      size={24}
                      color={formData.idProof ? colors.success : colors.primary}
                    />
                    <Text
                      style={[
                        styles.uploadText,
                        formData.idProof && { color: colors.success },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {formData.idProof
                        ? formData.idProof.name
                        : "Upload ID Proof"}
                    </Text>
                  </View>
                  <Icon
                    name={formData.idProof ? "check-circle" : "add"}
                    size={20}
                    color={formData.idProof ? colors.success : colors.primary}
                  />
                </TouchableOpacity>
                {errors.idProof && (
                  <Text style={styles.errorText}>{errors.idProof}</Text>
                )}

                <TouchableOpacity
                  style={[
                    styles.uploadButton,
                    formData.addressProof && styles.uploadButtonSuccess,
                    errors.addressProof && styles.uploadButtonError,
                  ]}
                  onPress={() => pickDocumentFromGallery("addressProof")}
                >
                  <View style={styles.uploadContent}>
                    <Icon
                      name="upload-file"
                      size={24}
                      color={
                        formData.addressProof ? colors.success : colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.uploadText,
                        formData.addressProof && { color: colors.success },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {formData.addressProof
                        ? formData.addressProof.name
                        : "Upload Address Proof"}
                    </Text>
                  </View>
                  <Icon
                    name={formData.addressProof ? "check-circle" : "add"}
                    size={20}
                    color={
                      formData.addressProof ? colors.success : colors.primary
                    }
                  />
                </TouchableOpacity>
                {errors.addressProof && (
                  <Text style={styles.errorText}>{errors.addressProof}</Text>
                )}
              </View>
            </View>
          </View>

          {/* LOCATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCATION</Text>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Physical Address</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    errors.physicalAddress && styles.inputError,
                  ]}
                  placeholder="Street, Building, City, State, Zip Code"
                  placeholderTextColor={colors.subText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.physicalAddress}
                  onChangeText={(text) => updateField("physicalAddress", text)}
                />
                {errors.physicalAddress && (
                  <Text style={styles.errorText}>{errors.physicalAddress}</Text>
                )}
              </View>
            </View>
          </View>

          {/* CONTACT DETAILS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTACT DETAILS</Text>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contact Person</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.contactPerson && styles.inputError,
                  ]}
                  placeholder="Full name of representative"
                  placeholderTextColor={colors.subText}
                  value={formData.contactPerson}
                  onChangeText={(text) => updateField("contactPerson", text)}
                />
                {errors.contactPerson && (
                  <Text style={styles.errorText}>{errors.contactPerson}</Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.phoneNumber && styles.inputError,
                  ]}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor={colors.subText}
                  keyboardType="phone-pad"
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateField("phoneNumber", text)}
                />
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.emailAddress && styles.inputError,
                  ]}
                  placeholder="admin@institution.edu"
                  placeholderTextColor={colors.subText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.emailAddress}
                  onChangeText={(text) => updateField("emailAddress", text)}
                />
                {errors.emailAddress && (
                  <Text style={styles.errorText}>{errors.emailAddress}</Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Website (Optional)</Text>
                <TextInput
                  style={[styles.input, errors.website && styles.inputError]}
                  placeholder="https://www.institution.edu"
                  placeholderTextColor={colors.subText}
                  keyboardType="url"
                  autoCapitalize="none"
                  value={formData.website}
                  onChangeText={(text) => updateField("website", text)}
                />
                {errors.website && (
                  <Text style={styles.errorText}>{errors.website}</Text>
                )}
              </View>
            </View>
          </View>

          {/* TERMS */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By clicking continue, you agree to our Terms of Service and
              Privacy Policy.
            </Text>
          </View>
        </ScrollView>

        {/* CONTINUE BUTTON */}
        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Verify & Continue</Text>
                <Icon name="chevron-right" size={24} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* DROPDOWNS */}
        {renderDropdown(
          showInstitutionDropdown,
          () => setShowInstitutionDropdown(false),
          INSTITUTION_TYPES,
          selectInstitutionType,
          "Select Institution Type"
        )}

        {renderDropdown(
          showIdentityDropdown,
          () => setShowIdentityDropdown(false),
          IDENTITY_TYPES,
          selectIdentityType,
          "Select Identity Type"
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default InstitutionRegistrationStep1;

const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    progressSection: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 16,
    },
    progressHeader: {
      marginBottom: 16,
    },
    stepLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1,
      marginBottom: 8,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    pageSubtitle: {
      fontSize: 14,
      color: colors.subText,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    inputContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      fontSize: 16,
      color: colors.text,
      paddingVertical: 8,
      paddingHorizontal: 0,
    },
    inputError: {
      borderColor: colors.danger || "#ef4444",
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    textArea: {
      fontSize: 16,
      color: colors.text,
      minHeight: 80,
      paddingVertical: 8,
      paddingHorizontal: 0,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 0,
    },
    dropdownButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    placeholderText: {
      color: colors.subText,
    },
    uploadSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    uploadButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary,
      borderRadius: 8,
    },
    uploadButtonSuccess: {
      borderColor: colors.success || "#22c55e",
      backgroundColor: (colors.success || "#22c55e") + "10",
    },
    uploadButtonError: {
      borderColor: colors.danger || "#ef4444",
    },
    uploadContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
      marginRight: 8,
    },
    uploadText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      flex: 1,
    },
    errorText: {
      fontSize: 12,
      color: colors.danger || "#ef4444",
      marginTop: 4,
    },
    termsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    termsText: {
      fontSize: 11,
      color: colors.subText,
      textAlign: "center",
    },
    bottomButton: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 24,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    continueButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      gap: 8,
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#ffffff",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    dropdownContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      width: "100%",
      maxHeight: 400,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    dropdownHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    dropdownItem: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemText: {
      fontSize: 16,
      color: colors.text,
    },
  });