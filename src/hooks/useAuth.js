import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, fetchCurrentUser, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, role, status, error } = useSelector((state) => state.auth);

  return {
    user,
    role,
    status,
    error,
    isLoading: status === 'loading',
    isAuthenticated: !!user,
    isCustomer: role === 'customer',
    isMerchant: role === 'merchant',
    isCourier:  role === 'courier',
    isAdmin:    role === 'admin',
    login:      (credentials) => dispatch(loginUser(credentials)),
    register:   (userData)    => dispatch(registerUser(userData)),
    logout:     ()            => dispatch(logoutUser()),
    fetchMe:    ()            => dispatch(fetchCurrentUser()),
    clearError: ()            => dispatch(clearError()),
  };
};
