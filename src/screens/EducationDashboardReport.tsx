import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';

const EducationPlacementReport = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.collegeIcon}>
              <MaterialIcons name="account-balance" size={22} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.collegeName}>ABC Engineering College</Text>
              <Text style={styles.premium}>PREMIUM PARTNER</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.moreBtn}>
            <MaterialIcons name="more-vert" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* REPORT TITLE */}
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>DETAILED PLACEMENT REPORT</Text>

          <View style={styles.yearSelector}>
            <Text style={styles.yearText}>AY 2023-24</Text>
            <MaterialIcons name="expand-more" size={18} color="#64748b" />
          </View>
        </View>

        {/* PLACEMENT TREND */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Overall Placement Trend</Text>
              <Text style={styles.cardSub}>
                Monthly student hires vs targets
              </Text>
            </View>

            <View style={styles.percentBlock}>
              <Text style={styles.percent}>85%</Text>
              <Text style={styles.growth}>↑ 12%</Text>
            </View>
          </View>

          {/* LINE CHART */}
          <Svg height={120} width="100%" viewBox="0 0 300 120">
            <Path
              d="M0 80 C50 70, 80 40, 120 35 C160 30, 190 70, 220 75 C250 80, 270 40, 300 20"
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </Svg>

          <View style={styles.monthRow}>
            {['Jan', 'Mar', 'May', 'Jul', 'Sep'].map(m => (
              <Text key={m} style={styles.month}>{m}</Text>
            ))}
          </View>
        </View>

        {/* PLACEMENTS BY DEPT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Placements by Department</Text>

          <DeptRow label="COMPUTER SCIENCE & IT" value="420 / 500" percent={0.84} />
          <DeptRow label="MECHANICAL" value="280 / 450" percent={0.62} />
          <DeptRow label="ELECTRONICS" value="310 / 400" percent={0.78} />
        </View>

        {/* RECENT PLACEMENTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Placements</Text>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </View>

        <PlacementCard
          name="Rahul Sharma"
          company="Google • SDE-1"
          ctc="₹24.5 LPA"
          type="FULL-TIME"
          color="#eef2ff"
          iconColor="#4f46e5"
        />

        <PlacementCard
          name="Anjali Verma"
          company="Microsoft • UX Design"
          ctc="₹18.2 LPA"
          type="FULL-TIME"
          color="#fff7ed"
          iconColor="#f59e0b"
        />

        <PlacementCard
          name="Vikram Singh"
          company="Amazon • Operations"
          ctc="₹14.0 LPA"
          type="INTERNSHIP"
          color="#fef2f2"
          iconColor="#ef4444"
        />

        {/* DOWNLOAD BUTTON */}
        <TouchableOpacity style={styles.downloadBtn}>
          <MaterialIcons name="download" size={22} color="#fff" />
          <Text style={styles.downloadText}>
            Download Full PDF Report
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* BOTTOM TAB */}
      <View style={styles.bottomTab}>
        {['dashboard', 'groups', 'work', 'school'].map((icon, i) => (
          <MaterialIcons
            key={i}
            name={icon}
            size={26}
            color={i === 0 ? '#2563eb' : '#9ca3af'}
          />
        ))}
      </View>
    </View>
  );
};

/* ================= COMPONENTS ================= */

const DeptRow = ({ label, value, percent }: any) => (
  <View style={styles.deptRow}>
    <View style={styles.deptHeader}>
      <Text style={styles.deptLabel}>{label}</Text>
      <Text style={styles.deptValue}>{value}</Text>
    </View>

    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${percent * 100}%` }]} />
    </View>
  </View>
);

const PlacementCard = ({ name, company, ctc, type, color, iconColor }: any) => (
  <View style={styles.placementCard}>
    <View style={[styles.avatar, { backgroundColor: color }]}>
      <MaterialIcons name="person" size={22} color={iconColor} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.company}>{company}</Text>
    </View>

    <View style={{ alignItems: 'flex-end' }}>
      <Text style={styles.ctc}>{ctc}</Text>
      <Text style={styles.type}>{type}</Text>
    </View>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },

  headerLeft: { flexDirection: 'row', gap: 12, alignItems: 'center' },

  collegeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0edff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  collegeName: { fontWeight: '800', fontSize: 16 },
  premium: { color: '#2563eb', fontSize: 12, marginTop: 2 },

  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  reportTitle: {
    letterSpacing: 1,
    color: '#94a3b8',
    fontWeight: '700',
  },

  yearSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },

  yearText: { fontWeight: '700' },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  cardTitle: { fontWeight: '800', fontSize: 16 },
  cardSub: { color: '#64748b', marginTop: 2 },

  percentBlock: { alignItems: 'flex-end' },
  percent: { fontSize: 26, fontWeight: '800', color: '#2563eb' },
  growth: { color: '#22c55e', fontWeight: '700' },

  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 6,
  },

  month: { color: '#94a3b8', fontSize: 12 },

  deptRow: { marginTop: 16 },

  deptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  deptLabel: { fontWeight: '700', color: '#334155' },
  deptValue: { fontWeight: '700' },

  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },

  progressFill: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },

  sectionTitle: { fontWeight: '800', fontSize: 16 },
  viewAll: { color: '#2563eb', fontWeight: '700' },

  placementCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: { fontWeight: '800' },
  company: { color: '#64748b', marginTop: 2 },

  ctc: { fontWeight: '800', color: '#16a34a' },
  type: { color: '#94a3b8', fontSize: 12 },

  downloadBtn: {
    backgroundColor: '#3b82f6',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  downloadText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
});

export default EducationPlacementReport;
