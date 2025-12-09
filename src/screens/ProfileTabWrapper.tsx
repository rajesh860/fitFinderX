import React from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";
import ProfileScreen from "../screens/ProfileScreen";
import DemoUserInfoScreen from "../screens/DemoUserInfoScreen";
import { useNavigation } from "@react-navigation/native";

const ProfileTabWrapper: React.FC = () => {
  const [checkingRole, setCheckingRole] = React.useState(true);
  const [isDemo, setIsDemo] = React.useState(false);

  const navigation = useNavigation();

  React.useEffect(() => {
    const checkDemo = async () => {
      try {
        const userRole = await AsyncStorage.getItem("userRole");
        if (userRole === "demo") setIsDemo(true);
      } catch (error) {
        console.log("Error reading userRole:", error);
      } finally {
        setCheckingRole(false);
      }
    };
    checkDemo();
  }, []);

  if (checkingRole) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  // Pass a callback to DemoUserInfoScreen for continuing
  return isDemo ? (
    <DemoUserInfoScreen
      onContinueDemo={() => {
        // Navigate to MainTabs → Home
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      }}
    />
  ) : (
    <ProfileScreen />
  );
};

export default ProfileTabWrapper;
