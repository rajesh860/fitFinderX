import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  Appbar,
  TextInput,
  Card,
  Text,
  Chip,
  IconButton,
  Menu,
  Divider,
} from "react-native-paper";
import { COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import GymDetailsHeader from "../component/appHeader";

export default function TrainerSearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [menuVisible, setMenuVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation()

  const trainers = {
    featured: {
      name: "Sarah Johnson",
      tag: "FEATURED",
      expertise: "Yoga & Mindfulness Expert",
      rating: 4.9,
      experience: "8 years",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    all: [
      {
        name: "Mike Chen",
        tag: "CERTIFIED",
        expertise: "Strength & Conditioning Coach",
        rating: 4.7,
        experience: "6 years",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Emma Rodriguez",
        expertise: "HIIT & Weight Loss Specialist",
        rating: 4.8,
        experience: "4 years",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "David Kim",
        expertise: "CrossFit & Functional Training",
        rating: 4.6,
        experience: "7 years",
        image: "https://randomuser.me/api/portraits/men/71.jpg",
      },
      {
        name: "Lisa Thompson",
        tag: "CERTIFIED",
        expertise: "Pilates & Core Strengthening",
        rating: 4.9,
        experience: "5 years",
        image: "https://randomuser.me/api/portraits/women/64.jpg",
      },
      {
        name: "Alex Martinez",
        expertise: "Boxing & Martial Arts",
        rating: 4.5,
        experience: "3 years",
        image: "https://randomuser.me/api/portraits/men/44.jpg",
      },
      {
        name: "Rachel Green",
        expertise: "Dance Fitness & Cardio",
        rating: 4.8,
        experience: "2 years",
        image: "https://randomuser.me/api/portraits/women/25.jpg",
      },
    ],
  };

  // 🔍 Filtering + Search Logic
  const filteredTrainers = useMemo(() => {
    let data = trainers.all;

    if (filter === "Certified") {
      data = data.filter((t) => t.tag === "CERTIFIED");
    } else if (filter === "Featured") {
      data = [trainers.featured];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.expertise.toLowerCase().includes(q)
      );
    }

    return data;
  }, [searchQuery, filter]);

  const displayedTrainers = showAll
    ? filteredTrainers
    : filteredTrainers.slice(0, 4);

  // 🔄 Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      // Here you can re-fetch trainers from API if needed
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <GymDetailsHeader navigation={navigation} title="Trainers" like={false} onLogout={false} />
      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search trainer by name, skill..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="magnify" />}
          style={styles.searchInput}
          theme={{ roundness: 10 }}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              iconColor="#fff"
              style={styles.filterButton}
              onPress={() => setMenuVisible(true)}
            />
          }
          contentStyle={{ backgroundColor: "#0F152B" }}
        >
          <Menu.Item
            onPress={() => {
              setFilter("All");
              setMenuVisible(false);
            }}
            title="All"
            titleStyle={filter === "All" ? styles.activeMenuItem : styles.menuItem}
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setFilter("Certified");
              setMenuVisible(false);
            }}
            title="Certified"
            titleStyle={
              filter === "Certified" ? styles.activeMenuItem : styles.menuItem
            }
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setFilter("Featured");
              setMenuVisible(false);
            }}
            title="Featured"
            titleStyle={
              filter === "Featured" ? styles.activeMenuItem : styles.menuItem
            }
          />
        </Menu>
      </View>

      {/* Trainers List */}
      <FlatList
        data={displayedTrainers}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          <>
            {filter === "All" && (
              <>
                <Text style={styles.sectionTitle}>Featured Trainers</Text>
                <Card style={[styles.trainerCard, styles.featuredCard]}>
                  <View style={styles.cardRow}>
                    <Image
                      source={{ uri: trainers.featured.image }}
                      style={styles.avatar}
                    />
                    <View style={styles.info}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name}>{trainers.featured.name}</Text>
                        <Chip compact style={styles.featuredChip}>
                          <Text style={styles.featuredChipText}>FEATURED</Text>
                        </Chip>
                      </View>
                      <Text style={styles.expertise}>
                        {trainers.featured.expertise}
                      </Text>
                      <Text style={styles.rating}>
                        ⭐ {trainers.featured.rating}  • {trainers.featured.experience}
                      </Text>
                    </View>
                    <IconButton icon="chevron-right" size={22} iconColor="#fff" />
                  </View>
                </Card>
              </>
            )}

            <View style={styles.allHeader}>
              <Text style={styles.sectionTitle}>All Trainers</Text>
              <TouchableOpacity onPress={() => setShowAll((prev) => !prev)}>
                <Text style={styles.viewGrid}>{showAll ? "View Less" : "View All"}</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Card style={styles.trainerCard} onPress={() => navigation.navigate("trainerDetail")}>
            <View style={styles.cardRow}>
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.tag && (
                    <Chip compact style={styles.certifiedChip}>
                      <Text style={styles.certifiedChipText}>{item.tag}</Text>
                    </Chip>
                  )}
                </View>
                <Text style={styles.expertise}>{item.expertise}</Text>
                <Text style={styles.rating}>
                  ⭐ {item.rating}  •  {item.experience}
                </Text>
              </View>
            </View>
          </Card>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3DB4F8"
            colors={["#3DB4F8"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  searchInput: {
    marginLeft: 6, flex: 1, color: COLORS.textPrimary
  },
  filterButton: {
    backgroundColor: "#1A213C",
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  allHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  viewGrid: {
    color: "#3DB4F8",
    fontWeight: "600",
  },
  trainerCard: {
    backgroundColor: "#0F152B",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  featuredCard: {
    backgroundColor: "#143A2C",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  name: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  expertise: {
    color: "#A5AFC6",
    fontSize: 13,
    marginTop: 2,
  },
  rating: {
    color: "#FFD369",
    fontSize: 13,
    marginTop: 3,
  },
  featuredChip: {
    backgroundColor: "#FFA726",
    height: "auto",
  },
  featuredChipText: {
    fontSize: 12,
  },
  certifiedChip: {
    backgroundColor: "#00796B",
    height: "auto",
  },
  certifiedChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  menuItem: {
    color: "white",
  },
  activeMenuItem: {
    color: "#3DB4F8",
    fontWeight: "700",
  },
});
