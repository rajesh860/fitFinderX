// GymDetailsScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  RefreshControl,
  Animated,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import GymDetailsHeader from "../component/appHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGymDetailQuery } from "../services/gym.services";
import { COLORS } from "../theme/colors";
import { useGymJoinMutation, useGymUserGetReviewQuery } from "../services/userService";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlanTab from "../component/gymDetailScreen/PlanTab";
import ReviewTab from "../component/gymDetailScreen/ReviewTab";
import GalleryTab from "../component/gymDetailScreen/GalleryTab";
import TrainerTab from "../component/gymDetailScreen/TrainerTab";

const { width } = Dimensions.get("window");
const tabs = ["Plan", "Reviews", "Gallery", "Trainers"];

const GymDetailsScreen = () => {

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    })();
  }, []);
  const route = useRoute();
  const { id } = route.params as { id: string };
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Plan");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStickyTabs, setShowStickyTabs] = useState(false);

  const { data: gymData, refetch: refetchGym } = useGymDetailQuery(id);
  const { data: gymUserReviews, refetch: refetchReviews } = useGymUserGetReviewQuery(id);


  const [joinTrigger, { isLoading }] = useGymJoinMutation();


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchGym();
      await refetchReviews();
    } catch (err) {
      console.log("Refresh error:", err);
    }
    setRefreshing(false);
  };



  const handleJoinNow = async () => {
    try {
      await joinTrigger(id).unwrap();
      refetchGym()
      Toast.show({ type: "success", text1: "Successfully Joined!", position: "top", visibilityTime: 2000 });
    } catch (err: any) {
      let msg = "An unexpected error occurred.";
      if (err?.status === 401) msg = "Please log in to join a gym.";
      else if (err?.status === 409) msg = "You have already joined this gym.";
      else if (err?.status >= 500) msg = "Server error. Try again later.";
      else if (err?.status === 'FETCH_ERROR' || !err?.status) msg = "Check your internet connection.";
      Toast.show({ type: "error", text1: "Failed to Join", text2: msg, position: "top", visibilityTime: 3000 });
    }
  };

  const renderStars = (rating: number) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={rating >= i ? "star" : "star-outline"} size={16} color="#f39c12" />
      ))}
    </View>
  );

  if (loading) {
    return (
      <Modal transparent animationType="fade" visible={loading}>
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Loading...</Text>
          </View>
        </View>
      </Modal>
    );
  }



  // Use reviews directly from API
  const reviews = gymUserReviews?.data || [];
  return (
    <>
      <GymDetailsHeader navigation={navigation} title="Gym Detail" like={false} onLogout={false} />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Animated.ScrollView
          ref={mainScrollRef}
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
              listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                // Show sticky tabs after scrolling past banner + header (approximately 300px)
                setShowStickyTabs(offsetY > 362);
              },
            }
          )}
          scrollEventThrottle={16}
        >
          {/* Banner */}
          <View style={styles.banner}>
            <Image source={{ uri: gymData?.data?.coverImage }} style={{ width: "100%", height: "100%" }} />
          </View>

          {/* Gym Info */}
          <View style={styles.headerCard}>
            <Text style={styles.gymName}>{gymData?.data?.gymName}</Text>
            <View style={styles.row}>
              <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.location}>{gymData?.data?.address}</Text>
            </View>
            <View style={styles.row}>
              {renderStars(gymData?.data?.avgRating || 0)}
              <Text style={styles.ratingText}> ({reviews.length} reviews)</Text>
            </View>
            {/* About Gym with See More / See Less */}
            <View style={{ marginTop: 4 }}>
              <Text
                style={styles.desc}
                numberOfLines={expanded ? undefined : 4}
              >
                {gymData?.data?.aboutGym || "No description available."}
              </Text>

              {gymData?.data?.aboutGym?.length > 150 && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                  <Text style={styles.seeMore}>
                    {expanded ? "See Less" : "See More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Amenities */}
          {/* <View style={styles.amenitiesRow}>
            {["barbell-outline", "water-outline", "car-outline"].map((icon, idx) => (
              <View key={idx} style={styles.amenityCard}>
                <Ionicons name={icon as any} size={28} color={COLORS.primary} />
                <Text style={styles.amenityText}>{["Equipment", "Shower", "Parking"][idx]}</Text>
              </View>
            ))}
          </View> */}

          {/* Tabs - Regular position */}
          <View style={styles.tabWrapper}>
            {tabs.map((tab, idx) => (
              <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => { setActiveTab(tab); scrollRef.current?.scrollTo({ x: idx * width, animated: true }); }}>
                <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>{tab}</Text>
                {activeTab === tab && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Horizontal Sections */}
          <ScrollView horizontal pagingEnabled ref={scrollRef} onMomentumScrollEnd={e => setActiveTab(tabs[Math.round(e.nativeEvent.contentOffset.x / width)])} showsHorizontalScrollIndicator={false}>
            {/* Plan */}
            <PlanTab width={width} gymData={gymData} />

            {/* Reviews */}

            <ReviewTab width={width} reviews={reviews} refetchReviews={refetchReviews} />
            {/* Gallery */}
            <GalleryTab width={width} gymData={gymData} />
            {/* Trainers */}
            <TrainerTab width={width} />
          </ScrollView>



        </Animated.ScrollView>

        {/* Sticky Tabs - Only visible when scrolled */}
        {showStickyTabs && (
          <View style={styles.stickyTabWrapper}>
            {tabs.map((tab, idx) => (
              <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => { setActiveTab(tab); scrollRef.current?.scrollTo({ x: idx * width, animated: true }); }}>
                <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>{tab}</Text>
                {activeTab === tab && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Fixed Bottom Buttons */}
      {userRole !== "demo" && (
        <View style={styles.footer}>
          {gymData?.data?.currentGymId === id ? (
            <></>
            // ✅ Already Joined
            // <Button
            //   mode="contained"
            //   style={[styles.button, { width: "100%" }]}
            //   labelStyle={{ color: COLORS.textPrimary, fontWeight: 'bold' }}
            //   disabled
            // >
            //   Already Joined
            // </Button>
          ) : gymData?.data?.gymApply?.applied ? (
            // ✅ Applied but Pending
            <Button
              mode="contained"
              style={[styles.button, { width: "100%" }]}
              labelStyle={{ color: COLORS.textPrimary, fontWeight: 'bold' }}
              disabled
            >
              Pending Approval
            </Button>
          ) : (
            // ✅ Default: Show Join Now + Book Trial
            <>
              <Button
                mode="contained"
                style={styles.button}
                labelStyle={{ color: COLORS.textPrimary, fontWeight: 'bold' }}
                loading={isLoading}
                disabled={isLoading}
                onPress={() => setConfirmVisible(true)}
              >
                Join Now
              </Button>

              <Button
                mode="outlined"
                style={styles.buttonTrial}
                labelStyle={{ color: COLORS.textPrimary }}
                onPress={() => navigation.navigate('booktrail', { gym: gymData?.data })}
              >
                Book Trial
              </Button>
            </>
          )}
        </View>
      )}



      {/* Join Confirmation Modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={{ fontSize: 14, color: COLORS.gray300, marginVertical: 12 }}>Are you sure you want to join this gym?</Text>
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Button mode="outlined" style={{ flex: 1, marginRight: 6, borderColor: COLORS.goldDark }} labelStyle={{ color: COLORS.gray200 }} onPress={() => setConfirmVisible(false)}>Cancel</Button>
              <Button mode="contained" style={{ flex: 1, marginLeft: 6, backgroundColor: COLORS.goldDark }} labelStyle={{ color: "#fff" }} onPress={() => { handleJoinNow(); setConfirmVisible(false); }}>Confirm</Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  banner: { height: 140, width: "100%" },
  headerCard: { padding: 16, },
  gymName: { fontSize: 22, fontWeight: "700", color: COLORS.textPrimary },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  location: { color: COLORS.textSecondary, fontSize: 14, marginLeft: 4 },
  seeMore: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  ratingText: { color: COLORS.textSecondary, fontSize: 13 },
  desc: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: COLORS.gray800,
  },
  stickyTabWrapper: {
    position: "absolute",
    top: 0, // Below the header (header height is 50)
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: { flex: 1, alignItems: "center", paddingVertical: 10 },
  tabLabel: { fontSize: 14, fontWeight: "500", color: COLORS.textPrimary },
  activeTabLabel: { color: COLORS.primary, fontWeight: "600" },
  activeUnderline: {
    bottom: 0,
    position: "absolute",
    height: 2,
    width: "100%",
    backgroundColor: COLORS.primary,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 14, color: COLORS.textPrimary },


  // amenitiesRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 6, borderBottomColor: COLORS.gray700, borderBottomWidth: 0.5, paddingBottom: 28, marginBottom: 12 },
  // amenityCard: { alignItems: "center", justifyContent: "center", width: 70, height: 60, backgroundColor: COLORS.gray700, borderRadius: 12, elevation: 1 },
  // amenityText: { fontSize: 12, fontWeight: "600", color: COLORS.textPrimary, marginTop: 6 },

  starsRow: { flexDirection: "row", marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray600,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
    color: COLORS.gray300,
    backgroundColor: COLORS.gray700,
    textAlignVertical: "top",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: COLORS.gray800,
    borderRadius: 12,
    padding: 16,
    width: "95%",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: COLORS.textPrimary },
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",             // side by side
    justifyContent: "space-between",  // space between buttons
    alignItems: "center",             // vertically center
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
    backgroundColor: COLORS.gray800,  // background for footer
    gap: 10,                          // spacing between buttons (if RN 0.71+)
  },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 6,
    width: "50%",
  },

  buttonTrial: {
    backgroundColor: COLORS.gray800,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 6,
    width: "50%",
  },

});

export default GymDetailsScreen;
