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

// PlaceBooking.com - local-first backend.
// Local demo mode stores data in Server/data/db.json and images in Server/uploads.
// MongoDB, Cloudinary and Razorpay remain optional integrations for deployment.

dotenv.config();

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
      _id: crypto.randomUUID(),
      owner: null,
      title: "Cozy Pune Apartment",
      address: "Koregaon Park, Pune, Maharashtra",
      photos: [],
      description: "A comfortable demo property for testing PlaceBooking locally.",
      perks: ["wifi", "parking", "tv"],
      extraInfo: "Demo listing. You can edit or delete it after registering.",
      checkIn: 14,
      checkOut: 11,
      maxGuests: 3,
      price: 1800,
      createdAt: new Date().toISOString(),
    },
    {
      _id: crypto.randomUUID(),
      owner: null,
      title: "Modern City Stay",
      address: "Viman Nagar, Pune, Maharashtra",
      photos: [],
      description: "Clean and modern accommodation close to restaurants and transport.",
      perks: ["wifi", "entrance", "tv"],
      extraInfo: "Demo listing for presentation and testing.",
      checkIn: 14,
      checkOut: 11,
      maxGuests: 4,
      price: 2200,
      createdAt: new Date().toISOString(),
    },
  ],
  bookings: [],
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
    return parsed;
  } catch {
    const initialDb = structuredClone(seedDb);
    await writeDb(initialDb);
    return initialDb;
  }
}

db = await readDb();

function publicUser(user) {
  if (!user) return null;
  return { _id: user._id, name: user.name, email: user.email };
}

function publicPlace(place) {
  return { ...place, owner: place.owner || null };
}

function publicBooking(booking) {
  const place = db.places.find((p) => p._id === booking.place);
  return {
    ...booking,
    place: place ? publicPlace(place) : null,
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
    photos: Array.isArray(body.addedPhotos) ? body.addedPhotos.filter(Boolean) : [],
    description: String(body.description || "").trim(),
    perks: Array.isArray(body.perks) ? body.perks.filter(Boolean) : [],
    extraInfo: String(body.extraInfo || "").trim(),
    checkIn: Math.min(23, Math.max(0, Math.floor(toNumber(body.checkIn, 14)))),
    checkOut: Math.min(23, Math.max(0, Math.floor(toNumber(body.checkOut, 11)))),
    maxGuests: Math.max(1, Math.floor(toNumber(body.maxGuests, 1))),
    price: Math.max(0, toNumber(body.price, 0)),
  };
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

const allowedOrigins = new Set([CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"]);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "3mb" }));
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
  return `${CLIENT_URL.replace(/:\d+$/, `:${PORT}`)}/uploads/${safeName}`;
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
  res.json({ status: "ok", message: "PlaceBooking API is running", mode: "local-file" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", database: "local-file", time: new Date().toISOString() });
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

app.get("/api/places", (_req, res) => res.json(db.places.map(publicPlace)));

app.get("/api/places/:id", (req, res) => {
  const place = db.places.find((item) => item._id === req.params.id);
  if (!place) return sendError(res, 404, "Place not found");
  return res.json(publicPlace(place));
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
    const nights = Math.max(1, Math.ceil((end - start) / 86400000));
    const booking = {
      _id: crypto.randomUUID(), place: place._id, user: req.user._id,
      checkIn: start.toISOString(), checkOut: end.toISOString(), numberOfGuests: guests,
      name, price: nights * place.price, paymentStatus: "pending", createdAt: new Date().toISOString(),
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

app.post("/api/placesBooking", requireAuth, async (req, res) => {
  const amount = toNumber(req.body?.amount, 0);
  if (amount <= 0) return sendError(res, 400, "Invalid payment amount");

  if (process.env.KEY_ID && process.env.KEY_SECRET && !String(process.env.KEY_ID).startsWith("your_")) {
    try {
      const razorpay = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET });
      const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: "INR" });
      return res.json({ mode: "razorpay", order, key: process.env.KEY_ID });
    } catch (error) {
      console.error("Razorpay error:", error.message);
      return sendError(res, 502, "Razorpay could not create the payment order");
    }
  }

  // Local demo mode: no payment provider or credentials required.
  return res.json({ mode: "demo", key: "demo", order: { id: `demo_${crypto.randomUUID()}`, amount: Math.round(amount * 100), currency: "INR" } });
});

app.post("/api/verify", requireAuth, async (req, res) => {
  const response = req.body?.response || {};
  if (response.demo) return res.json({ verified: true, demo: true });
  if (!process.env.KEY_SECRET) return sendError(res, 503, "Payment verification is not configured");
  if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) return sendError(res, 400, "Invalid payment response");
  const body = `${response.razorpay_order_id}|${response.razorpay_payment_id}`;
  const expected = crypto.createHmac("sha256", process.env.KEY_SECRET).update(body).digest("hex");
  if (expected !== response.razorpay_signature) return sendError(res, 400, "Signature invalid");
  return res.json({ verified: true });
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
  console.log(" Storage: Local JSON database");
  console.log(` Images:  ${cloudinaryReady ? "Cloudinary" : "Local uploads"}`);
  console.log(` Payment: ${process.env.KEY_ID && !String(process.env.KEY_ID).startsWith("your_") ? "Razorpay" : "Demo mode"}`);
  console.log("========================================");
});
