import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Camera } from "react-native-camera-kit";
import { useGymUserMarkAttendanceMutation } from "../services/userService";
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import GymDetailsHeader from "../component/appHeader";
import { useNavigation } from "@react-navigation/native";

const TestCamera = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
const navigation = useNavigation<any>();
  const [markAttendance, { data, error, isLoading, isSuccess, isError }] =
    useGymUserMarkAttendanceMutation();

  // Request camera permission
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission to scan QR codes",
            buttonPositive: "OK",
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true); // iOS asks automatically
      }
    };
    requestPermission();
  }, []);

  // Delay camera rendering to ensure proper initialization
  useEffect(() => {
    if (hasPermission) {
      const timer = setTimeout(() => setCameraReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasPermission]);

  const handleQRRead = ({
    nativeEvent: { codeStringValue },
  }: {
    nativeEvent: { codeStringValue: string };
  }) => {
    if (!isScanning) return;

    setIsScanning(false);
    setStatus("loading");
    console.log("QR Scanned:", codeStringValue);
    markAttendance({ qrData: codeStringValue });
  };

  useEffect(() => {
    if (isLoading) setStatus("loading");
    if (isSuccess) setStatus("success");
    if (isError) setStatus("error");
  }, [isLoading, isSuccess, isError]);
useEffect(() => {
  if (isLoading) setStatus("loading");

  if (isSuccess) {
    setStatus("success");

    // ✅ Delay slightly for user to see success message
    setTimeout(() => {
      // Navigate to Home tab inside MainTabs
      navigation.navigate("MainTabs", { screen: "Home" });
    }, 1500);
  }

  if (isError) setStatus("error");
}, [isLoading, isSuccess, isError]);
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.spacing} />
            <Text style={styles.message}>Marking your attendance...</Text>
          </>
        );
      case "success":
        return (
          <>
            <Icon name="check-circle" size={60} color={COLORS.success} style={styles.spacing} />
            <Text style={styles.title}>Attendance Marked</Text>
            <Text style={styles.message}>
              {data?.message || "Your attendance has been successfully recorded."}
            </Text>
          </>
        );
      case "error":
        return (
          <>
            <Icon name="error" size={60} color={COLORS.error} style={styles.spacing} />
            <Text style={[styles.title, { color: COLORS.error }]}>Failed</Text>
            <Text style={styles.message}>
              {error?.data?.message || "Something went wrong. Please try again."}
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.doneContainer}>
        <Text style={styles.message}>Camera permission is required to scan QR codes.</Text>
      </View>
    );
  }

  return (
    <>
    <GymDetailsHeader title="Scan Qr" navigation={navigation}/>
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {isScanning ? (
        cameraReady ? (
          <Camera style={{ flex: 1 }} scanBarcode onReadCode={handleQRRead} />
        ) : (
          <View style={styles.doneContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )
      ) : (
        <View style={styles.doneContainer}>
          <View style={styles.card}>{renderContent()}</View>
        </View>
      )}
    </View>
      </>
  );
};

export default TestCamera;

const styles = StyleSheet.create({
  doneContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.gray700,
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  spacing: {
    marginBottom: 6,
  },
});
