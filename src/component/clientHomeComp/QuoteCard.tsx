import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme/colors";

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
    outputRange: [COLORS.primaryDark, COLORS.primary],
  });

  return (
    <Animated.View style={[styles.card, { borderColor: animatedBorderColor }]}>
      <Card style={styles.innerCard}>
        <Card.Content>
          <View style={styles.quoteBox}>
            <View style={styles.iconContainer}>
              <Icon name="flash" size={20} color={COLORS.primary} />
            </View>
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
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 2,
  },
  innerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden",
  },
  quoteBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    backgroundColor: COLORS.gray700,
    padding: 8,
    borderRadius: 10,
  },
  quoteText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    lineHeight: 22,
  },
});
