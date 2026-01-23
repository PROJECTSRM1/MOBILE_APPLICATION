import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const { height } = Dimensions.get("window");

const CleaningCategorySelectScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  // State to control Help Modal
  const [helpVisible, setHelpVisible] = useState(false);

  const ServiceCard = ({ title, sub, icon, onPress, color }: any) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.serviceCard} 
      onPress={onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: color + "15" }]}>
        <Icon name={icon} size={42} color={color} />
        <View style={styles.arrowIcon}>
            <Icon name="chevron-right" size={20} color={colors.subText} />
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.fullScreen}>
      <StatusBar
        translucent
        barStyle={colors.background === "#ffffff" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={
          colors.background === "#ffffff"
            ? [colors.background, "#f8fafc"]
            : ["#0d1321", "#101622"]
        }
        style={styles.container}
      >
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back-ios" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Hub</Text>
          
          {/* QUESTION MARK ICON - Now triggers state */}
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => setHelpVisible(true)}
          >
            <Icon name="help-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* WELCOME SECTION */}
        <View style={styles.content}>
          <Text style={styles.greeting}>What can we help{'\n'}you with?</Text>
          <Text style={styles.subtitle}>
            Select a category to see available experts in your area.
          </Text>
        </View>

        {/* ICON CARDS GRID */}
        <View style={styles.gridWrapper}>
          <ServiceCard
            title="Home Cleaning"
            sub="Deep cleaning, Sanitization & Janitorial"
            icon="cleaning-services"
            color="#1a5cff"
            onPress={() => navigation.navigate("Cleaning")}
          />

          <ServiceCard
            title="Home Services"
            sub="Plumbing, Electrical, AC & Carpentry"
            icon="home-repair-service"
            color="#10b981"
            onPress={() => navigation.navigate("CleaningServiceScreen")}
          />
        </View>

        {/* FOOTER NAV */}
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="grid-view" size={24} color={colors.primary} />
            <Text style={styles.navTextActive}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="calendar-today" size={24} color="#94a3b8" />
            <Text style={styles.navText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="account-balance-wallet" size={24} color="#94a3b8" />
            <Text style={styles.navText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="person-outline" size={24} color="#94a3b8" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* HELP MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpVisible}
        onRequestClose={() => setHelpVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Help Center</Text>
                <TouchableOpacity onPress={() => setHelpVisible(false)}>
                    <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.helpItem}>
                    <Icon name="info" size={22} color={colors.primary} />
                    <View style={styles.helpTextWrapper}>
                        <Text style={styles.helpLabel}>What is Service Hub?</Text>
                        <Text style={styles.helpSub}>A one-stop platform to find verified cleaners, plumbers, and maintenance experts near you.</Text>
                    </View>
                </View>

                <View style={styles.helpItem}>
                    <Icon name="event-available" size={22} color="#10b981" />
                    <View style={styles.helpTextWrapper}>
                        <Text style={styles.helpLabel}>How to book?</Text>
                        <Text style={styles.helpSub}>Choose a category, select your specific requirements, and pick a time slot that suits you.</Text>
                    </View>
                </View>

                <View style={styles.helpItem}>
                    <Icon name="verified-user" size={22} color="#f59e0b" />
                    <View style={styles.helpTextWrapper}>
                        <Text style={styles.helpLabel}>Are experts verified?</Text>
                        <Text style={styles.helpSub}>Yes, every professional on our platform undergoes a background check and skill verification.</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.contactBtn}>
                    <Icon name="support-agent" size={20} color="#fff" />
                    <Text style={styles.contactBtnText}>Chat with Support</Text>
                </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ================= STYLES ================= */

const getStyles = (colors: any) =>
  StyleSheet.create({
    fullScreen: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    header: {
      paddingBottom: 15,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerTitle: { color: colors.text, fontSize: 17, fontWeight: "700" },
    content: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20 },
    greeting: { color: colors.text, fontSize: 32, fontWeight: "800", lineHeight: 40 },
    subtitle: { marginTop: 12, color: colors.subText, fontSize: 15, lineHeight: 22 },
    gridWrapper: { flex: 1, paddingHorizontal: 20, gap: 20, marginTop: 10 },
    serviceCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
    },
    iconWrapper: { width: 80, height: 80, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 18 },
    arrowIcon: { position: 'absolute', bottom: -5, right: -5, backgroundColor: colors.surface, borderRadius: 10, padding: 2, borderWidth: 1, borderColor: colors.border },
    cardInfo: { flex: 1 },
    cardTitle: { color: colors.text, fontSize: 19, fontWeight: "700" },
    cardSub: { marginTop: 4, color: colors.subText, fontSize: 13 },
    bottomNav: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", paddingTop: 15, paddingHorizontal: 10 },
    navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 5 },
    navText: { color: "#94a3b8", fontSize: 11 },
    navTextActive: { color: colors.primary, fontSize: 11, fontWeight: "700" },

    /* MODAL STYLES */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        maxHeight: height * 0.7,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
    },
    helpItem: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 15,
    },
    helpTextWrapper: {
        flex: 1,
    },
    helpLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    helpSub: {
        fontSize: 14,
        color: colors.subText,
        lineHeight: 20,
    },
    contactBtn: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 15,
        marginTop: 10,
        gap: 10,
    },
    contactBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    }
  });

export default CleaningCategorySelectScreen;