import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme/colors";

const Header = ({ userName, onScanPress }) => (
  <View style={styles.headerRow}>
    <View style={styles.headerContent}>
      <Text style={styles.greeting}>
        Hi, <Text style={styles.greetingName}>{userName}</Text> 👋
      </Text>
      <Text style={styles.subtext}>Ready to crush your goals today?</Text>
    </View>

    <TouchableOpacity onPress={onScanPress} style={styles.scanButton}>
      <Icon name="qrcode-scan" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: COLORS.card,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flex: 1,
  },
  greeting: { color: COLORS.textPrimary, fontSize: 20, fontWeight: "700" },
  greetingName: { color: COLORS.primary },
  subtext: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  scanButton: {
    backgroundColor: COLORS.gray700,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default Header;
