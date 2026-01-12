import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';

const MAX_PHOTOS = 10;

const VALID_CATEGORIES = ['Tech', 'Vehicles', 'Housing'];

const SellItem: React.FC = () => {
  const navigation = useNavigation<any>();

  const [photos, setPhotos] = useState<Asset[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const openPicker = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    });

    if (!result.didCancel && result.assets) addPhotos(result.assets);
  };

  const openGallery = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.8,
    });

    if (!result.didCancel && result.assets) addPhotos(result.assets);
  };

  const addPhotos = (newPhotos: Asset[]) => {
    if (photos.length + newPhotos.length > MAX_PHOTOS) {
      Alert.alert(`You can upload up to ${MAX_PHOTOS} photos`);
      return;
    }
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ FIXED POST HANDLER
const handlePostItem = async () => {
  if (!title || !price || !category) {
    Alert.alert('Error', 'Please fill in Title, Category and Price');
    return;
  }

  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  if (!VALID_CATEGORIES.includes(normalizedCategory)) {
    Alert.alert('Invalid Category', 'Use one of: Tech, Vehicles, Housing');
    return;
  }

  const newItem = {
    id: Date.now().toString(),
    title,
    price: price.startsWith('$') ? price : `$${price}`,
    location: 'Local Area',
    image:
      photos.length > 0 && photos[0].uri
        ? { uri: photos[0].uri }
        : require('../../assets/iphone.jpg'),
    category: normalizedCategory,
    topType: 'TOP_PICKS',
  };

  try {
    // Get existing items
    const existing = await AsyncStorage.getItem('MARKETPLACE_ITEMS');
    const parsed = existing ? JSON.parse(existing) : [];

    // Add new item
    const updated = [newItem, ...parsed];

    // Save to storage
    await AsyncStorage.setItem('MARKETPLACE_ITEMS', JSON.stringify(updated));

    // Show success first
    Alert.alert('Success', 'Item added successfully', [
      {
        text: 'OK',
        onPress: () => {
          // Navigate only once, with the new item
          navigation.navigate('Marketplace', { newItem });
        },
      },
    ]);
  } catch (error) {
    Alert.alert('Error', 'Failed to save item');
    console.log(error);
  }
};



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Sell Item</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.help}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Add Photos</Text>
        <View style={styles.photosRow}>
          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity style={styles.addPhoto} onPress={openPicker}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          )}

          {photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePhoto(index)}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Tech / Vehicles / Housing"
          placeholderTextColor="#6B7280"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Ad Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. iPhone 15"
          placeholderTextColor="#6B7280"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="$ 0.00"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe what you are selling..."
          placeholderTextColor="#6B7280"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.postBtn} onPress={handlePostItem}>
          <Text style={styles.postText}>Post Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellItem;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  help: { color: '#3B82F6', fontWeight: '600' },
  label: { color: '#9CA3AF', marginTop: 14, marginBottom: 6, fontWeight: '600' },
  photosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  addPhoto: { width: 100, height: 100, borderRadius: 12, borderWidth: 1, borderColor: '#374151', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { fontSize: 22 },
  addText: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
  photoWrapper: { position: 'relative' },
  photo: { width: 100, height: 100, borderRadius: 12 },
  removeBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: '#111827', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  removeText: { color: '#fff', fontSize: 16 },
  input: { backgroundColor: '#111827', borderRadius: 10, padding: 12, color: '#fff' },
  textArea: { height: 90, textAlignVertical: 'top' },
  postBtn: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  postText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});