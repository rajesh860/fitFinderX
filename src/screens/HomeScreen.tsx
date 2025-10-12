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
  PermissionsAndroid,
  Platform,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/Ionicons";
import { useGetAllGymListQuery } from "../services/gym.services";
import { COLORS } from "../theme/colors";
import demoGym from "../assets/bg/demoGym.png"
const HomeScreen = () => {
  const navigation = useNavigation<any>();

  // 🟢 State for search & filters
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // 🟢 Pagination state
  const [page, setPage] = useState(1);
  const [gyms, setGyms] = useState<any[]>([]);

  // 🟢 Nearby location
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 🟢 Query params for API
  const [queryParams, setQueryParams] = useState<any>({
    search: "",
    page: 1,
    limit: 3,
    lat: undefined,
    lng: undefined,
    minPrice: undefined,
    premium: undefined,
  });

  // 🟢 Handle permissions for location
  const getLocation = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Required", "Please enable location to use Nearby filter");
        return false;
      }
    }
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => {
        Alert.alert("Location Error", "Unable to get location");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // 🟢 API call with filters + pagination + location
  const { data: gymList, isLoading, refetch, isFetching } = useGetAllGymListQuery(queryParams, { refetchOnMountOrArgChange: true });
  console.log(gymList, "gymList");


  // 🟢 Handle data update
  useEffect(() => {
    if (gymList?.data) {
      if (page === 1) {
        setGyms(gymList.data);
      } else {
        setGyms(prev => [
          ...prev,
          ...gymList.data.filter(g => !prev.some(p => p._id === g._id))
        ]);
      }
    }
  }, [gymList, page]);

  // 🟢 Refresh state
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch, search, selectedFilter, location]);

  // 🟢 Load more on scroll
  const handleLoadMore = () => {
    if (page < (gymList?.pagination?.totalPages || 1) && !isFetching) {
      setPage(prev => prev + 1);
    }
  };

  // 🟢 Update queryParams when location changes for Nearby filter
  useEffect(() => {
    if (selectedFilter === "Nearby" && location) {
      setQueryParams({
        search,
        page: 1,
        limit: 3,
        lat: location.lat,
        lng: location.lng,
        minPrice: undefined,
        premium: undefined,
      });
    }
  }, [location, selectedFilter, search]);
  console.log(location, "location")
  // 🟢 Update queryParams when search or page changes
  useEffect(() => {
    if (selectedFilter !== "Nearby") {
      setQueryParams(prev => ({
        ...prev,
        search,
        page,
      }));
    }
  }, [search, page, selectedFilter]);
  console.log(selectedFilter, "selectedFilter", queryParams)
  // 🟢 Handle filter change
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setPage(1);

    if (filter === "Nearby") {
      getLocation(); // location will update lat/lng asynchronously
    } else {
      setQueryParams({
        search,
        page: 1,
        limit: 3,
        lat: undefined,
        lng: undefined,
        minPrice: filter === "₹500-1000" ? 1000 : undefined,
        premium: filter === "Premium" ? true : undefined,
      });
    }
  };


  const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      let iconName = "star-outline";
      if (rating >= i) iconName = "star";
      else if (rating >= i - 0.5) iconName = "star-half";
      stars.push(
        <Icon
          key={i}
          name={iconName}
          size={14}
          color={COLORS.primary}
          style={{ marginRight: 2 }}
        />
      );
    }

    return <View style={{ flexDirection: "row", alignItems: "center" }}>{stars}</View>;
  };


  const notificationCount = 12;
  const formatCount = (count: number) => {
    if (count > 99) return "99+";
    if (count > 9) return `${Math.floor(count / 10) * 10}+`;
    return count.toString();
  };

  if (isLoading && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator animating={true} color={COLORS.primary} size="large" />
        <Text style={{ marginTop: 10, color: COLORS.textPrimary }}>Loading gyms...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🏋️ FitFinder</Text>
        <View style={styles.headerIcons}>
          <View style={{ position: "relative", marginRight: 10 }}>
            <Icon name="notifications-outline" size={22} color={COLORS.textPrimary} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{formatCount(notificationCount)}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ScanQRScreen")}>
            <Icon name="qr-code-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main scroll with refresh */}
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
              <Text style={[styles.filterText, selectedFilter === filter && { color: COLORS.textPrimary }]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gym Cards */}
        {gyms?.length ? (
          gyms.map(gym => (
            <View key={gym._id} style={styles.card}>
              <Image
                source={
                  gym?.coverImage
                    ? { uri: gym.coverImage }
                    : demoGym // demoGym can be require('./path/to/image.png')
                }
                style={styles.cardImage}
              />
              <View style={styles.cardBody}>
                <Text style={styles.gymTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">{gym.gymName}</Text>
                <Text style={styles.gymLocation} numberOfLines={1}
                  ellipsizeMode="tail">{gym.address}</Text>
                <Text style={styles.price}>Starting from {gym.fees_monthly}</Text>
                <View style={styles.ratingBadge}>
                  <StarRating rating={gym?.avgRating} />
                  <Text style={styles.ratingText}>{gym?.avgRating}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => navigation.navigate("gymDetail", { id: gym._id })}
              >
                <Text style={styles.viewBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>No gyms found</Text>
        )}

        {/* Loader at bottom when fetching more */}
        {isFetching && page > 1 && (
          <View style={{ padding: 10, alignItems: "center" }}>
            <ActivityIndicator animating={true} color={COLORS.textPrimary} />
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: { fontSize: 18, fontWeight: "bold", color: COLORS.textPrimary },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  notificationText: { color: COLORS.textPrimary, fontSize: 10, fontWeight: "700", textAlign: "center" },
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
  gymTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: COLORS.textPrimary, width: "100%", },
  gymLocation: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  price: {
    fontSize: 13
    ,
    marginTop: 4,
    color: COLORS.primary,
  },

  viewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  viewBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
});


export default HomeScreen;
