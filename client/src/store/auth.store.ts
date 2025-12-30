import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";
import type {
  User,
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
} from "../context/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  fetchMe: () => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      fetchMe: async () => {
        try {
          const res = await api.get("/auth/current-user");
          set({
            user: res.data?.data?.user,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (data: LoginPayload) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/login", {
            email: data.email,
            password: data.password,
          });
          console.log(res.data.data.user);
          set({
            user: res.data?.data?.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          // console.log(error);
          throw error; // Re-throw so Login.tsx can catch it
        }
      },

      register: async (data: RegisterPayload) => {
        set({ isLoading: true });

        try {
          await api.post("/auth/register", {
            username: data.username,
            email: data.email,
            password: data.password,
          });

          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error; // Re-throw so Register.tsx can catch it
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await api.post("/auth/logout");
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      changePassword: async (data: ChangePasswordPayload) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/change-password", {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
          });

          set({
            user: res.data?.data?.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error; // Re-throw so component can catch it
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in storage
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist isLoading
      }),
    }
  )
);
