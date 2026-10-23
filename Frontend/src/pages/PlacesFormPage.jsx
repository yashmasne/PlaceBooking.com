import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("City apartments");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState(14);
  const [checkOut, setCheckOut] = useState(11);
  const [maxGuests, setMaxGuests] = useState(2);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [price, setPrice] = useState(2000);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title || "");
      setAddress(data.address || "");
      setCategory(data.category || "City apartments");
      setAddedPhotos(data.photos || []);
      setDescription(data.description || "");
      setPerks(data.perks || []);
      setExtraInfo(data.extraInfo || "");
      setCheckIn(data.checkIn ?? 14);
      setCheckOut(data.checkOut ?? 11);
      setMaxGuests(data.maxGuests || 2);
      setBedrooms(data.bedrooms || 1);
      setBeds(data.beds || 1);
      setBathrooms(data.bathrooms || 1);
      setPrice(data.price || 2000);
    });
  }, [id]);

  function preInput(header, description) {
    return (
      <div className="mt-5 mb-1">
        <h2 className="text-xl font-bold text-gray-900">{header}</h2>
        <p className="text-gray-500 text-xs sm:text-sm">{description}</p>
      </div>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    setError("");

    if (!title.trim() || !address.trim()) {
      setError("Please provide a title and address for your property.");
      return;
    }

    if (Number(price) < 0) {
      setError("Price per night must be at least 0.");
      return;
    }

    const placeData = {
      title: title.trim(),
      address: address.trim(),
      category,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn: Number(checkIn),
      checkOut: Number(checkOut),
      maxGuests: Number(maxGuests),
      bedrooms: Number(bedrooms),
      beds: Number(beds),
      bathrooms: Number(bathrooms),
      price: Number(price),
    };

    setLoading(true);
    try {
      if (id) {
        await axios.put("/places", { id, ...placeData });
      } else {
        await axios.post("/places", placeData);
      }
      setRedirect(true);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to save property. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to="/account/places" />;
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AccountNav />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? "Edit Accommodation" : "List a New Accommodation"}
        </h1>
        <p className="text-sm text-gray-500">
          Share your space with travelers from around the world on PlaceBooking.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={savePlace} className="space-y-4">
        {preInput("Title", "Catchy headline for your place as shown in listings")}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="e.g. Modern Glasshouse Villa with Infinity Pool"
          required
        />

        {preInput("Address & Location", "Full address, city, state and landmarks")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="e.g. Koregaon Park, Pune, Maharashtra"
          required
        />

        {preInput("Property Category", "Select the discovery category that best describes your stay")}
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
          className="w-full border my-1 py-2.5 px-3 rounded-2xl bg-white text-sm font-medium text-gray-800"
        >
          <option value="Amazing views">Amazing views</option>
          <option value="Beachfront">Beachfront</option>
          <option value="Cabins">Cabins</option>
          <option value="Countryside">Countryside</option>
          <option value="Design stays">Design stays</option>
          <option value="Pools">Pools</option>
          <option value="Lakefront">Lakefront</option>
          <option value="City apartments">City apartments</option>
        </select>

        {preInput("Photos", "Add direct image URLs or upload local pictures")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "Detailed description of the rooms, surroundings, and atmosphere")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          placeholder="Tell guests what makes your place unique and what they will enjoy..."
        />

        {preInput("Perks & Amenities", "Select all amenities available to guests during their stay")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput("Extra info & House rules", "Check-in instructions, quiet hours, house policies")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
          placeholder="e.g. No smoking inside. Complimentary breakfast served from 8 to 10 AM."
        />

        {preInput("Room Capacity & Setup", "Number of guests and bed arrangements")}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Max Guests</label>
            <input
              type="number"
              min="1"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Bedrooms</label>
            <input
              type="number"
              min="1"
              value={bedrooms}
              onChange={(ev) => setBedrooms(ev.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Beds</label>
            <input
              type="number"
              min="1"
              value={beds}
              onChange={(ev) => setBeds(ev.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Bathrooms</label>
            <input
              type="number"
              min="1"
              value={bathrooms}
              onChange={(ev) => setBathrooms(ev.target.value)}
            />
          </div>
        </div>

        {preInput("Check-in / Check-out & Pricing", "Standard hours (24h format) and nightly rate in ₹ INR")}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Check-in hour (e.g. 14 for 2 PM)</label>
            <input
              type="number"
              min="0"
              max="23"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Checkout hour (e.g. 11 for 11 AM)</label>
            <input
              type="number"
              min="0"
              max="23"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Price per night (₹ INR)</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="primary my-6 py-3 font-semibold text-base shadow-md disabled:opacity-50"
        >
          {loading ? "Saving accommodation..." : "Save and publish property"}
        </button>
      </form>
    </div>
  );
}