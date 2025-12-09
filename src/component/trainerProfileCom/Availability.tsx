import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, IconButton, Button, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Availability = ({ availability, trainerId, trigger, isLoading, refetch }) => {
  const [personalTrainingSlots, setPersonalTrainingSlots] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedSlots, setEditedSlots] = useState([]);
  const [timePickerSlotIndex, setTimePickerSlotIndex] = useState(null);
  const [timePickerMode, setTimePickerMode] = useState('start');

  // Convert backend availability → internal slot structure
  const convertBackendAvailability = (data) => {
    try {
      const slotMap = {};
      data.forEach((item) => {
        const shortDay = item.day.slice(0, 3); // e.g. Monday → Mon
        if (item.personalTraining && item.personalTraining.length > 0) {
          item.personalTraining.forEach((slot) => {
            const key = `${slot.startTime}-${slot.endTime}`;
            if (!slotMap[key]) {
              slotMap[key] = {
                days: [shortDay],
                startTime: convertTimeStringToDate(slot.startTime),
                endTime: convertTimeStringToDate(slot.endTime),
              };
            } else {
              slotMap[key].days.push(shortDay);
            }
          });
        }
      });
      return Object.values(slotMap);
    } catch (e) {
      console.error('Availability parsing error:', e);
      return [];
    }
  };

  const convertTimeStringToDate = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes);
  };

  // Load backend availability
  useEffect(() => {
    if (availability && availability.length > 0) {
      const formatted = convertBackendAvailability(availability);
      if (formatted.length > 0) {
        setPersonalTrainingSlots(formatted);
      }
    }
  }, [availability]);

  // Edit Modal handlers
  const handleEdit = () => {
    setEditedSlots(personalTrainingSlots.map((s) => ({ ...s })));
    setModalVisible(true);
  };

  const toggleDay = (slotIndex, day) => {
    const newSlots = [...editedSlots];
    const slot = newSlots[slotIndex];
    if (slot.days.includes(day)) {
      slot.days = slot.days.filter((d) => d !== day);
    } else {
      slot.days.push(day);
    }
    setEditedSlots(newSlots);
  };

  const showTimePicker = (slotIndex, mode) => {
    setTimePickerSlotIndex(slotIndex);
    setTimePickerMode(mode);
  };

  const onTimeChange = (event, selectedDate) => {
    if (timePickerSlotIndex === null || selectedDate == null) return;
    const newSlots = [...editedSlots];
    if (timePickerMode === 'start') {
      newSlots[timePickerSlotIndex].startTime = selectedDate;
    } else {
      newSlots[timePickerSlotIndex].endTime = selectedDate;
    }
    setEditedSlots(newSlots);
    setTimePickerSlotIndex(null);
  };

  const formatTo24Hr = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Save handler
  const handleSave = async () => {
    try {
      if (!trainerId) {
        Alert.alert('Error', 'Trainer ID not found. Please login again.');
        return;
      }

      // Remove slots that have no days selected
      const slotsWithDays = editedSlots.filter(slot => slot.days.length > 0);

      const formattedSlots = slotsWithDays.map((slot, idx) => ({
        slotNumber: idx + 1,
        days: slot.days.map(d => {
          switch (d) {
            case 'Mon': return 'Monday';
            case 'Tue': return 'Tuesday';
            case 'Wed': return 'Wednesday';
            case 'Thu': return 'Thursday';
            case 'Fri': return 'Friday';
            case 'Sat': return 'Saturday';
            case 'Sun': return 'Sunday';
            default: return d;
          }
        }),
        startTime: formatTo24Hr(slot.startTime),
        endTime: formatTo24Hr(slot.endTime),
      }));

      const body = { slots: formattedSlots };
      const res = await trigger({ trainerId, body }).unwrap();

      if (res.success) {
        setPersonalTrainingSlots(slotsWithDays);
        setModalVisible(false);
        Toast.show({ type: "success", text1: res?.message, position: "top" });
        if (typeof refetch === 'function') refetch();
      } else {
        Alert.alert('Error', res.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Server error while saving availability');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = (hours % 12) === 0 ? 12 : (hours % 12);
    const mStr = minutes.toString().padStart(2, '0');
    return `${h12}:${mStr} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>
          <Icon name="account-outline" size={16} color={COLORS.info} /> Personal Training
        </Text>
        <IconButton icon="pencil" iconColor={COLORS.primary} size={18} onPress={handleEdit} />
      </View>

      {/* Display slots */}
      {isLoading ? (
        <View style={styles.timeCard}>
          {[1, 2, 3].map((_, idx) => (
            <View key={idx} style={styles.skeletonRow} />
          ))}
        </View>
      ) : (
        <View style={styles.timeCard}>
          {personalTrainingSlots.length > 0 ? (
            personalTrainingSlots.map((slot, idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.day}>{slot.days.join(', ')}</Text>
                <Text style={styles.time}>
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
              No availability found
            </Text>
          )}
        </View>
      )}

      {/* GROUP SESSIONS CARDS */}
      {isLoading ? (
        <>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </>
      ) : (
        <>
          <View style={styles.sessionCard}>
            <View>
              <Text style={styles.gymName}>FitLife Gym Downtown</Text>
              <Text style={styles.sessionTime}>6:00 AM - 8:00 AM</Text>
            </View>
            <Text style={styles.sessionDays}>Mon, Wed, Fri</Text>
          </View>
          <View style={styles.sessionCard}>
            <View>
              <Text style={styles.gymName}>PowerHouse Fitness</Text>
              <Text style={styles.sessionTime}>7:00 AM - 9:00 AM</Text>
            </View>
            <Text style={styles.sessionDays}>Tue, Thu, Sat</Text>
          </View>
        </>
      )}

      {/* Modal for editing */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCancel} />
            <View style={styles.modalContent}>
              <IconButton
                icon="close"
                iconColor={COLORS.textPrimary}
                size={20}
                onPress={handleCancel}
                style={styles.closeIcon}
              />
              <Text style={styles.modalTitle}>Edit Personal Training Slots</Text>
              <ScrollView>
                {editedSlots?.map((slot, idx) => (
                  <View key={idx} style={styles.editSlotCard}>
                    <Text style={styles.editSlotLabel}>Slot {idx + 1}</Text>
                    <View style={styles.daysRow}>
                      {dayOptions.map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayOption,
                            slot.days.includes(day) && styles.dayOptionSelected,
                          ]}
                          onPress={() => toggleDay(idx, day)}
                        >
                          <Text
                            style={{
                              color: slot.days.includes(day)
                                ? COLORS.textPrimary
                                : COLORS.textSecondary,
                            }}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.inputRow}>
                      <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => showTimePicker(idx, 'start')}
                      >
                        <Text style={styles.timeInputText}>
                          {formatTime(slot.startTime)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => showTimePicker(idx, 'end')}
                      >
                        <Text style={styles.timeInputText}>
                          {formatTime(slot.endTime)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {timePickerSlotIndex === idx && (
                      <DateTimePicker
                        mode="time"
                        value={
                          timePickerMode === 'start'
                            ? editedSlots[idx].startTime
                            : editedSlots[idx].endTime
                        }
                        is24Hour={false}
                        display="spinner"
                        onChange={onTimeChange}
                      />
                    )}
                  </View>
                ))}
              </ScrollView>

              <View style={styles.buttonRow}>
                <Button onPress={handleCancel}>Cancel</Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.saveButton}
                  loading={isLoading}
                >
                  Save
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
  container: {
    backgroundColor: COLORS.background,
    padding: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  day: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  time: {
    color: COLORS.info,
    fontSize: 13,
  },
  timeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  skeletonRow: {
    height: 20,
    backgroundColor: COLORS.gray900,
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonCard: {
    height: 60,
    backgroundColor: COLORS.gray900,
    marginTop: 8,
    borderRadius: 8,
  },
  sessionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gymName: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '500' },
  sessionTime: { color: COLORS.success, fontSize: 13, marginTop: 2 },
  sessionDays: { color: COLORS.textMuted, fontSize: 12 },
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
    marginBottom: 16,
    textAlign: 'center',
  },
  editSlotCard: {
    marginBottom: 16,
  },
  editSlotLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dayOption: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: COLORS.gray900,
  },
  dayOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    backgroundColor: COLORS.gray900,
  },
  timeInputText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
});

export default Availability;
