import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { COLORS } from "../../theme/colors";
import { useNavigation } from "@react-navigation/native";

const PlanCard = ({ plan }) => {
  const navigation = useNavigation();

  if (!plan) return null;

  const startDate = plan?.membership_start
    ? new Date(plan.membership_start).toLocaleDateString()
    : "N/A";
  const endDate = plan?.membership_end
    ? new Date(plan.membership_end).toLocaleDateString()
    : "N/A";

  const isExpired = plan?.status === "expired";

  return (
    <Card
      style={[
        styles.card
      ]}
    >
      <Card.Content>
        {/* ---------- HEADER ---------- */}
        <View style={styles.planHeader}>
          <Text style={styles.cardTitle}>Your Current Plan</Text>
          <View
            style={[
              styles.planChip,
              { backgroundColor: isExpired ? "#b3261e" : "#0f2b33" },
            ]}
          >
            <Text
              style={[
                styles.planChipText,
                { color: isExpired ? "#fff" : "#9fb2b6" },
              ]}
            >
              {isExpired ? "Expired" : `${plan.daysLeft} Days Left`}
            </Text>
          </View>
        </View>

        {/* ---------- PLAN NAME ---------- */}
        <Text style={styles.planName}>{plan?.name || "N/A"}</Text>

        {/* ---------- DATE SECTION ---------- */}
        <View style={styles.dateContainer}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Start Date:</Text>
            <Text style={styles.dateValue}>{startDate}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>End Date:</Text>
            <Text style={styles.dateValue}>{endDate}</Text>
          </View>
        </View>

        {/* ---------- STATUS ---------- */}
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: isExpired ? "#2a0e0e" : "#0f2b33" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isExpired ? "#ff6b6b" : "#6fe2e0" },
            ]}
          >
            {isExpired ? "❌ Membership Expired" : "✅ Active Membership"}
          </Text>
        </View>

        {/* ---------- BUTTON ---------- */}
        <View style={{ marginTop: 14 }}>
          <Button
            mode="outlined"
            onPress={() =>
              navigation.navigate("planDetail", { planId: plan?.planId,isExpired:isExpired })
            }
            uppercase={false}
            style={styles.outlineBtn}
            labelStyle={{ color: "#cfeff0" }}
          >
            View Plan Details
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f1b22",
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#12272c",
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: "#cfeff0", fontSize: 15, fontWeight: "700" },
  planChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  planChipText: { fontSize: 12, fontWeight: "600" },
  planName: {
    color: "#6fe2e0",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    textTransform: "capitalize",
  },
  dateContainer: {
    marginTop: 12,
    backgroundColor: "#0b1419",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#1d343a",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  dateLabel: {
    color: "#9fb2b6",
    fontSize: 13,
    fontWeight: "500",
  },
  dateValue: {
    color: "#cfeff0",
    fontSize: 13,
    fontWeight: "600",
  },
  statusContainer: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  outlineBtn: {
    borderColor: "#28454a",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 2,
  },
});

export default PlanCard;
