import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";


import { useTheme } from "../context/ThemeContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ServiceCategoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const styles = getStyles(colors);

const services = [
  {
    title: 'Home Cleaning',
    description: 'Deep or regular house cleaning',
    image: require("../../assets/home.png"),
  },
  {
    title: 'Commercial Cleaning',
    description: 'Office and workspace sanitation',
    image: require("../../assets/commercial.png"),
  },
  {
    title: 'Vehicle Cleaning',
    description: 'Interior & exterior car wash',
    image: require("../../assets/vehicle.png"),
  },
];


interface ServiceCardProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
  onPress: () => void;
}


const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, image, onPress }) => (

  <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
<ImageBackground
  source={image}
  style={styles.cardImage}
  imageStyle={styles.cardImageStyle}
>
  <View style={styles.gradient} />
</ImageBackground>


    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#101c22" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a Service</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="notifications" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Cleaning Categories</Text>

          {/* Grid Container */}
          <View style={styles.gridContainer}>
            {services.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.gridItem,
                  index === services.length - 1 && services.length % 2 !== 0 && styles.gridItemFull,
                ]}
              >
            <ServiceCard
  title={service.title}
  description={service.description}
  image={service.image}
  onPress={() => {
    if (service.title === "Home Cleaning") {
      navigation.navigate("HomeSub");
    } else if (service.title === "Commercial Cleaning") {
      navigation.navigate("CommercialSub");
    } else if (service.title === "Vehicle Cleaning") {
      navigation.navigate("VehicleSub");
    }
  }}
/>

              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <SafeAreaView style={styles.bottomNavContainer} edges={['bottom']}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="home" size={24} color="#13a4ec" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="calendar-today" size={24} color="#9db0b9" />
            <Text style={styles.navLabel}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#9db0b9" />
            <Text style={styles.navLabel}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="person" size={24} color="#9db0b9" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
    headerButton: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: -0.27,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingBottom: 40,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 12,
      letterSpacing: -0.33,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 16,
    },
    gridItem: {
      width: '47%',
    },
    gridItemFull: {
      width: '47%',
    },
    cardContainer: {
      marginBottom: 12,
    },
    cardImage: {
      width: '100%',
      aspectRatio: 1,
      marginBottom: 12,
    },
    cardImageStyle: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    gradient: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    cardTextContainer: {
      gap: 4,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 22,
    },
    cardDescription: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.subText,
      lineHeight: 18,
    },
    bottomNavContainer: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    bottomNav: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
      gap: 8,
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 4,
    },
    navLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.subText,
      letterSpacing: 0.18,
    },
    navLabelActive: {
      color: colors.primary,
      fontWeight: '700',
    },
  });
export default ServiceCategoryScreen;