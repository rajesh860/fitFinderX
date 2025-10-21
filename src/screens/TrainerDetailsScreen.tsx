import * as React from "react";
import { View, ScrollView, Share, Linking } from "react-native";
import { Appbar, Button, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

// Importing components from the correct paths
import HeaderSection from "../template/trainerDetails/HeaderSection";
import AboutSection from "../template/trainerDetails/AboutSection";
import ExpertiseSection from "../template/trainerDetails/ExpertiseSection";
import AvailabilitySection from "../template/trainerDetails/AvailabilitySection";
import SuccessStoriesSection from "../template/trainerDetails/SuccessStoriesSection";
import ReviewsSection from "../template/trainerDetails/ReviewsSection";
import GallerySection from "../template/trainerDetails/GallerySection";
import { COLORS } from "../theme/colors";
import GymDetailsHeader from "../component/appHeader";

export default function TrainerDetailsScreen() {
    const navigation = useNavigation<any>();
    const [isFollowing, setIsFollowing] = React.useState(false);
    const [selectedDay, setSelectedDay] = React.useState<string | null>(null);

    const trainer = {
        name: "Marcus Rodriguez",
        title: "Certified Personal Trainer",
        rating: 4.9,
        reviews: 127,
        about:
            "Passionate fitness coach with 8+ years of experience helping clients achieve their fitness goals. Specialized in strength training, weight loss, and functional fitness.",
        badges: ["NASM Certified", "Nutrition Specialist", "CrossFit Level 2"],
        expertise: [
            "Weight Loss",
            "Strength Training",
            "HIIT",
            "Functional Fitness",
            "Sports Conditioning",
        ],
        yearsExperience: 8,
        clientsTrained: 200,
        availabilityNext: "Tomorrow, 6:00 AM",
        success: {
            sessions: "1,250+",
            successRate: "95%",
            transformations: "50+",
        },
    };

    const reviews = [
        {
            id: "r1",
            name: "Sarah Johnson",
            text: "Amazing trainer! Lost 15 lbs in 2 months with Marcus's guidance. Highly recommend!",
            time: "2 days ago",
            rating: 5,
        },
        {
            id: "r2",
            name: "Mike Chen",
            text: "Professional and motivating. Great workout plans tailored to my goals.",
            time: "1 week ago",
            rating: 5,
        },
    ];

    const gallery = [
        "https://placehold.co/300x200?text=Gym+1",
        "https://placehold.co/300x200?text=Gym+2",
        "https://placehold.co/300x200?text=Gym+3",
        "https://placehold.co/300x200?text=Gym+4",
    ];

    const handleFollow = () => setIsFollowing(!isFollowing);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${trainer.name}, a certified fitness trainer!`,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleMessage = () => {
        navigation.navigate("ChatScreen", { trainer });
    };

    const handleBook = () => {
        navigation.navigate("BookingScreen", { trainer });
    };

    const handleCall = () => {
        Linking.openURL(`tel:9876543210`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
           <GymDetailsHeader title="Trainer Detail"/>

            {/* Scroll content */}
            <ScrollView contentContainerStyle={{ padding: 7 }}>
                <HeaderSection
                    trainer={trainer}
                    isFollowing={isFollowing}
                    handleFollow={handleFollow}
                    handleMessage={handleMessage}
                />
                <AboutSection trainer={trainer} />
                <ExpertiseSection trainer={trainer} />
                {/* <AvailabilitySection
                    trainer={trainer}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    handleBook={handleBook}
                /> */}
                <SuccessStoriesSection trainer={trainer} />
                <ReviewsSection reviews={reviews} />
                <GallerySection gallery={gallery} />
                <View style={{ height: 96 }} />
            </ScrollView>

            {/* Bottom action bar */}
            <Surface style={{ padding: 16, flexDirection: "row", justifyContent: "space-between" }}>
                <Button
                    icon="message"
                    mode="outlined"
                    onPress={handleMessage}
                    style={{ flex: 1, marginRight: 8 }}
                >
                    Message
                </Button>
                <Button
                    icon="phone"
                    mode="outlined"
                    onPress={handleCall}
                    style={{ flex: 1, marginRight: 8 }}
                >
                    Call
                </Button>
                <Button
                    mode="contained"
                    onPress={handleBook}
                    style={{ flex: 1 }}
                >
                    Book Session
                </Button>
            </Surface>
        </View>
    );
}
