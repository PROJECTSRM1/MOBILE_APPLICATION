import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ImageSourcePropType } from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ ADDED

type Service = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

/* ================= DATA ================= */

const RESIDENTIAL_SERVICES: Service[] = [
  {
    id: "r1",
    title: "Apartment",
    subtitle: "Full House",
    image: {
      uri: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    },
  },
];

const COMMERCIAL_SERVICES: Service[] = [
  {
    id: "c1",
    title: "Office Cleaning",
    subtitle: "Workspaces",
    image: {
      uri: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    },
  },
  {
    id: "c2",
    title: "Villa Cleaning",
    subtitle: "Large Properties",
    image: {
      uri: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    },
  },
  {
    id: "c3",
    title: "Pool Cleaning",
    subtitle: "Maintenance",
    image: {
      uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800",
    },
  },
];

const VEHICLE_SERVICES: Service[] = [
  {
    id: "v1",
    title: "Bike Cleaning",
    subtitle: "Two Wheelers",
    image: {
      uri: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
    },
  },
  {
    id: "v2",
    title: "Car Cleaning",
    subtitle: "Interior & Exterior",
    image: {
      uri: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    },
  },
];

/* ================= SCREEN ================= */

const Cleaning = () => {
  const navigation = useNavigation<any>(); // ✅ ADDED
  const [selected, setSelected] = useState<string[]>([]);

  // ✅ SAME FLOW AS CleaningServicesScreen
  const selectedServices = [
    ...RESIDENTIAL_SERVICES,
    ...COMMERCIAL_SERVICES,
    ...VEHICLE_SERVICES,
  ]
    .filter((s) => selected.includes(s.id))
    .map((s) => s.title);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderCard = ({ item }: { item: Service }) => {
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleSelect(item.id)}
        style={[styles.card, isSelected && styles.cardSelected]}
      >
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.image} />
          <View
            style={[
              styles.checkCircle,
              isSelected && styles.checkCircleSelected,
            ]}
          >
            <Icon name="check" size={18} color="#fff" />
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#0d1321", "#101622"]} style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cleaning Services</Text>
          <Icon name="search" size={22} color="#fff" />
        </View>

        {/* TOP TEXT */}
        <View style={styles.content}>
          <Text style={styles.title}>Choose your service</Text>
          <Text style={styles.subtitle}>
            Select a category to book your cleaning service.
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Apartment Cleaning</Text>
          <FlatList
            data={RESIDENTIAL_SERVICES}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
          />

          <Text style={styles.sectionTitle}>Commercial Cleaning</Text>
          <FlatList
            data={COMMERCIAL_SERVICES}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
          />

          <Text style={styles.sectionTitle}>Vehicle Cleaning</Text>
          <FlatList
            data={VEHICLE_SERVICES}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 220 }}
          />
        </ScrollView>

        {/* ✅ CONTINUE BUTTON (SAME FLOW) */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            disabled={selected.length === 0}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("BookCleaning", {
                selectedServices,
              })
            }
          >
            <LinearGradient
              colors={["#1a5cff", "#0f4ae0"]}
              style={[
                styles.ctaButton,
                selected.length === 0 && styles.ctaDisabled,
              ]}
            >
              <Text style={styles.ctaText}>
                Continue ({selected.length} Selected)
              </Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.bottomNav}>
          <View style={styles.navItemActive}>
            <Icon name="home" size={24} color="#1a5cff" />
            <Text style={styles.navTextActive}>Home</Text>
          </View>
          <View style={styles.navItem}>
            <Icon name="calendar-today" size={24} color="#9da6b9" />
            <Text style={styles.navText}>Bookings</Text>
          </View>
          <View style={styles.navItem}>
            <Icon name="account-balance-wallet" size={24} color="#9da6b9" />
            <Text style={styles.navText}>Wallet</Text>
          </View>
          <View style={styles.navItem}>
            <Icon name="person" size={24} color="#9da6b9" />
            <Text style={styles.navText}>Profile</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Cleaning;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0d1321" },
  container: { flex: 1 },

  header: {
    height: 100,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1c2433",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: { color: "#fff", fontSize: 26, fontWeight: "700" },
  subtitle: { color: "#9da6b9", marginTop: 6 },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },

  card: {
    flex: 1,
    backgroundColor: "#1c212b",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: { borderColor: "#1a5cff" },

  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: { width: "100%", height: 120 },

  checkCircle: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: { backgroundColor: "#1a5cff" },

  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardSubtitle: { color: "#9da6b9", fontSize: 13, marginTop: 4 },

  /* ✅ CTA styles copied logically */
  ctaWrapper: {
    position: "absolute",
    bottom: 88,
    left: 16,
    right: 16,
  },
  ctaButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: "#1c1f27",
    borderTopWidth: 1,
    borderTopColor: "#282e39",
    flexDirection: "row",
    paddingBottom: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  navItemActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  navText: { color: "#9da6b9", fontSize: 12 },
  navTextActive: { color: "#1a5cff", fontSize: 12, fontWeight: "600" },
});
