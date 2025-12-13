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
   backgroundColor: COLORS.card,
   borderWidth: 1,
   borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 10,
  },
  subText: { 
    color: COLORS.textSecondary, 
    fontSize: 14, 
    marginBottom: 12,
    marginTop: 4,
  },
  status: { 
    fontSize: 14, 
    fontWeight: "600",
    marginTop: 4,
  },
  renewBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  renewText: { 
    color: COLORS.textPrimary, 
    fontWeight: "600", 
    fontSize: 15,
  },
  rating: { 
    color: COLORS.textSecondary, 
    fontSize: 13, 
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default CurrentGymCard;
