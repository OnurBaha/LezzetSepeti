import { configureStore } from '@reduxjs/toolkit';
import authReducer       from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import cartReducer       from './slices/cartSlice';
import orderReducer      from './slices/orderSlice';
import reviewReducer     from './slices/reviewSlice';
import paymentReducer    from './slices/paymentSlice';
import couponReducer     from './slices/couponSlice';

const store = configureStore({
  reducer: {
    auth:       authReducer,
    restaurant: restaurantReducer,
    cart:       cartReducer,
    order:      orderReducer,
    review:     reviewReducer,
    payment:    paymentReducer,
    coupon:     couponReducer,
  },
});

export default store;
