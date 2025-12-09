import React, { useState } from "react";
import { View, Image, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Text, Chip, Card, Avatar } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";
import GymDetailsHeader from "../component/appHeader";
import { useTrainerDetailQuery } from "../services/trainer";
import { useNavigation, useRoute } from "@react-navigation/native";

const TrainerDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { trainerId } = route.params as { trainerId: string };

  const { data } = useTrainerDetailQuery(trainerId);

  const trainer = data?.data;

  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  // gallery images
  const galleryImages = trainer?.gallery;
  const zoomImages = galleryImages?.map((img) => ({
    url: img,
  }));

  return (
    <>
      <GymDetailsHeader title="Trainer Detail" navigation={navigation} />

      <ScrollView
        style={{ flex: 1, backgroundColor: "#0D0D0D" }}
        showsVerticalScrollIndicator={false}
      >
        {/* COVER IMAGE STATIC (No cover from backend, so using profile as cover) */}
        <Image
          source={{ uri: trainer?.photo }}
          style={{ width: "100%", height: 260 }}
          resizeMode="cover"
        />

        {/* PROFILE PHOTO */}
        <View style={{ alignItems: "center", marginTop: -40, marginBottom: 10 }}>
          <Avatar.Image
            size={85}
            source={{ uri: trainer?.photo }}
            style={{ borderWidth: 3, borderColor: "#0D0D0D" }}
          />
        </View>

        {/* NAME + TAGS */}
        <View style={{ paddingHorizontal: 16, alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff" }}>
            {trainer?.user?.name}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
            {(trainer?.specialization?.length
              ? trainer.specialization
              : ["General Fitness"]
            ).map((s, i) => (
              <Chip key={i} compact style={{ backgroundColor: "#1f2937" }}>
                <Text style={{ color: "#fff" }}>{s}</Text>
              </Chip>
            ))}
          </View>

          {/* Rating & Exp */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              alignItems: "center",
              gap: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={{ color: "#fff", marginLeft: 6 }}>
                {trainer?.averageRating || 0} ({trainer?.totalReviews || 0} reviews)
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="time" size={16} color="#10b981" />
              <Text style={{ color: "#fff", marginLeft: 6 }}>
                {trainer?.experience || 0}+ Years Exp.
              </Text>
            </View>
          </View>

          {/* BIO */}
          <Text
            style={{
              color: "#ccc",
              marginTop: 16,
              fontSize: 14,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            {trainer?.bio || "No bio available."}
          </Text>
        </View>

        {/* GALLERY */}
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            marginTop: 26,
            marginBottom: 10,
            paddingHorizontal: 16,
            fontWeight: "700",
          }}
        >
          Photos & Gallery
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        >
          {trainer?.gallery?.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                setZoomIndex(idx);
                setZoomVisible(true);
              }}
            >
              <Image
                source={{
                  uri: `https://fitcrewimages.s3.ap-south-1.amazonaws.com/${img}`,
                }}
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 12,
                  marginRight: 12,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ABOUT TRAINER */}
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            marginTop: 30,
            paddingHorizontal: 16,
            fontWeight: "700",
          }}
        >
          About Trainer
        </Text>

        <Card
          style={{
            backgroundColor: "#1a1a1a",
            padding: 16,
            borderRadius: 16,
            marginHorizontal: 16,
            marginTop: 12,
          }}
        >
          {/* Specs */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Ionicons name="barbell" size={24} color="#38bdf8" />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Specializations
              </Text>
              <Text style={{ color: "#ccc", marginTop: 4 }}>
                {(trainer?.specialization?.length
                  ? trainer.specialization.join(", ")
                  : "General Fitness")}
              </Text>
            </View>
          </View>

          {/* Exp */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Ionicons name="briefcase" size={24} color="#38bdf8" />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Experience</Text>
              <Text style={{ color: "#ccc", marginTop: 4 }}>
                {trainer?.experience || 0}+ years of coaching
              </Text>
            </View>
          </View>

          {/* Gyms */}
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="fitness" size={24} color="#38bdf8" />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Connected Gyms
              </Text>
              <Text style={{ color: "#ccc", marginTop: 4 }}>
                {trainer?.gyms?.length || 0} gyms connected
              </Text>
            </View>
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ZOOM IMAGE VIEWER */}
      <Modal
        visible={zoomVisible}
        transparent={true}
        onRequestClose={() => setZoomVisible(false)}
      >
        <ImageViewer
          imageUrls={zoomImages}
          index={zoomIndex}
          enableSwipeDown
          onSwipeDown={() => setZoomVisible(false)}
          onCancel={() => setZoomVisible(false)}
        />
      </Modal>
    </>
  );
};

export default TrainerDetailScreen;
