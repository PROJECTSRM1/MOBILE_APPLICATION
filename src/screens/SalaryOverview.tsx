import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';


/* ---------------- TYPES ---------------- */

interface EarningItem {
  label: string;
  amount: number;
}

interface DeductionItem {
  label: string;
  amount: number;
}

interface SalaryData {
  payrollPeriod: string;
  totalNetDisbursement: number;
  status: string;
  staffCount: number;
  fullyPaid: boolean;
  earnings: EarningItem[];
  deductions: DeductionItem[];
  comparison: {
    percentage: number;
    note: string;
  };
}

interface PeriodOption {
  id: string;
  label: string;
  data: SalaryData;
}

/* ---------------- COMPONENT ---------------- */

const SalaryOverview = () => {
    const navigation = useNavigation<any>();

  // Theme integration
  const { colors, lightMode } = useTheme();

  // Available payroll periods with their data
  const [availablePeriods] = useState<PeriodOption[]>([
    {
      id: '2023-09',
      label: 'September 2023',
      data: {
        payrollPeriod: 'September 2023',
        totalNetDisbursement: 45200,
        status: 'DISBURSED',
        staffCount: 142,
        fullyPaid: true,
        earnings: [
          { label: 'Basic Salary', amount: 32000 },
          { label: 'HRA (Housing)', amount: 8400 },
          { label: 'Medical Allowance', amount: 2500 },
          { label: 'Conveyance', amount: 4300 },
        ],
        deductions: [
          { label: 'Provident Fund (PF)', amount: 1200 },
          { label: 'Professional Tax', amount: 400 },
          { label: 'Health Insurance', amount: 400 },
        ],
        comparison: {
          percentage: 4.2,
          note: 'Payroll for September is 4.2% higher than August due to annual appraisal adjustments.',
        },
      },
    },
    {
      id: '2023-08',
      label: 'August 2023',
      data: {
        payrollPeriod: 'August 2023',
        totalNetDisbursement: 43400,
        status: 'DISBURSED',
        staffCount: 138,
        fullyPaid: true,
        earnings: [
          { label: 'Basic Salary', amount: 31000 },
          { label: 'HRA (Housing)', amount: 8100 },
          { label: 'Medical Allowance', amount: 2400 },
          { label: 'Conveyance', amount: 4100 },
        ],
        deductions: [
          { label: 'Provident Fund (PF)', amount: 1150 },
          { label: 'Professional Tax', amount: 400 },
          { label: 'Health Insurance', amount: 400 },
        ],
        comparison: {
          percentage: 2.1,
          note: 'Payroll for August is 2.1% higher than July.',
        },
      },
    },
    {
      id: '2023-07',
      label: 'July 2023',
      data: {
        payrollPeriod: 'July 2023',
        totalNetDisbursement: 42500,
        status: 'DISBURSED',
        staffCount: 135,
        fullyPaid: true,
        earnings: [
          { label: 'Basic Salary', amount: 30500 },
          { label: 'HRA (Housing)', amount: 8000 },
          { label: 'Medical Allowance', amount: 2300 },
          { label: 'Conveyance', amount: 4000 },
        ],
        deductions: [
          { label: 'Provident Fund (PF)', amount: 1100 },
          { label: 'Professional Tax', amount: 400 },
          { label: 'Health Insurance', amount: 400 },
        ],
        comparison: {
          percentage: 1.8,
          note: 'Payroll for July is 1.8% higher than June.',
        },
      },
    },
    {
      id: '2023-10',
      label: 'October 2023',
      data: {
        payrollPeriod: 'October 2023',
        totalNetDisbursement: 46800,
        status: 'PENDING',
        staffCount: 145,
        fullyPaid: false,
        earnings: [
          { label: 'Basic Salary', amount: 33000 },
          { label: 'HRA (Housing)', amount: 8700 },
          { label: 'Medical Allowance', amount: 2600 },
          { label: 'Conveyance', amount: 4500 },
        ],
        deductions: [
          { label: 'Provident Fund (PF)', amount: 1250 },
          { label: 'Professional Tax', amount: 400 },
          { label: 'Health Insurance', amount: 400 },
        ],
        comparison: {
          percentage: 3.5,
          note: 'Payroll for October is 3.5% higher than September with additional bonuses.',
        },
      },
    },
  ]);

  // Current selected period
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('2023-09');
  const [showPeriodPicker, setShowPeriodPicker] = useState<boolean>(false);

  // Get current salary data based on selected period
  const currentPeriod = availablePeriods.find((p) => p.id === selectedPeriodId);
  const salaryData = currentPeriod?.data || availablePeriods[0].data;

  // Calculate totals dynamically
  const grossEarnings = salaryData.earnings.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalDeductions = salaryData.deductions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriodId(periodId);
    setShowPeriodPicker(false);
  };

  const renderEarningsItem = (
    item: EarningItem,
    index: number,
    isLast: boolean = false
  ) => (
    <View
      key={index}
      style={[
        styles.listItem,
        isLast && [
          styles.listItemHighlight,
          { backgroundColor: colors.surface },
        ],
        index !== 0 && [
          styles.listItemBorder,
          { borderTopColor: colors.border },
        ],
      ]}
    >
      <Text
        style={[
          styles.listItemLabel,
          isLast && styles.listItemLabelBold,
          { color: isLast ? colors.text : colors.subText },
        ]}
      >
        {item.label}
      </Text>
      <Text
        style={[
          styles.listItemValue,
          isLast && styles.listItemValueBold,
          { color: colors.text },
        ]}
      >
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );

  const renderDeductionItem = (
    item: DeductionItem,
    index: number,
    isLast: boolean = false
  ) => (
    <View
      key={index}
      style={[
        styles.listItem,
        isLast && [
          styles.listItemHighlight,
          { backgroundColor: colors.surface },
        ],
        index !== 0 && [
          styles.listItemBorder,
          { borderTopColor: colors.border },
        ],
      ]}
    >
      <Text
        style={[
          styles.listItemLabel,
          isLast && styles.listItemLabelBold,
          { color: isLast ? colors.text : colors.subText },
        ]}
      >
        {item.label}
      </Text>
      <Text
        style={[
          styles.listItemValue,
          styles.deductionValue,
          isLast && styles.listItemValueBold,
          { color: colors.danger },
        ]}
      >
        -{formatCurrency(item.amount)}
      </Text>
    </View>
  );

  const renderPeriodOption = ({ item }: { item: PeriodOption }) => (
    <TouchableOpacity
      style={[
        styles.periodOption,
        {
          backgroundColor:
            selectedPeriodId === item.id ? colors.primary : colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handlePeriodChange(item.id)}
    >
      <Text
        style={[
          styles.periodOptionText,
          {
            color: selectedPeriodId === item.id ? '#ffffff' : colors.text,
          },
        ]}
      >
        {item.label}
      </Text>
      {selectedPeriodId === item.id && (
        <Text style={styles.periodOptionCheck}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.goBack()}
>
  <Text style={[styles.backButtonText, { color: colors.subText }]}>
    ‹
  </Text>
</TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Salary Particulars
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payroll Period Card */}
        <View
          style={[
            styles.periodCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View>
            <Text style={[styles.periodLabel, { color: colors.subText }]}>
              PAYROLL PERIOD
            </Text>
            <Text style={[styles.periodValue, { color: colors.text }]}>
              {salaryData.payrollPeriod}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setShowPeriodPicker(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.changeButtonText, { color: colors.primary }]}
            >
              Change
            </Text>
            <Text
              style={[styles.changeButtonIcon, { color: colors.primary }]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Total Disbursement Card */}
        <View
          style={[
            styles.disbursementCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  salaryData.status === 'DISBURSED' ? '#064e3b' : '#78350f',
              },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                {
                  color:
                    salaryData.status === 'DISBURSED' ? '#34d399' : '#fbbf24',
                },
              ]}
            >
              {salaryData.status}
            </Text>
          </View>
          <Text style={[styles.disbursementLabel, { color: colors.subText }]}>
            Total Net Disbursement
          </Text>
          <Text
            style={[styles.disbursementAmount, { color: colors.primary }]}
          >
            {formatCurrency(salaryData.totalNetDisbursement)}
          </Text>
          <View
            style={[styles.statsRow, { borderTopColor: colors.border }]}
          >
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text style={[styles.statText, { color: colors.subText }]}>
                Staff Count: {salaryData.staffCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statDot,
                  {
                    backgroundColor: salaryData.fullyPaid
                      ? colors.success
                      : '#fbbf24',
                  },
                ]}
              />
              <Text style={[styles.statText, { color: colors.subText }]}>
                {salaryData.fullyPaid ? 'Fully Paid' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>
            EARNINGS BREAKDOWN
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {salaryData.earnings.map((item, index) =>
              renderEarningsItem(item, index)
            )}
            {renderEarningsItem(
              { label: 'Gross Earnings', amount: grossEarnings },
              salaryData.earnings.length,
              true
            )}
          </View>
        </View>

        {/* Deductions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>
            DEDUCTIONS
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {salaryData.deductions.map((item, index) =>
              renderDeductionItem(item, index)
            )}
            {renderDeductionItem(
              { label: 'Total Deductions', amount: totalDeductions },
              salaryData.deductions.length,
              true
            )}
          </View>
        </View>

        {/* Comparison Note */}
        <View style={[styles.noteCard, { borderColor: colors.border }]}>
          <Text style={[styles.noteText, { color: colors.subText }]}>
            {salaryData.comparison.note.replace(
              `${salaryData.comparison.percentage}%`,
              ''
            )}
            <Text style={[styles.noteHighlight, { color: colors.primary }]}>
              {salaryData.comparison.percentage}%
            </Text>
            {salaryData.comparison.note.split(
              `${salaryData.comparison.percentage}%`
            )[1] || ''}
          </Text>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Period Picker Modal */}
      <Modal
        visible={showPeriodPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPeriodPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodPicker(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Payroll Period
              </Text>
              <TouchableOpacity
                onPress={() => setShowPeriodPicker(false)}
                style={styles.modalCloseButton}
              >
                <Text
                  style={[styles.modalCloseText, { color: colors.subText }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={availablePeriods}
              renderItem={renderPeriodOption}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.periodList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 32,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  periodCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
  },
  periodLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 17,
    fontWeight: '600',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeButtonIcon: {
    fontSize: 18,
    marginTop: -2,
  },
  disbursementCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  disbursementLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  disbursementAmount: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  listItemBorder: {
    borderTopWidth: 1,
  },
  listItemHighlight: {},
  listItemLabel: {
    fontSize: 15,
  },
  listItemLabelBold: {
    fontWeight: '700',
  },
  listItemValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  listItemValueBold: {
    fontWeight: '700',
  },
  deductionValue: {},
  noteCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  noteText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  noteHighlight: {
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    fontWeight: '300',
  },
  periodList: {
    padding: 16,
  },
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  periodOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  periodOptionCheck: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default SalaryOverview;