import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
};

const StatsCard = ({
  title,
  value,
  icon,
  color = '#3B82F6',
  subtitle,
}: StatsCardProps) => {
  const borderColor = useThemeColor({}, 'border');
  
  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
            {icon}
          </View>
        )}
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>
      <ThemedText style={[styles.value, { color }]}>{value}</ThemedText>
      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </ThemedView>
  );
};

export default StatsCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});