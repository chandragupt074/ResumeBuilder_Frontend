import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  fetchProfile,
  verifyEmail,
  resendVerification,
} from './authAPI';

const storedUser = localStorage.getItem('user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  verification: {
    loading: false,
    status: null, // 'success' | 'error' | null
    message: null,
  },
  resend: {
    loading: false,
    message: null,
  },
};

const extractError = (err) =>
  err.response?.data?.message || err.response?.data || err.message || 'Something went wrong';

export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await registerUser(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await loginUser(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchProfile();
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const confirmEmail = createAsyncThunk(
  'auth/confirmEmail',
  async (token, { rejectWithValue }) => {
    try {
      const res = await verifyEmail(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      const res = await resendVerification(email);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { token, ...user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { token, ...user } = action.payload;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify email
      .addCase(confirmEmail.pending, (state) => {
        state.verification.loading = true;
        state.verification.status = null;
        state.verification.message = null;
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.verification.loading = false;
        state.verification.status = 'success';
        state.verification.message =
          action.payload?.message || 'Email verified successfully';
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.verification.loading = false;
        state.verification.status = 'error';
        state.verification.message = action.payload || 'Verification failed';
      })
      // Resend verification
      .addCase(resendVerificationEmail.pending, (state) => {
        state.resend.loading = true;
        state.resend.message = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.resend.loading = false;
        state.resend.message =
          action.payload?.message || 'Verification email sent';
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resend.loading = false;
        state.resend.message = action.payload || 'Failed to resend email';
      });
  },
});

export const { logout, clearAuthError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
