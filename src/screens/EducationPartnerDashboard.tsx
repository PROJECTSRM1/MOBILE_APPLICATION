import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EducationPartnerDashboard = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Partner Dashboard</Text>
            <Text style={styles.subtitle}>Education Overview</Text>
          </View>

          <View style={styles.headerIcon}>
            <MaterialIcons name="school" size={22} color="#3b82f6" />
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconBlue}>
              <MaterialIcons name="groups" size={20} color="#2563eb" />
            </View>
            <Text style={styles.statNumber}>2,310</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconOrange}>
              <MaterialIcons name="work" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.statNumber}>64</Text>
            <Text style={styles.statLabel}>Active Internships</Text>
          </View>
        </View>

        {/* STUDENTS BY BRANCH */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>STUDENTS BY BRANCH</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        <View style={styles.branchRow}>
          <BranchCard title="CS & IT" value="840" />
          <BranchCard title="Mechanical" value="520" />
          <BranchCard title="Electronics" value="410" />
        </View>

        {/* INTERNSHIP TRACKING */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>INTERNSHIP TRACKING</Text>
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        </View>

        <InternshipCard
          company="BizSolutions"
          role="Software Dev Intern • 3 Months"
          status="In-progress"
          student="Rahul Sharma"
          type="Paid Internship"
          statusColor="#22c55e"
        />

        <InternshipCard
          company="CreativeFlow"
          role="UI/UX Designer • 6 Months"
          status="Completed"
          student="Anjali Verma"
          type="Unpaid"
          statusColor="#3b82f6"
        />

        {/* PARTNER CARD */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerHeader}>
            <View style={styles.partnerIcon}>
              <MaterialIcons name="account-balance" size={22} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.partnerName}>ABC Engineering College</Text>
              <Text style={styles.premium}>Premium Partner</Text>
            </View>
          </View>

          <View style={styles.partnerStats}>
            <View>
              <Text style={styles.partnerStatValue}>85%</Text>
              <Text style={styles.partnerStatLabel}>Placement Rate</Text>
            </View>

            <View>
              <Text style={styles.partnerStatValue}>5,200+</Text>
              <Text style={styles.partnerStatLabel}>Alumni Network</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.reportBtn}>
            <MaterialIcons name="description" size={20} color="#fff" />
            <Text style={styles.reportText}>View Detailed Report</Text>
          </TouchableOpacity>
        </View>

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

const BranchCard = ({ title, value }: any) => (
  <View style={styles.branchCard}>
    <Text style={styles.branchTitle}>{title}</Text>
    <Text style={styles.branchValue}>{value}</Text>
    <View style={styles.progressBar}>
      <View style={styles.progressFill} />
    </View>
  </View>
);

const InternshipCard = ({
  company,
  role,
  status,
  student,
  type,
  statusColor,
}: any) => (
  <View style={styles.internshipCard}>
    <View style={styles.internshipHeader}>
      <Text style={styles.company}>{company}</Text>
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
      </View>
    </View>

    <Text style={styles.role}>{role}</Text>

    <View style={styles.internshipFooter}>
      <View>
        <Text style={styles.footerLabel}>STUDENT NAME</Text>
        <Text style={styles.footerValue}>{student}</Text>
      </View>

      <View>
        <Text style={styles.footerLabel}>TYPE</Text>
        <Text style={[styles.footerValue, { color: '#2563eb' }]}>{type}</Text>
      </View>
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

  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4 },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0edff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },

  statIconBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0edff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statIconOrange: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statNumber: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  statLabel: { color: '#64748b', marginTop: 4 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 14,
    letterSpacing: 1,
    color: '#64748b',
    fontWeight: '700',
  },

  viewAll: { color: '#2563eb', fontWeight: '700' },

  branchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 12,
  },

  branchCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
  },

  branchTitle: { color: '#475569', fontWeight: '600' },
  branchValue: { fontSize: 22, fontWeight: '800', marginVertical: 6 },

  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },

  progressFill: {
    width: '70%',
    height: 6,
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },

  activeBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  activeText: { color: '#2563eb', fontWeight: '700', fontSize: 12 },

  internshipCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
  },

  internshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  company: { fontWeight: '800', fontSize: 16 },
  role: { color: '#64748b', marginVertical: 6 },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: { fontWeight: '700', fontSize: 12 },

  internshipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  footerLabel: { fontSize: 12, color: '#94a3b8' },
  footerValue: { fontWeight: '700', marginTop: 2 },

  partnerCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    margin: 16,
    padding: 16,
  },

  partnerHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  partnerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0edff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  partnerName: { fontWeight: '800', fontSize: 16 },
  premium: { color: '#2563eb', marginTop: 2 },

  partnerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  partnerStatValue: { fontSize: 20, fontWeight: '800' },
  partnerStatLabel: { color: '#64748b' },

  reportBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  reportText: { color: '#fff', fontWeight: '700' },

  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
});

export default EducationPartnerDashboard;
