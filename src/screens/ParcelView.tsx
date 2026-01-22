import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Home,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Utensils,
  Cpu,
  Shirt,
  Pill,
  Box,
  CreditCard,
  ChevronRight,
  Truck,
  CheckCheck,
  Package,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

/** 
 * TYPES 
 */
enum Step {
  DETAILS = 0,
  PACKAGE = 1,
  PAYMENT = 2,
}

interface ParcelFormData {
  pickupAddress: string;
  dropoffAddress: string;
  receiverName: string;
  receiverPhone: string;
  packageTypes: string[];
  otherDescription: string;
}

interface PackageCategory {
  id: string;
  label: string;
  icon: string;
}

/** 
 * CONSTANTS 
 */
const STEPS = [
  { label: 'Details', icon: 'MapPin' },
  { label: 'Package', icon: 'Box' },
  { label: 'Payment', icon: 'CreditCard' },
];

const CATEGORIES: PackageCategory[] = [
  { id: 'documents', label: 'Documents', icon: 'FileText' },
  { id: 'food', label: 'Food', icon: 'Utensils' },
  { id: 'electronics', label: 'Electronics', icon: 'Cpu' },
  { id: 'clothing', label: 'Clothing', icon: 'Shirt' },
  { id: 'medicine', label: 'Medicine', icon: 'Pill' },
  { id: 'other', label: 'Other', icon: 'Box' },
];

const getIcon = (name: string, size: number, color: string) => {
  const icons: { [key: string]: any } = {
    MapPin,
    Box,
    CreditCard,
    FileText,
    Utensils,
    Cpu,
    Shirt,
    Pill,
    Home,
    User,
    Phone,
    Truck,
  };
  const Icon = icons[name];
  return Icon ? <Icon size={size} color={color} /> : null;
};

/** 
 * MAIN COMPONENT 
 */
const ParcelView: React.FC = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [step, setStep] = useState<Step>(Step.DETAILS);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<ParcelFormData>({
    pickupAddress: 'Sector 44, Gurgaon, HR - 122003',
    dropoffAddress: '',
    receiverName: '',
    receiverPhone: '',
    packageTypes: [],
    otherDescription: '',
  });

  // Validation Logic
  const isStepValid = useMemo(() => {
    if (step === Step.DETAILS) {
      return (
        formData.pickupAddress.trim().length > 5 &&
        formData.dropoffAddress.trim().length > 5 &&
        formData.receiverName.trim().length > 2 &&
        formData.receiverPhone.trim().length >= 10
      );
    }
    if (step === Step.PACKAGE) {
      const hasSelection = formData.packageTypes.length > 0;
      if (formData.packageTypes.includes('other')) {
        return hasSelection && formData.otherDescription.trim().length > 2;
      }
      return hasSelection;
    }
    return true;
  }, [step, formData]);

  const handleNext = useCallback(() => {
    if (step < Step.PAYMENT) {
      setStep((prev) => prev + 1);
    } else {
      setShowSuccessModal(true);
    }
  }, [step]);

  const handleResetToLanding = useCallback(() => {
    setShowSuccessModal(false);
    setStep(Step.DETAILS);
    setFormData({
      pickupAddress: 'Sector 44, Gurgaon, HR - 122003',
      dropoffAddress: '',
      receiverName: '',
      receiverPhone: '',
      packageTypes: [],
      otherDescription: '',
    });
  }, []);

  const handleBack = useCallback(() => {
    if (step > Step.DETAILS) {
      setStep((prev) => prev - 1);
    }
  }, [step]);

  const toggleCategory = useCallback((id: string) => {
    setFormData((prev) => {
      const isSelected = prev.packageTypes.includes(id);
      return {
        ...prev,
        packageTypes: isSelected
          ? prev.packageTypes.filter((t) => t !== id)
          : [...prev.packageTypes, id],
      };
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={handleBack}
            disabled={step === Step.DETAILS}
            style={[
              styles.backButton,
              step === Step.DETAILS && styles.backButtonHidden,
            ]}
            activeOpacity={0.7}>
            <ArrowLeft size={20} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SwiftParcel</Text>
        </View>
        <View style={styles.liveBadge}>
          <Truck size={16} color="#818cf8" />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Progress Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  step >= i ? styles.stepCircleActive : styles.stepCircleInactive,
                ]}>
                {step > i ? (
                  <CheckCircle2 size={22} color="#ffffff" />
                ) : (
                  getIcon(s.icon, 18, step >= i ? '#ffffff' : '#475569')
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step >= i ? styles.stepLabelActive : styles.stepLabelInactive,
                ]}>
                {s.label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: step > i ? '100%' : '0%' },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {step === Step.DETAILS && (
          <View style={styles.section}>
            {/* Pickup */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Home size={14} color="#6366f1" />
                <Text style={styles.label}>PICKUP LOCATION</Text>
              </View>
              <View style={styles.inputContainerReadOnly}>
                <View style={styles.iconBox}>
                  <MapPin size={20} color="#818cf8" />
                </View>
                <Text style={styles.inputTextReadOnly}>
                  {formData.pickupAddress}
                </Text>
              </View>
            </View>

            {/* Dropoff */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MapPin size={14} color="#f43f5e" />
                <Text style={styles.label}>DROP-OFF ADDRESS</Text>
              </View>
              <View style={styles.inputContainer}>
                <View style={[styles.iconBox, styles.iconBoxRose]}>
                  <MapPin size={20} color="#fb7185" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter destination address..."
                  placeholderTextColor="#334155"
                  value={formData.dropoffAddress}
                  onChangeText={(text) =>
                    setFormData({ ...formData, dropoffAddress: text })
                  }
                />
              </View>
            </View>

            {/* Recipient */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <User size={14} color="#10b981" />
                <Text style={styles.label}>RECIPIENT DETAILS</Text>
              </View>
              <View style={styles.inputContainer}>
                <View style={[styles.iconBox, styles.iconBoxEmerald]}>
                  <User size={20} color="#34d399" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Receiver's Full Name"
                  placeholderTextColor="#334155"
                  value={formData.receiverName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, receiverName: text })
                  }
                />
              </View>
              <View style={[styles.inputContainer, styles.inputContainerMargin]}>
                <View style={[styles.iconBox, styles.iconBoxBlue]}>
                  <Phone size={20} color="#60a5fa" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit Mobile Number"
                  placeholderTextColor="#334155"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.receiverPhone}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      receiverPhone: text.replace(/\D/g, ''),
                    })
                  }
                />
              </View>
            </View>
          </View>
        )}

        {step === Step.PACKAGE && (
          <View style={styles.section}>
            <View style={styles.packageHeader}>
              <View>
                <Text style={styles.packageTitle}>Choose Items</Text>
                <Text style={styles.packageSubtitle}>
                  Multi-select is enabled
                </Text>
              </View>
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedText}>
                  {formData.packageTypes.length} Selected
                </Text>
              </View>
            </View>

            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => toggleCategory(cat.id)}
                  style={[
                    styles.categoryCard,
                    formData.packageTypes.includes(cat.id) &&
                      styles.categoryCardActive,
                  ]}
                  activeOpacity={0.8}>
                  <View style={styles.categoryIcon}>
                    {getIcon(
                      cat.icon,
                      24,
                      formData.packageTypes.includes(cat.id)
                        ? '#ffffff'
                        : '#64748b'
                    )}
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      formData.packageTypes.includes(cat.id) &&
                        styles.categoryLabelActive,
                    ]}>
                    {cat.label.toUpperCase()}
                  </Text>
                  {formData.packageTypes.includes(cat.id) && (
                    <View style={styles.checkmark}>
                      <CheckCircle2 size={16} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {formData.packageTypes.includes('other') && (
              <View style={styles.descriptionBox}>
                <View style={styles.descriptionLabel}>
                  <Text style={styles.descriptionLabelText}>
                    ITEM DESCRIPTION
                  </Text>
                  <View style={styles.mandatoryBadge}>
                    <Text style={styles.mandatoryText}>Mandatory</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.textarea}
                  placeholder="Tell us what you're sending specifically..."
                  placeholderTextColor="#334155"
                  multiline
                  numberOfLines={3}
                  value={formData.otherDescription}
                  onChangeText={(text) =>
                    setFormData({ ...formData, otherDescription: text })
                  }
                />
                {!formData.otherDescription.trim() && (
                  <View style={styles.errorBox}>
                    <AlertCircle size={12} color="#f43f5e" />
                    <Text style={styles.errorText}>
                      Please describe the item to continue
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {step === Step.PAYMENT && (
          <View style={styles.section}>
            <View style={styles.invoice}>
              <View style={styles.invoiceHeader}>
                <View>
                  <Text style={styles.invoiceTitle}>Invoice</Text>
                  <Text style={styles.invoiceNumber}>
                    ORDER #SP-{Math.floor(Math.random() * 9000) + 1000}
                  </Text>
                </View>
                <View style={styles.invoiceIcon}>
                  <CreditCard size={24} color="#ffffff" />
                </View>
              </View>

              <View style={styles.invoiceDetails}>
                <View style={styles.invoiceRow}>
                  <View style={styles.invoiceRowLeft}>
                    <View style={styles.dot} />
                    <Text style={styles.invoiceLabel}>Base Delivery Fee</Text>
                  </View>
                  <Text style={styles.invoiceValue}>₹45.00</Text>
                </View>

                <View style={styles.invoiceRow}>
                  <View style={styles.invoiceRowLeft}>
                    <View style={styles.dot} />
                    <View>
                      <Text style={styles.invoiceLabel}>
                        Distance Surcharge
                      </Text>
                      <Text style={styles.invoiceSubtext}>
                        12.4 KM @ ₹5/KM
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.invoiceValue}>₹62.00</Text>
                </View>

                <View style={styles.invoiceRow}>
                  <View style={styles.invoiceRowLeft}>
                    <View style={styles.dot} />
                    <Text style={styles.invoiceLabel}>Insurance Coverage</Text>
                  </View>
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeText}>FREE</Text>
                  </View>
                </View>

                <View style={styles.invoiceTotal}>
                  <View>
                    <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                    <View style={styles.totalAmount}>
                      <Text style={styles.currencySymbol}>₹</Text>
                      <Text style={styles.totalValue}>107</Text>
                    </View>
                  </View>
                  <View style={styles.paymentMethods}>
                    <Text style={styles.termsText}>Terms Applied</Text>
                    <View style={styles.cardIcons}>
                      <View style={styles.cardIconBlue} />
                      <View style={styles.cardIconOrange} />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryIcon}>
                <Truck size={24} color="#ffffff" />
              </View>
              <View style={styles.deliveryText}>
                <Text style={styles.deliveryTitle}>Express Delivery</Text>
                <Text style={styles.deliveryDescription}>
                  Your courier is ready! Pickup scheduled within{' '}
                  <Text style={styles.deliveryHighlight}>15 minutes</Text> of
                  payment.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!isStepValid}
          onPress={handleNext}
          style={[
            styles.continueButton,
            !isStepValid && styles.continueButtonDisabled,
          ]}
          activeOpacity={0.8}>
          <Text style={[styles.continueText, !isStepValid && styles.continueTextDisabled]}>
            {step === Step.PAYMENT ? 'CONFIRM & PAY' : 'CONTINUE'}
          </Text>
          <ChevronRight
            size={20}
            color={isStepValid ? '#ffffff' : '#475569'}
          />
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconContainer}>
              <View style={styles.successIconOuter}>
                <View style={styles.successIconInner}>
                  <CheckCheck size={48} color="#ffffff" strokeWidth={3} />
                </View>
              </View>
            </View>

            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
              Your delivery has been booked for{'\n'}
              <Text style={styles.successName}>{formData.receiverName}</Text>
            </Text>

            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Package size={16} color="#818cf8" />
                <Text style={styles.successDetailLabel}>Tracking ID</Text>
                <Text style={styles.successDetailValue}>
                  SP{Math.floor(Math.random() * 900000) + 100000}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Truck size={16} color="#818cf8" />
                <Text style={styles.successDetailLabel}>ETA</Text>
                <Text style={styles.successDetailValue}>15-20 mins</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.successButton}
              onPress={handleResetToLanding}
              activeOpacity={0.8}>
              <Text style={styles.successButtonText}>OKAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.trackButton}
              onPress={handleResetToLanding}
              activeOpacity={0.7}>
              <Text style={styles.trackButtonText}>Track My Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    // Container Styles
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    // Header Styles
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 20,
    },
    
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    
    backButtonHidden: {
      opacity: 0,
    },
    
    headerTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.text,
      letterSpacing: -0.5,
    },
    
    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryBgMedium,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    
    liveText: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.text,
      letterSpacing: 1.5,
      marginLeft: 8,
    },
    
    // Stepper Styles
    stepper: {
      flexDirection: 'row',
      paddingHorizontal: 40,
      paddingVertical: 32,
      alignItems: 'center',
    },
    
    stepContainer: {
      alignItems: 'center',
    },
    
    stepCircle: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    stepCircleActive: {
      backgroundColor: colors.primary,
    },
    
    stepCircleInactive: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    
    stepLabel: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 2,
      marginTop: 12,
    color: colors.text,
    },
    
    stepLabelActive: {
      color: colors.text,
    },
    
    stepLabelInactive: {
      color: colors.text,
    },
    
    progressBarContainer: {
      flex: 1,
      height: 6,
      backgroundColor: colors.card,
      borderRadius: 3,
      marginHorizontal: 12,
      overflow: 'hidden',
    },
    
    progressBarFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    
    // Content Styles
    scrollView: {
      flex: 1,
    },
    
    content: {
      padding: 24,
      paddingBottom: 120,
    },
    
    section: {
      gap: 32,
    },
    
    // Input Group Styles
    inputGroup: {
      gap: 12,
    },
    
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 4,
    },
    
    label: {
      fontSize: 11,
      fontWeight: '900',
      color: colors.subText,
      letterSpacing: 2.5,
      marginLeft: 8,
    },
    
    inputContainerReadOnly: {
      backgroundColor: colors.cardTransparent,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 24,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    inputContainer: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 24,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    inputContainerMargin: {
      marginTop: 12,
    },
    
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.iconBoxIndigo,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    
    iconBoxRose: {
      backgroundColor: colors.iconBoxRose,
    },
    
    iconBoxEmerald: {
      backgroundColor: colors.iconBoxEmerald,
    },
    
    iconBoxBlue: {
      backgroundColor: colors.iconBoxBlue,
    },
    
    input: {
      flex: 1,
      fontSize: 16,
      fontWeight: '700',
      color: colors.subText,
    },
    
    inputTextReadOnly: {
      flex: 1,
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    
    // Package Header Styles
    packageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 4,
    },
    
    packageTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.text,
    },
    
    packageSubtitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.subText,
      marginTop: 4,
    },
    
    selectedBadge: {
      backgroundColor: colors.primaryBgMedium,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    
    selectedText: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.primaryLight,
      letterSpacing: 0.5,
    },
    
    // Category Grid Styles
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    
    categoryCard: {
      width: (width - 64) / 2,
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.cardBorder,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    
    categoryCardActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primaryLight,
    },
    
    categoryIcon: {
      marginBottom: 16,
    },
    
    categoryLabel: {
      fontSize: 12,
      fontWeight: '900',
      color: colors.subText,
      letterSpacing: 1.5,
    },
    
    categoryLabelActive: {
      color: colors.onPrimary,
    },
    
    checkmark: {
      position: 'absolute',
      top: 16,
      right: 16,
    },
    
    // Description Box Styles
    descriptionBox: {
      padding: 24,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.cardBorder,
      borderRadius: 32,
      gap: 16,
    },
    
    descriptionLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    descriptionLabelText: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.dangerLight,
      letterSpacing: 3,
    },
    
    mandatoryBadge: {
      backgroundColor: colors.danger,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    
    mandatoryText: {
      fontSize: 8,
      fontWeight: '900',
      color: colors.onPrimary,
    },
    
    textarea: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
      paddingVertical: 8,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    
    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.dangerBg,
      padding: 8,
      borderRadius: 8,
    },
    
    errorText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.danger,
      marginLeft: 8,
    },
    
    // Invoice Styles
    invoice: {
      backgroundColor: colors.card,
      borderRadius: 40,
      padding: 32,
      borderWidth: 1,
      borderColor: colors.cardBorderTransparent,
    },
    
    invoiceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 32,
    },
    
    invoiceTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.text,
      fontStyle: 'italic',
    },
    
    invoiceNumber: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.subText,
      letterSpacing: 3,
      marginTop: 4,
    },
    
    invoiceIcon: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    invoiceDetails: {
      gap: 20,
    },
    
    invoiceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    invoiceRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.disabled,
      marginRight: 12,
    },
    
    invoiceLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.subText,
    },
    
    invoiceSubtext: {
      fontSize: 9,
      fontWeight: '900',
      color: colors.primaryLight,
      letterSpacing: 0.5,
      marginTop: 2,
    },
    
    invoiceValue: {
      fontSize: 14,
      fontWeight: '900',
      color: colors.text,
    },
    
    freeBadge: {
      backgroundColor: colors.successBg,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 20,
    },
    
    freeText: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.successLight,
    },
    
    invoiceTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingTop: 32,
      borderTopWidth: 2,
      borderTopColor: colors.cardBorder,
      borderStyle: 'dashed',
      marginTop: 12,
    },
    
    totalLabel: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.sectionLabel,
      letterSpacing: 3,
    },
    
    totalAmount: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    
    currencySymbol: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.subTextLight,
      marginRight: 4,
    },
    
    totalValue: {
      fontSize: 48,
      fontWeight: '900',
      color: colors.primary,
      letterSpacing: -2,
    },
    
    // Payment Methods Styles
    paymentMethods: {
      alignItems: 'flex-end',
    },
    
    termsText: {
      fontSize: 9,
      fontWeight: '700',
      color: colors.subText,
      fontStyle: 'italic',
      textDecorationLine: 'underline',
      marginBottom: 8,
    },
    
    cardIcons: {
      flexDirection: 'row',
      gap: 6,
    },
    
    cardIconBlue: {
      width: 32,
      height: 20,
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    },
    
    cardIconOrange: {
      width: 32,
      height: 20,
      backgroundColor: colors.warning,
      borderRadius: 4,
    },
    
    // Delivery Info Styles
    deliveryInfo: {
      backgroundColor: colors.primaryBg,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      borderRadius: 28,
      padding: 24,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    
    deliveryIcon: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    
    deliveryText: {
      flex: 1,
    },
    
    deliveryTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
      fontStyle: 'italic',
    },
    
    deliveryDescription: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.subText,
      lineHeight: 18,
      marginTop: 4,
    },
    
    deliveryHighlight: {
      color: colors.primaryLight,
      fontWeight: '900',
    },
    
    // Footer Styles
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
      paddingBottom: 48,
      backgroundColor: 'rgba(2, 6, 23, 0.9)',
      borderTopWidth: 1,
      borderTopColor: colors.cardBorderTransparent,
    },
    
    continueButton: {
      width: '100%',
      paddingVertical: 24,
      borderRadius: 28,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: colors.text,
    },
    
    continueButtonDisabled: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    
    continueText: {
      fontSize: 14,
      fontWeight: '900',
      color: colors.primary,
      letterSpacing: 2,
      marginRight: 12,
    },
    
    continueTextDisabled: {
      color: colors.sectionLabel,
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalBackdrop,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    
    modalContainer: {
      backgroundColor: colors.card,
      borderRadius: 40,
      padding: 40,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    
    successIconContainer: {
      marginBottom: 24,
    },
    
    successIconOuter: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primaryBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    successIconInner: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    successTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    
    successMessage: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.subTextLight,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
    },
    
    successName: {
      color: colors.primaryLight,
      fontWeight: '900',
    },
    
    successDetails: {
      width: '100%',
      backgroundColor: colors.background,
      borderRadius: 24,
      padding: 20,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      gap: 16,
    },
    
    successDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    
    successDetailLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.subText,
      flex: 1,
    },
    
    successDetailValue: {
      fontSize: 13,
      fontWeight: '900',
      color: colors.text,
      letterSpacing: 0.5,
    },
    
    successButton: {
      width: '100%',
      paddingVertical: 20,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      marginBottom: 12,
    },
    
    successButtonText: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.onPrimary,
      letterSpacing: 2,
    },
    
    trackButton: {
      paddingVertical: 12,
    },
    
    trackButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primaryLight,
      textDecorationLine: 'underline',
    },
    
    // Map Background Styles (if needed)
    mapBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.12,
    },
    
    mapOverlay: {
      flex: 1,
      backgroundColor: colors.mapOverlay,
    },
  });

export default ParcelView;