import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllTemplates } from './templateAPI';

const extractError = (err) =>
  err.response?.data?.message || err.response?.data || err.message || 'Something went wrong';

// Backend response shape:
// {
//   availableTemplates: ["01"],
//   subscriptionPlan: "Basic",
//   isPremium: false,
//   allTemplates: ["01", "02", "03"]
// }
const initialState = {
  availableTemplates: [],
  allTemplates: [],
  subscriptionPlan: 'Basic',
  isPremium: false,
  loading: false,
  error: null,
};

export const fetchTemplates = createAsyncThunk(
  'templates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllTemplates();
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || {};
        state.availableTemplates = data.availableTemplates || [];
        state.allTemplates = data.allTemplates || [];
        state.subscriptionPlan = data.subscriptionPlan || 'Basic';
        state.isPremium = !!data.isPremium;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default templateSlice.reducer;
