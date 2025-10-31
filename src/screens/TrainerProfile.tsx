import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { COLORS } from '../theme/colors';

import Header from '../component/trainerProfileCom/Header';
import Specializations from '../component/trainerProfileCom/Specializations';
import About from '../component/trainerProfileCom/About';
import Gyms from '../component/trainerProfileCom/Gyms';
import Availability from '../component/trainerProfileCom/Availability';
import { useAddAvailabilityMutation, useTrainerProfileQuery } from '../services/trainer';

const TrainerProfile = () => {
     const  { data,isLoading:loading,isError,refetch } = useTrainerProfileQuery();
      const [trigger, {data:updateData, isLoading }] = useAddAvailabilityMutation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
refetch();
    // Simulate API call or data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
console.log("Trainer Profile Data:",data?.data);
const trainerId=data?.data?._id;
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]} // Android color
          progressBackgroundColor={COLORS.cardBackground} // optional
        />
      }
    >
      {/* <GymDetailsHeader title="Profile" /> */}
  <Header trigger={trigger} data={data?.data}  trainerId={trainerId} refetch={refetch} />
  <Specializations isLoading={isLoading} specialization={data?.data?.specialization || []} trigger={trigger} trainerId={trainerId} refetch={refetch} />
  <About bio={data?.data?.bio} trigger={trigger} trainerId={trainerId} refetch={refetch} />
  <Gyms refetch={refetch} />
  <Availability isLoading={isLoading} trigger={trigger} availability={data?.data?.availability} trainerId={trainerId} refetch={refetch} />
  
      {/* <Actions /> */}
    </ScrollView>
  );
};

export default TrainerProfile;
