import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Text, Divider } from "react-native-paper";

interface ExpertiseSectionProps {
    trainer: {
        expertise: string[];
        yearsExperience: number;
        clientsTrained: number;
    };
    user:any
}

const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({ trainer,user }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Expertise</Text>

                {/* Metrics Section */}
                <View style={styles.metricsRow}>
                    <View style={styles.metricCol}>
                        <Text style={styles.metricValue}>{user?.experience}</Text>
                        <Text style={styles.metricLabel}>Years Experience</Text>
                    </View>

                    <View style={styles.metricCol}>
                        <Text style={styles.metricValue}>{trainer.clientsTrained}+</Text>
                        <Text style={styles.metricLabel}>Clients Trained</Text>
                    </View>
                </View>

                {/* Divider */}
                <Divider style={styles.divider} />

                {/* Expertise Chips */}
                <View style={styles.expertiseChips}>
                    {user?.specialization?.map((e) => (
                        <Chip
                            key={e}
                            style={styles.expertiseChip}
                            textStyle={styles.chipText}
                            compact
                        >
                            {e}
                        </Chip>
                    ))}
                </View>
            </Card.Content>
        </Card>
    );
};

export default ExpertiseSection;

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
        marginBottom: 12,
    },
    metricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    metricCol: {
        flex: 1,
        alignItems: "center",
    },
    metricValue: {
        color: "#65E0B9",
        fontSize: 20, // Slightly larger font for emphasis
        fontWeight: "800",
    },
    metricLabel: {
        color: "#9AA6B2",
        fontSize: 12,
        marginTop: 4,
    },
    divider: {
        backgroundColor: "#1C2A38",
        height: 1,
        marginVertical: 12,
    },
    expertiseChips: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center", // Center-align chips
    },
    expertiseChip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#0F2A34",
        elevation: 2, // Add slight shadow for better visibility
    },
    chipText: {
        fontSize: 11, // Reduced font size for a compact look
        color: "#B6C2CA",
    },
});