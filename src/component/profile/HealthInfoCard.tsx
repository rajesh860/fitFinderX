import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useUpdateProfileMutation } from "../../services/userService";
import { COLORS } from "../../theme/colors";

export default function HealthInfoCard({ healthData, setHealthData, userData }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, setTempData] = useState<string[]>([]); // modal-only data
  const [newCondition, setNewCondition] = useState("");
  const [adding, setAdding] = useState(false); // spinner for add button
  const [removingIndex, setRemovingIndex] = useState<number | null>(null); // spinner for removing

  const [updateProfile] = useUpdateProfileMutation();

  // Load modal data when opening
  useEffect(() => {
    if (modalVisible) {
      setTempData(healthData || []);
    }
  }, [modalVisible, healthData]);

  const handleUpdate = async (updatedConditions: string[]) => {
    try {
      await updateProfile({
        body: { medical_conditions: updatedConditions },
        userId: userData?._id,
      }).unwrap();
      setTempData(updatedConditions); // only modal
    } catch (err) {
      console.log("Update failed:", err);
    } finally {
      setAdding(false);
      setRemovingIndex(null);
    }
  };

  const handleAddCondition = async () => {
    if (newCondition.trim() === "") return;
    const updated = [...tempData, newCondition.trim()];
    setNewCondition("");
    setAdding(true);
    await handleUpdate(updated);
  };

  const handleRemoveCondition = async (index: number) => {
    const updated = tempData.filter((_, i) => i !== index);
    setRemovingIndex(index);
    await handleUpdate(updated);
  };

  const handleSave = () => {
    // Apply changes to main card only when Done is clicked
    setHealthData(tempData);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    // Discard changes on cancel
    setNewCondition("");
    setModalVisible(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="heart-outline" size={20} color={COLORS.warning} />
        <Text style={styles.cardTitle}>Health Information</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon
            name="pencil"
            size={18}
            color={COLORS.warning}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        {healthData && healthData.length > 0 ? (
          <View style={styles.badgeBox}>
            {healthData.map((cond, index) => (
              <Text key={index} style={styles.badge}>
                {cond}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
            No health conditions added yet.
          </Text>
        )}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Edit Health Information</Text>

              {/* Input for adding condition */}
              <Text style={styles.label}>Conditions</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Add condition"
                  value={newCondition}
                  onChangeText={setNewCondition}
                />
                <TouchableOpacity
                  onPress={handleAddCondition}
                  style={[styles.plusBtn, adding && { opacity: 0.6 }]}
                  disabled={adding}
                >
                  {adding ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Icon name="plus" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Show current conditions in modal */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 12,
                }}
              >
                {tempData?.map((cond, index) => (
                  <View key={index} style={styles.badgeTemp}>
                    <Text style={styles.badgeText}>{cond}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveCondition(index)}
                      disabled={removingIndex === index}
                    >
                      {removingIndex === index ? (
                        <ActivityIndicator
                          size="small"
                          color={COLORS.textPrimary}
                          style={{ marginLeft: 4 }}
                        />
                      ) : (
                        <Icon
                          name="close"
                          size={14}
                          color={COLORS.textPrimary}
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Modal buttons */}
              <View style={styles.modalBtns}>
                <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                  <Text style={styles.btnText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={handleCloseModal}
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
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
    color: COLORS.textPrimary,
    flex: 1,
  },
  editIcon: { marginLeft: "auto" },
  cardContent: { marginTop: 4 },
  badgeBox: {
    backgroundColor: COLORS.gray600,
    borderRadius: 6,
    marginBottom: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  badge: {
    backgroundColor: COLORS.warning,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 6,
    marginVertical: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.gray800,
    margin: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
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
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  plusBtn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeTemp: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: { fontSize: 12, color: COLORS.textPrimary },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btnSave: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  btnText: { color: COLORS.textPrimary, fontWeight: "600", fontSize: 16 },
  btnCancel: {
    backgroundColor: COLORS.gray600,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  btnTextCancel: { color: COLORS.textPrimary, fontWeight: "600", fontSize: 16 },
});
