# PlaceBooking.com

A premium full-stack accommodation booking platform inspired by Airbnb, engineered for commercial-grade aesthetics, responsive discovery, and seamless reservation workflows.

## Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, React Icons, Date-fns, Axios
- **Backend:** Node.js, Express, JWT, HTTP-only Cookies, Bcrypt
- **Persistence:** Local JSON database for zero-setup development + full MongoDB Mongoose integration
- **Media & Payments:** Local file uploads + optional Cloudinary and Razorpay integration

## Key Features
- **Discovery & Categories:** Scrollable category filters (*Amazing views, Beachfront, Cabins, Countryside, Design stays, Pools, Lakefront, Luxury stays, Mountains, City apartments*) across 41 diverse Indian properties (Jaipur, Kochi, Goa, Shimla, Lonavala, Mumbai, Bengaluru, Udaipur, Manali, Wayanad, Munnar, Alleppey, etc.).
- **Search & Filters:** Real-time search across destinations, properties, price ranges, and guest capacities.
- **Wishlists:** One-tap heart save/remove with persistent per-user storage.
- **Property Details:** Comprehensive 2-column layout with photo lightbox, verified host highlights, amenities grid, and sticky booking card.
- **Booking & Availability:** Date-range conflict protection, guest capacity enforcement, night math, and status tracking (*Payment Pending → Paid ✓*).
- **Multi-Option Payment System:** Integrated Razorpay checkout supporting:
  - **UPI:** Google Pay, PhonePe, Paytm, and custom UPI ID
  - **Cards:** Credit/Debit Cards (Visa, MasterCard, RuPay, Amex) with 16-digit real-time formatting
  - **Net Banking:** Popular Indian banks (HDFC, SBI, ICICI, Axis, Kotak, PNB)
  - **Wallets:** Paytm, Amazon Pay, PhonePe, MobiKwik
  - **Security:** HMAC SHA256 signature verification, server-calculated price anti-tampering, 12% GST & 5% service fee itemization, and Webhook reconciliation (`POST /api/payment/webhook`).
- **Hosting Portal:** Add, edit, and manage accommodations with photo uploads and category configurations.

## Quick Start

### Backend Server
```powershell
cd Server
npm install
npm run seed   # Populates the 41 accommodations (idempotent)
npm run dev    # Starts on http://localhost:8000
```

### Frontend Web App
```powershell
cd Frontend
npm install
npm run dev    # Starts on http://localhost:5173
```

Then visit: `http://localhost:5173`
API health endpoint: `http://localhost:8000/api/health`

## Automated Tests & Verification
- Backend tests: `npm test` inside `Server/` (7 unit tests covering pricing, dates, conflicts, seed integrity, signatures, and webhooks)
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