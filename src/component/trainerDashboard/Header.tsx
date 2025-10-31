import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.greeting}>Hi Rajesh 👋</Text>
        <Text style={styles.subText}>Ready for today’s training?</Text>
      </View>
      <View style={{ marginLeft: 'auto' }}>
        <Avatar.Icon
          size={30}
          icon="bell-outline"
          color={COLORS.textPrimary}
          style={{ backgroundColor: COLORS.gray800 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', backgroundColor: COLORS.card, alignItems: 'center', marginBottom: 10, paddingVertical: 5 },
  greeting: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  subText: { color: COLORS.textSecondary, fontSize: 11 },
});

export default Header;
