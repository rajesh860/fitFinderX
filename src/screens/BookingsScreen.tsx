import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Card, Button, ActivityIndicator } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import GymDetailsHeader from "../component/appHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useUserCancelEnquiryMutation, useUserGetEnquiryQuery } from "../services/userService";
import Toast from 'react-native-toast-message';
import { capitalizeWords } from "../component/common/wordCapitalized";
import { COLORS } from "../theme/colors";

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { data, refetch, isLoading } = useUserGetEnquiryQuery();
  const [cancelEnquiry, { isLoading: cancelLoading }] = useUserCancelEnquiryMutation();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleCancelBooking = async (id: string) => {
    try {
      const res: any = await cancelEnquiry(id).unwrap();
      if (res.success) {
        Toast.show({
          type: 'success',
          text1: 'Booking Cancelled',
          text2: res.message || "Your booking has been cancelled successfully.",
        });
        refetch();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.data?.message || "Something went wrong.",
      });
    }
  };

  const filteredEnquiries = data?.enquiries?.filter((item: any) => {
    if (activeTab === "Upcoming") return item.status === "upcoming" && !item.cancelled;
    if (activeTab === "Completed") return item.status === "completed" && !item.cancelled;
    if (activeTab === "Cancelled") return item.status === "cancelled" && !item.cancelled;
    return false;
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator animating={true} color={COLORS.primary} size="large" />
        <Text style={{ marginTop: 10, color: COLORS.textPrimary }}>Loading gyms...</Text>
      </View>
    );
  }

  const tagsColor = {
    pending: { background: "#3a3a3a", text: "#fff" },
    upcoming: { background: "#2a2a2a", text: "#6C63FF" },
    completed: { background: "#2a2a2a", text: "#28a745" },
    cancelled: { background: "#2a2a2a", text: "#ff4c4c" },
  };

  return (
    <>
      <GymDetailsHeader navigation={navigation} title="My Bookings" like={false} />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Manage your gym sessions and trials here</Text>
        </View>

        <View style={styles.tabWrapper}>
          {["Upcoming", "Completed", "Cancelled"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />}
        >
          {filteredEnquiries?.length > 0 ? (
            filteredEnquiries.map((item: any) => (
              <Card key={item._id} style={styles.card}>
                <Card.Content>
                  <View style={styles.row}>
                    <View style={[styles.iconWrapper, { backgroundColor: COLORS.primary }]}>
                      <Ionicons name="barbell-outline" size={20} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.gymName}>{item.gymId.gymName}</Text>
                      <Text style={styles.planName}>Trial Session</Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: tagsColor[item.status]?.background || "#444" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: tagsColor[item.status]?.text || "#fff" },
                        ]}
                      >
                        {capitalizeWords(item.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color="#aaa" />
                    <Text style={styles.infoText}>
                      {new Date(item.date).toDateString()} at {item.time}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color="#aaa" />
                    <Text style={styles.infoText}>{item.gymId.address}</Text>
                  </View>

                  <View style={styles.buttonRow}>
                    {item.status !== "cancelled" && (
                      <Button
                        mode="contained"
                        style={styles.cancelButton}
                        labelStyle={{ color: "#fff", fontWeight: "600" }}
                        loading={cancelLoading}
                        onPress={() => handleCancelBooking(item._id)}
                      >
                        Cancel Booking
                      </Button>
                    )}

                    <TouchableOpacity style={styles.callButton}>
                      <Ionicons name="call-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 50, fontSize: 16, color: COLORS.textPrimary }}>
              No bookings found for {activeTab}
            </Text>
          )}
        </ScrollView>
      </View>

      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16 },
  subtitle: { fontSize: 14, color: COLORS.textPrimary, marginTop: 2 },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: "500", color: "#ccc" },
  activeTabText: { color: "#fff", fontWeight: "600" },

  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  gymName: { fontSize: 15, fontWeight: "700", color: "#fff" },
  planName: { fontSize: 13, color: "#ccc" },
  badge: {
    backgroundColor: "#444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  infoText: { fontSize: 13, marginLeft: 6, color: "#ccc" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    elevation: 0,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
});
