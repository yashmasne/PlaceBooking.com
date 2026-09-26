# RUN ME FIRST — PlaceBooking.com

## What I changed

The project has been converted to a **local-first VS Code setup** so you can run the complete application without first installing MongoDB, configuring Cloudinary, or creating Razorpay credentials.

### Backend fixes
- Removed the broken/unused `moongoose` dependency.
- Replaced the mandatory MongoDB startup with a persistent local JSON database.
- Added automatic database creation at `Server/data/db.json`.
- Added local image storage at `Server/uploads/`.
- Cloudinary remains optional; if credentials are supplied, uploads can use it.
- Razorpay remains optional; without credentials the payment screen uses safe demo mode.
- Added authentication validation and consistent API errors.
- Added booking date-overlap protection.
- Added owner checks for editing/deleting places.
- Added guest-limit validation.
- Added server-side booking-price calculation.
- Added `/api/test` and `/api/health` endpoints.
- Fixed local cookie/CORS behavior.
- Added cleanup of temporary uploaded files.

### Frontend fixes
- Kept the existing React/Vite UI and API structure.
- Made payment flow work in local demo mode without Razorpay credentials.
- Added the Razorpay checkout script for real credentials.
- Improved payment/loading/error handling.
- Kept the existing booking, account, places and upload screens.

## Run it

### Terminal 1 — Backend
```powershell
cd Server
npm install
npm run dev
```

You should see:
```text
PlaceBooking.com backend is running
API:    http://localhost:8000/api
Test:   http://localhost:8000/api/test
Storage: Local JSON database
Images:  Local uploads
Payment: Demo mode
```

### Terminal 2 — Frontend
```powershell
cd Frontend
npm install
npm run dev
```

Then open:
```text
http://localhost:5173
```

## Test in this exact order

1. Open the website.
2. Register a new account.
3. Login.
4. Go to Account → My Places.
5. Add a place.
6. Add photos if desired.
7. Save it.
8. Return home and open the place.
9. Choose dates and guests.
10. Book it.
11. Open Account → Bookings.
12. Open the booking.
13. Click Pay. Demo mode completes the payment without external credentials.

## If you want a clean reset

Stop the backend and delete:
```text
Server/data/db.json
```

Restart the backend. Demo places will be recreated automatically.

## Important

You do **not** need to start MongoDB for this version.

You do **not** need Cloudinary for local photo uploads.

You do **not** need Razorpay keys for the demo payment flow.
