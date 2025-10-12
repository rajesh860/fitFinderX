// PersonalInfoCard.js
import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme/colors";

const PersonalInfoCard = ({ user = {}, updateProfile }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [updateData, setUpdateData] = useState<any>({});
  // Fields config → easy to extend later
  const fields = [
    { key: "email", label: "Email", icon: "email-outline" },
    { key: "phone", label: "Phone", icon: "phone-outline" },
    { key: "dob", label: "Date of Birth", icon: "calendar" },
    { key: "address", label: "Address", icon: "map-marker-outline" },
    { key: "gender", label: "Gender", icon: "gender-male-female" },
  ];

  const handleChange = (field: string, value: string) => {
    setUpdateData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const payload = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(payload).length === 0) {
      setModalVisible(false);
      return;
    }

    try {
      await updateProfile({ body: payload, userId: user._id });
    } catch (err) {
      console.log("Update failed:", err);
    }

    setModalVisible(false);

  };

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  if (!formData) return null;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Icon name="account-box-outline" size={20} color={COLORS.primary} />
        <Text style={styles.cardTitle}>Personal Information</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="pencil" size={18} color={COLORS.primary} style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        {fields?.map((field) => {
          // Skip empty fields for dob/address/gender
          if ((field.key === "dob" || field.key === "address" || field.key === "gender") && !user?.[field.key]) {
            return null;
          }
          return (
            <View key={field.key} style={styles.infoRow}>
              <Icon name={field.icon} size={18} color={COLORS.textSecondary} />
              <Text style={styles.infoText} numberOfLines={1}
  ellipsizeMode="tail">{user?.[field.key] || "-"}</Text>
            </View>
          );
        })}
      </View>

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Edit Personal Info</Text>

              {fields.map((field) => {
                const isDisabled = field.key === "email" ;

                // Gender field with selectable options
                if (field.key === "gender") {
                  const value = updateData.gender ?? user.gender ?? "";
                  return (
                    <View key={field.key} style={{ marginTop: 12 }}>
                      <Text style={styles.label}>{field.label}</Text>
                      <View style={styles.genderOptions}>
                        {["Male", "Female", "Other"].map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={[
                              styles.genderButton,
                              value === option && styles.genderButtonSelected,
                            ]}
                            onPress={() => handleChange("gender", option)}
                          >
                            <Text
                              style={[
                                styles.genderButtonText,
                                value === option && styles.genderButtonTextSelected,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                }

                const value =
                  updateData[field.key] !== undefined
                    ? updateData[field.key]
                    : user[field.key] || "";

                return (
                  <View key={field.key}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput
                      style={[
                        styles.input,
                        isDisabled && {
                          backgroundColor: COLORS.textMuted,
                          color: COLORS.textPrimary,
                        },
                      ]}
                      value={value}
                      editable={!isDisabled}
                      onChangeText={(text) => handleChange(field.key, text)}
                    />
                  </View>
                );
              })}

              <View style={styles.modalBtns}>
                <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnTextCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginLeft: 6, color: COLORS.textPrimary, flex: 1 },
  editIcon: { marginLeft: "auto" },
  cardContent: { marginTop: 4 },
  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  infoText: { fontSize: 13, color: COLORS.textPrimary, marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: COLORS.gray800,
    borderRadius: 12,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: COLORS.textPrimary },
  label: { fontSize: 14, marginTop: 10, color: COLORS.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray600,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
    color: COLORS.gray300,
    backgroundColor: COLORS.gray700,
  },
  modalBtns: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  btnSave: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: COLORS.gray600,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  btnText: { color: COLORS.textPrimary, fontWeight: "600", fontSize: 16 },
  btnTextCancel: { color: COLORS.textPrimary, fontWeight: "600", fontSize: 16 },

  // Gender selection styles
  genderOptions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray600,
    alignItems: "center",
    backgroundColor: COLORS.gray700,
  },
  genderButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  genderButtonTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});

export default PersonalInfoCard;
