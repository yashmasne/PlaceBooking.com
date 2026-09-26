import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPlaces() {
    try {
      const { data } = await axios.get("/user-places");
      setPlaces(data);
    } catch (error) {
      console.error("Unable to load places:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(placeId) {
    if (!window.confirm("Delete this place? This action cannot be undone.")) return;
    try {
      await axios.delete(`/user-places/${placeId}`);
      setPlaces((current) => current.filter((place) => place._id !== placeId));
    } catch (error) {
      alert(error.response?.data?.error || "Unable to delete place.");
    }
  }

  useEffect(() => {
    loadPlaces();
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to="/account/places/new">
          <span className="text-xl">+</span> Add new place
        </Link>
      </div>

      <div className="mt-10 min-h-72 bg-slate-100 rounded-xl p-4">
        {loading && <p className="text-center text-gray-500">Loading your places...</p>}
        {!loading && places.length === 0 && (
          <p className="text-center text-gray-500 py-12">You have not added any places yet.</p>
        )}

        {places.map((place) => (
          <div key={place._id} className="bg-white rounded-xl mb-4 overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-6 p-4">
              <div className="flex md:w-52 md:h-44 sm:w-64 h-44 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <PlaceImg place={place} />
              </div>
              <div className="grow pt-2">
                <h2 className="text-xl font-semibold">{place.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{place.address}</p>
                <p className="text-sm mt-3 line-clamp-3">{place.description}</p>
                <p className="font-semibold mt-3">₹ {place.price} / night</p>
              </div>
            </div>
            <div className="flex justify-end gap-6 border-t p-3">
              <Link aria-label="Edit place" to={`/account/places/${place._id}`}>
                <FiEdit3 size={24} />
              </Link>
              <button type="button" aria-label="Delete place"
                className="bg-transparent p-0" onClick={() => handleDelete(place._id)}>
                <MdDelete size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
