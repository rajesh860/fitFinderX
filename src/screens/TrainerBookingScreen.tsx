import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar, Text, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAvailableSlotsQuery, useTrainerBookingMutation } from "../services/trainer";

export default function TrainerBookingScreen() {
  const navigation = useNavigation<any>();
    const route = useRoute();
    const { trainerId } = route.params as { trainerId: string };
    console.log("Trainer ID in Booking Screen:",trainerId);
const  { data:availbaleSlots, isLoading:availbaleSlotsLoading } = useAvailableSlotsQuery(trainerId);
const [trigger, { data, isLoading }] = useTrainerBookingMutation();
  // ✅ Mock Trainer Data
  console.log("Available Slots Data:",availbaleSlots);
  const trainer = {
    user: { name: "Alex Fitness" },
    photo: ["https://cdn-icons-png.flaticon.com/512/219/219983.png"],
    availability: [
      {
        day: "Monday",
        personalTraining: [
          { slotNumber: 1, startTime: "05:00 AM", endTime: "06:00 AM" },
          { slotNumber: 2, startTime: "06:00 AM", endTime: "07:00 AM" },
          { slotNumber: 3, startTime: "07:00 AM", endTime: "08:00 AM" },
        ],
        gymTraining: {
          startTime: "05:00 AM",
          endTime: "10:00 PM",
        },
      },
      {
        day: "Tuesday",
        personalTraining: [
          { slotNumber: 1, startTime: "05:00 AM", endTime: "06:00 AM" },
          { slotNumber: 2, startTime: "08:00 AM", endTime: "09:00 AM" },
        ],
        gymTraining: {
          startTime: "05:00 AM",
          endTime: "10:00 PM",
        },
      },
      {
        day: "Wednesday",
        personalTraining: [
          { slotNumber: 1, startTime: "06:00 AM", endTime: "07:00 AM" },
          { slotNumber: 2, startTime: "09:00 AM", endTime: "10:00 AM" },
        ],
        gymTraining: {
          startTime: "05:00 AM",
          endTime: "10:00 PM",
        },
      },
    ],
  };

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Default to first day
    if (!selectedDay && trainer.availability.length > 0) {
      setSelectedDay(trainer.availability[0].day);
    }
  }, []);

  const selectedAvailability = trainer.availability.find(
    (a) => a.day === selectedDay
  );

  const handleBooking = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(
        `✅ Booking Confirmed\nDay: ${selectedDay}\nSlot: ${
          selectedSlot
            ? selectedAvailability?.personalTraining.find(
                (s) => s.slotNumber === selectedSlot
              )?.startTime +
              " - " +
              selectedAvailability?.personalTraining.find(
                (s) => s.slotNumber === selectedSlot
              )?.endTime
            : "N/A"
        }`
      );
    }, 1200);
  };

  if (!trainer)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          color="#fff"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.profile}>
          <Avatar.Image size={45} source={{ uri: trainer.photo[0] }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{trainer.user.name}</Text>
            <Text style={styles.subText}>Personal Trainer</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Select Day */}
        <Text style={styles.sectionTitle}>Select Day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dayContainer}>
            {trainer.availability.map((a) => (
              <TouchableOpacity
                key={a.day}
                style={[
                  styles.dayBox,
                  selectedDay === a.day && styles.activeDayBox,
                ]}
                onPress={() => {
                  setSelectedDay(a.day);
                  setSelectedSlot(null);
                }}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    selectedDay === a.day && styles.activeDayLabel,
                  ]}
                >
                  {a.day.substring(0, 3).toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Personal Training */}
        <Text style={styles.sectionTitle}>Personal Training</Text>
        {selectedAvailability?.personalTraining?.length ? (
          selectedAvailability.personalTraining.map((slot) => (
            <TouchableOpacity
              key={slot.slotNumber}
              style={[
                styles.slotCard,
                selectedSlot === slot.slotNumber && styles.activeSlotCard,
              ]}
              onPress={() => setSelectedSlot(slot.slotNumber)}
            >
              <View>
                <Text style={styles.slotTitle}>
                  Slot {slot.slotNumber}: {slot.startTime} - {slot.endTime}
                </Text>
                <Text style={styles.slotDuration}>1 hour</Text>
              </View>
              <Icon
                name={
                  selectedSlot === slot.slotNumber
                    ? "checkbox-marked-circle"
                    : "checkbox-blank-circle-outline"
                }
                size={22}
                color={selectedSlot === slot.slotNumber ? "#06b6d4" : "#94a3b8"}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text
            style={{ color: "#94a3b8", textAlign: "center", marginVertical: 10 }}
          >
            No personal training available for this day.
          </Text>
        )}

        {/* Gym Training */}
        {selectedAvailability?.gymTraining && (
          <>
            <Text style={styles.sectionTitle}>Gym Training Hours</Text>
            <View style={styles.gymCard}>
              <Icon name="clock-outline" size={22} color="#38bdf8" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.slotTitle}>
                  {selectedAvailability.gymTraining.startTime} -{" "}
                  {selectedAvailability.gymTraining.endTime}
                </Text>
                <Text style={styles.slotDuration}>Full day access</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Confirm Button */}
      <Button
        mode="contained"
        onPress={handleBooking}
        disabled={!selectedSlot || loading}
        style={[
          styles.confirmButton,
          { backgroundColor: selectedSlot ? "#38bdf8" : "#334155" },
        ]}
        labelStyle={{ color: "#fff", fontSize: 16 }}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: { flexDirection: "row", alignItems: "center" },
  profile: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  name: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  subText: { color: "#94a3b8", fontSize: 13 },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  dayContainer: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 10,
  },
  dayBox: {
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 10,
    width: 70,
    paddingVertical: 10,
  },
  activeDayBox: { backgroundColor: "#38bdf8" },
  dayLabel: { color: "#94a3b8", fontWeight: "bold" },
  activeDayLabel: { color: "#fff" },
  slotCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeSlotCard: { borderWidth: 1, borderColor: "#38bdf8" },
  slotTitle: { color: "#fff", fontWeight: "bold" },
  slotDuration: { color: "#94a3b8", marginTop: 3 },
  gymCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  confirmButton: { borderRadius: 12, marginVertical: 16 },
});
