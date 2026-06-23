import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (!env.VITE_RAZORPAY_KEY_ID) {
    // eslint-disable-next-line no-console
    console.warn(
      '\n⚠️  VITE_RAZORPAY_KEY_ID is not set.\n' +
        '   Payments/checkout will not work until you:\n' +
        '   1. Create a .env file in the project root (copy from .env.example)\n' +
        '   2. Add VITE_RAZORPAY_KEY_ID=rzp_test_yourkey\n' +
        '   3. Restart this dev server\n'
    );
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
  };
});
