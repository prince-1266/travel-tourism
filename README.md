# TripWell 🌍 - Premium Travel & Tourism Platform

TripWell is a modern, full-stack travel booking, planning, and AI-assisted journaling application. Designed with high-fidelity glassmorphic styling, smooth animations, and a rich dark-theme aesthetic, it offers users a premium platform to plan itineraries, make mock payments, manage bookings, and generate intelligent packing lists.

---

## 🚀 Live Deployments

- **Frontend Application**: [https://travel-tourism-usj1.vercel.app/](https://travel-tourism-usj1.vercel.app/)
- **Backend API**: [https://travel-tourism-backend.vercel.app/](https://travel-tourism-backend.vercel.app/)
- **Live Backend Diagnostics**: [https://travel-tourism-backend.vercel.app/api/auth/diag](https://travel-tourism-backend.vercel.app/api/auth/diag)

---

## 🌟 Key Features

### 1. Trip Planner & Booking System
- **Interactive Itinerary Planner**: Seamlessly choose destinations, configure flight routes, and select premier hotels.
- **Mock Payment Gateway**: Fully integrated checkout workflow using Razorpay SDK, creating and verifying orders securely on the server.
- **Booking Persistence**: Keeps track of booking progress (e.g., `pending` to `confirmed` after successful payment verification).

### 2. AI-Powered Packing Assistant 🎒
- **Customized Lists**: Queries Google Gemini API (`gemini-2.5-flash`) to generate personalized checklists using booking metadata (destination climate, trip duration, number of travelers, hotel details).
- **Completion State**: Saves packing progress (packed items, custom additions, deleted options) in MongoDB to retrieve on refresh.
- **Safety Fallback**: Active offline checklist generator to serve as backup if the AI keys expire.

### 3. Smart AI Travel Chatbot 💬
- Direct context-aware interface utilizing Groq / Gemini AI models.
- Provides real-time guidance on places, local recommendations, packing lists, and regional weather insights.

### 4. User Security & Authentication 🔒
- **Secure Email Verification**: Native SMTP delivery (Gmail API) to dispatch 6-digit registration & reset OTPs.
- **Google One-Tap Login**: Federated identity integration for fast onboarding.
- **Role-Based Routing**: Restricts administrative capabilities (managing flights, hotels, places) to validated admin users.

### 5. Premium Admin Panel 🛠️
- Full dashboard for admins to manage users, update booking statuses, edit available destinations, and populate flight/hotel data.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Axios, Lucide Icons, Google Login SDK |
| **Backend** | Node.js, Express.js, Mongoose, Nodemailer (SMTP), JSON Web Tokens (JWT) |
| **Database** | MongoDB Atlas (Cloud Database) |
| **AI Integration**| Google Generative AI (Gemini 2.5), Groq SDK |
| **Hosting** | Vercel (Frontend & Serverless Backend) |

---

## 📂 Project Structure

```
travel-tourism/
├── backend/            # Express.js Serverless API
│   ├── config/         # Database and third-party setups
│   ├── controllers/    # Route controllers (AI, Booking, Payments, etc.)
│   ├── middleware/     # JWT protection and serverless database connection
│   ├── models/         # MongoDB Mongoose schemas (User, Booking, Otp, Flight)
│   ├── routes/         # Express API routing endpoints
│   ├── server.js       # Main server entrypoint (optimized for serverless)
│   └── vercel.json     # Serverless deployment configuration
├── frontend/           # React.js SPA (Vite)
│   ├── public/         # Static assets (images, logos, favicon)
│   └── src/            
│       ├── api/        # Axios interceptors pointing to live backend
│       ├── components/ # Reusable UI components (Navbar, Layouts, etc.)
│       ├── context/    # Global authentication & notifications context
│       ├── pages/      # View components (Booking, Register, Dashboard, etc.)
│       └── App.js      # App routes and routing layout
└── README.md           # Project presentation (This file)
```

---

## ⚙️ Local Setup and Installation

### Prerequisites
- Node.js installed (v16+)
- MongoDB Atlas cluster or local MongoDB instance active

### 1. Setup Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder and populate it:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ADMIN_EMAIL=your_admin_email_address
   ADMIN_PHONE=+919999999999
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GROQ_API_KEY=your_groq_api_key
   ```
4. Seed the database with default flights, hotels, and locations:
   ```bash
   node seedFlights.js
   node seedAdmin.js
   ```
5. Start the local server:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   PORT=3000
   REACT_APP_API_URL=http://localhost:5001/api
   ```
4. Start the frontend application:
   ```bash
   npm run dev
   ```
   *The application will open automatically on [http://localhost:3000](http://localhost:3000).*

---

## 🧑‍💻 Architecture Design & Serverless Optimizations
- **Cached Database Connection**: Backend endpoints utilize Mongoose connection middleware that checks the readyState and caches the Mongo connection across lambda instances. This mitigates database pooling issues and cuts cold-start delays.
- **Fail Fast Configuration**: Mongoose buffering is disabled (`bufferCommands = false`) to avoid serverless executions hanging and timing out when MongoDB requests stall.
- **Async Mail Delivery**: Registration OTPs are dispatched using Node's `setImmediate` event loop deferral. This allows the backend to send an immediate success response to the frontend client, and perform the heavy SMTP email transmission in the background.
