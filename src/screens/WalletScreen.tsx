import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

/* ================= EXACT THEME COLORS ================= */
const COLORS = {
  PRIMARY_NAVY: "#0D335D",
  MUTED_BLUE: "#6B8CAE",
  LIGHT_BG: "#F4F7FA",
  GOLD_GRADIENT: ["#F9D976", "#F39C12"],
  SUCCESS_GREEN: "#8CC166",
  PENDING_BLUE: "#5DADE2",
  WITHDRAWN_GREY: "#95A5A6",
};

/* ================= UPDATED TRANSACTION DATA ================= */
// Reflecting the ₹5,000 total (3,000 + 2,000)
const TRANSACTIONS = [
  { id: "1", tkt: "TKT#15692", sub: "Cleaning service", total: "3,000", cleaner: "2,400", platform: "600", date: "Oct 5, 2025", status: "AVAILABLE", icon: "🧹" },
  { id: "2", tkt: "TKT#15484", sub: "Balcony service", total: "2,000", cleaner: "1,600", platform: "400", date: "Nov 06, 2025", status: "AVAILABLE", icon: "🪴" },
];

export default function WalletScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ===== TOP SECTION WITH FLORAL ILLUSTRATION ===== */}
        <ImageBackground 
          source={{ uri: 'https://img.freepik.com/free-vector/hand-painted-watercolor-floral-background_23-2148941600.jpg' }} 
          style={styles.headerBackground}
          imageStyle={{ opacity: 0.2, resizeMode: 'cover' }}
        >
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.navIcon}>{"<"}</Text>
            </TouchableOpacity>

            <View style={styles.brandGroup}>
              <Text style={styles.brandTitle}>SWACHIFY</Text>
              <Text style={styles.brandSub}>INDIA</Text>
            </View>
            
            <View style={styles.profileBtn}>
               <View style={styles.profileInner} />
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.earningLabel}>Earnings Wallet</Text>
            {/* Updated Total Amount */}
            <Text style={styles.balanceText}>₹5,000</Text>
            
            <TouchableOpacity activeOpacity={0.9}>
              <LinearGradient 
                colors={COLORS.GOLD_GRADIENT} 
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                style={styles.withdrawButton}
              >
                <Text style={styles.withdrawButtonText}>Withdraw to Bank</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* ===== STAT CARDS SECTION ===== */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#3498DB' }]}>
               <Text style={{color: '#FFF', fontSize: 16}}>🕒</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={[styles.statValue, { color: '#2980B9' }]}>₹1,500</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#2ECC71' }]}>
               <Text style={{color: '#FFF', fontSize: 16}}>✓</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Withdrawn</Text>
              <Text style={[styles.statValue, { color: '#27AE60' }]}>₹3,000</Text>
            </View>
          </View>
        </View>

        {/* ===== RECENT TRANSACTIONS ===== */}
        <Text style={styles.sectionHeader}>Recent Transactions</Text>

        {TRANSACTIONS.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            <View style={styles.cardTop}>
              <View style={styles.cardIdGroup}>
                <View style={styles.serviceIconContainer}>
                   {/* Dynamic Icon added for clarity */}
                   <Text style={{fontSize: 18}}>{item.icon || "🪜"}</Text>
                </View>
                <View>
                  <Text style={styles.ticketId}>{item.tkt}</Text>
                  <Text style={styles.serviceName}>{item.sub}</Text>
                </View>
              </View>
              
              <View style={[styles.statusBadge, 
                item.status === 'AVAILABLE' ? {backgroundColor: COLORS.SUCCESS_GREEN} : 
                item.status === 'PENDING' ? {backgroundColor: COLORS.PENDING_BLUE} : 
                {backgroundColor: COLORS.WITHDRAWN_GREY}
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottom}>
              <View>
                {/* Individual Service Amount shown clearly */}
                <Text style={styles.totalLabel}>₹ {item.total}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              
              <View style={styles.breakdownContainer}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Earned</Text>
                  <Text style={styles.breakdownValue}>₹{item.cleaner}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Fee</Text>
                  <Text style={styles.breakdownValue}>₹{item.platform}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LIGHT_BG },
  headerBackground: {
    width: width,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#FFFBE6',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center'
  },
  navIcon: { fontSize: 24, color: COLORS.PRIMARY_NAVY, fontWeight: 'bold' },
  brandGroup: { alignItems: 'center' },
  brandTitle: { fontSize: 24, fontWeight: '900', color: COLORS.PRIMARY_NAVY, letterSpacing: 1 },
  brandSub: { fontSize: 12, fontWeight: '700', color: COLORS.PRIMARY_NAVY, letterSpacing: 5, marginTop: -5 },
  profileBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: COLORS.PRIMARY_NAVY, padding: 2 },
  profileInner: { flex: 1, borderRadius: 15, backgroundColor: COLORS.PRIMARY_NAVY },

  balanceContainer: { alignItems: 'center', marginTop: 25 },
  earningLabel: { fontSize: 20, fontWeight: '800', color: COLORS.PRIMARY_NAVY },
  balanceText: { fontSize: 48, fontWeight: '900', color: COLORS.PRIMARY_NAVY, marginVertical: 5 },
  withdrawButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 8,
  },
  withdrawButtonText: { fontSize: 18, fontWeight: '800', color: '#422', textAlign: 'center' },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -25,
  },
  statCard: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  statIconCircle: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 13, color: '#7F8C8D', fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: '900' },

  sectionHeader: { fontSize: 18, fontWeight: '900', color: COLORS.PRIMARY_NAVY, margin: 20 },

  transactionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIdGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceIconContainer: { width: 40, height: 40, backgroundColor: '#EBF5FB', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D4E6F1' },
  ticketId: { fontSize: 17, fontWeight: '900', color: COLORS.PRIMARY_NAVY },
  serviceName: { fontSize: 13, color: '#7F8C8D', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  
  cardDivider: { height: 1, backgroundColor: '#F2F4F4', marginVertical: 12 },
  
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 20, fontWeight: '900', color: COLORS.PRIMARY_NAVY },
  dateText: { fontSize: 12, color: '#BDC3C7', marginTop: 2 },
  
  breakdownContainer: { width: '45%' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  breakdownLabel: { fontSize: 13, color: '#BDC3C7', fontWeight: '600' },
  breakdownValue: { fontSize: 16, fontWeight: '900', color: COLORS.PRIMARY_NAVY },
});