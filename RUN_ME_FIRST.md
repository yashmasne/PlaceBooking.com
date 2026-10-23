# RUN ME FIRST — PlaceBooking.com

Welcome to the newly elevated **PlaceBooking** accommodation platform, transformed into a commercial-grade, Airbnb-inspired experience with full-stack functionality.

## Core Features Implemented & Verified

### 1. Modern Airbnb-Style Discovery & Homepage
- **Category Navigation Bar:** Scrollable categories (*Amazing views, Beachfront, Cabins, Countryside, Design stays, Pools, Lakefront, City apartments*) with live real-time filtering.
- **Interactive Multi-Filter Bar:** Real-time search by destination, guest count, max price, and instant sorting (*Recommended, Price Low to High, Price High to Low, Highest Rated*).
- **Curated Property Cards:** High-definition photography, star ratings, bedroom counts, nightly price in ₹ INR, and interactive Wishlist hearts.
- **Why Reserve with Us Section:** Modern guarantee and reassurance badges.

### 2. Wishlist & Favorites System
- **Interactive Heart Action:** One-tap save/remove from any card or property page.
- **Dedicated Wishlist View (`/account/wishlist`):** Access your saved collections with instant links back to details.
- **Persistent Backend:** Saved favorites are stored per-user in the database.

### 3. Comprehensive Property Details (`/place/:id`)
- **Rich Two-Column Layout:** Photo gallery, verified host banner, room setup (*guests, bedrooms, beds, baths*).
- **Amenities Grid:** Wifi, Free parking, Smart TV, Pets allowed, Private entrance, and Audio with modern vector icons.
- **Sticky Booking Widget:** Real-time date math, guest count controls, pricing breakdown, and PlaceBooking verified guarantee.
- **Full-Screen Photo Modal:** Fixed high-resolution lightbox viewer with smooth backdrop.

### 4. Robust Booking Flow & Payment Verification
- Server-side date validation (*check-out must be after check-in*).
- Automatic overlapping reservation protection to prevent double-booking.
- **Booking Status Management:** Seamless transition from `Payment Pending` to `Paid ✓`.
- **Payment Modes:** Instant safe demo mode (default zero-credentials setup) or real Razorpay checkout.
- **Cancellation:** Ability for travelers to cancel their reservations with confirmation.

### 5. Dual Database Architecture
- **Local JSON Database (Default):** Zero setup required. Runs out-of-the-box storing users, places, bookings, and wishlists in `Server/data/db.json`.
- **MongoDB Integration (Optional):** Set `USE_MONGO=true` and provide `MONGO_URL` to connect to MongoDB with full Mongoose schemas.

---

## How to Start Locally

### Step 1: Start Backend (Terminal 1)
```powershell
cd Server
npm install
npm run dev
```

You should see:
```text
========================================
 PlaceBooking.com backend is running
 API:    http://localhost:8000/api
 Test:   http://localhost:8000/api/test
 Storage: Local JSON database
 Images:  Local uploads
 Payment: Demo mode
========================================
```

### Step 2: Start Frontend (Terminal 2)
```powershell
cd Frontend
npm install
npm run dev
```

Open your browser to:
```text
http://localhost:5173
```

---

## Automated Tests

Run the backend unit test suite:
```powershell
cd Server
npm test
```

Build the production frontend bundle:
```powershell
cd Frontend
npm run build
```

---

## Recommended Test Order

1. Open `http://localhost:5173`.
2. Browse properties across different categories (*Amazing views, Beachfront, Cabins, Pools*).
3. Search for a destination (e.g. *Lonavala*, *Goa*, *Manali*, *Pune*).
4. Tap the **Heart** icon on any property card to save it to your Wishlist (log in when prompted; or use quick demo account: `testuser@gmail.com` / `password`).
5. Open a property details page to explore the photo gallery and amenities.
6. Select check-in and checkout dates in the sticky booking widget and tap **Reserve Stay**.
7. Navigate to **Account → My Bookings**, click **Pay Now**, and complete the instant verification.
8. Check **Account → Wishlists** to review your saved collections.
9. Click **Become a Host** in the header to list a new accommodation.
