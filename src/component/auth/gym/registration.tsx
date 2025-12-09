import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useAuthRegisterMutation } from "../../../services/userService";
import { COLORS } from "../../../theme/colors";

const GymRegistration = () => {
  const [form, setForm] = useState({
    name: "",
    gymName: "",
    phone: "",
    email: "",
    password: "",
    userRole: "gym",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const [trigger, { isLoading }] = useAuthRegisterMutation();
  const navigation = useNavigation();

  // Keyboard show/hide listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // Keyboard ki height ke according padding set karo
        setKeyboardPadding(e.endCoordinates.height / 2);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardPadding(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const payload = { ...form, userRole: "gym" };
    if (
      !payload.gymName ||
      !payload.name ||
      !payload.phone ||
      !payload.email ||
      !payload.password
    ) {
      Toast.show({ type: "error", text1: "Please fill all fields", position: "top" });
      return;
    }

    try {
      const res: any = await trigger(payload).unwrap();
      Toast.show({
        type: "success",
        text1: res?.message || "Registered successfully!",
        text2: "Enter OTP sent to your email/phone 🎉",
        position: "top",
      });
      navigation.navigate("OtpScreen", { email: payload.email, otpTime: res?.otpExpiry });
    } catch (err: any) {
      Toast.show({ type: "error", text1: err?.data?.message || "Registration failed", position: "top" });
    }
  };

  const isDisabled = Object.values(form).some((v) => !v.trim());

  const fields = [
    { key: "name", label: "Owner Name" },
    { key: "gymName", label: "Gym Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 0,
          paddingBottom: 150 + keyboardPadding, // Dynamic padding based on keyboard
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {fields.map(({ key, label }) => (
            <TextInput
              key={key}
                textColor={COLORS.gray100}
              label={label}
              value={form[key as keyof typeof form]}
              onChangeText={(val) => handleChange(key, val)}
              mode="outlined"
              
              style={styles.input}
                theme={{
                                      colors: {
                                          primary: COLORS.primary,
                                          onSurfaceVariant: COLORS.gray300,
                                      },
                                  }}
            />
          ))}

          <TextInput
            label="Password"
              textColor={COLORS.gray100}
            value={form.password}
            onChangeText={(val) => handleChange("password", val)}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
              theme={{
                                    colors: {
                                        primary: COLORS.primary,
                                        onSurfaceVariant: COLORS.gray300,
                                    },
                                }}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                forceTextInputFocus={false}
              />
            }
          />

          <Button
            mode="contained"
            labelStyle={{ color: "#fff" }}
            style={styles.primaryBtn}
            onPress={handleRegister}
            disabled={isDisabled || isLoading}
            loading={isLoading}
          >
            Register
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    borderColor: COLORS.gray600,
    borderRadius: 6,
    marginBottom: 8,
    color: COLORS.gray300,
    backgroundColor: COLORS.gray700,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    marginVertical: 10,
    paddingVertical: 8,
  },
});

export default GymRegistration;