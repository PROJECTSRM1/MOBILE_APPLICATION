import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

interface Staff {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  department: string;
  email?: string;
  phone?: string;
  netSalary?: string;
  latestPayPeriod?: string;
}

interface Payslip {
  id: string;
  staff_id: string;
  payPeriod: string;
  paymentDate: string;
  netSalary: string;
  basicPay: string;
  hra: string;
  medicalAllowance: string;
  conveyance: string;
  performanceBonus: string;
  pfDeduction: string;
  incomeTax: string;
  professionalTax: string;
  healthInsurance: string;
  grossEarnings: string;
  totalDeductions: string;
}

interface PayslipDetailsScreenProps {
  navigation?: any;
  route?: any;
}

const PaySlipsScreen = ({ navigation, route }: PayslipDetailsScreenProps) => {
  const [currentScreen, setCurrentScreen] = useState<'list' | 'details'>('list');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedPayslips, setSelectedPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [payslipsLoading, setPayslipsLoading] = useState(false);
  const { colors, lightMode } = useTheme();

  // Fetch all staff on component mount
  useEffect(() => {
    fetchAllStaff();
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'details') {
        // If on details screen, go back to list
        setCurrentScreen('list');
        setSelectedStaff(null);
        setSelectedPayslips([]);
        setSelectedPayslip(null);
        return true; // Prevent default back behavior - we handled it
      }
      // If on list screen, return false to allow navigation.goBack() to work normally
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [currentScreen]); // Re-run when currentScreen changes

  const fetchAllStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/institution/management/staff-profile/all');
      
      console.log('=== RAW BACKEND RESPONSE ===');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
      console.log('First staff member:', JSON.stringify(response.data[0], null, 2));
      console.log('===========================');
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend data to our interface
        const mappedStaff = response.data.map((staff: any, index: number) => {
          console.log(`\n--- Processing staff ${index + 1} ---`);
          console.log('Available keys:', Object.keys(staff));
          console.log('Raw staff object:', staff);
          
          // Handle name - check multiple possible field structures
          let displayName = '';
          
          // Check all possible name field combinations
          if (staff.name && typeof staff.name === 'string' && staff.name.trim()) {
            displayName = staff.name.trim();
            console.log('Using staff.name:', displayName);
          } else if (staff.full_name && typeof staff.full_name === 'string' && staff.full_name.trim()) {
            displayName = staff.full_name.trim();
            console.log('Using full_name:', displayName);
          } else if (staff.fullName && typeof staff.fullName === 'string' && staff.fullName.trim()) {
            displayName = staff.fullName.trim();
            console.log('Using fullName:', displayName);
          } else if (staff.staff_name && typeof staff.staff_name === 'string' && staff.staff_name.trim()) {
            displayName = staff.staff_name.trim();
            console.log('Using staff_name:', displayName);
          } else if (staff.staffName && typeof staff.staffName === 'string' && staff.staffName.trim()) {
            displayName = staff.staffName.trim();
            console.log('Using staffName:', displayName);
          } else if (staff.display_name && typeof staff.display_name === 'string' && staff.display_name.trim()) {
            displayName = staff.display_name.trim();
            console.log('Using display_name:', displayName);
          } else if (staff.displayName && typeof staff.displayName === 'string' && staff.displayName.trim()) {
            displayName = staff.displayName.trim();
            console.log('Using displayName:', displayName);
          } else if (staff.first_name && staff.last_name) {
            displayName = `${staff.first_name} ${staff.last_name}`.trim();
            console.log('Using first_name + last_name:', displayName);
          } else if (staff.firstName && staff.lastName) {
            displayName = `${staff.firstName} ${staff.lastName}`.trim();
            console.log('Using firstName + lastName:', displayName);
          } else if (staff.first_name && !staff.last_name) {
            displayName = staff.first_name.trim();
            console.log('Using first_name only:', displayName);
          } else if (staff.firstName && !staff.lastName) {
            displayName = staff.firstName.trim();
            console.log('Using firstName only:', displayName);
          } else if (staff.last_name && !staff.first_name) {
            displayName = staff.last_name.trim();
            console.log('Using last_name only:', displayName);
          } else if (staff.lastName && !staff.firstName) {
            displayName = staff.lastName.trim();
            console.log('Using lastName only:', displayName);
          } else if (staff.user_name || staff.username) {
            displayName = (staff.user_name || staff.username).trim();
            console.log('Using username:', displayName);
          } else if (staff.user && typeof staff.user === 'object') {
            // Check if name is nested in a user object
            if (staff.user.name) {
              displayName = staff.user.name.trim();
              console.log('Using user.name:', displayName);
            } else if (staff.user.full_name) {
              displayName = staff.user.full_name.trim();
              console.log('Using user.full_name:', displayName);
            } else if (staff.user.first_name && staff.user.last_name) {
              displayName = `${staff.user.first_name} ${staff.user.last_name}`.trim();
              console.log('Using user.first_name + user.last_name:', displayName);
            }
          } else if (staff.profile && typeof staff.profile === 'object') {
            // Check if name is nested in a profile object
            if (staff.profile.name) {
              displayName = staff.profile.name.trim();
              console.log('Using profile.name:', displayName);
            } else if (staff.profile.full_name) {
              displayName = staff.profile.full_name.trim();
              console.log('Using profile.full_name:', displayName);
            }
          }
          
          // If still no valid name, use fallback
          if (!displayName) {
            displayName = staff.email || `Staff ${index + 1}`;
            console.log('Using fallback:', displayName);
          }

          // Handle role
          let displayRole = '';
          if (staff.role && typeof staff.role === 'string' && staff.role.trim()) {
            displayRole = staff.role.trim();
            console.log('Using staff.role:', displayRole);
          } else if (staff.position) {
            displayRole = staff.position.trim();
            console.log('Using staff.position:', displayRole);
          } else if (staff.designation) {
            displayRole = staff.designation.trim();
            console.log('Using staff.designation:', displayRole);
          } else if (staff.job_title || staff.jobTitle) {
            displayRole = (staff.job_title || staff.jobTitle).trim();
            console.log('Using job_title:', displayRole);
          } else {
            displayRole = 'Staff';
            console.log('Using default role: Staff');
          }

          // Handle salary - check if backend includes latest salary
          let netSalary: string | undefined;
          if (staff.net_salary || staff.netSalary || staff.salary || staff.latest_salary) {
            const salaryValue = staff.net_salary || staff.netSalary || staff.salary || staff.latest_salary;
            netSalary = typeof salaryValue === 'number' 
              ? formatCurrency(salaryValue) 
              : salaryValue;
            console.log('Found salary:', netSalary);
          }

          const mappedStaffMember = {
            id: staff.id || staff._id || staff.staff_id || staff.staffId || `temp_${index}`,
            name: displayName,
            role: displayRole,
            employeeId: staff.employee_id || staff.employeeId || staff.staff_id || staff.staffId || 'N/A',
            department: staff.department || staff.dept || 'General',
            email: staff.email,
            phone: staff.phone || staff.mobile,
            netSalary: netSalary,
            latestPayPeriod: staff.latest_pay_period || staff.latestPayPeriod || staff.pay_period,
          };
          
          console.log('Mapped to:', mappedStaffMember);
          return mappedStaffMember;
        });
        
        console.log('\n=== FINAL MAPPED STAFF LIST ===');
        console.log(JSON.stringify(mappedStaff, null, 2));
        console.log('================================\n');
        
        setStaffList(mappedStaff);
      }
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch staff data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffPayslips = async (staffId: string) => {
    try {
      setPayslipsLoading(true);
      const response = await api.get(`/institution/management/${staffId}/payslips`);
      
      console.log('=== PAYSLIP API RESPONSE ===');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
      console.log('============================');
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend data to our interface
        const mappedPayslips = response.data.map((payslip: any) => {
          console.log('Processing payslip:', payslip);
          
          // Handle payroll_month - it comes as "JAN-2026" string format
          const payPeriod = payslip.payroll_month || payslip.payrollMonth || 'N/A';
          
          // Handle payment_date - it comes as "2026-01-31" string format
          const paymentDate = payslip.payment_date || payslip.paymentDate || 'N/A';
          
          return {
            id: payslip.id || payslip._id,
            staff_id: staffId,
            payPeriod: payPeriod,
            paymentDate: paymentDate,
            netSalary: formatCurrency(parseFloat(payslip.net_salary || payslip.netSalary || 0)),
            basicPay: formatCurrency(parseFloat(payslip.basic_pay || payslip.basicPay || 0)),
            hra: formatCurrency(parseFloat(payslip.hra || 0)),
            medicalAllowance: formatCurrency(parseFloat(payslip.medical_allowance || payslip.medicalAllowance || 0)),
            conveyance: formatCurrency(parseFloat(payslip.conveyance || 0)),
            performanceBonus: formatCurrency(parseFloat(payslip.performance_bonus || payslip.performanceBonus || 0)),
            pfDeduction: formatCurrency(parseFloat(payslip.pf_deduction || payslip.pfDeduction || 0)),
            incomeTax: formatCurrency(parseFloat(payslip.income_tax || payslip.incomeTax || 0)),
            professionalTax: formatCurrency(parseFloat(payslip.professional_tax || payslip.professionalTax || 0)),
            healthInsurance: formatCurrency(parseFloat(payslip.health_insurance || payslip.healthInsurance || 0)),
            grossEarnings: formatCurrency(parseFloat(payslip.gross_earnings || payslip.grossEarnings || 0)),
            totalDeductions: formatCurrency(parseFloat(payslip.total_deductions || payslip.totalDeductions || 0)),
          };
        });
        
        console.log('Mapped payslips:', mappedPayslips);
        setSelectedPayslips(mappedPayslips);
        
        // Auto-select the most recent payslip if available
        if (mappedPayslips.length > 0) {
          setSelectedPayslip(mappedPayslips[0]);
        }
      }
    } catch (error: any) {
      console.error('Error fetching payslips:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch payslip data. Please try again.'
      );
      // Don't block navigation, just show empty state
      setSelectedPayslips([]);
    } finally {
      setPayslipsLoading(false);
    }
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    // Changed from $ to ₹ for Indian Rupees
    return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Filter staff based on search query
  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler functions
  const handleStaffSelect = async (staff: Staff) => {
    setSelectedStaff(staff);
    setCurrentScreen('details');
    await fetchStaffPayslips(staff.id);
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
        message: `Payslip for ${selectedPayslip?.payPeriod} - ${selectedStaff?.name}\nNet Salary: ${selectedPayslip?.netSalary}`,
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

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  // Calculate totals for selected payslip
  const calculateTotals = (payslip: Payslip | null) => {
    if (!payslip) return { totalEarnings: '₹0.00', totalDeductions: '₹0.00' };
    
    // If backend already provides totals, use them
    if (payslip.grossEarnings && payslip.totalDeductions) {
      return {
        totalEarnings: payslip.grossEarnings,
        totalDeductions: payslip.totalDeductions
      };
    }
    
    // Otherwise calculate from individual components
    const parseAmount = (amount: string) => parseFloat(amount.replace('₹', '').replace(/,/g, ''));
    
    const earnings = parseAmount(payslip.basicPay) +
                    parseAmount(payslip.hra) +
                    parseAmount(payslip.medicalAllowance) +
                    parseAmount(payslip.conveyance) +
                    parseAmount(payslip.performanceBonus);
    
    const deductions = parseAmount(payslip.pfDeduction) +
                      parseAmount(payslip.incomeTax) +
                      parseAmount(payslip.professionalTax) +
                      parseAmount(payslip.healthInsurance);
    
    return {
      totalEarnings: `₹${earnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalDeductions: `₹${deductions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  };

  const totals = calculateTotals(selectedPayslip);

  // Get the latest payslip net salary for list view
  const getLatestNetSalary = (staffId: string) => {
    // This would need to be fetched from backend or cached
    // For now, return placeholder
    return 'View Details';
  };

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
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>Staff Payslips</Text>
          
          <View style={styles.headerRight} />
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
              <Text style={[styles.statValue, { color: colors.text }]}>{staffList.length}</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Total Staff</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <MaterialIcons name="attach-money" size={24} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {staffList[0]?.latestPayPeriod || 'Current'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Pay Period</Text>
            </View>
          </View>
        </View>

        {/* Staff List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.subText }]}>Loading staff...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listScrollContent}
          >
            {filteredStaff.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="search-off" size={64} color={colors.placeholder} />
                <Text style={[styles.emptyStateText, { color: colors.subText }]}>
                  {searchQuery ? `No staff found matching "${searchQuery}"` : 'No staff available'}
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
                    {staff.netSalary && (
                      <Text style={[styles.staffSalary, { color: colors.success }]}>{staff.netSalary}</Text>
                    )}
                    <MaterialIcons name="chevron-right" size={24} color={colors.placeholder} />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

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
          onPress={() => {
            if (currentScreen === 'details') {
              setCurrentScreen('list');
              setSelectedStaff(null);
              setSelectedPayslips([]);
              setSelectedPayslip(null);
            } else if (navigation) {
              navigation.goBack();
            }
          }}
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

      {payslipsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.subText }]}>Loading payslips...</Text>
        </View>
      ) : selectedPayslips.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="receipt-long" size={64} color={colors.placeholder} />
          <Text style={[styles.emptyStateText, { color: colors.subText }]}>
            No payslips available for this staff member
          </Text>
        </View>
      ) : (
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
                <Text style={[styles.payPeriodValue, { color: colors.text }]}>{selectedPayslip?.payPeriod}</Text>
              </View>
              <View style={[styles.payPeriodItem, styles.payPeriodRight]}>
                <Text style={[styles.payPeriodLabel, { color: colors.placeholder }]}>PAYMENT DATE</Text>
                <Text style={[styles.payPeriodValue, { color: colors.text }]}>{selectedPayslip?.paymentDate}</Text>
              </View>
            </View>
          </View>

          {/* Net Salary Card */}
          <View style={styles.netSalaryCard}>
            <View style={styles.netSalaryContent}>
              <Text style={styles.netSalaryLabel}>Net Take-Home Salary</Text>
              <Text style={styles.netSalaryAmount}>{selectedPayslip?.netSalary}</Text>
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
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.basicPay}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listItemLabel, { color: colors.subText }]}>HRA (House Rent)</Text>
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.hra}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listItemLabel, { color: colors.subText }]}>Medical Allowance</Text>
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.medicalAllowance}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listItemLabel, { color: colors.subText }]}>Conveyance</Text>
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.conveyance}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listItemLabel, { color: colors.subText }]}>Performance Bonus</Text>
                  <Text style={[styles.listItemValue, { color: colors.success }]}>+{selectedPayslip?.performanceBonus}</Text>
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
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.pfDeduction}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listItemLabel, { color: colors.subText }]}>Income Tax (TDS)</Text>
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.incomeTax}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listItemLabel, { color: colors.subText }]}>Professional Tax</Text>
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.professionalTax}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listItemLabel, { color: colors.subText }]}>Health Insurance</Text>
                  <Text style={[styles.listItemValue, { color: colors.text }]}>{selectedPayslip?.healthInsurance}</Text>
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
      )}

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
    width: 40,
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

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
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
    paddingHorizontal: 32,
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