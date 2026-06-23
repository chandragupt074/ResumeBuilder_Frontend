import axiosInstance from '../../api/axiosInstance';
import { API_PATHS } from '../../api/apiPaths';

export const registerUser = (data) =>
  axiosInstance.post(API_PATHS.AUTH.REGISTER, data);

export const loginUser = (data) =>
  axiosInstance.post(API_PATHS.AUTH.LOGIN, data);

export const fetchProfile = () =>
  axiosInstance.get(API_PATHS.AUTH.PROFILE);

export const validateToken = () =>
  axiosInstance.get(API_PATHS.AUTH.VALIDATE);

export const verifyEmail = (token) =>
  axiosInstance.get(API_PATHS.AUTH.VERIFY_EMAIL, { params: { token } });

export const resendVerification = (email) =>
  axiosInstance.post(API_PATHS.AUTH.RESEND_VERIFICATION, { email });

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
