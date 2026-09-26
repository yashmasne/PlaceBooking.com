import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    axios
      .get("/profile")
      .then(({ data }) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
