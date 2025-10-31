import * as React from "react";
import { View, ScrollView, Share, Linking, TouchableOpacity } from "react-native";
import { Appbar, Button, Surface, Modal, Portal, TextInput, Text } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HeaderSection from "../template/trainerDetails/HeaderSection";
import AboutSection from "../template/trainerDetails/AboutSection";
import ExpertiseSection from "../template/trainerDetails/ExpertiseSection";
import ReviewsSection from "../template/trainerDetails/ReviewsSection";
import GallerySection from "../template/trainerDetails/GallerySection";
import GymDetailsHeader from "../component/appHeader";
import { COLORS } from "../theme/colors";
import { useAddTrainerMutation, useGetTrainerReviewQuery, useTrainerDetailQuery } from "../services/trainer";

export default function TrainerDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { trainerId } = route.params as { trainerId: string };

  const [trigger, { data: addReviewResponse, isLoading }] = useAddTrainerMutation();
  const { data: reviewData ,isLoading:reviewLoading} = useGetTrainerReviewQuery(trainerId);
  const { data } = useTrainerDetailQuery(trainerId);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  const trainer = {
    name: "Marcus Rodriguez",
    title: "Certified Personal Trainer",
    rating: 4.9,
    reviews: 127,
    about:
      "Passionate fitness coach with 8+ years of experience helping clients achieve their fitness goals. Specialized in strength training, weight loss, and functional fitness.",
    badges: ["NASM Certified", "Nutrition Specialist", "CrossFit Level 2"],
    expertise: [
      "Weight Loss",
      "Strength Training",
      "HIIT",
      "Functional Fitness",
      "Sports Conditioning",
    ],
    yearsExperience: 8,
    clientsTrained: 200,
    availabilityNext: "Tomorrow, 6:00 AM",
    success: {
      sessions: "1,250+",
      successRate: "95%",
      transformations: "50+",
    },
  };



  const gallery = [
    "https://placehold.co/300x200?text=Gym+1",
    "https://placehold.co/300x200?text=Gym+2",
    "https://placehold.co/300x200?text=Gym+3",
    "https://placehold.co/300x200?text=Gym+4",
  ];

  const handleBook = () => navigation.navigate("trainerBooking", { trainerId:trainerId });

  const handleCall = (phone: any) => Linking.openURL(`tel:${phone}`);

  const handleAddReview = async () => {
    if (!rating || !comment.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please provide both rating and review text.",
      });
      return;
    }

    try {
      const body = { rating, comment };
      const res = await trigger({ body, trainerId }).unwrap();

      Toast.show({
        type: "success",
        text1: "Success 🎉",
        text2: res?.message || "Review added successfully!",
      });

      setModalVisible(false);
      setComment("");
      setRating(0);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.data?.message || "Failed to add review.",
      });
    }
  };

  // ⭐ Custom Rating UI
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <MaterialCommunityIcons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#FFD700" : "#9AA6B2"}
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: "row", marginVertical: 10 }}>{stars}</View>;
  };
console.log("Trainer Details Data:",data?.data);
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <GymDetailsHeader title="Trainer Detail" navigation={navigation} />

      <ScrollView contentContainerStyle={{ padding: 7 }}>
        <HeaderSection
          user={data?.data}
          trainer={trainer}
          handleCall={handleCall}
          handleBook={handleBook}
        />
        <AboutSection user={data?.data} />
        <ExpertiseSection trainer={trainer} user={data?.data} />
        <ReviewsSection reviews={reviewData?.data} />
        <GallerySection gallery={gallery} />
        <View style={{ height: 96 }} />
      </ScrollView>

      <Surface
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          icon="message"
          mode="outlined"
          onPress={() => setModalVisible(true)}
          style={{ flex: 1, marginRight: 8 }}
        >
          Add Review
        </Button>
      </Surface>

      {/* 🔹 Review Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: COLORS.card,
            padding: 20,
            margin: 20,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: "600" }}>
            Add Your Review
          </Text>

          {/* Custom Rating */}
          {renderStars()}
          <Text style={{ color: "#9AA6B2", fontSize: 13, marginBottom: 10 }}>
            Selected Rating: {rating} ★
          </Text>

          <TextInput
            label="Write your review"
            value={comment}
            onChangeText={setComment}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={{ marginTop: 10, backgroundColor: "transparent" }}
          />

          <Button
            mode="contained"
            loading={isLoading}
            onPress={handleAddReview}
            style={{ marginTop: 20 }}
          >
            Submit Review
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}
