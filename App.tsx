import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import { store } from "./src/services/store";
import { COLORS } from "./src/theme/colors.ts";

// Screens
import StepScreen from "./src/component/stepScreen";
import AuthScreen from "./src/screens/auth/index";
import GymAuthScreen from "./src/screens/auth/gymAuth.tsx";
import HomeScreen from "./src/screens/GymsScreen.tsx";
import BookingsScreen from "./src/screens/BookingsScreen";
import ProfileTabWrapper from "./src/screens/ProfileTabWrapper.tsx";
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

// Redux action (assuming you have this action in auth slice)
import { setUserRole } from "./src/services/authSlice";
import DashboardScreen from "./src/screens/TrainerDashboardScreen.tsx";
import ClientList from "./src/screens/ClientList.tsx";
import TrainerProfile from "./src/screens/TrainerProfile.tsx";
import GymsScreen from "./src/screens/GymsScreen.tsx";
import ClientHome from "./src/screens/ClientHome.tsx";
import TrainerBookingScreen from "./src/screens/TrainerBookingScreen.tsx";
import AddPlanScreen from "./src/screens/addPlanTrainer.tsx";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// =================== SAFE VIEW ===================
const NotchSafeView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: COLORS.card }}>{children}</View>;
};

// =================== MAIN USER TABS ===================
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      tabBarIcon: ({ color }) => {
  let iconName;
  if (route.name === "Gyms") iconName = "dumbbell"; // gym icon
  else if (route.name === "Trainers") iconName = "account-tie";
  else if (route.name === "Home") iconName = "home";
  else if (route.name === "Bookings") iconName = "calendar";
  else if (route.name === "Profile") iconName = "account";

  return <MaterialCommunityIcons name={iconName} size={22} color={color} />;
},
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textPrimary,
        tabBarStyle: { backgroundColor: COLORS.gray800, borderTopWidth: 0 },
      })}
    >
      <Tab.Screen name="Home" children={() => <NotchSafeView><ClientHome /></NotchSafeView>} />
      <Tab.Screen name="Gyms" children={() => <NotchSafeView><GymsScreen /></NotchSafeView>} />
      <Tab.Screen name="Trainers" children={() => <NotchSafeView><TrainerSearchScreen /></NotchSafeView>} />
      <Tab.Screen name="Bookings" children={() => <NotchSafeView><BookingsScreen /></NotchSafeView>} />
      <Tab.Screen name="Profile" children={() => <NotchSafeView><ProfileTabWrapper /></NotchSafeView>} />
    </Tab.Navigator>
  );
}

// =================== TRAINER TABS ===================
function TrainerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName = "home";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Clients") iconName = "people";
       else if (route.name === "Gyms") iconName = "barbell-outline"; // <-- new icon
          else if (route.name === "Schedule") iconName = "calendar";
          else if (route.name === "Analytics") iconName = "bar-chart";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textPrimary,
        tabBarStyle: { backgroundColor: COLORS.gray800, borderTopWidth: 0 },
      })}
    >
      <Tab.Screen name="Home" children={() => <NotchSafeView><DashboardScreen /></NotchSafeView>} />
      <Tab.Screen name="Gyms" children={() => <NotchSafeView><HomeScreen /></NotchSafeView>} />
      <Tab.Screen   options={{
    tabBarStyle: { display: 'none' }, // hide tab bar
  }} name="Clients" children={() => <NotchSafeView><ClientList /></NotchSafeView>} />
      {/* <Tab.Screen name="Analytics" children={() => <NotchSafeView><ProgressHistoryScreen /></NotchSafeView>} /> */}
      <Tab.Screen name="Profile" children={() => <NotchSafeView><TrainerProfile/></NotchSafeView>} />
    </Tab.Navigator>
  );
}

// =================== APP NAVIGATOR ===================
const AppNavigator = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state:any) => state.auth.userRole);
  const [loading, setLoading] = useState(true);

  // Load userRole from AsyncStorage on app start
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("userRole");
      if (role) dispatch(setUserRole(role));
      setLoading(false);
    })();
  }, []);

  if (loading) return null; // You can show a splash screen here

  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" children={() => <NotchSafeView><SplashScreen /></NotchSafeView>} />
      <Stack.Screen name="StepScreen" children={() => <NotchSafeView><StepScreen /></NotchSafeView>} />
      <Stack.Screen name="gymDetail" children={() => <NotchSafeView><GymDetailsScreen /></NotchSafeView>} />
      <Stack.Screen name="planDetail" children={() => <NotchSafeView><PlanDetailsScreen /></NotchSafeView>} />
      <Stack.Screen name="trainerDetail" children={() => <NotchSafeView><TrainerProfileScreen /></NotchSafeView>} />
      <Stack.Screen name="trainerBooking" children={() => <NotchSafeView><TrainerBookingScreen /></NotchSafeView>} />
      <Stack.Screen name="addPlanTrainer" children={() => <NotchSafeView><AddPlanScreen /></NotchSafeView>} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      <Stack.Screen name="GymAuthScreen" component={GymAuthScreen} />
      <Stack.Screen name="MainTabs" key={userRole ?? "default"}>
        {() => userRole === "trainer" ? <TrainerTabs /> : <MainTabs />}
      </Stack.Screen>
      <Stack.Screen name="booktrail" children={() => <NotchSafeView><BookTrialScreen /></NotchSafeView>} />
      <Stack.Screen name="ProgressHistoryScreen" children={() => <NotchSafeView><ProgressHistoryScreen /></NotchSafeView>} />
      <Stack.Screen name="viewAttendanceScreen" children={() => <NotchSafeView><AttendanceScreen /></NotchSafeView>} />
      <Stack.Screen name="ProgressDetailsScreen" children={() => <NotchSafeView><ProgressDetailsScreen /></NotchSafeView>} />
      <Stack.Screen name="PlansScreen" children={() => <NotchSafeView><PlansScreen /></NotchSafeView>} />
      <Stack.Screen name="ScanQRScreen" children={() => <NotchSafeView><TestCamera /></NotchSafeView>} />
      <Stack.Screen name="OtpScreen" children={() => <NotchSafeView><OtpScreen /></NotchSafeView>} />
      <Stack.Screen name="ForgotPasswordScreen" children={() => <NotchSafeView><ForgotPasswordScreen /></NotchSafeView>} />
      <Stack.Screen name="OtpForResetScreen" children={() => <NotchSafeView><OtpForResetScreen /></NotchSafeView>} />
      <Stack.Screen name="resetPasswordScreen" children={() => <NotchSafeView><ResetPasswordScreen /></NotchSafeView>} />
      <Stack.Screen name="DemoUserInfo" children={() => <NotchSafeView><DemoUserInfoScreen /></NotchSafeView>} />
    </Stack.Navigator>
  );
};

// =================== MAIN APP ===================
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PaperProvider settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}>
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
            <Toast position="top" topOffset={40} visibilityTime={3000} />
          </NavigationContainer>
        </PaperProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
};

export default App;
