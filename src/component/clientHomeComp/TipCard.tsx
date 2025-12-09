import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface Props {
  tip?: string;
}

const TipCard: React.FC<Props> = ({ tip = 'Stay hydrated and stretch before workouts.' }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text style={styles.tip}>{tip}</Text>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#12272c', backgroundColor: '#071018' },
  tip: { color: '#fff', fontSize: 14 },
});

export default TipCard;
