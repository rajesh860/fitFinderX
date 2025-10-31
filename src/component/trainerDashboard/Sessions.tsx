import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

const sessions = [
  { name: 'Sarah Johnson', type: 'Strength Training', time: '9:00 AM', duration: '60 min', img: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Mike Chen', type: 'Cardio & HIIT', time: '11:30 AM', duration: '45 min', img: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Emma Wilson', type: 'Yoga & Flexibility', time: '2:00 PM', duration: '90 min', img: 'https://i.pravatar.cc/150?img=4' },
];

const Sessions: React.FC = () => (
  <View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Today’s Sessions</Text>
      <Text style={styles.viewAll}>View All</Text>
    </View>
    {sessions.map((session, i) => (
      <Card key={i} style={styles.sessionCard}>
        <Card.Content style={styles.sessionRow}>
          <Avatar.Image size={40} source={{ uri: session.img }} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.sessionName}>{session.name}</Text>
            <Text style={styles.sessionType}>{session.type}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.sessionTime}>{session.time}</Text>
            <Text style={styles.sessionDuration}>{session.duration}</Text>
          </View>
        </Card.Content>
      </Card>
    ))}
  </View>
);

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 10 },
  viewAll: { color: COLORS.primary, fontSize: 13 },
  sessionCard: { backgroundColor: COLORS.card, marginTop: 10, borderRadius: 12 },
  sessionRow: { flexDirection: 'row', alignItems: 'center' },
  sessionName: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 15 },
  sessionType: { color: COLORS.textSecondary, fontSize: 13 },
  sessionTime: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' },
  sessionDuration: { color: COLORS.textSecondary, fontSize: 12 },
});

export default Sessions;
