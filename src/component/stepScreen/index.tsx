import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import PagerView from "react-native-pager-view";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme/colors";
import Step1 from "../../assets/stepImages/step1.png"
import Step2 from "../../assets/stepImages/step2.png"
import appLogo from "../../assets/logo/app-logo.png"
const { width } = Dimensions.get("window");

const StepScreens = () => {
  const navigation = useNavigation();
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const handleNext = () => {
    if (pagerRef.current && page < 3) {
      pagerRef.current.setPage(page + 1);
    }
  };


  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {/* STEP 1 */}
        <View key="1" style={styles.page}>
          <View style={styles.logoWrapper}>
            <Image source={appLogo} style={styles.logoImg} />
            {/* <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🏋️</Text>
           
            </View> */}
          </View>
          {/* <Text style={styles.title}>FitFinder</Text> */}
          <Text style={styles.subtitle}>Discover your perfect gym</Text>

          {/* URL Input */}

        </View>

        {/* STEP 2 */}
        <View key="2" style={styles.page}>
          <View style={styles.illustrationBox}>
            <Text style={{ color: "#fff" }}>
              <Image source={Step1} style={styles.illustrationImage} />
            </Text>
          </View>
          <Text style={styles.title}>Find Gyms Near You</Text>
          <Text style={styles.subtitle}>
            Discover the best gyms in your area {"\n"} with real-time
            availability and pricing
          </Text>

          <View style={styles.actionRow}>
            <Button mode="text" onPress={() => {
              if (pagerRef.current) {
                pagerRef.current.setPage(3);
              }
            }} labelStyle={{ color: COLORS.primary }}>Skip</Button>
            <Button mode="contained" onPress={handleNext} style={styles.primaryBtn} labelStyle={{ color: "#fff" }} >
              Next
            </Button>
          </View>
        </View>

        {/* STEP 3 */}
        <View key="3" style={styles.page}>
          <View style={styles.illustrationBox}>
            <Text style={{ color: "#fff" }}>
              <Image source={Step2} />
            </Text>
          </View>
          <Text style={styles.title}>Book Free Trials</Text>
          <Text style={styles.subtitle}>
            Try before you buy with free trial{"\n"}sessions at your favorite gyms
          </Text>

          <View style={styles.actionRow}>
            <Button mode="text" onPress={() => {
              if (pagerRef.current) {
                pagerRef.current.setPage(3);
              }
            }} labelStyle={{ color: COLORS.primary }}>Skip</Button>
            <Button mode="contained" onPress={handleNext} style={styles.primaryBtn} labelStyle={{ color: COLORS.textPrimary }} >
              Next
            </Button>
          </View>
        </View>

        {/* STEP 4 - Account Type Selection */}
        <View key="4" style={styles.page}>
          <Text style={styles.title}>How will you use FitFinder?</Text>
          <Text style={styles.subtitle}>Choose your account type to continue</Text>

          {/* User Card */}
          <View style={styles.card}>
            <View style={styles.cardCircle}>
              <Icon name="account" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.cardTitle}>I'm a User</Text>
            <Text style={styles.cardSubtitle}>Find and book gym memberships</Text>
            <Button
              mode="contained"
              style={styles.cardBtn}
              labelStyle={{ color: COLORS.textPrimary }}
              onPress={() => navigation.navigate("AuthScreen")}
            >
              Login
            </Button>
          </View>

          {/* Gym Owner Card */}
          {/* <View style={styles.card}>
            <View style={styles.cardCircle}>
              <Icon name="city-variant-outline" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.cardTitle}>I'm a Gym Owner</Text>
            <Text style={styles.cardSubtitle}>Manage my gym and memberships</Text>
            <Button
              mode="contained"
              style={styles.cardBtn}
              labelStyle={{ color: COLORS.textPrimary }}
              onPress={() => navigation.navigate("GymAuthScreen")}
            >
              Continue as Gym Owner
            </Button>
          </View> */}
        </View>
      </PagerView>

      {/* ✅ Single Dots Indicator */}
      <View style={styles.dotsWrapper}>
        <View style={[styles.dot, page === 0 && styles.activeDot]} />
        <View style={[styles.dot, page === 1 && styles.activeDot]} />
        <View style={[styles.dot, page === 2 && styles.activeDot]} />
        <View style={[styles.dot, page === 3 && styles.activeDot]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  container: { flex: 1, backgroundColor: COLORS.background },
  pager: { flex: 1 },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // Logo
  logoWrapper: { marginBottom: 4 },
  logoImg: {
    width: 135,
    height: 120
  },

  // Texts
  title: { fontSize: 24, fontWeight: "700", marginTop: 10, color: COLORS.textPrimary, textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
    textAlign: "center",
  },

  // Buttons
  primaryBtn2: {
    marginTop: 30,
    backgroundColor: "#11121a",
    paddingHorizontal: 20,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    alignItems: "center",
  },

  // Illustration
  illustrationBox: {
    width: 250,
    height: 200,
    backgroundColor: "#8d92a3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden"
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  actionRow: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },

  // ✅ Single Dots
  dotsWrapper: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    columnGap: width * 0.02,
  },
  dot: {
    width: 22,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.textSecondary,
  },
  activeDot: { backgroundColor: COLORS.primaryLight },

  // ✅ Account Selection Cards
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.gray800,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: COLORS.gray800,
  },
  cardCircle: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: COLORS.gray700,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: COLORS.textPrimary, marginBottom: 5 },
  cardSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 15, textAlign: "center" },
  cardBtn: { width: "100%", backgroundColor: COLORS.primary },
});

export default StepScreens;
