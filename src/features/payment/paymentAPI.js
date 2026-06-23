import axiosInstance from '../../api/axiosInstance';
import { API_PATHS } from '../../api/apiPaths';

export const createPaymentOrder = (data) =>
  axiosInstance.post(API_PATHS.PAYMENT.CREATE_ORDER, data);

export const verifyPayment = (data) =>
  axiosInstance.post(API_PATHS.PAYMENT.VERIFY, data);

export const getPaymentHistory = () =>
  axiosInstance.get(API_PATHS.PAYMENT.HISTORY);

export const getPaymentOrderById = (orderId) =>
  axiosInstance.get(API_PATHS.PAYMENT.ORDER_BY_ID(orderId));
