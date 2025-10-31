import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Card } from "react-native-paper";

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
                {/* <Ring size={60} strokeWidth={8} progress={percent / 100} color="#34F3CE" bg="#122027" /> */}
                <Text style={styles.bodyPartPercent}>{percent}%</Text>
                <Text style={styles.bodyPartLabel}>{part.charAt(0).toUpperCase() + part.slice(1)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.weightsRow}>
          <Text style={styles.smallMuted}>
            Current Weight: <Text style={styles.weightBold}>{progress.currentWeight}kg</Text>
          </Text>
          {/* <Text style={styles.smallMuted}>
            Target Weight: <Text style={styles.weightBold}>{progress.targetWeight || "—"}kg</Text>
          </Text> */}
        </View>
      </Card.Content>
    </Card>
  );
};

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
  bodyPartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    flexWrap: "wrap",
  },
  bodyPartCard: {
    width: (width - 60) / 4,
    alignItems: "center",
    marginBottom: 12,
  },
  bodyPartPercent: {
    color: "#34F3CE",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 6,
  },
  bodyPartLabel: {
    color: "#cfeff0",
    fontSize: 13,
    textAlign: "center",
  },
  weightsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  smallMuted: { color: "#9fb2b6", fontSize: 13 },
  weightBold: { fontWeight: "700", color: "#6fe2e0" },
});

export default ProgressCard;
