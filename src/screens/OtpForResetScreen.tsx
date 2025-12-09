import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Keyboard, Modal, TouchableOpacity } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useRoute, useNavigation } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { useOtpResendMutation, useOtpVerifyMutation } from "../services/userService";

const OtpForResetScreen = () => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputsRef = useRef<Array<TextInput | null>>([]);
    const [trigger, { isLoading }] = useOtpVerifyMutation();
    const [resendTrigger] = useOtpResendMutation();

    const route = useRoute();
    const navigation = useNavigation();
    const { email, otpTime } = route.params as { email: string; otpTime: number };

    const [otpExpiry, setOtpExpiry] = useState(otpTime);
    const [timeLeft, setTimeLeft] = useState(Math.max(Math.floor((otpExpiry - Date.now()) / 1000), 0));
    const [canEditOtp, setCanEditOtp] = useState(timeLeft > 0);

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = Math.max(Math.floor((otpExpiry - Date.now()) / 1000), 0);
            setTimeLeft(newTimeLeft);
            setCanEditOtp(newTimeLeft > 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [otpExpiry]);

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    const handleChange = (text: string, index: number) => {
        if (/^\d$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);
            if (index < 5) inputsRef.current[index + 1]?.focus();
            else Keyboard.dismiss();
        } else if (text === "") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = async () => {
        if (timeLeft <= 0) {
            Toast.show({ type: "error", text1: "OTP Expired", text2: "Request new OTP", position: "top" });
            return;
        }
        if (otp.some(val => val === "")) {
            Toast.show({ type: "error", text1: "Incomplete OTP", position: "top" });
            return;
        }

        const otpValue = otp.join("");
        try {
            await trigger({ otp: otpValue, email }).unwrap().then((res) => {
                Toast.show({ type: "success", text1: res?.message, position: "top" });
                navigation.navigate("resetPasswordScreen", { token: res.resetToken }); // ✅ Navigate to reset password
            });
        } catch (err: any) {
            Toast.show({ type: "error", text1: err?.data?.message || "Verification Failed", position: "top" });
        }
    };

    const onResend = () => {
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
        Toast.show({ type: "info", text1: "OTP resent", position: "top" });

        resendTrigger({ email })
            .unwrap()
            .then(res => {
                if (res?.otpExpiry) setOtpExpiry(res.otpExpiry); // ✅ update timer
            })
            .catch(err => console.log(err));
    };

    const isOtpComplete = otp.every(val => val !== "");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>Check your email for 6-digit OTP</Text>

            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        ref={el => (inputsRef.current[index] = el)}
                        value={value}
                        onChangeText={text => handleChange(text, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        style={styles.otpInput}
                        textAlign="center"
                        editable={canEditOtp}
                        autoFocus={index === 0}
                        selectionColor={COLORS.primary}
                        placeholder="-"
                        placeholderTextColor={COLORS.textMuted}
                    />
                ))}
            </View>

            <Text style={styles.timerText}>
                {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "OTP Expired"}
            </Text>

            <Button mode="contained" onPress={handleSubmit} disabled={!isOtpComplete || !canEditOtp} style={styles.submitButton}>
                Verify OTP
            </Button>

           <View 
    style={{ 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 20, 
        paddingHorizontal: 20 
    }}
>
    {/* Change Email */}
    <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
        <Text 
            style={{
                fontSize: 14,
                fontWeight: "600",
                color: COLORS.primary,
            }}
        >
            Change Email
        </Text>
    </TouchableOpacity>

    {/* Resend OTP */}
    <TouchableOpacity onPress={onResend} disabled={timeLeft > 0}>
        <Text
            style={{
                fontSize: 14,
                fontWeight: "700",
                color: timeLeft > 0 ? COLORS.textMuted : COLORS.error,
            }}
        >
            Resend OTP
        </Text>
    </TouchableOpacity>
</View>

            {isLoading && (
                <Modal transparent visible={isLoading} animationType="fade">
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default OtpForResetScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: COLORS.background },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: COLORS.primary, marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: "center", color: COLORS.textPrimary, marginBottom: 20 },
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    otpInput: { borderBottomWidth: 2, borderColor: COLORS.primary, width: 45, height: 50, fontSize: 20, borderRadius: 5, color: COLORS.textPrimary },
    timerText: { textAlign: "center", marginBottom: 10, color: COLORS.error },
    submitButton: { backgroundColor: COLORS.primary, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
    resendText: { textAlign: "center", fontWeight: "bold" },
    overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
});
