import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme/colors';

const Gyms = ({ refetch }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ASSOCIATED GYMS</Text>
      <View style={styles.gymCard}>
        <Icon name="dumbbell" size={20} color={COLORS.primary} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.gymName}>FitLife Gym Downtown</Text>
          <Text style={styles.gymSub}>Premium Location</Text>
        </View>
      </View>
      <View style={styles.gymCard}>
        <Icon name="home-group" size={20} color={COLORS.success} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.gymName}>PowerHouse Fitness</Text>
          <Text style={styles.gymSub}>Strength Training Hub</Text>
        </View>
      </View>
      {/* If parent passed refetch, we don't call it here by default. Use in parent when needed. */}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  gymCard: {
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  gymName: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  gymSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});

export default Gyms;
