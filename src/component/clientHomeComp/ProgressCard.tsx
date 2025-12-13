import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import { COLORS } from "../../theme/colors";
import Ring from "./Ring";

const { width } = Dimensions.get("window");

const ProgressCard = ({ progress }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>Your Body Progress</Text>

        <View style={styles.bodyPartsRow}>
          {["chest", "weight", "biceps", "thigh"].map((part) => {
            const percent = progress[part] ?? 0;
            return (
              <View key={part} style={styles.bodyPartCard}>
                <Ring size={60} strokeWidth={8} progress={percent / 100} color={COLORS.primary} bg={COLORS.gray700} />
                <Text style={styles.bodyPartPercent}>{percent}%</Text>
                <Text style={styles.bodyPartLabel}>{part.charAt(0).toUpperCase() + part.slice(1)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.weightsRow}>
          <View style={styles.weightContainer}>
            <Text style={styles.weightLabel}>Current Weight</Text>
            <Text style={styles.weightBold}>{progress.currentWeight || "—"}kg</Text>
          </View>
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "700", marginBottom: 16 },
  bodyPartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    flexWrap: "wrap",
  },
  bodyPartCard: {
    width: (width - 80) / 4,
    alignItems: "center",
    marginBottom: 12,
  },
  bodyPartPercent: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 16,
    marginTop: 8,
  },
  bodyPartLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    textTransform: "capitalize",
  },
  weightsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  weightContainer: {
    alignItems: "center",
    backgroundColor: COLORS.gray700,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weightLabel: { 
    color: COLORS.textSecondary, 
    fontSize: 12,
    marginBottom: 4,
  },
  weightBold: { 
    fontWeight: "700", 
    color: COLORS.primary,
    fontSize: 18,
  },
});

export default ProgressCard;
