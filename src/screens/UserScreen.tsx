import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

declare var global: any;

type Style = typeof styles extends { [key: string]: any } ? typeof styles : never;

type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUri?: string | null;
};

// Ensure global service storage
function ensureServicesGlobal() {
  if (!global.__SW_SERVICES__) global.__SW_SERVICES__ = [];
}

// ------------------ NAVBAR COMPONENT ------------------
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
    case "Settings":
      navigation.navigate("SettingsScreen");
      break;
    // add other items if needed
    default:
      console.warn("No navigation defined for", item);
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

// ------------------ USER DASHBOARD ------------------
export default function UserDashboard(): React.ReactElement {
  const nav = useNavigation<any>();
  ensureServicesGlobal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>(
    Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []
  );

  useEffect(() => {
    const id = setInterval(() => {
      setServices(Array.isArray(global.__SW_SERVICES__) ? [...global.__SW_SERVICES__] : []);
    }, 400);
    return () => clearInterval(id);
  }, []);

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri || null);
        }
      }
    );
  };

  const addService = () => {
    if (!title.trim() || !description.trim() || !price.trim()) {
      Alert.alert("Missing fields", "Please fill title, description and price.");
      return;
    }
    const s: Service = {
      id: Date.now().toString(),
      title,
      description,
      price,
      imageUri: imageUri || null,
    };

    global.__SW_SERVICES__ = [s, ...(global.__SW_SERVICES__ || [])];
    setServices([...global.__SW_SERVICES__]);

    setTitle("");
    setDescription("");
    setPrice("");
    setImageUri(null);
  };

  const removeService = (id: string) => {
    global.__SW_SERVICES__ = global.__SW_SERVICES__.filter((x: any) => x.id !== id);
    setServices([...global.__SW_SERVICES__]);
  };

  const renderItem = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Image
          source={{ uri: item.imageUri || "https://via.placeholder.com/100x80" }}
          style={styles.cardImage}
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.description}</Text>
          <Text style={styles.cardPrice}>₹{item.price}</Text>
        </View>
        <TouchableOpacity onPress={() => removeService(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f4f7" }}>
      <NavBar navigation={nav} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 120 }}>
        <Text style={styles.header}>Service Provider — Manage Services</Text>
        <Text style={styles.subHeader}>Add new service (this will be available to customers)</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Service Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#495057"
          />
          <TextInput
            placeholder="Short description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 70 }]}
            multiline
            placeholderTextColor="#495057"
          />
          <TextInput
            placeholder="Price (number only)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#495057"
          />

          <TouchableOpacity onPress={pickImage} style={styles.imagePickerBox}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            ) : (
              <Text style={{ color: "#495057" }}>Upload image</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={addService}>
            <Text style={styles.addBtnText}>Add service</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your services</Text>

        {services.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ color: "#7a869a" }}>No services yet — add your first service</Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  navBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    marginTop: 20,
  },
  hamburgerButton: {
    padding: 5,
    marginTop: 20,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownMenu: {
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  header: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 6,
    color: "#1e1e1e",
  },
  subHeader: {
    color: "#6c757d",
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e8eaed",
  },
  input: {
    height: 48,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e9ecef",
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: "#0a7263",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#1e1e1e",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8eaed",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e8eaed",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardImage: {
    width: 90,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#dfe7ec",
  },
  imagePickerBox: {
    height: 100,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e1e1e",
  },
  cardSubtitle: {
    color: "#6c757d",
    marginTop: 4,
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
  },
  deleteText: {
    color: "#d62828",
    fontSize: 15,
    marginTop: 8,
    fontWeight: "700",
  },
});
