import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ImageBackground, Modal, Animated, PanResponder, PanResponderGestureState, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StackScreenProps } from "@react-navigation/stack";

const { width } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.85; // 85% of screen height

// --- 1. Define TypeScript Interfaces ---

interface ServiceCategory {
    name: string;
    targetRef: string;
    description: string;
    img: any;
}

// Keeping ResidentialService as the full service structure for the main screen
interface ResidentialService {
    title: string;
    type: 'Essential' | 'Premium';
    rating: number;
    image: any;
    benefits: string[];
    regularPrice: number;
    newUserPrice: number;
    optionsCount: number;
}

interface ServiceCardProps {
    service: ResidentialService;
    onViewDetails: (service: ResidentialService) => void;
}

// UPDATED: RoomService interface to match the new detailed horizontal card requirements
interface RoomService {
    name: string;
    description: string;
    image: any; 
    rating: number; // For the star rating in the image corner
    regularPrice: number; // Strikethrough price
    currentPrice: number; // Main price
    duration: string; // Time duration
}

// ----------------------------------------

// --- 2. Data for the Room-Specific Services (UPDATED) ---
// NOTE: Please ensure these image assets exist in your project path: '../assets/i1.png', etc.
const roomServices: RoomService[] = [
    {
        name: "Living Room Cleaning",
        description: "Deep cleaning of living room including furniture and floors.",
        image: require('../assets/i1.png'), // Replace with your image
        rating: 4.8,
        regularPrice: 799,
        currentPrice: 699,
        duration: "1 hr",
    },
    {
        name: "Bedroom Deep Cleaning",
        description: "Thorough cleaning of bedrooms including mattress and wardrobes.",
        image: require('../assets/i2.webp'), // Replace with your image
        rating: 4.9,
        regularPrice: 649,
        currentPrice: 549,
        duration: "1 hr 30 min",
    },
    {
        name: "Kitchen Deep Cleaning",
        description: "Complete kitchen cleaning with appliances and surfaces.",
        image: require('../assets/i3.webp'), // Replace with your image
        rating: 4.7,
        regularPrice: 1099,
        currentPrice: 999,
        duration: "2 hr",
    },
    {
        name: "Bathroom Sanitization",
        description: "Sanitization and deep cleaning of bathrooms.",
        image: require('../assets/i4.jpeg'), // Replace with your image
        rating: 4.9,
        regularPrice: 699,
        currentPrice: 599,
        duration: "1 hr 15 min",
    },
];

// Data for the cleaning subcategories (as provided)
// NOTE: Please ensure these image assets exist in your project path: '../assets/img1.png', etc.
const cleaningSubCategories: ServiceCategory[] = [
    { name: "Residential Cleaning", targetRef: 'residentialSection', description: "Complete cleaning service solutions for homes, apartments, and villas", img: require("../assets/img1.png") }, 
    { name: "Commercial Cleaning", targetRef: 'commercialSection', description: "Professional cleaning service for offices, schools, and commercial spaces", img: require("../assets/img2.png") },
    { name: "Specialized Cleaning", targetRef: 'specializedSection', description: "Expert cleaning service for furniture, floors, windows, and sanitization", img: require("../assets/img3.png") },
    { name: "Industrial Cleaning", targetRef: 'industrialSection', description: "Heavy-duty cleaning for factories, warehouses, and industrial facilities", img: require("../assets/img4.jpg") },
    { name: "Post-Construction Cleaning", targetRef: 'postConstructionSection', description: "Complete cleanup after construction and renovation", img: require("../assets/img5.jpg") },
];

// Data for the residential services (kept the original structure)
// NOTE: Please ensure these image assets exist in your project path: '../assets/apartments.png', etc.
const residentialServices: ResidentialService[] = [
    { 
        title: "Furnished Apartment Deep Clean", 
        type: "Essential", 
        rating: 4.8, 
        image: require('../assets/apartments.png'), 
        regularPrice: 3149,
        newUserPrice: 2949,
        optionsCount: 5,
        benefits: [
            "Bathroom and kitchen deep cleaning",
            "Wiping and mopping of complete floor area",
            "Cobweb removal and wall dry dusting",
            "Balcony and utility area cleaning",
        ],
    },
    
    { 
        title: "Unfurnished Home Deep Clean (Tap to customize)", 
        type: "Premium", 
        rating: 4.9, 
        image: require('../assets/homes.jpg'), 
        regularPrice: 2700,
        newUserPrice: 2300,
        optionsCount: 5,
        benefits: [
            "Includes all essential features",
            "Intensive cleaning of all cabinets and wardrobes",
            "Window channel cleaning and exterior dusting",
            "Steam sterilization of washrooms",
        ],
    },
    { 
        title: "Unfurnished Villa Deep Clean", 
        type: "Premium", 
        rating: 5.0, 
        image: require('../assets/villas.jpg'), 
        regularPrice: 3800,
        newUserPrice: 3500,
        optionsCount: 5,
        benefits: [
            "Full Essential Villa Cleaning included",
            "High-pressure wash for exterior surfaces and garage",
        ],
    },
];

type CleaningServiceScreenProps = StackScreenProps<any, 'CleaningServiceScreen'>;


// --- 3. Room Service Detail Card Component (for inside the Bottom Sheet) - NEW HORIZONTAL STYLE ---
const RoomServiceCard: React.FC<{ service: RoomService }> = ({ service }) => (
    <View style={detailedStyles.roomCardContainer}>
        {/* Card Header Image and Rating */}
        <ImageBackground 
            source={service.image} 
            style={detailedStyles.roomCardImage}
            imageStyle={{ borderRadius: 8 }} // Apply border radius to the image itself
        >
            <View style={detailedStyles.ratingContainer}>
                <Text style={detailedStyles.ratingText}>⭐ {service.rating}</Text>
            </View>
        </ImageBackground>

        {/* Card Content */}
        <View style={detailedStyles.roomCardContent}>
            <Text style={detailedStyles.roomCardTitle}>{service.name}</Text>
            <Text style={detailedStyles.roomCardDescription}>{service.description}</Text>
            
            <View style={detailedStyles.durationRow}>
                <Text style={detailedStyles.durationText}>🕒 {service.duration}</Text>
            </View>

            {/* Price Row (Removed Add Button) */}
            <View style={detailedStyles.priceAndButtonRow}>
                <View style={detailedStyles.priceGroup}>
                    <Text style={detailedStyles.roomCurrentPrice}>₹{service.currentPrice}</Text>
                    <Text style={detailedStyles.roomRegularPrice}>₹{service.regularPrice}</Text>
                </View>

                {/* The ADD button is intentionally removed here */}
            </View>
        </View>
    </View>
);

// --- 4. Bottom Sheet Component ---
const BottomSheetModal: React.FC<{ isVisible: boolean, onClose: () => void }> = ({ isVisible, onClose }) => {
    // Animation logic
    const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    React.useEffect(() => {
        if (isVisible) {
            Animated.timing(panY, {
                toValue: SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(panY, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start(onClose);
        }
    }, [isVisible]);

    // PanResponder for drag-to-close
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            
            onPanResponderMove: (e, gestureState: PanResponderGestureState) => {
                const newY = SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT + gestureState.dy;
                if (newY >= SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT) {
                    panY.setValue(newY);
                }
            },
            
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 100) {
                    onClose();
                } else {
                    Animated.spring(panY, {
                        toValue: SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT,
                        useNativeDriver: true,
                        bounciness: 5,
                    }).start();
                }
            },
        })
    ).current;


    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={detailedStyles.modalOverlay}>
                <Animated.View
                    style={[detailedStyles.bottomSheet, { transform: [{ translateY: panY }] }]}
                    {...panResponder.panHandlers}
                >
                    {/* Handle Bar */}
                    <View style={detailedStyles.handleBar} />

                    {/* Content */}
                    <ScrollView contentContainerStyle={detailedStyles.bottomSheetContent}>
                        <Text style={detailedStyles.bottomSheetTitle}>Room Specific Deep Cleaning</Text>
                        <Text style={detailedStyles.bottomSheetSubtitle}>Select specific areas to clean in your Unfurnished Home</Text>

                        {/* Renders the NEW style RoomServiceCard components */}
                        <View style={detailedStyles.roomServiceGrid}>
                            {roomServices.map((service, index) => (
                                <RoomServiceCard key={index} service={service} />
                            ))}
                        </View>
                        
                    </ScrollView>

                    {/* Sticky Footer */}
                    <View style={detailedStyles.stickyFooter}>
                        {/* Placeholder button for checkout, since Add is removed from cards */}
                        <TouchableOpacity style={detailedStyles.checkoutButton}>
                            <Text style={detailedStyles.checkoutButtonText}>Proceed to Checkout (4 Items)</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};
// ----------------------------------------


const CleaningServiceScreen: React.FC<CleaningServiceScreenProps> = ({ navigation }) => {
    
    // --- State for Modal ---
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedService, setSelectedService] = useState<ResidentialService | null>(null);

    // --- Refs for Scrolling ---
    const scrollViewRef = useRef<ScrollView>(null);
    const residentialSectionRef = useRef<View>(null);

    const handleBackPress = () => {
        // Mock function for navigation back
        console.log("Navigating back...");
        // navigation.goBack(); // Uncomment if using actual navigation
    };

    const handleSubCategoryPress = (item: ServiceCategory) => {
        if (item.targetRef === 'residentialSection' && residentialSectionRef.current && scrollViewRef.current) {
            residentialSectionRef.current.measureLayout(
                scrollViewRef.current as any,
                (x, y) => {
                    scrollViewRef.current?.scrollTo({ y: y - 10, animated: true }); 
                },
                () => console.log('Measure layout failed')
            );
        }
    };

    // --- Handler for View Details Button ---
    const handleViewDetails = (service: ResidentialService) => {
        // Only show the bottom sheet for the service title that includes "Unfurnished Home Deep Clean"
        if (service.title.includes("Unfurnished Home Deep Clean")) {
            setSelectedService(service);
            setIsModalVisible(true);
        } else {
             // Handle navigation or other actions for other services here
             console.log(`Viewing details for: ${service.title}`);
        }
    };

    // Component to render the residential service card (UPDATED TO SHOW VIEW DETAILS AS A BUTTON)
    const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails }) => (
        <View style={screenStyles.serviceCardContainer}>
            <Image source={service.image} style={screenStyles.serviceCardImage} />
            <View style={screenStyles.serviceCardContent}>
                
                <View style={screenStyles.cardHeaderRow}>
                    <View style={screenStyles.cardTitleGroup}>
                        <Text style={screenStyles.serviceCardTitle}>{service.title}</Text>
                        <View style={screenStyles.essentialRow}>
                            <Text style={screenStyles.essentialText}>{service.type}</Text>
                            <Text style={screenStyles.starIcon}>⭐ {service.rating}</Text>
                        </View>
                    </View>

                    {/* The ADD button and options count are REMOVED here from the main screen card */}
                </View>

                <View style={screenStyles.priceRow}>
                    <Text style={screenStyles.newUserPriceText}>₹{service.newUserPrice.toLocaleString('en-IN')}</Text>
                    <Text style={screenStyles.regularPriceText}>₹{service.regularPrice.toLocaleString('en-IN')}</Text>
                    <Text style={screenStyles.newUserPriceLabel}>NEW USER PRICE</Text>
                </View>
                
                <View style={screenStyles.benefitsContainer}>
                    {service.benefits.slice(0, 2).map((benefit: string, index: number) => (
                        <Text key={index} style={screenStyles.benefitText}>
                            • {benefit}
                        </Text>
                    ))}
                </View>

                {/* VIEW DETAILS AS A BUTTON */}
                <View style={screenStyles.viewDetailsButtonWrapper}>
                    <TouchableOpacity 
                        onPress={() => onViewDetails(service)} 
                        style={screenStyles.viewDetailsButton} 
                    >
                        <Text style={screenStyles.viewDetailsButtonText}>View details &gt;</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );


    return (
        <View style={screenStyles.container}>
            
            {/* Header Image Background with Nav Bar */}
            {/* NOTE: Please ensure the image asset exists in your project path: '../assets/head1.jpg' */}
            <ImageBackground
                source={require('../assets/head1.jpg')} 
                style={screenStyles.headerImage}
                resizeMode="cover"
            >
                <View style={screenStyles.headerOverlay} />
                <View style={screenStyles.headerNavBar}>
                    
                    {/* Back Button */}
                    <TouchableOpacity onPress={handleBackPress} style={screenStyles.navButton}>
                        <Text style={screenStyles.navIcon}>←</Text> 
                    </TouchableOpacity>
                    
                    {/* Screen Title */}
                    <Text style={screenStyles.headerTitleText}>Cleaning Services</Text>
                    
                    {/* Cart/Profile Button */}
                    <TouchableOpacity onPress={() => { console.log('Cart pressed') }} style={screenStyles.navButton}>
                        <Text style={screenStyles.navIcon}>🛒</Text> 
                    </TouchableOpacity>
                </View>

                {/* Search Bar (like the reference image) */}
                <View style={screenStyles.searchBarContainer}>
                    <Text style={screenStyles.searchIcon}>🔍</Text>
                    <Text style={screenStyles.searchBarPlaceholder}>Search Kitchen Cleaning</Text>
                </View>

            </ImageBackground>

            {/* Main Content Scroll View */}
            <ScrollView style={{ flex: 1 }} ref={scrollViewRef}>
                {/* Horizontal Category Row */}
                <Text style={[screenStyles.sectionTitle, { paddingHorizontal: 20, paddingTop: 20 }]}>Explore Categories</Text>
                
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={screenStyles.horizontalScrollContainer}
                >
                    {cleaningSubCategories.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={screenStyles.horizontalCard}
                            onPress={() => handleSubCategoryPress(item)} 
                        >
                            <Image source={item.img} style={screenStyles.horizontalCardImage} />
                            <Text style={screenStyles.horizontalCardTitle}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                
                {/* --- RESIDENTIAL SERVICE LIST SECTION --- */}
                <View ref={residentialSectionRef} style={screenStyles.serviceListSection}>
                    <Text style={screenStyles.sectionTitle}>Residential Cleaning Services</Text>
                    <Text style={{fontSize: 14, color: '#666', marginBottom: 15, paddingHorizontal: 5}}>Tap 'View details' on Unfurnished Home to see the customizable Room Cleaning section.</Text>

                    {residentialServices.map((service, index) => (
                        <ServiceCard key={index} service={service} onViewDetails={handleViewDetails} />
                    ))}
                </View>
                {/* --- END RESIDENTIAL SERVICE LIST SECTION --- */}
                
            </ScrollView>

            {/* --- BOTTOM SHEET MODAL --- */}
            <BottomSheetModal 
                isVisible={isModalVisible} 
                onClose={() => setIsModalVisible(false)} 
            />
            
        </View>
    );
};

// --- STYLES ---

const screenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    headerImage: {
        height: 250, 
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    headerNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 50, // For status bar/notch
    },
    navButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: 20,
    },
    navIcon: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    headerTitleText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    searchIcon: {
        marginRight: 10,
        fontSize: 18,
        color: '#777',
    },
    searchBarPlaceholder: {
        fontSize: 16,
        color: '#999',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 15,
    },

    // --- HORIZONTAL CATEGORY STYLES (MAIN SCREEN) ---
    horizontalScrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10, 
    },
    horizontalCard: {
        width: 90, 
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
        paddingBottom: 10, 
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    horizontalCardImage: {
        width: 70, 
        height: 70, 
        borderRadius: 8,
        resizeMode: 'cover',
        marginBottom: 5,
    },
    horizontalCardTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },

    // --- RESIDENTIAL SERVICE CARD STYLES (MAIN SCREEN) ---
    serviceListSection: {
        padding: 20,
        paddingTop: 0, 
    },
    serviceCardContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceCardImage: {
        width: '100%',
        height: width * 0.5, 
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    serviceCardContent: {
        padding: 15,
    },
    // UPDATED: No longer justifying space-between, since the right element is removed.
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Adjusted to start alignment
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cardTitleGroup: {
        flexShrink: 1,
    },
    serviceCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    essentialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    essentialText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginRight: 10,
    },
    starIcon: {
        fontSize: 12,
        color: '#555',
    },
    // REMOVED addButton, addButtonText, optionsCountText styles
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10, // Added margin top for better spacing after removing the button
    },
    regularPriceText: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 10,
    },
    newUserPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginRight: 10,
    },
    newUserPriceLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FF0000',
        backgroundColor: '#FFEEEE',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    benefitsContainer: {
        marginTop: 5,
        marginBottom: 15,
    },
    benefitText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 20,
    },
    viewDetailsButtonWrapper: {
        alignItems: 'flex-start', 
    },
    // --- VIEW DETAILS BUTTON STYLES (NEW) ---
    viewDetailsButton: {
        backgroundColor: '#FF0000', // Red background color
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewDetailsButtonText: {
        color: '#fff', // White text color
        fontSize: 14,
        fontWeight: '600',
    },
    // ---------------------------------
});


// --- NEW DETAILED MODAL STYLES (APPLIED TO BOTTOM SHEET CONTENT) ---
const detailedStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: 'white',
        width: '100%',
        height: BOTTOM_SHEET_HEIGHT,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    bottomSheetContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for the sticky footer
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 5,
    },
    bottomSheetSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    roomServiceGrid: {
        flexDirection: 'column', // Stack cards vertically
        justifyContent: 'flex-start',
    },
    
    // --- ROOM SERVICE CARD NEW STYLE (Horizontal Card inside Modal) ---
    roomCardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
        overflow: 'hidden',
        width: '100%', 
        flexDirection: 'row', 
        height: 130, // Fixed height for a horizontal card
    },
    roomCardImage: {
        width: '70%', 
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        padding: 8,
    },
    ratingContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: 'flex-start',
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    roomCardContent: {
        width: '60%', 
        padding: 10,
        justifyContent: 'space-between',
        marginLeft:-97,
    },
    roomCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    roomCardDescription: {
        fontSize: 11,
        color: '#666',
        marginBottom: 5,
    },
    durationRow: {
        flexDirection: 'row',
    },
    durationText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
        paddingTop: 3,
    },
    priceAndButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Already updated in the last iteration
        alignItems: 'center',
        marginTop: 5,
    },
    priceGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomCurrentPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginRight: 5,
    },
    roomRegularPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    // --- END ROOM SERVICE CARD NEW STYLE ---

    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    checkoutButton: {
        backgroundColor: '#FF0000', 
        borderRadius: 8,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CleaningServiceScreen;