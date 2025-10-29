// components/UserDataForm.tsx
import { User, UserForm } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import TextInputField from "../inputs/TextInputField";

interface Props {
  defaultValues?: Partial<User>;
  onSubmit: (data: UserForm) => Promise<boolean>;
  isLoading: boolean;
  submitButtonText: string;
  formMethods: UseFormReturn<UserForm>; // Receive form methods from parent
}

const UserDataForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitButtonText,
  formMethods,
}: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;

  // State to preview the new image or the existing image
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.photo?.url || null
  );

  useEffect(() => {
    // Update image preview when defaultValues change
    setImagePreview(defaultValues?.photo?.url || null);
  }, [defaultValues]);

  const onFormSubmit = async (data: UserForm) => {
    const success = await onSubmit(data);
    
    if (success && !defaultValues) {
      // Only reset image preview on success for "create" forms
      setImagePreview(null);
    }
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    const image = result.assets[0];
    setImagePreview(image.uri);

    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
    setValue("photo", {
      fileBody: arraybuffer,
      mimeType: image.mimeType ?? "image/jpeg",
    });
  };

  return (
    <View style={styles.container}>
      {/* Photo Section - Moved to Top */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Photo</Text>
        <View style={styles.imagePickerContainer}>
          {imagePreview && (
            <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
          )}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={selectImage}
          >
            <Ionicons 
              name={imagePreview ? "camera-outline" : "add-circle-outline"} 
              size={24} 
              color="#007AFF" 
            />
            <Text style={styles.imageButtonText}>
              {imagePreview ? "Change Photo" : "Upload Photo"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Basic Information Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Name"
              value={value}
              onValueChange={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="mobileNo"
          rules={{
            required: "Mobile number is required",
            pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Mobile Number"
              value={value?.toString() || ""}
              onValueChange={(text) =>
                onChange(text ? Number(text.replace(/[^0-9]/g, "")) : undefined)
              }
              keyboardType="phone-pad"
              error={errors.mobileNo?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          rules={{ required: "Address is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Address"
              value={value}
              onValueChange={onChange}
              error={errors.address?.message}
            />
          )}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit(onFormSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>{submitButtonText}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 0,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  imagePickerContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: "#eee",
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 12,
    backgroundColor: "#f0f8ff",
  },
  imageButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 54,
  },
  submitButtonDisabled: {
    backgroundColor: "#a0cfff",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserDataForm;