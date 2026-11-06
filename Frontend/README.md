# 🎨 MyFluffy Shop — React Frontend Client

This is the web-client interface for the **MyFluffy Shop** e-commerce store. Built using **React (v19)** and **Vite (v8)**, it delivers a smooth single-page user experience featuring stateful navigation, catalog filtering, real-time shopping cart calculations, secure checkout forms, and a complete admin management dashboard.

---

## 🚀 Features

* **State-Based Navigation Routing**: Fast, transition-friendly page switches using React state variables rather than complex browser history stacks.
* **Global Context Management**:
  * `AuthContext`: Manages sign-up, sign-in, JWT storage in `localStorage`, and handles conditional routing for administrators.
  * `CartContext`: Houses the shopping cart items state, syncing changes, calculating taxes/shipping/discounts, and preparing order payloads.
* **Tailored Aesthetic Design**: Structured entirely with vanilla CSS files, making use of dynamic transition properties, custom fonts (Google Fonts), hover micro-animations, and full mobile-responsive flexbox and grid layouts.
* **Unified API Pipeline**: Uses a configured Axios instance featuring interceptors to automatically attach the user's JWT bearer tokens to outbound REST requests.
* **Component Modals**: Globally managed modals (such as `ProductDetailsModal`) to keep DOM nodes clean and reuse UI layouts.

---

## 🗂️ Project Structure

```
Frontend/MyFluffy/
├── public/                 # Static public assets (logos, icons)
├── src/                    # Source files
│   ├── assets/             # Brand images and illustration files
│   ├── component/          # UI components grouped by feature:
│   │   ├── AboutUs/        # Company biography page
│   │   ├── Admin/          # Sales statistics, product additions, category controls
│   │   ├── Cart/           # Drawer/slide-out panel showing cart items
│   │   ├── Checkout/       # Billing/shipping forms and final order review
│   │   ├── Contact/        # Message form for user feedback
│   │   ├── Login/          # Auth forms (Sign In & Sign Up toggle)
│   │   ├── Navbar/         # Main interactive top navigation bar
│   │   ├── Orders/         # Past transaction histories
│   │   ├── ProductDetails/ # Detailed view modal with stock counts & description
│   │   ├── Shop/           # Grid listing with category filtering buttons
│   │   ├── Toast/          # Banner notifications for actions
│   │   └── home/           # Landing page with hero slide and featured items
│   │
│   ├── context/            # React Global state managers (Auth, Cart)
│   ├── style/              # Bespoke Vanilla CSS layouts (animations, theme)
│   ├── utils/              # API Client (Axios wrapper with interceptors)
│   ├── App.jsx             # Main Application root & layout router
│   └── main.jsx            # Application index entrypoint
│
├── vite.config.js          # Vite server and build config
├── eslint.config.js        # Code quality validation rules
├── package.json            # Scripts & project dependencies
└── README.md               # Frontend documentation (this file)
```

---

## 🛠️ Installation & Setup

Before running the frontend, ensure the [Backend Service](file:///d:/MY%20project/MyFluffy-Shop-1/Backend/README.md) is initialized and active.

### 1. Install Project Packages
Navigate to the frontend folder and run installation:
```bash
cd Frontend/MyFluffy
npm install
```

### 2. Configure Endpoint URL
The frontend is configured to call the local backend server at `http://localhost:3000/api`. If your backend port differs, update the `API_BASE_URL` inside [src/utils/api.js](file:///d:/MY%20project/MyFluffy-Shop-1/Frontend/MyFluffy/src/utils/api.js#L3).

### 3. Run Dev Server
Launch the development environment:
```bash
npm run dev
```
*Your application will run by default at [http://localhost:5173](http://localhost:5173).*

---

## 📦 Build & Production

To compile the codebase for hosting distribution:

1. **Build Assets**:
   ```bash
   npm run build
   ```
   *Creates a static, optimized distribution bundle in the `/dist` directory.*

2. **Preview Build Locally**:
   ```bash
   npm run preview
   ```
   *Serves the production build locally to test page caching and asset links before uploading to host environments.*

---

## 🎨 Styles and Customizations
CSS variables are defined globally to handle primary themes (fluffy pastels, soft backgrounds, dark neutral texts). The styling structure supports:
* Smooth hover overlays for cards.
* Standardized slide-in animations for the Cart Drawer.
* Fluid media query break-points for iPad, mobile portraits, and desktop screens.
