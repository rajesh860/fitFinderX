import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme/colors";
import { Card } from "react-native-paper";

const CurrentGymCard = ({ gym, expired, onRenew }) => {
  if (!gym) return null;

  const endDate = gym?.membership_end
    ? new Date(gym.membership_end).toLocaleDateString()
    : null;

  return (
    <Card
      style={[
        styles.card
      ]}
    >
      <View style={styles.header}>
        <Icon name="dumbbell" size={22} color={COLORS.primary} />
        <Text style={styles.title}>{gym?.name || "Your Gym"}</Text>
      </View>

      <Text style={styles.subText}>
        {gym?.planName || (expired ? "No Active Plan" : "Active Membership")}
      </Text>

      {expired ? (
        <>
          {/* <Text style={[styles.status, { color: COLORS.danger }]}>
            ❌ Expired {endDate ? `on ${endDate}` : ""}
          </Text>
          <TouchableOpacity style={styles.renewBtn} onPress={onRenew}>
            <Text style={styles.renewText}>Renew Now</Text>
          </TouchableOpacity> */}
        </>
      ) : (
        <Text style={[styles.status, { color: COLORS.success }]}>
          ✅ Active — {gym?.daysLeft || 0} days left
        </Text>
      )}

      {gym?.avgRating && (
        <Text style={styles.rating}>
          ⭐ {gym.avgRating} ({gym.totalReviews} reviews)
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
   backgroundColor: "#0f1b22",
   borderWidth: 1,
   borderColor: "#12272c",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom:10,
    
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  title: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  subText: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 8 },
  status: { fontSize: 14, fontWeight: "500" },
  renewBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  renewText: { color: COLORS.textPrimary, fontWeight: "600", fontSize: 15 },
  rating: { color: "#ccc", fontSize: 13, marginTop: 8 },
});

export default CurrentGymCard;
