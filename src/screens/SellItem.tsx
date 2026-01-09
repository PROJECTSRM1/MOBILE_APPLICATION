import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';

const MAX_PHOTOS = 10;

const SellItem: React.FC = () => {
  const [photos, setPhotos] = useState<Asset[]>([]);

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

    if (!result.didCancel && result.assets) {
      addPhotos(result.assets);
    }
  };

  const openGallery = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.8,
    });

    if (!result.didCancel && result.assets) {
      addPhotos(result.assets);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Sell Item</Text>
        <Text style={styles.help}>Help</Text>
      </View>

      {/* Add Photos */}
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

      {/* Form Fields */}
      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} placeholder="Select category" />

      <Text style={styles.label}>Ad Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2BHK Apartment in Downtown"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="$ 0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe what you are selling..."
        multiline
      />

      {/* Submit */}
      <TouchableOpacity style={styles.postBtn}>
        <Text style={styles.postText}>Post Item</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SellItem;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  help: {
    color: '#3B82F6',
    fontWeight: '600',
  },

  label: {
    color: '#9CA3AF',
    marginTop: 14,
    marginBottom: 6,
    fontWeight: '600',
  },

  photosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  addPhoto: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 22,
  },
  addText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },

  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#111827',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 16,
  },

  input: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },

  postBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  postText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
