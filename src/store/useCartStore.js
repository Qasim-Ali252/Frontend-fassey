import { create } from 'zustand';

export const useCartStore = create((set) => ({
  isCartOpen: false,
  openCart: () => {
    console.log("Store: opening cart..."); // Add this to debug
    set({ isCartOpen: true });
  },
  closeCart: () => set({ isCartOpen: false }),
}));