import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../theme/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGymUserProgressQuery } from "../services/userService";

const screenWidth = Dimensions.get("window").width;

// Measurement Card Component
interface MeasurementCardProps {
  date: string;
  isLatest?: boolean;
  weight: string;
  waist: string;
  arm: string;
  thigh: string;
}

const MeasurementCard: React.FC<MeasurementCardProps> = ({
  date,
  isLatest = false,
  weight,
  waist,
  arm,
  thigh,
}) => (
  <View style={measurementStyles.card}>
    <View style={measurementStyles.header}>
      <Icon name="calendar-range" size={20} color={COLORS.primary} />
      <Text style={measurementStyles.dateText}>{date}</Text>
      {isLatest && (
        <View style={measurementStyles.latestTag}>
          <Text style={measurementStyles.latestText}>Latest</Text>
        </View>
      )}
    </View>
    <View style={measurementStyles.details}>
      <View style={measurementStyles.detailItem}>
        <Icon name="weight-kilogram" size={16} color={COLORS.textSecondary} style={measurementStyles.icon} />
        <Text style={{ color: COLORS.textSecondary, fontWeight: 'bold' }}>
          Weight: <Text style={measurementStyles.valueText}>{weight}</Text>
        </Text>
      </View>
      <View style={measurementStyles.detailItem}>
        <Icon name="arm-flex" size={16} color={COLORS.textSecondary} style={measurementStyles.icon} />
        <Text style={{ color: COLORS.textSecondary, fontWeight: 'bold' }}>
          Arm: <Text style={measurementStyles.valueText}>{arm}</Text>
        </Text>
      </View>
    </View>
    <View style={measurementStyles.details}>
      <View style={measurementStyles.detailItem}>
        <Icon name="tape-measure" size={16} color={COLORS.textSecondary} style={measurementStyles.icon} />
        <Text style={{ color: COLORS.textSecondary, fontWeight: 'bold' }}>
          Waist: <Text style={measurementStyles.valueText}>{waist}</Text>
        </Text>
      </View>
      <View style={measurementStyles.detailItem}>
        <Icon name="foot-print" size={16} color={COLORS.textSecondary} style={measurementStyles.icon} />
        <Text style={{ color: COLORS.textSecondary, fontWeight: 'bold' }}>
          Thigh: <Text style={measurementStyles.valueText}>{thigh}</Text>
        </Text>
      </View>
    </View>
  </View>
);

const ProgressDetailsScreen = () => {
  const navigation:any = useNavigation();
  const route = useRoute();
  const { gymId, memberShip } = route.params as { gymId: string; memberShip: any };
  const { data: progress } = useGymUserProgressQuery(gymId);

  // Safe history data and current
  const history = progress?.data?.history || [];
  const current = progress?.data?.current;

  // Chart labels and data
  const chartLabels = [
    ...history.map((h:any) => {
      const d = new Date(h.updatedAt);
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
    }),
    'Current',
  ];

  const chartDataValues = [
    ...history.map((h:any) => Number(h.weight) || 0),
    Number(current?.weight) || 0,
  ];

  const progressData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues,
        color: () => COLORS.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Progress Details</Text>
          <Text style={styles.headerSubtitle}>
            {progress?.data?.gym?.gymName || 'Gym'} • Last Updates
          </Text>
        </View>
        <TouchableOpacity>
          <Icon name="dots-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Weight Progress Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Weight Progress</Text>
          <Text style={styles.cardSubtitle}>Tracking over time</Text>
          <LineChart
            data={progressData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: COLORS.gray700,
              backgroundGradientFrom: COLORS.gray700,
              backgroundGradientTo: COLORS.gray700,
              decimalPlaces: 0,
              color: () => COLORS.primaryLight,
              labelColor: () => COLORS.textPrimary,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: COLORS.textPrimary,
              },
            }}
            bezier
            style={{ ...styles.chart, marginLeft: -35 }}
          />
        </Card>

        {/* Measurement History Section */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Measurement History</Text>
          <Text style={styles.cardSubtitle}>Recent body measurements</Text>

          {/* Current / latest */}
          {current && (
            <MeasurementCard
              date={new Date(current.updatedAt).toLocaleDateString()}
              isLatest
              weight={`${current.weight}kg`}
              waist={`${current.waist}cm`}
              arm={`${current.arm}cm`}
              thigh={`${current.thigh}cm`}
            />
          )}

          {/* Previous history */}
          {history.map((h:any, idx:number) => (
            <MeasurementCard
              key={idx}
              date={new Date(h.updatedAt).toLocaleDateString()}
              weight={`${Number(h.weight)||0}kg`}
              waist={`${Number(h.waist)||0}cm`}
              arm={`${Number(h.arm)||0}cm`}
              thigh={`${Number(h.thigh)||0}cm`}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default ProgressDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray800,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray700,
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.textPrimary
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
  },
  historySection: {
    marginTop: 10,
    paddingBottom: 35
  },
});

const measurementStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: COLORS.textPrimary,
  },
  latestTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  latestText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  valueText: {
    color: COLORS.textMuted,
  },
  icon: {
    marginRight: 6,
  },
});
