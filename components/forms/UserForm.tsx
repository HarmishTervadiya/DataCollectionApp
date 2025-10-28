import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import TextInputField from "../inputs/TextInputField";
import { useForm, Controller } from "react-hook-form";
import { UserForm } from "@/types";
import { userStore } from "@/store/user.store";
import * as ImagePicker from "expo-image-picker";

const UserDataForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: {},
  });

  const {addUser} = userStore()

  const onSubmit = (data: UserForm) => {
    addUser(data)
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
      exif: false,
    });
    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log("User cancelled image picker.");
      return;
    }
    const image = result.assets[0];
    console.log("Got image", image);
    if (!image.uri) {
      throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
    }
    
    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
    
    setValue("photo", {
      fileBody: arraybuffer,
      mimeType: image.mimeType ?? "image/jpeg",
    });

  };

  return (
    <View>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { name, onChange, value } }) => (
          <TextInputField label="name" value={value} onValueChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="mobileNo"
        rules={{ required: true }}
        render={({ field: { name, onChange, value } }) => (
          <TextInputField
            label="mobileNo"
            value={value?.toString() || ""}
            onValueChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="address"
        rules={{ required: true }}
        render={({ field: { name, onChange, value } }) => (
          <TextInputField label="name" value={value} onValueChange={onChange} />
        )}
      />

      <TouchableOpacity onPress={selectImage}>
        <Text>Upload Image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserDataForm;

const styles = StyleSheet.create({});
