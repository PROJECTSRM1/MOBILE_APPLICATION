import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

// 1. Expanded Data for all Home Sub-categories
const ROOM_PACKAGES: any = {
  "Kitchen Cleaning": [
    { id: "k1", title: "Chimney Cleaning", price: 799, category: "Kitchen", description: "Degreasing of filters and outer body" },
    { id: "k2", title: "Complete Kitchen Deep Cleaning", price: 1499, category: "Kitchen", description: "Cabinets, tiles, floor, and exhaust" },
    { id: "k3", title: "Fridge Deep Cleaning", price: 499, category: "Kitchen", description: "Internal tray cleaning and sanitization" },
  ],
  "Washroom Cleaning": [
    { id: "w1", title: "Intense Bathroom Cleaning", price: 599, category: "Bathroom", description: "Tile scrubbing and stain removal" },
    { id: "w2", title: "Bathroom Sanitization", price: 299, category: "Bathroom", description: "Kills 99.9% germs, floor mopping" },
  ],
  "Sofa Cleaning": [
    { id: "s1", title: "3-Seater Sofa Cleaning", price: 599, category: "Sofa", description: "Dry vacuuming and wet shampooing" },
    { id: "s2", title: "5-Seater Sofa Cleaning", price: 899, category: "Sofa", description: "Deep cleaning including cushions" },
    { id: "s3", title: "Cushion Cleaning (Set of 5)", price: 199, category: "Sofa", description: "Fabric stain removal and drying" },
  ],
  "Bedroom Cleaning": [
    { id: "bed1", title: "Bedroom Deep Cleaning", price: 999, category: "Bedroom", description: "Dusting, floor scrubbing & furniture cleaning" },
    { id: "bed2", title: "Mattress Cleaning", price: 499, category: "Bedroom", description: "UV-C treatment and deep vacuuming" },
  ],
  "Window Cleaning": [
    { id: "win1", title: "Full House Window Cleaning", price: 799, category: "Window", description: "Glass cleaning and mesh washing" },
    { id: "win2", title: "Balcony Glass Cleaning", price: 399, category: "Window", description: "Water stain removal from glass panels" },
  ],
  "Full Deep Cleaning": [
    { id: "f1", title: "1 BHK Full Deep Cleaning", price: 2499, category: "Full Home", description: "Intense cleaning of all rooms & kitchen" },
    { id: "f2", title: "2 BHK Full Deep Cleaning", price: 3499, category: "Full Home", description: "Includes balcony and storage rooms" },
    { id: "f3", title: "3 BHK Full Deep Cleaning", price: 4999, category: "Full Home", description: "Our most comprehensive home package" },
  ],
  // Commercial Packages
  "Small Office": [
    { id: "co1", title: "General Deep Cleaning", price: 2499, category: "Commercial", description: "Floor scrubbing, dusting, and trash removal" },
    { id: "co2", title: "Workstation Sanitization", price: 899, category: "Commercial", description: "Sanitizing desks, chairs, and electronics" },
    { id: "co3", title: "Pantry Deep Cleaning", price: 1200, category: "Commercial", description: "Cabinets, sink, and fridge cleaning" },
  ],
  "Medium Office": [
    { id: "co4", title: "Full Office Deep Cleaning", price: 4999, category: "Commercial", description: "Comprehensive cleaning for 500-2000 sqft" },
    { id: "co5", title: "Carpet Shampooing", price: 1999, category: "Commercial", description: "Industrial shampooing for large carpet areas" },
  ],
  "Large Corporate Office": [
    { id: "co6", title: "Site Inspection & Quote", price: 0, category: "Commercial", description: "Expert visit for 2000+ sqft estimation" },
    { id: "co7", title: "Washroom Block Sanitization", price: 2999, category: "Commercial", description: "Deep cleaning of multiple toilet blocks" },
  ],
  "Retail Shop/Showroom": [
    { id: "co8", title: "Storefront Glass Cleaning", price: 999, category: "Commercial", description: "Glass cleaning and entrance sanitization" },
    { id: "co9", title: "Display Shelf Dusting", price: 1499, category: "Commercial", description: "Meticulous dusting of inventory areas" },
  ],
  "Warehouse/Clinic": [
    { id: "co10", title: "Medical Grade Disinfection", price: 3499, category: "Commercial", description: "Hospital-standard sanitation protocols" },
    { id: "co11", title: "Industrial Floor Scrubbing", price: 5999, category: "Commercial", description: "Heavy duty machine scrubbing for warehouses" },
  ],
};

// 2. Banner Image Mapper
const BANNER_IMAGES: any = {
  "Kitchen Cleaning": require("../../assets/kitchen.jpg"),
  "Washroom Cleaning": require("../../assets/bathroom.jpg"),
  "Sofa Cleaning": require("../../assets/sofa.jpg"),
  "Bedroom Cleaning": require("../../assets/bedroom.jpg"),
  "Window Cleaning": require("../../assets/window.jpg"),
  "Full Deep Cleaning": require("../../assets/home.jpg"),
  "Small Office": require("../../assets/commercial.jpg"),
  "Medium Office": require("../../assets/commercial.jpg"),
  "Large Corporate Office": require("../../assets/commercial.jpg"),
  "Retail Shop/Showroom": require("../../assets/commercial.jpg"),
  "Warehouse/Clinic": require("../../assets/commercial.jpg"),
};

const CleaningDetailScreen = ({ route, navigation }: any) => {
  const { title } = route.params;
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Get data based on title passed from HomeSub
  const packages = ROOM_PACKAGES[title] || [];
  const bannerImage = BANNER_IMAGES[title] || require("../../assets/home.jpg");

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    try {
      const existing = await AsyncStorage.getItem("cartItems");
      setCartItems(existing ? JSON.parse(existing) : []);
    } catch (e) { console.log(e); }
  };

  const handleAddToCart = async (item: any) => {
    try {
      const existing = await AsyncStorage.getItem("cartItems");
      let cart = existing ? JSON.parse(existing) : [];
      
      const isItemInCart = cart.find((i: any) => i.id === item.id);

      if (isItemInCart) {
        cart = cart.filter((i: any) => i.id !== item.id);
      } else {
        cart.push(item);
      }

      await AsyncStorage.setItem("cartItems", JSON.stringify(cart));
      setCartItems(cart);
    } catch (e) { console.log(e); }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dynamic Banner */}
        <Image source={bannerImage} style={styles.banner} />
        
        <View style={styles.content}>
          <Text style={styles.mainTitle}>{title}</Text>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>4.8 (1.2M Bookings)</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Select Packages</Text>
          {packages.map((pkg: any) => {
            const isInCart = cartItems.some((i: any) => i.id === pkg.id);

            return (
              <View key={pkg.id} style={styles.pkgCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pkgTitle}>{pkg.title}</Text>
                  <Text style={styles.pkgPrice}>₹{pkg.price}</Text>
                  <Text style={styles.pkgDesc}>{pkg.description}</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.addBtn, isInCart && styles.addedBtn]} 
                  onPress={() => handleAddToCart(pkg)}
                >
                  <Text style={[styles.addBtnText, isInCart && styles.addedBtnText]}>
                    {isInCart ? "REMOVE" : "ADD"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Urban Company style Floating Cart Bar */}
      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingCart} 
          onPress={() => navigation.navigate("Cart")}
          activeOpacity={0.9}
        >
          <View>
            <Text style={styles.cartCountText}>{cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''}</Text>
            <Text style={styles.cartPriceText}>₹{totalPrice}</Text>
          </View>
          <View style={styles.viewCartAction}>
            <Text style={styles.cartActionText}>View Cart</Text>
            <MaterialIcons name="shopping-cart" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  banner: { width: '100%', height: 250 },
  content: { padding: 16, backgroundColor: colors.background, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  mainTitle: { fontSize: 24, fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingText: { marginLeft: 4, color: colors.subText, fontSize: 14 },
  divider: { height: 8, backgroundColor: colors.border, marginHorizontal: -16, marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  pkgCard: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  pkgTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  pkgPrice: { fontSize: 15, fontWeight: '700', color: colors.text, marginVertical: 4 },
  pkgDesc: { fontSize: 13, color: colors.subText, lineHeight: 18 },
  
  addBtn: { 
    borderWidth: 1, 
    borderColor: colors.primary, 
    borderRadius: 8, 
    paddingHorizontal: 20, 
    paddingVertical: 6, 
    height: 35,
    backgroundColor: '#fff',
    minWidth: 80,
    alignItems: 'center'
  },
  addedBtn: {
    backgroundColor: colors.primary,
  },
  addBtnText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  addedBtnText: { color: '#fff' },

  floatingCart: { 
    position: 'absolute', 
    bottom: 20, 
    left: 16, 
    right: 16, 
    backgroundColor: colors.primary, 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  cartCountText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700' },
  cartPriceText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  viewCartAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cartActionText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default CleaningDetailScreen;