import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Card, Avatar, Chip } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../theme/colors";
import { useGetPlanHistoryQuery } from "../services/userService";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
import GymDetailsHeader from "../component/appHeader";

const planBg: any = {
  BASIC: "#007BFF",
  SILVER: "#A9A9A9",
  GOLD: "#FFD700",
  PLATINUM: "#7B3FE4",
  PREMIUM: "#6C63FF",
};

const planIcons: any = {
  BASIC: "barbell",
  SILVER: "fitness-outline",
  GOLD: "trophy-outline",
  PLATINUM: "diamond-outline",
  PREMIUM: "star-outline",
  DEFAULT: "body-outline",
};

export default function PlansScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { gymId } = route.params as { gymId: string };
  const { data, isLoading, isError, refetch } = useGetPlanHistoryQuery(gymId);

  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Expired">("All");
  const [refreshing, setRefreshing] = useState(false);

  // 🔄 Pull to refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // 🧠 Transform and map plans
  const plans = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item: any, index: number) => {
      const planLevel = item.plan?.name?.toUpperCase() || "BASIC";
      const status = item.status?.toLowerCase() === "active" ? "Active" : "Expired";
      return {
        id: item._id || index.toString(),
        title: item.gym?.gymName || "Unknown Gym",
        type: `${planLevel} PLAN`,
        planLevel,
        start: moment(item.membership_start).format("MMM DD, YYYY"),
        end: moment(item.membership_end).format("MMM DD, YYYY"),
        purchased: moment(item.purchasedAt).format("MMM DD, YYYY, h:mm A"),
        status,
        icon: planIcons[planLevel] || planIcons.DEFAULT,
      };
    });
  }, [data]);

  const filteredPlans = plans.filter((plan) =>
    activeTab === "All" ? true : plan.status === activeTab
  );

  const renderTab = (label: "All" | "Active" | "Expired") => {
    const isActive = activeTab === label;
    return (
      <TouchableOpacity onPress={() => setActiveTab(label)}>
        <View style={[styles.tab, isActive && styles.tabActive]}>
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
            {label === "All" ? "All Plans" : label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPlan = ({ item }: any) => {
    const isActive = item.status.toLowerCase() === "active";
    const planColor = planBg[item.planLevel] || COLORS.primary;

    return (

      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <Avatar.Icon
            size={50}
            icon={({ size, color }) => (
              <Ionicons name={item.icon} size={size} color={color} />
            )}
            style={[styles.avatar, { backgroundColor: planColor + "33" }]}
            color={planColor}
          />
          <View style={styles.cardContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>{item.title}</Text>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  isActive ? styles.activeChip : styles.expiredChip,
                ]}
              >
                <Text style={styles.chipText}>{item.status}</Text>
              </Chip>
            </View>

            <Text style={[styles.planType, { color: planColor }]}>{item.type}</Text>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} style={styles.metaIcon} />
              <Text style={styles.metaText}>Start: {item.start}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} style={styles.metaIcon} />
              <Text style={styles.metaText}>End: {item.end}</Text>
            </View>

            <View style={[styles.rowBetween, { marginTop: 8 }]}>
              <Text style={styles.purchasedText}>Purchased on {item.purchased}</Text>
            </View>
          </View>
        </View>
      </Card>

    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text style={{ color: "white" }}>Failed to load plan history.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <GymDetailsHeader navigation={navigation} title="Plan list" like={true} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* 🔹 Tabs */}
        <View style={styles.header}>
          <View style={styles.tabsRow}>
            {renderTab("All")}
            {renderTab("Active")}
            {renderTab("Expired")}
          </View>
        </View>

        {/* 🔹 No Data View */}
        {filteredPlans.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="document-text-outline" size={60} color={COLORS.primary} />
            <Text style={styles.noDataTitle}>No Plans Found</Text>
            <Text style={styles.noDataSubtitle}>
              You currently have no {activeTab === "All" ? "" : activeTab.toLowerCase()} plans.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPlans}
            keyExtractor={(i) => i.id}
            renderItem={renderPlan}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
          />
        )}
      </SafeAreaView>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0d14",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a2834",
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: "#bdb8cf",
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.gray800,
    borderRadius: 14,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    marginRight: 12,
    borderRadius: 6,
  },
  cardContent: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
    color: COLORS.gray100,
  },
  statusChip: {
    height: 30,
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 14,
    elevation: 0,
  },
  activeChip: {
    backgroundColor: "#1a7f46",
    display: "flex",
    alignItems: "center"
  },
  expiredChip: {
    backgroundColor: "#5c6168",
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  },
  planType: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  metaIcon: {
    color: "#9a93a8",
    marginRight: 8,
  },
  metaText: {
    color: "#cfcde0",
    fontSize: 13,
  },
  purchasedText: {
    color: "#9fa0b8",
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#0f0d14",
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noDataTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  noDataSubtitle: {
    color: "#bdb8cf",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },
});
