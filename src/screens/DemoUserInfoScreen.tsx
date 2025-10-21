import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { COLORS } from "../theme/colors";

const DemoUserInfoScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* <Image
                source={require("../../assets/demo_user.png")} // optional image
                style={styles.image}
                resizeMode="contain"
            /> */}

            <Text style={styles.title}>You are using a Demo Account</Text>
            <Text style={styles.description}>
                This demo account gives you a preview of how the app works.
                {"\n\n"}
                To unlock your personal profile, save progress, and access all features,
                please create a real account.
            </Text>

            <Button
                mode="contained"
                style={styles.primaryBtn}
                labelStyle={{ color: COLORS.textPrimary, fontSize: 16 }}
                onPress={() => navigation.navigate("AuthScreen")}
            >
                Create Real Account
            </Button>

            <Button
                mode="outlined"
                style={styles.outlineBtn}
                labelStyle={{ color: COLORS.textSecondary }}
                onPress={() => navigation.navigate("MainTabs")}
            >
                Continue Demo Mode
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        color: COLORS.primary,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 22,
    },
    primaryBtn: {
        width: "100%",
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: 8,
    },
    outlineBtn: {
        width: "100%",
        borderColor: COLORS.gray500,
        marginTop: 12,
    },
});

export default DemoUserInfoScreen;
