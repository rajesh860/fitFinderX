import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Header = ({ userName, onScanPress }) => (
  <View style={styles.headerRow}>
    <View>
      <Text style={styles.greeting}>
        Hi, <Text style={styles.greetingName}>{userName}</Text> 👋
      </Text>
      <Text style={styles.subtext}>Ready to crush your goals today?</Text>
    </View>

    <View style={styles.headerIcons}>
      <TouchableOpacity onPress={onScanPress} style={styles.scanButton}>
        <Icon name="qrcode-scan" size={20} color="#cfeff0" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#15262a",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  greeting: { color: "#fff", fontSize: 16, fontWeight: "700" },
  greetingName: { color: "#fff" },
  subtext: { color: "#9fb2b6", fontSize: 12, marginTop: 6 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  scanButton: {
    backgroundColor: "#15262a",
    padding: 10,
    borderRadius: 10,
  },
});

export default Header;
