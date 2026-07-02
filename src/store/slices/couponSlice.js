import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchCoupons = createAsyncThunk(
  'coupon/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/coupons`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  'coupon/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const newCoupon = {
        ...couponData,
        id: `cp-${Date.now()}`,
        usedCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      const { data } = await axios.post(`${API_URL}/coupons`, newCoupon);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupon/updateCoupon',
  async ({ id, data: updates }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/coupons/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupon/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/coupons/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending,   (state) => { state.status = 'loading'; })
      .addCase(fetchCoupons.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchCoupons.rejected,  (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(createCoupon.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
