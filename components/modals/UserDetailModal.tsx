// components/UserDetailsModal.tsx
import { User, UserForm } from "@/types";
import { handleCall } from "@/utils/handleCall";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import UserDataForm from "../forms/UserDataForm";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  user: User;
  visible: boolean;
  onClose: () => void;
  formMethods: UseFormReturn<UserForm>;
  deleteUser: (id: string) => Promise<boolean>;
  updateUser: (id: string, data: Partial<UserForm>) => Promise<boolean>;
  isloading: boolean;
  success: string | null;
}

const UserDetailsModal = ({
  user,
  visible,
  onClose,
  formMethods,
  deleteUser,
  updateUser,
  isloading,
  success,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Reset editing state when the user prop changes
    setIsEditing(false);
  }, [user?.id]);

  // Effect to auto-close the modal on successful DELETE
  useEffect(() => {
    if (success && !isEditing && !isloading) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, isEditing, isloading, onClose]);

  const handleDelete = () => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteUser(user.id);
          },
        },
      ]
    );
  };

  const handleUpdate = async (data: UserForm) => {
    const updateSuccess = await updateUser(user.id, data);
    if (updateSuccess) {
      setIsEditing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit User" : "User Details"}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* VIEW MODE */}
          {!isEditing && (
            <View style={styles.viewContainer}>
              <Image
                source={
                  user.photo?.url
                    ? { uri: user.photo.url }
                    : require("@/assets/images/icon.png")
                }
                style={styles.avatar}
              />
              <Text style={styles.name}>{user.name}</Text>

              <View style={styles.infoBox}>
                <Ionicons name="call-outline" size={20} color="#555" />
                <Text style={styles.infoText}>{user.mobileNo}</Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="location-outline" size={20} color="#555" />
                <Text style={styles.infoText}>{user.address}</Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="time-outline" size={20} color="#555" />
                <Text style={styles.infoText}>
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.actionButton, styles.callButton]}
                onPress={() => handleCall(user.mobileNo)}
              >
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Call User</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <UserDataForm
              key={user.id}
              defaultValues={user}
              onSubmit={handleUpdate}
              isLoading={isloading}
              submitButtonText="Save Changes"
              formMethods={formMethods}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {isEditing ? (
              <TouchableOpacity
                style={[styles.submitButton, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
                disabled={isloading}
              >
                <Text style={styles.submitButtonText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.submitButton, styles.deleteButton]}
                  onPress={handleDelete}
                  disabled={isloading}
                >
                  {isloading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Delete</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitButton]}
                  onPress={() => setIsEditing(true)}
                  disabled={isloading}
                >
                  {isloading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Edit</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  viewContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  callButton: {
    backgroundColor: "#007AFF",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 54,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
    shadowColor: "#8E8E93",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserDetailsModal;