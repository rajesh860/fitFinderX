// ProfileScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  Platform,
  Animated,
  Easing,
  Modal
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import GymDetailsHeader from "../component/appHeader";
import PersonalInfoCard from "../component/profile/personalInfoCard";
import HealthInfoCard from "../component/profile/HealthInfoCard";
import { useGetUserDetailQuery, useUpdateProfileMutation } from "../services/userService";
import moment from "moment";
import * as ImagePicker from "react-native-image-picker";
import InjuryCard from "../component/profile/EnjuiryCard";
import FitnessGoalsCard from "../component/profile/FitnessGoalsCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApiFeedback } from "../component/common/useApiFeedback";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../theme/colors";
import { useSelector } from "react-redux";

// Navigation prop type
export type ProfileScreenProp = NativeStackNavigationProp<RootStackParamList, 'ProfileScreen'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();

  const [userData, setUserData] = useState<any>(null);
  const [healthConditions, setHealthConditions] = useState<any[]>([]);
  const [injuries, setInjuries] = useState<any[]>([]);
  const [fitnessGoals, setFitnessGoals] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
 const userRole = useSelector((state:any) => state.auth.userRole);
  const [updateProfile, { data: updateData, isLoading: updating, error: updateError }] = useUpdateProfileMutation();
  const { data: apiData, isLoading, error, refetch } = useGetUserDetailQuery(undefined,{
  skip: !userRole,
  refetchOnMountOrArgChange: true, // optional if you want auto-refetch on user change
});
  const { isLoading: isUpdating } = useApiFeedback(updating, updateData, updateError);

  const { weight, height, bloodGroup } = apiData?.progress || {};

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotateAnim.stopAnimation();
    rotateAnim.setValue(0);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

// ✅ Load cached data only if API not yet fetched
useEffect(() => {
  const loadCachedData = async () => {
    const cached = await AsyncStorage.getItem("userData");
    if (cached && !apiData) {
      const parsed = JSON.parse(cached);
      setUserData(parsed);
      setHealthConditions(parsed?.medical_conditions || []);
      setInjuries(parsed?.injuries || []);
      setFitnessGoals(parsed?.fitness_goals || []);
    }
  };
  loadCachedData();
}, [apiData]);
  // Update state when API data changes
  useEffect(() => {
    if (apiData) {
      setUserData(apiData);
      setHealthConditions(apiData?.medical_conditions || []);
      setInjuries(apiData?.injuries || []);
      setFitnessGoals(apiData?.fitness_goals || []);

      // Cache for persistence
      AsyncStorage.setItem("userData", JSON.stringify(apiData)).catch(err => console.log(err));
    }
  }, [apiData]);

  // Toast feedback for profile updates
  useEffect(() => {
    if (updateData?.success) {
      Toast.show({ type: "success", text1: updateData?.message, position: "top" });
    } else if (updateData && !updateData?.success) {
      Toast.show({ type: "error", text1: updateData?.message, position: "top" });
    }
  }, [updateData]);

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    startRotation();
    try {
      await refetch();
      Toast.show({ type: "success", text1: "Profile refreshed", position: "top" });
    } catch {
      Toast.show({ type: "error", text1: "Failed to refresh", position: "top" });
    } finally {
      stopRotation();
      setRefreshing(false);
    }
  };

  const handleUploadImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.8, includeBase64: false },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("Error", response.errorMessage || "Something went wrong");
          console.log(response.errorMessage, "ist");
        } else if (response.assets && response.assets.length > 0) {
          try {
            const asset = response.assets[0];
            const uri = asset.uri;

            if (!uri) return;

            // Resize image before upload
            const resizedImage = await ImageResizer.createResizedImage(
              uri,
              800, // target width
              800, // target height
              "JPEG", // format
              80, // quality (0-100)
              0, // rotation
              undefined, // outputPath
              false, // keepExif
              { mode: "contain", onlyScaleDown: true }
            );

            const name =
              asset.fileName ||
              `photo.${asset.type?.split("/")[1] || "jpg"}`;
            const type = asset.type || "image/jpeg";

            const formData: any = new FormData();
            formData.append("photo", {
              uri: Platform.OS === "ios"
                ? resizedImage.uri.replace("file://", "")
                : resizedImage.uri,
              name,
              type,
            } as any);

            await updateProfile({
              body: formData,
              userId: userData?._id,
            }as any).unwrap();

            await refetch();
          } catch (err: any) {
            console.log(err, "2nd");
            Alert.alert("Error", err?.data?.message || "Failed to update photo");
          }
        }
      }
    );
  };


  if (!userData) {
    return (
      <Modal transparent animationType="fade" visible={!userData}>
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Loading Profile...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <GymDetailsHeader navigation={navigation} title="Profile" like={false} onLogout={true} />
      {isUpdating && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10, fontSize: 14, color: COLORS.textPrimary }}>Updating...</Text>
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />}
      >
        {/* Top Section */}
        <View style={styles.header}>
          <View>
            {userData?.photo ? (
              <Image source={{ uri: userData.photo }} style={styles.avatar} key={userData.photo} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {userData?.first_name?.[0]?.toUpperCase() ?? "U"}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.addIconWrapper} onPress={handleUploadImage}>
              <Icon name="plus-circle" size={25} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.name}>{userData?.name || "-"}</Text>
            <View style={styles.badgeRow}>
              <Text style={styles.activeBadge}>{userData?.gymStatus || "-"}</Text>
              <Text style={styles.planBadge}>{userData?.planName || "-"}</Text>
            </View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", marginTop: 10, }}
              onPress={() => navigation.navigate("GymDetailsScreen", { gymId: userData?._id })}
            >
              <Text style={styles.subtitle}>{userData?.gymName || "N/A"}</Text>
              <Icon name="arrow-top-right" size={18} color={COLORS.primary} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.progressBtn} onPress={() => navigation.navigate("ProgressHistoryScreen")}>
            <Icon name="chart-line" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{weight ?? "-"}</Text>
            <Text style={styles.statsLabel}>Weight (kg)</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{height ?? "-"}</Text>
            <Text style={styles.statsLabel}>Height (cm)</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{bloodGroup || "-"}</Text>
            <Text style={styles.statsLabel}>Blood Group</Text>
          </View>
        </View>

        {/* Cards */}
        <PersonalInfoCard user={userData} updateProfile={updateProfile} />
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Icon name="credit-card-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Membership & Payments</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Icon name="refresh" size={18} color={COLORS.success} />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            {/* Plan Type */}
            <View style={styles.rowBetween}>
              <Text style={styles.infoText}>Plan Type</Text>
              <Text style={styles.planBadge}>
                {apiData?.currentGym?.plan?.name || userData?.planName || "No Plan"}
              </Text>
            </View>

            {/* Duration */}
            <View style={styles.rowBetween}>
              <Text style={[styles.infoText, { fontWeight: "600", color: COLORS.textSecondary, flex: 1 }]}>
                Duration
              </Text>
              <Text style={[styles.boldText, { color: COLORS.textPrimary, fontSize: 13, flex: 2, textAlign: "right" }]}>
                {apiData?.currentGym?.membership_start && apiData?.currentGym?.membership_end
                  ? `${moment(apiData.currentGym.membership_start).format("DD-MM-YYYY")} → ${moment(
                    apiData.currentGym.membership_end
                  ).format("DD-MM-YYYY")}`
                  : "-"}
              </Text>
            </View>

            {/* Status */}
            <View style={styles.rowBetween}>
              <Text style={styles.infoText}>Status</Text>
              <Text
                style={[
                  styles.statusBadge,
                  apiData?.currentGym?.status === "active" ? styles.activeBadge : styles.inactiveBadge,
                ]}
              >
                {apiData?.currentGym?.status || "-"}
              </Text>
            </View>

            {/* Fee Status */}
            <View style={styles.rowBetween}>
              <Text style={styles.infoText}>Fee Status</Text>
              <Text style={styles.paidBadge}>
                {userData?.fee_status?.toUpperCase() || "-"}
              </Text>
            </View>
          </View>

        </View>

        <HealthInfoCard healthData={healthConditions} setHealthData={setHealthConditions} userData={userData} />
        <InjuryCard injuryData={injuries} setInjuryData={setInjuries} updateProfile={updateProfile} userData={userData} />
        <FitnessGoalsCard goalsData={fitnessGoals} setGoalsData={setFitnessGoals} updateProfile={updateProfile} userData={userData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 10, position: "relative" },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { color: "#fff", fontSize: 24, fontWeight: "700" },
  addIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: -2,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 15,
  },
  headerText: { marginLeft: 12 },
  name: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
  badgeRow: { flexDirection: "row", marginTop: 4 },
  activeBadge: {
    backgroundColor: "#d1f7d6",
    color: "#1B873F",
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    textTransform: "capitalize",
    marginRight: 6,
  },
  planBadge: {
    backgroundColor: "#e0e7ff",
    color: "#4338CA",
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  subtitle: { fontSize: 14, color: COLORS.textPrimary, marginTop: 2 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 15 },
  statsCard: { alignItems: "center" },
  statsValue: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  statsLabel: { fontSize: 12, color: COLORS.gray400, marginTop: 4 },
  card: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginLeft: 6, color: COLORS.textPrimary, flex: 1 },
  editIcon: { marginLeft: "auto" },
  cardContent: { marginTop: 4 },
  infoText: { fontSize: 13, color: COLORS.textSecondary },
  boldText: { fontSize: 13, fontWeight: "600", color: COLORS.textPrimary },
  paidBadge: {
    backgroundColor: "#d1f7d6",
    color: "#1B873F",
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  progressBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    position: "absolute",
    top: 0,
    right: 0,
    height: 50,
    width: 50,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    width: "auto",
    height: "auto",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loaderText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
});
