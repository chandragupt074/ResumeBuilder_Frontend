# Resume Builder - Frontend

React + Tailwind + Redux Toolkit + React Router + Axios frontend for the
Spring Boot Resume Builder API.

## Setup

```bash
npm install
cp .env.example .env   # add your Razorpay key if you have one
npm run dev
```

App runs at `http://localhost:5173`. Backend is expected at
`http://localhost:8081` (see `src/api/axiosInstance.js` to change).

## Environment variables

| Variable | Description |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key (`rzp_test_...` / `rzp_live_...`) used to open checkout. Leave empty to disable checkout (shows an error toast instead). |

## Folder structure

```
src/
├── api/
│   ├── axiosInstance.js     # axios instance + token interceptor
│   └── apiPaths.js           # all backend endpoint paths
├── app/
│   └── store.js              # redux store
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
│   ├── resumeEditor/          # the split-screen wizard + live preview
│   │   ├── ResumePreview.jsx  # renders resume data as a mini live resume
│   │   ├── ThemeModal.jsx     # Templates / Color Palettes tabs + upgrade
│   │   ├── steps.js           # ordered list of wizard steps
│   │   └── steps/             # one file per wizard step
│   ├── templates/
│   │   ├── templateAPI.js
│   │   └── templateSlice.js
│   └── payment/
│       ├── paymentAPI.js
│       ├── paymentSlice.js
│       └── useRazorpayCheckout.js  # shared checkout flow (Pricing page + ThemeModal)
├── components/
│   ├── common/
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   └── ErrorBoundary.jsx
│   └── layout/
│       ├── AuthLayout.jsx
│       ├── Navbar.jsx          # used on Dashboard/Templates/Pricing/Profile/Billing
│       └── DashboardLayout.jsx
├── pages/
│   ├── LandingPage.jsx        # public home page (Login/Signup CTAs)
│   ├── DashboardPage.jsx      # list / create / delete resumes, live mini-previews
│   ├── ResumeEditorPage.jsx   # multi-step wizard + live preview + theme modal
│   ├── TemplatesPage.jsx      # standalone template gallery
│   ├── PricingPage.jsx        # plans + Razorpay checkout
│   ├── ProfilePage.jsx
│   ├── PaymentHistoryPage.jsx
│   └── NotFoundPage.jsx
├── routes/
│   ├── ProtectedRoute.jsx     # requires auth
│   └── PublicRoute.jsx        # redirects logged-in users away from / , /login, /register
├── utils/
│   ├── validation.js
│   ├── razorpay.js            # checkout script loader + key
│   └── templateMeta.js        # template codes <-> display names/layouts/colors
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

The resume editor intentionally skips the main Navbar — it has its own
top bar (logo, user name + plan badge, logout) plus a step-progress bar,
matching a focused, full-width editing experience.

## Resume editor (multi-step + live preview)

`ResumeEditorPage` renders a step progress bar (`STEPS` in
`features/resumeEditor/steps.js`) with Personal Info, Contact, Work
Experience, Education, Skills, Projects, Certifications, Languages, and
Interests. Each step is its own component under
`features/resumeEditor/steps/`, all sharing the same
`items / onAdd / onUpdate / onRemove` (list sections) or `data / onChange`
(single-object sections) prop pattern.

The right-hand panel renders `ResumePreview`, which re-renders live as the
form data changes — no debounce, just controlled state flowing straight
through. Saves are persisted on "Next", "Save & Exit", and theme changes.

## Templates & themes

`GET /api/templates` returns:

```json
{
  "availableTemplates": ["01"],
  "subscriptionPlan": "Basic",
  "isPremium": false,
  "allTemplates": ["01", "02", "03"]
}
```

`src/utils/templateMeta.js` maps each code to a display name, a layout
kind (`sidebar` / `single-column` / `compact`), and offers a fixed set of
color palettes. The selected template + color are encoded together into
the single `template` string the backend stores, as `"01-violet"` — parse
with `parseTemplateValue()`, build with `buildTemplateValue()`.

`ThemeModal` (opened via "🎨 Change Theme" in the editor) shows two tabs —
Templates and Color Palettes — locks templates not in
`availableTemplates` (unless `isPremium`), and includes an inline
"Upgrade to Premium ₹999" button that opens Razorpay checkout right there
via `useRazorpayCheckout`.

## Pricing & Payments

Both the Pricing page and the in-editor upgrade banner share
`useRazorpayCheckout` (`features/payment/useRazorpayCheckout.js`), which:

1. Calls `POST /api/payment/create-order` with `{ planType: "premium" }`
2. Loads the Razorpay checkout script
3. Opens checkout using `razorpayOrderId` / `amount` / `currency` from
   the created order
4. On success, refreshes payment history + profile (so the plan badge
   updates)

Update the request body or add a payment-verification call here if your
backend's contract differs.
