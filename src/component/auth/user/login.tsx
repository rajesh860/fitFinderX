import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDemoLoginMutation, useUserLoginMutation } from "../../../services/userService";
import { COLORS } from "../../../theme/colors";
import { useDispatch, useSelector } from "react-redux";
import { setUserRole } from "../../../services/authSlice";

const handleGoogleSignIn = () => console.log("Google Sign-In/Register");
const handleFacebookSignIn = () => console.log("Facebook Sign-In/Register");

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const [trigger, { data, isLoading }] = useUserLoginMutation();
  const [triggerDemoLogin, { data: demoData }] = useDemoLoginMutation();
  console.log(demoData, "DemoData");


  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Toast.show({ type: "error", text1: "Please enter email and password" });
        return;
      }
      trigger({ email, password });
    } catch (error) {
      console.log("Error retrieving baseURL:", error);
    }
  };
      const dispatch = useDispatch();
  useEffect(() => {
    const successData = data?.success ? data : demoData?.success ? demoData : null;

    if (successData) {
      const storeTokenAndNavigate = async () => {
        try {
          const token = successData?.token || "";
          const userRole = successData?.user?.userRole || "";
          const userId = successData?.user?.userId?.toString() || "";

          if (token) await AsyncStorage.setItem("token", token);
          if (userRole){ await AsyncStorage.setItem("userRole", userRole)
             dispatch(setUserRole(userRole));
        
          }
          if (userId) await AsyncStorage.setItem("userId", userId);

          Toast.show({
            type: "success",
            text1: successData?.message || "Login successful!",
            text2: "Welcome back! 🎉",
            position: "top",
          });

          navigation.navigate("MainTabs", { screen: "Home" });
        } catch (error) {
          console.log("Error storing token:", error);
        }
      };

      storeTokenAndNavigate();
    }
  }, [data, demoData, navigation]);



  const handleGuestLogin = () => triggerDemoLogin();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Phone or Email"
        value={email}
        onChangeText={setEmail}
          textColor={COLORS.gray100}
        mode="outlined"
        disabled={isLoading} // ⛔ disable while loading
        style={[styles.input]}
        activeOutlineColor={COLORS.primary}
        theme={{
          colors: {
            primary: COLORS.primary,
            onSurfaceVariant: COLORS.gray300,
          },
        }}
        right={<TextInput.Icon icon="email" color={COLORS.primary} />}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
          textColor={COLORS.gray100}
        secureTextEntry={!showPassword}
        disabled={isLoading}
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
            icon={showPassword ? "eye" : "eye-off"}
            color={COLORS.primary}
            onPress={() => setShowPassword(!showPassword)}
            forceTextInputFocus={false}
          />
        }
      />

      <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 10 }} onPress={() => {
        navigation.navigate("ForgotPasswordScreen");
      }}>
        <Text style={{ color: COLORS.error }}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        disabled={isLoading} // ⛔ disable while loading
        labelStyle={{ color: COLORS.textPrimary, fontSize: 16 }}
        style={styles.primaryBtn}
        onPress={handleLogin}
        loading={isLoading}
      >
        {isLoading?"":
      
        "Login"
      }
     
      </Button>

      {/* <TouchableOpacity style={{ marginVertical: 6 }}>
        <Text style={{ textAlign: "center", color: COLORS.primaryLight }}>
          Login with OTP instead
        </Text>
      </TouchableOpacity> */}

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={{ color: COLORS.primary, marginHorizontal: 10 }}>or</Text>
        <View style={styles.line} />
      </View>

      <Button mode="outlined" style={styles.outlineBtn} onPress={handleGuestLogin}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Icon name="account" size={20} color="#DB4437" style={{ marginRight: 8 }} />
          <Text style={{ color: COLORS.textSecondary }}>Continue as Guest</Text>
        </View>
      </Button>

      {/* <Button mode="outlined" style={styles.outlineBtn} onPress={handleGoogleSignIn}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Icon name="google" size={20} color="#DB4437" style={{ marginRight: 8 }} />
          <Text style={{ color: COLORS.textSecondary }}>Continue with Google</Text>
        </View>
      </Button> */}

      <Text style={styles.footerText}>
        By continuing, you agree to our{" "}
        <Text style={{ textDecorationLine: "underline" }}>Terms of Service</Text> and{" "}
        <Text style={{ textDecorationLine: "underline" }}>Privacy Policy</Text>.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderColor: COLORS.gray600,
    borderRadius: 6,
    marginBottom: 8,
    color: COLORS.gray300,
    backgroundColor: COLORS.gray700,
  },
  primaryBtn: { backgroundColor: COLORS.primary, marginVertical: 10, paddingVertical: 5 },
  outlineBtn: { marginVertical: 6, borderColor: COLORS.gray700, borderWidth: 1 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.textMuted },
  footerText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 20, textAlign: "center" },
});

export default UserLogin;
