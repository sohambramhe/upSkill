import { createSlice } from "@reduxjs/toolkit";
const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("upskill_user") || "null");
  } catch {
    return null;
  }
};
const slice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser(),
    token: localStorage.getItem("upskill_token"),
    loading: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("upskill_user", JSON.stringify(action.payload.user));
      localStorage.setItem("upskill_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("upskill_user");
      localStorage.removeItem("upskill_token");
    },
  },
});
export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
