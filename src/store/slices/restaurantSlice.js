import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (filters = {}, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/restaurants?isApproved=true`;
      if (filters.cuisine) url += `&cuisine=${filters.cuisine}`;
      if (filters.search)  url += `&name_like=${filters.search}`;
      const { data } = await axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRestaurantDetails = createAsyncThunk(
  'restaurant/fetchRestaurantDetails',
  async (id, { rejectWithValue }) => {
    try {
      const [restRes, menuRes] = await Promise.all([
        axios.get(`${API_URL}/restaurants/${id}`),
        axios.get(`${API_URL}/menus?restaurantId=${id}`),
      ]);
      return { restaurant: restRes.data, menus: menuRes.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMenusByRestaurant = createAsyncThunk(
  'restaurant/fetchMenusByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/menus?restaurantId=${restaurantId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addRestaurant = createAsyncThunk(
  'restaurant/addRestaurant',
  async (restaurantData, { rejectWithValue }) => {
    try {
      const newRest = {
        ...restaurantData,
        id: `r-${Date.now()}`,
        isApproved: true,
        status: 'active',
        rating: 0,
        reviewCount: 0,
        totalRevenue: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      const { data } = await axios.post(`${API_URL}/restaurants`, newRest);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurant/updateRestaurant',
  async ({ id, data: updates }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/restaurants/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurant/deleteRestaurant',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/restaurants/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addMenuItem = createAsyncThunk(
  'restaurant/addMenuItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const newItem = { ...itemData, id: `m-${Date.now()}` };
      const { data } = await axios.post(`${API_URL}/menus`, newItem);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'restaurant/updateMenuItem',
  async ({ id, data: updates }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/menus/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'restaurant/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/menus/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  currentRestaurant: null,
  currentMenus: [],
  filters: { cuisine: '', rating: 0, search: '' },
  status: 'idle',
  detailStatus: 'idle',
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
      state.currentMenus = [];
      state.detailStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending,  (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchRestaurants.fulfilled,(state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchRestaurants.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(fetchRestaurantDetails.pending,  (state) => { state.detailStatus = 'loading'; })
      .addCase(fetchRestaurantDetails.fulfilled,(state, action) => {
        state.detailStatus = 'succeeded';
        state.currentRestaurant = action.payload.restaurant;
        state.currentMenus = action.payload.menus;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => { state.detailStatus = 'failed'; state.error = action.payload; })

      .addCase(fetchMenusByRestaurant.fulfilled, (state, action) => { state.currentMenus = action.payload; })

      .addCase(addRestaurant.fulfilled,    (state, action) => { state.items.push(action.payload); })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        const idx = state.items.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentRestaurant?.id === action.payload.id) state.currentRestaurant = action.payload;
      })
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r.id !== action.payload);
      })
      .addCase(addMenuItem.fulfilled,    (state, action) => { state.currentMenus.push(action.payload); })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const idx = state.currentMenus.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) state.currentMenus[idx] = action.payload;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.currentMenus = state.currentMenus.filter(m => m.id !== action.payload);
      });
  },
});

export const { setFilters, clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
