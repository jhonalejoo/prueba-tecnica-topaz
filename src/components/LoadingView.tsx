import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type LoadingViewVariant = 'catalog' | 'detail' | 'compact' | 'inline';

interface LoadingViewProps {
  message?: string;
  variant?: LoadingViewVariant;
}

export function LoadingView({
  message = 'Cargando...',
  variant = 'catalog',
}: Readonly<LoadingViewProps>) {
  const isInline = variant === 'inline';

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={[styles.container, isInline && styles.inlineContainer]}
    >
      {variant === 'detail' ? <DetailSkeleton /> : null}
      {variant === 'catalog' ? <CatalogSkeleton /> : null}
      {variant === 'compact' ? <CompactSkeleton /> : null}
      {variant === 'inline' ? <InlineSkeleton /> : null}
      <Text style={[styles.message, isInline && styles.inlineMessage]}>
        {message}
      </Text>
    </View>
  );
}

function CatalogSkeleton() {
  return (
    <View style={styles.catalogSkeleton}>
      <SkeletonBlock style={styles.catalogTitle} />
      <SkeletonBlock style={styles.catalogSubtitle} />
      <SkeletonBlock style={styles.catalogSearch} />
      <View style={styles.catalogChipsRow}>
        <SkeletonBlock style={styles.catalogChip} />
        <SkeletonBlock style={styles.catalogChip} />
        <SkeletonBlock style={styles.catalogChip} />
      </View>
      <SkeletonBlock style={styles.catalogCard} />
      <SkeletonBlock style={styles.catalogCard} />
      <SkeletonBlock style={styles.catalogCard} />
    </View>
  );
}

function DetailSkeleton() {
  return (
    <View style={styles.detailSkeleton}>
      <SkeletonBlock style={styles.detailImage} />
      <View style={styles.detailCard}>
        <SkeletonBlock style={styles.detailTitle} />
        <SkeletonBlock style={styles.detailAction} />
        <SkeletonBlock style={styles.detailMeta} />
        <SkeletonBlock style={styles.detailPrice} />
        <SkeletonBlock style={styles.detailPriceSecondary} />
        <SkeletonBlock style={styles.detailBody} />
        <SkeletonBlock style={styles.detailBodyShort} />
        <View style={styles.detailTagsRow}>
          <SkeletonBlock style={styles.detailTag} />
          <SkeletonBlock style={styles.detailTag} />
          <SkeletonBlock style={styles.detailTag} />
        </View>
      </View>
    </View>
  );
}

function CompactSkeleton() {
  return (
    <View style={styles.compactSkeleton}>
      <SkeletonBlock style={styles.compactLine} />
      <SkeletonBlock style={styles.compactLineSecondary} />
    </View>
  );
}

function InlineSkeleton() {
  return (
    <View style={styles.inlineSkeleton}>
      <SkeletonBlock style={styles.inlinePill} />
      <SkeletonBlock style={styles.inlinePill} />
      <SkeletonBlock style={styles.inlinePill} />
    </View>
  );
}

function SkeletonBlock({
  style,
}: Readonly<{
  style: object;
}>) {
  const pulse = useSharedValue(0.35);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, {
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return <Animated.View style={[styles.block, style, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inlineContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  message: {
    color: '#6b7280',
    fontSize: 15,
    marginTop: 16,
  },
  inlineMessage: {
    marginTop: 10,
  },
  block: {
    backgroundColor: '#eadfcb',
    borderRadius: 18,
  },
  catalogSkeleton: {
    alignSelf: 'stretch',
    gap: 12,
    width: '100%',
  },
  catalogTitle: {
    height: 32,
    width: '58%',
  },
  catalogSubtitle: {
    height: 16,
    width: '92%',
  },
  catalogSearch: {
    borderRadius: 18,
    height: 54,
    width: '100%',
  },
  catalogChipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
    marginTop: 2,
  },
  catalogChip: {
    borderRadius: 999,
    height: 38,
    width: 92,
  },
  catalogCard: {
    borderRadius: 28,
    height: 156,
    width: '100%',
  },
  detailSkeleton: {
    alignSelf: 'stretch',
    width: '100%',
  },
  detailImage: {
    borderRadius: 28,
    height: 320,
    marginBottom: 16,
    width: '100%',
  },
  detailCard: {
    backgroundColor: '#fffdf8',
    borderColor: '#eadfcb',
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  detailTitle: {
    height: 30,
    width: '78%',
  },
  detailAction: {
    borderRadius: 999,
    height: 38,
    width: 132,
  },
  detailMeta: {
    height: 16,
    width: '42%',
  },
  detailPrice: {
    height: 34,
    width: '52%',
  },
  detailPriceSecondary: {
    height: 18,
    width: '38%',
  },
  detailBody: {
    height: 16,
    width: '100%',
  },
  detailBodyShort: {
    height: 16,
    width: '84%',
  },
  detailTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  detailTag: {
    borderRadius: 999,
    height: 30,
    width: 76,
  },
  compactSkeleton: {
    alignSelf: 'stretch',
    gap: 10,
    width: '100%',
  },
  compactLine: {
    borderRadius: 999,
    height: 14,
    width: '74%',
  },
  compactLineSecondary: {
    borderRadius: 999,
    height: 14,
    width: '42%',
  },
  inlineSkeleton: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  inlinePill: {
    borderRadius: 999,
    height: 34,
    width: 88,
  },
});
