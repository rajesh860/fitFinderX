import { useNavigation } from "@react-navigation/native";
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/Ionicons";
import { useGetAllGymListQuery } from "../services/gym.services";
import { COLORS } from "../theme/colors";
import demoGym from "../assets/bg/demoGym.png";
import GymDetailsHeader from "../component/appHeader";
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

let searchTimeout: NodeJS.Timeout;

const GymsScreen = () => {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [gyms, setGyms] = useState<any[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [queryParams, setQueryParams] = useState<any>({
    page: 1,
    limit: 3,
    lat: undefined,
    lng: undefined,
    minPrice: undefined,
    premium: undefined,
    search: undefined,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Location Permission
  const requestLocationPermission = async (): Promise<boolean> => {
    let result;
    if (Platform.OS === 'ios') {
      result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    if (result === RESULTS.GRANTED) return true;

    Alert.alert(
      'Permission Required',
      'Please enable location to use Nearby filter'
    );
    return false;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
        setQueryParams(prev => ({
          ...prev,
          page: 1,
          lat: coords.lat,
          lng: coords.lng,
        }));
      },
      error => {
        console.log("Geolocation error:", error);
        Alert.alert("Location Error", "Unable to get your location.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Fetch gyms
  const { data: gymList, isLoading, refetch, isFetching } = useGetAllGymListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  // Update gyms
  useEffect(() => {
    if (gymList?.data) {
      if (page === 1) setGyms(gymList.data);
      else setGyms(prev => [...prev, ...gymList.data.filter(g => !prev.some(p => p._id === g._id))]);
    }
  }, [gymList, page]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Pagination
  const handleLoadMore = () => {
    if (page < (gymList?.pagination?.totalPages || 1) && !isFetching) setPage(prev => prev + 1);
  };

  // Filter change
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setPage(1);

    if (filter === "Nearby") {
      getLocation();
      setQueryParams(prev => ({
        ...prev,
        page: 1,
        limit: 3,
        minPrice: undefined,
        premium: undefined,
      }));
    } else {
      setQueryParams({
        search: search || undefined,
        page: 1,
        limit: 3,
        lat: undefined,
        lng: undefined,
        minPrice: filter === "₹500-1000" ? 500 : undefined,
        premium: filter === "Premium" ? true : undefined,
      });
    }
  };

  // Debounce search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setPage(1);
      setQueryParams(prev => ({ ...prev, search: search || undefined }));
    }, 500);
  }, [search]);

  const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      let iconName = "star-outline";
      if (rating >= i) iconName = "star";
      else if (rating >= i - 0.5) iconName = "star-half";
      stars.push(<Icon key={i} name={iconName} size={14} color={COLORS.primary} style={{ marginRight: 2 }} />);
    }
    return <View style={{ flexDirection: "row", alignItems: "center" }}>{stars}</View>;
  };

  return (
    <>
      <GymDetailsHeader title="Gyms" backArrow={false} />

      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        onMomentumScrollEnd={handleLoadMore}
      >
        {/* Search */}
        <View style={styles.searchBox}>
          <Icon name="search-outline" size={18} color={COLORS.textPrimary} />
          <TextInput
            placeholder="Search gyms near you..."
            style={styles.input}
            value={search}
            placeholderTextColor={COLORS.textSecondary}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {["All", "Nearby", "₹500-1000", "Premium"].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterBtn, selectedFilter === filter && { backgroundColor: COLORS.primary }]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && { color: COLORS.textPrimary }]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gym List / Loader */}
        <View style={{ minHeight: 150 }}>
          {(isLoading || isFetching) && page === 1 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : gyms.length ? (
            gyms.map(gym => (
              <View key={gym._id} style={styles.card}>
                <Image source={gym?.coverImage ? { uri: gym.coverImage } : demoGym} style={styles.cardImage} />
                <View style={styles.cardBody}>
                  <Text style={styles.gymTitle} numberOfLines={1}>{gym.gymName}</Text>
                  <Text style={styles.gymLocation} numberOfLines={1}>{gym.address}</Text>
                  <Text style={styles.price}>Starting from {gym.fees_monthly}</Text>
                  <View style={styles.ratingBadge}>
                    <StarRating rating={gym?.avgRating} />
                    <Text style={styles.ratingText}>{gym?.avgRating}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("gymDetail", { id: gym._id })}>
                  <Text style={styles.viewBtnText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>No gyms found</Text>
          )}

          {/* Loader at bottom for pagination */}
          {isFetching && page > 1 && (
            <View style={{ padding: 10, alignItems: "center" }}>
              <ActivityIndicator animating={true} color={COLORS.textPrimary} />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.gray700, padding: 2, paddingHorizontal: 10, borderRadius: 18, marginBottom: 12, overflow: "hidden" },
  input: { marginLeft: 6, flex: 1, color: COLORS.textPrimary },
  filterRow: { flexDirection: "row", marginBottom: 12 },
  filterBtn: { backgroundColor: COLORS.gray700, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, flexDirection: "row", alignItems: "center", marginRight: 10 },
  filterText: { marginLeft: 4, color: COLORS.textPrimary },
  card: { backgroundColor: COLORS.gray700, padding: 12, borderRadius: 12, marginBottom: 16, elevation: 2 },
  cardImage: { height: 120, borderRadius: 10, width: "100%" },
  cardBody: { position: "relative" },
  ratingBadge: { position: "absolute", bottom: 0, right: 10, flexDirection: "row", alignItems: "center" },
  ratingText: { color: COLORS.textPrimary, marginLeft: 4, fontSize: 12 },
  gymTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: COLORS.textPrimary, width: "100%" },
  gymLocation: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  price: { fontSize: 13, marginTop: 4, color: COLORS.primary },
  viewBtn: { backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  viewBtnText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: "600" },
});

export default GymsScreen;
