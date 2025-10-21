import React from "react";
import { StatusBar, StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import { store } from "./src/services/store";
import { COLORS } from "./src/theme/colors.ts";

// Screens
import StepScreen from "./src/component/stepScreen";
import AuthScreen from "./src/screens/auth/index";
import GymAuthScreen from "./src/screens/auth/gymAuth.tsx";
import HomeScreen from "./src/screens/HomeScreen.tsx";
import BookingsScreen from "./src/screens/BookingsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import GymDetailsScreen from "./src/screens/GymDetailsScreen.tsx";
import BookTrialScreen from "./src/screens/BookTrialScreen.tsx";
import SplashScreen from "./src/screens/SplashScreen.tsx";
import PlanDetailsScreen from "./src/screens/PlanDetailsScreen.tsx";
import ProgressHistoryScreen from "./src/screens/progressHistoryScreen.tsx";
import ProgressDetailsScreen from "./src/screens/ProgressDetailsScreen.tsx";
import AttendanceScreen from "./src/screens/ViewAttendanceScreen.tsx";
import OtpScreen from "./src/screens/OTPScreen.tsx";
import TestCamera from "./src/screens/ScanQr.tsx";
import TrainerSearchScreen from "./src/screens/TrainerListScreen.tsx";
import PlansScreen from "./src/screens/PlansScreen.tsx";
import OtpForResetScreen from "./src/screens/OtpForResetScreen.tsx";
import ForgotPasswordScreen from "./src/screens/ForgotPassowordScreen.tsx";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen.tsx";
import TrainerProfileScreen from "./src/screens/TrainerDetailsScreen.tsx";
import DemoUserInfoScreen from "./src/screens/DemoUserInfoScreen.tsx";
import { navigationRef } from "./src/component/RootNavigation/RootNavigation.ts";

// =================== STACK & TAB ===================
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// =================== TRANSPARENT HEADER ===================
const TransparentHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: insets.top,
        backgroundColor: "rgba(60, 60, 60, 0.91)",
        zIndex: 1000,
      }}
    />
  );
};

// =================== NOTCH SAFE VIEW ===================
const NotchSafeView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, paddingTop: insets.top }}>{children}</View>;
};

// =================== PROFILE TAB WRAPPER ===================
const ProfileTabWrapper: React.FC = () => {
  const navigation = navigationRef.current;
  const [checkingRole, setCheckingRole] = React.useState(true);
  const [isDemo, setIsDemo] = React.useState(false);

  React.useEffect(() => {
    const checkDemo = async () => {
      try {
        const userRole = await AsyncStorage.getItem("userRole");

        if (userRole === "demo") {
          setIsDemo(true);
          navigation?.navigate("DemoUserInfo");
        }
      } catch (error) {
        console.log("Error reading userRole:", error);
      } finally {
        setCheckingRole(false); // Role check complete
      }
    };
    checkDemo();
  }, [navigation]);

  if (checkingRole) {
    // Role check ho raha hai → blank ya spinner
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  // Normal user ke liye ProfileScreen render karo
  if (!isDemo) return <ProfileScreen />;

  // Demo user ke liye nothing render, kyunki navigation ho chuki
  return null;
};

// =================== MAIN TABS ===================
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarIcon: ({ color }: any) => {
          let iconName: string = "home";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Trainers") iconName = "barbell";
          else if (route.name === "Bookings") iconName = "calendar";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textPrimary,
        tabBarStyle: { backgroundColor: COLORS.gray800, borderTopWidth: 0 },
      })}
    >
      <Tab.Screen name="Home" children={() => <NotchSafeView><HomeScreen /></NotchSafeView>} />
      <Tab.Screen name="Trainers" children={() => <NotchSafeView><TrainerSearchScreen /></NotchSafeView>} />
      <Tab.Screen name="Bookings" children={() => <NotchSafeView><BookingsScreen /></NotchSafeView>} />
      <Tab.Screen name="Profile" component={ProfileTabWrapper} />
    </Tab.Navigator>
  );
}

// =================== APP STACK PARAMS ===================
export type RootStackParamList = {
  SplashScreen: undefined;
  StepScreen: undefined;
  gymDetail: undefined;
  planDetail: undefined;
  AuthScreen: undefined;
  OtpScreen: undefined;
  GymAuthScreen: undefined;
  MainTabs: undefined;
  booktrail: undefined;
  ProgressHistoryScreen: undefined;
  viewAttendanceScreen: undefined;
  ProgressDetailsScreen: undefined;
  ProfileScreen: undefined;
  ScanQRScreen: undefined;
  OtpForResetScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: undefined;
  trainerDetail: undefined;
  DemoUserInfo: undefined;
  PlansScreen: undefined;
};

// =================== APP ===================
const App: React.FC = () => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PaperProvider settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <TransparentHeader />

            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" children={() => <NotchSafeView><SplashScreen /></NotchSafeView>} />
              <Stack.Screen name="StepScreen" children={() => <NotchSafeView><StepScreen /></NotchSafeView>} />
              <Stack.Screen name="gymDetail" children={() => <NotchSafeView><GymDetailsScreen /></NotchSafeView>} />
              <Stack.Screen name="planDetail" children={() => <NotchSafeView><PlanDetailsScreen /></NotchSafeView>} />
              <Stack.Screen name="trainerDetail" children={() => <NotchSafeView><TrainerProfileScreen /></NotchSafeView>} />
              <Stack.Screen name="AuthScreen" children={() => <AuthScreen />} />
              <Stack.Screen name="DemoUserInfo" children={() => <NotchSafeView><DemoUserInfoScreen /></NotchSafeView>} />
              <Stack.Screen name="OtpScreen" children={() => <NotchSafeView><OtpScreen /></NotchSafeView>} />
              <Stack.Screen name="ForgotPasswordScreen" children={() => <NotchSafeView><ForgotPasswordScreen /></NotchSafeView>} />
              <Stack.Screen name="OtpForResetScreen" children={() => <NotchSafeView><OtpForResetScreen /></NotchSafeView>} />
              <Stack.Screen name="resetPasswordScreen" children={() => <NotchSafeView><ResetPasswordScreen /></NotchSafeView>} />
              <Stack.Screen name="GymAuthScreen" children={() => <NotchSafeView><GymAuthScreen /></NotchSafeView>} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="booktrail" children={() => <NotchSafeView><BookTrialScreen /></NotchSafeView>} />
              <Stack.Screen name="ProgressHistoryScreen" children={() => <NotchSafeView><ProgressHistoryScreen /></NotchSafeView>} />
              <Stack.Screen name="viewAttendanceScreen" children={() => <NotchSafeView><AttendanceScreen /></NotchSafeView>} />
              <Stack.Screen name="ProgressDetailsScreen" children={() => <NotchSafeView><ProgressDetailsScreen /></NotchSafeView>} />
              <Stack.Screen name="PlansScreen" children={() => <NotchSafeView><PlansScreen /></NotchSafeView>} />
              <Stack.Screen name="ScanQRScreen" children={() => <NotchSafeView><TestCamera /></NotchSafeView>} />
            </Stack.Navigator>

            <Toast position="top" topOffset={40} visibilityTime={3000} />
          </NavigationContainer>
        </PaperProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
};

export default App;
