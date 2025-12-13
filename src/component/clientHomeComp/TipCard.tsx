import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme/colors';

interface Props {
  tip?: string;
}

const TipCard: React.FC<Props> = ({ tip = 'Stay hydrated and stretch before workouts.' }) => (
  <Card style={styles.card}>
    <Card.Content>
      <View style={styles.tipContainer}>
        <View style={styles.iconWrapper}>
          <Icon name="lightbulb-on" size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { 
    borderRadius: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    backgroundColor: COLORS.card,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    backgroundColor: COLORS.gray700,
    padding: 8,
    borderRadius: 10,
  },
  tip: { 
    color: COLORS.textPrimary, 
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default TipCard;
