import React from "react";
import { Card, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CurrentGymCard = ({ gym }) => {
  if (!gym) return null;


  return (
    <Card style={styles.card}>
      <Card.Content style={{ backgroundColor: "transparent" }}>
        {/* Header Row with Title (left) and Rating (right) */}
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            <Icon name="dumbbell" size={20} color="#4dd0e1" />
            <Text style={styles.title}>Current Gym</Text>
          </View>

          {/* ⭐ Rating on Right */}
          {gym.avgRating !== undefined && (
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color="#FFD166" />
              <Text style={styles.ratingText}>
                {gym.avgRating.toFixed(1)}{" "}
                <Text style={styles.reviewCount}>
                  ({gym.totalReviews || 0})
                </Text>
              </Text>
            </View>
          )}
        </View>

        {/* Gym Name */}
        <Text style={styles.gymName}>{gym.name || "No Gym Assigned"}</Text>

        {/* Gym Info */}
        <View style={styles.infoRow}>
          {/* Plan Name */}
          <View style={styles.infoItem}>
            <Icon name="clipboard-text" size={16} color="#9fb2b6" />
            <Text style={styles.infoText}>{gym.planName || "N/A"}</Text>
          </View>

          {/* Days Left */}
          <View style={styles.infoItem}>
            <Icon name="calendar-clock" size={16} color="#9fb2b6" />
            <Text style={styles.infoText}>{gym.daysLeft ?? 0} Days Left</Text>
          </View>

          {/* Status */}
          <View style={styles.infoItem}>
            <Icon
              name="check-decagram"
              size={16}
              color={gym.status === "active" ? "#4caf50" : "#f57c00"}
            />
            <Text
              style={[
                styles.infoText,
                { color: gym.status === "active" ? "#4caf50" : "#f57c00" },
              ]}
            >
              {gym.status?.toUpperCase() || "N/A"}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default CurrentGymCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(15, 27, 34, 0.9)",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#12343b",
    shadowColor: "#00bcd4",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // push rating to top-right
    marginBottom: 8,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    color: "#cfeff0",
    fontSize: 15,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    color: "#FFD166",
    fontSize: 13,
    fontWeight: "600",
  },
  reviewCount: {
    color: "#9fb2b6",
    fontSize: 11,
    fontWeight: "400",
  },
  gymName: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#9fb2b6",
    fontSize: 13,
  },
});
