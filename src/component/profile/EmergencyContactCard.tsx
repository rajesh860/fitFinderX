// EmergencyContactCard.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function EmergencyContactCard({ contact, setContact }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editContact, setEditContact] = useState(contact);

  const handleSave = () => {
    setContact(editContact);
    setModalVisible(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="account-heart-outline" size={20} color="#6C63FF" />
        <Text style={styles.cardTitle}>Emergency Contact</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="pencil" size={18} color="#6C63FF" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.boldText}>{contact.name}</Text>
            <Text style={styles.subText}>{contact.relation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.infoText}>{contact.phone}</Text>
            <TouchableOpacity onPress={() => console.log("Call:", contact.phone)}>
              <Icon name="phone" size={20} color="green" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Emergency Contact</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editContact.name}
              onChangeText={(text) => setEditContact({ ...editContact, name: text })}
            />

            <Text style={styles.label}>Relation</Text>
            <TextInput
              style={styles.input}
              value={editContact.relation}
              onChangeText={(text) => setEditContact({ ...editContact, relation: text })}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editContact.phone}
              onChangeText={(text) => setEditContact({ ...editContact, phone: text })}
              keyboardType="phone-pad"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
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
  cardTitle: { fontSize: 14, fontWeight: "600", marginLeft: 6, color: "#000", flex: 1 },
  editIcon: { marginLeft: "auto" },
  cardContent: { marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  boldText: { fontSize: 13, fontWeight: "600", color: "#000" },
  subText: { fontSize: 12, color: "#555", marginTop: 2 },
  infoText: { fontSize: 13, color: "#444", marginLeft: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" },
  modalContainer: { backgroundColor: "#fff", margin: 20, borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 13, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginTop: 4 },
  modalBtns: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  btnSave: { backgroundColor: "#6C63FF", padding: 10, borderRadius: 8, marginLeft: 10 },
  btnText: { color: "#fff", fontWeight: "600" },
  btnCancel: { backgroundColor: "#f3f3f3", padding: 10, borderRadius: 8 },
  btnCancelText: { color: "#333", fontWeight: "600" },
});
