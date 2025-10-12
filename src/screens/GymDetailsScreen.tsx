// GymDetailsScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  RefreshControl,
  FlatList,
} from "react-native";
import { ActivityIndicator, Button, Card } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import GymDetailsHeader from "../component/appHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGymDetailQuery } from "../services/gym.services";
import { COLORS } from "../theme/colors";
import { useGymJoinMutation, useGymUserAddReviewMutation, useGymUserGetReviewQuery } from "../services/userService";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
const tabs = ["Plan", "Reviews", "Gallery"];

const GymDetailsScreen = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState("Plan");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: gymData, refetch: refetchGym } = useGymDetailQuery(id);
  const { data: gymUserReviews, refetch: refetchReviews } = useGymUserGetReviewQuery(id);
  console.log(gymUserReviews, "gymUserReviews");
  console.log(gymData, "gymData");

  const [joinTrigger, { isLoading }] = useGymJoinMutation();
  const [addReviewTrigger] = useGymUserAddReviewMutation();

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

  const addReview = async () => {
    if (!newReview.trim() || newRating === 0) return;

    try {
      const res = await addReviewTrigger({ gymId: id, rating: newRating, comment: newReview }).unwrap();

      Toast.show({
        type: "success",
        text1: res.message || "Review added successfully",
        position: "top",
        visibilityTime: 3000,
      });

      setNewReview("");
      setNewRating(0);
      setModalVisible(false);

      // Refresh reviews from API
      refetchReviews();

    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed to add review",
        text2: err?.data?.message || "Something went wrong",
        position: "top",
        visibilityTime: 2500,
      });
    }
  };

  const handleJoinNow = async () => {
    try {
      await joinTrigger(id).unwrap();
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
            <Text style={styles.loaderText}>Loading Gym...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  const planStyle = [
    { name: "basic", bgColor: "rgba(230, 244, 255, 0.8)", borderColor: "#91caff", color: "#0958d9" },
    { name: "silver", bgColor: COLORS.gray700, borderColor: "transparent", color: COLORS.textPrimary },
    { name: "gold", bgColor: "#fffbe6", borderColor: "#ffe58f", color: "#d48806" },
  ];

  // Use reviews directly from API
  const reviews = gymUserReviews?.data || [];

  return (
    <>
      <GymDetailsHeader navigation={navigation} title="Gym Detail" like={true} onLogout={false} />
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
          <Text style={styles.desc}>{gymData?.data?.aboutGym}</Text>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesRow}>
          {["barbell-outline", "water-outline", "car-outline"].map((icon, idx) => (
            <View key={idx} style={styles.amenityCard}>
              <Ionicons name={icon as any} size={28} color={COLORS.primary} />
              <Text style={styles.amenityText}>{["Equipment", "Shower", "Parking"][idx]}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
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
          <View style={{ width }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 4 }}>
              <Text style={styles.sectionTitle}>Membership Plans</Text>
              {gymData?.data?.plans?.map((plan: any, idx: number) => {
                const style = planStyle[idx % planStyle.length];
                return (
                  <Card key={idx} style={[styles.planBox, { backgroundColor: style.bgColor, borderColor: style.borderColor, borderWidth: 1 }]} onPress={() => navigation.navigate("planDetail", { plans: plan, memberId: gymData?.data?._id, planStyle: style })}>
                    <Card.Content style={styles.planRow}>
                      <View>
                        <Text style={[styles.planTitle, { color: style.color }]}>{plan.planName}</Text>
                        <Text style={[styles.planDesc, { color: style.color }]}>View More</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={[styles.planPrice, { color: style.color }]}>{plan.price}/month</Text>
                        {plan.tag && <Text style={[styles.popularTag, { backgroundColor: style.color }]}>{plan.tag}</Text>}
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
            </ScrollView>
          </View>

          {/* Reviews */}
          <View style={{ width }}>
            <FlatList
              data={reviews}
              keyExtractor={(item, idx) => idx.toString()}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              ListHeaderComponent={<Text style={styles.sectionTitle}>Members Reviews</Text>}
              renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.reviewUser}>{item?.user?.name?.trim() || "Anonymous"}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                    {renderStars(item.rating)}
                    <Text style={{ fontSize: 13, color: COLORS.gray300, marginLeft: 6 }}>{item.rating}/5</Text>
                  </View>

                  <Text style={styles.reviewText}>{item.comment || "No comment provided."}</Text>
                </View>
              )}

              ListFooterComponent={
                <Button mode="contained" style={[styles.submitBtn, { marginTop: 12 }]} labelStyle={{ color: COLORS.primary }} onPress={() => setModalVisible(true)}>
                  Add Review
                </Button>
              }
            />
          </View>

          {/* Gallery */}
          <View style={{ width }}>
            <ScrollView contentContainerStyle={{ padding: 8 }}>
              <Text style={styles.sectionTitle}>Gym Gallery</Text>
              <View style={styles.galleryContainer}>
                {gymData?.data?.images?.map((img: any, idx: number) => (
                  <View key={idx} style={styles.galleryCard}>
                    <Image source={{ uri: typeof img === "string" ? img : img.url }} style={styles.galleryImg} resizeMode="cover" />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>

        {/* Review Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TextInput value={newReview} onChangeText={setNewReview} placeholder="Write your review..." style={styles.input} multiline />
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                    <Ionicons name={newRating >= star ? "star" : "star-outline"} size={22} color={COLORS.primary} style={{ marginHorizontal: 3.5 }} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <Button mode="contained" style={{ backgroundColor: COLORS.gray600, flex: 1, marginRight: 8 }} labelStyle={{ color: COLORS.textPrimary }} onPress={() => setModalVisible(false)}>Cancel</Button>
                <Button mode="contained" style={{ backgroundColor: COLORS.primary, flex: 1 }} labelStyle={{ color: COLORS.textPrimary }} onPress={addReview}>Submit</Button>
              </View>
            </View>
          </View>
        </Modal>

      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.footer}>
        {gymData?.data?.currentGymId === id ? (
          // ✅ Already Joined
          <Button
            mode="contained"
            style={[styles.button, { width: "100%" }]}
            labelStyle={{ color: COLORS.textPrimary, fontWeight: 'bold' }}
            disabled
          >
            Already Joined
          </Button>
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
  ratingText: { color: COLORS.textSecondary, fontSize: 13 },
  desc: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: COLORS.gray800,
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
  planBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
  },
  planRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planTitle: { fontSize: 18, fontWeight: "600", color: COLORS.textPrimary },
  planDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2, fontWeight: 'bold' },
  planPrice: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },
  popularTag: {
    backgroundColor: COLORS.success,
    color: COLORS.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    fontSize: 12,
  },
  amenitiesRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 6, borderBottomColor: COLORS.gray700, borderBottomWidth: 0.5, paddingBottom: 28, marginBottom: 12 },
  amenityCard: { alignItems: "center", justifyContent: "center", width: 80, height: 80, backgroundColor: COLORS.gray700, borderRadius: 12, elevation: 1 },
  amenityText: { fontSize: 13, fontWeight: "600", color: COLORS.textPrimary, marginTop: 6 },
  reviewCard: {
    backgroundColor: COLORS.gray700,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  reviewUser: { fontWeight: "600", marginBottom: 1, fontSize: 16, color: COLORS.textPrimary },
  reviewText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  reviewDate: { fontSize: 12,
    color: COLORS.gray400, },
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
  submitBtn: { marginTop: 6, backgroundColor: COLORS.border },
  galleryContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  galleryCard: {
    width: "48%",
    height: 120,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    elevation: 2,
  },
  galleryImg: { width: "100%", height: "100%" },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  galleryText: { color: "#fff", fontSize: 14, fontWeight: "600" },

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
