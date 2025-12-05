import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Modal,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

// --- DIMENSIONS & CONSTANTS ---
const { width, height } = Dimensions.get("window"); // Added height here
const CARD_MARGIN = 10;
const CONTAINER_PADDING = 20;
const CARD_SIZE = (width - CONTAINER_PADDING * 2 - CARD_MARGIN * 3) / 4;
// Define the size for the 3-column grid cards within the modal
const DETAIL_CARD_WIDTH = (width - CONTAINER_PADDING * 2 - CARD_MARGIN * 2 * 3) / 3;


// Type for styles
type Style = typeof styles extends { [key: string]: any } ? typeof styles : never;

// --- SERVICE CARD DATA (small horizontal cards) ---
const serviceData = [
    {
        title: "Packing Services",
        image: require("../assets/t1.jpg"),
    },
    {
        title: "Loading Transport",
        image: require("../assets/t2.jpg"),
    },
    {
        title: "Local And Long-Distance",
        image: require("../assets/t3.jpg"),
    },
    {
        title: "Insurance Coverage",
        image: require("../assets/t4.jpeg"),
    },
];

// --- TRANSPORT CATEGORIES (popup rows) ---
const transportCategories = [
    {
        key: "passenger",
        title: "Passenger Transport",
        desc: "Reliable taxi, cab, shuttle, and transfer services",
        image: require("../assets/t1.jpg"),
    },
    {
        key: "logistics",
        title: "Logistics & Cargo",
        desc: "Complete goods delivery and cargo forwarding solutions",
        image: require("../assets/t2.jpg"),
    },
    {
        key: "rental",
        title: "Rental Services",
        desc: "Car, truck, and van rentals for all your needs",
        image: require("../assets/t3.jpg"),
    },
    {
        key: "specialized",
        title: "Specialized Transport",
        desc: "Temperature-controlled and hazardous material handling",
        image: require("../assets/t4.jpeg"),
    },
];

// --- PASSENGER TRANSPORT DETAIL DATA (From previous request) ---
const passengerTransportDetails = [
    {
        id: 'taxi',
        title: 'Local Taxi',
        description: 'Short trips within city',
        price: '$25',
        image: require("../assets/pm1.jpg"), // Placeholder image
    },
    {
        id: 'carpooling',
        title: 'Carpooling',
        description: 'Shared ride options',
        price: '$15',
        image: require("../assets/pm2.jpg"), // Placeholder image
    },
    {
        id: 'shuttle',
        title: 'Shuttle Service',
        description: 'Group & airport shuttles',
        price: '$40',
        image: require("../assets/pm3.jpg"), // Placeholder image
    },
];
const rentalServicesDetails = [
    {
        id: 'car_rental',
        title: 'Car Rentals',
        description: 'Self-drive or chauffeur',
        price: '$70/day',
        image: require("../assets/Car Rentals.jpg"), // Placeholder image (Update path)
    },
    {
        id: 'truck_rental',
        title: 'Van/Truck Rentals',
        description: 'Small to medium truck options',
        price: '$120/day',
        image: require("../assets/Truck Rentals.jpg"), // Placeholder image (Update path)
    },
];

// --- 💡 NEW DATA: LOGISTICS AND CARGO DETAIL DATA (From your new image) ---
const logisticsAndCargoDetails = [
    {
        id: 'goods_delivery',
        title: 'Goods Delivery',
        description: 'Local goods pickup & delivery',
        price: '$60',
        image: require("../assets/GoodsDElivery.jpg"), // Placeholder image (Replace with actual asset)
    },
    {
        id: 'intercity_transport',
        title: 'Intercity Transport',
        description: 'Long-distance load transport',
        price: '$250',
        image: require("../assets/Intercity Transport.jpg"), // Placeholder image (Replace with actual asset)
    },
    {
        id: 'cargo_forwarding',
        title: 'Cargo Forwarding',
        description: 'Freight forwarding support',
        price: '$400',
        image: require("../assets/Cargo forwarding.jpg"), // Placeholder image (Replace with actual asset)
    },
];
const specializedTransportDetails = [
{
id: 'temp_truck',
title: 'Temperature Controlled Truck',
description: 'Refrigerated transport',
 price: '$350',
 image: require("../assets/Temperature controlled.jpg"), // Placeholder image (Update path)
 },
{
 id: 'hazardous_handling',
 title: 'Hazardous Handling',
 description: 'Certified hazardous goods handling',
 price: '$500',
image: require("../assets/Hazardous handling.jpg"), // Placeholder image (Update path)
 },
];
// ---------------------------------------------------------------------------------

// --- NAVBAR COMPONENT (UNMODIFIED) ---
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
                 case "Raw Materials":
      navigation.navigate("ConstructionMaterial");
      break;
            default:
                console.warn("No navigation defined for", item);
        }
    };

    return (
        <View style={(styles as Style).navBarContainer}>
            <View style={(styles as Style).topBar}>
                <Text style={(styles as Style).logoText}>SWACHIFY INDIA</Text>
                <TouchableOpacity
                    onPress={() => setIsMenuOpen(!isMenuOpen)}
                    style={(styles as Style).hamburgerButton}
                >
                    <Text style={(styles as Style).hamburgerIcon}>{isMenuOpen ? "✕" : "☰"}</Text>
                </TouchableOpacity>
            </View>
            {isMenuOpen && (
                <View style={(styles as Style).dropdownMenu}>
                    {navItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={(styles as Style).menuItem}
                            onPress={() => handleMenuItemPress(item)}
                        >
                            <Text style={(styles as Style).menuText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

// --- SERVICE CARD SECTION (Horizontal) (UNMODIFIED) ---
const ServiceCardSection: React.FC = () => {
    return (
        <View style={serviceStyles.container}>
            <Text style={serviceStyles.headerTitle}>Our Services</Text>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={serviceStyles.cardGrid}
            >
                {serviceData.map((item, index) => (
                    <TouchableOpacity key={index} style={serviceStyles.cardWrapper}>
                        <View style={serviceStyles.imageContainer}>
                            <Image source={item.image} style={serviceStyles.cardImage} />
                        </View>
                        <Text style={serviceStyles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// --- NEW COMPONENT: Passenger Transport Details (UNMODIFIED) ---
const PassengerTransportDetails: React.FC<{onBack: () => void}> = ({ onBack }) => {
    return (
        <View style={detailStyles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={detailStyles.header}>
                    <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
                        <Text style={detailStyles.backButtonText}>{"< Back"}</Text>
                    </TouchableOpacity>
                    <Text style={detailStyles.headerTitle}>Passenger Transport</Text>
                </View>
                
                <View style={detailStyles.cardGrid}>
                    {passengerTransportDetails.map((item) => (
                        <View key={item.id} style={detailStyles.card}>
                            <Image source={item.image} style={detailStyles.cardImage} />
                            <View style={detailStyles.cardContent}>
                                <Text style={detailStyles.cardTitle}>{item.title}</Text>
                                <Text style={detailStyles.cardDescription}>{item.description}</Text>
                                <Text style={detailStyles.cardPrice}>{item.price}</Text>
                                <TouchableOpacity style={detailStyles.bookButton}>
                                    <Text style={detailStyles.bookButtonText}>Book Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};


// --- 💡 NEW COMPONENT: Logistics and Cargo Details ---
const LogisticsAndCargoDetails: React.FC<{onBack: () => void}> = ({ onBack }) => {
    return (
        <View style={detailStyles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={detailStyles.header}>
                    <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
                        <Text style={detailStyles.backButtonText}>{"< Back"}</Text>
                    </TouchableOpacity>
                    <Text style={detailStyles.headerTitle}>Logistics & Cargo</Text>
                </View>
                
                <View style={detailStyles.cardGrid}>
                    {logisticsAndCargoDetails.map((item) => (
                        <View key={item.id} style={detailStyles.card}>
                            <Image source={item.image} style={detailStyles.cardImage} />
                            <View style={detailStyles.cardContent}>
                                <Text style={detailStyles.cardTitle}>{item.title}</Text>
                                <Text style={detailStyles.cardDescription}>{item.description}</Text>
                                <Text style={detailStyles.cardPrice}>{item.price}</Text>
                                <TouchableOpacity style={detailStyles.bookButton}>
                                    <Text style={detailStyles.bookButtonText}>Book Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};
// --- 💡 NEW COMPONENT: Rental Services Details ---
const RentalServicesDetails: React.FC<{onBack: () => void}> = ({ onBack }) => {
    return (
        <View style={detailStyles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={detailStyles.header}>
                    <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
                        <Text style={detailStyles.backButtonText}>{"< Back"}</Text>
                    </TouchableOpacity>
                    <Text style={detailStyles.headerTitle}>Rental Services</Text>
                </View>
                
                <View style={detailStyles.cardGrid}>
                    {/* Map the new data array */}
                    {rentalServicesDetails.map((item) => (
                        <View key={item.id} style={detailStyles.card}>
                            <Image source={item.image} style={detailStyles.cardImage} />
                            <View style={detailStyles.cardContent}>
                                <Text style={detailStyles.cardTitle}>{item.title}</Text>
                                <Text style={detailStyles.cardDescription}>{item.description}</Text>
                                <Text style={detailStyles.cardPrice}>{item.price}</Text>
                                <TouchableOpacity style={detailStyles.bookButton}>
                                    <Text style={detailStyles.bookButtonText}>Book Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};
// ---------------------------------------------------------------------------------
// --- 💡 NEW COMPONENT: Specialized Transport Details ---
const SpecializedTransportDetails: React.FC<{onBack: () => void}> = ({ onBack }) => {
 
// Calculate the width for two items with no horizontal margin/padding
const cardWidth = (width / 2); // 50% of screen width

return (
<View style={detailStyles.container}>
 <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
<View style={detailStyles.header}>
 <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
<Text style={detailStyles.backButtonText}>{"< Back"}</Text>
</TouchableOpacity>
<Text style={detailStyles.headerTitle}>Specialized Transport</Text>
</View>
 
{/* 💡 INLINE STYLE MODIFICATION FOR 2-COLUMN, NO-GAP LAYOUT */}
<View style={[detailStyles.cardGrid, { justifyContent: 'flex-start', paddingHorizontal: 0 }]}>
 {specializedTransportDetails.map((item) => (
<View 
 key={item.id} 
 style={[detailStyles.card, { 
 width: cardWidth, // Full width to remove gap
 marginLeft: 0, 
 marginRight: 0, 
 borderRadius: 0, // Remove rounded corners to be flush
}]}
 >
<Image source={item.image} style={detailStyles.cardImage} />
<View style={detailStyles.cardContent}>
<Text style={detailStyles.cardTitle}>{item.title}</Text>
<Text style={detailStyles.cardDescription}>{item.description}</Text>
 <Text style={detailStyles.cardPrice}>{item.price}</Text>
 <TouchableOpacity style={detailStyles.bookButton}>
<Text style={detailStyles.bookButtonText}>Book Now</Text>
 </TouchableOpacity>
 </View>
 </View>
 ))}
 </View>
 </ScrollView>
 </View>
 );
};
// ---------------------------------------------------------------------------------

// --- MAIN SCREEN ---
export default function PackersAndMovers({ navigation }: StackScreenProps<any>) {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    // State to track which detail view is active inside the modal
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);    

    const handleViewDetails = (categoryKey: string) => {
        // This is the core logic that switches the content inside the already open modal
        setSelectedCategory(categoryKey);
    };
    
    // Function to close modal and reset selected category
    const closeModal = () => {
        setIsPopupVisible(false);
        setSelectedCategory(null);
    }
    
    // Function to navigate back from the details view to the category list
    const handleBackToCategories = () => {
        setSelectedCategory(null); // Resets the view back to the category list (Moving Services)
    }

    // Function to render the correct detail component based on selectedCategory
    const renderDetailView = () => {
        switch (selectedCategory) {
            case "passenger":
                return <PassengerTransportDetails onBack={handleBackToCategories} />;
            case "logistics":
                // 💡 RENDER THE NEW LOGISTICS COMPONENT HERE
                return <LogisticsAndCargoDetails onBack={handleBackToCategories} />;
            // Add other categories here if needed
           case "rental": // <--- 💡 NEW CASE ADDED HERE
            return <RentalServicesDetails onBack={handleBackToCategories} />;
           case "specialized": // <--- 💡 NEW CASE ADDED HERE
                return <SpecializedTransportDetails onBack={handleBackToCategories} />;
            default:
                // Fallback to the category list (Moving Services) if no category is selected, or if the user hits the back button
                return (
                    <View style={popupStyles.sheetContainer}>
                        <View style={popupStyles.sheetHeader}>
                            <Text style={popupStyles.sheetTitle}>Moving Services</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={popupStyles.closeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {/* List rows */}
                        {transportCategories.map((cat) => (
                            <View key={cat.key} style={popupStyles.rowCard}>
                                <Image source={cat.image} style={popupStyles.rowImage} />
                                <View style={popupStyles.rowTextWrap}>
                                    <Text style={popupStyles.rowTitle}>{cat.title}</Text>
                                    <Text style={popupStyles.rowSubtitle}>{cat.desc}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={popupStyles.rowButton}
                                    onPress={() => handleViewDetails(cat.key)}
                                >
                                    <Text style={popupStyles.rowButtonText}>View Details</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                );
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* NAVBAR */}
                <NavBar navigation={navigation} />

                {/* HERO and ServiceCardSection */}
                <View style={styles.heroContainer}>
                    <Image
                        source={require("../assets/transport.jpg")}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.textOverlay}>
                        <Text style={styles.heroTitle}>Stress-Free Relocation Services</Text>
                        <Text style={styles.heroSubtitle}>
                            From packing to delivery, we make your move effortless.
                        </Text>
                        <TouchableOpacity style={styles.bookButton}>
                            <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ServiceCardSection />

                {/* PACKERS & MOVERS PREMIUM CARD */}
                <View style={styles.pmContainer}>
                    <Text style={styles.pmTitle}>Packers & Movers</Text>
                    <Text style={styles.pmSubtitle}>
                        Safe, reliable, and affordable moving services for homes & businesses.
                    </Text>
                    <View style={styles.pmCard}>
                        <Image source={require("../assets/c1.jpg")} style={styles.pmImage} />
                        <View style={styles.pmContent}>
                            <Text style={styles.pmHeading}>Professional Moving Solutions</Text>
                            <Text style={styles.pmDescription}>
                                Our expert team handles packing, loading, transport, and unloading
                                with utmost care and efficiency.
                            </Text>
                            {/* Explore Services opens popup */}
                            <TouchableOpacity
                                style={styles.pmButton}
                                onPress={() => setIsPopupVisible(true)}
                            >
                                <Text style={styles.pmButtonText}>Explore Services</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* POPUP (compact rows or details view) */}
                <Modal
                    visible={isPopupVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <View style={popupStyles.modalOverlay}>
                        {/* 💡 Use the new render function to handle all modal views */}
                        {renderDetailView()}
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

// ===================================
// --- STYLES (UNMODIFIED) ---
// ===================================
const detailStyles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 18,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        maxHeight: height * 0.72,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        paddingRight: 15,
        paddingVertical: 5,
    },
    backButtonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: CONTAINER_PADDING / 2,
    },
    card: {
        width: DETAIL_CARD_WIDTH,
        marginBottom: CARD_MARGIN * 2,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 8,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        marginBottom: 6,
        minHeight: 25,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000',
        marginBottom: 8,
    },
    bookButton: {
        backgroundColor: '#000',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        width: '90%',
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});


const serviceStyles = StyleSheet.create({
    container: {
        paddingVertical: 25,
        backgroundColor: "#fff",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 25,
        color: "#333",
    },
    cardGrid: {
        flexDirection: "row",
        paddingHorizontal: CONTAINER_PADDING,
        alignItems: "flex-start",
    },
    cardWrapper: {
        width: CARD_SIZE,
        marginRight: CARD_MARGIN,
        alignItems: "center",
    },
    imageContainer: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 12,
        backgroundColor: "#fff",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        color: "#333",
        maxHeight: 30,
    },
});

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
    },
    hamburgerButton: {
        padding: 5,
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
        borderTopColor: "rgba(255, 255, 255, 0.2)",
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    menuText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    heroContainer: {
        width: "100%",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: 80,
    },
    heroImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    pmContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    pmTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
        color: "#333",
    },
    pmSubtitle: {
        textAlign: "center",
        color: "#555",
        fontSize: 15,
        marginBottom: 20,
    },
    pmCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
    },
    pmImage: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },
    pmContent: {
        padding: 15,
    },
    pmHeading: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222",
        marginBottom: 8,
    },
    pmDescription: {
        fontSize: 14,
        color: "#555",
        marginBottom: 12,
    },
    pmButton: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    pmButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "700",
    },

    textOverlay: {
        position: "absolute",
        left: 20,
        top: 60,
        width: "70%",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginLeft: 50,
    },
    heroTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    heroSubtitle: {
        color: "rgb(255, 255, 255)",
        fontSize: 16,
        marginBottom: 12,
    },
    bookButton: {
        backgroundColor: "#070707ff",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: "center",
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});

const popupStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheetContainer: {
        backgroundColor: "#fff",
        padding: 18,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        maxHeight: "72%",
        elevation: 20,
    },
    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
    },
    closeBtn: {
        fontSize: 22,
        color: "#333",
        padding: 6,
    },

    rowCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFF",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 12,
    },
    rowImage: {
        width: 56,
        height: 56,
        borderRadius: 10,
        marginRight: 12,
    },
    rowTextWrap: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111",
    },
    rowSubtitle: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    rowButton: {
        backgroundColor: "#000",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    rowButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
});