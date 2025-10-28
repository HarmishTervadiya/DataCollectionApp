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
  isloading: false,
  error: null,

  setUser: (user) => set({ user }),

  addUser: async (data: UserForm) => {
    console.log(data)
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
  updateUser: async (id: string, data: Partial<UserForm>) => {
    try {
      set({ isloading: true, error: null });
      let imageUrl = "";
      let imageRes = null;

      // Handle photo update if provided
      if (data.photo && typeof data.photo !== 'string') {
        // Delete old photo if exists
        const currentUser = userStore.getState().users.find(u => u.id === id);
        if (currentUser?.photo?.path) {
          await supabase.storage
            .from("user-photos")
            .remove([currentUser.photo.path]);
        }

        // Upload new photo
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

      // Prepare update data
      const updateData: any = {
        ...data,
        photo: imageUrl ? { url: imageUrl, path: imageRes?.data.path || "" } : undefined
      };

      // Remove photo property if it wasn't updated
      if (!data.photo) {
        delete updateData.photo;
      }

      const response = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id);

      if (response.error) {
        throw response.error;
      }

      await userStore.getState().fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ isloading: false });
    }
  },
  deleteUser: async (id: string) => {
    try {
      set({ isloading: true, error: null });

      // Get user to delete their photo
      const user = userStore.getState().users.find(u => u.id === id);
      if (user?.photo?.path) {
        await supabase.storage
          .from("user-photos")
          .remove([user.photo.path]);
      }

      const response = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (response.error) {
        throw response.error;
      }

      await userStore.getState().fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ isloading: false });
    }
  },
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
}));
