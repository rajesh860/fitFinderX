import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

const Actions = ({ onEditPress, refetch }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button mode="contained" onPress={() => { if (typeof onEditPress === 'function') onEditPress(); if (typeof refetch === 'function') refetch(); }} style={styles.editButton} labelStyle={{ color: COLORS.buttonText }}>
        Edit Profile
      </Button>
      <Button mode="outlined" onPress={() => {}} textColor={COLORS.textPrimary} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    marginBottom: 10,
    borderRadius: 6,
  },
  logoutButton: {
    borderColor: COLORS.gray700,
    borderWidth: 1,
    borderRadius: 6,
  },
});

export default Actions;
