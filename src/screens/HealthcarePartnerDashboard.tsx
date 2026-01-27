import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { 
  Bell, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  PlusCircle, 
  Stethoscope,
  CheckCircle2, 
  Microscope, 
  Calendar,
  Home,
  Users,
  User,
  UserCheck,
  UserX
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ActivityItem {
  id: string;
  type: 'report' | 'sample' | 'appointment';
  title: string;
  patient: string;
  time: string;
}

const Dashboard = () => {
  const availableDoctorsCount = 12; // The number of doctors
  const totalAdmitted = 24; // Total admitted patients
  const totalDischarged = 18; // Total discharged patients
  const navigation = useNavigation<any>();

  const activities: ActivityItem[] = [
    { id: '1', type: 'report', title: 'Report Uploaded', patient: 'John Doe', time: '10 mins ago' },
    { id: '2', type: 'sample', title: 'Sample Collected', patient: 'Sarah Smith', time: '45 mins ago' },
    { id: '3', type: 'appointment', title: 'New Appointment', patient: 'Mike Ross', time: '2 hours ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9holtXaTNC8AoT7Ci3YkA9yke20QKQqPUAJU14O4aGbmJFnhp8bOb4W_1oNIh2DvJ69wlqD3_ii9WI7jGTVrPJmf8fk2_JeP4P2CNQUwbe_stx2r_YnFEkJPvT2DxflA04vllr3JNtjJ29ADHUSE3l2Cjvef_oB9Qo-djOI9INv02l_yY18GgtD_l9Q4pp6EvgsMRb_LFhxpIT5kqExIkflidnxg9DtzEq__j58p5jvZA0kIjEwJ_CyI8yA2V9iZBPDncE_DXff1Z' }} 
            style={styles.logo}
          />
          <Text style={styles.clinicName}>City Health Clinic</Text>
        </View>
        <TouchableOpacity>
          <Bell size={24} color="#0d141b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
      

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsContainer}>
        <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Admitted</Text>
            <Text style={styles.metricValue}>{totalAdmitted}</Text>
            <View style={styles.trendRow}>
              <UserCheck size={14} color="#2563eb" />
              <Text style={[styles.trendText, { color: '#2563eb' }]}>Current</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Discharged</Text>
            <Text style={styles.metricValue}>{totalDischarged}</Text>
            <View style={styles.trendRow}>
              <UserX size={14} color="#10b981" />
              <Text style={[styles.trendText, { color: '#10b981' }]}>Today</Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Today's Revenue</Text>
            <Text style={styles.metricValue}>$1,240</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={14} color="#078838" />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Bookings</Text>
            <Text style={styles.metricValue}>45</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={14} color="#078838" />
              <Text style={styles.trendText}>+5%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pending Reports</Text>
            <Text style={styles.metricValue}>8</Text>
            <View style={styles.trendRow}>
              <AlertCircle size={14} color="#e73908" />
              <Text style={[styles.trendText, { color: '#e73908' }]}>High Priority</Text>
            </View>
          </View>

          
        </ScrollView>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={()=>{
            navigation.navigate("bookings")
          }}>
            <View style={styles.actionIconContainer}>
              <PlusCircle size={28} color="#137fec" />
            </View>
            <Text style={styles.actionText}>Appointments</Text>
          </TouchableOpacity>

          {/* Available Doctors Button */}
          <TouchableOpacity style={styles.actionButton} onPress={()=>{
            navigation.navigate("Doctor")
          }}>
            <View style={styles.actionIconContainer}>
              <Stethoscope size={28} color="#137fec" />
            </View>
            <View style={styles.doctorCountContainer}>
                <Text style={styles.actionNumber}>{availableDoctorsCount}</Text>
                <Text style={styles.actionText}>Available Doctors</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Booking Trends Chart */}
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Booking Trends</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Last 7 Days</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.barsContainer}>
            <View style={[styles.bar, { height: '40%', opacity: 0.3 }]} />
            <View style={[styles.bar, { height: '60%', opacity: 0.5 }]} />
            <View style={[styles.bar, { height: '50%', opacity: 0.4 }]} />
            <View style={[styles.bar, { height: '80%', opacity: 0.7 }]} />
            <View style={[styles.bar, { height: '70%', opacity: 0.6 }]} />
            <View style={[styles.bar, { height: '100%', opacity: 1 }]} />
            <View style={[styles.bar, { height: '90%', opacity: 0.8 }]} />
          </View>
          <View style={styles.chartLabels}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <Text key={i} style={styles.chartLabelText}>{day}</Text>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {activities.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <View style={[
                styles.activityIcon, 
                item.type === 'report' ? { backgroundColor: '#dcfce7' } : 
                item.type === 'sample' ? { backgroundColor: '#dbeafe' } : 
                { backgroundColor: '#fef3c7' }
              ]}>
                {item.type === 'report' && <CheckCircle2 size={20} color="#16a34a" />}
                {item.type === 'sample' && <Microscope size={20} color="#2563eb" />}
                {item.type === 'appointment' && <Calendar size={20} color="#d97706" />}
              </View>
              <View>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activitySubtitle}>Patient: {item.patient} • {item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Home size={24} color="#137fec" />
          <Text style={[styles.tabText, { color: '#137fec' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Calendar size={24} color="#4c739a" />
          <Text style={styles.tabText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Users size={24} color="#4c739a" />
          <Text style={styles.tabText}>Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <User size={24} color="#4c739a" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f6f7f8',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#137fec',
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#0d141b',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fff',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d141b',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#4c739a',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#0d141b',
  },
  metricsContainer: {
    paddingLeft: 16,
  },
  metricCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#cfdbe7',
    elevation: 2,
  },
  metricLabel: {
    fontSize: 13,
    color: '#4c739a',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d141b',
    marginVertical: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#078838',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(19, 127, 236, 0.2)',
  },
  actionIconContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    marginBottom: 8,
  },
  doctorCountContainer: {
    alignItems: 'center',
  },
  actionNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#137fec',
    lineHeight: 26,
  },
  actionText: {
    color: '#137fec',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  badge: {
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  badgeText: {
    color: '#137fec',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cfdbe7',
  },
  barsContainer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  bar: {
    flex: 1,
    backgroundColor: '#137fec',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabelText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: '#4c739a',
    fontWeight: 'bold',
  },
  activityList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  activityIcon: {
    padding: 10,
    borderRadius: 10,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d141b',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#4c739a',
    marginTop: 2,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingTop: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4c739a',
  },
});

export default Dashboard;