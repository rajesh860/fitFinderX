import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { COLORS } from "../../theme/colors";


const GymDetailsHeader = ({ navigation, title, like, onLogout,backArrow=true }: any) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
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
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {/* Back Button */}
        {backArrow&&  
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        }

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Right Actions */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Heart Icon */}
          <TouchableOpacity
            onPress={() => console.log("Added to wishlist")}
            style={[styles.iconBtn, { opacity: like ? 1 : 0 }]}
          >
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Logout Icon */}
          {onLogout && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.iconBtn}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.confirmButton]}
                onPress={handleLogout}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Logout</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.gray800,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  iconBtn: {
    padding: 5,
    marginLeft: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingLeft:10
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.gray500,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default GymDetailsHeader;
