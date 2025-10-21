import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

interface AboutSectionProps {
    trainer: {
        about: string;
        badges: string[];
    };
}

const AboutSection: React.FC<AboutSectionProps> = ({ trainer }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.paragraph}>{trainer.about}</Text>

                <View style={styles.badgesRow}>
                    {trainer.badges.map((badge) => (
                        <Chip key={badge} style={styles.badge} textStyle={styles.badgeText} compact>
                            {badge}
                        </Chip>
                    ))}
                </View>
            </Card.Content>
        </Card>
    );
};

export default AboutSection;

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
    paragraph: {
        color: "#B6C2CA",
        fontSize: 13,
        lineHeight: 18,
    },
    badgesRow: {
        flexDirection: "row",
        marginTop: 12,
        flexWrap: "wrap",
    },
    badge: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#0F2A34",
    },
    badgeText: {
        fontSize: 11, // Reduced font size for the badge text
        color: "#B6C2CA", // Optional: Adjust text color if needed
    },
});