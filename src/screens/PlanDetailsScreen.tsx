import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import GymDetailsHeader from '../component/appHeader';
import PlanCard from '../component/planCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePlanDetailQuery } from '../services/userService';
import { Text } from 'react-native-paper';
import { COLORS } from '../theme/colors'; // Agar aap COLORS define kar rahe ho

const PlanDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { planId,isExpired } = route.params as { planId: string,isExpired:string };
console.log(isExpired,"isExpired")
    // Fetch plan detail from API
    const { data, isLoading, isError } = usePlanDetailQuery(planId);
    if (isLoading) return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary || '#ff914d'} />
        </View>
    );

    if (isError || !data?.data) return (
        <View style={styles.loader}>
            <Text style={{color:'#fff'}}>Failed to load plan details.</Text>
        </View>
    );

    const plan = {
        planName: data.data.planName,
        price: data.data.price,
        durationInMonths: data.data.duration,
        features: data.data.features,
        gym: data.data.gym,
        createdAt: data.data.createdAt,
    };

    return (
        <View style={styles.container}>
            <GymDetailsHeader navigation={navigation} title="Gym Plan Detail" like={false} />
            <ScrollView contentContainerStyle={styles.scroll}>
                <PlanCard plan={plan} active={isExpired}/>
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
        paddingBottom: 100,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PlanDetailsScreen;
