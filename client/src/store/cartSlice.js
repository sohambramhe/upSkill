import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "upskill_cart";

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return { items: [] };
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return { items: [] };
    }

    return { items: parsedCart };
  } catch (error) {
    console.error("Could not load cart from storage:", error);
    return { items: [] };
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Could not save cart to storage:", error);
  }
};

const slice = createSlice({
  name: "cart",
  initialState: loadCart(),

  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;

      if (!course?._id) return;

      const alreadyExists = state.items.some((item) => item._id === course._id);

      if (!alreadyExists) {
        state.items.push(course);
        saveCart(state.items);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);

      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = slice.actions;

export default slice.reducer;
