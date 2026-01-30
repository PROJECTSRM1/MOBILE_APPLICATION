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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

interface Staff {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  department: string;
  netSalary: string;
  payPeriod: string;
  paymentDate: string;
  basicPay: string;
  hra: string;
  medicalAllowance: string;
  performanceBonus: string;
  pf: string;
  incomeTax: string;
  professionalTax: string;
}

interface PayslipDetailsScreenProps {
  navigation?: any;
}

const STAFF_DATA: Staff[] = [
  {
    id: '1',
    name: 'Johnathan Doe',
    role: 'Senior Math Coordinator',
    employeeId: 'EDU-2023-042',
    department: 'Mathematics',
    netSalary: '$4,850.00',
    payPeriod: 'September 2023',
    paymentDate: 'Oct 01, 2023',
    basicPay: '$3,500.00',
    hra: '$800.00',
    medicalAllowance: '$450.00',
    performanceBonus: '$600.00',
    pf: '$250.00',
    incomeTax: '$200.00',
    professionalTax: '$50.00',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Science Department Head',
    employeeId: 'EDU-2023-015',
    department: 'Science',
    netSalary: '$5,200.00',
    payPeriod: 'September 2023',
    paymentDate: 'Oct 01, 2023',
    basicPay: '$4,000.00',
    hra: '$900.00',
    medicalAllowance: '$500.00',
    performanceBonus: '$800.00',
    pf: '$300.00',
    incomeTax: '$250.00',
    professionalTax: '$50.00',
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'English Teacher',
    employeeId: 'EDU-2023-028',
    department: 'English',
    netSalary: '$3,950.00',
    payPeriod: 'September 2023',
    paymentDate: 'Oct 01, 2023',
    basicPay: '$2,800.00',
    hra: '$700.00',
    medicalAllowance: '$400.00',
    performanceBonus: '$500.00',
    pf: '$200.00',
    incomeTax: '$150.00',
    professionalTax: '$50.00',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    role: 'Art & Music Coordinator',
    employeeId: 'EDU-2023-061',
    department: 'Arts',
    netSalary: '$3,650.00',
    payPeriod: 'September 2023',
    paymentDate: 'Oct 01, 2023',
    basicPay: '$2,500.00',
    hra: '$650.00',
    medicalAllowance: '$400.00',
    performanceBonus: '$450.00',
    pf: '$180.00',
    incomeTax: '$120.00',
    professionalTax: '$50.00',
  },
  {
    id: '5',
    name: 'David Kumar',
    role: 'Physical Education Teacher',
    employeeId: 'EDU-2023-073',
    department: 'Sports',
    netSalary: '$3,450.00',
    payPeriod: 'September 2023',
    paymentDate: 'Oct 01, 2023',
    basicPay: '$2,400.00',
    hra: '$600.00',
    medicalAllowance: '$350.00',
    performanceBonus: '$400.00',
    pf: '$170.00',
    incomeTax: '$110.00',
    professionalTax: '$50.00',
  },
];

const PaySlipsScreen = ({ navigation }: PayslipDetailsScreenProps) => {
  const [currentScreen, setCurrentScreen] = useState<'list' | 'details'>('list');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Payroll');
  const { colors, lightMode, toggleTheme } = useTheme();

  // Filter staff based on search query
  const filteredStaff = STAFF_DATA.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler functions
  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    setCurrentScreen('details');
  };

  const handleBack = () => {
    if (currentScreen === 'details') {
      setCurrentScreen('list');
      setSelectedStaff(null);
    } else if (navigation) {
      navigation.goBack();
    } else {
      Alert.alert('Back', 'Navigation not configured');
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Payslip',
      `${selectedStaff?.name}'s payslip will be downloaded as PDF`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => console.log('Downloading...') }
      ]
    );
  };

  const handleEmailPDF = async () => {
    try {
      await Share.share({
        message: `Payslip for ${selectedStaff?.payPeriod} - ${selectedStaff?.name}\nNet Salary: ${selectedStaff?.netSalary}`,
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

  // Calculate totals for selected staff
  const calculateTotals = (staff: Staff | null) => {
    if (!staff) return { totalEarnings: '$0.00', totalDeductions: '$0.00' };
    
    const earnings = parseFloat(staff.basicPay.replace('$', '').replace(',', '')) +
                    parseFloat(staff.hra.replace('$', '').replace(',', '')) +
                    parseFloat(staff.medicalAllowance.replace('$', '').replace(',', '')) +
                    parseFloat(staff.performanceBonus.replace('$', '').replace(',', ''));
    
    const deductions = parseFloat(staff.pf.replace('$', '').replace(',', '')) +
                      parseFloat(staff.incomeTax.replace('$', '').replace(',', '')) +
                      parseFloat(staff.professionalTax.replace('$', '').replace(',', ''));
    
    return {
      totalEarnings: `$${earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalDeductions: `$${deductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  };

  const totals = calculateTotals(selectedStaff);

  // Staff List Screen
  if (currentScreen === 'list') {
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
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>Staff Payslips</Text>
          
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialIcons name="search" size={20} color={colors.placeholder} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name, ID, or department..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color={colors.placeholder} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <MaterialIcons name="groups" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{STAFF_DATA.length}</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Total Staff</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <MaterialIcons name="attach-money" size={24} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>Sep 2023</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Pay Period</Text>
            </View>
          </View>
        </View>

        {/* Staff List */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listScrollContent}
        >
          {filteredStaff.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={64} color={colors.placeholder} />
              <Text style={[styles.emptyStateText, { color: colors.subText }]}>
                No staff found matching "{searchQuery}"
              </Text>
            </View>
          ) : (
            filteredStaff.map((staff) => (
              <TouchableOpacity
                key={staff.id}
                style={[styles.staffCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => handleStaffSelect(staff)}
                activeOpacity={0.7}
              >
                <View style={styles.staffCardLeft}>
                  <View style={[styles.staffAvatar, { backgroundColor: lightMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)' }]}>
                    <MaterialIcons name="account-circle" size={40} color={colors.primary} />
                  </View>
                  <View style={styles.staffInfo}>
                    <Text style={[styles.staffName, { color: colors.text }]}>{staff.name}</Text>
                    <Text style={[styles.staffRole, { color: colors.subText }]}>{staff.role}</Text>
                    <View style={styles.staffMeta}>
                      <View style={[styles.staffBadge, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.staffId, { color: colors.primary }]}>{staff.employeeId}</Text>
                      </View>
                      <Text style={[styles.staffDepartment, { color: colors.placeholder }]}>• {staff.department}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.staffCardRight}>
                  <Text style={[styles.staffSalary, { color: colors.success }]}>{staff.netSalary}</Text>
                  <MaterialIcons name="chevron-right" size={24} color={colors.placeholder} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Home Indicator */}
        {Platform.OS === 'ios' && (
          <View style={[styles.homeIndicator, { backgroundColor: colors.border }]} />
        )}
      </SafeAreaView>
    );
  }

  // Payslip Details Screen
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
              <Text style={[styles.employeeName, { color: colors.text }]}>{selectedStaff?.name}</Text>
              <Text style={[styles.employeeRole, { color: colors.subText }]}>{selectedStaff?.role}</Text>
              <Text style={[styles.employeeId, { color: colors.primary }]}>ID: {selectedStaff?.employeeId}</Text>
            </View>
          </View>

          <View style={[styles.payPeriodContainer, { borderTopColor: colors.border }]}>
            <View style={styles.payPeriodItem}>
              <Text style={[styles.payPeriodLabel, { color: colors.placeholder }]}>PAY PERIOD</Text>
              <Text style={[styles.payPeriodValue, { color: colors.text }]}>{selectedStaff?.payPeriod}</Text>
            </View>
            <View style={[styles.payPeriodItem, styles.payPeriodRight]}>
              <Text style={[styles.payPeriodLabel, { color: colors.placeholder }]}>PAYMENT DATE</Text>
              <Text style={[styles.payPeriodValue, { color: colors.text }]}>{selectedStaff?.paymentDate}</Text>
            </View>
          </View>
        </View>

        {/* Net Salary Card */}
        <View style={styles.netSalaryCard}>
          <View style={styles.netSalaryContent}>
            <Text style={styles.netSalaryLabel}>Net Take-Home Salary</Text>
            <Text style={styles.netSalaryAmount}>{selectedStaff?.netSalary}</Text>
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
                <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedStaff?.basicPay}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>HRA (House Rent)</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedStaff?.hra}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Medical Allowance</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedStaff?.medicalAllowance}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Performance Bonus</Text>
                <Text style={[styles.listItemValue, { color: colors.success }]}>+{selectedStaff?.performanceBonus}</Text>
              </View>
            </View>

            <View style={[styles.totalRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Gross Earnings</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>{totals.totalEarnings}</Text>
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
                <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedStaff?.pf}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Income Tax (TDS)</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedStaff?.incomeTax}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listItemLabel, { color: colors.subText }]}>Professional Tax</Text>
                <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedStaff?.professionalTax}</Text>
              </View>
            </View>

            <View style={[styles.totalRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Deductions</Text>
              <Text style={[styles.totalValue, { color: colors.danger }]}>{totals.totalDeductions}</Text>
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
  filterButton: {
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
  
  // Search Bar Styles
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  // Stats Card Styles
  statsContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },

  // Staff List Styles
  listScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  staffCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  staffAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  staffRole: {
    fontSize: 13,
    marginBottom: 6,
  },
  staffMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  staffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  staffId: {
    fontSize: 11,
    fontWeight: '600',
  },
  staffDepartment: {
    fontSize: 11,
  },
  staffCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  staffSalary: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 15,
    textAlign: 'center',
  },

  // Details Screen Styles
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