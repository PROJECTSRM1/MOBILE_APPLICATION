// CleaningServicesScreen.tsx

import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ImageBackground,
    Modal,
    Animated,
    PanResponder,
    PanResponderGestureState,
    findNodeHandle,
} from 'react-native';
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
    type: 'Essential' | 'Premium' | 'Professional' | string;
    rating: number;
    image: any;
    benefits: string[];
    regularPrice: number;
    newUserPrice: number;
    optionsCount: number;
}

// Props for main service card
interface ServiceCardProps {
    service: ResidentialService;
    onViewDetails: (service: ResidentialService) => void;
}

// UPDATED: RoomService interface now includes id (for mapping) and is used for grid cards
interface RoomService {
    id: number;
    name: string;
    description: string;
    image: any;
    rating: number; // For the star rating in the image corner
    regularPrice: number; // Strikethrough price
    currentPrice: number; // Main price
    duration: string; // Time duration
}

// Data for the cleaning subcategories (as provided)
const cleaningSubCategories: ServiceCategory[] = [
    { name: "Residential Cleaning", targetRef: 'residentialSection', description: "Complete cleaning service solutions for homes, apartments, and villas", img: require("../assets/img1.png") },
    { name: "Commercial Cleaning", targetRef: 'commercialSection', description: "Professional cleaning service for offices, schools, and commercial spaces", img: require("../assets/img2.png") },
    { name: "Specialized Cleaning", targetRef: 'specializedSection', description: "Expert cleaning service for furniture, floors, windows, and sanitization", img: require("../assets/img3.png") },
    { name: "Industrial Cleaning", targetRef: 'industrialSection', description: "Heavy-duty cleaning for factories, warehouses, and industrial facilities", img: require("../assets/img4.jpg") },
    { name: "Post-Construction Cleaning", targetRef: 'postConstructionSection', description: "Complete cleanup after construction and renovation", img: require("../assets/img5.jpg") },
];

// Data for the residential services (kept the original structure)
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

// ----------------------
// NEW: Commercial Services (using same ResidentialService shape to reuse ServiceCard)
const commercialServices: ResidentialService[] = [
    {
        title: "Offices",
        type: "Professional",
        rating: 4.8,
        image: require('../assets/office.jpg'), // replace with your actual asset
        regularPrice: 2499,
        newUserPrice: 2199,
        optionsCount: 3,
        benefits: [
            "Workstation cleaning",
            "Washroom deep cleaning",
            "Floor scrubbing and mopping",
        ],
    },
    {
        title: "Shops & Malls",
        type: "Professional",
        rating: 4.7,
        image: require('../assets/shopmall.jpg'),
        regularPrice: 2999,
        newUserPrice: 2699,
        optionsCount: 3,
        benefits: [
            "Escalator area cleaning",
            "Glass & display cleaning",
            "Floor polishing",
        ],
    },
    {
        title: "Clinics & Labs",
        type: "Professional",
        rating: 4.9,
        image: require('../assets/clinic.png'),
        regularPrice: 3599,
        newUserPrice: 3299,
        optionsCount: 3,
        benefits: [
            "Sanitization",
            "Floor sterilization",
            "Equipment surface cleaning",
        ],
    },
    {
        title: "Schools",
        type: "Professional",
        rating: 4.6,
        image: require('../assets/schools.jpg'),
        regularPrice: 2799,
        newUserPrice: 2499,
        optionsCount: 3,
        benefits: [
            "Classroom cleaning",
            "Play area sanitization",
            "Washroom deep cleaning",
        ],
    },
];
// ----------------------

type CleaningServiceScreenProps = StackScreenProps<any, 'CleaningServiceScreen'>;

// --- 3. Bottom Sheet Component (FIXED: Restored Section 1 content for scrolling) ---
const BottomSheetModal: React.FC<{
    isVisible: boolean,
    onClose: () => void,
    selectedService: ResidentialService | null,
}> = ({ isVisible, onClose, selectedService }) => {
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
            }).start(() => {
                // Call onClose only after the animation completes
                if (!isVisible) {
                    onClose();
                }
            });
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
                // If dragged down far enough, close the modal
                if (gestureState.dy > 100) {
                    onClose();
                } else {
                    // Snap back to open position
                    Animated.spring(panY, {
                        toValue: SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT,
                        useNativeDriver: true,
                        bounciness: 5,
                    }).start();
                }
            },
        })
    ).current;

    if (!selectedService) {
        return null;
    }

    // Modal is only fully visible and content is rendered if isVisible is true
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            animationType="none"
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

                        <View style={detailedStyles.mainServiceSection}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image source={selectedService.image} style={detailedStyles.mainServiceImage} />
                                <View style={{ marginLeft: 15, flex: 1 }}>
                                    <Text style={detailedStyles.mainServiceTitle}>{selectedService.title}</Text>
                                    <Text style={detailedStyles.mainServiceRating}>⭐ {selectedService.rating} • {selectedService.type}</Text>
                                </View>
                            </View>

                            <View style={detailedStyles.priceRow}>
                                <Text style={detailedStyles.currentPrice}>₹{selectedService.newUserPrice.toLocaleString('en-IN')}</Text>
                                <Text style={detailedStyles.regularPrice}>₹{selectedService.regularPrice.toLocaleString('en-IN')}</Text>
                                <Text style={detailedStyles.priceTag}>NEW USER PRICE</Text>
                            </View>

                            <Text style={detailedStyles.sectionHeading}>What's Included?</Text>
                            {selectedService.benefits.map((benefit, index) => (
                                <Text key={index} style={detailedStyles.bulletPoint}>• {benefit}</Text>
                            ))}
                        </View>

                        <View style={detailedStyles.divider} />

                        {/* Bottom padding so sticky footer doesn't overlap */}
                        <View style={{ height: 96 }} />
                    </ScrollView>

                    {/* Sticky Footer */}
                    <View style={detailedStyles.stickyFooter}>
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
    const scrollViewRef = useRef<ScrollView | null>(null);
    const residentialSectionRef = useRef<View | null>(null);
    const commercialSectionRef = useRef<View | null>(null);

    const handleBackPress = () => {
        console.log("Navigating back...");
        // navigation.goBack(); // Uncomment if using actual navigation
    };

    const handleSubCategoryPress = (item: ServiceCategory) => {
        // Use findNodeHandle to get native node of scrollView for measureLayout
        const relativeNode = findNodeHandle(scrollViewRef.current);

        if (item.targetRef === 'residentialSection' && residentialSectionRef.current && relativeNode) {
            // measureLayout expects a native node number
            (residentialSectionRef.current as any).measureLayout(
                relativeNode,
                (x: number, y: number) => {
                    scrollViewRef.current?.scrollTo({ y: y - 10, animated: true });
                },
                () => console.log('Measure layout failed')
            );
            return;
        }

        if (item.targetRef === 'commercialSection' && commercialSectionRef.current && relativeNode) {
            (commercialSectionRef.current as any).measureLayout(
                relativeNode,
                (x: number, y: number) => {
                    scrollViewRef.current?.scrollTo({ y: y - 10, animated: true });
                },
                () => console.log('Measure layout failed')
            );
            return;
        }

        // You can add more sections here if needed (specializedSection, etc.)
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

    // Component to render the residential/commercial service card (keeps your existing layout)
    const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails }: ServiceCardProps) => (
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
                    {cleaningSubCategories.map((item: ServiceCategory, index: number) => (
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
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 15, paddingHorizontal: 5 }}>
                        Tap 'View details' on Unfurnished Home to see the customizable Room Cleaning section.
                    </Text>

                    {residentialServices.map((service: ResidentialService, index: number) => (
                        <ServiceCard key={index} service={service} onViewDetails={handleViewDetails} />
                    ))}
                </View>
                {/* --- END RESIDENTIAL SERVICE LIST SECTION --- */}

                {/* --- COMMERCIAL SERVICE LIST SECTION (NEW) --- */}
                <View ref={commercialSectionRef} style={screenStyles.serviceListSection}>
                    <Text style={screenStyles.sectionTitle}>Commercial Cleaning Services</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 15, paddingHorizontal: 5 }}>
                        Professional cleaning for offices, shops, clinics and schools.
                    </Text>

                    {commercialServices.map((service: ResidentialService, index: number) => (
                        <ServiceCard key={`commercial-${index}`} service={service} onViewDetails={handleViewDetails} />
                    ))}
                </View>
                {/* --- END COMMERCIAL SERVICE LIST SECTION --- */}
            </ScrollView>

            {/* --- BOTTOM SHEET MODAL --- */}
            <BottomSheetModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                selectedService={selectedService}
            />
        </View>
    );
};

// --- STYLES (screenStyles and detailedStyles combined/extended) ---

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
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
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

    /* === RESTORED MAIN SERVICE SECTION STYLES === */
    mainServiceSection: {
        paddingVertical: 8,
    },
    mainServiceImage: {
        width: 84,
        height: 84,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    mainServiceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    mainServiceRating: {
        fontSize: 14,
        color: '#666',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 8,
    },
    currentPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111',
        marginRight: 10,
    },
    regularPrice: {
        fontSize: 16,
        color: '#888',
        textDecorationLine: 'line-through',
        marginRight: 10,
    },
    priceTag: {
        fontSize: 12,
        color: '#D60000',
        backgroundColor: '#FFE9E9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontWeight: '600',
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
        lineHeight: 20,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 6,
        marginBottom: 6,
        color: '#111',
    },
    bulletPoint: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 18,
    },

    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    bottomSheetSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 14,
    },

    /* ROOM SPECIFIC FULL CARD STYLES */
    roomServiceList: {
        paddingHorizontal: 0,
    },
    roomCardContainerFull: {
        flexDirection: 'row', // Horizontal layout: Image | Content
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    roomCardImageFull: {
        width: 100, // Fixed width for the image
        height: '100%',
        minHeight: 140, // Minimum height to align with content
        resizeMode: 'cover',
    },
    roomCardContentFull: {
        flex: 1,
        padding: 12,
    },
    roomCardHeaderRowFull: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    roomCardTitleGroupFull: {
        flexShrink: 1,
    },
    roomCardTitleFull: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    roomEssentialRowFull: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    roomEssentialTextFull: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginRight: 10,
    },
    roomStarIconFull: {
        fontSize: 12,
        color: '#666',
    },
    roomAddButtonFull: {
        backgroundColor: '#fff',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderRadius: 5,
        marginLeft: 10,
    },
    roomAddButtonTextFull: {
        color: '#FF0000',
        fontSize: 13,
        fontWeight: 'bold',
    },
    roomPriceRowFull: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    roomCurrentPriceFull: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginRight: 8,
    },
    roomRegularPriceFull: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    roomPriceLabelFull: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#28A745',
        backgroundColor: '#E6F7EB',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roomDescriptionTextFull: {
        fontSize: 12,
        color: '#555',
        marginBottom: 10,
    },
    roomDetailsButtonFull: {
        alignSelf: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: 5,
    },
    roomDetailsButtonTextFull: {
        color: '#FF0000',
        fontSize: 13,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

    /* sticky footer */
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    checkoutButton: {
        backgroundColor: '#FF0000',
        borderRadius: 8,
        paddingVertical: 14,
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
