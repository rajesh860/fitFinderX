import React, { useState } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { COLORS } from "../../theme/colors";
import ImageViewer from "react-native-image-zoom-viewer";

const GalleryTab = ({ gymData, width }) => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔥 Convert images to zoom-viewer format
  const images = gymData?.data?.images?.map((img) => ({
    url: typeof img === "string" ? img : img.url,
  }));

  return (
    <View style={{ width }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Gym Gallery</Text>

        <View style={styles.galleryContainer}>
          {images?.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.galleryCard}
              onPress={() => {
                setCurrentIndex(idx);
                setVisible(true);
              }}
            >
              <Image source={{ uri: img.url }} style={styles.galleryImg} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 🔥 Fullscreen Zoom Modal */}
      <Modal visible={visible} transparent={true}>
        <ImageViewer
          imageUrls={images}
          index={currentIndex}
          enableSwipeDown
          onSwipeDown={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          saveToLocalByLongPress={false}
        />

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default GalleryTab;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 14,
    color: COLORS.textPrimary,
  },

  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  galleryCard: {
    width: "48%",
    height: 120,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },

  galleryImg: {
    width: "100%",
    height: "100%",
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 25,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    width:35,
    height:35,
    borderRadius: 30,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },

  closeText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});
