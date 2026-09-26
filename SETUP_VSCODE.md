# PlaceBooking.com — VS Code setup

## Requirements
- Node.js 18+ (Node.js 20 LTS recommended)
- VS Code

MongoDB, Cloudinary and Razorpay are **not required** for the local demo.

## 1. Open the project
Open `PlaceBooking.com-master` in VS Code. You should see `Server` and `Frontend`.

## 2. Backend terminal
```powershell
cd Server
npm install
npm run dev
```

Expected:
```text
PlaceBooking.com backend is running
API: http://localhost:8000/api
Test: http://localhost:8000/api/test
Storage: Local JSON database
Images: Local uploads
Payment: Demo mode
```

Test: open http://localhost:8000/api/test

## 3. Frontend terminal
Open a second terminal:
```powershell
cd Frontend
npm install
npm run dev
```

Open the Vite URL, normally http://localhost:5173.

## 4. Demo flow
1. Register
2. Login
3. Open Account → My Places
4. Add a place
5. Optionally upload photos
6. Open the place from the home page
7. Select dates and guests
8. Book the place
9. Open My Bookings
10. Open the booking and click Pay — local demo mode completes without Razorpay credentials

## Data location
Local data is saved automatically to:
`Server/data/db.json`

Local uploaded images are saved to:
`Server/uploads/`

To reset the demo database, stop the backend and delete `Server/data/db.json`, then start the backend again.

## Optional integrations
### MongoDB
Set `USE_MONGO=true` and provide your own MongoDB integration before deploying. Local demo mode intentionally does not require MongoDB.

### Cloudinary
Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `Server/.env`. Uploads will then use Cloudinary instead of local storage.

### Razorpay
Set `KEY_ID` and `KEY_SECRET` to real test credentials. The backend will use Razorpay instead of demo payment mode.
