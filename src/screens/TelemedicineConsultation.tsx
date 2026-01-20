import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// SOLUTION 1: Using expo-document-picker (if using Expo)
// import * as DocumentPicker from 'expo-document-picker';

// SOLUTION 2: Using react-native-image-picker for images only
import { launchImageLibrary } from 'react-native-image-picker';

import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { 
  ArrowLeft, Mic, MicOff, Phone, Video, 
  Download, ClipboardCheck, Microscope, 
  FileText, Search 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface FileItem {
  id: string;
  name: string;
  uploadedBy: string;
  time: string;
  type: 'prescription' | 'test';
  path: string; 
}

const STORAGE_KEY = '@consultation_files';

const TelemedicineConsultation: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isMuted, setIsMuted] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const storedFiles = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFiles) setFiles(JSON.parse(storedFiles));
    } catch (e) {
      console.error("Failed to load files", e);
    }
  };

  // SOLUTION 2: Using react-native-image-picker (works for images/photos)
  const handleUpload = async (type: 'prescription' | 'test') => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log("User cancelled picker");
        return;
      }

      if (result.errorCode) {
        Alert.alert("Error", result.errorMessage || "Failed to pick image");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `file_${Date.now()}.jpg`;
        const sourceUri = asset.uri;

        if (!sourceUri) {
          Alert.alert("Error", "Could not access file");
          return;
        }

        const dir = ReactNativeBlobUtil.fs.dirs.DocumentDir;
        const destPath = `${dir}/${fileName}`;

        // Copy file to permanent storage
        const cleanUri = sourceUri.replace('file://', '');
        await ReactNativeBlobUtil.fs.cp(cleanUri, destPath);

        const newFile: FileItem = {
          id: Date.now().toString(),
          name: fileName,
          uploadedBy: 'PATIENT',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: type,
          path: destPath
        };

        const updatedFiles = [newFile, ...files];
        setFiles(updatedFiles);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
        
        Alert.alert("Success", "Document uploaded and saved successfully!");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to upload document");
      console.error(err);
    }
  };

  /* 
  // SOLUTION 1: If using Expo, use this instead:
  const handleUploadExpo = async (type: 'prescription' | 'test') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User cancelled picker");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name;
        const sourceUri = asset.uri;

        const dir = ReactNativeBlobUtil.fs.dirs.DocumentDir;
        const destPath = `${dir}/${fileName}`;

        await ReactNativeBlobUtil.fs.cp(sourceUri, destPath);

        const newFile: FileItem = {
          id: Date.now().toString(),
          name: fileName,
          uploadedBy: 'PATIENT',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: type,
          path: destPath
        };

        const updatedFiles = [newFile, ...files];
        setFiles(updatedFiles);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
        
        Alert.alert("Success", "Document uploaded and saved successfully!");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to upload document");
      console.error(err);
    }
  };
  */

  const handleDownload = async (file: FileItem) => {
    try {
      const fileExists = await ReactNativeBlobUtil.fs.exists(file.path);
      
      if (!fileExists) {
        Alert.alert("Error", "File no longer exists on this device storage.");
        return;
      }

      if (Platform.OS === 'android') {
        // Android: Save to Downloads folder
        const destPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${file.name}`;
        
        await ReactNativeBlobUtil.fs.cp(file.path, destPath);
        
        // Show the file in downloads using Android's MediaScanner
        ReactNativeBlobUtil.fs.scanFile([{ path: destPath }])
          .then(() => {
            Alert.alert(
              "Success", 
              `File saved to Downloads folder`,
              [
                { text: "OK" },
                { 
                  text: "Open", 
                  onPress: () => {
                    ReactNativeBlobUtil.android.actionViewIntent(destPath, 
                      file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
                    );
                  }
                }
              ]
            );
          })
          .catch((err) => {
            Alert.alert("Downloaded", "File saved to Downloads folder");
          });
      } else {
        // iOS: Use Share sheet (iOS doesn't allow direct downloads to Files app)
        await Share.open({
          url: file.path,
          type: file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          title: file.name,
          subject: file.name,
          message: 'Save this file',
        });
      }
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Error", "Failed to download file");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#1a7f7f" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.doctorName}>Dr. Julianne Smith</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>12:45 • LIVE SESSION</Text>
          </View>
        </View>
        <View style={{width: 44}} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.videoWrapper}>
          <View style={styles.videoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800' }}
              style={styles.videoBackground}
            />
            <View style={styles.pipContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }}
                style={styles.pipImage}
              />
            </View>
            <View style={styles.controlsContainer}>
              <View style={styles.controlsBlur}>
                <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.controlButton}>
                  {isMuted ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.endCallButton} onPress={() => navigation.goBack()}>
                  <Phone size={24} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Video size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.filesSection}>
          <Text style={styles.filesSectionTitle}>Shared Consultation Files</Text>
          <Text style={styles.filesSectionSubtitle}>{files.length} Documents available</Text>

          <View style={styles.uploadButtonsRow}>
            <TouchableOpacity 
              style={styles.uploadButtonPrimary}
              onPress={() => handleUpload('prescription')}
            >
              <ClipboardCheck size={28} color="#fff" />
              <Text style={styles.uploadButtonText}>Upload Prescription</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.uploadButtonSecondary}
              onPress={() => handleUpload('test')}
            >
              <Microscope size={28} color="#1a7f7f" />
              <Text style={styles.uploadButtonTextSecondary}>Upload Test List</Text>
            </TouchableOpacity>
          </View>

          {files.map((file) => (
            <View key={file.id} style={styles.fileItem}>
              <View style={styles.fileIconContainer}>
                {file.type === 'prescription' ? (
                  <FileText size={24} color="#1a7f7f" />
                ) : (
                  <Microscope size={24} color="#1a7f7f" />
                )}
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                <Text style={styles.fileMetadata}>{file.uploadedBy} • {file.time}</Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownload(file)}
              >
                <Download size={22} color="#1a7f7f" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.mainActionButton}
            onPress={() => navigation.navigate("Facility")}
          >
            <Search size={20} color="#fff" style={{marginRight: 8}} />
            <Text style={styles.mainActionButtonText}>Look for Medicines and Labs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f9f9', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  doctorName: { fontSize: 17, fontWeight: '700' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center' },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80', marginRight: 6 },
  liveText: { fontSize: 11, color: '#64748b' },
  videoWrapper: { padding: 16 },
  videoContainer: { width: '100%', height: 400, borderRadius: 24, overflow: 'hidden', backgroundColor: '#000' },
  videoBackground: { width: '100%', height: '100%' },
  pipContainer: { position: 'absolute', top: 12, right: 12, width: 80, height: 110, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' },
  pipImage: { width: '100%', height: '100%' },
  controlsContainer: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  controlsBlur: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 30, alignItems: 'center', gap: 15 },
  controlButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  endCallButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f87171', alignItems: 'center', justifyContent: 'center' },
  filesSection: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  filesSectionTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  filesSectionSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  uploadButtonsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  uploadButtonPrimary: { flex: 1, backgroundColor: '#1a7f7f', padding: 15, borderRadius: 15, alignItems: 'center', gap: 8 },
  uploadButtonSecondary: { flex: 1, borderWidth: 1, borderColor: '#1a7f7f', padding: 15, borderRadius: 15, alignItems: 'center', gap: 8 },
  uploadButtonText: { color: '#fff', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  uploadButtonTextSecondary: { color: '#1a7f7f', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  fileItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 15, borderRadius: 16, marginBottom: 10 },
  fileIconContainer: { width: 45, height: 45, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fileInfo: { flex: 1, marginLeft: 12 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  fileMetadata: { fontSize: 12, color: '#94a3b8' },
  downloadButton: { padding: 5 },
  mainActionButton: { backgroundColor: '#1a7f7f', flexDirection: 'row', padding: 18, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  mainActionButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});

export default TelemedicineConsultation;