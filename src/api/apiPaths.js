export const API_PATHS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    VALIDATE: '/auth/validate',
    UPLOAD_IMAGE: '/auth/upload-image',
    VERIFY_EMAIL: '/auth/register/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  RESUMES: {
    CREATE: '/resumes',
    GET_ALL: '/resumes',
    GET_BY_ID: (id) => `/resumes/${id}`,
    UPDATE: (id) => `/resumes/${id}`,
    DELETE: (id) => `/resumes/${id}`,
    UPLOAD_IMAGES: (id) => `/resumes/${id}/upload-images`,
  },
  TEMPLATES: {
    GET_ALL: '/templates',
  },
  PAYMENT: {
    CREATE_ORDER: '/payment/create-order',
    VERIFY: '/payment/verify',
    HISTORY: '/payment/history',
    ORDER_BY_ID: (orderId) => `/payment/order/${orderId}`,
  },
  EMAIL: {
    SEND_RESUME: '/email/send-resume',
  },
};
