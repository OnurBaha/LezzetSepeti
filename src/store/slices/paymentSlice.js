import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchSavedCards = createAsyncThunk(
  'payment/fetchSavedCards',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/users/${userId}`);
      return data.savedCards || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addNewCard = createAsyncThunk(
  'payment/addNewCard',
  async ({ userId, cardData, existingCards }, { rejectWithValue }) => {
    try {
      const newCard = { ...cardData, id: `c-${Date.now()}` };
      const updatedCards = [...(existingCards || []), newCard];
      await axios.patch(`${API_URL}/users/${userId}`, { savedCards: updatedCards });
      return updatedCards;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const processPayment = createAsyncThunk(
  'payment/processPayment',
  async ({ orderId, paymentDetails }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/orders/${orderId}`, {
        paymentMethod: paymentDetails.method,
        paymentStatus: 'paid',
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  savedCards: [],
  selectedCardId: null,
  paymentMethod: 'online_credit_card',
  status: 'idle',
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setSelectedCard:   (state, action) => { state.selectedCardId = action.payload; },
    setPaymentMethod:  (state, action) => { state.paymentMethod = action.payload; },
    clearPaymentState: (state)         => { state.status = 'idle'; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedCards.fulfilled, (state, action) => { state.savedCards = action.payload; })
      .addCase(addNewCard.fulfilled,      (state, action) => { state.savedCards = action.payload; })
      .addCase(processPayment.pending,    (state) => { state.status = 'loading'; state.error = null; })
      .addCase(processPayment.fulfilled,  (state) => { state.status = 'succeeded'; })
      .addCase(processPayment.rejected,   (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const { setSelectedCard, setPaymentMethod, clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
