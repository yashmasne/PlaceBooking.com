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
- **Guest Reviews:** 1–5 star ratings with written reviews (one per guest per place, editable), a rating breakdown, sorting, and "Verified stay" badges for guests who booked. Written reviews are blended into each listing's rating.
- **Location Map:** "Where you'll be" section with an embedded Google Map of the listing's address.
- **Recently Viewed:** The homepage remembers the last 8 stays you opened (stored in your browser).
- **Feedback & Dialogs:** Toast notifications for logins, wishlist, bookings, payments and listings, plus styled confirmation dialogs for destructive actions.

### Reviews API
| Method & route | Auth | Description |
|---|---|---|
| `GET /api/places/:id/reviews` | — | Reviews for a place (newest first) plus its `rating` and `reviewsCount` |
| `POST /api/places/:id/reviews` | Logged in | Create or update your review: `{ rating: 1-5, comment: 10-1000 chars }`. Hosts can't review their own listing |
| `DELETE /api/reviews/:id` | Review author | Delete your own review |

## Quick Start

Requires Node.js 18 or newer (tested on Node.js 25).

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

To try booking, reviews and wishlists, create an account with **Sign up** — the sample `testuser@gmail.com` account's password is not documented.

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