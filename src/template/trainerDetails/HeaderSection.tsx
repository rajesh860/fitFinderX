import React from "react";
import { View, StyleSheet } from "react-native";
import {  Button, Surface, Text } from "react-native-paper";
import { Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface HeaderSectionProps {
    trainer: any;
    handleCall: () => any;
    handleBook: () => void;
    user:any;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
    trainer,
    handleCall,
    handleBook,
    user,
}) => {
    return (
        <Surface style={styles.headerSurface}>
            <View style={styles.headerTop}>
               <Image source={{ uri: user?.photo }} style={styles.profile} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.name}>{user?.user?.name}</Text>
                    <Text style={styles.title}>{trainer.title}</Text>

                    <View style={styles.ratingRow}>
                        <MaterialCommunityIcons name="star" size={16} color="#FFD54A" />
                        <Text style={styles.ratingText}>{user?.averageRating}</Text>
                        <Text style={styles.reviewsText}>
                            ({user?.totalReviews} reviews)
                        </Text>
                    </View>
                </View>
            </View>

            {/* Buttons moved to the bottom */}
            <View style={styles.headerButtons}>
                <Button
                    mode={"contained"}
                    onPress={()=>handleCall(user?.user?.phone)}
                    style={styles.followBtn}
                >
                    Call
                </Button>
                <Button mode="outlined" onPress={handleBook} style={styles.msgBtn}>
                    Hire Trainer
                </Button>
            </View>
        </Surface>
    );
};

export default HeaderSection;

const styles = StyleSheet.create({
    headerSurface: {
        backgroundColor: "#0B1722",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    profile:{
    width: 64,
        height: 64,
        borderRadius: 32,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16, // Add spacing between the top section and buttons
    },
    name: { color: "#fff", fontSize: 18, fontWeight: "700" },
    title: { color: "#9AA6B2", fontSize: 12, marginTop: 2 },
    ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    ratingText: { color: "#fff", marginLeft: 6, fontWeight: "700" },
    reviewsText: { color: "#9AA6B2", marginLeft: 6, fontSize: 12 },
    headerButtons: {
        flexDirection: "row",
        justifyContent: "center", // Center-align buttons horizontally
        marginTop: 4,
    },
    followBtn: {
        marginRight: 8,
        borderRadius: 8,
        flex: 1, // Make buttons equal width
    },
    msgBtn: {
        borderRadius: 8,
        flex: 1, // Make buttons equal width
    },
});