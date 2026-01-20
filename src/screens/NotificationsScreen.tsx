import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

/* ------------------------------------------------------------------
   TYPES
------------------------------------------------------------------ */
export type FilterType =
  | 'All'
  | 'Unread'
  | 'Housing'
  | 'Education'
  | 'Freelance';

export interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  category: FilterType;
  unread: boolean;
}


/* ------------------------------------------------------------------
   DATA
------------------------------------------------------------------ */
const notifications: Notification[] = [
  {
    id: 1,
    title: 'Housing Application Approved',
    desc: 'Your request for the downtown apartment has been approved.',
    time: '2m ago',
    category: 'Housing',
    unread: true,
  },
  {
    id: 2,
    title: 'New: Math Tutoring Available',
    desc: '50+ new tutors added. Book your first session.',
    time: '1h ago',
    category: 'Education',
    unread: true,
  },
  {
    id: 3,
    title: 'Version 2.0 is Live',
    desc: 'Smoother interface and faster loading.',
    time: '1d ago',
    category: 'All',
    unread: false,
  },
  {
    id: 4,
    title: 'New Freelance Gig Match',
    desc: 'A new UI project matches your profile.',
    time: '1d ago',
    category: 'Freelance',
    unread: false,
  },
];


/* ------------------------------------------------------------------
   FILTER CHIPS
------------------------------------------------------------------ */
const filters: FilterType[] = [
  'All',
  'Unread',
  'Housing',
  'Education',
  'Freelance',
];

const FilterChips = ({
  activeFilter,
  onChange,
  styles,
}: {
  activeFilter: FilterType;
  onChange: (filter: FilterType) => void;
  styles: any;
}) => {

  return (
    <View style={styles.chipsContainer}>
      {filters.map(filter => {
        const isActive = activeFilter === filter;

        return (
          <TouchableOpacity
            key={filter}
            onPress={() => onChange(filter)}
            style={[
              styles.chip,
              isActive && styles.activeChip,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                isActive && styles.activeChipText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/* ------------------------------------------------------------------
   NOTIFICATION ITEM
------------------------------------------------------------------ */
const NotificationItem = ({
  title,
  desc,
  time,
  unread,
  styles,
}: {
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  styles: any;
}) => {

  return (
    <View style={styles.itemContainer}>
      {unread && <View style={styles.unreadStrip} />}

      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemTime}>{time}</Text>
        </View>

        <Text style={styles.itemDesc}>{desc}</Text>
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------
   MAIN SCREEN
------------------------------------------------------------------ */
const NotificationScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [activeFilter, setActiveFilter] =
    useState<FilterType>('All');

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') return notifications;

    if (activeFilter === 'Unread') {
      return notifications.filter(n => n.unread);
    }

    return notifications.filter(
      n => n.category === activeFilter,
    );
  }, [activeFilter]);


  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.heading}>Notifications</Text>

      <FilterChips
  activeFilter={activeFilter}
  onChange={setActiveFilter}
  styles={styles}
/>


      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
         <NotificationItem
  title={item.title}
  desc={item.desc}
  time={item.time}
  unread={item.unread}
  styles={styles}
/>

        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

/* ------------------------------------------------------------------
   STYLES
------------------------------------------------------------------ */

const getStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    heading: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },

    /* ================= CHIPS ================= */
    chipsContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingBottom: 12,
    },

    chip: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999, // smoother pill
      marginRight: 8,
    },

    activeChip: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    chipText: {
      color: colors.subText,
      fontSize: 13,
      fontWeight: "600",
    },

    activeChipText: {
      color: "#ffffff",
      fontWeight: "700",
    },

    /* ================= NOTIFICATION ITEM ================= */
    itemContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },

    unreadStrip: {
      width: 4,
      backgroundColor: colors.primary,
      borderRadius: 4,
      marginRight: 12,
    },

    itemContent: {
      flex: 1,
    },

    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    itemTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
      flex: 1,
      marginRight: 8,
    },

    itemTime: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "600",
    },

    itemDesc: {
      marginTop: 6,
      color: colors.subText,
      fontSize: 14,
      lineHeight: 20,
    },
  });
