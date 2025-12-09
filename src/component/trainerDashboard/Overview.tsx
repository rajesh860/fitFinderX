import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

const data = [
  { label: 'Total Clients', value: '42', change: '+12%' },
  { label: 'Active Plans', value: '28', change: '+8%' },
  { label: 'Pending Requests', value: '15', change: '5 new', color: COLORS.warning },
  { label: 'This Month', value: '$5.2k', change: '+15%' },
];

const Overview: React.FC = () => (
  <View>
    <Text style={styles.sectionTitle}>Overview</Text>
    <View style={styles.overviewGrid}>
      {data.map((item, i) => (
        <Card key={i} style={styles.card}>
          <Card.Content>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={[styles.cardChange, item.color ? { color: item.color } : {}]}>
              {item.change}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 10 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: COLORS.card, width: '48%', marginBottom: 12, borderRadius: 7 },
  cardLabel: { color: COLORS.textSecondary, fontSize: 13 },
  cardValue: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 4 },
  cardChange: { color: COLORS.success, fontSize: 12, marginTop: 2 },
});

export default Overview;
