import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Avatar, Button } from "react-native-paper";
import { COLORS } from "../../theme/colors";

const PlanCard = ({ plan,memberId }) => {
    const navigation = useNavigation();
     const planStyle = [
        { name: "basic", bgColor: "rgba(230, 244, 255, 0.8)", borderColor: "#91caff", color: "#0958d9" },
        { name: "silver", bgColor: COLORS.gray700, borderColor: "transparent", color: COLORS.textPrimary },
        { name: "gold", bgColor: "#fffbe6", borderColor: "#ffe58f", color: "#d48806" },
      ];
    return(

  <Card style={styles.card}>
    <Card.Content>
      <View style={styles.planHeader}>
        <Text style={styles.cardTitle}>Your Current Plan</Text>
        <View style={styles.planChip}>
          <Text style={styles.planChipText}>{plan?.daysLeft} Days Left</Text>
        </View>
      </View>

      <Text style={styles.planName}>{plan?.name}</Text>

      <View style={{ marginTop: 10 }}>
        {/* <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${plan.completion}%` }]} />
        </View> */}
        <View style={{ marginTop: 8 }} >
          <Button 
          onPress={() => navigation.navigate("planDetail", { planId:plan?.planId })}
           mode="outlined" uppercase={false} style={styles.outlineBtn} labelStyle={{ color: "#cfeff0" }}>
            View Plan Details
          </Button>
        </View>
      </View>
    </Card.Content>
  </Card>
    )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f1b22",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#12272c",
  },
  cardTitle: { color: "#cfeff0", fontSize: 15, fontWeight: "700", marginBottom: 10 },
  planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planChip: { backgroundColor: "#0f2b33", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  planChipText: { color: "#9fb2b6", fontSize: 12 },
  planName: { color: "#6fe2e0", fontSize: 16, fontWeight: "700", marginTop: 4 },
  trainerRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  trainerName: { color: "#fff", fontWeight: "700" },
  smallMuted: { color: "#9fb2b6", fontSize: 12 },
  progressBarBackground: { flex: 1, height: 10, backgroundColor: "#12272c", borderRadius: 10, overflow: "hidden" },
  progressBarFill: { height: 10, backgroundColor: "#4fb3ff" },
  outlineBtn: { borderColor: "#28454a", borderWidth: 1, borderRadius: 8 },
});

export default PlanCard;
