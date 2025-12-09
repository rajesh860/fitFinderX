import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const QuoteCard = ({ text }) => {
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [borderAnim]);

  // border color pulse between 2 shades
  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1e3a3a", "#2afadf"], // change colors if you like
  });

  return (
    <Animated.View style={[styles.card, { borderColor: animatedBorderColor }]}>
      <Card style={styles.innerCard}>
        <Card.Content>
          <View style={styles.quoteBox}>
            <Icon name="flash" size={18} color="#FFD166" />
            <Text style={styles.quoteText}>{text}</Text>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

export default QuoteCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1.5,
  },
  innerCard: {
    backgroundColor: "#081018",
    borderRadius: 12,
    overflow: "hidden",
  },
  quoteBox: {
    backgroundColor: "#081018",
    borderRadius: 10,
    padding: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  quoteText: {
    color: "#fff",
    fontSize: 15,
    width: "85%",
  },
});
