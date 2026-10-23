import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import imageDownloader from "image-downloader";
import crypto from "crypto";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { new30Accommodations } from "./scripts/seed-30-places.js";

// PlaceBooking.com - local-first backend.
// Local demo mode stores data in Server/data/db.json and images in Server/uploads.
// MongoDB, Cloudinary and Razorpay remain optional integrations for deployment.

dotenv.config();

let isMongoConnected = false;
if (process.env.USE_MONGO === "true" && process.env.MONGO_URL) {
  try {
    await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 3000 });
    isMongoConnected = true;
    console.log("Connected to MongoDB successfully.");
  } catch (err) {
    console.warn("MongoDB connection failed, continuing with local JSON database:", err.message);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "placebooking-local-demo-secret-change-me";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

await fs.mkdir(DATA_DIR, { recursive: true });
await fs.mkdir(UPLOAD_DIR, { recursive: true });

const seedDb = {
  users: [],
  places: [
    {
      _id: "p1-amazing-views",
      owner: null,
      title: "The Glasshouse Cliff Villa",
      address: "Lonavala, Maharashtra",
      category: "Amazing views",
      photos: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Perched atop scenic cliffs with panoramic Western Ghats views, floor-to-ceiling glass architecture, private infinity pool and private chef service.",
      perks: ["wifi", "parking", "tv", "entrance"],
      extraInfo: "Check-in at 2 PM. Complimentary artisan breakfast included.",
      checkIn: 14,
      checkOut: 11,
      maxGuests: 6,
      bedrooms: 3,
      beds: 3,
      bathrooms: 3,
      price: 8500,
      rating: 4.96,
      reviewsCount: 38,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p2-beachfront",
      owner: null,
      title: "Sun-Drenched Beachfront Villa",
      address: "Anjuna Beach, Goa",
      category: "Beachfront",
      photos: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Direct walk-on beach access with private sun loungers, tropical garden patio, ocean view balcony, and high-speed fiber internet.",
      perks: ["wifi", "parking", "tv", "pets", "entrance"],
      extraInfo: "Direct beach gate with private keypad lock. Beach towels provided.",
      checkIn: 14,
      checkOut: 11,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
      price: 6200,
      rating: 4.92,
      reviewsCount: 47,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p3-cabins",
      owner: null,
      title: "Whispering Pines Alpine Cabin",
      address: "Old Manali, Himachal Pradesh",
      category: "Cabins",
      photos: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Authentic deodar wood cabin nestled inside pine forests. Features wood-burning fireplace, cedar deck, mountain stream view, and stargazing skylights.",
      perks: ["wifi", "parking", "radio", "entrance"],
      extraInfo: "Firewood stocked daily. Warm fleece blankets and tea bar provided.",
      checkIn: 13,
      checkOut: 10,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      price: 4100,
      rating: 4.89,
      reviewsCount: 63,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p4-countryside",
      owner: null,
      title: "Heritage Coffee Plantation Bungalow",
      address: "Madikeri, Coorg, Karnataka",
      category: "Countryside",
      photos: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Surrounded by 40 acres of private organic Arabica coffee and spice groves. Colonial architecture with wraparound verandahs and farm-to-table cuisine.",
      perks: ["wifi", "parking", "tv", "pets"],
      extraInfo: "Includes guided morning plantation trail walk and fresh coffee tasting.",
      checkIn: 14,
      checkOut: 11,
      maxGuests: 5,
      bedrooms: 3,
      beds: 3,
      bathrooms: 2,
      price: 5400,
      rating: 4.94,
      reviewsCount: 29,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p5-design-stays",
      owner: null,
      title: "Architectural Concrete Design Sanctuary",
      address: "Alibaug, Maharashtra",
      category: "Design stays",
      photos: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Featured in Architectural Digest: cast concrete minimalist structure with private plunge pool, courtyard palm trees, and bespoke brass fittings.",
      perks: ["wifi", "parking", "tv", "entrance"],
      extraInfo: "Equipped with Sonos sound system and curated art collection.",
      checkIn: 15,
      checkOut: 11,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
      price: 9800,
      rating: 4.98,
      reviewsCount: 52,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p6-pools",
      owner: null,
      title: "Royal Oasis Pool Estate",
      address: "Lake Pichola, Udaipur, Rajasthan",
      category: "Pools",
      photos: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Palatial estate featuring private turquoise courtyard pool, marble arches, jharokha balconies, and candlelit courtyard dining.",
      perks: ["wifi", "parking", "tv", "entrance"],
      extraInfo: "Butler service included. Rooftop dinner view of Lake Palace.",
      checkIn: 14,
      checkOut: 11,
      maxGuests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 3,
      price: 11500,
      rating: 4.97,
      reviewsCount: 41,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p7-lakefront",
      owner: null,
      title: "Serene Backwater Lakefront Lodge",
      address: "Vembanad Lake, Alleppey, Kerala",
      category: "Lakefront",
      photos: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Direct waterfront cottage with private wooden dock, kayak rentals, traditional Kerala thatched ceiling, and tranquil lotus canal views.",
      perks: ["wifi", "parking", "pets", "entrance"],
      extraInfo: "Kayaks and lifejackets available on the private jetty.",
      checkIn: 13,
      checkOut: 11,
      maxGuests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      price: 4500,
      rating: 4.91,
      reviewsCount: 34,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "p8-city-apartments",
      owner: null,
      title: "Skyline Luxury Penthouse",
      address: "Koregaon Park, Pune, Maharashtra",
      category: "City apartments",
      photos: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
      ],
      description: "Design-forward top floor residence in prime Koregaon Park. Workstation with 300 Mbps fiber, espresso bar, king suite, and sunset cocktail terrace.",
      perks: ["wifi", "parking", "tv", "entrance"],
      extraInfo: "Self check-in with smart keypad lock.",
      checkIn: 14,
      checkOut: 11,
      maxGuests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      price: 2800,
      rating: 4.93,
      reviewsCount: 56,
      createdAt: new Date().toISOString(),
    },
  ],
  bookings: [],
  wishlists: {},
};

let db;
let writeQueue = Promise.resolve();

function writeDb(nextDb) {
  db = nextDb;
  writeQueue = writeQueue.then(async () => {
    const temp = `${DB_FILE}.tmp`;
    await fs.writeFile(temp, JSON.stringify(db, null, 2), "utf8");
    await fs.rename(temp, DB_FILE);
  });
  return writeQueue;
}

async function readDb() {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.places) || !Array.isArray(parsed.bookings)) {
      throw new Error("Invalid local database format");
    }
    parsed.wishlists = parsed.wishlists || {};
    parsed.payments = Array.isArray(parsed.payments) ? parsed.payments : [];

    const existingIds = new Set(parsed.places.map((p) => String(p._id)));
    let added = false;
    for (const acc of new30Accommodations) {
      if (!existingIds.has(String(acc._id))) {
        parsed.places.push(acc);
        existingIds.add(String(acc._id));
        added = true;
      }
    }
    if (added) {
      await writeDb(parsed);
    }
    return parsed;
  } catch {
    const initialDb = structuredClone(seedDb);
    initialDb.places.push(...new30Accommodations);
    initialDb.payments = [];
    await writeDb(initialDb);
    return initialDb;
  }
}

db = await readDb();

function calculateBookingPrice(place, checkInDate, checkOutDate) {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const nights = Math.max(1, Math.ceil((end - start) / 86400000));
  const nightlyPrice = Number(place.price) || 0;
  const subtotal = nights * nightlyPrice;
  const tax = Math.round(subtotal * 0.12); // 12% GST standard
  const serviceFee = Math.round(subtotal * 0.05); // 5% platform service fee
  const total = subtotal + tax + serviceFee;
  return {
    nights,
    nightlyPrice,
    subtotal,
    tax,
    serviceFee,
    total,
  };
}

function publicUser(user) {
  if (!user) return null;
  return { _id: user._id, name: user.name, email: user.email };
}

function publicPlace(place) {
  return {
    ...place,
    owner: place.owner || null,
    category: place.category || "City apartments",
    rating: Number(place.rating) || 4.9,
    reviewsCount: Number(place.reviewsCount) || 12,
    bedrooms: Number(place.bedrooms) || 1,
    beds: Number(place.beds) || 1,
    bathrooms: Number(place.bathrooms) || 1,
  };
}

function publicBooking(booking) {
  const place = db.places.find((p) => p._id === booking.place);
  const payment = (db.payments || []).find((pay) => pay.bookingId === booking._id || pay.paymentId === booking.paymentId);
  return {
    ...booking,
    place: place ? publicPlace(place) : null,
    payment: payment || null,
  };
}

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

function getToken(req) {
  return req.cookies?.token || null;
}

function getCurrentUser(req) {
  const token = getToken(req);
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return db.users.find((user) => user._id === payload.id) || null;
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const user = getCurrentUser(req);
  if (!user) return sendError(res, 401, "Authentication required");
  req.user = user;
  next();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizePlaceInput(body) {
  return {
    title: String(body.title || "").trim(),
    address: String(body.address || "").trim(),
    photos: Array.isArray(body.addedPhotos)
      ? body.addedPhotos.filter(Boolean)
      : Array.isArray(body.photos)
      ? body.photos.filter(Boolean)
      : [],
    description: String(body.description || "").trim(),
    perks: Array.isArray(body.perks) ? body.perks.filter(Boolean) : [],
    extraInfo: String(body.extraInfo || "").trim(),
    checkIn: Math.min(23, Math.max(0, Math.floor(toNumber(body.checkIn, 14)))),
    checkOut: Math.min(23, Math.max(0, Math.floor(toNumber(body.checkOut, 11)))),
    maxGuests: Math.max(1, Math.floor(toNumber(body.maxGuests, 1))),
    price: Math.max(0, toNumber(body.price, 0)),
    category: String(body.category || "City apartments").trim(),
    bedrooms: Math.max(1, Math.floor(toNumber(body.bedrooms, 1))),
    beds: Math.max(1, Math.floor(toNumber(body.beds, 1))),
    bathrooms: Math.max(1, Math.floor(toNumber(body.bathrooms, 1))),
  };
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

const clientUrls = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  ...clientUrls,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
}));
app.use(express.json({
  limit: "3mb",
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(cookieParser());
app.use("/uploads", express.static(UPLOAD_DIR));

const upload = multer({
  dest: UPLOAD_DIR,
  limits: { files: 20, fileSize: 8 * 1024 * 1024 },
});

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function configureCloudinary() {
  const ready = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  if (!ready) return false;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return true;
}

const cloudinaryReady = configureCloudinary();

async function saveUploadedFile(file) {
  if (cloudinaryReady) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "placebooking",
      resource_type: "auto",
    });
    await fs.rm(file.path, { force: true });
    return result.secure_url;
  }

  const extension = path.extname(file.originalname || "") || ".jpg";
  const safeName = `${crypto.randomUUID()}${extension.replace(/[^a-zA-Z0-9.]/g, "")}`;
  const target = path.join(UPLOAD_DIR, safeName);
  await fs.rename(file.path, target);
  const serverBase = (process.env.SERVER_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
  return `${serverBase}/uploads/${safeName}`;
}

async function saveImageFromLink(link) {
  const tempPath = path.join(UPLOAD_DIR, `link-${crypto.randomUUID()}.jpg`);
  try {
    const result = await imageDownloader.image({ url: link, dest: tempPath });
    const file = { path: result.filename, originalname: path.basename(result.filename) };
    return await saveUploadedFile(file);
  } catch (error) {
    await fs.rm(tempPath, { force: true });
    throw error;
  }
}

app.get("/api/test", (_req, res) => {
  res.json({
    status: "ok",
    message: "PlaceBooking API is running",
    mode: isMongoConnected ? "mongodb" : "local-file",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    database: isMongoConnected ? "mongodb" : "local-file",
    placesCount: db?.places?.length || 0,
    bookingsCount: db?.bookings?.length || 0,
    time: new Date().toISOString(),
  });
});

app.post("/api/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (name.length < 2 || name.length > 80 || !validEmail(email) || password.length < 6) {
      return sendError(res, 400, "Enter a valid name, email and password of at least 6 characters");
    }
    if (db.users.some((user) => user.email === email)) return sendError(res, 409, "Email is already registered");
    const user = { _id: crypto.randomUUID(), name, email, password: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
    await writeDb({ ...db, users: [...db.users, user] });
    return res.status(201).json(publicUser(user));
  } catch (error) {
    console.error("Register error:", error);
    return sendError(res, 500, "Unable to register user");
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const user = db.users.find((item) => item.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) return sendError(res, 401, "Invalid email or password");
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOptions);
    return res.json(publicUser(user));
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, 500, "Unable to log in");
  }
});

app.get("/api/profile", (req, res) => res.json(publicUser(getCurrentUser(req))));

app.post("/api/logout", (_req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json(true);
});

app.post("/api/upload", requireAuth, upload.array("photos", 20), async (req, res) => {
  const files = req.files || [];
  if (!files.length) return sendError(res, 400, "No photos selected");
  try {
    const urls = [];
    for (const file of files) urls.push(await saveUploadedFile(file));
    return res.json(urls);
  } catch (error) {
    console.error("Upload error:", error);
    for (const file of files) await fs.rm(file.path, { force: true }).catch(() => {});
    return sendError(res, 500, "Unable to upload photos");
  }
});

app.post("/api/upload-by-link", requireAuth, async (req, res) => {
  const link = String(req.body?.link || "").trim();
  if (!/^https?:\/\//i.test(link)) return sendError(res, 400, "Enter a valid http/https image URL");
  try {
    return res.json(await saveImageFromLink(link));
  } catch (error) {
    console.error("Link upload error:", error.message);
    return sendError(res, 400, "Unable to download that image URL");
  }
});

app.get("/api/places", (req, res) => {
  let list = db.places;
  const { category, search, minPrice, maxPrice, guests } = req.query;

  if (category && category !== "All") {
    list = list.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter((p) =>
      (p.title || "").toLowerCase().includes(q) ||
      (p.address || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  }
  if (minPrice) {
    const min = Number(minPrice);
    if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
  }
  if (guests) {
    const g = Number(guests);
    if (!Number.isNaN(g)) list = list.filter((p) => p.maxGuests >= g);
  }

  return res.json(list.map(publicPlace));
});

app.get("/api/places/:id", (req, res) => {
  const place = db.places.find((item) => item._id === req.params.id);
  if (!place) return sendError(res, 404, "Place not found");
  return res.json(publicPlace(place));
});

app.get("/api/wishlist", requireAuth, (req, res) => {
  db.wishlists = db.wishlists || {};
  const userPlaceIds = new Set(db.wishlists[req.user._id] || []);
  const places = db.places.filter((p) => userPlaceIds.has(p._id)).map(publicPlace);
  return res.json(places);
});

app.get("/api/user-wishlist-ids", requireAuth, (req, res) => {
  db.wishlists = db.wishlists || {};
  return res.json(db.wishlists[req.user._id] || []);
});

app.post("/api/wishlist/:placeId", requireAuth, async (req, res) => {
  const { placeId } = req.params;
  const place = db.places.find((p) => p._id === placeId);
  if (!place) return sendError(res, 404, "Place not found");

  db.wishlists = db.wishlists || {};
  const list = db.wishlists[req.user._id] || [];
  const exists = list.includes(placeId);
  if (exists) {
    db.wishlists[req.user._id] = list.filter((id) => id !== placeId);
  } else {
    db.wishlists[req.user._id] = [...list, placeId];
  }
  await writeDb({ ...db });
  return res.json({
    wishlisted: !exists,
    wishlist: db.wishlists[req.user._id],
  });
});

app.delete("/api/wishlist/:placeId", requireAuth, async (req, res) => {
  const { placeId } = req.params;
  db.wishlists = db.wishlists || {};
  const list = db.wishlists[req.user._id] || [];
  db.wishlists[req.user._id] = list.filter((id) => id !== placeId);
  await writeDb({ ...db });
  return res.json({ success: true });
});

app.get("/api/user-places", requireAuth, (req, res) => {
  res.json(db.places.filter((place) => place.owner === req.user._id).map(publicPlace));
});

app.post("/api/places", requireAuth, async (req, res) => {
  const data = normalizePlaceInput(req.body || {});
  if (!data.title || !data.address) return sendError(res, 400, "Title and address are required");
  const place = { _id: crypto.randomUUID(), owner: req.user._id, ...data, createdAt: new Date().toISOString() };
  await writeDb({ ...db, places: [...db.places, place] });
  return res.status(201).json(publicPlace(place));
});

app.put("/api/places", requireAuth, async (req, res) => {
  const id = String(req.body?.id || "");
  const place = db.places.find((item) => item._id === id);
  if (!place) return sendError(res, 404, "Place not found");
  if (place.owner !== req.user._id) return sendError(res, 403, "You do not own this place");
  const data = normalizePlaceInput(req.body || {});
  if (!data.title || !data.address) return sendError(res, 400, "Title and address are required");
  const updated = { ...place, ...data, updatedAt: new Date().toISOString() };
  await writeDb({ ...db, places: db.places.map((item) => item._id === id ? updated : item) });
  return res.json(publicPlace(updated));
});

app.delete("/api/user-places/:placeId", requireAuth, async (req, res) => {
  const place = db.places.find((item) => item._id === req.params.placeId);
  if (!place) return sendError(res, 404, "Place not found");
  if (place.owner !== req.user._id) return sendError(res, 403, "You do not own this place");
  const nextPlaces = db.places.filter((item) => item._id !== place._id);
  const nextBookings = db.bookings.filter((booking) => booking.place !== place._id);
  await writeDb({ ...db, places: nextPlaces, bookings: nextBookings });
  return res.json({ success: true });
});

app.post("/api/bookings", requireAuth, async (req, res) => {
  try {
    const place = db.places.find((item) => item._id === req.body?.place);
    if (!place) return sendError(res, 404, "Place not found");
    const start = new Date(req.body?.checkIn);
    const end = new Date(req.body?.checkOut);
    const guests = Math.floor(toNumber(req.body?.numberOfGuests, 0));
    const name = String(req.body?.name || "").trim();
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return sendError(res, 400, "Check-out date must be after check-in date");
    if (guests < 1 || guests > place.maxGuests) return sendError(res, 400, `Maximum guests allowed: ${place.maxGuests}`);
    if (!name) return sendError(res, 400, "Guest name is required");
    const conflict = db.bookings.some((booking) => booking.place === place._id && overlaps(start, end, new Date(booking.checkIn), new Date(booking.checkOut)));
    if (conflict) return sendError(res, 409, "Property is not available for the selected dates");
    const priceDetails = calculateBookingPrice(place, start, end);
    const booking = {
      _id: crypto.randomUUID(),
      place: place._id,
      user: req.user._id,
      checkIn: start.toISOString(),
      checkOut: end.toISOString(),
      numberOfGuests: guests,
      name,
      nights: priceDetails.nights,
      price: priceDetails.total,
      subtotal: priceDetails.subtotal,
      tax: priceDetails.tax,
      serviceFee: priceDetails.serviceFee,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    await writeDb({ ...db, bookings: [...db.bookings, booking] });
    return res.status(201).json(publicBooking(booking));
  } catch (error) {
    console.error("Booking error:", error);
    return sendError(res, 500, "Unable to create booking");
  }
});

app.get("/api/bookings", requireAuth, (req, res) => {
  res.json(db.bookings.filter((booking) => booking.user === req.user._id).map(publicBooking));
});

app.get("/api/bookings/:id", requireAuth, (req, res) => {
  const booking = db.bookings.find((b) => b._id === req.params.id);
  if (!booking) return sendError(res, 404, "Booking not found");
  if (booking.user !== req.user._id) return sendError(res, 403, "Access denied");
  return res.json(publicBooking(booking));
});

app.delete("/api/bookings/:id", requireAuth, async (req, res) => {
  const booking = db.bookings.find((b) => b._id === req.params.id);
  if (!booking) return sendError(res, 404, "Booking not found");
  if (booking.user !== req.user._id) return sendError(res, 403, "Access denied");
  const nextBookings = db.bookings.filter((b) => b._id !== booking._id);
  await writeDb({ ...db, bookings: nextBookings });
  return res.json({ success: true, message: "Booking cancelled" });
});

app.post("/api/placesBooking", requireAuth, async (req, res) => {
  const bookingId = req.body?.bookingId || null;
  if (!bookingId) return sendError(res, 400, "Booking ID is required");

  const booking = db.bookings.find((b) => b._id === bookingId);
  if (!booking) return sendError(res, 404, "Booking not found");
  if (booking.user !== req.user._id) return sendError(res, 403, "Access denied to this booking");
  if (booking.paymentStatus === "paid") return sendError(res, 400, "This booking is already paid");

  const place = db.places.find((p) => p._id === booking.place);
  const priceDetails = place
    ? calculateBookingPrice(place, booking.checkIn, booking.checkOut)
    : { nights: 1, subtotal: booking.price, tax: 0, serviceFee: 0, total: booking.price };

  // Always use server-calculated total to prevent amount tampering
  const finalAmount = priceDetails.total;
  const amountPaise = Math.round(finalAmount * 100);

  const razorpayKey = process.env.PAYMENT_PROVIDER_KEY_ID || process.env.KEY_ID;
  const razorpaySecret = process.env.PAYMENT_PROVIDER_KEY_SECRET || process.env.KEY_SECRET;

  if (razorpayKey && razorpaySecret && !String(razorpayKey).startsWith("your_")) {
    try {
      const razorpay = new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecret });
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        notes: { bookingId: booking._id, userId: req.user._id },
      });
      return res.json({
        mode: "razorpay",
        order,
        key: razorpayKey,
        bookingId: booking._id,
        breakdown: priceDetails,
        supportedMethods: ["upi", "card", "netbanking", "wallet"],
      });
    } catch (error) {
      console.error("Razorpay order error:", error.message);
      return sendError(res, 502, "Failed to create payment order with Razorpay");
    }
  }

  // Interactive demo mode: returns simulated order with multi-method capabilities
  const demoOrderId = `order_demo_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
  return res.json({
    mode: "demo",
    key: "demo_key",
    order: {
      id: demoOrderId,
      amount: amountPaise,
      currency: "INR",
    },
    bookingId: booking._id,
    breakdown: priceDetails,
    supportedMethods: ["upi", "card", "netbanking", "wallet"],
  });
});

app.post("/api/verify", requireAuth, async (req, res) => {
  const { bookingId, method = "upi", methodDetails = {}, response = {} } = req.body || {};
  if (!bookingId) return sendError(res, 400, "Booking ID is required");

  const booking = db.bookings.find((b) => b._id === bookingId);
  if (!booking) return sendError(res, 404, "Booking not found");
  if (booking.user !== req.user._id) return sendError(res, 403, "Access denied");

  const razorpaySecret = process.env.PAYMENT_PROVIDER_KEY_SECRET || process.env.KEY_SECRET;

  if (response.demo || !razorpaySecret || String(razorpaySecret).startsWith("your_")) {
    const paymentId = response.razorpay_payment_id || `pay_demo_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
    const paymentRecord = {
      _id: crypto.randomUUID(),
      bookingId: booking._id,
      userId: req.user._id,
      provider: "placebooking-demo",
      orderId: response.razorpay_order_id || `order_demo_${Date.now()}`,
      paymentId,
      amount: booking.price,
      currency: "INR",
      method: String(method).toLowerCase(),
      methodDetails,
      status: "captured",
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    db.payments = db.payments || [];
    db.payments.push(paymentRecord);

    booking.paymentStatus = "paid";
    booking.paidAt = new Date().toISOString();
    booking.paymentId = paymentId;
    booking.paymentMethod = method;

    await writeDb({ ...db });
    return res.json({
      verified: true,
      demo: true,
      bookingId: booking._id,
      paymentId,
      message: "Payment verified and booking confirmed",
    });
  }

  if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
    return sendError(res, 400, "Missing payment signature verification parameters");
  }

  const body = `${response.razorpay_order_id}|${response.razorpay_payment_id}`;
  const expected = crypto.createHmac("sha256", razorpaySecret).update(body).digest("hex");
  if (expected !== response.razorpay_signature) {
    return sendError(res, 400, "Invalid payment signature");
  }

  const paymentRecord = {
    _id: crypto.randomUUID(),
    bookingId: booking._id,
    userId: req.user._id,
    provider: "razorpay",
    orderId: response.razorpay_order_id,
    paymentId: response.razorpay_payment_id,
    amount: booking.price,
    currency: "INR",
    method: String(method).toLowerCase(),
    methodDetails,
    status: "captured",
    signature: response.razorpay_signature,
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.payments = db.payments || [];
  db.payments.push(paymentRecord);

  booking.paymentStatus = "paid";
  booking.paidAt = new Date().toISOString();
  booking.paymentId = response.razorpay_payment_id;
  booking.paymentMethod = method;

  await writeDb({ ...db });
  return res.json({
    verified: true,
    bookingId: booking._id,
    paymentId: response.razorpay_payment_id,
    message: "Payment verified successfully",
  });
});

app.post("/api/payment/webhook", async (req, res) => {
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.PAYMENT_PROVIDER_KEY_SECRET || process.env.KEY_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (!webhookSecret || !signature) {
    return res.status(400).json({ error: "Webhook signature or secret missing" });
  }

  try {
    const rawBody = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(req.body);
    const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
    if (expected !== signature) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload?.payment?.entity;
      const orderEntity = payload?.order?.entity;
      const bookingId = paymentEntity?.notes?.bookingId || orderEntity?.notes?.bookingId;

      if (bookingId) {
        const booking = db.bookings.find((b) => b._id === bookingId);
        if (booking && booking.paymentStatus !== "paid") {
          booking.paymentStatus = "paid";
          booking.paidAt = new Date().toISOString();
          booking.paymentId = paymentEntity?.id || booking.paymentId;

          db.payments = db.payments || [];
          const existingPayment = db.payments.find((p) => p.paymentId === paymentEntity?.id);
          if (!existingPayment && paymentEntity) {
            db.payments.push({
              _id: crypto.randomUUID(),
              bookingId: booking._id,
              userId: booking.user,
              provider: "razorpay",
              orderId: paymentEntity.order_id,
              paymentId: paymentEntity.id,
              amount: paymentEntity.amount / 100,
              currency: paymentEntity.currency || "INR",
              method: paymentEntity.method || "unknown",
              status: "captured",
              verifiedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            });
          }
          await writeDb({ ...db });
        }
      }
    }
    return res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: "Webhook processing error" });
  }
});

app.get("/api/user-payments", requireAuth, (req, res) => {
  db.payments = db.payments || [];
  const userPayments = db.payments.filter((p) => p.userId === req.user._id);
  res.json(userPayments);
});

app.use((_req, res) => sendError(res, 404, "API route not found"));
app.use((error, _req, res, _next) => {
  console.error("Unhandled server error:", error);
  if (error.message === "CORS origin not allowed") return sendError(res, 403, error.message);
  if (error instanceof multer.MulterError) return sendError(res, 400, error.message);
  return sendError(res, 500, "Internal server error");
});

app.listen(PORT, () => {
  console.log("========================================");
  console.log(" PlaceBooking.com backend is running");
  console.log(` API:    http://localhost:${PORT}/api`);
  console.log(` Test:   http://localhost:${PORT}/api/test`);
  console.log(` Storage: ${isMongoConnected ? "MongoDB" : "Local JSON database"}`);
  console.log(` Images:  ${cloudinaryReady ? "Cloudinary" : "Local uploads"}`);
  console.log(` Payment: ${process.env.KEY_ID && !String(process.env.KEY_ID).startsWith("your_") ? "Razorpay" : "Demo mode"}`);
  console.log("========================================");
});
