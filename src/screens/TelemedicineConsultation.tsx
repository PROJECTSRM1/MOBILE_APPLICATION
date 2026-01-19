import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { ArrowLeft, Shield, Mic, MicOff, Phone, Video, Download, Lock } from 'lucide-react-native';

interface FileItem {
  id: string;
  name: string;
  uploadedBy: string;
  time: string;
  type: 'prescription' | 'test';
}

const TelemedicineConsultation: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  
  const files: FileItem[] = [
    {
      id: '1',
      name: 'Current_Prescription_v2.pdf',
      uploadedBy: 'DR. SMITH',
      time: '12:38 PM',
      type: 'prescription'
    },
    {
      id: '2',
      name: 'Blood_Work_Panel.pdf',
      uploadedBy: 'DR. SMITH',
      time: '12:42 PM',
      type: 'test'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="#1a7f7f" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.doctorName}>Dr. Julianne Smith</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>12:45 • LIVE SESSION</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.shieldButton}>
          <Shield size={24} color="#1a7f7f" fill="#1a7f7f" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video Call Section */}
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop' }}
            style={styles.videoBackground}
          />
          
          {/* Patient Picture-in-Picture */}
          <View style={styles.pipContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }}
              style={styles.pipImage}
            />
          </View>

          {/* Call Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <MicOff size={24} color="#fff" />
              ) : (
                <Mic size={24} color="#fff" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.endCallButton}>
              <Phone size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Video size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shared Files Section */}
        <View style={styles.filesSection}>
          <View style={styles.filesSectionHeader}>
            <View>
              <Text style={styles.filesSectionTitle}>Shared Consultation Files</Text>
              <Text style={styles.filesSectionSubtitle}>
                Documents visible to both participants
              </Text>
            </View>
            <View style={styles.filesCount}>
              <Text style={styles.filesCountText}>2 FILES</Text>
            </View>
          </View>

          {/* Upload Buttons */}
          <View style={styles.uploadButtonsRow}>
            <TouchableOpacity style={styles.uploadButtonPrimary}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>📋</Text>
              </View>
              <Text style={styles.uploadButtonText}>Upload Prescription</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadButtonSecondary}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>🔬</Text>
              </View>
              <Text style={styles.uploadButtonTextSecondary}>Upload Test List</Text>
            </TouchableOpacity>
          </View>

          {/* File List */}
          <View style={styles.filesList}>
            {files.map((file) => (
              <View key={file.id} style={styles.fileItem}>
                <View style={styles.fileIconContainer}>
                  <Text style={styles.fileIcon}>📄</Text>
                </View>
                
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileMetadata}>
                    {file.uploadedBy} • {file.time}
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.downloadButton}>
                  <Download size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Encryption Notice */}
        <View style={styles.encryptionNotice}>
          <Lock size={16} color="#10b981" />
          <Text style={styles.encryptionText}>END-TO-END ENCRYPTED SESSION</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  liveText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  shieldButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    height: 500,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  pipImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 2,
  },
  filesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  filesSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  filesSectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  filesCount: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filesCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284c7',
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  uploadButtonPrimary: {
    flex: 1,
    backgroundColor: '#1a7f7f',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  uploadButtonSecondary: {
    flex: 1,
    backgroundColor: '#f0fffe',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1a7f7f',
    padding: 20,
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadIconText: {
    fontSize: 28,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  uploadButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a7f7f',
    textAlign: 'center',
  },
  filesList: {
    gap: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e0f2f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileIcon: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fileMetadata: {
    fontSize: 13,
    color: '#666',
  },
  downloadButton: {
    padding: 8,
  },
  encryptionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  encryptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    letterSpacing: 0.5,
  },
});

export default TelemedicineConsultation;