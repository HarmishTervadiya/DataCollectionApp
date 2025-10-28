import UserListItem from '@/components/cards/UserListItem';
import TextInputField from '@/components/inputs/TextInputField';
import { userStore } from '@/store/user.store';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { users = [], fetchUsers, isloading = false } = userStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = React.useMemo(() => 
    users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobileNo.toString().includes(searchQuery)
    ), [users, searchQuery]
  );

  const handleSearch = React.useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInputField
          label="Search"
          value={searchQuery}
          onValueChange={handleSearch}
          placeholder="Search by name, address, or phone"
        />
      </View>
      
      <FlashList
        data={filteredUsers}
        renderItem={({ item }) => (
          <UserListItem user={item} />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={isloading}
        onRefresh={fetchUsers}
      />
    </SafeAreaView>
  );
}
export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
});
