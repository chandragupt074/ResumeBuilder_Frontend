import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentOrderById,
} from './paymentAPI';

const extractError = (err) =>
  err.response?.data?.message || err.response?.data || err.message || 'Something went wrong';

const initialState = {
  history: [],
  currentOrder: null,
  creatingOrder: false,
  verifying: false,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createPaymentOrder(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payment/confirm',
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyPayment(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPaymentHistory();
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const fetchPaymentOrderById = createAsyncThunk(
  'payment/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await getPaymentOrderById(orderId);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.creatingOrder = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creatingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creatingOrder = false;
        state.error = action.payload;
      })

      .addCase(confirmPayment.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.verifying = false;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      })

      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPaymentOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchPaymentOrderById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
