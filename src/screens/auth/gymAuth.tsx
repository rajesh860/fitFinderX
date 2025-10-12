import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import GymRegistration from "../../component/auth/gym/registration";
import { COLORS } from "../../theme/colors";

const GymAuthScreen = () => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <View style={styles.logoCircle}>
          <Text style={{ fontSize: 24, color: "#fff" }}>🏋️</Text>
        </View>
        <Text style={styles.appName}>FitConnect</Text>
        <Text style={styles.subtitle}>Find and book your perfect gym</Text>
      </View>

      {/* Show only Registration form */}
      <GymRegistration />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background, padding: 20, justifyContent: "center" },
  logoWrapper: { alignItems: "center", marginBottom: 20 },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#11121a",
    justifyContent: "center",
    alignItems: "center",
  },
  appName: { fontSize: 20, fontWeight: "700", marginTop: 10, color: COLORS.gray100 },
  subtitle: { fontSize: 14, color: COLORS.gray300, marginTop: 4 },
});

export default GymAuthScreen;
