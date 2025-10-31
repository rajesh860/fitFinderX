import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { COLORS } from '../theme/colors';
import Header from '../component/trainerDashboard/Header';
import Overview from '../component/trainerDashboard/Overview';
import QuickActions from '../component/trainerDashboard/QuickActions';
import Sessions from '../component/trainerDashboard/Sessions';
import RecentActivity from '../component/trainerDashboard/RecentActivity';
// re-using Text from child components where needed

const DashboardScreen: React.FC = () => {

  return (
    <>
      <Header />
    <ScrollView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Overview />
      <QuickActions />
      <Sessions />
      <RecentActivity />
      <View style={styles.bottomSpacer} />
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  bottomSpacer: { height: 60 },
});

export default DashboardScreen;
