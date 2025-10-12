import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme/colors";

export default function FitnessGoalsCard({ goalsData, setGoalsData, userData, updateProfile }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, setTempData] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Load existing data into modal
  useEffect(() => {
    if (goalsData) setTempData(goalsData);
  }, [goalsData]);

  // Add goal
  const handleAddGoal = () => {
    if (newGoal.trim() === "") return;
    if (tempData.length >= 3) {
      Alert.alert("Limit reached", "You can add only up to 3 goals.");
      return;
    }
    setAdding(true);
    const updated = [...tempData, newGoal.trim()];
    setTempData(updated);
    setNewGoal("");
    setTimeout(() => setAdding(false), 500); // simulate spinner
  };

  // Remove goal
  const handleRemoveGoal = (index: number) => {
    setRemovingIndex(index);
    const updated = tempData.filter((_, i) => i !== index);
    setTempData(updated);
    setTimeout(() => setRemovingIndex(null), 500); // simulate spinner
  };

  // Save
  const handleSave = () => {
    setSaving(true);
    updateProfile({
      body: { fitness_goals: tempData },
      userId: userData?._id,
    });
    setGoalsData(tempData);
    setSaving(false);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setNewGoal(""); // reset input
    setModalVisible(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="target" size={20} color={COLORS.success} />
        <Text style={styles.cardTitle}>Fitness Goals</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="pencil" size={18} color={COLORS.success} style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        {goalsData && goalsData?.length > 0 ? (
          <View style={styles.badgeBox}>
            {goalsData.map((goal, index) => (
              <Text key={index} style={styles.badge}>
                {goal}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>No goals added yet.</Text>
        )}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Edit Fitness Goals</Text>

              {/* Input */}
              <Text style={styles.label}>Goals</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Add goal"
                  value={newGoal}
                  onChangeText={setNewGoal}
                />
                <TouchableOpacity
                  onPress={handleAddGoal}
                  style={[styles.plusBtn, adding && { opacity: 0.6 }]}
                  disabled={adding}
                >
                  {adding ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="plus" size={20} color="#fff" />}
                </TouchableOpacity>
              </View>

              {/* Display goals with remove option */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
                {tempData?.map((goal, index) => (
                  <View key={index} style={styles.badgeTemp}>
                    <Text style={styles.badgeText}>{goal}</Text>
                    <TouchableOpacity onPress={() => handleRemoveGoal(index)} disabled={removingIndex === index}>
                      {removingIndex === index ? (
                        <ActivityIndicator size="small" color={COLORS.textPrimary} style={{ marginLeft: 4 }} />
                      ) : (
                        <Icon name="close" size={14} color={COLORS.textPrimary} style={{ marginLeft: 4 }} />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={[styles.btnSave, (saving || newGoal.trim() !== "") && { opacity: 0.6 }]}
                  onPress={handleSave}
                  disabled={saving || newGoal.trim() !== ""}
                >
                  {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.btnText}>Save</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancel} onPress={handleCloseModal} disabled={saving}>
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginLeft: 6, color: COLORS.textPrimary, flex: 1 },
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
    backgroundColor: COLORS.success,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 6,
    marginVertical: 2,
  },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center"
  },
  modalContainer: {
    backgroundColor: COLORS.gray800,
    margin: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
  label: {
    fontSize: 14, marginTop: 10, color: COLORS.textPrimary
  },
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
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: { fontSize: 12, color: COLORS.textPrimary },

  modalBtns: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
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
