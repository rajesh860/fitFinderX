import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import GymDetailsHeader from '../component/appHeader';
import PlanCard from '../component/planCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGymJoinMutation } from '../services/userService';

const PlanDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { plans, memberId } = route.params as { plans: any; memberId: string };
    console.log(plans, "plan details route");
    console.log(memberId, "memberId details route");


    const [trigger, { data, isLoading, error }] = useGymJoinMutation();

    const handleJoinNow = () => {
        const payload = {
            body: {
                planId: plans.planId,
            },
            id: memberId,
        }
        console.log(payload, "join now payload");
        trigger(payload);
    };

    return (
        <View style={styles.container}>
            <GymDetailsHeader navigation={navigation} title="Gym Plan Detail" like={true} />

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scroll}>
                <PlanCard plan={plans} /> {/* Pass plan data to PlanCard */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scroll: {
        padding: 16,
        paddingBottom: 100, // leave space for button
    },
});

export default PlanDetailsScreen;
