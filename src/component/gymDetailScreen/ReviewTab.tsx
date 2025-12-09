import React, { useState } from 'react'
import { FlatList, Modal, StyleSheet, TouchableOpacity, View,TextInput } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { COLORS } from '../../theme/colors'
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import { useGymUserAddReviewMutation } from '../../services/userService';

const ReviewTab = ({width,reviews,refetchReviews}) => {
      const route = useRoute(); 
    const { id } = route.params as { id: string };
      const [modalVisible, setModalVisible] = useState(false);
      const [newReview, setNewReview] = useState("");
      const [newRating, setNewRating] = useState(0);
      const [addReviewTrigger,{data,isLoading:addLoading}] = useGymUserAddReviewMutation();
    const renderStars = (rating: number) => (
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons key={i} name={rating >= i ? "star" : "star-outline"} size={16} color="#f39c12" />
          ))}
        </View>
      );

       const addReview = async () => {
        if (!newReview.trim() || newRating === 0) {
          Toast.show({
            type: "error",
            text1: !newReview.trim()
              ? "Please enter a review"
              : "Please select a rating",
            position: "top",
            visibilityTime: 3000,
          });
          return; // ⛔ stop execution here
        }
      
        try {
          const res = await addReviewTrigger({
            gymId: id,
            rating: newRating,
            comment: newReview,
          }).unwrap();
      
          Toast.show({
            type: "success",
            text1: res.message || "Review added successfully",
            position: "top",
            visibilityTime: 3000,
          });
      
          setNewReview("");
          setNewRating(0);
          setModalVisible(false);
      
          // ✅ Refresh reviews
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
      
  return (
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
                            <Button loading={addLoading} mode="contained" style={{ backgroundColor: COLORS.primary, flex: 1 }} labelStyle={{ color: COLORS.textPrimary }} onPress={addReview}>Submit</Button>
                          </View>
                        </View>
                      </View>
                    </Modal>
          </View>
  )
}

export default ReviewTab


const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 14, color: COLORS.textPrimary },
  submitBtn: { marginTop: 6, backgroundColor: COLORS.border },
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
     reviewCard: {
        backgroundColor: COLORS.gray700,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
      },
        starsRow: { flexDirection: "row", marginBottom: 6, marginTop: 10 },
      reviewUser: { fontWeight: "600", marginBottom: 1, fontSize: 16, color: COLORS.textPrimary },
      reviewText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
      reviewDate: { fontSize: 12,
        color: COLORS.gray400, },

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
})