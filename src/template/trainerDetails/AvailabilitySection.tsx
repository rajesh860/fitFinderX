import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Button, Text } from "react-native-paper";

interface AvailabilitySectionProps {
    trainer: {
        availabilityNext: string;
        slots: string[]; // Array of available time slots
    };
}

// Demo data for testing
const demoTrainer = {
    availabilityNext: "Tomorrow, 6:00 AM",
    slots: [
        "6:00 AM - 7:00 AM",
        "7:30 AM - 8:30 AM",
        "10:00 AM - 11:00 AM",
        "1:00 PM - 2:00 PM",
        "5:00 PM - 6:00 PM",
    ],
};

const AvailabilitySection: React.FC<{ trainer?: typeof demoTrainer }> = ({ trainer }) => {
    const demoTrainer = {
        availabilityNext: "Tomorrow, 6:00 AM",
        slots: [
            "6:00 AM - 7:00 AM",
            "7:30 AM - 8:30 AM",
            "10:00 AM - 11:00 AM",
            "1:00 PM - 2:00 PM",
            "5:00 PM - 6:00 PM",
        ],
    };
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Availability</Text>

                {/* Slots Row */}
                <View style={styles.slotsRow}>
                    {demoTrainer?.slots?.map((slot, index) => (
                        <Chip key={index} style={styles.slotChip} textStyle={styles.slotText} compact>
                            {slot}
                        </Chip>
                    ))}
                </View>

                {/* Next Available and Book Button */}
                <View style={styles.availRow}>
                    <View>
                        <Text style={styles.nextAvailableLabel}>Next Available</Text>
                        <Text style={styles.nextAvailableValue}>{trainer.availabilityNext}</Text>
                    </View>

                    <Button mode="contained" onPress={() => {}} style={styles.bookNowBtn}>
                        Book Now
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );
};

export default AvailabilitySection;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#0B1722",
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
    },
    sectionTitle: {
        color: "#E6EEF3",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
    slotsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center", // Center-align the slots
        marginBottom: 24, // Add more spacing below the slots
    },
    slotChip: {
        backgroundColor: "#102630",
        marginRight: 8,
        marginBottom: 8,
        paddingHorizontal: 12, // Add padding for better visibility
        paddingVertical: 6,
        borderRadius: 16, // Ensure the chip has rounded corners
        elevation: 2, // Add slight shadow for better visibility
    },
    slotText: {
        fontSize: 12,
        color: "#B6C2CA",
    },
    availRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16, // Add spacing above the row
    },
    nextAvailableLabel: {
        color: "#9AA6B2",
        fontSize: 12,
    },
    nextAvailableValue: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14, // Slightly larger font size for emphasis
        marginTop: 4,
    },
    bookNowBtn: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
});