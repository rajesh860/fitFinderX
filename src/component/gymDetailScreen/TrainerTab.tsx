import React from "react";
import { View, Text, ScrollView } from "react-native";
import TrainerCard from "./Card";
import { COLORS } from "../../theme/colors";
import { useGymTrainerQuery } from "../../services/gym.services";
import { useRoute } from "@react-navigation/native";

const TrainerTab = ({ width }) => {
  const route = useRoute();
  const { id } = route.params; 

  const { data, isLoading } = useGymTrainerQuery(id);

  if (isLoading) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: COLORS.textPrimary }}>Loading trainers...</Text>
      </View>
    );
  }

  const trainers = data?.data || [];

  return (
    <View style={{ width }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 14,
            color: COLORS.textPrimary,
          }}
        >
          Trainers
        </Text>

        {trainers.length === 0 && (
          <Text style={{ color: COLORS.textSecondary }}>
            No trainers found
          </Text>
        )}

        {trainers.map((tr, idx) => (
          <TrainerCard
            key={idx}
            trainer={{
              name: tr?.user?.name,
              specialization: tr?.specialization?.join(", ") || "N/A",
              experience: tr?.experience || 0,
              rating: tr?.averageRating || 0,
              photo: tr?.photo?.[0] || null,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TrainerTab;
