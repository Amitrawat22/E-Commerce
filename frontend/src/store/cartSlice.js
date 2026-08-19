import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToCart, getMyCart, updateCartQty, removeFromCart } from '../api/cartAPI';
import { toast } from 'react-toastify';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMyCart();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const addProductToCart = createAsyncThunk('cart/addProduct', async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await addToCart(productId, quantity);
    toast.success('Added to cart! 🛒');
    dispatch(fetchCart());
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Could not add to cart';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQty', async ({ productId, operation }, { dispatch }) => {
  await updateCartQty(productId, operation);
  dispatch(fetchCart());
});

export const removeProduct = createAsyncThunk('cart/remove', async ({ cartId, productId }, { dispatch }) => {
  await removeFromCart(cartId, productId);
  toast.info('Item removed from cart');
  dispatch(fetchCart());
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartId: null,
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartId = null;
      state.items = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.cartId;
        state.items = action.payload.products || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })
      .addCase(addProductToCart.pending, (state) => { state.loading = true; })
      .addCase(addProductToCart.fulfilled, (state) => { state.loading = false; })
      .addCase(addProductToCart.rejected, (state) => { state.loading = false; });
  },
});

export const { clearCart } = cartSlice.actions;
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalPrice;
export const selectCartCount = (state) => state.cart.items?.length || 0;
export default cartSlice.reducer;
