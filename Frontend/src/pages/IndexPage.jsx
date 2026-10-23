import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import CategoriesNav from "../CategoriesNav";
import PlaceCard from "../PlaceCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import FeaturesSection from "./FeaturesSection.jsx";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [guestCount, setGuestCount] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, [selectedCategory]);

  async function fetchPlaces() {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      const { data } = await axios.get("/places", { params });
      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  }

  // Client-side instant filtering and sorting
  const filteredPlaces = useMemo(() => {
    let result = [...places];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        (place) =>
          (place.title || "").toLowerCase().includes(q) ||
          (place.address || "").toLowerCase().includes(q) ||
          (place.description || "").toLowerCase().includes(q) ||
          (place.category || "").toLowerCase().includes(q)
      );
    }

    if (guestCount) {
      const count = Number(guestCount);
      if (!Number.isNaN(count)) {
        result = result.filter((place) => (place.maxGuests || 1) >= count);
      }
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) {
        result = result.filter((place) => (place.price || 0) <= max);
      }
    }

    if (sortOrder === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [places, searchTerm, guestCount, maxPrice, sortOrder]);

  function clearAllFilters() {
    setSelectedCategory("All");
    setSearchTerm("");
    setGuestCount("");
    setMaxPrice("");
    setSortOrder("recommended");
  }

  const hasActiveFilters =
    selectedCategory !== "All" ||
    searchTerm.trim() !== "" ||
    guestCount !== "" ||
    maxPrice !== "" ||
    sortOrder !== "recommended";

  return (
    <div className="flex flex-col pb-16">
      {/* Category Navigation Bar */}
      <CategoriesNav
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Interactive Search & Filter Controls */}
      <div className="py-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-gray-100">
        <div className="relative grow max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            id="homepage-search-input"
            type="text"
            placeholder="Search destination, city, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <FiX className="text-sm" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-xs sm:text-sm font-medium py-2.5 px-3.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer shadow-sm"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <select
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="text-xs sm:text-sm font-medium py-2.5 px-3.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer shadow-sm"
          >
            <option value="">Guests: Any</option>
            <option value="1">1+ Guests</option>
            <option value="2">2+ Guests</option>
            <option value="4">4+ Guests</option>
            <option value="6">6+ Guests</option>
          </select>

          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="text-xs sm:text-sm font-medium py-2.5 px-3.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer shadow-sm"
          >
            <option value="">Max Price: Any</option>
            <option value="3000">Up to ₹3,000</option>
            <option value="5000">Up to ₹5,000</option>
            <option value="8000">Up to ₹8,000</option>
            <option value="12000">Up to ₹12,000</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-primary font-semibold hover:underline py-2 px-2 shrink-0 flex items-center gap-1"
            >
              <FiX /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="py-4 flex items-center justify-between text-xs sm:text-sm text-gray-500">
        <span>
          Showing <span className="font-semibold text-gray-900">{filteredPlaces.length}</span>{" "}
          {filteredPlaces.length === 1 ? "stay" : "stays"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </span>
      </div>

      {/* Property Cards Grid */}
      <div className="mt-2 grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex flex-col">
              <Skeleton className="aspect-[20/19] rounded-2xl mb-3" />
              <Skeleton width="60%" height={18} className="mb-1" />
              <Skeleton width="40%" height={14} className="mb-1" />
              <Skeleton width="30%" height={16} />
            </div>
          ))
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 my-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FiSearch className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">No properties match your search</h2>
            <p className="text-gray-500 max-w-md mx-auto mt-2 mb-6 text-sm">
              Try adjusting or clearing your filters to discover other available stays.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-block bg-primary text-white font-semibold py-2.5 px-6 rounded-full shadow hover:bg-opacity-95 transition-all text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Featured Guarantee & Highlights Section */}
      <div className="mt-20 border-t border-gray-100 pt-12">
        <FeaturesSection />
      </div>
    </div>
  );
}
