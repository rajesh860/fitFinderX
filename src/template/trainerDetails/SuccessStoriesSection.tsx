import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

interface SuccessStoriesSectionProps {
    trainer: {
        success: {
            sessions: string;
            successRate: string;
            transformations: string;
        };
    };
}

const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({ trainer }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Success Stories</Text>

                <View style={styles.successRow}>
                    <View style={styles.successCol}>
                        <Text style={styles.successValue}>{trainer.success.sessions}</Text>
                        <Text style={styles.successLabel}>Sessions</Text>
                    </View>

                    <View style={styles.successCol}>
                        <Text style={styles.successValue}>{trainer.success.successRate}</Text>
                        <Text style={styles.successLabel}>Success Rate</Text>
                    </View>

                    <View style={styles.successCol}>
                        <Text style={styles.successValue}>{trainer.success.transformations}</Text>
                        <Text style={styles.successLabel}>Transformations</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

export default SuccessStoriesSection;

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
    successRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    successCol: {
        alignItems: "center",
        flex: 1,
    },
    successValue: {
        color: "#65E0B9",
        fontSize: 18,
        fontWeight: "800",
    },
    successLabel: {
        color: "#9AA6B2",
        fontSize: 12,
    },
});