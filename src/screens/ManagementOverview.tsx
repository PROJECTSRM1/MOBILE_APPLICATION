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
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";


const ManagementOverview = () => {
  const { colors, lightMode } = useTheme();
  const navigation = useNavigation<any>();
  const styles = createStyles(colors);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={lightMode ? "dark-content" : "light-content"} 
        backgroundColor={colors.background} 
      />
      
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <View style={styles.navContent}>
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Management Overview</Text>
          <View style={styles.iconContainer} />
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
              <MaterialIcons name="event-seat" size={20} color={colors.primary} />
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
              <MaterialIcons name="verified" size={20} color={colors.success} />
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
          <TouchableOpacity
            style={styles.operationCard}
            onPress={() => navigation.navigate("BusTrackingScreen")}
          >
            <View style={styles.operationHeader}>
              <View style={styles.operationIconBg}>
                <MaterialIcons
                  name="directions-bus"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.statusDotActive} />
            </View>

            <View style={styles.operationContent}>
              <Text style={styles.operationTitle}>Bus Tracking</Text>
              <Text style={styles.operationSubtitle}>3 Buses Online</Text>
            </View>
          </TouchableOpacity>

          {/* SMS Alerts */}
          <View style={styles.operationCard}>
            <View style={styles.operationHeader}>
              <View style={styles.operationIconBg}>
                <MaterialIcons name="sms" size={24} color={colors.primary} />
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
            <TouchableOpacity
              style={styles.payrollButton}
              onPress={() => navigation.navigate("PaySlipsScreen")}
            >
              <MaterialIcons name="receipt-long" size={18} color={colors.text} />
              <Text style={styles.payrollButtonText}>Payslips</Text>
            </TouchableOpacity>

            <View style={styles.payrollDivider} />
            <TouchableOpacity
              style={styles.payrollButton}
              onPress={() => navigation.navigate("SalaryOverview")}
            >
              <MaterialIcons name="payments" size={18} color={colors.text} />
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
          <TouchableOpacity
            style={styles.examAlertCard}
            onPress={() => navigation.navigate("MidTermNotifications")}
          >
            <View style={[styles.examIconContainer, styles.examIconOrange]}>
              <MaterialIcons name="notification-important" size={24} color="#ea580c" />
            </View>
            <View style={styles.examContent}>
              <Text style={styles.examTitle}>Mid-term Notifications</Text>
              <Text style={styles.examSubtitle}>Sent to 95% of parent contacts</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.subText} />
          </TouchableOpacity>

          {/* Final Exam Schedule */}
          <TouchableOpacity
            style={styles.examAlertCard}
            onPress={() => navigation.navigate("FinalExamSchedule")}
          >
            <View style={[styles.examIconContainer, styles.examIconBlue]}>
              <MaterialIcons name="calendar-today" size={24} color="#2563eb" />
            </View>
            <View style={styles.examContent}>
              <Text style={styles.examTitle}>Final Exam Schedule</Text>
              <Text style={styles.examSubtitle}>Draft version ready for review</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.subText} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  
  // Top Navigation
  topNav: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.27,
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.subText,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.64,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.subText,
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
    color: colors.success,
  },
  
  // Operations
  operationsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  operationCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  operationContent: {
    gap: 4,
  },
  operationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  operationSubtitle: {
    fontSize: 14,
    color: colors.subText,
  },
  
  // Payroll
  payrollCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  payrollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  payrollTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  payrollMonth: {
    fontSize: 14,
    color: colors.subText,
    marginTop: 2,
  },
  payrollAmount: {
    alignItems: 'flex-end',
  },
  payrollValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  payrollLabel: {
    fontSize: 10,
    color: colors.subText,
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
    backgroundColor: colors.border,
  },
  payrollButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  
  // Maintenance
  maintenanceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.subText,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  maintenanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  maintenanceTotal: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.subText,
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
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 4,
  },
  budgetBarFilled: {
    flex: 4,
    backgroundColor: colors.primary,
  },
  budgetBarPartial: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
  },
  budgetLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  budgetLabelText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.subText,
  },
  
  // Exam Alerts
  examAlerts: {
    gap: 8,
  },
  examAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
    marginBottom: 2,
  },
  examSubtitle: {
    fontSize: 12,
    color: colors.subText,
  },
  
  bottomSpacer: {
    height: 24,
  },
});

export default ManagementOverview;