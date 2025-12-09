import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Keyboard } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";
import { COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { useForgotPasswordMutation } from "../services/userService"

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const navigation = useNavigation();
    const [triggerForgot, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async () => {
        if (!email.trim()) {
            Toast.show({ type: "error", text1: "Email required", position: "top" });
            return;
        }

        try {
            const res: any = await triggerForgot({ email }).unwrap();
            Toast.show({ type: "success", text1: res?.message || "OTP sent!", position: "top" });
            Keyboard.dismiss();
            // ✅ Navigate to OTP screen, pass email and otpTime
            navigation.navigate("OtpForResetScreen", { email, otpTime: res?.otpExpiry });
        } catch (err: any) {
            Toast.show({ type: "error", text1: err?.data?.message || "Request Failed", position: "top" });
        }
    };

    return (
        <View style={styles.container} >
            <Text style={styles.title}> Forgot Password </Text>
            < Text style={styles.subtitle} > Enter your registered email to receive OTP </Text>

            < TextInput
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                labelStyle={{ color: COLORS.textPrimary, fontSize: 16 }
                }
                disabled={isLoading}
                loading={isLoading}
            >
                  {/* {isLoading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 10 }} />} */}
                {isLoading ? "Sending..." : "Send OTP"}
            </Button>

          
        </View>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: COLORS.background },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: COLORS.primary, marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: "center", color: COLORS.textPrimary, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: COLORS.gray500, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: COLORS.textPrimary, marginBottom: 20 },
    submitButton: { backgroundColor: COLORS.primary, paddingVertical: 8, borderRadius: 8 },
});
