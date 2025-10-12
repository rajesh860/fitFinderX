import React, { useState, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Modal,
} from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { useAuthVerifyOtpMutation, useOtpResendMutation } from "../services/userService";
import { useRoute, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { COLORS } from "../theme/colors";

const OtpScreen = () => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputsRef = useRef<Array<TextInput | null>>([]);
    const [trigger, { isLoading }] = useAuthVerifyOtpMutation();
    const [resendTrigger] = useOtpResendMutation();

    const [showGymModal, setShowGymModal] = useState(false);
    const [showMsg, setShowMsg] = useState("");

    const route = useRoute();
    const navigation = useNavigation();
    const { email, otpTime } = route.params as { email: string; otpTime: number };

    const [otpExpiry, setOtpExpiry] = useState(otpTime); // track current OTP expiry
    const [timeLeft, setTimeLeft] = useState(Math.max(Math.floor((otpTime - Date.now()) / 1000), 0));
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
            Toast.show({
                type: "error",
                text1: "OTP Expired",
                text2: "Please request a new OTP",
                position: "top",
            });
            return;
        }
        if (otp.some(val => val === "")) {
            Toast.show({ type: "error", text1: "Incomplete OTP", position: "top" });
            return;
        }
        const otpValue = otp.join("");
        try {
            const res: any = await trigger({ otp: otpValue, email }).unwrap();
            console.log(res, "RES");
            if (res?.userRole === "gym") {
                setShowMsg(res?.message);
                setShowGymModal(true);
            } else {
                Toast.show({
                    type: "success",
                    text1: res.message || "OTP Verified!",
                    text2: "You have successfully verified your account 🎉",
                    position: "top",
                });
                navigation.navigate("AuthScreen");
            }
        } catch (err: any) {
            Toast.show({
                type: "error",
                text1: err?.data?.message || "OTP Verification Failed",
                position: "top",
            });
        }
    };

    const onResend = () => {
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
        Toast.show({ type: "info", text1: "OTP resent", position: "top" });

        resendTrigger({ email })
            .unwrap()
            .then(res => {
                console.log(res?.otpExpiry, "ResData");
                if (res?.otpExpiry) {
                    setOtpExpiry(res.otpExpiry); // ✅ use new OTP expiry for timer
                }
            })
            .catch(err => console.log(err));
    };

    const isOtpComplete = otp.every(val => val !== "");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
                We have sent a 6-digit OTP to your registered number/email
            </Text>

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

            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                    {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "OTP Expired"}
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                labelStyle={{ color: COLORS.textPrimary, fontSize: 14 }}
                disabled={isLoading || !isOtpComplete || !canEditOtp}
            >
                Verify OTP
            </Button>

            <TouchableOpacity onPress={onResend} disabled={timeLeft > 0}>
                <Text
                    style={[
                        styles.resendText,
                        { color: timeLeft > 0 ? COLORS.textMuted : COLORS.error },
                    ]}
                >
                    Resend OTP
                </Text>
            </TouchableOpacity>

            {isLoading && (
                <Modal transparent animationType="fade" visible={isLoading}>
                    <View style={styles.overlay}>
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.loaderText}>Verifying OTP...</Text>
                        </View>
                    </View>
                </Modal>
            )}

            <Modal visible={showGymModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🎉 Gym Registered Successfully!</Text>
                        <Text style={styles.modalMessage}>{showMsg}</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: COLORS.background },
    title: { textAlign: "center", marginBottom: 10, fontSize: 24, fontWeight: "bold", color: COLORS.primary },
    subtitle: { textAlign: "center", marginBottom: 14, color: COLORS.textPrimary },
    timerContainer: { textAlign: "left", marginBottom: 20 },
    timerText: { fontSize: 16, color: COLORS.error, fontWeight: "bold" },
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 10 },
    otpInput: { borderBottomWidth: 2, borderColor: COLORS.primary, width: 45, height: 50, fontSize: 20, borderRadius: 5, color: COLORS.textPrimary },
    submitButton: { marginBottom: 20, backgroundColor: COLORS.primary, marginVertical: 10, paddingVertical: 2 },
    resendText: { textAlign: "center", fontWeight: "bold" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
    loaderContainer: { width: 150, height: 150, borderRadius: 12, justifyContent: "center", alignItems: "center", padding: 20 },
    loaderText: { marginTop: 15, fontSize: 16, color: COLORS.textPrimary, textAlign: "center" },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,1)", justifyContent: "center", alignItems: "center" },
    modalContent: { width: "100%", borderRadius: 12, padding: 12, alignItems: "center" },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: COLORS.textPrimary, textAlign: "center" },
    modalMessage: { fontSize: 16, textAlign: "center", marginBottom: 20, color: COLORS.textPrimary },
    modalButton: { backgroundColor: COLORS.primary, paddingVertical: 5, paddingHorizontal: 20, borderRadius: 8 },
});
