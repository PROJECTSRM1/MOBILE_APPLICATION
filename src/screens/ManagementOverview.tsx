import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ManagementOverview = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <View style={styles.navContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="dashboard" size={24} color="#111418" />
          </View>
          <Text style={styles.navTitle}>Management Overview</Text>
          <View style={styles.notificationContainer}>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons name="notifications" size={24} color="#111418" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Enrollment Status Section */}
        <Text style={styles.sectionTitle}>Enrollment Status</Text>
        
        <View style={styles.enrollmentCards}>
          {/* Total Capacity Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Total Capacity</Text>
              <MaterialIcons name="event-seat" size={20} color="#137fec" />
            </View>
            <Text style={styles.cardValue}>500</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '84%' }]} />
            </View>
            <Text style={styles.progressText}>84% Occupancy</Text>
          </View>

          {/* Approved Seats Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Approved Seats</Text>
              <MaterialIcons name="verified" size={20} color="#10b981" />
            </View>
            <Text style={styles.cardValue}>420</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>+12 new</Text>
            </View>
          </View>
        </View>

        {/* Operations Status Section */}
        <Text style={styles.sectionTitle}>Operations Status</Text>
        
        <View style={styles.operationsGrid}>
          {/* Bus Tracking */}
          <View style={styles.operationCard}>
            <View style={styles.operationHeader}>
              <View style={styles.operationIconBg}>
                <MaterialIcons name="directions-bus" size={24} color="#137fec" />
              </View>
              <View style={styles.statusDotActive} />
            </View>
            <View style={styles.operationContent}>
              <Text style={styles.operationTitle}>Bus Tracking</Text>
              <Text style={styles.operationSubtitle}>3 Buses Online</Text>
            </View>
          </View>

          {/* SMS Alerts */}
          <View style={styles.operationCard}>
            <View style={styles.operationHeader}>
              <View style={styles.operationIconBg}>
                <MaterialIcons name="sms" size={24} color="#137fec" />
              </View>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.operationContent}>
              <Text style={styles.operationTitle}>SMS Alerts</Text>
              <Text style={styles.operationSubtitle}>System Online</Text>
            </View>
          </View>
        </View>

        {/* Staff & Payroll Section */}
        <Text style={styles.sectionTitle}>Staff & Payroll</Text>
        
        <View style={styles.payrollCard}>
          <View style={styles.payrollHeader}>
            <View>
              <Text style={styles.payrollTitle}>Monthly Payroll</Text>
              <Text style={styles.payrollMonth}>September 2023</Text>
            </View>
            <View style={styles.payrollAmount}>
              <Text style={styles.payrollValue}>$45,200</Text>
              <Text style={styles.payrollLabel}>TOTAL DISBURSEMENT</Text>
            </View>
          </View>
          
          <View style={styles.payrollButtons}>
            <TouchableOpacity style={styles.payrollButton}>
              <MaterialIcons name="receipt-long" size={18} color="#111418" />
              <Text style={styles.payrollButtonText}>Payslips</Text>
            </TouchableOpacity>
            <View style={styles.payrollDivider} />
            <TouchableOpacity style={styles.payrollButton}>
              <MaterialIcons name="payments" size={18} color="#111418" />
              <Text style={styles.payrollButtonText}>Salary Overview</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Maintenance Accountability Section */}
        <Text style={styles.sectionTitle}>Maintenance Accountability</Text>
        
        <View style={styles.maintenanceCard}>
          <View style={styles.maintenanceHeader}>
            <View>
              <Text style={styles.maintenanceLabel}>MAINTENANCE BUDGET</Text>
              <Text style={styles.maintenanceValue}>
                $12,400 <Text style={styles.maintenanceTotal}>/ $15k</Text>
              </Text>
            </View>
            <View style={styles.budgetBadge}>
              <Text style={styles.budgetBadgeText}>Under Budget</Text>
            </View>
          </View>
          
          <View style={styles.budgetBarContainer}>
            <View style={styles.budgetBarFilled} />
            <View style={styles.budgetBarPartial} />
          </View>
          
          <View style={styles.budgetLabels}>
            <Text style={styles.budgetLabelText}>Facility</Text>
            <Text style={styles.budgetLabelText}>IT Infrastructure</Text>
            <Text style={styles.budgetLabelText}>Misc</Text>
          </View>
        </View>

        {/* Exam Alerts Section */}
        <Text style={styles.sectionTitle}>Exam Alerts</Text>
        
        <View style={styles.examAlerts}>
          {/* Mid-term Notifications */}
          <TouchableOpacity style={styles.examAlertCard}>
            <View style={[styles.examIconContainer, styles.examIconOrange]}>
              <MaterialIcons name="notification-important" size={24} color="#ea580c" />
            </View>
            <View style={styles.examContent}>
              <Text style={styles.examTitle}>Mid-term Notifications</Text>
              <Text style={styles.examSubtitle}>Sent to 95% of parent contacts</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          {/* Final Exam Schedule */}
          <TouchableOpacity style={styles.examAlertCard}>
            <View style={[styles.examIconContainer, styles.examIconBlue]}>
              <MaterialIcons name="calendar-today" size={24} color="#2563eb" />
            </View>
            <View style={styles.examContent}>
              <Text style={styles.examTitle}>Final Exam Schedule</Text>
              <Text style={styles.examSubtitle}>Draft version ready for review</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color="#137fec" />
          <Text style={[styles.navItemText, styles.navItemActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="bar-chart" size={24} color="#617589" />
          <Text style={styles.navItemText}>Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="group" size={24} color="#617589" />
          <Text style={styles.navItemText}>Staff</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="settings" size={24} color="#617589" />
          <Text style={styles.navItemText}>Settings</Text>
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
  
  // Top Navigation
  topNav: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbe0e6',
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111418',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.27,
  },
  notificationContainer: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f6f7f8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111418',
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.33,
  },
  
  // Enrollment Cards
  enrollmentCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dbe0e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#617589',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111418',
    letterSpacing: -0.64,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#137fec',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#617589',
    marginTop: 4,
  },
  newBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  
  // Operations
  operationsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  operationCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbe0e6',
  },
  operationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  operationIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  operationContent: {
    gap: 4,
  },
  operationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111418',
  },
  operationSubtitle: {
    fontSize: 14,
    color: '#617589',
  },
  
  // Payroll
  payrollCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe0e6',
    overflow: 'hidden',
    marginBottom: 8,
  },
  payrollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dbe0e6',
  },
  payrollTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111418',
  },
  payrollMonth: {
    fontSize: 14,
    color: '#617589',
    marginTop: 2,
  },
  payrollAmount: {
    alignItems: 'flex-end',
  },
  payrollValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#137fec',
  },
  payrollLabel: {
    fontSize: 10,
    color: '#617589',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  payrollButtons: {
    flexDirection: 'row',
  },
  payrollButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  payrollDivider: {
    width: 1,
    backgroundColor: '#dbe0e6',
  },
  payrollButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111418',
  },
  
  // Maintenance
  maintenanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbe0e6',
    marginBottom: 8,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  maintenanceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#617589',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  maintenanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111418',
  },
  maintenanceTotal: {
    fontSize: 14,
    fontWeight: '400',
    color: '#617589',
  },
  budgetBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  budgetBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a16207',
  },
  budgetBarContainer: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
    gap: 4,
  },
  budgetBarFilled: {
    flex: 4,
    backgroundColor: '#137fec',
  },
  budgetBarPartial: {
    flex: 1,
    backgroundColor: 'rgba(19, 127, 236, 0.4)',
  },
  budgetLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  budgetLabelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#617589',
  },
  
  // Exam Alerts
  examAlerts: {
    gap: 8,
  },
  examAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dbe0e6',
    gap: 12,
  },
  examIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examIconOrange: {
    backgroundColor: '#ffedd5',
  },
  examIconBlue: {
    backgroundColor: '#dbeafe',
  },
  examContent: {
    flex: 1,
  },
  examTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111418',
    marginBottom: 2,
  },
  examSubtitle: {
    fontSize: 12,
    color: '#617589',
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#dbe0e6',
    paddingVertical: 8,
    height: 64,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navItemText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#617589',
  },
  navItemActive: {
    color: '#137fec',
  },
  
  bottomSpacer: {
    height: 24,
  },
});

export default ManagementOverview;