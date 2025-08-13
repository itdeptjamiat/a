import React from "react";
import { View, StyleSheet, ViewStyle, ScrollView } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

interface ContentCarouselProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  containerStyle?: ViewStyle;
  itemWidth?: number;
}

export const ContentCarousel = <T,>({
  data,
  renderItem,
  containerStyle,
  itemWidth,
}: ContentCarouselProps<T>) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      paddingRight: theme.spacing.md,
    },
    itemWrapper: {
      marginRight: theme.spacing.xs,

    },
  });

  return (
    <Animated.View entering={FadeInUp.delay(100)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.container, containerStyle]}
      >
        {data.slice(0, 12).map((item, idx) => (
          <View key={String(idx)} style={styles.itemWrapper}>
            {renderItem(item, idx)}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};
