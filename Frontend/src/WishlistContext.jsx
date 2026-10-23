import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const WishlistContext = createContext(null);

export function WishlistContextProvider({ children }) {
  const { user } = useContext(UserContext);
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

    // Optimistic UI update
    setWishlistIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );

    try {
      const { data } = await axios.post(`/wishlist/${placeId}`);
      if (data && Array.isArray(data.wishlist)) {
        setWishlistIds(data.wishlist);
      }
      return true;
    } catch (err) {
      // Rollback on error
      setWishlistIds((prev) =>
        prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
      );
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
