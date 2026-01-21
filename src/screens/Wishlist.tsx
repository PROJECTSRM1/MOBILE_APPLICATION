import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wishlist({ navigation }: any) {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const stored = await AsyncStorage.getItem("wishlist_items");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  };

  const removeItem = async (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    await AsyncStorage.setItem("wishlist_items", JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Wishlist</Text>
        <View style={{ width: 24 }} />
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="favorite-border" size={48} color="#6b7280" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.price}>₹{item.price}</Text>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.id)}
                >
                  <Icon name="delete" size={18} color="#ef4444" />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101622" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  title: { color: "#fff", fontSize: 18, fontWeight: "700" },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 15,
  },

 card: {
  flexDirection: "row",
  backgroundColor: "#1c212e",
  borderRadius: 14,
  marginBottom: 16,
  padding: 12,
  elevation: 4, // Android shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
},

image: {
  width: 90,
  height: 90,
  borderRadius: 10,
  backgroundColor: "#374151",
},

 info: {
  flex: 1,
  marginLeft: 12,
  justifyContent: "space-between",
},

  name: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
},

price: {
  color: "#3b82f6",
  fontSize: 16,
  fontWeight: "700",
},

removeBtn: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  alignSelf: "flex-start",
  marginTop: 4,
},

  removeText: {
    color: "#ef4444",
    fontWeight: "600",
  },
});
