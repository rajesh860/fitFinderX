import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { Avatar, Text, Menu, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme/colors";
import * as ImagePicker from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { requestPhotoPermission } from "../../utils";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../services/authSlice";

const Header = ({ trainerId, trigger, refetch, data }) => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState(data?.photo || data?.avatar || "https://randomuser.me/api/portraits/men/75.jpg");
  const [menuVisible, setMenuVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [experience, setExperience] = useState("");
  const [tempName, setTempName] = useState<string | undefined>(undefined);
  const [dataLoading, setDataLoading] = useState(true); // Skeleton loading

  // 🔹 Upload new photo using your logic
  const handleUploadImage = async () => {
    try {
      const hasPermission = await requestPhotoPermission();
      if (!hasPermission) return Alert.alert("Permission denied", "Please allow access to photos.");

      const result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false,
      });

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      setLoading(true);

      const resizedImage = await ImageResizer.createResizedImage(
        asset.uri,
        800,
        800,
        "JPEG",
        80,
        0,
        undefined,
        false,
        { mode: "contain", onlyScaleDown: true }
      );

      const nameFile = asset.fileName || `photo.${asset.type?.split("/")[1] || "jpg"}`;
      const typeFile = asset.type || "image/jpeg";

      const formData = new FormData();
      formData.append("photo", {
        uri: Platform.OS === "ios" ? resizedImage.uri.replace("file://", "") : resizedImage.uri,
        name: nameFile,
        type: typeFile,
      } as any);

      if (trigger) {
        const res = await trigger({ body: formData, trainerId }).unwrap();

        if (res.success) {
          setAvatarUri(res.data?.photo || resizedImage.uri);
          Toast.show({ type: "success", text1: res.message });
          if (typeof refetch === "function") refetch();
        } else {
          Toast.show({ type: "error", text1: res.message });
        }
      }
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", err?.data?.message || "Failed to update photo");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setTempName(data?.user?.name);
    setExperience(String(data?.experience ?? ""));
    setMenuVisible(false);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const payload = { name: tempName, experience: experience };

      if (trigger) {
        const res = await trigger({ body: payload, trainerId }).unwrap();
        if (res.success) {
          Toast.show({ type: "success", text1: res.message });
          if (typeof refetch === "function") refetch();
        } else {
          Toast.show({ type: "error", text1: res.message });
        }
      }
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Update failed" });
    } finally {
      setLoading(false);
      setEditModalVisible(false);
    }
  };

 const handleLogout = async() => {
  // const dispatch = useDispatch();

  try {
      setLoading(true);

   
await AsyncStorage.clear()
      // Show success toast
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been logged out successfully.",
        position: "bottom",
        visibilityTime: 2000,
      });
await AsyncStorage.clear()
      // Navigate to login screen
      navigation.replace("AuthScreen");
    } catch (error) {
      console.log("Logout error: ", error);

      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "Please try again.",
        position: "bottom",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    if (data) {
      setAvatarUri(data.photo || data?.avatar || "https://randomuser.me/api/portraits/men/75.jpg");

      // Derive a best-effort display name from possible shapes
      const displayName =
        data?.name ||
        data?.user?.name ||
        (data?.first_name || data?.last_name ? `${data?.first_name || ''} ${data?.last_name || ''}`.trim() : undefined) ||
        data?.fullName ||
        undefined;

      setTempName(displayName || "");

      // Experience may be present under different keys depending on the API
      const exp = data?.experience ?? data?.years_experience ?? data?.exp ?? "";
      setExperience(String(exp));
      setDataLoading(false); // Data loaded, hide skeleton
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {dataLoading ? (
        // Skeleton loading
        <View style={styles.contentRow}>
          <View style={[styles.avatarSkeleton, { borderRadius: 35 }]} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <View style={styles.lineSkeleton} />
            <View style={[styles.lineSkeleton, { width: "50%", marginTop: 8 }]} />
          </View>
        </View>
      ) : (
        <View style={styles.contentRow}>
          <View style={styles.avatarContainer}>
            <Avatar.Image size={70} source={avatarUri && { uri: avatarUri }} />
            <TouchableOpacity onPress={handleUploadImage} style={styles.editIcon}>
              <Icon name="pencil-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {tempName}
              </Text>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Icon name="dots-vertical" size={22} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                }
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={openEditModal}
                  title="Edit"
                  leadingIcon={() => <Icon name="pencil" size={16} color={COLORS.textPrimary} />}
                />
                <Menu.Item
                  onPress={handleLogout}
                  title="Logout"
                  leadingIcon={() => <Icon name="logout" size={16} color={COLORS.textPrimary} />}
                />
              </Menu>
            </View>

            <Text style={styles.experience}>{`${experience} Year of experience`}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color={COLORS.goldPrimary} />
              <Text style={styles.ratingText}>{data?.rating || 0}</Text>
              <Text style={styles.reviewCount}>(127 reviews)</Text>
            </View>
          </View>
        </View>
      )}

      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={COLORS.textMuted}
              value={tempName}
              onChangeText={setTempName}
            />
            <TextInput
              style={styles.input}
              placeholder="Experience"
              placeholderTextColor={COLORS.textMuted}
              value={experience}
              keyboardType="decimal-pad"
              onChangeText={(text) => {
                const formatted = text.replace(/[^0-9.]/g, "");
                const parts = formatted.split(".");
                if (parts.length > 2) return;
                setExperience(formatted);
              }}
            />
            <View style={styles.buttonRow}>
              <Button onPress={() => setEditModalVisible(false)}>Cancel</Button>
              <Button mode="contained" loading={loading} onPress={handleSaveEdit} style={styles.saveButton}>
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.gray900, paddingHorizontal: 20, paddingBottom: 10, width: "100%" },
  contentRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  avatarContainer: { position: "relative" },
  editIcon: { position: "absolute", bottom: 0, right: -4, backgroundColor: COLORS.background, borderRadius: 20 },
  infoContainer: { marginLeft: 16, flex: 1 },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 20, color: COLORS.textPrimary, fontWeight: "bold", textTransform: "capitalize" },
  experience: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { color: COLORS.textPrimary, marginLeft: 4 },
  reviewCount: { color: COLORS.textMuted, marginLeft: 4, fontSize: 12 },
  menuContent: { paddingVertical: 0 },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: COLORS.card, padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.textPrimary, marginBottom: 16, textAlign: "center" },
  input: { backgroundColor: COLORS.gray900, color: COLORS.textPrimary, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, marginBottom: 12 },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  saveButton: { backgroundColor: COLORS.primary },
  // Skeleton styles
  avatarSkeleton: { width: 70, height: 70, backgroundColor: COLORS.gray700 },
  lineSkeleton: { width: "70%", height: 15, backgroundColor: COLORS.gray700, borderRadius: 6 },
});

export default Header;
