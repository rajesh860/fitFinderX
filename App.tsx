import React from "react";
import { StatusBar, StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./src/services/store";
import Toast from "react-native-toast-message";

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
import { navigationRef } from "./src/component/RootNavigation/RootNavigation.ts";
import PlanDetailsScreen from "./src/screens/PlanDetailsScreen.tsx";
import ProgressHistoryScreen from "./src/screens/progressHistoryScreen.tsx";
import ProgressDetailsScreen from "./src/screens/ProgressDetailsScreen.tsx";
import AttendanceScreen from "./src/screens/ViewAttendanceScreen.tsx";
import OtpScreen from "./src/screens/OTPScreen.tsx";
import TestCamera from "./src/screens/ScanQr.tsx";
import { COLORS } from "./src/theme/colors.ts";
import TrainerSearchScreen from "./src/screens/SearchScreen";
import PlansScreen from "./src/screens/PlansScreen.tsx";
import OtpForResetScreen from "./src/screens/OtpForResetScreen.tsx";
import ForgotPasswordScreen from "./src/screens/ForgotPassowordScreen.tsx";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen.tsx";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Transparent header overlay component
const TransparentHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: insets.top, // notch + header height
        backgroundColor: "rgba(60, 60, 60, 0.91)", // semi-transparent
        zIndex: 1000,
      }}
    />
  );
};

// ✅ Wrapper for screens to apply notch padding automatically
const NotchSafeView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, paddingTop: insets.top }}>{children}</View>;
};

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }: any) => {
          let iconName: string;
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
      <Tab.Screen name="Profile" children={() => <NotchSafeView><ProfileScreen /></NotchSafeView>} />
    </Tab.Navigator>
  );
}

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
};
function App() {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PaperProvider
          settings={{
            icon: (props) => <MaterialCommunityIcons {...props} />,
          }}
        >
          <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            {/* Transparent header overlay */}
            <TransparentHeader />

            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="ScanQRScreen" children={() => <NotchSafeView><TestCamera /></NotchSafeView>} />
              <Stack.Screen name="SplashScreen" children={() => <NotchSafeView><SplashScreen /></NotchSafeView>} />
              <Stack.Screen name="StepScreen" children={() => <NotchSafeView><StepScreen /></NotchSafeView>} />
              <Stack.Screen name="gymDetail" children={() => <NotchSafeView><GymDetailsScreen /></NotchSafeView>} />
              <Stack.Screen name="planDetail" children={() => <NotchSafeView><PlanDetailsScreen /></NotchSafeView>} />
              <Stack.Screen name="AuthScreen" children={() => <AuthScreen />} />
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
            </Stack.Navigator>

            {/* Toast container always at top */}
            <Toast
              position="top"
              topOffset={40} // optional, adjust distance from top
              visibilityTime={3000}
            />
          </NavigationContainer>
        </PaperProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}

export default App;
