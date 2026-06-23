import axiosInstance from '../../api/axiosInstance';
import { API_PATHS } from '../../api/apiPaths';

export const getAllTemplates = () =>
  axiosInstance.get(API_PATHS.TEMPLATES.GET_ALL);
