# Resume Builder - Frontend

React + Tailwind + Redux Toolkit + React Router + Axios frontend for the
Spring Boot Resume Builder API.

![Signup/Login Page](https://github.com/chandragupt074/ResumeBuilder_Frontend/blob/5bff561b6dcfe7584254e8155de8ab8f773daf49/Screenshot%202026-06-24%20014642.png)
![Resume Creater Page](https://github.com/chandragupt074/ResumeBuilder_Frontend/blob/5bff561b6dcfe7584254e8155de8ab8f773daf49/Screenshot%202026-06-24%20173311.png)

![Payment page](https://github.com/chandragupt074/ResumeBuilder_Frontend/blob/5bff561b6dcfe7584254e8155de8ab8f773daf49/Screenshot%202026-06-24%20173345.png)
![Subscription plan](https://github.com/chandragupt074/ResumeBuilder_Frontend/blob/5bff561b6dcfe7584254e8155de8ab8f773daf49/Screenshot%202026-06-24%20173422.png)

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`. Backend is expected at
`http://localhost:8081` (see `src/api/axiosInstance.js` to change).



## Folder structure

```
src/
├── api/
│   ├── axiosInstance.js    
│   └── apiPaths.js          
├── app/
│   └── store.js             
├── features/
│   ├── auth/
│   │   ├── authAPI.js
│   │   ├── authSlice.js
│   │   ├── RegisterPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── VerifyEmailPage.jsx
│   │   └── ResendVerificationPage.jsx
│   ├── resumes/
│   │   ├── resumeAPI.js
│   │   └── resumeSlice.js
│   ├── resumeEditor/         
│   │   ├── ResumePreview.jsx 
│   │   ├── ThemeModal.jsx    
│   │   ├── steps.js         
│   │   └── steps/            
│   ├── templates/
│   │   ├── templateAPI.js
│   │   └── templateSlice.js
│   └── payment/
│       ├── paymentAPI.js
│       ├── paymentSlice.js
│       └── useRazorpayCheckout.js 
├── components/
│   ├── common/
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   └── ErrorBoundary.jsx
│   └── layout/
│       ├── AuthLayout.jsx
│       ├── Navbar.jsx         
│       └── DashboardLayout.jsx
├── pages/
│   ├── LandingPage.jsx        
│   ├── DashboardPage.jsx     
│   ├── ResumeEditorPage.jsx   
│   ├── TemplatesPage.jsx     
│   ├── PricingPage.jsx        
│   ├── ProfilePage.jsx
│   ├── PaymentHistoryPage.jsx
│   └── NotFoundPage.jsx
├── routes/
│   ├── ProtectedRoute.jsx     
│   └── PublicRoute.jsx       
├── utils/
│   ├── validation.js
│   ├── razorpay.js           
│   └── templateMeta.js       
├── App.jsx
└── main.jsx
```

## Routing

| Route | Page | Layout |
|---|---|---|
| `/` | LandingPage | Public only (redirects to `/dashboard` if logged in) |
| `/register` | RegisterPage | Public only |
| `/login` | LoginPage | Public only |
| `/verify-email` | VerifyEmailPage | Public |
| `/resend-verification` | ResendVerificationPage | Public |
| `/dashboard` | DashboardPage | Protected, main Navbar |
| `/resume/:id` | ResumeEditorPage | Protected, own minimal top bar (no main Navbar) |
| `/templates` | TemplatesPage | Protected, main Navbar |
| `/pricing` | PricingPage | Protected, main Navbar |
| `/profile` | ProfilePage | Protected, main Navbar |
| `/payment/history` | PaymentHistoryPage | Protected, main Navbar |


