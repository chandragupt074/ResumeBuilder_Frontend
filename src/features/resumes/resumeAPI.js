import axiosInstance from '../../api/axiosInstance';
import { API_PATHS } from '../../api/apiPaths';

export const getAllResumes = () =>
  axiosInstance.get(API_PATHS.RESUMES.GET_ALL);

export const getResumeById = (id) =>
  axiosInstance.get(API_PATHS.RESUMES.GET_BY_ID(id));

export const createResume = (data) =>
  axiosInstance.post(API_PATHS.RESUMES.CREATE, data);

export const updateResume = (id, data) =>
  axiosInstance.put(API_PATHS.RESUMES.UPDATE(id), data);

export const deleteResume = (id) =>
  axiosInstance.delete(API_PATHS.RESUMES.DELETE(id));

export const uploadResumeImages = (id, formData) =>
  axiosInstance.put(API_PATHS.RESUMES.UPLOAD_IMAGES(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const sendResumeEmail = (data) =>
  axiosInstance.post(API_PATHS.EMAIL.SEND_RESUME, data);
