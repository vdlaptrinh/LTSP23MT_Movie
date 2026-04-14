import { createContext, useContext, useState, ReactNode } from "react";
import { Movie } from "../data/movies";

interface FavouritesContextType {
  favourites: Movie[];
  isFavourite: (id: number, imdbID?: string) => boolean;
  toggleFavourite: (movie: Movie) => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(
  undefined
);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<Movie[]>([]);

  const isFavourite = (id: number, imdbID?: string) =>
    favourites.some((m) =>
      imdbID && m.imdbID ? m.imdbID === imdbID : m.id === id
    );

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
      value={{ favourites, isFavourite, toggleFavourite }}
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