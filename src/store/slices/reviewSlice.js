import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchRestaurantReviews = createAsyncThunk(
  'review/fetchRestaurantReviews',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews?restaurantId=${restaurantId}&isVisible=true`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'review/addReview',
  async ({ restaurantId, reviewData }, { rejectWithValue }) => {
    try {
      const avg = Object.values(reviewData.ratings).reduce((a, b) => a + b, 0) / 3;
      const newReview = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        restaurantId,
        averageRating: Math.round(avg * 100) / 100,
        merchantReply: null,
        isVisible: true,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      const { data } = await axios.post(`${API_URL}/reviews`, newReview);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const replyToReview = createAsyncThunk(
  'review/replyToReview',
  async ({ reviewId, replyText }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/reviews/${reviewId}`, { merchantReply: replyText });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllReviews = createAsyncThunk(
  'review/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews: (state) => { state.items = []; state.status = 'idle'; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantReviews.pending,   (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchRestaurantReviews.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchRestaurantReviews.rejected,  (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(addReview.fulfilled,    (state, action) => { state.items.unshift(action.payload); })
      .addCase(replyToReview.fulfilled,(state, action) => {
        const idx = state.items.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
