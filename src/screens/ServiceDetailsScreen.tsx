import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {useTheme} from "../context/ThemeContext"; 
/* ---------------- CONSTANTS ---------------- */

const PROPERTY_TYPES = [
  { label: "1 BHK", value: "1bhk", floors: 1 },
  { label: "2 BHK", value: "2bhk", floors: 1 },
  { label: "3 BHK", value: "3bhk", floors: 2 },
  { label: "4 BHK", value: "4bhk", floors: 2 },
  { label: "Villa", value: "villa", floors: 3 },
  { label: "Duplex", value: "duplex", floors: 2 },
  { label: "Studio Apartment", value: "studio", floors: 1 },
];

const INTERNAL_SERVICES = {
  Plumbing: [
    { id: "p1", title: "Pipe Leakage", image: require("../../assets/pl.jpg"), needsFloorInfo: true },
    { id: "p2", title: "Tap Fixing", image: require("../../assets/tf.jpg"), needsFloorInfo: false },
    { id: "p3", title: "Bathroom Fitting", image: require("../../assets/bf.jpg"), needsFloorInfo: true },
    { id: "p4", title: "Water Tank Cleaning", image: require("../../assets/wtc.jpg"), needsFloorInfo: false },
  ],
  Painting: [
    { id: "pa1", title: "Interior Painting", image: require("../../assets/ip.jpg"), needsFloorInfo: true },
    { id: "pa2", title: "Exterior Painting", image: require("../../assets/ep.jpg"), needsFloorInfo: true },
    { id: "pa3", title: "Wall Texture", image: require("../../assets/wt.jpg"), needsFloorInfo: true },
    { id: "pa4", title: "Repainting", image: require("../../assets/rp.jpg"), needsFloorInfo: true },
  ],
  Electrician: [
    { id: "e1", title: "Wiring", image: require("../../assets/wire.jpg"), needsFloorInfo: true },
    { id: "e2", title: "Fan Repair", image: require("../../assets/fan.jpg"), needsFloorInfo: false },
    { id: "e3", title: "Light Installation", image: require("../../assets/li.jpg"), needsFloorInfo: false },
    { id: "e4", title: "Power Backup Setup", image: require("../../assets/pbs.jpg"), needsFloorInfo: false },
  ],
  Kitchen: [
    { id: "k1", title: "Kitchen Cleaning", image: require("../../assets/kc.jpg"), needsFloorInfo: false },
    { id: "k2", title: "Chimney Service", image: require("../../assets/cs.jpg"), needsFloorInfo: false },
    { id: "k3", title: "Gas Stove Repair", image: require("../../assets/gsr.jpg"), needsFloorInfo: false },
    { id: "k4", title: "Sink Installation", image: require("../../assets/si.jpg"), needsFloorInfo: false },
  ],
  "AC Repair": [
    { id: "a1", title: "AC Installation", image: require("../../assets/ai.jpg"), needsFloorInfo: true },
    { id: "a2", title: "AC Gas Refill", image: require("../../assets/agr.jpg"), needsFloorInfo: false },
    { id: "a3", title: "AC General Service", image: require("../../assets/ags.jpg"), needsFloorInfo: false },
    { id: "a4", title: "AC Uninstallation", image: require("../../assets/au.jpg"), needsFloorInfo: true },
  ],
  Chef: [
    { id: "c1", title: "Home Cooking", image: require("../../assets/hc.jpg"), needsFloorInfo: false },
    { id: "c2", title: "Party Catering", image: require("../../assets/pc.jpg"), needsFloorInfo: false },
    { id: "c3", title: "Weekly Meal Plan", image: require("../../assets/wmp.jpg"), needsFloorInfo: false },
    { id: "c4", title: "Festival Cooking", image: require("../../assets/fc.jpg"), needsFloorInfo: false },
  ],
};

const CONSULTATION_CHARGE = 50;

/* ---------------- TYPES ---------------- */

interface ServiceItem {
  id: string;
  title: string;
  image: any;
  needsFloorInfo?: boolean;
}

interface SelectedServiceWithFloor extends ServiceItem {
  selectedFloor?: number;
}

/* ---------------- COMPONENT ---------------- */

const ServiceDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { service } = route.params;
  const data: ServiceItem[] = INTERNAL_SERVICES[service.title as keyof typeof INTERNAL_SERVICES] || [];
 const { colors } = useTheme();
    const styles = getStyles(colors);
  const [propertyType, setPropertyType] = useState("2bhk");
  const [selectedServices, setSelectedServices] = useState<SelectedServiceWithFloor[]>([]);
  const [floorSelections, setFloorSelections] = useState<{ [key: string]: number }>({});

  const currentProperty = PROPERTY_TYPES.find(p => p.value === propertyType);
  const maxFloors = currentProperty?.floors || 1;

  const toggleService = (item: ServiceItem) => {
    const exists = selectedServices.find((s) => s.id === item.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.id !== item.id));
      const newFloorSelections = { ...floorSelections };
      delete newFloorSelections[item.id];
      setFloorSelections(newFloorSelections);
    } else {
      setSelectedServices([...selectedServices, item]);
      if (item.needsFloorInfo) {
        setFloorSelections({ ...floorSelections, [item.id]: 1 });
      }
    }
  };

  const updateFloorSelection = useCallback((serviceId: string, floor: number) => {
    console.log('Updating floor for', serviceId, 'to', floor);
    setFloorSelections(prev => {
      const newState = {
        ...prev,
        [serviceId]: floor,
      };
      console.log('New floor selections:', newState);
      return newState;
    });
  }, []);

  const isSelected = (id: string) => selectedServices.some((s) => s.id === id);

  const needsConsultation = selectedServices.length > 1;

   const handleProceed = () => {
    if (selectedServices.length === 0) {
      Alert.alert("Selection Required", "Please select at least one service");
      return;
    }

    const servicesNeedingFloors = selectedServices.filter(s => s.needsFloorInfo);
    const missingFloors = servicesNeedingFloors.some(s => !floorSelections[s.id]);
    
    if (missingFloors) {
      Alert.alert("Floor Selection Required", "Please select floor number for all applicable services");
      return;
    }

    // Map services to include the category (e.g., "Plumbing") so Add-ons work
    const mappedServices = selectedServices.map((s) => ({
      id: s.id,
      title: s.title,
      category: service.title, 
      selectedFloor: s.needsFloorInfo ? floorSelections[s.id] : undefined,
    }));

    navigation.navigate("BookCleaning", {
  selectedServices: mappedServices,
  serviceCategory: service.title,   // 👈 ADD THIS LINE
  consultationCharge: needsConsultation ? CONSULTATION_CHARGE : 0,
});

  };

  const renderServiceCard = (item: ServiceItem) => {
    const selected = isSelected(item.id);
    const currentFloor = floorSelections[item.id] || 1;

    return (
      <View style={styles.cardWrapper} key={item.id}>
        <TouchableOpacity
          style={[styles.card, selected && styles.cardSelected]}
          onPress={() => toggleService(item)}
          activeOpacity={0.8}
        >
          {selected && (
            <View style={styles.checkBadge}>
              <Icon name="check-circle" size={22} color="#10b981" />
            </View>
          )}

          <Image source={item.image} style={styles.image} />
          <Text style={styles.cardText}>{item.title}</Text>

          {item.needsFloorInfo && (
            <View style={styles.floorBadge}>
              <Icon name="layers" size={12} color="#60a5fa" />
              <Text style={styles.floorBadgeText}>Floor required</Text>
            </View>
          )}
        </TouchableOpacity>

        {selected && item.needsFloorInfo && (
          <View style={styles.floorCounter}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => updateFloorSelection(item.id, Math.max(1, currentFloor - 1))}
            >
              <Icon name="remove" size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.floorCount}>Floor {currentFloor}</Text>

            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => updateFloorSelection(item.id, Math.min(maxFloors, currentFloor + 1))}
            >
              <Icon name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{service.title}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>PROPERTY TYPE</Text>
            <View style={styles.dropdownBox}>
              <Picker
                selectedValue={propertyType}
                onValueChange={setPropertyType}
                dropdownIconColor="#9CA3AF"
                style={styles.picker}
              >
                {PROPERTY_TYPES.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>
            <Text style={styles.propertyInfo}>
              {currentProperty?.label} • {maxFloors} {maxFloors === 1 ? 'Floor' : 'Floors'}
            </Text>
          </View>

          <Text style={styles.question}>
            Select services you need for {service.title}
          </Text>
          <Text style={styles.subQuestion}>
            (Select multiple for complete service package)
          </Text>

          <View style={styles.gridContainer}>
            {data.map((item, index) => {
              // Only render on even indices to create rows of 2
              if (index % 2 !== 0) return null;
              
              const firstItem = data[index];
              const secondItem = data[index + 1];
              
              return (
                <View key={`row-${index}`} style={styles.row}>
                  {renderServiceCard(firstItem)}
                  {secondItem && renderServiceCard(secondItem)}
                </View>
              );
            })}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          {needsConsultation && (
            <View style={styles.consultationBanner}>
              <Icon name="info" size={18} color="#facc15" />
              <Text style={styles.consultationText}>
                +${CONSULTATION_CHARGE} consultation charge for multiple services
              </Text>
            </View>
          )}

          <View style={styles.bottomContent}>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionCount}>
                {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''} Selected
              </Text>
              <Text style={styles.selectionHint}>
                {selectedServices.length === 0
                  ? "Choose at least one service"
                  : selectedServices.length === 1
                  ? "No consultation fee"
                  : `Includes $${CONSULTATION_CHARGE} consultation`}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.proceedBtn,
                selectedServices.length === 0 && styles.proceedBtnDisabled
              ]}
              onPress={handleProceed}
              disabled={selectedServices.length === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.proceedText}>Proceed</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ServiceDetailsScreen;

/* ---------------- STYLES ---------------- */
const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      padding: 16,
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },

    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "600",
    },

    section: {
      paddingHorizontal: 16,
      marginTop: 20,
    },

    label: {
      color: colors.subText,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
      letterSpacing: 0.5,
    },

    dropdownBox: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      height: 56,
      justifyContent: "center",
    },

    picker: {
      color: colors.text,
      height: 56,
    },

    propertyInfo: {
      color: colors.primary,
      fontSize: 13,
      marginTop: 8,
      fontWeight: "600",
    },

    question: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
      paddingHorizontal: 16,
      marginTop: 24,
    },

    subQuestion: {
      color: colors.subText,
      fontSize: 13,
      paddingHorizontal: 16,
      marginTop: 4,
      marginBottom: 16,
    },

    gridContainer: {
      paddingHorizontal: 10,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    cardWrapper: {
      width: "47%",
    },

    card: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 12,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
      position: "relative",
    },

    cardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },

    checkBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      zIndex: 10,
    },

    image: {
      width: "100%",
      height: 110,
      borderRadius: 12,
    },

    cardText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
      marginTop: 8,
      textAlign: "center",
    },

    floorBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 6,
      backgroundColor: colors.primary + "20",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },

    floorBadgeText: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: "600",
    },

    floorCounter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },

    counterBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    floorCount: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },

    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    consultationBanner: {
      backgroundColor: colors.warningBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.warningBorder,
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      gap: 8,
    },

    consultationText: {
      color: colors.warningText,
      fontSize: 12,
      fontWeight: "600",
      flex: 1,
    },

    bottomContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      paddingBottom: 24,
    },

    selectionInfo: {
      flex: 1,
    },

    selectionCount: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },

    selectionHint: {
      color: colors.subText,
      fontSize: 12,
      marginTop: 2,
    },

    proceedBtn: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },

    proceedBtnDisabled: {
      backgroundColor: colors.disabled,
      shadowOpacity: 0,
      elevation: 0,
    },

    proceedText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
  });
