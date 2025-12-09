import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../theme/colors";
import { useNavigation } from "@react-navigation/native";

const TrainerCard = ({ trainer }) => {
   const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.card}  onPress={() => navigation.navigate("TrainerDetailScreen", { trainer })}>
      
      {/* ⭐ Rating */}
      <View style={styles.ratingBox}>
        <Ionicons name="star" size={14} color="#fbbf24" />
        <Text style={styles.ratingText}>{trainer.rating}/5</Text>
      </View>

      <Image
        source={{ uri: trainer.photo }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name}>{trainer.name}</Text>
        <Text style={styles.sub}>{trainer.specialization}</Text>
        <Text style={styles.exp}>Experience: {trainer.experience} yrs</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TrainerCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: "row",
    padding: 12,
    position: "relative",
  },

  ratingBox: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 12,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  sub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  exp: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.gray300,
  },
});
