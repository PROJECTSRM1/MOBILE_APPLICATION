import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const CleaningCategorySelectScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>(); 

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
  barStyle={colors.background === "#ffffff" ? "dark-content" : "light-content"}
/>


<LinearGradient
  colors={
    colors.background === "#ffffff"
      ? [colors.background, colors.surface]
      : ["#0d1321", "#101622"] // keep rich dark gradient
  }
  style={styles.container}
>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cleaning Services</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* TITLE */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Select the type of cleaning you need today.
          </Text>
          <Text style={styles.subtitle}>
            Choose one or more services to proceed with your booking.
          </Text>
        </View>

        {/* CENTER CARDS */}
        <View style={styles.cardsWrapper}>
          {/* CLEANING */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.bigCard}
            onPress={() => navigation.navigate("Cleaning")} // ✅ ADDED
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900",
              }}
              style={styles.cardImage}
            />
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Cleaning</Text>
              <Text style={styles.cardSub}>Residential & Commercial</Text>
            </View>
          </TouchableOpacity>

          {/* HOME SERVICES */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.bigCard}
            onPress={() => navigation.navigate("CleaningServiceScreen")} // ✅ ADDED
          >
<Image
  source={{
    uri: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
  }}
  style={styles.cardImage}
/>

            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Home Services</Text>
              <Text style={styles.cardSub}>Plumbing, Electrical & More</Text>
            </View>
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

export default CleaningCategorySelectScreen;

/* ================= STYLES ================= */

const getStyles = (colors: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
    },

    /* ================= HEADER ================= */
    header: {
      height: 100,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "600",
    },

    /* ================= CONTENT ================= */
    content: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
    },

    title: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "700",
      lineHeight: 32,
    },

    subtitle: {
      marginTop: 8,
      color: colors.subText,
      fontSize: 14,
      lineHeight: 20,
    },

    /* ================= CARDS ================= */
    cardsWrapper: {
      marginTop: 0,
      marginBottom: 150,
      flex: 1,
      paddingHorizontal: 16,
      justifyContent: "center",
      gap: 20,
    },

    bigCard: {
      height: 180,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardImage: {
      width: "100%",
      height: "100%",
    },

    cardOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)", // keeps contrast for both modes
    },

    cardContent: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
    },

    cardTitle: {
      color: "#ffffff", // intentional: image overlay readability
      fontSize: 22,
      fontWeight: "700",
    },

    cardSub: {
      marginTop: 6,
      color: "#e5e7eb",
      fontSize: 14,
    },

    /* ================= BOTTOM NAV ================= */
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 72,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
      color: colors.subText,
      fontSize: 12,
    },

    navTextActive: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "600",
    },
  });
