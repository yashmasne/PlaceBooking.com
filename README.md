# PlaceBooking.com

A full-stack place booking application for local development and classroom presentation.

## Stack
- React 18 + Vite
- Tailwind CSS
- Node.js + Express
- JWT + HTTP-only cookies
- bcrypt password hashing
- Local JSON persistence for zero-setup development
- Local image uploads by default
- Optional MongoDB, Cloudinary and Razorpay integrations

## Project structure
```text
PlaceBooking.com-master/
├── Server/
│   ├── data/                 # created automatically
│   ├── uploads/              # local images
│   ├── models/               # retained Mongoose schemas for future Mongo mode
│   ├── index.js
│   ├── .env
│   └── package.json
└── Frontend/
    ├── src/
    ├── public/
    ├── .env
    └── package.json
```

## Run
### Terminal 1
```powershell
cd Server
npm install
npm run dev
```

### Terminal 2
```powershell
cd Frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

Backend test: `http://localhost:8000/api/test`

## Local demo has no external service requirement
You do not need to install or start MongoDB just to run the project. The backend automatically creates `Server/data/db.json` and persists users, places and bookings there.

You also do not need Cloudinary to upload photos locally, and payment uses a demo checkout unless Razorpay credentials are configured.

## Main features
- Register / login / logout
- Browse properties
- Add, edit and delete owned properties
- Upload photos
- Booking date and guest validation
- Prevent overlapping bookings
- Booking history
- Demo payment flow
- Optional real Razorpay checkout

## Reset demo data
Stop the backend and delete:
```text
Server/data/db.json
```
Then start the backend again.

## 👥 Team Members & Contribution

| Team Member | Role | Contribution |
|---|---|---:|
| **Yash Masne** | Team Leader | **35%** |
| Prathmesh Borade | Member | **10%** |
| Prathmesh Yerawar | Member | **20%** |
| Tushar Ranjan Pasayat | Member | **15%** |
| Chandrashekhar Samshete | Member | **20%** |
| **Total** | | **100%** |

### Contribution Details

- **Yash Masne — 35%:** Project coordination, frontend development, backend integration, booking features, GitHub management, testing and presentation.
- **Prathmesh Borade — 10%:** Frontend/UI assistance and design improvements.
- **Prathmesh Yerawar — 20%:** Backend development, REST APIs and server-side functionality.
- **Tushar Ranjan Pasayat — 15%:** Booking functionality and accommodation management.
- **Chandrashekhar Samshete — 20%:** Testing, debugging, documentation and project validation.