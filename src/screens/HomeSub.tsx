import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const HomeSub: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const subServices = [
    { title: 'Kitchen Cleaning', description: 'Degreasing, cabinets & appliances', image: require("../../assets/kitchen.jpg") },
    { title: 'Washroom Cleaning', description: 'Sanitization & tile scrubbing', image: require("../../assets/bathroom.jpg") },
    { title: 'Sofa Cleaning', description: 'Deep vacuuming & stain removal', image: require("../../assets/sofa.jpg") },
    { title: 'Bedroom Cleaning', description: 'Dusting, bedding & floor care', image: require("../../assets/bedroom.jpg") },
    { title: 'Window Cleaning', description: 'Interior & exterior glass shine', image: require("../../assets/window.jpg") },
    { title: 'Full Deep Cleaning', description: 'Entire house detailed cleaning', image: require("../../assets/home.jpg") },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#101c22" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home Cleaning</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
             <Text style={styles.sectionTitle}>Select Services</Text>
          </View>

          <View style={styles.gridContainer}>
            {subServices.map((service, index) => {
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.gridItem}
                  onPress={() => navigation.navigate("CleaningDetailScreen", { title: service.title })} // <--- Changed
                >
                  <ImageBackground
                    source={service.image}
                    style={styles.cardImage}
                    imageStyle={styles.cardImageStyle}
                  >
                    <View style={styles.gradient}>
                    </View>
                  </ImageBackground>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>
                        {service.title}
                    </Text>
                    <Text style={styles.cardDescription}>{service.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
    scrollView: { flex: 1 },
    content: { paddingBottom: 100 }, // Added space for bottom bar
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
    selectedCount: { color: colors.primary, fontWeight: '600', fontSize: 14 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 16 },
    gridItem: { 
        width: '47%', 
        marginBottom: 16, 
        borderRadius: 12, 
        padding: 4, 
        borderWidth: 2, 
        borderColor: 'transparent' 
    },
    gridItemActive: { borderColor: colors.primary },
    cardImage: { width: '100%', aspectRatio: 1, marginBottom: 8 },
    cardImageStyle: { borderRadius: 10 },
    gradient: { flex: 1, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)' },
    gradientActive: { backgroundColor: 'rgba(19, 164, 236, 0.2)' },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 2,
    },
    cardTextContainer: { paddingHorizontal: 4 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
    cardDescription: { fontSize: 12, color: colors.subText, marginTop: 2 },
    
    // Bottom Bar Styles
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    proceedBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    proceedBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  });

export default HomeSub;