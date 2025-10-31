import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Button, Avatar, Searchbar } from 'react-native-paper';
import { COLORS } from '../theme/colors';
import GymDetailsHeader from '../component/appHeader';
import { useNavigation } from '@react-navigation/native';

interface Client {
  name: string;
  plan: string;
  avatar: string;
}

const clients: Client[] = [
  { name: 'Sarah Johnson', plan: 'Premium Plan', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Michael Chen', plan: 'Basic Plan', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { name: 'David Rodriguez', plan: 'Pro Plan', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Emma Wilson', plan: 'Premium Plan', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'James Thompson', plan: 'Basic Plan', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'Lisa Anderson', plan: 'Starter Plan', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { name: 'Robert Martinez', plan: 'Starter Plan', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

const ClientList: React.FC = () => {
    const navigation  = useNavigation();
  return (
      <>
      <GymDetailsHeader title="Client List" navigation={navigation}/>
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}>
      <Searchbar
        placeholder="Search clients..."
        style={{
            marginBottom: 16,
            backgroundColor: COLORS.card,
            borderRadius: 8,
            elevation: 3,
        }}
        />
      <FlatList
        data={clients}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
            <Card style={{ marginBottom: 16, backgroundColor: COLORS.card, borderRadius: 8, elevation: 3 }}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image size={48} source={{ uri: item.avatar }} />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold' }}>
                  {item.name}
                </Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>{item.plan}</Text>
              </View>
              <Button
                mode="text"
                onPress={() => {}}
                labelStyle={{ color: COLORS.primary }}
                >
                View
              </Button>
            </Card.Content>
          </Card>
        )}
        />
      <Button
        mode="contained"
        onPress={() => {}}
        style={{
            backgroundColor: COLORS.primary,
            marginTop: 16,
        }}
        >
        + Add Client
      </Button>
    </View>
          </>
  );
};

export default ClientList;
