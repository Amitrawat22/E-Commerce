import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductsByCategory, getProductsByKeyword, getCategories } from '../api/productAPI';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params) => {
  const { data } = await getProducts(params);
  return data;
});

export const fetchProductsByCategory = createAsyncThunk('products/byCategory', async ({ categoryId, params }) => {
  const { data } = await getProductsByCategory(categoryId, params);
  return data;
});

export const fetchProductsByKeyword = createAsyncThunk('products/byKeyword', async ({ keyword, params }) => {
  const { data } = await getProductsByKeyword(keyword, params);
  return data;
});

export const fetchCategories = createAsyncThunk('products/categories', async (params) => {
  const { data } = await getCategories(params);
  return data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
    pagination: { pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
    loading: false,
    error: null,
    searchKeyword: '',
    selectedCategory: null,
  },
  reducers: {
    setSearchKeyword: (state, action) => { state.searchKeyword = action.payload; },
    setSelectedCategory: (state, action) => { state.selectedCategory = action.payload; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.error.message; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.items = action.payload.content || [];
      state.pagination = {
        pageNumber: action.payload.pageNumber,
        pageSize: action.payload.pageSize,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      };
    };

    builder
      .addCase(fetchProducts.pending, handlePending)
      .addCase(fetchProducts.fulfilled, handleFulfilled)
      .addCase(fetchProducts.rejected, handleRejected)
      .addCase(fetchProductsByCategory.pending, handlePending)
      .addCase(fetchProductsByCategory.fulfilled, handleFulfilled)
      .addCase(fetchProductsByCategory.rejected, handleRejected)
      .addCase(fetchProductsByKeyword.pending, handlePending)
      .addCase(fetchProductsByKeyword.fulfilled, handleFulfilled)
      .addCase(fetchProductsByKeyword.rejected, handleRejected)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.content || [];
      });
  },
});

export const { setSearchKeyword, setSelectedCategory } = productSlice.actions;
export const selectProducts = (state) => state.products.items;
export const selectCategories = (state) => state.products.categories;
export const selectPagination = (state) => state.products.pagination;
export const selectProductsLoading = (state) => state.products.loading;
export const selectSearchKeyword = (state) => state.products.searchKeyword;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export default productSlice.reducer;
