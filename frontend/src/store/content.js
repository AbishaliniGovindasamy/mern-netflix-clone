import { create } from "zustand";

export const useContentStore = create((set) => ({
  contentType: "movie", // Default content type
  setContentType: (type) => set(() => ({ contentType: type })), // Ensures reactivity
}));
