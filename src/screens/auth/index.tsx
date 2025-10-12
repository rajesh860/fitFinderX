import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import UserLogin from "../../component/auth/user/login";
import UserRegistration from "../../component/auth/user/registration";
import { COLORS } from "../../theme/colors";

const AuthScreen = () => {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start", // flex-start instead of center
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <Text style={{ fontSize: 24, color: "#fff" }}>🏋️</Text>
          </View>
          <Text style={styles.appName}>FitConnect</Text>
          <Text style={styles.subtitle}>Find and book your perfect gym</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === "login" && styles.activeTab]}
            onPress={() => setTab("login")}
          >
            <Text style={[styles.tabText, tab === "login" && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "register" && styles.activeTab]}
            onPress={() => setTab("register")}
          >
            <Text style={[styles.tabText, tab === "register" && styles.activeTabText]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {tab === "login" ? <UserLogin /> : <UserRegistration setTab={setTab} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tab: { flex: 1, padding: 12, alignItems: "center", backgroundColor: COLORS.gray700 },
  logoWrapper: { alignItems: "center", marginBottom: 18, marginTop: 45 },
  logoCircle: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: COLORS.gray700,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: { fontSize: 24, fontWeight: "700", marginTop: 10, color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  tabText: { color: COLORS.textPrimary, fontWeight: "500" },
  activeTab: { backgroundColor: COLORS.primary },
  activeTabText: { color: "#fff", fontWeight: "600" },
});

export default AuthScreen;
