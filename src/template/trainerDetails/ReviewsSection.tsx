import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Avatar, Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Utility to calculate time ago from createdAt
const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

interface ReviewsSectionProps {
  reviews: {
    _id: string;
    user: {
      name: string;
      email: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews?.length > 0 && (
            <Text style={styles.viewAll}>View All ({reviews.length})</Text>
          )}
        </View>

        {reviews?.length > 0 ? (
          reviews.map((r) => (
            <View key={r._id} style={styles.reviewItem}>
              <Avatar.Text
                size={44}
                label={r.user?.name ? r.user.name[0]?.toUpperCase() : "U"}
              />
              <View style={styles.reviewContent}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewName}>
                    {r.user?.name || "Anonymous"}
                  </Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MaterialCommunityIcons
                        key={i}
                        name={
                          i < r.rating
                            ? "star"
                            : i < r.rating + 0.5
                            ? "star-half-full"
                            : "star-outline"
                        }
                        size={14}
                        color="#FFD54A"
                      />
                    ))}
                  </View>
                </View>

                <Text style={styles.reviewText}>{r.comment}</Text>
                <Text style={styles.reviewTime}>{getTimeAgo(r.createdAt)}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: "#9AA6B2", marginTop: 10 }}>
            No reviews yet. Be the first to review!
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

export default ReviewsSection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0B1722",
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#E6EEF3",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAll: {
    color: "#65E0B9",
    fontWeight: "700",
  },
  reviewItem: {
    flexDirection: "row",
    marginTop: 12,
  },
  reviewContent: {
    marginLeft: 12,
    flex: 1,
  },
  reviewTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewName: {
    color: "#fff",
    fontWeight: "700",
  },
  starsRow: {
    flexDirection: "row",
  },
  reviewText: {
    color: "#B6C2CA",
    marginTop: 6,
  },
  reviewTime: {
    color: "#9AA6B2",
    marginTop: 6,
    fontSize: 12,
  },
});
