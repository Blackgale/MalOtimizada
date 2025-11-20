import { create } from "zustand";
import { load, save } from "../utils/storage";
export type Wish = { productId: string; color: string; addedAt: number };
type State = {
  items: Wish[];
  add: (w: Wish) => void;
  remove: (id: string) => void;
  reclassify: (id: string, c: string) => void;
};
export const useWishlist = create<State>((set, get) => ({
  items: load<Wish[]>("bad_wishlist", []),
  add(w) {
    const next = [...get().items.filter(i => i.productId !== w.productId), w];
    set({ items: next }); save("bad_wishlist", next);
  },
  remove(id) {
    const next = get().items.filter(i => i.productId !== id);
    set({ items: next }); save("bad_wishlist", next);
  },
  reclassify(id, c) {
    const next = get().items.map(i => i.productId === id ? { ...i, color: c } : i);
    set({ items: next }); save("bad_wishlist", next);
  }
}));
