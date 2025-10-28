import { supabase } from "@/supabase/supabase";
import { UserForm, UserStore } from "@/types";
import { create } from "zustand";

export const userStore = create<UserStore>((set) => ({
  user: {
    name: "",
    mobileNo: 0,
    address: "",
    photo: { url: "", path: "" },
    createdAt: "",
    id: "",
  },

  users: [],
  locations: [],
  isloading: false,
  error: null,

  setUser: (user) => set({ user }),

  addUser: async (data: UserForm) => {
    try {
      set({ isloading: true, error: null });
      let imageUrl = "";
      let imageRes = null;
      if (data.photo !== "") {
        imageRes = await supabase.storage
          .from("user-photos")
          .upload(
            `photos/${Date.now()}_${data.name}.${data.photo.mimeType}`,
            data.photo.fileBody,
            {
              contentType: data.photo.mimeType ?? "image/jpeg",
            }
          );

        if (imageRes.error) {
          throw imageRes.error;
        }

        imageUrl = supabase.storage
          .from("user-photos")
          .getPublicUrl(imageRes.data.path).data.publicUrl;
      }

      const response = await supabase.from("users").insert({
        name: data.name,
        mobileNo: data.mobileNo,
        address: data.address,
        photo: { url: imageUrl, path: imageRes?.data.path || "" },
      });

      if (response.error) {
        throw response.error;
      }
      await userStore.getState().fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ isloading: false });
    }
  },
  updateUser: async (id, data) => {},
  deleteUser: async (id) => {},
  fetchUsers: async () => {
    try {
      set({ isloading: true, error: null });
      const response = await supabase.from("users").select("*");
      if (response.error) {
        throw response.error;
      }

      console.log("Data Retrived:", response.data);
      set({ users: response.data || [] });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ isloading: false });
    }
  },
  fetchLocations: async () => {
    try {
      set({ isloading: true, error: null });
      const response = await supabase.from("locations").select("*");
      if (response.error) {
        throw response.error;
      }

      console.log("Data Retrived:", response.data);
      set({ users: response.data || [] });
    } catch (error) {
      console.error("Error fetching locations:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ isloading: false });
    }
  },
  addLocation: async (locationName) => {
    try {
      set({ isloading: true, error: null });
      const response = await supabase
        .from("locations")
        .insert({ locationName });
      if (response.error) {
        throw response.error;
      }

      console.log("Data Added:", response.data);
      set({ users: response.data || [] });
    } catch (error) {
      console.error("Error adding locations:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ isloading: false });
    }
  },
  deleteLocation: async (id) => {},
}));
