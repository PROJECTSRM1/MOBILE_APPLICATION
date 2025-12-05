import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";

/* --------------------- NAVBAR COMPONENT --------------------- */
const NavBar = ({ navigation }: { navigation: any }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "Home",
    "Cleaning and Home Services",
    "Transport",
    "Buy/Sales/Rentals",
    "Raw Materials",
    "Freelancer",
    "Settings",
  ];

  const handleMenuItemPress = (item: string) => {
    setIsMenuOpen(false);

    switch (item) {
      case "Home":
        navigation.navigate("HomeScreen");
        break;
      case "Cleaning and Home Services":
        navigation.navigate("Cleaning");
        break;
      case "Transport":
        navigation.navigate("Packers");
        break;
      case "Raw Materials":
        navigation.navigate("ConstructionMaterial");
        break;
      case "Settings":
        navigation.navigate("SettingsScreen");
        break;
    }
  };

  return (
    <View style={styles.navBarContainer}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>SWACHIFY INDIA</Text>

        <TouchableOpacity
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          style={styles.hamburgerButton}
        >
          <Text style={styles.hamburgerIcon}>{isMenuOpen ? "✕" : "☰"}</Text>
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
            >
              <Text style={styles.menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

/* ------------------------- CATEGORY DATA ------------------------- */
interface Category {
  id: number;
  title: string;
  image: any;
  subtitle: string;
  route: string;
}

const productCategories: Category[] = [
  {
    id: 1,
    title: "Cement & Concrete",
    image: require("../assets/cm1.jpg"),
    subtitle: "High-quality cement and ready-mix concrete for strong foundations.",
    route: "CementScreen",
  },
  {
    id: 2,
    title: "Steel & Metals",
    image: require("../assets/cm2.jpg"),
    subtitle: "Durable TMT bars, steel beams, and structural metals.",
    route: "SteelScreen",
  },
  {
    id: 3,
    title: "Bricks & Blocks",
    image: require("../assets/cm3.jpg"),
    subtitle: "Variety of bricks, fly ash bricks, and AAC blocks.",
    route: "BricksScreen",
  },
  {
    id: 4,
    title: "Sand & Aggregates",
    image: require("../assets/cm4.jpg"),
    subtitle: "River sand, M-sand, and aggregates for construction.",
    route: "SandScreen",
  },
  {
    id: 5,
    title: "Roofing Materials",
    image: require("../assets/cma.jpg"),
    subtitle: "Tiles, metal sheets, and waterproofing solutions.",
    route: "RoofingScreen",
  },
  {
    id: 6,
    title: "Plumbing & Electrical",
    image: require("../assets/cm5.jpeg"),
    subtitle: "Pipes, wiring, switches, and fittings.",
    route: "PlumbingScreen",
  },
];

const screenWidth = Dimensions.get("window").width;

/* ------------------------- MAIN SCREEN ------------------------- */
export default function ConstructionMaterialScreen({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCardPress = (category: Category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleBrowse = () => {
    if (selectedCategory) {
      setModalVisible(false);
      try {
        navigation.navigate(selectedCategory.route);
      } catch (error) {
        console.warn(`Route ${selectedCategory.route} not found.`);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const CategoryCard = ({ category }: { category: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCardPress(category)}
    >
      <Image source={category.image} style={styles.categoryImage} />
      <View style={styles.categoryTitleWrapper}>
        <Text style={styles.categoryTitleText}>{category.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <NavBar navigation={navigation} />

        {/* HERO IMAGE */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../assets/raw1.jpg")}
            style={styles.heroImage}
          />

          <View style={styles.overlay}>
            <Text style={styles.title}>Quality Building Materials at Best Prices</Text>
            <Text style={styles.subtitle}>
              Browse our comprehensive range of construction materials.
            </Text>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Browse Catalog</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Get Bulk Quote</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PRODUCT CATEGORIES IN ONE ROW */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Product Categories</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gridWrapper}
          >
            {productCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{selectedCategory?.title}</Text>
              <Text style={styles.modalText}>{selectedCategory?.subtitle}</Text>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonBrowse]}
                onPress={handleBrowse}
              >
                <Text style={styles.textStyle}>Browse</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

/* ------------------------- STYLES ------------------------- */
const styles = StyleSheet.create({
  imageWrapper: { marginTop: 20, position: "relative" },
  heroImage: { width: "100%", height: 300, resizeMode: "cover", marginTop: 30 },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 20 },
  buttonWrapper: { flexDirection: "row", gap: 10 },
  primaryButton: { backgroundColor: "#2e6ef7", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 },
  primaryButtonText: { color: "#fff", fontWeight: "bold" },
  secondaryButton: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 },
  secondaryButtonText: { color: "#000", fontWeight: "bold" },

  /* NAVBAR */
  navBarContainer: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: "rgba(0, 0, 0, 0.8)" },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, paddingVertical: 15 },
  logoText: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 20 },
  hamburgerButton: { padding: 5, marginTop: 20 },
  hamburgerIcon: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  dropdownMenu: { backgroundColor: "rgba(0, 0, 0, 0.95)", paddingHorizontal: 15, paddingBottom: 10 },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  menuText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  /* PRODUCT ROW */
  sectionContainer: { marginTop: 20, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },

  gridWrapper: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 12,
    paddingRight: 10,
  },

  categoryCard: {
    width: 90,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    // marginTop: 5,   
    borderColor: "#e0e0e0",
  },
  categoryImage: { width: "100%", height: 80, resizeMode: "cover" },
  categoryTitleWrapper: { paddingVertical: 10, paddingHorizontal: 5, justifyContent: "center", alignItems: "center" },
  categoryTitleText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },

  /* MODAL */
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalView: { margin: 20, backgroundColor: "white", borderRadius: 10, padding: 35, alignItems: "center", elevation: 5, width: "80%" },
  modalTitle: { marginBottom: 15, textAlign: "center", fontSize: 20, fontWeight: "bold" },
  modalText: { marginBottom: 25, textAlign: "center", fontSize: 16, color: "#666" },
  modalButton: { borderRadius: 5, padding: 10, width: "100%", marginVertical: 5 },
  modalButtonBrowse: { backgroundColor: "#2e6ef7" },
  modalButtonClose: { backgroundColor: "#f44336" },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
});
