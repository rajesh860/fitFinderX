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
              { backgroundColor: isExpired ? COLORS.error + "30" : COLORS.primary + "20", borderWidth: 1, borderColor: isExpired ? COLORS.error : COLORS.primary },
            ]}
          >
            <Text
              style={[
                styles.planChipText,
                { color: isExpired ? COLORS.error : COLORS.primary },
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
            { backgroundColor: isExpired ? COLORS.error + "20" : COLORS.success + "20", borderColor: isExpired ? COLORS.error : COLORS.success },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isExpired ? COLORS.error : COLORS.success },
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
            labelStyle={{ color: COLORS.primary, fontWeight: "600" }}
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
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  cardTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "700" },
  planChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  planChipText: { fontSize: 12, fontWeight: "600" },
  planName: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    textTransform: "capitalize",
  },
  dateContainer: {
    marginTop: 14,
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  dateLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  dateValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  statusContainer: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  outlineBtn: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 2,
  },
});

export default PlanCard;
