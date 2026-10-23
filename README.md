# PlaceBooking.com

A premium full-stack accommodation booking platform inspired by Airbnb, engineered for commercial-grade aesthetics, responsive discovery, and seamless reservation workflows.

## Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, React Icons, Date-fns, Axios
- **Backend:** Node.js, Express, JWT, HTTP-only Cookies, Bcrypt
- **Persistence:** Local JSON database for zero-setup development + full MongoDB Mongoose integration
- **Media & Payments:** Local file uploads + optional Cloudinary and Razorpay integration

## Key Features
- **Discovery & Categories:** Scrollable category filters (*Amazing views, Beachfront, Cabins, Countryside, Design stays, Pools, Lakefront, City apartments*) with instant live filtering.
- **Search & Filters:** Real-time search across destinations, properties, price ranges, and guest capacities.
- **Wishlists:** One-tap heart save/remove with persistent per-user storage.
- **Property Details:** Comprehensive 2-column layout with photo lightbox, verified host highlights, amenities grid, and sticky booking card.
- **Booking & Availability:** Date-range conflict protection, guest capacity enforcement, night math, and status tracking (*Payment Pending → Paid ✓*).
- **Payment Verification:** Safe zero-credential demo checkout with HMAC-ready real Razorpay fallback.
- **Hosting Portal:** Add, edit, and manage accommodations with photo uploads and category configurations.

## Quick Start

### Backend Server
```powershell
cd Server
npm install
npm run dev
```

### Frontend Web App
```powershell
cd Frontend
npm install
npm run dev
```

Then visit: `http://localhost:5173`
API health endpoint: `http://localhost:8000/api/health`

## Automated Tests & Verification
- Backend tests: `npm test` inside `Server/`
- Frontend build: `npm run build` inside `Frontend/`

## 👥 Team Members & Contribution

| Team Member | Role | Contribution |
|---|---|---:|
| **Yash Masne** | Team Leader | **35%** |
| Prathmesh Borade | Member | **10%** |
| Prathmesh Yerawar | Member | **20%** |
| Tushar Ranjan Pasayat | Member | **15%** |
| Chandrashekhar Samshete | Member | **20%** |
| **Total** | | **100%** |