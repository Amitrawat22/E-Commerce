import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyOrders, getAllOrders, placeOrder, updateOrderStatus } from '../api/orderAPI';
import { toast } from 'react-toastify';
import { clearCart } from './cartSlice';

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async () => {
  const { data } = await getMyOrders();
  return data;
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  const { data } = await getAllOrders();
  return data;
});

export const createOrder = createAsyncThunk(
  'orders/create',
  async ({ paymentMethod, addressId, pgDetails }, { dispatch, rejectWithValue }) => {
    try {
      const params = { addressId, ...pgDetails };
      const { data } = await placeOrder(paymentMethod, params);
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'orders/changeStatus',
  async ({ orderId, status }) => {
    const { data } = await updateOrderStatus(orderId, status);
    toast.success('Order status updated');
    return data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state) => { state.loading = false; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.allOrders = action.payload; })
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state) => { state.loading = false; })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const idx = state.allOrders.findIndex(o => o.orderId === action.payload.orderId);
        if (idx !== -1) state.allOrders[idx] = action.payload;
      });
  },
});

export const selectMyOrders = (state) => state.orders.myOrders;
export const selectAllOrders = (state) => state.orders.allOrders;
export const selectOrdersLoading = (state) => state.orders.loading;
export default orderSlice.reducer;
