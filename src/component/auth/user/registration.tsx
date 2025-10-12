import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Modal } from "react-native";
import { TextInput, Button, ActivityIndicator, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useAuthRegisterMutation } from "../../../services/userService";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../theme/colors";

const UserRegistration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 👈 password toggle

    const [trigger, { isLoading }] = useAuthRegisterMutation();
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!name || !email || !phone || !password) {
            Toast.show({
                type: "error",
                text1: "Please fill all fields",
                position: "top",
            });
            return;
        }

        const payload = {
            name,
            email,
            phone,
            password,
            userRole: "member",
        };

        try {
            const res: any = await trigger(payload).unwrap();
            Toast.show({
                type: "success",
                text1: res?.message || "Registered successfully!",
                text2: "Enter OTP sent to your email/phone 🎉",
                position: "top",
            });
            navigation.navigate("OtpScreen", { email, otpTime: res?.otpExpiry });
        } catch (err: any) {
            Toast.show({
                type: "error",
                text1: err?.data?.message || "Registration failed",
                position: "top",
            });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 0,
          paddingBottom: 260 , // Dynamic padding based on keyboard
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
                <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={[styles.input]}
                    activeOutlineColor={COLORS.primary}
                    theme={{
                        colors: {
                            primary: COLORS.primary,
                            onSurfaceVariant: COLORS.gray300,
                        },
                    }}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={[styles.input]}
                    activeOutlineColor={COLORS.primary}
                    theme={{
                        colors: {
                            primary: COLORS.primary,
                            onSurfaceVariant: COLORS.gray300,
                        },
                    }}
                />
                <TextInput
                    label="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    mode="outlined"
                    style={[styles.input]}
                    activeOutlineColor={COLORS.primary}
                    theme={{
                        colors: {
                            primary: COLORS.primary,
                            onSurfaceVariant: COLORS.gray300,
                        },
                    }}
                />

                {/* 🔒 Password Input with toggle */}
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry={!showPassword} // 👈 toggle password
                    style={[styles.input]}
                    activeOutlineColor={COLORS.primary}
                    theme={{
                        colors: {
                            primary: COLORS.primary,
                            onSurfaceVariant: COLORS.gray300,
                        },
                    }}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"} // toggle icon
                            color={showPassword ? COLORS.primary : COLORS.gray300}
                            onPress={() => setShowPassword(!showPassword)}
                            forceTextInputFocus={false} // prevent focus glitch
                        />
                    }
                />

                <Button
                    mode="contained"
                    labelStyle={{ color: "#fff" }}
                    style={styles.primaryBtn}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    Register
                </Button>
            </ScrollView>

            {/* Full-screen overlay loader */}
            {isLoading && (
                <Modal transparent animationType="fade" visible={isLoading}>
                    <View style={styles.overlay}>
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.loaderText}>Registering...</Text>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20 },
    input: {
        borderColor: COLORS.gray600,
        borderRadius: 6,
        marginBottom: 8,
        color: COLORS.gray300,
        backgroundColor: COLORS.gray700,
    },
    primaryBtn: { backgroundColor: COLORS.primary, marginVertical: 10, paddingVertical: 5 },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderContainer: {
        width: 150,
        height: 150,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loaderText: {
        marginTop: 15,
        fontSize: 16,
        color: COLORS.textPrimary,
        textAlign: "center",
    },
});

export default UserRegistration;
