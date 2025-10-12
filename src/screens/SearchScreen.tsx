import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function TrainerSearchScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2020/05/10/06/26/coming-soon-5152487_1280.png",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Upcoming Trainers</Text>
      <Text style={styles.subtitle}>
        We are working on bringing you amazing trainers soon. Stay tuned!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
