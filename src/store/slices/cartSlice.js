import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const validateCoupon = createAsyncThunk(
  'cart/validateCoupon',
  async ({ code, restaurantId, subTotal }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/coupons?code=${code}&isActive=true`);
      if (data.length === 0) throw new Error('Geçersiz veya süresi dolmuş kupon kodu.');
      const coupon = data[0];
      if (coupon.restaurantId !== 'all' && coupon.restaurantId !== restaurantId)
        throw new Error('Bu kupon bu restoran için geçerli değil.');
      if (subTotal < coupon.minOrder)
        throw new Error(`Bu kupon için minimum sipariş tutarı ${coupon.minOrder}₺.`);
      const discount =
        coupon.type === 'percentage'
          ? Math.round((subTotal * coupon.value) / 100)
          : coupon.value;
      return { coupon, discount };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  restaurantId: null,
  restaurantName: '',
  items: [],
  totalAmount: 0,
  appliedCoupon: null,
  discount: 0,
  couponStatus: 'idle',
  couponError: null,
};

const calcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, restaurantId, restaurantName } = action.payload;
      // Farklı restoran uyarısı yerine mevcut sepeti temizle
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.appliedCoupon = null;
        state.discount = 0;
      }
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existing = state.items.find(
        (i) => i.menuId === item.menuId && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.totalAmount = calcTotal(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((_, idx) => idx !== action.payload);
      state.totalAmount = calcTotal(state.items);
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = '';
        state.appliedCoupon = null;
        state.discount = 0;
      }
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }
      state.totalAmount = calcTotal(state.items);
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = '';
        state.appliedCoupon = null;
        state.discount = 0;
      }
    },
    clearCart: (state) => {
      return initialState;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.discount = 0;
      state.couponStatus = 'idle';
      state.couponError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending,   (state) => { state.couponStatus = 'loading'; state.couponError = null; })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.couponStatus = 'succeeded';
        state.appliedCoupon = action.payload.coupon;
        state.discount = action.payload.discount;
      })
      .addCase(validateCoupon.rejected,  (state, action) => {
        state.couponStatus = 'failed';
        state.couponError = action.payload;
        state.appliedCoupon = null;
        state.discount = 0;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;
