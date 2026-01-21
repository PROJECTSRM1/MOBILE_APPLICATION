import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';


interface Station {
  id: string;
  name: string;
  line: 'Red' | 'Blue' | 'Green' | 'Interchange';
  color: string;
}

interface Ticket {
  id: string;
  from: string;
  to: string;
  fare: number;
  type: 'One Way' | 'Two Way';
  timestamp: number;
  qrCode: string;
}

// FIXED: Renamed enum to avoid conflict with React Native's View component
enum AppScreen {
  DASHBOARD = 'DASHBOARD',
  ROUTE_PLAN = 'ROUTE_PLAN',
  TICKET = 'TICKET'
}

const HYDERABAD_STATIONS: Station[] = [
  { id: 'h1', name: 'Miyapur', line: 'Red', color: '#EF4444' },
  { id: 'h2', name: 'JNTU College', line: 'Red', color: '#EF4444' },
  { id: 'h3', name: 'KPHB Colony', line: 'Red', color: '#EF4444' },
  { id: 'h4', name: 'Kukatpally', line: 'Red', color: '#EF4444' },
  { id: 'h5', name: 'Moosapet', line: 'Red', color: '#EF4444' },
  { id: 'h6', name: 'Bharat Nagar', line: 'Red', color: '#EF4444' },
  { id: 'h7', name: 'Erragadda', line: 'Red', color: '#EF4444' },
  { id: 'h8', name: 'ESI Hospital', line: 'Red', color: '#EF4444' },
  { id: 'h9', name: 'S.R. Nagar', line: 'Red', color: '#EF4444' },
  { id: 'h10', name: 'Ameerpet', line: 'Interchange', color: '#6366F1' },
  { id: 'h11', name: 'Punjagutta', line: 'Red', color: '#EF4444' },
  { id: 'h12', name: 'Irrum Manzil', line: 'Red', color: '#EF4444' },
  { id: 'h13', name: 'Khairatabad', line: 'Red', color: '#EF4444' },
  { id: 'h14', name: 'Lakdikapul', line: 'Red', color: '#EF4444' },
  { id: 'h15', name: 'Assembly', line: 'Red', color: '#EF4444' },
  { id: 'h16', name: 'Nampally', line: 'Red', color: '#EF4444' },
  { id: 'h17', name: 'Gandhi Bhavan', line: 'Red', color: '#EF4444' },
  { id: 'h18', name: 'Osmania Medical', line: 'Red', color: '#EF4444' },
  { id: 'h19', name: 'MGBS', line: 'Interchange', color: '#6366F1' },
  { id: 'h20', name: 'Malakpet', line: 'Red', color: '#EF4444' },
  { id: 'h21', name: 'New Market', line: 'Red', color: '#EF4444' },
  { id: 'h22', name: 'Musarambagh', line: 'Red', color: '#EF4444' },
  { id: 'h23', name: 'Dilsukhnagar', line: 'Red', color: '#EF4444' },
  { id: 'h24', name: 'Chaitanyapuri', line: 'Red', color: '#EF4444' },
  { id: 'h25', name: 'Victoria Memorial', line: 'Red', color: '#EF4444' },
  { id: 'h26', name: 'LB Nagar', line: 'Red', color: '#EF4444' },
  { id: 'h27', name: 'Nagole', line: 'Blue', color: '#3B82F6' },
  { id: 'h28', name: 'Uppal', line: 'Blue', color: '#3B82F6' },
  { id: 'h29', name: 'Stadium', line: 'Blue', color: '#3B82F6' },
  { id: 'h30', name: 'NGRI', line: 'Blue', color: '#3B82F6' },
  { id: 'h31', name: 'Habsiguda', line: 'Blue', color: '#3B82F6' },
  { id: 'h32', name: 'Tarnaka', line: 'Blue', color: '#3B82F6' },
  { id: 'h33', name: 'Mettuguda', line: 'Blue', color: '#3B82F6' },
  { id: 'h34', name: 'Secunderabad East', line: 'Blue', color: '#3B82F6' },
  { id: 'h35', name: 'Parade Ground', line: 'Interchange', color: '#6366F1' },
  { id: 'h36', name: 'Paradise', line: 'Blue', color: '#3B82F6' },
  { id: 'h37', name: 'Rasoolpura', line: 'Blue', color: '#3B82F6' },
  { id: 'h38', name: 'Prakash Nagar', line: 'Blue', color: '#3B82F6' },
  { id: 'h39', name: 'Begumpet', line: 'Blue', color: '#3B82F6' },
  { id: 'h40', name: 'Madhura Nagar', line: 'Blue', color: '#3B82F6' },
  { id: 'h41', name: 'Yousufguda', line: 'Blue', color: '#3B82F6' },
  { id: 'h42', name: 'Jubilee Hills Rd 5', line: 'Blue', color: '#3B82F6' },
  { id: 'h43', name: 'Jubilee Hills CP', line: 'Blue', color: '#3B82F6' },
  { id: 'h44', name: 'Peddamma Temple', line: 'Blue', color: '#3B82F6' },
  { id: 'h45', name: 'Madhapur', line: 'Blue', color: '#3B82F6' },
  { id: 'h46', name: 'Durgam Cheruvu', line: 'Blue', color: '#3B82F6' },
  { id: 'h47', name: 'Hitech City', line: 'Blue', color: '#3B82F6' },
  { id: 'h48', name: 'Raidurg', line: 'Blue', color: '#3B82F6' },
  { id: 'h49', name: 'JBS Parade Ground', line: 'Green', color: '#10B981' },
  { id: 'h50', name: 'Secunderabad West', line: 'Green', color: '#10B981' },
  { id: 'h51', name: 'Gandhi Hospital', line: 'Green', color: '#10B981' },
  { id: 'h52', name: 'Musheerabad', line: 'Green', color: '#10B981' },
  { id: 'h53', name: 'RTC X Roads', line: 'Green', color: '#10B981' },
  { id: 'h54', name: 'Chikkadpally', line: 'Green', color: '#10B981' },
  { id: 'h55', name: 'Narayanaguda', line: 'Green', color: '#10B981' },
  { id: 'h56', name: 'Sultan Bazar', line: 'Green', color: '#10B981' },
  { id: 'h57', name: 'JBS', line: 'Green', color: '#10B981' },
];

const MetroView = () => {
  const { colors } = useTheme();
  const s = getStyles(colors);
    const insets = useSafeAreaInsets();
  const [currentView, setCurrentView] = useState<AppScreen>(AppScreen.DASHBOARD);
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [isTwoWay, setIsTwoWay] = useState(false);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('metro_history');
      if (saved) setRecentTickets(JSON.parse(saved));
    } catch (e) {
      console.log(e);
    }
  };

  const fare = useMemo(() => {
    if (!fromStation || !toStation) return 0;
    const fromIdx = HYDERABAD_STATIONS.findIndex(s => s.id === fromStation.id);
    const toIdx = HYDERABAD_STATIONS.findIndex(s => s.id === toStation.id);
    const count = Math.abs(fromIdx - toIdx);
    const calc = 15 + (count * 2);
    return isTwoWay ? Math.round(calc * 1.8) : calc;
  }, [fromStation, toStation, isTwoWay]);

  const handleBookTicket = async () => {
    if (!fromStation || !toStation) return;
    
    const newTicket: Ticket = {
      id: `T-${Date.now().toString().slice(-6)}`,
      from: fromStation.name,
      to: toStation.name,
      fare,
      type: isTwoWay ? 'Two Way' : 'One Way',
      timestamp: Date.now(),
      qrCode: `METRO-HYD-${fromStation.id}-${toStation.id}-${Date.now()}`
    };

    const updated = [newTicket, ...recentTickets].slice(0, 5);
    setRecentTickets(updated);
    
    try {
      await AsyncStorage.setItem('metro_history', JSON.stringify(updated));
    } catch (e) {
      console.log(e);
    }
    
    setActiveTicket(newTicket);
    setCurrentView(AppScreen.TICKET);
  };

  const resetSelection = () => {
    setFromStation(null);
    setToStation(null);
    setIsTwoWay(false);
  };

  const StationPicker = ({ visible, onClose, onSelect, title }: any) => (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#64748B" />

            </TouchableOpacity>
          </View>
          <ScrollView>
            {HYDERABAD_STATIONS.map(st => (
              <TouchableOpacity
                key={st.id}
                style={s.stationItem}
                onPress={() => { onSelect(st); onClose(); }}
              >
                <View style={[s.lineDot, { backgroundColor: st.color }]} />
                <View>
                  <Text style={s.stName}>{st.name}</Text>
                  <Text style={s.stLine}>{st.line} Line</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
  <SafeAreaView
  style={[
    s.container,
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
  ]}
>

      <StatusBar barStyle="light-content" />
      
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.logo}>
           <MaterialIcons name="directions-subway" size={26} color={colors.text} />

          </View>
          <View>
            <Text style={s.title}>Metro Hub</Text>
            <Text style={s.subtitle}>HYDERABAD</Text>
          </View>
        </View>
        <TouchableOpacity style={s.histBtn} onPress={() => setCurrentView(AppScreen.DASHBOARD)}>
        <MaterialIcons name="history" size={24} color={colors.text} />

        </TouchableOpacity>
      </View>

      <ScrollView style={s.main}>
        {currentView === AppScreen.DASHBOARD && (
          <View style={s.content}>
            <TouchableOpacity 
              style={s.bookBtn} 
              onPress={() => { 
                resetSelection(); 
                setCurrentView(AppScreen.ROUTE_PLAN); 
              }}
            >
              <View>
                <Text style={s.bookTitle}>Book Ticket</Text>
                <Text style={s.bookSub}>Single or Round Trip</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={28} color="#FFF" />

            </TouchableOpacity>

            <Text style={s.secTitle}>RECENT TICKETS</Text>
            {recentTickets.length === 0 ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>No recent history</Text>
              </View>
            ) : (
              recentTickets.map(t => (
                <TouchableOpacity 
                  key={t.id} 
                  style={s.histItem} 
                  onPress={() => { 
                    setActiveTicket(t); 
                    setCurrentView(AppScreen.TICKET); 
                  }}
                >
                  <Text style={s.histRoute}>{t.from} → {t.to}</Text>
                  <Text style={s.histMeta}>₹{t.fare} • {new Date(t.timestamp).toLocaleDateString()}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {currentView === AppScreen.ROUTE_PLAN && (
          <View style={s.content}>
            <TouchableOpacity onPress={() => setCurrentView(AppScreen.DASHBOARD)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
  <MaterialIcons name="arrow-back-ios" size={14} color="#6366F1" />
  <Text style={s.back}>BACK</Text>
</View>

            </TouchableOpacity>
            
            <Text style={s.planTitle}>Plan Your Trip</Text>

            <View style={s.selCard}>
              <View style={s.selItem}>
                <Text style={s.selLabel}>BOARDING STATION</Text>
                <TouchableOpacity style={s.selBtn} onPress={() => setShowFromPicker(true)}>
                  <Text style={s.selText}>{fromStation ? fromStation.name : 'Select'}</Text>
                </TouchableOpacity>
              </View>

              <View style={s.swap}>
               <MaterialIcons name="swap-vert" size={26} color="#6366F1" />

              </View>

              <View style={s.selItem}>
                <Text style={s.selLabel}>DROP-OFF STATION</Text>
                <TouchableOpacity style={s.selBtn} onPress={() => setShowToPicker(true)}>
                  <Text style={s.selText}>{toStation ? toStation.name : 'Select'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.toggle}>
              <TouchableOpacity 
                style={[s.toggleBtn, !isTwoWay && s.toggleActive]} 
                onPress={() => setIsTwoWay(false)}
              >
                <Text style={[s.toggleText, !isTwoWay && s.toggleTextActive]}>ONE WAY</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[s.toggleBtn, isTwoWay && s.toggleActive]} 
                onPress={() => setIsTwoWay(true)}
              >
                <Text style={[s.toggleText, isTwoWay && s.toggleTextActive]}>TWO WAY</Text>
              </TouchableOpacity>
            </View>

            {fromStation && toStation && (
              <View style={s.fareCard}>
                <Text style={s.fareLabel}>FARE</Text>
                <Text style={s.fareAmount}>₹{fare}</Text>
              </View>
            )}

            <TouchableOpacity 
              disabled={!fromStation || !toStation}
              onPress={handleBookTicket}
              style={[s.payBtn, (!fromStation || !toStation) && s.payBtnDis]}
            >
              <Text style={s.payText}>PAY ₹{fare} & BOOK</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentView === AppScreen.TICKET && activeTicket && (
          <View style={s.content}>
            <TouchableOpacity onPress={() => setCurrentView(AppScreen.DASHBOARD)}>
              <Text style={s.back}>← HOME</Text>
            </TouchableOpacity>

            <View style={s.ticket}>
              <View style={s.tTop}>
                <Text style={s.tLogo}>🚇 HYD METRO</Text>
                <Text style={s.tId}>{activeTicket.id}</Text>
              </View>
              
              <View style={s.tRoute}>
                <View>
                  <Text style={s.tLabel}>FROM</Text>
                  <Text style={s.tStation}>{activeTicket.from}</Text>
                </View>
                <Text style={s.tArrow}>→</Text>
                <View style={s.tRight}>
                  <Text style={s.tLabel}>TO</Text>
                  <Text style={s.tStation}>{activeTicket.to}</Text>
                </View>
              </View>

              <View style={s.tBody}>
                <View style={s.qr}>
                 <View style={s.qr}>
  <MaterialIcons name="qr-code-2" size={120} color="#334155" />
</View>

                </View>
                <Text style={s.scan}>SCAN AT ENTRY</Text>
                <Text style={s.tMeta}>{activeTicket.type} • ₹{activeTicket.fare}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={s.doneBtn} 
              onPress={() => setCurrentView(AppScreen.DASHBOARD)}
            >
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <MaterialIcons name="check-circle" size={22} color="#FFF" />
  <Text style={s.doneText}>DONE</Text>
</View>

            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <StationPicker 
        visible={showFromPicker} 
        onClose={() => setShowFromPicker(false)} 
        onSelect={setFromStation} 
        title="Boarding Station" 
      />
      <StationPicker 
        visible={showToPicker} 
        onClose={() => setShowToPicker(false)} 
        onSelect={setToStation} 
        title="Drop-off Station" 
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    // Container
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    // Header Styles
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
    },
    
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    logo: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    
    logoText: {
      fontSize: 24,
    },
    
    title: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.text,
    },
    
    subtitle: {
      fontSize: 9,
      fontWeight: '700',
      color: colors.subText,
      letterSpacing: 2,
    },
    
    histBtn: {
      width: 48,
      height: 48,
      backgroundColor: colors.card,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    histText: {
      fontSize: 24,
    },
    
    // Main Content
    main: {
      flex: 1,
    },
    
    content: {
      padding: 20,
      gap: 20,
    },
    
    // Book Button
    bookBtn: {
      backgroundColor: colors.primary,
      borderRadius: 32,
      padding: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    bookTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.onPrimary,
    },
    
    bookSub: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primaryTint,
      marginTop: 4,
    },
    
    bookIcon: {
      fontSize: 32,
      color: colors.onPrimary,
    },
    
    // Section Title
    secTitle: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.subText,
      letterSpacing: 2,
      marginTop: 8,
    },
    
    // Empty State
    empty: {
      padding: 40,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: colors.dashedBorder,
      borderRadius: 32,
      alignItems: 'center',
    },
    
    emptyText: {
      fontSize: 14,
      color: colors.subText,
    },
    
    // History Item
    histItem: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 20,
    },
    
    histRoute: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
    },
    
    histMeta: {
      fontSize: 12,
      color: colors.subText,
      marginTop: 4,
    },
    
    // Back Button
    back: {
      fontSize: 12,
      fontWeight: '900',
      color: colors.primary,
      letterSpacing: 2,
    },
    
    // Plan Title
    planTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: colors.text,
    },
    
    // Selection Card
    selCard: {
      backgroundColor: colors.card,
      borderRadius: 32,
      padding: 8,
      gap: 4,
    },
    
    selItem: {
      padding: 16,
    },
    
    selLabel: {
      fontSize: 9,
      fontWeight: '900',
      color: colors.subText,
      letterSpacing: 2,
      marginBottom: 8,
    },
    
    selBtn: {
      backgroundColor: colors.cardLight,
      borderRadius: 16,
      padding: 16,
    },
    
    selText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    
    // Swap Button
    swap: {
      alignItems: 'center',
      paddingVertical: 8,
    },
    
    swapText: {
      fontSize: 24,
      color: colors.primary,
    },
    
    // Toggle Styles
    toggle: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 6,
      gap: 6,
    },
    
    toggleBtn: {
      flex: 1,
      padding: 16,
      borderRadius: 18,
      alignItems: 'center',
    },
    
    toggleActive: {
      backgroundColor: colors.primary,
    },
    
    toggleText: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.subText,
      letterSpacing: 2,
    },
    
    toggleTextActive: {
      color: colors.onPrimary,
    },
    
    // Fare Card
    fareCard: {
      backgroundColor: colors.card,
      borderRadius: 32,
      padding: 32,
      alignItems: 'center',
    },
    
    fareLabel: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.primary,
      letterSpacing: 2,
    },
    
    fareAmount: {
      fontSize: 48,
      fontWeight: '900',
      color: colors.text,
      marginTop: 8,
    },
    
    // Payment Button
    payBtn: {
      backgroundColor: colors.primary,
      borderRadius: 28,
      padding: 24,
      alignItems: 'center',
    },
    
    payBtnDis: {
      backgroundColor: colors.disabled,
      opacity: 0.5,
    },
    
    payText: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.onPrimary,
      letterSpacing: 2,
    },
    
    // Ticket Styles
    ticket: {
      backgroundColor: colors.ticketBg,
      borderRadius: 32,
      overflow: 'hidden',
    },
    
    tTop: {
      backgroundColor: colors.primary,
      padding: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    
    tLogo: {
      fontSize: 14,
      fontWeight: '900',
      color: colors.onPrimary,
    },
    
    tId: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.onPrimary,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    
    tRoute: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      backgroundColor: colors.primary,
    },
    
    tLabel: {
      fontSize: 9,
      fontWeight: '900',
      color: colors.primaryTint,
      letterSpacing: 2,
    },
    
    tStation: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.onPrimary,
      marginTop: 4,
    },
    
    tArrow: {
      fontSize: 24,
      color: colors.onPrimary,
    },
    
    tRight: {
      alignItems: 'flex-end',
    },
    
    tBody: {
      padding: 40,
      alignItems: 'center',
    },
    
    qr: {
      width: 180,
      height: 180,
      backgroundColor: colors.ticketQr,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    qrText: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.ticketQrText,
    },
    
    scan: {
      fontSize: 11,
      fontWeight: '900',
      color: colors.subTextLight,
      letterSpacing: 3,
      marginTop: 24,
    },
    
    tMeta: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.subText,
      marginTop: 16,
    },
    
    doneBtn: {
      backgroundColor: colors.primary,
      borderRadius: 28,
      padding: 24,
      alignItems: 'center',
    },
    
    doneText: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.onPrimary,
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      maxHeight: '80%',
    },
    
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.modalBorder,
    },
    
    modalTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
    },
    
    modalClose: {
      fontSize: 24,
      color: colors.subText,
      fontWeight: '700',
    },
    
    // Station List
    stationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.modalBorder,
    },
    
    lineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 16,
    },
    
    stName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    
    stLine: {
      fontSize: 11,
      color: colors.subText,
      marginTop: 2,
    },
  });

export default MetroView;