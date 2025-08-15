// app/(app)/reader.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  PanResponder,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import { useTheme } from '@/context/ThemeContext';
import { ScreenWrapper } from '@/components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_ASPECT = 1.414;        // A4 portrait fallback
const PREFETCH_AHEAD = 6;            // prefetch this many ahead of first visible
const INITIAL_RENDER = 6;            // first batch to render
const BATCH_SIZE = 6;                // render-per-batch
const LIST_WINDOW = 9;               // RN keeps ~visible*window items mounted

// Static for now per your request; make dynamic later
const MID = '24';
const TOTAL_PAGES = 40;
const buildUrl = (n: number) =>
  `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/magazines/${MID}/1_Page_${String(n).padStart(2, '0')}.jpg`;

const SCROLLBAR_MIN_THUMB = 36;
const SCROLLBAR_WIDTH = 4;
const SCROLLBAR_RIGHT_INSET = 6;

type Page = { index: number; url: string; aspect: number };

export default function Reader() {
  const { theme } = useTheme();
  const router = useRouter();

  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ready, setReady] = useState(false);

  // aspect ratios per page (so heights are correct and no gaps)
  const aspectMap = useRef<Record<number, number>>({});
  const [tick, setTick] = useState(0); // force re-render after measuring image sizes

  const listRef = useRef<FlatList<Page>>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // prevent screenshots while here
  useEffect(() => {
    let sub: ScreenCapture.Subscription | null = null;
    (async () => {
      await ScreenCapture.preventScreenCaptureAsync();
      sub = ScreenCapture.addScreenshotListener(() => {});
    })();
    return () => {
      sub?.remove?.();
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  // initial list of pages
  const pages: Page[] = useMemo(
    () =>
      Array.from({ length: TOTAL_PAGES }, (_, i) => {
        const idx = i + 1;
        return { index: idx, url: buildUrl(idx), aspect: aspectMap.current[idx] || DEFAULT_ASPECT };
      }),
    [tick]
  );

  // estimate content height from known aspects
  const contentHeight = useMemo(() => {
    const sum = pages.reduce((acc, p) => {
      const a = aspectMap.current[p.index] || p.aspect || DEFAULT_ASPECT;
      return acc + SCREEN_WIDTH * a;
    }, 0);
    const bottomPadding = 32; // match contentContainerStyle
    return sum + bottomPadding;
  }, [pages, tick]);

  // derived scrollbar metrics
  const effectiveViewport = viewportHeight || SCREEN_HEIGHT; // fallback
  const thumbHeight = useMemo(() => {
    if (contentHeight <= 0) return SCROLLBAR_MIN_THUMB;
    const proportional = (effectiveViewport * effectiveViewport) / contentHeight;
    return Math.max(SCROLLBAR_MIN_THUMB, Math.min(proportional, effectiveViewport));
  }, [contentHeight, effectiveViewport]);

  const thumbTop = useMemo(() => {
    if (contentHeight <= effectiveViewport) return 0;
    const maxScroll = contentHeight - effectiveViewport;
    const maxThumbTravel = effectiveViewport - thumbHeight;
    const ratio = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    return ratio * maxThumbTravel;
  }, [scrollY, contentHeight, effectiveViewport, thumbHeight]);

  const panStartTopRef = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panStartTopRef.current = thumbTop;
      },
      onPanResponderMove: (_evt, gesture) => {
        if (contentHeight <= effectiveViewport) return;
        const maxThumbTravel = effectiveViewport - thumbHeight;
        const nextThumbTop = Math.min(Math.max(panStartTopRef.current + gesture.dy, 0), maxThumbTravel);
        const ratio = nextThumbTop / maxThumbTravel;
        const targetOffset = ratio * (contentHeight - effectiveViewport);
        listRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {},
      onPanResponderTerminate: () => {},
    })
  ).current;

  // lightly warm up the first few images for instant paint
  useEffect(() => {
    let alive = true;
    (async () => {
      await Promise.all(
        Array.from({ length: Math.min(TOTAL_PAGES, INITIAL_RENDER) }, (_, i) =>
          Image.prefetch(buildUrl(i + 1))
        )
      );
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // prefetch helper for “next K” images; no chunk/window logic
  const prefetchAhead = useCallback(async (fromIndex: number) => {
    const start = Math.max(fromIndex + 1, 1);
    const end = Math.min(start + PREFETCH_AHEAD - 1, TOTAL_PAGES);
    await Promise.all(
      Array.from({ length: end - start + 1 }, (_, i) => Image.prefetch(buildUrl(start + i)))
    );
  }, []);

  // track current page & prefetch a few ahead; auto-hide controls after scroll starts
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const first = viewableItems?.[0];
    if (!first?.index && first?.index !== 0) return;

    const absolute = Number(first.index) + 1; // FlatList index (0-based) -> page (1-based)
    setCurrentPage(absolute);

    prefetchAhead(absolute);

    if (controlsVisible) setControlsVisible(false);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Page>) => {
      // refine aspect once per image for exact heights (avoid gaps)
      const known = aspectMap.current[item.index];
      const aspect = known || item.aspect || DEFAULT_ASPECT;
      const height = SCREEN_WIDTH * aspect;

      return (
        <View style={{ width: SCREEN_WIDTH, height }}>
          <Image
            source={{ uri: item.url }}
            resizeMode="contain"
            style={{ width: SCREEN_WIDTH, height }}
            onLoad={(e) => {
              if (known) return;
              const w = e?.nativeEvent?.source?.width;
              const h = e?.nativeEvent?.source?.height;
              if (w && h) {
                aspectMap.current[item.index] = h / w;
                // trigger a light re-render so this item snaps to precise height
                setTick((t) => t + 1);
              }
            }}
          />
        </View>
      );
    },
    [SCREEN_WIDTH]
  );

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y);
  }, []);

  if (!ready) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </ScreenWrapper>
    );
  }

  const showScrollbar = contentHeight > effectiveViewport + 1;

  return (
    <ScreenWrapper>
      <StatusBar hidden={!controlsVisible} />

      {/* Minimalist, transparent controls with contrasting border */}
      {controlsVisible && (
        <View style={styles.controlsWrap} pointerEvents="box-none">
          <View
            style={[
              styles.topBar,
              {
                backgroundColor: theme.colors.surface + '99',
                borderColor: theme.colors.border,
              },
            ]}
          >
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.colors.text }]}>Magazine</Text>
            </View>

            <View
              style={[
                styles.pagePill,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={[styles.pagePillText, { color: theme.colors.textInverse }]}>
                {currentPage} / {TOTAL_PAGES}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }} onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}>
        {/* Lazy-loaded continuous list (no WebView, no manual chunking) */}
        <FlatList
          ref={listRef}
          data={pages}
          keyExtractor={(it) => `page-${it.index}`}
          renderItem={renderItem}
          initialNumToRender={INITIAL_RENDER}
          maxToRenderPerBatch={BATCH_SIZE}
          windowSize={LIST_WINDOW}
          removeClippedSubviews
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        />

        {/* Minimalist scrollbar overlay */}
        {showScrollbar && (
          <View style={styles.scrollbarOverlay} pointerEvents="box-none">
            <View style={styles.scrollbarTouchZone} pointerEvents="box-none">
              <View
                style={[
                  styles.scrollbarThumb,
                  {
                    height: thumbHeight,
                    transform: [{ translateY: thumbTop }],
                    backgroundColor: theme.colors.background,
                  },
                ]}
                {...panResponder.panHandlers}
              />
            </View>
          </View>
        )}

        {/* Screen edge border overlay (4px) */}
        <View
          pointerEvents="none"
          style={[styles.screenBorder, { borderColor: theme.colors.border }]}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  controlsWrap: { position: 'absolute', top: 0, left: 0, right: 0 },

  topBar: {
    margin: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: { padding: 6, borderRadius: 10 },

  titleWrap: { flex: 1, alignItems: 'center' },

  title: { fontSize: 16, fontWeight: '600' },

  pagePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },

  pagePillText: { fontSize: 12, fontWeight: '600' },

  scrollbarOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  scrollbarTouchZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: SCROLLBAR_RIGHT_INSET,
    width: 24,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  scrollbarThumb: {
    width: SCROLLBAR_WIDTH,
    borderRadius: SCROLLBAR_WIDTH / 2,
  },
  screenBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 8,
    borderRadius: 0,
  },
});
