// store/user.store.ts
import { supabase } from "@/supabase/supabase";
import { UserForm, UserStore } from "@/types"; // Added Location
import { create } from "zustand";

export const userStore = create<UserStore>((set, get) => ({ // Added 'get'
  user: null, // Default to null
  users: [],
  isloading: false,
  error: null,
  success: null,

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),

  addUser: async (data: UserForm): Promise<boolean> => {
    console.log(data);
    try {
      set({ isloading: true, error: null, success: null });
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
      }).select().single(); // Use .select().single() to get the new row

      if (response.error) {
        throw response.error;
      }
      
      // Optimistic update: add new user to state
      set((state) => ({ users: [...state.users, response.data] }));
      set({ success: "User added successfully!" });
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      set({ error: (error as Error).message || "Failed to add user. Please try again." });
      return false;
    } finally {
      set({ isloading: false });
    }
  },

  updateUser: async (id: string, data: Partial<UserForm>): Promise<boolean> => {
    try {
      set({ isloading: true, error: null, success: null });
      let imageUrl = "";
      let imageRes = null;
      const currentUser = get().users.find((u) => u.id === id); // Use get()

      // Handle photo update if provided
      if (data.photo && typeof data.photo !== "string") {
        // Delete old photo if exists
        if (currentUser?.photo?.path) {
          await supabase.storage
            .from("user-photos")
            .remove([currentUser.photo.path]);
        }

        // Upload new photo
        imageRes = await supabase.storage
          .from("user-photos")
          .upload(
            `photos/${Date.now()}_${data.name || currentUser?.name}.${
              data.photo.mimeType
            }`,
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
      const updateData: any = { ...data };
      
      if (imageUrl) {
        updateData.photo = { url: imageUrl, path: imageRes?.data.path || "" };
      } else if (data.photo === undefined) {
         // Don't update photo if it wasn't in the form data
        delete updateData.photo;
      }

      const response = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single(); // Get the updated row

      if (response.error) {
        throw response.error;
      }

      // Optimistic update
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? response.data : u)),
      }));
      set({ success: "User updated successfully!" });
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      set({ error: (error as Error).message || "Failed to update user. Please try again." });
      return false;
    } finally {
      set({ isloading: false });
    }
  },

  deleteUser: async (id: string): Promise<boolean> => {
    try {
      set({ isloading: true, error: null, success: null });

      // Get user to delete their photo
      const user = get().users.find((u) => u.id === id); // Use get()
      if (user?.photo?.path) {
        await supabase.storage
          .from("user-photos")
          .remove([user.photo.path]);
      }

      const response = await supabase.from("users").delete().eq("id", id);

      if (response.error) {
        throw response.error;
      }

      // Optimistic update
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
      set({ success: "User deleted successfully!" });
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      set({ error: (error as Error).message || "Failed to delete user. Please try again." });
      return false;
    } finally {
      set({ isloading: false });
    }
  },

  fetchUsers: async () => {
    try {
      set({ isloading: true, error: null });
      const response = await supabase.from("users").select("*").order('createdAt', { ascending: false });;
      if (response.error) {
        throw response.error;
      }
      
      console.log("Data Retrieved:", response.data);
      set({ users: response.data || [] });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: (error as Error).message || "Failed to fetch users. Please try again." });
    } finally {
      set({ isloading: false });
    }
  },

}));