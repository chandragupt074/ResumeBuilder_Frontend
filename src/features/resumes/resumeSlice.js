import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  uploadResumeImages,
} from './resumeAPI';

const extractError = (err) =>
  err.response?.data?.message || err.response?.data || err.message || 'Something went wrong';

const initialState = {
  resumes: [],
  currentResume: null,
  loading: false,
  saving: false,
  error: null,
};

export const fetchResumes = createAsyncThunk(
  'resumes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllResumes();
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resumes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await getResumeById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const addResume = createAsyncThunk(
  'resumes/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createResume(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const editResume = createAsyncThunk(
  'resumes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateResume(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const removeResume = createAsyncThunk(
  'resumes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteResume(id);
      return id;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const uploadResumeImagesThunk = createAsyncThunk(
  'resumes/uploadImages',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await uploadResumeImages(id, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

const resumeSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
    clearResumeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addResume.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addResume.fulfilled, (state, action) => {
        state.saving = false;
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(addResume.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(editResume.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(editResume.fulfilled, (state, action) => {
        state.saving = false;
        state.currentResume = action.payload;
        const index = state.resumes.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.resumes[index] = action.payload;
      })
      .addCase(editResume.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(removeResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
      })
      .addCase(removeResume.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(uploadResumeImagesThunk.fulfilled, (state, action) => {
        state.currentResume = action.payload;
      })
      .addCase(uploadResumeImagesThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrentResume, clearResumeError } = resumeSlice.actions;
export default resumeSlice.reducer;
