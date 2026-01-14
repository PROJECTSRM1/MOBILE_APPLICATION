import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Image,StatusBar, Modal, Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const SellItem = ({ navigation }: any) => {
  const [listingType, setListingType] = useState<'sell' | 'rent'>('sell');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [furnishingType, setFurnishingType] = useState('Unfurnished');
  const [description, setDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [sqft, setSqft] = useState('');
  const [bhk, setBhk] = useState('1 BHK');
  const [showBhkPicker, setShowBhkPicker] = useState(false);
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [landType, setLandType] = useState('Agriculture');
  const [showLandTypePicker, setShowLandTypePicker] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [distance, setDistance] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [price, setPrice] = useState('');

  const propertyTypes = [
    'Apartment', 'Villa', 'Independent House', 'Land', 'Bike', 'Car',
    'Lorry', 'Auto', 'Bus', 'Office', 'Hospital', 'Commercial Space'
  ];
  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'];
  const landTypeOptions = ['Agriculture', 'Commercial'];

  const isHouse = ['Apartment', 'Villa', 'Independent House'].includes(propertyType);
  const isLand = propertyType === 'Land';
  const isVehicle = ['Bike', 'Car', 'Lorry', 'Auto', 'Bus'].includes(propertyType);
  const isCommercial = ['Office', 'Hospital', 'Commercial Space'].includes(propertyType);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 - images.length }, (response) => {
      if (response.assets) {
        const newImages = response.assets.map(asset => asset.uri || '');
        setImages([...images, ...newImages]);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length <= 250) {
      setDescription(text);
      setWordCount(words.length);
    }
  };

  const validateForm = () => {
    if (images.length === 0) {
      Alert.alert('Error', 'Please upload at least one photo');
      return false;
    }
    if (!price) {
      Alert.alert('Error', 'Please enter the price');
      return false;
    }
    if (isHouse && (!sqft || !location || !area)) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    if (isLand && (!sqft || !location || !area || !ownerName)) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    if (isVehicle && (!brand || !model || !year || !distance || !ownerName || !mobileNumber)) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    if (isCommercial && (!sqft || !location || !area)) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    return true;
  };

  const handlePost = async () => {
    if (!validateForm()) return;

    const listing = {
      id: Date.now().toString(),
      type: listingType === 'sell' ? 'buy' : 'rent',
      propertyType,
      images,
      description,
      price,
      sqft,
      bhk: isHouse ? bhk : null,
      location,
      area,
      landType: isLand ? landType : null,
      furnishingType: isHouse ? furnishingType : null,
      ownerName: (isLand || isVehicle) ? ownerName : null,
      brand: isVehicle ? brand : null,
      model: isVehicle ? model : null,
      year: isVehicle ? year : null,
      distance: isVehicle ? distance : null,
      mobileNumber: isVehicle ? mobileNumber : null,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingListings = await AsyncStorage.getItem('marketplace_listings');
      const listings = existingListings ? JSON.parse(existingListings) : [];
      listings.push(listing);
      await AsyncStorage.setItem('marketplace_listings', JSON.stringify(listings));
      
      Alert.alert('Success', 'Your listing has been posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to post listing. Please try again.');
    }
  };

  const PickerModal = ({ visible, onClose, options, selectedValue, onSelect, title }: any) => (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option: string) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, selectedValue === option && styles.selectedOption]}
                onPress={() => { onSelect(option); onClose(); }}
              >
                <Text style={[styles.optionText, selectedValue === option && styles.selectedOptionText]}>
                  {option}
                </Text>
                {selectedValue === option && <MaterialIcons name="check" size={20} color="#135bec" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0c10" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell Item Form</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>LISTING TYPE</Text>
          <View style={styles.listingTypeContainer}>
            <TouchableOpacity
              style={[styles.listingTypeButton, listingType === 'sell' && styles.activeListingType]}
              onPress={() => setListingType('sell')}
            >
              <Text style={[styles.listingTypeText, listingType === 'sell' && styles.activeListingTypeText]}>
                Direct Sell
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.listingTypeButton, listingType === 'rent' && styles.activeListingType]}
              onPress={() => setListingType('rent')}
            >
              <Text style={[styles.listingTypeText, listingType === 'rent' && styles.activeListingTypeText]}>
                For Rent
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Add Photos</Text>
            <Text style={styles.photoLimit}>UP TO 10 PHOTOS</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              <MaterialIcons name="add-a-photo" size={32} color="#135bec" />
              <Text style={styles.uploadText}>UPLOAD</Text>
            </TouchableOpacity>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                  <MaterialIcons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>PROPERTY TYPE</Text>
          <TouchableOpacity onPress={() => setShowPropertyPicker(true)}>
            <View style={styles.pickerContainer} pointerEvents="none">
              <TextInput style={styles.picker} value={propertyType} editable={false} />
              <MaterialIcons name="expand-more" size={24} color="#94a3b8" style={styles.pickerIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>PRICE (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            placeholderTextColor="#4b5563"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {isHouse && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>SQFT</Text>
                <TextInput style={styles.input} placeholder="1200" placeholderTextColor="#4b5563"
                  keyboardType="numeric" value={sqft} onChangeText={setSqft} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>BHK</Text>
                <TouchableOpacity onPress={() => setShowBhkPicker(true)}>
                  <View style={styles.pickerContainer} pointerEvents="none">
                    <TextInput style={styles.picker} value={bhk} editable={false} />
                    <MaterialIcons name="expand-more" size={24} color="#94a3b8" style={styles.pickerIcon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>LOCATION</Text>
              <TextInput style={styles.input} placeholder="Full Address" placeholderTextColor="#4b5563"
                value={location} onChangeText={setLocation} />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>AREA</Text>
              <TextInput style={styles.input} placeholder="Downtown / Suburb" placeholderTextColor="#4b5563"
                value={area} onChangeText={setArea} />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>FURNISHING TYPE</Text>
              <View style={styles.furnishingContainer}>
                {['Unfurnished', 'Semi', 'Full'].map((type) => (
                  <TouchableOpacity key={type}
                    style={[styles.furnishingButton, furnishingType === type && styles.activeFurnishing]}
                    onPress={() => setFurnishingType(type)}
                  >
                    <Text style={[styles.furnishingText, furnishingType === type && styles.activeFurnishingText]}>
                      {type === 'Unfurnished' ? 'NO FURN.' : type === 'Semi' ? 'SEMI' : 'FULL'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {isLand && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>SQFT</Text>
                <TextInput style={styles.input} placeholder="5000" placeholderTextColor="#4b5563"
                  keyboardType="numeric" value={sqft} onChangeText={setSqft} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>LAND TYPE</Text>
                <TouchableOpacity onPress={() => setShowLandTypePicker(true)}>
                  <View style={styles.pickerContainer} pointerEvents="none">
                    <TextInput style={styles.picker} value={landType} editable={false} />
                    <MaterialIcons name="expand-more" size={24} color="#94a3b8" style={styles.pickerIcon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>LOCATION</Text>
              <TextInput style={styles.input} placeholder="City or Village" placeholderTextColor="#4b5563"
                value={location} onChangeText={setLocation} />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>AREA</Text>
              <TextInput style={styles.input} placeholder="Industrial Hub" placeholderTextColor="#4b5563"
                value={area} onChangeText={setArea} />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>REGISTERED OWNER NAME</Text>
              <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#4b5563"
                value={ownerName} onChangeText={setOwnerName} />
            </View>
          </View>
        )}

        {isVehicle && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>BRAND</Text>
                <TextInput style={styles.input} placeholder="Brand Name" placeholderTextColor="#4b5563"
                  value={brand} onChangeText={setBrand} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>MODEL</Text>
                <TextInput style={styles.input} placeholder="Model Name" placeholderTextColor="#4b5563"
                  value={model} onChangeText={setModel} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>YEAR</Text>
                <TextInput style={styles.input} placeholder="2024" placeholderTextColor="#4b5563"
                  keyboardType="numeric" value={year} onChangeText={setYear} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>DISTANCE (KM)</Text>
                <TextInput style={styles.input} placeholder="10000" placeholderTextColor="#4b5563"
                  keyboardType="numeric" value={distance} onChangeText={setDistance} />
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>VEHICLE OWNER NAME</Text>
              <TextInput style={styles.input} placeholder="Owner Name" placeholderTextColor="#4b5563"
                value={ownerName} onChangeText={setOwnerName} />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>MOBILE NUMBER</Text>
              <TextInput style={styles.input} placeholder="+91 98765 43210" placeholderTextColor="#4b5563"
                keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} />
            </View>
          </View>
        )}

        {isCommercial && (
          <View style={styles.section}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>SQFT</Text>
              <TextInput style={styles.input} placeholder="2000" placeholderTextColor="#4b5563"
                keyboardType="numeric" value={sqft} onChangeText={setSqft} />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>LOCATION</Text>
              <TextInput style={styles.input} placeholder="Full Address" placeholderTextColor="#4b5563"
                value={location} onChangeText={setLocation} />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>AREA</Text>
              <TextInput style={styles.input} placeholder="Business District" placeholderTextColor="#4b5563"
                value={area} onChangeText={setArea} />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>DESCRIPTION (MAX 250 WORDS)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share more details about your property or vehicle..."
            placeholderTextColor="#4b5563"
            multiline
            value={description}
            onChangeText={handleDescriptionChange}
          />
          <Text style={styles.wordCount}>{wordCount} / 250 words</Text>
        </View>

        <View style={{ height: 180 }} />
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post for {listingType === 'sell' ? 'Sale' : 'Rent'}</Text>
        </TouchableOpacity>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="home" size={24} color="#64748b" />
            <Text style={styles.navText}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="grid-view" size={24} color="#64748b" />
            <Text style={styles.navText}>SERVICES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#64748b" />
            <Text style={styles.navText}>WALLET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="person" size={24} color="#64748b" />
            <Text style={styles.navText}>PROFILE</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PickerModal visible={showPropertyPicker} onClose={() => setShowPropertyPicker(false)}
        options={propertyTypes} selectedValue={propertyType} onSelect={setPropertyType} title="Select Property Type" />
      <PickerModal visible={showBhkPicker} onClose={() => setShowBhkPicker(false)}
        options={bhkOptions} selectedValue={bhk} onSelect={setBhk} title="Select BHK" />
      <PickerModal visible={showLandTypePicker} onClose={() => setShowLandTypePicker(false)}
        options={landTypeOptions} selectedValue={landType} onSelect={setLandType} title="Select Land Type" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#232936' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  photoLimit: { fontSize: 12, fontWeight: '500', color: '#94a3b8', letterSpacing: 1 },
  photoScroll: { marginTop: 12 },
  uploadBox: { width: 110, height: 110, backgroundColor: '#161b26', borderWidth: 2, borderStyle: 'dashed', borderColor: '#232936', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  uploadText: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginTop: 4, letterSpacing: 1 },
  imageContainer: { width: 110, height: 110, borderRadius: 16, marginRight: 12, position: 'relative' },
  uploadedImage: { width: '100%', height: '100%', borderRadius: 16 },
  removeButton: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 12, padding: 4 },
  label: { fontSize: 12, fontWeight: '700', color: '#94a3b8', marginBottom: 8, letterSpacing: 1 },
  listingTypeContainer: { flexDirection: 'row', gap: 12 },
  listingTypeButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#161b26', borderWidth: 1, borderColor: '#232936', alignItems: 'center' },
  activeListingType: { backgroundColor: '#135bec', borderColor: '#135bec' },
  listingTypeText: { fontSize: 12, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  activeListingTypeText: { color: '#fff' },
  pickerContainer: { position: 'relative' },
  picker: { backgroundColor: '#161b26', borderWidth: 1, borderColor: '#232936', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '500', color: '#fff' },
  pickerIcon: { position: 'absolute', right: 16, top: '50%', marginTop: -12 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  halfField: { flex: 1 },
  fieldContainer: { marginBottom: 16 },
  input: { backgroundColor: '#161b26', borderWidth: 1, borderColor: '#232936', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '500', color: '#fff' },
  furnishingContainer: { flexDirection: 'row', gap: 8 },
  furnishingButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#161b26', borderWidth: 1, borderColor: '#232936', alignItems: 'center' },
  activeFurnishing: { backgroundColor: '#135bec', borderColor: '#135bec' },
  furnishingText: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  activeFurnishingText: { color: '#fff' },
  textArea: { backgroundColor: '#161b26', borderWidth: 1, borderColor: '#232936', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '500', color: '#fff', minHeight: 160, textAlignVertical: 'top' },
  wordCount: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textAlign: 'right', marginTop: 8, letterSpacing: 1 },
  bottomSection: { backgroundColor: 'rgba(10, 12, 16, 0.95)', borderTopWidth: 1, borderTopColor: '#232936', paddingTop: 16 },
  postButton: { backgroundColor: '#135bec', marginHorizontal: 16, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 4 },
  postButtonText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingBottom: 24 },
  navItem: { alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '700', color: '#64748b', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#161b26', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%', paddingBottom: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#232936' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  optionsList: { paddingHorizontal: 16, paddingTop: 8 },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#232936' },
  selectedOption: { backgroundColor: 'rgba(19, 91, 236, 0.1)' },
  optionText: { fontSize: 16, fontWeight: '500', color: '#fff' },
  selectedOptionText: { color: '#135bec', fontWeight: '600' },
});

export default SellItem;