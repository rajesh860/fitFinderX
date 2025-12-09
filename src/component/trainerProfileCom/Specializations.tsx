import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme/colors';
import Toast from 'react-native-toast-message';

const Specializations = ({ specialization, trainerId, trigger, isLoading, refetch }) => {
  const [tags, setTags] = useState(specialization);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
useEffect(() => {
 setTags(specialization);
}, [specialization
])

  const handleAddTag = () => {
    Keyboard.dismiss();
    const trimmed = newTag.trim();
    if (trimmed.length > 0 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewTag('');
    Keyboard.dismiss();
  };

  // 🔹 When trainer clicks Done → send payload to parent
  const handleSave = async () => {
    try {
    

      // prepare payload
      const body = {
        
        specialization: tags,
      };

      // pass to parent handler (the parent will call API)
     
        const response = await trigger({trainerId,body}).unwrap();
        if(response?.success){
    Toast.show({ type: "success", text1: response?.message, position: "top" });
    setModalVisible(false);
    if (typeof refetch === 'function') refetch();
      }
    } catch (error) {
      console.error('❌ Error sending specialization payload:', error);
    } 
  };

  return (
    <View style={styles.section}>
      {/* Header with Edit Button */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>SPECIALIZATIONS</Text>
        <IconButton
          icon="pencil"
          iconColor={COLORS.primary}
          size={20}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Tags Display */}
      <View style={styles.tagsContainer}>
        {tags?.length > 0 ? (
          tags?.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
            No specializations added
          </Text>
        )}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Close Icon */}
                <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                  <Icon name="close" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Edit Specializations</Text>

                {/* Tag Chips */}
                <ScrollView contentContainerStyle={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.modalTag}>
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                        <Icon
                          name="close-circle"
                          size={16}
                          color={COLORS.error}
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>

                {/* Input to Add Tag */}
                <View style={styles.inputRow}>
                  <TextInput
                    placeholder="Add new tag"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.input}
                    value={newTag}
                    onChangeText={setNewTag}
                    onSubmitEditing={handleAddTag}
                  />
                  <IconButton
                    icon="plus-circle"
                    iconColor={COLORS.success}
                    onPress={handleAddTag}
                  />
                </View>

                {/* Done Button */}
                <Button
                  mode="contained"
                  loading={isLoading}
                  onPress={handleSave}
                  style={styles.doneButton}
                >
                  {isLoading ? 'Saving...' : 'Done'}
                </Button>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.gray400,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 0,
  },
  tag: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    color: COLORS.textPrimary,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 20,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 8,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalTag: {
    backgroundColor: COLORS.gray900,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 4,
    // marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    height: 40,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
  },
});

export default Specializations;
