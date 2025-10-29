import StatsCard from "@/components/cards/StatCard";
import UserDataForm from "@/components/forms/UserDataForm";
import Toast from "@/components/ui/toast";
import { userStore } from "@/store/user.store";
import { UserForm } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const {
    users,
    fetchUsers,
    addUser,
    isloading,
    error,
    success,
    clearError,
    clearSuccess,
  } = userStore();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const formMethods = useForm<UserForm>({
    defaultValues: {
      name: "",
      mobileNo: undefined,
      address: "",
      photo: "",
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchUsers();
    }, [])
  );

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("error");
      setToastVisible(true);
    }
  }, [error]);

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

  const onAddUser = async (data: UserForm) => {
    const result = await addUser(data);
    if (result) {
      formMethods.reset();
    }
    return result;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={handleToastHide}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={fetchUsers} />
          }
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsRow}>
              <StatsCard title="Total Users" value={users.length} />
              <StatsCard
                title="Added Today"
                value={
                  users.filter((u) => {
                    const today = new Date().toDateString();
                    return new Date(u.createdAt).toDateString() === today;
                  }).length
                }
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.formHeader}>
              <Ionicons name="person-add" size={24} color="#007AFF" />
              <Text style={styles.formTitle}>Add New User</Text>
            </View>
            <View style={styles.formCard}>
              <UserDataForm
                onSubmit={onAddUser}
                isLoading={isloading}
                submitButtonText="Create User"
                formMethods={formMethods}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 8,
  },
  greeting: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e7f3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  formSection: {
    marginTop: 8,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default HomeScreen;
