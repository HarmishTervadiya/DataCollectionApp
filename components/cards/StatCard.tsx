import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  value: string | number;
}

const StatsCard = ({ title, value }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    margin: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default StatsCard;