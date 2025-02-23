import { create } from "zustand";

const useStore = create((set) => ({
  Count: 0,
  color: localStorage.getItem("color") || "red",
  setColor: (color) => set(() => localStorage.setItem("color", color)),
  Plus: () => set((state) => ({ Count: state.Count + 1 })),
  Minus: () => set((state) => ({ Count: state.Count - 1 })),
  Multiply: () => set((state) => ({ Count: state.Count * 2 })),
}));

export default useStore;
