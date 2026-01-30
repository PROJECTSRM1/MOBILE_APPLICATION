import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

interface PayslipDetailsScreenProps {
  navigation?: any;
}

const PaySlipsScreen = ({ navigation }: PayslipDetailsScreenProps) => {
  const [activeTab, setActiveTab] = useState('Payroll');
  const { colors, lightMode, toggleTheme } = useTheme();

  // Handler functions
  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      Alert.alert('Back', 'Navigation not configured');
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Payslip',
      'Your payslip will be downloaded as PDF',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => console.log('Downloading...') }
      ]
    );
  };

  const handleEmailPDF = async () => {
    try {
      await Share.share({
        message: 'Payslip for September 2023 - Johnathan Doe\nNet Salary: $4,850.00',
        title: 'Share Payslip',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share payslip');
    }
  };

  const handlePrint = () => {
    Alert.alert(
      'Print Payslip',
      'This will send the payslip to your printer',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Print', onPress: () => console.log('Printing...') }
      ]
    );
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    Alert.alert('Navigation', `Navigating to ${tab}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar 
        barStyle={lightMode ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.background} 
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payslip Details</Text>
        
        <View style={styles.headerRight}>
          {/* <TouchableOpacity 
            style={styles.themeButton}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name={lightMode ? 'dark-mode' : 'light-mode'} 
              size={20} 
              color={colors.text} 
            />
          </TouchableOpacity> */}
          
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <MaterialIcons name="file-download" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Employee Info Card */}
        <View style={[styles.employeeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.employeeHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: lightMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)' }]}>
              <MaterialIcons name="account-circle" size={48} color={colors.primary} />
            </View>
            <View style={styles.employeeInfo}>
              <Text style={[styles.employeeName, { color: colors.text }]}>Johnathan Doe</Text>
              <Text style={[styles.employeeRole, { color: colors.subText }]}>Senior Math Coordinator</Text>
              <Text style={[styles.employeeId, { color: colors.primary }]}>ID: EDU-2023-042</Text>
            </View>
          </View>

          <View style={[styles.payPeriodContainer, { borderTopColor: colors.border }]}>
            <View style={styles.payPeriodItem}>
              <Text style={[styles.payPeriodLabel, { color: colors.placeholder }]}>PAY PERIOD</Text>
              <Text style={[styles.payPeriodValue, { color: colors.text }]}>September 2023</Text>
            </View>
            <View style={[styles.payPeriodItem, styles.payPeriodRight]}>
              <Text style={[styles.payPeriodLabel, { color: colors.placeholder }]}>PAYMENT DATE</Text>
              <Text style={[styles.payPeriodValue, { color: colors.text }]}>Oct 01, 2023</Text>
            </View>
          </View>
        </View>

        {/* Net Salary Card */}
        <View style={styles.netSalaryCard}>
          <View style={styles.netSalaryContent}>
            <Text style={styles.netSalaryLabel}>Net Take-Home Salary</Text>
            <Text style={styles.netSalaryAmount}>$4,850.00</Text>
            <View style={styles.disbursedBadge}>
              <MaterialIcons name="check-circle" size={16} color="#ffffff" />
              <Text style={styles.disbursedText}>Disbursed to Bank Account</Text>
            </View>
          </View>
          <View style={styles.netSalaryGlow} />
        </View>

        {/* Earnings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.subText }]}>EARNINGS</Text>
            <MaterialIcons name="add-circle-outline" size={20} color={colors.success} />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardContent}>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Basic Pay</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>$3,500.00</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>HRA (House Rent)</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>$800.00</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Medical Allowance</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>$450.00</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Performance Bonus</Text>
                <Text style={[styles.listItemValue, { color: colors.success }]}>+$600.00</Text>
              </View>
            </View>

            <View style={[styles.totalRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Gross Earnings</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>$5,350.00</Text>
            </View>
          </View>
        </View>

        {/* Deductions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.subText }]}>DEDUCTIONS</Text>
            <MaterialIcons name="remove-circle-outline" size={20} color={colors.danger} />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardContent}>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Provident Fund (PF)</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>$250.00</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Income Tax (TDS)</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>$200.00</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Professional Tax</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>$50.00</Text>
              </View>
            </View>

            <View style={[styles.totalRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Deductions</Text>
              <Text style={[styles.totalValue, { color: colors.danger }]}>$500.00</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.emailButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleEmailPDF}
            activeOpacity={0.7}
          >
            <MaterialIcons name="mail" size={20} color={colors.text} />
            <Text style={[styles.emailButtonText, { color: colors.text }]}>Email PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.printButton}
            onPress={handlePrint}
            activeOpacity={0.7}
          >
            <MaterialIcons name="print" size={20} color="#ffffff" />
            <Text style={styles.printButtonText}>Print</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <Text style={[styles.footerText, { color: colors.placeholder }]}>
          Computer generated document. No signature required.
        </Text>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('Home')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="home" 
            size={24} 
            color={activeTab === 'Home' ? colors.primary : colors.placeholder} 
          />
          <Text style={[
            styles.navLabel,
            { color: activeTab === 'Home' ? colors.primary : colors.placeholder }
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('Payroll')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="payment" 
            size={24} 
            color={activeTab === 'Payroll' ? colors.primary : colors.placeholder} 
          />
          <Text style={[
            styles.navLabel,
            { color: activeTab === 'Payroll' ? colors.primary : colors.placeholder }
          ]}>
            Payroll
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('Staff')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="groups" 
            size={24} 
            color={activeTab === 'Staff' ? colors.primary : colors.placeholder} 
          />
          <Text style={[
            styles.navLabel,
            { color: activeTab === 'Staff' ? colors.primary : colors.placeholder }
          ]}>
            Staff
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('Settings')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="settings" 
            size={24} 
            color={activeTab === 'Settings' ? colors.primary : colors.placeholder} 
          />
          <Text style={[
            styles.navLabel,
            { color: activeTab === 'Settings' ? colors.primary : colors.placeholder }
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* Home Indicator */}
      {Platform.OS === 'ios' && (
        <View style={[styles.homeIndicator, { backgroundColor: colors.border }]} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  employeeCard: {
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    borderWidth: 1,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  employeeRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 12,
    fontWeight: '500',
  },
  payPeriodContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  payPeriodItem: {
    flex: 1,
  },
  payPeriodRight: {
    alignItems: 'flex-end',
  },
  payPeriodLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  payPeriodValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  netSalaryCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    padding: 32,
    marginTop: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  netSalaryContent: {
    position: 'relative',
    zIndex: 1,
  },
  netSalaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  netSalaryAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  disbursedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  disbursedText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  netSalaryGlow: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemLabel: {
    fontSize: 15,
  },
  listItemValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  emailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  printButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  printButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
//   bottomNav: {
//     flexDirection: 'row',
//     paddingHorizontal: 24,
//     paddingTop: 12,
//     paddingBottom: Platform.OS === 'ios' ? 8 : 12,
//     borderTopWidth: 1,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: 'center',
//     gap: 4,
//   },
//   navLabel: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
  homeIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    marginLeft: -64,
    width: 128,
    height: 4,
    borderRadius: 2,
  },
});

export default PaySlipsScreen;