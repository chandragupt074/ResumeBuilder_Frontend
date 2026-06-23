import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import resumeReducer from '../features/resumes/resumeSlice';
import templateReducer from '../features/templates/templateSlice';
import paymentReducer from '../features/payment/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resumes: resumeReducer,
    templates: templateReducer,
    payment: paymentReducer,
  },
});
