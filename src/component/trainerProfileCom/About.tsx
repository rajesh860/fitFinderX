import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { COLORS } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
// import { useUpdateBioMutation } from '../../services/trainer'; // ✅ API import

const About = ({ bio, trigger, trainerId, refetch }) => {
  const [aboutText, setAboutText] = useState(
    ""
  );
  const [editedText, setEditedText] = useState(aboutText);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ Mutation Hook
//   const [updateBio, { isLoading, isSuccess, isError }] = useUpdateBioMutation();
useEffect(() => { 
    setAboutText(bio || 'No Bio Available');
  },[bio]);
  const handleSave = async () => {
    try {
      const newBio = editedText.trim();
      if (!newBio) return;

      // ✅ API Call
      const response = await trigger({trainerId:trainerId, bio: newBio }).unwrap();

      if (response?.success) {
        Toast.show({ type: "success", text1: response?.message, position: "top" });
        setAboutText(newBio);
        if (typeof refetch === 'function') refetch();
      }
      setModalVisible(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to update bio:', error);
    }
  };

  const handleCancel = () => {
    setEditedText(aboutText);
    setModalVisible(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.section}>
      {/* Header with Edit Icon */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>ABOUT ME</Text>
        <IconButton
          icon="pencil"
          iconColor={COLORS.primary}
          size={20}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Body Text */}
      <Text style={styles.sectionBody}>{aboutText}</Text>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            {/* Transparent background clickable to close modal */}
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={handleCancel}
            />

            {/* Modal content */}
            <View style={styles.modalContent}>
              {/* Close Icon */}
              <IconButton
                icon="close"
                iconColor={COLORS.textPrimary}
                size={20}
                onPress={handleCancel}
                style={styles.closeIcon}
              />

              <Text style={styles.modalTitle}>Edit About Me</Text>

              <TextInput
                multiline
                value={editedText}
                onChangeText={setEditedText}
                placeholder="Write something about yourself..."
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />

              <View style={styles.buttonRow}>
                <Button onPress={handleCancel}>Cancel</Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                //   loading={isLoading}
                //   disabled={isLoading}
                  style={styles.saveButton}
                >
                  {false ? 'Saving...' : 'Save'}
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionBody: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    paddingBottom: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 20,
    zIndex: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 11,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.gray900,
    color: COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
});

export default About;
