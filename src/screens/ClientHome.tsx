import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserDashboardQuery } from "../services/userService";
import { ActivityIndicator, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { COLORS } from "../theme/colors";

// Components
import Header from "../component/clientHomeComp/Header";
import QuoteCard from "../component/clientHomeComp/QuoteCard";
import AttendanceCard from "../component/clientHomeComp/AttendanceCard";
import ProgressCard from "../component/clientHomeComp/ProgressCard";
import PlanCard from "../component/clientHomeComp/PlanCard";
import TipCard from "../component/clientHomeComp/TipCard";
import CurrentGymCard from "../component/clientHomeComp/NextSessionCard";

const ClientHome = () => {
  const navigation = useNavigation();
  const userRole = useSelector((state: any) => state.auth.userRole);

  const { data, isLoading, isError, refetch } = useUserDashboardQuery(undefined, {
    skip: !userRole,
    refetchOnMountOrArgChange: true,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const userData = data?.data || {};
console.log(data,"yserhjk")
  // ✅ Attendance percentage
  const attendancePercent = useMemo(() => {
    const done = userData?.attendance?.present ?? 0;
    const totalDays = userData?.plan?.totalDays ?? 0;
    if (!Number.isFinite(done) || !Number.isFinite(totalDays) || totalDays <= 0)
      return 0;
    return Math.min(Math.max(done / totalDays, 0), 1);
  }, [userData?.attendance?.present, userData?.plan?.totalDays]);

  // 🌀 Loading UI
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" color="#ff914d" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Loading your dashboard...
        </Text>
      </View>
    );
  }

  // ❌ Error UI
  if (isError || !data?.data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Failed to load dashboard</Text>
      </View>
    );
  }

  // ✅ User data object
  const user = {
    name: userData.memberName?.trim() || "User",
    memberId: userData?.memberId,
    gymDetails: userData?.plan?.gymDetails || {},
    attendance: {
      done: userData.attendance?.present || 0,
      total: userData.attendance?.total || 1,
      presentToday: userData.attendance?.presentToday || false,
      streakDays: userData.attendance?.streakDays || 0,
    },
    progress: userData.progress || {},
    plan: userData.plan || null,
    nextSession: userData.nextSession || {},
    tip: userData.tip || "",
  };

  // 🧠 Plan expiry check
  const today = new Date();
  const endDate = user?.plan?.endDate ? new Date(user.plan.endDate) : null;
  const isExpired = user?.plan?.status;

  return (
    <View style={styles.container}>
      <Header
        userName={user.name}
        onScanPress={() => navigation.navigate("ScanQRScreen")}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff914d"
            colors={["#ff914d"]}
            progressBackgroundColor="#1e293b"
          />
        }
      >
        <QuoteCard text="Push yourself because no one else is going to do it for you." />
        <AttendanceCard
          attendance={user.attendance}
          totalDays={user.plan?.totalDays || 0}
        />
        <ProgressCard progress={user.progress} />
        <PlanCard plan={user.plan} memberId={user?.memberId} />

        {/* 🧩 Current Gym Card */}
        <CurrentGymCard
          gym={{
            name: user?.plan?.gymDetails?.name || "No Active Plan",
            planName: isExpired
              ? "No Active Membership"
              : `${user.plan?.totalDays || 0} Days Transformation`,
            daysLeft: user?.plan?.daysLeft || 0,
            status: isExpired ? "expired" : user?.plan?.gymDetails?.status,
            avgRating: user?.gymDetails?.avgRating,
            totalReviews: user?.gymDetails?.totalReviews,
            endDate: user?.plan?.endDate,
          }}
          expired={isExpired}
          onRenew={() => {
            if (isExpired) {
              navigation.navigate("RenewPlanScreen", {
                memberId: user?.memberId,
                currentPlan: user.plan,
              });
            }
          }}
        />

        <TipCard tip={user.tip} />
      </ScrollView>
    </View>
  );
};

export default ClientHome;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1720" },
  content: { padding: 10 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f1720",
  },
});
