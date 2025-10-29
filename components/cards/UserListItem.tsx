import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { User } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { handleCall } from "@/utils/handleCall";

interface Props {
  item: User;
  onPress: (item: User) => void;
  avatarColor: string;
}

const UserListItem = ({ item, onPress, avatarColor }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      {item.photo?.url ? (
        <Image
          source={{ uri: item.photo.url }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatarContainer, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
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
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
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