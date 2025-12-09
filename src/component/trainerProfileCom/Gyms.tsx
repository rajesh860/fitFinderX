import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme/colors';

const Gyms = ({ gyms = [] }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ASSOCIATED GYMS</Text>

      {gyms.length > 0 ? (
        gyms.map((gym, index) => (
          <View key={gym._id || index} style={styles.gymCard}>
            <Icon
              name={index % 2 === 0 ? 'dumbbell' : 'home-group'}
              size={22}
              color={COLORS.primary}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.gymName}>
                {gym.gymName || 'Unnamed Gym'}
              </Text>

              {gym.location?.coordinates ? (
                <Text style={styles.gymSub}>
                  📍 Lat: {gym.location.coordinates[1]?.toFixed(4)} | Lng:{' '}
                  {gym.location.coordinates[0]?.toFixed(4)}
                </Text>
              ) : (
                <Text style={styles.gymSub}>
                  {gym.locationText || 'No location info'}
                </Text>
              )}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No associated gyms found</Text>
      )}
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
    fontWeight: '600',
  },
  gymSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Gyms;
