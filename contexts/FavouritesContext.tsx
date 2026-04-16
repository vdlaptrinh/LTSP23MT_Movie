import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { Movie } from "../data/movies";
import { useAuth } from "./AuthContext";

interface FavouritesContextType {
  favourites: Movie[];
  isFavourite: (id: number, imdbID?: string) => boolean;
  toggleFavourite: (movie: Movie) => void;
  isLoading: boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

function encodeEmail(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

function getStorageKey(email: string): string {
  return `favs_${encodeEmail(email)}`;
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastEmailRef = useRef<string | null>(null);

  useEffect(() => {
    const loadFavs = async () => {
      if (!user?.email) {
        setFavourites([]);
        setIsLoading(false);
        lastEmailRef.current = null;
        return;
      }

      const email = user.email;
      const encodedEmail = encodeEmail(email);
      
      if (encodedEmail === lastEmailRef.current) {
        return;
      }
      
      setIsLoading(true);
      lastEmailRef.current = encodedEmail;
      
      try {
        const stored = await SecureStore.getItemAsync(getStorageKey(email));
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavourites(parsed);
          } else {
            setFavourites([]);
          }
        } else {
          setFavourites([]);
        }
      } catch (e) {
        console.log("Error loading favourites:", e);
        setFavourites([]);
      }
      setIsLoading(false);
    };

    loadFavs();
  }, [user?.email]);

  useEffect(() => {
    const saveFavs = async () => {
      if (!user?.email || isLoading) return;
      
      const email = user.email;
      const encodedEmail = encodeEmail(email);
      
      if (encodedEmail !== lastEmailRef.current) return;
      
      try {
        await SecureStore.setItemAsync(getStorageKey(email), JSON.stringify(favourites));
      } catch (e) {
        console.log("Error saving favourites:", e);
      }
    };

    saveFavs();
  }, [favourites, user?.email, isLoading]);

  const isFavourite = (id: number, imdbID?: string) => {
    return favourites.some((m) =>
      imdbID && m.imdbID ? m.imdbID === imdbID : m.id === id
    );
  };

  const toggleFavourite = (movie: Movie) => {
    setFavourites((prev) => {
      const match = prev.some((m) =>
        movie.imdbID && m.imdbID
          ? m.imdbID === movie.imdbID
          : m.id === movie.id
      );
      return match
        ? prev.filter((m) =>
            movie.imdbID && m.imdbID
              ? m.imdbID !== movie.imdbID
              : m.id !== movie.id
          )
        : [...prev, movie];
    });
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, isFavourite, toggleFavourite, isLoading }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context)
    throw new Error("useFavourites must be used within FavouritesProvider");
  return context;
}
