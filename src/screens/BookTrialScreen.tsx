import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import GymDetailsHeader from "../component/appHeader";
import { useUseGymEnquiryMutation } from "../services/userService";
import Toast from "react-native-toast-message";
import { COLORS } from "../theme/colors";

const fallbackImage =
  "https://images.unsplash.com/photo-1558611848-73f7eb4001a1";

export default function BookTrialScreen() {
  const route = useRoute();
  const { gym } = route.params as any;

  const today = new Date().toISOString().split("T")[0];

  const [bookingData, setBookingData] = useState<any>({
    date: today,
    time: "6:00 PM",
  });

  const morningSlots = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
  ];
  const eveningSlots = [
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ];

  const navigation = useNavigation();
  const [trigger, { data }] = useUseGymEnquiryMutation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: fetch updated gym info if needed
    setRefreshing(false);
  };

  const handleSubmit = () => {
    trigger({ ...bookingData, gymId: gym?._id });
  };

  useEffect(() => {
    if (data?.success) {
      Toast.show({
        type: "success",
        text1: data?.message,
      });
      navigation.goBack();
    }
  }, [data]);

  const bookingSummaryDate = bookingData.date || "Not selected";

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#6C63FF"]}
          tintColor="#6C63FF"
        />
      }
    >
      {/* Header */}
      <GymDetailsHeader navigation={navigation} title="Book Trial" like={true} />

      {/* Gym Info */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri: gym?.coverImage || fallbackImage,
            }}
            style={styles.gymImage}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.gymName}>{gym?.gymName}</Text>
            <Text style={styles.rating}>⭐ 4.8 (120 reviews)</Text>
            <Text style={styles.location}>📍 {gym?.address}</Text>
          </View>
        </View>

        <View style={styles.freeTrialBox}>
          <Text style={styles.freeTrialText}>Trial Fees</Text>
          <Text style={styles.freeTrialDuration}>
            ₹ {gym?.fees_trial} - 1 Day Access
          </Text>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <Calendar
  onDayPress={(day) =>
    setBookingData((prev: any) => ({ ...prev, date: day.dateString }))
  }
  markedDates={{
    [bookingData.date]: {
      selected: true,
      selectedColor:COLORS.primary, // <- use primary color here,
      selectedTextColor: "#fff",
    },
  }}
  theme={{
    calendarBackground: "#1E1E1E", // calendar background
    textSectionTitleColor: "#ccc", // Sun, Mon, Tue...
    selectedDayBackgroundColor: COLORS.primary,
    selectedDayTextColor: "#fff",
    todayTextColor:COLORS.primary, // <- use primary color here,
    dayTextColor: "#fff",
    textDisabledColor: "#555",
    dotColor: "#6C63FF",
    selectedDotColor: "#fff",
    arrowColor:COLORS.primary, // <- use primary color here,
    monthTextColor: "#fff",
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13,
  }}
/>
      </View>

      {/* Time Slots */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <Text style={styles.subHeading}>Morning</Text>
        <View style={styles.slotRow}>
          {morningSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.slot,
                bookingData.time === time && styles.selectedSlot,
              ]}
              onPress={() =>
                setBookingData((prev: any) => ({ ...prev, time }))
              }
            >
              <Text
                style={[
                  styles.slotText,
                  bookingData.time === time && { color: "#fff" },
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subHeading}>Evening</Text>
        <View style={styles.slotRow}>
          {eveningSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.slot,
                bookingData.time === time && styles.selectedSlot,
              ]}
              onPress={() =>
                setBookingData((prev: any) => ({ ...prev, time }))
              }
            >
              <Text
                style={[
                  styles.slotText,
                  bookingData.time === time && { color: "#fff" },
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Booking Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <Text style={styles.summaryText}>Date: {bookingSummaryDate}</Text>
        <Text style={styles.summaryText}>Time: {bookingData.time}</Text>
        <Text style={styles.summaryText}>Duration: 1 Day Access</Text>
      </View>

      {/* Confirm */}
      <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmit}>
        <Text style={styles.confirmBtnText}>Confirm Trial Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  card: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  gymImage: { width: 70, height: 70, borderRadius: 8 },
  gymName: { fontSize: 16, fontWeight: "600", color: "#fff" },
  rating: { fontSize: 13, color: "#ccc" },
  location: { fontSize: 13, color: "#ccc" },
  freeTrialBox: {
    marginTop: 10,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  freeTrialText: { color: "#6C63FF", fontWeight: "600" },
  freeTrialDuration: { color: "#6C63FF" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#fff" },
  subHeading: { marginTop: 10, marginBottom: 5, fontWeight: "500", color: "#ccc" },
  slotRow: { flexDirection: "row", flexWrap: "wrap" },
  slot: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
    margin: 5,
    minWidth: 80,
    alignItems: "center",
  },
  selectedSlot: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  slotText: { fontSize: 14, color: "#fff" },
  summaryText: { color: "#fff", marginVertical: 2 },
  confirmBtn: {
    backgroundColor:COLORS.primary, // <- use primary color here,
    margin: 16,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
