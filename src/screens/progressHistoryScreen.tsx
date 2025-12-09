import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GymDetailsHeader from "../component/appHeader";
import { useGymHistoryQuery } from "../services/userService";
import { COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";

type Membership = {
    id: string;
    gymName: string;
    plan: "BASIC" | "SILVER" | "GOLD" | "PLATINUM";
    startDate: string;
    endDate: string;
    status: "Active" | "Completed";
};

const planColors: Record<Membership["plan"], string> = {
    BASIC: "#EF4444",
    SILVER: "#6B7280",
    GOLD: "#F59E0B",
    PLATINUM: "#8B5CF6",
};

const ProgressHistoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const { data, refetch } = useGymHistoryQuery();
    console.log(data, "histroy")
    // Pull-to-refresh handler
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Transform API data to Membership type
    const formattedMemberships: Membership[] = [];

    if (data?.currentGym) {
        formattedMemberships.push({
            id: data.currentGym._id,
            gymId: data.currentGym.gym._id,
            gymName: data.currentGym.gym.gymName,
            plan: data.currentGym.plan.name.toUpperCase() as Membership["plan"],
            startDate: new Date(data.currentGym.membership_start).toISOString().split("T")[0],
            endDate: new Date(data.currentGym.membership_end).toISOString().split("T")[0],
            status: data.currentGym.status === "active" ? "Active" : "Completed",
        });
    }

    if (data?.gymHistory?.length) {
        const history = data.gymHistory.map((item: any) => ({
            id: item._id,
            gymName: item.gym.gymName,
            gymId: item.gym._id,
            plan: item.plan.name.toUpperCase() as Membership["plan"],
            startDate: new Date(item.membership_start).toISOString().split("T")[0],
            endDate: new Date(item.membership_end).toISOString().split("T")[0],
            status: item.status === "active" ? "Active" : "Completed",
        }));
        formattedMemberships.push(...history);
    }

    const renderItem = ({ item }: { item: Membership }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={[styles.iconWrapper, { backgroundColor: planColors[item.plan] }]}>
                    <MaterialCommunityIcons name="dumbbell" size={20} color="#fff" />
                </View>
                <View style={styles.info}>
                    <Text style={styles.gymName}>{item.gymName}</Text>
                    <View style={[styles.badge, { backgroundColor: planColors[item.plan] + "22" }]}>
                        <Text style={[styles.badgeText, { color: planColors[item.plan] }]}>
                            {item.plan}
                        </Text>
                    </View>
                </View>
                <View style={styles.statusWrapper}>
                    <View
                        style={[
                            styles.dot,
                            { backgroundColor: item.status === "Active" ? "#22C55E" : "#9CA3AF" },
                        ]}
                    />
                    <Text
                        style={[
                            styles.statusText,
                            { color: item.status === "Active" ? "#22C55E" : "#6B7280" },
                        ]}
                    >
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.dateRow}>
                <MaterialCommunityIcons name="calendar" size={16} color={COLORS.gray300} />
                <Text style={styles.dateText}>
                    {item.startDate} → {item.endDate}
                </Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() =>
                        navigation.navigate("viewAttendanceScreen", { gymId: item?.gymId, memberShip: item })
                    }
                >
                    <Text style={styles.primaryButtonText}>View Attendance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() =>
                        navigation.navigate("ProgressDetailsScreen", { gymId: item?.gymId, memberShip: item.id })
                    }
                >
                    <Text style={styles.secondaryButtonText}>View Progress</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.btnPlanHistory}>
                <TouchableOpacity
                    style={styles.btnHistory}
                    onPress={() =>
                        navigation.navigate("PlansScreen", { gymId: item?.gymId, memberShip: item })
                    }
                >
                    <Text style={styles.btnHistoryText}>View Plan History</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <GymDetailsHeader navigation={navigation} title="My Gym History" like={false} />
            <FlatList
                data={formattedMemberships}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 16 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            />
        </SafeAreaView>
    );
};

export default ProgressHistoryScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    card: {
        backgroundColor: COLORS.gray700,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    row: { flexDirection: "row", alignItems: "center" },
    iconWrapper: { padding: 10, borderRadius: 8 },
    info: { flex: 1, marginLeft: 12 },
    gymName: { fontSize: 16, fontWeight: "600", color: COLORS.textPrimary },
    badge: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
    badgeText: { fontSize: 12, fontWeight: "600" },
    statusWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#" },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    statusText: { fontSize: 14, fontWeight: "500" },
    dateRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
    dateText: { marginLeft: 6, fontSize: 14, color: COLORS.textPrimary },
    buttonRow: { flexDirection: "row", marginTop: 16 },
    primaryButton: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: 8, alignItems: "center", marginRight: 8 },
    primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
    secondaryButton: {
        backgroundColor: COLORS.gray600,
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: "center"
    },
    secondaryButtonText: { color: COLORS.textPrimary, fontWeight: "600", fontSize: 16 },
    btnPlanHistory: {
        marginTop: 12,
    },
    btnHistory: {
        borderColor: COLORS.primary,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        flex: 1,
        alignItems: "center"
    },
    btnHistoryText: {
        fontWeight: "600", fontSize: 14, color: COLORS.primary
    }
});
