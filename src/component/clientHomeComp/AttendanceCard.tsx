import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ring from "./Ring";
import { COLORS } from "../../theme/colors";

const AttendanceCard = ({ attendance, totalDays }) => {
  const attendancePercent = useMemo(() => {
    if (!totalDays || totalDays <= 0) return 0;
    return Math.min(Math.max(attendance.done / totalDays, 0), 1);
  }, [attendance.done, totalDays]);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>Your Attendance</Text>
        <View style={styles.attendanceRow}>
          <View style={styles.ringWrap}>
            <Ring size={96} strokeWidth={10} progress={attendancePercent} color={COLORS.primary} bg={COLORS.gray700} />
            <View style={styles.ringCenter}>
              <Text style={styles.ringNumber}>{attendance.done}/{totalDays}</Text>
              <Text style={styles.ringLabel}>days</Text>
            </View>
          </View>

          <View style={styles.attendanceBadges}>
            <View style={[styles.badge, attendance.presentToday ? styles.badgeActive : styles.badgeInactive]}>
              <Icon name={attendance.presentToday ? "checkbox-marked-circle" : "clock-outline"} size={16} color={attendance.presentToday ? COLORS.textPrimary : COLORS.textSecondary} />
              <Text style={[styles.badgeText, attendance.presentToday && styles.badgeTextActive]}>
                {attendance.presentToday ? "Present Today" : "Not Present"}
              </Text>
            </View>
            <View style={[styles.badge, styles.badgeStreak]}>
              <Icon name="fire" size={16} color={COLORS.primary} />
              <Text style={styles.badgeTextStreak}>{attendance.streakDays}-Day Streak</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "700", marginBottom: 16 },
  attendanceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ringWrap: { width: 110, alignItems: "center", justifyContent: "center", position: "relative", paddingVertical: 10 },
  ringCenter: { position: "absolute", alignItems: "center", justifyContent: "center" },
  ringNumber: { color: COLORS.textPrimary, fontWeight: "700", fontSize: 18 },
  ringLabel: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  attendanceBadges: { flex: 1, paddingLeft: 12, justifyContent: "center" },
  badge: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderRadius: 10, 
    marginBottom: 8,
    borderWidth: 1,
  },
  badgeActive: { 
    backgroundColor: COLORS.success + "20", 
    borderColor: COLORS.success,
  },
  badgeInactive: { 
    backgroundColor: COLORS.gray700, 
    borderColor: COLORS.border,
  },
  badgeStreak: { 
    backgroundColor: COLORS.primary + "20", 
    borderColor: COLORS.primary,
  },
  badgeText: { 
    color: COLORS.textSecondary, 
    marginLeft: 8, 
    fontWeight: "600",
    fontSize: 13,
  },
  badgeTextActive: {
    color: COLORS.success,
  },
  badgeTextStreak: {
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 13,
  },
});

export default AttendanceCard;
