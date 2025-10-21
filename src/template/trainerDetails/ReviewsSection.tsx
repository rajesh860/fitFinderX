import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Avatar, Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface ReviewsSectionProps {
    reviews: {
        id: string;
        name: string;
        text: string;
        time: string;
        rating: number;
    }[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.reviewsHeader}>
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    <Text style={styles.viewAll}>View All</Text>
                </View>

                {reviews.map((r) => (
                    <View key={r.id} style={styles.reviewItem}>
                        <Avatar.Text size={44} label={r.name[0]} />
                        <View style={styles.reviewContent}>
                            <View style={styles.reviewTopRow}>
                                <Text style={styles.reviewName}>{r.name}</Text>
                                <View style={styles.starsRow}>
                                    {Array.from({ length: r.rating }).map((_, i) => (
                                        <MaterialCommunityIcons
                                            key={i}
                                            name="star"
                                            size={14}
                                            color="#FFD54A"
                                        />
                                    ))}
                                </View>
                            </View>

                            <Text style={styles.reviewText}>{r.text}</Text>
                            <Text style={styles.reviewTime}>{r.time}</Text>
                        </View>
                    </View>
                ))}
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