// lib/utils.ts
import { Alert, Platform } from "react-native";
import * as Linking from 'expo-linking'

export const handleCall = async (mobileNumber: number | string) => {
  const cleanNumber = String(mobileNumber).replace(/[^0-9+]/g, "");
  const phoneNumber = `tel:${cleanNumber}`;

  try {
    await Linking.openURL(phoneNumber);
  } catch (error) {
    console.error("Call error:", error);
    Alert.alert(
      "Error", 
      "Failed to initiate call. Please check your phone settings."
    );
  }
};