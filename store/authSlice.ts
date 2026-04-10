import { AuthState } from "@/app/types/GlobalType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Ambil user dari localStorage (Client-side only)
const getInitialUser = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Gagal Login");

      // Simpan info user non-sensitif ke localStorage
      localStorage.setItem("user", JSON.stringify(result.user));

      return result; // result berisi { user: { name, role, ... } }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
      // Panggil API logout untuk menghapus cookie di server
      fetch("/api/login/logout", { method: "POST" });
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;