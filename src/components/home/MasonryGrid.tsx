import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Magazine } from '@/redux/slices/magazineSlice';

interface MasonryGridProps {
  data: Magazine[];
  columns?: 2 | 3;
  renderItem: (item: Magazine, idx: number) => React.ReactNode;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ data, columns = 2, renderItem }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    cell: {
      width: '48%', // Always 2 columns for 3x2 grid
    },
  });

  // For 3 rows x 2 columns = 6 items max
  const rows: Magazine[][] = [];
  const totalCells = Math.min(data.length, 6);
  const constrained = data.slice(0, totalCells);
  
  // Create 3 rows with 2 columns each
  const actualColumns = columns === 3 ? 2 : columns; // Force 2 columns for 3 "rows"
  for (let i = 0; i < constrained.length; i += actualColumns) {
    rows.push(constrained.slice(i, i + actualColumns));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, i) => (
        <View style={styles.row} key={`row-${i}`}>
          {row.map((item, j) => (
            <View style={styles.cell} key={`cell-${i}-${j}`}>
              {renderItem(item, i * actualColumns + j)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};


