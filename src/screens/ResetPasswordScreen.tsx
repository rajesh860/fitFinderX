import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useRoute, useNavigation } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { useResetPawwordMutation } from "../services/userService";
import Ionicons from "react-native-vector-icons/Ionicons";

const ResetPasswordScreen = () => {
    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [triggerReset, { isLoading }] = useResetPawwordMutation();
    const route = useRoute();
    const navigation = useNavigation();
    const { token } = route.params as { token: string };

    const handleSubmit = async () => {
        if (!password || !confirmPwd) {
            Toast.show({ type: "error", text1: "Both fields required", position: "top" });
            return;
        }
        if (password !== confirmPwd) {
            Toast.show({ type: "error", text1: "Passwords do not match", position: "top" });
            return;
        }

        try {
            await triggerReset({ token: token, newPassword: password }).unwrap();
            Toast.show({ type: "success", text1: "Password reset successfully", position: "top" });
            Keyboard.dismiss();
            navigation.navigate("AuthScreen"); // back to login
        } catch (err: any) {
            Toast.show({ type: "error", text1: err?.data?.message || "Reset failed", position: "top" });
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Reset Password</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor={COLORS.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color={COLORS.gray500}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor={COLORS.textMuted}
                        value={confirmPwd}
                        onChangeText={setConfirmPwd}
                        secureTextEntry={!showConfirmPwd}
                        style={styles.input}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPwd(!showConfirmPwd)}
                    >
                        <Ionicons
                            name={showConfirmPwd ? "eye-off" : "eye"}
                            size={24}
                            color={COLORS.gray500}
                        />
                    </TouchableOpacity>
                </View>

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={styles.submitButton}
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>

                {isLoading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 10 }} />}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: COLORS.primary,
        marginBottom: 20,
    },
    inputContainer: {
        position: "relative",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray500,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    eyeIcon: {
        position: "absolute",
        right: 10,
        top: 12,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: 8,
    },
});
