import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";


import { ImageSourcePropType } from "react-native";

type Service = {
  id: string;
  title: string;
  price: string;
  category: "Home" | "Apartment" | "Commercial" | "Vehicle";
  image: ImageSourcePropType;
};


const SERVICES: Service[] = [
  {
    id: "1",
    title: "Plumbing",
    price: "From $20",
    category: "Home",
    image: require("../../assets/pack1.jpg"),
  },
  {
    id: "2",
    title: "Painting",
    price: "From $30",
    category: "Home",
    image: require("../../assets/pack2.jpg"),
  },
  {
    id: "3",
    title: "Electrician",
    price: "From $25",
    category: "Home",
    image: require("../../assets/pack3.jpg"),
  },

  {
    id: "5",
    title: "AC Repair",
    price: "From $28",
    category: "Apartment",
    image: require("../../assets/pack6.jpg"),
  },
  {
    id: "6",
    title: "Chef",
    price: "From $35",
    category: "Commercial",
    image: require("../../assets/pack7.jpg"),
  },
];
const CleaningServicesScreen = () => {
    const navigation=useNavigation<any>();
const [selectedServices, setSelectedServices] = useState<Service[]>([]);

const toggleSelect = (service: Service) => {
  navigation.navigate("ServiceDetails", {
    service,
  });
};


  const renderItem = ({ item }: { item: Service }) => {
const isSelected = selectedServices.some(s => s.id === item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleSelect(item)}

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
        <Text
          style={[
            styles.cardPrice,
            isSelected && styles.cardPriceSelected,
          ]}
        >
          {item.price}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#0d1321", "#101622"]}
        style={styles.container}
      >
      <SafeAreaView edges={["top"]} style={styles.safeHeader}>
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Home Services</Text>
    <View style={{ width: 24 }} />
  </View>
</SafeAreaView>


        <View style={styles.content}>
          <Text style={styles.title}>
            Select the type of cleaning you need today.
          </Text>
          <Text style={styles.subtitle}>
            Choose one or more services to proceed with your booking.
          </Text>
        </View>

        <FlatList
          data={SERVICES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.ctaWrapper}>
  <TouchableOpacity
    disabled={selectedServices.length === 0}
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
        selectedServices.length === 0 && styles.ctaDisabled,
      ]}
    >
      <Text style={styles.ctaText}>
        Continue ({selectedServices.length} Selected)
      </Text>
      <Icon name="arrow-forward" size={20} color="#fff" />
    </LinearGradient>
  </TouchableOpacity>
</View>


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

export default CleaningServicesScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d1321",
  },
  container: {
    flex: 1,
  },
  header: {
    height: 32,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1c2433",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 8,
    color: "#9da6b9",
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 160,
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
  cardSelected: {
    borderColor: "#1a5cff",
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 110,
  },
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
  checkCircleSelected: {
    backgroundColor: "#1a5cff",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardPrice: {
    marginTop: 4,
    color: "#9da6b9",
    fontSize: 14,
  },
  cardPriceSelected: {
    color: "#1a5cff",
    fontWeight: "600",
  },
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
    gap: 4,
  },
  navItemActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  navText: {
    color: "#9da6b9",
    fontSize: 12,
  },
  navTextActive: {
    color: "#1a5cff",
    fontSize: 12,
    fontWeight: "600",
  },
  safeHeader: {
    // marginTop: StatusBar.currentHeight,

  backgroundColor: "#0d1321",
},

});