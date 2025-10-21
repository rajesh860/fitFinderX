import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Card, Text } from "react-native-paper";

interface GallerySectionProps {
    gallery: string[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Gallery</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {gallery.map((g, idx) => (
                        <Card key={idx} style={styles.galleryCard}>
                            <Image source={{ uri: g }} style={styles.galleryImage} />
                        </Card>
                    ))}
                </ScrollView>
            </Card.Content>
        </Card>
    );
};

export default GallerySection;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#0B1722",
        borderRadius: 12,
        marginBottom: 12,
    },
    sectionTitle: {
        color: "#E6EEF3",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    galleryCard: {
        width: 120,
        height: 80,
        borderRadius: 8,
        overflow: "hidden",
        marginRight: 8,
    },
    galleryImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});