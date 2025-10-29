// app/(tabs)/explore.tsx
import UserListItem from "@/components/cards/UserListItem";
import UserDetailsModal from "@/components/modals/UserDetailModal";
import Toast from "@/components/ui/toast";
import { userStore } from "@/store/user.store";
import { User, UserForm } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

const ExploreScreen = () => {
  // Store hooks
  const {
    users,
    fetchUsers,
    isloading,
    deleteUser,
    updateUser,
    error,
    success,
    clearError,
    clearSuccess,
  } = userStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Form methods
  const formMethods = useForm<UserForm>({
    defaultValues: {
      name: "",
      mobileNo: undefined,
      address: "",
      photo: undefined,
    },
  });

  // Fetch users when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  // Show error toast
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("error");
      setToastVisible(true);
    }
  }, [error]);

  // Show success toast
  useEffect(() => {
    if (success) {
      setToastMessage(success);
      setToastType("success");
      setToastVisible(true);
    }
  }, [success]);

  const handleToastHide = () => {
    setToastVisible(false);
    if (toastType === "error") {
      clearError();
    } else {
      clearSuccess();
    }
  };

  // Memoized search results
  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return users;
    }
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobileNo.toString().includes(searchQuery)
    );
  }, [users, searchQuery]);

  // Open modal with user data
  const handleUserPress = useCallback((user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
    // Reset form with user data
    formMethods.reset({
      name: user.name,
      mobileNo: user.mobileNo,
      address: user.address,
      photo: undefined,
    });
  }, [formMethods]);

  // Close modal and reset
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedUser(null);
    formMethods.reset({
      name: "",
      mobileNo: undefined,
      address: "",
      photo: undefined,
    });
  }, [formMethods]);

  // Render list item
  const renderUser = useCallback(
    ({ item }: { item: User }) => (
      <UserListItem item={item} onPress={handleUserPress} />
    ),
    [handleUserPress]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={handleToastHide}
      />
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or mobile..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* User List */}
        {isloading && users.length === 0 ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <FlashList
            data={filteredUsers}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            // estimatedItemSize={82}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No users found.</Text>
            }
          />
        )}

        {/* Details Modal */}
        {selectedUser && (
          <UserDetailsModal
            visible={modalVisible}
            onClose={handleCloseModal}
            user={selectedUser}
            formMethods={formMethods}
            deleteUser={deleteUser}
            updateUser={updateUser}
            isloading={isloading}
            success={success}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f7f8",
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});

export default ExploreScreen;