import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PlanCardProps {
  plan: any;
  active:string
}

const PlanCard: React.FC<PlanCardProps> = ({ plan ,active}) => {
  return (
    <Card style={styles.card}>
      {/* Header: Plan Name + Status */}
      <View style={styles.headerRow}>
        <Text style={styles.planName}>{plan.planName}</Text>
        {active &&
        <Text
        style={[
          styles.statusChip,
          active === "Active" ? styles.active : styles.inactive,
        ]}
        //   textStyle={styles.statusText}
        >
          {active?.toUpperCase() || "INACTIVE"}
        </Text>
    }
      </View>

      {/* Gym Name & Rating */}
      <View style={styles.gymRow}>
        <Icon name="dumbbell" size={16} color="#4dd0e1" />
        <Text style={styles.gymName}>{plan.gym?.name || "Gym Name"}</Text>
        {/* {plan.gym?.avgRating !== undefined && (
          <View style={styles.rating}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {plan.gym.avgRating.toFixed(1)} ({plan.gym.totalReviews || 0})
            </Text>
          </View>
        )} */}
      </View>

      {/* Price & Duration Row */}
      <View style={styles.rowBetweenInfo}>
        <View style={styles.infoItem}>
          <View style={styles.iconBox}>
            <Icon name="pricetag" size={24} color="#ff914d" />
          </View>
          <View style={styles.infoTextBox}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>₹{plan.price}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.iconBox}>
            <Icon name="calendar" size={24} color="#ff914d" />
          </View>
          <View style={styles.infoTextBox}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>
              {plan.durationInMonths} {plan.durationInMonths > 1 ? "Months" : "Month"}
            </Text>
          </View>
        </View>
      </View>

      {/* What's Included */}
      <View style={styles.features}>
        <Text style={styles.sectionTitle}>What's Included</Text>
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#4ade80" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#1e293b",
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
    overflow: "hidden",
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  planName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  statusChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    // textAlign: "center",
    fontSize: 10,
  },
  active: { backgroundColor: "#4caf50" },
  inactive: { backgroundColor: "#f57c00" },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  gymName: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  ratingText: { color: "#fff", marginLeft: 4, fontSize: 13 },
  rowBetweenInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,145,77,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextBox: {
    marginLeft: 0,
  },
  infoLabel: {
    color: "#9fb2b6",
    fontSize: 12,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  features: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  featureText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
});

export default PlanCard;
