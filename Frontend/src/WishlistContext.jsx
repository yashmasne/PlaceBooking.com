import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useToast } from "./ToastContext";

export const WishlistContext = createContext(null);

export function WishlistContextProvider({ children }) {
  const { user } = useContext(UserContext);
  const toast = useToast();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    axios
      .get("/user-wishlist-ids")
      .then(({ data }) => {
        setWishlistIds(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setWishlistIds([]);
      });
  }, [user]);

  async function toggleWishlist(placeId) {
    if (!user) return false;
    const wasWishlisted = wishlistIds.includes(placeId);

    // Optimistic UI update
    setWishlistIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );

    try {
      const { data } = await axios.post(`/wishlist/${placeId}`);
      if (data && Array.isArray(data.wishlist)) {
        setWishlistIds(data.wishlist);
      }
      if (wasWishlisted) toast.info("Removed from your wishlist.");
      else toast.success("Saved to your wishlist.");
      return true;
    } catch (err) {
      // Rollback on error
      setWishlistIds((prev) =>
        prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
      );
      toast.error(err.response?.data?.error || "Couldn't update your wishlist. Please try again.");
      return false;
    }
  }

  function isWishlisted(placeId) {
    return wishlistIds.includes(placeId);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
