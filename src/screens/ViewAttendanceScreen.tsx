import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Month/Year Select
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { useGymUserAttendenceQuery } from "../services/userService";

const ViewAttendanceScreen = () => {
    const navigation:any = useNavigation()
  const [refreshing, setRefreshing] = useState(false);

  const route = useRoute();
  const { gymId, memberShip } = route.params as { gymId: string; memberShip: any };
console.log(memberShip,"memberShip")
  const { data, refetch } = useGymUserAttendenceQuery(gymId);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const user = {
    name: data?.user?.name,
    plan: memberShip?.plan || "Basic Plan",
    validUntil: memberShip?.endDate || "Dec 31, 2025",
    avatar: data?.user?.userPhoto,
  };

  const statusColors: any = {
    present: "#10b981",
    absent: "#ef4444",
    notMarked: "#6b7280",
  };

  const startDate = new Date(memberShip.startDate);
  const currentYearValue = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYearValue - 3 + i); // 3 years back & 3 years ahead

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const [selectedMonth, setSelectedMonth] = useState(startDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYearValue);

  const currentDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;

  const filteredAttendance = useMemo(() => {
    return (
      data?.data?.filter((item: any) => {
        const dateObj = new Date(item.date);
        return dateObj.getFullYear() === selectedYear && dateObj.getMonth() === selectedMonth;
      }) || []
    );
  }, [data, selectedMonth, selectedYear]);

  const attendanceMap: any = {};
  filteredAttendance.forEach((item: any) => {
    const dateKey = item.date.split("T")[0];
    attendanceMap[dateKey] = item.status;
  });

  const DayComponent = ({ date, state }: any) => {
    const attendanceStatus = attendanceMap[date.dateString] || "notMarked";
    const isInactive = state === "disabled";
    let bgColor = statusColors[attendanceStatus];

    if (date.dateString === memberShip.startDate) bgColor = "#3b82f6";
    if (date.dateString === memberShip.endDate) bgColor = "#f97316";

    const cellStyle = [
      calendarStyles.dayCell,
      { backgroundColor: bgColor },
      isInactive && calendarStyles.inactiveDayCell,
    ];

    return (
      <View style={cellStyle}>
        <Text style={calendarStyles.dayText}>{date.day}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.headerRow}>
        <TouchableOpacity  onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>{memberShip.gymName}</Text>
          <Text style={styles.headerSubtitle}>
            {memberShip.startDate} – {memberShip.endDate}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        <View style={styles.container}>
          <View style={styles.userCard}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.planTag}>
                <Text style={styles.planText}>{user.plan}</Text>
              </View>
              <Text style={styles.validText}>Valid until {user.validUntil}</Text>
            </View>
          </View>

          {/* Month & Year selectors */}
          <View style={styles.selectorRow}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMonth}
                dropdownIconColor={COLORS.primary}
                onValueChange={(value) => setSelectedMonth(value)}
                style={styles.picker}
              >
                {months.map((m, idx) => (
                  <Picker.Item key={idx} label={m} value={idx} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedYear}
                dropdownIconColor={COLORS.primary}
                onValueChange={(value) => setSelectedYear(value)}
                style={styles.picker}
              >
                {years.map((y, idx) => (
                  <Picker.Item key={idx} label={String(y)} value={y} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Calendar */}
          <View style={styles.calendarContainer}>
            <Calendar
              key={currentDate}
              dayComponent={DayComponent}
              current={currentDate}
              minDate={memberShip.startDate}
              maxDate={memberShip.endDate}
              hideArrows
              style={{ backgroundColor: COLORS.gray800 }}
              theme={{
                backgroundColor: COLORS.gray800,
                calendarBackground: COLORS.gray800,
                textSectionTitleColor: COLORS.textPrimary,
                dayTextColor: COLORS.textPrimary,
                monthTextColor: COLORS.primary,
                arrowColor: COLORS.primary,
                textDisabledColor: COLORS.gray500,
                todayTextColor: COLORS.primary,
              }}
              disableAllTouchEventsForDisabledDays={true}
            />
          </View>

          {/* Legend */}
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Legend</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
                <Text style={{ color: COLORS.textPrimary }}>Present</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
                <Text style={{ color: COLORS.textPrimary }}>Absent</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#6b7280" }]} />
                <Text style={{ color: COLORS.textPrimary }}>Not Marked</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
                <Text style={{ color: COLORS.textPrimary }}>Start Date</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#f97316" }]} />
                <Text style={{ color: COLORS.textPrimary }}>End Date</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewAttendanceScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.gray800,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary },
  userCard: {
    flexDirection: "row",
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 16, fontWeight: "600", color: COLORS.textPrimary, marginBottom: 4 },
  planTag: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 1,
  },
  planText: { fontSize: 12, fontWeight: "600", color: "#2563eb" },
  validText: { fontSize: 12, color: COLORS.textPrimary, marginTop: 4 },
  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: COLORS.gray700,
    borderRadius: 8,
    marginHorizontal: 7, // removed side padding
  },
  picker: {
    flex: 1,
    color: COLORS.textPrimary,
    margin: 0,
    padding: 0,
  },
  calendarContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    borderColor: COLORS.gray600,
  },
  legendCard: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray600,
    marginTop: 4,
  },
  legendTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: COLORS.textPrimary },
  legendRow: { flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
});

const calendarStyles = StyleSheet.create({
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveDayCell: {
    backgroundColor: "#374151",
  },
  dayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
