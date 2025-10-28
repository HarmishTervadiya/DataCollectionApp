import StatsCard from '@/components/cards/StatCard';
import UserForm from '@/components/forms/UserForm';
import { ThemedText } from '@/components/themed-text';
import { userStore } from '@/store/user.store';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen() {
  const { users, isloading = false, fetchUsers } = userStore();

  useEffect(() => {
    fetchUsers?.();
  }, [fetchUsers]);

  const stats = useMemo(() => {
    const activeUsers = users?.length ?? 0;
    const recentUsers = users?.filter(
      user => new Date(user?.createdAt ?? 0).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    )?.length ?? 0;
    return { activeUsers, recentUsers };
  }, [users]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Users"
            value={stats.activeUsers}
            icon={<Ionicons name="people-outline" size={24} color="#3B82F6" />}
            color="#3B82F6"
          />
          <StatsCard
            title="New This Week"
            value={stats.recentUsers}
            icon={<Ionicons name="trending-up-outline" size={24} color="#10B981" />}
            color="#10B981"
          />
        </View>
        
        <View style={styles.formContainer}>
          <ThemedText style={styles.formTitle}>Add New User</ThemedText>
          <UserForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    flexWrap: 'wrap',
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
});
