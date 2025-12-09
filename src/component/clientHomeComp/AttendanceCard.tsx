import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ring from "./Ring";

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
            <Ring size={96} strokeWidth={10} progress={attendancePercent} color="#34F3CE" bg="#122027" />
            <View style={styles.ringCenter}>
              <Text style={styles.ringNumber}>{attendance.done}/{totalDays}</Text>
              <Text style={styles.ringLabel}>days</Text>
            </View>
          </View>

          <View style={styles.attendanceBadges}>
            <View style={[styles.badge, attendance.presentToday ? styles.badgeGreen : styles.badgeGray]}>
              <Icon name={attendance.presentToday ? "checkbox-marked-circle" : "clock-outline"} size={14} color="#0b0b0b" />
              <Text style={styles.badgeText}>{attendance.presentToday ? "Present Today" : "Not Present"}</Text>
            </View>
            <View style={[styles.badge, styles.badgeOrange]}>
              <Icon name="fire" size={14} color="#FFF" />
              <Text style={styles.badgeText}>{attendance.streakDays}-Day Streak</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f1b22",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#12272c",
  },
  cardTitle: { color: "#cfeff0", fontSize: 15, fontWeight: "700", marginBottom: 10 },
  attendanceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ringWrap: { width: 110, alignItems: "center", justifyContent: "center", position: "relative", paddingVertical: 10 },
  ringCenter: { position: "absolute", alignItems: "center", justifyContent: "center" },
  ringNumber: { color: "#fff", fontWeight: "700", fontSize: 16 },
  ringLabel: { color: "#9fb2b6", fontSize: 12 },
  attendanceBadges: { flex: 1, paddingLeft: 8, justifyContent: "center" },
  badge: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, marginBottom: 8 },
  badgeText: { color: "#081418", marginLeft: 8, fontWeight: "600" },
  badgeGreen: { backgroundColor: "#34F3CE" },
  badgeOrange: { backgroundColor: "#f08b3a" },
  badgeGray: { backgroundColor: "#2a3a3d" },
});

export default AttendanceCard;
