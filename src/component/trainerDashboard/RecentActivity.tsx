import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

const activities = [
  { icon: 'check', color: COLORS.success, text: 'Session completed with John Doe', time: '2 hours ago' },
  { icon: 'account-plus', color: COLORS.primary, text: 'New client registration: Lisa Park', time: '4 hours ago' },
  { icon: 'calendar-edit', color: COLORS.warning, text: 'Session rescheduled by Alex Turner', time: '6 hours ago' },
];

const RecentActivity: React.FC = () => (
  <View>
    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Recent Activity</Text>
    {activities.map((activity, i) => (
      <Card key={i} style={styles.activityCard}>
        <Card.Content style={styles.activityRow}>
          <Avatar.Icon size={30} icon={activity.icon as any} color={activity.color} style={{ backgroundColor: 'transparent' }} />
          <Text style={styles.activityText}>{activity.text}</Text>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </Card.Content>
      </Card>
    ))}
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 10 },
  activityCard: { backgroundColor: COLORS.card, borderRadius: 12, marginTop: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center' },
  activityText: { flex: 1, color: COLORS.textPrimary, fontSize: 14, marginLeft: 8 },
  activityTime: { color: COLORS.textSecondary, fontSize: 12 },
});

export default RecentActivity;
