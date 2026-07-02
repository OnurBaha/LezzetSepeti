import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data: users } = await axios.get(`${API_URL}/users?email=${credentials.email}`);
      const user = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      if (!user) throw new Error('E-posta veya şifre hatalı.');
      const { password: _, ...safeUser } = user;
      localStorage.setItem('lezzet_user', JSON.stringify(safeUser));
      return safeUser;
    } catch (err) {
      return rejectWithValue(err.message || 'Giriş başarısız.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { data: existing } = await axios.get(`${API_URL}/users?email=${userData.email}`);
      if (existing.length > 0) throw new Error('Bu e-posta adresi zaten kullanılıyor.');
      const newUser = {
        ...userData,
        id: `u-${Date.now()}`,
        role: 'customer',
        addresses: [],
        savedCards: [],
        createdAt: new Date().toISOString().slice(0, 10),
      };
      const { data } = await axios.post(`${API_URL}/users`, newUser);
      const { password: _, ...safeUser } = data;
      localStorage.setItem('lezzet_user', JSON.stringify(safeUser));
      return safeUser;
    } catch (err) {
      return rejectWithValue(err.message || 'Kayıt başarısız.');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem('lezzet_user');
      if (!stored) throw new Error('Oturum bulunamadı.');
      return JSON.parse(stored);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/users/${userId}`, data);
      const { password: _, ...safeUser } = res.data;
      localStorage.setItem('lezzet_user', JSON.stringify(safeUser));
      return safeUser;
    } catch (err) {
      return rejectWithValue(err.message || 'Profil güncellenemedi.');
    }
  }
);

// --- Slice ---
const initialState = {
  user: null,
  role: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.role = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('lezzet_user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.status = 'loading'; state.error = null; };
    const rejected = (state, action) => { state.status = 'failed'; state.error = action.payload; };
    const fulfilled = (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
      state.role = action.payload.role;
    };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected)
      .addCase(fetchCurrentUser.pending, pending)
      .addCase(fetchCurrentUser.fulfilled, fulfilled)
      .addCase(fetchCurrentUser.rejected, (state) => { state.status = 'idle'; })
      .addCase(updateUserProfile.fulfilled, fulfilled)
      .addCase(updateUserProfile.rejected, rejected);
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
