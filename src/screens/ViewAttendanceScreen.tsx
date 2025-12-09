import React, { useState, useMemo, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import {
  useGetPlanHistoryQuery,
  useGymUserAttendenceQuery,
} from "../services/userService";

const ViewAttendanceScreen = () => {
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const route = useRoute();
  const { gymId } = route.params as { gymId: string };

  const { data: planHistory } = useGetPlanHistoryQuery(gymId);
  const { data, refetch } = useGymUserAttendenceQuery(gymId);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const user = {
    name: data?.user?.name,
    avatar: data?.user?.userPhoto,
  };

  const statusColors: any = {
    present: "#10b981",
    absent: "#ef4444",
    notMarked: "#6b7280",
  };

  // 🟢 Auto-select active plan
  const activePlan = planHistory?.data?.find((p: any) => p.status === "active");
  
  // ✅ Fixed: Always set selectedPlan to active plan initially
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // ✅ Fixed: Auto-set selectedPlan when activePlan is available
  useEffect(() => {
    if (activePlan && !selectedPlan) {
      setSelectedPlan(activePlan);
    }
  }, [activePlan, selectedPlan]);

  // ✅ Fixed: Also update when planHistory changes
  useEffect(() => {
    if (planHistory?.data && !selectedPlan) {
      const active = planHistory.data.find((p: any) => p.status === "active");
      if (active) {
        setSelectedPlan(active);
      } else if (planHistory.data.length > 0) {
        // If no active plan, select the first one
        setSelectedPlan(planHistory.data[0]);
      }
    }
  }, [planHistory, selectedPlan]);

  const startDate = selectedPlan?.membership_start;
  const endDate = selectedPlan?.membership_end;

  // Track the currently visible month
  const [visibleMonth, setVisibleMonth] = useState(
    startDate ? new Date(startDate) : new Date()
  );

  // 🧮 Filter attendance based on selected plan
  const filteredAttendance = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    return (
      data?.data?.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      }) || []
    );
  }, [data, startDate, endDate]);

  // 🗓️ Marked dates for calendar
  const markedDates: any = {};
  filteredAttendance.forEach((item: any) => {
    const dateKey = item.date.split("T")[0];
    markedDates[dateKey] = {
      customStyles: {
        container: {
          backgroundColor: statusColors[item.status],
          borderRadius: 20,
        },
        text: { color: "#fff" },
      },
    };
  });

  // Highlight start and end date
  if (startDate) {
    markedDates[startDate.split("T")[0]] = {
      customStyles: {
        container: { backgroundColor: "#3b82f6", borderRadius: 20 },
        text: { color: "#fff" },
      },
    };
  }
  if (endDate) {
    markedDates[endDate.split("T")[0]] = {
      customStyles: {
        container: { backgroundColor: "#f97316", borderRadius: 20 },
        text: { color: "#fff" },
      },
    };
  }

  // Update visible month if plan changes
  useEffect(() => {
    if (startDate) setVisibleMonth(new Date(startDate));
  }, [selectedPlan]);

  // ✅ Fixed: Check if arrow navigation should be disabled
  const canGoBack = () => {
    if (!startDate) return false;
    
    const prevMonth = new Date(visibleMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    const start = new Date(startDate);
    // Compare year and month only
    return prevMonth.getFullYear() > start.getFullYear() || 
          (prevMonth.getFullYear() === start.getFullYear() && prevMonth.getMonth() >= start.getMonth());
  };

  const canGoForward = () => {
    if (!endDate) return false;
    
    const nextMonth = new Date(visibleMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const end = new Date(endDate);
    // Compare year and month only
    return nextMonth.getFullYear() < end.getFullYear() || 
          (nextMonth.getFullYear() === end.getFullYear() && nextMonth.getMonth() <= end.getMonth());
  };

  // ✅ Fixed: Handle month change with proper restrictions
  const handleMonthChange = (month: any) => {
    const newDate = new Date(month.dateString);
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Restrict to within plan duration
      if (newDate < start) {
        setVisibleMonth(start);
      } else if (newDate > end) {
        setVisibleMonth(end);
      } else {
        setVisibleMonth(newDate);
      }
    } else {
      setVisibleMonth(newDate);
    }
  };

  // ✅ Fixed: Arrow handlers with proper month calculation
  const handleArrowLeft = (subtractMonth: () => void) => {
    if (canGoBack()) {
      const newMonth = new Date(visibleMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      setVisibleMonth(newMonth);
      subtractMonth();
    }
  };

  const handleArrowRight = (addMonth: () => void) => {
    if (canGoForward()) {
      const newMonth = new Date(visibleMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      setVisibleMonth(newMonth);
      addMonth();
    }
  };

  // ✅ Fixed: Show loading state until plan is selected
  if (!selectedPlan) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: COLORS.textPrimary }}>Loading plan data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>
            {selectedPlan?.gym?.gymName || "Gym Name"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {startDate ? new Date(startDate).toDateString() : ""} –{" "}
            {endDate ? new Date(endDate).toDateString() : ""}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={styles.container}>
          {/* User Card */}
          <View style={styles.userCard}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.planTag}>
                <Text style={styles.planText}>
                  {selectedPlan?.plan?.name || "Plan"}
                </Text>
              </View>
              <Text style={styles.validText}>
                Valid until{" "}
                {endDate ? new Date(endDate).toDateString() : "Not available"}
              </Text>
            </View>
          </View>

          {/* Plan Dropdown */}
          <View
            style={{
              backgroundColor: COLORS.gray700,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Picker
              selectedValue={selectedPlan?._id}
              dropdownIconColor={COLORS.primary}
              onValueChange={(planId) => {
                const plan = planHistory?.data?.find(
                  (p: any) => p._id === planId
                );
                if (plan) setSelectedPlan(plan);
              }}
              style={{ color: COLORS.textPrimary }}
            >
              {planHistory?.data?.map((plan: any) => (
                <Picker.Item
                  key={plan._id}
                  label={`${plan.plan.name} ${plan.status === 'active' ? '(Active)' : ''}`}
                  value={plan._id}
                />
              ))}
            </Picker>
          </View>

          {/* Calendar */}
          <View style={styles.calendarContainer}>
            <Calendar
              markingType="custom"
              markedDates={markedDates}
              current={visibleMonth.toISOString().split("T")[0]}
              minDate={startDate}
              maxDate={endDate}
              onMonthChange={handleMonthChange}
              onPressArrowLeft={handleArrowLeft}
              onPressArrowRight={handleArrowRight}
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
                arrowStyle: {
                  opacity: 1,
                },
              }}
              // renderArrow={(direction) => {
              //   const isLeft = direction === 'left';
              //   const isDisabled = isLeft ? !canGoBack() : !canGoForward();
                
              //   return (
              //     <View style={{ opacity: isDisabled ? 0.3 : 1 }}>
              //       <Icon 
              //         name={isLeft ? "chevron-left" : "chevron-right"} 
              //         size={24} 
              //         color={isDisabled ? COLORS.gray500 : COLORS.primary} 
              //       />
              //     </View>
              //   );
              // }}
            />
          </View>

          {/* Legend */}
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Legend</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#10b981" }]}
                />
                <Text style={{ color: COLORS.textPrimary }}>Present</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#ef4444" }]}
                />
                <Text style={{ color: COLORS.textPrimary }}>Absent</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#6b7280" }]}
                />
                <Text style={{ color: COLORS.textPrimary }}>Not Marked</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#3b82f6" }]}
                />
                <Text style={{ color: COLORS.textPrimary }}>Start Date</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#f97316" }]}
                />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
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
  calendarContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    borderColor: COLORS.gray600,
    overflow: "hidden",
  },
  legendCard: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray600,
    marginTop: 4,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  legendDot: { 
    width: 12,
    height: 12, 
    borderRadius: 6, 
    marginRight: 6 
  },
});