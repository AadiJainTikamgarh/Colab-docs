import { create } from "zustand";
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  fetchMe: async () => {
    try {
      const res = await api.get("/auth/current-user");
      set({
        user: res.data?.user,
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

    const res = await api.post("/auth/login", {
      email: data.email,
      password: data.password,
    });

    set({
      user: res.data?.user,
      isAuthenticated: true,
    });
  },

  register: async (data: RegisterPayload) => {
    set({ isLoading: true });

    await api.post("/auth/register", {
      username: data.username,
      email: data.email,
      password: data.password,
    });

    set({ isLoading: true });
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
    const res = await api.post("/auth/change-password", {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });

    set({
      user: res.data?.user,
      isAuthenticated: true,
      isLoading: false,
    });
  },
}));
