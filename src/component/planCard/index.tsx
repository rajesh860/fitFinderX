import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PlanCardProps {
    plan: any;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
    // Map feature names to icons (for your existing UI)
    const featureIconMap: { [key: string]: string } = {
        "Wi-Fi": "wifi",
        "24/7 Access": "clock",
        "Yoga Classes": "yoga",
        "Free Weights": "weight-lifter",
        "Weight Training": "dumbbell",
        "Cardio Machines": "run",
    };

    return (
        <Card style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Icon name="dumbbell" size={28} color="#fff" />
                <Text style={styles.title}>{plan.planName}</Text>
                <Chip style={styles.mostPopular} textStyle={{ color: "#fff" }}>
                    Most Popular
                </Chip>
            </View>

            {/* Price Section */}
            <View style={styles.priceBox}>
                <Text style={styles.price}>₹{plan.price}</Text>
                <Text style={styles.perMonth}>/month</Text>
            </View>
            <Chip style={styles.duration} textStyle={{ color: "#fff" }}>
                {plan.durationInMonths} Month{plan.durationInMonths > 1 ? "s" : ""} Duration
            </Chip>

            {/* What's Included */}
            <View style={styles.included}>
                <Text style={styles.sectionTitle}>What's Included</Text>
                {plan.features.map((feature: string, index: number) => (
                    <View style={styles.item} key={index}>
                        <Icon name={featureIconMap[feature] || "check"} size={20} color="#4ade80" />
                        <Text style={styles.itemText}>{feature}</Text>

                        {/* Optional chips for popular/premium */}
                        {feature === "Wi-Fi" && (
                            <Chip compact style={styles.premiumChip}>Premium</Chip>
                        )}
                        {feature === "24/7 Access" && (
                            <Chip compact style={styles.popularChip}>Popular</Chip>
                        )}

                        <Icon name="check" size={20} color="#4ade80" />
                    </View>
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: "#1e293b",
        width: "100%",
        alignSelf: "center",
        paddingBottom: 16,
    },
    header: {
        backgroundColor: "#7c3aed",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 4,
    },
    mostPopular: {
        backgroundColor: "#6d28d9",
        marginTop: 6,
    },
    priceBox: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        marginTop: 16,
    },
    price: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    perMonth: {
        fontSize: 16,
        color: "#cbd5e1",
        marginLeft: 4,
    },
    duration: {
        backgroundColor: "#064e3b",
        alignSelf: "center",
        marginVertical: 8,
    },
    included: {
        paddingHorizontal: 16,
        marginTop: 8,
        flexGrow: 1,
    },
    sectionTitle: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
        marginBottom: 10,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    itemText: {
        flex: 1,
        color: "#fff",
        marginLeft: 8,
    },
    premiumChip: {
        backgroundColor: "#facc15",
        marginRight: 8,
    },
    popularChip: {
        backgroundColor: "#3b82f6",
        marginRight: 8,
    },
});

export default PlanCard;
