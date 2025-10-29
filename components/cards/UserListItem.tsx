// components/UserListItem.tsx
import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { User } from "@/types";
import { Ionicons } from "@expo/vector-icons"; // Assuming you have expo-vector-icons
import { handleCall } from "@/utils/handleCall";

interface Props {
  item: User;
  onPress: (item: User) => void;
}

// Use memo for performance optimization in FlashList
const UserListItem = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      <Image
        source={
          item.photo?.url
            ? { uri: item.photo.url }
            : require("@/assets/images/icon.png") // Fallback image
        }
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.mobile}>{item.mobileNo}</Text>
      </View>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => handleCall(item.mobileNo)}
      >
        <Ionicons name="call" size={24} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#eee",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  mobile: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  callButton: {
    padding: 8,
  },
});

export default memo(UserListItem);