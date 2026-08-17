import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32;

export function ProductImageCarousel({
  images,
}: Readonly<{ images: string[] }>) {
  const scrollX = useSharedValue(0);
  const carouselImages = images.length > 0 ? images : [''];

  const onScroll = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View>
      <Animated.FlatList
        data={carouselImages}
        horizontal
        keyExtractor={(item, index) => `${item}-${index}`}
        onScroll={onScroll}
        pagingEnabled
        renderItem={({ item }) => (
          <FastImage
            source={{
              uri: item,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.image}
          />
        )}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.dotsRow}>
        {carouselImages.map((_, index) => (
          <CarouselDot index={index} key={`dot-${index}`} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
}

function CarouselDot({
  index,
  scrollX,
}: Readonly<{ index: number; scrollX: Animated.SharedValue<number> }>) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CAROUSEL_WIDTH,
      index * CAROUSEL_WIDTH,
      (index + 1) * CAROUSEL_WIDTH,
    ];

    return {
      opacity: interpolate(scrollX.value, inputRange, [0.35, 1, 0.35]),
      transform: [
        {
          scaleX: interpolate(scrollX.value, inputRange, [1, 1.8, 1]),
        },
      ],
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 28,
    height: 320,
    marginBottom: 16,
    width: CAROUSEL_WIDTH,
  },
  dotsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: -4,
  },
  dot: {
    backgroundColor: '#b45309',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
});
