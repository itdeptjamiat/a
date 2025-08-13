import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMagazineDetail } from '@/redux/actions/magazineActions';
import { selectSelectedMagazine } from '@/redux/selectors/magazineSelectors';

const ReaderScreen: React.FC = () => {
	const { mid } = useLocalSearchParams<{ mid: string }>();
	const router = useRouter();
	const { theme } = useTheme();
	const dispatch = useAppDispatch();
	const selected = useAppSelector(selectSelectedMagazine) as any;

	const [numPages, setNumPages] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		if (mid) dispatch(fetchMagazineDetail(String(mid)));
	}, [dispatch, mid]);

	const handleBack = useCallback(() => router.back(), [router]);

	const styles = StyleSheet.create({
		controlsWrap: {
			position: 'absolute',
			top: theme.spacing.sm,
			left: theme.spacing.sm,
			right: theme.spacing.sm,
			zIndex: 10,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		controlPill: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: theme.spacing.md,
			height: 36,
			borderRadius: 999,
			backgroundColor: 'rgba(0,0,0,0.25)',
			borderWidth: 1,
			borderColor: theme.colors.surface,
		},
		backBtn: {
			width: 36,
			height: 36,
			borderRadius: 999,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'rgba(0,0,0,0.25)',
			borderWidth: 1,
			borderColor: theme.colors.surface,
		},
		controlText: {
			color: theme.colors.textInverse,
			fontSize: theme.typography.fontSize.sm,
			marginLeft: theme.spacing.sm,
		},
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		center: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: theme.spacing.lg,
		},
		placeholder: {
			color: theme.colors.text,
			textAlign: 'center',
		},
	});

	return (
		<ScreenWrapper bottomSafeArea>
			<View style={styles.container}>
				<View style={styles.controlsWrap} pointerEvents="box-none">
					<TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.85}>
						<Ionicons name="chevron-back" size={18} color={theme.colors.textInverse} />
					</TouchableOpacity>
					<View style={styles.controlPill}>
						<Ionicons name="document" size={14} color={theme.colors.textInverse} />
						<Text style={styles.controlText}>{currentPage}/{numPages || '—'}</Text>
					</View>
				</View>

				<View style={styles.center}>
					<Text style={styles.placeholder}>
						Reader is set up. PDF rendering module disabled for now.\n
						Magazine ID: {mid || 'N/A'}
					</Text>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default ReaderScreen;


/*
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const setCurrentPage = () => {
//   return (
//     <View>
//       <Text>setCurrentPage</Text>
//     </View>
//   )
// }

// export default setCurrentPage

// const styles = StyleSheet.create({})
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - type defs provided via local ambient decl
import Pdf from 'react-native-pdf';
import { ScreenWrapper } from '@/components';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMagazineDetail } from '@/redux/actions/magazineActions';
import { selectSelectedMagazine } from '@/redux/selectors/magazineSelectors';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

const ReaderScreen: React.FC = () => {
  const { mid } = useLocalSearchParams<{ mid: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedMagazine) as any;

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [localUri, setLocalUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (mid) dispatch(fetchMagazineDetail(String(mid)));
  }, [dispatch, mid]);

  useEffect(() => {
    const ensureCached = async () => {
      if (!selected?.file) return;
      try {
        const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, selected.file);
        const target = FileSystem.cacheDirectory + `pdf-${hash}.pdf`;
        const info = await FileSystem.getInfoAsync(target);
        if (!info.exists) {
          await FileSystem.downloadAsync(selected.file, target);
        }
        setLocalUri(target);
      } catch {
        // Fallback to remote if caching fails
        setLocalUri(selected.file);
      }
    };
    ensureCached();
  }, [selected?.file]);

  const source = useMemo(() => {
    if (!localUri) return undefined;
    return { uri: localUri, cache: true } as const;
  }, [localUri]);

  const handleBack = useCallback(() => router.back(), [router]);

  const styles = StyleSheet.create({
    controlsWrap: {
      position: 'absolute',
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      right: theme.spacing.sm,
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    controlPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      height: 36,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.25)',
      borderWidth: 1,
      borderColor: theme.colors.surface,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.25)',
      borderWidth: 1,
      borderColor: theme.colors.surface,
    },
    controlText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      marginLeft: theme.spacing.sm,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    pdf: {
      flex: 1,
      width: '100%',
    },
  });

  return (
    <ScreenWrapper bottomSafeArea>
      <View style={styles.container}>
        <View style={styles.controlsWrap} pointerEvents="box-none">
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.85}>
            <Ionicons name="chevron-back" size={18} color={theme.colors.textInverse} />
          </TouchableOpacity>
          <View style={styles.controlPill}>
            <Ionicons name="document" size={14} color={theme.colors.textInverse} />
            <Text style={styles.controlText}>{currentPage}/{numPages || '—'}</Text>
          </View>
        </View>

        {source ? (
          <Pdf
            style={styles.pdf}
            source={source}
            trustAllCerts
            horizontal={false}
            enablePaging={false}
            spacing={0}
            enableAntialiasing
            fitPolicy={2}
            renderActivityIndicator={() => (
              <View style={{ height: 24, width: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.15)' }} />
            )}
            onLoadComplete={(pages: number) => setNumPages(pages)}
            onPageChanged={(page: number) => setCurrentPage(page)}
            onError={() => {}}
          />
        ) : null}
      </View>
    </ScreenWrapper>
  );
};

export default ReaderScreen;



*/