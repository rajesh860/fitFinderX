import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLORS } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

const QuickActions: React.FC = () => {
  
  const navigation = useNavigation()
  return(
    <View>
    <Text style={styles.sectionTitle}>Quick Actions</Text>
    <View style={styles.actionGrid}>
      <Button mode="contained" style={[styles.actionBtn, { backgroundColor: COLORS.primary }]} labelStyle={{ color: COLORS.buttonText }} icon="plus" onPress={()=>navigation.navigate("addPlanTrainer")}>Add Plan</Button>
      <Button mode="contained" style={[styles.actionBtn, { backgroundColor: COLORS.gray800 }]} labelStyle={{ color: COLORS.textPrimary }} icon="eye">View Requests</Button>
      <Button mode="contained" style={[styles.actionBtn, { backgroundColor: COLORS.gray800 }]} labelStyle={{ color: COLORS.textPrimary }} icon="calendar">Schedule Session</Button>
      <Button mode="contained" style={[styles.actionBtn, { backgroundColor: COLORS.gray800 }]} labelStyle={{ color: COLORS.textPrimary }} icon="chart-bar">Progress</Button>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  sectionTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 0 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 6 },
  actionBtn: { width: '48%', borderRadius: 10, marginVertical: 6 },
});

export default QuickActions;
