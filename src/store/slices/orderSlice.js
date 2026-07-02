import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const newOrder = {
        ...orderData,
        id: `ord-${Date.now()}`,
        status: 'received',
        paymentStatus: 'paid',
        orderDate: new Date().toISOString(),
        deliveredAt: null,
        courierId: null,
      };
      const { data } = await axios.post(`${API_URL}/orders`, newOrder);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  'order/fetchCustomerOrders',
  async (customerId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/orders?customerId=${customerId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMerchantOrders = createAsyncThunk(
  'order/fetchMerchantOrders',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/orders?restaurantId=${restaurantId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const updates = { status };
      if (status === 'delivered') updates.deliveredAt = new Date().toISOString();
      const { data } = await axios.patch(`${API_URL}/orders/${orderId}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  activeOrder: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setActiveOrder: (state, action) => { state.activeOrder = action.payload; },
    clearActiveOrder: (state)       => { state.activeOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending,   (state) => { state.status = 'loading'; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activeOrder = action.payload;
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected,  (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(fetchCustomerOrders.pending,   (state) => { state.status = 'loading'; })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        state.activeOrder = action.payload.find(o => !['delivered', 'cancelled'].includes(o.status)) || null;
      })
      .addCase(fetchCustomerOrders.rejected,  (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(fetchMerchantOrders.pending,   (state) => { state.status = 'loading'; })
      .addCase(fetchMerchantOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      })
      .addCase(fetchMerchantOrders.rejected,  (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex(o => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.activeOrder?.id === action.payload.id) state.activeOrder = action.payload;
      });
  },
});

export const { setActiveOrder, clearActiveOrder } = orderSlice.actions;
export default orderSlice.reducer;
